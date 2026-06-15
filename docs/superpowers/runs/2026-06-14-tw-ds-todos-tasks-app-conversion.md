# Todos — Tasks (App) — design-system reconciliation

**File:** TimeWorks Design System (Experiment) — `gqYWCu1K6dJ9gESXtgNeCi`
**Target:** `Todos — Tasks (App)` (node `28673:360692`)
**Foundation/basis:** `Schedules — Day view` (node `28670:552619`)
**Date:** 2026-06-14
**Entry mode:** `work-in-DS-file` (both nodes live in the DS file)

## Diagnosis

The page was **already bound to DS color tokens and text styles** (e.g. Add Task → `primary-color`, search → `primary-background-color`). The "doesn't look like DS" gap was **structural**: the whole Todos Panel was hand-built from raw auto-layout frames + 56 **icon** instances — with **zero DS UI-component instances** (no Button, Chips, Dropdown, Search, Pagination, Breadcrumb). The foundation (Schedules), by contrast, composes real DS instances (Buttons, Dropdown, Search, Avatars, Breadcrumbs Bar). The "blue" primary (`#6271ff`) is the Experiment file's actual Light-mode primary — consistent with the foundation — not a defect.

Per the user's choice (**Full DS component swap** + **breadcrumb header matching the foundation**), the hand-built UI was replaced with DS component instances cloned/instantiated to match the foundation.

## Swapped / Composed

- **Header** → **Breadcrumbs Bar** (DS, cloned from foundation `28670:552625`) relabeled `Dashboard / Tasks / Todos`; bold "Todos" title + back-arrow removed; "Hi, Saph" greeting dropped to match foundation; bell + avatar retained — node `28673:360698`
- **Search field** → DS **Search** (cloned from foundation `28670:552649`), placeholder "Search…", set to fill row width — node `28673:363935`
- **Add Task** → DS **Button** (Kind=Primary, left plus icon, text "Add Task") — node `28673:364072`
- **View** → DS **Button** (Kind=Secondary, left sliders icon, text "View") — node `28673:364016`
- **CW - Tuscanyy** → DS **Dropdown** (text) — node `28673:364193`
- **Select Assignees** → DS **Dropdown** (text) — node `28673:364224`
- **Status filter** → DS **Dropdown** (text) — node `28673:364255`
- **Priority filter** → DS **Dropdown** (bars-filter icon) — node `28673:364286`
- **Progress filter** → DS **Dropdown** (clock icon) — node `28673:364325`
- **Status/Priority/Progress cell pills (×12)** → DS **Chips** (`sm`), tone by content, leading icon preserved:
  - `Active` → `On-Positive` · `High` → `On-Negative` · `Medium` → `On-Warning` · `Pending` → `On-Warning` · `Inprogress` → `On-Positive`
- **Pagination** → restored from backup with nav buttons rebound from `Content Color/bright-blue(-selected)` → `secondary-background-color` (subtle), nav arrow vectors → `secondary-text-color`, borders → `layout-border-color` — node `28673:364709`

## Already connected

- Sidebar (`28673:360693`) — DS Sidebar instance, untouched
- Table rows / cells / checkboxes / kebab (ellipsis) icons — already token-bound; left as-is
- Footer "Showing 1-4 of 4" count badges — already bound to DS `Content Color` hue tokens (`bright-blue-selected` / `royal`); left as-is
- "All (4)" rows-per-page select — already token-bound; left as-is

## Blocked

- None.

## Raw-value leaks

✓ No raw values detected (audit over the converted Todos Panel, excluding DS-instance internals, returned 0 leaks).

## Notes / minor follow-ups

- The breadcrumb emphasizes the middle item ("Tasks") because the cloned foundation Breadcrumbs Bar styles its items that way; faithful to the foundation as requested.
- The status-filter dropdown dropped its small green status dot (DS Dropdown exposes an icon slot, not a colored dot); kept as plain text.
- Add Task / View icons reuse the page's existing `plus` / `sliders-simple` icon components via the Button's icon slot.

## Backup

Backup frame: `Backup - Todos — Tasks (App)` (node `28673:361598`), placed to the right of the original.
