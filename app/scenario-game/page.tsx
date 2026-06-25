"use client";

import ScenarioGame from "@/components/ScenarioGame";

export default function ScenarioGamePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Scenario Game</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Read each scenario, select the tools you would use, and see a detailed explanation of the correct architecture.
        </p>
      </div>
      <ScenarioGame />
    </div>
  );
}
