"use client";

import { useState, useMemo } from "react";
import confusions from "@/data/confusions";
import ConfusionCard from "@/components/ConfusionCard";
import SearchBar from "@/components/SearchBar";

type Category = "all" | "processing" | "ingestion" | "storage" | "orchestration" | "serving" | "governance" | "monitoring" | "concept";

const CATEGORIES: { id: Category; label: string; color: string }[] = [
  { id: "all", label: "All", color: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200" },
  { id: "storage", label: "Storage", color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" },
  { id: "ingestion", label: "Ingestion", color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300" },
  { id: "processing", label: "Processing", color: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300" },
  { id: "orchestration", label: "Orchestration", color: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300" },
  { id: "serving", label: "Serving / ML", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300" },
  { id: "governance", label: "Governance", color: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" },
  { id: "monitoring", label: "Monitoring", color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300" },
  { id: "concept", label: "Concept", color: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300" },
];

export default function ConfusionsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("all");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return confusions.filter((pair) => {
      const matchesCategory = activeCategory === "all" || pair.category === activeCategory;
      if (!matchesCategory) return false;
      if (!q) return true;
      return (
        pair.toolA.toLowerCase().includes(q) ||
        pair.toolB.toLowerCase().includes(q) ||
        pair.keyDistinction.toLowerCase().includes(q) ||
        pair.memoryTrick.toLowerCase().includes(q)
      );
    });
  }, [search, activeCategory]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: confusions.length };
    for (const p of confusions) {
      map[p.category] = (map[p.category] ?? 0) + 1;
    }
    return map;
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
          Common Confusions
        </h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400 text-sm">
          {confusions.length} pairs — the GCP tools that trip up even experienced engineers. Learn the key distinction for each.
        </p>
      </div>

      {/* Search */}
      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search by tool name or concept…"
        className="max-w-xl"
      />

      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(({ id, label, color }) => (
          <button
            key={id}
            onClick={() => setActiveCategory(id)}
            className={`text-xs px-3 py-1.5 rounded-full font-medium border transition-all ${
              activeCategory === id
                ? `${color} border-transparent ring-2 ring-offset-1 ring-blue-500`
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500"
            }`}
          >
            {label}
            <span className="ml-1.5 opacity-60">{counts[id] ?? 0}</span>
          </button>
        ))}
      </div>

      {/* Results count */}
      {(search || activeCategory !== "all") && (
        <p className="text-xs text-slate-400 dark:text-slate-500">
          {filtered.length === 0
            ? "No pairs match your search."
            : `Showing ${filtered.length} of ${confusions.length} pairs`}
        </p>
      )}

      {/* Cards */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((pair) => (
            <ConfusionCard key={pair.id} pair={pair} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <p className="text-slate-400 dark:text-slate-500 text-sm">
            No pairs match &ldquo;{search}&rdquo;
            {activeCategory !== "all"
              ? ` in ${CATEGORIES.find((c) => c.id === activeCategory)?.label ?? activeCategory}`
              : ""}
            .
          </p>
          <button
            onClick={() => { setSearch(""); setActiveCategory("all"); }}
            className="mt-3 text-xs text-blue-600 dark:text-blue-400 hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
