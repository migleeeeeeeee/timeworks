# Tasks "Table Card" — design-system reconciliation

Target: `28673:360746` ("Table Card") in the TimeWorks Design System (Experiment) file `gqYWCu1K6dJ9gESXtgNeCi`.
Reference: `28299:148455` (DS leave-request "Table Card") — the canonical TimeWorks DS table.
Mode: `work-in-DS-file` (source and DS are the same file).

Goal: make the target table follow the DS table pattern — DS text styles, color treatment, chip style, header style, and the DS Table Footer component. Scope confirmed with user: **full DS match** + **remove chip leading icons**.

## Swapped

- **Header checkbox** → DS `Checkbox` instance (`State=Regular`, `Label=off`) — replaced the custom 18×18 frame.
- **4× row checkboxes** (`C:check`) → DS `Checkbox` instances — replaced custom frames.
- **12× status/priority/progress chips** → fresh DS `Chips` instances, per-instance variant:
  - Status "Active" → `Type=Positive-Subtle`
  - Priority "High" → `Type=Negative-Subtle`; "Medium" → `Type=Warning-Subtle`
  - Progress "Pending" → `Type=Warning-Subtle`; "Inprogress" → `Type=Positive-Subtle`
  - All set to `Size=md`, `Icon=None` (pale subtle fill, no leading icon — matches DS reference).
- **Footer** → DS `Table Footer` component instance (`25767:272220`), `Total label="Showing 1-4 of"`, `Total count="4 results"`, count/pagination/page-size shown. Extra page cells (2, 3, …, 10) hidden so pagination reads a single page "1" for the 4-result set.

## Restyled (token/style-aligned, no component swap)

- **Header Row** — gray fill `#F2F4F7` → `white@0.5` (DS header fill); height 48 → 44; removed per-cell vertical-divider strokes; removed 7 `ellipsis-vertical` kebab icons; labels title-cased (`NAME`→`Name`, … `ACTIONS`→`Actions`). Labels already used the DS `Text3 (12px)/Medium` style + secondary-grey color.
- **4× data rows** — height 72 → 52, cells set to fill row height (content stays vertically centered); removed per-cell vertical-divider strokes; kept the subtle horizontal row divider; transparent row fills (card shows through, DS pattern).
- **Name cells** — text style `Text2 (14px)/Bold` → `Text2 (14px)/Medium` (DS name weight).
- **Table Card chrome** — fill → `white@0.5`, stroke → `near-black@10%` (1px), radius 12, clip — matches the DS reference card chrome.
- Body text in Description / Due Date / Assigned To cells already used the correct DS `Text2` styles and DS color values — left as-is.

## Already connected

- Body cell text styles (`Text2`/`Text3`) were already applied throughout — only the Name weight needed adjusting.

## Blocked

- None.

## Raw-value leaks

Audit over the converted table found 7 unbound values, **all on card/header chrome**, and all deliberately matched to the DS reference table's own (also-unbound) chrome:

- `Table Card` — fill (`white@0.5`), stroke (`near-black@10%`), 4× corner radius (`12`)
- `Header Row` — fill (`white@0.5`)

No leaks in any data cell, chip, checkbox, or footer — every body text node carries a DS text style, and chips/checkboxes/footer are DS library instances whose styling resolves through the component. These chrome values were kept raw to match the canonical DS reference exactly rather than diverge from it.

## Backup

Backup frame: `Backup - Table Card` (node `28673:365211`), placed to the right of the original.

## Screenshots

| Stage | Reference (DS) | Result |
| ----- | -------------- | ------ |
| Full table | `28299:148455` | `28673:360746` |

Result: subtle title-case header, no vertical dividers / kebabs, pale Subtle chips without icons, DS checkboxes, comfortable 52px rows, and the DS Table Footer ("Showing 1-4 of 4 results" · page 1 · "Show per page").
