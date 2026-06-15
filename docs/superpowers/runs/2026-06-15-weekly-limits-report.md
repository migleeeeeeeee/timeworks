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
