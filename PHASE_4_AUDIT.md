# PHASE 4 AUDIT — Scenario Game + Mistake Review

**Date:** 2026-06-24
**Phase audited:** Phase 4 (complete) — before starting Phase 5
**Build:** PASS — all 14 routes static ○
**Lint:** PASS — zero errors

---

## Audit Plan

**Documents read:**
- CLAUDE.md
- PROJECT_PLAN.md
- SCENARIO_GAME_GUIDE.md
- UX_GUARDRAILS.md
- TESTING_CHECKLIST.md
- PHASE_4_SUMMARY.md

**Files inspected:**
- `types/scenarios.ts`
- `data/scenarios.ts`
- `lib/scenarioStorage.ts`
- `components/RealJobAnswer.tsx`
- `components/ArchitectureReplay.tsx`
- `components/QuizResult.tsx`
- `components/ScenarioCard.tsx`
- `components/ScenarioGame.tsx`
- `app/scenario-game/page.tsx`
- `app/mistake-review/page.tsx`
- `app/page.tsx` (home page — FIX-2 from Phase 3 audit still outstanding)

**Scripts run:**
- `npm run build` — PASS
- `node node_modules/.bin/eslint app/ components/ contexts/ lib/ types/ data/` — PASS
- `npm run typecheck` — does not exist (TypeScript checked during build — passes)
- `npm test` — does not exist (no test runner configured, expected)
- Custom Node.js scripts: scenario ID check, field presence, correctTools-in-availableTools verification, scoring bounds analysis

---

## Phase 4 Audit Checklist

### 1. Scenario Data

| Check | Status | Notes |
|---|---|---|
| `data/scenarios.ts` exists | ✅ Passed | |
| All 7 scenarios present | ✅ Passed | IDs verified: ecommerce-orders-warehouse, restaurant-analytics-pipeline, realtime-clickstream, cdc-postgresql-to-bigquery, governance-pii-detection, saas-marketing-pipeline, file-migration-data-lake |
| All 15 required fields on every scenario | ✅ Passed | Verified: id, title, difficulty, category, businessProblem, whatTheProblemIsReallyAsking, availableTools, correctTools, correctArchitecture, architectureSteps, toolExplanations, simpleVersion, productionVersion, realJobAnswer, relatedTerms |
| No missing IDs | ✅ Passed | |
| No duplicate IDs | ✅ Passed | Script confirmed 0 duplicates |
| Scenario titles are clear | ✅ Passed | Titles match their content |
| correctTools are subset of availableTools | ✅ Passed | All 7 scenarios verified — every correct tool appears in the available tools list |
| Wrong-tool explanations are useful | ✅ Passed | Each wrong tool explanation states the specific reason it is wrong for this scenario |
| Real job answers are practical | ✅ Passed | Each answer is phrased as a spoken interview response |
| Related terms are relevant | ✅ Passed | Related terms match the tools and concepts in each scenario |
| Difficulty distribution reasonable | ✅ Passed | 3 beginner, 3 intermediate, 1 advanced |
| toolExplanation entries cover all available tools | ✅ Passed | 71 total across 7 scenarios (~10.1 per scenario); all available tool IDs have an explanation |
| architectureStep entries present | ✅ Passed | 29 total across 7 scenarios (~4 per scenario — realistic step counts per scenario complexity) |

---

### 2. Scenario Game UI

| Check | Status | Notes |
|---|---|---|
| Scenario Game page loads | ✅ Passed | `app/scenario-game/page.tsx` uses "use client", renders ScenarioGame |
| User can move between scenarios | ✅ Passed | handleNext advances currentIndex; "Next scenario →" button calls onNext |
| Business problem displays | ✅ Passed | businessProblem shown under "The scenario" label |
| Available tools display as chips | ✅ Passed | Chip buttons show toolName from toolExplanations lookup |
| User can select and deselect tools | ✅ Passed | toggleTool() toggles selected array; visual feedback applied |
| Submit disabled until at least one tool selected | ✅ Passed | `disabled={selected.length === 0}` |
| Result view displays after submit | ✅ Passed | phase transitions to "result" on handleSubmit |
| User can review architecture | ✅ Passed | "Review architecture" button sets phase to "replay" |
| User can proceed to next scenario | ✅ Passed | "Next scenario →" from both result and replay phases |
| Tools cannot be changed after submit | ✅ Passed | toggleTool() returns early if phase !== "question" |
| "What the problem is really asking" revealed post-submit | ✅ Passed | Purple box shown when phase !== "question" — good pedagogy |
| Progress bar present | ✅ Passed | Shows `currentIndex + 1 / sorted.length` |
| Prior result shown if scenario repeated | ✅ Passed | "You scored X% last time" banner shown |
| Scenarios sorted beginner → advanced | ✅ Passed | DIFFICULTY_ORDER sort applied at module level |
| key={scenario.id} on ScenarioCard | ✅ Passed | Forces full React reset between scenarios — critical for state isolation |
| Final results screen shows avg score | ✅ Passed | avg calculated from all results |
| Final results screen shows per-scenario scores | ✅ Passed | Listed with color-coded percentages |
| Final results screen links to Mistake Review | ✅ Passed | Link to /mistake-review present |
| Restart button resets game | ✅ Passed | restart() resets currentIndex, results, done |
| Empty/error states do not crash | ✅ Passed | Score calculated safely; empty selected array blocked at submit |

---

### 3. Scoring Logic

| Check | Status | Notes |
|---|---|---|
| Correct tools increase score | ✅ Passed | correctPicks.length / correctTools.length * 100 |
| Missing required tools reduce score | ✅ Passed | missedTools = correctTools not in selected; shown to user but not explicitly penalised — see note below |
| Extra/wrong tools are penalised | ✅ Passed | incorrectPicks.length * 10 subtracted |
| Score cannot go below 0 | ✅ Passed | Math.max(0, ...) applied |
| Score cannot exceed 100 | ✅ Passed | Max achievable: (correctTools/correctTools) * 100 - 0 = 100 |
| Score is rounded to nearest integer | ✅ Passed | Math.round() applied |
| Score is understandable (percentage) | ✅ Passed | Displayed as "X%" |
| Result clearly shows correct picks | ✅ Passed | Green section with tool name + explanation |
| Result clearly shows wrong picks | ✅ Passed | Red section with tool name + explanation |
| Result clearly shows missed tools | ✅ Passed | Amber section with tool name + explanation |
| Score cannot be inconsistent across runs | ✅ Passed | Deterministic formula |

**Note on missed tools:** Missing a required tool is already reflected in a lower score (fewer correctPicks). Missed tools are displayed to the user as an amber "You missed these" section. They are not double-penalised. This is the correct behaviour.

---

### 4. Result Explanations

| Check | Status | Notes |
|---|---|---|
| Correct architecture displays | ✅ Passed | Blue banner in ArchitectureReplay shows correctArchitecture string |
| Explanation by tool displays | ✅ Passed | Each tool in correct/wrong/missed sections shows its explanation |
| Why wrong tools are wrong displays | ✅ Passed | QuizResult shows incorrect picks with specific explanations |
| Simple version displays | ✅ Passed | ArchitectureReplay Simple/Production toggle — default is Simple |
| Production version displays | ✅ Passed | Toggle to Production version available |
| Real job answer displays | ✅ Passed | RealJobAnswer component shown in replay phase |
| Related terms displayed | ⏭️ Not applicable | relatedTerms field exists in data and localStorage but not rendered as links in current game UI — acceptable for Phase 4 MVP |
| Explanations are beginner-friendly | ✅ Passed | All wrong-tool explanations state the reason in plain language without assuming prior knowledge |
| Not trivia-based | ✅ Passed | Every scenario is a realistic business situation, not a quiz about which service uses which protocol |

---

### 5. Architecture Replay

| Check | Status | Notes |
|---|---|---|
| Architecture steps render in order | ✅ Passed | Steps mapped by array index with numbered circles |
| Each step shows tool/stage | ✅ Passed | Tool name in step header |
| Each step explains why used | ✅ Passed | role field shown |
| Each step explains data state | ✅ Passed | dataState field shown |
| Each step explains what could go wrong | ✅ Passed | watchOut shown in amber warning box |
| Steps are expandable (not a wall of text) | ✅ Passed | Accordion expand/collapse per step |
| Simple vs Production toggle | ✅ Passed | Tab toggle between simpleVersion and productionVersion |
| correctArchitecture summary shown | ✅ Passed | Blue banner at top of ArchitectureReplay |

---

### 6. localStorage

| Check | Status | Notes |
|---|---|---|
| Completed scenarios save | ✅ Passed | saveScenarioResult() called from ScenarioGame.handleComplete |
| Scores save | ✅ Passed | score included in ScenarioResult |
| Mistakes save | ✅ Passed | Saved when incorrectPicks.length > 0 or missedTools.length > 0 |
| Weak terms save | ✅ Passed | Saved when score < 70 |
| Refreshing page does not erase results | ✅ Passed | Results loaded via getScenarioResults() in useEffect |
| App does not crash if localStorage is empty | ✅ Passed | safeGet returns typed fallback ([]/{}); loaded state guard prevents render before hydration |
| App does not crash if localStorage has malformed data | ✅ Passed | JSON.parse wrapped in try/catch, returns fallback on error |
| localStorage keys are documented | ✅ Passed | Three keys in PHASE_4_SUMMARY.md and in scenarioStorage.ts constants |
| localStorage writes fail silently | ✅ Passed | safeSet wrapped in try/catch with no rethrow |
| Mistakes NOT cleared when user retries and gets 100% | ⚠️ Needs review | Bug: if a user scores 100% on a retry, the old mistake entry from the previous attempt persists in localStorage. It is not deleted. User must "Clear all progress" to remove it. See FIX-2 below. |

---

### 7. Mistake Review

| Check | Status | Notes |
|---|---|---|
| Mistake Review page loads | ✅ Passed | `app/mistake-review/page.tsx` renders |
| Empty state works when no mistakes | ✅ Passed | Friendly message + link to Scenario Game |
| Saved mistakes display correctly | ✅ Passed | Shows scenario title, wrong picks, missed tools, date |
| User's wrong picks display | ✅ Passed | Red chips per incorrectPick |
| Missed tools display | ✅ Passed | Amber chips per missedTool |
| Correct tools display | ⚠️ Needs review | Correct tools are not shown on the Mistake Review page — only wrong picks and missed tools are visible. User cannot see what the right answer was without going back to the game. |
| Score displays | ⚠️ Needs review | Score is not shown on the Mistake Review card. Only wrong picks and missed tools are visible. |
| Explanation displays | ⚠️ Needs review | Tool explanations are not shown in Mistake Review — only raw tool IDs (as chips) appear. No explanation of why the wrong tool was wrong. |
| Weak terms shown | ✅ Passed | Amber chip panel shows terms with ×count frequency |
| Glossary link for weak terms | ✅ Passed | "Review these in the Glossary →" link present |
| Replay link works | ✅ Passed | "Replay scenarios →" links to /scenario-game |
| Clear all progress works | ✅ Passed | clearAllProgress() resets all three localStorage keys |
| Tool chips show raw IDs | ⚠️ Needs review | Chips show raw IDs (e.g. `bq-data-transfer`) not display names. Cosmetic but confusing for learners. Noted in PHASE_4_SUMMARY.md as a known gap. |

---

### 8. Navigation

| Check | Status | Notes |
|---|---|---|
| Home links to Scenario Game | ✅ Passed | /scenario-game card present |
| Home links to Mistake Review | ✅ Passed | /mistake-review card present |
| Main navigation links work | ✅ Passed | Nav links confirmed |
| No broken routes | ✅ Passed | Build confirms all 14 routes static |
| Mobile navigation still usable | ✅ Passed | Nav component unchanged in Phase 4 |
| Home shows "Soon" on ALL sections | ❌ Failed | Scenario Game and Mistake Review are now fully functional but still show "Soon" badge. Tool Map, Study Guide, Glossary, Confusions also all show "Soon". This has been outstanding since Phase 3 and is now more misleading. |

---

### 9. Build and Code Quality

| Check | Status | Notes |
|---|---|---|
| `npm run build` | ✅ Passed | All 14 routes static |
| `npm run lint` | ✅ Passed | Zero errors or warnings |
| `npm run typecheck` | ⏭️ Not applicable | Script does not exist — TypeScript checked during build, which passes |
| `npm test` | ⏭️ Not applicable | Script does not exist — no test runner configured |
| No TypeScript errors | ✅ Passed | Build passes TypeScript compilation |
| No unused imports causing lint errors | ✅ Passed | ESLint clean |
| No backend/API/auth code | ✅ Passed | No server routes, external APIs, or auth in Phase 4 code |
| All components use "use client" | ✅ Passed | All Phase 4 interactive components have the directive |
| localStorage accessed only in useEffect | ✅ Passed | No SSR-side localStorage calls; useEffect guards all reads |
| loaded guard prevents hydration flash | ✅ Passed | MistakeReviewPage returns null until useEffect fires |
| Components reasonably organized | ✅ Passed | Clear separation: data → lib → components → pages |
| Data files easy to edit | ✅ Passed | data/scenarios.ts is a plain array — extend by adding another object |

---

## Summary

Phase 4 is substantially working. The build is clean, TypeScript passes, localStorage is safe, and the core game loop (select tools → submit → score → architecture replay) is complete. All 7 scenarios have full content with no missing required fields.

**Four areas need attention before Phase 5:**

1. **Home page "Soon" badges** (FIX-1, required) — six sections are live and functional but still show "Soon"
2. **Mistake Review missing explanations and scores** (FIX-2, recommended) — the review page shows which tools were wrong but not why, and shows no score
3. **Mistake entries persist after 100% retry** (FIX-3, minor bug) — old mistakes are never automatically cleared
4. **Mistake chips show raw IDs** (FIX-4, cosmetic) — e.g. `bq-data-transfer` instead of `BigQuery Data Transfer Service`

---

## What Is Working

- Build and TypeScript — clean
- 7 scenarios with complete content (business problem, architecture, tool explanations, simple/production versions, real job answers)
- Multi-select tool selection with visual chip feedback
- Scoring formula: bounded 0–100, correct answer incentivised, wrong picks penalised
- Score display with colour-coded labels (Excellent / Good job / Getting there / Keep studying)
- QuizResult: groups correct, wrong, missed picks with per-tool explanations
- "What this is really asking" revealed post-submit — good pedagogical design
- ArchitectureReplay: accordion steps with role, dataState, watchOut per step
- Simple vs Production version toggle
- RealJobAnswer: interview-phrased answer in green panel
- ScenarioGame: sorted by difficulty, progress bar, final summary screen
- localStorage: fail-silently wrappers, three keys, correct data shapes
- MistakeReview: empty state, weak terms with frequency, Glossary link, clear progress

---

## What Is Broken

**Nothing prevents the app from running.** There are no build errors, crashes, or TypeScript failures.

---

## What Should Be Fixed Before Phase 5

### FIX-1 (Required): Home page shows "Soon" on all sections including completed ones

**Where:** `app/page.tsx`, the `sections` array — all entries have `status: "coming-soon"`

**Problem:** Tool Map, Study Guide, Glossary, Confusions, Scenario Game, and Mistake Review are all fully functional. Showing "Soon" on them is misleading and makes the app look broken. This was flagged in PHASE_3_AUDIT.md and was not fixed.

**Fix:** Update the `sections` array to distinguish live sections (status: "live") from placeholder sections (status: "coming-soon"). Render a different badge for live sections — e.g. a green "Live" chip vs a grey "Soon" chip.

**Sections that should say "Live":** Tool Map, Study Guide, Glossary, Confusions, Scenario Game, Mistake Review, ADK & Agents

**Sections that should still say "Soon":** Pipeline Builder, Decision Tree, Console Map, Five-Day Plan

**Scope:** ~15 lines in `app/page.tsx`.

---

### FIX-2 (Recommended): Mistake Review page does not show score or explanations

**Where:** `app/mistake-review/page.tsx`

**Problem:** The Mistake Review page shows which tools were wrong and which were missed, but does not show:
- The score the user got on that scenario
- Why the wrong tools were wrong (explanation text)
- What the correct tools were

A learner coming back to review their mistakes needs to know what the right answer was and why — otherwise the review page is just a list of red chips with no learning value.

**Fix:** The `MistakeEntry` interface already stores `incorrectPicks` and `missedTools` but not the scenario's full explanation. Two approaches:
  - **Simple approach**: Look up the scenario by `scenarioId` from `data/scenarios.ts` in the MistakeReview page and render the `toolExplanations` for wrong/missed tools inline. This requires no schema change.
  - **Alternative**: Store explanations in the MistakeEntry at write time (adds data to localStorage but makes MistakeReview self-contained).

The simple approach is recommended: import `scenarios` in `mistake-review/page.tsx`, find the scenario by ID, and look up the toolExplanation for each wrong/missed tool.

---

## What Can Wait Until Later

### WAIT-1: Mistakes not cleared on 100% retry

**Problem:** If a user scores 100% on a retry of a scenario they previously got wrong, the mistake entry is not removed from localStorage.

**Current behaviour:** Old mistakes persist until the user clicks "Clear all progress".

**Impact:** Low — users can manually clear progress, and the mistake entry is only cosmetically incorrect. It does not cause crashes or incorrect scores.

**Fix (when ready):** In `saveScenarioResult()`, if `score === 100`, delete the mistake entry for that scenarioId:
```typescript
if (score === 100) {
  const mistakes = getMistakes();
  delete mistakes[result.scenarioId];
  safeSet(MISTAKES_KEY, mistakes);
}
```

---

### WAIT-2: Mistake chips show raw tool IDs

**Where:** `app/mistake-review/page.tsx`, incorrect and missed tool chips

**Problem:** Chips show raw IDs like `bq-data-transfer` instead of display names like `BigQuery Data Transfer Service`.

**Fix:** Import `scenarios` from `data/scenarios.ts`, find the matching scenario, and look up `toolExplanation.toolName` for each chip. Same lookup as FIX-2.

---

### WAIT-3: No difficulty filter on the Scenario Game entry

**What:** TESTING_CHECKLIST.md specifies "Difficulty filter works". Currently all scenarios play in sequence without any filter option.

**Impact:** Low for MVP. The scenarios are sorted beginner → advanced which provides a natural progression.

---

### WAIT-4: No way to skip or replay a specific scenario

**What:** The game is sequential only. There is no "jump to scenario" or "replay just this one" capability.

**Impact:** Low for MVP. Users can restart the whole game and the progress from the previous session is shown as a banner.

---

## Known Issues

| Issue | Severity | Tracked |
|---|---|---|
| Home page "Soon" on live sections | Medium | FIX-1 above |
| Mistake Review missing explanations | Medium | FIX-2 above |
| Old mistakes persist after 100% retry | Low | WAIT-1 above |
| Mistake chips show raw IDs | Low | WAIT-2 above |
| No difficulty filter | Very low | WAIT-3 above |
| No jump-to-scenario | Very low | WAIT-4 above |
| No hint system | Very low | Not in Phase 4 scope |
| MistakeEntry does not store score | Very low | Resolved by simple lookup in FIX-2 |

---

## Documented Deviations from SCENARIO_GAME_GUIDE.md

These are intentional — approved by the Phase 4 prompt:

### DEVIATION-1: Multi-select rather than single-choice

SCENARIO_GAME_GUIDE.md specifies "1 correct answer, 2-3 plausible wrong answers". Phase 4 was implemented with a multi-select chip model where scenarios have multiple correct tools. This teaches architecture thinking (which combination of tools solves the problem?) rather than single-tool trivia.

**Verdict:** Better pedagogically for Phase 4's goals. Accept.

### DEVIATION-2: Scoring formula

SCENARIO_GAME_GUIDE.md specifies: "3 points (first try), 2 points (after hint), 1 point (after wrong attempt)". Phase 4 uses: `max(0, round((correctPicks / correctTools * 100) - (incorrectPicks * 10)))`.

The guide's scoring model assumes single-choice. The percentage formula is more appropriate for multi-select. Accept.

---

## Whether Phase 5 Is Safe to Start

**Yes — after FIX-1 is applied.**

FIX-1 (home page badges) is a tiny 15-line fix that takes 5 minutes and has been outstanding since Phase 3. Phase 5 is safe to start once it is applied.

FIX-2 (Mistake Review explanations) is recommended but not blocking — Mistake Review is functional, just less informative than it could be.

**Recommended order:**
1. Apply FIX-1 (home page live/soon badges) — takes 5 minutes
2. Apply FIX-2 (Mistake Review explanations and scores) — optional but high-value
3. Start Phase 5

---

## Build Results (at time of audit)

```
✓ Compiled successfully
✓ TypeScript passed
✓ ESLint: 0 errors, 0 warnings
✓ All 14 routes static (○)

○ /
○ /_not-found
○ /adk-agents
○ /confusions
○ /console-map
○ /decision-tree
○ /five-day-plan
○ /glossary
○ /mistake-review
○ /pipeline-builder
○ /scenario-game
○ /study-guide
○ /tool-map
```

*Audit completed. No code was modified during this audit.*
