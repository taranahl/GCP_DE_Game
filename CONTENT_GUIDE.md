# CONTENT_GUIDE.md — Content Rules and Standards

## Primary Source

The main content source for this app is `GCP.pdf` in this project directory. All GCP tool descriptions, job logic quotes, use cases, and terminology should be derived from this document first.

Secondary sources may be well-established Google Cloud official documentation. When using secondary sources, note where the information came from.

---

## Writing Style Rules

### Rule 1: Plain English First

Always explain a concept in plain English before explaining it in GCP context.

**Example (bad):**
> Dataflow is a managed Apache Beam service for batch and streaming pipelines.

**Example (good):**
> Dataflow is Google's tool for moving and transforming large amounts of data — either on a schedule (batch) or as it arrives in real time (streaming). Under the hood, it runs Apache Beam jobs, but you don't need to think about that at first. Think of it as: "Dataflow is the heavy-duty data processing engine."

---

### Rule 2: When to Use / When NOT to Use

Every tool explanation must include both sides. Knowing when NOT to use something is as valuable as knowing when to use it.

**Format:**
```
Use [Tool] when:
- [scenario 1]
- [scenario 2]

Do NOT use [Tool] when:
- [scenario 1]
- [scenario 2]
```

---

### Rule 3: Job Logic Quotes

GCP.pdf includes "job logic" quotes — short memorable rules for each tool. Preserve these. They are some of the most useful content.

**Examples from GCP.pdf:**
- "Pub/Sub is the front door for streaming/event-driven data."
- "Composer does not do the heavy processing itself. It schedules and coordinates the tools that do."
- "If the data is sensitive, I need access controls at table, row, column, or policy-tag level."

These quotes belong in the ToolCard components and ConfusionCards.

---

### Rule 4: Do Not Remove Important Concepts

Even if a concept seems advanced (e.g., idempotency, data lineage, federated queries), do not remove it. Simplify the explanation — do not omit the concept.

---

### Rule 5: Do Not Invent GCP Facts

Do not add GCP features, tools, or capabilities that are not in GCP.pdf or well-documented GCP official docs. If unsure, mark the claim with: `⚠️ Needs verification`.

---

### Rule 6: Explain Terms Before Using Them

If a section uses a term (like "CDC" or "idempotency"), make sure that term is either:
1. Already defined in the Glossary
2. Explained inline with a brief plain-English definition
3. Linked via a TermLink component

---

### Rule 7: Use Analogies

Analogies help beginners build mental models. Use them where helpful.

**Examples:**
- Cloud Storage is like a filing cabinet — it stores files cheaply but isn't designed for fast SQL queries.
- BigQuery is like a high-powered analytics engine — great at SQL over huge tables, not for individual row lookups.
- Pub/Sub is like a mailbox — messages go in, subscribers pick them up.
- Composer is like a traffic controller — it doesn't move cargo itself, it coordinates which trucks go where and when.

---

### Rule 8: Consistent Terminology

Use these terms consistently:

| Use this | Not this |
|---|---|
| GCP tool | service, product (when talking about tools in the context of the guide) |
| data pipeline | ETL pipeline, data flow (unless specifically referring to the Dataflow tool) |
| tool card | service card |
| when to use | use case, scenario (for ToolCard "when to use" section) |
| job logic | rule, tip (for the job logic quote field) |

---

## Content Categories

Content in this app is organized into these categories (matching GCP.pdf structure):

1. **Storage and warehouse** — Cloud Storage, BigQuery, BigLake, External Tables
2. **Ingestion** — bq load, LOAD DATA, BigQuery Data Transfer Service, Pub/Sub, Datastream, Storage Transfer Service
3. **Processing and transformation** — Dataflow, Dataproc, Data Fusion, Dataform, BigQuery scheduled queries
4. **Orchestration** — Cloud Composer, Workflows, Cloud Scheduler
5. **Serving, BI, and ML** — Looker, Looker Studio, Vertex AI, BigQuery ML
6. **Governance, security, and metadata** — Dataplex, Knowledge Catalog, IAM, Policy Tags, Cloud DLP / Sensitive Data Protection
7. **Monitoring and reliability** — Cloud Logging, Cloud Monitoring, Error Reporting, Trace
8. **AI agents and automation** — Google ADK, Agent Platform, Agent Studio, Agent Garden, Model Garden

---

## Common Confusion Pairs to Cover

These are tool pairs that are frequently confused. Each pair needs a dedicated explanation:

- **Dataflow vs Dataproc** — managed Beam vs managed Spark
- **Composer vs Workflows vs Cloud Scheduler** — full DAG orchestration vs API chaining vs cron trigger
- **BigLake vs External Tables vs Native BigQuery Tables** — governed lakehouse vs unmanaged external query vs full warehouse storage
- **ETL vs ELT** — transform before load vs transform after load
- **BigQuery ML vs Vertex AI** — SQL-based ML vs full ML platform
- **Dataplex vs Cloud DLP** — governance/catalog vs PII detection/masking
- **Pub/Sub vs Datastream** — event ingestion vs CDC replication

---

## Content Checklist Before Publishing Any Page

- [ ] Every GCP tool has a one-sentence plain-English description
- [ ] Every tool has a "when to use" list
- [ ] Every tool has a "when NOT to use" list
- [ ] Every tool has a job logic quote
- [ ] Confused pairs are explicitly called out
- [ ] Terms are defined before being used
- [ ] No unsupported GCP facts (or ⚠️ marked)
- [ ] Writing is beginner-friendly
