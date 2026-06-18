# Weekly Schedule (Create Shift modal) — redesign spec

**Date:** 2026-06-15
**File:** TimeWorks Design System (Experiment) `gqYWCu1K6dJ9gESXtgNeCi`
**Edit source:** `Modal Body / Create Shift` main component `28672:168782`
(drives instance `28672:139071` + section `28672:139070`)
**Target:** `Card B — Weekly Schedule` `28672:168781` → `day-rows` `28672:169304`

## Problem with the current design

- Two lock icons per active row (a green lock-square on the left + a lock on the
  far right) — redundant. Lock means "lock the day's hours"; only one is needed.
- The left green lock-square sits jammed against the checkbox — two heavy controls
  competing, unclear which does what.
- Whole-row green tint for active days vs. white for off days = heavy, inconsistent
  rhythm.
- Off-brand colors: green tint/lock and a yellow "OFF" badge with orange text do
  not match the TimeWorks indigo palette; yellow reads as a warning.
- "Shift Timings" header floats unaligned over the time pills.

## Approved direction — A: clean list with dividers

One white card surface; all 7 days share it, separated by thin DS dividers. No more
per-row fills, no left lock-square.

### Per-row anatomy
- **Left accent pill** — 3×20, radius full, `primary-color` for active days,
  transparent for off days. Quiet at-a-glance "this day is on" signal.
- **Checkbox** (existing DS instance) — checked indigo = work this day.
- **Day name** — `Text2 (14px)/Medium`. `primary-text-color` when active,
  `secondary-text-color` when off. Grows to fill, pushing the right group out.
- **Active right group**: two time pills (existing, clock + time, `Text2/Normal`),
  an em-dash between, then a single **ghost lock** IconButton (the far-right lock,
  recolored to `secondary-text-color`).
- **Off right group**: muted "Day off" text (`Text2/Normal`, `secondary-text-color`).
  No yellow badge.

### Rows & dividers
- `day-rows` itemSpacing → 0; each row 1–6 gets a 1px bottom stroke bound to
  `layout-border-color`. Connected-list look.
- Row height 56, transparent fill, vertically centered, horizontal padding kept.

### Header
- Keep "Weekly Schedule" title + "5 work days" chip on the left.
- "Shift Timings" → quieter right-aligned column label, `Text3 (12px)/Medium`,
  `secondary-text-color`.

### Tokens / styles (all DS, no raw values)
- `primary-color` `46810:1488` — accent pill, checked checkbox (already).
- `primary-text-color` `46810:1430` — active day name + time text.
- `secondary-text-color` `46810:1421` — off day name, "Day off", lock, column label.
- `layout-border-color` `46810:1527` — row dividers.
- Text: `Text2 (14px)/Medium`, `Text2 (14px)/Normal`, `Text3 (12px)/Medium`.

### Out of scope
Modal header/footer, form fields above the card, the "Repeat forever" toggle.
Functionality preserved: enable day, set start/end, lock the day's hours.

## Build approach
In-place restructure of the existing rows in the main component (not a full
child-rebuild) to avoid the figma-console component-edit dataloss pitfall: remove
the green lock-square + row fill, add accent pill + divider, keep checkbox + day
name + time pills + single lock, swap the OFF badge for "Day off". Verify each
batch with a screenshot.

## Status: DONE (2026-06-15)
Implemented in-place on the main component. Active rows (Tue–Fri): 3px indigo
`primary-color` left accent, transparent fill, single muted lock. Off rows
(Mon/Sat/Sun): "Day off" muted text. 1px `layout-border-color` dividers between
rows. Header label → "Shift timings" Text3/Medium muted. Verified in modal instance.

## Update — chip-per-day (per follow-up)
Replaced the flat list + dividers with a chip-per-day layout: day-rows itemSpacing=8, no
dividers. Each day = radius 8 + 1px `ui-border-color` border + clipsContent. Active (Tue–Fri):
`primary-background-color` fill + flush full-height 3px `primary-color` accent child. Off
(Mon/Sat/Sun): `disabled-background-color` grey fill, transparent accent. Verified in modal instance.
