"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useGlossary } from "@/contexts/GlossaryContext";
import glossaryTerms from "@/data/glossary";

type ActivePanel = "main" | "simpler" | "example" | "compare";

const categoryLabel: Record<string, string> = {
  storage: "Storage",
  ingestion: "Ingestion",
  processing: "Processing",
  orchestration: "Orchestration",
  governance: "Governance",
  security: "Security",
  monitoring: "Monitoring",
  "ml-ai": "ML / AI",
  agents: "AI Agents",
  concept: "Concept",
};

const categoryColor: Record<string, string> = {
  storage: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  ingestion: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
  processing: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  orchestration: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  governance: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  security: "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300",
  monitoring: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300",
  "ml-ai": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  agents: "bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300",
  concept: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300",
};

export default function TermPopover() {
  const { activeTerm, closeTerm, openTerm } = useGlossary();
  const [panel, setPanel] = useState<ActivePanel>("main");

  const term = activeTerm
    ? glossaryTerms.find((t) => t.id === activeTerm)
    : null;

  const handleClose = useCallback(() => {
    closeTerm();
    setPanel("main");
  }, [closeTerm]);

  // Close on Escape
  useEffect(() => {
    if (!activeTerm) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activeTerm, handleClose]);

  // Reset panel when a new term opens
  useEffect(() => {
    setPanel("main");
  }, [activeTerm]);

  // Prevent body scroll when open
  useEffect(() => {
    if (activeTerm) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeTerm]);

  if (!activeTerm) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={term ? `Definition: ${term.term}` : "Term definition"}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal card */}
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-md max-h-[85vh] overflow-y-auto">
        {!term ? (
          <div className="p-6 text-center text-slate-500 dark:text-slate-400">
            <p className="text-sm">Term not found.</p>
            <button
              onClick={handleClose}
              className="mt-3 text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-start justify-between p-5 pb-3 border-b border-slate-100 dark:border-slate-700">
              <div className="space-y-1 pr-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                    {term.term}
                  </h2>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColor[term.category] ?? categoryColor.concept}`}
                  >
                    {categoryLabel[term.category] ?? term.category}
                  </span>
                </div>
                {term.aliases.length > 0 && (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Also known as: {term.aliases.join(", ")}
                  </p>
                )}
              </div>
              <button
                onClick={handleClose}
                className="shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                aria-label="Close"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Action buttons */}
            <div className="flex gap-1.5 px-5 pt-3">
              {(
                [
                  { key: "simpler", label: "Explain simpler" },
                  { key: "example", label: "GCP example" },
                  { key: "compare", label: "Compare" },
                ] as { key: ActivePanel; label: string }[]
              ).map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setPanel(panel === key ? "main" : key)}
                  className={`text-xs px-2.5 py-1.5 rounded-lg font-medium border transition-colors ${
                    panel === key
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
              {panel === "main" && (
                <>
                  <div className="space-y-1">
                    <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                      {term.generalDefinition}
                    </p>
                    {term.gcpDefinition && (
                      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                        {term.gcpDefinition}
                      </p>
                    )}
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-950 border border-blue-100 dark:border-blue-900 rounded-lg px-4 py-3">
                    <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-0.5">
                      Memory shortcut
                    </p>
                    <p className="text-sm text-blue-900 dark:text-blue-200 italic">
                      {term.memoryShortcut}
                    </p>
                  </div>
                </>
              )}

              {panel === "simpler" && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                    Plain English version
                  </p>
                  <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                    {term.simplerExplanation}
                  </p>
                </div>
              )}

              {panel === "example" && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                    GCP example
                  </p>
                  <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3">
                    <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-mono">
                      {term.gcpExample}
                    </p>
                  </div>
                  {term.example && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      {term.example}
                    </p>
                  )}
                </div>
              )}

              {panel === "compare" && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                    Common confusion
                  </p>
                  <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                    {term.commonConfusion}
                  </p>
                  {term.relatedTerms.length > 0 && (
                    <div className="pt-1">
                      <p className="text-xs text-slate-400 dark:text-slate-500 mb-1.5">
                        Related terms
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {term.relatedTerms.map((id) => {
                          const related = glossaryTerms.find((t) => t.id === id);
                          return related ? (
                            <button
                              key={id}
                              onClick={() => openTerm(id)}
                              className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                            >
                              {related.term}
                            </button>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 pb-5 pt-0">
              <Link
                href={`/glossary#${term.id}`}
                onClick={handleClose}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                See full entry in Glossary →
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
