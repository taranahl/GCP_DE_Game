import type {
  PipelineInput,
  PipelineRecommendation,
  PipelineStep,
} from "@/types/pipeline";

function isStreaming(input: PipelineInput): boolean {
  return (
    input.frequency === "real-time-streaming" ||
    input.frequency === "near-real-time"
  );
}

function isBatch(input: PipelineInput): boolean {
  return (
    input.frequency === "one-time" ||
    input.frequency === "daily-batch" ||
    input.frequency === "hourly-batch"
  );
}

export function buildRecommendation(input: PipelineInput): PipelineRecommendation {
  const steps: PipelineStep[] = [];
  const whatNotToUse: string[] = [];
  const relatedTerms: string[] = [];

  // ── INGESTION LAYER ──────────────────────────────────────────────────
  if (input.sourceType === "app-events" || input.sourceType === "logs") {
    if (isStreaming(input)) {
      steps.push({
        tool: "Pub/Sub",
        role: "Event ingestion queue",
        why:
          "Pub/Sub is the front door for real-time events. It decouples your app from the processing pipeline and buffers messages if your consumer falls behind.",
      });
      steps.push({
        tool: "Dataflow",
        role: "Streaming transformation",
        why:
          "Dataflow processes events from Pub/Sub in real time — cleaning, deduplicating, and windowing them before writing to BigQuery.",
      });
      whatNotToUse.push(
        "Dataproc — Dataflow is Google's native serverless streaming tool. Dataproc requires managing clusters and is designed for Spark workloads."
      );
      relatedTerms.push("pubsub", "dataflow", "streaming-ingestion", "windowing", "deduplication");
    } else {
      steps.push({
        tool: "Pub/Sub",
        role: "Event buffer (batch consumption)",
        why:
          "Even for hourly batch, Pub/Sub is the right buffer. Messages accumulate and are consumed by a scheduled Dataflow job.",
      });
      steps.push({
        tool: "Dataflow",
        role: "Batch transformation",
        why: "Dataflow can run in batch mode to process buffered events on a schedule.",
      });
      relatedTerms.push("pubsub", "dataflow", "batch-ingestion");
    }
  } else if (input.sourceType === "operational-database") {
    if (isStreaming(input)) {
      steps.push({
        tool: "Datastream",
        role: "CDC replication from database to BigQuery",
        why:
          "Datastream reads the database replication log and streams every INSERT, UPDATE, and DELETE into BigQuery continuously — far better than nightly exports.",
      });
      whatNotToUse.push(
        "Pub/Sub — Pub/Sub handles app-level events, not database-level change capture. Datastream reads directly from the database replication log."
      );
      relatedTerms.push("datastream", "change-data-capture", "streaming-ingestion");
    } else {
      steps.push({
        tool: "Datastream",
        role: "Scheduled CDC or bulk export to BigQuery",
        why:
          "Datastream supports both continuous and batch modes. For daily batch, it can replicate a full snapshot plus incremental changes.",
      });
      relatedTerms.push("datastream", "change-data-capture", "batch-ingestion");
    }
  } else if (input.sourceType === "saas-data") {
    steps.push({
      tool: "BigQuery Data Transfer Service",
      role: "Automated scheduled load from SaaS source",
      why:
        "BigQuery Data Transfer Service has native connectors for Google Ads, YouTube, Salesforce, and other SaaS sources. No custom pipeline code needed — configure it and data loads on a schedule.",
    });
    whatNotToUse.push(
      "Datastream — Datastream is for CDC from relational databases, not SaaS APIs.",
      "Dataflow — building a custom Dataflow pipeline to load from Google Ads is unnecessary when BigQuery Data Transfer Service already has a managed connector."
    );
    relatedTerms.push("bigquery-data-transfer-service", "batch-ingestion", "etl");
  } else if (input.sourceType === "csv-files") {
    if (input.frequency === "one-time") {
      steps.push({
        tool: "Cloud Storage",
        role: "Raw file landing zone",
        why:
          "Upload CSV files to a GCS bucket. Cloud Storage is the cheapest and most durable place to land raw files before loading them into BigQuery.",
      });
      steps.push({
        tool: "bq load / LOAD DATA",
        role: "One-time bulk load into BigQuery",
        why:
          "For a one-time or infrequent load of CSV files, bq load is the simplest approach. No pipeline infrastructure needed.",
      });
      whatNotToUse.push(
        "Dataflow — overkill for loading CSV files. bq load handles this directly."
      );
    } else {
      steps.push({
        tool: "Cloud Storage",
        role: "Raw file landing zone",
        why:
          "Files land in GCS first. Cloud Storage triggers can fire when new files arrive, or scheduled jobs can scan for new files.",
      });
      steps.push({
        tool: "bq load / LOAD DATA",
        role: "Scheduled batch load into BigQuery",
        why:
          "bq load or BigQuery LOAD DATA statements can be triggered on a schedule (via Cloud Scheduler or Composer) each time new files arrive.",
      });
    }
    relatedTerms.push("cloud-storage", "batch-ingestion", "bq-load");
  } else if (input.sourceType === "sensitive-customer-data") {
    steps.push({
      tool: "Cloud Storage or BigQuery",
      role: "Raw data storage",
      why:
        "Data lands in Cloud Storage or BigQuery first. Governance controls are then applied to restrict who can see sensitive fields.",
    });
    steps.push({
      tool: "Sensitive Data Protection",
      role: "PII detection and classification",
      why:
        "Sensitive Data Protection (Cloud DLP) scans your data and identifies PII — emails, SSNs, phone numbers, and more. It tells you which columns and files contain sensitive data.",
    });
    steps.push({
      tool: "Policy Tags + IAM",
      role: "Column-level and table-level access control",
      why:
        "Policy tags restrict which users can see sensitive columns in BigQuery. Without the Fine-grained Reader role, users see NULL instead of real values. IAM controls who can access the dataset at all.",
    });
    whatNotToUse.push(
      "Relying on IAM alone — IAM controls table access but not individual column values. Policy tags are needed for column-level security."
    );
    relatedTerms.push("sensitive-data-protection", "pii", "policy-tags", "iam", "column-level-security");
  }

  // ── STORAGE LAYER ────────────────────────────────────────────────────
  const alreadyHasBigQuery = steps.some((s) => s.tool === "BigQuery");
  if (!alreadyHasBigQuery) {
    steps.push({
      tool: "BigQuery",
      role: "Analytics data warehouse",
      why:
        "BigQuery is the analytics engine. All processed data lands here as native tables, ready for SQL queries and dashboards.",
    });
    relatedTerms.push("bigquery", "data-warehouse");
  } else {
    // Datastream and Dataflow already imply BigQuery destination
    if (!relatedTerms.includes("bigquery")) relatedTerms.push("bigquery");
  }

  // ── TRANSFORMATION LAYER ─────────────────────────────────────────────
  if (input.transformationNeed === "sql-only") {
    steps.push({
      tool: "Dataform",
      role: "SQL transformation and data modeling",
      why:
        "Dataform manages SQL dependencies inside BigQuery. Raw tables are transformed into clean star-schema tables (fact_orders, dim_customers) with automatic dependency resolution and data quality tests.",
    });
    whatNotToUse.push(
      "Dataflow for SQL — Dataflow is for code-based (Java/Python) transformations. If you only need SQL, Dataform inside BigQuery is simpler and cheaper."
    );
    relatedTerms.push("dataform", "elt", "data-quality");
  } else if (input.transformationNeed === "complex-code") {
    // If streaming, Dataflow is already added; for batch, add it explicitly
    if (isBatch(input) && !steps.some((s) => s.tool === "Dataflow")) {
      steps.push({
        tool: "Dataflow",
        role: "Code-based batch transformation",
        why:
          "Dataflow (Apache Beam) handles complex transformations that SQL cannot express — custom business logic, ML feature engineering, or multi-source joins at scale.",
      });
      relatedTerms.push("dataflow", "etl", "batch-processing");
    }
    whatNotToUse.push(
      "BigQuery scheduled queries — scheduled queries are for simple SQL. For complex code-based transformations, Dataflow is the right tool."
    );
  } else if (input.transformationNeed === "visual-low-code") {
    steps.push({
      tool: "Data Fusion",
      role: "Visual ETL pipeline builder",
      why:
        "Data Fusion provides a drag-and-drop ETL interface. Teams without deep coding skills can build pipelines visually. Runs on Dataproc under the hood.",
    });
    whatNotToUse.push(
      "Dataflow — Dataflow requires writing Apache Beam code. Data Fusion is the right tool for teams that prefer a visual, low-code approach."
    );
    relatedTerms.push("data-fusion", "etl");
  } else if (input.transformationNeed === "existing-spark-code") {
    steps.push({
      tool: "Dataproc",
      role: "Managed Spark/Hadoop cluster",
      why:
        "Dataproc runs existing PySpark or Spark SQL jobs with minimal code changes. If you already have Spark pipelines, lift-and-shift to Dataproc rather than rewriting to Dataflow/Beam.",
    });
    whatNotToUse.push(
      "Dataflow — Dataflow requires rewriting Spark code to Apache Beam. If the team has existing Spark code, Dataproc is the pragmatic choice."
    );
    relatedTerms.push("dataproc", "spark", "pyspark", "hadoop");
  }

  // Add Dataform for SQL modeling in all cases except pure complex code or Spark
  // (when transformation = complex-code or spark, Dataform is not the primary tool)
  if (
    input.transformationNeed !== "sql-only" &&
    input.transformationNeed !== "complex-code" &&
    input.transformationNeed !== "existing-spark-code" &&
    !steps.some((s) => s.tool === "Dataform")
  ) {
    steps.push({
      tool: "Dataform",
      role: "SQL modeling layer",
      why:
        "Even when Data Fusion handles ETL, a Dataform layer adds SQL-based cleanup, testing, and star-schema modeling on top of BigQuery.",
    });
    relatedTerms.push("dataform", "elt");
  }

  // ── GOVERNANCE LAYER ─────────────────────────────────────────────────
  if (input.governanceNeed === "high") {
    if (input.sourceType !== "sensitive-customer-data") {
      // DLP + Policy Tags already added for sensitive-customer-data source
      steps.push({
        tool: "Dataplex",
        role: "Data catalog, lineage, and governance",
        why:
          "Dataplex catalogs all datasets, tracks data lineage (where data came from and where it flows), and enforces data quality rules. Required for audit-ready governance.",
      });
      steps.push({
        tool: "IAM + Policy Tags",
        role: "Access control",
        why:
          "IAM controls who can access each dataset. Policy tags restrict who can see sensitive columns inside BigQuery tables.",
      });
    } else {
      steps.push({
        tool: "Dataplex",
        role: "Data catalog and lineage",
        why:
          "Dataplex provides the catalog view and lineage trail that regulators want to see — which tables exist, who owns them, and where data came from.",
      });
    }
    relatedTerms.push("dataplex", "iam", "data-lineage", "data-quality");
  } else if (input.governanceNeed === "medium") {
    steps.push({
      tool: "IAM",
      role: "Basic access control",
      why:
        "IAM ensures only the right teams can access the right datasets. Apply the principle of least privilege — analysts get Data Viewer, not Editor.",
    });
    relatedTerms.push("iam");
  }

  // ── SERVING / DASHBOARD LAYER ─────────────────────────────────────────
  if (input.dashboardNeeded) {
    steps.push({
      tool: "Looker Studio",
      role: "Dashboard and reporting",
      why:
        "Looker Studio connects directly to BigQuery and generates dashboards that business stakeholders can view without SQL knowledge. Free and easy to share.",
    });
    whatNotToUse.push(
      "BigQuery UI for dashboards — BigQuery is for SQL queries, not for business users who need charts and filters."
    );
    relatedTerms.push("looker-studio");
  }

  // ── AI AGENT LAYER ───────────────────────────────────────────────────
  if (input.aiAgentNeeded) {
    steps.push({
      tool: "Google ADK + Agent Platform",
      role: "Intelligent data Q&A agent",
      why:
        "An ADK agent can query BigQuery via tool calls and answer natural language business questions — 'Why did revenue drop on Tuesday?' or 'Which pipeline failed last night?'",
    });
    relatedTerms.push("adk", "tool-calling", "agent-platform");
  }

  // ── MONITORING LAYER ─────────────────────────────────────────────────
  if (input.monitoringNeeded) {
    steps.push({
      tool: "Cloud Monitoring + Cloud Logging",
      role: "Pipeline health and alerting",
      why:
        "Cloud Monitoring fires alerts when pipelines fail, lag behind, or produce unexpected metrics. Cloud Logging captures detailed error logs for debugging.",
    });
    relatedTerms.push("cloud-monitoring", "cloud-logging", "sla", "slo");
  }

  // ── BUILD TITLE AND NARRATIVE ─────────────────────────────────────────
  const sourceLabel: Record<string, string> = {
    "csv-files": "CSV File",
    "app-events": "App Event",
    "operational-database": "Database CDC",
    "saas-data": "SaaS",
    "logs": "Log",
    "sensitive-customer-data": "Sensitive Customer Data",
  };
  const freqLabel: Record<string, string> = {
    "one-time": "One-Time Migration",
    "daily-batch": "Daily Batch",
    "hourly-batch": "Hourly Batch",
    "near-real-time": "Near-Real-Time",
    "real-time-streaming": "Real-Time Streaming",
  };

  const title = `${sourceLabel[input.sourceType]} · ${freqLabel[input.frequency]} Pipeline`;

  const simpleTools = steps.slice(0, 3).map((s) => s.tool).join(" → ");
  const simpleVersion = `${simpleTools}. Start here before adding governance, monitoring, or AI layers.`;

  const productionVersion = [
    "Add schema validation before loading.",
    input.governanceNeed !== "low"
      ? "Enable BigQuery data access logs for the audit trail."
      : null,
    input.monitoringNeeded
      ? "Set up Cloud Monitoring alert policies for pipeline lag and failures."
      : null,
    "Use BigQuery table partitioning (by date) and clustering (by the most-queried column) on all large tables.",
    input.aiAgentNeeded
      ? "Define tool schemas carefully in the ADK agent — restrict which tables the agent can query to prevent data leakage."
      : null,
  ]
    .filter(Boolean)
    .join(" ");

  const realJobAnswer = `I would use ${steps
    .slice(0, 4)
    .map((s) => s.tool)
    .join(", ")} as the core pipeline. ${
    input.governanceNeed === "high"
      ? "For governance, I would add Dataplex, Policy Tags, and IAM. "
      : ""
  }${
    input.dashboardNeeded ? "For dashboards, I would use Looker Studio connected to BigQuery. " : ""
  }${
    input.monitoringNeeded
      ? "I would set up Cloud Monitoring alerts for pipeline health."
      : ""
  }`;

  // Deduplicate relatedTerms
  const uniqueTerms = [...new Set(relatedTerms)];

  return { title, steps, whatNotToUse, simpleVersion, productionVersion, realJobAnswer, relatedTerms: uniqueTerms };
}
