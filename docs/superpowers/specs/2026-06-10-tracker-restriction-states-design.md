# Tracker restriction states — Figma design spec

**Status:** spec, awaiting plan
**Date:** 2026-06-10
**Figma:** component set `Task Timer Container`, node `27522:282279`, section `Timer` (node `27522:282280`), fileKey `gqYWCu1K6dJ9gESXtgNeCi` (Experiment file)

Add eight new `State=…` variants to the existing **Task Timer Container** component set, covering four admin-imposed tracking restrictions: tracking disabled, daily time limit, weekly time limit, and fixed shift windows. Figma only — no React/desktop-app code changes in this work.

---

## Decisions captured during brainstorming

| Decision | Choice |
| --- | --- |
| Base design | "Timer" section cards (component set `27522:282279`), not the older sidebar `Task Timer Container — States` section |
| Placement | Extend the existing Timer section — new variants added to the existing component set, second row beneath the current five |
| Limit progress display | Text only (e.g. "6h 30m / 8h tracked today") — no progress bar, no ring |
| Message style | Inline in the card — restriction message replaces the task-name caption line |
| Coverage | All 8 states, including the in-progress variants |
| Build approach | New variants in the component set (clone closest existing variant, edit, rename) |
| Scope | Figma only; behavior notes (tooltips, auto-stop) recorded as annotations/spec text for future code work |

---

## 1. Where the work lands

- Component set: `Task Timer Container` (node `27522:282279`) inside section `Timer` (node `27522:282280`) on the page region at node `27464:128248`.
- Existing variants: `State=Ready` (310×144), `State=Active`, `State=Break`, `State=Idle`, `State=State5` (310×158 each), laid out in one row at 350px column rhythm.
- New variants: 8 cards, same 310px width, placed in **two new rows of four** below the existing five (y ≈ 220 and 440), same 350px column rhythm — one row of eight would force the set frame to ~2780px wide. The component-set frame grows in height; nothing else on the page moves.
- `State=State5` is left untouched (name included).

## 2. Shared card anatomy

Every new variant reuses the existing card structure — big circle button (left), time display, caption line, chips row:

- **Blocked states** (Disabled, Daily/Weekly Limit Reached, Shift Upcoming, Shift Ended):
  - Button: the existing greyed-out **disabled** variant from the `Play Button (big circle)` component set (node `27917:964423`).
  - Time digits: static, muted (text-secondary token) — no active styling, no blue border.
  - Caption line: restriction message in `t3` muted text. Disabled and limit-reached states carry a leading 16px icon (lock / clock) from the canonical icon library (node `25336:96509`); shift states are text-only. Messages wrap to two lines; card height grows to ~180px where needed.
- **In-progress states** (Daily Limit, Weekly Limit, Shift Active):
  - Identical to `State=Active` (running time, task name, blue-border card, pause button) plus one extra muted `t3` caption line below the chips row carrying the limit/shift indicator.
- **Chips:** existing Chip pattern. Neutral hue for admin/shift states, warning hue (Content Color hue tokens) for limit-reached. No new tokens; every fill/stroke/text binds to existing Figma variables.

## 3. The 8 variants

| Variant name | Button | Time | Caption line | Chips / extra caption |
| --- | --- | --- | --- | --- |
| `State=Disabled` | disabled | `00:00:00` muted | 🔒 "Time tracking has been disabled for your account." | `Disabled` (neutral) |
| `State=Daily Limit` | pause (active) | running `06:30:12` | "EverTech Drafting Proposals" | `Active` + `Break` chips; caption: "6h 30m / 8h tracked today" |
| `State=Daily Limit Reached` | disabled | `08:00:00` muted | 🕐 "You've reached your daily time limit (8h). Tracking will resume tomorrow." | `Limit reached` (warning) |
| `State=Weekly Limit` | pause (active) | running | "EverTech Drafting Proposals" | `Active` + `Break` chips; caption: "32h 15m / 40h this week" |
| `State=Weekly Limit Reached` | disabled | muted | 🕐 "You've reached your weekly time limit (40h). Tracking will resume next week." | `Weekly limit reached` (warning) |
| `State=Shift Upcoming` | disabled | `00:00:00` muted | "Your shift hasn't started yet. You can track time starting at 9:00 AM." | `Shift · 9:00 AM – 5:00 PM` (neutral) |
| `State=Shift Active` | pause (active) | running | "EverTech Drafting Proposals" | `Active` chip; caption: "Shift: 9:00 AM – 5:00 PM · 2h 30m left" |
| `State=Shift Ended` | disabled | muted (last tracked total) | "Your shift has ended. Time tracking is no longer available until your next shift." | `Shift ended` (neutral) |

Icons: lock for Disabled, clock for limit-reached states, sourced from the canonical icon library. If no suitable glyph exists there, fall back to the nearest available icon in the library — do not import outside icons.

## 4. Behavior notes (future code, not representable in static Figma)

Recorded as a Figma annotation next to the relevant variants and here for the eventual implementation:

- Tooltip on the disabled button in `State=Shift Ended`: "Tracking is only allowed during your assigned shift."
- Daily/weekly limit and shift end **auto-stop** a running tracker, then the card switches to the corresponding blocked variant.
- Daily limit re-enables next day; weekly limit next week; shift states follow the assigned window.

## 5. Build mechanics & risk handling

- Clone the closest existing variant per state, edit children, set the variant property to the proper `State=…` value.
- Known figma-console risk: component edits can drop child nodes. Every variant edit is performed as an atomic clear+rebuild in a single `figma_execute`, then verified with a structural dump **and** a screenshot before moving to the next variant.
- Visual confirm at the end: screenshot of the full component set, checked against this spec.

## 6. Prerequisites

- Figma Desktop open on the Experiment file (`gqYWCu1K6dJ9gESXtgNeCi`) with the **Desktop Bridge plugin running** — it was not connected at spec time.

## 7. Out of scope

- No React/desktop-app (`apps/tasks-tile-view`) changes.
- No new tokens or token edits.
- No changes to the older sidebar `Task Timer Container — States` section (`27470:172576`), the Main View frame, or the `Play Button (big circle)` set beyond instancing its existing disabled variant.
- Backend/admin trigger UI.
