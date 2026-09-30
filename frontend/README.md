# SnapStudy AI – Intelligent Study Notes & Quiz Generator

SnapStudy AI is a student-focused AI study assistant prototype. It transforms study material into concise revision content such as summaries, key points, keywords, and practice MCQs.

## Problem
Students often spend significant time reading long notes and manually preparing revision material.

## Solution
SnapStudy AI provides a simple workflow: enter study notes → process with an AI layer → receive a structured study pack.

## Current Prototype
The included frontend demonstrates the complete user experience with a local prototype generation layer so the app can be tested without API keys.

> For the competition build, replace the local prototype generator with the selected on-device AI inference layer and document the Snapdragon device/model used.

## Features
- Study note input
- Summary generation
- Key point extraction
- Keyword extraction
- MCQ generation
- Responsive student-friendly UI

## Tech Stack
- React
- Vite
- CSS
- AI inference layer (competition integration target)

## Run locally
```bash
cd frontend
npm install
npm run dev
```

Open the local URL shown by Vite.

## Planned Snapdragon / Edge AI Integration
The project is designed with a replaceable AI layer. The final challenge version can connect the generation functions to a Qualcomm/Snapdragon-compatible on-device model so study content can be processed locally where supported.

## Suggested repository evidence
Add screenshots, a short demo video/GIF, device/model details, benchmark observations, and the exact AI model/runtime used in the final version.

## License
MIT License. See `LICENSE`.
