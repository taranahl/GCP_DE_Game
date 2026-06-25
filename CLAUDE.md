# CLAUDE.md — Project Guardrails

## Project Goal

Build a static, interactive learning website to help prepare for a GCP Data Engineering role.

The goal is NOT to memorize commands. The goal is to develop:
- Fluency in which GCP tools exist
- Judgment about when to use each tool vs when not to
- Understanding of how tools connect in real-world data pipelines
- Architecture thinking for data engineering problems

## Tech Stack

- **Framework**: Next.js with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Data**: Local TypeScript data files (no external APIs)
- **State/Progress**: localStorage (no database)
- **Rendering**: Static (no server-side code unless explicitly needed)

## What NOT to Build

- No backend server
- No authentication or login system
- No database (Supabase, Postgres, etc.)
- No external APIs (no OpenAI, no Google APIs yet)
- No complex state management libraries (Redux, Zustand — unless explicitly requested)
- No heavy animation libraries unless explicitly requested
- No payment system or user accounts

## Rules

### Rule 1: No backend unless explicitly asked
This is a static learning app. Do not add server routes, API routes with external services, or database connections unless the user explicitly requests it in a future phase.

### Rule 2: Static interactive learning app only
All data is hardcoded in TypeScript files. All state is in React state or localStorage. There is no "live" data.

### Rule 3: Do not overbuild
- One feature at a time
- Do not add features not mentioned in the current phase
- Do not add abstractions for hypothetical future requirements
- Three simple lines of code beat one clever abstraction

### Rule 4: Keep explanations beginner-friendly
- Explain terms in plain English first, then in GCP context
- Avoid assuming deep familiarity with cloud concepts
- Use analogies where helpful
- Every GCP tool should have a "what it is in one sentence" explanation

### Rule 5: Focus on GCP tool selection and architecture thinking
Content should always answer:
- What problem does this tool solve?
- When should I use it?
- When should I NOT use it?
- How does it fit into a data pipeline?
- What tool would I confuse it with, and why is this one different?

## Content Source

The primary content source is `GCP.pdf` in this project directory. Do not invent GCP facts not supported by this document or well-established GCP documentation.

## Phase Discipline

Each phase has a clear scope. Do not implement Phase 2 features during Phase 1. When in doubt, stop and ask.
