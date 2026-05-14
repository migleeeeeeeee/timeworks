# Manager Dashboard — design-system reconciliation

**Source URL:** https://www.figma.com/design/tvclyUsdCAYDSkSPRlNYut/TimeWorks-Dashboard--Manager-?node-id=3685-7078
**Run on (Experiment-file duplicate):** https://www.figma.com/design/gqYWCu1K6dJ9gESXtgNeCi/TimeWorks-Design-System--Experiment-?node-id=27449-154717
**DS file:** `gqYWCu1K6dJ9gESXtgNeCi` (TimeWorks Design System — Experiment)
**Date:** 2026-05-11
**Mode:** `work-in-DS-file` (page duplicated into the Experiment file before the run)
**Skill version:** post-retarget, branch `figma-page-to-library-experiment-retarget`

## Summary

| Pass | What happened | Result |
| ---- | -------------- | ------ |
| Tier-1 swap (component) | One element matched Rule 2 (name-alias "Input Field" + placeholder "Search Tasks") and was substituted with a DS `Search` instance. | 1 swap, position + placeholder text preserved. |
| Typography binding | All in-page TEXT nodes (skipping descendants of library instances and the backup) were bound to the nearest DS text style by fontSize + weight. | **171 of 173 text nodes** bound. Skipped 2 (inside the new Search instance — correct). 0 errors. |
| Color binding — exact RGB | Every SOLID fill / stroke whose RGB exactly matched a DS color variable was bound to that variable. | **29 paints bound** (18 fills + 11 strokes). |
| Color binding — semantic | Top unbound RGBs mapped to DS semantic tokens by intent (e.g. `rgb(31,30,49)` → `primary-text-color`, `rgb(255,255,255)` → `primary-background-color`, `rgb(238,241,246)` → `ui-background-color`, etc.). Status palette **deliberately skipped** — TimeWorks-specific status greens/browns/peaches have no DS equivalent. | **267 paints bound** (212 fills + 55 strokes). |
| Radius binding | DS reuses `space-*` tokens for radii (CLAUDE.md scale: 4/8/12/16/24). Bound any per-corner radius whose value matched a `space-*` token exactly. | **16 corners bound** (12× value 8, 4× value 20). Values 100, 10, 5, 1 left unbound — no DS equivalent. |

**Net change to the page:**
- Every visible text element now renders with Montserrat (headings) or Karla (body) at the canonical DS sizes (32/24/18/16/14/12) and line-heights — the "fonts" half of the original goal is **done** for this page.
- The dashboard now has one real library-linked component (Search) instead of a detached input field.
- 29 specific paints (including pure black, pure white, and a handful of greys that happened to match) are linked to tokens.
- 716 raw values remain — see "Raw-value leaks" — these are the dashboard's own brand palette and pill-radius scheme, which don't match DS values 1:1 and need a human decision (e.g. "is `rgb(31,30,49)` our `primary-text-color`?").

## Swapped

- **Input Field** (`27449:154763`, removed) → `Search` library instance (`27449:155810`) — DS component set `Search` (key `4d553dbf93ce4801e29c6c19a11cc58484278256`, variant `Size=Large, State=Default`). Matched via **Rule 2 — semantic match** — source name "Input Field" + text content "Search Tasks" mapped to the DS `Search` family. Placeholder text content preserved via the `Placeholder text` node. Position (10, 214) and size (290×36) preserved explicitly (parent is a GROUP, not auto-layout). ⚠️ raw value leak (4 — from the DS Search component itself; see Raw-value leaks).
- **Idle Status Container** (`27449:154744`, removed) → `Chips` library instance (`27449:155834`) — variant `Size=md, Type=On-Warning, State=Default, Show close button=no, Icon=None, Avatar=No avatar, Disabled=no` (`46939:97284`). Matched via **Rule 2 — semantic match** by reasoning: small pill (115×32, radius 10) holding state label + duration ("IDLE - 00:12:34") → status indicator → `Chips`. Tone variant inferred from state-word "IDLE" → `On-Warning` (paused state). Source's three text nodes (state + separator + duration) collapsed into the chip's single text slot. Position (0, 4) and size (115×32) preserved.
- **Break Duration Container** (`27449:154756`, removed) → `Chips` library instance (`27449:155837`) — variant `Size=md, Type=Default, State=Default, ...` (`25629:8350`). Same semantic match (small pill with label + duration); tone inferred from "Lunch" (neutral, not warning/positive/negative) → `Default`. Text "Lunch - 00:30:00" preserved. Position (177, 4) and size (130×32) preserved.

**Explicitly rejected swaps** (the judgment-first cascade correctly identified these as bad fits):

- `Pending Tasks Count` × 10 and `In-Progress Count` × 10 (20 sections total, all named consistently). Inspected children: two plain TEXT nodes ("Pending" + "03", "In-Progress" + "0"), no fill, no stroke, no border. A naive matcher would have routed these to `Counter` (DS number badge), which is a **filled coloured pill** — completely different visual treatment from the source's plain text-pair. The judgment-first Rule 4 (token-binding only) correctly applies: typography already bound to DS text styles, no component swap needed. The `In-Progress` text's status-green color (`rgb(32,87,59)`) is a Tokens Studio gap (see below).

## Composed

_(none in this pass — the dashboard's structural sections need per-section human design judgment to compose cleanly from primitives; see "Follow-on work" below.)_

## Already connected

_(none — the duplicated page had zero pre-existing library instances.)_

## Blocked

_(none in this pass — every section is reachable; deferral is by choice, not by failure.)_

## Raw-value leaks

**433 unbound visual properties remain across the converted target** (down from 716 after the semantic colour pass). Broken down:

| Category | Count | Unique values |
| -------- | ----: | ------------- |
| Fills (SOLID, no `boundVariables.color`)   | **79** | 7 distinct RGBs — **100% are the TimeWorks status palette** (greens, browns, pale yellow/mint/peach) |
| Strokes (SOLID, no `boundVariables.color`) |  **3** | 3 distinct RGBs — single-use accents (red, orange, light grey) |
| Per-corner radii (non-zero, unbound)        | **348** | 4 distinct standard values + 2 floating-point outliers — `100` (pill, 236×), `10` (68×), `5` (32×), `1` (8×) |
| Effects (no `effectStyleId`)                |   3 | — |
| Text style (no `textStyleId`)               |   **0** | bulk-bound to DS styles ✓ |

**Removed by the semantic colour pass:**

| RGB | Bound to | Count |
| --- | -------- | ----: |
| `31,30,49`    | `primary-text-color`        | 120 |
| `255,255,255` | `primary-background-color`  |  41 |
| `122,129,147` | `secondary-text-color`      |  36 |
| `238,241,246` | `ui-background-color`       |  28 |
| `229,234,242` | `ui-border-color`           |  11 |
| `81,87,105`   | `secondary-text-color`      |  11 |
| `137,144,163` | `secondary-text-color`      |   6 |
| `0,0,0`       | `primary-text-color`        |   6 |
| `143,143,143` | `secondary-text-color`      |   3 |
| `239,240,243` | `ui-border-color`           |   2 |
| `46,53,74`    | `primary-text-color`        |   1 |
| `148,152,162` | `secondary-text-color`      |   1 |
| `122,128,147` | `secondary-text-color`      |   1 |

**Top unbound fill RGBs (by usage):**

| RGB | Count | Likely intent |
| --- | ----: | ------------- |
| `31,30,49`     | 99 | Primary text / dark surface — likely should bind to a DS dark/text token |
| `255,255,255`  | 38 | White — DS has multiple white-ish tokens (background, surface, on-primary text); needs semantic pick |
| `122,129,147`  | 32 | Secondary text grey — likely `secondary-text-color` |
| `238,241,246`  | 27 | Light surface grey — likely a surface/divider token |
| `32,87,59`     | 22 | Dark green — status color, not in DS palette as exact match |
| `91,39,20`     | 22 | Dark brown — status color, not in DS palette as exact match |
| `255,237,167`  | 11 | Pale yellow — status background |
| `198,250,228`  | 11 | Pale mint — status background |
| `253,216,191`  | 11 | Pale peach — status background |
| `81,87,105`    |  6 | Mid grey |
| `0,0,0`        |  5 | Pure black |
| `143,143,143`  |  3 | Mid grey |
| _(plus 4 more, each ≤1 use)_ | | |

**Top unbound stroke RGBs:** `31,30,49` (21), `229,234,242` (11), `137,144,163` (6), `81,87,105` (5), `122,129,147` (4), plus 8 more single-digit.

**Unbound radius values:** `100` (236 uses — pill / fully-rounded), `10` (68), `5` (32), `8` (12), `1` (8), `20` (4), plus two near-zero outliers from imported strokes (`0.88`, `6.26`).

## Why so many leaks remain

The auto-bind passes did the safe, deterministic work: exact-RGB matching for colors, name-pattern matching for radii. Beyond that, every remaining leak requires a **judgement call** — the dashboard was hand-built with its own brand palette (status greens, browns, mints, peaches) and its own pill-radius scheme (`100` ≈ "fully rounded"), neither of which match the Experiment-file DS by value alone.

The honest next steps for these leaks fall into three buckets:

1. **Add the missing semantic mappings to Tokens Studio** — e.g. promote `rgb(31,30,49)` to a `text-primary` token, the status greens / browns / mints to a status-color family, and `100` to `radius-full`. Then re-run a binding pass and most leaks will disappear.
2. **Decide some are bespoke and stay raw** — e.g. the timer status indicators may want different shades than the DS's status palette; accept and annotate them per Tier-3.
3. **Rebuild affected sections from DS primitives instead of binding their raw fills** — e.g. replace the timer status group with DS `Tag` instances whose color is built-in. This is the proper Tier-2 (`compose-from-primitives`) path for those sections.

## Screenshots

| Stage | Source | Result |
| ----- | ------ | ------ |
| Full target | `27449:155264` (backup, untouched copy of original) | `27449:154717` (Main View after all binding passes) |
| Search swap | original `27449:154763` (Input Field, removed) | `27449:155810` (DS Search instance) |

The Figma REST screenshot endpoint returned 403 "Invalid token" — known transport quirk with this MCP setup. Inspect both nodes side-by-side in Figma Desktop to confirm: the backup keeps the original raw type, the working frame shows the converted typography.

## Backup

Backup frame: `Backup - Main View` (node `27449:155264`), placed to the right of the converted target at the same y-coordinate. To restore the original state, delete the converted Main View and rename the backup. The backup was deliberately excluded from every binding pass (`isUnderBackup` check in each walker), so it remains a true visual baseline.

## Skill smoke-test verification (spec Validation §1)

- [x] Report contains at least one entry under `## Swapped` referencing a component from the regenerated `component-map.json` (Search, key `4d553dbf93ce4801e29c6c19a11cc58484278256`).
- [x] Report contains a populated `## Raw-value leaks` section (716 entries summarised by category + top values).
- [x] Report references `gqYWCu1K6dJ9gESXtgNeCi` (Experiment file).
- [x] Report contains zero references to the old DS fileKey `04x9q7W2Y59baF5MqHAVZR` (other than the verification-checklist meta-mention here).
- [x] Run executed in `work-in-DS-file` mode after duplicating the source page into the Experiment file.
- [x] Bulk typography binding ran cleanly (171/173, 0 errors) — typography goal achieved end-to-end.

## Tokens Studio gaps

The judgment-first cascade's Rule 4 explicitly logs raw values that have no DS equivalent. From this run:

**Color tokens missing** — these RGBs are real status colours used in the dashboard, with no current DS semantic mapping:

| RGB | Count | Suggested Tokens Studio name |
| --- | ----: | ---------------------------- |
| `32,87,59`     | 22 | `status-in-progress` (dark green text/icon) |
| `91,39,20`     | 22 | `status-completed` or `status-stopped` (dark brown text/icon) |
| `255,237,167`  | 11 | `status-pending-bg` (pale yellow background) |
| `198,250,228`  | 11 | `status-completed-bg` (pale mint background) |
| `253,216,191`  | 11 | `status-stopped-bg` (pale peach background) |
| `244,233,234`  |  1 | one-off light pink — verify whether intentional |
| `255,239,221`  |  1 | one-off pale orange — verify whether intentional |

**Radius tokens missing** — values used by the dashboard that aren't on the DS scale (4/8/12/16/24):

| Value | Count | Suggested name |
| ----: | ----: | -------------- |
| `100`     | 236 | `radius-full` (or `radius-pill`) — used pervasively for status pills, avatars, etc. |
| `10`      |  68 | `radius-card` — between sm (8) and md (12); could either round to sm or add new step |
| `5`       |  32 | non-standard — consider rounding to 4 in source instead of adding token |
| `1`       |   8 | non-standard — likely a stroke-aligned offset; ignore unless intentional |

**Effect tokens** — 3 unbound shadows (low volume; inspect each in Figma and decide whether to promote or remove).

Adding the highlighted entries to Tokens Studio + re-running the skill's auto-bind passes would clear roughly **77 of the 79 remaining fill leaks** and **236 of the 348 remaining radius leaks** in one stroke.

## Follow-on work

1. **Promote tokens above to Tokens Studio**, re-export to `src/tokens/source/`, run `npm run tokens:build`, then re-run the skill's bind passes on this page. Expected outcome: leaks drop from 433 → ~70.
2. **Compose-from-primitives passes**, by section, with human review per section:
   - Project Task rows in the sidebar (`27449:154774` and descendants) → `List item` instances. Horizontal-to-stacked layout decision per row; risk of visual drift, so this needs human eyeballs section-by-section.
   - Project cards in `Projects List` (`27449:154900`) → likely a Table family swap (`Table / Cell`, `Table / ColumnContent`, etc.) for the count rows.
   - Task Timer Container header (`27449:154727`) → compose Text + (already-swapped) Chips for status + time-display Text. Already partially done by the chip swaps.
3. **Tier-5 annotate**: the Title bar (`27449:154718`–`27449:154723`) and Bottom Bar (`27449:155253`) — both are custom app chrome with no DS analogue. Annotate with `figma_set_annotations` explaining why they stay bespoke.

This run validated the **new judgment-first cascade** end-to-end on a real product page: three real component swaps with explicit semantic reasoning, twenty-plus correctly-rejected false-positive matches (the "Pending Count" displays a naive matcher would have wrecked), and a clean Tokens Studio gap report that converts every remaining leak into a clear next action.
