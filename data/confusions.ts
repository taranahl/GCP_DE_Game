export interface ConfusionPair {
  id: string;
  toolA: string;
  toolB: string;
  category: "processing" | "ingestion" | "storage" | "orchestration" | "serving" | "governance" | "monitoring" | "concept";
  keyDistinction: string;
  pickA: string[];
  pickB: string[];
  memoryTrick: string;
  toolAGlossaryId?: string;
  toolBGlossaryId?: string;
}

const confusions: ConfusionPair[] = [
  // ─── PROCESSING ──────────────────────────────────────────────────────────────
  {
    id: "dataflow-vs-dataproc",
    toolA: "Dataflow",
    toolB: "Dataproc",
    category: "processing",
    keyDistinction:
      "Dataflow is serverless and uses Apache Beam — Google's native choice for new pipelines. Dataproc runs managed Spark/Hadoop clusters — the right choice if you already have Spark code or need Spark-specific libraries.",
    pickA: [
      "Starting a new pipeline on GCP with no existing Spark code",
      "You want serverless (no cluster to manage or pay for when idle)",
      "Streaming pipelines processing Pub/Sub events",
    ],
    pickB: [
      "You already have PySpark or Spark code you want to run on GCP",
      "You need Spark-specific libraries (MLlib, GraphX, Delta Lake)",
      "Your team is deeply experienced in Spark and does not want to learn Beam",
    ],
    memoryTrick: "Dataflow = fresh start, serverless. Dataproc = bring your Spark.",
    toolAGlossaryId: "dataflow",
    toolBGlossaryId: "dataproc",
  },
  {
    id: "dataflow-vs-dataform",
    toolA: "Dataflow",
    toolB: "Dataform",
    category: "processing",
    keyDistinction:
      "Dataflow transforms data using code (Python/Java/Go) — for complex, large-scale, or streaming transformations. Dataform transforms data using SQL inside BigQuery — for ELT pipelines where SQL is enough.",
    pickA: [
      "Streaming data from Pub/Sub needs processing in real time",
      "Transformation logic is too complex for SQL",
      "Data lives outside BigQuery and needs to be moved and transformed",
    ],
    pickB: [
      "Data is already in BigQuery and SQL transformations are sufficient",
      "You want version-controlled, tested SQL models with dependency management",
      "ELT pattern: load raw data first, then transform inside BigQuery",
    ],
    memoryTrick: "Dataflow = code pipeline. Dataform = SQL pipeline inside BigQuery.",
    toolAGlossaryId: "dataflow",
    toolBGlossaryId: "dataform",
  },
  {
    id: "dataform-vs-bq-scheduled-queries",
    toolA: "Dataform",
    toolB: "BigQuery Scheduled Queries",
    category: "processing",
    keyDistinction:
      "BigQuery Scheduled Queries run a single SQL query on a timer. Dataform manages an entire graph of interdependent SQL models with testing, documentation, and version control. Use Scheduled Queries for one-off jobs; use Dataform for production pipelines.",
    pickA: [
      "Multiple SQL models with dependencies between them",
      "You need data quality tests to run after each transform",
      "Team needs version control and documentation for SQL transforms",
    ],
    pickB: [
      "A single SQL query needs to run on a schedule",
      "Quick prototype or one-off aggregation",
      "You want the simplest possible solution with no overhead",
    ],
    memoryTrick: "Scheduled Queries = one SQL, one timer. Dataform = a whole codebase of SQL.",
    toolAGlossaryId: "dataform",
    toolBGlossaryId: "bigquery-scheduled-queries",
  },

  // ─── INGESTION ────────────────────────────────────────────────────────────────
  {
    id: "pubsub-vs-datastream",
    toolA: "Pub/Sub",
    toolB: "Datastream",
    category: "ingestion",
    keyDistinction:
      "Pub/Sub is a general-purpose message queue for events from any application (clicks, orders, IoT). Datastream is specifically for CDC — replicating inserts, updates, and deletes from relational databases (MySQL, PostgreSQL, Oracle).",
    pickA: [
      "Events come from an application (user clicks, sensor readings, API calls)",
      "You need fan-out: one event consumed by multiple downstream systems",
      "Decoupling microservices that produce and consume events",
    ],
    pickB: [
      "Data changes in MySQL, PostgreSQL, Oracle, or SQL Server need to reach BigQuery",
      "You want real-time analytics on production database changes without querying the live DB",
      "Any CDC use case from a relational database",
    ],
    memoryTrick: "Pub/Sub = from your app. Datastream = from your database.",
    toolAGlossaryId: "pubsub",
    toolBGlossaryId: "datastream",
  },
  {
    id: "bq-load-vs-bq-transfer",
    toolA: "bq load / LOAD DATA",
    toolB: "BigQuery Data Transfer Service",
    category: "ingestion",
    keyDistinction:
      "bq load is a one-shot command you run manually or script yourself. BigQuery Data Transfer Service is a managed, scheduled recurring load service — with built-in connectors for Google Ads, Analytics, S3, and Redshift.",
    pickA: [
      "One-time or scripted file loads from Cloud Storage into BigQuery",
      "Simple, no-frills bulk load with no external SaaS connectors needed",
    ],
    pickB: [
      "Recurring automated loads from Google Ads, Analytics, YouTube, or S3",
      "Migrating from Amazon Redshift into BigQuery",
      "You want managed retries and scheduling without writing a pipeline",
    ],
    memoryTrick: "bq load = you run it. Transfer Service = it runs itself.",
    toolAGlossaryId: "bq-load",
    toolBGlossaryId: "bigquery-data-transfer-service",
  },
  {
    id: "storage-transfer-vs-bq-transfer",
    toolA: "Storage Transfer Service",
    toolB: "BigQuery Data Transfer Service",
    category: "ingestion",
    keyDistinction:
      "Storage Transfer Service moves files between storage buckets (S3 → GCS, GCS → GCS). BigQuery Data Transfer Service loads data FROM sources INTO BigQuery tables.",
    pickA: [
      "Moving files from AWS S3 or Azure Blob Storage to GCS",
      "Syncing files between two GCS buckets",
    ],
    pickB: [
      "Loading data from Google Ads, Analytics, S3, or Redshift into BigQuery",
      "Scheduled recurring loads into BigQuery",
    ],
    memoryTrick: "Storage Transfer = bucket to bucket. BQ Transfer = source to BigQuery.",
  },

  // ─── STORAGE ──────────────────────────────────────────────────────────────────
  {
    id: "biglake-vs-external-tables",
    toolA: "BigLake",
    toolB: "External Tables",
    category: "storage",
    keyDistinction:
      "External tables query Cloud Storage files using BigQuery SQL — simple and built-in. BigLake extends this with fine-grained column and row security, caching, cross-cloud support, and Dataplex integration. BigLake is external tables with enterprise governance added.",
    pickA: [
      "You need column-level or row-level security on files in Cloud Storage",
      "Files need to be governed across a lakehouse architecture",
      "Cross-cloud file access (files in S3, queried from BigQuery)",
    ],
    pickB: [
      "Exploring a new data file quickly without security requirements",
      "Simple one-off query on a Cloud Storage file",
      "Your data is small and governance overhead is not needed",
    ],
    memoryTrick: "External tables = simple file query. BigLake = file query + security + governance.",
    toolAGlossaryId: "biglake",
    toolBGlossaryId: "external-tables",
  },
  {
    id: "cloud-storage-vs-bigquery",
    toolA: "Cloud Storage",
    toolB: "BigQuery",
    category: "storage",
    keyDistinction:
      "Cloud Storage stores any file type — the raw data lake. BigQuery stores structured data in columns optimized for SQL analytics — the data warehouse. They are complementary: data flows from GCS into BigQuery as it moves from raw to queryable.",
    pickA: [
      "Storing raw files (CSV, JSON, Parquet, images, logs) before processing",
      "Long-term archival of data at low cost",
      "Intermediate files passed between pipeline steps",
    ],
    pickB: [
      "Running SQL analytics on structured, cleaned data",
      "Data needs to be queried frequently by analysts or dashboards",
      "You need partitioning, clustering, and BigQuery's query optimization",
    ],
    memoryTrick: "Cloud Storage = the lake (raw files). BigQuery = the warehouse (query-ready tables).",
    toolAGlossaryId: "cloud-storage",
    toolBGlossaryId: "bigquery",
  },
  {
    id: "data-lake-vs-data-warehouse",
    toolA: "Data Lake",
    toolB: "Data Warehouse",
    category: "concept",
    keyDistinction:
      "A data lake stores raw, unprocessed data in any format (files) — cheap and flexible but hard to query. A data warehouse stores clean, structured data optimized for SQL analytics — queryable and governed but more effort to get data in.",
    pickA: [
      "Storing raw data from many sources before you know what you will need",
      "Keeping data at low cost in its original format for future use",
      "Data is unstructured or semi-structured (logs, JSON, files)",
    ],
    pickB: [
      "Analysts need to run SQL queries on clean, reliable data",
      "Business dashboards and reporting require structured, trusted data",
      "Data needs partitioning, clustering, and query optimization",
    ],
    memoryTrick: "Lake = raw and cheap (Cloud Storage). Warehouse = clean and queryable (BigQuery).",
    toolAGlossaryId: "data-lake",
    toolBGlossaryId: "data-warehouse",
  },

  // ─── ORCHESTRATION ────────────────────────────────────────────────────────────
  {
    id: "composer-vs-workflows",
    toolA: "Cloud Composer",
    toolB: "Workflows",
    category: "orchestration",
    keyDistinction:
      "Cloud Composer (managed Airflow) is built for complex data pipeline DAGs with built-in operators for BigQuery, Dataflow, Dataproc, and more. Workflows is serverless and better for lightweight API orchestration — cheaper when you do not need Airflow's power.",
    pickA: [
      "Complex multi-step pipelines across Dataflow, BigQuery, Dataproc with retries",
      "Team already uses Airflow and wants a managed version on GCP",
      "Backfilling historical data using Airflow's date-range execution",
    ],
    pickB: [
      "Chaining Cloud Functions or Cloud Run services in sequence",
      "Lightweight event-driven automation where Composer is overkill",
      "Cost matters — Composer runs an always-on cluster; Workflows charges per execution",
    ],
    memoryTrick: "Composer = full Airflow for heavy DE pipelines. Workflows = serverless API chaining.",
    toolAGlossaryId: "cloud-composer",
    toolBGlossaryId: "workflows",
  },
  {
    id: "composer-vs-scheduler",
    toolA: "Cloud Composer",
    toolB: "Cloud Scheduler",
    category: "orchestration",
    keyDistinction:
      "Cloud Scheduler is just a cron trigger — it fires a webhook, Pub/Sub message, or HTTP call at a scheduled time. Cloud Composer manages the entire pipeline: dependencies between steps, retries, monitoring, branching.",
    pickA: [
      "Multi-step pipelines where step B must wait for step A to succeed",
      "You need retry logic, alerting, and pipeline visibility",
      "Complex DAGs with conditional branches or parallel tasks",
    ],
    pickB: [
      "A single job or trigger that just needs to fire at a set time",
      "Triggering a Workflows execution or Cloud Function on a schedule",
      "Simplest possible scheduled automation",
    ],
    memoryTrick: "Scheduler = fire and forget on a timer. Composer = manage the whole pipeline.",
    toolAGlossaryId: "cloud-composer",
    toolBGlossaryId: "cloud-scheduler",
  },

  // ─── SERVING & ML ─────────────────────────────────────────────────────────────
  {
    id: "bigquery-ml-vs-vertex-ai",
    toolA: "BigQuery ML",
    toolB: "Vertex AI",
    category: "serving",
    keyDistinction:
      "BigQuery ML lets you train and run standard ML models (regression, classification, forecasting) using SQL inside BigQuery — no data movement, no Python. Vertex AI is the full ML platform for custom models, deep learning, generative AI, and agents.",
    pickA: [
      "Data is already in BigQuery and the model type is standard",
      "Team knows SQL but not Python or ML frameworks",
      "Rapid prototyping without ML infrastructure setup",
    ],
    pickB: [
      "Custom model architectures (neural networks, transformers)",
      "Generative AI applications using Gemini",
      "Real-time prediction serving with low latency",
      "Building and deploying AI agents",
    ],
    memoryTrick: "BQML = SQL-only ML inside BigQuery. Vertex AI = everything else in ML/AI.",
    toolAGlossaryId: "bigquery-ml",
    toolBGlossaryId: "vertex-ai",
  },
  {
    id: "looker-vs-looker-studio",
    toolA: "Looker",
    toolB: "Looker Studio",
    category: "serving",
    keyDistinction:
      "Looker is the enterprise paid BI platform with LookML — a modeling layer that defines business metrics centrally so every team uses the same definition of 'revenue'. Looker Studio is free and drag-and-drop — good for quick dashboards, no metric governance.",
    pickA: [
      "Multiple teams must agree on the definition of key business metrics",
      "Self-service analytics at enterprise scale with access control",
      "Business teams need to explore data without SQL but with guardrails",
    ],
    pickB: [
      "Quick dashboards for a small team or personal project",
      "Sharing a report with stakeholders who do not have BigQuery access",
      "Budget is limited — Looker Studio is free",
    ],
    memoryTrick: "Looker = enterprise + metric governance (paid). Looker Studio = free + drag-and-drop.",
    toolAGlossaryId: "looker",
    toolBGlossaryId: "looker-studio",
  },

  // ─── GOVERNANCE ──────────────────────────────────────────────────────────────
  {
    id: "dataplex-vs-dlp",
    toolA: "Dataplex",
    toolB: "Sensitive Data Protection (DLP)",
    category: "governance",
    keyDistinction:
      "Dataplex handles data governance: catalog (discover data), lineage (trace data flow), quality (validate data), and ownership. Cloud DLP handles finding and masking sensitive/PII data in BigQuery and Cloud Storage.",
    pickA: [
      "Building a searchable catalog of data assets across the organization",
      "Tracking lineage: where did this table come from?",
      "Enforcing data quality rules on BigQuery datasets",
    ],
    pickB: [
      "Scanning tables or files to find PII (SSNs, emails, phone numbers)",
      "De-identifying data before sharing with analysts or external parties",
      "Regulatory compliance requiring PII detection and masking",
    ],
    memoryTrick: "Dataplex = govern your data estate. DLP = find and mask the sensitive stuff.",
    toolAGlossaryId: "dataplex",
    toolBGlossaryId: "sensitive-data-protection",
  },
  {
    id: "iam-vs-policy-tags",
    toolA: "IAM",
    toolB: "Policy Tags",
    category: "governance",
    keyDistinction:
      "IAM controls who can access a BigQuery dataset or table at the resource level. Policy Tags control who can see specific columns within a table — a finer level of access control on top of IAM.",
    pickA: [
      "Granting or revoking access to entire datasets or tables",
      "Service accounts need permission to run Dataflow or access BigQuery",
      "Broad access control across all GCP resources",
    ],
    pickB: [
      "A table has both public and sensitive columns and you want to hide specific ones",
      "GDPR or HIPAA requires column-level restrictions on PII fields",
      "Different user groups need to see different columns of the same table",
    ],
    memoryTrick: "IAM = table/dataset access. Policy Tags = column access. Both needed for full security.",
    toolAGlossaryId: "iam",
    toolBGlossaryId: "policy-tags",
  },
  {
    id: "column-vs-row-security",
    toolA: "Column-Level Security",
    toolB: "Row-Level Security",
    category: "governance",
    keyDistinction:
      "Column-level security (via policy tags) hides specific fields from unauthorized users — they see NULL instead of the sensitive value. Row-level security (via row access policies) hides specific records — users see only the rows they are allowed to see.",
    pickA: [
      "A table has a salary or SSN column that only HR should see",
      "The same table row should be visible to everyone, but some fields should be masked",
    ],
    pickB: [
      "A regional sales manager should see only their region's orders, not all orders",
      "Multi-tenant tables where each tenant sees only their own rows",
    ],
    memoryTrick: "Column security = hide a field. Row security = hide a record.",
    toolAGlossaryId: "column-level-security",
    toolBGlossaryId: "row-level-security",
  },

  // ─── MONITORING ───────────────────────────────────────────────────────────────
  {
    id: "logging-vs-monitoring",
    toolA: "Cloud Logging",
    toolB: "Cloud Monitoring",
    category: "monitoring",
    keyDistinction:
      "Cloud Logging stores text log messages and events — error tracebacks, audit logs, what happened and when. Cloud Monitoring tracks numerical metrics over time — latency, error rate, throughput — and fires alerts when thresholds are crossed.",
    pickA: [
      "A pipeline failed and you need to read the error message to understand why",
      "Auditing: who created, modified, or deleted a resource?",
      "Reading Dataflow or Composer job output logs",
    ],
    pickB: [
      "Setting an alert: fire if Dataflow latency exceeds 10 minutes",
      "Building a dashboard showing Pub/Sub backlog over time",
      "Tracking pipeline health metrics (success rate, records processed per second)",
    ],
    memoryTrick: "Logging = read what happened. Monitoring = alert when something is wrong.",
    toolAGlossaryId: "cloud-logging",
    toolBGlossaryId: "cloud-monitoring",
  },

  // ─── CONCEPTS ────────────────────────────────────────────────────────────────
  {
    id: "etl-vs-elt",
    toolA: "ETL",
    toolB: "ELT",
    category: "concept",
    keyDistinction:
      "ETL transforms data before loading it into the warehouse — the transformation happens outside, often in Dataflow. ELT loads raw data first, then transforms it inside the warehouse using SQL (Dataform or BigQuery). Modern GCP-native pipelines prefer ELT because BigQuery is powerful and cheap to query.",
    pickA: [
      "Data must be cleaned or masked before it can safely enter the warehouse",
      "Transformation requires code (Python, Java) rather than SQL",
      "Streaming pipelines processing events in real time",
    ],
    pickB: [
      "Data can land in BigQuery raw and be transformed with SQL",
      "Team prefers SQL-first workflows with Dataform",
      "You want to keep the raw data for replay and reprocessing",
    ],
    memoryTrick: "ETL = transform before load (code). ELT = load then transform (SQL inside BigQuery).",
    toolAGlossaryId: "etl",
    toolBGlossaryId: "elt",
  },
  {
    id: "batch-vs-streaming",
    toolA: "Batch Processing",
    toolB: "Streaming Processing",
    category: "concept",
    keyDistinction:
      "Batch processing runs on a schedule, processing accumulated data in chunks (daily, hourly). Streaming processes events continuously as they arrive, in near-real time. Choose based on how fresh the data needs to be — not just habit.",
    pickA: [
      "Data freshness of hours or days is acceptable (morning dashboard, nightly aggregations)",
      "Historical reprocessing or backfills",
      "Lower infrastructure cost is a priority (streaming pipelines run continuously)",
    ],
    pickB: [
      "Data needs to be visible within seconds or minutes of occurring",
      "Fraud detection, real-time personalization, live monitoring",
      "Events arrive continuously and must be processed as they come",
    ],
    memoryTrick: "Batch = scheduled chunks. Streaming = continuous flow. Match to your data freshness SLA.",
    toolAGlossaryId: "batch-processing",
    toolBGlossaryId: "streaming-processing",
  },
  {
    id: "sla-vs-slo",
    toolA: "SLA",
    toolB: "SLO",
    category: "concept",
    keyDistinction:
      "An SLA (Service Level Agreement) is the external promise — 'data will be ready by 8am, guaranteed.' An SLO (Service Level Objective) is the internal target — 'pipeline must complete by 7am 99.9% of the time.' SLOs are set tighter than SLAs to give a safety buffer.",
    pickA: [
      "Communicating reliability commitments to stakeholders or other teams",
      "Contractual reliability requirements with consequences if missed",
    ],
    pickB: [
      "Defining internal engineering targets to ensure the SLA is never at risk",
      "Setting Cloud Monitoring alert thresholds for pipeline health",
    ],
    memoryTrick: "SLA = the promise to others. SLO = the internal guardrail that protects the promise.",
    toolAGlossaryId: "sla",
    toolBGlossaryId: "slo",
  },
  {
    id: "partitioning-vs-clustering",
    toolA: "Partitioning",
    toolB: "Clustering",
    category: "concept",
    keyDistinction:
      "Partitioning divides a BigQuery table into large independent sections (typically by date) — so queries that filter by partition column skip entire sections. Clustering sorts the data within each partition by one or more columns — so queries that filter on clustered columns skip even more data within a partition.",
    pickA: [
      "Table is large and most queries filter by date range",
      "You want to reduce BigQuery query costs by avoiding full table scans",
    ],
    pickB: [
      "Within each partition, queries frequently filter by customer_id, region, or product_id",
      "Used in addition to partitioning for maximum query optimization",
    ],
    memoryTrick: "Partitioning = date drawers. Clustering = alphabetical order inside each drawer. Use both.",
    toolAGlossaryId: "partitioning",
    toolBGlossaryId: "clustering",
  },

  // ─── AGENTS ──────────────────────────────────────────────────────────────────
  {
    id: "adk-vs-agent-platform",
    toolA: "Google ADK",
    toolB: "Agent Platform",
    category: "serving",
    keyDistinction:
      "ADK (Agent Development Kit) is the open-source framework for writing agent code — you define tools, prompts, and logic. Agent Platform is the managed cloud infrastructure for running those agents in production — sessions, scaling, monitoring, governance.",
    pickA: [
      "Writing and testing agent logic locally",
      "Defining which tools (SQL query, API call, file read) the agent can use",
    ],
    pickB: [
      "Deploying an agent to production where many users will interact with it",
      "Needing managed sessions so each user's conversation is isolated",
      "Enterprise governance, access control, and audit trails for agents",
    ],
    memoryTrick: "ADK = write the agent. Agent Platform = run the agent. You need both.",
    toolAGlossaryId: "adk",
    toolBGlossaryId: "agent-platform",
  },
  {
    id: "sessions-vs-memory",
    toolA: "Sessions",
    toolB: "Memory",
    category: "serving",
    keyDistinction:
      "Sessions persist context within a single conversation — the agent remembers what was said in this session. Memory persists context across multiple separate conversations — the agent recalls facts from previous sessions weeks later.",
    pickA: [
      "User asks several follow-up questions in one conversation",
      "Agent needs to remember context from earlier in the same chat",
    ],
    pickB: [
      "Agent should remember user preferences across different conversations",
      "Agent accumulates knowledge about a domain or user over many sessions",
    ],
    memoryTrick: "Session = short-term (this conversation). Memory = long-term (across all conversations).",
    toolAGlossaryId: "agent-sessions",
    toolBGlossaryId: "agent-memory",
  },
];

export default confusions;
