"use client";

import { useState } from "react";
import type { GCPTool } from "@/types/tools";
import { useGlossary } from "@/contexts/GlossaryContext";
import gcpTools from "@/data/tools";

type Panel = "none" | "use" | "confusion";

const categoryColor: Record<string, string> = {
  storage: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  ingestion: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
  processing: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  orchestration: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  serving: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  governance: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  monitoring: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300",
  agents: "bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300",
};

const categoryLabel: Record<string, string> = {
  storage: "Storage",
  ingestion: "Ingestion",
  processing: "Processing",
  orchestration: "Orchestration",
  serving: "Serving / ML",
  governance: "Governance",
  monitoring: "Monitoring",
  agents: "AI Agents",
};

interface ToolCardProps {
  tool: GCPTool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  const [panel, setPanel] = useState<Panel>("none");
  const { openTerm } = useGlossary();

  function toggle(p: Panel) {
    setPanel((prev) => (prev === p ? "none" : p));
  }

  return (
    <div
      id={tool.id}
      className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Header */}
      <div className="p-4 pb-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50 leading-snug">
            {tool.name}
          </h2>
          <span
            className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${categoryColor[tool.category] ?? ""}`}
          >
            {categoryLabel[tool.category] ?? tool.category}
          </span>
        </div>
        <p className="text-xs text-blue-600 dark:text-blue-400 italic mb-2 leading-snug">
          {tool.tagline}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          {tool.problem}
        </p>
      </div>

      {/* Toggle buttons */}
      <div className="flex gap-1.5 px-4 pb-3">
        <button
          onClick={() => toggle("use")}
          className={`text-xs px-2.5 py-1.5 rounded-lg font-medium border transition-colors ${
            panel === "use"
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-blue-300"
          }`}
        >
          When to use
        </button>
        <button
          onClick={() => toggle("confusion")}
          className={`text-xs px-2.5 py-1.5 rounded-lg font-medium border transition-colors ${
            panel === "confusion"
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-blue-300"
          }`}
        >
          vs. similar tools
        </button>
      </div>

      {/* Expanded panels */}
      {panel !== "none" && (
        <div className="border-t border-slate-100 dark:border-slate-700 px-4 py-3 space-y-3">
          {panel === "use" && (
            <>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400 mb-1.5">
                  Use it when
                </p>
                <ul className="space-y-1">
                  {tool.whenToUse.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-red-500 dark:text-red-400 mb-1.5">
                  Do not use it when
                </p>
                <ul className="space-y-1">
                  {tool.whenNotToUse.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {panel === "confusion" && (
            <div className="space-y-3">
              {tool.confusedWith.length === 0 ? (
                <p className="text-xs text-slate-400">No common confusions listed.</p>
              ) : (
                tool.confusedWith.map(({ id, reason }) => {
                  const other = gcpTools.find((t) => t.id === id);
                  return (
                    <div key={id} className="space-y-1">
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                        vs.{" "}
                        <span className="text-blue-600 dark:text-blue-400">{other?.name ?? id}</span>
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {reason}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      )}

      {/* Glossary links footer */}
      {tool.glossaryTermIds.length > 0 && (
        <div className="border-t border-slate-100 dark:border-slate-700 px-4 py-2.5 flex flex-wrap gap-1">
          {tool.glossaryTermIds.map((termId) => (
            <button
              key={termId}
              onClick={() => openTerm(termId)}
              className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              {termId}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
