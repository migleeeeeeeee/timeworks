# Hybrid rebuild — REVERTED

- **File**: TimeWorks Design System (Experiment) — `gqYWCu1K6dJ9gESXtgNeCi`
- **Source URL**: https://www.figma.com/design/gqYWCu1K6dJ9gESXtgNeCi/?node-id=27615-176350
- **Source node**: `27615:176350` "Timesheets" (employee view - UI page)
- **Template node**: `25730:16658` "Mockup w/ Sidebar — Expanded"
- **Mode**: hybrid (figma-hybrid-page-rebuild)
- **Date**: 2026-05-14
- **Outcome**: User chose `revert` at the C5 visual-confirm gate. Rebuild discarded, original restored from backup.

## Restored state

The backup frame was renamed back to `Timesheets` and moved to the original `(x: 0, y: 4936)`. Node id of the restored frame is `27615:177653` (this is the previous backup's id — Figma keeps that id; the original `27615:176350` was deleted in step 10c and is gone).

## What was attempted before revert

Step 1–9 of the pipeline ran cleanly:

| Step | Result |
|---|---|
| Connection | ✅ DS Experiment file open & active |
| Source inspect | ✅ 6 main-column sections detected |
| Backup | ✅ `Backup - Timesheets` cloned at `(x: 1920+200, y: 4936)` |
| Template clone | ✅ cloned at source position |
| Source unique sections | ✅ 3 brought (`Frame 1707484616`, `1707484609`, `1707484749`) per user selection |
| Template replaceables removed | ✅ Activity Timeline, Bottom Containers, Screenshots Container |
| Slot-map text patching | ⚠️ 0 patched / 9 unresolved (source uses Frame-numbered names; slot-map expects canonical `date range selector` / `stat-cards row > card N` paths) |
| Pattern-swap (LPB) | ✅ 0 candidates, 0 swapped |
| Token-binding (first pass) | ✅ texts 181, fills 244, strokes 42, radii 206 — 0 errors |
| Card-border (first pass) | ⚠️ 0 candidates (body container is on BLOCKLIST → cards inside excluded) |
| Audit leak count | ✅ 0 |

## Mid-run "fix" iteration

After the first C5 prompt the user requested:

1. Use the graph at `25730:21454` ("Activity Table" frame on the *Design suggestions* page).
2. Use DS buttons.
3. Add layout-border to cards, radius 16.
4. Use DS divider.

Applied:

| Change | Result |
|---|---|
| Replaced `Frame 1707484616` with cloned `Activity Table` (1796×776) at body-container position 1 | ✅ new node `27616:182543` |
| Re-ran token-binding on the new content | ✅ fills 11, radii 92, 0 errors |
| Swapped 6 detached buttons → DS Button (`46939:91505`) | ✅ 5×XS + 1×Small, labels preserved (5× `View Screenshots`, 1× `01 Alert`) |
| Inserted 3 horizontal DS Dividers (`46946:1080`) between body sections | ✅ ids `27616:183298`, `183300`, `183302` |
| Layout-border + radius 16 on 3 body sections | ✅ bound to `layout-border-color` + `space-16`; added `primary-background-color` fill to 2 sections that had no fill |
| Final leak audit (with INSTANCE root excluded) | ✅ 0 |

The user reviewed and chose `revert` regardless of the clean mechanical passes.

## Notes for the designer

- The rebuilt frame visually replaced the source table with a chart-style "Activity Table" component preview. That swap loses the original timesheet rows; if you want to keep the original table content AND get the Activity Table graph, the next attempt should insert Activity Table *additionally* (e.g. above the existing table) rather than as a replacement.
- The slot-map (`slot-map.json`) currently keys off canonical Figma names (`main column > date range selector > user info container > user name`, etc.). The source's main column uses `Frame 1707483994` / `Frame 1707484133` etc., so none of the stat-tile / user-name slots matched. To make the template chrome reflect source data on a future run, either rename the source frames to match the canonical names or extend the slot-map with a `byFrameId` recipe.
- The card-border pass blocklist includes `frame 1707485095` (the body container). That means children inside it are excluded — only top-level body sections (3 of them) ended up bordered when I forced the pass.

## Backup

The restored frame `27615:177653` is now the live "Timesheets". No leftover artifacts on the page.
