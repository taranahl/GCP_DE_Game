"use client";

import { useState, useEffect } from "react";
import { getScenarioResults } from "@/lib/scenarioStorage";
import { getStudyProgress } from "@/lib/studyPlanStorage";
import studyPlan from "@/data/studyPlan";

const TOTAL_SCENARIOS = 7;

export default function HomeProgress() {
  const [scenariosAttempted, setScenariosAttempted] = useState(0);
  const [avgScore, setAvgScore] = useState<number | null>(null);
  const [tasksCompleted, setTasksCompleted] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const results = getScenarioResults();
    const progress = getStudyProgress();
    const allTaskIds = studyPlan.flatMap((d) => d.tasks.map((t) => t.id));

    setScenariosAttempted(results.length);
    setAvgScore(
      results.length > 0
        ? Math.round(results.reduce((s, r) => s + r.score, 0) / results.length)
        : null
    );
    setTotalTasks(allTaskIds.length);
    setTasksCompleted(allTaskIds.filter((id) => progress[id]).length);
    setLoaded(true);
  }, []);

  if (!loaded) return null;

  const scenarioPct = Math.round((scenariosAttempted / TOTAL_SCENARIOS) * 100);
  const studyPct = totalTasks > 0 ? Math.round((tasksCompleted / totalTasks) * 100) : 0;
  const overallPct = Math.round((scenarioPct + studyPct) / 2);

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Your progress
        </h2>
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {overallPct}% overall
        </span>
      </div>
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-4">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all"
          style={{ width: `${overallPct}%` }}
        />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3">
          <p className="text-xs text-slate-500 dark:text-slate-400">Scenarios attempted</p>
          <p className="mt-0.5 text-xl font-bold text-slate-900 dark:text-slate-100">
            {scenariosAttempted}
            <span className="text-sm font-normal text-slate-400 dark:text-slate-500"> / {TOTAL_SCENARIOS}</span>
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3">
          <p className="text-xs text-slate-500 dark:text-slate-400">Study tasks done</p>
          <p className="mt-0.5 text-xl font-bold text-slate-900 dark:text-slate-100">
            {tasksCompleted}
            <span className="text-sm font-normal text-slate-400 dark:text-slate-500"> / {totalTasks}</span>
          </p>
        </div>
        {avgScore !== null && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3">
            <p className="text-xs text-slate-500 dark:text-slate-400">Avg scenario score</p>
            <p className={`mt-0.5 text-xl font-bold ${avgScore >= 70 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
              {avgScore}%
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
