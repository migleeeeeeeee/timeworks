# Run log — Timezone Menu restyle to Filters Modal reference

**Date:** 2026-06-07
**File:** TimeWorks Design System (`gqYWCu1K6dJ9gESXtgNeCi`)
**Target node:** `28292:162342` — "Timezone Menu" (FRAME)
**Reference:** `28288:125395` — "Filters Modal" (FRAME)
**Spec:** `docs/superpowers/specs/2026-06-07-timezone-selection-menu-design.md` (see Revision section)

## Goal

"Make it better and follow the TimeWorks DS for colorstyle/workstyle/textstyle", using
the Filters Modal as the basis. Mapped to: color = DS color variables, work = surface
elevation treatment, text = Karla t-scale with bound colors.

## Changes applied (single atomic `figma_execute`)

| Node | Property | Before | After |
|------|----------|--------|-------|
| `28292:162342` surface | fill | `secondary-background-color` @50% (glass) | `primary-background-color` (baked + bound) |
| | cornerRadius | 8 | 16 |
| | strokes | `ui-border-color` hairline | none |
| | itemSpacing | 16 (`space-16`) | 8 (`space-8`) |
| | shadow | raw 20/y6/20% | unchanged (matches reference) |
| `…343/347/352` rows | cornerRadius | 8 | 6 |
| `28292:162347` selected row | fill | none | `primary-selected-color` (baked + bound) |
| `…344/348/353` labels | font / case | Karla Regular, sentence | Karla SemiBold, `textCase: UPPER` |
| `28292:162350` selected value | fill | `primary-color` (indigo) | `primary-text-color` (dark) |

Check icon (`28292:162351`) left on `primary-color`.

## Variable IDs used (Color Tokens collection)

- `primary-background-color` — `VariableID:46810:1511` (light #FAFBFD)
- `primary-selected-color` — `VariableID:46810:1510` (light #C7D9FF)
- `primary-text-color` — `VariableID:46810:1430`
- `secondary-text-color` — `VariableID:46810:1421`
- `primary-color` — `VariableID:46810:1488`
- `space-8` — `VariableID:46810:1608`

## Decisions / raw-value notes

- **FRAME-fill bake:** surface + selected-row fills set via
  `figma.variables.setBoundVariableForPaint(...)` with the resolved light-mode RGB baked
  in, per the known figma-console quirk where a FRAME fill bound to a color variable
  renders black. The binding is preserved (so dark/black modes resolve correctly); the
  baked literal is just the light-mode fallback.
- **Shadow stays raw:** the Filters Modal reference itself uses a raw drop-shadow (no
  `shadow-*` effect style is bound anywhere in this file), so "follow the DS workstyle"
  meant matching that treatment, not introducing an effect style.
- **No text styles:** this file binds only fill colors to variables; typography is raw
  Karla at t-scale values throughout. Matched that convention.

## Verification

- Structural dump confirmed all edits (radius 16/6, fills bound to the right variable
  IDs, all three labels `UPPER/SemiBold`).
- `figma_capture_screenshot` of `28292:162342` confirms: solid card, uppercase labels,
  full-width lavender highlight on the selected row with dark value + indigo check.

## Follow-up — converted to a component modal

Per request, the restyled menu was turned into a full DS modal **component**.

- **New component:** `Modal / Timezone` — node **`28293:178692`** (320×336). The original
  frame `28292:162342` was promoted via `figma.createComponentFromNode(...)` (id changed).
- **Header:** clone of the Filters Modal header instance (`28288:125396`), `.modal-header`
  set `when scrolling=no`; inner `title` TEXT node set directly to "Time zone" (per the
  setProperties-TEXT quirk — not via the component TEXT prop) + tertiary close Icon Button.
- **Body:** new `Body` frame (vertical, padding 8, itemSpacing 8) wrapping the three
  existing `Row`s (moved in atomically, all set `layoutSizingHorizontal=FILL`).
- **Footer:** clone of the Filters Modal footer instance (`28288:125400`), `.modal-footer`
  set `If scroll=no`; secondary button TEXT retargeted "Reset" → "Cancel"; Apply kept.
- **Surface:** padding/itemSpacing variable bindings cleared and zeroed (header/footer/body
  own their insets), width set to 320; `primary-background-color` fill + radius 16 + shadow
  retained.
- Header & footer remain live DS instances (cloned from the proven Filters Modal build), so
  they stay linked to the library.
