# Activity & Screenshots - Day View — design-system reconciliation

**Source page:** `⚒️ Utils` in TimeWorks Design System (`04x9q7W2Y59baF5MqHAVZR`)
**Target frame:** `Activity & Screenshots - Day View` (node `25697:181180`, 1920×1233)
**Mode:** `apply-known-scope` / `work-in-DS-file`
**Date:** 2026-05-06

> ⚠️ Going in, the page looked DS-connected (lots of instances), but every instance was pointing at a **local copy** of the component (e.g. `Button` cs `25697:180617`), not the canonical DS component (`Button` cs `46939:91505` per `component-map.json`). The pass below repointed each mappable family to its canonical via `swapComponent`.

## Third pass — clone the reference layout into the target

User feedback: instance-swapping doesn't change layout, and the target's local frames weren't using DS color/text styles. Solution: clone the reference frame's full content into the target so the layout, typography, and color all come from canonical DS components.

- Hid every existing child of target `25697:181180` (renamed each `(replaced) ...`) — `wrapper`, `employees_filter`, `(replaced) date picker`, `Footer Container`. Nothing deleted; backup frame `25720:191734` still present.
- Cloned reference frame `25697:188346` (`Mockup w/ Sidebar — Improved`) into the target as a new child `25722:203881` (`DS-converted layout`), positioned ABSOLUTE at (0, 0).
- Resized target frame to fit: 1920×1233 → 1920×1601 (clone is 1816×1585).
- Resulting canonical DS surface in the cloned content:
  - Sidebar ×1, Sidebar Icon Button ×8
  - Linear Progress Bar ×22, Loader ×15
  - Icon Button ×15, Button ×7
  - Chips ×9, Checkbox ×4, Avatar ×2
  - Breadcrumbs Bar ×1 + Breadcrumb Item ×5
  - Search ×1, Dropdown ×1, Divider ×1
  - 39 Icon Wrappers, 49 raw canonical icons from the `25321:16xxx` library

The cloned content uses DS color tokens, typography styles, and component variants by construction — anywhere the reference was correct, the target now is too.

If you want to drop the hidden originals later, they're at:
- `25697:181181` — `(replaced) wrapper`
- `25697:181649` — `(replaced) employees_filter`
- `25697:181650` — `(replaced) date picker`
- `25697:181809` — `(replaced) Footer Container`

## Second pass — driven by reference `Mockup w/ Sidebar — Improved` (`25697:188346`)

The user pointed at a reference frame that uses canonical DS components not in `component-map.json`. From its inventory I extracted:

- DS **Sidebar** component-set `25694:158051` (variants: `State=Expanded|Collapsed`)
- DS **Sidebar Icon Button** `25694:157615`
- Canonical **icon library** at `Frame 1707483644 :: 25336:96509` — 298 single-component icons (`house`, `chart-mixed`, `bell`, `chevron-*`, etc.)

Both `Sidebar` and `Sidebar Icon Button` were added to `.claude/skills/figma-page-to-library/component-map.json` so future runs find them.

### Sidebar swap

- `Menu - Closed` (local frame `25697:181182`, 88×763) **replaced** by canonical DS **Sidebar** instance `25722:201346` (cs `25694:158051`, `State=Collapsed`, 80×836) at wrapper origin (0,0).
- Original hidden + renamed `(replaced) Menu - Closed`.

### Canonical icon swaps

Built canonical-icon name→id map by walking children of `25336:96509` (no `findOne` — direct child traversal of a known node). Then for each INSTANCE in the target whose `mainComponent` is a single COMPONENT (not a COMPONENT_SET) and whose name matches a canonical icon name, swapped to the canonical id.

- 9 raw-icon instances swapped to canonical (e.g. `house`, `calendar` ×2, `chevron-*` legs, sub-icons of swapped Buttons/Date Picker)
- 7 already canonical (brought in by canonical Buttons / Date Picker / Sidebar)
- 0 failed

Skipped (non-icon names that don't map): layer-named "Icon" sub-instances (live inside Icon Wrapper), `heroicons-outline/*` sub-icons, internal Date Picker structure (`.Month Picker`, `.Week`, `.Day`, etc.).

## Swapped (now canonical DS)

- 13 × `Button` instances → DS **Button** (cs `46939:91505`) — including 11 inside `Button Type` wrappers and 2 standalone in `employees_filter`
  - ids: `I25697:181649;1:9612`, `I25697:181649;1:9613`, `I25697:181653;879:10220`, `I25697:181654;879:10220`, `I25697:181655;879:10220`, `I25697:181656;879:10220`, `I25697:181657;879:10220`, `I25697:181658;879:10220`, `I25697:181659;879:10220`, `I25697:181660;879:10220`, `I25697:181661;879:10220`, `25697:181807`, `25697:181808`
- 3 × `Select` → DS **Dropdown** (cs `46946:1926`) — ids `I25697:181649;1:9608`, `;1:9609`, `;1:9610`
- 1 × `Form label` → DS **Label** (cs `46946:16083`) — id `I25697:181649;1:9607;3612:16854`
  - The other 3 `Form label` instances were nested inside the Selects above; they were replaced wholesale when the parent Selects were swapped to canonical Dropdown.
- 2 × `Button Icon` → DS **Icon Button** (cs `46946:15233`) — ids `25697:181263`, `25697:181264`
  - +6 nested DS Icon Button sub-instances pulled in by the canonical Buttons (total Icon Button count post-swap: 11)
- 1 × `date picker` overlay frame replaced with canonical DS **Date Picker** (cs `46939:100511`, variant `Type=Date Range`, `With Dialog=true`)
  - New instance: `25722:197503` at `(628, 198)`
  - Original frame `25697:181650` hidden in place and renamed `(replaced) date picker` as a secondary safety net beyond the backup
  - Note: canonical renders 372×312; original was 620×628 — visual size will shrink

## Composed-from-primitives (post-swap)

- `Frame 1707484092` (toolbar, node `25697:181809`) — local frame composed of text + chevron icons + canonical DS `Button` and `Icon Button`. Annotated.
- `employees_filter` (node `25697:181649`) — local instance, but its inner content is now canonical DS Dropdown ×3 + Label + Button ×2 after the swap pass. Annotated as already-connected post-swap.

## Already connected (post-swap)

- All Button / Dropdown / Label / Icon Button / Date Picker instances now resolve to canonical DS component sets per `component-map.json`.
- Verified counts: Button 13, Dropdown 3, Label 1, Icon Button 11, Date Picker 1.

## Blocked / preserved with annotation (Tier 3)

| Family | Count | Reason |
|---|---|---|
| ~~`Menu - Closed`~~ — **resolved in second pass** | — | Replaced by canonical DS **Sidebar** instance `25722:201346` after the reference revealed the DS Sidebar component-set `25694:158051`. Original hidden. |
| Local `Icon Wrapper` families (cs `25557:115315`, `25697:180099`, `25557:114030`) | 26 | `Icon Wrapper` is not exported in `component-map.json`. Skill rules: do not fall back to `findOne`. Halt-or-skip; skipped per Tier 3. |
| Local raw icon components (`magnifying-glass`, `bell`, `chevron-down`, `chevron-right`, `chevron-left`, `arrow-right`, `calendar`, `adjustments-horizontal`, `exclamation-triangle`, plus `heroicons-outline/*`) | ~30 | No DS icon mapping in the component map; preserved. |
| `Button Type` (cs `25697:181075`) | 9 | Local wrapper around DS Button. Wrapper itself isn't a DS component; its inner Buttons were swapped to canonical. |
| `Input Group` (cs `25697:180154`), `Helper` (cs `25697:180123`) | 1 each | Sub-components inside `employees_filter`; not in `component-map.json`. |
| `employees_filter` (cs `25697:180848`) | 1 | Local composition; primitives inside are now canonical. **Annotation set on node.** |

## Variant-property notes

- Local `Button` had variant schema `{ hierarchy, size, state }`; canonical DS Button accepted the swap without errors. Verify variants visually — `swapComponent` preserves overrides only where prop names match.
- `Select` → `Dropdown`: prop names differ (local had `Visible Options, Size, Type`; DS Dropdown has its own schema). Swap succeeded but selected variant defaulted; recheck per-instance variant.
- Date Picker overlay was rebuilt fresh (not a swap), so no override migration risk — but no overrides preserved either. Wire content (selected dates, label) manually if needed.

## Screenshots

| Stage | URI |
|---|---|
| Source — full target | ❌ Figma REST screenshot returned 403 (auth). Open node `25697:181180` directly in Figma to verify. |
| Result — full target | ❌ same |
| Result — Date Picker | ❌ same — open node `25722:197503` |

The 403 is a Figma REST-token issue independent of the swap work; all mutations completed successfully via the Plugin API.

## Backup

- Backup frame: `Backup - Activity & Screenshots - Day View` (node `25720:191734`) — placed at `(6672, 16015)` on page `⚒️ Utils`.
- The original local `date picker` frame (`25697:181650`) is hidden in place and renamed `(replaced) date picker` as an additional inline rollback aid.

## Recommended follow-ups

1. **Visual QA in all three themes** (light/dark/black) on the target frame.
2. **Decide on the side-nav.** If TimeWorks is going to keep a sidebar pattern across product surfaces, add a `Side Nav` component to the DS and add it to `component-map.json`.
3. **Map `Icon Wrapper` and the icon library** into `component-map.json` (or expose a separate icon map) so future passes can swap raw icons. The local file has at least three `Icon Wrapper` cs ids in active use (`25557:115315`, `25697:180099`, `25557:114030`) — these likely need consolidating in the DS too.
4. **Variant audit on swapped Buttons / Dropdowns / Labels / Icon Buttons.** `swapComponent` preserved overrides where prop names matched, but local cs may have used different prop names — flip through each node and confirm hierarchy/size/state still read as intended.
5. **Date Picker:** the original was 620×628 with a footer button row. Confirm the canonical Date Range variant covers the same use case, or compose Date Picker + Button row if a custom footer is needed.
