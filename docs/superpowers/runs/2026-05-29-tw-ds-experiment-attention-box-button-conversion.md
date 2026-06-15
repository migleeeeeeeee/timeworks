# Attention box — design-system reconciliation (buttons)

**Target:** `Attention box` component set — node `49719:108160`
**File:** TimeWorks Design System (Experiment) `gqYWCu1K6dJ9gESXtgNeCi` (work-in-DS-file mode)
**Scope:** Per user request — swap non-DS buttons inside the Attention box to the DS **Button** (`46939:91505`). Edited the component definition itself (all variants).
**Date:** 2026-05-29

## Swapped

The Attention box CTA containers held a **legacy Button set** (`49719:75147`, same name "Button") that was a copy of the DS Button — identical variant schema (`Kind / Size / State / Icon / Color` + the same `Button text#24152:0` and `Icon type#29689:316` property IDs). Repointed all 10 instances to the DS Button (`46939:91505`) via `swapComponent`, preserving every variant + text override.

- CTA container `49719:108185` → DS Button — instance `49719:108187` (Kind=Secondary, Size=Small, Color=Inverted)
- CTA container `49719:108206` → DS Button — instance `49719:108208` (Kind=Primary, Size=Small, Color=Inverted)
- CTA container `49719:108242` → DS Button — instance `49719:108244` (Kind=Secondary)
- CTA container `49719:108263` → DS Button — instance `49719:108265` (Kind=Secondary)
- CTA container `49719:108299` → DS Button — instance `49719:108301` (Kind=Secondary)
- CTA container `49719:108320` → DS Button — instance `49719:108322` (Kind=Secondary)
- CTA container `49719:108356` → DS Button — instance `49719:108358` (Kind=Secondary)
- CTA container `49719:108377` → DS Button — instance `49719:108379` (Kind=Secondary)
- CTA container `49719:108413` → DS Button — instance `49719:108415` (Kind=Secondary)
- CTA container `49719:108434` → DS Button — instance `49719:108436` (Kind=Secondary)

**Post-swap verification:** `dsButton = 15`, `legacyButton = 0`. Every button in the component now resolves to set `46939:91505`.

## Already connected

- 5 compact-variant buttons — `49719:108168`, `108225`, `108282`, `108339`, `108396` — already instances of DS Button `46939:91505`. Untouched.
- 5 DS Links (`46946:16984`) and the DS Icon Button close buttons (`25757:58850`) — already DS. Untouched.

## Blocked / out of scope

- **Legacy Link (`49719:107976`), 10 instances** — "Read more" links in the wider CTA containers still point to a non-DS Link set (the DS Link is `46946:16984`). Not swapped: the request was specifically about buttons. Flagged for a follow-up.

## Noticed (pre-existing, not caused by this change)

- The 5 **compact (175px) CTA containers** set their button to `layoutSizingHorizontal = "FIXED"` at width 59px while the "Button" label needs ~43px + padding, so the text wraps to "But / ton". These are the already-DS buttons — present before this run. Fix would be to set those 5 buttons to `HUG` width (risk: may overflow the narrow 175px row alongside the Link + close button). Left as-is pending user decision.

## Raw-value leaks

✓ Not audited — swaps repoint to a library component set whose styling resolves through its own bindings; no new raw values were introduced.

## Backup

No Figma backup frame created — cloning the 17-variant component set inside the published DS file would create duplicate components and pollute the library. The swap is trivially reversible (swap the 10 instances back to set `49719:75147`); the complete before-state (instance IDs + variant props above) is the safety net.

## Verification

- Structural: `figma_execute` count — 15 DS buttons, 0 legacy buttons under `49719:108160`.
- Visual: `figma_capture_screenshot` of `49719:108160` (plugin runtime) — full-width rows render proper DS `Read more` + `Button` (Primary dark / Secondary outlined) across all five tones (info/neutral/positive/warning/negative).
