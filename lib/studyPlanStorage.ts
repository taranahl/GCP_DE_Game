const STUDY_PROGRESS_KEY = "gcp-study-hub:study-plan-progress";

function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeSet(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Fail silently
  }
}

export function getStudyProgress(): Record<string, boolean> {
  return safeGet<Record<string, boolean>>(STUDY_PROGRESS_KEY, {});
}

export function setTaskComplete(taskId: string, complete: boolean): void {
  const current = getStudyProgress();
  current[taskId] = complete;
  safeSet(STUDY_PROGRESS_KEY, current);
}

export function clearStudyProgress(): void {
  safeSet(STUDY_PROGRESS_KEY, {});
}

export function getDayProgress(dayTasks: string[]): number {
  const progress = getStudyProgress();
  const done = dayTasks.filter((id) => progress[id]).length;
  return dayTasks.length > 0 ? Math.round((done / dayTasks.length) * 100) : 0;
}
