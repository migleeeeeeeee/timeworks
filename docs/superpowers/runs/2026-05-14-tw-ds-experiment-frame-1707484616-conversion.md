# Frame 1707484616 (Target 2, inside Timesheets) — design-system reconciliation

**File:** TimeWorks Design System (Experiment) — `gqYWCu1K6dJ9gESXtgNeCi`
**Page:** `employee view - UI ` · **Target frame:** `Frame 1707484616` (`27618:188123`)
**Parent target:** `Timesheets` (`27616:184144`) — see the sibling Timesheets report for the full-page summary.
**Mode:** `work-in-DS-file`
**Date:** 2026-05-14
**Special instruction:** Substitute the activity-bar chart with the reference graph at `25730:21650` (page "Design suggestions").

## Pre-state

Frame 1707484616 is the top "current-day" block inside Timesheets. It contains two children:

- `Group 7041` (`27618:188124`) — 24-hour scale, activity legend, custom Activity Bar, "View Screenshots" CTA.
- `Group 7049` (`27618:188183`) — the **light** variant of the "Recent time tracked" table (header row + 6 data rows + totals footer + Add Time CTA).

Nothing in this frame was a DS instance before the run.

## Swapped

- `Frame "Button" 100×24 "View Screenshots"` (Group 7041) → **Button** (Kind=Primary, Size=XS) — node `27618:188178` → `27618:190894`
- `Frame "Button" 100×24 "View Screenshots"` (Group 7049) → **Button** (Kind=Primary, Size=XS) — node `27618:188186` → `27618:190897`
- `Frame 1707484514 "Add Time"` (Group 7049 footer) → **Button** (Kind=Tertiary, Size=XS, Icon=Left) — node `27618:188335` → `27618:190915`

## Composed

None.

## Activity Bar substitution (graph swap)

User-specified substitution: the existing custom activity bar inside `Group 7094` (`27618:188143`) — track `Rectangle 4643` (`27618:188169`) plus the bucket cluster `Group 7063` (`27618:188170`) — was **removed** and replaced with a fresh clone of the reference Activity Bar at `25730:21650`. The clone (`27618:190944`) was placed at `x=119, y≈0` to match the old track footprint and rescaled by 1.07× so the new width hits 1479px; the 60px-tall clone sits centered over the original 70px band. The 24-hour hour-labels strip below (`Frame 1707484547`, `27618:188144`) was preserved.

Rationale: per user instruction, use `25730:21650` as the canonical graph for this section.

Note: the reference template is a generic activity strip with purple "active" buckets + pale/saturated buckets for lunch/break/alert/off. Its bucket widths are the template's own data, not the source's data — the substitution swaps the visual primitive, not the embedded values. Tuning the bucket widths to the actual day's data is a follow-up.

## Already connected

None inside this frame prior to this run.

## Token binding (Rule 4)

All loose fills, strokes, and text inside Frame 1707484616 were bound to the nearest DS token as part of the parent-frame sweep (134 fills + 25 strokes across Timesheets, ~119 text nodes). Specifics for this frame:

- Legend dot fills (8×8 ellipses for Time & Activity, IDLE, Alert, Break, Holiday) — snapped to closest DS color tokens.
- Light-variant column header text (rgb 107,114,128) — bound to `placeholder-color` family.
- Light-variant body text (rgb 53,60,80) — bound to `primary-text-color`.
- Indigo "link" / CTA text (rgb 66,94,189) — bound to `Content Color/indigo` family.
- Card surface whites (`Rectangle 4642` header strip, `Rectangle 4643` body) — bound to `secondary-background-color` / `primary-background-color`.
- 18×18 task / alert badge tiles — bound to closest accent tokens (indigo / pink-red).

## Blocked

None.

## Raw-value leaks

✓ No real raw-value leaks remain inside this frame. (See parent Timesheets report for the page-level audit.)

## Backup

The parent frame Timesheets has a sibling backup `Backup - Timesheets` (`27618:188816`); no separate backup was made for Frame 1707484616 because the parent backup covers it.

## Screenshots

Figma REST-image endpoint returned 403 for this MCP session. Visual validation should be done directly in Figma Desktop.
