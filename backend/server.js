import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 5000);
const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'SnapStudy AI Backend',
    model: MODEL
  });
});

const studySchema = {
  type: 'object',
  properties: {
    summary: { type: 'string' },
    points: {
      type: 'array',
      items: { type: 'string' }
    },
    keywords: {
      type: 'array',
      items: { type: 'string' }
    },
    mcqs: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          q: { type: 'string' },
          options: {
            type: 'array',
            items: { type: 'string' }
          },
          answer: { type: 'integer' }
        },
        required: ['q', 'options', 'answer']
      }
    },
    shortQuestions: {
      type: 'array',
      items: { type: 'string' }
    }
  },
  required: ['summary', 'points', 'keywords', 'mcqs', 'shortQuestions']
};

function buildPrompt(notes) {
  return `You are SnapStudy AI, a study assistant for engineering and college students.

Analyze the study material below and create an accurate revision pack.
Do not add facts that are not supported by the material. Keep technical terms, formulas,
units, definitions, and relationships accurate.

Return ONLY valid JSON matching the requested schema.

Requirements:
- summary: 2-4 concise sentences.
- points: 4-7 important revision points.
- keywords: 5-10 important terms, no duplicates.
- mcqs: exactly 5 questions. Each must have exactly 4 options. The answer field is a zero-based index (0-3) of the correct option.
- shortQuestions: exactly 3 useful short-answer questions based only on the material.

STUDY MATERIAL:
${notes}`;
}

app.post('/api/study-pack', async (req, res) => {
  try {
    const notes = typeof req.body?.notes === 'string' ? req.body.notes.trim() : '';

    if (!notes) {
      return res.status(400).json({ error: 'Study notes are required.' });
    }

    if (notes.length < 20) {
      return res.status(400).json({ error: 'Please provide at least 20 characters of study material.' });
    }

    if (notes.length > 50000) {
      return res.status(413).json({ error: 'Study material is too long. Please keep it under 50,000 characters.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_api_key_here') {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured. Add it to backend/.env.'
      });
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(MODEL)}:generateContent`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: buildPrompt(notes) }]
          }
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: studySchema,
          temperature: 0.2
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      const message = data?.error?.message || 'Gemini API request failed.';
      return res.status(response.status >= 400 && response.status < 500 ? response.status : 502).json({
        error: message
      });
    }

    const text = data?.candidates?.[0]?.content?.parts
      ?.map(part => part.text || '')
      .join('')
      .trim();

    if (!text) {
      return res.status(502).json({ error: 'The AI returned an empty response.' });
    }

    let studyPack;
    try {
      studyPack = JSON.parse(text);
    } catch {
      return res.status(502).json({ error: 'The AI returned invalid JSON.' });
    }

    return res.json(studyPack);
  } catch (error) {
    console.error('Study pack error:', error);
    return res.status(500).json({ error: 'Unexpected server error.' });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

app.listen(PORT, () => {
  console.log(`SnapStudy AI backend running on http://localhost:${PORT}`);
});
