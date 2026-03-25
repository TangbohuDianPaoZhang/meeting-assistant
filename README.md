# Intelligent Meeting Assistant (MVP)

Next.js + TypeScript + Tailwind + shadcn/ui prototype for:
- real-time transcript ingestion
- rolling summary
- action item extraction
- sentiment highlight timeline

## Tech Stack
- Next.js App Router
- TypeScript
- Tailwind CSS + shadcn/ui
- OpenAI-compatible SDK (prepared in service layer)
- Tingwu adapter placeholder (prepared for websocket integration)

## Run Locally
1. Install dependencies

```bash
npm install
```

2. Configure environment

```bash
cp .env.example .env.local
```

3. Start dev server

```bash
npm run dev
```

4. Open browser

```text
http://localhost:3000
```

## Current API Endpoints
- `POST /api/meetings` create meeting
- `GET /api/meetings` list meetings
- `POST /api/meetings/:id/events` ingest transcript event
- `GET /api/meetings/:id/snapshot` get meeting snapshot

## Notes
- Current persistence is in-memory for MVP verification.
- LLM and Tingwu modules are scaffolded and can be wired in the next step.
