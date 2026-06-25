import PageShell from "@/components/PageShell";

const adkComponents = [
  {
    name: "Google ADK",
    subtitle: "Agent Development Kit",
    description:
      "Open-source framework for building AI agents that can reason, use tools, call APIs, access data, and coordinate sub-agents. Supports Python, TypeScript, Go, Java, and Kotlin.",
    useFor: "Building custom agents that connect to your data systems.",
    color: "blue",
  },
  {
    name: "Agent Platform",
    subtitle: "Gemini Enterprise Agent Platform",
    description:
      "The managed enterprise platform for deploying, scaling, governing, and monitoring agents. Includes ADK, Agent Studio, Agent Garden, Model Garden, Agent Runtime, and more.",
    useFor:
      "Running and governing agents at enterprise scale.",
    color: "violet",
  },
  {
    name: "Agent Studio",
    subtitle: "Low-code visual agent builder",
    description:
      "A visual canvas for building agents without writing all the agent logic from scratch. Lower barrier to entry than raw ADK.",
    useFor: "Teams that want visual/low-code agent creation.",
    color: "indigo",
  },
  {
    name: "Agent Garden",
    subtitle: "Prebuilt agent templates",
    description:
      "A catalog of prebuilt agent templates and components. Start from a template rather than from scratch.",
    useFor: "Jumpstarting agent development with proven patterns.",
    color: "emerald",
  },
  {
    name: "Model Garden",
    subtitle: "Model catalog",
    description:
      "Access to Google models (Gemini), third-party models, and open-source models — all in one place.",
    useFor: "Choosing the right model for your agent's intelligence layer.",
    color: "amber",
  },
];

const dataEngineeringAgentUseCases = [
  "Pipeline failure investigation agent — automatically queries logs and data quality results, summarizes root causes",
  "Data quality monitoring agent — checks table row counts, null rates, and value ranges on a schedule",
  "Business metrics explanation agent — answers \"why did revenue drop?\" by querying BigQuery and summarizing findings",
  "SQL assistant over BigQuery — translates natural language questions into SQL queries",
  "Metadata and catalog search agent — finds tables, owners, and lineage from natural language",
  "PII detection and remediation agent — identifies sensitive data and recommends masking",
];

const colorMap: Record<string, string> = {
  blue: "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950",
  violet: "border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-950",
  indigo: "border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950",
  emerald: "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950",
  amber: "border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950",
};

export default function AdkAgentsPage() {
  return (
    <PageShell
      title="ADK & Agent Platform"
      badge="Phase 2 — Content Available"
      description="Google's Agent Development Kit and Agent Platform. Learn how AI agents connect to data engineering workflows — the key difference between ADK (build) and Agent Platform (deploy/govern)."
    >
      <div className="bg-slate-800 dark:bg-slate-950 rounded-xl p-5 text-white space-y-2">
        <h2 className="font-semibold text-slate-100">The key distinction</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div>
            <span className="font-mono text-blue-300">ADK</span>
            <span className="text-slate-300"> = framework to BUILD agents</span>
          </div>
          <div>
            <span className="font-mono text-violet-300">Agent Platform</span>
            <span className="text-slate-300"> = managed platform to DEPLOY, SCALE, GOVERN agents</span>
          </div>
          <div>
            <span className="font-mono text-indigo-300">Agent Studio</span>
            <span className="text-slate-300"> = visual/low-code agent builder</span>
          </div>
          <div>
            <span className="font-mono text-emerald-300">Agent Garden</span>
            <span className="text-slate-300"> = prebuilt agent templates</span>
          </div>
          <div>
            <span className="font-mono text-amber-300">Model Garden</span>
            <span className="text-slate-300"> = model catalog (Gemini + third-party + open-source)</span>
          </div>
        </div>
        <p className="text-xs text-slate-400 pt-1 italic">
          &quot;An AI agent is useful when a workflow requires reasoning plus tool use — not just answering a question.&quot;
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {adkComponents.map((component) => (
          <div
            key={component.name}
            className={`rounded-xl border p-5 space-y-2 ${colorMap[component.color]}`}
          >
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                {component.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {component.subtitle}
              </p>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {component.description}
            </p>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Use for: {component.useFor}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 space-y-3">
        <h2 className="font-semibold text-slate-900 dark:text-slate-100">
          Data engineering agent use cases
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          These are the AI agent patterns most relevant to your data engineering role:
        </p>
        <ul className="space-y-2">
          {dataEngineeringAgentUseCases.map((useCase, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
              <span className="text-violet-500 mt-0.5">◆</span>
              {useCase}
            </li>
          ))}
        </ul>
      </div>
    </PageShell>
  );
}
