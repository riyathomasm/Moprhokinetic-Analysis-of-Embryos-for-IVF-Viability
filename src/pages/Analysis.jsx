import { useState } from "react";
import "./Analysis.css";

const calculateRadarPoints = (values) => {
  if (!values || values.length < 5) return "";
  const cx = 100, cy = 100, r = 70;
  const step = (Math.PI * 2) / 5;
  return values.map((val, i) => {
    const f = val / 100;
    const x = cx + r * f * Math.cos(i * step - Math.PI / 2);
    const y = cy + r * f * Math.sin(i * step - Math.PI / 2);
    return `${x},${y}`;
  }).join(" ");
};

const gridPoints = (level) => {
  const cx = 100, cy = 100, r = 70 * level;
  const step = (Math.PI * 2) / 5;
  return Array.from({ length: 5 }, (_, i) => {
    const x = cx + r * Math.cos(i * step - Math.PI / 2);
    const y = cy + r * Math.sin(i * step - Math.PI / 2);
    return `${x},${y}`;
  }).join(" ");
};

const AXIS_LABELS = [
  { label: "Sharpness", x: 100, y: 18 },
  { label: "Complexity", x: 188, y: 78 },
  { label: "Symmetry",  x: 158, y: 188 },
  { label: "Contrast",  x: 42,  y: 188 },
  { label: "Texture",   x: 12,  y: 78 },
];

function RadarChart({ values, viable }) {
  const color = viable ? "#16a34a" : "#dc2626";
  return (
    <svg viewBox="0 0 200 200" style={{ width: "100%", maxWidth: 200 }}>
      {[0.25, 0.5, 0.75, 1].map(l => (
        <polygon key={l} points={gridPoints(l)}
          fill="none" stroke="#e2e8f0" strokeWidth="1" />
      ))}
      {Array.from({ length: 5 }, (_, i) => {
        const step = (Math.PI * 2) / 5;
        const x = 100 + 70 * Math.cos(i * step - Math.PI / 2);
        const y = 100 + 70 * Math.sin(i * step - Math.PI / 2);
        return <line key={i} x1="100" y1="100" x2={x} y2={y} stroke="#e2e8f0" strokeWidth="1" />;
      })}
      <polygon points={calculateRadarPoints(values)}
        fill={`${color}26`} stroke={color} strokeWidth="2" />
      {AXIS_LABELS.map(({ label, x, y }) => (
        <text key={label} x={x} y={y} textAnchor="middle" dominantBaseline="central"
          fontSize="9" fill="#64748b" fontWeight="600">
          {label}
        </text>
      ))}
    </svg>
  );
}

function Analysis() {
  const [imageFile, setImageFile]   = useState(null);
  const [preview, setPreview]       = useState(null);
  const [isAnalyzing, setAnalyzing] = useState(false);
  const [results, setResults]       = useState(null);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
    setResults(null);
  };

  const runAnalysis = async () => {
    if (!imageFile) return;
    setAnalyzing(true);
    try {
      const form = new FormData();
      form.append("image", imageFile);
      const res = await fetch("http://localhost:8001/api/inference", {
        method: "POST", body: form
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setResults(await res.json());
    } catch (err) {
      alert(`Error: ${err.message}\nMake sure backend is running on port 8001`);
    } finally {
      setAnalyzing(false);
    }
  };

  const viable = results?.class_id === 1;
  const verdict = viable ? "Suitable for Transfer" : "Not Recommended";
  const verdictColor = viable ? "var(--green)" : "var(--red)";

  return (
    <div className="an-wrapper">
      <div className="an-header">
        <h1 className="an-title">Static Morphological Analysis</h1>
        <p className="an-subtitle">
          EfficientNet-B0 spatial classifier — upload a single embryo image for immediate viability assessment.
        </p>
      </div>

      <div className="an-grid">
        {/* LEFT */}
        <div className="an-col">

          {/* Upload */}
          <div className="an-card">
            <div className="an-card-label">Image Input</div>
            <label className="an-upload-area">
              <input type="file" accept="image/*" onChange={handleUpload} style={{ display: "none" }} />
              {preview
                ? <img src={preview} alt="Preview" className="an-preview-img" />
                : (
                  <div className="an-upload-placeholder">
                    <div className="an-upload-icon">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                    </div>
                    <p>Click to upload embryo image</p>
                    <span>JPEG, PNG supported</span>
                  </div>
                )
              }
            </label>
            {preview && !isAnalyzing && (
              <button className="an-run-btn" onClick={runAnalysis}>
                Run Analysis
              </button>
            )}
            {isAnalyzing && (
              <div className="an-loading">
                <div className="an-spinner" />
                Processing morphology...
              </div>
            )}
          </div>

          {/* Result */}
          <div className="an-card an-result-card">
            <div className="an-card-label">Classification Result</div>
            {results ? (
              <div className="an-result">
                <div className="an-result-class" style={{ color: verdictColor }}>
                  {viable ? "Viable" : "Non-Viable"}
                </div>
                <div className="an-result-conf">
                  Model confidence — <strong>{results.confidence}%</strong>
                </div>
                <div className="an-result-probs">
                  <div className="an-prob-row">
                    <span>Non-Viable</span>
                    <div className="an-prob-bar-wrap">
                      <div className="an-prob-bar an-prob-bar--red"
                        style={{ width: `${results.probabilities?.[0] * 100 || 0}%` }} />
                    </div>
                    <span>{((results.probabilities?.[0] || 0) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="an-prob-row">
                    <span>Viable</span>
                    <div className="an-prob-bar-wrap">
                      <div className="an-prob-bar an-prob-bar--green"
                        style={{ width: `${results.probabilities?.[1] * 100 || 0}%` }} />
                    </div>
                    <span>{((results.probabilities?.[1] || 0) * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="an-placeholder">Classification result appears here</div>
            )}
          </div>

          {/* IVF Verdict */}
          <div className="an-card an-verdict-card" style={{
            borderLeft: results ? `4px solid ${verdictColor}` : "4px solid var(--border)"
          }}>
            <div className="an-card-label">IVF Recommendation</div>
            {results ? (
              <div className="an-verdict" style={{ color: verdictColor }}>
                {verdict}
              </div>
            ) : (
              <div className="an-placeholder">Clinical verdict appears here</div>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="an-col">

          {/* Radar */}
          <div className="an-card an-radar-card">
            <div className="an-card-label">Morphological Signature</div>
            {results?.radar_values ? (
              <div className="an-radar-wrap">
                <RadarChart values={results.radar_values} viable={viable} />
                <div className="an-radar-scores">
                  {AXIS_LABELS.map(({ label }, i) => (
                    <div className="an-score-item" key={label}>
                      <span>{label}</span>
                      <span className="an-score-val">{results.radar_values[i]}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="an-placeholder an-placeholder--tall">
                Morphological radar chart appears after analysis
              </div>
            )}
          </div>

          {/* GradCAM */}
          <div className="an-card an-gradcam-card">
            <div className="an-card-label">Grad-CAM Activation Map</div>
            {results && preview ? (
              <div className="an-gradcam-wrap">
                <img src={preview} alt="Grad-CAM" className="an-gradcam-img" />
                <div className="an-gradcam-overlay" />
                <div className="an-gradcam-note">
                  Attention regions highlighted — areas influencing the classification decision
                </div>
              </div>
            ) : (
              <div className="an-placeholder an-placeholder--tall">
                Activation map appears after analysis
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analysis;