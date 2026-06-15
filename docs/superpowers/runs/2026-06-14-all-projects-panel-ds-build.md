# All Projects panel — DS build (from screenshot)

- **Date:** 2026-06-14
- **File:** TimeWorks Design System / Experiment file `gqYWCu1K6dJ9gESXtgNeCi`
- **Result node:** `28672:175608` ("All Projects — panel"), page "Admin Manager View", below the Projects rebuild
- **Source spec:** screenshot of an "All projects" management panel (Image #3)
- **Mode:** screenshot-based build from scratch using DS components + tokens (no foundation node)

## Sections built

1. **Header** — "All projects" title (Montserrat SemiBold 28) + "512" counter pill; subtitle; three DS Buttons: "Import CSV" (Secondary, `download` icon), "Manage rules" (Secondary, `gears` icon), "New project" (Primary, `plus-small` icon).
2. **Filter row** — DS Search (fills width) + four DS Dropdowns ("Client: All clients", "Status: Active", "Member: Anyone", "Billable: All") + a hand-built segmented control [Table(selected) | Board | By client] (no DS SegmentedControl exists in the Experiment file).
3. **Views row** — "Views:" label + DS Chips: "My projects" (Primary-Subtle/selected), "Active billable", "Onboarding queue", "Inactive" (Default) + a dashed "+ Save current" chip.
4. **Selection bar** — `primary-surface-color` fill + `primary-color` 1.5px border; "2 projects selected · Select all 512" (link in `primary-color`); action buttons Add/Remove members, Set status, Set billable, Export, and "Archive" (text bound to `negative-color`).
5. **Table** — bordered card; header row (PROJECT/CLIENT/STATUS/MEMBERS/TASKS/BILLABLE/LAST ACTIVITY + select & actions); 2 selected rows (checked DS Checkbox `State=Selected`, `primary-surface-color` bg) matching the screenshot + 3 unselected representative rows. Columns: Select 56 / Project 420 / Client 200 / Status 140 / Members 280 / Tasks 110 / Billable 150 / Last Activity 180 / Actions 80.

## Custom (non-DS) compositions

- **Member avatar stack**: dark rounded-square avatars (`inverted-color-background`) with white initials (`text-color-on-inverted`), 2px white OUTSIDE ring, `itemSpacing=-8`, `itemReverseZIndex=true`, + count text. The DS Avatar is circular/single-letter, so this was hand-built per the screenshot's dark squared style.
- **Segmented control** and **counter pill** and **dashed Save-current chip** — hand-built, fully token-bound.

## Token binding

Full pass over the panel: 74 text styles, 52 fills, 23 strokes, 196 radii bound. Leak audit = **0 raw values**.

## Notes for the designer

- ⌘K keyboard hint inside the Search field was omitted (DS Search has a fixed internal layout).
- The 3 lower rows (Aleph Institute Portal, Friendship Circle App, CKids Global) are invented to make the table realistic — the source screenshot was cropped at 2 rows.
- "Remove members" button has no minus icon (no `minus` icon in the DS icon set); rendered as text.
