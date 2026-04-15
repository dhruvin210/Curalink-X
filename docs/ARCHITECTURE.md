# Curalink X Architecture

## Multi-agent pipeline

1. Query Understanding Agent
   - Normalizes structured and natural language input
   - Infers disease, age, gender, location, and treatment hints
2. Query Expansion Agent
   - Expands the search into disease-aware boolean expressions
   - Produces separate query variants for PubMed, OpenAlex, and ClinicalTrials.gov
3. Research Retrieval Agent
   - Retrieves publication evidence from PubMed and OpenAlex
   - Uses Mongo-backed cache entries to avoid redundant upstream calls
4. Clinical Trial Agent
   - Retrieves matching studies from ClinicalTrials.gov
5. Ranking Engine
   - Scores publications with:
     - `0.45 * semantic_similarity`
     - `0.25 * recency`
     - `0.30 * source_score`
6. Risk Analysis Agent
   - Runs benefit and risk signal extraction for a treatment or supplement
   - Produces a confidence score and evidence strength
7. Reasoning LLM Agent
   - Sends top-ranked evidence to OpenAI Responses API
   - Requests strict JSON output only
8. Response Structuring Agent
   - Normalizes output for the UI and API contract

## Memory model

- `Session`
  - Stores session context
  - Stores user and assistant turns
  - Supports follow-up context reuse
- `CacheEntry`
  - Stores retrieval payloads with TTL expiration

## Frontend experience

- Sidebar with stored investigation threads
- Intake composer for natural language plus structured metadata
- Conversation trace for context memory
- Publication cards with credibility and evidence badges
- Clinical trial cards
- Risk simulation panel for what-if analysis

## Production guidance

- Put MongoDB behind a managed instance with backups and monitoring.
- Use a managed OpenAI API key and rotate it with your normal secret-management flow.
- Add API authentication and per-user data partitioning before multi-user deployment.
- Add request tracing and analytics around upstream API failures.
- Add background cache warmers for priority disease areas if traffic grows.
