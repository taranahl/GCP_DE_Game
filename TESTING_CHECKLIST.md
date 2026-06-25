# TESTING_CHECKLIST.md — Manual QA Checks

## Overview

This checklist covers manual QA checks for the GCP Data Engineering Study app. Run through the relevant sections whenever a new feature is complete. This is a static learning app, so focus on UI behavior, content rendering, and localStorage.

---

## Navigation

- [ ] All nav links route to the correct page
- [ ] Active nav link is visually highlighted on each page
- [ ] Clicking the logo/title returns to Home Dashboard
- [ ] Back button works correctly in the browser (no broken routing)
- [ ] No broken links (404s)
- [ ] Nav links are fully clickable (not just text — the whole tap target)

### Mobile Navigation
- [ ] Hamburger icon appears on mobile viewport (< 768px)
- [ ] Hamburger menu opens correctly
- [ ] All nav links are accessible in the mobile drawer
- [ ] Mobile drawer closes after selecting a link
- [ ] Drawer closes when tapping outside of it
- [ ] Drawer is fully scrollable if nav items overflow

---

## Mobile Layout

- [ ] No horizontal scrolling on any page at mobile viewport (375px wide)
- [ ] Cards stack to single column on mobile
- [ ] Text is readable — no overflow or truncation without indication
- [ ] Images (if any) do not overflow containers
- [ ] Buttons have sufficient tap targets (minimum 44x44px)
- [ ] Bottom sheets open and close correctly
- [ ] Bottom sheets are scrollable when content overflows

---

## Term Popups (TermLink + TermPopover)

- [ ] Clicking a TermLink opens the popover
- [ ] Popover appears near the clicked term (desktop)
- [ ] Popover does not overflow the viewport
- [ ] Popover closes when clicking outside it
- [ ] Popover closes when pressing Escape
- [ ] Popover content is correct for the clicked term
- [ ] "See in Glossary" link navigates to the correct glossary entry
- [ ] On mobile: bottom sheet opens instead of popover
- [ ] Bottom sheet shows the same content as the desktop popover
- [ ] Bottom sheet closes by dragging down or tapping X
- [ ] Multiple TermLinks on the same page work independently
- [ ] Only one popover is open at a time

---

## Search (Phase 10 — not yet implemented)

- [ ] Search bar appears in expected location
- [ ] Cmd+K opens search modal
- [ ] Results appear as user types (debounced)
- [ ] Results include tool names, glossary terms, scenario tags
- [ ] Clicking a result navigates to the correct page/section
- [ ] Search works with partial matches
- [ ] Empty state shows helpful message (not just blank)
- [ ] Escape closes search modal

---

## Scenario Game

- [ ] Scenarios load correctly
- [ ] Answer options are all visible and clickable
- [ ] Selecting an option provides visual feedback
- [ ] Submitting an answer reveals correct/incorrect state
- [ ] Correct answer highlighted in green with icon
- [ ] Incorrect answers highlighted in red
- [ ] Explanation appears for every answer choice after submission
- [ ] "Next" button appears after submitting
- [ ] Progress bar advances after each question
- [ ] Score counter is accurate throughout
- [ ] End screen shows correct final score
- [ ] End screen lists scenarios answered wrong
- [ ] "Try again" button resets the game
- [ ] Hint button (if present) shows hint without revealing answer
- [ ] Difficulty filter works (shows only beginner/intermediate/advanced scenarios)

---

## Scenario Scoring (localStorage)

- [ ] Score is saved to localStorage after game completion
- [ ] Score persists after page refresh
- [ ] Missed scenarios are saved to localStorage
- [ ] Mistake Review page reads from localStorage correctly
- [ ] "Reset progress" clears localStorage correctly
- [ ] If localStorage is empty (first time), app handles gracefully

---

## localStorage (General)

- [ ] Progress data is correctly read on page load
- [ ] Progress data is correctly written after user actions
- [ ] App works correctly if localStorage is completely empty (first visit)
- [ ] App works correctly if localStorage has partial data
- [ ] App does not throw errors if localStorage is disabled (graceful fallback)
- [ ] Large amounts of localStorage data do not cause slowness

---

## Dark Mode (Phase — when implemented)

- [ ] Dark mode toggle switches theme correctly
- [ ] Dark mode preference is saved in localStorage
- [ ] Dark mode preference persists after page refresh
- [ ] All text is readable in dark mode (no white text on white background, etc.)
- [ ] Cards, popovers, and modals all apply dark mode styles
- [ ] Code snippets remain readable in dark mode
- [ ] Dark mode is applied on initial page load if preference is set

---

## Keyboard Accessibility

- [ ] All interactive elements are reachable via Tab key
- [ ] Tab order is logical (follows reading order)
- [ ] Focused element has a visible focus ring
- [ ] TermPopovers can be opened with Enter key on a TermLink
- [ ] TermPopovers close with Escape key
- [ ] Bottom sheets close with Escape key
- [ ] Scenario game is fully playable with keyboard only
- [ ] Nav drawer opens/closes with keyboard
- [ ] No keyboard traps outside of intentional modals

---

## Content Rendering

- [ ] All Tool Map entries are displayed
- [ ] All Glossary terms are displayed
- [ ] Long text does not overflow card boundaries
- [ ] Bullet lists render correctly (not as raw "-" characters)
- [ ] Bold and italic text renders correctly
- [ ] Code-style terms render in monospace font
- [ ] Job logic quotes are visually distinct from body text
- [ ] Category badges display correct colors
- [ ] Related terms links work correctly

---

## Pipeline Recommendations (Phase 6 — when implemented)

- [ ] Pre-built pipelines load and display correctly
- [ ] Pipeline steps render left-to-right on desktop
- [ ] Pipeline steps render vertically on mobile
- [ ] Each pipeline step is labeled with the correct tool name
- [ ] Pipeline arrows/connectors display correctly
- [ ] Architecture Replay steps advance correctly
- [ ] "Which pipeline fits my scenario?" recommendations are correct

---

## Performance

- [ ] Home Dashboard loads in < 2 seconds on a typical laptop
- [ ] Navigating between pages does not cause visible blank flash
- [ ] No console errors on any page
- [ ] No console warnings (investigate and fix or document as acceptable)
- [ ] Images (if any) are not larger than needed
- [ ] No layout shift (CLS) visible during page load

---

## Browser Compatibility

Test on:
- [ ] Chrome (latest)
- [ ] Safari (latest, macOS)
- [ ] Firefox (latest)
- [ ] Safari (iOS, latest)
- [ ] Chrome (Android, latest)

---

## Regression Checks

Run after any significant change:
- [ ] Home Dashboard still renders
- [ ] Navigation still works
- [ ] At least one Tool Map card still renders
- [ ] At least one Glossary term still renders
- [ ] Scenario game still loads and submits an answer
- [ ] localStorage read/write still works
