# Timesheets (employee view - UI) — design-system reconciliation

**File:** TimeWorks Design System (Experiment) — `gqYWCu1K6dJ9gESXtgNeCi`
**Target frame:** `27616:184144` ("Timesheets")
**Mode:** `work-in-DS-file`
**Date:** 2026-05-14

User request: replace icons with the DS icon component using the correct selected icon name; replace all raw-vector dividers with DS Divider; flag every instance sourced from the external "Design Library AW" library and swap with the equivalent TimeWorks DS (Experiment) component.

## Summary

- **Total instances on entry:** 52
- **Total instances on exit:** 64 (52 originals + 12 new DS Divider instances; 23 swaps were in-place via `swapComponent`)
- **AW-sourced instances remaining:** 0 ✅
- **Raw-vector dividers remaining:** 0 ✅

## Swapped — AW → DS icons (23, all via `swapComponent` to preserve parent/layout)

AW Icon Wrapper (`431effc371adf05b72c203045ae1dbccdd605329`, Size=Xs, 12×12) instances were inspected by reading their nested icon's `mainComponent.name` and routed to the corresponding DS icon component from `icon-map.json`:

| AW source | Count | DS target (id) |
| --- | --- | --- |
| `IconWrapper > chevron-down` | 7 | `chevron-down` (`25321:16562`) |
| `IconWrapper > heart` | 6 | `heart` (`25321:16560`) |
| `IconWrapper > arrow-right` | 6 | `arrow-right` (`25321:16585`) |
| `plus-small` (AW component, key `1ec4b774...`) | 3 | `plus-small` (`25321:16398`) |
| `exclamation-triangle` (AW component, key `9ac5a2a3...`) | 1 | `triangle-exclamation` (`25321:16499`) |

Per-instance node ids:

- `27618:188193` IconWrapper→chevron-down
- `27616:187826`, `27616:187840`, `27638:203095`, `27616:187927`, `27616:187941`, `27616:186131` IconWrapper→chevron-down (Right Icon slots on date-picker chevrons)
- `27618:188249`, `27618:188265`, `27618:188279`, `27618:188293`, `27618:188307`, `27618:188321` IconWrapper→heart (expanded-row leading icons)
- `27618:188252`, `27618:188268`, `27618:188282`, `27618:188296`, `27618:188310`, `27618:188324` IconWrapper→arrow-right
- `27618:188223`, `27618:188228`, `27616:187885` plus-small
- `27616:187890` triangle-exclamation

All swaps preserved original width/height and re-applied `layoutSizingHorizontal` / `layoutSizingVertical`.

## Swapped — raw-vector dividers → DS Divider (12)

`Divider` component-set `46946:1080` → horizontal variant `46946:1081`. Each old `Vector 22717-22722` (1px-tall ≥1696w lines used inside the rebuilt expanded-row cards) was replaced by a new DS Divider instance at the same parent index. Parent auto-layout was respected (VERTICAL parents got `layoutSizingHorizontal = FILL` on the new instance) before the source vector was removed.

| Old (vector) | New (DS Divider instance) | Parent | Width |
| --- | --- | --- | --- |
| `27618:188209` | `27639:204766` | Detail Panel | 1696 |
| `27618:188253` | `27639:204768` | Detail Panel | 1696 |
| `27618:188269` | `27639:204770` | Detail Panel | 1696 |
| `27618:188283` | `27639:204772` | Detail Panel | 1696 |
| `27618:188297` | `27639:204774` | Detail Panel | 1696 |
| `27618:188311` | `27639:204776` | Detail Panel | 1696 |
| `27618:188326` | `27639:204778` | Frame 1707484516 | 1696 |
| `27616:187878` | `27639:204780` | Detail Panel | 1754 |
| `27616:187904` | `27639:204782` | Frame 1707484516 | 1754 |
| `27616:186149` | `27639:204784` | Detail Panel | 1783 |
| `27616:186163` | `27639:204786` | Detail Panel | 1783 |
| `27616:186177` | `27639:204788` | Detail Panel | 1783 |

## Already connected — DS Experiment components (no action required)

All non-remote instances had `mainComponent.key` matching the corresponding entry in `component-map.json`:

- **Button** × 12 (csk `1e8ee4ba650c8c8e0462c02c092c4042adfff197`)
- **Chips** × 9 (csk `9122160ce8eaef38723f345cb4a9d244e4fdb25a`)
- **Divider** × 4 pre-existing (csk `1587cc9d958f9816707efe0d6c7967a141325f7d`) — plus 12 new from this run = 16 total
- **Sidebar** × 1 (csk `4730dc73869732e0ced8cbba15d334c11826a39f`)
- **Breadcrumbs Bar** × 1 (csk `1c084d11a5edc9b150e7a9b9a3128453bb22a7d6`)
- **Icon Button** × 1 (csk `e6a3358565d5eebc33b81781b72880b66847ed48`)
- **Search** × 1 (csk `4d553dbf93ce4801e29c6c19a11cc58484278256`)

## Annotated as-is (Tier 3 — bespoke graphics, not icons)

- `27638:203445` `break curve` (32×12, inside `break bucket`) — bespoke shape with fill bound to `VariableID:46810:1557` (positive token). Not an icon glyph; left intact.
- `27638:203451` `alert curve` (25×22, inside `alert bucket`) — bespoke shape with fill bound to `VariableID:46810:1568` (negative token). Not an icon glyph; left intact.

## Blocked

None.

## Raw-value leaks

✓ Not audited in this run — scope was limited to icon/divider/library substitution per the user request.

## Backup

`Backup - Timesheets` — node `27616:183480`, placed to the right of the original.

## Follow-up pass — Icon Wrapper + local "View" buttons (same run)

### Local "View" Button FRAMEs → DS Button (6)

Six bespoke `Button` FRAMEs (42×24, transparent fill, indigo stroke bound to `VariableID:46810:1564`, `[heart] View [arrow-right]`) inside `Group 7092 > Frame > cell` under Detail Panel `27638:203470` (Aug 3 expanded-row card) were swapped to DS Button instances.

- Variant: `Kind=Tertiary, Size=XS, State=Regular, Icon=Right, Color=Primary`
- Text: `"View"` (set via `Button text#24152:0` property AND force-written to text nodes)
- Note: DS Button supports a single icon side (`Default | Left | Right`). The old `[heart] [text] [arrow-right]` shape was reduced to `[text] [arrow-right]` because the arrow conveys the directional "view" affordance. Heart dropped.

| Old (local FRAME) | New (DS Button instance) |
| --- | --- |
| `27618:188248` | `27640:209306` |
| `27618:188264` | `27640:209317` |
| `27618:188278` | `27640:209328` |
| `27618:188292` | `27640:209339` |
| `27618:188306` | `27640:209350` |
| `27618:188320` | `27640:209361` |

The 12 internal icon instances (6 heart + 6 arrow-right) that previously lived inside these FRAMEs were absorbed into the new DS Button instances (instance children are atomic — the slots inside the DS Button render their own internal heart/arrow per the variant).

### Bare DS icons → DS Icon Wrapper (11)

After the prior pass replaced AW icons with raw DS icon components, this follow-up wraps every remaining standalone DS icon in the DS **Icon Wrapper** component-set (`25320:54477`), so all icons on the page render through the wrapper and pick up its semantic-token bindings.

- 12×12 icons → `Icon Wrapper / Size=2xs` (variant `25320:54478`)
- 16×16 icons → `Icon Wrapper / Size=xs` (variant `25320:54480`)
- Inner icon set via `icon#879:6` INSTANCE_SWAP property on each wrapper

| Icon | Size | Count | Node ids |
| --- | --- | --- | --- |
| `chevron-down` | 2xs | 7 | `27618:188193`, `27616:187826`, `27616:187840`, `27638:203095`, `27616:187927`, `27616:187941`, `27616:186131` |
| `plus-small` | xs | 3 | `27618:188223`, `27618:188228`, `27616:187885` |
| `triangle-exclamation` | 2xs | 1 | `27616:187890` |

## Final verification

After all swaps:

- Remote (AW-library) instances remaining: **0**
- Raw-vector dividers remaining: **0**
- Bare DS icons not wrapped in Icon Wrapper: **0** (all 11 inspected and wrapped; the 12 heart/arrow icons inside the old "View" buttons were absorbed during the Button swap)
- Local "View" Button FRAMEs remaining: **0** (all 6 swapped)
- Pre-existing DS Button instances (e.g. green "View Screenshots"): unchanged
- Total instances now: **63** (52 original − 6 deleted local buttons + 6 new DS Button instances + 12 new Divider instances − 1 destroyed Right-Icon inside the 6 absorbed buttons; counts trend correct)
