# UX_GUARDRAILS.md — User Experience Rules

## Core UX Philosophy

This is a learning tool, not a product demo. Every UI decision should optimize for:
1. **Clarity** — can the user understand immediately what this section is for?
2. **Speed of learning** — does this UI help them absorb information faster?
3. **Reduced cognitive load** — does this UI require unnecessary mental effort?

When in doubt, simpler is better.

---

## Term Popups (TermLink + TermPopover)

### Purpose
Clickable technical terms allow users to get a definition without leaving the page or losing their reading context. Think of it like the Mac dictionary popup — appear, read, dismiss, continue.

### Desktop Behavior
- Clicking a TermLink opens a popover near the clicked word
- Popover appears to the right or below the term (whichever fits the viewport)
- Popover closes when clicking anywhere outside it or pressing Escape
- Popover stays open if the user moves their mouse into it
- Maximum width: 360px
- Should not overflow the viewport

### Mobile Behavior
- Tapping a TermLink opens a bottom sheet (slides up from bottom of screen)
- Bottom sheet covers 50-65% of screen height
- Has a drag handle at the top
- Closes by tapping outside, tapping X, or dragging down
- Does not open a full-page navigation — stays on the same page

### Popover Content
Each popover shows:
1. Term name (large, bold)
2. Aliases if applicable (small, muted)
3. General definition (plain English, 1-2 sentences)
4. GCP definition (1-2 sentences)
5. Memory shortcut (callout box)
6. "See in Glossary →" link

Do NOT show the full glossary entry in the popover — it should be a preview that encourages going to the full Glossary page.

### Visual Style
- White background, slight shadow (like Mac dictionary popup)
- Rounded corners
- Subtle border
- Not animated heavily — a simple fade-in is enough
- Dark mode: dark background with light text

---

## Navigation

### Structure
- Top navigation bar for desktop (not sidebar — keeps reading area wide)
- Hamburger menu on mobile (collapse nav into a drawer)
- Active page is visually highlighted in nav
- Nav items: use short labels (Tool Map, Study Guide, Glossary, etc.)

### Nav Links
1. Tool Map
2. Study Guide
3. Glossary
4. Confusions
5. Scenario Game
6. Pipeline Builder
7. Decision Tree
8. ADK & Agents
9. Console Map
10. Mistake Review
11. Five-Day Plan

### Nav Behavior
- Do not use heavy animations on nav transitions
- Page transitions should be instant or very fast (< 150ms)
- Do not use horizontal carousels or tab bars that require horizontal scrolling

---

## Layout

### Desktop
- Max content width: 1200px, centered
- Content area takes full width below nav
- Comfortable padding: 24px horizontal minimum
- Cards in grids: 2-3 columns on desktop

### Tablet (768px–1024px)
- Cards in 2 columns
- Nav stays visible

### Mobile (< 768px)
- Cards in single column
- Nav collapses to hamburger
- Term popups become bottom sheets
- Touch targets minimum 44x44px

---

## Cards

### ToolCard
- Shows one GCP tool
- Should be readable in 15-20 seconds
- Include: name, one-sentence description, when to use (bullets), job logic quote
- Not a wall of text — use whitespace generously

### ConfusionCard
- Side-by-side comparison of two tools
- Left panel: Tool A, Right panel: Tool B
- Bottom row: "Pick Tool A when..." vs "Pick Tool B when..."
- Clear visual separation between the two sides

### ScenarioCard
- Shows the business context clearly
- Options are visually distinct buttons, not radio buttons
- After answer: highlight correct in green, incorrect in red
- Explanation appears below, clearly connected to the chosen answer

---

## Dark Mode

- Dark mode is planned but not required in Phase 1
- Use Tailwind's `dark:` prefix throughout for future-readiness
- Default: light mode
- Toggle: add a sun/moon icon to the nav when implemented
- Do not use pure black (#000000) backgrounds — use slate-900 or similar

---

## Animations

- No page-level animations (no full-page fades or slides between routes)
- Micro-interactions are acceptable: hover states, button presses, popover fade-in
- No animations that take longer than 200ms for UI interactions
- No looping animations that distract from reading
- No animated backgrounds or particle effects

---

## Search

- Search is planned but not in Phase 1
- When added: search bar appears in nav or as a keyboard shortcut (Cmd+K)
- Search should cover: tool names, glossary terms, scenario tags
- Search results should show context (which section they're from)

---

## Accessibility

- All interactive elements must be keyboard accessible (Tab + Enter/Space)
- TermPopovers must be closeable with Escape key
- Focus trap inside bottom sheet modals on mobile
- Color contrast must meet WCAG AA minimum
- Do not rely on color alone to convey information (e.g., correct/incorrect — use icon + color)
- All images must have alt text

---

## What to Avoid

- **Excessive tooltips** — don't add tooltips on everything, only on genuinely technical terms
- **Too many modals** — popups should be rare and purposeful
- **Information overload** — each page/card should have one clear purpose
- **Fake progress bars** — do not add progress indicators that don't represent real progress
- **Gamification gimmicks** — badges, streaks, etc. are not the priority; learning is
- **Auto-playing audio/video** — not appropriate for a study tool
- **Horizontal scrolling on mobile** — never
- **Small tap targets** — minimum 44x44px on mobile

---

## Typography

- Heading: `text-2xl font-bold` or `text-3xl font-bold`
- Body text: `text-base` (16px) for readability
- Code/tool names: `font-mono` or styled differently from body text
- Job logic quotes: slightly styled — italic or in a callout box
- Muted text: `text-gray-500` (not too light — respect contrast)

---

## Color Usage

- Use Tailwind's default color palette
- Primary accent: blue (GCP-adjacent)
- Success/correct: green
- Error/incorrect: red
- Warning/confusion: amber/yellow
- Neutral: gray for backgrounds, dividers
- Avoid custom colors unless there is a strong reason

---

## Performance

- No heavy third-party libraries for animations (no Framer Motion unless explicitly requested)
- No video backgrounds or large images
- Static pages load fast — this is a study tool used under time pressure
- Lighthouse score goal: above 90 on all metrics
