# Insights / Work tracking — Year View — design-system reconciliation

**File:** TimeWorks Design System (`04x9q7W2Y59baF5MqHAVZR`)
**Page:** ⚒️ Utils
**Working target:** `Insights / Work tracking - Year View (DS)` — node `25561:229095`
**Backup frame:** `Backup - Insights / Work tracking - Year View` — node `25563:274621`
**Mode:** work-in-DS-file (all components are local; no cross-file imports)

Inventory before changes: 113 remote instances of the legacy library (`Buttons V.2`, `Button Version 2`, `Icon Wrapper`, `heroicons-outline/*`, `magnifying-glass`, `bell`, `calendar`, `chevron-*`, `pen`, `trash`, `ellipsis-vertical`, etc.). Every instance was either swapped to a current DS component or recomposed from DS primitives.

## Swapped (single-component substitutions)

### Header (frame `25561:229099`)
- Offline status (dot + text frame `25561:229103`) → `Chips` Type=On-Selected, label "Offline" — node `25564:335818`
- Search bar (custom frame `25561:229106`) → `Search` Size=Medium — node `25564:335821`
- Bell `Icon Wrapper`/bell (`25561:229110`) → `Icon Button` Size=Medium, Kind=Tertiary, inner icon swapped to `bell` — node `25564:335845`
- Avatar slot (empty `25561:229112`) → `Avatar` Size=Small, Type=Letter "A" — node `25564:335857`

### Date Range Selector (frame `25561:229116`)
- ◀ chevron (`25561:229119`) → `Icon Button` Size=XS, Kind=Tertiary, inner icon swapped to `chevron-left`
- ▶ chevron (`25561:229120`) → `Icon Button` Size=XS, Kind=Tertiary, inner icon swapped to `chevron-right`
- Year picker (custom search-styled frame `25561:229121`) → `Button` Kind=Tertiary, Size=Small, Icon=Left, label "2025", inner icon swapped to `calendar`
- Previous Employee (`25561:229125` / `Buttons V.2`) → `Button` Kind=Secondary, Size=Small, "Previous Employee" — node `25564:322001`
- Next Employee (`25561:229126` / `Buttons V.2`) → `Button` Kind=Primary, Size=Small, "Next Employee" — node `25564:322003`

### Statistics Container (frame `25561:229127`)
- 4 status badges (Activity ▲13%, Time Worked ▼2%, Earned ▲13%, Projects Worked ▲13%) → `Chips` Type=Positive/Negative, Icon=Left with `arrow-up`/`arrow-down`
  - `25561:229134` → `25564:342574` (Positive, "13%", arrow-up)
  - `25561:229149` → `25564:342586` (Negative, "2%", arrow-down)
  - `25561:229162` → `25564:342598` (Positive, "13%", arrow-up)
  - `25561:229180` → `25564:342610` (Positive, "13%", arrow-up)
- 3 goal pills → `Chips` Type=Positive
  - `25561:229137` → `25564:342622` ("Goal · 40%")
  - `25561:229152` → `25564:342625` ("Goal · 8:00:00")
  - `25561:229165` → `25564:342628` ("Goal · $832.43")

### Alerts Container (frame `25561:229184`)
- Flagged Employee tag (`25561:229187` flag + text) → `Chips` Type=On-Selected, Icon=Left flag, "Flagged Employee" — node `25564:343768`
- Stray header `Buttons V.2` (`25561:229196`) → removed (decorative residue)
- Per row × 2:
  - "View Screenshots" (`Button Version 2` Secondary xsmall) → `Button` Kind=Secondary, Size=XS
  - "Mark as Resolved" (`Buttons V.2` Primary small Dark) → `Button` Kind=Primary, Size=Small, Icon=Left, inner icon swapped to `check`

### Bottom Containers (frame `25561:229211`)
- 2 "View All" `Button Version 2` (`25561:229215`, `25561:229270`) → `Button` Kind=Tertiary, Size=XS, Icon=Right, inner icon swapped to `arrow-right`
- 12 ellipsis-vertical menus inside Screenshot cards → `Icon Button` Size=XS, Kind=Tertiary (inner icon `ellipsis-vertical`)

### Screenshots Container (frame `25561:229332`)
- 2 `checkbox` filter toggles (`25561:229337`, `25561:229340`) → `Toggle` State=On, Size=Small
- "Every 10 minutes" `Select` (`25561:229344`) → `Dropdown` Size=Medium, placeholder "Every 10 minutes" — node `25565:361058`
- "Delete Time (06)" (`25561:229346`) → `Button` Kind=Primary, Size=Small, Color=Negetive, Icon=Left, inner icon `trash` — node `25565:361073`
- "Add Note (06)" (`25561:229351`) → `Button` Kind=Secondary, Size=Small, Icon=Left, inner icon `pen` — node `25565:361084`

### Sidebar — Menu - Closed (frame `25561:229578`)
- 7 menu items: each replaced with `Icon Button` Size=Medium, Kind=Tertiary (Active for Home, Default for the rest); inner icons swapped to `house`, `chart-simple`/`chart-mixed`, `folder-user`, `suitcase`, `users-grp`, `ballot-check`, `gear`/`gears`.

## Composed (multi-primitive rebuilds)

- 10 progress bars across Top Apps & URL's and Projects & Task → `Linear Progress Bar` Type=Primary, Size=Small, Label=Off, with computed `Percentage` overrides (15, 67, 8, 8, 8, 16, 51, 16, 36, 16). Each bar set to FILL container width.

## Already connected

None — the source page was authored without any TimeWorks DS components; every section was composed from the legacy library.

## Annotated as-is (Tier 3)

- Stat-card shells (4× `Mask group` GROUPs containing the rounded background, isometric illustration, big value, and title text) — preserved. The DS does not yet ship a Stat / Card primitive; the badges and goal pills inside *were* upgraded.
- Screenshot card shells (12× `Screenshot Block` frames: header label, image mask, custom Activity Indicator group, activity/timing labels) — image and 6px activity indicator vector left as custom; the per-card ellipsis menus *were* upgraded.
- Top Apps / Projects card shells (2× outlined containers) — DS has no Card primitive; the buttons and progress bars inside *were* upgraded.
- TimeWorks logo, sidebar logo plate, decorative dividers and ellipses — bespoke artwork.

## Blocked

- None — every legacy-library instance was either swapped or recomposed.

## Notable decisions

- **Year picker.** Mapped to `Button` Tertiary/Small with `Icon=Left calendar`. The DS `Date Picker` only models date / date-range, not year selection, so a button that opens the picker is the cleanest substitute today.
- **Filter checkboxes → Toggle.** The screen treats them as on/off state filters, so `Toggle` reads more correctly than `Checkbox`. The DS Toggle ships with on/off labels — this is a small visual difference vs. the source.
- **Negative button color enum.** `Button` exposes the typo `Color=Negetive` (sic) — used as-is rather than "fixing" the variant property name (would break existing instances in the library).
- **Activity indicator bars on screenshot cards.** Left as custom 6px-tall GROUPs rather than substituting `Linear Progress Bar`, which would over-pad the small thumbnail cards. Marked Tier 3.
- **Stat badge arrow icons.** Used `arrow-up` / `arrow-down` from the local icon set (`25321:16451`, `25321:16463`) via the Chips `Icon type` instance-swap property.

## Backup

`Backup - Insights / Work tracking - Year View` lives at node `25563:274621` on the `⚒️ Utils` page, immediately to the right of the working target. The original (pre-skill) duplicate was renamed to `Insights / Work tracking - Year View (DS)` and edited in place.
