# Manager Dashboard — design-system reconciliation (Run 2)

**Source:** clone of `Backup - Main View` → new frame `Main View - Skill Run 2` (`27450:155851`)
**DS file:** `gqYWCu1K6dJ9gESXtgNeCi` (TimeWorks Design System — Experiment)
**Date:** 2026-05-11
**Skill version:** post-systematic-detection-sweep
**Mode:** `work-in-DS-file`

This run validates the skill's **systematic component-detection sweep**: every FRAME / GROUP under the target is classified by its visual+structural signature (size, radius, fill, stroke, child types) — **not by layer name** — and swapped to the closest DS component family. Pair this with the **nearest-match Rule 4** for any remaining raw paints / radii / shadows, and the result is total DS coverage.

## Final state

| Metric | Value |
| ------ | ----- |
| Top-level DS component instances | **57** |
| Text leaks | **0** |
| Fill leaks | **0** |
| Stroke leaks | **0** |
| Radius leaks | **0** |
| Effect leaks | **0** |
| **Total raw-value leaks** | **0** |

Every value on the page is now bound to a DS token; every section that matches a DS component pattern is now a DS library instance.

## Component instances (57)

| Component | Count | How they were detected |
| --------- | ----: | ---------------------- |
| `Chips` (`Type=Default`, `Size=sm`)         | 44 | 11 project cards × 4 status counts (Pending / Waiting Response / In-Progress / Over Due). Each is 82–98 × 24, cornerRadius=80 (pill), fill `ui-background-color`, 2 text children. Signature matched the **pill** row of the detection table. |
| `Chips` (`Type=On-Warning`, `Size=md`)      |  1 | Idle Status pill (115×32, radius 10, "IDLE - 00:12:34"). |
| `Chips` (`Type=Default`, `Size=md`)         |  1 | Break Duration pill ("Lunch - 00:30:00"). |
| `Button` (`Size=XS`, `Kind=Tertiary`)       |  6 | "Details" buttons, one per task in each timeline (46×20, stroke-only outline, 1 text). Signature matched the **rectangle button** row. |
| `Icon Button` (`Size=Medium`, `Kind=Primary`) | 1 | Document Icon Container (32×32 with fill, single icon-sized child, no text). |
| `Icon Button` (`Size=Large`, `Kind=Tertiary`) | 1 | Break Action button (40×40, fully round, no text). |
| `Search` (`Size=Large`)                     |  2 | Sidebar search ("Search Tasks", 290×36) + Project Item search ("Search Task", 250×36). |
| `Search` (`Size=Medium`)                    |  1 | Header search field (260×32). |

**The detection table picked all 57 instances by signature, not by name.** No hardcoded alias matching. The 44 count chips were detected because their structure (radius=80, h=24, has fill, 2 text children) matched the **pill** signature — and were correctly classified despite their layer names ("Pending Tasks Count", "Waiting Response Count", etc.) being nothing like "chip" or "tag".

## Detection logic — what it looks for

```
Avatar      → circle, no text, image fill or 1-letter text
Icon Button → square, h ∈ [24,56], 0 text, ≥1 icon child, has fill or stroke
Search      → wide input shape (w≥150, h 28-48), 1 text + 1 icon, text reads like search placeholder
Text Field  → wide input shape, 1 text, stroke, no icon
Chips       → pill (radius ≥ h/2-1, or radius=100), h ∈ [16,36], 1-3 texts
Button      → 1 text + 0-1 icon, h ∈ [20,48], radius < h/2 (not a pill), has fill or stroke
List item   → row with avatar + text + meta + optional control
Bare icon   → VECTOR or FRAME-wrapping-single-VECTOR ≤24×24 outside a button signature
```

## Token bindings (Rule 4, nearest-match)

Every paint / radius / shadow that isn't inside a library instance was bound to the closest existing DS token:

- **Typography**: 169 / 169 TEXT nodes → DS text style by size + weight bucket
- **Colors**: 100% of SOLID fills + strokes → nearest by RGB Euclidean distance, with neutrals snapped to `primary-text-color` / `secondary-text-color` / `ui-background-color` / `ui-border-color` / `primary-background-color`
- **Radii**: 100% of non-zero corner radii → nearest `space-*` token (largest is `space-80`)
- **Effects**: 100% of unbound shadows → DS effect style by blur-magnitude bucket

## What the skill correctly does NOT do

- Does **not** invent or recommend new DS tokens. The DS has what it has.
- Does **not** halt and ask the user to add tokens. Substitution, not gap-flagging.
- Does **not** pre-filter the detection sweep by layer name. Layer names are hints, not gates.

## Skill change driven by this run

Step 5 → Rule 2 of the skill now requires a **systematic detection sweep** with an explicit signature table (avatar / icon button / search / text field / chips / button / list item / bare icon / no-swap / bespoke). The agent must visit every FRAME / GROUP under the target and classify by signature, then swap with a one-line rationale. The previous version of Rule 2 had a prose description of the same intent but no enforced sweep — in practice the agent only ran it on a handful of name-matched candidates and missed obvious cases (the 44 count pills, the 6 Details buttons, the third Search field, the Document Icon Button). This run's massive haul (3 instances → 57) is the proof that the systematic sweep catches what name-matching misses.

## Backup integrity

- `Backup - Main View` (`27449:155264`) — untouched pristine original.
- `Main View` (`27449:154717`) — Run 1's converted version (kept for history).
- **`Main View - Skill Run 2`** (`27450:155851`) — this run. 57 DS instances, 0 raw-value leaks.

Compare all three frames side-by-side on Page "Test" of the Experiment file.
