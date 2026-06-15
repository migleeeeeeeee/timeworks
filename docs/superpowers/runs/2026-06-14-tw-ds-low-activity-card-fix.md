# Low activity card — design-system fix

Target: `Low activity` card (node `28672:225325`) in the TimeWorks Design System file (`gqYWCu1K6dJ9gESXtgNeCi`).
Reference / basis: `RowList` (node `28672:225514`) — the clean, DS-built version of the same row pattern.
Mode: `work-in-DS-file` (source == DS file).

## What was wrong

- `nameblock` was fixed at 150px, so longer names truncated ("Sofia Dimaculangan" was clipped).
- Progress bars were hand-made `track` FRAMEs (8px, raw rectangles), not the DS Linear Progress Bar.
- "5 flagged" was a hand-rolled pill (bare FRAME + text) floating in its own row below the header.
- Row EP's percent column was the odd one out — top-aligned (`MAX/MIN`, 56×40) vs the others' centered `MAX/CENTER` 56×20.

## Swapped

- 5× progress bar `track` → **Linear Progress Bar** (Size=Small, Label=Off), severity-mapped to the same 3-tier palette the reference uses (the DS has no yellow bar):
  - Krizia 28% → `Type=Negative` — node `28672:265412`
  - Sofia 34% → `Type=Negative` — node `28672:265419`
  - Nicole 41% → `Type=Primary` — node `28672:265426`
  - Rico 44% → `Type=Primary` — node `28672:265433`
  - Diego 47% → `Type=Positive` — node `28672:265440`
  - Fill width set proportionally to each row's % (instance stretched to 514px).
- "5 flagged" pill → **Chips** (Size=sm, Type=Warning-Subtle, Icon=None) — node `28672:265476`. Pale-yellow source fill (rgb 254,249,195) mapped to `Warning-Subtle`.

## Composed / restructured

- Header restructured: title + chip now share a left `TitleGroup` (node `28672:265475`, gap 8, center-aligned); the floating `FlagWrap` row was deleted so "5 flagged" reads as a count beside the title.
- 5× `nameblock` widened 150 → 180px (fixes truncation).
- 5× percent column normalized to `MAX/CENTER` (Row EP was the outlier).

## Gap tightening (both target + reference)

- The DS Linear Progress Bar instance is 22px tall with the 4px bar vertically centered (`SCALE` constraint — can't be re-anchored or shrunk without scaling the bar). To pull the `Xh / day` / company caption up against the bar, the bar-frame `itemSpacing` was set to `-4` on all 5 rows of both the target card (`28672:225325`) and the reference `RowList` (`28672:225514`).

## Clear rows (table treatment, per reference `28672:225658`)

- RowList `itemSpacing` 22 → 0 so rows touch and the alternating shading reads as continuous bands instead of floating.
- Each row given 16px top/bottom padding (row height ~72) for breathing room.
- Each row except the last given a 1px **bottom divider** bound to the DS border variable `46810:1527` (`strokeBottomWeight=1`, INSIDE), matching the table reference. Alternating shading (var `46810:1543`) was already present and kept.

## Already connected

- Header `View in timesheets` Button, row Avatars, and percent trend Icon Wrappers were already DS instances — left as-is.

## Raw-value leaks

✓ No raw values introduced — new elements are DS component instances; the bars' fill colors and the chip styling resolve through the DS components' own bindings.

## Notes

- Progress-bar fill widths are absolute (matching the reference's own approach); if the card is later resized substantially the fills won't auto-rescale to the % — same limitation the reference carries.
- Bar severity colors are an approximation: the DS Linear Progress Bar has no yellow `Type`, so the original red/yellow/grey gradient was mapped to Negative/Primary/Positive (the reference's palette). Easy to retune if a different mapping is preferred.

## Backup

Backup frame: `Backup - Low activity` (node `28672:265151`), placed on the page canvas below the dashboard (≈ x 14751, y 17692).
