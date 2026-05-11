# Manager Dashboard — design-system reconciliation (Run 2)

**Source:** clone of `Backup - Main View` (the pristine duplicate from Run 1) → new frame `Main View - Skill Run 2` (`27450:155851`)
**DS file:** `gqYWCu1K6dJ9gESXtgNeCi` (TimeWorks Design System — Experiment)
**Date:** 2026-05-11
**Mode:** `work-in-DS-file`
**Skill version:** post-judgment-first-cascade (`3cb1af1`)
**Predecessor run:** `2026-05-11-tw-manager-dashboard-conversion.md`

This run re-applies the skill against a fresh copy of the dashboard to validate the **judgment-first Step 5 cascade** end-to-end without the manual mid-stream tweaks Run 1 accumulated.

## Summary

| Pass | Result |
| ---- | ------ |
| Component swaps via semantic reasoning | **5 instances created** |
| Typography binding | **164 of 169 text nodes** bound to DS text styles. 5 skipped (descendants of newly-placed library instances — correct). 0 errors. |
| Semantic color binding | **257 paints bound** (203 fills + 54 strokes). |
| Radius binding (via `space-*` tokens) | **20 corners bound** (values 8, 12, 16, 20, 24 that match DS scale). |

## Swapped

- **Input Field** in sidebar (`27450:155897`, removed) → `Search` Size=Large/Default (`27450:156397`). Same rationale as Run 1: magnifying-glass + placeholder "Search Tasks" → DS Search. Position (10, 214) preserved.
- **Input Field** inside Second Project Item Content (`27450:155937`, removed) → `Search` Size=Large/Default (`27450:156421`). **New this run** — Run 1 missed this second search box. Rationale: identical pattern to the first one, "Search Task" placeholder + Left Icon. Position (0, 65) preserved.
- **Idle Status Container** (`27450:155878`, removed) → `Chips` Type=On-Warning (`27450:156445`). Rationale: 115×32 pill, radius 10, holds state label "IDLE" + duration "00:12:34" → status indicator, warning tone (paused/idle).
- **Break Duration Container** (`27450:155890`, removed) → `Chips` Type=Default (`27450:156448`). Rationale: 130×32 pill with "Lunch - 00:30:00" — neutral, informational, not warning/positive/negative.
- **Break Status Container** (`27450:155883`, removed) → `Icon Button` Size=Large, Kind=Tertiary (`27450:156461`). **New this run.** Rationale: 40×40 frame, cornerRadius=100 (fully round), 24×24 inner content with no text → circular icon-only control. First attempt picked Size=XXS (16×16) — clearly wrong for a 40×40 source — and was re-instantiated with Size=Large which sits cleanly in the source footprint.

## Why these specifically — Step A reasoning trace

The judgment-first cascade requires the agent to gather context before classifying. Trace for each:

```
Idle Status Container (115×32, cornerRadius=10, parent="Task Status Container")
  child: Idle Status Content (95×20) — Frame
    child: TEXT "IDLE" + TEXT "-" + TEXT "00:12:34"
  visual: small pill, has fill (status colour), has stroke=no
  → STATUS INDICATOR with state word + duration
  → DS family: Chips (610+ variants, Type controls tone)
  → Tone: "IDLE" is a paused state → Type=On-Warning
  → swap. Text slot collapses three TEXT children into "IDLE - 00:12:34".
```

```
Break Status Container (40×40, cornerRadius=100, parent="Task Status Container")
  child: Break Status Content (24×24) — Frame, no TEXT
  visual: fully-round, fill present, child is icon-sized (24×24)
  → CIRCULAR ICON CONTROL (no label)
  → DS family: Icon Button (Size=L matches 40×40 footprint)
  → no text content to preserve
  → swap.
```

## Explicitly rejected swaps (judgment-first cascade Rule 4)

The cascade's Rule 4 says: when no DS component fits the section's shape, do **token-binding only**, don't force a swap. This run correctly applied it to:

- **20× count-pair labels** (`Pending Tasks Count` / `In-Progress Count`, repeated through the projects list). Inspection: two plain TEXT children, no fill, no stroke, no radius. A naive matcher would push these into `Counter` (a coloured filled number badge); that would replace the source's plain-text-pair look with a saturated pill, breaking design intent. Rule 4 outcome: typography bound to DS text styles, the colour leak `rgb(32,87,59)` (In-Progress green) logged as a Tokens Studio gap.

## Raw-value leaks

**440 unbound visual properties remain.** Same shape as Run 1; the increase (440 vs 433) is because this is the pristine baseline — Run 1 had been subtly mutated by mid-stream tweaks.

| Category | Count | Notes |
| -------- | ----: | ----- |
| Fills    |  89 | Status palette: dark green (22), dark brown (22), pale yellow (11), pale mint (11), pale peach (11), plus one-offs |
| Strokes  |   8 | Single-use accents (one red, one orange, one light grey, plus a few greys missed by the auto-bind) |
| Radii    | 340 | `100` (pill, 232×), `10` (68×), `5` (32×), `1` (8×) — none in DS scale |
| Text     |   **0** | bulk-bound ✓ |
| Effects  |   3 | unbound shadows |

## Tokens Studio gaps (carried from Run 1, validated again)

| What | Suggested Tokens Studio entry | Eliminates how many leaks |
| ---- | ----------------------------- | ----------------------- |
| `status-in-progress` color | rgb(32,87,59) | 22 fills |
| `status-completed` (or `status-stopped`) color | rgb(91,39,20) | 22 fills |
| `status-pending-bg` color | rgb(255,237,167) | 11 fills |
| `status-completed-bg` color | rgb(198,250,228) | 11 fills |
| `status-stopped-bg` color | rgb(253,216,191) | 11 fills |
| `radius-full` (or `radius-pill`) | 100 | 232 corners |
| `radius-card` | 10 | 68 corners |
| (decide: round-down to space-4 vs new token) | 5 | 32 corners |

Adding these clears **~309 of the 440 remaining leaks** in one re-bind pass.

## Comparison with Run 1

The judgment-first cascade caught two patterns Run 1 missed:

1. **Second Input Field** inside `Second Project Item Content`. Run 1 only looked at the obvious sidebar Search; this run searched for the pattern across the whole frame and found two instances.
2. **Break Status Container** (40×40 round button). Run 1's "small pill" filter required text content, so this empty-frame icon button was invisible. The new reasoning step ("no text + radius:100 + child is icon-sized → icon button") catches it.

Both wins came from the cascade explicitly asking the agent to **inspect children** (text + size) rather than just match the layer name.

## Backup integrity

`Backup - Main View` (`27449:155264`) remains untouched. Both Run 1's converted frame (`Main View`, `27449:154717`) and Run 2's clone (`Main View - Skill Run 2`, `27450:155851`) are independent working copies — you can compare all three side by side in Figma.
