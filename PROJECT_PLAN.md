# PROJECT_PLAN.md — Phased Roadmap

## Overview

This is a static interactive GCP Data Engineering study app. It is designed to build architecture judgment, not memorize commands. Each phase adds one layer of learning capability.

---

## Phase 0 — Project Guardrails (Complete)

Create all foundational markdown files that define how this project should be built and what rules to follow.

**Files created:**
- CLAUDE.md
- PROJECT_PLAN.md
- CONTENT_GUIDE.md
- GLOSSARY_SCHEMA.md
- SCENARIO_GAME_GUIDE.md
- UX_GUARDRAILS.md
- COMPONENT_GUIDE.md
- TESTING_CHECKLIST.md

---

## Phase 1 — App Shell (Complete)

Build only the structural skeleton of the app. No real content yet.

**Deliverables:**
- Next.js App Router project initialized
- Navigation (sidebar or top nav)
- Home Dashboard page
- Placeholder pages for all sections
- Tailwind CSS configured
- TypeScript configured
- Basic responsive layout

**Pages created (placeholders):**
- `/` — Home Dashboard
- `/tool-map` — GCP Tool Map
- `/study-guide` — Study Guide
- `/glossary` — Glossary
- `/confusions` — Common Confusions
- `/scenario-game` — Scenario Game
- `/pipeline-builder` — Pipeline Builder
- `/decision-tree` — Decision Tree
- `/adk-agents` — ADK / Agent Platform
- `/console-map` — GCP Console Map
- `/mistake-review` — Mistake Review
- `/five-day-plan` — Five-Day Study Plan

---

## Phase 2 — GCP Tool Map (Planned)

Populate the Tool Map with real content from GCP.pdf.

**Planned features:**
- ToolCard component for each GCP service
- Grouped by category: Storage, Ingestion, Processing, Orchestration, Governance, AI
- Each card shows: what it is, when to use, when NOT to use, job logic quote
- Confusion pairs highlighted (e.g. Dataflow vs Dataproc)
- Static TypeScript data file: `data/tools.ts`

---

## Phase 3 — Glossary with Term Popups (Planned)

Build the glossary system with clickable term definitions.

**Planned features:**
- GlossaryPage with all terms listed
- TermLink component (inline clickable term)
- TermPopover component (Mac-dictionary-style popup on desktop)
- Bottom sheet on mobile
- Static data file: `data/glossary.ts`
- Terms sourced from GCP.pdf Phase 3

---

## Phase 4 — Scenario Game (Planned)

Interactive "which tool would you use?" game.

**Planned features:**
- ScenarioCard component
- Multiple choice with correct/incorrect explanations
- Score tracking (localStorage)
- Beginner / Intermediate / Advanced modes
- Static data file: `data/scenarios.ts`

---

## Phase 5 — Study Guide + Five-Day Plan (Planned)

Structured study content matching the timeline from GCP.pdf Phase 4.

**Planned features:**
- Day-by-day breakdown (Wed → Sun)
- Focus areas and outcomes per day
- Mini-build checklist per day
- Progress tracking via localStorage

---

## Phase 6 — Pipeline Builder (Planned)

Visual representation of GCP data pipelines.

**Planned features:**
- Pre-built pipeline architecture cards
- Each pipeline shows: source → ingestion → storage → processing → serving
- Use cases from GCP.pdf Phase 5 (e-commerce, restaurant, clickstream, CDC, governance)
- No interactive drag-and-drop yet — just visual architecture cards

---

## Phase 7 — Decision Tree (Planned)

Interactive tool selection decision tree.

**Planned features:**
- Start with a question: "What kind of data problem do you have?"
- Branch by: batch vs streaming, SQL vs code, etc.
- Arrive at a recommended tool with explanation
- Static TypeScript logic

---

## Phase 8 — Common Confusions (Planned)

Side-by-side comparison of easily confused tool pairs.

**Planned features:**
- ConfusionCard component
- Pairs: Dataflow vs Dataproc, Composer vs Workflows vs Scheduler, BigLake vs External Tables vs Native BQ, etc.
- "When to pick which" explanation

---

## Phase 9 — GCP Console Map (Planned)

Where to find each tool in the GCP console.

**Planned features:**
- ConsoleMapCard per tool
- Navigation path shown
- "What you see when you open it" description

---

## Phase 10 — Search + Dark Mode (Future)

**Intentionally postponed.** Add after core content is complete.

---

## MVP Features (Phases 0–3)

The minimum viable product is:
- Working navigation
- Tool Map with real content
- Glossary with clickable term popups
- Scenario Game with at least 10 scenarios

---

## Intentionally Postponed

- Authentication / user accounts
- Backend API
- Database
- AI-powered chat
- Multiplayer / social features
- Mobile app
- Server-side rendering for content
- Real-time GCP data
- Paid features

---

## Success Criteria

The app is successful when a user can:

1. Look at any GCP tool and immediately understand what problem it solves
2. See two similar tools and explain when to use each one
3. Read a scenario and pick the right tool with confidence
4. Trace a real-world business problem to a GCP architecture
5. Explain the data lifecycle: source → ingestion → storage → processing → serving → governance
