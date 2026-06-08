# Pink theme mode + remove Dark — design

**Date:** 2026-06-08
**Status:** Approved design, pending implementation
**Source design:** Figma "Project table view ✨ Kawaii" — file `gqYWCu1K6dJ9gESXtgNeCi`, node `28277:475746`

## Goal

Add **Pink** as a new color theme mode (a `[data-theme="pink"]` override set) and **remove the Dark** theme mode entirely. The pink palette is derived from the kawaii mockup.

## Decisions

- **Pink is a full theme mode**, not a single color token — it mirrors Light/Dark/Black.
- **Dark is removed everywhere** — token source, build pipeline, generated CSS, and both UI theme toggles.
- **Code only — Figma is not updated.** The Figma "Color Tokens" variable collection keeps Light/Dark/Black; the code tokens will intentionally drift from Figma. This violates the usual Figma-led token rule by explicit choice; revisit if the drift becomes a problem.
- **brand-color in Pink = `#d6238a`** (deep magenta, distinct from the `#ff4fab` primary).

## How modes work today (for reference)

- Each mode is a full 180-token JSON in `src/tokens/source/Color Tokens/{Light,Dark,Black}.json`.
- `$metadata.json` lists them in `tokenSetOrder`.
- `scripts/build-tokens.mjs` reads each mode, emits Light into `@theme { }` and Dark/Black as `[data-theme="…"]` blocks containing **only the deltas vs Light**.
- Output: `src/tokens/dist/css/variables.css` (generated — never hand-edited).
- Theme is selected at runtime by `data-theme` on `<html>`: `src/showcase/App.tsx` (`THEMES`) and `.storybook/preview.ts` (`withThemeByDataAttribute` + `backgrounds`).

Verified safe: **no component sets `data-theme="dark"` on its root.** The `"dark"` strings in Tabs/Tipseen/AvatarGroup are independent cva variant names (`onColor`/`theme` props mapping to inverted tokens), unaffected by removing the Dark mode.

## Pink palette (override set vs Light)

`Pink.json` is a full copy of `Light.json` with only these tokens changed. All other 166 tokens stay identical to Light, so the build emits only these as the `[data-theme="pink"]` block.

| token | Light | Pink |
|---|---|---|
| primary-color | #1a56db | #ff4fab |
| primary-hover-color | #1039ad | #e22e93 |
| primary-selected-color | #c7d9ff | #ffd6ec |
| primary-selected-hover-color | #a4bfff | #ffb8db |
| primary-highlighted-color | #e0eaff | #fff0f8 |
| primary-background-color | #fafbfd | #fff7fc |
| primary-surface-color | #f6f6f6 | #fdeef6 |
| brand-color | #6e2bd9 | #d6238a |
| brand-hover-color | #4d1faa | #b01773 |
| brand-selected-color | #ede9fe | #ffe3f3 |
| brand-selected-hover-color | #ddd6fe | #ffc9e6 |
| brand-highlighted-color | #f5f3ff | #fff0f8 |
| gradient-page-start-color | #ebf1f6 | #ffe3f3 |
| gradient-page-end-color | #f3e6ff | #efe3ff |

## Known limitation

The mockup's gradient-filled buttons (`#ff5fb5 → #b57bff`), radial decorative blobs, and sparkles are raw fills / decorative layers, not token variables. A token-based mode cannot express a gradient in a single solid token, so the DS primary button renders **solid pink**, not the gradient. The page wash and all solid pink accents reproduce faithfully. Out of scope: decorative blobs/sparkles.

## Files touched (7)

1. `src/tokens/source/Color Tokens/Pink.json` — **new** (copy of Light + the 14 swaps above)
2. `src/tokens/source/Color Tokens/Dark.json` — **deleted**
3. `src/tokens/source/$metadata.json` — replace `"Color Tokens/Dark"` with `"Color Tokens/Pink"` in `tokenSetOrder`
4. `scripts/build-tokens.mjs` — replace the `dark` read + `emitOverrides("dark", dark)` + summary line with the `pink` equivalents
5. `src/tokens/dist/css/variables.css` — **regenerated** via `npm run tokens:build` (drops the `[data-theme="dark"]` block, adds `[data-theme="pink"]`)
6. `src/showcase/App.tsx` — `THEMES = ["light", "black", "pink"]`
7. `.storybook/preview.ts` — swap `dark` for `pink` in `themes` and `backgrounds.values` (pink background ≈ `#FFF0F8`)

`build-tokens.mjs`, everything under `src/tokens/`, and the regenerated `variables.css` are load-bearing per CLAUDE.md — diffs shown, not auto-accepted.

## Verification

- `npm run tokens:build` succeeds; summary line reports pink overrides count (~14), no dark.
- `variables.css` contains `[data-theme="pink"]`, no `[data-theme="dark"]`.
- Showcase + Storybook toggles list light/black/pink; selecting pink applies the palette.
- Spot-check pink renders correctly (primary button, links, page gradient) and black still works.
