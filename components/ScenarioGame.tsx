"use client";

import { useState, useEffect } from "react";
import scenarios from "@/data/scenarios";
import ScenarioCard from "./ScenarioCard";
import { saveScenarioResult, getScenarioResults } from "@/lib/scenarioStorage";
import type { ScenarioResult } from "@/types/scenarios";
import Link from "next/link";

const DIFFICULTY_ORDER: Record<string, number> = {
  beginner: 0,
  intermediate: 1,
  advanced: 2,
};

const sorted = [...scenarios].sort(
  (a, b) => DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty]
);

export default function ScenarioGame() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<ScenarioResult[]>([]);
  const [done, setDone] = useState(false);
  const [priorResults, setPriorResults] = useState<Record<string, ScenarioResult>>({});

  useEffect(() => {
    const saved = getScenarioResults();
    const map: Record<string, ScenarioResult> = {};
    saved.forEach((r) => { map[r.scenarioId] = r; });
    setPriorResults(map);
  }, []);

  function handleComplete(result: ScenarioResult) {
    saveScenarioResult(result);
    setResults((prev) => {
      const others = prev.filter((r) => r.scenarioId !== result.scenarioId);
      return [...others, result];
    });
  }

  function handleNext() {
    if (currentIndex < sorted.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setDone(true);
    }
  }

  function restart() {
    setCurrentIndex(0);
    setResults([]);
    setDone(false);
  }

  if (done) {
    const total = results.length;
    const avg = total > 0
      ? Math.round(results.reduce((s, r) => s + r.score, 0) / total)
      : 0;
    const perfect = results.filter((r) => r.score >= 90).length;
    const struggling = results.filter((r) => r.score < 50);

    return (
      <div className="mx-auto max-w-2xl space-y-6 px-4 py-10">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">{avg}%</p>
          <p className="mt-1 text-gray-500 dark:text-gray-400">average score across {total} scenarios</p>
          <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
            {perfect} excellent · {total - perfect} need review
          </p>
        </div>

        {/* Per-scenario scores */}
        <div className="space-y-2">
          {sorted.map((s) => {
            const r = results.find((res) => res.scenarioId === s.id);
            if (!r) return null;
            const color =
              r.score >= 90
                ? "text-emerald-600 dark:text-emerald-400"
                : r.score >= 70
                  ? "text-blue-600 dark:text-blue-400"
                  : r.score >= 50
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-red-600 dark:text-red-400";
            return (
              <div
                key={s.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3 dark:border-gray-700"
              >
                <span className="text-sm text-gray-700 dark:text-gray-300">{s.title}</span>
                <span className={`text-sm font-bold ${color}`}>{r.score}%</span>
              </div>
            );
          })}
        </div>

        {struggling.length > 0 && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 dark:border-amber-800 dark:bg-amber-950">
            <p className="mb-1 text-sm font-semibold text-amber-800 dark:text-amber-300">
              Scenarios to revisit:
            </p>
            <ul className="list-inside list-disc space-y-0.5">
              {struggling.map((r) => (
                <li key={r.scenarioId} className="text-sm text-amber-700 dark:text-amber-400">
                  {r.scenarioTitle}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={restart}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Restart
          </button>
          <Link
            href="/mistake-review"
            className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
          >
            Review mistakes →
          </Link>
        </div>
      </div>
    );
  }

  const scenario = sorted[currentIndex];
  const scenarioResult = results.find((r) => r.scenarioId === scenario.id);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="mb-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Scenario {currentIndex + 1} of {sorted.length}</span>
          {scenarioResult && (
            <span>Score: {scenarioResult.score}%</span>
          )}
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className="h-full rounded-full bg-blue-500 transition-all"
            style={{ width: `${((currentIndex + 1) / sorted.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Scenario card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900 sm:p-8">
        <ScenarioCard
          key={scenario.id}
          scenario={scenario}
          onComplete={handleComplete}
          onNext={handleNext}
          isLast={currentIndex === sorted.length - 1}
        />
      </div>

      {/* Prior result banner */}
      {priorResults[scenario.id] && !scenarioResult && (
        <p className="mt-3 text-center text-xs text-gray-400 dark:text-gray-500">
          You scored {priorResults[scenario.id].score}% last time
        </p>
      )}
    </div>
  );
}
