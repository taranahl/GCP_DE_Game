"use client";

import Link from "next/link";
import { highlightTerms } from "@/lib/highlightTerms";
import glossaryTerms from "@/data/glossary";

function h(text: string) {
  return highlightTerms(text, glossaryTerms);
}

interface SectionProps {
  number: string;
  title: string;
  color: string;
  badgeColor: string;
  centralQuestion: string;
  explanation: string;
  keyInsights: string[];
  jobLogic: string[];
  confusionIds: { label: string; href: string }[];
}

function StudySection({
  number,
  title,
  color,
  badgeColor,
  centralQuestion,
  explanation,
  keyInsights,
  jobLogic,
  confusionIds,
}: SectionProps) {
  return (
    <section className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className={`px-6 py-4 border-b border-slate-100 dark:border-slate-700 ${color}`}>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full font-mono ${badgeColor}`}>
            {number}
          </span>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-50">{title}</h2>
        </div>
        <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-300 italic">
          {centralQuestion}
        </p>
      </div>

      <div className="px-6 py-5 space-y-5">
        {/* Explanation */}
        <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
          {h(explanation)}
        </p>

        {/* Key insights */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-2">
            Key insights
          </p>
          <ul className="space-y-2">
            {keyInsights.map((insight, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                {h(insight)}
              </li>
            ))}
          </ul>
        </div>

        {/* Job logic */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-2">
            How a data engineer thinks
          </p>
          <ul className="space-y-2">
            {jobLogic.map((logic, i) => (
              <li
                key={i}
                className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 italic leading-relaxed"
              >
                &ldquo;{h(logic)}&rdquo;
              </li>
            ))}
          </ul>
        </div>

        {/* Related confusions */}
        {confusionIds.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-2">
              Review these confusions
            </p>
            <div className="flex flex-wrap gap-2">
              {confusionIds.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-xs px-2.5 py-1 rounded-full border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {label} →
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default function StudyGuidePage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Study Guide</h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400 text-sm">
          Six categories of GCP data engineering — what each group of tools does, how to think about them, and what trips people up.
        </p>
      </div>

      {/* Jump links */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: "Storage", href: "#storage" },
          { label: "Ingestion", href: "#ingestion" },
          { label: "Processing", href: "#processing" },
          { label: "Orchestration", href: "#orchestration" },
          { label: "Governance", href: "#governance" },
          { label: "AI & Agents", href: "#agents" },
        ].map(({ label, href }) => (
          <a
            key={href}
            href={href}
            className="text-xs px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            {label}
          </a>
        ))}
      </div>

      {/* ── SECTION 1: STORAGE ─────────────────────────────────────────────── */}
      <div id="storage">
        <StudySection
          number="01"
          title="Storage & Warehouse"
          color="bg-blue-50/50 dark:bg-blue-950/20"
          badgeColor="bg-blue-600 text-white"
          centralQuestion="Where does data live, and what form does it take before and after processing?"
          explanation={
            "GCP has two primary places to store data. Cloud Storage is the data lake — raw files of any format (CSV, JSON, Parquet, images, logs), stored cheaply. BigQuery is the data warehouse — structured tables optimized for SQL analytics. Data typically flows from Cloud Storage into BigQuery as it moves from raw to queryable. Between these two, BigLake and external tables let you query Cloud Storage files with SQL without moving them — but for high-frequency analytics, native BigQuery tables are faster."
          }
          keyInsights={[
            "Cloud Storage is your landing zone. Raw data arrives here first from any source.",
            "BigQuery is where data engineers deliver value — clean, queryable, partitioned tables that power dashboards and ML.",
            "External tables query files in Cloud Storage directly. BigLake does the same but adds column-level security and Dataplex governance — making it the enterprise choice.",
            "Partitioning (by date) and clustering (by commonly filtered columns) are BigQuery performance levers you should always apply to large tables.",
          ]}
          jobLogic={[
            "New raw data arrives → it goes to Cloud Storage first. Always. That is the landing zone.",
            "Analyst says 'I need to query this data' → if it is accessed frequently, load it into BigQuery. If it is a one-time exploration, use an external table.",
            "Someone asks about a BigLake vs external table → I think: do we need column-level security on the files? If yes, BigLake. If no, external table is simpler.",
            "Building a BigQuery table → I always ask: what column will analysts filter by most? Partition by date, cluster by the next most common filter (region, customer_id). Cost drops dramatically.",
          ]}
          confusionIds={[
            { label: "Cloud Storage vs BigQuery", href: "/confusions#cloud-storage-vs-bigquery" },
            { label: "BigLake vs External Tables", href: "/confusions#biglake-vs-external-tables" },
            { label: "Partitioning vs Clustering", href: "/confusions#partitioning-vs-clustering" },
            { label: "Data Lake vs Data Warehouse", href: "/confusions#data-lake-vs-data-warehouse" },
          ]}
        />
      </div>

      {/* ── SECTION 2: INGESTION ───────────────────────────────────────────── */}
      <div id="ingestion">
        <StudySection
          number="02"
          title="Ingestion"
          color="bg-indigo-50/50 dark:bg-indigo-950/20"
          badgeColor="bg-indigo-600 text-white"
          centralQuestion="How does data move from where it lives into your data platform?"
          explanation={
            "Ingestion is the first step of every pipeline — getting data from a source into GCP. The right tool depends on two questions: Is the data batch or streaming? And where does it come from? For batch file loads from Cloud Storage, use bq load. For scheduled recurring loads from SaaS (Google Ads, S3), use BigQuery Data Transfer Service. For real-time events from applications, use Pub/Sub. For continuous database replication (MySQL, Postgres), use Datastream. For moving files between storage systems (S3 to GCS), use Storage Transfer Service."
          }
          keyInsights={[
            "Pub/Sub is for application events (clicks, orders, IoT). Datastream is for database changes (inserts, updates, deletes via CDC). They solve different problems.",
            "bq load is a one-shot command. BigQuery Data Transfer Service manages recurring scheduled loads automatically.",
            "Streaming ingestion (Pub/Sub → Dataflow → BigQuery) is more complex and expensive than batch. Only stream when data freshness actually requires it.",
            "Storage Transfer Service moves files between buckets. It does not load into BigQuery — that is a separate step with bq load or Dataform.",
          ]}
          jobLogic={[
            "New data source question → first thing I ask: how often does data arrive and how fresh does it need to be in BigQuery? That determines batch vs streaming.",
            "Operational database data needs to be in BigQuery → I think Datastream (CDC). Not batch dumps — those miss updates and deletes.",
            "Recurring automated load from Google Ads into BigQuery → BigQuery Data Transfer Service. No pipeline to write or maintain.",
            "Customer events hitting an application → Pub/Sub collects them, Dataflow processes them, BigQuery stores them. That is the standard streaming stack.",
          ]}
          confusionIds={[
            { label: "Pub/Sub vs Datastream", href: "/confusions#pubsub-vs-datastream" },
            { label: "bq load vs Transfer Service", href: "/confusions#bq-load-vs-bq-transfer" },
            { label: "Storage Transfer vs BQ Transfer", href: "/confusions#storage-transfer-vs-bq-transfer" },
            { label: "Batch vs Streaming", href: "/confusions#batch-vs-streaming" },
          ]}
        />
      </div>

      {/* ── SECTION 3: PROCESSING ──────────────────────────────────────────── */}
      <div id="processing">
        <StudySection
          number="03"
          title="Processing & Transformation"
          color="bg-purple-50/50 dark:bg-purple-950/20"
          badgeColor="bg-purple-600 text-white"
          centralQuestion="How do you transform raw data into clean, structured, reliable tables?"
          explanation={
            "Processing is where raw data becomes useful. The ETL vs ELT split matters here. ETL transforms data before loading — Dataflow is the GCP tool for code-based transformation at scale (batch and streaming). ELT loads first, then transforms inside BigQuery using SQL — Dataform is the right tool for this, managing dependencies, tests, and version control. Dataproc is for teams with existing Spark code. Data Fusion is for visual, no-code ETL. BigQuery Scheduled Queries are for single SQL queries on a timer."
          }
          keyInsights={[
            "ELT is the modern GCP-native pattern: load raw data into BigQuery, then transform with Dataform. SQL in BigQuery is cheaper and easier to maintain than code in Dataflow for most transforms.",
            "Dataflow is the right choice when: data is streaming, transformations need custom code, or data lives outside BigQuery and needs to be moved.",
            "Dataform is not just Scheduled Queries — it manages a whole DAG of SQL models with dependency ordering, data quality tests, and documentation.",
            "Dataproc vs Dataflow: if you have existing Spark code, use Dataproc. For new GCP-native pipelines, Dataflow is simpler (serverless, no cluster management).",
          ]}
          jobLogic={[
            "New transformation requirement → first question: is the data already in BigQuery? If yes, use Dataform or Scheduled Queries. If not, use Dataflow to load and transform.",
            "Team has 50 SQL models that depend on each other → Dataform. Not Scheduled Queries — there is no dependency management in Scheduled Queries.",
            "Streaming data from Pub/Sub needs real-time enrichment before hitting BigQuery → Dataflow. That is its core use case.",
            "Someone mentions a Spark job that needs to run on GCP → Dataproc. Do not rewrite it in Beam just to use Dataflow.",
          ]}
          confusionIds={[
            { label: "Dataflow vs Dataproc", href: "/confusions#dataflow-vs-dataproc" },
            { label: "Dataflow vs Dataform", href: "/confusions#dataflow-vs-dataform" },
            { label: "Dataform vs Scheduled Queries", href: "/confusions#dataform-vs-bq-scheduled-queries" },
            { label: "ETL vs ELT", href: "/confusions#etl-vs-elt" },
          ]}
        />
      </div>

      {/* ── SECTION 4: ORCHESTRATION ────────────────────────────────────────── */}
      <div id="orchestration">
        <StudySection
          number="04"
          title="Orchestration"
          color="bg-amber-50/50 dark:bg-amber-950/20"
          badgeColor="bg-amber-600 text-white"
          centralQuestion="How do you coordinate all the pieces of a pipeline — scheduling, dependencies, retries, and monitoring?"
          explanation={
            "A data pipeline usually has multiple steps that must run in order: extract, load, transform, validate, notify. Orchestration is the layer that manages this. Cloud Composer is managed Apache Airflow — the most powerful option for complex DAGs with built-in operators for BigQuery, Dataflow, Dataproc, and more. Workflows is a lightweight serverless alternative for simpler API chaining. Cloud Scheduler is just a cron trigger — it fires a single event on a schedule. The key is matching the tool to the complexity of your pipeline."
          }
          keyInsights={[
            "Cloud Scheduler is NOT an orchestrator — it only fires a trigger. An orchestrator manages dependencies between steps, retries failures, and monitors the full pipeline.",
            "Cloud Composer (Airflow) is expensive because it runs an always-on cluster. Only use it when the pipeline complexity justifies the cost.",
            "Idempotency is an orchestration concern: if Composer retries a failed task, will the task re-running create duplicates? Your pipeline steps must be idempotent.",
            "DAGs (Directed Acyclic Graphs) are Airflow's model for pipelines: tasks are nodes, dependencies are edges, execution flows in one direction.",
          ]}
          jobLogic={[
            "Pipeline has step A → step B → step C → notification → use Cloud Composer. That is a real DAG.",
            "I just need to trigger a Cloud Function every day at 8am → Cloud Scheduler. No DAG, no dependencies, no Composer needed.",
            "Lightweight: call Cloud Run, then call BigQuery, then send an email → Workflows. Serverless, no cluster cost.",
            "Backfilling 2 years of historical data → Cloud Composer with Airflow's backfill feature. It will run the DAG for every date in the range automatically.",
          ]}
          confusionIds={[
            { label: "Composer vs Workflows", href: "/confusions#composer-vs-workflows" },
            { label: "Composer vs Scheduler", href: "/confusions#composer-vs-scheduler" },
          ]}
        />
      </div>

      {/* ── SECTION 5: GOVERNANCE & SECURITY ───────────────────────────────── */}
      <div id="governance">
        <StudySection
          number="05"
          title="Governance & Security"
          color="bg-red-50/50 dark:bg-red-950/20"
          badgeColor="bg-red-600 text-white"
          centralQuestion="How do you control who sees what, find sensitive data, and track data trust and ownership?"
          explanation={
            "Governance and security are often learned last but matter most in production. IAM is the foundation — controlling who can access which GCP resources. Policy tags add column-level security within BigQuery tables, hiding sensitive columns from unauthorized users. Row-level security adds record-level filters per user group. Sensitive Data Protection (Cloud DLP) scans for PII you may not know is there. Dataplex ties it all together with a catalog of assets, lineage tracking, and data quality rules — so you know what data exists, where it came from, and whether you can trust it."
          }
          keyInsights={[
            "IAM = resource access (dataset, bucket). Policy tags = column access (specific fields). Row-level security = row access (specific records). Three different layers, all working together.",
            "PII does not always land where you expect — support logs might contain email addresses embedded in freetext. Cloud DLP finds this automatically.",
            "Data lineage answers the most valuable debugging question: 'This dashboard shows wrong revenue — where did the bad data come from?' Follow the lineage backward.",
            "Data quality rules in Dataplex are not just a nice-to-have — they are the signal that catches bad data before it reaches analysts.",
          ]}
          jobLogic={[
            "New table has a 'salary' column → policy tag applied immediately. Only HR and Finance can see it. Everyone else sees NULL.",
            "Vendor sent us a CSV file — scan it with Cloud DLP before loading. Vendors often include PII in unexpected columns.",
            "Dashboard is showing wrong numbers → first stop is lineage in Dataplex. Trace backward from the dashboard table to find where the bad data entered.",
            "New team member joins → IAM gives them BigQuery Data Viewer on the analytics dataset. They can query but not modify. Service accounts used by pipelines get the minimum role needed.",
          ]}
          confusionIds={[
            { label: "Dataplex vs Cloud DLP", href: "/confusions#dataplex-vs-dlp" },
            { label: "IAM vs Policy Tags", href: "/confusions#iam-vs-policy-tags" },
            { label: "Column vs Row Security", href: "/confusions#column-vs-row-security" },
          ]}
        />
      </div>

      {/* ── SECTION 6: AI & AGENTS ──────────────────────────────────────────── */}
      <div id="agents">
        <StudySection
          number="06"
          title="AI, ML & Agents"
          color="bg-violet-50/50 dark:bg-violet-950/20"
          badgeColor="bg-violet-600 text-white"
          centralQuestion="How do ML models and AI agents connect to data engineering workflows?"
          explanation={
            "AI and data engineering are converging. On the ML side: BigQuery ML lets you train standard models (regression, classification, forecasting) using SQL inside BigQuery — the fast path when data is already there. Vertex AI is the full platform for custom models, generative AI, and deployment. On the agent side: Google ADK is the framework for writing agents that use tools (run SQL, call APIs, trigger pipelines). Agent Platform provides the managed runtime to deploy them at scale. For data engineers, the key use cases are: automated pipeline monitoring agents, natural language interfaces over BigQuery, and data quality investigation agents."
          }
          keyInsights={[
            "BigQuery ML is the 'SQL path to ML' — if data is in BigQuery and the model type is standard, do not move the data. Run ML where the data lives.",
            "Vertex AI handles everything BigQuery ML cannot: custom neural networks, real-time serving endpoints, generative AI with Gemini, and agent deployment.",
            "An AI agent (built with ADK) is distinct from a model — it is a system that reasons, uses tools, and takes actions. Tool calling is what makes it an agent rather than a chatbot.",
            "For data engineering, agents are most valuable in monitoring and investigation: 'Why did this pipeline fail?' → agent checks logs, quality scores, lineage, and explains the root cause.",
          ]}
          jobLogic={[
            "Analyst wants to predict customer churn and data is in BigQuery → BigQuery ML. No data movement, SQL they already know, done in an afternoon.",
            "Team needs a recommendation engine with a custom architecture → Vertex AI. BigQuery ML does not support neural networks.",
            "Want to build a 'pipeline health agent' that wakes up on alerts and investigates → Google ADK for the code, Agent Platform to deploy it, Vertex AI (Gemini) as the model.",
            "Someone asks about Agent Studio vs ADK → Studio is drag-and-drop for non-coders. ADK is code-first for engineers. Same outcome, different authoring experience.",
          ]}
          confusionIds={[
            { label: "BigQuery ML vs Vertex AI", href: "/confusions#bigquery-ml-vs-vertex-ai" },
            { label: "Looker vs Looker Studio", href: "/confusions#looker-vs-looker-studio" },
            { label: "ADK vs Agent Platform", href: "/confusions#adk-vs-agent-platform" },
            { label: "Sessions vs Memory", href: "/confusions#sessions-vs-memory" },
          ]}
        />
      </div>

      {/* ── CROSS-CUTTING CONCEPTS ──────────────────────────────────────────── */}
      <section className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-6 py-5 space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-50">
          Cross-cutting concepts — know these cold
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              term: "Idempotency",
              body: "A pipeline that can run multiple times without creating duplicates or corruption. Required for any pipeline that can fail and be retried — which is all of them.",
              glossaryId: "idempotency",
            },
            {
              term: "Backfill",
              body: "Running a pipeline over historical dates to populate a new table or fix bad data. Requires idempotent pipelines — otherwise re-running creates duplicates.",
              glossaryId: "backfill",
            },
            {
              term: "SLA vs SLO",
              body: "SLA is the external promise ('data by 8am'). SLO is the internal target ('pipeline done by 7am') that gives you a buffer before breaking the SLA.",
              glossaryId: "sla",
            },
            {
              term: "ETL vs ELT",
              body: "ETL transforms before loading (Dataflow). ELT loads raw then transforms inside BigQuery (Dataform). GCP-native pipelines prefer ELT — BigQuery is powerful and cheap.",
              glossaryId: "etl",
            },
          ].map(({ term, body }) => (
            <div
              key={term}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-1"
            >
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">{h(term)}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{h(body)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Navigation footer */}
      <div className="flex flex-wrap gap-3 pt-2">
        <Link
          href="/tool-map"
          className="text-sm px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          Explore Tool Map →
        </Link>
        <Link
          href="/confusions"
          className="text-sm px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-400 transition-colors"
        >
          Review Confusions →
        </Link>
        <Link
          href="/glossary"
          className="text-sm px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-400 transition-colors"
        >
          Open Glossary →
        </Link>
      </div>
    </div>
  );
}
