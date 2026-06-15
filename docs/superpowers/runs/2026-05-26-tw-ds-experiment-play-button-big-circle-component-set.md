# Play Button (big circle) — component set extraction

Mirrors the `Timer Toggle Button` (24×24) reference pattern at the 62×62 size used inside `Task Timer Container`.

## Source

- Target node: `27522:282112` (Play Button (big circle), State=Ready variant of Task Timer Container)
- Reference pattern: `27907:945724` (Timer Toggle Button COMPONENT_SET — 4 State variants of Icon Button XS)

## Created

- `Play Button (big circle)` COMPONENT_SET — node `27917:964491` (384×126)
  - `State` variant property → options: `Idle`, `Paused`, `Running`, `State4` (default: Idle)
  - Placed inside `Section 1` (node `27522:282280`) directly below the existing `Task Timer Container` set, 40px gap

### Variants

Variant names AND visual treatments mirror `Timer Toggle Button` (24×24). Treatments:

| State    | Component node    | Base clone     | Glyph shown      | Visual signature                                 |
| -------- | ----------------- | -------------- | ---------------- | ------------------------------------------------ |
| Idle     | `27917:964451`    | TTC State=Active (`27522:282129`)  | Polygon (play) visible, pause-updated hidden | Secondary outline (gray stroke `46810:1458`), no fill |
| Paused   | `27917:964464`    | TTC State=Ready (`27522:282112`)   | Polygon hidden, pause-updated visible | Purple gradient fill (`46810:1488` → `46810:1499`), drop shadow |
| Running  | `27917:964477`    | TTC State=Ready (`27522:282112`)   | Polygon hidden, pause-updated visible | Purple gradient fill, drop shadow |
| State4   | `27917:964490`    | TTC State=Active (`27522:282129`)  | Polygon visible, pause-updated hidden | Secondary outline (placeholder, matches Idle) |

The pause-updated icon is an instance of COMPONENT `25321:16487` (`pause-updated`). Paused/Running variants instantiate it fresh inside `glyph` at `(0, 0)`.

Each variant preserves the original 62×62 frame structure (radius `999`, child `glyph` 28×28). Tokens already bound in the source carry over verbatim.

## Notes

- Built via `figma.createComponentFromNode(srcFrame.clone())` per state then `figma.combineAsVariants(...)` into the set; variant property `State` auto-derived from the `State=Value` naming convention.
- Initial extraction took visuals 1:1 from the Task Timer Container source frames. On follow-up the set was **rebuilt** so each variant's fill/stroke/effects and glyph match the Timer Toggle Button treatment (outline-for-Idle/State4, purple-gradient-for-Paused/Running).
- Section 1 was extended from 380px to 488px tall to contain the new set.
- The inline 62×62 frames inside `Task Timer Container` State variants were **left in place** — swapping each to an instance of the new component set is a natural follow-up but not done in this run.

## Follow-up (optional)

Swap inline `Play Button (big circle)` frames inside the four `Task Timer Container` state variants for instances of `Play Button (big circle)` with the matching `State` prop. Mapping is semantic, not positional: TTC `Ready`/`Active` → Play `Idle` (pre-start, click to play); TTC `Active` while tracking → Play `Running`; TTC `Break` → Play `Paused` or similar — confirm before running.

## Backup

No destructive change was made to source content; the inline frames inside `Task Timer Container` remain intact. The new component set lives at node `27917:964491` (the earlier draft `27917:964423` was removed and replaced during the visual realignment pass).
