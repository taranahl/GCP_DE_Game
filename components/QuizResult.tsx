"use client";

import type { ToolExplanation } from "@/types/scenarios";

interface QuizResultProps {
  score: number;
  correctPicks: string[];
  incorrectPicks: string[];
  missedTools: string[];
  toolExplanations: ToolExplanation[];
  onReview: () => void;
  onNext: () => void;
  isLast: boolean;
}

function scoreLabel(score: number): { label: string; color: string } {
  if (score >= 90) return { label: "Excellent!", color: "text-emerald-600 dark:text-emerald-400" };
  if (score >= 70) return { label: "Good job", color: "text-blue-600 dark:text-blue-400" };
  if (score >= 50) return { label: "Getting there", color: "text-amber-600 dark:text-amber-400" };
  return { label: "Keep studying", color: "text-red-600 dark:text-red-400" };
}

export default function QuizResult({
  score,
  correctPicks,
  incorrectPicks,
  missedTools,
  toolExplanations,
  onReview,
  onNext,
  isLast,
}: QuizResultProps) {
  const { label, color } = scoreLabel(score);

  const explanationMap = Object.fromEntries(
    toolExplanations.map((e) => [e.toolId, e])
  );

  return (
    <div className="space-y-5">
      {/* Score header */}
      <div className="flex flex-col items-center gap-1 py-4 text-center">
        <span className={`text-4xl font-bold tabular-nums ${color}`}>{score}%</span>
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</span>
      </div>

      {/* Correct picks */}
      {correctPicks.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
            ✓ Correct picks ({correctPicks.length})
          </p>
          <ul className="space-y-2">
            {correctPicks.map((toolId) => {
              const ex = explanationMap[toolId];
              return (
                <li
                  key={toolId}
                  className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-800 dark:bg-emerald-950"
                >
                  <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                    {ex?.toolName ?? toolId}
                  </p>
                  {ex && (
                    <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-400">
                      {ex.explanation}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Incorrect picks */}
      {incorrectPicks.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-semibold text-red-700 dark:text-red-400">
            ✗ Wrong picks ({incorrectPicks.length})
          </p>
          <ul className="space-y-2">
            {incorrectPicks.map((toolId) => {
              const ex = explanationMap[toolId];
              return (
                <li
                  key={toolId}
                  className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 dark:border-red-900 dark:bg-red-950"
                >
                  <p className="text-sm font-medium text-red-800 dark:text-red-300">
                    {ex?.toolName ?? toolId}
                  </p>
                  {ex && (
                    <p className="mt-1 text-sm text-red-700 dark:text-red-400">
                      {ex.explanation}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Missed tools */}
      {missedTools.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-semibold text-amber-700 dark:text-amber-400">
            ○ You missed these ({missedTools.length})
          </p>
          <ul className="space-y-2">
            {missedTools.map((toolId) => {
              const ex = explanationMap[toolId];
              return (
                <li
                  key={toolId}
                  className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-800 dark:bg-amber-950"
                >
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                    {ex?.toolName ?? toolId}
                  </p>
                  {ex && (
                    <p className="mt-1 text-sm text-amber-700 dark:text-amber-400">
                      {ex.explanation}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-col gap-3 pt-2 sm:flex-row">
        <button
          onClick={onReview}
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Review architecture
        </button>
        <button
          onClick={onNext}
          className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
        >
          {isLast ? "See all results" : "Next scenario →"}
        </button>
      </div>
    </div>
  );
}
