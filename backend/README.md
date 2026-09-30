# SnapStudy AI Backend

Express backend for SnapStudy AI. It accepts study notes and uses the Gemini API to generate a structured study pack.

## Features

- `GET /api/health` — backend health check
- `POST /api/study-pack` — generates summary, key points, keywords, MCQs, and short questions
- Keeps the Gemini API key on the server instead of exposing it in React
- Uses structured JSON output so the frontend receives predictable data
- Configurable Gemini model through `GEMINI_MODEL`

## Requirements

- Node.js 18+ (Node 20+ recommended)
- Gemini API key

## Setup

From this folder:

```bash
npm install
```

Create `.env` from `.env.example` and set:

```env
GEMINI_API_KEY=your_real_key
GEMINI_MODEL=gemini-2.5-flash
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
```

Then start the server:

```bash
npm run dev
```

The API will run at `http://localhost:5000`.

## Test

Health check:

```text
http://localhost:5000/api/health
```

PowerShell example:

```powershell
Invoke-RestMethod -Method Post `
  -Uri http://localhost:5000/api/study-pack `
  -ContentType 'application/json' `
  -Body '{"notes":"Newton second law states that force is equal to mass times acceleration. The SI unit of force is newton."}'
```

## Frontend request

The React app should POST to:

```text
http://localhost:5000/api/study-pack
```

Body:

```json
{
  "notes": "Your study material here"
}
```

The response shape is:

```json
{
  "summary": "...",
  "points": ["..."],
  "keywords": ["..."],
  "mcqs": [
    {
      "q": "...",
      "options": ["A", "B", "C", "D"],
      "answer": 0
    }
  ],
  "shortQuestions": ["...", "...", "..."]
}
```

## Security

Never commit `.env` or expose `GEMINI_API_KEY` in the frontend. The key is read only by the backend.
