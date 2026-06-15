# Hybrid rebuild — Employee URL's

| | |
|---|---|
| **File** | TimeWorks Design System (Experiment) — `gqYWCu1K6dJ9gESXtgNeCi` |
| **Source URL** | https://www.figma.com/design/gqYWCu1K6dJ9gESXtgNeCi/TimeWorks-Design-System--Experiment-?node-id=27615-170601 |
| **Target node (original)** | `27615:170601` (deleted) |
| **New rebuild node** | `27615:171837` ("Employee URL's") |
| **Template node** | `25730:16658` — Mockup w/ Sidebar — Expanded |
| **Mode** | hybrid (template chrome + inserted source body) |
| **Backup** | `27615:171482` "Backup - Employee URL's" |
| **Date** | 2026-05-14 |
| **Skill** | figma-hybrid-page-rebuild |

## Approach

Cloned the canonical DS template ("Mockup w/ Sidebar — Expanded"), inserted the one section unique to the source (the seven-day URL-log body), removed the template's stat/timeline/screenshot bodies, then ran token-binding + dual-pass adjustments. After the user reviewed visuals, completed an iterative fix loop covering: card backgrounds (rebuilt as RECTANGLEs with 16px radius bound + layout-border-color stroke), text hierarchy (link texts to `primary-color`, body to `primary-text-color`, column headers to `secondary-text-color`), auto-layout conversion of each day GROUP into a vertical-auto-layout FRAME with token-bound 16px padding and itemSpacing, divider swap to the DS `Divider` (horizontal) component, and explicit icon-color binding on the invisible icon vectors.

## Sections brought from source

| Source name | New node id in rebuild |
|---|---|
| `Frame 1707484517` — 7-day URL log body (1768×924) | `27615:173354` (renamed children: `Day Card 1`…`Day Card 7`) |

The source's `title` and toolbar sections were intentionally dropped — the template's header / Date-range / toolbar chrome replaces them.

## Template sections removed

- `Activity Timeline` (`27615:171893`)
- `Bottom Containers` (`27615:171970`)
- `Screenshots Container` (`27615:172056`)

Also removed during user-driven cleanup: the template's `Frame 1707484994` stat-tile row (this page has no per-employee stats).

## Text slots patched

All 9 slot-map recipes were **unresolved** because the source has no stat-cards row and no date-range user-info section. Template defaults remain in those slots. Listed for transparency:

| Template slot | Source path expected | Status |
|---|---|---|
| `… > User Info Container > User Name` | `main column > date range selector > user info container > user name` | ⚠️ source-path-missing |
| Stat cards 1–4 `Activity Title` | `main column > stat-cards row > card N > activity title` | ⚠️ source-path-missing (×4) |
| Stat cards 1–4 `Activity Value` | `main column > stat-cards row > card N > activity value` | ⚠️ source-path-missing (×4) |

The stat-tile row was subsequently removed entirely, so 8 of these slots are moot.

## Pattern swaps applied

| Pattern | Candidates | Swapped |
|---|---|---|
| Linear Progress Bar | 0 | 0 |

No track-and-fill progress bars in this page.

## Token-bindings applied

| Pass | Texts | Fills | Strokes | Radii | Visited | Skipped (instance internals) |
|---|---|---|---|---|---|---|
| 9b initial | 62 | 85 | 15 | 119 | 218 | 39 |

## Card borders / radius

- Card-border pass (FRAME-only detector): 0 candidates — source body uses GROUPs.
- During the fix loop, 7 card backgrounds were rebuilt as RECTANGLEs with 16px radius bound to `space-16` and 1px stroke bound to `layout-border-color`.
- Card frames after auto-layout conversion: white fill (`secondary-background-color`), 16-radius bound, 1px layout-border-color stroke, 16px padding bound to `space-16`, 16px itemSpacing bound to `space-16`.

## Auto-layout conversion

All 7 top-level day GROUPs converted to FRAMEs (`Day Card 1`…`Day Card 7`) with `layoutMode: VERTICAL`, `primaryAxisSizingMode: AUTO`, `counterAxisSizingMode: FIXED`, `layoutAlign: STRETCH`, `layoutSizingHorizontal: FILL`, token-bound padding + itemSpacing. Inner BG rectangles/vectors discarded — card visual now lives on the frame itself.

## Text-hierarchy re-binding

Nearest-color heuristic in the initial pass mis-assigned several text fills (link counters → `fixed-light-color`, content rows → `Content Color/pecan-hover`). Explicit re-bind pass:

| Bucket | Count | Token |
|---|---|---|
| Link-style texts (Text2 / Normal-link) | 10 | `primary-color` |
| Day headers + content rows | 53 | `primary-text-color` |
| Column headers (`Project`, `Website Title`, `Time Spent`, `Time`, `Date`) | 5 | `secondary-text-color` |

Total body texts: 68.

## Divider component swap

| From | Count | To |
|---|---|---|
| Raw `Vector 22666` / `Vector 22667` (2px stroke bound to `ui-background-color`) | 5 | DS `Divider` instances — variant `Orientation=horizontal` (`46946:1081`) |

## Icon visibility fix

| Action | Count |
|---|---|
| Inner VECTORs with no visible fill detected | 2 |
| Bound to `icon-color` | 2 |

The remaining icon instances inherit fills from DS components.

## Raw-value leaks

✓ No raw values detected. (Final audit after all passes.)

## Exit gate

| Check | Result |
|---|---|
| **C1** — at least 1 source section inserted | ✅ 1 inserted (URL log body) |
| **C2** — 0 raw-value leaks | ✅ 0 |
| **C3** — 0 unbordered cards | ✅ 0 (7 rebuilt as bordered card frames) |
| **C4** — 0 unswapped pattern matches | ✅ 0 |
| **C5** — user visual confirm | ✅ "y" after iterative fix loop |

Screenshot via REST: skipped (403 — metadata-only run).

## Backup

- Name: `Backup - Employee URL's`
- Node id: `27615:171482`
- Location: same page (`employee view - UI`), 200px to the right of the rebuild.

Delete the backup when confident the rebuild is final.

## Notes for the designer

- The source had no stat-tile data; the template's stat-tile row was removed manually. If a stats row should be added back later, recreate using DS stat-tile components rather than the deleted template defaults.
- Slot-map for this page yielded zero matches — paths in `slot-map.json` are tuned to the canonical "Manager Dashboard" source shape, not to the URL-log shape. If similar URL-log pages are converted in future, add slot recipes targeting `main column > Frame 1707484517` and a per-day-header substring rule.
- Auto-layout was applied during the fix loop, not in the base pipeline. The base skill leaves source GROUPs intact; converting them to FRAMEs is a one-off here. A future skill enhancement could detect "card-shaped GROUPs in inserted bodies" and auto-convert.
- Two `Right Icon` chevron instances next to each "Date: January Xth" remain at 12px — they read as expand affordances. Confirm whether that interaction is intended; the chevron points down by default.
