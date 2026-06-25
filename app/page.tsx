import Link from "next/link";
import HomeProgress from "@/components/HomeProgress";

const sections = [
  {
    href: "/tool-map",
    title: "GCP Tool Map",
    description:
      "All GCP data engineering tools, grouped by category. Learn what each tool does, when to use it, and when not to.",
    icon: "🗺️",
    status: "live",
    color: "blue",
  },
  {
    href: "/study-guide",
    title: "Study Guide",
    description:
      "Structured content covering storage, ingestion, processing, orchestration, governance, and AI agents.",
    icon: "📖",
    status: "live",
    color: "purple",
  },
  {
    href: "/glossary",
    title: "Glossary",
    description:
      "Plain-English definitions for every GCP concept. Click any term anywhere in the app to see a quick definition.",
    icon: "📚",
    status: "live",
    color: "indigo",
  },
  {
    href: "/confusions",
    title: "Common Confusions",
    description:
      "Side-by-side comparisons of tools that are easy to mix up: Dataflow vs Dataproc, Composer vs Scheduler, and more.",
    icon: "🔀",
    status: "live",
    color: "amber",
  },
  {
    href: "/scenario-game",
    title: "Scenario Game",
    description:
      "Realistic data engineering scenarios. Pick the right GCP tool and learn why from correct and incorrect explanations.",
    icon: "🎯",
    status: "live",
    color: "green",
  },
  {
    href: "/mistake-review",
    title: "Mistake Review",
    description:
      "Review every scenario you got wrong. Weak terms surface automatically to guide your next study session.",
    icon: "🔁",
    status: "live",
    color: "red",
  },
  {
    href: "/adk-agents",
    title: "ADK & Agent Platform",
    description:
      "Google's Agent Development Kit and Agent Platform. Learn how AI agents connect to data engineering workflows.",
    icon: "🤖",
    status: "live",
    color: "violet",
  },
  {
    href: "/pipeline-builder",
    title: "Pipeline Builder",
    description:
      "Explore real-world GCP data pipeline architectures for e-commerce, streaming, CDC, and governance use cases.",
    icon: "🔧",
    status: "live",
    color: "cyan",
  },
  {
    href: "/decision-tree",
    title: "Decision Tree",
    description:
      "Answer a few questions about your data problem and get a recommended GCP tool with an explanation.",
    icon: "🌳",
    status: "live",
    color: "emerald",
  },
  {
    href: "/console-map",
    title: "GCP Console Map",
    description:
      "Where to find each tool in the GCP console. Navigate with confidence without getting lost.",
    icon: "🖥️",
    status: "live",
    color: "slate",
  },
  {
    href: "/five-day-plan",
    title: "Five-Day Study Plan",
    description:
      "Day-by-day breakdown for 5 days of GCP DE prep. Check off tasks and track your progress.",
    icon: "📅",
    status: "live",
    color: "orange",
  },
];

const colorMap: Record<string, string> = {
  blue: "border-blue-200 bg-blue-50 hover:border-blue-400 dark:border-blue-800 dark:bg-blue-950 dark:hover:border-blue-600",
  purple:
    "border-purple-200 bg-purple-50 hover:border-purple-400 dark:border-purple-800 dark:bg-purple-950 dark:hover:border-purple-600",
  indigo:
    "border-indigo-200 bg-indigo-50 hover:border-indigo-400 dark:border-indigo-800 dark:bg-indigo-950 dark:hover:border-indigo-600",
  amber:
    "border-amber-200 bg-amber-50 hover:border-amber-400 dark:border-amber-800 dark:bg-amber-950 dark:hover:border-amber-600",
  green:
    "border-green-200 bg-green-50 hover:border-green-400 dark:border-green-800 dark:bg-green-950 dark:hover:border-green-600",
  cyan: "border-cyan-200 bg-cyan-50 hover:border-cyan-400 dark:border-cyan-800 dark:bg-cyan-950 dark:hover:border-cyan-600",
  emerald:
    "border-emerald-200 bg-emerald-50 hover:border-emerald-400 dark:border-emerald-800 dark:bg-emerald-950 dark:hover:border-emerald-600",
  violet:
    "border-violet-200 bg-violet-50 hover:border-violet-400 dark:border-violet-800 dark:bg-violet-950 dark:hover:border-violet-600",
  slate:
    "border-slate-200 bg-slate-100 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-500",
  red: "border-red-200 bg-red-50 hover:border-red-400 dark:border-red-800 dark:bg-red-950 dark:hover:border-red-600",
  orange:
    "border-orange-200 bg-orange-50 hover:border-orange-400 dark:border-orange-800 dark:bg-orange-950 dark:hover:border-orange-600",
};

export default function Home() {
  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="text-center space-y-4 pt-4">
        <div className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-sm font-medium mb-2">
          GCP Data Engineering Study Hub
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-slate-50 leading-tight">
          Learn GCP tools the way
          <br />
          <span className="text-blue-600 dark:text-blue-400">
            engineers actually think
          </span>
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          This is not a memorization tool. It teaches you{" "}
          <strong>which GCP tool to choose and why</strong> — for real data
          engineering problems. Build architecture judgment, not trivia recall.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            href="/tool-map"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            Start Today&apos;s Study
          </Link>
          <Link
            href="/five-day-plan"
            className="px-6 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 text-slate-700 dark:text-slate-200 font-semibold rounded-lg transition-colors"
          >
            View 5-Day Plan
          </Link>
        </div>
      </section>

      {/* Learning goal explanation */}
      <section className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
          What you&apos;re building toward
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-slate-600 dark:text-slate-300">
          <div className="space-y-1">
            <div className="font-medium text-slate-800 dark:text-slate-200">
              Tool selection fluency
            </div>
            <div>
              Given any data problem, know which GCP tool fits — and which ones
              don&apos;t.
            </div>
          </div>
          <div className="space-y-1">
            <div className="font-medium text-slate-800 dark:text-slate-200">
              Architecture thinking
            </div>
            <div>
              Trace a business need to a full GCP pipeline: source → ingestion →
              storage → processing → serving.
            </div>
          </div>
          <div className="space-y-1">
            <div className="font-medium text-slate-800 dark:text-slate-200">
              Confident explanations
            </div>
            <div>
              Explain trade-offs clearly — why Dataflow vs Dataproc, why ELT vs
              ETL, why Composer vs Scheduler.
            </div>
          </div>
        </div>
      </section>

      {/* Live progress from localStorage */}
      <HomeProgress />

      {/* Section grid */}
      <section>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
          All sections
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className={`block rounded-xl border-2 p-5 transition-all duration-150 group ${colorMap[section.color]}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl leading-none mt-0.5" aria-hidden>
                  {section.icon}
                </span>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 group-hover:underline">
                      {section.title}
                    </h3>
                    {section.status === "live" ? (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 font-medium">
                        Live
                      </span>
                    ) : (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 font-medium">
                        Soon
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {section.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Data lifecycle explainer */}
      <section className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          The data engineering lifecycle — think of GCP as a toolbox for this
        </h2>
        <div className="flex flex-wrap gap-2 items-center text-sm">
          {[
            { label: "Source systems", color: "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300" },
            { label: "→", color: "text-slate-400" },
            { label: "Ingestion", color: "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300" },
            { label: "→", color: "text-slate-400" },
            { label: "Storage", color: "bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300" },
            { label: "→", color: "text-slate-400" },
            { label: "Processing", color: "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300" },
            { label: "→", color: "text-slate-400" },
            { label: "Analytics / ML", color: "bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300" },
            { label: "→", color: "text-slate-400" },
            { label: "Orchestration", color: "bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300" },
            { label: "→", color: "text-slate-400" },
            { label: "Governance", color: "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300" },
            { label: "→", color: "text-slate-400" },
            { label: "Monitoring", color: "bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300" },
            { label: "→", color: "text-slate-400" },
            { label: "AI agents", color: "bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300" },
          ].map((item, i) =>
            item.label === "→" ? (
              <span key={i} className={item.color}>
                →
              </span>
            ) : (
              <span
                key={i}
                className={`px-2.5 py-1 rounded-full font-medium ${item.color}`}
              >
                {item.label}
              </span>
            )
          )}
        </div>
        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
          Each stage has specific GCP tools. This app covers all of them —
          starting with the tools you&apos;ll use every day.
        </p>
      </section>
    </div>
  );
}
