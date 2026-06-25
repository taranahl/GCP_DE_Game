# GLOSSARY_SCHEMA.md — Glossary Term Structure

## Overview

Each glossary term is defined using a consistent schema. This schema is used to populate the `data/glossary.ts` TypeScript data file and drives the Glossary page and TermPopover components.

---

## TypeScript Schema

```typescript
interface GlossaryTerm {
  id: string;                    // kebab-case unique identifier, e.g. "change-data-capture"
  term: string;                  // Display name, e.g. "Change Data Capture"
  aliases: string[];             // Other names for this term, e.g. ["CDC"]
  category: TermCategory;        // See categories below
  generalDefinition: string;     // Plain English definition — no GCP jargon
  gcpDefinition: string;         // How this term applies specifically in GCP
  whenToUse: string[];           // Bullet list of when to apply this concept
  whenNotToUse: string[];        // Bullet list of when NOT to apply this concept
  example: string;               // Concrete one-sentence example
  relatedTerms: string[];        // Array of other term IDs
  memoryShortcut: string;        // One short mnemonic or mental model
  commonConfusion: string;       // What people mix this up with and why
  gcpConsoleLocation?: string;   // Where to find it in the GCP console (optional)
}

type TermCategory =
  | "storage"
  | "ingestion"
  | "processing"
  | "orchestration"
  | "governance"
  | "monitoring"
  | "ml-ai"
  | "concept"        // for general data engineering concepts (ETL, CDC, etc.)
  | "security"
  | "agents";
```

---

## Field Descriptions

### `id`
Unique, URL-safe identifier. Use kebab-case. Must match the key used in `relatedTerms` arrays.

**Examples:** `"bigquery"`, `"change-data-capture"`, `"data-lake"`, `"idempotency"`

---

### `term`
The primary display name of the term. Use the most commonly used name.

**Examples:** `"BigQuery"`, `"Change Data Capture"`, `"Data Lake"`, `"Idempotency"`

---

### `aliases`
Alternative names or abbreviations. These should be searchable.

**Examples:**
- `"Change Data Capture"` → aliases: `["CDC"]`
- `"Cloud Composer"` → aliases: `["Composer", "Apache Airflow managed"]`
- `"Sensitive Data Protection"` → aliases: `["Cloud DLP", "DLP"]`

---

### `category`
One of the defined TermCategory values. Used for filtering in the Glossary page.

---

### `generalDefinition`
A plain English definition that assumes no cloud knowledge. Should be 1-3 sentences. Avoid GCP-specific terms here.

**Example for "Partitioning":**
> Partitioning means splitting a large table into smaller, organized chunks based on a specific column — usually a date. When you query the table, you only scan the relevant chunk instead of the entire table, which is much faster and cheaper.

---

### `gcpDefinition`
How this concept applies in the GCP context. Can reference specific tools.

**Example for "Partitioning":**
> In BigQuery, you can partition a table by date/time (e.g., `order_date`) or by integer range. Queries that filter on the partition column only scan matching partitions, reducing both query cost and time.

---

### `whenToUse`
A short bullet list of situations where this concept/tool applies.

---

### `whenNotToUse`
A short bullet list of situations where you should avoid this concept/tool or prefer something else.

---

### `example`
A single concrete sentence showing the concept in action.

**Example for "CDC":**
> A PostgreSQL orders table changes every second → Datastream captures each insert/update/delete → BigQuery gets near-real-time analytics data without manual exports.

---

### `relatedTerms`
Array of `id` strings for related glossary terms. Used to show "See also" links in the TermPopover.

---

### `memoryShortcut`
A one-line mental model or mnemonic to help remember the term.

**Examples:**
- Pub/Sub: `"Pub/Sub is the mailbox — data goes in, subscribers pick it up."`
- Dataflow: `"Dataflow is the heavy-duty processor — batch or streaming, scalable."`
- Composer: `"Composer is the traffic controller — it doesn't move data, it tells other tools when to move it."`

---

### `commonConfusion`
What people frequently confuse this term with, and the key distinction.

**Example for "Dataflow":**
> Often confused with Dataproc. Dataflow is Google's tool (Apache Beam). Dataproc is for teams already using Spark/Hadoop. Use Dataflow unless the team already has Spark code.

---

### `gcpConsoleLocation`
Where to navigate in the GCP console to find this service. Optional — leave undefined for pure concepts.

**Example for "BigQuery":**
> `"GCP Console → BigQuery → SQL Workspace"`

**Example for "Pub/Sub":**
> `"GCP Console → Pub/Sub → Topics"`

---

## Example Term Entry

```typescript
const exampleTerm: GlossaryTerm = {
  id: "change-data-capture",
  term: "Change Data Capture",
  aliases: ["CDC"],
  category: "concept",
  generalDefinition:
    "Change Data Capture (CDC) means continuously watching a database and recording every insert, update, and delete as it happens — instead of periodically exporting the whole table.",
  gcpDefinition:
    "In GCP, Datastream is the primary CDC tool. It connects to operational databases (PostgreSQL, MySQL, Oracle) and streams every change into Cloud Storage or BigQuery.",
  whenToUse: [
    "You need near-real-time analytics without manual exports",
    "The source is an operational database (MySQL, PostgreSQL)",
    "You want to avoid full-table exports which are slow and expensive",
  ],
  whenNotToUse: [
    "The source system does not support CDC (some older databases do not)",
    "You only need a one-time historical load (use bq load instead)",
    "Data changes very infrequently (scheduled exports may be simpler)",
  ],
  example:
    "A PostgreSQL orders table → Datastream CDC → BigQuery, giving analysts near-real-time order data without nightly bulk exports.",
  relatedTerms: ["datastream", "bigquery", "dataflow", "etl", "elt"],
  memoryShortcut:
    "CDC = 'live tap on the database' — every change flows out as it happens.",
  commonConfusion:
    "Sometimes confused with Pub/Sub. Pub/Sub is for application events (clicks, orders sent from your app). CDC is for database-level changes (SQL inserts/updates/deletes).",
  gcpConsoleLocation: "GCP Console → Datastream → Streams",
};
```

---

## Terms to Define (sourced from GCP.pdf)

### Concepts
- Ingestion
- Batch ingestion
- Streaming ingestion
- ETL
- ELT
- Data lake
- Data warehouse
- Lakehouse
- Federated query
- Change Data Capture (CDC)
- Schema
- Partitioning
- Clustering
- Data quality
- Data lineage
- Orchestration
- Idempotency
- Backfill
- SLA / SLO

### GCP Tools
- Cloud Storage
- BigQuery
- BigLake
- External tables
- bq load / LOAD DATA
- BigQuery Data Transfer Service
- Pub/Sub
- Datastream
- Storage Transfer Service
- Dataflow
- Dataproc
- Data Fusion
- Dataform
- BigQuery scheduled queries
- Cloud Composer
- Workflows
- Cloud Scheduler
- Looker / Looker Studio
- Vertex AI
- BigQuery ML
- Dataplex / Knowledge Catalog
- IAM
- Policy tags / column-level security / row-level security
- Cloud DLP / Sensitive Data Protection
- Cloud Logging
- Cloud Monitoring
- Error Reporting / Trace
- Google ADK
- Agent Platform / Gemini Enterprise Agent Platform
- Agent Studio
- Agent Garden
- Model Garden
