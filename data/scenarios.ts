import type { Scenario } from "@/types/scenarios";

const scenarios: Scenario[] = [
  {
    id: "ecommerce-orders-warehouse",
    title: "E-commerce Orders Data Warehouse",
    difficulty: "beginner",
    category: "storage",
    businessProblem:
      "A growing e-commerce company receives daily order data as CSV exports from their order management system and API feeds from their payment processor. The analytics team wants to analyze customers, products, revenue trends, and return rates — and publish a morning dashboard that business leaders check each day.",
    whatTheProblemIsReallyAsking:
      "This is a batch ETL / ELT problem. Data arrives as files, needs cleaning and modeling, then needs to power dashboards. The question is: what is the right storage layer, transformation approach, and serving layer?",
    availableTools: [
      "cloud-storage",
      "bigquery",
      "dataform",
      "looker-studio",
      "pubsub",
      "dataflow",
      "dataproc",
      "bq-data-transfer",
      "cloud-composer",
      "dataplex",
    ],
    correctTools: ["cloud-storage", "bigquery", "dataform", "looker-studio"],
    correctArchitecture:
      "CSV/API order files → Cloud Storage (landing zone) → BigQuery raw tables (via bq load or Dataform) → Dataform SQL transformations → star schema (fact_orders, dim_customers, dim_products) → Looker Studio dashboard → Dataplex data quality checks",
    architectureSteps: [
      {
        tool: "Cloud Storage",
        role: "Raw file landing zone",
        dataState: "CSV files, JSON API responses — raw and unvalidated",
        watchOut:
          "Files may be malformed, missing, or duplicated. Validate filenames and checksums before loading.",
      },
      {
        tool: "BigQuery",
        role: "Data warehouse — raw and curated tables",
        dataState:
          "Loaded rows in a raw_orders table. After Dataform: cleaned fact_orders and dimension tables.",
        watchOut:
          "Schema mismatches will cause load failures. Define schemas explicitly rather than using auto-detect in production.",
      },
      {
        tool: "Dataform",
        role: "SQL transformation layer",
        dataState:
          "Raw data transformed into star schema: fact_orders, dim_customers, dim_products, dim_dates. Dependencies managed automatically.",
        watchOut:
          "Run data quality assertions after each model. A broken upstream model silently breaks all downstream ones.",
      },
      {
        tool: "Looker Studio",
        role: "Dashboard and reporting layer",
        dataState:
          "Curated BigQuery tables queried on demand. Charts and tables refreshed each morning.",
        watchOut:
          "Looker Studio queries BigQuery directly — large tables without partitioning will be slow and expensive.",
      },
    ],
    toolExplanations: [
      {
        toolId: "cloud-storage",
        toolName: "Cloud Storage",
        isCorrect: true,
        explanation:
          "The correct landing zone for raw CSV and API export files. Durable, cheap, and connects directly to BigQuery for loading.",
      },
      {
        toolId: "bigquery",
        toolName: "BigQuery",
        isCorrect: true,
        explanation:
          "The right data warehouse for this use case. Handles SQL analytics at any scale, supports partitioning and clustering, and connects directly to Looker Studio.",
      },
      {
        toolId: "dataform",
        toolName: "Dataform",
        isCorrect: true,
        explanation:
          "The right SQL transformation tool. Manages dependencies between raw → cleaned → fact/dimension tables, runs data quality tests, and version-controls all SQL.",
      },
      {
        toolId: "looker-studio",
        toolName: "Looker Studio",
        isCorrect: true,
        explanation:
          "The right dashboard tool for a small-to-medium team. Free, connects directly to BigQuery, and easy to share with business stakeholders.",
      },
      {
        toolId: "pubsub",
        toolName: "Pub/Sub",
        isCorrect: false,
        explanation:
          "Wrong for this scenario. Pub/Sub is for real-time event streaming. Order data arriving as daily CSV files is a batch problem — no message queue needed.",
      },
      {
        toolId: "dataflow",
        toolName: "Dataflow",
        isCorrect: false,
        explanation:
          "Overkill for this scenario. Dataflow is for complex code-based or streaming transformations. Here, Dataform handles all transformations with SQL inside BigQuery — simpler and cheaper.",
      },
      {
        toolId: "dataproc",
        toolName: "Dataproc",
        isCorrect: false,
        explanation:
          "Wrong tool. Dataproc runs Spark/Hadoop clusters. There is no Spark code here — this is a SQL/ELT pipeline. Dataform inside BigQuery is far simpler.",
      },
      {
        toolId: "bq-data-transfer",
        toolName: "BigQuery Data Transfer Service",
        isCorrect: false,
        explanation:
          "Not ideal here. BigQuery Data Transfer Service is for recurring loads from SaaS sources (Google Ads, YouTube). For CSV files from an internal system, a direct bq load or Dataform run is more appropriate.",
      },
      {
        toolId: "cloud-composer",
        toolName: "Cloud Composer",
        isCorrect: false,
        explanation:
          "Overkill for this pipeline. Composer (Airflow) is powerful but expensive. For a simple daily load → transform → refresh pipeline, Dataform's built-in scheduling is enough.",
      },
      {
        toolId: "dataplex",
        toolName: "Dataplex",
        isCorrect: false,
        explanation:
          "Useful for governance but not a core pipeline tool. Dataplex would add data quality rules and lineage tracking — valuable in production but not the primary answer to this pipeline design question.",
      },
    ],
    simpleVersion:
      "Files land in Cloud Storage. Load them into BigQuery. Write SQL with Dataform to clean and model the data. Connect Looker Studio to BigQuery for dashboards.",
    productionVersion:
      "Add schema validation before loading. Use BigQuery partitioning (by order_date) and clustering (by customer_id) on fact tables. Add Dataform data quality assertions (no null order IDs, no negative revenue). Set up Cloud Monitoring alerts if the daily load job fails. Use Dataplex for lineage tracking.",
    realJobAnswer:
      "I would land the raw order files in Cloud Storage, load them into BigQuery raw tables, transform them with Dataform into fact and dimension tables, and use Looker or Looker Studio for reporting. I would also add data quality checks to catch missing orders, duplicate order IDs, and negative revenue.",
    relatedTerms: [
      "cloud-storage",
      "bigquery",
      "dataform",
      "elt",
      "star-schema",
      "fact-table",
      "dimension-table",
      "partitioning",
      "data-quality",
    ],
  },

  {
    id: "restaurant-analytics-pipeline",
    title: "MenYou Restaurant Analytics Pipeline",
    difficulty: "intermediate",
    category: "processing",
    businessProblem:
      "A restaurant app (MenYou) wants to analyze menu views, item clicks, recommendation effectiveness, user taste trends, and restaurant performance. Events arrive continuously as users browse the app. The team wants dashboards for restaurant owners and the ability to ask questions like 'Why did the burger category underperform last Tuesday?'",
    whatTheProblemIsReallyAsking:
      "This is a streaming ingestion + batch analytics + AI agent problem. Events are continuous (streaming). Dashboards are batch. Business questions require an intelligent agent. The challenge is selecting the right tools for each layer.",
    availableTools: [
      "pubsub",
      "dataflow",
      "bigquery",
      "dataform",
      "looker-studio",
      "google-adk",
      "dataproc",
      "bq-data-transfer",
      "datastream",
      "cloud-composer",
      "cloud-storage",
    ],
    correctTools: [
      "pubsub",
      "dataflow",
      "bigquery",
      "dataform",
      "looker-studio",
      "google-adk",
    ],
    correctArchitecture:
      "App events → Pub/Sub (event queue) → Dataflow (stream processing: clean, deduplicate, enrich) → BigQuery raw events → Dataform (SQL models: menu_performance, restaurant_summary) → curated tables → Looker Studio dashboards → Google ADK agent for natural language business questions",
    architectureSteps: [
      {
        tool: "Pub/Sub",
        role: "Event ingestion and decoupling",
        dataState:
          "Raw JSON events: { user_id, menu_item_id, event_type, timestamp, restaurant_id }",
        watchOut:
          "Pub/Sub can accumulate a backlog if Dataflow falls behind. Monitor subscription backlog with Cloud Monitoring.",
      },
      {
        tool: "Dataflow",
        role: "Stream processing: clean, deduplicate, enrich",
        dataState:
          "Deduplicated events with restaurant metadata joined. Windowed aggregations (5-minute windows for live stats).",
        watchOut:
          "Late-arriving events need a watermark. Set an appropriate late data window to avoid losing events from slow mobile connections.",
      },
      {
        tool: "BigQuery",
        role: "Event storage and analytics warehouse",
        dataState:
          "raw_events table (partitioned by date). After Dataform: menu_performance, restaurant_summary tables.",
        watchOut:
          "Streaming inserts into BigQuery are more expensive than batch loads. Evaluate whether sub-minute freshness is required.",
      },
      {
        tool: "Dataform",
        role: "SQL transformation and data modeling",
        dataState:
          "Aggregated models: menu item click-through rates, recommendation conversion, restaurant revenue by period.",
        watchOut:
          "Run data quality assertions — if a restaurant's event count suddenly drops to zero, it may be an app bug, not real data.",
      },
      {
        tool: "Looker Studio",
        role: "Restaurant owner dashboards",
        dataState:
          "Curated BigQuery tables: daily menu performance, trend lines, recommendation metrics.",
        watchOut:
          "Restaurant owners are not data engineers. Keep dashboards simple and focused on actionable metrics.",
      },
      {
        tool: "Google ADK",
        role: "Intelligent business question answering",
        dataState:
          "Agent queries BigQuery via tool calls to answer natural language questions about restaurant performance.",
        watchOut:
          "The agent needs tool definitions that map natural language intent to specific BigQuery queries. Start simple.",
      },
    ],
    toolExplanations: [
      {
        toolId: "pubsub",
        toolName: "Pub/Sub",
        isCorrect: true,
        explanation:
          "Correct — the event queue for continuous app events. Decouples the app (producer) from Dataflow (consumer) so neither depends on the other's availability.",
      },
      {
        toolId: "dataflow",
        toolName: "Dataflow",
        isCorrect: true,
        explanation:
          "Correct — the streaming processor. Cleans, deduplicates, and enriches events from Pub/Sub before landing them in BigQuery.",
      },
      {
        toolId: "bigquery",
        toolName: "BigQuery",
        isCorrect: true,
        explanation:
          "Correct — the analytics warehouse. Stores both raw events and curated aggregations that power dashboards and the ADK agent.",
      },
      {
        toolId: "dataform",
        toolName: "Dataform",
        isCorrect: true,
        explanation:
          "Correct — SQL transformation layer inside BigQuery. Transforms raw event rows into restaurant-level performance models.",
      },
      {
        toolId: "looker-studio",
        toolName: "Looker Studio",
        isCorrect: true,
        explanation:
          "Correct — free dashboards for restaurant owners. Connects to BigQuery curated tables and shows menu and revenue metrics.",
      },
      {
        toolId: "google-adk",
        toolName: "Google ADK",
        isCorrect: true,
        explanation:
          "Correct — enables the natural language question answering use case. An ADK agent can call BigQuery, interpret results, and explain why the burger category underperformed.",
      },
      {
        toolId: "dataproc",
        toolName: "Dataproc",
        isCorrect: false,
        explanation:
          "Wrong. Dataproc runs Spark clusters. This pipeline uses Google-native tools (Dataflow, BigQuery). Dataproc would only be relevant if there were existing PySpark code to reuse.",
      },
      {
        toolId: "bq-data-transfer",
        toolName: "BigQuery Data Transfer Service",
        isCorrect: false,
        explanation:
          "Wrong. BigQuery Data Transfer Service loads from SaaS sources (Google Ads, Redshift). App event data is not a supported source — it needs Pub/Sub → Dataflow.",
      },
      {
        toolId: "datastream",
        toolName: "Datastream",
        isCorrect: false,
        explanation:
          "Wrong. Datastream is for CDC from relational databases (MySQL, PostgreSQL). App click events do not come from a database — they come from the application layer via Pub/Sub.",
      },
      {
        toolId: "cloud-composer",
        toolName: "Cloud Composer",
        isCorrect: false,
        explanation:
          "Not needed here. The streaming pipeline (Pub/Sub → Dataflow) runs continuously. Dataform handles scheduled SQL runs. Composer would add cost and complexity without benefit.",
      },
      {
        toolId: "cloud-storage",
        toolName: "Cloud Storage",
        isCorrect: false,
        explanation:
          "Not the primary tool here. Events are streaming (not files) so Cloud Storage is not the right ingestion layer. Pub/Sub handles the event queue instead.",
      },
    ],
    simpleVersion:
      "App events go into Pub/Sub. Dataflow processes them and writes to BigQuery. Dataform models the data. Looker Studio shows dashboards. An ADK agent answers business questions.",
    productionVersion:
      "Add dead-letter queues to Pub/Sub for failed events. Monitor the Dataflow backlog. Partition BigQuery tables by date. Add Dataform quality checks for missing restaurant data. Deploy the ADK agent with role-based access so restaurant owners only see their own data.",
    realJobAnswer:
      "I would send app events into Pub/Sub, process and clean them with Dataflow, store raw and curated event data in BigQuery, use Dataform for SQL transformations, build dashboards in Looker Studio, and optionally add an ADK-powered agent to answer restaurant performance questions.",
    relatedTerms: [
      "pubsub",
      "dataflow",
      "streaming-ingestion",
      "streaming-processing",
      "bigquery",
      "dataform",
      "windowing",
      "deduplication",
      "adk",
      "tool-calling",
    ],
  },

  {
    id: "realtime-clickstream",
    title: "Real-Time Clickstream Pipeline",
    difficulty: "intermediate",
    category: "ingestion",
    businessProblem:
      "A website wants to track user behavior — page views, clicks, scroll depth, conversion events — in near real time. The product team needs to detect drops in conversion rates within minutes, not the next morning. They also want alerts if traffic suddenly spikes or drops.",
    whatTheProblemIsReallyAsking:
      "This is a streaming pipeline problem. The key constraint is freshness — minutes, not hours. The secondary requirement is alerting, which means Cloud Monitoring needs to be part of the design.",
    availableTools: [
      "pubsub",
      "dataflow",
      "bigquery",
      "cloud-monitoring",
      "dataproc",
      "data-fusion",
      "bq-scheduled-queries",
      "cloud-composer",
      "datastream",
      "bq-load",
    ],
    correctTools: ["pubsub", "dataflow", "bigquery", "cloud-monitoring"],
    correctArchitecture:
      "Website events → Pub/Sub (event queue) → Dataflow streaming (clean, deduplicate, 5-min window aggregations) → BigQuery (raw events + windowed summaries) → Looker Studio dashboard → Cloud Monitoring alert policies (fire if conversion rate drops 20% in 10 minutes)",
    architectureSteps: [
      {
        tool: "Pub/Sub",
        role: "Event queue and ingestion buffer",
        dataState:
          "Raw click events as JSON: { session_id, page, event_type, timestamp, user_id }",
        watchOut:
          "Events can arrive out of order (network delays). Pub/Sub retains messages for 7 days by default — tune retention based on your recovery needs.",
      },
      {
        tool: "Dataflow",
        role: "Streaming processor with windowing",
        dataState:
          "Events deduplicated by session_id + event_type + timestamp. 5-minute tumbling window aggregations: page_views, clicks, conversions per window.",
        watchOut:
          "Deduplication requires stateful processing — Dataflow's GroupByKey handles this but has memory cost at high scale.",
      },
      {
        tool: "BigQuery",
        role: "Storage for raw events and windowed summaries",
        dataState:
          "Two tables: raw_clickstream (every event, partitioned by date) and clickstream_windows (5-min aggregations for dashboards).",
        watchOut:
          "Streaming inserts cost more than batch loads. For budget-sensitive setups, consider using Dataflow to write to Cloud Storage and batch-load every 5 minutes.",
      },
      {
        tool: "Cloud Monitoring",
        role: "Alert system for conversion rate changes",
        dataState:
          "Metrics exported from BigQuery or from Dataflow custom metrics. Alert fires when conversion_rate drops below threshold.",
        watchOut:
          "Alert thresholds need tuning — too sensitive and you get false alarms; too loose and you miss real drops.",
      },
    ],
    toolExplanations: [
      {
        toolId: "pubsub",
        toolName: "Pub/Sub",
        isCorrect: true,
        explanation:
          "Correct. Pub/Sub is the right ingestion point for high-volume website events. It decouples the website from the processing pipeline and buffers events if Dataflow is temporarily slower.",
      },
      {
        toolId: "dataflow",
        toolName: "Dataflow",
        isCorrect: true,
        explanation:
          "Correct. Dataflow is Google's native streaming processor. It handles deduplication, windowing (5-minute aggregations), and writes to BigQuery in near real time.",
      },
      {
        toolId: "bigquery",
        toolName: "BigQuery",
        isCorrect: true,
        explanation:
          "Correct. BigQuery stores both raw events and windowed summaries. Dashboards query the summaries. Historical analysis uses raw events.",
      },
      {
        toolId: "cloud-monitoring",
        toolName: "Cloud Monitoring",
        isCorrect: true,
        explanation:
          "Correct for the alerting requirement. Cloud Monitoring can watch metrics derived from your pipeline and fire alerts if conversion rates drop or traffic anomalies appear.",
      },
      {
        toolId: "dataproc",
        toolName: "Dataproc",
        isCorrect: false,
        explanation:
          "Wrong. Dataproc runs Spark clusters for batch or Spark Streaming workloads. Dataflow is Google's native managed streaming tool — simpler and serverless. Only use Dataproc if you have existing Spark code.",
      },
      {
        toolId: "data-fusion",
        toolName: "Data Fusion",
        isCorrect: false,
        explanation:
          "Wrong. Data Fusion is a visual ETL tool — primarily for batch pipelines. It is not designed for high-throughput real-time streaming at clickstream scale.",
      },
      {
        toolId: "bq-scheduled-queries",
        toolName: "BigQuery Scheduled Queries",
        isCorrect: false,
        explanation:
          "Wrong. Scheduled Queries run on a timer — minimum every 15 minutes. This scenario requires minute-level freshness. Batch scheduled queries cannot meet that requirement.",
      },
      {
        toolId: "cloud-composer",
        toolName: "Cloud Composer",
        isCorrect: false,
        explanation:
          "Wrong. Composer (Airflow) is an orchestrator for batch pipelines. A streaming pipeline runs continuously — there is nothing to schedule or orchestrate on a timer.",
      },
      {
        toolId: "datastream",
        toolName: "Datastream",
        isCorrect: false,
        explanation:
          "Wrong. Datastream does CDC from relational databases. Website click events are not database changes — they are application events pushed via Pub/Sub.",
      },
      {
        toolId: "bq-load",
        toolName: "bq load / LOAD DATA",
        isCorrect: false,
        explanation:
          "Wrong for this requirement. bq load is a batch load command. The requirement is minute-level freshness — streaming with Dataflow is the right path.",
      },
    ],
    simpleVersion:
      "Website fires events → Pub/Sub catches them → Dataflow cleans and aggregates them → BigQuery stores them → Cloud Monitoring alerts if something looks wrong.",
    productionVersion:
      "Add Pub/Sub dead-letter queues for failed events. Monitor the Pub/Sub subscription backlog. Use Dataflow autoscaling. Partition BigQuery tables by date and cluster by page_url. Set up PagerDuty integration with Cloud Monitoring. Add a Dataform model for daily summary tables used by the morning dashboard.",
    realJobAnswer:
      "I would use Pub/Sub to ingest clickstream events, Dataflow to clean, deduplicate, and window the streaming data, BigQuery to store queryable results, and Cloud Monitoring to alert if traffic or conversion metrics suddenly change.",
    relatedTerms: [
      "pubsub",
      "dataflow",
      "streaming-processing",
      "windowing",
      "deduplication",
      "bigquery",
      "cloud-monitoring",
      "sla",
      "slo",
    ],
  },

  {
    id: "cdc-postgresql-to-bigquery",
    title: "Operational Database to Analytics with CDC",
    difficulty: "intermediate",
    category: "ingestion",
    businessProblem:
      "A company has a PostgreSQL operational database that contains orders, customers, and inventory. The analytics team wants near-real-time dashboards in BigQuery that reflect database changes — including updates and deletes, not just new inserts. Nightly bulk exports have caused too many reporting delays.",
    whatTheProblemIsReallyAsking:
      "This is a CDC (Change Data Capture) problem. The key requirement is that UPDATES and DELETES from the operational database must be reflected in BigQuery — a nightly export only captures inserts. Datastream is the purpose-built GCP tool for this.",
    availableTools: [
      "datastream",
      "bigquery",
      "dataform",
      "bq-data-transfer",
      "pubsub",
      "dataflow",
      "cloud-composer",
      "bq-load",
      "looker-studio",
      "storage-transfer",
    ],
    correctTools: ["datastream", "bigquery", "dataform"],
    correctArchitecture:
      "Cloud SQL PostgreSQL → Datastream (CDC: captures every insert/update/delete) → BigQuery raw replica tables → Dataform (SQL models: cleaned orders, customers, inventory) → analytics dashboard",
    architectureSteps: [
      {
        tool: "Datastream",
        role: "CDC replication from PostgreSQL to BigQuery",
        dataState:
          "Every DML event from PostgreSQL: INSERT, UPDATE, DELETE captured with a change timestamp. Data lands in BigQuery as a changelog or merged table.",
        watchOut:
          "The source database needs replication enabled (pglogical for PostgreSQL). Work with the database team before setting up Datastream.",
      },
      {
        tool: "BigQuery",
        role: "Analytics warehouse with replicated data",
        dataState:
          "Raw replica of PostgreSQL tables, continuously updated. Datastream writes change events that BigQuery merges into a current-state view.",
        watchOut:
          "BigQuery is append-optimized. For UPDATE and DELETE handling, use BigQuery merge operations or let Datastream's native BigQuery destination handle it.",
      },
      {
        tool: "Dataform",
        role: "SQL transformation and analytics modeling",
        dataState:
          "Clean, reconciled analytics tables: orders with customer names joined, inventory with category rollups. Ready for dashboards.",
        watchOut:
          "Dataform models run on a schedule. They will always be slightly behind the live Datastream feed. Design SLAs around Dataform's run frequency.",
      },
    ],
    toolExplanations: [
      {
        toolId: "datastream",
        toolName: "Datastream",
        isCorrect: true,
        explanation:
          "Correct and purpose-built for this. Datastream does CDC from PostgreSQL (and MySQL, Oracle) — capturing every insert, update, and delete and replicating them to BigQuery continuously.",
      },
      {
        toolId: "bigquery",
        toolName: "BigQuery",
        isCorrect: true,
        explanation:
          "Correct. BigQuery is the analytics destination. Datastream writes the replicated data here. Dataform then transforms it into analytics-ready tables.",
      },
      {
        toolId: "dataform",
        toolName: "Dataform",
        isCorrect: true,
        explanation:
          "Correct. After Datastream lands raw change data in BigQuery, Dataform runs SQL transformations to produce clean, joined, analytics-ready tables.",
      },
      {
        toolId: "bq-data-transfer",
        toolName: "BigQuery Data Transfer Service",
        isCorrect: false,
        explanation:
          "Wrong. BigQuery Data Transfer Service handles scheduled batch loads from SaaS sources (Google Ads, Redshift). It cannot connect to a live PostgreSQL database for CDC.",
      },
      {
        toolId: "pubsub",
        toolName: "Pub/Sub",
        isCorrect: false,
        explanation:
          "Wrong for this use case. Pub/Sub is for application-level events. Datastream reads directly from the PostgreSQL replication log — which is a database-level mechanism, not an application event.",
      },
      {
        toolId: "dataflow",
        toolName: "Dataflow",
        isCorrect: false,
        explanation:
          "Not the primary tool. Dataflow could be used to process Datastream output, but Datastream already has a direct BigQuery destination. Adding Dataflow here adds complexity without clear benefit.",
      },
      {
        toolId: "cloud-composer",
        toolName: "Cloud Composer",
        isCorrect: false,
        explanation:
          "Not needed. Datastream runs continuously — there is no batch schedule to orchestrate. Dataform has its own scheduler. Composer would add cost without value here.",
      },
      {
        toolId: "bq-load",
        toolName: "bq load / LOAD DATA",
        isCorrect: false,
        explanation:
          "This is exactly what the team is trying to move away from. bq load requires a full export, misses updates and deletes between runs, and creates reporting delays.",
      },
      {
        toolId: "looker-studio",
        toolName: "Looker Studio",
        isCorrect: false,
        explanation:
          "Not a pipeline tool. Looker Studio is the serving layer but not part of the ingestion or transformation pipeline. It would be selected when describing the full architecture, but it is not the answer to the core problem.",
      },
      {
        toolId: "storage-transfer",
        toolName: "Storage Transfer Service",
        isCorrect: false,
        explanation:
          "Wrong. Storage Transfer Service moves files between storage buckets (S3 → GCS). It cannot connect to a live PostgreSQL database.",
      },
    ],
    simpleVersion:
      "Datastream watches the PostgreSQL database and streams every change (insert, update, delete) into BigQuery in near real time. Dataform then transforms the raw changes into analytics tables.",
    productionVersion:
      "Enable PostgreSQL logical replication before setting up Datastream. Monitor Datastream lag with Cloud Monitoring. Use BigQuery's native Datastream destination for automatic merge handling. Add Dataform quality checks to detect schema drift. Set SLO: analytics tables refreshed within 15 minutes of source changes.",
    realJobAnswer:
      "I would use Datastream for CDC so inserts, updates, and deletes from PostgreSQL are replicated into BigQuery or Cloud Storage. Then I would use Dataform to transform the replicated data into analytics tables and serve dashboards from BigQuery.",
    relatedTerms: [
      "datastream",
      "change-data-capture",
      "bigquery",
      "dataform",
      "streaming-ingestion",
      "elt",
      "batch-ingestion",
    ],
  },

  {
    id: "governance-pii-detection",
    title: "Governance and PII Detection Project",
    difficulty: "advanced",
    category: "governance",
    businessProblem:
      "A company has customer data spread across BigQuery datasets and Cloud Storage buckets. Legal has flagged a compliance requirement: identify all PII (names, emails, SSNs, phone numbers), restrict who can see sensitive columns, track where data flows across the platform, and produce an audit trail for regulators.",
    whatTheProblemIsReallyAsking:
      "This is a multi-layer governance problem. You need to: (1) find PII you may not know about, (2) restrict access to it at the column level, (3) control who can see tables at all, and (4) track data lineage. Each requirement maps to a different GCP tool.",
    availableTools: [
      "sensitive-data-protection",
      "policy-tags",
      "iam",
      "dataplex",
      "cloud-logging",
      "cloud-monitoring",
      "dataflow",
      "bigquery-ml",
      "dataform",
      "datastream",
    ],
    correctTools: ["sensitive-data-protection", "policy-tags", "iam", "dataplex"],
    correctArchitecture:
      "Sensitive Data Protection scans BigQuery tables and Cloud Storage → identifies PII columns → policy tags applied to sensitive columns → IAM controls dataset/table access → Dataplex/Knowledge Catalog catalogs all assets with lineage → BigQuery authorized views for safe downstream access",
    architectureSteps: [
      {
        tool: "Sensitive Data Protection",
        role: "Scan and classify PII across datasets and buckets",
        dataState:
          "Inspection job runs across BigQuery tables and Cloud Storage files. Output: a finding report listing columns and files that contain PII, by type (EMAIL, PHONE_NUMBER, US_SSN, etc.).",
        watchOut:
          "DLP scans cost money per GB scanned. Prioritize high-risk datasets first. Re-scan quarterly as data evolves.",
      },
      {
        tool: "Policy Tags",
        role: "Column-level access control on sensitive BigQuery columns",
        dataState:
          "PII columns (email, ssn, phone) are tagged. Users without the Fine-grained Reader role see NULL instead of real values when they query.",
        watchOut:
          "Policy tags only work on native BigQuery tables — not on external tables or BigLake tables directly. Plan your table architecture accordingly.",
      },
      {
        tool: "IAM",
        role: "Resource-level access control (datasets, tables, buckets)",
        dataState:
          "Roles assigned: analysts get BigQuery Data Viewer on the analytics dataset. PII readers get Fine-grained Reader on the PII taxonomy. Service accounts get minimum required roles.",
        watchOut:
          "Overly permissive IAM roles (BigQuery Admin, Project Editor) are common mistakes. Audit IAM bindings regularly and apply the principle of least privilege.",
      },
      {
        tool: "Dataplex",
        role: "Data catalog, lineage tracking, and ownership governance",
        dataState:
          "All BigQuery tables and Cloud Storage buckets cataloged. Lineage shows: raw_customers → cleaned_customers → analytics_customers → revenue_dashboard. Each asset has an owner.",
        watchOut:
          "Lineage is only automatically tracked for supported services (BigQuery, Dataflow). Custom pipelines may need manual lineage tagging.",
      },
    ],
    toolExplanations: [
      {
        toolId: "sensitive-data-protection",
        toolName: "Sensitive Data Protection (Cloud DLP)",
        isCorrect: true,
        explanation:
          "Correct and essential. This is the tool that finds PII you may not know about. It scans BigQuery and Cloud Storage and tells you exactly which columns contain sensitive data.",
      },
      {
        toolId: "policy-tags",
        toolName: "Policy Tags",
        isCorrect: true,
        explanation:
          "Correct. After DLP identifies sensitive columns, policy tags enforce who can actually see those column values. Without policy tags, data is classified but not protected.",
      },
      {
        toolId: "iam",
        toolName: "IAM",
        isCorrect: true,
        explanation:
          "Correct. IAM controls resource-level access (who can see the dataset, who can query the table). It works alongside policy tags, which add column-level granularity.",
      },
      {
        toolId: "dataplex",
        toolName: "Dataplex",
        isCorrect: true,
        explanation:
          "Correct. Dataplex provides the catalog (what data exists), lineage (where it came from and where it flows), and governance dashboard — exactly what regulators want to see.",
      },
      {
        toolId: "cloud-logging",
        toolName: "Cloud Logging",
        isCorrect: false,
        explanation:
          "Useful for audit trails but not a governance tool. Cloud Logging records who queried what, but it cannot classify PII, restrict column access, or catalog assets. Use it alongside the correct tools.",
      },
      {
        toolId: "cloud-monitoring",
        toolName: "Cloud Monitoring",
        isCorrect: false,
        explanation:
          "Not a governance tool. Cloud Monitoring tracks pipeline metrics and fires alerts. It does not help with PII detection, access control, or lineage.",
      },
      {
        toolId: "dataflow",
        toolName: "Dataflow",
        isCorrect: false,
        explanation:
          "Not the right tool for this problem. Dataflow processes data — it does not govern it. You could use Dataflow to run DLP de-identification as part of a pipeline, but that is a different scenario.",
      },
      {
        toolId: "bigquery-ml",
        toolName: "BigQuery ML",
        isCorrect: false,
        explanation:
          "Wrong. BigQuery ML trains ML models. It has no role in PII detection, access control, or data governance.",
      },
      {
        toolId: "dataform",
        toolName: "Dataform",
        isCorrect: false,
        explanation:
          "Not the right tool here. Dataform transforms data with SQL. It does not scan for PII, enforce column access, or catalog assets.",
      },
      {
        toolId: "datastream",
        toolName: "Datastream",
        isCorrect: false,
        explanation:
          "Wrong. Datastream does CDC replication from databases. It has no role in governance, PII detection, or access control.",
      },
    ],
    simpleVersion:
      "DLP scans your data and finds PII. Policy tags lock those columns. IAM controls who can see the tables. Dataplex catalogs everything and shows the lineage trail.",
    productionVersion:
      "Run DLP scans on a schedule (quarterly or after new data sources). Use a policy tag taxonomy with multiple sensitivity levels (PII, PCI, HIPAA). Create authorized BigQuery views that only expose non-sensitive columns to analysts. Set up Cloud Logging data access logs for the audit trail. Use Dataplex data quality rules to verify PII columns are properly tagged.",
    realJobAnswer:
      "I would scan the customer data with Sensitive Data Protection to detect PII, use policy tags and BigQuery access controls to restrict sensitive columns, use Dataplex and Knowledge Catalog for metadata and lineage, and create authorized views for safe downstream access.",
    relatedTerms: [
      "sensitive-data-protection",
      "pii",
      "policy-tags",
      "column-level-security",
      "row-level-security",
      "iam",
      "dataplex",
      "data-lineage",
      "data-quality",
    ],
  },

  {
    id: "saas-marketing-pipeline",
    title: "SaaS Marketing Data Pipeline",
    difficulty: "beginner",
    category: "ingestion",
    businessProblem:
      "A marketing team wants Google Ads, YouTube Analytics, and Campaign Manager data automatically loaded into BigQuery every week. They currently download CSV reports manually and upload them to Google Sheets — a painful, error-prone process. They want a dashboard that automatically shows campaign performance without manual work.",
    whatTheProblemIsReallyAsking:
      "This is a managed SaaS ingestion problem. The data sources (Google Ads, YouTube) are supported native connectors. The question is recognizing that BigQuery Data Transfer Service is purpose-built for exactly this — no custom pipeline needed.",
    availableTools: [
      "bq-data-transfer",
      "bigquery",
      "dataform",
      "looker-studio",
      "pubsub",
      "dataflow",
      "cloud-composer",
      "storage-transfer",
      "datastream",
      "bq-load",
    ],
    correctTools: ["bq-data-transfer", "bigquery", "dataform", "looker-studio"],
    correctArchitecture:
      "Google Ads / YouTube / Campaign Manager → BigQuery Data Transfer Service (scheduled, automatic) → BigQuery raw tables → Dataform SQL models (campaign_performance, channel_comparison) → Looker Studio campaign dashboard",
    architectureSteps: [
      {
        tool: "BigQuery Data Transfer Service",
        role: "Automated, scheduled load from Google marketing sources",
        dataState:
          "Raw Google Ads data: campaigns, ad groups, keywords, impressions, clicks, costs. Delivered to BigQuery tables on a daily or weekly schedule.",
        watchOut:
          "Transfer Service uses the schema defined by Google — you cannot change the raw table structure. Plan your Dataform models to work around Google's schema.",
      },
      {
        tool: "BigQuery",
        role: "Data warehouse for all marketing data",
        dataState:
          "Raw tables: ads_Ads, ads_CampaignStats, youtube_ChannelStatistics. After Dataform: unified campaign_performance table.",
        watchOut:
          "Google Ads and YouTube use different schemas. Dataform models must join and reconcile them carefully.",
      },
      {
        tool: "Dataform",
        role: "SQL modeling: unify and clean marketing data",
        dataState:
          "Unified campaign performance model: all channels (Ads, YouTube) in one table with consistent metrics. Calculated fields: cost per click, conversion rate, ROAS.",
        watchOut:
          "Marketing metrics are tricky — 'conversion' means different things in Google Ads vs YouTube. Define terms precisely in Dataform model documentation.",
      },
      {
        tool: "Looker Studio",
        role: "Campaign performance dashboard",
        dataState:
          "Curated BigQuery tables drive charts: weekly spend, impressions, click-through rate, conversion funnel.",
        watchOut:
          "Looker Studio refreshes on page load. For weekly data, this is fine. If the team needs hourly data, revisit the Transfer Service schedule.",
      },
    ],
    toolExplanations: [
      {
        toolId: "bq-data-transfer",
        toolName: "BigQuery Data Transfer Service",
        isCorrect: true,
        explanation:
          "Correct and purpose-built. Google Ads, YouTube, and Campaign Manager are all supported native connectors in BigQuery Data Transfer Service. No custom pipeline needed — configure it and the data loads automatically.",
      },
      {
        toolId: "bigquery",
        toolName: "BigQuery",
        isCorrect: true,
        explanation:
          "Correct. BigQuery is the warehouse where all marketing data lands and gets analyzed.",
      },
      {
        toolId: "dataform",
        toolName: "Dataform",
        isCorrect: true,
        explanation:
          "Correct. After raw data loads, Dataform SQL models clean, unify, and calculate derived metrics (ROAS, CPC) across channels.",
      },
      {
        toolId: "looker-studio",
        toolName: "Looker Studio",
        isCorrect: true,
        explanation:
          "Correct. Free dashboards connected to BigQuery — exactly right for a marketing team wanting self-service campaign reporting.",
      },
      {
        toolId: "pubsub",
        toolName: "Pub/Sub",
        isCorrect: false,
        explanation:
          "Wrong. Pub/Sub is for real-time application events. Google Ads data is exported on a schedule — not a real-time stream. This is a batch problem.",
      },
      {
        toolId: "dataflow",
        toolName: "Dataflow",
        isCorrect: false,
        explanation:
          "Overkill. BigQuery Data Transfer Service handles the ingestion automatically. Dataflow would require writing custom code for something that is already a managed, no-code connector.",
      },
      {
        toolId: "cloud-composer",
        toolName: "Cloud Composer",
        isCorrect: false,
        explanation:
          "Overkill. Composer is for complex multi-step pipelines with dependencies. BigQuery Data Transfer Service has its own built-in scheduler. Adding Composer here creates unnecessary cost and complexity.",
      },
      {
        toolId: "storage-transfer",
        toolName: "Storage Transfer Service",
        isCorrect: false,
        explanation:
          "Wrong. Storage Transfer Service moves files between cloud storage buckets. Google Ads data is not accessed via a file bucket — it has a native BigQuery connector.",
      },
      {
        toolId: "datastream",
        toolName: "Datastream",
        isCorrect: false,
        explanation:
          "Wrong. Datastream does CDC from relational databases. Google Ads is a SaaS API source, not a database.",
      },
      {
        toolId: "bq-load",
        toolName: "bq load / LOAD DATA",
        isCorrect: false,
        explanation:
          "This is what the team was doing manually (downloading CSVs and uploading). BigQuery Data Transfer Service automates this entirely — bq load would still require manual file downloads.",
      },
    ],
    simpleVersion:
      "Configure BigQuery Data Transfer Service for Google Ads and YouTube. Data loads into BigQuery automatically. Dataform cleans it. Looker Studio shows the dashboard.",
    productionVersion:
      "Set transfer frequency to daily. Add Dataform assertions to catch missing data (if yesterday's Google Ads data did not arrive). Set up a Cloud Monitoring alert if the Transfer Service job fails. Document which Google Ads account IDs are connected so the team can audit coverage.",
    realJobAnswer:
      "I would use BigQuery Data Transfer Service for supported marketing sources so the data loads into BigQuery on a schedule. Then I would use Dataform to clean and model the data and Looker or Looker Studio to build campaign performance dashboards.",
    relatedTerms: [
      "bigquery-data-transfer-service",
      "batch-ingestion",
      "bigquery",
      "dataform",
      "elt",
      "data-quality",
    ],
  },

  {
    id: "file-migration-data-lake",
    title: "File Migration and Data Lake Setup",
    difficulty: "beginner",
    category: "storage",
    businessProblem:
      "A company has 3 years of historical data files (Parquet and CSV) stored in AWS S3 and on-premises NAS storage. They are moving to Google Cloud and want to: (1) get all files into GCS, (2) make them queryable with SQL, and (3) keep Cloud Storage as the long-term raw data lake without always copying files into native BigQuery tables.",
    whatTheProblemIsReallyAsking:
      "This is a file migration + lakehouse architecture problem. Storage Transfer Service handles the move. Cloud Storage becomes the lake. BigLake or external tables provide SQL access without a full load into BigQuery native tables.",
    availableTools: [
      "storage-transfer",
      "cloud-storage",
      "biglake",
      "bigquery",
      "datastream",
      "pubsub",
      "dataflow",
      "bq-data-transfer",
      "dataproc",
      "bq-load",
    ],
    correctTools: ["storage-transfer", "cloud-storage", "biglake", "bigquery"],
    correctArchitecture:
      "AWS S3 / on-prem NAS → Storage Transfer Service (bulk file migration) → Cloud Storage (raw data lake) → BigLake (governed external tables with SQL access) → BigQuery analysis (SQL queries, joining BigLake with native tables)",
    architectureSteps: [
      {
        tool: "Storage Transfer Service",
        role: "Bulk file migration from S3 and on-prem to GCS",
        dataState:
          "Files in AWS S3 or NAS: 3 years of Parquet and CSV files. After transfer: same files mirrored in GCS buckets with original directory structure preserved.",
        watchOut:
          "Large migrations can take days. Plan the transfer schedule to avoid interfering with on-prem operations. Use incremental transfers for ongoing sync before cutover.",
      },
      {
        tool: "Cloud Storage",
        role: "Raw data lake — permanent home for all files",
        dataState:
          "All historical files organized by year/month/day in GCS buckets. Cost-optimized with lifecycle policies (Nearline for files >30 days old, Coldline for >90 days).",
        watchOut:
          "Organize buckets carefully at the start — reorganizing GCS paths later requires copying all files. Define a standard naming convention before migration.",
      },
      {
        tool: "BigLake",
        role: "Governed SQL access to Cloud Storage files",
        dataState:
          "Parquet and CSV files in GCS are queryable via BigQuery SQL using BigLake external tables. Column-level security can be applied. Data stays in GCS — no copy into BigQuery native storage.",
        watchOut:
          "BigLake queries are slower than native BigQuery tables for frequently accessed data. If a dataset is queried daily, consider loading it into native BigQuery storage.",
      },
      {
        tool: "BigQuery",
        role: "Analytics engine — queries BigLake tables and native tables",
        dataState:
          "BigQuery SQL queries join BigLake (historical GCS files) with native BigQuery tables (recent processed data). Analysts use one SQL interface for everything.",
        watchOut:
          "External tables (BigLake) do not support DML (UPDATE, DELETE). Design your lakehouse architecture around append-only patterns for files.",
      },
    ],
    toolExplanations: [
      {
        toolId: "storage-transfer",
        toolName: "Storage Transfer Service",
        isCorrect: true,
        explanation:
          "Correct and purpose-built for bulk file migration. Storage Transfer Service handles large transfers from AWS S3 and on-premises systems to GCS reliably, with retries and scheduling.",
      },
      {
        toolId: "cloud-storage",
        toolName: "Cloud Storage",
        isCorrect: true,
        explanation:
          "Correct. Cloud Storage is the raw data lake. All files land here permanently. It is cheap, durable, and the foundation of a GCP data lake architecture.",
      },
      {
        toolId: "biglake",
        toolName: "BigLake",
        isCorrect: true,
        explanation:
          "Correct for the 'query without loading' requirement. BigLake provides governed SQL access to GCS files via BigQuery without copying them into native BigQuery storage.",
      },
      {
        toolId: "bigquery",
        toolName: "BigQuery",
        isCorrect: true,
        explanation:
          "Correct as the analytics engine. BigQuery runs SQL queries against BigLake tables and provides the interface analysts use for all analysis.",
      },
      {
        toolId: "datastream",
        toolName: "Datastream",
        isCorrect: false,
        explanation:
          "Wrong. Datastream does CDC from relational databases. Files in AWS S3 or on-premises NAS are not relational databases — they are object storage.",
      },
      {
        toolId: "pubsub",
        toolName: "Pub/Sub",
        isCorrect: false,
        explanation:
          "Wrong. Pub/Sub is for real-time event streaming. Moving historical files is a one-time bulk migration — no message queue is needed.",
      },
      {
        toolId: "dataflow",
        toolName: "Dataflow",
        isCorrect: false,
        explanation:
          "Not the right tool for file migration. Dataflow transforms data — it does not move files between cloud systems. Storage Transfer Service handles the migration.",
      },
      {
        toolId: "bq-data-transfer",
        toolName: "BigQuery Data Transfer Service",
        isCorrect: false,
        explanation:
          "Wrong for this use case. BigQuery Data Transfer Service loads from SaaS sources and S3 INTO BigQuery. The requirement here is to keep files in GCS as the lake — not to load everything into native BigQuery tables.",
      },
      {
        toolId: "dataproc",
        toolName: "Dataproc",
        isCorrect: false,
        explanation:
          "Overkill. Dataproc runs Spark clusters. File migration does not require a Spark job. Storage Transfer Service handles it with no code.",
      },
      {
        toolId: "bq-load",
        toolName: "bq load / LOAD DATA",
        isCorrect: false,
        explanation:
          "Not ideal for the full requirement. bq load copies files INTO native BigQuery storage — but the requirement is to keep Cloud Storage as the long-term lake and query it externally via BigLake.",
      },
    ],
    simpleVersion:
      "Storage Transfer Service moves the files from S3 to GCS. Cloud Storage is the lake. BigLake lets you query the GCS files with SQL from BigQuery.",
    productionVersion:
      "Use Storage Transfer Service with scheduled incremental syncs before the cutover date. Set up GCS lifecycle policies to move cold files to Nearline/Coldline storage. Create a BigLake connection with appropriate IAM. Apply column-level policy tags to any sensitive columns in the Parquet files. Monitor Storage Transfer Service job status with Cloud Monitoring.",
    realJobAnswer:
      "I would use Storage Transfer Service to move files into Cloud Storage, keep Cloud Storage as the raw data lake layer, and use external tables or BigLake to query the data from BigQuery without always copying it into native BigQuery tables.",
    relatedTerms: [
      "storage-transfer-service",
      "cloud-storage",
      "biglake",
      "external-tables",
      "data-lake",
      "lakehouse",
      "federated-query",
    ],
  },
];

export default scenarios;
