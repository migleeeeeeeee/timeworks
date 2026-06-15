# Projects page — DS rebuild (from screenshot)

- **Date:** 2026-06-14
- **File:** TimeWorks Design System / Experiment file `gqYWCu1K6dJ9gESXtgNeCi`
- **Foundation node:** `28341:356555` ("Teams — DS rebuild")
- **Result node:** `28672:139147` ("Projects — DS rebuild"), placed beside the foundation (foundation untouched)
- **Source spec:** screenshot of the live TimeWorks Projects page (`timeworks.jobsaas.co.in/.../projects`)
- **Mode:** screenshot-based build (NOT the standard `figma-hybrid-page-rebuild` flow — no Figma source URL, so backup/section-extraction steps were skipped; foundation cloned instead)

## Approach

Cloned the "Teams — DS rebuild" frame (already a DS-clean table page) and retargeted its header,
toolbar, and table to the Projects screenshot. Per user decisions: kept the foundation's collapsed
icon sidebar, and built a representative ~6-row table rather than all ~13 rows.

## Changes

- **Header left:** removed Breadcrumbs Bar; added back-arrow Icon Button (icon `arrow-left` 25321:16460) + "Projects" title (Montserrat Medium 24).
- **Header right:** kept bell Icon Button; added Avatar (Letter "S", Small) + "Hi, Saph".
- **Toolbar:** moved the full-width Search to its own row below the toolbar; added a "Select Client" Dropdown (Medium, 220w) in Toolbar Left; renamed primary button "New Team" → "Add Project" (keeps + icon); kept "View" secondary.
- **Table** (renamed "Projects Table"): rebuilt to 9 columns — Select / Name / Description / Status / Billable / Users / Tasks / Users Count / Actions. Widths: 64/420/320/130/120/300/110/160/172 (=1796). Status = DS Chips (`Positive-Subtle`=Active, `Default`=Inactive, sm). Billable "Yes" bound to `primary-color`, "N/A" default. Users = cloned AvatarGroup instances. 6 rows: Time off, CW - Tuscanyy, CW - Harford Chabad-test, Abroadsworks Portal(ops), Timeworks(#2), Project-01.
- **Footer:** Total label "Showing 1-6 of", count "6 results".

## Token binding

Full pass over the clone: 40 text styles assigned, 21 fills bound, 52 radii bound, 0 errors.
Header labels + description cells explicitly bound to `secondary-text-color` (grey) before the pass.

## Exit checks

- Raw-value leak audit: **0 leaks**.
- Visual confirm: header, toolbar, full 6-row table + footer render correctly after fixing a
  layout-reflow bug (see Notes).

## Notes for the designer

- Avatar initial "S" renders in the DS default Letter hue (orange), not the blue in the source
  screenshot — the Avatar component has no color variant, so this was left as-is.
- "View" button keeps a right chevron (dropdown affordance) rather than the source's sliders icon —
  close enough for a representative build; swap the nested icon to `sliders-simple` (25321:16406) if exact match wanted.
- Table is a representative 6-row sample; extend by cloning row frames and editing cell text/instances.
