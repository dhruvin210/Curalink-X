# Curalink X

Curalink X is a production-oriented MERN application for evidence-grounded medical research, clinical trial discovery, and intervention risk simulation. It is designed as a multi-agent research system rather than a generic chatbot.

## What it does

- Accepts both structured inputs and natural language prompts
- Expands queries before retrieval
- Pulls upstream evidence from PubMed, OpenAlex, and ClinicalTrials.gov
- Reranks publications with relevance, recency, and source credibility
- Uses an OpenAI reasoning model through the Responses API
- Stores session memory, chat history, and research context in MongoDB
- Supports what-if risk analysis for treatments and supplements

## Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- LLM: OpenAI model via the Responses API

## Project structure

- [backend](C:\Users\dhruv\Documents\New project\backend)
- [frontend](C:\Users\dhruv\Documents\New project\frontend)
- [docs/ARCHITECTURE.md](C:\Users\dhruv\Documents\New project\docs\ARCHITECTURE.md)

## Local setup

1. Install dependencies:
   - `npm run install:all`
2. Copy `backend/.env.example` to `backend/.env` and update values as needed.
3. Start MongoDB locally or point `MONGODB_URI` to your cluster.
4. Add your OpenAI API key and model in `backend/.env`:
   - `OPENAI_API_KEY=your_key_here`
   - `OPENAI_MODEL=gpt-5.1`
5. Run the backend:
   - `npm run dev:backend`
6. Run the frontend:
   - `npm run dev:frontend`

## Docker setup

1. Start the stack:
   - `docker compose up --build`
2. Open the app:
   - `http://localhost:8080`
3. API will be available at:
   - `http://localhost:5000/api`

Note:
- The Docker stack starts MongoDB, backend, and frontend.
- Before `docker compose up --build`, set `OPENAI_API_KEY` in your shell or `.env` file.

## API overview

- `POST /api/research/query`
- `GET /api/research/sessions`
- `GET /api/research/session/:sessionId`
- `GET /api/health`

## Example query payload

```json
{
  "disease": "Parkinson's disease",
  "query": "deep brain stimulation",
  "location": "Mumbai",
  "age": 58,
  "gender": "male",
  "whatIf": "creatine supplementation"
}
```

## Notes

- PubMed retrieval uses `esearch` plus `efetch`.
- OpenAlex retrieval reconstructs abstracts from the inverted index response.
- ClinicalTrials.gov retrieval targets the v2 studies API.
- The backend includes a deterministic fallback summary if OpenAI credentials are missing or the model call fails.
- The UI includes explicit what-if analysis, evidence-strength indicators, credibility badges, and pipeline telemetry.
