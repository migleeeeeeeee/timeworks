# Hybrid rebuild — Timesheets (employee view - UI)

- **File**: TimeWorks Design System (Experiment) — `gqYWCu1K6dJ9gESXtgNeCi`
- **Source URL**: https://www.figma.com/design/gqYWCu1K6dJ9gESXtgNeCi/?node-id=27615-176350
- **Source node (restored)**: originally `27615:176350`; after a first-pass revert the restored backup became `27615:177653`, which was the input to the successful re-run
- **Template node**: `25730:16658` "Mockup w/ Sidebar — Expanded"
- **Rebuilt node**: `27616:184144` "Timesheets" (at original x:0, y:4936)
- **Backup**: `27616:183480` "Backup - Timesheets" (delete when you're confident)
- **Mode**: hybrid (figma-hybrid-page-rebuild)
- **Date**: 2026-05-14

## Approach

Re-ran the hybrid skill after the user reverted the first attempt. Key intent shifts from the original run, given mid-session feedback:

1. **Activity Table is additive, not a replacement.** A clone of the `Activity Table` graph (node `25730:21454`) was inserted *above* the original timesheet table rather than swapping it out. Later in the run the user dropped the original timesheet table (Frame 1707484616) entirely, leaving the Activity Table to stand alone as the time-tracking visualization (it already contains the Activity Bar pattern with off/active/lunch/break buckets per employee row).
2. **DS Buttons swapped where safe.** Detached `Button` frames whose parent was a *FRAME with auto-layout* were swapped to DS `Button` instances (Kind=Primary, Size=XS for 24h-tall ones, Size=Small for 30h). Detached buttons inside GROUP parents were left alone after two failed attempts — see *Known issues*.
3. **DS Divider between sections.** Horizontal `Divider` (`46946:1080`) instances inserted between every adjacent body section.
4. **Card border + 16 radius.** Each remaining body section was given a 1px `layout-border-color` stroke and all four corners set to `space-16`; a `primary-background-color` fill was added to sections that had no fill so the border has surface to wrap.

## Sections brought from source

| Source section | Result | New node |
|---|---|---|
| `Frame 1707484616` (original timesheet table) | Inserted, then removed at user request after seeing the Activity Table covers the same intent | gone |
| `Frame 1707484609` ("Recent time tracked") | Inserted, token-bound, bordered + r=16 | `27616:187814` |
| `Frame 1707484749` ("Time Changes") | Inserted, token-bound, bordered + r=16 | `27616:186125` |
| **Activity Table** (additionally, from `25730:21454`) | Inserted at top of body, bordered + r=16 | `27616:185472` |

## Template sections removed

| Template body child | Reason |
|---|---|
| `Activity Timeline` | Per `replaceableBodyChildren` |
| `Bottom Containers` | Per `replaceableBodyChildren` |
| `Screenshots Container` | Per `replaceableBodyChildren` |

The template's `Frame 1707484994` stat-tile row was preserved as-is per `preserveBodyChildren`.

## Final body order

```
Frame 1707484994 (stat tiles, 156h)
Divider
Activity Table (776h)
Divider
Frame 1707484609 (743h)
Divider
Frame 1707484749 (~393h)
```

## Text slots patched

0 patched / 9 unresolved. Same root cause as before: `slot-map.json` keys off canonical names (`main column > date range selector > user info container > user name`, `main column > stat-cards row > card N > activity title|value`) but the source's main column uses `Frame 1707483994` / `Frame 1707484133` etc.

| Slot | Status |
|---|---|
| `… > Date Range Selector > User Info … > User Name` | ⚠️ source path not found |
| Stat-card 1–4 Activity Title (×4) | ⚠️ source path not found |
| Stat-card 1–4 Activity Value (×4) | ⚠️ source path not found |

→ Designer follow-up: either rename source frames to the canonical names, or extend `slot-map.json` with a fallback recipe (e.g. `byFrameId` or `pickByPosition`).

## Pattern swaps applied

| Pattern | Candidates | Swapped |
|---|---|---|
| Linear Progress Bar | 0 | 0 |

## Token-bindings applied

Cumulative across the body insertions:

| Property | Count |
|---|---|
| Texts → text styles | 181 + 44 = 225 |
| Fills → color vars | 255 + 64 = 319 |
| Strokes → color vars | 42 + 7 = 49 |
| Radii → space vars | 298 + 33 = 331 |

Zero binding errors.

## DS component swaps

| Component | Swapped | Notes |
|---|---|---|
| `Button` (`46939:91505`) | 7 instances (6× XS "View Screenshots", 1× Small "01 Alert") | All swaps were inside *auto-layout FRAME* parents in the Activity Table. The 5 detached `Button` frames inside Frame 1707484609 GROUPs were *not* swapped — see *Known issues*. |
| `Divider` (`46946:1080`) | 3 instances (Orientation=horizontal), inserted between body sections | Resized to current row width on insert |

## Card borders applied

| Section | Border | Radius |
|---|---|---|
| Activity Table | ✅ | r=16 (bound to `space-16`) |
| Frame 1707484609 | ✅ | r=16 |
| Frame 1707484749 | ✅ | r=16 |

`primary-background-color` fill was added to Frame 1707484609 and Frame 1707484749 (they had no fill in source, so the border needed a surface).

## Raw-value leaks

✓ **No raw values detected.** Audit run with INSTANCE roots excluded (their styling is governed by the main component); 0 leaks.

## Exit gate

| Check | Result |
|---|---|
| C1 — ≥1 source section inserted | ✅ (Activity Table + Frame 1707484609 + Frame 1707484749) |
| C2 — leakCount == 0 | ✅ 0 |
| C3 — unborderedCardCount == 0 | ✅ 3/3 body sections bordered |
| C4 — unswappedPatternMatches == 0 | ✅ 0 LPB candidates |
| C5 — user visual confirm | ✅ user accepted after iterative fixes (re-clone Frame 1707484609 from backup to undo height balloon, then accept that detached buttons inside its GROUPs would remain unswapped) |

## Known issues / Designer follow-up

1. **Buttons inside GROUPs are still detached.** Frame 1707484609 contains 5 detached `Button` frames inside `Group 7041`/`Group 7040`/`Group 7044`/`Group 7049`/`Group 7050` (each is a "View Screenshots" XS button). Two automated swap attempts inside GROUP parents triggered chain-reaction height balloons via the parent auto-layout (the GROUP bounding box inflates the instant the new INSTANCE is inserted, before its x/y can be re-set — even when x/y is set before `insertChild`). The fresh re-clone path skipped these to avoid the issue. **Action**: swap these by hand in Figma — select each Button group, drop in DS Button XS via the assets panel.
2. **Slot-map missed all 9 slots.** See *Text slots patched* — extend `slot-map.json` so the User Name + stat-tile title/value resolve from source on the next run.
3. **Tooltip inside Activity Table has its own stroke** (radius 12) and was not re-bordered — it's not a "card", it's a tooltip.

## Backup

`Backup - Timesheets` at node `27616:183480` (positioned ~2120px to the right of the rebuilt frame). Delete when satisfied with the rebuild.
