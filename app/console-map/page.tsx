"use client";

import { useState, useMemo } from "react";
import consoleMapEntries from "@/data/consoleMap";
import ConsoleMapCard from "@/components/ConsoleMapCard";
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

export default function ConsoleMapPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return consoleMapEntries.filter((e) => {
      const matchesCat = category === "all" || e.category === category;
      const matchesQuery =
        !q ||
        e.toolName.toLowerCase().includes(q) ||
        e.consoleSearchTerm.toLowerCase().includes(q) ||
        e.whereItLives.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [query, category]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">GCP Console Map</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Where to find each GCP tool in the console, what to create first, and what beginner mistakes to avoid.
        </p>
      </div>

      <SearchBar value={query} onChange={setQuery} placeholder="Search by tool name..." />

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

      <p className="text-xs text-slate-400 dark:text-slate-500">
        Showing {filtered.length} of {consoleMapEntries.length} tools
      </p>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <p className="py-10 text-center text-sm text-slate-500 dark:text-slate-400">
            No tools match your search.
          </p>
        ) : (
          filtered.map((entry) => <ConsoleMapCard key={entry.id} entry={entry} />)
        )}
      </div>
    </div>
  );
}
