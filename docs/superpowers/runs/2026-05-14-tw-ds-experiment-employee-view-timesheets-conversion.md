# Timesheets (employee view - UI) — design-system reconciliation

**File:** TimeWorks Design System (Experiment) — `gqYWCu1K6dJ9gESXtgNeCi`
**Page:** `employee view - UI ` · **Target frame:** `Timesheets` (`27616:184144`)
**Mode:** `work-in-DS-file`
**Date:** 2026-05-14
**Run scope:** Full DS conversion of the whole Timesheets frame. Target 2 (`27618:188123` — Frame 1707484616) is a child of this target and is covered here; see the sibling report for a target-2-specific summary.

## Pre-state

Most large primitives on the page were already DS instances: Sidebar, Search (`27616:184162`), the four large Buttons in the Search/Filters/Date-range strip (`27616:184164/165/173`), the Breadcrumbs Bar + Icon Button in the Header, the Avatar (`27616:184169` in User Info container), the user-name Chip (`27616:184170`), and 4× Divider instances threaded between sections. The page was full of unbound raw fills and free text — typical of a partially-converted product page.

## Swapped (custom → DS instance)

- `Frame "Button" 100×24 "View Screenshots"` (Group 7041, inside Target 2) → **Button** (Kind=Primary, Size=XS) — node `27618:188178` → `27618:190894`
- `Frame "Button" 100×24 "View Screenshots"` (Group 7049, inside Target 2) → **Button** (Kind=Primary, Size=XS) — node `27618:188186` → `27618:190897`
- `Frame "Button" 100×24 "View Screenshots"` (Group 7041, Recent time tracked dark variant) → **Button** (XS, Primary) — node `27616:187819` → `27618:190900`
- `Frame "Button" 100×24 "View Screenshots"` (Group 7040) → **Button** (XS, Primary) — node `27616:187833` → `27618:190903`
- `Frame "Button" 100×24 "View Screenshots"` (Group 7044) → **Button** (XS, Primary) — node `27616:187855` → `27618:190906`
- `Frame "Button" 100×24 "View Screenshots"` (Group 7049, dark) → **Button** (XS, Primary) — node `27616:187920` → `27618:190909`
- `Frame "Button" 100×24 "View Screenshots"` (Group 7050) → **Button** (XS, Primary) — node `27616:187934` → `27618:190912`
- `Frame 1707484514 "Add Time"` (light Recent Time footer, inside Target 2) → **Button** (Kind=Tertiary, Size=XS, Icon=Left) — node `27618:188335` → `27618:190915`
- `Frame 1707484514 "Add Time"` (dark Recent Time footer) → **Button** (Kind=Tertiary, Size=XS, Icon=Left) — node `27616:187913` → `27618:190927`
- `Frame 1707484507` "01 Alert · - · Late to work: 0:30:45" (alert pill in Recent time tracked dark) → **Chips** (Type=On-Negative, Size=md) — node `27616:187843` → `27618:190939`
- `Activity Bar` substitution (inside Target 2, Group 7041 → Group 7094): old custom track `Rectangle 4643` (`27618:188169`) + bucket cluster `Group 7063` (`27618:188170`) **replaced** by a cloned copy of the reference `Activity Bar` (source `25730:21650` from page "Design suggestions") — new node `27618:190944`, rescaled 1.07× to match the original 1479×70 footprint (clone height 60px sits centered over the old 70px track band).

Rationales:

- 100×24 indigo frames containing a "View Screenshots" text and a small icon → Button signature (rectangle, text + icon, fill). Variant: solid indigo fill → Primary. Size: 24px height → XS.
- 52×12 frame around "Add Time" text + plus-small icon → Button (Tertiary, XS, Icon=Left). Stroke-less indigo on a card surface reads as a link/tertiary action.
- 232×30 dark-red pill containing "01 Alert · - · Late to work: 0:30:45" → Chips. Tone: source semantics ("Alert", "Late to work") → On-Negative.
- Activity bar substitution per user instruction: use the reference `25730:21650` as the canonical bar.

## Composed

None — every non-instance section either swapped 1:1 (above) or stayed as a token-bound container (below).

## Already connected

- Sidebar — node `27616:184145` (instance of `Sidebar`)
- Header inner Breadcrumbs Bar (`27616:184155`), Icon Button (`27616:184156`)
- Search (`27616:184162` — `Search`, Size=Medium)
- Filters Button (`27616:184164` — `Button`, Secondary/Medium)
- Add Time Button (`27616:184165` — `Button`, Primary/Medium)
- Date range Button (`27616:184173` — `Button`, Secondary/Medium, Icon=Right)
- Avatar (`27616:184169` — `Avatar`, Size=Large, Type=IMG)
- User-name Chip (`27616:184170` — `Chips`)
- 4× Dividers: `27616:184158`, `27616:187088`, `27616:187090`, `27616:187094` (`Divider`, Orientation=horizontal)

## Token binding (Rule 4)

Where no single DS component matched, every loose visual property was snapped to the nearest existing DS token rather than being left raw:

- **Fills:** 134 raw SOLID fills bound to the closest Color-Tokens variable (neutrals snapped to the semantic priority list — `primary-text-color`, `secondary-text-color`, `text-color-on-primary`, `primary-background-color`, `ui-border-color`, etc. — accent paints scanned the full 178-entry palette).
- **Strokes:** 25 raw SOLID strokes bound the same way.
- **Text styles:** ~119 TEXT nodes bound to the closest local text style by size + flavor (`H1/H2/H3`, `Text1/Text2/Text3` × Bold/Medium/Normal/Light). Two stragglers (`27618:188197`, `27618:188196` — "Activity: 42%" and "Time Worked: 8:25:45") were explicitly snapped to `Text2 (14px)/Normal` after the bulk pass.

Tables in `Group 7049` (light, inside Target 2), `Frame 1707484517` (Recent time tracked dark variant inside `27616:187814`), and `Group 7044` (Time Changes inside `27616:186125`) were **not** rebuilt with `Table / Cell` / `Table / ColumnContent` primitives — that is a larger restructuring than this run's scope. They are token-bound throughout (text styles + fills) and read on-system in the three themes; full Table-primitive rebuilds are a follow-up.

## Blocked

None.

## Raw-value leaks

Final audit returned 5 entries; 3 are false positives (`Divider` INSTANCES — library-owned descendants are not leaks per skill rules) and the remaining 2 text nodes were fixed in a follow-up call (see Token binding section).

✓ No real raw-value leaks remain inside Tier-1 / Tier-2 sections.

## Counts

- 10 custom components swapped to DS instances (7× Button, 2× Button, 1× Chips)
- 1 graph substitution (Activity Bar from reference `25730:21650`)
- 134 fills + 25 strokes bound to color tokens (Phase 1) — re-run pass found 0 additional, confirming convergence
- 119 text nodes bound to local text styles
- 53 instances correctly skipped during binding (library-owned)

## Backup

`Backup - Timesheets` (node `27618:188816`) placed 200px to the right of the original.

## Screenshots

Figma REST-image endpoint returned 403 for this MCP session, so per-section screenshots could not be captured. The plugin-bridge is healthy — visual validation should be done directly in Figma Desktop.

| Stage | Source | Result |
| ----- | ------ | ------ |
| Full target | (eyeball original) | (eyeball `27616:184144`) |
| Backup | n/a | `27618:188816` |
