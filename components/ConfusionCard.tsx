"use client";

import { useState } from "react";
import type { ConfusionPair } from "@/data/confusions";
import { useGlossary } from "@/contexts/GlossaryContext";

const categoryColor: Record<string, string> = {
  processing: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  ingestion: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
  storage: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  orchestration: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  serving: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  governance: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  monitoring: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300",
  concept: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
};

const categoryLabel: Record<string, string> = {
  processing: "Processing",
  ingestion: "Ingestion",
  storage: "Storage",
  orchestration: "Orchestration",
  serving: "Serving / ML",
  governance: "Governance",
  monitoring: "Monitoring",
  concept: "Concept",
};

interface ConfusionCardProps {
  pair: ConfusionPair;
}

export default function ConfusionCard({ pair }: ConfusionCardProps) {
  const [expanded, setExpanded] = useState(false);
  const { openTerm } = useGlossary();

  return (
    <div
      id={pair.id}
      className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Header row */}
      <div className="p-4 pb-3">
        <div className="flex items-start justify-between gap-3 mb-3">
          {/* Tool pair */}
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <button
              onClick={() => pair.toolAGlossaryId && openTerm(pair.toolAGlossaryId)}
              disabled={!pair.toolAGlossaryId}
              className="text-sm font-semibold px-2.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors disabled:cursor-default disabled:hover:bg-blue-50"
            >
              {pair.toolA}
            </button>
            <span className="text-xs font-bold text-slate-400">vs</span>
            <button
              onClick={() => pair.toolBGlossaryId && openTerm(pair.toolBGlossaryId)}
              disabled={!pair.toolBGlossaryId}
              className="text-sm font-semibold px-2.5 py-0.5 rounded bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-200 hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors disabled:cursor-default disabled:hover:bg-purple-50"
            >
              {pair.toolB}
            </button>
          </div>
          {/* Category badge */}
          <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${categoryColor[pair.category] ?? categoryColor.concept}`}>
            {categoryLabel[pair.category] ?? pair.category}
          </span>
        </div>

        {/* Key distinction */}
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          {pair.keyDistinction}
        </p>

        {/* Memory trick */}
        <div className="mt-2.5 bg-amber-50 dark:bg-amber-950 border border-amber-100 dark:border-amber-900 rounded-lg px-3 py-2">
          <p className="text-xs italic text-amber-800 dark:text-amber-200">
            {pair.memoryTrick}
          </p>
        </div>
      </div>

      {/* Expand toggle */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-2.5 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors rounded-b-xl"
        aria-expanded={expanded}
      >
        <span>{expanded ? "Hide comparison" : "Show when to pick each →"}</span>
        <svg
          className={`w-3.5 h-3.5 transition-transform ${expanded ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expanded side-by-side */}
      {expanded && (
        <div className="border-t border-slate-100 dark:border-slate-700 grid grid-cols-2 divide-x divide-slate-100 dark:divide-slate-700 rounded-b-xl overflow-hidden">
          {/* Pick A */}
          <div className="p-3 bg-blue-50/50 dark:bg-blue-950/30">
            <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-2">
              Pick {pair.toolA} when…
            </p>
            <ul className="space-y-1.5">
              {pair.pickA.map((item, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          {/* Pick B */}
          <div className="p-3 bg-purple-50/50 dark:bg-purple-950/30">
            <p className="text-xs font-semibold text-purple-700 dark:text-purple-400 mb-2">
              Pick {pair.toolB} when…
            </p>
            <ul className="space-y-1.5">
              {pair.pickB.map((item, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
