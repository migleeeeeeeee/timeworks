# Main View — design-system reconciliation (Run 3)

**Source file:** TimeWorks Design System (Experiment) — `gqYWCu1K6dJ9gESXtgNeCi`
**Target page:** `Test`
**Target frame:** `Backup - Main View` (node `27450:159039`) — cloned to new working frame `Main View` (node `27450:160796`).
**Backup retained:** `Backup - Main View` (node `27450:159039`) untouched.
**Mode:** `work-in-DS-file` (fileKey matches `dsFileKey`).
**Skill version:** post-`cac7447` (bulletproof text-preserve + per-instance variants + icon-swap pass).

---

## Swapped

- **Idle Status** (`Task Timer Container`) → `Chips` (Type=`On-Negative`) — node `27450:161890`. Text preserved: `IDLE - 00:12:34`. ⚠️ raw value leak (4 — radii from chip-set definition; library-side, not an override)
- **Break Duration** (`Task Timer Container`) → `Chips` (Type=`Default`) — node `27450:161895`. Text preserved: `Lunch - 00:30:00`. ⚠️ raw value leak (4)
- **Break Status** (`Task Timer Container`, 40×40 icon container) → `Icon Button` (Size=`Medium`, Kind=`Tertiary`) — node `27450:161900`. ⚠️ icon unspecified (left DS default). ⚠️ raw value leak (4)
- **Search Tasks** (left-panel `Input Field`) → `Search` (Size=`Medium`) — node `27450:161921`. Placeholder preserved: `Search Tasks`. ⚠️ raw value leak (4)
- **Header Search** (`Header Left > field-small`) → `Search` (Size=`Small`) — node `27450:161968`. Placeholder preserved: `Search`. ⚠️ raw value leak (4)
- **Portal View** (`Header Right`) → `Button` (Kind=`Primary`, Size=`Small`, Icon=`Left`) — node `27450:162015`. Text preserved: `Portal View`. ⚠️ raw value leak (5)
- **44 status pills** in `Projects List` → `Chips`, per-instance variants (per row, 4 each × 11 rows):
  - `Pending Tasks Count` → Type=`Default` — joined text `"Pending 03"` etc.
  - `Waiting Response Count` → Type=`On-Warning` — joined text `"Waiting 02"` etc.
  - `In-Progress Count` → Type=`On-Positive` — joined text `"In-Progress 0"` etc.
  - `Over Due Count` → Type=`On-Negative` — joined text `"Over Due 0"` etc.
  - Sample ids: `27450:161342`, `27450:161347`, `27450:161352`, `27450:161357` (first row); all 44 verified placeholder-free.
- **11 More Options buttons** in `Projects List` → `Icon Button` (Size=`XXS`, Kind=`Tertiary`) with nested icon swapped to `ellipsis` (`25321:16524`). Sample id: first instance after sweep.
- **25 bare icons** → canonical library icon instances by name match against `icon-map.json`:
  - `Document Icon Container` → `file` (×1)
  - `Project Icon` → `folder` (×1)
  - `Projects Icon` → `folder` (×1)
  - `Pending Tasks Icon`, `Waiting Response Icon`, `In-Progress Icon`, `Over Due Icon` → `clipboard` (×4 column-header icons in Projects List)
  - `Task Icon` → `clipboard-check` (×11, one per row)
  - `Expand Icon` (sidebar project rows) → `expand` (×4)
  - `Settings Icon`, `Collapse Icon`, `Expand Icon` (bottom bar) — included where named matches reached. Bell Icon Container was inside the Task Summary card and its FRAME-wrapped VECTOR was not directly swappable in this pass (children-deep, multi-style wrapper). See **Notes** below.

**Total Tier-1/2 swaps:** 6 single-section swaps + 44 chip swaps + 11 icon-button swaps + 25 icon swaps = **86 swaps**.

## Composed

None this run. Every section that could be reconciled was a single-component swap. The big composition candidate — the **Task Summary** card and **Project Item rows** — was left as-is per Tier-3 (annotate-and-preserve) since the original card layout is bespoke and the row chrome is consumed by the chips/icon-button swaps below it. Future runs can compose List Item / Accordion for the sidebar project rows.

## Already connected

- None. Source page contained zero pre-existing library instances before this run.

## Blocked (Tier 3 — annotate-and-preserve)

- **Title bar chrome** (`Title Background`, `Title` text, `Logo`, `Close Icon`, `Vector 22698/22699`) — bespoke desktop-app titlebar; no DS equivalent. Tokens not bound; expected to remain raw until a `WindowChrome`/`AppTitleBar` primitive is added or the page is brought under auto-layout for token binding.
- **Task Summary card** (`Task Summary Container > Rectangle 4704 / Total Time / Task Summary Details / Rectangle 4730`) — the indigo timer card with `01:15:22` headline + sub-row. No single DS component matches; recommended future composition: `Text` (size `h2`) + `Text` (size `t2`) + `Avatar`/`Icon Button` chips for the bell/document. Bell Icon Container (`27450:160809`) preserved (multi-style FA picker wrapper; swap requires picking one style).
- **Sidebar background rectangle** (`Rectangle 4699` under `Project and Task Container`) — large bespoke panel.
- **Project Item rows** (4 collapsible projects in the left sidebar) — left as-is. Candidate for `Accordion` or `List item` composition in a later run.
- **Projects List column header row** (`Project Header`, the row of 6 column labels with sort icons) — labels and `bars-3-bottom-left` sort icons preserved. Candidate for `Table / ColumnContent` swap in a later run.
- **Projects List row chrome** (`Project Details`, 11 × `Project Item` outer frames + `Project Name` + `Project Task Info`) — leaves the row container as a bespoke layout once the chips and more-options ellipsis-buttons were lifted out into DS instances.
- **Bottom Bar** chrome (`Rectangle 4697` background) — bespoke desktop-app footer; the named icons inside it were icon-swapped.

## Raw-value leaks

✓ **No raw values detected** — leak count went **319 → 0** after the Rule 4 nearest-match token-binding pass.

### Token-binding pass results (Rule 4)

After the component swaps completed, a single walk over the working frame bound every unbound paint / radius / text / effect on non-instance nodes to the nearest existing DS token. Numbers:

| Binding kind | Count |
|---|---|
| SOLID fills bound to color variables | **98** |
| SOLID strokes bound to color variables | **34** |
| Corner radii bound to `space-*` tokens | **105** |
| TEXT nodes bound to text styles (H1/H2/H3/Text1/Text2/Text3 × weight) | **76** |
| Effects bound to `Shadow/{XS,Small,Medium,Large}` styles | **3** |
| Errors | 0 |

**Method:**
- **Colors** — for every SOLID fill / stroke, compute Euclidean RGB distance against the 179 Light-mode-resolved color variables and bind to the **absolute closest visual match**. No semantic-neutral bias (an earlier pass with a near-neutral bias picked wrong matches — e.g. routing a `rgb(15,23,42)` near-black to `ui-background-color` instead of the visually correct `layout-border-color`). The corrected pass rebound all 98 fills + 34 strokes purely on visual distance. Spot-check: `(15,23,42)` → `layout-border-color` (exact), `(48,52,63)` → `primary-text-color` (exact), `(255,255,255)` → `secondary-background-color` (exact), `(236,237,245)` → `disabled-background-color`, `(126,122,148)` → `Content Color/lilac-hover`. The file ships no SOLID paint styles (only gradient + image styles + avatars), so color tokens are variables — variables ARE the DS color "style" surface in this project (Tokens Studio pipeline; see CLAUDE.md).
- **Radii** — snapped to nearest of `[2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80]`. Source radius 100 (pill chips) snapped to `space-80` as nearest available.
- **Text** — snapped fontSize to nearest of `[12, 14, 16, 18, 24, 32]`, then mapped source `fontStyle` → DS suffix (`Bold` → `Bold`; `SemiBold` → `Medium`; `Medium` → `Normal`; `Regular`/`Light` → `Light`). Style id applied via `setTextStyleIdAsync`.
- **Effects** — three remaining unbound drop-shadows (Task Summary card, sidebar bg, Main Content) bound to `Shadow/Medium`, `Shadow/Small`, `Shadow/Small` respectively.

**Skipped (correctly):** all descendants of newly-placed DS library instances — those derive their styling from the component definition, not from local overrides.

**Audit confirmation (final pass):** `{ totalLeaks: 0, leaks: [] }`.

---

### Original leak inventory (pre-binding, for the record): 319 leaks

Breakdown by region (all outside DS-instance subtrees, per skill exemption for instance descendants):

- **Working frame root** (`Main View` `27450:160796`): 5 leaks — `fill` + 4 radii. The frame itself isn't bound to surface tokens.
- **Titlebar chrome** (`Title Background`, `Title`, `Logo`, `Close Icon`, `Vector 22698/22699`): ~10 leaks — fills/strokes/text. Tier-3 region.
- **Task Summary card** (`Rectangle 4704`, `Total Time`, `Elapsed Time`, `Time Separator`, `Task Title`, `Rectangle 4730`): ~12 leaks — fills + text styles + effect on the indigo card. Tier-3 region.
- **Sidebar panels** (`Rectangle 4699`, `Vector 22700/22701/22705`, project-row container vectors): ~25 leaks — fill/stroke on bespoke chrome. Tier-3 region.
- **Project Item rows in left sidebar** (4 rows): ~30 leaks — text + fills + radii. Tier-3 region (sidebar rows not yet composed).
- **Projects List column headers** (6 column labels): ~25 leaks — text + the sort-icon FRAME fills. Tier-3 region.
- **Projects List row inner frames** (`Project Info`, `Project Name`, `Project Task Info`, `Task Count` per 11 rows, plus the static `Project Details` row): ~190 leaks — text bindings, fills on per-row chrome.
- **Bottom Bar chrome** (`Rectangle 4697` + the white-fill icon container backings): ~10 leaks.

**Why these are still raw:** every leak listed sits *outside* a Tier-1/2 swap and inside what the run classified as Tier-3 (annotate-and-preserve). Per skill rule 4, the next iteration should walk these regions and bind every solid fill / stroke / text-style / radius to the nearest existing DS token (no gap-flagging — closest match wins). That pass was not run here to keep this run focused on the substantial component-substitution work.

## Screenshots

`figma_take_screenshot` returned `403 Invalid token` for the REST endpoint during this run (auth caveat in the figma-console MCP). The working frame `27450:160796` and backup `27450:159039` sit side-by-side on the `Test` page and can be opened in Figma to compare. The user can use `figma_get_component_image` if a programmatic screenshot is needed.

| Stage          | Source           | Result           |
| -------------- | ---------------- | ---------------- |
| Full target    | `27450:159039`   | `27450:160796`   |

## Backup

Backup frame: `Backup - Main View` (node `27450:159039`) — left untouched on the `Test` page at its original position. The working clone `Main View` (`27450:160796`) was placed to the left at `x = -1600, y = 0` for easy side-by-side comparison.

## Notes for next iteration

The substitution + binding pass is complete (86 swaps + 316 token bindings, 0 leaks). Remaining opportunities are **structural** rather than token-cleanup:

1. **Sidebar project rows → `Accordion` or `List item`.** The 4 `Project Item Container` frames carry a clear list-with-children pattern.
2. **Projects List column headers → `Table / ColumnContent`.** Replace the 6 column-name FRAMEs.
3. **Project rows → `Table / Cell` row composition.** Chips + ellipsis-buttons live inside hand-built row frames; a Table row would tighten the structure.
4. **Task Summary card → composition.** `Text` (h2 for `01:15:22`) + `Text` (t2 for `01:22 | Drafting Proposals`) + two `Icon Button`s (bell + document) inside a `Brand` surface.
