# Tasks (List view) — design-system reconciliation

Source file: `gqYWCu1K6dJ9gESXtgNeCi` (TimeWorks Design System (Experiment))
Target frame: `27482:244917` — "Tasks (List view)" on page **Main View — polish**
Reference frame: `27475:2566` — "Start time" (same page; used as the canonical converted-chrome example)
Mode: `work-in-DS-file`, scope = **whole frame, aggressive** (per user)

Screenshots were unavailable this run — `figma_take_screenshot` returned 403 ("Invalid token") for both source and result. All validation is structural (Plugin API readbacks of `mainComponent` + `componentProperties`), no visual diff captured. The Backup frame is the safety net if anything looks wrong.

## Swapped

Each entry below replaced a raw shape or a local FRAME-wrapping-VECTOR with a published-library instance. All instances are `Icon Wrapper` (set `25320:54477`) or `Search` (set `46947:9785`) — confirmed by `mainComponent` readback in this run.

### Chrome — title bar

- **Close Icon** → `Icon Wrapper` (variant `Size=2xs`, icon-swap `circle-xmark`) — node `27482:246874` (replaced raw RECTANGLE `27482:244922`)

### Chrome — bottom bar

- **Settings Icon** → `Icon Wrapper` (variant `Size=md`, icon-swap `gears`) — node `27482:246883` (replaced FRAME-wrapping-VECTOR `27482:245857`)
- **Collapse Icon** → `Icon Wrapper` (variant `Size=md`, icon-swap **left at default**) — node `27482:246892` (replaced FRAME-wrapping-`heroicons-outline/arrows-pointing-in` `27482:245859`). ⚠️ icon unspecified — icon-map has no `compress` / `minimize` / `arrows-pointing-in`; the only inverse-direction match (`arrows-maximize`) is semantically wrong, so the default IW icon was retained rather than picking a misleading one.

### Body — Task Timer Container (left sidebar)

- **Bell Icon** → `Icon Wrapper` (variant `Size=md`, icon-swap `bell`) — node `27482:246901` (replaced FRAME `27482:244930`)
- **Document Icon** → `Icon Wrapper` (variant `Size=md`, icon-swap `file`) — node `27482:246917` (replaced FRAME `27482:244934`)
- **Break Icon** → `Icon Wrapper` (variant `Size=md`, icon-swap `pause-updated`) — node `27482:246992` (replaced bespoke FRAME-of-vectors `27482:244950`)

### Body — Project and Task Container

- **Search (Search Tasks)** → `Search` (variant `Size=Medium, State=Default`, placeholder = "Search Tasks") — node `27482:247015` (replaced FRAME `27482:244963` whose icon was 5 stacked `magnifying-glass-*` raw vectors)
- **Search (Search)** → `Search` (variant `Size=Medium, State=Default`, placeholder = "Search") — node `27482:247039` (replaced nested FRAME `27482:245003` inside Second Project Item)
- **Project Icon** → `Icon Wrapper` (variant `Size=md`, icon-swap `Folder`) — node `27482:246975` (replaced FRAME `27482:245079`)
- **Expand Icon (Project Item 1)** → `Icon Wrapper` (variant `Size=xs`, icon-swap `chevron-down`) — node `27482:246933` (replaced FRAME `27482:244985`)
- **Expand Icon (Project Item 3)** → `Icon Wrapper` (variant `Size=xs`, icon-swap `chevron-down`) — node `27482:246947` (replaced FRAME `27482:245063`)
- **Expand Icon (Project Item 4)** → `Icon Wrapper` (variant `Size=xs`, icon-swap `chevron-down`) — node `27482:246961` (replaced FRAME `27482:245075`)

## Composed

None this run. Every converted section mapped to a single library component family. The bespoke task-timer status text rows ("IDLE — 00:12:34", "Lunch — 00:30:00") are containers of TEXT children at fixed offsets, not Chip-shaped — they fell through to "Already connected / not a swap candidate" rather than composing.

## Already connected

- None. Before this run the target frame had **zero** library instances on it — its title row, bottom bar, and all body icons were raw shapes or local FRAME wrappers around bare VECTORs.

## Blocked

These nodes remain raw and are **intentionally preserved** under Rule 3/5 of the skill (no DS equivalent + token-binding pass not run this conversation):

- **Title Background** (`27482:244918`) — full-width RECTANGLE for the titlebar chrome. No DS component for a window titlebar background; left raw. Fill is a single hex value; would be the first Rule-4 target on a follow-up.
- **Title** TEXT "TimeWorks-Windows 1.6" (`27482:244919`), **Logo** RECTANGLE (`27482:244921`), **Vector 22698 / 22699** — titlebar widgets matching the reference's `Frame 7` / `Frame 8` layout but not regrouped this run. They stayed at root level; functionally identical to before.
- **Vector 22703 / 22702 / 22705 / 22706** — internal dividers / decorative strokes inside Main Content. No DS Divider was applied; rectangle backgrounds 4699 / 4704 / 4707 / 4730 likewise stayed raw.
- **Task Summary Container** (`27482:244928`) GROUP — Total Time TEXT "01:15:22", Elapsed/Title/Separator TEXTs. Bespoke timer layout; no DS family fits. Rule 4 (token-bind) would polish typography but no swap is appropriate.
- **Task Status Container** (`27482:244943`) — Idle Status / Break Duration text rows. Pattern looks chip-adjacent but is laid out as TEXT triplets in a flat FRAME, not a pill. Would only become a `Chip` after restructuring; left as-is per skill's "never reshape silently" rule.
- **Project Task Content** (`27482:244974`) and the 11 **Project Item / Project Header / Project Details** frames in the right pane (`27482:245134…245799`) — a custom projects-list layout. Could be partially expressed as `List item`, but each row has bespoke geometry and multiple Vectors per row; left as-is for now.
- **Rectangle 4697** (`27482:245856`) bottom-bar background VECTOR — no DS equivalent for a chrome-bar background.

## Raw-value leaks

The leak audit walker (Step 9.5) was **not run** this conversation — every Tier-1 section in this report is a single library instance, and the skill explicitly excludes descendants of library instances from leak detection ("their styling resolves through the library's own bindings"). No composed sections to scan. If you'd like a raw-value pass over the remaining Blocked sections (which is where the actual hex/px values still live), that's a separate Rule-4 token-binding run.

✓ No raw values detected in converted (Tier-1) sections.

## Screenshots

| Stage              | Source | Result |
| ------------------ | ------ | ------ |
| Full target        | ❌ 403  | ❌ 403  |
| Per-section diffs  | ❌ 403  | ❌ 403  |

Screenshot REST endpoint returned `403 Invalid token` for the bridge's API key both before and after the run. Mutation correctness was verified by Plugin API readbacks on every new instance (`mainComponent`, `componentProperties["icon#879:6"]`, TEXT descendants' `.characters`). To eyeball the result, open the Figma file — node `27482:244917` is the converted target; `27482:245914` is the untouched backup placed one frame-width to its right.

## Backup

Backup frame: `Backup - Tasks (List view)` (node `27482:245914`), placed at `(x=1221, y=6267)` — directly to the right of the original. Restore by deleting the converted target and renaming this back.

## Notes / follow-ups

- **Chrome regrouping not applied.** The reference's `Frame 9` titlebar (Logo+Title in `Frame 7`, close-icon group in `Frame 8`) cleanly groups what's currently 6 root-level loose nodes on the target. The icon swap was the high-value change; regrouping is cosmetic structure that would need either auto-layout decisions or absolute-positioning preservation per-node. Skipped per the skill's bias against silent reshapes.
- **Collapse Icon left with default icon.** As called out above, `arrows-pointing-in` has no semantic equivalent in `icon-map.json`. Either add a `compress` / `arrows-pointing-in` entry to the icon map, or accept the default.
- **Body Rule-4 (token-binding) pass not run.** The conversation focused on substitutions. The Title Background fill, the Task Timer Container backgrounds, and most TEXT colors/sizes inside the Blocked sections are still raw values. A follow-up Rule-4 pass would bind those to nearest DS tokens.
