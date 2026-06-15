# Tasks (List view) — Monthly Repeat (View) — design-system reconciliation

Source frame: `27532:366472` — "Tasks (List view) — Monthly Repeat (View)" in the Experiment DS file (`gqYWCu1K6dJ9gESXtgNeCi`).
Conversion target (scope): the cloned view-mode right panel `27532:366778` only. The sidebar/timer was cloned from the source page and was out of scope.

## Swapped

- Start Track Time (`27532:366787`) → **Button** Kind=Primary, Size=Medium, Icon=Left — node `27533:367518`. Button has no INSTANCE_SWAP icon slot, so the play-icon placeholder remains as the default variant icon.
- High Priority (`27532:366790`) → **Chips** Type=On-Warning, Size=md, Icon=Left, icon=`flag` — node `27533:367530`
- Pending (`27532:366807`) → **Chips** Type=On-Warning, Size=md, Icon=Right, icon=`chevron-down` — node `27533:367544`
- Responsible avatars (2) → **Avatar** Size=Medium, Type=IMG — nodes `27533:367558`, `27533:367563`
- Observers avatars (3) → **Avatar** — nodes `27533:367568`, `27533:367573`, `27533:367578`
- Task Creator avatar → **Avatar** — node `27533:367583`
- Description "Edit" (`27532:366883`) → **Button** Kind=Tertiary, Size=Small — node `27533:367588`
- Attachments "Add" (`27532:366894`) → **Button** Kind=Tertiary, Size=Small — node `27533:367591`
- Checklist "Hide Checked items" (`27532:366914`) → **Button** Kind=Tertiary, Size=Small — node `27533:367594`
- Checklist "Delete" (`27532:366916`) → **Button** Kind=Tertiary, Size=Small — node `27533:367597`
- Checklist "Add an item" (`27532:366969`) → **Button** Kind=Primary, Size=Small — node `27533:367600`
- Checkbox row 1 (`27532:366925`) → **Checkbox** State=Regular — node `27533:367603`
- Checkbox row 2 (`27532:366940`) → **Checkbox** State=Selected — node `27533:367608`
- Checkbox row 3 (`27532:366955`) → **Checkbox** State=Selected — node `27533:367615`
- Checklist progress bar (`27532:366920`) → **Linear Progress Bar** Type=Primary, Size=Small, Percentage="33%" — node `27533:367622`
- Subtasks "Add Subtasks" (`27532:366978`) → **Button** Kind=Primary, Size=Small — node `27533:367632`

## Composed

None this pass.

## Already connected

None — the right panel was cloned from a raw view-mode reference (`27532:365186`) with no DS instances.

## Blocked / Tier 4 — bespoke, preserved as-is

- Header gradient-circle decoration (`27532:366781`) — brand decoration, no matching DS component.
- "Allocated Time Limit" / "Time Spent" / "Date Created" display fields (`27532:366849`, `27532:366857`, `27532:366870`) — read-only display fields with stroke border and inline icon + value + optional "Edit" label. No 1:1 DS component; closest is Text Field but that is for input. Left raw.
- Description card chrome (`27532:366875`) — surrounding card frame, body lorem text, "Description" heading. Card surface + body typography were not migrated to tokens this pass.
- Attachments file row (`27532:366897`, `27532:366902`) — thumbnail + filename + timestamp + ⋯ menu icon. No DS list-item variant matches; left raw.
- Subtasks table (`27532:366982`) — header row + 3 body rows with flag/avatar/status chip per row. Should map to **Table / Cell + ColumnContent + RowCount**, but in-place swap is risky without restructuring the table; left intact.
- "Edit" text inside the Allocated Time display field (`27532:366854`) — would be a small Tertiary Button but it's nested inside a bespoke field; left.
- Loose icons (paper-clip, list-bullet, calendar, clock, chevron-down decorations) — candidates for the bare-icon swap pass; left this round.

## Raw-value leaks

Audit not run this pass — the Tier-4 sections still hold most raw paint/text values from the cloned reference. A follow-up Rule 4 (token-binding) pass is recommended to convert the bespoke chrome to DS tokens before considering the panel "fully DS-bound."

## Screenshots

| Stage | URI |
| ----- | --- |
| Panel before | (captured in conversation; bounds 988×1082 raw clone) |
| Header after swap | (captured) |
| Panel after Tier-1 sweep | (captured; 1053×1082 with DS instances visible) |

## Backup

Backup frame: `Backup - Tasks (List view) — Monthly Repeat (View)` — node `27533:367163`, placed to the right of the new frame on page "Main View — polish".

## Follow-ups

1. Bare-icon swap pass — replace `paper-clip` / `list-bullet` / `calendar` / `clock` / decorative `chevron-down` icon frames with `icon-map.json` instances (sizes 20–24).
2. Subtasks table → DS Table family (Cell + ColumnContent + RowCount + Table Footer). Requires a small layout rebuild.
3. Avatars now show DS Avatar's IMG placeholder (red disc) — re-apply image fills from the reference or replace with letter/initials avatars.
4. Rule 4 token binding sweep across the remaining Tier-4 chrome (card backgrounds, dividers, body text, strokes on display fields) — fonts, colors, radii, effects.
5. Header gradient-circle decoration — convert to either an Avatar (Initial) or annotate-and-preserve as bespoke.
