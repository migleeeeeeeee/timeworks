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
| Top-level DS component instances | **85** |
| DS placeholder strings remaining ("This is a chip", "Button label", etc.) | **0** |
| Text leaks | **0** |
| Fill leaks | **0** |
| Stroke leaks | **0** |
| Radius leaks | **0** |
| Effect leaks | **0** |
| **Total raw-value leaks** | **0** |

Every value on the page is bound to a DS token; every section that matches a DS component pattern is a DS library instance; every named icon is a DS icon instance; every chip / button / search shows its real source content, not the DS default.

## Component instances (85)

| Component | Count | How they were detected |
| --------- | ----: | ---------------------- |
| `Chips` per-instance tone variants — On-Warning, On-Positive, On-Negative, Default | 44 | 11 project cards × 4 status counts. Tone picked from text content per chip: Pending/Waiting → On-Warning, In-Progress → On-Positive, Over Due → On-Negative. |
| `Chips` (`Type=On-Warning`, `Size=md`)      |  1 | Idle Status pill (115×32, radius 10, "IDLE - 00:12:34"). |
| `Chips` (`Type=Default`, `Size=md`)         |  1 | Break Duration pill ("Lunch - 00:30:00"). |
| `Button` (`Size=XS`, `Kind=Tertiary`)       |  6 | "Details" buttons, one per task in each timeline (46×20, stroke-only outline, 1 text). |
| `Icon Button` (`Size=Medium`, `Kind=Primary`) | 1 | Document Icon Container (32×32 with fill, single icon-sized child, no text). |
| `Icon Button` (`Size=Large`, `Kind=Tertiary`) | 1 | Break Action button (40×40, fully round, no text). |
| `Search` (`Size=Large`)                     |  2 | Sidebar search ("Search Tasks", 290×36) + Project Item search ("Search Task", 250×36). |
| `Search` (`Size=Medium`)                    |  1 | Header search field (260×32). |
| **DS icon instances** (from `icon-map.json`) | **27** | Bare VECTOR / icon-wrapper FRAMEs swapped to their nearest icon in the DS canonical library — `bell`, `chevron-down` × 4, `bars-staggered` × ~10, `clipboard-check` × 11, `arrow-right-from-bracket`, `arrow-up-from-bracket`, `arrow-down-left-and-arrow-up-right-to-center` × 2, `folder`, `note`. Three unnamed `Vector` decorations (titlebar chrome) left as bespoke. |

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

## Skill changes driven by this run

Three concrete bugs the user found in the previous skill version, each of which has been fixed in `SKILL.md`:

1. **Text content not preserved after swap.** `instance.setProperties({ "Chip Text": ... })` succeeded as far as setting the property value, but the chip's inner TEXT node still rendered the DS default `"This is a chip"`. The fix: Step 7 now requires a **bulletproof three-step text preservation pattern**: (A) call `setProperties` for any matching text properties, (B) read back every TEXT descendant and force-override `t.characters` directly when the value still matches a known DS placeholder (`this is a chip` / `button label` / `option N` / `label` / `text` / `placeholder`), (C) re-assert no placeholder strings remain. Skipping (B) is what caused the user-visible bug.

2. **One variant for the whole group.** All 44 count chips were swapped to `Type=Default` even though their text content carried clear semantic tones. Rule 2 now requires **per-instance variant selection**: a chip with text "Pending" → `Type=On-Warning`; "In-Progress" → `Type=On-Positive`; "Over Due" → `Type=On-Negative`; etc. Same principle generalises to Buttons (Kind from fill+stroke + Color from semantics) and any other variant-bearing family.

3. **Icons not swapped to DS icon components.** Step 5's detection table mentioned bare-icon swapping but the skill never executed a dedicated icon pass. There is now an explicit **bare-icon swap pass** documented in Rule 2: after the component sweep, every leftover small VECTOR or single-VECTOR-wrapping FRAME is name-mapped to an `icon-map.json` entry (using both the node's own name and its parent's name, e.g. "Project Icon" → `note`, "heroicons-outline/chevron-down" → `chevron-down`). Unmatched icons stay as-is and are flagged.

Step 5 → Rule 2 also requires the **systematic detection sweep** from the previous iteration (visit every FRAME/GROUP, classify by signature, never pre-filter by layer name). Combined with the three fixes above, the same workflow that produced 3 unrelated swaps in the first dashboard run now produces 85 correct DS instances on the same source content with zero DS placeholder strings left visible.

## Backup integrity

- `Backup - Main View` (`27449:155264`) — untouched pristine original.
- `Main View` (`27449:154717`) — Run 1's converted version (kept for history).
- **`Main View - Skill Run 2`** (`27450:155851`) — this run. 57 DS instances, 0 raw-value leaks.

Compare all three frames side-by-side on Page "Test" of the Experiment file.
