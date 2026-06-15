# Weekly Limits Report — Design Spec

**Date:** 2026-06-15
**File:** TimeWorks Design System — Experiment (`gqYWCu1K6dJ9gESXtgNeCi`)
**Target node:** `27823:196653`
**Template to clone:** `28116:272798` (similar existing report page)
**Reference for table styling:** `Report Table` (`28117:278533`) on the *Admin Manager View* page
**Deliverable:** Figma design only (no React/code this pass)

---

## Goal

Give managers a clear, scannable report of how much time each member has worked
relative to their weekly hour limit — time spent, the set limit, percentage used
(with an inline progress bar), and remaining hours — so they can quickly identify
who is **over**, **at**, or **under** their weekly limit, filter by team/member, and
export or schedule the report for recurring use.

**User story:** As a manager, I want to view a weekly limits report grouped by member
or by week so that I can quickly identify who is over, at, or under their weekly hour
limit.

---

## Design decisions (locked)

- **Deliverable:** Figma design only.
- **Actions:** Export **and** Schedule (top-right).
- **Percentage-used color:** 3-tier — `< 85%` blue/primary · `85–100%` amber/warning ·
  `> 100%` red/negative.
- **Filters UI:** dropdown popover anchored under a Filters button.
- **View toggle / Group-by:** Me/All as DS **Tabs**; Group by as DS **Dropdown**
  (Member / Week). The Experiment file has **no SegmentedControl/Switch**, so these are
  the canonical substitutes.

---

## Page anatomy

Clone the template (`28116:272798`) into the target (`27823:196653`) and preserve its
DS chrome — **Sidebar** (left), top **Header**, and the body container. Replace only
the body content with the vertical stack below:

1. Page header row
2. Toolbar row
3. Org / timezone caption line
4. Report table

### 1. Page header row

- **Left:** Title `Weekly Limits Report` — `h2` / `primary-text-color`. Directly
  beneath the title, the **Me / All** toggle as a DS **Tabs** pair.
- **Right (actions):** **Export** — DS Button (primary). **Schedule** — DS Button
  (secondary). Side by side.

### 2. Toolbar row

- **Left cluster — date range:** prev `‹` / next `›` IconButtons + a range Dropdown
  (e.g. `Nov 16 – Nov 22, 2025`) + a **Today** tertiary Button.
- **Left cluster — group by:** labelled DS **Dropdown**, options `Member` / `Week`.
- **Right:** **Filters** Button → opens the filters dropdown popover (see §7).

### 3. Org / timezone caption

Single caption line above the table, `Text3 (12px)` / `secondary-text-color`, e.g.
`Abroadworks · GMT+8 (Asia/Manila)`.

### 4. Report table

House style (match `Report Table` `28117:278533`):

- Dividerless rows; **header row 44px**, **body rows 52px**.
- **Column headers:** text style `Text3 (12px)/Medium`, fill `secondary-text-color`,
  **Title Case**.
- **Primary name cell:** `Text2 (14px)/Medium`, fill `primary-text-color`.
- **Regular cells:** `Text2 (14px)/Normal`, fill `secondary-text-color`.

**Group by: Member**

- Group header per member: **Avatar + Name** (DS Avatar), optionally a DS **Counter**
  of weeks in range.
- Columns: **Week** · Time Spent · Weekly Limit · **Percentage Used** · Remaining

**Group by: Week**

- Group header per week range: e.g. `Sun, Nov 16, 2025 – Sat, Nov 22, 2025`.
- Columns: **Member** (Avatar + Name) · Time Spent · Weekly Limit · **Percentage Used**
  · Remaining

### 5. Percentage Used cell

Inline DS **LinearProgressBar** (~120px wide) + `%` label to its right.
3-tier color via **semantic tokens** (no raw hex):

| Band | Fill token (intent) | % label |
| --- | --- | --- |
| `< 85%` | blue / `primary` | default text |
| `85–100%` | amber / `warning` | default text |
| `> 100%` | red / `negative`; bar caps full at track end | red text (e.g. `112%`) |

Populated frames seed examples spanning all bands (e.g. 77%, 84%, 100%, 112%).

### 6. Export & Schedule

Both are DS Buttons in the page header (Export = primary, Schedule = secondary). This
page designs the **buttons / entry points only**; the Schedule flow (recurring email
config) and Export format menu are out of scope for this pass.

### 7. Filters popover

Dropdown popover anchored under **Filters**, with two tabs:

- **Filters tab:** **Teams** multi-select + **Members** multi-select — Checkbox lists,
  each with a Search field. Footer: **Save Filters** (primary) + **Clear Filters**
  (tertiary).
- **Saved Filters tab:** list of previously saved filter sets (name + apply).

---

## Frames to produce

1. **Group by Member — populated** (examples across under / at / over bands)
2. **Group by Week — populated**
3. **Empty state** — "No data for the selected range" message
4. **Loading state** — DS Skeleton rows
5. **Filters popover open** — overlaid on a populated frame
6. **Progress-bar variants** — reference strip: under (77–84%), at (100%), over (>100%)

---

## DS components used

Avatar · Tabs · Dropdown · Button · IconButton · LinearProgressBar · Tag/Chip ·
Search · Checkbox · Counter · Skeleton · Popover. All instances are DS components;
all fills/strokes/radii/spacing bind to semantic variables.

---

## Out of scope

- React / code generation (separate `figma-to-code` pass if requested later).
- The Schedule configuration flow and the Export format/destination menu (entry-point
  buttons only).
- Member-detail drill-down screens.

---

## Verification

figma-console visual-validation loop: screenshot after each frame/batch, compare
against the `Report Table` reference for work/color/text styling, iterate (max 3).
Final side-by-side screenshot of all frames to confirm one design language.
Requires the Figma Desktop Bridge plugin connected (it was disconnected at spec time).
