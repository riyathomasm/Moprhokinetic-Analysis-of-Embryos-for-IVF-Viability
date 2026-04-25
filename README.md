# Morphokinetic Analysis of Embryos for IVF Viability

A multi-stage spatio-temporal AI system that bridges static morphological grading and morphokinetic time-lapse analysis for embryo viability assessment in assisted reproductive technology.

## Live Demo

[https://moprhokinetic-analysis-of-embryos-f.vercel.app](https://moprhokinetic-analysis-of-embryos-f.vercel.app)

## Models

| Model | Architecture | Task |
|-------|-------------|------|
| Spatial | EfficientNet-B0 | Binary viability classification from static images |
| Temporal | EfficientNet-B0 + GRU | 14-phase morphokinetic classification from time-lapse sequences |

## Features

- Static morphological analysis with radar chart and Grad-CAM visualization
- 14-phase developmental timeline audit (tPNa → tEB)
- IVF suitability verdict with confidence scores
- Professional clinical-grade UI

## Stack

- **Frontend** — React + Vite, deployed on Vercel
- **Backend** — FastAPI + PyTorch, deployed on Render
- **Models** — EfficientNet-B0 (spatial), EfficientNet-B0 + GRU (temporal)

## Dataset

- **Spatial model** — HVWC 2023 World Championship Embryo Classification Dataset
- **Temporal model** — Gomez et al. 2022 Human Embryo Time-Lapse Video Dataset (704 embryos, Zenodo DOI: 10.5281/zenodo.6390798)

## Institution

SRM Institute of Science and Technology — Dept. of Computing Technologies, Kattankalathur, Chennai