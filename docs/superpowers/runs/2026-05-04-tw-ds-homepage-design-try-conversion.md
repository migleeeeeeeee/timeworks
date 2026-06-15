# Dashboard / Homepage — design-system reconciliation

**File:** TimeWorks Design System (`04x9q7W2Y59baF5MqHAVZR`)
**Page:** `Homepage Design Try`
**Target frame:** `Dashboard / Homepage` — node `25604:901` (1440 × 1728)
**Mode:** `work-in-DS-file` (page already duplicated into the DS file)

> Note: REST screenshots returned 403 (no `FIGMA_ACCESS_TOKEN` configured on the figma-console MCP). Visual validation in this run was via Plugin API inspection (`getMainComponentAsync` on every new instance) rather than image export.

## Summary

- **14 sections swapped/composed** to library components — all verified to point at DS COMPONENT_SETs.
- **6 sections blocked** — DS doesn't expose the component family (Stat/KPI, NavItem, custom charts, schedule list, bespoke table).
- Total INSTANCE nodes inside the target after the run: **53** (14 direct swaps + their nested DS sub-instances).

## Swapped

- Header / Search → **Search** (variant `Size=Large, State=Default`) — node `25611:213918`, key `3b4f400b4723b004adb25f14ed161a124c4b3488`
- Header / TeamSel → **Dropdown** (variant `Size=Large, State=Default, Type=Default, Menu open=False`) — node `25611:213942`, key `5d14f4976b5366916870e9a5a9206ccc87b294ca`
- Header / Avatar (JD) → **Avatar** (variant `Size=Large, Type=IMG, Disabled=Off`) — node `25611:213957`, key `ebd1f6d31c4133e95ba9744ae4ae9608a2eefd10`
- Header / NotifBtn → **Icon Button** (variant `Size=Large, Kind=Primary, State=Default, Loader=False`) — node `25611:214098`, key `82c5b5e0421817c9502fdb98afa79096b700234c` *(badge sibling `25604:949` left in place)*

## Composed

- Action Center / 5 alert rows → 5 × **Alert banner** (variant `Types=primary, Button or link=link`) — nodes `25611:214014`, `25611:214028`, `25611:214042`, `25611:214056`, `25611:214084`
- Team Utilization / 5 progress tracks → 5 × **Linear Progress Bar** — nodes `25611:213960`, `25611:213966`, `25611:213972`, `25611:213978`, `25611:213984`
- Active Projects / 4 project progress tracks → 4 × **Linear Progress Bar** — nodes `25611:213990`, `25611:213996`, `25611:214002`, `25611:214008`

## Already connected

None — every top-level child of the target frame was a detached `FRAME` before this run.

## Blocked

- **Sidebar (`25604:902`)** — 8 nav items (`Nav/Home`, `Nav/Team`, `Nav/Projects`, `Nav/Attendance`, `Nav/Timesheets`, `Nav/Reports`, `Nav/Payroll`, `Nav/Settings`) plus the `TimeWorks` brand mark. Reason: DS exposes no `NavItem` family. `Menu` and `List` exist but neither matches a sidebar nav row's anatomy (icon + label + selected-state rail). Bespoke until DS adds a side-nav primitive.
- **Today's Overview / KPI Cards (`25604:2641`)** — 6 KPI cards (Active Employees, Hours Tracked, Attendance Rate, Pending Approvals, Overtime Alerts, Avg Productivity). Reason: DS has no Stat/KPI/MetricCard component.
- **Live Team Activity (`25604:2721`)** — 9 × 5 table (Employee, Status, Project, Clocked, Hours). Reason: tier-2 candidate via `Table`, but the table cells are bespoke composites (status pill + avatar + name + project chip) and the swap risk on a non-trivial row layout was too high for an unsupervised pass. Recommended next step: rebuild this section explicitly with `Table` + Avatar + Chips + Badge once cell anatomy is decided.
- **Productivity Trend chart (`25604:2939`)** — bespoke bar chart. Charts are out of scope for the DS in v1.
- **Billable Hours chart (`25604:2984`)** — bespoke donut chart with legend.
- **Upcoming Schedule (`25604:3154`)** — date-grouped event list (Today / Tomorrow / This Week, accent rail + icon + title + meta). DS has no Calendar/Schedule list primitive.
- **Header / Dashboard title (`25604:954`)** and **DatePill (`25604:943`)** — left in place; pure text and a static date pill, no DS family.

## Backup

`Backup - Dashboard / Homepage` — node `25611:213262`, placed at `(1640, 0)` on the same page (200px gap to the right of the original).

## Button pass

8 text CTAs swapped to **Button** instances (variant `Kind=Tertiary, Size=Small, State=Regular, Color=Primary`). Trailing `→` glyphs were stripped from the labels since the Button component owns its own affordance.

| Original | Label | New instance |
|---|---|---|
| `25604:2693` (KPI/Pending Approvals) | Needs action | `25615:214346` |
| `25604:2706` (KPI/Overtime Alerts) | Review now | `25615:214349` |
| `25604:2874` (Live Team Activity footer) | View All Team Members | `25615:214352` |
| `25604:2881` (Action Center header) | Clear all | `25615:214355` |
| `25604:2932` (Action Center footer) | View all alerts | `25615:214358` |
| `25604:3051` (Active Projects header) | View All | `25615:214361` |
| `25604:3153` (Active Projects footer) | View all projects | `25615:214364` |
| `25604:3230` (Upcoming Schedule footer, `CalBtn`) | View Full Calendar | `25615:214367` |

All 8 verified to resolve to the DS `Button` COMPONENT_SET.

## Style application pass

After the component substitution pass, a follow-up pass bound DS text styles and color tokens onto every bespoke node remaining in the target frame (skipping descendants of library INSTANCEs, which already own their styling):

- **207 TEXT nodes** restyled — closest size bucket (32/24/18/16/14/12) and matching weight (Bold/Medium/Normal/Light) applied as `textStyleId`, fill bound to `primary-text-color` (size > 12) or `secondary-text-color` (size ≤ 12). 0 errors, 0 mixed-style nodes.
- **28 divider RECTANGLES** (height ≤ 2 or width ≤ 2) — fill bound to `layout-border-color`.
- **126 fills + 20 strokes** on every other unbound SOLID paint (containers, KPI surfaces, accent rails, badges, chart bars, status dots, etc.) — bound to the nearest DS color variable in the Light mode of the `Color Tokens` collection. Two-pass: tight 0.06 RGB-distance match first (115 hits), then a 0.15 fallback for hand-picked accent colors (31 hits — primarily `Content Color/royal` for the bright-blue brand accents on the source page, `Content Color/stuck-red` for the alert/badge red, `allgrey-background-color` for the peach KPI icon backdrops).

Top tokens applied across the page: `primary-background-color` (30), `Content Color/royal` (22), `ui-background-color` (22), `Content Color/done-green` (10), `positive-color-selected` (9), `Content Color/purple` (8), `icon-color` (7), `text-color-on-primary` (6), `disabled-background-color` (6), `allgrey-background-color` (9), `Content Color/blackish` (5), `Content Color/stuck-red` (5).

Final verification: **0 unbound SOLID fills, 0 unbound SOLID strokes** remain anywhere inside the target frame (excluding library INSTANCE descendants, which own their own bindings).

## Caveats

- Per-section visual validation via REST screenshot was unavailable (403). Verification was done via `getMainComponentAsync` confirming each new INSTANCE resolves to the expected COMPONENT_SET (Search, Dropdown, Avatar, Icon Button, Alert banner, Linear Progress Bar). All 14 instances pass that check.
- One Action Center alert insertion was duplicated by a 30s execute timeout mid-loop; the duplicate (`25611:214070`) was identified and removed. Action Center now has the expected 5 alert banners with their original `_sp` separators preserved (15 children total in the parent, ordered correctly).
- Variant choices used the COMPONENT_SET defaults (`Size=Large` etc.) since the original sections weren't variant-bearing instances and visual diffing wasn't possible without REST screenshots. If a smaller size is desired (e.g. `Size=Medium` for the Header IconButton/Avatar to fit a 40px row), call `setProperties({ Size: "Medium" })` on the new instances.
- Text content was not copied onto Search/Dropdown/Avatar overrides: the DS components own their internal text styles, and the source text was on detached frames whose font wasn't pre-loaded. Action Center alert banner text was best-effort copied into the new instances' first N text children where fonts loaded successfully.
