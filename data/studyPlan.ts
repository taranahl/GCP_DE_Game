export interface StudyTask {
  id: string;
  label: string;
}

export interface StudyDay {
  day: number;
  title: string;
  focus: string;
  concepts: string[];
  tools: string[];
  tasks: StudyTask[];
  miniProject: string;
  selfCheck: string[];
  relatedTerms: string[];
}

const studyPlan: StudyDay[] = [
  {
    day: 1,
    title: "Storage + BigQuery Foundation",
    focus: "Understand where data lives in GCP and when to use each storage option",
    concepts: [
      "Data lake — cheap, raw file storage, no structure enforced",
      "Data warehouse — structured, queryable storage (BigQuery)",
      "Lakehouse — files in Cloud Storage + governed SQL access via BigLake",
      "Native BigQuery tables — data is inside BigQuery, fastest for SQL",
      "External tables — data stays in Cloud Storage, SQL runs against it",
      "BigLake — external tables with column-level security and Dataplex governance",
    ],
    tools: [
      "Cloud Storage",
      "BigQuery",
      "BigLake",
      "External Tables",
      "bq load / LOAD DATA",
    ],
    tasks: [
      { id: "d1-t1", label: "Read: What is Cloud Storage? What is it NOT?" },
      { id: "d1-t2", label: "Read: What is BigQuery? When would you not use it?" },
      { id: "d1-t3", label: "Read: External Tables vs Native BigQuery Tables — when each is right" },
      { id: "d1-t4", label: "Read: BigLake — why it exists over External Tables" },
      { id: "d1-t5", label: "Complete the Scenario Game: E-commerce Orders scenario and File Migration scenario" },
      { id: "d1-t6", label: "Look up Cloud Storage and BigQuery in the GCP Console Map" },
    ],
    miniProject:
      "Design (on paper): You have 5 years of daily CSV sales reports stored in AWS S3. You want to move them to GCP, keep the raw files in Cloud Storage, and be able to run SQL over them without loading everything into BigQuery. Sketch the architecture. Which tool handles the migration? Which handles the SQL access? What would you add if the data had PII?",
    selfCheck: [
      "Can you explain the difference between Cloud Storage and BigQuery to a non-engineer?",
      "When would you use BigLake instead of loading data into native BigQuery tables?",
      "What is the command or SQL statement to load a CSV file from GCS into BigQuery?",
      "Why would you NOT run SELECT * FROM huge_table in BigQuery without a filter?",
    ],
    relatedTerms: ["cloud-storage", "bigquery", "biglake", "external-tables", "data-lake", "data-warehouse", "lakehouse"],
  },
  {
    day: 2,
    title: "Ingestion + Processing",
    focus: "Learn how data gets into GCP and how it gets transformed",
    concepts: [
      "Batch ingestion — data arrives in chunks on a schedule",
      "Streaming ingestion — data arrives continuously in real time",
      "ETL — transform data before loading it to the destination",
      "ELT — load raw data first, transform it inside the warehouse",
      "CDC (Change Data Capture) — capture database inserts, updates, and deletes",
      "Spark/Hadoop — the open-source big data processing ecosystem",
    ],
    tools: [
      "Pub/Sub",
      "Dataflow",
      "Datastream",
      "Storage Transfer Service",
      "BigQuery Data Transfer Service",
      "Dataproc",
      "Data Fusion",
    ],
    tasks: [
      { id: "d2-t1", label: "Read: Pub/Sub — what problem it solves and why it's the front door for events" },
      { id: "d2-t2", label: "Read: Dataflow — streaming vs batch mode, when to use vs Dataproc" },
      { id: "d2-t3", label: "Read: Datastream — CDC and why nightly exports are not enough" },
      { id: "d2-t4", label: "Read: BigQuery Data Transfer Service — which sources it supports" },
      { id: "d2-t5", label: "Complete the Scenario Game: Clickstream Pipeline and CDC from PostgreSQL scenarios" },
      { id: "d2-t6", label: "Open the Confusions page: study Dataflow vs Dataproc and Pub/Sub vs Datastream" },
      { id: "d2-t7", label: "Use the Pipeline Builder: build a streaming events pipeline and a SaaS data pipeline" },
    ],
    miniProject:
      "Design (on paper): A food delivery app wants two pipelines: (1) real-time order event tracking so the ops team can see orders as they come in, and (2) a daily sync from their PostgreSQL operational database into BigQuery for the finance team's reporting. Design both pipelines. Which tools do you pick for each? Why is Dataflow right for (1) but not necessarily (2)? Why is Datastream right for (2)?",
    selfCheck: [
      "What is the difference between Pub/Sub and Datastream?",
      "When would you use Dataproc instead of Dataflow?",
      "What does CDC mean and why is it better than a nightly export?",
      "What is BigQuery Data Transfer Service and which sources does it support?",
      "What does ELT mean and why is it common in GCP data pipelines?",
    ],
    relatedTerms: ["pubsub", "dataflow", "datastream", "dataproc", "data-fusion", "streaming-ingestion", "batch-ingestion", "change-data-capture", "etl", "elt"],
  },
  {
    day: 3,
    title: "Orchestration + Governance + Monitoring",
    focus: "Learn how to schedule pipelines, govern data access, and monitor pipeline health",
    concepts: [
      "Orchestration — coordinating when and in what order pipeline steps run",
      "DAG (Directed Acyclic Graph) — a dependency graph of pipeline tasks",
      "Data quality — ensuring data is complete, accurate, and consistent",
      "Data lineage — tracking where data came from and where it flows",
      "PII (Personally Identifiable Information) — data that identifies a person",
      "IAM (Identity and Access Management) — who can access what on GCP",
      "SLA/SLO — pipeline delivery commitments and measurable targets",
    ],
    tools: [
      "Cloud Composer",
      "Workflows",
      "Cloud Scheduler",
      "Dataplex / Knowledge Catalog",
      "IAM",
      "Policy Tags",
      "Sensitive Data Protection",
      "Cloud Logging",
      "Cloud Monitoring",
    ],
    tasks: [
      { id: "d3-t1", label: "Read: Cloud Composer vs Workflows vs Cloud Scheduler — when to use each" },
      { id: "d3-t2", label: "Read: Dataplex — catalog, lineage, and data quality" },
      { id: "d3-t3", label: "Read: Policy Tags — how column-level security works" },
      { id: "d3-t4", label: "Read: Sensitive Data Protection — what PII scanning finds and how to act on findings" },
      { id: "d3-t5", label: "Complete the Scenario Game: Governance and PII Detection scenario" },
      { id: "d3-t6", label: "Open the Confusions page: study Composer vs Workflows vs Scheduler" },
      { id: "d3-t7", label: "Use the Pipeline Builder: build a sensitive customer data pipeline with high governance" },
    ],
    miniProject:
      "Design (on paper): A healthcare company has patient records in BigQuery. Legal requires: (1) all PII detected and tagged, (2) only the clinical team can see patient names, (3) a lineage trail showing which downstream tables use patient data, and (4) an alert if any pipeline fails to update patient records within 4 hours. Map each requirement to a GCP tool. Which tool does which job?",
    selfCheck: [
      "When would you use Cloud Composer vs Cloud Scheduler?",
      "What is the difference between Dataplex and Sensitive Data Protection?",
      "What does a Policy Tag actually do to a BigQuery column?",
      "What is data lineage and why do regulators care about it?",
      "What is an SLA vs an SLO?",
    ],
    relatedTerms: ["cloud-composer", "workflows", "cloud-scheduler", "dataplex", "iam", "policy-tags", "sensitive-data-protection", "cloud-logging", "cloud-monitoring", "dag", "data-lineage", "pii", "sla", "slo"],
  },
  {
    day: 4,
    title: "ADK + Agent Platform",
    focus: "Understand how AI agents connect to data engineering workflows",
    concepts: [
      "Agent — an AI system that can take actions (call tools, query data) to complete a goal",
      "Tool calling — an agent calling a function (like a BigQuery query) to get information",
      "Agent memory — storing context across multiple agent interactions",
      "Agent sessions — managing multi-turn conversations in an agent",
      "Agent runtime — the infrastructure that runs and scales agents",
      "Model Garden — the catalogue of foundation models available on GCP",
    ],
    tools: [
      "Google ADK",
      "Agent Platform",
      "Agent Studio",
      "Agent Garden",
      "Model Garden",
      "Vertex AI",
    ],
    tasks: [
      { id: "d4-t1", label: "Read: What is Google ADK? What problem does it solve vs writing a custom chatbot?" },
      { id: "d4-t2", label: "Read: Agent Platform vs Agent Studio vs Agent Garden — what each is for" },
      { id: "d4-t3", label: "Read: Model Garden — what it is and which foundation models are available" },
      { id: "d4-t4", label: "Read the ADK & Agents page in the study hub" },
      { id: "d4-t5", label: "Complete the Scenario Game: Restaurant Analytics scenario (which has a Google ADK layer)" },
      { id: "d4-t6", label: "Use the Pipeline Builder: build an app events pipeline with AI agent needed = yes" },
      { id: "d4-t7", label: "Look up Google ADK and Agent Platform in the GCP Console Map" },
    ],
    miniProject:
      "Design (on paper): A restaurant analytics company wants an agent that a restaurant owner can ask questions like 'Why did my burger sales drop on Tuesday?' The agent should be able to query BigQuery for the relevant data, interpret the results, and give a plain-English explanation. Sketch the agent architecture: What tools does the agent need? What data does it query? What model does it use? What happens when the agent cannot find the answer?",
    selfCheck: [
      "What is the difference between an AI agent and a regular chatbot?",
      "What does 'tool calling' mean in the context of an agent?",
      "When would you use Google ADK vs building a simple chatbot with a REST API?",
      "What is Model Garden and how does it relate to Vertex AI?",
      "What is the role of Agent Platform vs Agent Studio?",
    ],
    relatedTerms: ["adk", "agent-platform", "agent-studio", "agent-garden", "model-garden", "tool-calling", "agent-memory", "agent-sessions"],
  },
  {
    day: 5,
    title: "Real-World Architecture Practice",
    focus: "Apply everything — design end-to-end GCP architectures and explain trade-offs",
    concepts: [
      "End-to-end architecture — source → ingestion → storage → processing → serving → governance → monitoring",
      "Trade-offs — balancing cost, simplicity, performance, and compliance",
      "Simple vs production version — MVP pipeline vs hardened, monitored, governed pipeline",
      "Idempotency — ensuring pipeline reruns produce the same result",
      "Backfill — reprocessing historical data after a pipeline fix",
    ],
    tools: ["All tools covered in Days 1–4"],
    tasks: [
      { id: "d5-t1", label: "Complete ALL remaining Scenario Game scenarios you haven't done yet" },
      { id: "d5-t2", label: "Use the Pipeline Builder: try at least 4 different source + frequency combinations" },
      { id: "d5-t3", label: "Use the Decision Tree: find the right tool for 5 different 'what should I use?' questions" },
      { id: "d5-t4", label: "Review the Confusions page: Dataflow vs Dataproc, BigLake vs External Tables, Composer vs Scheduler" },
      { id: "d5-t5", label: "Pick one Scenario Game scenario and write a full build plan: tools, why each was chosen, what not to use, how you would monitor it" },
      { id: "d5-t6", label: "Check the Mistake Review page and study any tools you got wrong in the Scenario Game" },
    ],
    miniProject:
      "Pick one of these real-world scenarios and design the full GCP architecture: (A) An e-commerce company wants daily sales analytics, real-time fraud detection, and a dashboard for executives. Or (B) A logistics company has GPS events from 10,000 vehicles arriving every second and wants a live map dashboard plus a daily summary report. Include: ingestion, storage, processing, governance, monitoring, and the tool for each. Explain one alternative you considered and why you chose against it.",
    selfCheck: [
      "Can you describe a full GCP data pipeline (source → serving) for a batch use case and a streaming use case?",
      "What is the difference between Dataflow and Dataproc — and when would you pick each?",
      "When would you use Dataform vs BigQuery Scheduled Queries?",
      "What does 'idempotent' mean and why does it matter for pipelines?",
      "If a pipeline fails at 3 AM, what GCP tools would alert you and help you debug it?",
    ],
    relatedTerms: ["idempotency", "backfill", "sla", "slo", "etl", "elt", "batch-processing", "streaming-processing"],
  },
];

export default studyPlan;
