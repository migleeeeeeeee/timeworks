# Time Tracker — Daily View Redesign

**Date:** 2026-05-07
**Surface:** TimeWorks product, Employee detail → Time tab → Daily view
**Source (current):** Figma node `25770:5342` in file `04x9q7W2Y59baF5MqHAVZR`
**Inspiration board:** Figma node `25730:13127` in the same file

---

## Problem

The current Daily view is a vertical stack of seven nearly-identical day cards. When a week has no entries it reads as seven empty boxes with seven duplicate "Add Time" buttons; when a week has partial data it still gives equal weight to every day regardless of state. The page has no week-level signal, no data-viz energy, and no personality. Users land here, scan, and feel nothing.

The user has reframed: the **primary job** of this page is **backfilling and editing past days** — landing, spotting which days are empty or wrong, and jumping in to fix them. The redesign must optimize for *triage of a week*, not for entering today's hours.

## Goal

Redesign the Daily view as a **week-triage surface**: a confident hero that signals progress and gaps at a glance, a project-split read-out for context, and seven day rows whose *visual weight is proportional to their state*. Borrow energy from the inspiration board (hero panel + mixed grid + colored data accents + real numbers) without inventing primitives the design system doesn't already ship.

## Non-goals

- The Weekly tab — out of scope for this spec.
- The "log a new entry" modal/flow — assumed to exist; we only place its triggers.
- Manager-of-employee review patterns (handled separately if needed).
- Any backend or data-model changes.
- Any new design system components. This is a **page-level composition** built from the 43 shipped DS components plus tokens.

## Page anatomy (1440px canvas)

The page lives inside the existing app shell (left sidebar, top bar with breadcrumb + bell + avatar). Below the top bar, the existing toolbar row (filter, Daily/Weekly tabs, date picker, overflow) is preserved, with one change: a single primary `Button { variant: primary, leadingIcon: Plus } "Log time"` is added to the right of the toolbar. This **replaces the seven duplicated "Add Time" buttons** that exist today.

Canvas content, top to bottom:

### 1. Hero zone — two cards side by side

**1a. "This week" panel** — left, ~70% width, primary brand surface.

- Background: `--color-primary-color` (brand purple), 12px radius, `shadow-md`.
- Eyebrow: `Text variant="t3"` "This week" in `--color-text-color-on-primary` at 70% opacity.
- Hero number: `Text variant="h1"` `"32h"` + secondary `"/ 40h"` in 60% opacity. (Format: `<logged>h / <target>h`. Target is the user's weekly target, falling back to 40h.)
- Day strip: 7 horizontally-laid cells, one per day Mon→Sun. Each cell:
  - 1.5× wider than tall, 8px radius, 8px gap between cells.
  - Day label above (Mon, Tue, …) in `t3`.
  - Hours under: `t3` numeric ("8h") or em-dash ("—") if empty.
  - Fill state encoded by background:
    - Empty (0h): outlined, 1px stroke `rgba(255,255,255,0.25)`, transparent fill.
    - Partial (>0 and < daily target): translucent white fill at `0.35` opacity.
    - Complete (≥ daily target, default 8h): solid white fill, day-label and hours flip to brand purple.
    - Today: 2px white stroke ring regardless of fill state.
  - Weekend cells use the same scheme but daily target defaults to 0; empty weekends are visually muted (no expectation, no "miss" signal).
- Footer line: `Text variant="t3"` `"<remaining>h to go · <projects> projects · <entries> entries"` with a trailing delta chip `↑ +<n>h vs last week` (or `↓` / `flat`). Uses a small `Chip` with `variant="success"` / `"neutral"` / `"warning"` semantics from the existing Chip component.

**1b. "Top projects" panel** — right, ~30% width, neutral surface.

- Background: `--color-card-background-color`, 12px radius, `shadow-xs`.
- Title: `Text variant="t2"` "Top projects · this week".
- Body: a **horizontal stacked bar** showing project share of total hours, built as a row of colored segments (each a tinted div with the project's accent token, see "Project colors" below). Beneath the bar, a 3–4 row legend list: `[●] Project name [hours]`, sorted descending. Cap at 3 visible + "+N more" link if needed.
- Empty-state: replaces the bar with neutral skeleton-like striped placeholder + caption "No project data yet — log time to see your split."

> **Note on the donut:** the wireframe sketched a donut, but the DS does not ship a donut/pie primitive. A horizontal stacked bar conveys the same "split across projects" signal, uses only existing primitives (Box + Text + Chip), and matches the language of the existing `LinearProgressBar`. Decision: **stacked bar, not donut**, for v1.

### 2. Days list — state-differentiated rows

The seven days render in reverse-chronological order (most recent at top), and each row's visual weight is proportional to its state. Three row variants:

#### 2a. Filled-day card (has entries)

- Card: white surface, 12px radius, `shadow-xs`, full canvas width.
- Header row inside card:
  - Left: date chip (compact two-line "APR / 30") + day name + month-year.
  - "Today" pill (Badge `variant="primary"`) appended to the date if applicable.
  - Right: `Text variant="t2"` "Total <Xh>".
- Entry list (one row per entry):
  - Project color dot (8px circle, project's accent color).
  - Horizontal mini-bar (24–48px wide) tinted in project color, length proportional to that entry's share of the day's logged hours.
  - Project name · task description (`Text t2`, single line, truncate).
  - Right-aligned: duration (`Text t2`) and `IconButton` (pencil) for edit on hover.
- Footer: ghost `Button variant="ghost" leadingIcon="Plus"` "Add entry" — only on filled cards (so power users can add another entry to a populated day without leaving the row).

#### 2b. Empty-day thin row (no entries, weekday)

- Single 40px row, `--color-card-background-color` at 50% opacity, no shadow, 8px radius.
- Layout: `[date chip muted]  Tuesday Apr 28  ·  no entries  ─────────  [+ Log time]` (link/ghost button right-aligned).
- Hover: surface lifts to 100% opacity + 1px brand-tinted border.

#### 2c. Weekend empty row

- Same as 2b but with a "weekend" pill before "no entries" and slightly more muted (60% text opacity). Signals "this is intentionally empty, not a missed day" so users can tell at a glance whether they're behind.

#### Density math
A populated weekday card is ~120–180px tall (depending on entry count). An empty thin row is 40px. A typical partial-data week (3 filled + 4 empty) collapses to roughly the height of one current card per filled day plus a single line per empty day — so the page becomes shorter when there's less data, not longer.

### 3. Footer

Existing pagination + `Rows per page` block is preserved unchanged.

## States

**Empty week (no entries logged anywhere this week):**
- Hero number reads `0h / 40h`. Day strip is all outlined cells.
- Footer reads `40h to go · let's log the first one`. The delta chip is suppressed.
- "Top projects" panel shows the empty-state placeholder.
- All seven day rows render as **thin empty rows (2b/2c)** — short, inviting, scrollable in one viewport. No fat empty cards.

**Partial week (some days filled, some empty):**
- The canonical state shown in the wireframe. Heatmap shows which cells are filled. Filled days are full cards; empty days are thin rows.

**Full week (every day at or above target):**
- Day strip is fully filled white cells. Hero shows `40h+ / 40h`, delta chip green. All seven days render as filled cards (2a). Page is data-rich and scrollable.

## Project colors

Project color is the only spot in this page that wants more than the brand hue. The DS does not currently ship a multi-project palette, but `Chip` and `Badge` already support `variant`s including `success`, `warning`, `info`, `destructive`, `neutral`. For v1, **project colors map to the existing semantic Chip/Badge variants** in a stable order: projects are ranked by total hours logged in the visible week, descending, with ties broken alphabetically. The top-ranked project gets `primary`, then `success`, `warning`, `info`, and any 5th-or-later project shares `neutral`. This keeps the redesign inside existing tokens and keeps a project's color stable across the heatmap, the stacked bar, the legend, and the entry rows for the duration of the view. (When the user navigates to a different week, the mapping recomputes for that week's data.)

> **Open consideration (flagged for review, not blocking):** if the product needs a true multi-project palette beyond 5 hues, that's a separate token discussion and would be added via Tokens Studio. Out of scope for this redesign.

## Tokens used (no new tokens introduced)

- `--color-primary-color`, `--color-text-color-on-primary` — hero panel.
- `--color-card-background-color`, `--color-text-color`, `--color-secondary-text-color` — body cards and rows.
- `--color-primary-selected-color` (or equivalent tinted brand) — hover and selected states for heatmap cells.
- Existing semantic Chip/Badge variant colors — project accents.
- `--shadow-xs`, `--shadow-md` — card depths.
- Spacing scale `--space-{4,8,12,16,24,32}` — all gaps and padding.
- Typography utilities `text-h1`, `text-t2`, `text-t3` — hierarchy.

## DS components consumed

From `src/index.ts`: `Avatar`, `Badge`, `Breadcrumb`, `Button`, `Chip`, `DatePicker`, `Divider`, `Dropdown`, `IconButton`, `LinearProgressBar`, `Pagination`, `Tabs` (existing toolbar), `Text`, `Tooltip` (on the heatmap cells, showing exact hours on hover).

No new components required.

## Definition of done (Figma deliverable)

This spec produces a **Figma page**, not React code. The redesign is "done" when:

- [ ] A new Figma frame exists in the TimeWorks DS file alongside `25770:5342`, named "Daily view — redesign (A)".
- [ ] The frame is built using **library instances** from the DS file (per `figma-page-to-library` skill conventions) — no detached primitives, no local one-offs that duplicate library components.
- [ ] All three states (empty week, partial week, full week) are rendered as separate variants of the frame.
- [ ] Every fill, stroke, radius, spacing, and text style binds to a Figma variable — no raw hex, no raw px, no raw font sizes.
- [ ] The frame is visually correct in light, dark, and black themes when toggled via the file's mode switch.
- [ ] The user has approved the partial-week state before the empty / full variants are built (review checkpoint mid-build).

The downstream React implementation is a separate spec/plan.

## Risks and mitigations

- **Risk:** Heatmap cells use opacity-based fill states that may fail contrast in dark/black themes. **Mitigation:** verify each cell variant against its background in all three themes; if contrast fails, switch to discrete tint tokens rather than opacity.
- **Risk:** Project-color mapping via semantic Chip variants conflates "warning" (a status meaning) with "project 3" (an arbitrary identity). **Mitigation:** flagged as an open consideration; for v1 use the variants and revisit if it reads wrong in review.
- **Risk:** Hero panel competes with the brand sidebar. **Mitigation:** the existing sidebar's brand surface is small (~64px); the hero is the dominant primary surface on the canvas, which is intentional for the inspo direction.

## Out of scope (explicit)

- Weekly tab redesign.
- Live timer / start-stop mechanics.
- Entry-creation modal/flow.
- Manager review patterns.
- New token introduction.
- React implementation.
