# Morphokinetic Analysis of Embryos for IVF Viability

A multi-stage spatio-temporal AI system that bridges static morphological grading and morphokinetic time-lapse analysis for embryo viability assessment in assisted reproductive technology.


## Features

- Static morphological analysis with radar chart and Grad-CAM visualization
- 14-phase developmental timeline audit (tPNa → tEB)
- IVF suitability verdict with confidence scores
- Professional clinical-grade UI

## Stack

- **Frontend** — React + Vite, deployed on Vercel
- **Backend** — FastAPI + PyTorch, deployed on Render
- **Models** — EfficientNet-B0 (spatial), EfficientNet-B0 + GRU (temporal)
