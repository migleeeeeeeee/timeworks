# Projects Card — design-system reconciliation

Source: `Projects Card` (node `27758:293308`) on page **Desktop App** in TimeWorks DS (Experiment) — `gqYWCu1K6dJ9gESXtgNeCi`. Run in **work-in-DS-file** mode (URL fileKey matched `dsFileKey`).

## Swapped

- Header > Count → **Counter** (Size=Small / Color=Dark / Kind=Fill, Number="5") — node `27844:698413`
- Search → **Search** (Size=Medium / State=Default, placeholder "Search projects & tasks...") — node `27844:698493`
- Active Project > Pause → **Icon Button** (Size=XS / Kind=Tertiary / Color=Primary, icon swapped to `pause-updated`) — node `27844:698540`
- Active Project > Tasks (4 rows) → **List item** (Content=List item / Avatar=No / Left icon=No / Right icon=No):
  - "Drafting Proposals · 1h" — node `27844:698561`
  - "Client Review Meeting · 30m" — node `27844:698566`
  - "Update Project Plan · 34m" — node `27844:698571`
  - "QA Testing" — node `27844:698576`
- Project List (4 rows) → **List item** (Content=List item / Right icon=Yes, swapped to `chevron-right`):
  - "AbroadWorks Mobile App · 4h" — node `27844:698581`
  - "Internal HR Tool · 1h 5m" — node `27844:698595`
  - "E-Commerce Storefront · 6h" — node `27844:698609`
  - "Data Analytics Dashboard · 1h 30m" — node `27844:698623`

## Composed

_None — every section had an exact DS component match._

## Already connected

_None — the source page contained zero DS instances before the run._

## Blocked

_None._

## Token bindings (Rule 4 — token-binding-only sections)

- `Projects Card` fill → `ui-background-color`; radius (16) → `space-16`
- `Active Project` card fill → `primary-background-color`; radius (10) → `space-8` (closest available; DS scale doesn't expose 10)
- `Active accent bar` (3×32 rectangle) fill → `primary-color`; radius (2) → `space-2`
- `PROJECTS` header text fill → `secondary-text-color`; text style → `Text3 (12px)/Medium`
- `Client Portal Redesign` title fill → `primary-text-color`; text style → `Text2 (14px)/Bold` (closest weight to source semibold)
- `2h 4m tracked` subtitle fill → `secondary-text-color`; text style → `Text3 (12px)/Normal` (source 11px snapped up to nearest scale step 12)

## Notes / DS limitations

- **List item secondary label not surfaced.** The DS `List item` Content=List item variant doesn't expose an Info/Label slot in this configuration (the slots exist on the component but are hidden in the default variant tree). Per the page-to-library "substitute, never gap-flag" rule, tracked-time strings were concatenated into the primary `Text` (e.g. "AbroadWorks Mobile App · 4h") rather than dropped, so no data was lost.
- **Pause icon was a raw rectangle pair pre-swap;** the new Icon Button uses the canonical `pause-updated` icon from `icon-map.json`.
- **Active-project task bullet ellipses** (6×6 dots) and the per-row 3-px accent rectangles in the Project List rows were absorbed into the List item swap — DS list items don't expose left bullets/accents in this variant.

## Raw-value leaks

After binding, audit re-scan returns false-positives only on DS-instance roots (Counter/Search/Icon Button/List item — their radii are owned by the DS component definition, not by this file). No actionable leaks remain on user-owned nodes inside the converted card.

## Screenshots

REST screenshot unavailable in this run (Figma access-token-less Desktop Bridge setup returned 403). Visual diff to be confirmed in Figma Desktop against the backup frame.

## Backup

Backup frame: `Backup - Projects Card` (node `27844:698355`) — placed 80px to the right of the converted card.
