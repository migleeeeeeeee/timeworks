# Task Detail Card — design-system reconciliation

**File:** `gqYWCu1K6dJ9gESXtgNeCi` (TimeWorks Design System — Experiment)
**Target:** node `27524:305318` ("Frame 1707484896" — task detail card)
**Mode:** `work-in-DS-file` (source = DS file)
**Reference consulted:** `27482:244917` ("Tasks (List view)")

## Swapped

- High Priority pill → `Chips` (Type=Negative-Subtle, Size=md, Icon=Right) — node `27524:307126`
- Pending pill → `Chips` (Type=Warning-Subtle, Size=md, Icon=Right) — node `27524:307144`
- Allocated Time Limit input → `Text Field` (Size=Small, hex right-icon hidden) — node `27524:307707`
- Date Created input → `Text Field` (Size=Small, hex right-icon hidden) — node `27524:307798`
- Avatar 1 (Responsible) → `Avatar` (Size=Medium, Type=IMG) — node `27524:306869`
- Avatar 2 (Observers) → `Avatar` (Size=Medium, Type=IMG) — node `27524:306874`
- Avatar 3 (Task Creator) → `Avatar` (Size=Medium, Type=IMG) — node `27524:306879`
- Avatar 4 (Subtasks row) → `Avatar` (Size=XS, Type=IMG) — node `27524:306884`
- Attachments "Upload from Device" → `Button` (Kind=Tertiary, Size=Medium) — node `27524:306941`
- Checklist row 1 checkbox → `Checkbox` (State=Regular, Label=off) — node `27524:306889`
- Checklist row 2 checkbox → `Checkbox` (State=Regular, Label=off) — node `27524:306894`
- Checklist header checkbox → `Checkbox` (State=Regular, Label=off) — node `27524:306899`
- "Built in Webflow" / "Assigned: Jac" / "Due Date: …" row-1 meta chips → 2× `Chips` (Default, sm) — nodes `27524:307035`, `27524:307053`
- Row-2 meta chips (Jac / Matt / Due Date) → 3× `Chips` (Default, sm) — nodes `27524:307071`, `27524:307089`, `27524:307107`
- "Add an Item" search input → `Text Field` (Size=Medium) — node `27524:307252`
- "Jac" assignee chip → `Chips` (Type=On-Selected, Size=sm, Show close button=yes) — node `27524:307171`
- "Matt" assignee chip → `Chips` (Type=On-Selected, Size=sm, Show close button=yes) — node `27524:307189`
- "27 Jan 2026, @14:30 EST" date chip → `Chips` (Type=On-Selected, Size=sm, Show close button=yes) — node `27524:307207`
- "Add" → `Button` (Kind=Primary, Size=Small) — node `27524:306952`
- "Cancel" → `Button` (Kind=Tertiary, Size=Small) — node `27524:306908`
- "Assign" → `Button` (Kind=Secondary, Size=Small, Icon=Left) — node `27524:306911`
- "Due Date" → `Button` (Kind=Secondary, Size=Small, Icon=Left) — node `27524:306923`
- "Add Subtasks" → `Button` (Kind=Primary, Size=Medium, Icon=Left) — node `27524:306932`
- "In-Progress" status chip → `Chips` (Type=On-Positive, Size=sm) — node `27524:307225`
- "Repeat Task" row → `Checkbox` (State=Regular, Label=on, text="Repeat Task") — node `27524:306904`
- Weekly / Monthly tabs → `Tabs` (Type=normal, Amount=2, labels "Weekly"/"Monthly") — node `27524:307007`
- "01" input → `Text Field` (Size=Medium, hex icon hidden) — node `27524:307343`
- "Selected Day" input → `Text Field` (Size=Medium, hex icon hidden) — node `27524:307434`
- "00:00" Time input → `Text Field` (Size=Medium, hex icon hidden) — node `27524:307525`
- "2/6/2026" Start Date input → `Text Field` (Size=Medium, hex icon hidden) — node `27524:307616`
- No-end-Date / end-Date / After row → `Radio buttons variants` (Amount=3, Positioning=horizontal) — node `27524:307056`
- "Save Task" footer → `Button` (Kind=Primary, Size=Medium) — node `27524:306950`

**Total instances created: 32** across Avatar, Button, Checkbox, Chips, Radio buttons variants, Tabs, Text Field families.

## Composed

(no compose-from-primitives sections — every needed pattern had a single DS component fit)

## Already connected

- (none — the card was a raw layout before this run)

## Blocked

- (none — every section was substitutable or already-connected)

## Token bindings applied

- 26 raw `TEXT` nodes bound to nearest DS text style by `(fontSize, weight)` snap — labels ("Responsible", "Observers", "Allocated Time Limit", "Task Creator", "Date Created", "Description", "Attachments", "Checklist", "Subtasks Name", "Prio…", "Respon…", "Status", "Repeat Every", "Week(s) on", "Time", "Start Date", "Lorem ipsum dolor", "Subtasks"), headings ("Task Name"), placeholder labels.
- 41 raw SOLID fills bound to nearest DS color variable.
- 19 raw SOLID strokes bound to nearest DS color variable.
- Card root frame `27524:305318` bound to `primary-background-color` (fill) + `ui-border-color` (stroke); 5 instance roots (4 Avatar, 1 Tabs) corrected from initial 40%-alpha `secondary-background-color` mismatch to `primary-background-color`.

## Raw-value leaks

✓ No raw values detected.

(Final audit, after the two binding passes and the post-audit re-bind, returned `leakCount: 0`. The audit walks every fill / stroke / cornerRadius / TEXT node outside DS instances and asserts a `boundVariables` entry or a `textStyleId` is present.)

## Notes / known follow-ups

- The standalone raw icons inside the card (paper-clip, list-bullet, calendar, clock, chevron-down, info-circle, flag, bars-3-bottom-left) are still untouched VECTORs. They render via the surrounding instance defaults and don't leak raw color (each VECTOR's stroke/fill was bound in the Rule-4 pass). A dedicated `icon-map.json` swap pass would replace them with canonical DS icon components — out of scope for this run because the user asked specifically for components / colors / text styles, not bare-icon replacement.
- The DS Button instances (`Assign`, `Due Date`, `Add Subtasks`, `Save Task`) render the DS's built-in `hexagon-image` placeholder in their icon slot. That is the DS component's own default override target, not a raw value. Swap it via `setProperties({ 'Icon type': <icon-map id> })` if a specific icon is desired.
- The DS Avatar instances render the DS's `IMG` placeholder (a tinted blob). Replace with a real image via `instance.fills = [{ type: 'IMAGE', ... }]` when production photos exist.
- The card root frame width was clamped back to **1053px** after the Text Field swaps temporarily shrunk it to 520px (Text Field's intrinsic size differs from the source `Frame 1707485086` it replaced); all section frames now have `layoutAlign: STRETCH` so they fill the card consistently.

## Screenshots

| Stage             | Result                                                                                                          |
| ----------------- | --------------------------------------------------------------------------------------------------------------- |
| Before conversion | (captured in conversation — raw frames, custom buttons, raw hex colors, no text-styles)                         |
| Full target after | 1053 × 1217 — Avatar / Chips / Button / Text Field / Checkbox / Tabs / Radio buttons variants all DS-backed.    |

## Backup

Backup frame: `Backup - Frame 1707484896` (node `27524:306495`) placed adjacent to the original on the **Main View — polish** page.
