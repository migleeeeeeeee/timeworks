# Clients Page — DS Rebuild (Figma)

**Date:** 2026-06-07
**File:** TimeWorks Design System (`gqYWCu1K6dJ9gESXtgNeCi`)
**Deliverable:** A Figma frame, not React code.

## Goal

Rebuild the product **Clients** page (provided as a screenshot) in the TimeWorks
Design System visual language, with the **table redesigned** to match the DS table
style. Every fill, stroke, radius, spacing, and text property binds to a DS
variable / text style (work, text, and color styles) — no raw hex, no raw px.

## Reference

- **DS template:** `28080:136948` — "View & Edit Timesheets — Weekly mode" (1920×1080).
  This is the visual source of truth for the chrome, background, card, table, and
  pagination styling.
- **Product source:** the Clients page screenshot (expanded sidebar, basic HTML-style
  table). Source of truth for *content and columns only*, not styling.

### Reference anatomy (confirmed)

```
Frame 28080:136948 (1920×1080)
├─ Sidebar (collapsed icon rail, 80px)
├─ Main Container
│  ├─ Header (breadcrumb 56h + notification bell + avatar)
│  └─ Body card (glassmorphic white)
│     ├─ Toolbar (40h) — Icon Button / Dropdown / Tabs / Buttons (DS instances)
│     ├─ Top Cards Row (104h) — profile + stat tile  [REMOVED in rebuild]
│     └─ Weekly Project Table
│        ├─ Header Row (56h) of Header cells
│        ├─ Data Rows (68h) separated by 1px divider rectangles
│        └─ Table Footer (INSTANCE) — pagination
└─ Background Blobs (4 gradient ellipses)
```

The table is **hand-built frames** (not a Table component instance): a Header Row of
header cells, data Rows of cells, 1px `Rectangle` dividers, and a `Table Footer`
component instance for pagination. The Total column text uses brand color.

## Decisions (confirmed with user)

- **Sidebar:** collapsed icon rail (match DS reference), not the expanded labeled sidebar.
- **Columns:** keep all 7 + select + actions.
- **Placement:** new frame in the currently-open DS file, beside the reference template.

## Approach — Clone & modify the reference frame

1. Duplicate `28080:136948` → rename **"Clients — DS rebuild"**, place beside the original.
2. **Keep:** collapsed Sidebar, Background Blobs, Header chrome, glassmorphic body card,
   `Table Footer` instance.
3. **Header:** change breadcrumb text to **"Clients"** (single crumb, no parent).
4. **Remove:** the "Top Cards Row" (profile + stat tile).
5. **Toolbar — replace contents:**
   - *Left:* DS **Search** field, wide, placeholder "Search…".
   - *Right:* **"+ Add Client"** primary Button; **"View"** Button with sliders icon + chevron.
6. **Table — rebuild for Clients columns** (hand-built frames, reusing the reference's
   cell/row/divider styling):

   | Col | Header | Cell content |
   |-----|--------|--------------|
   | 1 | `[ ]` select-all Checkbox | row-select Checkbox |
   | 2 | NAME + sort kebab | bold client name (t2) |
   | 3 | EMAIL + sort kebab | "–" placeholder |
   | 4 | CREATED DATE + sort kebab | "2 Dec, 2025: 09:30 PM" |
   | 5 | UPDATED AT + sort kebab | "3 Dec, 2025: 06:03 PM" |
   | 6 | STATUS + sort kebab | green **"Active"** Tag/Badge |
   | 7 | PROJECTS + sort kebab | "–" placeholder |
   | 8 | ACTIONS | kebab IconButton |

   - Header labels: uppercase, t3, muted text color (per reference header style).
   - ~12 sample rows seeded from the screenshot (HSMC…, 360 Painting Of DC,
     5 Star Educational Consulting Group, 5280 Automation LLC, 5th Element Adjusting,
     A Plus Cleaning Enterprises LLC, A Touch Of Heaven Partners, A19 Artisan Lighting,
     AB Hires, AI Digital Commerce, AbroadWorks, Accelerated Payment Technologies LLC).
   - 1px divider rectangle between rows, same token as reference.
7. **Footer:** keep `Table Footer` instance; update text to "Showing 1-25 of 340 results"
   and "Show per page" select with 25.

## DS components to instance

- **Reuse from reference (already instanced):** Sidebar, Header chrome, Buttons,
  IconButton (kebab), Table Footer.
- **Locate & instance new:** Search field, Checkbox (header select-all + per-row),
  status Tag/Badge (green "Active"). Sourced from existing instances in the file or by
  node id (unpublished local components instanced via
  `getNodeByIdAsync(id).createInstance()` per repo convention).

## Styling rules (non-negotiable)

- All visual properties bind to DS variables / text styles. No raw hex, no raw px spacing.
- Primary accent = brand `#6F54EB` (via token).
- "Active" badge uses the semantic green color token.
- Match the reference's card radius, shadow, divider color, header text style, and row height.

## Definition of done

- [ ] New "Clients — DS rebuild" frame exists in the DS file beside the reference.
- [ ] Collapsed sidebar, background blobs, header chrome, glassmorphic card all present
      and visually identical to the reference.
- [ ] Breadcrumb reads "Clients".
- [ ] Toolbar: Search (left) + Add Client / View buttons (right).
- [ ] Table: header row with 8 columns incl. checkbox + sort affordances; ~12 data rows
      with checkboxes, bold names, timestamps, green Active badges, kebab actions; 1px dividers.
- [ ] Footer pagination shows "Showing 1-25 of 340 results" + Show per page.
- [ ] Every fill/stroke/text bound to a DS variable/style — no raw values.
- [ ] Final screenshot captured and visually verified against the reference + screenshot.

## Out of scope

- React/Storybook code generation (that is the `figma-to-code` skill, separate task).
- Interaction states, prototyping, responsive breakpoints.
- Editing DS tokens or components.
