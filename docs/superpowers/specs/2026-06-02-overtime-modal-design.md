# Overtime Modal — Design Spec

**Date:** 2026-06-02
**Scope:** Figma design only (no React implementation in this cycle)
**File:** TimeWorks Design System — Experiment file `gqYWCu1K6dJ9gESXtgNeCi`
**Page:** Desktop App (canvas `27464:128248`)

## Purpose

A post-clock-out modal that appears when the user's **total tracked time for the day exceeds 8 hours**. It does not interrupt work in progress — it shows after the user clocks out. It summarizes the overtime and collects a reason, which the user either **submits for approval** or **discards from the timesheet**.

## Trigger semantics

- Measured against total tracked time for the day (across all projects/tasks), not a single session or single project.
- Threshold: 8:00:00 (the standard shift).
- Shown once, at clock-out, when tracked total > 8:00:00.
- Closing the modal (X) dismisses it for later; it does not discard the overtime. No visual difference from the standard close button — behavior note only.

## Pattern precedent

Mirrors the existing **Idle Modal** exactly:

- Idle Modal instance on Desktop App page: `28077:24276`
- Main component: `Modal / Basic`, variant `Size=Small, Scroll=No` (`46947:768`, "Modal" page, local component)
- Body is provided via the INSTANCE_SWAP slot prop (`🔁 slot#5121:17`), currently pointing to the **Idle Modal Body** component (`27922:980314`)

## Deliverables

### 1. `Overtime Modal Body` — new component

Cloned from `Idle Modal Body` and re-texted. *(As-built note, 2026-06-02: `Idle Modal Body` turned out to be a ghost component — alive but not placed on any page — so the new component was placed on the Desktop App page at (3966, 12204) beside the modal instance. Built as `Overtime Modal Body` = `28196:283975`.)* Anatomy:

| Part | Content |
|---|---|
| Duration pill | Clock icon + **`1:32:00 overtime`** (left), `5:00 PM → 6:32 PM` (right; shift end → clock-out), same layout as the Idle pill |
| Message (bold) | "You tracked 9:32:00 today — 1:32:00 over your 8-hour shift." |
| Helper text | "Submit the overtime for approval, or discard it from your timesheet." |
| Reason field | Label "Reason for overtime" + DS Text Area, placeholder "type reason…" |

### 2. `Overtime Modal` — new instance on Desktop App page

- `Modal / Basic`, `Size=Small, Scroll=No`, body slot swapped to `Overtime Modal Body`.
- Title: **"You clocked out with overtime"** + close icon button (inherited from Modal header).
- Footer buttons:
  - **Discard overtime** — outline destructive (matches "Discard idle time" styling)
  - **Submit for approval** — primary indigo (matches "Keep time" styling). Submit is disabled until a reason is entered (behavior note; the static mock shows the enabled state).
- Placement: near the Idle Modal instance (`28077:24276`) so the two timesheet-reconciliation modals sit together. *(As-built note, 2026-06-02: the space to the Idle Modal's right is occupied by "Add checklist (modal)", so the Overtime Modal went directly **below** it at (2954, 12204). Built as `Overtime Modal` = `28200:284141`, 480×430 — 20px shorter than the Idle Modal because the body hides the Text Area's "Information text" line, matching the rendered Idle Modal.)*

## Constraints

- All values come from DS tokens/components already consumed by the Idle Modal — no new tokens, no detached styles.
- Sample data follows the file's fiction: 8-hour shift, 9:32:00 tracked, 1:32:00 overtime.
- Build via figma-console MCP (Plugin API); clone-and-retext, do not rebuild from primitives.
- Visual-confirm: screenshot after build and compare against the Idle Modal for alignment/spacing parity.

## Out of scope

- React implementation in `apps/tasks-tile-view` (future cycle).
- In-context frame showing the modal over the Tasks view (approach B was declined).
- Approval workflow UI (what the manager sees) — only the employee-side modal.
