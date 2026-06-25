# SCENARIO_GAME_GUIDE.md — Scenario Game Design Guide

## Purpose

The Scenario Game teaches tool selection judgment through realistic data engineering situations. The goal is NOT trivia. The goal is building the mental model of: "Given this real problem, what GCP tool would I use and why?"

---

## Core Design Principles

### 1. Scenarios must be realistic

Each scenario should feel like something that would actually happen in a data engineering job. Use real business contexts:
- E-commerce companies
- Analytics teams
- Startups building data products
- Operations teams setting up monitoring

**Bad scenario (trivia-style):**
> "Which GCP service is Google's managed Apache Beam?"

**Good scenario (realistic):**
> "Your team is processing 50,000 click events per second from a mobile app. The data needs to be cleaned, deduplicated, and landed in BigQuery for real-time dashboards. Which tool do you choose?"

---

### 2. Focus on "which tool and why"

Every scenario has a correct answer, but the explanation of WHY is equally important. Players should learn from both correct and incorrect answers.

---

### 3. Multiple choice with 3-4 options

Each scenario has:
- 1 correct answer
- 2-3 plausible wrong answers (tools that are close but wrong for the specific situation)

Wrong answers should be tools a beginner might reasonably pick — not obviously wrong choices.

**Example wrong answers for a streaming scenario:**
- Dataproc (plausible if you confuse Dataflow/Dataproc)
- Data Fusion (visual ETL — not designed for high-throughput streaming)
- BigQuery scheduled queries (batch only — not real-time)

---

### 4. Include correct AND incorrect explanations

For every answer choice, show an explanation:
- **Correct:** "Yes — Dataflow is the right choice here because..."
- **Incorrect:** "No — Dataproc handles Spark workloads. It could technically do streaming with Spark Streaming, but Dataflow is Google's native managed streaming tool and the better fit here."

---

### 5. Avoid gotcha questions

Do not write questions where the distinction is an obscure implementation detail. The distinction should be meaningful to an architect or senior engineer.

**Bad:** "Which tool uses gRPC internally for pub/sub delivery?"
**Good:** "Your company needs to transfer data from AWS S3 into Cloud Storage on a nightly schedule. Which tool is the most direct fit?"

---

## Scenario Structure

```typescript
interface Scenario {
  id: string;
  title: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  context: string;             // Business context paragraph
  question: string;            // The actual question to answer
  options: ScenarioOption[];   // 3-4 choices
  hint?: string;               // Optional hint before the user answers
  tags: string[];              // Tool IDs covered in this scenario
}

interface ScenarioOption {
  id: string;
  tool: string;                // Tool name
  isCorrect: boolean;
  explanation: string;         // Why this is right or wrong
}
```

---

## Difficulty Levels

### Beginner
- One obvious correct tool
- The wrong answers are from clearly different categories
- Scenario is simple and single-step
- Focus: recognizing tool categories

**Example:** "You need to store raw CSV files cheaply before they are processed. Which tool?"
- Cloud Storage ✓
- BigQuery (wrong — not for raw file storage)
- Cloud Composer (wrong — this is orchestration, not storage)

---

### Intermediate
- The correct tool requires understanding nuance
- Wrong answers are in the same category as the correct answer
- Scenario has 2-3 requirements to consider
- Focus: distinguishing similar tools

**Example:** "Your analytics team writes SQL in BigQuery. You have 10 transformation steps with dependencies between them (table A must finish before table B can run). You want version control and testing. Which tool?"
- Dataform ✓ (SQL + dependency management + version control in BigQuery)
- BigQuery scheduled queries (wrong — no dependency management)
- Cloud Composer (wrong — overkill for pure SQL transformations inside BigQuery)
- Dataflow (wrong — this is for code-based, not SQL-based transformations)

---

### Advanced
- Multiple valid tools exist, but one is better for the specific constraints
- Constraints include: cost, team skills, latency, scale, compliance
- Wrong answers are defensible but suboptimal
- Focus: architectural trade-off reasoning

**Example:** "A team has 50 existing PySpark jobs on-prem. They are migrating to GCP. They want minimal code changes. Budget is a concern. Which processing tool?"
- Dataproc ✓ (lift-and-shift Spark, minimal code changes)
- Dataflow (wrong — requires rewriting from Spark to Apache Beam)
- Data Fusion (wrong — visual ETL, not compatible with existing Spark code)

---

## Scenario Categories

Cover scenarios from these areas (mapped to GCP.pdf):

### Storage Scenarios
- When to use Cloud Storage vs BigQuery
- When to use External Tables vs Native BigQuery Tables
- When to use BigLake

### Ingestion Scenarios
- Batch file loading (bq load / LOAD DATA)
- Scheduled SaaS data transfer (BigQuery Data Transfer Service)
- Streaming events (Pub/Sub → Dataflow)
- CDC from operational database (Datastream)
- File transfer between clouds (Storage Transfer Service)

### Processing Scenarios
- Streaming + transformation (Dataflow)
- Existing Spark team (Dataproc)
- Visual ETL / no code team (Data Fusion)
- SQL transformations with dependencies (Dataform)
- Simple recurring SQL (BigQuery scheduled queries)

### Orchestration Scenarios
- Complex DAG with many steps (Cloud Composer)
- Simple API chaining (Workflows)
- Cron trigger (Cloud Scheduler)

### Governance Scenarios
- PII detection and masking (Cloud DLP / Sensitive Data Protection)
- Fine-grained column access (Policy tags)
- Data catalog and lineage (Dataplex)

### Monitoring Scenarios
- Pipeline failure alert (Cloud Monitoring)
- Pipeline logs (Cloud Logging)

### Architecture Scenarios (Advanced)
- Full pipeline design: batch ETL
- Full pipeline design: streaming
- Full pipeline design: CDC + analytics
- Full pipeline: governance + security

---

## Game Mechanics (to implement in Phase 4)

### Scoring
- Correct on first try: 3 points
- Correct after viewing hint: 2 points
- Correct after wrong attempt: 1 point
- Wrong: 0 points, see explanation

### Progress
- Track completion per difficulty level
- Track which scenarios were answered correctly
- Show "mistake review" with scenarios answered wrong
- Store progress in localStorage

### Modes
- **Quick Mode:** 5 random scenarios, timed
- **Study Mode:** All scenarios, explanations always visible
- **Review Mode:** Only scenarios you got wrong before

### Simple Version (Phase 4)
- Show scenario
- Pick answer
- See explanation
- Track score in component state

### Production Version (Phase 6+)
- Persist progress to localStorage
- Show which tools you struggle with
- Recommend next study section based on weak areas
- Spaced repetition style repeat of missed scenarios

---

## Scenario Writing Checklist

Before adding any scenario:
- [ ] Context is a realistic business situation
- [ ] Question is about tool selection, not trivia
- [ ] Wrong answers are plausible, not obviously wrong
- [ ] Every option has an explanation (correct AND incorrect)
- [ ] The correct answer reasoning is clear without memorizing commands
- [ ] Beginner scenarios are truly beginner-friendly
- [ ] Advanced scenarios have genuine trade-offs
