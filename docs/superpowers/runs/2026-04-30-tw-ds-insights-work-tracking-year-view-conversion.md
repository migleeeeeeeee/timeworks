# Insights / Work tracking — Year View — design-system reconciliation

- **Source URL:** https://www.figma.com/design/04x9q7W2Y59baF5MqHAVZR/TimeWorks-Design-System?node-id=25560-215373
- **Mode:** `apply-known-scope` + `work-in-DS-file` (target lives in the DS file under page `⚒️ Utils`)
- **Target node:** `25560:215373` — `Insights / Work tracking - Year View` (FRAME 1920×2494)
- **Backup node:** `25561:229095` — `Backup - Insights / Work tracking - Year View` (placed to the right of the original on the same page)
- **Date:** 2026-04-30

## Result

| | Before | After |
|---|---|---|
| Total instances | 113 | 74 |
| Remote (legacy library) | 113 | 0 |
| Local (TimeWorks DS) | 0 | 74 |
| Detached | 0 | 0 |

(Total drops 113 → 74 because nested icons/loaders/chevrons inside the legacy parents collapse into the local component anatomies after the parent swaps.)

## Swapped — set-level

| From (legacy) | → | To (local DS) | Count | Notes |
|---|---|---|---|---|
| `Buttons V.2` (`hierarchy=Primary, size=small, state=Default, Color=Dark`) | → | `Button` (`Kind=Primary, Size=Small, State=Regular, Icon=Default, Color=Primary`) | 5 | Local Button has no `Dark` color → mapped to `Primary`. |
| `Button Version 2` (`hierarchy=Secondary, size=xsmall, state=Default`) | → | `Button` (`Kind=Secondary, Size=XS, State=Regular, Icon=Default, Color=Primary`) | 4 | |
| `Button Icon` (`size=xs, state=Default, type=Primary`) | → | `Icon Button` (`Size=XS, Kind=Primary, State=Default, Loader=False`) | 2 | |
| `Icon Wrapper` (remote, multiple sizes) | → | `Icon Wrapper` (local, `Size` matched) | 27 + 10 | Two remote keys (`431eff…` and `ded97c…`) merged into one local set. |
| `Select` (`Visible Options=no, Size=Medium, Type=Single Select`) | → | `Dropdown` (`Size=Medium, State=Default, Type=Default, Menu open=False`) | 1 | Local DS exposes the family as `Dropdown`, not `Select`. |
| `checkbox` (`state=active, size=24x24`) | → | `Checkbox` (`State=Selected, Label=off`) | 2 | Legacy `state=active` → `State=Selected`. |
| `Form label` (`size=Large`) | → | `Label` (`Color=Primary, Kind=Fill, State=Default, Size=Medium`) | 1 | Local `Label` only ships `Medium` / `Small` — `Large` downgraded to `Medium`. **Designer review recommended.** |
| `Loader` (remote, embedded in legacy buttons) | → | `Loader` (local, `Size=XS, Color=On color, Has background=False`) | 3 | Cleanup pass after parent swaps. |

## Swapped — standalone icons

Exact-name remap unless noted:

| Icons swapped 1:1 | Count |
|---|---|
| `arrow-right`, `bell`, `calendar`, `flag`, `magnifying-glass`, `trash`, `house`, `folder-user`, `suitcase`, `users-grp`, `ballot-check`, `hexagon-image`, `chevron-right`, `chevron-down`, `circle-check`, `circle-info`, `check`, `ellipsis-vertical`, `pen` | 49 |

Substitutions (no exact local match — closest neighbor used):

| Legacy icon | → | Local icon | Count |
|---|---|---|---|
| `pencil` | → | `pen` | 1 |
| `chart-simple` | → | `chart-mixed` | 2 |
| `gear` | → | `gears` | 2 |
| `heroicons-outline/calendar` | → | `calendar` | (within nested anatomy) |
| `heroicons-outline/check` | → | `check` | (within nested anatomy) |

## Already connected

None — every instance under the target was remote at the start.

## Composed

None — every section had a direct `exact-swap` rule (set or icon). No primitive composition was required.

## Blocked

None.

## Decisions worth a designer's eye

1. **`Form label` → `Label` size downgrade.** Legacy `size=Large` → local `Size=Medium`. The local `Label` set's vocab is `Medium` / `Small` only. If a `Large` size is needed, add it to the local `Label` set in Tokens Studio + variant authoring.
2. **`Buttons V.2 / Color=Dark` → local `Color=Primary`.** Local `Button.Color` vocab is `Primary | Negetive | Positive | Inverted | On Primary | On Negative | On Positive | On Inverted`. There's no `Dark`. If the page intent was a dark-surface button, `Inverted` may be a better fit than `Primary` — confirm visually.
3. **`Select` → `Dropdown`.** The TimeWorks DS surfaces the single-select / multi-select dropdown as `Dropdown`. The legacy `Select` family was a different parent. There's also a local `Combobox` — only `Dropdown` was used; reconfirm if any of the source instances were search-filterable comboboxes rather than plain dropdowns.
4. **Icon substitutions (`pencil → pen`, `chart-simple → chart-mixed`, `gear → gears`).** Names mapped to closest available. If a stricter visual match is needed, add the missing icons to the local icon set.

## Verification

Re-inventory after the run reported `remote: 0, local: 74, detached: 0` for the entire target subtree. The backup frame (`25561:229095`) is preserved alongside.

## Caveats

- `figma_take_screenshot` returned 403 throughout the session (REST token unavailable). Visual validation was not captured; verification relies on the post-swap instance inventory above. Open the file and toggle through the page if you want a visual confirmation.
