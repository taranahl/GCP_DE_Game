# Phase 5 Summary — Pipeline Builder + Decision Tree + Console Map + Five-Day Plan

## What Was Built

### New Data Files
| File | Contents |
|------|----------|
| `types/pipeline.ts` | PipelineInput, PipelineStep, PipelineRecommendation types |
| `data/pipelineRules.ts` | Rule-based `buildRecommendation(input)` function — no AI, no backend |
| `data/decisionTree.ts` | 26 DecisionCard entries across all categories |
| `data/consoleMap.ts` | 31 ConsoleMapEntry entries — where to find every tool in GCP Console |
| `data/studyPlan.ts` | 5 StudyDay objects with tasks, concepts, tools, miniProject, selfCheck |
| `lib/studyPlanStorage.ts` | localStorage CRUD for study task completion |

### New Components
| Component | Purpose |
|-----------|---------|
| `components/PipelineBuilder.tsx` | Form → rule engine → architecture recommendation with interview answer |
| `components/DecisionCard.tsx` | Expandable card: need → tool → why → when not to use |
| `components/ConsoleMapCard.tsx` | Expandable card: tool → where it lives → first click → beginner mistake |

### New Pages
| Route | Status |
|-------|--------|
| `/pipeline-builder` | Live — rule-based pipeline recommendation tool |
| `/decision-tree` | Live — 26 tool decisions, filterable by category + search |
| `/console-map` | Live — 31 GCP console locations, filterable |
| `/five-day-plan` | Live — checkboxes, localStorage persistence, per-day progress % |

## Build Output
All 14 routes render as `○ (Static)`. Zero TypeScript errors. Zero ESLint errors.

## What Was NOT Built
- No backend server, no API routes, no database
- No external API calls (pipeline recommendations are pure TypeScript rule logic)
- No Phase 6 features

## Home Page Status (after Phase 5)
- **Live** (green badge): Tool Map, Study Guide, Glossary, Confusions, Scenario Game, Mistake Review, ADK & Agents, Pipeline Builder, Decision Tree, Console Map, Five-Day Plan — **11 of 11 sections**
- **Coming Soon**: none

## Known Minor Issues (carried from Phase 4)
- WAIT-1: Old mistakes not cleared on 100% retry (one-line fix, low priority)
- WAIT-2: Mistake chips show raw tool IDs instead of display names

## Next Steps (Phase 6 — do not start until user approves)
- TBD
