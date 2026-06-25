"use client";

import { useState, useMemo } from "react";
import decisionCards from "@/data/decisionTree";
import DecisionCard from "@/components/DecisionCard";
import SearchBar from "@/components/SearchBar";

const ALL_CATEGORIES = ["all", "storage", "ingestion", "processing", "orchestration", "serving", "governance", "monitoring", "agents"];

const CATEGORY_LABELS: Record<string, string> = {
  all: "All",
  storage: "Storage",
  ingestion: "Ingestion",
  processing: "Processing",
  orchestration: "Orchestration",
  serving: "Serving & ML",
  governance: "Governance",
  monitoring: "Monitoring",
  agents: "AI Agents",
};

export default function DecisionTreePage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return decisionCards.filter((c) => {
      const matchesCat = category === "all" || c.category === category;
      const matchesQuery =
        !q ||
        c.need.toLowerCase().includes(q) ||
        c.tool.toLowerCase().includes(q) ||
        c.why.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [query, category]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Decision Tree</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          &ldquo;What GCP tool should I use?&rdquo; &mdash; {decisionCards.length} decisions, each with a tool recommendation, why it is right, and when not to use it.
        </p>
      </div>

      <SearchBar value={query} onChange={setQuery} placeholder="Search by need, tool, or keyword..." />

      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        {ALL_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              category === cat
                ? "bg-blue-600 text-white dark:bg-blue-700"
                : "bg-white border border-slate-300 text-slate-600 hover:border-blue-400 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300"
            }`}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <p className="py-10 text-center text-sm text-slate-500 dark:text-slate-400">
            No decisions match your search.
          </p>
        ) : (
          filtered.map((card) => <DecisionCard key={card.id} card={card} />)
        )}
      </div>
    </div>
  );
}
