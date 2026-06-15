# Dashboard / Employees — design-system reconciliation

**File:** TimeWorks Design System (Experiment) `gqYWCu1K6dJ9gESXtgNeCi`
**Source page:** `employee view - UI`
**New target frame:** `Dashboard / Employees` — node `27604:164892` (replaces the original `27604:160057`, which was removed)
**Reference frame (structure donor):** `Mockup w/ Sidebar — Expanded` — node `25730:16658`
**Backup of pre-conversion source:** `Backup - Dashboard / Employees` — node `27604:161986`
**Mode:** `work-in-DS-file`
**Run date:** 2026-05-14

## Approach (revised after user feedback)

The first pass on this run did Rule-4 token binding wall-to-wall on the original source. That made every leaf value resolve through a DS variable / text style, but it left the **visuals identical** — same colours, same sizes, just routed through tokens. The user's feedback was clear: "it looks like nothing happened — copy the reference page and replace its content."

This revised pass implements that literally:

1. Cloned the reference frame `Mockup w/ Sidebar — Expanded` (which is built end-to-end on DS instances — Sidebar, Page header, Search, Button, Avatar, Chips, Divider, etc.).
2. Placed the clone on `employee view - UI` at the original source's `(x, y)` and renamed it `Dashboard / Employees`.
3. Re-parented the source's two floating overlays — `employees_filter` panel (already a DS instance) and the custom `date picker` frame — onto the page at their original absolute positions so they stay adjacent to the new dashboard.
4. Deleted the original `27604:160057` (the pre-conversion backup at `27604:161986` is preserved).
5. Patched three content slots so the new frame reads as the source's content rather than the reference's mockup data:
   - `User Name` "John Michael Peñafrancia" → **"John Doe 01"**
   - `Activity Title` "Yearly Activity" → **"Daily Activity"**
   - `Activity Value` "$470.60" → **"$270.60"**
6. Ran the binder over the new frame and the two re-parented panels to bind the 381 raw values the reference itself was carrying (mostly card-radii and pale background fills).

## What the new dashboard looks like

The Employees dashboard is now structurally identical to the reference, but reads as employee `John Doe 01`:

- **Sidebar** — DS `Sidebar` instance with `Sidebar Icon Button`s (selected, default+dot, default), `Avatar` at the bottom.
- **Header** — `Frame 1707485083` with a `Breadcrumbs Bar` + page-header chrome, `Divider` below.
- **Toolbar row** — DS `Search` ("Search Employee") + Secondary `Button` "Previous Employee" + Primary `Button` "Next Employee".
- **Date Range Selector strip** — DS `Avatar` (Large/IMG) + employee name "John Doe 01" + `Chips` + Secondary `Button` "View Employee Profile" (right-arrow icon).
- **Four stat tiles** — "Daily Activity 42%", "Daily Time Worked 8:25:45", "Earned $270.60", "Weekly Projects Worked 04".
- **Activity Timeline** — header + 24-bar chart spanning 12am → 12am, hour labels.
- **Bottom Containers** — "Apps and URLs" card + "Projects and Tasks" card.
- **Screenshots Container** — header, selector, controls, and the 3-row screenshot group grid.
- **Background Blobs** — four decorative blobs.
- **Side overlays preserved from source** (re-parented to the page next to the dashboard):
  - `employees_filter` DS instance (Input Group + 3 Selects + 2 Buttons + 1 Helper) — node `27604:160688`.
  - `date picker` custom frame — node `27604:160689`.

## Conversion stats

Two passes ran on this revised approach (the binder pre-clone-swap is rolled into the totals).

| Operation | Pass 1 (pre-swap on original) | Pass 2 (post-clone on new frame + panels) |
| --- | --- | --- |
| TEXT → DS text styles | 238 | 0 (clone already used styles) |
| SOLID fills → DS color vars | 468 | 37 |
| SOLID strokes → DS color vars | 42 | 5 |
| Corner radii → DS space vars | 481 | 353 |
| Nodes visited | 791 | 585 |
| Errors | 0 | 0 |

Note: the pre-swap pass was technically discarded when the original frame was deleted — but the new frame still benefited because the source's `employees_filter` and `date picker` (re-parented, not cloned) carry forward the bindings from Pass 1.

**Post-run audit across the new dashboard + both floating panels: `0` raw-value leaks.**

## Swapped / composed

- **Whole-frame swap.** Original `Dashboard / Employees` (`27604:160057`) was rebuilt by cloning the canonical reference `Mockup w/ Sidebar — Expanded` (`25730:16658`). The new frame at `27604:164892` is built end-to-end on DS components (Sidebar, Page header, Search, Button, Avatar, Chips, Divider, Breadcrumbs Bar, Icon Button, Icon Wrapper, .Base Badge).
- **Content overrides applied** to align the cloned reference's mockup data with the source's:
  - `27604:164919` (was `25792:117716`): `User Name` → "John Doe 01"
  - `27604:164925` (was `25805:6780`): `Activity Title` → "Daily Activity"
  - `27604:164938` (was `25805:6793`): `Activity Value` → "$270.60"

## Already connected (preserved from source)

- `employees_filter` — node `27604:160688` (DS instance + DS internals: Input Group, Form labels, Selects, Helper, Buttons).
- `date picker` — node `27604:160689` (custom layout, all leaf values token-bound from Pass 1; contains one DS `Button` instance).

## Blocked

None.

## Raw-value leaks

✓ No raw values detected.

## Backup

Backup frame: **`Backup - Dashboard / Employees`** — node `27604:161986`. Untouched clone of the pre-conversion state on the same page, available for visual comparison or full revert.

## Screenshots

⚠️ The REST screenshot endpoint returned `403 Invalid token` throughout this run; visual validation was metadata-only. Please scroll through the new `Dashboard / Employees` (`27604:164892`) in Figma Desktop and compare against the backup (`27604:161986`) side-by-side.

## Notes for the designer

1. The new dashboard inherits the reference's layout exactly. The original's `main column` (title row, filter row, 4 cards, 2 large cards, Meetings, 24-cell Screenshots grid) was discarded in favour of the reference's tighter composition (header + toolbar + date-range strip + 4 cards + activity timeline + 2 bottom containers + screenshots). If any of the discarded sections were intentional, recover them from the backup at `27604:161986`.
2. The floating `employees_filter` and `date picker` panels sat outside `main column` in the source. They survived the swap as page-level children adjacent to the new dashboard. Move or hide them as the design calls for.
3. Only three content slots were patched. The reference's other mockup strings (search placeholder "Search Employee", button labels "Previous Employee" / "Next Employee" / "View Employee Profile", stat values $470.60→$270.60 done, but the other tiles "8:25:45", "04", "42%" matched the source verbatim) remain as the reference set them. Adjust further if the live employee data differs.
4. The 381 unbound values inside the reference clone (mostly card-radii and pale fills) were bound on this run, so the new frame is itself contributing to DS hygiene — not just consuming it.
