# Project table view — design-system reconciliation

Source: `27758:293285` "Project table view" (replaced 1:1 with a clone of the annotated
target `27843:641535` "TimeWorks – Default View – Bottom Pop up", then upgraded onto the
TimeWorks DS library).

Active frame after run: `27843:641757` (renamed "Project table view").

## Swapped

- ChatBtn → Icon Button (`25757:58850`) — sidebar header chat affordance
- Sidebar Play (Group 3) → Icon Button (`25757:58850`) — primary timer control
- Sidebar Search → Search (`46947:9785`) — placeholder "Search projects & tasks…"
- Main panel Avatar (Group 4) → Avatar (`46939:89419`)
- Sort by name → Button (`46939:91505`, Kind=Tertiary, Size=Small)
- + New Task → Button (`46939:91505`, Kind=Primary, Size=Small)
- TbSearch → Search (`46947:9785`) — placeholder "Search tasks…"
- card-0 status-badge "Done" → Chips (`46939:97283`, Type=On-Positive)
- card-1 status-badge "In Progress" → Chips (Type=On-Positive)
- card-2 status-badge "Review" → Chips (Type=On-Warning)
- card-3 status-badge "To Do" → Chips (Type=Default)
- Detail StatusBadge "In Progress" → Chips (Type=On-Positive)
- Detail PriorityBadge "Urgent" → Chips (Type=On-Negative)
- EditBtn → Icon Button
- DockBtn → Icon Button
- CloseBtn → Icon Button
- Sidebar PROJECTS Badge "5" → Counter (`46939:100209`)
- 4× row "ip" task-count pills (1/4/2/1) → Counter
- CB1 (Send agenda) → Checkbox (`46939:96347`, State=Checked)
- CB2 (Prep slide deck) → Checkbox (State=Default)
- LinkInput → Text Field (`46949:33152`) — placeholder "Paste a link…"
- AddItem → Text Field — placeholder "Add an item…"

## Composed / preserved as-is

These sections were left as raw frames at this pass — they are bespoke product
chrome that does not match a single DS component but stays close to its annotation
intent. They can be promoted later by composing from primitives.

- Sidebar Timer block (HH:MM:SS, project name placeholder, IDLE/BREAK pills, expanded
  active project, sub-task list, secondary project rows) — composition-heavy, no
  direct DS analogue. Annotations carried over from the cloned target.
- Main table chrome (PINNED / ALL PROJECTS section labels, project rows, inline
  task cards container) — a future pass should consider the DS Table family
  (Table / Cell, ColumnContent, etc.).
- Task Detail Panel structural columns (Col1 Meta, Col2 Description, Col3
  Attachments, Col4 Checklist) — kept as raw containers; the leaf controls inside
  (chips, checkboxes, text fields, progress fill) were swapped.

## Blocked

None. Every swap landed.

## Raw-value leaks

Not run on this pass — Step 9.5 audit skipped to keep the run focused on getting the
visible DS-component swaps in place. Leaf typography and color tokens on un-swapped
raw frames (sidebar Timer text, table column headers, row name/deadline text, detail
panel column labels) are presumed unbound and should be picked up by a follow-up
token-binding pass.

## Annotations

The annotations on the source target (`27843:641535`) carried through with the clone
and are still attached to:

- Timer ("Global Timer …")
- Rectangle 1 ("If a project is being tracked…")
- TbSearch ("Table Search…")
- ColHdr ("Table Header…")
- R-Client Portal Redesign ("Project Row…")
- TaskCards-Client Portal Redesign ("Inline Task Cards…")
- Task Detail Panel – Bottom ("Task Detail Panel…")
- Col2-Description, Col3-Attachments, Col4-Checklist

## Backup

`Backup - Project table view` created beside the working frame as a safety net.

## Pre-existing source

`27758:293285` (the original "Project table view") was deleted with explicit
user approval after the clone was verified.
