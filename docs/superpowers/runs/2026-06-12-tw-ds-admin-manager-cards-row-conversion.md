# Admin Manager View — "Cards Row" — design-system reconciliation

**File:** TimeWorks Design System (Experiment) `gqYWCu1K6dJ9gESXtgNeCi` · **Page:** Admin Manager View
**Target:** `Cards Row` (node `28501:220505`) — Attendance KPIs Card + Schedules Card
**Mode:** work-in-DS-file / apply-known-scope · **Date:** 2026-06-12

The frame entered already heavily token-bound (152/152 fills bound, 79/91 text styled). The gap was **workstyle**: the body was 100 hand-built frames with only 5 DS instances. This pass replaced the hand-built pieces with DS component instances and bound the last raw text/radii.

## Swapped

- Shift Timeline avatars ×7 → **Avatar** (`Size=Small`, `Type=IMG`) — nodes `28501:224633`, `224640`, `224647`, `224654`, `224661`, `224668`, `224675` — replaced hand-built 26px circles; matches the Top-Contributors avatars already DS-backed in the same composition.
- Top Contributors avatars ×4 → **Avatar** (`Size=Medium`, `Type=IMG`) — nodes `28501:220554`, `220565`, `220577`, `220588`.
- "May 2026" pill → **Chips** (`Type=Default`, `Size=md`, no avatar/icon) — node `28501:225300` — small neutral label pill.
- "Clock Chip" → **Chips** (`Type=Default`, `Size=md`, `Icon=Left` → `Clock-new` via **Icon Wrapper**) — node `28501:225305` — emoji `🕑` replaced with the DS clock icon; text normalized to "2:30 PM".
- Banner warning glyph `⚠` → **Icon Wrapper** (`Size=sm`) + `triangle-exclamation`, fill bound to the glyph's original color var (`46810:1453`) — node `28501:226967`.
- Header link arrow `→` → **Icon Wrapper** (`Size=sm`) + `arrow-right`, fill bound to the link's primary color var (`46810:1488`), grouped with the text in "View all link" (`28501:226991`); link text normalized to "View all schedules".

## Composed

- Employee chips ×3 → **Chips** (`Type=Default`, `Size=md`, `Avatar=Left`, nested Avatar `Type=IMG`) — nodes `28501:224882` (Anika Sharma), `224894` (Tom Reeves), `224906` (Zoe Chambers) — replaced hand-built avatar+name pills; name set via `Chip Text`, profile photo via the nested Avatar.

## Token-bound (no swap — Rule 4)

- Eyebrow labels → text style **Text3 (12px)/Medium** (`S:f29b…84e`) — nodes `28501:220549` ("TOP CONTRIBUTORS"), `222262` ("TODAY'S SHIFT TIMELINE"). Source had 4% tracking; the DS style carries 0% — tracking dropped rather than re-applied, since re-applying letterSpacing detaches the style. Negligible visual change.
- Container radii → **space-12** / **space-8** variables on 21 frames (both cards, 4 KPI cells, 4 contributor rows, 3 stat cells, the banner @ 12; 7 timeline tracks @ 8). Exact-match bindings, zero visual change.

## Already connected

- "Set up schedules" — node `28501:220621` (Button).

## Blocked / preserved (Tier-3 bespoke)

- **Shift Timeline chart** — the gantt-style shift bars and time-axis are a bespoke data visualization with no DS chart/timeline component. Left as a token-bound custom graphic.

## Raw-value leaks

Inside Tier-1/Tier-2 (swapped/composed) sections: **✓ none** — 0 raw fills, 0 raw strokes, 0 unstyled text.

Residual, confined to the Tier-3 bespoke Shift Timeline chart (exempt — no DS equivalent):

- `Frame` (timeline shift bars) ×7 (`28501:222280`, `222289`, `222298`, `222307`, `222316`, `222325`, `222334`) — radius: 6 (no exact DS token; 4/8 are equidistant — left to preserve the chart).
- `Rectangle` (legend swatches) ×4 (`28501:222339`, `222342`, `222345`, `222348`) — radius: 3 (left to preserve the chart).

## Notes

- **Avatars use `Type=IMG`** (DS profile-photo placeholder) per follow-up feedback — replaced the monotone `Type=Initials` look. All instances share the DS placeholder photo (no distinct image assets in scope).
- **Standalone glyphs now use DS Icon Wrappers** (`⚠` and `→`) per follow-up feedback, with their icon fills bound to the same color variables the original glyphs used.
- The "No Schedule Banner" container itself was kept (token-bound warning box) and only its inner chips were upgraded — the DS Alert banner / Attention box components don't model an embedded chip row + action button.

## Screenshots

| Stage | Result |
| ----- | ------ |
| Full target (after) | Attendance KPIs + Schedules cards, all pieces DS-backed |
| Shift Timeline | 7 DS Avatars with initials |
| No Schedule Banner | 3 DS Chips w/ initials avatars |
| Clock Chip | DS Chips + `Clock-new` icon |

## Backup

Backup frame: `Backup - Cards Row` (node `28501:223549`) on page "Admin Manager View" at (7034, 25881).
