# Morphokinetic Analysis of Embryos for IVF Viability

A multi-stage spatio-temporal AI system designed to bridge the gap between static morphological grading and morphokinetic time-lapse analysis in assisted reproductive technology.

## Models
- **Spatial Model**: EfficientNet-B0 — binary viability classification from static embryo images
- **Temporal Model**: EfficientNet-B0 + GRU — 14-phase morphokinetic classification from time-lapse sequences

## Stack
- Frontend: React + Vite
- Backend: FastAPI + PyTorch

## Setup
```bash
# Backend
pip install -r requirements.txt
python server.py

# Frontend
npm install
npm run dev
```