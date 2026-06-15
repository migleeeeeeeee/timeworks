# Dashboard customization + Me/All scope toggle

**Date:** 2026-05-23
**Scope:** Figma only (no code).
**Source frame:** `Daily Report` — fileKey `gqYWCu1K6dJ9gESXtgNeCi`, node `27823:196654` (TimeWorks DS Experiment file).

## Goal

Let dashboard users (a) flip the entire view between their own data ("Me") and the organization's data ("All"), and (b) choose which widgets are visible and in what order.

## Two controls, two prominences

### 1. Me / All scope toggle — high frequency

- `SegmentedControl` placed at the **toolbar left** of the Daily Report frame (currently empty; right side holds prev/next, date dropdown, Past Week, Past Month, kebab).
- Two segments: **Me** · **All**. Default segment shown in the Figma frame: **All**.
- Drives every widget on the page: chart card, daily report table, and any future widget.
- In Me mode, widgets without a Me equivalent (e.g. team roster) are replaced by an empty-state ("No team data in Me view").

### 2. Customize dashboard — low frequency

- New **"Customize"** menu item added to the **kebab menu** in the toolbar right.
- Opens a centered `Modal` titled **"Customize dashboard"**.
- Modal body: vertical list of widget rows. Each row:
  - Drag handle (left, grip icon)
  - Widget name + one-line description
  - `Switch` (right) to show/hide
- Drag-and-drop reorders the list; order is reflected in the dashboard.
- Footer: "Reset to defaults" link (left), `Cancel` (ghost) + `Save` (primary) on the right.
- Initial widget list in the design: **Hours chart**, **Daily report table**. Two more disabled-but-listed entries to show the model: **Project breakdown** (off), **Recent activity** (off).

## Figma deliverables on the same page (frame `27823:196654` and siblings on its page)

1. **Updated Daily Report frame** with the Me/All `SegmentedControl` placed in the now-defined toolbar-left slot. Default segment = All. (Update in place.)
2. **Variant frame: Me view active** — duplicate of the Daily Report frame with:
   - Toggle showing **Me** selected.
   - Chart card retitled to "My hours".
   - Daily report table replaced by an empty-state card ("This widget is for team views — switch to All to see your team.") OR by a Me-equivalent table (single row, the current user). Pick the empty-state for v1 — simpler and honest.
3. **Kebab menu open** — small frame showing the kebab `Menu` with the new **Customize** item highlighted.
4. **Customize Modal — Default state** — centered modal as specified above, widgets in default order, all shown.
5. **Customize Modal — Dragging** — same modal with one row lifted (elevated `shadow-md`, slightly tilted/translated), insertion indicator line between two other rows.
6. **Customize Modal — Widget off** — same modal with "Daily report table" toggled off, and the dashboard preview behind (optional, if room) showing it hidden.
7. **Tokens sticker** — list of every Figma variable consumed (colors, spacing, radii, shadow) for the new pieces, per the figma-design skill contract.

## DS components reused (no new components)

- `SegmentedControl` (2-segment)
- `Switch`
- `Modal`
- `Button` (primary, ghost)
- `IconButton` (grip handle)
- `Menu` / menu item (for the kebab "Customize" entry)
- `Text` (h3 for modal title, t2 body, t3 descriptions)
- Icon: `Sliders` (or `Settings2`) for the Customize menu item; `GripVertical` for the drag handle

If any of these are missing from the Experiment file's library, the figma-design skill will halt and surface it.

## Out of scope

- Server-side persistence of prefs
- Cross-device sync
- Role-based widget gating beyond the Me/All default
- New widgets themselves — only the picker that toggles widgets that already exist (or are planned)
- Any React/TS code

## Acceptance

- All seven deliverables present on the same Figma page as the source frame.
- Every fill / stroke / radius / spacing / shadow binds to a Figma variable.
- Visual parity with existing toolbar, modal, and menu patterns in the Experiment file.
