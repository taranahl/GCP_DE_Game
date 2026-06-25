"use client";

import { useState } from "react";
import type { ArchitectureStep } from "@/types/scenarios";

interface ArchitectureReplayProps {
  steps: ArchitectureStep[];
  correctArchitecture: string;
  simpleVersion: string;
  productionVersion: string;
}

export default function ArchitectureReplay({
  steps,
  correctArchitecture,
  simpleVersion,
  productionVersion,
}: ArchitectureReplayProps) {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [showProd, setShowProd] = useState(false);

  return (
    <div className="mt-6 space-y-4">
      <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200">
        Correct Architecture
      </h3>

      {/* Full architecture string */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200">
        {correctArchitecture}
      </div>

      {/* Step-by-step walkthrough */}
      <div className="space-y-2">
        {steps.map((step, i) => (
          <div
            key={i}
            className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
          >
            <button
              onClick={() => setActiveStep(activeStep === i ? null : i)}
              className="flex w-full items-center justify-between px-4 py-3 text-left"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                  {i + 1}
                </span>
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {step.tool}
                </span>
                <span className="hidden text-xs text-gray-500 dark:text-gray-400 sm:inline">
                  — {step.role}
                </span>
              </div>
              <span className="text-gray-400 dark:text-gray-500">
                {activeStep === i ? "▲" : "▼"}
              </span>
            </button>

            {activeStep === i && (
              <div className="border-t border-gray-100 px-4 pb-4 pt-3 dark:border-gray-700">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Role
                </p>
                <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">{step.role}</p>

                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Data state at this step
                </p>
                <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">{step.dataState}</p>

                <div className="flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 dark:bg-amber-950">
                  <span className="mt-0.5 shrink-0 text-amber-500">⚠</span>
                  <p className="text-sm text-amber-800 dark:text-amber-300">{step.watchOut}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Simple vs Production toggle */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setShowProd(false)}
            className={`flex-1 rounded-tl-xl px-4 py-2 text-sm font-medium transition-colors ${
              !showProd
                ? "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            Simple version
          </button>
          <button
            onClick={() => setShowProd(true)}
            className={`flex-1 rounded-tr-xl px-4 py-2 text-sm font-medium transition-colors ${
              showProd
                ? "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            Production version
          </button>
        </div>
        <div className="p-4 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          {showProd ? productionVersion : simpleVersion}
        </div>
      </div>
    </div>
  );
}
