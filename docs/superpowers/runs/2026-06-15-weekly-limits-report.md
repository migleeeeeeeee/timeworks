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

## Task 8 — Empty state (frame `28700:414073`)
- Transformed in place (kept template astronaut-cat illustration): header/toolbar/caption like by-Member; copy → "No data for the selected range" + "No weekly limit data for Nov 16 – Nov 22, 2025…"; buttons Adjust date range / Clear filters retained.
- This frame's toolbar keeps the labelled "Filters" button (vs the icon-only one elsewhere) — acceptable variant from the Empty template.

## Task 9 — Loading state (frame `28702:421564`, cloned from by-Member)
- Replaced every row cell's content with a Skeleton rectangle (radius 4, ~55% cell width, bound to `secondary-background-color`); member group headers kept live. 50 skeletons.

## Task 10 — Progress Bar Variants reference (frame `28702:422374`)
- Standalone card: title + 3 rows — Under limit (blue 77%), At limit (amber 100%), Over limit (red 112%, red label). Same bar builder.

## Task 11 — QA
- Token-leak audit: fixed 20 unbound percentage labels (→ `primary-text-color`, over-limit → `negative-color`) and 5 raw-white account-avatar backgrounds (→ `primary-background-color`).
- Remaining leaks are DS/template internals only: icon glyph VECTORs (198) and account-avatar "A" initials (5) — inherited chrome shared with sibling report pages, not authored here.
- **Section absorption fix:** the section had spatially captured two pre-existing page elements (Sparkline `28498:206635`, Manage Widgets modal `28529:397690`) overlapping the Empty frame. Ejected both back to the page at their original absolute position, then relocated the whole section to clear canvas (x0, y29000, below all content at maxY≈28104). Final section has exactly the 6 frames.

## Revisions (post-review)
- **Table width:** columns were leaving ~396px dead space on the right (content area is 1796−40 padding = 1756). Redistributed to `[360, 320, 320, 440, 316] = 1756` across header + rows on all four tables (by-Member, by-Week, Loading, Filters-Open) so Remaining sits at the right edge.
- **Filters popover → DS component instance:** replaced the hand-built popover frame with a clone of the DS **Filter Dropdown** (`28326:224825`, main `27842:638817`). Hid the header (`header.visible=false`). Built a content component **"Weekly Limits — Filters Content"** (`28702:425918`: Filters/Saved-Filters tabs + Filter Body/Teams + Filter Body/Members) and `swapComponent`'d it into the body `_Slot` (the slot instance was the body's "Filter Body / Members" child). Set `layoutSizingVertical='HUG'` on slot+body+root so content isn't clipped. Footer: relabeled the two DS buttons to Clear Filters (Secondary) / Save Filters (Primary); hid the Stepper + left checkbox. New popover instance `28702:425800`; content master sits below the section at y≈31700.

## Result
Section `28700:413404` "Weekly Limits Report" on page `27823:196653` — 6 frames complete and verified: by-Member, by-Week, Filters Open, Empty, Loading, Progress Bar Variants (ref).
