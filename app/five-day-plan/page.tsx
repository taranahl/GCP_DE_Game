"use client";

import { useState, useEffect } from "react";
import studyPlan from "@/data/studyPlan";
import { getStudyProgress, setTaskComplete } from "@/lib/studyPlanStorage";

const DAY_COLORS: Record<number, { badge: string; header: string }> = {
  1: { badge: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300", header: "border-blue-400 dark:border-blue-600" },
  2: { badge: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300", header: "border-purple-400 dark:border-purple-600" },
  3: { badge: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300", header: "border-amber-400 dark:border-amber-600" },
  4: { badge: "bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300", header: "border-violet-400 dark:border-violet-600" },
  5: { badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300", header: "border-emerald-400 dark:border-emerald-600" },
};

export default function FiveDayPlanPage() {
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setProgress(getStudyProgress());
    setLoaded(true);
  }, []);

  function toggleTask(taskId: string) {
    const next = !progress[taskId];
    setTaskComplete(taskId, next);
    setProgress((prev) => ({ ...prev, [taskId]: next }));
  }

  const allTaskIds = studyPlan.flatMap((d) => d.tasks.map((t) => t.id));
  const completedCount = allTaskIds.filter((id) => progress[id]).length;
  const totalCount = allTaskIds.length;
  const overallPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Five-Day Study Plan</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Day-by-day breakdown for GCP DE interview prep. Check off tasks as you complete them.
        </p>
      </div>

      {/* Overall progress */}
      {loaded && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Overall progress</p>
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {completedCount} / {totalCount} tasks
            </p>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              className="h-full rounded-full bg-blue-500 transition-all"
              style={{ width: `${overallPct}%` }}
            />
          </div>
        </div>
      )}

      {/* Study days */}
      <div className="space-y-6">
        {studyPlan.map((day) => {
          const colors = DAY_COLORS[day.day];
          const dayTaskIds = day.tasks.map((t) => t.id);
          const dayDone = dayTaskIds.filter((id) => progress[id]).length;
          const dayPct = dayTaskIds.length > 0 ? Math.round((dayDone / dayTaskIds.length) * 100) : 0;

          return (
            <div
              key={day.day}
              className={`rounded-2xl border-2 bg-white dark:bg-slate-800 ${colors.header}`}
            >
              {/* Day header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                    Day {day.day}
                  </p>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{day.title}</h2>
                  <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{day.focus}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{dayPct}%</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">{dayDone}/{dayTaskIds.length} done</p>
                </div>
              </div>

              <div className="px-6 py-5 space-y-5">
                {/* Concepts */}
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Key concepts
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {day.concepts.map((c) => (
                      <span key={c} className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${colors.badge}`}>
                        {c.split(" — ")[0]}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tools */}
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Tools to master
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {day.tools.map((t) => (
                      <span key={t} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tasks */}
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Study tasks
                  </p>
                  <ul className="space-y-2">
                    {day.tasks.map((task) => {
                      const done = !!progress[task.id];
                      return (
                        <li key={task.id} className="flex items-start gap-3">
                          <button
                            onClick={() => toggleTask(task.id)}
                            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
                              done
                                ? "border-blue-500 bg-blue-500"
                                : "border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-700"
                            }`}
                          >
                            {done && (
                              <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none">
                                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </button>
                          <span className={`text-sm leading-relaxed ${done ? "line-through text-slate-400 dark:text-slate-600" : "text-slate-700 dark:text-slate-300"}`}>
                            {task.label}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Mini project */}
                <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 dark:border-blue-800 dark:bg-blue-950">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-400">
                    Mini project
                  </p>
                  <p className="text-sm leading-relaxed text-blue-900 dark:text-blue-200">{day.miniProject}</p>
                </div>

                {/* Self-check */}
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Self-check questions
                  </p>
                  <ul className="space-y-1.5">
                    {day.selfCheck.map((q) => (
                      <li key={q} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <span className="mt-0.5 shrink-0 text-slate-400">?</span>
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
