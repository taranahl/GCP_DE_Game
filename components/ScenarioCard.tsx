"use client";

import { useState } from "react";
import type { Scenario } from "@/types/scenarios";
import QuizResult from "./QuizResult";
import ArchitectureReplay from "./ArchitectureReplay";
import RealJobAnswer from "./RealJobAnswer";

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  intermediate: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  advanced: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
};

interface ScenarioCardProps {
  scenario: Scenario;
  onComplete: (result: {
    scenarioId: string;
    scenarioTitle: string;
    userTools: string[];
    correctTools: string[];
    correctPicks: string[];
    incorrectPicks: string[];
    missedTools: string[];
    score: number;
    timestamp: number;
    relatedTerms: string[];
  }) => void;
  onNext: () => void;
  isLast: boolean;
}

type Phase = "question" | "result" | "replay";

export default function ScenarioCard({
  scenario,
  onComplete,
  onNext,
  isLast,
}: ScenarioCardProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [phase, setPhase] = useState<Phase>("question");
  const [result, setResult] = useState<{
    correctPicks: string[];
    incorrectPicks: string[];
    missedTools: string[];
    score: number;
  } | null>(null);

  function toggleTool(toolId: string) {
    if (phase !== "question") return;
    setSelected((prev) =>
      prev.includes(toolId) ? prev.filter((t) => t !== toolId) : [...prev, toolId]
    );
  }

  function handleSubmit() {
    const correctPicks = selected.filter((t) => scenario.correctTools.includes(t));
    const incorrectPicks = selected.filter((t) => !scenario.correctTools.includes(t));
    const missedTools = scenario.correctTools.filter((t) => !selected.includes(t));

    const rawScore =
      scenario.correctTools.length > 0
        ? (correctPicks.length / scenario.correctTools.length) * 100 -
          incorrectPicks.length * 10
        : 0;
    const score = Math.max(0, Math.round(rawScore));

    const r = { correctPicks, incorrectPicks, missedTools, score };
    setResult(r);
    setPhase("result");

    onComplete({
      scenarioId: scenario.id,
      scenarioTitle: scenario.title,
      userTools: selected,
      correctTools: scenario.correctTools,
      correctPicks,
      incorrectPicks,
      missedTools,
      score,
      timestamp: Date.now(),
      relatedTerms: scenario.relatedTerms,
    });
  }

  const toolName = (toolId: string) => {
    const ex = scenario.toolExplanations.find((e) => e.toolId === toolId);
    return ex?.toolName ?? toolId;
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${DIFFICULTY_COLORS[scenario.difficulty]}`}
        >
          {scenario.difficulty}
        </span>
        <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium capitalize text-gray-600 dark:bg-gray-700 dark:text-gray-300">
          {scenario.category}
        </span>
      </div>

      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{scenario.title}</h2>

      {/* Business problem */}
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
          The scenario
        </p>
        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          {scenario.businessProblem}
        </p>
      </div>

      {/* What it is really asking — shown after submission */}
      {phase !== "question" && (
        <div className="rounded-lg border border-purple-200 bg-purple-50 px-4 py-3 dark:border-purple-800 dark:bg-purple-950">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-purple-600 dark:text-purple-400">
            What this is really asking
          </p>
          <p className="text-sm leading-relaxed text-purple-900 dark:text-purple-200">
            {scenario.whatTheProblemIsReallyAsking}
          </p>
        </div>
      )}

      {/* Tool selection phase */}
      {phase === "question" && (
        <>
          <div>
            <p className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Select the tools you would use for this architecture:
            </p>
            <div className="flex flex-wrap gap-2">
              {scenario.availableTools.map((toolId) => {
                const isSelected = selected.includes(toolId);
                return (
                  <button
                    key={toolId}
                    onClick={() => toggleTool(toolId)}
                    className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                      isSelected
                        ? "border-blue-500 bg-blue-500 text-white dark:border-blue-400 dark:bg-blue-600"
                        : "border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:bg-blue-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:bg-gray-700"
                    }`}
                  >
                    {toolName(toolId)}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={selected.length === 0}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-blue-700 dark:hover:bg-blue-600"
          >
            Submit answer
          </button>
        </>
      )}

      {/* Result phase */}
      {phase === "result" && result && (
        <QuizResult
          score={result.score}
          correctPicks={result.correctPicks}
          incorrectPicks={result.incorrectPicks}
          missedTools={result.missedTools}
          toolExplanations={scenario.toolExplanations}
          onReview={() => setPhase("replay")}
          onNext={onNext}
          isLast={isLast}
        />
      )}

      {/* Architecture replay phase */}
      {phase === "replay" && (
        <>
          <ArchitectureReplay
            steps={scenario.architectureSteps}
            correctArchitecture={scenario.correctArchitecture}
            simpleVersion={scenario.simpleVersion}
            productionVersion={scenario.productionVersion}
          />
          <RealJobAnswer answer={scenario.realJobAnswer} />
          <div className="pt-2">
            <button
              onClick={onNext}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
            >
              {isLast ? "See all results" : "Next scenario →"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
