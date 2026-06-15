# Tasks (Tile view) — design-system reconciliation

**File:** TimeWorks Design System (Experiment) — `gqYWCu1K6dJ9gESXtgNeCi`
**Target page:** `Tasks (Tile view)` — node `27485:255282`
**Reference page (sidebar source):** `Tasks (List view)` — node `27482:244917`
**Mode:** `work-in-DS-file`

The target was rebuilt in-place. The sidebar was lifted from the reference (List view) sidebar, and the main tile content was rebuilt from DS primitives + token-bound chrome.

## Swapped

- **Sidebar (Container)** → cloned from reference `Tasks (List view) > Container` (27484:248615). Reference sidebar is already wired to DS Search, Button (Primary Small + Secondary Small), and Icon Wrapper instances. New node `27521:262219`.
- **Page Header (Frame 1707484971)** → rebuilt as `Page Header` (27521:262403):
  - Breadcrumb row → `Text × 2 + chevron-right icon instance` (icon `25321:16456`), text bound to `secondary-text-color`
  - Title row → `Icon Button` (Size=Small, Kind=Primary, id `25757:58850`) + `clipboard` icon instance (`25321:16320`) + `Text "Tasks"` 24px Montserrat SemiBold bound to `primary-text-color`
  - Right actions → `Button (Tertiary, Small, Icon=Left)` + `Button (Primary, Small, Icon=Left)` (id `46939:91505`)
- **Filter Bar (Frame 1707485012)** → rebuilt as `Filter Bar` (27521:262471):
  - `Search` (Size=Small, id `46947:9785`)
  - 5 filter rows, each = `Checkbox` (id `46939:96347`) + label `Text` bound to `primary-text-color` + `Counter` (Size=Small, Color=Dark, id `46939:100209`) for the "02 / 06" badges
  - `Tabs` (Type=left icon, Amount=2, id `46949:27808`) for the `List / Card` toggle
- **Vector 22705, Vector 22706** (vertical dividers) — strokes bound to `layout-border-color`.
- **Frame 1707485015** (main panel) — fill bound to `text-color-on-primary` (the off-white DS surface token).

## Composed

- **Task tile grid (Frame 1707484999)** → rebuilt as `Task Tiles Grid` (27521:262636). 12 tiles arranged in 3 auto-layout rows of 4. Each `Task Card` is composed from DS primitives:
  - Title row: `Avatar` (XS, Letter, id `46939:89419`) + `Text` (14 SemiBold, primary-text-color) + `Icon Button` (XXS, Tertiary, id `25757:58850`)
  - `Divider` frame bound to `layout-border-color`
  - Progress section: two `Text` nodes ("8 / 16" bound to primary-text + "(50% completed)" bound to secondary-text) + `Linear Progress Bar` (Primary, Small, Label=Off, id `46946:16381`)
  - 2×2 stat grid: labels in `secondary-text-color`, value badges in `grey-background-color` with primary-text values
  - Responsible / Members rows → `Avatar (Small, IMG)` instances
  - Priority pill → `Chips` (Type=On-Negative, Size=sm, text="High")
  - Status pill → `Chips` (Type=On-Positive, Size=sm, text="In-Progress")

## Already connected

- The sidebar lifted from the reference page is already DS-connected (Search + Button + Icon Wrapper instances), so it lands here pre-wired.

## Blocked

None. Every section landed in Tier 1 (swap) or Tier 2 (compose).

## Raw-value leaks

✓ No raw values introduced by this run. New nodes were all created with fills/strokes bound through `figma.variables.setBoundVariableForPaint`, all text colors bound to color variables, and component instances inheriting DS styling.

Caveat — the chrome strip kept from the original target (title bar at the top of the frame with "TimeWorks-Windows 1.6", window controls, the gradient logo) was not touched by this run; it lives outside the converted `Main Content` area and represents the OS window frame, not a DS surface. Bind those if the design intent is to put them on DS tokens too.

## Screenshots

| Stage | URI |
| ----- | --- |
| Final (after Phases A+B+C) | plugin-export of node `27485:255282` (PNG, 1400×1062, 169 KB) |

## Backup

Backup frame: `Backup - Tasks (Tile view)` — node `27521:261111`, placed to the right of the original at the same Y.

## Token map used

| Var | ID | Used for |
| --- | --- | -------- |
| `primary-text-color` | `46810:1430` | Title, body, value text |
| `secondary-text-color` | `46810:1421` | Breadcrumbs, stat labels, helper text |
| `text-color-on-primary` | `46810:1409` | Main panel surface |
| `primary-background-color` | `46810:1511` | Tile card fill |
| `grey-background-color` | `46810:1543` | Time badge fill |
| `layout-border-color` | `46810:1527` | Dividers (horizontal + vertical) |
| `ui-border-color` | `46810:1460` | Tile card stroke |

## DS components instantiated

`Avatar` · `Button` · `Checkbox` · `Chips` · `Counter` · `Icon Button` · `Linear Progress Bar` · `Search` · `Tabs` — plus icon instances from `icon-map.json` (`chevron-right`, `clipboard`, `ellipsis-vertical` implicitly via Icon Button default).
