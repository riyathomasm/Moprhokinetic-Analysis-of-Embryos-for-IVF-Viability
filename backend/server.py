from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import torch
import torchvision.transforms as transforms
import io
import uvicorn
import cv2
import numpy as np
import random

app = FastAPI()

# Load Static Model
model = torch.jit.load('efficientnet_embryo.pt', map_location='cpu')
model.eval()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173",    "https://moprhokinetic-analysis-of-embryos-for-iv.vercel.app"
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ML Transforms
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

PHASE_MAP = {
    0: 't2', 1: 't3', 2: 't4', 3: 't5',
    4: 't6', 5: 't7', 6: 't8', 7: 't9+',
    8: 'tB', 9: 'tEB', 10: 'tM',
    11: 'tPNa', 12: 'tPNf', 13: 'tSB'
}

# Biologically realistic phase timings (hours post-fertilization)
PHASE_TIMINGS = {
    'tPNa': {'start': 0,   'end': 5,   'desc': 'Pronuclei appearance'},
    'tPNf': {'start': 5,   'end': 10,  'desc': 'Pronuclei fading'},
    't2':   {'start': 25,  'end': 28,  'desc': '2-cell division'},
    't3':   {'start': 35,  'end': 38,  'desc': '3-cell stage'},
    't4':   {'start': 37,  'end': 40,  'desc': '4-cell division'},
    't5':   {'start': 48,  'end': 52,  'desc': '5-cell stage'},
    't6':   {'start': 50,  'end': 54,  'desc': '6-cell stage'},
    't7':   {'start': 52,  'end': 56,  'desc': '7-cell stage'},
    't8':   {'start': 54,  'end': 58,  'desc': '8-cell division'},
    't9+':  {'start': 58,  'end': 65,  'desc': '9+ cell compaction'},
    'tM':   {'start': 72,  'end': 80,  'desc': 'Morula stage'},
    'tSB':  {'start': 90,  'end': 96,  'desc': 'Early blastocyst'},
    'tB':   {'start': 96,  'end': 108, 'desc': 'Blastocyst'},
    'tEB':  {'start': 108, 'end': 120, 'desc': 'Expanded blastocyst'},
}

def get_morphological_features(image_bytes):
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_GRAYSCALE)
    if img is None:
        return [0, 0, 0, 0, 0]
    l_var = cv2.Laplacian(img, cv2.CV_64F).var()
    sharpness = np.clip((l_var / 1500) * 100, 0, 100)
    edges = cv2.Canny(img, 100, 200)
    edge_density = (np.sum(edges > 0) / edges.size) * 100
    complexity = np.clip(edge_density * 5, 0, 100)
    flipped = cv2.flip(img, 1)
    diff = cv2.absdiff(img, flipped)
    symmetry = np.clip(100 - (np.mean(diff) / 255 * 100 * 2), 0, 100)
    contrast = np.clip((np.std(img) / 64) * 100, 0, 100)
    sobelx = cv2.Sobel(img, cv2.CV_64F, 1, 0, ksize=5)
    sobely = cv2.Sobel(img, cv2.CV_64F, 0, 1, ksize=5)
    texture_val = np.mean(np.sqrt(sobelx**2 + sobely**2))
    texture = np.clip((texture_val / 500) * 100, 0, 100)
    return [
        round(float(sharpness), 1),
        round(float(complexity), 1),
        round(float(symmetry), 1),
        round(float(contrast), 1),
        round(float(texture), 1)
    ]

def simulate_phase_timeline(viable: bool):
    """
    Generates a realistic morphokinetic timeline.
    Viable embryos hit all phases on time.
    Non-viable embryos show delays or missing phases.
    ---
    SWAP THIS FUNCTION with real motion model inference
    once best_motion_model.pth is trained.
    """
    timeline = []
    phases_to_show = list(PHASE_TIMINGS.keys())

    for phase in phases_to_show:
        timing = PHASE_TIMINGS[phase]
        base_start = timing['start']
        base_end   = timing['end']

        if viable:
            # Small natural variation for viable embryos
            jitter = random.uniform(-1.5, 1.5)
            confidence = round(random.uniform(0.72, 0.97), 2)
            detected = True
        else:
            # Delays and missed phases for non-viable
            jitter = random.uniform(2, 8)
            confidence = round(random.uniform(0.35, 0.65), 2)
            # Some late phases might be missed entirely
            detected = random.random() > 0.25

        if detected:
            timeline.append({
                'phase':      phase,
                'start_hour': round(base_start + jitter, 1),
                'end_hour':   round(base_end   + jitter, 1),
                'confidence': confidence,
                'description': timing['desc'],
                'on_time':    viable
            })

    return timeline

def generate_verdict(viable: bool, timeline: list):
    detected_phases  = [t['phase'] for t in timeline]
    key_phases       = ['t2', 't4', 't8', 'tB', 'tEB']
    detected_key     = [p for p in key_phases if p in detected_phases]
    avg_conf         = round(sum(t['confidence'] for t in timeline) / len(timeline), 2) if timeline else 0

    if viable:
        suitability = 'HIGH'
        reasons = [
            f"All {len(detected_phases)} developmental phases detected",
            f"Key milestones confirmed: {', '.join(detected_key)}",
            f"Average phase confidence: {avg_conf * 100:.0f}%",
            "Developmental velocity within normal range",
            "Expanded blastocyst stage (tEB) reached successfully" if 'tEB' in detected_phases else "Blastocyst stage confirmed"
        ]
    else:
        missing = [p for p in key_phases if p not in detected_phases]
        suitability = 'LOW'
        reasons = [
            f"Only {len(detected_phases)}/14 developmental phases detected",
            f"Missing key milestones: {', '.join(missing) if missing else 'developmental delays noted'}",
            f"Average phase confidence: {avg_conf * 100:.0f}%",
            "Developmental velocity below optimal threshold",
            "Morphokinetic irregularities detected"
        ]

    return suitability, reasons


@app.post("/api/inference")
async def inference(image: UploadFile = File(...)):
    image_bytes = await image.read()
    img_pil = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    tensor = transform(img_pil).unsqueeze(0)

    with torch.no_grad():
        outputs = model(tensor)
        probs = torch.softmax(outputs[0], dim=0)
        confidence = probs.max().item() * 100
        class_id = probs.argmax().item()

    radar_values = get_morphological_features(image_bytes)

    return {
        'class_id':     int(class_id),
        'confidence':   round(confidence, 1),
        'probabilities': probs.tolist(),
        'radar_values': radar_values
    }


@app.post("/api/morph-audit")
async def morph_audit(image: UploadFile = File(...)):
    """
    Morphokinetic audit endpoint.
    Currently uses simulate_phase_timeline() as a placeholder.
    When motion model is trained:
      1. Load best_motion_model.pth
      2. Run sliding window inference on uploaded video/frames
      3. Replace simulate_phase_timeline() with real predictions
    """
    image_bytes = await image.read()
    img_pil = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    tensor = transform(img_pil).unsqueeze(0)

    # Use static model to determine viability for the simulation
    with torch.no_grad():
        outputs = model(tensor)
        probs = torch.softmax(outputs[0], dim=0)
        class_id = probs.argmax().item()
        confidence = probs.max().item() * 100

    viable   = class_id == 1
    timeline = simulate_phase_timeline(viable)
    suitability, reasons = generate_verdict(viable, timeline)

    return {
        'viable':      viable,
        'class_id':    int(class_id),
        'confidence':  round(confidence, 1),
        'timeline':    timeline,
        'suitability': suitability,
        'reasons':     reasons,
        'total_phases_detected': len(timeline),
        'note': 'Temporal data simulated — motion model training in progress'
    }


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)