# Exploration — Team Capacity — design-system reconciliation

Work-in-DS-file run. Source = DS file `gqYWCu1K6dJ9gESXtgNeCi`, target frame `28510:271337`.
Bespoke (token-styled) elements were rebuilt as real DS component instances, section by section, with per-section screenshot validation.

## Swapped

Per-element rebuilds from DS components (113 DS instances total in the frame after the pass; 0 residual raw fills on authored frames):

- **Avatars → `Avatar` (Type=Initials)** — 31 instances across Who's online, Weekly limits, Pending payments, Time off requests, Upcoming leaves, To-dos. Initials preserved as data; DS brand styling applied. Who's online avatars rebuilt at the inner `circle` so the green online-status dot was retained.
- **Status / activity / team pills → `Chips`** — 46 instances. Tone assigned per-instance from the source color: red→`On-Negative`, green→`On-Positive`, amber→`On-Warning`, neutral→`Default`. Text-content tone used for Time off (Pending/Approved/Declined); color-based tone for the rest.
- **Progress bars → `Linear Progress Bar` (Size=Small, Label=Off)** — 10 instances (Weekly limits ×5, Current project activity ×5). Inner Fill rectangle resized to the source fill ratio; Type mapped green→`Positive`, red→`Negative`, amber→`Primary`.
- **To-do checkboxes → `Checkbox` (State=Regular, Label=off)** — 5 instances.
- **Header links → `Button` (Kind=Secondary, Icon=Right)** — 7 instances (from the earlier chip-button pass): View all members, Manage limits, View all ×3, View projects, View all tasks.

## Already connected

- All 7 card containers (Who's online, Weekly limits, Pending payments, Time off requests, Upcoming leaves, Current project activity, To-dos) — already on the glass recipe (`secondary-background-color` @ 0.5 + `layout-border-color` 1px + radius 12, no shadow). No change.

## Blocked / preserved as-is

- **Weekly limits summary tiles** (At limit / Near limit / On track, `tile` frames) — left as token-bound stat tiles; not a Chip/Badge candidate.
- **Legend rows, date badges (JUN 2 / JUL 4), sun emoji** — token-bound decorative content; no DS component equivalent.

## Known approximations (DS-library limits)

- **Amber progress bars** (Weekly limits 77%, project activity 61/55/40%) → rendered `Primary` (indigo). The `Linear Progress Bar` `Type` axis has Primary/Positive/Negative/Multi — **no Warning**, so amber cannot be represented.
- **Avatar color** — DS `Avatar` Initials uses a single brand fill, so the source's per-person avatar colors are not preserved (initials are). DS Large = 48px vs source 40px on most cards; Who's online avatars were resized back to 40px to keep the status dot aligned.
- **Color-based chip tone** is approximate for pale greens; a few Who's online activity chips were hand-corrected (87/91%→Positive, 74%→Warning) and two Weekly limits badges (8h/7h left→Warning).

## Raw-value leaks

✓ No raw values detected. (0 residual raw `SolidPaint` fills on authored, non-instance frames; DS instance internals resolve through library bindings.)

## Backup

Backup frame: `Backup - Exploration — Team Capacity` (node `28511:272255`), placed to the right of the original.
