import type { GCPTool } from "@/types/tools";

const gcpTools: GCPTool[] = [
  // ─── STORAGE & WAREHOUSE ─────────────────────────────────────────────────────
  {
    id: "cloud-storage",
    name: "Cloud Storage",
    category: "storage",
    tagline: "GCP's object storage — the raw data lake layer for any file type at any scale.",
    problem:
      "You need to store files cheaply and durably before they are processed — raw CSVs, JSON dumps, Parquet files, images, logs, or anything else.",
    whenToUse: [
      "Landing zone for raw data from external sources before processing",
      "Long-term archival of processed data you rarely query",
      "Staging files between pipeline steps (Dataflow reads from GCS, writes to GCS)",
      "Any unstructured or semi-structured data (logs, images, audio, video)",
    ],
    whenNotToUse: [
      "Running SQL analytics — BigQuery is the right tool for that",
      "Storing structured data you need to query frequently — load it into BigQuery",
    ],
    confusedWith: [
      {
        id: "bigquery",
        reason:
          "Cloud Storage = raw file storage (the data lake). BigQuery = structured analytics warehouse. Data often flows from GCS → BigQuery as it moves from raw to queryable.",
      },
    ],
    glossaryTermIds: ["cloud-storage", "data-lake", "etl", "elt"],
  },
  {
    id: "bigquery",
    name: "BigQuery",
    category: "storage",
    tagline: "GCP's serverless data warehouse — query petabytes with SQL, pay per query.",
    problem:
      "You need to run fast analytical SQL queries on large datasets without managing servers or databases.",
    whenToUse: [
      "Analytics and reporting on structured data at any scale",
      "The final destination for cleaned, transformed data from pipelines",
      "Running ad-hoc SQL analysis without provisioning infrastructure",
      "Storing and querying event data, transaction data, or any structured tables",
    ],
    whenNotToUse: [
      "Transactional workloads with many small reads/writes — use Cloud SQL or Firestore",
      "Real-time single-row lookups — BigQuery is optimized for analytical scans, not point reads",
    ],
    confusedWith: [
      {
        id: "cloud-storage",
        reason:
          "Cloud Storage is for files. BigQuery is for structured analytics. They are complementary: GCS is the lake, BigQuery is the warehouse.",
      },
      {
        id: "dataproc",
        reason:
          "Both can process large datasets. BigQuery is serverless SQL. Dataproc is managed Spark/Hadoop for custom code. Use BigQuery when SQL is enough.",
      },
    ],
    glossaryTermIds: ["bigquery", "data-warehouse", "partitioning", "clustering", "star-schema"],
  },
  {
    id: "biglake",
    name: "BigLake",
    category: "storage",
    tagline: "Query files in Cloud Storage using BigQuery SQL — without loading them first.",
    problem:
      "You want to run governed, BigQuery-quality SQL on Parquet or ORC files sitting in Cloud Storage, without the cost and time of loading them.",
    whenToUse: [
      "Querying Cloud Storage files (Parquet, ORC, Avro) using BigQuery SQL",
      "Applying row and column level security to files — not just loaded tables",
      "Lakehouse architecture: lake storage + warehouse governance in one",
    ],
    whenNotToUse: [
      "High-frequency analytics on frequently accessed data — load into BigQuery for best performance",
      "You need full BigQuery features (materialized views, ML) — use native BigQuery tables",
    ],
    confusedWith: [
      {
        id: "bigquery",
        reason:
          "BigQuery queries loaded tables. BigLake queries files where they live in Cloud Storage. BigLake avoids the load step but is slower for frequent access.",
      },
      {
        id: "external-tables",
        reason:
          "External tables are a BigQuery feature for querying GCS files. BigLake extends this with fine-grained security and cross-cloud support.",
      },
    ],
    glossaryTermIds: ["biglake", "lakehouse", "external-tables", "federated-query"],
  },
  {
    id: "external-tables",
    name: "External Tables",
    category: "storage",
    tagline: "Query Cloud Storage files as if they were BigQuery tables — no loading required.",
    problem:
      "You have files in Cloud Storage and want to run SQL on them immediately without a load job.",
    whenToUse: [
      "Rapid exploration of new data files before deciding to load them",
      "Joining Cloud Storage data with BigQuery native tables in one query",
      "Data that changes frequently and you want to always query the latest file",
    ],
    whenNotToUse: [
      "Production analytics that run frequently — external tables are slower; load into BigQuery",
      "You need row/column security on files — use BigLake instead",
    ],
    confusedWith: [
      {
        id: "biglake",
        reason:
          "External tables are simple GCS file queries. BigLake adds fine-grained security, caching, and cross-cloud support on top. BigLake supersedes external tables for production use.",
      },
    ],
    glossaryTermIds: ["external-tables", "federated-query", "bigquery", "cloud-storage"],
  },

  // ─── INGESTION ────────────────────────────────────────────────────────────────
  {
    id: "bq-load",
    name: "bq load / LOAD DATA",
    category: "ingestion",
    tagline: "The simplest way to load files from Cloud Storage into BigQuery — one command.",
    problem:
      "You have files (CSV, JSON, Parquet, Avro) in Cloud Storage and need to get them into BigQuery as quickly and simply as possible.",
    whenToUse: [
      "Batch loading files from Cloud Storage into BigQuery tables",
      "Simple, one-time or scheduled bulk loads without transformation",
      "When you do not need streaming or real-time ingestion",
    ],
    whenNotToUse: [
      "Real-time or streaming data — use Pub/Sub + Dataflow instead",
      "Complex transformations during load — load raw with bq load, transform separately with Dataform",
      "Replicating from an operational database (MySQL, Postgres) — use Datastream",
    ],
    confusedWith: [
      {
        id: "bq-data-transfer",
        reason:
          "bq load is a one-shot command you run manually or script. BigQuery Data Transfer Service is a managed scheduler for recurring loads from SaaS and GCS sources.",
      },
    ],
    glossaryTermIds: ["bq-load", "batch-ingestion", "etl", "elt"],
  },
  {
    id: "bq-data-transfer",
    name: "BigQuery Data Transfer Service",
    category: "ingestion",
    tagline: "Scheduled, managed data transfers from SaaS apps (Google Ads, S3, Redshift) into BigQuery.",
    problem:
      "You need recurring, automated loads from Google Ads, Google Analytics, YouTube, Amazon S3, or Redshift into BigQuery without building and maintaining custom pipelines.",
    whenToUse: [
      "Automated recurring loads from Google Ads, Google Analytics, YouTube, Campaign Manager",
      "Migrating from Amazon S3 or Redshift into BigQuery",
      "Scheduled GCS-to-BigQuery loads with no custom code required",
    ],
    whenNotToUse: [
      "Real-time or near-real-time data — this is scheduled batch only",
      "Custom transformations during transfer — use Dataflow or Dataform after loading",
      "Replicating from operational databases (MySQL, Postgres) — use Datastream for CDC",
    ],
    confusedWith: [
      {
        id: "datastream",
        reason:
          "BigQuery Data Transfer Service handles scheduled batch loads from SaaS and cloud storage. Datastream handles real-time CDC replication from operational databases (MySQL, Postgres, Oracle).",
      },
      {
        id: "storage-transfer",
        reason:
          "Storage Transfer Service moves files between storage buckets (S3 → GCS, GCS → GCS). BigQuery Data Transfer Service loads data INTO BigQuery from sources.",
      },
    ],
    glossaryTermIds: ["bigquery-data-transfer-service", "batch-ingestion", "bigquery"],
  },
  {
    id: "pubsub",
    name: "Pub/Sub",
    category: "ingestion",
    tagline: "GCP's messaging backbone — producers publish events; consumers receive them in real time.",
    problem:
      "You need to reliably pass real-time events between systems — decoupling the producer (who sends events) from the consumer (who processes them), even if one is temporarily down.",
    whenToUse: [
      "Streaming event ingestion: clickstreams, IoT sensor data, user activity",
      "Decoupling microservices so they can scale independently",
      "Triggering Dataflow streaming pipelines from incoming events",
      "Fan-out: one event needs to be consumed by multiple downstream systems",
    ],
    whenNotToUse: [
      "Batch file transfers — use Storage Transfer Service or bq load",
      "Database replication — use Datastream for CDC",
      "When you need message ordering guarantees across all messages — Pub/Sub guarantees order only within a message key",
    ],
    confusedWith: [
      {
        id: "datastream",
        reason:
          "Pub/Sub handles arbitrary event messages (any producer, any format). Datastream handles specific CDC use case: replicating changes from operational databases.",
      },
    ],
    glossaryTermIds: ["pubsub", "streaming-ingestion", "streaming-processing", "dataflow"],
  },
  {
    id: "datastream",
    name: "Datastream",
    category: "ingestion",
    tagline: "Real-time CDC replication from operational databases (MySQL, Postgres, Oracle) into BigQuery or GCS.",
    problem:
      "Your production database has data that needs to be in BigQuery for analytics, and you need changes (inserts, updates, deletes) to appear in near-real-time — not just nightly batch dumps.",
    whenToUse: [
      "Replicating from MySQL, PostgreSQL, Oracle, or SQL Server into BigQuery",
      "Any CDC (Change Data Capture) use case from relational databases",
      "Building analytics on operational data without querying production databases",
    ],
    whenNotToUse: [
      "Arbitrary event streaming from applications — use Pub/Sub",
      "Batch file loads — use bq load or BigQuery Data Transfer Service",
      "If you do not need real-time — a nightly bq load might be simpler and cheaper",
    ],
    confusedWith: [
      {
        id: "pubsub",
        reason:
          "Pub/Sub is a general-purpose message queue for any event producer. Datastream specifically replicates changes from relational databases using CDC.",
      },
      {
        id: "bq-data-transfer",
        reason:
          "BigQuery Data Transfer Service does scheduled batch loads from SaaS sources. Datastream does continuous real-time CDC from operational databases.",
      },
    ],
    glossaryTermIds: ["datastream", "change-data-capture", "streaming-ingestion", "bigquery"],
  },
  {
    id: "storage-transfer",
    name: "Storage Transfer Service",
    category: "ingestion",
    tagline: "Managed, scheduled bulk file transfers between cloud storage buckets (S3, Azure, GCS).",
    problem:
      "You need to move large volumes of files from Amazon S3, Azure Blob, another GCS bucket, or on-premises storage into GCS — reliably, on a schedule, with retries.",
    whenToUse: [
      "Migrating data from AWS S3 or Azure Blob Storage to GCS",
      "Scheduled recurring syncs between cloud storage systems",
      "Transferring large volumes of files where a simple gsutil cp would be too slow or fragile",
    ],
    whenNotToUse: [
      "Loading data into BigQuery — use bq load or BigQuery Data Transfer Service after files land in GCS",
      "Real-time event streaming — use Pub/Sub",
      "Small, infrequent transfers — gsutil or gcloud storage commands are simpler",
    ],
    confusedWith: [
      {
        id: "bq-data-transfer",
        reason:
          "Storage Transfer Service moves files between storage buckets (S3 → GCS). BigQuery Data Transfer Service loads data from those files or SaaS sources INTO BigQuery.",
      },
    ],
    glossaryTermIds: ["storage-transfer-service", "batch-ingestion", "cloud-storage"],
  },

  // ─── PROCESSING & TRANSFORMATION ─────────────────────────────────────────────
  {
    id: "dataflow",
    name: "Dataflow",
    category: "processing",
    tagline: "GCP's fully managed stream and batch processing engine — built on Apache Beam.",
    problem:
      "You need to process large volumes of data with custom logic — either in real time as events arrive, or in batch over historical data — without managing servers.",
    whenToUse: [
      "Real-time streaming pipelines: Pub/Sub → Dataflow → BigQuery",
      "Complex transformations that cannot be expressed in SQL",
      "Large-scale batch ETL jobs that need to run on distributed infrastructure",
      "Stateful stream processing (windows, aggregations, joins across streams)",
    ],
    whenNotToUse: [
      "SQL-only transformations — use Dataform or BigQuery Scheduled Queries",
      "Spark-specific libraries or ML workloads — use Dataproc",
      "Simple file moves — use Storage Transfer Service or bq load",
    ],
    confusedWith: [
      {
        id: "dataproc",
        reason:
          "Dataflow is fully managed, serverless, uses Apache Beam. Dataproc runs managed Spark/Hadoop clusters. Use Dataflow for new pipelines; use Dataproc if you already have Spark code or need Spark-specific libraries.",
      },
    ],
    glossaryTermIds: ["dataflow", "apache-beam", "streaming-processing", "batch-processing", "windowing"],
  },
  {
    id: "dataproc",
    name: "Dataproc",
    category: "processing",
    tagline: "Managed Spark and Hadoop clusters on GCP — run existing Spark jobs without rewriting them.",
    problem:
      "You have existing Spark or Hadoop code that needs to run on GCP, or you need Spark-specific libraries (MLlib, GraphX) that are not available in Dataflow.",
    whenToUse: [
      "Lifting and shifting existing Spark or Hadoop workloads to GCP",
      "Spark ML jobs using MLlib or other Spark-specific libraries",
      "PySpark jobs with custom library dependencies",
      "Teams with deep Spark expertise who do not want to learn Apache Beam",
    ],
    whenNotToUse: [
      "New pipelines without existing Spark code — Dataflow is simpler and serverless",
      "SQL transformations — use Dataform or BigQuery",
      "Streaming pipelines without existing Spark Streaming code — use Dataflow",
    ],
    confusedWith: [
      {
        id: "dataflow",
        reason:
          "Dataflow is serverless (no cluster to manage), uses Apache Beam, better for new GCP-native pipelines. Dataproc runs Spark/Hadoop clusters — better for existing Spark code.",
      },
    ],
    glossaryTermIds: ["dataproc", "spark", "hadoop", "pyspark", "batch-processing"],
  },
  {
    id: "data-fusion",
    name: "Data Fusion",
    category: "processing",
    tagline: "Visual, drag-and-drop ETL pipeline builder — no code required.",
    problem:
      "Your team needs to build ETL pipelines but does not have strong coding skills. You want a visual interface to connect sources, apply transformations, and load to destinations.",
    whenToUse: [
      "Teams with analysts or business users who need to build pipelines without writing code",
      "Migrating from on-premises ETL tools (Informatica, Talend) to GCP",
      "Standardizing pipeline building with a governed, visual approach",
    ],
    whenNotToUse: [
      "Complex, highly customized pipeline logic — code (Dataflow, Dataproc) is more flexible",
      "Real-time streaming — Data Fusion is primarily for batch",
      "Cost-sensitive workloads — Data Fusion is more expensive than raw Dataflow",
    ],
    confusedWith: [
      {
        id: "dataflow",
        reason:
          "Data Fusion is the visual no-code tool that generates Dataflow jobs under the hood. Use Dataflow directly if you are comfortable with code; use Data Fusion if you need visual authoring.",
      },
    ],
    glossaryTermIds: ["data-fusion", "etl", "batch-processing"],
  },
  {
    id: "dataform",
    name: "Dataform",
    category: "processing",
    tagline: "SQL-based data transformation framework inside BigQuery — version-controlled, tested, and documented.",
    problem:
      "You need to transform raw data in BigQuery into clean, tested, reliable tables using SQL — with dependency management, testing, and version control built in.",
    whenToUse: [
      "Building and maintaining SQL transformation pipelines inside BigQuery",
      "Managing dependencies between tables (upstream table must run before downstream)",
      "Enforcing data quality tests on every table before it is published",
      "Any ELT workflow where the transform happens inside BigQuery",
    ],
    whenNotToUse: [
      "Real-time transformations — Dataform is for batch/scheduled SQL runs",
      "Non-SQL transformations — use Dataflow or Dataproc for custom code",
    ],
    confusedWith: [
      {
        id: "bq-scheduled-queries",
        reason:
          "BigQuery Scheduled Queries run a single SQL query on a schedule. Dataform manages many interdependent SQL models with testing, documentation, and version control. Use Dataform for production pipelines.",
      },
      {
        id: "dataflow",
        reason:
          "Dataflow transforms data using code (Python/Java/Go). Dataform transforms data using SQL inside BigQuery. If SQL is enough, use Dataform.",
      },
    ],
    glossaryTermIds: ["dataform", "elt", "bigquery", "data-quality"],
  },
  {
    id: "bq-scheduled-queries",
    name: "BigQuery Scheduled Queries",
    category: "processing",
    tagline: "Run a SQL query in BigQuery on a cron schedule — simple and built-in.",
    problem:
      "You have a single SQL query that needs to run on a schedule (daily, hourly) to update a table — and you do not need the full complexity of Dataform.",
    whenToUse: [
      "Simple, standalone SQL queries that need to run on a schedule",
      "Quick aggregations or table refreshes without dependencies on other jobs",
      "Prototyping scheduled transformations before investing in a proper Dataform setup",
    ],
    whenNotToUse: [
      "Multiple interdependent SQL models — use Dataform for dependency management",
      "You need testing, documentation, or version control — use Dataform",
      "Complex orchestration with retries and monitoring — use Cloud Composer",
    ],
    confusedWith: [
      {
        id: "dataform",
        reason:
          "Scheduled Queries run one query at a time. Dataform manages an entire DAG of SQL models with dependencies, tests, and version control. Graduate to Dataform as complexity grows.",
      },
    ],
    glossaryTermIds: ["bigquery-scheduled-queries", "elt", "bigquery"],
  },

  // ─── ORCHESTRATION ────────────────────────────────────────────────────────────
  {
    id: "cloud-composer",
    name: "Cloud Composer",
    category: "orchestration",
    tagline: "Managed Apache Airflow on GCP — orchestrate complex multi-step data pipelines with DAGs.",
    problem:
      "You have a data pipeline with many steps across multiple services, and you need to manage dependencies, retries, monitoring, and scheduling all in one place.",
    whenToUse: [
      "Complex pipelines with many dependent steps across different GCP services",
      "When you need retry logic, alerting, and full pipeline observability",
      "Teams already familiar with Apache Airflow",
      "Backfilling historical data using Airflow's date-range execution",
    ],
    whenNotToUse: [
      "Simple single-step scheduled jobs — use Cloud Scheduler",
      "API chaining without complex branching — use Workflows",
      "Cost-sensitive environments — Composer is expensive (it runs an always-on cluster)",
    ],
    confusedWith: [
      {
        id: "workflows",
        reason:
          "Workflows is serverless and better for lightweight API orchestration. Composer is managed Airflow — more powerful, more expensive, better for complex DE pipelines with branching and retries.",
      },
      {
        id: "cloud-scheduler",
        reason:
          "Cloud Scheduler is a cron job — it just triggers things on a timer. Composer orchestrates complex pipelines: dependencies, retries, branching, monitoring.",
      },
    ],
    glossaryTermIds: ["cloud-composer", "apache-airflow", "dag", "orchestration"],
  },
  {
    id: "workflows",
    name: "Workflows",
    category: "orchestration",
    tagline: "Serverless orchestration for chaining GCP APIs and services — lightweight alternative to Composer.",
    problem:
      "You need to call several GCP APIs or Cloud Functions in sequence, with error handling, but you do not want the cost and complexity of Cloud Composer.",
    whenToUse: [
      "Chaining Cloud Functions, Cloud Run, or GCP APIs in order",
      "Lightweight event-driven automations without a full Airflow setup",
      "Serverless orchestration where you pay per execution, not per hour",
    ],
    whenNotToUse: [
      "Complex data pipelines with many dependent Dataflow or Dataproc jobs — use Composer",
      "Heavy data transformation orchestration — Workflows has no built-in Airflow operators for Dataflow, Dataproc, etc.",
    ],
    confusedWith: [
      {
        id: "cloud-composer",
        reason:
          "Workflows is serverless and cheap — perfect for API chains. Composer (Airflow) is more powerful — better for complex multi-step DE pipelines with built-in operators for Dataflow, BigQuery, etc.",
      },
    ],
    glossaryTermIds: ["workflows", "orchestration"],
  },
  {
    id: "cloud-scheduler",
    name: "Cloud Scheduler",
    category: "orchestration",
    tagline: "Fully managed cron service — trigger any GCP service on a schedule.",
    problem:
      "You need to trigger a Cloud Function, Pub/Sub message, HTTP endpoint, or Workflows execution on a time-based schedule (every hour, every day at 9am, etc.).",
    whenToUse: [
      "Triggering simple jobs on a cron schedule",
      "Starting Workflows, Cloud Functions, or Cloud Run jobs on a timer",
      "Any job that just needs 'run this at this time' without complex dependencies",
    ],
    whenNotToUse: [
      "Multi-step pipelines with dependencies — use Composer or Workflows",
      "Event-driven triggers (respond to new files or messages) — use Cloud Functions or Pub/Sub",
    ],
    confusedWith: [
      {
        id: "cloud-composer",
        reason:
          "Cloud Scheduler just fires a trigger at a scheduled time. Composer (Airflow) manages the entire pipeline lifecycle — dependencies, retries, monitoring, branching.",
      },
    ],
    glossaryTermIds: ["cloud-scheduler", "cron", "orchestration"],
  },

  // ─── SERVING, BI & ML ────────────────────────────────────────────────────────
  {
    id: "looker",
    name: "Looker",
    category: "serving",
    tagline: "Enterprise BI platform with a shared metrics layer — define business metrics once, use everywhere.",
    problem:
      "Different teams calculate 'revenue' or 'active users' differently, leading to inconsistent reports. Looker lets you define metrics centrally in LookML so everyone reports the same number.",
    whenToUse: [
      "Enterprise environments where metric consistency across teams is critical",
      "Self-service analytics where business teams explore data without writing SQL",
      "Organizations that need governed, version-controlled metric definitions",
    ],
    whenNotToUse: [
      "Small teams or quick one-off dashboards — Looker Studio is simpler and free",
      "You only need basic visualizations without a shared metrics layer",
    ],
    confusedWith: [
      {
        id: "looker-studio",
        reason:
          "Looker = enterprise, paid, with LookML modeling layer for metric governance. Looker Studio = free, drag-and-drop dashboards. Different products with similar names.",
      },
    ],
    glossaryTermIds: ["looker", "bigquery", "star-schema"],
  },
  {
    id: "looker-studio",
    name: "Looker Studio",
    category: "serving",
    tagline: "Free, drag-and-drop dashboard builder — connect to BigQuery and visualize in minutes.",
    problem:
      "You need to share data visualizations and dashboards with stakeholders who do not have BigQuery access, without buying an enterprise BI tool.",
    whenToUse: [
      "Quick dashboards for any team, free and easy",
      "Sharing reports with stakeholders who should not have direct BigQuery access",
      "Small teams or personal projects needing simple BI",
    ],
    whenNotToUse: [
      "Enterprise-scale with strict metric governance requirements — use Looker",
      "Sub-second real-time dashboards — Looker Studio queries BigQuery on load",
    ],
    confusedWith: [
      {
        id: "looker",
        reason:
          "Looker Studio = free, simple, drag-and-drop. Looker = paid, enterprise, with LookML metrics governance. Most teams start with Looker Studio and upgrade to Looker at scale.",
      },
    ],
    glossaryTermIds: ["looker-studio", "bigquery"],
  },
  {
    id: "vertex-ai",
    name: "Vertex AI",
    category: "serving",
    tagline: "GCP's unified ML platform — train, deploy, and monitor models; build generative AI applications.",
    problem:
      "You need to train a custom ML model, deploy it as an API endpoint, or build a generative AI application — and you want everything in one managed platform.",
    whenToUse: [
      "Training and deploying custom ML models (classification, regression, etc.)",
      "Building generative AI applications with Gemini",
      "Serving model predictions via a managed API endpoint",
      "Feature engineering and feature store management",
    ],
    whenNotToUse: [
      "Standard ML on BigQuery data — BigQuery ML is simpler and stays inside BigQuery",
      "Simple BI and analytics — BigQuery + Looker Studio is enough",
    ],
    confusedWith: [
      {
        id: "bigquery-ml",
        reason:
          "BigQuery ML runs SQL-based standard models inside BigQuery — fast and simple. Vertex AI is the full platform for custom, complex, or generative AI workloads.",
      },
    ],
    glossaryTermIds: ["vertex-ai", "bigquery-ml"],
  },
  {
    id: "bigquery-ml",
    name: "BigQuery ML",
    category: "serving",
    tagline: "Train and run ML models inside BigQuery using SQL — no Python, no data movement.",
    problem:
      "You want to run ML models on BigQuery data without exporting it to a separate platform or learning a new framework.",
    whenToUse: [
      "Data is already in BigQuery and the model type is standard (regression, classification, forecasting, clustering)",
      "SQL-fluent teams who want ML without learning Python or TensorFlow",
      "Rapid ML prototyping inside BigQuery without infrastructure setup",
    ],
    whenNotToUse: [
      "Custom deep learning or neural architectures — use Vertex AI",
      "Real-time low-latency prediction serving — deploy a Vertex AI endpoint",
    ],
    confusedWith: [
      {
        id: "vertex-ai",
        reason:
          "BigQuery ML = SQL-only, simple, for standard models inside BigQuery. Vertex AI = full ML platform for custom models, generative AI, and agents. Start with BQML if SQL is enough.",
      },
    ],
    glossaryTermIds: ["bigquery-ml", "bigquery", "vertex-ai"],
  },

  // ─── GOVERNANCE & SECURITY ────────────────────────────────────────────────────
  {
    id: "dataplex",
    name: "Dataplex",
    category: "governance",
    tagline: "Unified data governance platform — catalog, lineage, quality, and ownership for your entire data estate.",
    problem:
      "You have data spread across BigQuery and Cloud Storage and no way to know what data exists, who owns it, where it came from, or whether you can trust it.",
    whenToUse: [
      "Building a data catalog so teams can discover and understand data assets",
      "Tracking data lineage (where did this table come from?)",
      "Enforcing data quality rules across BigQuery datasets",
      "Compliance requirements around data ownership and access audit",
    ],
    whenNotToUse: [
      "Detecting or masking PII — use Cloud DLP / Sensitive Data Protection",
    ],
    confusedWith: [
      {
        id: "sensitive-data-protection",
        reason:
          "Dataplex handles governance, catalog, and lineage. Cloud DLP handles finding and masking PII. Both are governance tools but solve different problems.",
      },
    ],
    glossaryTermIds: ["dataplex", "knowledge-catalog", "data-lineage", "data-quality", "metadata"],
  },
  {
    id: "iam",
    name: "IAM",
    category: "governance",
    tagline: "The master access control system — who can do what in GCP.",
    problem:
      "You need to control which users, groups, and service accounts have permission to read, write, or run operations on GCP resources.",
    whenToUse: [
      "Every GCP deployment — IAM is always required",
      "Restricting which users can access which BigQuery datasets or GCS buckets",
      "Granting Dataflow jobs the permissions they need to write to BigQuery",
    ],
    whenNotToUse: [
      "Column-level access control — use Policy Tags",
      "Row-level access control — use BigQuery row access policies",
    ],
    confusedWith: [
      {
        id: "policy-tags",
        reason:
          "IAM controls dataset/table-level access. Policy Tags control individual column access within a table. Both work together for complete security.",
      },
    ],
    glossaryTermIds: ["iam", "policy-tags", "column-level-security", "row-level-security"],
  },
  {
    id: "policy-tags",
    name: "Policy Tags",
    category: "governance",
    tagline: "Lock individual BigQuery columns so only authorized users can see sensitive values.",
    problem:
      "Your table has a mix of public and sensitive columns (e.g., SSN, salary, credit card). You want most users to see the table but hide specific sensitive columns.",
    whenToUse: [
      "Columns containing PII, financial data, or health data",
      "GDPR, HIPAA, PCI-DSS compliance requiring column-level restrictions",
    ],
    whenNotToUse: [
      "Hiding entire tables — use IAM roles instead",
      "Row-level access (who sees which records) — use row access policies",
    ],
    confusedWith: [
      {
        id: "iam",
        reason:
          "IAM controls table/dataset access. Policy Tags control which columns within a table specific users can see. You need both.",
      },
    ],
    glossaryTermIds: ["policy-tags", "column-level-security", "row-level-security", "iam", "pii"],
  },
  {
    id: "sensitive-data-protection",
    name: "Sensitive Data Protection",
    category: "governance",
    tagline: "Automatically scan, classify, and de-identify PII and sensitive data across BigQuery and Cloud Storage.",
    problem:
      "You do not know where PII lives in your data estate, and you need to find it, classify it, and optionally mask or tokenize it before it reaches unauthorized users.",
    whenToUse: [
      "Discovering where PII exists (you may not know)",
      "De-identifying data before sharing with external parties or analysts",
      "Compliance audits that require proving sensitive data is protected",
    ],
    whenNotToUse: [
      "Catalog and lineage — use Dataplex",
      "Column-level access control — use Policy Tags + IAM",
    ],
    confusedWith: [
      {
        id: "dataplex",
        reason:
          "Dataplex handles governance, catalog, and lineage. Sensitive Data Protection (Cloud DLP) handles discovering and masking PII/sensitive content in data.",
      },
    ],
    glossaryTermIds: ["sensitive-data-protection", "pii", "policy-tags", "dataplex"],
  },

  // ─── MONITORING & RELIABILITY ──────────────────────────────────────────────────
  {
    id: "cloud-logging",
    name: "Cloud Logging",
    category: "monitoring",
    tagline: "Centralized log storage and search — read error messages from all your GCP services.",
    problem:
      "A pipeline fails and you need to know why. Cloud Logging collects log output from all GCP services so you can search and read what happened.",
    whenToUse: [
      "Debugging pipeline failures and errors",
      "Auditing who did what and when",
      "Reading tracebacks from Dataflow, Composer, or Cloud Run jobs",
    ],
    whenNotToUse: [
      "Metrics and threshold alerting — use Cloud Monitoring",
    ],
    confusedWith: [
      {
        id: "cloud-monitoring",
        reason:
          "Logging = error text and events. Monitoring = numerical metrics (latency, throughput, error rate). Use Logging to investigate; Monitoring to alert.",
      },
    ],
    glossaryTermIds: ["cloud-logging", "cloud-monitoring", "error-reporting"],
  },
  {
    id: "cloud-monitoring",
    name: "Cloud Monitoring",
    category: "monitoring",
    tagline: "Metrics, dashboards, and alerting — know when your pipeline is slow, failing, or backed up.",
    problem:
      "You need to know when something is wrong before users notice — like a Dataflow job stalling or a Pub/Sub backlog growing.",
    whenToUse: [
      "Setting up alerts for pipeline latency, backlog, or error rate thresholds",
      "Building dashboards for operational health of data infrastructure",
      "Defining SLOs and alerting when they are breached",
    ],
    whenNotToUse: [
      "Reading log messages and error text — use Cloud Logging",
    ],
    confusedWith: [
      {
        id: "cloud-logging",
        reason:
          "Monitoring = numbers over time + alerts. Logging = text events + error messages. Monitoring tells you something is wrong; Logging tells you why.",
      },
    ],
    glossaryTermIds: ["cloud-monitoring", "cloud-logging", "sla", "slo"],
  },
  {
    id: "error-reporting",
    name: "Error Reporting",
    category: "monitoring",
    tagline: "Groups repeated errors from your services and surfaces the most frequent ones.",
    problem:
      "Your Cloud Run or Cloud Function service is throwing errors and you have thousands of log lines. You need to quickly identify the most impactful error without reading every line.",
    whenToUse: [
      "Service-based pipelines (Cloud Run, Cloud Functions) where errors repeat",
      "Quickly triaging: which error is happening most and should be fixed first",
    ],
    whenNotToUse: [
      "Batch Dataflow or BigQuery jobs — those have their own error UIs",
      "Metrics and alerting — use Cloud Monitoring",
    ],
    confusedWith: [
      {
        id: "cloud-logging",
        reason:
          "Logging stores every log line. Error Reporting aggregates and counts repeated error patterns from those logs — it surfaces the most frequent errors so you start with the biggest impact.",
      },
    ],
    glossaryTermIds: ["error-reporting", "cloud-logging", "cloud-monitoring"],
  },

  // ─── AI AGENTS & AUTOMATION ───────────────────────────────────────────────────
  {
    id: "google-adk",
    name: "Google ADK",
    category: "agents",
    tagline: "Open-source toolkit for building AI agents that use tools and take actions.",
    problem:
      "You want to build an AI system that does not just answer questions — it calls real tools (run SQL, check APIs, trigger pipelines) to complete tasks autonomously.",
    whenToUse: [
      "Building agents that query BigQuery, call APIs, or trigger GCP services",
      "Data engineering automation (pipeline investigation, quality monitoring agents)",
      "Natural language interfaces over your data infrastructure",
    ],
    whenNotToUse: [
      "Simple Q&A chatbots — a basic Gemini API call is enough",
      "Standard ML model serving — use a Vertex AI endpoint",
    ],
    confusedWith: [
      {
        id: "agent-platform",
        reason:
          "ADK is the development framework — what you write code with. Agent Platform is the managed runtime — where agents run in production at scale.",
      },
    ],
    glossaryTermIds: ["adk", "tool-calling", "agent-platform", "vertex-ai"],
  },
  {
    id: "agent-platform",
    name: "Agent Platform",
    category: "agents",
    tagline: "Managed production environment for deploying, scaling, and governing AI agents.",
    problem:
      "You have built an agent with ADK and need to deploy it to production where it can handle many concurrent users with isolated sessions, scaling, and monitoring.",
    whenToUse: [
      "Deploying ADK agents to production at scale",
      "When you need managed sessions, memory, and governance for agents",
      "Enterprise environments requiring agent access control and audit trails",
    ],
    whenNotToUse: [
      "Local agent prototyping — run ADK locally without deploying",
    ],
    confusedWith: [
      {
        id: "google-adk",
        reason:
          "ADK = build the agent. Agent Platform = run the agent at scale. You use both together.",
      },
    ],
    glossaryTermIds: ["agent-platform", "adk", "agent-runtime", "agent-sessions"],
  },
  {
    id: "agent-studio",
    name: "Agent Studio",
    category: "agents",
    tagline: "Visual canvas for building agents — drag, drop, and connect components without writing raw code.",
    problem:
      "Your team wants to build agents without deep Python expertise, using a visual interface instead of writing ADK code.",
    whenToUse: [
      "Teams who prefer visual/low-code agent building",
      "Quickly prototyping an agent workflow before coding it",
    ],
    whenNotToUse: [
      "Complex custom agent logic requiring precise code control — use ADK directly",
    ],
    confusedWith: [
      {
        id: "google-adk",
        reason:
          "ADK is code-first. Agent Studio is the visual canvas — like Data Fusion is to Dataflow. Same outcome, different authoring experience.",
      },
    ],
    glossaryTermIds: ["agent-studio", "adk", "agent-platform"],
  },
  {
    id: "agent-garden",
    name: "Agent Garden",
    category: "agents",
    tagline: "Pre-built agent templates — start from a working agent instead of a blank page.",
    problem:
      "Building an agent from scratch takes time. Agent Garden provides ready-made templates for common use cases that you can customize and deploy.",
    whenToUse: [
      "Jumpstarting agent development with proven templates",
      "When a pre-built agent closely matches your use case (SQL assistant, data quality monitor)",
    ],
    whenNotToUse: [
      "Highly custom agent workflows with unique logic — build with ADK directly",
    ],
    confusedWith: [
      {
        id: "model-garden",
        reason:
          "Agent Garden = pre-built agent templates. Model Garden = pre-built AI models. Agents use models — they are different layers.",
      },
    ],
    glossaryTermIds: ["agent-garden", "adk", "agent-platform", "model-garden"],
  },
  {
    id: "model-garden",
    name: "Model Garden",
    category: "agents",
    tagline: "Catalog of AI models — Google, third-party, and open-source — ready to use in your applications.",
    problem:
      "You need to pick the right AI model for your use case without training your own — browsing and deploying from a curated catalog.",
    whenToUse: [
      "Selecting the AI model to power your agent or application",
      "Accessing open-source models (Llama, Mistral) on GCP infrastructure",
      "Comparing models before committing",
    ],
    whenNotToUse: [
      "You need a model trained on your own proprietary data — use Vertex AI Training",
    ],
    confusedWith: [
      {
        id: "agent-garden",
        reason:
          "Model Garden = AI models (the intelligence). Agent Garden = agent templates (the system that uses the intelligence). Pick your model from Model Garden; pick your agent pattern from Agent Garden.",
      },
    ],
    glossaryTermIds: ["model-garden", "vertex-ai", "adk"],
  },
];

export default gcpTools;
