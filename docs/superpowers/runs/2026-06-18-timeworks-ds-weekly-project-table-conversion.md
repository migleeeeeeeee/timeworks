# Weekly Project Table — design-system reconciliation

**File:** TimeWorks Design System (Experiment) `gqYWCu1K6dJ9gESXtgNeCi`
**Target:** `Weekly Project Table` (node `28300:164812`)
**Reference DS table:** `Table Card` (node `28299:148455`)
**Mode:** `work-in-DS-file` · **Scope:** preserve data, restyle only

## Summary

The target was already substantially DS-aligned at the atom level (DS `Checkbox`, `Avatar`,
and `Chips` instances; text on DS text styles + `secondary-text-color` / `primary-text-color`
vars). It was **row-oriented** (a vertical stack of `Row` frames, each holding 8 plain cell
frames), whereas the DS `Table Card` is **column-oriented** (`Table / ColumnContent` instances).

Because the DS `RowCount` variant only exposes 4–10 and 20 — and the target has **12 data rows**
— a faithful column-oriented `ColumnContent` rebuild can't hold the data without forcing 20 rows
(8 empty) or detaching the repeater. Per the chosen scope (**preserve data, restyle only**), the
table was restyled in place to match the DS `Table Card` chrome rather than restructured.

## Restyled (chrome + tokens)

- **Card chrome** — node `28300:164812`
  - Fill: `secondary-background-color` (`46810:1492`) opacity `0.5 → 1.0` (solid, matches DS card)
  - Border: rebound `layout-border-color`@0.1 → **`ui-border-color`** (`46810:1460`) @1.0, 1px, INSIDE
  - Radius 12 + clip retained (matches DS reference, which also uses literal `12`)
- **Row dividers** — header + 12 data rows (`28300:164813`, `…164841`, `…181288`, `…181318`,
  `…181348`, `…181378`, `…181408`, `…181438`, `…181468`, `…181498`, `…181528`, `…181558`, `…181588`)
  - Added 1px **bottom-only** stroke bound to **`layout-border-color`** (`46810:1527`) @0.1 —
    identical to the DS `Table/Cell` divider recipe (`strokeBottomWeight=1`, others 0)
- **Select column normalized** — 13 Select cells set to a single canonical spec (HORIZONTAL,
  center/center, pad 12/16/12/16, gap 8); each `Checkbox` reset to `layoutPositioning=AUTO`,
  `layoutAlign=INHERIT`, `layoutGrow=0`

## Checkbox alignment — finding

The reported "first row checkbox not aligned to rows below" was **not reproducible in the current
live file**. Before any change, all checkboxes (header + every data row) were already at absolute
`x=5169` and perfectly vertically centered (`checkbox center Y === cell center Y`) with consistent
52px row spacing. The select column was normalized anyway so first-row alignment is now guaranteed
and uniform across all rows. Verified post-change: all 13 checkboxes centered at `x=5169`.

## Already connected (no change)

- `Checkbox` instances (select column) — DS `Checkbox` (`State=Regular, Label=off`)
- `Avatar` instances (Name column) — DS `Avatar` (`Size=Small, Type=Initials`)
- `Chips` instances (Status column) — DS `Chips` (`Type=Positive-Subtle, Size=md`)
- `Table Footer` (`28300:164929`) — already a DS `Table Footer` instance
- Header labels & cell text — already on DS text styles + DS color vars

## Not done (out of "restyle only" scope)

- **Header sort arrows.** The DS `Table Card` shows ↑↓ sort affordances (a `ColumnTitle`
  `Table/Cell` with an Icon Wrapper + Icon Button) on every header. The target headers are plain
  text frames, not DS `Table/Cell` instances; adding sort arrows would mean rebuilding the header
  cells as DS cell instances. Flagged as an optional follow-up.

## Raw-value leaks

✓ No raw values detected. (Restyled chrome surface: card fill/border, 13 row dividers, cell
frames, and text are all token-bound or on a DS text style. DS-instance internals and the card's
literal `radius:12` — which matches the DS reference — are excluded.)

## Backup

Backup frame: `Backup - Weekly Project Table` (node `28805:189042`), placed to the right of the
original at x≈7021.
