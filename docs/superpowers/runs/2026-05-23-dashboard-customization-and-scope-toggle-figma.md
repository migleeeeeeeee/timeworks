# Run · Dashboard Customization + Me/All Toggle (Figma authoring)

**Date:** 2026-05-23
**Spec:** `docs/superpowers/specs/2026-05-23-dashboard-customization-and-scope-toggle-design.md`
**Scope:** Figma only — no code emitted.
**File:** TimeWorks Design System (Experiment) — `gqYWCu1K6dJ9gESXtgNeCi`
**Page:** Admin Manager View
**Source frame:** Daily Report (`27823:196654`)
**Container section:** Dashboard Customization + Me-All Feature (`27828:406218`)

## Deliverables

| # | Frame | Node ID |
| --- | --- | --- |
| 1 | Daily Report — All view (default) [F1] | `27828:406484` |
| 2 | Daily Report — Me view active [F2] | `27828:407119` |
| 3 | Kebab Menu Open — Customize entry [F3] | `27831:422274` (rebuilt) |
| 4 | Customize Modal — Default [F4] | `27829:418735` (rebuilt) |
| 5 | Customize Modal — Dragging [F5] | `27829:419039` (rebuilt) |
| 6 | Customize Modal — Widget off [F6] | `27829:419344` (rebuilt) |
| 7 | Tokens Sticker [F7] | `27831:424500` (rebuilt) |

## Components used

After a user-driven rework pass, F3 and F4–F6 use real DS component instances rather than hand-drawn equivalents:

- **F3 kebab** is a real `Icon Button` instance (`Size=Medium, Kind=Tertiary, State=Default, Loader=False, Color=Primary` — nodeId `25757:57748`) with its `Icon Wrapper` child set to `ellipsis-vertical` (`25321:16506`).
- **F3 menu item icons** are real `Icon Wrapper` (Size=sm, nodeId `25320:54482`) instances with icon swaps for `download` (Export CSV), `arrows-rotate` (Refresh data), and `sliders-simple` (Customize dashboard, highlighted).
- **F4/F5/F6 modal** is built from the `Modal / Basic — Size=Medium, Scroll=No` component (nodeId `46947:757`). The instance is detached so we can fill the body slot with widget rows; the close X in the header retains its `Icon Wrapper` with `x-mark small`. The detach was necessary because the body's `_Slot` content is a nested instance that cannot be removed without detaching.
- **Widget row toggles** are real `Toggle` instances — `State=On, Disabled=Off, Size=Medium` (nodeId `46949:40911`) and the corresponding Off variant. The "Off | On" labels are part of the Toggle component itself.
- **Widget row grip handles** are real `Icon Wrapper` instances with `grip-lines` (`25321:16561`).
- **Footer Cancel/Save** retain the modal footer's `Button` instances (relabeled via `Button text#24152:0`).

### Substitutions still in place

The Me/All toggle on the Daily Report toolbar (Frames 1 & 2) is hand-built as a 2-segment pill with token-bound primitives. The `Button Group` DS component has 5 fixed nested-instance slots that can't be reduced without detaching the whole group, and the spec called for a 2-segment `SegmentedControl` which doesn't exist as a discrete component in this file. The pill matches the code repo's `ButtonGroup` look at the 2-item size.

## Token discipline

Every fill, stroke, radius, and shadow on the new pieces binds to a Figma variable. The token sticker (F7) enumerates the 15 colors, 7 spacing steps, 4 radii, 3 elevation tiers, and 5 type styles consumed. No raw hex / px / rgba escaped into the new mockups.

## What did NOT change

- The original `Daily Report` frame (`27823:196654`) was left untouched. F1 is a clone with the Me/All pill added.
- No new DS components were created. No tokens were added.
- No code was written.

## Verification

- Captured screenshots of all seven frames during authoring — visually correct.
- All deliverables placed inside the named Section (`Dashboard Customization + Me-All Feature`) — no floating layers on the page.
- Section auto-resized to fit content.

## Open follow-ups (not done in this run)

- If the user wants this implemented in code, hand off to `figma-to-code` would need a *single component* target — this feature is multi-component, so it would be a series of code tasks (showcase page, scope hook, customize modal) rather than a single code-gen pass.
- A11y audit was not run — the deliverables are static mockups composed from already-shipped components, so it was deemed unnecessary for a Figma-only delivery.
