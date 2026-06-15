# Manager Dashboard "Main View" — design-system reconciliation

**Source:** `tvclyUsdCAYDSkSPRlNYut` / node `3685:7078` ("Main View")
**DS library:** `gqYWCu1K6dJ9gESXtgNeCi` (TimeWorks Design System — Experiment)
**Reference:** `25730:16658` ("Mockup w/ Sidebar — Expanded") for bg + card recipe
**Mode:** in-place rebuild in source file, using cross-file `importComponentByKeyAsync`

## Outcome

Frame `3685:7078` was rebuilt in place:

- **Resized** 1400×965 → 1920×1611.
- **Layout** `NONE` → `HORIZONTAL` auto-layout.
- **Background** replaced with the reference recipe: solid `#F9FBFD` + 15%-opacity linear gradient (blue → violet → cyan), 12px corner radius.
- **Original 9 children dropped** (Title Background, Title, Logo, Close Icon, Vectors, Main Content, Bottom Bar). Backup retained at `3689:24206`.

## Swapped / Composed

- **Sidebar** (`3689:29951`) — remote instance of Experiment component `659c71c05d0baa1fea56052e4d12cf009564fe96` (State=Collapsed), imported via `figma.importComponentByKeyAsync`. Resolves as `remote: true`.
- **Main Container** (`3689:30149`) — vertical auto-layout, fills remaining width.
  - **Header** (`3689:30150`) — 57px placeholder band, no fill.
  - **Content** (`3689:30151`) — radius 18, padding 24/16/16/16, gap 12. Contains:
    - **Date Range Selector** — horizontal frame, no card styling (matches ref).
    - **Stat Row** — 4 stat cards using DS glass recipe (fill `rgba(255,255,255,0.08)`, stroke `rgba(15,23,42,0.18)`, radius 16, padding 20/24, gap 16).
    - **Activity Timeline** — single glass card, 246h.
    - **Bottom Containers** — 2 glass cards side-by-side, 260h.
    - **Screenshots Container** — single glass card, 632h.

All card styling values are sourced verbatim from the reference inspection of `25792:117764` / `25792:117947` (Experiment file).

## Blocked

- **Card token bindings** — in the Experiment file the card fills/strokes are bound to local variables `VariableID:46810:1492` and `VariableID:46810:1527`. Those IDs are file-local; from the Manager file they were applied as raw color + opacity. If the Experiment library publishes those tokens as remote variables, the bindings can be re-attached later.
- **Card content** — cards are intentionally empty shells. The user opted to "match reference layout, ignore source content", so labels, charts, table rows, etc. are not populated.

## Already connected

The Sidebar instance is the only DS-bound component. The remaining frames are local DS-styled containers, not library instances.

## Backup

- `3689:24206` — `Backup - Main View (legacy)` on the same page (Desktop Application (design update)), positioned 200px to the right of the original.

## Notes

- REST screenshots returned 403 throughout the run; visual validation was done via Plugin-API inspection (fills, strokes, radii, layout, mainComponent resolution + `remote === true` check).
- One stray clone (`27444:134607`) had been created in the Experiment file during an earlier scoping attempt — confirmed removed.
- The Figma Desktop bridge had two transient timeouts during the run; both recovered on retry. No partial state left behind.

## Open follow-ups

- Populate card contents (the reference frame has full content; this rebuild only carries structure).
- Re-bind card fills/strokes to published Experiment variables once those are available as remote tokens in the Manager file.
- If/when the Experiment file is published, consider swapping `3689:24206` (backup) to archive or removing it.
