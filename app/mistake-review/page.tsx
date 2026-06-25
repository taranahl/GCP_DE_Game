"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getMistakes,
  getWeakTerms,
  getScenarioResults,
  clearAllProgress,
  type MistakeEntry,
} from "@/lib/scenarioStorage";
import scenarios from "@/data/scenarios";

function findScenario(scenarioId: string) {
  return scenarios.find((s) => s.id === scenarioId);
}

function toolDisplayName(scenarioId: string, toolId: string): string {
  const scenario = findScenario(scenarioId);
  if (!scenario) return toolId;
  const ex = scenario.toolExplanations.find((e) => e.toolId === toolId);
  return ex?.toolName ?? toolId;
}

function toolExplanation(scenarioId: string, toolId: string): string | null {
  const scenario = findScenario(scenarioId);
  if (!scenario) return null;
  const ex = scenario.toolExplanations.find((e) => e.toolId === toolId);
  return ex?.explanation ?? null;
}

function correctToolsFor(scenarioId: string): string[] {
  return findScenario(scenarioId)?.correctTools ?? [];
}

function scoreColor(score: number): string {
  if (score >= 90) return "text-emerald-600 dark:text-emerald-400";
  if (score >= 70) return "text-blue-600 dark:text-blue-400";
  if (score >= 50) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

export default function MistakeReviewPage() {
  const [mistakes, setMistakes] = useState<MistakeEntry[]>([]);
  const [weakTerms, setWeakTerms] = useState<[string, number][]>([]);
  const [scoreMap, setScoreMap] = useState<Record<string, number>>({});
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const m = getMistakes();
    const w = getWeakTerms();
    const results = getScenarioResults();

    const map: Record<string, number> = {};
    results.forEach((r) => { map[r.scenarioId] = r.score; });

    setMistakes(Object.values(m).sort((a, b) => b.timestamp - a.timestamp));
    setWeakTerms(
      Object.entries(w)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
    );
    setScoreMap(map);
    setLoaded(true);
  }, []);

  function handleClear() {
    clearAllProgress();
    setMistakes([]);
    setWeakTerms([]);
    setScoreMap({});
    setExpanded(null);
  }

  if (!loaded) return null;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Mistake Review</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Scenarios where you picked wrong tools or missed the right ones. Tap a card to see why.
        </p>
      </div>

      {mistakes.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-600 dark:bg-slate-800">
          <div className="mb-3 text-4xl">🎉</div>
          <h2 className="mb-1 text-lg font-semibold text-slate-700 dark:text-slate-300">
            No mistakes to review
          </h2>
          <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">
            Either you haven&apos;t played yet, or you nailed every scenario.
          </p>
          <Link
            href="/scenario-game"
            className="inline-block rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
          >
            Play the Scenario Game →
          </Link>
        </div>
      ) : (
        <>
          {/* Weak terms */}
          {weakTerms.length > 0 && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-800 dark:bg-amber-950">
              <p className="mb-3 text-sm font-semibold text-amber-800 dark:text-amber-300">
                Concepts to study — appeared in your mistakes most often
              </p>
              <div className="flex flex-wrap gap-2">
                {weakTerms.map(([term, count]) => (
                  <span
                    key={term}
                    className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800 dark:bg-amber-900 dark:text-amber-300"
                  >
                    {term} ×{count}
                  </span>
                ))}
              </div>
              <Link
                href="/glossary"
                className="mt-3 inline-block text-xs font-medium text-amber-700 underline dark:text-amber-400"
              >
                Review these in the Glossary →
              </Link>
            </div>
          )}

          {/* Mistake list */}
          <div className="space-y-3">
            {mistakes.map((m) => {
              const correctTools = correctToolsFor(m.scenarioId);
              const isOpen = expanded === m.scenarioId;
              const score = scoreMap[m.scenarioId];

              return (
                <div
                  key={m.scenarioId}
                  className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800"
                >
                  {/* Card header */}
                  <button
                    onClick={() => setExpanded(isOpen ? null : m.scenarioId)}
                    className="flex w-full items-center justify-between px-5 py-4 text-left"
                  >
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">
                        {m.scenarioTitle}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                        {new Date(m.timestamp).toLocaleDateString()} ·{" "}
                        {score !== undefined && (
                          <span className={`font-semibold ${scoreColor(score)}`}>
                            {score}% score ·{" "}
                          </span>
                        )}
                        {m.incorrectPicks.length > 0 && (
                          <span className="text-red-500">{m.incorrectPicks.length} wrong</span>
                        )}
                        {m.incorrectPicks.length > 0 && m.missedTools.length > 0 && " · "}
                        {m.missedTools.length > 0 && (
                          <span className="text-amber-500">{m.missedTools.length} missed</span>
                        )}
                      </p>
                    </div>
                    <span className="ml-4 shrink-0 text-slate-400 dark:text-slate-500">
                      {isOpen ? "▲" : "▼"}
                    </span>
                  </button>

                  {/* Expanded detail */}
                  {isOpen && (
                    <div className="border-t border-slate-100 px-5 pb-5 pt-4 dark:border-slate-700 space-y-4">

                      {/* Correct tools */}
                      {correctTools.length > 0 && (
                        <div>
                          <p className="mb-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                            Correct answer
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {correctTools.map((t) => (
                              <span
                                key={t}
                                className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                              >
                                {toolDisplayName(m.scenarioId, t)}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Wrong picks with explanations */}
                      {m.incorrectPicks.length > 0 && (
                        <div>
                          <p className="mb-2 text-xs font-semibold text-red-600 dark:text-red-400">
                            Wrong picks — why they were wrong
                          </p>
                          <ul className="space-y-2">
                            {m.incorrectPicks.map((t) => {
                              const explanation = toolExplanation(m.scenarioId, t);
                              return (
                                <li
                                  key={t}
                                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 dark:border-red-900 dark:bg-red-950"
                                >
                                  <p className="text-xs font-semibold text-red-800 dark:text-red-300">
                                    {toolDisplayName(m.scenarioId, t)}
                                  </p>
                                  {explanation && (
                                    <p className="mt-1 text-xs leading-relaxed text-red-700 dark:text-red-400">
                                      {explanation}
                                    </p>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}

                      {/* Missed tools with explanations */}
                      {m.missedTools.length > 0 && (
                        <div>
                          <p className="mb-2 text-xs font-semibold text-amber-600 dark:text-amber-400">
                            Missed tools — why they were needed
                          </p>
                          <ul className="space-y-2">
                            {m.missedTools.map((t) => {
                              const explanation = toolExplanation(m.scenarioId, t);
                              return (
                                <li
                                  key={t}
                                  className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 dark:border-amber-800 dark:bg-amber-950"
                                >
                                  <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                                    {toolDisplayName(m.scenarioId, t)}
                                  </p>
                                  {explanation && (
                                    <p className="mt-1 text-xs leading-relaxed text-amber-700 dark:text-amber-400">
                                      {explanation}
                                    </p>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/scenario-game"
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
            >
              Replay scenarios →
            </Link>
            <button
              onClick={handleClear}
              className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-700"
            >
              Clear all progress
            </button>
          </div>
        </>
      )}
    </div>
  );
}
