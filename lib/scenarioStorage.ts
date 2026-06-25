import type { ScenarioResult } from "@/types/scenarios";

const RESULTS_KEY = "gcp-study-hub:scenario-results";
const MISTAKES_KEY = "gcp-study-hub:mistakes";
const WEAK_TERMS_KEY = "gcp-study-hub:weak-terms";

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
    // Fail silently — storage may be full or unavailable
  }
}

export function getScenarioResults(): ScenarioResult[] {
  return safeGet<ScenarioResult[]>(RESULTS_KEY, []);
}

export function saveScenarioResult(result: ScenarioResult): void {
  const existing = getScenarioResults();
  const others = existing.filter((r) => r.scenarioId !== result.scenarioId);
  safeSet(RESULTS_KEY, [...others, result]);

  // Record mistakes (incorrectPicks + missedTools)
  const mistakes = getMistakes();
  if (result.score === 100) {
    // Perfect score: clear any prior mistake entry for this scenario
    delete mistakes[result.scenarioId];
    safeSet(MISTAKES_KEY, mistakes);
  } else if (result.incorrectPicks.length > 0 || result.missedTools.length > 0) {
    mistakes[result.scenarioId] = {
      scenarioId: result.scenarioId,
      scenarioTitle: result.scenarioTitle,
      incorrectPicks: result.incorrectPicks,
      missedTools: result.missedTools,
      timestamp: result.timestamp,
    };
    safeSet(MISTAKES_KEY, mistakes);
  }

  // Track weak terms from missed/incorrect scenarios
  if (result.relatedTerms.length > 0 && result.score < 70) {
    const weakTerms = getWeakTerms();
    result.relatedTerms.forEach((t) => {
      weakTerms[t] = (weakTerms[t] ?? 0) + 1;
    });
    safeSet(WEAK_TERMS_KEY, weakTerms);
  }
}

export interface MistakeEntry {
  scenarioId: string;
  scenarioTitle: string;
  incorrectPicks: string[];
  missedTools: string[];
  timestamp: number;
}

export function getMistakes(): Record<string, MistakeEntry> {
  return safeGet<Record<string, MistakeEntry>>(MISTAKES_KEY, {});
}

export function getWeakTerms(): Record<string, number> {
  return safeGet<Record<string, number>>(WEAK_TERMS_KEY, {});
}

export function clearAllProgress(): void {
  safeSet(RESULTS_KEY, []);
  safeSet(MISTAKES_KEY, {});
  safeSet(WEAK_TERMS_KEY, {});
}
