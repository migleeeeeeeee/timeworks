# Timeoff Requests — design-system reconciliation

**Scope:** the data table on the *Timeoff Requests* page (`28294:183557`), rebuilt to use the DS Table component family referenced at `46949:12307` (*Table - Overview*).
**Entry mode:** `work-in-DS-file` — source page and DS components both live in the Experiment file `gqYWCu1K6dJ9gESXtgNeCi`.

## Composed

- **Table Body** → `compose: 10× Table / ColumnContent` — node `28709:460914` (new frame *Table Body (DS)*, inserted at index 0 of *Table Card* `28299:148455`).
  The former hand-built table (a *Table Header* frame + four *Row / …* frames) was replaced by ten DS `Table / ColumnContent` instances, each `RowCount=4, Size=Medium`, laid out side-by-side. The DS column model merges header + rows into one vertical column per field, so the standalone header frame is no longer needed.

  | Column | DS `ColumnContent` Type | Width | Header | Notes |
  | ------ | ----------------------- | ----- | ------ | ----- |
  | select | `Selectable` | 48 | — | Checkbox column (select-all checkbox in header position) |
  | member | `Avatar+Text` | 260 | Member | Avatar + name |
  | status | `Chip` | 140 | Status | Per-row tone: `On-Positive` for *Approved*, `On-Warning` for *Pending* |
  | leave | `Text` | 160 | Leave Type | |
  | policy | `Text` | 236 | Policy Name | |
  | notes | `Text` | 246 | Notes | |
  | start | `Text` | 200 | Start | |
  | end | `Text` | 200 | End | |
  | days | `Text` | 120 | Days | |
  | hours | `Text` | 142 | Hours | |

  Widths preserved from the source (sum 1752 + 20px L/R padding = 1792, matching the card). All cell text, status tones, and the four member names were written into the DS instances.

## Already connected

- **Table Footer** — node `28341:374414` — left intact (*Showing 1-4 of 4 results*, pagination, *Show per page*). Not part of the requested table-body swap.

## Blocked

- None.

## Raw-value leaks

✓ No raw values detected in the rebuilt table body. The 10 fills surfaced by the audit are the `Table / ColumnContent` **instance roots**, whose fill resolves through the DS component definition (library binding) — excluded per the skill's "descendants of newly-placed library instances" rule. The wrapping *Table Body (DS)* frame is transparent (`fills: []`).

## Known fidelity note

- The DS `Avatar+Text` cell exposes a **single text line**, so the member column now shows the name (avatar + name). The source's secondary email line (e.g. `louise@abroadworks.com`) is not represented by this DS variant. This is a design-system constraint, not a raw-value leak — adapted to the DS per "substitution, not gap-flagging."

## Screenshots

| Stage | Result |
| ----- | ------ |
| Full page (before) | captured at run start — hand-built table |
| Full page (after) | `28294:183557` — DS table in place |
| Table card close-up (after) | `28299:148455` |

## Backup

Backup frame: `Backup - Timeoff Requests` (node `28709:459614`), placed to the right of the original page.
