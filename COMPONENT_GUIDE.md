# COMPONENT_GUIDE.md — Planned Components

## Overview

This document defines all planned React components for the GCP Data Engineering Study app. Components are organized by phase. Do not implement a component before its phase unless explicitly requested.

---

## Phase 1 Components (App Shell)

### `Nav`
**File:** `components/Nav.tsx`
**Purpose:** Top navigation bar with links to all pages.
**Props:** None (uses Next.js `usePathname` to highlight active link)
**Notes:**
- Desktop: horizontal nav bar
- Mobile: hamburger menu with drawer
- Phase 1: static links only, no active state logic needed yet

### `PageShell`
**File:** `components/PageShell.tsx`
**Purpose:** Wrapper that provides consistent page padding and max-width.
**Props:** `{ children: React.ReactNode, title: string, description?: string }`
**Notes:** Used on every page to ensure consistent layout.

---

## Phase 2 Components (Tool Map)

### `ToolCard`
**File:** `components/ToolCard.tsx`
**Purpose:** Displays information about one GCP tool.
**Props:**
```typescript
{
  id: string;
  name: string;
  category: string;
  tagline: string;           // one-sentence description
  whenToUse: string[];
  whenNotToUse: string[];
  jobLogic: string;          // the memorable quote from GCP.pdf
  relatedTools?: string[];
  consoleLocation?: string;
}
```
**Notes:**
- Expandable — collapsed shows name + tagline + category badge
- Expanded shows full content
- Visual: category color-coded badge

### `CategoryFilter`
**File:** `components/CategoryFilter.tsx`
**Purpose:** Filter buttons for the Tool Map (Storage, Ingestion, Processing, etc.)
**Props:** `{ categories: string[], selected: string, onChange: (cat: string) => void }`

### `ConfusionCard`
**File:** `components/ConfusionCard.tsx`
**Purpose:** Side-by-side comparison of two commonly confused GCP tools.
**Props:**
```typescript
{
  toolA: { name: string; whenToUse: string; characteristics: string[] };
  toolB: { name: string; whenToUse: string; characteristics: string[] };
  keyDistinction: string;
}
```
**Notes:**
- Two-column layout on desktop
- Stack vertically on mobile
- Clear visual separator between tools

---

## Phase 3 Components (Glossary)

### `TermLink`
**File:** `components/TermLink.tsx`
**Purpose:** Inline clickable text that opens a TermPopover on click.
**Props:** `{ termId: string; children: React.ReactNode }`
**Notes:**
- Styled with a subtle underline or highlight
- Should not look like a page navigation link
- On click: opens popover (desktop) or bottom sheet (mobile)

### `TermPopover`
**File:** `components/TermPopover.tsx`
**Purpose:** Floating popover that shows a quick definition of a glossary term.
**Props:** `{ termId: string; anchorEl: HTMLElement | null; onClose: () => void }`
**Notes:**
- Desktop: floating near the anchor element
- Mobile: renders as bottom sheet instead
- Shows: term, aliases, general definition, GCP definition, memory shortcut
- Footer link: "See in Glossary →"
- Closes on Escape or outside click

### `TermBottomSheet`
**File:** `components/TermBottomSheet.tsx`
**Purpose:** Mobile-specific bottom sheet for term definitions.
**Props:** `{ termId: string; isOpen: boolean; onClose: () => void }`
**Notes:**
- Used by TermPopover on mobile viewport
- Slides up from bottom
- Drag handle at top
- Closes on drag down or tap outside

### `GlossaryEntry`
**File:** `components/GlossaryEntry.tsx`
**Purpose:** Full glossary entry shown on the Glossary page.
**Props:** `{ term: GlossaryTerm }`
**Notes:**
- Shows all fields from the GlossaryTerm schema
- When to use / when not to use as bullet lists
- Related terms as clickable chips

---

## Phase 4 Components (Scenario Game)

### `ScenarioCard`
**File:** `components/ScenarioCard.tsx`
**Purpose:** Displays one scenario with context and answer choices.
**Props:**
```typescript
{
  scenario: Scenario;
  onAnswer: (optionId: string) => void;
  selectedAnswer?: string;
  isSubmitted: boolean;
}
```
**Notes:**
- Context paragraph at top
- Answer options as large clickable buttons
- After submission: highlight correct/incorrect, show explanations
- Hint button (optional)

### `ScenarioGame`
**File:** `components/ScenarioGame.tsx`
**Purpose:** Container component that manages scenario game state.
**Props:** `{ scenarios: Scenario[]; difficulty?: string }`
**Notes:**
- Tracks current question, score, answers
- Shows progress bar
- Shows QuizResult at the end

### `QuizResult`
**File:** `components/QuizResult.tsx`
**Purpose:** End-of-game summary screen.
**Props:** `{ score: number; total: number; missed: Scenario[] }`
**Notes:**
- Shows score prominently
- Lists scenarios answered wrong with the correct answer
- Button to retry or go to Mistake Review

---

## Phase 5 Components (Study Guide)

### `StudySection`
**File:** `components/StudySection.tsx`
**Purpose:** One section of the study guide (e.g., "Thursday — Ingestion and Processing").
**Props:** `{ day: string; focus: string[]; outcome: string; miniBuilds: string[] }`
**Notes:**
- Collapsible on mobile
- Checklist for mini-builds (checkable via localStorage in Phase 5+)

### `ProgressTracker`
**File:** `components/ProgressTracker.tsx`
**Purpose:** Shows overall study progress across all sections.
**Props:** `{ completedSections: string[] }`
**Notes:**
- Visual progress bar
- List of completed vs pending sections
- Pulls from localStorage
- Phase 1: placeholder only

---

## Phase 6 Components (Pipeline Builder)

### `PipelineBuilder`
**File:** `components/PipelineBuilder.tsx`
**Purpose:** Visual representation of a pre-built GCP data pipeline.
**Props:**
```typescript
{
  pipeline: {
    name: string;
    steps: PipelineStep[];
    useCase: string;
  }
}
```
**Notes:**
- Phase 6: shows pre-built pipelines as visual architecture diagrams
- Later phases: interactive drag-and-drop (explicitly requested before building)
- Steps shown left-to-right: Source → Ingestion → Storage → Processing → Serving

### `ArchitectureReplay`
**File:** `components/ArchitectureReplay.tsx`
**Purpose:** Step-by-step walkthrough of a pipeline architecture (like a slideshow).
**Props:** `{ steps: ArchitectureStep[] }`
**Notes:**
- Each step highlights one part of the pipeline
- User clicks "Next" to advance
- Good for teaching end-to-end flows

---

## Phase 7 Components (Decision Tree)

### `DecisionTree`
**File:** `components/DecisionTree.tsx`
**Purpose:** Interactive tool selection flow — answer questions, arrive at a recommendation.
**Props:** `{ tree: DecisionNode }`
**Notes:**
- Branching question flow
- Each node: question + 2-3 answer options
- Leaf nodes: tool recommendation + explanation
- "Start over" button

---

## Phase 8 Components (Common Confusions)

_(Already listed above: ConfusionCard)_

---

## Phase 9 Components (Console Map)

### `ConsoleMapCard`
**File:** `components/ConsoleMapCard.tsx`
**Purpose:** Shows where to find a GCP tool in the console and what you see there.
**Props:**
```typescript
{
  toolName: string;
  navigationPath: string;     // "GCP Console → BigQuery → SQL Workspace"
  whatYouSee: string;         // Description of the console UI
  keyActions: string[];       // Main things you do from this console page
}
```

---

## Future Components (Not Yet Planned in Detail)

### `RealJobAnswer`
**Purpose:** Shows how you'd explain a GCP topic in a job interview context.
**Phase:** TBD

### `MistakeReview`
**Purpose:** Aggregates all scenarios the user got wrong, for spaced repetition.
**Phase:** TBD — requires localStorage integration.

### `SearchBar`
**Purpose:** Global search across tools, glossary, scenarios.
**Phase:** 10+

---

## Component Naming Conventions

- PascalCase for all component files and function names
- Props interfaces named `[ComponentName]Props`
- Data interfaces named after the concept (e.g., `GlossaryTerm`, `Scenario`, `ToolData`)
- Avoid abbreviations in names (use `ScenarioCard` not `ScnCard`)
- Co-locate component-specific hooks in the same file unless they're reused elsewhere

---

## What NOT to Build as Components

- Don't abstract layout patterns (padding, max-width) into every component — use `PageShell`
- Don't build a component for every piece of text — use Tailwind classes
- Don't create utility components (like `Box`, `Stack`, `Row`) — use Tailwind flexbox classes directly
- Don't build a design system — this is a study tool, not a component library
