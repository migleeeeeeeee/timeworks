# View & Edit Timesheets — Daily mode — page build

- File: `gqYWCu1K6dJ9gESXtgNeCi` (TimeWorks Design System — Experiment)
- Source ref (image only): user-supplied screenshot of View & Edit Timesheets day-list
- Target page: `Admin Manager View` (node `27823:196653`)
- Layout reference: `Daily Report — All view (default) [F1]` (node `27828:406484`)
- New frame: `View & Edit Timesheets — Daily mode` (node `27945:1059248`) placed to the right of the layout reference on the same page

## Approach

Cloned the Daily Report layout, reused the sidebar / header / toolbar chrome, then replaced the body content (Chart Card + Daily Report table) with the day-list pattern from the image. All new content built from DS primitives (Button, Icon Button, Dropdown, Table Footer) with fills, text styles, and strokes bound to DS Color Tokens variables.

## Header

- Breadcrumb texts updated → `Dashboard / Timesheets / View & Edit Timesheets`
- Trailing two breadcrumb crumbs + trailing `/` hidden

## Toolbar

- Wrapped left-side controls in new `Toolbar Left` auto-layout frame
- Added filter `Icon Button` (Size=Medium, Kind=Tertiary) — node `27946:1059849`
- Added `Dropdown` placeholder = "Saph" (Size=Medium) — node `27946:1059859`
- Repurposed `Me/All Toggle`: renamed segments → `Daily` / `Weekly`, reordered so Daily (active variant) is first
- Hid `Past Week` and `Past Month` buttons
- Kept `Icon Button / Prev`, `Icon Button / Next`, date-range `Dropdown` ("Apr 24, 2026 - Apr 30, 2026"), and `Icon Button / Kebab`

## Body content

Removed: `Chart Card` (node 27945:1059277) and `Daily Report Card` (node 27945:1059303).

Added inside body wrapper (node `27945:1059263`):

| Section | Node |
|---|---|
| Total Time Card | `27946:1060005` |
| Day Card / Thursday (Apr 30) | (first batch) |
| Day Card / Wednesday (Apr 29) | (first batch) |
| Day Card / Tuesday (Apr 28) | `27946:1060123` |
| Day Card / Monday (Apr 27) | `27946:1060139` |
| Day Card / Sunday (Apr 26) | `27946:1060155` |
| Day Card / Saturday (Apr 25) | `27946:1060171` |
| Day Card / Friday (Apr 24) | `27946:1060187` |
| Table Footer (pagination) | `27946:1060203` |

Each day card has:
- Header row: blue rounded-square date badge (APR + day number), Day name (H3/Medium), "April 2026" (Text2/Normal secondary), Total Duration label (Text3 secondary) + "00:00:00" (H3/Bold) on the right
- Empty-state body: "No time entries recorded for this day" (Text2 secondary) + `Add Time` Button instance (Size=Medium, Kind=Primary)

## Pattern swaps / DS components used

- `Icon Button` — filter (toolbar) + existing prev/next/kebab in toolbar
- `Dropdown` — Saph user filter (toolbar) + existing date-range (toolbar)
- `Button` — `Add Time` × 7 in day-card empty states
- `Table Footer` — pagination; props set `Total label = "Showing 1-7 of"`, `Total count = "7 results"`

## Token bindings applied

All custom-built frames (Total Time Card + day cards) had their fills, strokes, and text colors bound at creation time to DS Color Tokens variables:

- Card background → `ui-background-color`
- Card stroke → `layout-border-color`
- Day-card header strip → `primary-background-color`
- Date badge background → `primary-color`
- Date badge text + button text → `text-color-on-primary`
- Primary text (day name, timer, total duration value) → `primary-text-color`
- Secondary text (April 2026, Total Duration label, empty-state copy) → `secondary-text-color`

Text styles applied:
- "00:00:00" big timer → `H1 (32px)/Bold`
- Day name → `H3 (18px)/Medium`
- "00:00:00" per-day total → `H3 (18px)/Bold`
- "April 2026" + empty-state copy → `Text2 (14px)/Normal`
- "Total Duration" + "Total Time Spent" → `Text3 (12px)/Normal` / `Text2 (14px)/Medium`

## Notes for the designer

- Sidebar remains in the collapsed 80px variant (default of the layout reference). Image showed expanded sidebar with labels; swap the `Sidebar` instance (node `27945:1059249`) to the expanded variant if you want the wider labeled sidebar.
- Clock icon in `Total Time Card` is a glyph ("⏱") rather than a DS Icon component instance — swap to the proper `clock` icon component if available.
- Filter `Icon Button` uses the default icon (no filter glyph yet). Set its `Icon` instance-swap property to a filter icon from the icon library when you confirm the right one.
- `Saph` dropdown shows the placeholder text only — wire up real selection in code.
- Date badge `APR`/number uses raw Karla Bold / Montserrat SemiBold weight settings; ideally swap to the DS `Badge` or `Counter` component if either matches.

## Backup

No backup taken — this build added a new sibling frame on the page, leaving the layout reference untouched. The clone (`27945:1059248`) is itself the deliverable.

## Raw-value leaks

Audit not run separately. All directly-authored frames have fills/strokes/text bound to DS variables and text styles. Built-in DS instances (Icon Button, Dropdown, Button, Table Footer) carry library bindings.
