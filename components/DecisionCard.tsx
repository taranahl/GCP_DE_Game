"use client";

import { useState } from "react";
import type { DecisionCard as DecisionCardType } from "@/data/decisionTree";

const CATEGORY_COLORS: Record<string, string> = {
  storage: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  ingestion: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
  processing: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  orchestration: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  serving: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  governance: "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300",
  monitoring: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300",
  agents: "bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300",
};

interface DecisionCardProps {
  card: DecisionCardType;
}

export default function DecisionCard({ card }: DecisionCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-start justify-between gap-3 px-5 py-4 text-left"
      >
        <div className="space-y-1.5">
          <span
            className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize ${CATEGORY_COLORS[card.category] ?? "bg-gray-100 text-gray-600"}`}
          >
            {card.category}
          </span>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{card.need}</p>
          <p className="text-base font-bold text-blue-700 dark:text-blue-400">→ {card.tool}</p>
        </div>
        <span className="mt-1 shrink-0 text-gray-400 dark:text-gray-500">
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open && (
        <div className="border-t border-gray-100 px-5 pb-5 pt-4 dark:border-gray-800 space-y-4">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Why this tool
            </p>
            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{card.why}</p>
          </div>
          <div className="rounded-lg bg-amber-50 px-3 py-2.5 dark:bg-amber-950">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">
              When NOT to use it
            </p>
            <p className="text-sm leading-relaxed text-amber-800 dark:text-amber-300">
              {card.whenNotToUse}
            </p>
          </div>
          {card.relatedTerms.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {card.relatedTerms.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
