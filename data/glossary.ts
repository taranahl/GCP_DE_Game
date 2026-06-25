import type { GlossaryTerm } from "@/types/glossary";

const glossaryTerms: GlossaryTerm[] = [
  // ─── STORAGE & WAREHOUSE ────────────────────────────────────────────────────
  {
    id: "cloud-storage",
    term: "Cloud Storage",
    aliases: ["GCS", "Google Cloud Storage"],
    category: "storage",
    generalDefinition:
      "A place to store files cheaply at massive scale — like a giant filing cabinet in the cloud. You can store any kind of file: CSVs, images, videos, JSON logs, Parquet files.",
    gcpDefinition:
      "Google Cloud Storage is GCP's object storage service. It is the standard raw storage layer for data lakes — files land here before they are processed or loaded into BigQuery.",
    simplerExplanation:
      "Think of it as Google Drive for your data pipeline. Files go in, files come out. It is cheap, durable, and has no schema — it just stores bytes.",
    gcpExample:
      "gs://my-company-raw-data/orders/2024-01-15/orders.parquet",
    whenToUse: [
      "Storing raw CSV, JSON, Parquet, Avro files before processing",
      "Landing zone for data from vendors or external systems",
      "Storing pipeline outputs (intermediate or final files)",
      "Cheap long-term archive storage",
      "Staging area before BigQuery load",
    ],
    whenNotToUse: [
      "Running SQL analytics on the data — use BigQuery instead",
      "Storing individual row lookups (low-latency reads) — use Bigtable or Firestore",
      "Relational data with transactions — use Cloud SQL",
    ],
    example:
      "A vendor sends a CSV file of daily orders → it lands in Cloud Storage → Dataflow reads it → loads it into BigQuery.",
    relatedTerms: ["bigquery", "biglake", "external-tables", "data-lake", "dataflow"],
    memoryShortcut:
      "Cloud Storage = the filing cabinet. Cheap, flexible, no schema. Everything starts here.",
    commonConfusion:
      "Often confused with BigQuery. Cloud Storage stores files (any format). BigQuery stores structured tables for SQL analytics. You load FROM Cloud Storage INTO BigQuery.",
    gcpConsoleLocation: "GCP Console → Cloud Storage → Buckets",
  },
  {
    id: "bigquery",
    term: "BigQuery",
    aliases: ["BQ"],
    category: "storage",
    generalDefinition:
      "A serverless analytics warehouse — a database built specifically for running fast SQL queries over huge amounts of data without managing any servers. You write SQL, BigQuery handles the rest.",
    gcpDefinition:
      "BigQuery is GCP's managed analytics warehouse. It separates storage from compute, which means you pay only when you query. It handles petabyte-scale tables and can run complex analytics in seconds.",
    simplerExplanation:
      "BigQuery is like a supercharged spreadsheet that can hold billions of rows and still return answers in seconds. You query it with SQL — no setup, no servers.",
    gcpExample:
      "SELECT customer_id, SUM(amount) FROM orders.fact_orders WHERE date = '2024-01-15' GROUP BY customer_id",
    whenToUse: [
      "SQL analytics over large datasets",
      "Dashboard and reporting tables",
      "Cleaned, curated business data",
      "Ad hoc analyst queries",
      "Large-scale aggregations",
    ],
    whenNotToUse: [
      "Individual row lookups (BigQuery is not a transactional database)",
      "Storing raw unprocessed files — use Cloud Storage instead",
      "High-frequency writes (thousands of inserts per second) — use Bigtable",
      "Complex joins on unstructured data",
    ],
    example:
      "All cleaned order data lives in BigQuery → analysts run SQL → Looker Studio reads results → dashboard refreshes.",
    relatedTerms: ["cloud-storage", "biglake", "external-tables", "dataform", "bigquery-ml"],
    memoryShortcut:
      "BigQuery = the analytics engine. Curated, queryable, fast SQL. Data lives here after it is cleaned.",
    commonConfusion:
      "Confused with Cloud Storage. Cloud Storage holds raw files. BigQuery holds structured tables for analytics. Load FROM Cloud Storage INTO BigQuery.",
    gcpConsoleLocation: "GCP Console → BigQuery → SQL Workspace",
  },
  {
    id: "biglake",
    term: "BigLake",
    aliases: [],
    category: "storage",
    generalDefinition:
      "A way to query files stored in a data lake (like Cloud Storage) but with the governance and access controls you normally only get in a proper data warehouse.",
    gcpDefinition:
      "BigLake lets you query Parquet, ORC, and other files in Cloud Storage or other object stores using BigQuery's engine, while applying fine-grained security (column-level, row-level) as if the data were inside BigQuery.",
    simplerExplanation:
      "Imagine your files stay in Cloud Storage (cheap storage), but BigQuery treats them like its own tables with all the security rules attached. That is BigLake.",
    gcpExample:
      "CREATE EXTERNAL TABLE my_dataset.orders OPTIONS (format='PARQUET', uris=['gs://raw-data/orders/*.parquet']); -- then apply policy tags for column security",
    whenToUse: [
      "Data physically lives in Cloud Storage but you need BigQuery-style governance",
      "You want to apply column-level or row-level security to files in a lake",
      "Building a governed lakehouse architecture",
      "Avoiding the cost of copying all lake data into native BigQuery storage",
    ],
    whenNotToUse: [
      "You need maximum query performance — native BigQuery tables are faster",
      "Data is small enough to just load into BigQuery directly",
      "You do not need governance — plain external tables are simpler",
    ],
    example:
      "Parquet files in Cloud Storage → BigLake table with column-level security → only authorized analysts see salary columns.",
    relatedTerms: ["cloud-storage", "bigquery", "external-tables", "data-lineage", "policy-tags"],
    memoryShortcut:
      "BigLake = external table + governance. Files stay in the lake, but rules apply like a warehouse.",
    commonConfusion:
      "Confused with external tables. External tables just query files without security. BigLake adds fine-grained access control, making it a governed lakehouse solution.",
    gcpConsoleLocation: "GCP Console → BigQuery → SQL Workspace (create as external table with BigLake connection)",
  },
  {
    id: "external-tables",
    term: "External Tables",
    aliases: ["federated tables"],
    category: "storage",
    generalDefinition:
      "A way to run SQL queries directly on files sitting in Cloud Storage without first loading them into a database. The data stays where it is — you just query it in place.",
    gcpDefinition:
      "In BigQuery, an external table points to files in Cloud Storage (CSV, Parquet, JSON, Avro) and lets you query them with SQL. No data is copied into BigQuery storage.",
    simplerExplanation:
      "Like a shortcut — BigQuery pretends the file is a table, runs SQL on it, and gives you results. The file never actually moves.",
    gcpExample:
      "CREATE EXTERNAL TABLE dataset.raw_orders (id STRING, amount FLOAT64) OPTIONS (format='CSV', uris=['gs://raw/orders.csv'])",
    whenToUse: [
      "Exploring or testing raw files before deciding to load them",
      "Querying temporary data without paying for BigQuery storage",
      "Joining warehouse tables with files you do not want to duplicate",
    ],
    whenNotToUse: [
      "High-performance repeated queries — native tables are much faster",
      "When you need governance/security — use BigLake instead",
      "Large files queried frequently — the full file is scanned every time",
    ],
    example:
      "New vendor CSV lands in Cloud Storage → create an external table → run a quick exploration query → decide whether to load it into BigQuery.",
    relatedTerms: ["bigquery", "biglake", "cloud-storage", "federated-query"],
    memoryShortcut:
      "External table = a SQL view over a file. No copy, no storage cost, slower performance.",
    commonConfusion:
      "External table vs BigLake: External table is a basic pointer with no security features. BigLake is an external table with enterprise governance bolted on.",
    gcpConsoleLocation: "GCP Console → BigQuery → Create table → Source: Cloud Storage",
  },
  {
    id: "data-lake",
    term: "Data Lake",
    aliases: [],
    category: "concept",
    generalDefinition:
      "A large storage area where you dump raw data in its original format — structured, semi-structured, and unstructured — before you decide what to do with it. Think of it as a giant holding tank.",
    gcpDefinition:
      "In GCP, Cloud Storage acts as the data lake. Raw CSVs, JSON logs, Parquet files, images, and vendor exports land here first. Processing tools like Dataflow then read from the lake and send cleaned data to BigQuery.",
    simplerExplanation:
      "Imagine dumping all your raw data into a bucket before organizing it. That bucket is your data lake. It is cheap and flexible — you store first, decide what to do later.",
    gcpExample:
      "gs://company-data-lake/raw/orders/, gs://company-data-lake/raw/clickstream/, gs://company-data-lake/raw/vendor-exports/",
    whenToUse: [
      "You need to store raw data before it is processed",
      "Data comes in many different formats from many sources",
      "You want cheap storage for historical raw data",
      "Data scientists need access to raw files for exploration",
    ],
    whenNotToUse: [
      "Analysts need to run SQL directly — they need a warehouse",
      "Data must be governed and access-controlled row-by-row — use a lakehouse",
    ],
    example:
      "All raw app events, vendor files, and database exports land in Cloud Storage (the data lake) → Dataflow cleans them → BigQuery (the warehouse) stores the clean version.",
    relatedTerms: ["cloud-storage", "data-warehouse", "lakehouse", "dataflow", "etl"],
    memoryShortcut:
      "Data lake = cheap, raw, any format. Think: 'dump it here first, sort it out later.'",
    commonConfusion:
      "Confused with data warehouse. A data lake holds raw, unorganized data. A warehouse holds clean, structured, queryable data. In GCP: Cloud Storage = lake, BigQuery = warehouse.",
    gcpConsoleLocation: undefined,
  },
  {
    id: "data-warehouse",
    term: "Data Warehouse",
    aliases: ["DWH"],
    category: "concept",
    generalDefinition:
      "A database built specifically for analytics — storing cleaned, structured, organized data so business teams can run SQL queries and build dashboards quickly.",
    gcpDefinition:
      "BigQuery is GCP's data warehouse. Data is loaded in a structured format (tables, columns, types), queryable with SQL, and optimized for aggregations and analytics. It is where curated, analytics-ready data lives.",
    simplerExplanation:
      "A warehouse is an organized store. Everything is labeled, shelved, and easy to find. You run SQL and get fast answers. Compare with a data lake, which is more like an unorganized storage room.",
    gcpExample:
      "BigQuery dataset: analytics.fact_orders, analytics.dim_customers, analytics.dim_products — all cleaned, typed, and ready for Looker Studio.",
    whenToUse: [
      "Business analysts need to run SQL on clean data",
      "Building dashboards and reports",
      "Storing curated, typed, well-modeled business data",
    ],
    whenNotToUse: [
      "Storing raw, unprocessed files — use a data lake (Cloud Storage)",
      "Individual row lookups — not what warehouses are optimized for",
    ],
    example:
      "Cleaned orders data → BigQuery star schema → Looker Studio dashboard → business team sees revenue by region.",
    relatedTerms: ["bigquery", "data-lake", "lakehouse", "dataform", "star-schema"],
    memoryShortcut:
      "Warehouse = organized, structured, fast SQL. BigQuery is the GCP warehouse.",
    commonConfusion:
      "Confused with data lake. Lake = raw, flexible, cheap. Warehouse = clean, structured, queryable. In modern GCP pipelines, data flows from the lake into the warehouse.",
    gcpConsoleLocation: undefined,
  },
  {
    id: "lakehouse",
    term: "Lakehouse",
    aliases: ["governed lakehouse"],
    category: "concept",
    generalDefinition:
      "A hybrid approach combining the cheap, flexible storage of a data lake with the governance, querying, and reliability of a data warehouse — all in one architecture.",
    gcpDefinition:
      "In GCP, a lakehouse is built by combining Cloud Storage (lake storage) + BigLake (governance layer) + BigQuery (query engine) + Dataplex (catalog and quality). Data stays in Cloud Storage but behaves like a governed warehouse.",
    simplerExplanation:
      "A lakehouse is like organizing your storage room so it works almost as well as a proper warehouse. Files stay cheap and flexible (lake) but now have security rules and can be queried easily (warehouse).",
    gcpExample:
      "Parquet files in Cloud Storage → BigLake tables with column security → Dataplex catalog tracking lineage → BigQuery queries everything.",
    whenToUse: [
      "You have large amounts of data in a lake and need warehouse-like governance",
      "You want to avoid the cost of copying all data into BigQuery native storage",
      "You need fine-grained access control on raw lake data",
    ],
    whenNotToUse: [
      "Simpler setups — if your data fits in BigQuery natively, just use BigQuery",
      "Small teams without governance requirements",
    ],
    example:
      "Terabytes of Parquet files in Cloud Storage → governed with BigLake → cataloged in Dataplex → queried via BigQuery — this is the GCP lakehouse pattern.",
    relatedTerms: ["data-lake", "data-warehouse", "biglake", "bigquery", "dataplex"],
    memoryShortcut:
      "Lakehouse = lake + warehouse features. Files stay in Cloud Storage, but BigLake + Dataplex give them warehouse-grade governance.",
    commonConfusion:
      "People confuse lakehouse with just 'having both a lake and a warehouse.' A lakehouse is a single unified layer — not two separate systems.",
    gcpConsoleLocation: undefined,
  },

  // ─── INGESTION TOOLS & CONCEPTS ─────────────────────────────────────────────
  {
    id: "ingestion",
    term: "Ingestion",
    aliases: ["data ingestion"],
    category: "concept",
    generalDefinition:
      "The process of moving data from where it lives (a database, an API, a SaaS app, an IoT sensor) into your data platform so you can analyze it.",
    gcpDefinition:
      "In GCP data engineering, ingestion covers the entire first step of the pipeline: getting data from source systems into Cloud Storage or BigQuery. Tools include Pub/Sub, Datastream, bq load, Storage Transfer Service, and BigQuery Data Transfer Service.",
    simplerExplanation:
      "Ingestion = getting data in the door. Before you can analyze anything, you need to collect it. Ingestion is that collection step.",
    gcpExample:
      "App → Pub/Sub (streaming ingestion) or CSV file → Cloud Storage → BigQuery (batch ingestion)",
    whenToUse: [
      "Always — every data pipeline starts with ingestion",
    ],
    whenNotToUse: [
      "N/A — ingestion is a required step in every pipeline",
    ],
    example:
      "A SaaS tool exports data nightly → BigQuery Data Transfer Service picks it up → it lands in BigQuery. That transfer step is ingestion.",
    relatedTerms: ["batch-ingestion", "streaming-ingestion", "pubsub", "datastream", "bq-load"],
    memoryShortcut:
      "Ingestion = getting data in the door. Step 1 of every pipeline.",
    commonConfusion:
      "Ingestion is sometimes confused with processing. Ingestion moves data as-is. Processing transforms or cleans the data after it arrives.",
    gcpConsoleLocation: undefined,
  },
  {
    id: "batch-ingestion",
    term: "Batch Ingestion",
    aliases: ["batch loading"],
    category: "concept",
    generalDefinition:
      "Collecting and moving data on a fixed schedule — once an hour, once a day, once a week — rather than as it arrives in real time.",
    gcpDefinition:
      "In GCP, batch ingestion uses tools like bq load, LOAD DATA, BigQuery Data Transfer Service, Storage Transfer Service, or Dataflow batch jobs. Data accumulates and is processed in scheduled chunks.",
    simplerExplanation:
      "Instead of processing every event the moment it happens, you wait and collect a batch — like doing laundry once a week instead of one sock at a time.",
    gcpExample:
      "Every night at 2am: Cloud Storage new files → bq load → BigQuery raw table → Dataform transforms → ready by 8am.",
    whenToUse: [
      "Data freshness of hours or days is acceptable",
      "Processing large volumes periodically is more efficient than streaming",
      "Source system only exports data periodically (nightly dump, weekly file)",
    ],
    whenNotToUse: [
      "Real-time dashboards or alerts are needed",
      "Fraud detection, live recommendations, or immediate user-facing responses",
    ],
    example:
      "Finance team needs a daily revenue report by 8am → nightly batch job loads the prior day's data → report is ready at 8am.",
    relatedTerms: ["streaming-ingestion", "bq-load", "cloud-composer", "etl", "elt"],
    memoryShortcut:
      "Batch = collect, then process. Like emptying a mailbox once a day instead of reading each letter as it arrives.",
    commonConfusion:
      "Confused with streaming. Batch is scheduled and delayed. Streaming is continuous and near-real-time. Choose batch when slight delay is acceptable and cost efficiency matters.",
    gcpConsoleLocation: undefined,
  },
  {
    id: "streaming-ingestion",
    term: "Streaming Ingestion",
    aliases: ["real-time ingestion"],
    category: "concept",
    generalDefinition:
      "Processing data the moment it arrives, continuously, without waiting to accumulate a batch. Every event is handled as soon as it is generated.",
    gcpDefinition:
      "In GCP, streaming ingestion uses Pub/Sub to receive events and Dataflow to process and land them in BigQuery in near real time. BigQuery also supports direct streaming inserts.",
    simplerExplanation:
      "Instead of waiting to collect a pile of events, you handle each one the moment it happens. Like reading and responding to every text message immediately instead of checking once a day.",
    gcpExample:
      "User clicks on app → event fires → Pub/Sub receives it → Dataflow transforms it → BigQuery gets the row within seconds.",
    whenToUse: [
      "Real-time dashboards (traffic, orders, sensor readings)",
      "Fraud detection that must act within seconds",
      "IoT sensor monitoring",
      "Live recommendations or personalization",
    ],
    whenNotToUse: [
      "Data freshness of hours or days is acceptable — batch is cheaper",
      "The source system only exports data periodically (no real-time feed available)",
    ],
    example:
      "E-commerce site tracks every click event → Pub/Sub → Dataflow → BigQuery → real-time dashboard showing live conversion rates.",
    relatedTerms: ["batch-ingestion", "pubsub", "dataflow", "windowing", "deduplication"],
    memoryShortcut:
      "Streaming = process every event as it arrives. Pub/Sub is the front door.",
    commonConfusion:
      "Confused with batch. Streaming costs more to run continuously but gives you real-time data. Batch is cheaper but delayed. Pick based on how fresh the data needs to be.",
    gcpConsoleLocation: undefined,
  },
  {
    id: "pubsub",
    term: "Pub/Sub",
    aliases: ["Pub Sub", "Google Pub/Sub", "Cloud Pub/Sub"],
    category: "ingestion",
    generalDefinition:
      "A messaging system where senders (publishers) drop messages into a channel, and receivers (subscribers) pick them up — without either side needing to know about the other. Like a bulletin board.",
    gcpDefinition:
      "Cloud Pub/Sub is GCP's managed event streaming and messaging service. Publishers send messages to topics. Subscribers read from subscriptions. It decouples producers from consumers and is the standard front door for streaming data pipelines.",
    simplerExplanation:
      "Pub/Sub is like a mailbox. Your app drops messages in. Downstream services pick them up. The app does not care who reads the message or when — it just drops it in and moves on.",
    gcpExample:
      "App publishes click events → Pub/Sub topic 'user-clicks' → Dataflow subscription reads and processes → BigQuery.",
    whenToUse: [
      "Receiving streaming events from apps, IoT devices, or services",
      "Decoupling event producers from consumers",
      "Fan-out: one event triggers multiple downstream systems",
      "Buffering traffic spikes before processing",
    ],
    whenNotToUse: [
      "Replicating database changes (inserts/updates/deletes) — use Datastream for CDC",
      "Large file transfers — use Storage Transfer Service",
      "Guaranteed message ordering over long periods — Pub/Sub has ordering limitations",
    ],
    example:
      "Payment service publishes an 'order placed' event → Pub/Sub → one subscriber triggers inventory update, another triggers shipping notification.",
    relatedTerms: ["dataflow", "streaming-ingestion", "datastream", "change-data-capture"],
    memoryShortcut:
      "Pub/Sub is the mailbox — drop a message in, subscribers pick it up. It is the front door for streaming data.",
    commonConfusion:
      "Confused with Datastream. Pub/Sub is for application events (clicks, orders, IoT). Datastream is for database-level changes (SQL inserts/updates/deletes via CDC).",
    gcpConsoleLocation: "GCP Console → Pub/Sub → Topics",
  },
  {
    id: "datastream",
    term: "Datastream",
    aliases: [],
    category: "ingestion",
    generalDefinition:
      "A tool that watches a database for every insert, update, and delete, and continuously streams those changes to another system — keeping two databases in sync in near real time.",
    gcpDefinition:
      "Datastream is GCP's managed Change Data Capture (CDC) service. It connects to source databases (MySQL, PostgreSQL, Oracle, SQL Server) and streams every change into Cloud Storage or BigQuery.",
    simplerExplanation:
      "Datastream is like a live copy machine for your database. Every time a row changes in your app database, Datastream immediately copies that change to BigQuery — without you having to export anything manually.",
    gcpExample:
      "PostgreSQL orders table → Datastream CDC → BigQuery raw_orders table updates within seconds of each INSERT/UPDATE/DELETE.",
    whenToUse: [
      "Replicating an operational database to BigQuery for analytics",
      "Near-real-time database sync without nightly exports",
      "CDC — capturing every insert, update, and delete",
    ],
    whenNotToUse: [
      "Source database does not support CDC (some older systems lack binlog/CDC support)",
      "You only need a one-time historical load — use bq load instead",
      "Ingesting application events (not database changes) — use Pub/Sub",
    ],
    example:
      "PostgreSQL app database → Datastream → BigQuery, so analysts always have near-real-time order data without manual exports.",
    relatedTerms: ["change-data-capture", "pubsub", "bigquery", "cloud-storage"],
    memoryShortcut:
      "Datastream = live tap on the database. Every change flows out as it happens.",
    commonConfusion:
      "Confused with Pub/Sub. Pub/Sub is for application-level events (your code publishes them). Datastream is for database-level changes (it watches the database log automatically).",
    gcpConsoleLocation: "GCP Console → Datastream → Streams",
  },
  {
    id: "change-data-capture",
    term: "Change Data Capture",
    aliases: ["CDC"],
    category: "concept",
    generalDefinition:
      "A technique for tracking every insert, update, and delete that happens in a database — so you can replicate those changes to another system without having to export the whole table each time.",
    gcpDefinition:
      "In GCP, Datastream is the primary CDC tool. It reads the database transaction log and streams each change to Cloud Storage or directly to BigQuery.",
    simplerExplanation:
      "Instead of copying the entire database every night, CDC watches for changes and only sends what changed. If 100 rows changed today, only those 100 rows are sent — not the entire million-row table.",
    gcpExample:
      "PostgreSQL binlog → Datastream CDC → BigQuery: only inserts/updates/deletes streamed, not full table exports.",
    whenToUse: [
      "Near-real-time analytics from an operational database",
      "Avoid expensive nightly full-table exports",
      "Keeping a BigQuery replica in sync with a production database",
    ],
    whenNotToUse: [
      "Source database does not have CDC support enabled",
      "One-time historical data load — just use bq load",
      "Application events (not database row changes) — use Pub/Sub",
    ],
    example:
      "PostgreSQL orders table → Datastream CDC → BigQuery, giving analysts near-real-time data without manual exports.",
    relatedTerms: ["datastream", "pubsub", "batch-ingestion", "streaming-ingestion"],
    memoryShortcut:
      "CDC = watching the database's change log, not the table. Only changed rows flow out.",
    commonConfusion:
      "Confused with Pub/Sub. Pub/Sub handles events your app explicitly publishes. CDC captures database-level changes automatically by reading the transaction log.",
    gcpConsoleLocation: "GCP Console → Datastream → Streams",
  },
  {
    id: "storage-transfer-service",
    term: "Storage Transfer Service",
    aliases: ["STS"],
    category: "ingestion",
    generalDefinition:
      "A tool for moving large amounts of files from one place to another — between cloud providers, or from on-premises storage into Google Cloud Storage.",
    gcpDefinition:
      "Storage Transfer Service moves files into Cloud Storage from AWS S3, Azure Blob Storage, on-premises systems, or other GCS buckets. It handles scheduling, retries, and large-scale transfers.",
    simplerExplanation:
      "Think of it as a scheduled moving truck for files. You tell it where the files are, where they should go, and how often to run. It handles the rest.",
    gcpExample:
      "AWS S3 bucket (us-east-1) → Storage Transfer Service → GCS bucket (us-central1) → nightly scheduled job.",
    whenToUse: [
      "Migrating from AWS S3 or Azure to Cloud Storage",
      "Moving on-premises files to Cloud Storage on a schedule",
      "Bucket-to-bucket transfers within GCS",
    ],
    whenNotToUse: [
      "Moving data into BigQuery — use bq load or BigQuery Data Transfer Service",
      "Streaming event data — use Pub/Sub",
      "Small one-off uploads — just use gsutil or the console",
    ],
    example:
      "Company migrating from AWS to GCP: S3 bucket → Storage Transfer Service (nightly sync) → GCS bucket → then Dataflow processes the files.",
    relatedTerms: ["cloud-storage", "bigquery-data-transfer-service", "ingestion"],
    memoryShortcut:
      "Storage Transfer moves files. BigQuery Data Transfer moves data into BigQuery. Different tools, similar names.",
    commonConfusion:
      "Confused with BigQuery Data Transfer Service. Storage Transfer moves FILES into Cloud Storage. BigQuery Data Transfer moves DATA into BigQuery (from SaaS tools like Google Ads).",
    gcpConsoleLocation: "GCP Console → Storage Transfer Service → Jobs",
  },
  {
    id: "bigquery-data-transfer-service",
    term: "BigQuery Data Transfer Service",
    aliases: ["BQDTS", "BQ Data Transfer"],
    category: "ingestion",
    generalDefinition:
      "A managed service that automatically moves data from supported external sources (like Google Ads, YouTube, SaaS tools) directly into BigQuery on a schedule.",
    gcpDefinition:
      "BigQuery Data Transfer Service has prebuilt connectors for Google products (Ads, Analytics, YouTube) and third-party SaaS tools. You configure a transfer, it runs on your schedule, and data appears in BigQuery automatically.",
    simplerExplanation:
      "It is like setting up automatic imports from your marketing tools into BigQuery. You connect Google Ads once, and data flows in every day without writing any code.",
    gcpExample:
      "Google Ads account → BigQuery Data Transfer Service (daily) → BigQuery dataset: google_ads.campaign_performance",
    whenToUse: [
      "Importing data from Google Ads, YouTube Analytics, Google Analytics",
      "Scheduled recurring imports from supported SaaS sources",
      "Avoiding manual data exports from marketing tools",
    ],
    whenNotToUse: [
      "Moving files between Cloud Storage buckets — use Storage Transfer Service",
      "Custom source systems without a supported connector — build a pipeline instead",
      "Real-time streaming — this is a scheduled batch service",
    ],
    example:
      "Marketing team needs daily Google Ads performance data in BigQuery → set up BigQuery Data Transfer Service once → data appears automatically every morning.",
    relatedTerms: ["bigquery", "storage-transfer-service", "batch-ingestion", "bq-load"],
    memoryShortcut:
      "BigQuery Data Transfer = auto-import from supported sources (Google Ads, etc.) into BigQuery on a schedule.",
    commonConfusion:
      "Confused with Storage Transfer Service. BQDTS moves data INTO BigQuery from SaaS tools. STS moves files INTO Cloud Storage from other storage systems.",
    gcpConsoleLocation: "GCP Console → BigQuery → Data transfers",
  },
  {
    id: "bq-load",
    term: "bq load / LOAD DATA",
    aliases: ["bq load", "LOAD DATA", "BigQuery load job"],
    category: "ingestion",
    generalDefinition:
      "Commands for loading a file directly into a BigQuery table — like importing a spreadsheet into a database.",
    gcpDefinition:
      "bq load is the CLI command; LOAD DATA is the SQL equivalent. Both read files from Cloud Storage (CSV, Parquet, Avro, JSON, ORC) and append or overwrite a BigQuery table. These are batch load jobs — simple, reliable, and free within BigQuery.",
    simplerExplanation:
      "You have a file in Cloud Storage. You want it to become a table in BigQuery. Run bq load (or LOAD DATA in SQL) and BigQuery reads the file and puts the data in the table.",
    gcpExample:
      "bq load --source_format=PARQUET mydataset.orders gs://my-bucket/orders.parquet\n-- or in SQL:\nLOAD DATA INTO mydataset.orders FROM FILES (format='PARQUET', uris=['gs://my-bucket/orders.parquet'])",
    whenToUse: [
      "Loading files from Cloud Storage into BigQuery",
      "Simple batch ingestion without transformation",
      "One-time or scheduled file loads",
    ],
    whenNotToUse: [
      "Real-time streaming — use Pub/Sub + Dataflow + BigQuery streaming",
      "Complex transformations during load — use Dataflow for ETL first",
      "Continuous CDC replication — use Datastream",
    ],
    example:
      "Daily export file arrives in Cloud Storage at 2am → bq load job runs → file is in BigQuery by 2:05am.",
    relatedTerms: ["bigquery", "cloud-storage", "batch-ingestion", "dataflow", "bigquery-data-transfer-service"],
    memoryShortcut:
      "bq load = the simplest way to get a file into BigQuery. No transformation, just load.",
    commonConfusion:
      "Confused with Dataflow. bq load just moves data from a file into a table. Dataflow transforms, cleans, and enriches data during the move. Use bq load for simple loads, Dataflow for complex pipelines.",
    gcpConsoleLocation: "GCP Console → BigQuery → Create table (or use bq CLI / SQL LOAD DATA)",
  },

  // ─── PROCESSING & TRANSFORMATION ────────────────────────────────────────────
  {
    id: "etl",
    term: "ETL",
    aliases: ["Extract Transform Load"],
    category: "concept",
    generalDefinition:
      "A data movement pattern: Extract data from a source, Transform it (clean, filter, reshape), then Load the clean version into your destination. The data is cleaned before it enters the warehouse.",
    gcpDefinition:
      "In GCP, a typical ETL pipeline: source system → Dataflow (extracts and transforms) → BigQuery (loads clean data). Transformation happens outside the warehouse before loading.",
    simplerExplanation:
      "ETL is like washing vegetables before putting them in the fridge. You clean the data first, then store the clean version. The warehouse only receives tidy data.",
    gcpExample:
      "Pub/Sub events → Dataflow (filters nulls, deduplicates, enriches) → BigQuery clean_orders table.",
    whenToUse: [
      "You need to clean or transform data before it enters the warehouse",
      "Sensitive data must be masked or filtered before storage",
      "Streaming pipelines where transformation happens in real time",
    ],
    whenNotToUse: [
      "BigQuery is powerful enough to transform after loading (use ELT instead)",
      "Transformations are simple SQL — ELT with Dataform is often easier",
    ],
    example:
      "Raw JSON events → Dataflow parses, validates, and filters → clean Parquet written to BigQuery. ETL: the cleaning happened before BigQuery.",
    relatedTerms: ["elt", "dataflow", "dataproc", "data-fusion", "batch-ingestion"],
    memoryShortcut:
      "ETL = clean first, then store. Transform BEFORE the warehouse.",
    commonConfusion:
      "Confused with ELT. ETL transforms outside the warehouse (using Dataflow, Dataproc). ELT loads raw data first and transforms inside the warehouse (using Dataform, SQL). Modern analytics often uses ELT because BigQuery is powerful enough.",
    gcpConsoleLocation: undefined,
  },
  {
    id: "elt",
    term: "ELT",
    aliases: ["Extract Load Transform"],
    category: "concept",
    generalDefinition:
      "A data movement pattern: Extract data from a source, Load the raw version into your warehouse, then Transform it inside the warehouse using SQL. The warehouse handles the cleaning.",
    gcpDefinition:
      "In GCP, modern analytics engineering often uses ELT: raw data lands in BigQuery via bq load or Dataflow → Dataform SQL models transform the raw tables into clean, analytics-ready tables. BigQuery is powerful enough to do the transformation itself.",
    simplerExplanation:
      "ELT is like putting groceries directly in the fridge first, then organizing and cleaning them later. Load everything raw, then transform inside BigQuery using SQL.",
    gcpExample:
      "CSV → Cloud Storage → BigQuery raw_orders (raw) → Dataform SQL → BigQuery clean_orders (transformed).",
    whenToUse: [
      "BigQuery is your destination and is powerful enough for the transformations",
      "Your team knows SQL well and prefers analytics engineering patterns",
      "You want version-controlled SQL transformation pipelines (Dataform, dbt)",
      "Data is already fairly clean and just needs reshaping",
    ],
    whenNotToUse: [
      "Data needs heavy cleaning before landing (nulls, corrupt records) — do ETL first",
      "PII or sensitive data must be stripped before entering the warehouse",
      "Streaming pipelines — transformations typically happen in Dataflow (ETL)",
    ],
    example:
      "Raw orders CSV → BigQuery raw_orders → Dataform models clean it → BigQuery clean_orders → Looker Studio dashboard.",
    relatedTerms: ["etl", "dataform", "bigquery", "bigquery-scheduled-queries", "data-warehouse"],
    memoryShortcut:
      "ELT = load raw first, transform inside the warehouse. SQL does the heavy lifting after the data is in.",
    commonConfusion:
      "Confused with ETL. ETL cleans data before loading. ELT loads raw data and cleans it after. Modern GCP analytics usually prefers ELT because BigQuery handles large transformations efficiently.",
    gcpConsoleLocation: undefined,
  },
  {
    id: "dataflow",
    term: "Dataflow",
    aliases: ["Cloud Dataflow"],
    category: "processing",
    generalDefinition:
      "Google's managed tool for processing large amounts of data — either on a schedule (batch) or as it arrives continuously (streaming). You write the processing logic; Google handles the servers.",
    gcpDefinition:
      "Dataflow is GCP's managed Apache Beam service. It runs batch and streaming pipelines, scales automatically, and integrates natively with Pub/Sub and BigQuery. It is the default choice for scalable data transformation in GCP.",
    simplerExplanation:
      "Dataflow is the heavy-duty data processing engine. Think of it as a powerful assembly line: raw data goes in one end, transformed clean data comes out the other — whether the data arrives all at once (batch) or continuously (streaming).",
    gcpExample:
      "Pub/Sub → Dataflow pipeline (parse JSON, filter nulls, deduplicate by ID, enrich with lookup table) → BigQuery clean_events table.",
    whenToUse: [
      "Streaming pipelines: Pub/Sub events → transform → BigQuery",
      "Batch ETL with complex transformations (filtering, enriching, joining)",
      "Deduplication and windowing of streaming data",
      "Large-scale data processing that must scale automatically",
    ],
    whenNotToUse: [
      "Team already has PySpark code — use Dataproc instead",
      "Simple SQL-only transformations — Dataform or BigQuery scheduled queries are simpler",
      "Visual no-code pipelines — use Data Fusion",
      "Small files that bq load can handle directly",
    ],
    example:
      "Click events → Pub/Sub → Dataflow (parse, deduplicate per 5-minute window, enrich with user table) → BigQuery user_events.",
    relatedTerms: ["apache-beam", "pubsub", "dataproc", "streaming-ingestion", "batch-processing"],
    memoryShortcut:
      "Dataflow = the heavy-duty processor. Batch or streaming, scalable. The default GCP processing tool.",
    commonConfusion:
      "Confused with Dataproc. Dataflow is Google's native managed tool (Apache Beam). Dataproc is for teams with existing Spark/Hadoop code. Start with Dataflow unless you already have Spark jobs.",
    gcpConsoleLocation: "GCP Console → Dataflow → Jobs",
  },
  {
    id: "apache-beam",
    term: "Apache Beam",
    aliases: ["Beam"],
    category: "processing",
    generalDefinition:
      "An open-source programming model for building batch and streaming data processing pipelines. You write code using Beam's API, then run it on a processing engine (called a runner).",
    gcpDefinition:
      "Dataflow is Google's managed runner for Apache Beam. When you use Dataflow, you are running Beam pipelines. Beam handles the logic (what to do with data); Dataflow handles the infrastructure (how to run it at scale).",
    simplerExplanation:
      "Apache Beam is the recipe. Dataflow is the kitchen that executes the recipe. You write Beam pipelines in Python or Java, and Dataflow runs them at scale on Google's infrastructure.",
    gcpExample:
      "Python Beam pipeline: p | ReadFromPubSub(topic) | ParseJSON() | FilterNulls() | WriteToBigQuery(table)",
    whenToUse: [
      "You are using Dataflow (you are automatically using Beam)",
      "You want portable pipelines that could run on multiple runners",
    ],
    whenNotToUse: [
      "You prefer Spark — Spark is not Beam (use Dataproc for Spark)",
      "Simple SQL transformations — Dataform is easier",
    ],
    example:
      "Data engineer writes a Beam pipeline in Python → submits it to Dataflow → Dataflow runs it at scale on Google's infrastructure.",
    relatedTerms: ["dataflow", "dataproc", "batch-processing", "streaming-processing"],
    memoryShortcut:
      "Beam is the recipe. Dataflow is the oven. You write Beam; Dataflow runs it.",
    commonConfusion:
      "Confused with Spark. Beam and Spark are both distributed processing frameworks, but they have different APIs. Dataflow runs Beam. Dataproc runs Spark. They are not interchangeable.",
    gcpConsoleLocation: undefined,
  },
  {
    id: "batch-processing",
    term: "Batch Processing",
    aliases: [],
    category: "concept",
    generalDefinition:
      "Processing a large collection of data all at once, triggered at a specific time or when a threshold is met — rather than processing each record as it arrives.",
    gcpDefinition:
      "In GCP, batch processing jobs run on Dataflow (for Beam pipelines) or Dataproc (for Spark). They read a bounded dataset (a file or a day's worth of data) and produce output when finished.",
    simplerExplanation:
      "Batch processing is like doing all your dishes at the end of the day instead of washing each one immediately after use. Efficient, but you wait for the whole batch to complete.",
    gcpExample:
      "Every night at midnight: Dataflow reads all of yesterday's CSV files from Cloud Storage, transforms them, and writes to BigQuery. Completed by 3am.",
    whenToUse: [
      "Nightly or hourly data refreshes",
      "Historical backfills over large date ranges",
      "Processing large volumes where real-time is not required",
    ],
    whenNotToUse: [
      "Data must be available in seconds after it is generated — use streaming",
    ],
    example:
      "Payroll processing runs once a month: reads all employee records in a batch, calculates salaries, produces payslips.",
    relatedTerms: ["streaming-processing", "dataflow", "dataproc", "batch-ingestion"],
    memoryShortcut:
      "Batch = collect then process. All data processed together at once.",
    commonConfusion:
      "Confused with streaming. Batch processes data in scheduled chunks with some delay. Streaming processes each event immediately as it arrives.",
    gcpConsoleLocation: undefined,
  },
  {
    id: "streaming-processing",
    term: "Streaming Processing",
    aliases: ["stream processing", "real-time processing"],
    category: "concept",
    generalDefinition:
      "Processing data continuously as it arrives, event by event or in tiny micro-batches, so results are available in near real time.",
    gcpDefinition:
      "In GCP, Dataflow handles streaming processing. It reads from Pub/Sub in real time, applies transformations (windowing, deduplication, enrichment), and writes results to BigQuery or other sinks within seconds.",
    simplerExplanation:
      "Streaming processing is like a conveyor belt — each item is processed as soon as it arrives, one at a time, without waiting for all the others.",
    gcpExample:
      "Pub/Sub click events → Dataflow streaming pipeline (5-minute tumbling window → count events per user) → BigQuery.",
    whenToUse: [
      "Real-time fraud detection",
      "Live dashboards and monitoring",
      "Immediate alerts on anomalies",
      "Real-time personalization",
    ],
    whenNotToUse: [
      "Data arrives in batches only (no streaming source exists)",
      "Processing can wait hours — batch is cheaper and simpler",
    ],
    example:
      "Payment processor detects suspicious transactions in real time: Pub/Sub → Dataflow streaming → fraud score → alert within 2 seconds.",
    relatedTerms: ["batch-processing", "dataflow", "pubsub", "windowing", "streaming-ingestion"],
    memoryShortcut:
      "Streaming = process each event as it arrives. No waiting.",
    commonConfusion:
      "Confused with batch. Streaming is always-on and costly to run continuously. Batch runs periodically and is cheaper. Choose based on how fresh the data needs to be.",
    gcpConsoleLocation: undefined,
  },
  {
    id: "windowing",
    term: "Windowing",
    aliases: ["time windowing", "tumbling window", "sliding window"],
    category: "concept",
    generalDefinition:
      "In streaming pipelines, grouping events into time-based buckets so you can aggregate them — for example, counting clicks per minute or calculating average latency per 5-minute period.",
    gcpDefinition:
      "Dataflow (Apache Beam) supports multiple windowing strategies: tumbling windows (fixed non-overlapping intervals), sliding windows (overlapping intervals), and session windows (grouped by activity gaps). Windowing is essential for making aggregations meaningful in streaming.",
    simplerExplanation:
      "When data arrives continuously, you can't just sum everything forever. Windowing cuts the stream into time slices — like saying 'count events from 2pm to 2:05pm, then count 2:05pm to 2:10pm.' Each slice is processed separately.",
    gcpExample:
      "Dataflow tumbling window (5 minutes): all click events arriving between 14:00:00–14:04:59 → grouped together → count per user_id → written to BigQuery.",
    whenToUse: [
      "Any streaming pipeline that needs aggregations (counts, sums, averages)",
      "Detecting anomalies over time windows (sudden spike in errors per minute)",
      "Session analysis (group user activity by inactivity gaps)",
    ],
    whenNotToUse: [
      "Individual event processing with no aggregation — windowing is not needed",
      "Batch pipelines — windowing is a streaming concept",
    ],
    example:
      "Real-time dashboard shows 'errors per 5 minutes' → Dataflow tumbling window groups every 5 minutes of error events → counts them → BigQuery.",
    relatedTerms: ["streaming-processing", "dataflow", "deduplication", "pubsub"],
    memoryShortcut:
      "Windowing = cutting the stream into time buckets for aggregation. Without windows, streaming aggregations are meaningless.",
    commonConfusion:
      "Sometimes confused with partitioning. Partitioning is a storage concept (split a table by date). Windowing is a streaming processing concept (group events by time for computation).",
    gcpConsoleLocation: undefined,
  },
  {
    id: "deduplication",
    term: "Deduplication",
    aliases: ["dedup"],
    category: "concept",
    generalDefinition:
      "The process of removing duplicate records from a dataset — ensuring that each unique event or row appears only once in your output.",
    gcpDefinition:
      "In Dataflow streaming pipelines, deduplication is typically done by tracking seen message IDs within a time window. BigQuery also supports deduplication via DISTINCT queries, MERGE statements, or table partitions that overwrite on re-run.",
    simplerExplanation:
      "If a network hiccup causes the same click event to be sent twice, deduplication makes sure only one copy ends up in BigQuery. Without it, your counts would be inflated.",
    gcpExample:
      "Dataflow pipeline: for each incoming event, check if event_id was seen in the last 10 minutes → if yes, drop it → if no, pass it through.",
    whenToUse: [
      "Streaming pipelines where messages can be delivered more than once (Pub/Sub at-least-once delivery)",
      "Batch loads where source files may have overlapping data",
    ],
    whenNotToUse: [
      "When duplicates are intentional and meaningful (e.g., the same user can legitimately click twice)",
    ],
    example:
      "Payment event sent twice due to network retry → Dataflow deduplication using payment_id → only one row lands in BigQuery.",
    relatedTerms: ["streaming-processing", "windowing", "dataflow", "idempotency"],
    memoryShortcut:
      "Deduplication = 'only count each thing once.' Essential in streaming where messages can be delivered multiple times.",
    commonConfusion:
      "Confused with idempotency. Idempotency means running the pipeline multiple times produces the same result. Deduplication is one technique used to achieve idempotency.",
    gcpConsoleLocation: undefined,
  },
  {
    id: "enrichment",
    term: "Enrichment",
    aliases: ["data enrichment"],
    category: "concept",
    generalDefinition:
      "Adding additional context or information to a data record by joining it with a reference dataset — making the record more useful or complete.",
    gcpDefinition:
      "In GCP pipelines, enrichment often happens in Dataflow: a streaming event (e.g., a user click with just a user_id) is joined against a side input (e.g., a user profile table) to add user name, region, and segment to the event.",
    simplerExplanation:
      "An event arrives with just a user ID. Enrichment looks up that user ID in a reference table and adds their name, location, and tier to the event before storing it. You go from sparse to rich data.",
    gcpExample:
      "Click event arrives: {user_id: '123', page: '/checkout'} → Dataflow enrichment joins with user_profiles → {user_id: '123', page: '/checkout', user_name: 'Taran', tier: 'premium', region: 'US-West'}",
    whenToUse: [
      "Streaming events contain only IDs and need additional context added before storage",
      "Making raw data self-contained so downstream consumers do not need extra joins",
    ],
    whenNotToUse: [
      "Reference data changes too frequently — stale enrichment can cause errors",
      "Enrichment can happen cheaply downstream in BigQuery SQL (no need to do it in the pipeline)",
    ],
    example:
      "Order event arrives with product_id → Dataflow joins with product catalog → order event now contains product name, category, and price.",
    relatedTerms: ["dataflow", "streaming-processing", "dataproc", "etl"],
    memoryShortcut:
      "Enrichment = adding context. Raw event gets richer data attached to it during processing.",
    commonConfusion:
      "Sometimes confused with transformation. Enrichment specifically means adding external data. Transformation is broader (cleaning, filtering, reshaping).",
    gcpConsoleLocation: undefined,
  },
  {
    id: "dataproc",
    term: "Dataproc",
    aliases: ["Cloud Dataproc"],
    category: "processing",
    generalDefinition:
      "Google's managed service for running Spark and Hadoop workloads — so you can run your existing Spark or Hadoop code on GCP without managing the cluster yourself.",
    gcpDefinition:
      "Dataproc creates and manages Hadoop and Spark clusters on GCP. It is best for teams migrating existing Spark jobs from on-premises, or for use cases where the Spark ecosystem (MLlib, Spark SQL, PySpark) is the right fit.",
    simplerExplanation:
      "If your team already has Spark code and has been running it on-premises or on AWS EMR, Dataproc lets you run that same Spark code on GCP with minimal changes. It is managed Spark.",
    gcpExample:
      "spark-submit --master yarn pyspark_etl_job.py → runs on a Dataproc cluster → output written to Cloud Storage or BigQuery.",
    whenToUse: [
      "Team already has PySpark or Scala Spark jobs to migrate",
      "Hadoop ecosystem tools are required (Hive, HBase, Pig)",
      "Workloads where Spark's MLlib or Spark SQL is the best fit",
    ],
    whenNotToUse: [
      "Building new pipelines from scratch — Dataflow (Beam) is the modern GCP-native choice",
      "Simple SQL transformations — use Dataform or BigQuery scheduled queries",
      "Visual no-code ETL — use Data Fusion",
    ],
    example:
      "Company has 50 PySpark jobs running on-prem → migrate to Dataproc → minimal code changes, runs on Google infrastructure.",
    relatedTerms: ["spark", "pyspark", "hadoop", "dataflow", "apache-beam"],
    memoryShortcut:
      "Dataproc = managed Spark/Hadoop on GCP. If your team already uses Spark, Dataproc is the lift-and-shift option.",
    commonConfusion:
      "Confused with Dataflow. Dataflow is Google's native pipeline tool (Apache Beam). Dataproc runs Spark/Hadoop. Use Dataproc only if you have existing Spark code; otherwise start with Dataflow.",
    gcpConsoleLocation: "GCP Console → Dataproc → Clusters",
  },
  {
    id: "spark",
    term: "Apache Spark",
    aliases: ["Spark"],
    category: "processing",
    generalDefinition:
      "An open-source distributed computing framework for processing large datasets quickly — much faster than traditional Hadoop MapReduce because it keeps data in memory.",
    gcpDefinition:
      "In GCP, Apache Spark runs on Dataproc. Spark supports batch processing, streaming (Spark Streaming), SQL (Spark SQL), machine learning (MLlib), and graph processing.",
    simplerExplanation:
      "Spark is a powerful distributed data processing engine. Think of it as a highly parallel calculator that can process terabytes of data across hundreds of computers at the same time. Teams who know Spark can move their code to GCP via Dataproc.",
    gcpExample:
      "PySpark job on Dataproc: spark.read.parquet('gs://bucket/data/') .filter(col('status') == 'active') .groupBy('region') .agg(sum('revenue')) .write.parquet('gs://bucket/output/')",
    whenToUse: [
      "Team has existing Spark jobs to run on GCP (use Dataproc)",
      "Complex distributed ML workflows with Spark MLlib",
    ],
    whenNotToUse: [
      "No existing Spark code — Apache Beam / Dataflow is more GCP-native",
      "Simple SQL transformations — BigQuery or Dataform are simpler",
    ],
    example:
      "Data science team has a PySpark model training job → runs on Dataproc cluster → model saved to Cloud Storage → deployed via Vertex AI.",
    relatedTerms: ["dataproc", "pyspark", "hadoop", "dataflow", "apache-beam"],
    memoryShortcut:
      "Spark = fast distributed processing. Dataproc = managed Spark on GCP.",
    commonConfusion:
      "Confused with Dataflow/Beam. Spark and Beam are different frameworks with different APIs. You cannot run a Spark job on Dataflow. Spark → Dataproc. Beam → Dataflow.",
    gcpConsoleLocation: "GCP Console → Dataproc → Jobs",
  },
  {
    id: "hadoop",
    term: "Hadoop",
    aliases: ["Apache Hadoop", "HDFS", "MapReduce"],
    category: "processing",
    generalDefinition:
      "An older open-source framework for storing and processing large datasets across many computers. Hadoop introduced the concept of distributed processing (MapReduce) and distributed storage (HDFS).",
    gcpDefinition:
      "In GCP, Hadoop workloads run on Dataproc. Cloud Storage replaces HDFS as the storage layer (via the Cloud Storage connector). Teams migrating Hadoop jobs from on-premises can run them on Dataproc with minimal changes.",
    simplerExplanation:
      "Hadoop was the original big data framework. It stores data across many machines (HDFS) and processes it in parallel (MapReduce). Spark replaced most Hadoop processing use cases, but some tools still use the Hadoop ecosystem.",
    gcpExample:
      "On-premises HDFS cluster → migrated to Dataproc + Cloud Storage (GCS replaces HDFS) → Hadoop jobs run unchanged.",
    whenToUse: [
      "Migrating existing Hadoop/MapReduce workloads to GCP",
      "Legacy Hive or Pig jobs that need to run on GCP",
    ],
    whenNotToUse: [
      "Building new pipelines — Spark or Dataflow are more modern choices",
      "Any new GCP-native work — use Dataflow (Beam) or Dataproc with Spark",
    ],
    example:
      "Company has Hive queries running on Hadoop on-prem → migrates to Dataproc → Hive runs on Dataproc with Cloud Storage as HDFS replacement.",
    relatedTerms: ["spark", "dataproc", "dataflow"],
    memoryShortcut:
      "Hadoop = the original big data framework. Now mostly replaced by Spark. On GCP, both run on Dataproc.",
    commonConfusion:
      "People say 'Hadoop' when they mean 'the Hadoop ecosystem' (Hive, HBase, Pig, HDFS). On GCP, all of these run on Dataproc, with Cloud Storage replacing HDFS.",
    gcpConsoleLocation: "GCP Console → Dataproc → Clusters",
  },
  {
    id: "pyspark",
    term: "PySpark",
    aliases: [],
    category: "processing",
    generalDefinition:
      "The Python API for Apache Spark — allowing data engineers and scientists to write Spark data processing jobs in Python rather than Scala or Java.",
    gcpDefinition:
      "PySpark jobs run on Dataproc in GCP. A PySpark script is submitted to a Dataproc cluster and Spark distributes the work across nodes. Output typically goes to Cloud Storage or BigQuery.",
    simplerExplanation:
      "PySpark lets Python developers use Spark without learning Scala. You write Python, but Spark distributes it across many machines and processes data very fast.",
    gcpExample:
      "dataproc jobs submit pyspark --cluster=my-cluster gs://bucket/etl_job.py",
    whenToUse: [
      "Team knows Python and has Spark workloads to run",
      "Data science workflows that use Spark's MLlib or DataFrames",
      "Migrating existing PySpark ETL jobs to GCP",
    ],
    whenNotToUse: [
      "Simple transformations — BigQuery SQL or Dataform are much easier",
      "New streaming pipelines — Dataflow with Python Beam SDK is more GCP-native",
    ],
    example:
      "Data engineering team wrote ETL logic in PySpark → runs on Dataproc → cleans and aggregates 1TB of daily data → output to Cloud Storage.",
    relatedTerms: ["spark", "hadoop", "dataproc", "dataflow"],
    memoryShortcut:
      "PySpark = Python + Spark. Python developers writing distributed data processing on Dataproc.",
    commonConfusion:
      "Confused with Pandas. Pandas processes data on a single machine. PySpark distributes processing across a cluster. Use Pandas for small data, PySpark for large distributed workloads.",
    gcpConsoleLocation: "GCP Console → Dataproc → Jobs → Submit job (PySpark)",
  },
  {
    id: "data-fusion",
    term: "Data Fusion",
    aliases: ["Cloud Data Fusion", "CDAP"],
    category: "processing",
    generalDefinition:
      "A visual, drag-and-drop ETL tool that lets you build data pipelines without writing code — by connecting pre-built connectors and transformation blocks on a canvas.",
    gcpDefinition:
      "Cloud Data Fusion is GCP's no-code/low-code ETL pipeline builder. It has 200+ pre-built connectors and transforms. Under the hood, it runs on Apache Spark via Dataproc, but users do not interact with Spark directly.",
    simplerExplanation:
      "Data Fusion is like Lego for data pipelines. Drag a 'read from MySQL' block, connect it to a 'filter rows' block, connect it to a 'write to BigQuery' block, and click run. No code needed.",
    gcpExample:
      "Data Fusion Studio: MySQL connector → deduplicate transform → BigQuery sink. Runs as a Dataproc Spark job underneath.",
    whenToUse: [
      "Non-technical teams that need to build ETL pipelines without writing code",
      "Heavy connector requirements (connecting many different source systems)",
      "Quickly prototyping pipelines before coding them in Dataflow",
    ],
    whenNotToUse: [
      "High-throughput streaming pipelines — use Dataflow",
      "Custom transformation logic that cannot be expressed visually",
      "Cost-sensitive environments — Data Fusion has higher base cost than Dataflow",
    ],
    example:
      "Business analyst builds a pipeline in Data Fusion: Salesforce CRM → transform → BigQuery, no engineering required.",
    relatedTerms: ["dataflow", "dataproc", "etl", "batch-processing"],
    memoryShortcut:
      "Data Fusion = visual drag-and-drop ETL. No code, many connectors. For teams that want pipelines without writing Beam or Spark.",
    commonConfusion:
      "Confused with Dataflow. Dataflow is code-first (Python/Java Beam). Data Fusion is visual (no-code). Use Data Fusion if the team avoids code; use Dataflow if you need full control and high performance.",
    gcpConsoleLocation: "GCP Console → Data Fusion → Instances → Studio",
  },
  {
    id: "dataform",
    term: "Dataform",
    aliases: [],
    category: "processing",
    generalDefinition:
      "A tool for managing SQL-based data transformation workflows — like a version-controlled, tested, dependency-aware system for SQL that runs inside BigQuery.",
    gcpDefinition:
      "Dataform is GCP's managed analytics engineering tool. You write SQL (SQLX files), define dependencies between tables, add data quality tests, and Dataform runs them in BigQuery in the correct order. It is GCP's alternative to dbt.",
    simplerExplanation:
      "Dataform is like a build system for your BigQuery SQL. You write SQL files, tell Dataform which tables depend on which, and it runs them in the right order — automatically. It also tests the outputs.",
    gcpExample:
      "raw_orders.sqlx → cleaned_orders.sqlx → fact_orders.sqlx → dim_customers.sqlx. Dataform runs them in dependency order in BigQuery.",
    whenToUse: [
      "SQL-based transformations inside BigQuery with dependency management",
      "Analytics engineering — raw tables to clean tables to business tables",
      "Teams that want version-controlled, tested SQL pipelines",
      "Replacing or augmenting dbt in a GCP-native stack",
    ],
    whenNotToUse: [
      "Non-SQL transformations — Dataflow or Dataproc for code-based pipelines",
      "Streaming data — Dataform is batch SQL only",
      "Very simple one-off SQL — BigQuery scheduled queries are simpler",
    ],
    example:
      "raw_orders → Dataform (clean, join, aggregate) → fact_orders, dim_customers, dim_products → Looker Studio reads the final tables.",
    relatedTerms: ["bigquery", "bigquery-scheduled-queries", "cloud-composer", "elt", "star-schema"],
    memoryShortcut:
      "Dataform = version-controlled SQL workflows in BigQuery. Like dbt but built into GCP.",
    commonConfusion:
      "Confused with BigQuery scheduled queries. Scheduled queries run one SQL statement on a timer. Dataform manages many SQL files with dependencies, tests, and version control.",
    gcpConsoleLocation: "GCP Console → Dataform → Repositories",
  },
  {
    id: "bigquery-scheduled-queries",
    term: "BigQuery Scheduled Queries",
    aliases: ["scheduled queries", "BQ scheduled queries"],
    category: "processing",
    generalDefinition:
      "A simple way to run a SQL query in BigQuery on a repeating schedule — like a cron job for SQL.",
    gcpDefinition:
      "BigQuery Scheduled Queries runs a single SQL statement in BigQuery on your specified schedule (hourly, daily, etc.) and writes results to a destination table. No pipeline code, no orchestration tool needed for simple cases.",
    simplerExplanation:
      "If you have one SQL query you want to run every morning to refresh a table, BigQuery scheduled queries does exactly that. No servers, no code, just SQL on a schedule.",
    gcpExample:
      "Schedule: daily at 6am. SQL: INSERT INTO reporting.daily_summary SELECT date, SUM(revenue) FROM orders GROUP BY date WHERE date = CURRENT_DATE - 1",
    whenToUse: [
      "One or two simple recurring SQL jobs",
      "Daily summary table refreshes",
      "Simple reporting transformations with no dependencies on other jobs",
    ],
    whenNotToUse: [
      "Multiple SQL steps with dependencies — use Dataform instead",
      "You need retry logic, alerting, or complex scheduling — use Composer",
      "Non-SQL transformations — use Dataflow or Dataproc",
    ],
    example:
      "Every morning at 6am: SQL runs to calculate yesterday's revenue summary → written to reporting.daily_kpis table → Looker Studio reads it.",
    relatedTerms: ["dataform", "cloud-composer", "bigquery", "cloud-scheduler"],
    memoryShortcut:
      "Scheduled queries = one SQL job on a timer. Simple and built into BigQuery. For multiple dependent jobs, step up to Dataform.",
    commonConfusion:
      "Confused with Dataform. Scheduled queries run one SQL statement, no dependency management. Dataform manages multiple SQL files with defined dependencies and tests between them.",
    gcpConsoleLocation: "GCP Console → BigQuery → Scheduled queries",
  },

  // ─── ORCHESTRATION ───────────────────────────────────────────────────────────
  {
    id: "cloud-composer",
    term: "Cloud Composer",
    aliases: ["Composer", "Airflow on GCP"],
    category: "orchestration",
    generalDefinition:
      "A workflow orchestration tool that schedules, coordinates, and monitors complex multi-step data pipelines — ensuring each step runs in the right order, retries on failure, and alerts on problems.",
    gcpDefinition:
      "Cloud Composer is GCP's managed Apache Airflow service. You write DAGs (Directed Acyclic Graphs) in Python that define the steps and dependencies of your pipeline. Composer runs the DAGs on schedule, handles retries, and provides a monitoring UI.",
    simplerExplanation:
      "Composer is like a traffic controller for your data pipelines. It does not move the data itself — it tells Dataflow when to start, waits for BigQuery to finish a load, then triggers Dataform, then sends a notification. It coordinates everything.",
    gcpExample:
      "DAG: 1. Extract → 2. Dataflow transform → 3. BigQuery load → 4. Dataform clean → 5. Data quality check → 6. Slack alert. Composer runs these in order daily at 2am.",
    whenToUse: [
      "Coordinating multiple pipeline steps with dependencies",
      "Steps span different tools (Dataflow, BigQuery, Dataproc, APIs)",
      "You need retry logic, failure alerts, and pipeline monitoring",
      "Complex schedules (depends on another job finishing, not just a clock time)",
    ],
    whenNotToUse: [
      "Simple SQL-only transformations — Dataform handles dependencies internally",
      "Single-step scheduled SQL — BigQuery scheduled queries are simpler",
      "Simple API chaining — Workflows is lighter weight",
    ],
    example:
      "Nightly pipeline: Composer DAG → triggers Dataflow (ingest) → waits → triggers Dataform (transform) → waits → runs data quality checks → sends Slack alert if anything fails.",
    relatedTerms: ["apache-airflow", "dag", "workflows", "cloud-scheduler", "dataform"],
    memoryShortcut:
      "Composer = the traffic controller. It does not move data — it tells other tools when to move it, waits for them, and handles failures.",
    commonConfusion:
      "Confused with Workflows and Cloud Scheduler. Scheduler = simple cron trigger. Workflows = lightweight API/service chaining. Composer = heavy-duty DAG orchestration for complex multi-step data pipelines.",
    gcpConsoleLocation: "GCP Console → Composer → Environments → Airflow UI",
  },
  {
    id: "apache-airflow",
    term: "Apache Airflow",
    aliases: ["Airflow"],
    category: "orchestration",
    generalDefinition:
      "An open-source workflow orchestration platform where you write pipelines as Python code and it schedules and monitors them for you.",
    gcpDefinition:
      "Cloud Composer is GCP's managed Apache Airflow. You write the same Airflow DAGs as you would on-premises or on other platforms, and Composer handles the infrastructure, scaling, and management.",
    simplerExplanation:
      "Airflow lets you write a Python file that says 'first do step 1, then do step 2 if step 1 succeeded, then do step 3.' It runs this on a schedule and emails you if anything goes wrong.",
    gcpExample:
      "Airflow DAG file (Python): with DAG('daily_pipeline', schedule='@daily') as dag: extract = DataflowOperator(...) transform = BigQueryOperator(...) extract >> transform",
    whenToUse: [
      "You are already using Airflow and want to move to GCP",
      "Your team knows Python and wants code-based pipeline orchestration",
    ],
    whenNotToUse: [
      "Your team does not know Python / Airflow — consider Workflows for simplicity",
      "Simple one-step jobs — Cloud Scheduler is enough",
    ],
    example:
      "Data team writes Airflow DAGs locally → deploys them to Cloud Composer → Composer runs them on GCP infrastructure.",
    relatedTerms: ["cloud-composer", "dag", "workflows", "cloud-scheduler"],
    memoryShortcut:
      "Airflow = the open-source engine. Composer = managed Airflow on GCP.",
    commonConfusion:
      "People use 'Airflow' and 'Composer' interchangeably. Airflow is the open-source tool. Composer is GCP's managed version of it. Same DAG code works in both.",
    gcpConsoleLocation: "GCP Console → Composer → Environments → Airflow UI",
  },
  {
    id: "dag",
    term: "DAG",
    aliases: ["Directed Acyclic Graph"],
    category: "concept",
    generalDefinition:
      "A way of defining a workflow as a sequence of tasks where each task can only run after its dependencies have completed — and the workflow can never loop back on itself.",
    gcpDefinition:
      "In Cloud Composer (Apache Airflow), you write DAGs as Python files. Each DAG defines a set of tasks (called operators) and the order they must run. Composer schedules and monitors the DAG execution.",
    simplerExplanation:
      "A DAG is a flowchart for your pipeline. Step A must happen before Step B, and Step B must happen before Step C. Crucially, you can never go backwards — it is one-way only (that is the 'acyclic' part).",
    gcpExample:
      "DAG: extract_data >> transform_data >> load_to_bigquery >> run_quality_checks >> send_slack_alert. Each >> means 'must happen before.'",
    whenToUse: [
      "Any time you use Cloud Composer / Airflow — DAGs are how you define pipelines",
    ],
    whenNotToUse: [
      "Simple single-step jobs do not need a full DAG",
    ],
    example:
      "Airflow DAG with 5 tasks: each task waits for the previous to succeed. If task 3 fails, tasks 4 and 5 do not run — and Airflow alerts you.",
    relatedTerms: ["cloud-composer", "apache-airflow", "orchestration", "cloud-scheduler"],
    memoryShortcut:
      "DAG = task flowchart. Dependencies flow one direction only. Never loops back.",
    commonConfusion:
      "People think DAGs are only for complex pipelines. Even a 2-step job (extract then load) is a DAG. The term sounds technical but just means 'tasks in order with dependencies.'",
    gcpConsoleLocation: "GCP Console → Composer → Environments → Airflow UI → DAGs",
  },
  {
    id: "workflows",
    term: "Workflows",
    aliases: ["Cloud Workflows"],
    category: "orchestration",
    generalDefinition:
      "A lightweight orchestration service for chaining together API calls and cloud service calls in sequence — simpler than a full orchestration platform like Airflow.",
    gcpDefinition:
      "Cloud Workflows lets you write YAML or JSON workflow definitions that call GCP APIs, HTTP endpoints, and cloud services in sequence. It is managed, serverless, and suited for API-driven pipelines without heavy data processing.",
    simplerExplanation:
      "Workflows is like a simple recipe runner for cloud services. Step 1: call Cloud Function. Step 2: call BigQuery API. Step 3: send a Pub/Sub message. No heavy infrastructure needed.",
    gcpExample:
      "Workflows YAML: step1: call Cloud Run job → step2: wait for BigQuery job → step3: call notification API.",
    whenToUse: [
      "Chaining together API calls and cloud services",
      "Lightweight orchestration without the overhead of Airflow/Composer",
      "Serverless pipeline orchestration for smaller workflows",
    ],
    whenNotToUse: [
      "Complex data pipelines with many steps and dependencies — use Composer",
      "Heavy data processing orchestration — Composer's Airflow operators are better suited",
    ],
    example:
      "Workflows: trigger Cloud Run job → check result → call BigQuery load API → notify via Pub/Sub. Simple, serverless, no Airflow needed.",
    relatedTerms: ["cloud-composer", "cloud-scheduler", "dag"],
    memoryShortcut:
      "Workflows = lightweight API chaining. Composer = heavy DAG orchestration. Use Workflows for simple service calls, Composer for complex data pipelines.",
    commonConfusion:
      "Confused with Composer. Composer is full Airflow DAG management for complex multi-step data pipelines. Workflows is simpler — good for orchestrating a handful of API/service calls.",
    gcpConsoleLocation: "GCP Console → Workflows",
  },
  {
    id: "cloud-scheduler",
    term: "Cloud Scheduler",
    aliases: ["Scheduler"],
    category: "orchestration",
    generalDefinition:
      "A managed cron job service — it triggers a job, function, or API endpoint at a specified time or on a repeating schedule. Nothing more.",
    gcpDefinition:
      "Cloud Scheduler fires HTTP requests, Pub/Sub messages, or App Engine tasks on a cron schedule. It is the simplest GCP orchestration tool — it just says 'start this thing at this time.'",
    simplerExplanation:
      "Cloud Scheduler is a timer. Set it to fire every day at 2am. It sends a signal to your Cloud Function, Cloud Run job, or Pub/Sub topic. What happens next is up to those services.",
    gcpExample:
      "Cloud Scheduler: every day at 02:00 UTC → POST to https://myapp.run.app/trigger-pipeline",
    whenToUse: [
      "Triggering a Cloud Run job or Cloud Function on a schedule",
      "Sending a Pub/Sub message at a specific time to kick off a pipeline",
      "Very simple scheduled triggers with no dependency management needed",
    ],
    whenNotToUse: [
      "Multiple dependent steps — Scheduler has no awareness of step dependencies",
      "You need retry logic or monitoring of pipeline steps — use Composer",
    ],
    example:
      "Cloud Scheduler fires every night at 2am → sends HTTP trigger to Cloud Run → Cloud Run runs a batch load job.",
    relatedTerms: ["cloud-composer", "workflows", "cron", "dag"],
    memoryShortcut:
      "Scheduler = just a timer. It starts something at a time. It does not manage what happens next.",
    commonConfusion:
      "Confused with Composer. Scheduler triggers once and forgets. Composer manages complex dependency graphs, retries, monitoring, and multi-step coordination.",
    gcpConsoleLocation: "GCP Console → Cloud Scheduler → Jobs",
  },
  {
    id: "cron",
    term: "Cron",
    aliases: ["cron job", "cron expression"],
    category: "concept",
    generalDefinition:
      "A standard way of expressing a repeating time schedule for jobs — like 'every day at 2am' or 'every Monday at noon.' The format is a 5-part expression: minute hour day month weekday.",
    gcpDefinition:
      "Cloud Scheduler uses cron expressions to define schedules. BigQuery scheduled queries also use cron-style schedules. Understanding cron expressions helps you set up any timed GCP job.",
    simplerExplanation:
      "Cron is just a schedule format. '0 2 * * *' means 'at minute 0, hour 2, every day, every month, any day of week' = every day at 2am. It is the universal language for scheduling.",
    gcpExample:
      "Cloud Scheduler schedule: '0 2 * * *' (daily at 2am) or '*/15 * * * *' (every 15 minutes)",
    whenToUse: [
      "Any time you configure a scheduled trigger in Cloud Scheduler, BigQuery, or Composer",
    ],
    whenNotToUse: [
      "When scheduling needs event-based triggers (not time-based) — use Pub/Sub",
    ],
    example:
      "'0 8 * * 1-5' = every weekday (Mon–Fri) at 8am. Used in Cloud Scheduler to trigger a daily business report.",
    relatedTerms: ["cloud-scheduler", "bigquery-scheduled-queries", "cloud-composer"],
    memoryShortcut:
      "Cron = a 5-number schedule code. '0 2 * * *' = daily at 2am. Learn the format once, use it everywhere.",
    commonConfusion:
      "People think cron is a GCP tool. Cron is a universal scheduling format/concept that GCP tools use. Cloud Scheduler is the GCP tool that uses cron expressions.",
    gcpConsoleLocation: undefined,
  },

  // ─── SERVING, BI & ML ────────────────────────────────────────────────────────
  {
    id: "looker",
    term: "Looker",
    aliases: [],
    category: "ml-ai",
    generalDefinition:
      "A business intelligence and data modeling platform that lets you define your company's metrics in one place and share consistent reports and dashboards across teams.",
    gcpDefinition:
      "Looker is GCP's enterprise BI platform. It uses LookML (a modeling language) to define business metrics centrally — so 'revenue' means the same thing in every report, for every team. It connects directly to BigQuery.",
    simplerExplanation:
      "Looker is for companies where different teams calculate the same metric differently. Define 'revenue' once in Looker, and every dashboard always uses the same definition. No more inconsistencies.",
    gcpExample:
      "BigQuery fact_orders table → Looker LookML model defines revenue metric → Sales, Finance, and Product dashboards all show the same revenue number.",
    whenToUse: [
      "Enterprise environments needing a shared, consistent metrics layer",
      "Multiple teams building dashboards that must agree on key business definitions",
      "Self-service analytics where business teams explore data without SQL",
    ],
    whenNotToUse: [
      "Quick one-off visualizations — Looker Studio is simpler and free",
      "Small teams without governance requirements",
    ],
    example:
      "Company uses Looker so that Finance, Sales, and Marketing all report the same revenue number — defined once in LookML, used everywhere.",
    relatedTerms: ["looker-studio", "bigquery", "star-schema", "fact-table"],
    memoryShortcut:
      "Looker = enterprise BI with a shared metrics layer. Define once, use everywhere.",
    commonConfusion:
      "Confused with Looker Studio. Looker is the enterprise product with LookML modeling. Looker Studio is the free drag-and-drop tool (like Google Slides for data). Different products, similar names.",
    gcpConsoleLocation: "looker.google.com (separate from GCP console)",
  },
  {
    id: "looker-studio",
    term: "Looker Studio",
    aliases: ["Google Data Studio", "Data Studio"],
    category: "ml-ai",
    generalDefinition:
      "A free, drag-and-drop dashboard and report builder — connect to your data and build visual charts and tables without writing code.",
    gcpDefinition:
      "Looker Studio (formerly Google Data Studio) connects to BigQuery, Google Sheets, and other sources. You drag chart components onto a canvas, connect fields, and publish dashboards. It is GCP's free self-service BI tool.",
    simplerExplanation:
      "Looker Studio is like Google Slides but for data. Connect it to BigQuery, drag in a bar chart, and you have a dashboard. Free and easy.",
    gcpExample:
      "BigQuery orders table → Looker Studio → bar chart of daily revenue → line chart of order volume → published dashboard shared with team.",
    whenToUse: [
      "Quick dashboards and visualizations for any team",
      "Sharing reports with stakeholders who do not have BigQuery access",
      "Free BI for small teams or personal projects",
    ],
    whenNotToUse: [
      "Complex metric governance across multiple teams — use Looker",
      "Real-time sub-second dashboards — has query latency",
    ],
    example:
      "Data engineer builds a Looker Studio dashboard connected to BigQuery → shares link with the marketing team → they see daily campaign metrics.",
    relatedTerms: ["looker", "bigquery", "dataform"],
    memoryShortcut:
      "Looker Studio = free, drag-and-drop dashboards. BigQuery stores the data; Looker Studio shows it.",
    commonConfusion:
      "Confused with Looker. Looker Studio = free, simple, drag-and-drop. Looker = paid, enterprise, with LookML modeling layer. Most teams start with Looker Studio.",
    gcpConsoleLocation: "lookerstudio.google.com",
  },
  {
    id: "vertex-ai",
    term: "Vertex AI",
    aliases: [],
    category: "ml-ai",
    generalDefinition:
      "Google's unified platform for everything machine learning and AI — training models, deploying them, monitoring them, building generative AI applications, and creating AI agents.",
    gcpDefinition:
      "Vertex AI is GCP's end-to-end ML/AI platform. It covers: custom model training (AutoML or custom code), model deployment to endpoints, feature engineering (Feature Store), generative AI (Gemini API), agents (via ADK), and model monitoring.",
    simplerExplanation:
      "Vertex AI is the all-in-one ML platform. You train a model, deploy it, monitor it, and build AI features — all in one place. For data engineers, it is where ML outputs get served and where agents are deployed.",
    gcpExample:
      "BigQuery training data → Vertex AI Training (custom model) → Vertex AI Endpoint (deployed API) → app calls the API for predictions.",
    whenToUse: [
      "Training and deploying custom ML models",
      "Serving a model endpoint for real-time predictions",
      "Building generative AI applications with Gemini",
      "AI agent development and deployment",
      "Feature engineering and feature store management",
    ],
    whenNotToUse: [
      "Standard ML on data already in BigQuery — BigQuery ML is simpler",
      "Simple BI and analytics — BigQuery + Looker Studio is enough",
    ],
    example:
      "Recommendation model trained in Vertex AI → deployed as an endpoint → e-commerce app calls it in real time to show personalized products.",
    relatedTerms: ["bigquery-ml", "adk", "agent-platform", "bigquery"],
    memoryShortcut:
      "Vertex AI = the full ML platform. Train, deploy, monitor, generate. Everything AI in GCP lives here.",
    commonConfusion:
      "Confused with BigQuery ML. BigQuery ML runs standard ML models using SQL inside BigQuery — fast and simple. Vertex AI is the full platform for custom models, generative AI, and agents. Use BQML if data is in BigQuery and model is standard; use Vertex AI for everything else.",
    gcpConsoleLocation: "GCP Console → Vertex AI → Dashboard",
  },
  {
    id: "bigquery-ml",
    term: "BigQuery ML",
    aliases: ["BQML"],
    category: "ml-ai",
    generalDefinition:
      "A feature inside BigQuery that lets you train and use machine learning models directly with SQL — without moving data to a separate ML platform.",
    gcpDefinition:
      "BigQuery ML lets you train classification, regression, clustering, forecasting, and anomaly detection models using SQL syntax inside BigQuery. The model training and prediction both happen inside BigQuery — no data export needed.",
    simplerExplanation:
      "If your data is already in BigQuery and you want to run a standard ML model, BigQuery ML lets you do it with SQL. No Python, no separate platform, no data movement.",
    gcpExample:
      "CREATE MODEL my_dataset.churn_model OPTIONS(model_type='logistic_reg') AS SELECT features, label FROM training_data;\nSELECT * FROM ML.PREDICT(MODEL my_dataset.churn_model, (SELECT features FROM new_data));",
    whenToUse: [
      "Data is already in BigQuery and you want standard ML (regression, classification, forecasting)",
      "Team knows SQL but not Python/ML frameworks",
      "Rapid prototyping of ML models without infrastructure setup",
    ],
    whenNotToUse: [
      "Custom deep learning or complex neural network architectures — use Vertex AI",
      "Models that need real-time low-latency serving — use a Vertex AI endpoint",
      "Large-scale feature engineering — use Vertex AI Feature Store",
    ],
    example:
      "Analysts write SQL to train a customer churn model inside BigQuery → predict churn probability for all customers → results in a BigQuery table → Looker Studio shows at-risk customers.",
    relatedTerms: ["vertex-ai", "bigquery", "dataform"],
    memoryShortcut:
      "BigQuery ML = ML with SQL, inside BigQuery. No Python, no data movement. Fast path to standard models.",
    commonConfusion:
      "Confused with Vertex AI. BigQuery ML is SQL-only, simple, fast for standard models. Vertex AI is the full platform for custom, complex, generative AI. Start with BQML if you can; graduate to Vertex AI when you need more.",
    gcpConsoleLocation: "GCP Console → BigQuery → SQL Workspace (run CREATE MODEL statement)",
  },

  // ─── GOVERNANCE & METADATA ───────────────────────────────────────────────────
  {
    id: "dataplex",
    term: "Dataplex",
    aliases: ["Google Cloud Dataplex"],
    category: "governance",
    generalDefinition:
      "A unified data governance platform — a place to catalog all your data assets, track where data came from and where it goes, set data quality rules, and control who owns what.",
    gcpDefinition:
      "Dataplex manages data governance across Cloud Storage and BigQuery. It includes: data catalog (discover and tag assets), data lineage (track data flow), data quality (set rules and run checks), and lakes/zones (organize assets logically).",
    simplerExplanation:
      "Dataplex is like a library catalog for all your data. You can search for any table, see who owns it, understand where it came from, check its quality score, and see what dashboards use it — all in one place.",
    gcpExample:
      "Dataplex catalog shows: table 'orders' → owner: data engineering team → lineage: from raw_orders → used by: revenue_dashboard → quality: 99.2% non-null on order_id.",
    whenToUse: [
      "You need to catalog and discover data assets across BigQuery and Cloud Storage",
      "Tracking data lineage (where did this table come from?)",
      "Enforcing data quality rules across datasets",
      "Compliance requirements around data ownership and access",
    ],
    whenNotToUse: [
      "Detecting or masking PII — use Cloud DLP / Sensitive Data Protection",
      "Simple single-team projects without governance requirements",
    ],
    example:
      "Data governance team sets up Dataplex → every BigQuery table has an owner, tags, quality rules → analysts can search for any dataset and understand it immediately.",
    relatedTerms: ["knowledge-catalog", "data-lineage", "data-quality", "iam", "policy-tags"],
    memoryShortcut:
      "Dataplex = the data catalog + lineage + quality platform. When the problem is trust, discovery, or ownership — think Dataplex.",
    commonConfusion:
      "Confused with Cloud DLP. Dataplex handles governance, catalog, and lineage. Cloud DLP (Sensitive Data Protection) handles detecting and masking PII. Both are governance tools, but for different problems.",
    gcpConsoleLocation: "GCP Console → Dataplex → Manage",
  },
  {
    id: "knowledge-catalog",
    term: "Knowledge Catalog",
    aliases: ["Data Catalog"],
    category: "governance",
    generalDefinition:
      "A searchable metadata inventory for all your data assets — so you can find any table, understand its contents, see its schema, and know who owns it.",
    gcpDefinition:
      "Knowledge Catalog (formerly Google Cloud Data Catalog) is now part of Dataplex. It automatically ingests metadata from BigQuery, Cloud Storage, and Pub/Sub. You can add custom tags, business descriptions, and ownership information.",
    simplerExplanation:
      "Imagine searching Google but for your company's internal data. Type 'orders' and see every table, file, and stream related to orders — with descriptions, owners, and usage stats.",
    gcpExample:
      "Search Dataplex catalog for 'customer' → finds: bigquery.dataset.customers, bigquery.dataset.customer_events, gs://raw/customers.csv → each shows schema, tags, owner.",
    whenToUse: [
      "Finding and understanding data assets across your organization",
      "Adding business context and descriptions to technical data",
      "Onboarding new team members who need to find relevant datasets",
    ],
    whenNotToUse: [
      "Running SQL on the data — use BigQuery for that",
    ],
    example:
      "New analyst joins the team → searches Knowledge Catalog → finds the fact_orders table → sees schema, owner, quality score, and example queries → starts working immediately.",
    relatedTerms: ["dataplex", "metadata", "data-discovery", "data-lineage"],
    memoryShortcut:
      "Knowledge Catalog = Google Search for your internal data assets.",
    commonConfusion:
      "Often confused with Dataplex itself. Knowledge Catalog is the catalog/search component. Dataplex is the broader governance platform that includes catalog, lineage, quality, and lakes.",
    gcpConsoleLocation: "GCP Console → Dataplex → Catalog",
  },
  {
    id: "metadata",
    term: "Metadata",
    aliases: [],
    category: "concept",
    generalDefinition:
      "Data about data — information that describes a dataset without being the actual content. Things like: what columns it has, when it was last updated, who owns it, and how many rows it contains.",
    gcpDefinition:
      "In GCP, Dataplex and Knowledge Catalog manage metadata for BigQuery tables and Cloud Storage objects. Metadata includes technical (schema, row count, last modified) and business (owner, description, tags) information.",
    simplerExplanation:
      "Metadata is the label on the box, not the contents inside. For a BigQuery table: the metadata tells you it has 5 columns, 2 million rows, was last updated yesterday, and is owned by the data team.",
    gcpExample:
      "BigQuery table metadata: schema (order_id STRING, amount NUMERIC, date DATE), partitioned by date, 120M rows, last modified: 2024-01-15, owner: data-eng@company.com",
    whenToUse: [
      "Always present — every data asset has metadata",
      "Focus on metadata when building governance, catalog, or lineage systems",
    ],
    whenNotToUse: [],
    example:
      "A new analyst asks 'what does this table contain?' The answer comes from metadata — schema, description, and tags — not from reading the actual rows.",
    relatedTerms: ["dataplex", "knowledge-catalog", "data-lineage", "schema"],
    memoryShortcut:
      "Metadata = data about your data. The label, not the contents.",
    commonConfusion:
      "People think metadata is unimportant. In production data engineering, metadata (ownership, lineage, quality scores) is often more valuable than the data itself for governance and trust.",
    gcpConsoleLocation: undefined,
  },
  {
    id: "data-discovery",
    term: "Data Discovery",
    aliases: [],
    category: "concept",
    generalDefinition:
      "The process of finding, understanding, and evaluating data assets within an organization — knowing what data exists, where it lives, and whether it is trustworthy.",
    gcpDefinition:
      "In GCP, Dataplex and Knowledge Catalog enable data discovery by automatically scanning and cataloging assets in BigQuery and Cloud Storage, making them searchable.",
    simplerExplanation:
      "Data discovery is the ability to answer 'what data does our company have?' without asking someone. A good catalog makes this self-service.",
    gcpExample:
      "Data analyst needs order data → searches Dataplex catalog → finds three candidate tables → reads descriptions and quality scores → picks the right one without emailing anyone.",
    whenToUse: [
      "Building a data catalog for self-service analytics",
      "Onboarding new engineers and analysts",
      "Compliance audits that require knowing what data exists",
    ],
    whenNotToUse: [],
    example:
      "Without data discovery: analysts email the data team asking 'is there a table for returns?' With Dataplex: they search and find it in 30 seconds.",
    relatedTerms: ["dataplex", "knowledge-catalog", "metadata", "data-lineage"],
    memoryShortcut:
      "Data discovery = find and understand your data assets without asking someone.",
    commonConfusion:
      "Confused with data lineage. Discovery answers 'what data exists?' Lineage answers 'where did this data come from?'",
    gcpConsoleLocation: "GCP Console → Dataplex → Catalog",
  },
  {
    id: "data-lineage",
    term: "Data Lineage",
    aliases: ["lineage"],
    category: "concept",
    generalDefinition:
      "A map showing where data came from, what transformations it went through, and where it ended up — tracing the full journey of data from source to destination.",
    gcpDefinition:
      "GCP captures lineage automatically for supported services like BigQuery and Dataflow when the Data Lineage API is enabled. Dataplex shows the lineage graph. Example: raw_orders → Dataform cleaned_orders → revenue_dashboard.",
    simplerExplanation:
      "Lineage is the data's family tree. If something looks wrong in your dashboard, lineage lets you trace back: 'this number came from this table, which came from this pipeline, which reads from this source.' You find the problem.",
    gcpExample:
      "Dataplex lineage view: gs://raw/orders.csv → BigQuery raw_orders → Dataform cleaned_orders → BigQuery fact_orders → Looker Studio revenue_dashboard.",
    whenToUse: [
      "Debugging: tracing where a data error originated",
      "Compliance: proving where sensitive data came from and where it went",
      "Impact analysis: understanding what breaks if a source table changes",
    ],
    whenNotToUse: [],
    example:
      "Revenue dashboard shows wrong numbers → data engineer follows lineage backward → discovers a Dataform transformation had a bug two steps upstream.",
    relatedTerms: ["dataplex", "data-quality", "metadata", "dataform"],
    memoryShortcut:
      "Data lineage = the data's journey map. Source → transform → destination, every step visible.",
    commonConfusion:
      "Confused with data catalog. Catalog tells you what data exists. Lineage tells you how it flows — where it came from and where it goes.",
    gcpConsoleLocation: "GCP Console → Dataplex → Lineage",
  },
  {
    id: "data-quality",
    term: "Data Quality",
    aliases: [],
    category: "concept",
    generalDefinition:
      "Checks and measurements that verify data is correct, complete, and usable — detecting problems like missing values, duplicates, impossible values, or unexpected drops in row counts.",
    gcpDefinition:
      "Dataplex includes data quality rules that run against BigQuery tables on a schedule. You define rules (e.g., 'order_id must not be null', 'amount must be > 0') and Dataplex runs them and reports pass/fail metrics.",
    simplerExplanation:
      "Data quality answers: 'Can I trust this data?' Common checks: Are there any nulls where there shouldn't be? Are there duplicates? Did the row count drop 90% compared to yesterday? If yes, something is wrong.",
    gcpExample:
      "Dataplex quality rule: orders table → order_id NOT NULL (pass rate: 100%) → amount > 0 (pass rate: 99.8%) → no duplicate order_ids (pass rate: 100%).",
    whenToUse: [
      "Any production pipeline — data quality checks should always be part of it",
      "After every data load to catch issues before they reach dashboards",
      "Compliance environments where data accuracy is required",
    ],
    whenNotToUse: [],
    example:
      "Daily pipeline loads orders → Dataplex quality check runs → detects 3% null order_ids → alerts data engineering team → pipeline pauses before bad data reaches analysts.",
    relatedTerms: ["dataplex", "data-lineage", "idempotency", "cloud-monitoring"],
    memoryShortcut:
      "Data quality = 'Can I trust this data?' Run checks after every load.",
    commonConfusion:
      "Data quality is sometimes treated as optional. In production, it is essential — bad data in a dashboard that nobody catches can cause real business decisions based on wrong numbers.",
    gcpConsoleLocation: "GCP Console → Dataplex → Data Quality",
  },

  // ─── SECURITY ────────────────────────────────────────────────────────────────
  {
    id: "iam",
    term: "IAM",
    aliases: ["Identity and Access Management", "Cloud IAM"],
    category: "security",
    generalDefinition:
      "The system that controls who can access what in a cloud environment — defining which users and services have permission to perform which actions.",
    gcpDefinition:
      "Google Cloud IAM assigns roles to principals (users, service accounts, groups) at the project, dataset, or resource level. Examples: BigQuery Data Viewer, Storage Object Creator, Dataflow Worker. IAM is the foundation of all GCP security.",
    simplerExplanation:
      "IAM is the bouncer at every door in GCP. It checks: 'Does this person or service have permission to do this thing?' If not, access denied. You define who can read, write, or run things — at every level.",
    gcpExample:
      "Service account 'dataflow-runner@project.iam.gserviceaccount.com' → granted role 'roles/bigquery.dataEditor' → can write to BigQuery but cannot delete datasets.",
    whenToUse: [
      "Every GCP deployment — IAM is always required",
      "Restricting who can access which BigQuery datasets",
      "Giving Dataflow jobs permission to write to BigQuery",
      "Separating read-only access (analysts) from write access (pipelines)",
    ],
    whenNotToUse: [
      "Fine-grained column or row level access — use Policy Tags and row-level security in BigQuery",
    ],
    example:
      "Analyst gets role 'BigQuery Data Viewer' on the analytics dataset → can run queries but cannot modify tables or see raw data buckets.",
    relatedTerms: ["policy-tags", "column-level-security", "row-level-security", "sensitive-data-protection"],
    memoryShortcut:
      "IAM = who can do what. The master access control system for all of GCP.",
    commonConfusion:
      "IAM controls resource-level access (who can see this dataset). Policy tags control column-level access (who can see this column). Row-level security controls which rows. All three work together.",
    gcpConsoleLocation: "GCP Console → IAM & Admin → IAM",
  },
  {
    id: "policy-tags",
    term: "Policy Tags",
    aliases: ["column policy tags", "BigQuery column security"],
    category: "security",
    generalDefinition:
      "Labels attached to specific columns in a database table that enforce access control — only users or groups with the right permission can see the data in those columns.",
    gcpDefinition:
      "In BigQuery, policy tags are applied to columns in a table schema. They integrate with IAM to control who can read sensitive columns. If a user queries a table and lacks permission on a policy-tagged column, that column is masked or blocked.",
    simplerExplanation:
      "Imagine your orders table has a 'credit_card_number' column. You attach a policy tag called 'PCI-Sensitive' to it. Now only the payments team, who have been granted access to that tag, can see those values. Everyone else sees NULL.",
    gcpExample:
      "BigQuery column 'ssn' → policy tag: 'Sensitive/PII' → only users with role 'Fine-grained Reader' on the PII taxonomy can see SSN values.",
    whenToUse: [
      "Sensitive columns (SSNs, credit card numbers, salary, health data) that only some users should see",
      "Regulatory compliance (GDPR, HIPAA, PCI-DSS) requiring column-level restrictions",
    ],
    whenNotToUse: [
      "Restricting who can see entire tables or datasets — use IAM roles instead",
      "Row-level restrictions — use BigQuery row-level security or authorized views",
    ],
    example:
      "HR table has salary column → policy tag applied → only HR managers and finance team can see salary values → all other analysts see NULL in that column.",
    relatedTerms: ["iam", "column-level-security", "row-level-security", "bigquery", "sensitive-data-protection", "pii"],
    memoryShortcut:
      "Policy tags = the lock on individual columns. Column-level access control in BigQuery.",
    commonConfusion:
      "Confused with IAM. IAM controls dataset/table access. Policy tags control individual column access. You need both for complete security.",
    gcpConsoleLocation: "GCP Console → BigQuery → Schema → column → Policy tags",
  },
  {
    id: "column-level-security",
    term: "Column-Level Security",
    aliases: ["CLS", "column security"],
    category: "security",
    generalDefinition:
      "The ability to restrict access to individual columns within a database table — so different users see different columns of the same table depending on their permissions.",
    gcpDefinition:
      "In BigQuery, column-level security is implemented using policy tags. Sensitive columns get a policy tag; IAM controls who can read that tag; users without permission see the column as NULL when they query.",
    simplerExplanation:
      "The whole table is visible, but certain columns are hidden based on who is asking. An analyst can see all orders but not the payment details column — because that column is locked with a policy tag.",
    gcpExample:
      "Table: customer_orders (order_id, customer_name, amount, [MASKED: credit_card_last4], [MASKED: billing_address]). Analysts see dashes; finance team sees real values.",
    whenToUse: [
      "Any table containing a mix of public and sensitive column data",
      "GDPR, HIPAA, PCI compliance requirements",
    ],
    whenNotToUse: [
      "Entire table should be hidden from certain users — use IAM",
    ],
    example:
      "employees table: name and department visible to all managers → salary and SSN visible only to HR and finance → column-level security controls the difference.",
    relatedTerms: ["policy-tags", "row-level-security", "iam", "pii", "bigquery"],
    memoryShortcut:
      "Column security = hide specific columns from specific users. Policy tags are the GCP mechanism.",
    commonConfusion:
      "Confused with row-level security. Column security hides specific fields. Row security hides specific rows (e.g., a manager can only see their team's rows).",
    gcpConsoleLocation: "GCP Console → BigQuery → Schema → column → Policy tags",
  },
  {
    id: "row-level-security",
    term: "Row-Level Security",
    aliases: ["RLS", "row access policies"],
    category: "security",
    generalDefinition:
      "The ability to restrict which rows of a table a particular user can see — so different users querying the same table get back different subsets of data.",
    gcpDefinition:
      "BigQuery supports row-level security via row access policies. You define a filter condition tied to a user group. When that group queries the table, BigQuery automatically appends the filter — they only see their allowed rows.",
    simplerExplanation:
      "A sales manager queries the orders table. Row-level security automatically adds a filter: 'WHERE region = manager's region.' They never see rows from other regions, even though the table contains all of them.",
    gcpExample:
      "Row access policy: users in group 'us-west-team@company.com' → filter: region = 'US-West' → they always see only US-West rows even with SELECT *.",
    whenToUse: [
      "Multi-region or multi-team tables where each team should only see their data",
      "Regulatory requirements for data segmentation",
      "Reducing accidental access to sensitive rows",
    ],
    whenNotToUse: [
      "Hiding specific columns — use column-level security / policy tags",
      "Entirely blocking table access — use IAM",
    ],
    example:
      "Finance table with data from 50 countries → country managers can only see their country's rows → one table, 50 different views of it.",
    relatedTerms: ["column-level-security", "policy-tags", "iam", "bigquery"],
    memoryShortcut:
      "Row security = automatic WHERE clause per user. Same table, different rows for different people.",
    commonConfusion:
      "Confused with column-level security. Row security controls which records you see. Column security controls which fields you see.",
    gcpConsoleLocation: "GCP Console → BigQuery → Table → Row access policies",
  },
  {
    id: "sensitive-data-protection",
    term: "Sensitive Data Protection",
    aliases: ["Cloud DLP", "DLP", "Data Loss Prevention"],
    category: "security",
    generalDefinition:
      "A tool that automatically scans data to find, classify, and optionally mask or remove sensitive information like social security numbers, credit card numbers, phone numbers, and email addresses.",
    gcpDefinition:
      "Cloud DLP (now Sensitive Data Protection) scans BigQuery tables and Cloud Storage files for PII and sensitive data. It can identify what is sensitive, classify it by type, and de-identify it (mask, tokenize, or redact) so it can be used safely.",
    simplerExplanation:
      "Think of Sensitive Data Protection as a highlighter that reads your entire dataset and marks anything that looks sensitive. It then gives you options: mask it, delete it, or just report it.",
    gcpExample:
      "Scan BigQuery table → finds: column 'notes' contains email addresses and phone numbers (not expected) → DLP flags them → engineer adds policy tags and masking.",
    whenToUse: [
      "Discovering where PII exists in your data (you may not know)",
      "De-identifying data before sharing with external parties",
      "Compliance audits that require proving sensitive data is protected",
      "Scanning vendor-provided files for unexpected sensitive content",
    ],
    whenNotToUse: [
      "Governing data catalog and lineage — use Dataplex",
      "Access control — use IAM and policy tags",
    ],
    example:
      "Customer support logs are scanned with Cloud DLP → discovers phone numbers embedded in freetext fields → engineer masks them before the logs go to BigQuery.",
    relatedTerms: ["pii", "policy-tags", "iam", "dataplex", "data-quality"],
    memoryShortcut:
      "Sensitive Data Protection = find and mask PII. If the problem is discovering or de-identifying sensitive data, think DLP.",
    commonConfusion:
      "Confused with Dataplex. Dataplex handles governance, catalog, and lineage. Cloud DLP handles finding and masking sensitive/PII data. Both are governance tools but solve different problems.",
    gcpConsoleLocation: "GCP Console → Security → Sensitive Data Protection",
  },
  {
    id: "pii",
    term: "PII",
    aliases: ["Personally Identifiable Information", "personal data"],
    category: "concept",
    generalDefinition:
      "Any data that can be used to identify a specific person — such as their name, email, phone number, social security number, IP address, or health records.",
    gcpDefinition:
      "In GCP data pipelines, PII must be identified, classified, and protected. Cloud DLP scans for PII. Policy tags restrict who can access PII columns. Row-level security limits row access. GDPR and HIPAA are common regulations that require PII protection.",
    simplerExplanation:
      "PII is data that could identify you as a person. Name, email, phone, SSN, date of birth — all PII. In data engineering, you must handle PII carefully: restrict who sees it, mask it when not needed, and track where it flows.",
    gcpExample:
      "orders table columns: order_id (not PII), amount (not PII), customer_email (PII), customer_ssn (PII) → DLP scans → policy tags applied → only authorized users see PII columns.",
    whenToUse: [
      "Always — any time your data contains customer or employee information",
    ],
    whenNotToUse: [],
    example:
      "Analytics team needs to analyze order patterns. They get a masked version of the orders table where email is replaced with a hashed ID — can analyze behavior without accessing real PII.",
    relatedTerms: ["sensitive-data-protection", "policy-tags", "column-level-security", "iam", "data-lineage"],
    memoryShortcut:
      "PII = anything that identifies a real person. Must be found (DLP), controlled (policy tags), and tracked (lineage).",
    commonConfusion:
      "Not all sensitive data is PII. Financial data, trade secrets, or internal strategy documents are sensitive but not personally identifiable. PII specifically refers to data that identifies individuals.",
    gcpConsoleLocation: undefined,
  },

  // ─── MONITORING & RELIABILITY ─────────────────────────────────────────────────
  {
    id: "cloud-logging",
    term: "Cloud Logging",
    aliases: ["Stackdriver Logging", "GCP Logging"],
    category: "monitoring",
    generalDefinition:
      "A centralized system for storing and searching log messages from all your cloud services — so you can see what happened, when, and why when something goes wrong.",
    gcpDefinition:
      "Cloud Logging automatically collects logs from GCP services (Dataflow, BigQuery, Cloud Run, Cloud Functions, etc.). You can query logs using the Logs Explorer, set up log-based alerts, and export logs to BigQuery or Cloud Storage for analysis.",
    simplerExplanation:
      "Every GCP service writes logs when it does something. Cloud Logging is where all those logs collect. When your Dataflow job fails at 3am, you open Cloud Logging to read the error message and find out why.",
    gcpExample:
      "Dataflow job fails → Cloud Logging shows: 'java.lang.NullPointerException at row 1,402,331: field order_id is null' → engineer identifies the bad source data.",
    whenToUse: [
      "Debugging pipeline failures and errors",
      "Auditing who did what and when in your GCP environment",
      "Building dashboards or alerts from log data",
      "Any time you need to understand what happened in a GCP service",
    ],
    whenNotToUse: [
      "Metrics and dashboards (latency, CPU, throughput) — use Cloud Monitoring",
    ],
    example:
      "Cloud Composer DAG fails → engineer opens Cloud Logging → filters to the failing task → reads the Python traceback → fixes the bug.",
    relatedTerms: ["cloud-monitoring", "error-reporting", "dataflow", "cloud-composer"],
    memoryShortcut:
      "Cloud Logging = the error log reader. When something breaks, read the logs first.",
    commonConfusion:
      "Confused with Cloud Monitoring. Logging stores text log messages (errors, events). Monitoring tracks numerical metrics (latency, error rate, CPU). Use Logging to find out what happened; Monitoring to know when to alert.",
    gcpConsoleLocation: "GCP Console → Logging → Logs Explorer",
  },
  {
    id: "cloud-monitoring",
    term: "Cloud Monitoring",
    aliases: ["Stackdriver Monitoring", "GCP Monitoring"],
    category: "monitoring",
    generalDefinition:
      "A system for tracking numerical metrics from your cloud services over time, setting thresholds, and automatically alerting you when something looks wrong.",
    gcpDefinition:
      "Cloud Monitoring collects metrics from GCP services (Dataflow throughput, BigQuery slot usage, Pub/Sub backlog, etc.). You create dashboards, alert policies (e.g., 'alert me if Dataflow job latency exceeds 10 minutes'), and uptime checks.",
    simplerExplanation:
      "Cloud Monitoring is like a health dashboard for your data infrastructure. It tracks numbers (how fast is data flowing? how full is the Pub/Sub backlog? how many BigQuery slots are used?) and pages you when something is out of range.",
    gcpExample:
      "Alert policy: Pub/Sub subscription backlog > 100,000 messages → send PagerDuty alert → on-call engineer investigates why Dataflow is falling behind.",
    whenToUse: [
      "Setting up alerts when pipelines fail or fall behind",
      "Monitoring Dataflow job latency and throughput",
      "Tracking BigQuery slot usage and costs",
      "Pub/Sub backlog monitoring",
    ],
    whenNotToUse: [
      "Reading error messages and tracebacks — use Cloud Logging",
    ],
    example:
      "Monitoring alert: 'Dataflow streaming pipeline has not produced output in 15 minutes' → PagerDuty fires → on-call engineer investigates.",
    relatedTerms: ["cloud-logging", "error-reporting", "sla", "slo"],
    memoryShortcut:
      "Monitoring = the alerting system. Numbers, thresholds, and pages when something is wrong.",
    commonConfusion:
      "Confused with Cloud Logging. Monitoring is for metrics (numbers over time). Logging is for events and error text. You use Monitoring to know when to investigate; Logging to actually investigate.",
    gcpConsoleLocation: "GCP Console → Monitoring → Overview",
  },
  {
    id: "error-reporting",
    term: "Error Reporting",
    aliases: ["Cloud Error Reporting"],
    category: "monitoring",
    generalDefinition:
      "A tool that automatically groups and counts errors from your application or pipeline logs, surfaces the most frequent ones, and notifies you of new error types.",
    gcpDefinition:
      "Cloud Error Reporting aggregates error messages from Cloud Logging (for Cloud Run, Cloud Functions, App Engine, etc.) and presents them as a ranked list of error groups. It is most useful for service-based pipelines with application code.",
    simplerExplanation:
      "Instead of reading through thousands of log lines, Error Reporting groups identical errors together and tells you: 'This same NullPointerException happened 1,402 times in the last hour.' Start with the highest-frequency error.",
    gcpExample:
      "Cloud Run service processing pipeline → Error Reporting shows: NullPointerException × 1,402, KeyError 'order_id' × 88, TimeoutError × 12 → fix the top one first.",
    whenToUse: [
      "Service-based pipelines (Cloud Run, Cloud Functions) where errors repeat",
      "Quickly identifying the most impactful errors without reading raw logs",
    ],
    whenNotToUse: [
      "Pure Dataflow or BigQuery jobs — those have their own error UIs",
      "Metrics and alerting — use Cloud Monitoring",
    ],
    example:
      "Python Cloud Run ETL service → new deployment introduced a bug → Error Reporting shows 500 identical errors per minute → immediate rollback.",
    relatedTerms: ["cloud-logging", "cloud-monitoring", "trace"],
    memoryShortcut:
      "Error Reporting = 'what broke the most?' Groups identical errors and surfaces the top ones.",
    commonConfusion:
      "Sometimes confused with Cloud Logging. Logging stores every log line. Error Reporting aggregates and counts repeated error patterns from those logs.",
    gcpConsoleLocation: "GCP Console → Error Reporting",
  },
  {
    id: "trace",
    term: "Cloud Trace",
    aliases: ["Trace", "Stackdriver Trace"],
    category: "monitoring",
    generalDefinition:
      "A tool for tracking how long different parts of a request or pipeline step took — useful for finding performance bottlenecks in distributed systems.",
    gcpDefinition:
      "Cloud Trace collects latency data from GCP services and applications. It shows a waterfall view of how a request flowed through your system and which step took the longest. Most relevant for API-serving pipelines and microservices.",
    simplerExplanation:
      "Trace is like a stopwatch for each step in your pipeline. It shows: step 1 took 20ms, step 2 took 850ms, step 3 took 5ms. The bottleneck is clearly step 2.",
    gcpExample:
      "API request → Cloud Trace shows: authentication: 10ms, database query: 820ms, response formatting: 5ms → 'database query is the bottleneck.'",
    whenToUse: [
      "Diagnosing latency problems in API-serving or microservice pipelines",
      "Finding slow steps in complex distributed workflows",
    ],
    whenNotToUse: [
      "Pure batch data pipelines — Dataflow has its own profiling UI",
      "Alert-based monitoring — use Cloud Monitoring",
    ],
    example:
      "Data API serving predictions is slow → Cloud Trace shows BigQuery lookup step is taking 2 seconds → engineer adds caching → latency drops to 50ms.",
    relatedTerms: ["cloud-logging", "cloud-monitoring", "error-reporting"],
    memoryShortcut:
      "Trace = stopwatch for each step. Find the slowest part of your pipeline.",
    commonConfusion:
      "People confuse Trace with Logging. Logging records what happened. Trace records how long each step took. Both are useful but answer different questions.",
    gcpConsoleLocation: "GCP Console → Trace",
  },

  // ─── AI AGENTS & AUTOMATION ───────────────────────────────────────────────────
  {
    id: "adk",
    term: "Google ADK",
    aliases: ["ADK", "Agent Development Kit", "Google Agent Development Kit"],
    category: "agents",
    generalDefinition:
      "An open-source software toolkit for building AI agents — programs that can reason through a task, use tools, call APIs, access data, and return useful results.",
    gcpDefinition:
      "Google ADK (Agent Development Kit) is the framework for building AI agents that integrate with GCP services. An agent built with ADK can: query BigQuery, call Vertex AI models, read from Cloud Storage, publish to Pub/Sub, and coordinate sub-agents.",
    simplerExplanation:
      "ADK is the toolkit for building an AI that can actually do things — not just answer questions. You give it tools (like 'run this SQL' or 'check this API') and it decides which tools to use to complete a task.",
    gcpExample:
      "ADK agent: user asks 'Why did revenue drop yesterday?' → agent calls BigQuery (runs SQL) → calls Dataflow logs API → calls data quality API → synthesizes and returns explanation.",
    whenToUse: [
      "Building AI agents that need to use tools and take actions",
      "Data engineering automation (pipeline failure investigation, quality monitoring)",
      "Natural language interfaces over BigQuery or other data systems",
    ],
    whenNotToUse: [
      "Simple chatbots that only answer questions — do not need an agent framework",
      "Standard ML model serving — use Vertex AI endpoints",
    ],
    example:
      "Pipeline failure investigation agent: wakes up on alert → queries Cloud Logging → queries BigQuery quality results → posts summary in Slack. Built with ADK.",
    relatedTerms: ["agent-platform", "agent-studio", "vertex-ai", "tool-calling"],
    memoryShortcut:
      "ADK = the toolkit to BUILD agents. Agent Platform = where to DEPLOY and GOVERN them.",
    commonConfusion:
      "Confused with Agent Platform. ADK is the development framework (what you write code with). Agent Platform is the managed environment (where agents run at enterprise scale).",
    gcpConsoleLocation: "Part of Vertex AI → Agent Builder",
  },
  {
    id: "agent-platform",
    term: "Agent Platform",
    aliases: ["Gemini Enterprise Agent Platform", "Google Agent Platform"],
    category: "agents",
    generalDefinition:
      "A managed cloud platform for deploying, scaling, monitoring, and governing AI agents — providing the infrastructure so you do not have to manage it yourself.",
    gcpDefinition:
      "The Gemini Enterprise Agent Platform is GCP's managed platform for enterprise AI agents. It includes: ADK (build), Agent Studio (visual build), Agent Garden (templates), Model Garden (models), Agent Runtime/Engine (run), and governance tools.",
    simplerExplanation:
      "If ADK is for writing agents, Agent Platform is the infrastructure that runs them reliably at scale. It handles session management, memory, scaling, access control, and monitoring for your agents.",
    gcpExample:
      "ADK agent code → deployed to Agent Runtime → scaled automatically → sessions managed → monitored via Cloud Monitoring → governed by IAM.",
    whenToUse: [
      "Deploying ADK agents to production at scale",
      "Needing managed sessions, memory, and governance for agents",
      "Enterprise environments requiring agent access control and audit trails",
    ],
    whenNotToUse: [
      "Prototyping locally — ADK alone is enough",
      "Simple automated scripts — not every automation needs an agent platform",
    ],
    example:
      "Company deploys a 'Revenue Analyst Agent' to Agent Platform → it handles 100 concurrent user queries → sessions isolated per user → access logs maintained.",
    relatedTerms: ["adk", "agent-studio", "agent-garden", "model-garden", "agent-runtime", "vertex-ai"],
    memoryShortcut:
      "Agent Platform = production infrastructure for running agents. ADK builds them; Platform runs them.",
    commonConfusion:
      "Confused with ADK. ADK is the development tool. Agent Platform is the managed runtime. You use both: ADK to write the agent, Agent Platform to deploy it.",
    gcpConsoleLocation: "GCP Console → Vertex AI → Agent Builder",
  },
  {
    id: "agent-studio",
    term: "Agent Studio",
    aliases: [],
    category: "agents",
    generalDefinition:
      "A visual, low-code interface for building AI agents without writing all the agent logic from scratch — using a canvas and pre-built components.",
    gcpDefinition:
      "Agent Studio is part of the Google Agent Platform. It provides a visual canvas where you drag, drop, and configure agent components — tools, models, prompts, and workflows — without needing to write raw ADK Python code.",
    simplerExplanation:
      "Agent Studio is to ADK what Data Fusion is to Dataflow — the visual no-code option. You build agents by clicking and connecting components instead of writing code.",
    gcpExample:
      "Agent Studio canvas: Model (Gemini) → Tool (BigQuery query) → Tool (Send Slack message) → connected visually → deployed as an agent.",
    whenToUse: [
      "Teams that want to build agents without deep Python expertise",
      "Quickly prototyping agent workflows before coding them",
    ],
    whenNotToUse: [
      "Complex custom agent logic that requires precise code control — use ADK directly",
    ],
    example:
      "Product manager builds a 'weekly metrics agent' in Agent Studio in 2 hours — no engineering required. It queries BigQuery and emails a summary every Monday.",
    relatedTerms: ["adk", "agent-platform", "agent-garden"],
    memoryShortcut:
      "Agent Studio = visual agent builder. Like Data Fusion but for AI agents.",
    commonConfusion:
      "Confused with ADK. ADK is for code-first agent development. Agent Studio is the visual canvas for teams who prefer less code.",
    gcpConsoleLocation: "GCP Console → Vertex AI → Agent Builder → Agent Studio",
  },
  {
    id: "agent-garden",
    term: "Agent Garden",
    aliases: [],
    category: "agents",
    generalDefinition:
      "A library of pre-built agent templates and components — ready-made agents you can use as-is or customize rather than building from scratch.",
    gcpDefinition:
      "Agent Garden is part of Google's Agent Platform. It provides pre-built agents (data quality agent, SQL assistant, document summarizer) and reusable tools and components that accelerate agent development.",
    simplerExplanation:
      "Agent Garden is a cookbook for agents. Instead of starting from a blank page, you pick a recipe (pre-built agent) and adapt it to your situation.",
    gcpExample:
      "Agent Garden template: 'SQL Query Agent' — already wired to query BigQuery from natural language. Customize with your dataset and deploy.",
    whenToUse: [
      "Jumpstarting agent development with proven patterns",
      "When a pre-built agent closely matches your use case",
    ],
    whenNotToUse: [
      "Highly custom agent requirements with unique workflows — build with ADK directly",
    ],
    example:
      "Data team needs a 'data quality monitoring agent' → finds one in Agent Garden → adapts it for their BigQuery datasets → deploys in 1 day instead of 2 weeks.",
    relatedTerms: ["adk", "agent-platform", "agent-studio", "model-garden"],
    memoryShortcut:
      "Agent Garden = pre-built agent templates. Start here before building from scratch.",
    commonConfusion:
      "Confused with Model Garden. Agent Garden = pre-built agent templates. Model Garden = pre-built AI models. Different levels of abstraction.",
    gcpConsoleLocation: "GCP Console → Vertex AI → Agent Builder → Agent Garden",
  },
  {
    id: "model-garden",
    term: "Model Garden",
    aliases: [],
    category: "agents",
    generalDefinition:
      "A catalog of AI models — Google's models, third-party models, and open-source models — in one place, ready to use in your applications and agents.",
    gcpDefinition:
      "Vertex AI Model Garden provides access to Gemini models, Google's specialized models (image, code, text), and open-source models (Llama, Mistral, etc.). You select a model, deploy it, and use it in your agents or applications.",
    simplerExplanation:
      "Model Garden is the app store for AI models. You browse, pick the model that fits your use case, and use it — without training your own model from scratch.",
    gcpExample:
      "Build an agent that summarizes financial reports → pick Gemini Pro from Model Garden → connect to Agent Studio → agent is powered by the right model for the task.",
    whenToUse: [
      "Selecting the right AI model for your agent or application",
      "Accessing open-source models (Llama, Mistral) on GCP infrastructure",
      "Comparing models before committing to one",
    ],
    whenNotToUse: [
      "You need a fully custom model trained on your own data — use Vertex AI Training",
    ],
    example:
      "Data engineering team needs a code generation model for SQL assistant agent → browse Model Garden → pick Codey (Google's code model) → integrate with ADK.",
    relatedTerms: ["vertex-ai", "adk", "agent-platform", "agent-garden"],
    memoryShortcut:
      "Model Garden = the model catalog. Pick your AI brain from here.",
    commonConfusion:
      "Confused with Agent Garden. Model Garden = AI models. Agent Garden = agent templates. A model is the intelligence; an agent is the system that uses the model to do work.",
    gcpConsoleLocation: "GCP Console → Vertex AI → Model Garden",
  },
  {
    id: "agent-runtime",
    term: "Agent Runtime",
    aliases: ["Agent Engine"],
    category: "agents",
    generalDefinition:
      "The managed infrastructure that runs AI agents in production — handling the execution, scaling, and lifecycle of agent requests.",
    gcpDefinition:
      "Agent Runtime (also called Agent Engine) is part of the Agent Platform. It executes ADK agents, manages concurrent sessions, handles retries, and integrates with GCP's logging and monitoring. It is the production environment for agents.",
    simplerExplanation:
      "If your agent is a program, Agent Runtime is the server that runs it. It handles many users sending requests to your agent at the same time — so you do not have to manage servers.",
    gcpExample:
      "ADK agent → deployed to Agent Runtime → scales to handle 500 concurrent users → each user gets an isolated session → logs go to Cloud Logging automatically.",
    whenToUse: [
      "Deploying production agents that need to scale and run reliably",
      "When you need session isolation and managed infrastructure for agents",
    ],
    whenNotToUse: [
      "Local testing and development — run the ADK agent locally",
    ],
    example:
      "Company's 'Revenue Analyst Agent' is deployed to Agent Runtime → available to 200 business users → each gets their own session with memory of prior questions.",
    relatedTerms: ["adk", "agent-platform", "agent-sessions", "agent-memory"],
    memoryShortcut:
      "Agent Runtime = the managed server that runs your agent in production.",
    commonConfusion:
      "People sometimes confuse Agent Runtime with Agent Platform. Agent Platform is the broader product umbrella. Agent Runtime/Engine is the specific component that executes agents.",
    gcpConsoleLocation: "GCP Console → Vertex AI → Agent Builder → Deployments",
  },
  {
    id: "agent-sessions",
    term: "Sessions",
    aliases: ["agent sessions"],
    category: "agents",
    generalDefinition:
      "In AI agents, a session is a single continuous conversation or interaction — maintaining context across multiple messages so the agent remembers what was said earlier.",
    gcpDefinition:
      "The Agent Platform manages sessions for deployed agents. Each user's conversation is a separate session. The session holds the conversation history, intermediate results, and any context the agent needs across multiple turns.",
    simplerExplanation:
      "Without sessions, every message to an agent starts fresh — it forgets everything you said before. With sessions, the agent remembers: 'You already told me to look at the orders table. This follow-up question is about that same table.'",
    gcpExample:
      "User: 'Show me yesterday's revenue' → Agent queries BigQuery. User: 'Now break it down by region' → Agent remembers context, refines the same query.",
    whenToUse: [
      "Any multi-turn agent conversation where context matters",
    ],
    whenNotToUse: [
      "Single-shot requests with no follow-up — sessions add overhead without benefit",
    ],
    example:
      "Data analyst asks agent 5 follow-up questions about a pipeline anomaly — agent maintains the full context of the investigation across all 5 turns.",
    relatedTerms: ["adk", "agent-platform", "agent-runtime", "agent-memory"],
    memoryShortcut:
      "Sessions = the agent's short-term memory for a conversation. Context is preserved across turns.",
    commonConfusion:
      "Confused with memory. Sessions = context within one conversation. Memory = context that persists across multiple different conversations (longer-term).",
    gcpConsoleLocation: "GCP Console → Vertex AI → Agent Builder → Sessions",
  },
  {
    id: "agent-memory",
    term: "Memory",
    aliases: ["agent memory", "long-term memory"],
    category: "agents",
    generalDefinition:
      "In AI agents, memory is the ability to persist and recall information across multiple separate conversations — so the agent 'remembers' things from past interactions.",
    gcpDefinition:
      "The Agent Platform supports agent memory to store facts, preferences, and history that persist beyond a single session. This allows agents to build knowledge about a user or a domain over time.",
    simplerExplanation:
      "Session = what the agent remembers within one conversation. Memory = what the agent remembers between conversations. Without memory, every new session starts completely fresh. With memory, the agent recalls: 'Last week you asked about the orders pipeline — here is what has changed.'",
    gcpExample:
      "Agent memory stores: 'User prefers summaries in bullet points. User's main dashboard is revenue_dashboard. User's team owns the orders pipeline.' — available in every new session.",
    whenToUse: [
      "Agents that interact repeatedly with the same users",
      "Agents that build expertise about a domain over time",
    ],
    whenNotToUse: [
      "One-time agents that will never be used by the same person twice",
    ],
    example:
      "Data quality agent remembers that last time it ran, the orders table had a null issue on Mondays. In future sessions, it checks Mondays first.",
    relatedTerms: ["agent-sessions", "adk", "agent-platform", "agent-runtime"],
    memoryShortcut:
      "Memory = long-term recall across conversations. Sessions = short-term recall within one conversation.",
    commonConfusion:
      "Confused with sessions. Sessions persist context within one conversation. Memory persists context across multiple different conversations over time.",
    gcpConsoleLocation: "GCP Console → Vertex AI → Agent Builder",
  },
  {
    id: "tool-calling",
    term: "Tool Calling",
    aliases: ["function calling", "tool use"],
    category: "agents",
    generalDefinition:
      "The ability of an AI model to decide to use an external tool — like a function, API, or database query — to get the information it needs to answer a question.",
    gcpDefinition:
      "In GCP ADK agents, tools are Python functions (run SQL, call an API, read a file) that you register with the agent. The agent (powered by Gemini) decides which tool to call and with what inputs based on the user's request.",
    simplerExplanation:
      "Without tool calling, an AI agent can only answer from what it already knows. With tool calling, it can actually do things — run a SQL query, check an API, read a file — and then use the result to answer the question.",
    gcpExample:
      "User: 'What was revenue yesterday?' → Agent decides to call 'run_bigquery_sql' tool → tool returns 1,240,000 → agent answers: 'Yesterday's revenue was $1.24M.'",
    whenToUse: [
      "Any agent that needs real data to answer questions",
      "Agents that take actions (send a message, trigger a pipeline, update a table)",
    ],
    whenNotToUse: [
      "Simple Q&A chatbots that only answer from a knowledge base",
    ],
    example:
      "Pipeline failure agent: gets an alert → calls 'read_cloud_logging' tool → calls 'query_data_quality_results' tool → synthesizes the results → calls 'post_to_slack' tool.",
    relatedTerms: ["adk", "agent-platform", "agent-sessions", "vertex-ai"],
    memoryShortcut:
      "Tool calling = the agent reaching out to do something real (run SQL, call API) instead of just thinking.",
    commonConfusion:
      "Sometimes confused with function calling (they are the same concept — 'function calling' is the older term from OpenAI; 'tool calling' is the broader modern term).",
    gcpConsoleLocation: undefined,
  },

  // ─── GENERAL DATA ENGINEERING CONCEPTS ───────────────────────────────────────
  {
    id: "orchestration",
    term: "Orchestration",
    aliases: ["pipeline orchestration", "workflow orchestration"],
    category: "concept",
    generalDefinition:
      "Coordinating and scheduling the steps of a data pipeline — defining what runs first, what runs next, what to do when a step fails, and how to monitor the whole process.",
    gcpDefinition:
      "In GCP, orchestration tools include Cloud Composer (managed Airflow for complex DAGs), Workflows (lightweight API chaining), and Cloud Scheduler (simple time-based triggers). Dataform also handles internal dependency orchestration for SQL transforms.",
    simplerExplanation:
      "A data pipeline has many steps: extract, transform, load, test, notify. Orchestration is the manager that coordinates these steps — making sure step 2 does not start until step 1 finishes, and alerting you if step 3 fails.",
    gcpExample:
      "Composer DAG orchestrates: 1. Dataflow job runs. 2. Wait for completion. 3. Dataform transforms. 4. Data quality check. 5. If pass: notify Slack. If fail: page on-call.",
    whenToUse: [
      "Any pipeline with multiple dependent steps",
      "Pipelines that need retry logic and failure handling",
    ],
    whenNotToUse: [
      "Single-step jobs — just schedule them with Cloud Scheduler",
    ],
    example:
      "Without orchestration: an engineer manually runs 5 scripts in order each morning. With orchestration: Composer runs them automatically, retries failures, and alerts on problems.",
    relatedTerms: ["cloud-composer", "dag", "workflows", "cloud-scheduler", "dataform"],
    memoryShortcut:
      "Orchestration = the pipeline manager. Coordinates steps, handles failures, monitors progress.",
    commonConfusion:
      "Confused with processing. Processing transforms data (Dataflow, Dataproc). Orchestration coordinates when and how tools run (Composer, Workflows). They work together.",
    gcpConsoleLocation: undefined,
  },
  {
    id: "idempotency",
    term: "Idempotency",
    aliases: ["idempotent"],
    category: "concept",
    generalDefinition:
      "A property where running the same operation multiple times produces the same result as running it once — so re-running a failed pipeline does not create duplicates or corrupt data.",
    gcpDefinition:
      "In GCP pipelines, idempotency is achieved by: overwriting partitions instead of appending (BigQuery), deduplicating by event ID (Dataflow), using MERGE statements instead of INSERT, or partitioning by date and truncating before reload.",
    simplerExplanation:
      "If your pipeline crashes and you re-run it, does it create doubles? If yes, it is NOT idempotent. An idempotent pipeline can run 5 times and the result is always the same as running it once.",
    gcpExample:
      "Non-idempotent: INSERT INTO orders SELECT * FROM raw (re-running = duplicates). Idempotent: INSERT OVERWRITE PARTITION('2024-01-15') SELECT * FROM raw WHERE date = '2024-01-15' (re-running = same result).",
    whenToUse: [
      "Always — production pipelines must be idempotent",
      "Especially important in pipelines that could fail and retry automatically",
    ],
    whenNotToUse: [],
    example:
      "Daily pipeline fails at step 4 of 6 → auto-retry from start → because steps 1-3 are idempotent (overwrite, not append), re-running them produces clean data.",
    relatedTerms: ["deduplication", "backfill", "batch-processing", "cloud-composer"],
    memoryShortcut:
      "Idempotent = 'safe to run again.' Re-running produces the same clean result.",
    commonConfusion:
      "People think idempotency is only for streaming pipelines. It is critical for batch pipelines too — any pipeline that could fail and be retried needs to be idempotent.",
    gcpConsoleLocation: undefined,
  },
  {
    id: "backfill",
    term: "Backfill",
    aliases: ["historical backfill"],
    category: "concept",
    generalDefinition:
      "Running a pipeline for historical data that was not processed when it originally occurred — catching up on past data.",
    gcpDefinition:
      "In GCP, backfills often use Cloud Composer (Airflow's backfill capability over date ranges), Dataflow batch jobs, or Dataform runs over historical date partitions. Backfills are common when setting up a new pipeline that needs historical data.",
    simplerExplanation:
      "You build a daily pipeline that starts today. But you want data going back 2 years. A backfill runs the pipeline for all 730 days of historical data to populate your tables.",
    gcpExample:
      "New Dataform model needs historical orders data → run Dataform backfill for dates 2022-01-01 to 2024-01-01 → 2 years of data processed → tables fully populated.",
    whenToUse: [
      "When a new pipeline needs historical data to be fully operational",
      "When a bug is fixed and historical data needs to be reprocessed with the fix",
      "When a new metric or feature requires retroactive calculation",
    ],
    whenNotToUse: [
      "Real-time streaming pipelines — backfill applies to batch/scheduled pipelines",
    ],
    example:
      "Company launches new revenue analytics feature → needs 3 years of historical revenue data → runs Dataflow backfill job for 2021-2023 → tables populated with historical data.",
    relatedTerms: ["idempotency", "batch-processing", "cloud-composer", "dataform"],
    memoryShortcut:
      "Backfill = catching up on the past. Run the pipeline over historical dates.",
    commonConfusion:
      "Backfill requires idempotent pipelines. If your pipeline is not idempotent, backfilling historical dates will create duplicates. Always make pipelines idempotent before backfilling.",
    gcpConsoleLocation: undefined,
  },
  {
    id: "sla",
    term: "SLA",
    aliases: ["Service Level Agreement"],
    category: "concept",
    generalDefinition:
      "A formal commitment about the reliability or performance of a system — for example, 'the dashboard data will be refreshed by 8am every business day.'",
    gcpDefinition:
      "In data engineering, SLAs define when data must be available and how reliable the pipeline must be. Cloud Monitoring alerts and Composer SLAs help track whether pipelines meet their commitments.",
    simplerExplanation:
      "An SLA is a promise: 'We commit that the morning dashboard will show last night's data by 8am, every day.' If it is late or wrong, the SLA is broken.",
    gcpExample:
      "SLA: orders table must be updated by 8am daily with previous day's data → Cloud Monitoring alert fires if Dataflow job does not complete by 7:45am.",
    whenToUse: [
      "Any time data freshness or pipeline reliability affects business operations",
    ],
    whenNotToUse: [],
    example:
      "Finance team SLA: monthly close data must be available by the 2nd of each month at 9am. If the pipeline misses this, the SLA is violated.",
    relatedTerms: ["slo", "cloud-monitoring", "cloud-composer", "idempotency"],
    memoryShortcut:
      "SLA = the promise. 'Data will be ready by 8am.' Breaking it has consequences.",
    commonConfusion:
      "Confused with SLO. SLA is a formal external commitment (often with consequences if broken). SLO is an internal reliability target that helps you meet the SLA before it becomes a problem.",
    gcpConsoleLocation: undefined,
  },
  {
    id: "slo",
    term: "SLO",
    aliases: ["Service Level Objective"],
    category: "concept",
    generalDefinition:
      "An internal reliability target for a system — for example, 'the pipeline must succeed 99.9% of the time' — used to ensure you are on track to meet your external commitments (SLAs).",
    gcpDefinition:
      "In GCP, you can define SLO-based alert policies in Cloud Monitoring. An SLO might specify: 'Dataflow streaming latency p99 must be under 5 minutes.' If the SLO is violated, Cloud Monitoring alerts the team before the SLA is at risk.",
    simplerExplanation:
      "SLO is the internal warning light. If the SLA says 'data by 8am,' the SLO might say 'pipeline must complete by 7:30am so we have a buffer.' The SLO fires alerts before the SLA is at risk.",
    gcpExample:
      "SLO: pipeline success rate >= 99.9% over rolling 30 days → Cloud Monitoring tracks → if success rate drops to 99.5% → alert fires → investigate before SLA is breached.",
    whenToUse: [
      "Setting internal reliability benchmarks for pipelines and services",
      "Defining Cloud Monitoring alert policies",
    ],
    whenNotToUse: [],
    example:
      "SLA = 'dashboard data fresh by 8am.' SLO = 'Dataflow job completes by 7am 99.9% of days.' The SLO gives you a safety buffer to catch issues before the SLA is breached.",
    relatedTerms: ["sla", "cloud-monitoring", "cloud-composer"],
    memoryShortcut:
      "SLO = the internal target. SLA = the external promise. SLO protects the SLA.",
    commonConfusion:
      "SLA vs SLO: SLA is the external commitment (with consequences). SLO is the internal target (your guardrail to avoid breaking the SLA). You set SLOs tighter than SLAs intentionally.",
    gcpConsoleLocation: "GCP Console → Monitoring → SLOs",
  },
  {
    id: "schema",
    term: "Schema",
    aliases: ["table schema", "data schema"],
    category: "concept",
    generalDefinition:
      "The structure of a dataset — defining what columns exist, what type of data each holds (text, number, date), and whether values are required.",
    gcpDefinition:
      "In BigQuery, a schema defines column names, data types (STRING, INTEGER, FLOAT64, TIMESTAMP, DATE, BOOL, RECORD), and mode (NULLABLE, REQUIRED, REPEATED). Schemas can be auto-detected or explicitly defined.",
    simplerExplanation:
      "A schema is the blueprint of your table. It says: 'This table has 4 columns: order_id (text, required), amount (decimal number, required), order_date (date), and status (text, optional).'",
    gcpExample:
      "BigQuery schema: [{name: 'order_id', type: 'STRING', mode: 'REQUIRED'}, {name: 'amount', type: 'NUMERIC', mode: 'REQUIRED'}, {name: 'order_date', type: 'DATE'}, {name: 'status', type: 'STRING'}]",
    whenToUse: [
      "Always — every table in BigQuery has a schema",
      "Explicitly define schemas for production tables to catch data type errors",
    ],
    whenNotToUse: [
      "Auto-detect is acceptable for quick exploration of new files",
    ],
    example:
      "New data source sends JSON files → engineer defines a BigQuery schema → if incoming data does not match the schema, BigQuery rejects the bad rows.",
    relatedTerms: ["bigquery", "partitioning", "clustering", "dataform", "data-quality"],
    memoryShortcut:
      "Schema = the blueprint of your table. Columns, types, required or not.",
    commonConfusion:
      "People think 'schema' only refers to the database container (schema = database). In BigQuery, 'schema' means the column definitions of a specific table.",
    gcpConsoleLocation: "GCP Console → BigQuery → Table → Schema tab",
  },
  {
    id: "partitioning",
    term: "Partitioning",
    aliases: ["table partitioning", "partition"],
    category: "concept",
    generalDefinition:
      "Dividing a large table into smaller, organized sections based on a column — usually a date — so that queries only need to read the relevant section instead of the entire table.",
    gcpDefinition:
      "In BigQuery, tables can be partitioned by ingestion time, a DATE/TIMESTAMP column, or an integer range. Queries with a WHERE clause on the partition column only scan matching partitions, reducing cost and improving speed.",
    simplerExplanation:
      "Instead of one massive table, partitioning creates organized 'drawers' — one drawer per day (or month or range). When you query 'last Tuesday's orders,' BigQuery only opens that Tuesday drawer, not the 3-year filing cabinet.",
    gcpExample:
      "Table orders partitioned by order_date → query WHERE order_date = '2024-01-15' → BigQuery scans only that day's partition (1/1095th of the table for 3 years).",
    whenToUse: [
      "Tables that are frequently queried by date ranges",
      "Large tables where querying the whole table is expensive",
      "Any BigQuery table that will grow large over time",
    ],
    whenNotToUse: [
      "Very small tables where partitioning adds overhead without benefit",
      "Tables queried across all dates equally (partitioning helps when you filter by partition column)",
    ],
    example:
      "3-year orders table: 1TB total. Query for one day's orders → without partitioning: scans 1TB ($5). With partitioning: scans ~1GB ($0.005). 1000x cheaper.",
    relatedTerms: ["clustering", "bigquery", "schema", "idempotency"],
    memoryShortcut:
      "Partitioning = organized drawers by date. Queries open only the drawer they need.",
    commonConfusion:
      "Confused with clustering. Partitioning splits the table into large sections (by date). Clustering sorts the data within each partition (by commonly filtered columns). Use both together for best performance.",
    gcpConsoleLocation: "GCP Console → BigQuery → Create table → Partition and cluster settings",
  },
  {
    id: "clustering",
    term: "Clustering",
    aliases: ["table clustering", "clustered table"],
    category: "concept",
    generalDefinition:
      "Organizing the data within a table (or within partitions) by one or more columns — so that rows with similar values in those columns are stored physically close together, making queries that filter on those columns faster.",
    gcpDefinition:
      "In BigQuery, you can cluster a table by up to 4 columns (e.g., cluster by customer_id, region). When you query with a WHERE clause on a clustered column, BigQuery prunes the data it reads even further than partitioning alone.",
    simplerExplanation:
      "After partitioning divides the table into date drawers, clustering organizes each drawer by customer ID. So querying 'all orders for customer 12345 on Tuesday' is fast — BigQuery goes to the Tuesday drawer and jumps directly to customer 12345's records.",
    gcpExample:
      "Table orders PARTITION BY order_date CLUSTER BY customer_id, region → query WHERE order_date='2024-01-15' AND customer_id='12345' → minimal data scanned.",
    whenToUse: [
      "Tables frequently filtered by columns like customer_id, region, product_id",
      "Used together with partitioning for maximum query efficiency",
    ],
    whenNotToUse: [
      "Columns with very high cardinality and no repeated filter patterns",
      "Small tables where the benefit is negligible",
    ],
    example:
      "Daily orders partitioned by date, clustered by region → regional sales queries (WHERE region='US-West') are fast because clustered data is co-located.",
    relatedTerms: ["partitioning", "bigquery", "schema", "star-schema"],
    memoryShortcut:
      "Clustering = sorted filing within partitions. Partitioning is the drawer; clustering is the alphabetical order inside the drawer.",
    commonConfusion:
      "Confused with partitioning. Partitioning cuts the table into large independent sections. Clustering sorts the data within sections. They work at different levels and complement each other.",
    gcpConsoleLocation: "GCP Console → BigQuery → Create table → Partition and cluster settings",
  },
  {
    id: "federated-query",
    term: "Federated Query",
    aliases: ["cross-source query", "federated access"],
    category: "concept",
    generalDefinition:
      "Querying data from multiple different sources in a single query — without first copying or moving all the data into one place.",
    gcpDefinition:
      "BigQuery supports federated queries to: Cloud Storage files (via external tables), Cloud SQL (MySQL, PostgreSQL), Cloud Spanner, and Google Sheets. BigQuery sends the query to the external source and merges the results.",
    simplerExplanation:
      "Instead of copying all your Cloud SQL data into BigQuery, you can write one BigQuery SQL query that joins a BigQuery table with a Cloud SQL table — across two different systems — and get a single result.",
    gcpExample:
      "SELECT bq.order_id, sql.customer_name FROM bigquery_dataset.orders bq JOIN EXTERNAL_QUERY('cloud-sql-connection', 'SELECT id, name FROM customers') sql ON bq.customer_id = sql.id",
    whenToUse: [
      "Quick joins between BigQuery and Cloud SQL data without full data migration",
      "Querying Google Sheets alongside BigQuery data for rapid analysis",
      "Exploring external data before deciding whether to load it",
    ],
    whenNotToUse: [
      "High-frequency production queries — federated queries are slower and not optimized",
      "Large datasets queried frequently — load them into BigQuery instead",
    ],
    example:
      "Analytics team needs BigQuery order data joined with production Cloud SQL customer data → federated query joins them without copying Cloud SQL into BigQuery.",
    relatedTerms: ["bigquery", "external-tables", "biglake", "cloud-storage"],
    memoryShortcut:
      "Federated query = query data where it lives, without moving it. Cross-system SQL.",
    commonConfusion:
      "Confused with external tables. External tables query files in Cloud Storage. Federated queries extend this to databases (Cloud SQL, Spanner) and Google Sheets.",
    gcpConsoleLocation: "GCP Console → BigQuery → SQL Workspace (write EXTERNAL_QUERY function)",
  },
  {
    id: "star-schema",
    term: "Star Schema",
    aliases: ["star model"],
    category: "concept",
    generalDefinition:
      "A database design pattern where one central 'fact' table (containing measurable events) is surrounded by multiple 'dimension' tables (containing descriptive context) — forming a star shape.",
    gcpDefinition:
      "Star schemas are commonly built in BigQuery using Dataform or SQL. Fact tables store orders, clicks, or transactions. Dimension tables store customers, products, dates. Analysts join them together for rich analytics.",
    simplerExplanation:
      "Picture a star: the center is your events table (orders, clicks) with all the numbers. The points of the star are context tables (customers, products, dates). To answer 'which region had the most sales?', you join the center to the region context.",
    gcpExample:
      "fact_orders (order_id, customer_id, product_id, date_id, amount) + dim_customers + dim_products + dim_dates → Looker Studio joins them for rich reports.",
    whenToUse: [
      "Building analytics warehouses for business reporting",
      "When analysts need to slice facts by multiple dimensions (by customer, by product, by date, by region)",
    ],
    whenNotToUse: [
      "Real-time operational databases (star schemas are for analytics, not transactions)",
      "Streaming pipelines (design the schema, but populate it in batch with Dataform)",
    ],
    example:
      "E-commerce: fact_orders → joined to dim_customers (name, region) + dim_products (name, category) + dim_dates (day, month, quarter) → analysts answer any business question.",
    relatedTerms: ["fact-table", "dimension-table", "bigquery", "dataform", "data-warehouse"],
    memoryShortcut:
      "Star schema = facts in the center, dimensions on the points. Numbers in the middle, context on the outside.",
    commonConfusion:
      "People confuse star schema with snowflake schema. Star schema: dimensions are flat (one table per dimension). Snowflake schema: dimensions are normalized (split into sub-tables). Star schemas are simpler for analytics.",
    gcpConsoleLocation: undefined,
  },
  {
    id: "fact-table",
    term: "Fact Table",
    aliases: ["facts"],
    category: "concept",
    generalDefinition:
      "In a data warehouse, the central table that stores measurable events or transactions — like orders, clicks, payments, or sensor readings. Each row represents one event.",
    gcpDefinition:
      "In BigQuery star schemas, fact tables (e.g., fact_orders, fact_events) store large volumes of transactional data. They contain foreign keys to dimension tables and measurable values (amount, quantity, duration). Fact tables are typically the largest tables.",
    simplerExplanation:
      "The fact table is where 'things that happened' are recorded. Each row is one event: 'Order #1234 was placed by customer #56 for product #78 on 2024-01-15 for $49.99.' The facts are the numbers; the dimensions give context.",
    gcpExample:
      "fact_orders: (order_id, customer_id, product_id, date_id, order_date, amount, quantity) — 100M rows, one per order.",
    whenToUse: [
      "Always in a star schema — this is the center table",
    ],
    whenNotToUse: [],
    example:
      "fact_sales table has 500 million rows (one per transaction over 5 years) → analysts join it with dim_products to see which products sold the most in Q3.",
    relatedTerms: ["dimension-table", "star-schema", "bigquery", "partitioning"],
    memoryShortcut:
      "Fact table = the events table. Numbers and IDs. One row per thing that happened.",
    commonConfusion:
      "Confused with dimension table. Fact table = what happened (events, with numbers). Dimension table = who/what/when/where (context for the events).",
    gcpConsoleLocation: undefined,
  },
  {
    id: "dimension-table",
    term: "Dimension Table",
    aliases: ["dim table", "dimensions"],
    category: "concept",
    generalDefinition:
      "In a data warehouse, a table that provides descriptive context for the events in a fact table — like customer details, product information, or date attributes.",
    gcpDefinition:
      "In BigQuery star schemas, dimension tables (dim_customers, dim_products, dim_dates) are smaller tables that enrich fact table queries. They store relatively stable attributes that describe the 'who, what, where, when' of business events.",
    simplerExplanation:
      "If the fact table says 'customer 56 bought product 78,' the dimension tables tell you: customer 56 is 'Taran in the US-West region' and product 78 is 'Premium Plan, Software category.' Dimensions give the facts meaning.",
    gcpExample:
      "dim_customers: (customer_id, customer_name, region, tier, signup_date) — 100K rows, one per customer.",
    whenToUse: [
      "Always in a star schema — surrounding the fact table with context",
    ],
    whenNotToUse: [],
    example:
      "dim_dates table with columns: date, day_of_week, week_number, month, quarter, year, is_holiday → analysts can group fact_orders by quarter or filter by weekday.",
    relatedTerms: ["fact-table", "star-schema", "bigquery", "dataform"],
    memoryShortcut:
      "Dimension table = the context table. Who, what, where, when. One row per entity (customer, product, date).",
    commonConfusion:
      "Confused with fact table. Dimension table = descriptive, stable (customer info changes slowly). Fact table = transactional, grows fast (one row per order).",
    gcpConsoleLocation: undefined,
  },
];

export default glossaryTerms;

