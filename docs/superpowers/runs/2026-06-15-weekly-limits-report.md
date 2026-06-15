# Weekly Limits Report — build run

Date: 2026-06-15
Section: `28700:413404` ("Weekly Limits Report") on page `27823:196653` (Timeworks Web)
File: TimeWorks Design System — Experiment (`gqYWCu1K6dJ9gESXtgNeCi`)

## Task 1 — clone + rename
Done. Cloned template section `28116:272798`. Children after rename:
- `28700:413405` Weekly Limits — by Week
- `28700:413674` Weekly Limits — by Member
- `28700:413945` Weekly Limits — Filters Open
- `28700:414073` Weekly Limits — Empty

Removed cloned extras: Filter Dropdowns, Date Picker.
Screenshot confirmed clone intact.

## Task 2 — page header (both primary frames)
- Title → "Weekly Limits Report"; breadcrumb "Reports / Weekly Limits".
- Export button → Kind=Primary, label "Export" (keeps arrow-up-right, Icon=Right).
- Added "Button / Schedule" (Kind=Secondary, Icon=Left, glyph swapped to `calendar-clock` 25321:16328) left of Export.
- Inner TEXT set directly (component TEXT prop doesn't render — see memory).

## Task 3 — toolbar (both primary frames)
- Added "View Tabs" (cloned from Group By Tabs): Me=normal, All=selected.
- Replaced Group By Tabs with "Group By Dropdown" (cloned date dropdown, 180px): text "Member" / "Week".
- Date range text → "Nov 16 – Nov 22, 2025".
- Consolidated active-filter chips to two: "Teams · 2", "Members · 5"; un-hid the "Filter Chips" frame (was visible=false in template).

## Task 3.5 — org/timezone caption
- Deleted "Summary Counts" stat tiles on both frames; inserted caption TEXT "Abroadworks · GMT+8 (Asia/Manila)" (Karla Medium 12, bound to secondary-text-color) in their place above the table.

## Task 4 — by-Member table (table `28700:413734`)
- Columns: Date→Week, Team→Time Spent, Shift→Weekly Limit, Start Time→Percentage Used (PctCell), Required→Remaining; deleted Status/Actual/Late. Widths 300/220/220/420/200.
- Member name stays in the group header (avatar+name); rows lead with Week.
- Seeded 10 rows across bands (70,77,80,84,90,95,100,104,112,100); over-limit rows show negative Remaining.
- **Perf note:** `loadFontAsync` per-node is what blows the 7s `figma_execute` timeout, NOT resize. Fonts persist for the session — preload once (or rely on prior load) and set `.characters` without re-loading.

## Task 5 — Percentage Used bars
- Linear Progress Bar structure: `Progress bar > [Track, Fill(SLOT) > Fill(RECTANGLE)]`, track 242px, layout NONE.
- Per cell: instance Primary/Small/Label=Off (`46946:16402`) for ≤100, Negative (`46946:16406`) for >100; resize inner Fill rect to `min(pct,100)/100 × 242`.
- Amber band (85–100): rebind inner Fill paint to `warning-color` + re-set opacity=1 (token-bind opacity gotcha).
- Label text `pct%` (Karla Regular 14) appended in a horizontal PctCell; over-limit label bound to `negative-color` (red).
- Verified: blue 70/77/80/84, amber 90/95/100, red 104/112 with red labels.

## Task 6 — by-Week table (table `28700:413462`)
- Columns: Member (avatar+name, kept) · Time Spent · Weekly Limit · Percentage Used · Remaining; deleted Status/Actual/Late.
- 4 date group headers → week ranges ("SUN, NOV 16, 2025 – SAT, NOV 22, 2025" etc., uppercase).
- 10 rows seeded across bands; bars added (same builder). Verified clean.
- Removed leftover "Filter options" template popover that was floating over the table (cloned from by-Date frame).

## Task 7 — Filters popover (frame `28700:419071`, re-cloned from by-Member)
- Replaced the old Filters-Applied frame by re-cloning the finished by-Member frame into the same slot, then overlaid the popover.
- Popover `28700:419480`: VERTICAL auto-layout, 382w, radius 12, `Shadow/Large` effect style, absolute-positioned (layoutPositioning='ABSOLUTE') anchored at rel (489,181) under the Filters icon button — required because the frame root is HORIZONTAL auto-layout (Sidebar+Main Container), so a normal child lands in-flow.
- Tabs header: Filters (selected) / Saved Filters. Body: Filter Body / Teams (`28326:225027`) + Filter Body / Members (`28325:224200`) instances. Footer: Clear Filters (tertiary) + Save Filters (primary).
- Background: absolute Rectangle "Popover BG" bound to `primary-background-color` (STRETCH constraints).
- **Capture gotcha:** `figma_capture_screenshot` of the WHOLE frame renders absolute-positioned overlays at reduced opacity (table bleeds through) — a compositing artifact, NOT the real canvas. Capturing the popover node in isolation shows it fully opaque. Verify overlays by capturing the overlay node directly.
