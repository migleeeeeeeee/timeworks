# Clients Table — DS Restyle (Figma)

**Date:** 2026-06-08
**File:** TimeWorks Design System — Experiment (`gqYWCu1K6dJ9gESXtgNeCi`)
**Page:** Admin Manager View
**Target frame:** `Frame 1707485095` (`28300:164769`) — the Clients list table
**Reference frame:** `Report Table` (`28117:278533`) — the DS-correct table on the same page

## Goal

Bring the Clients list table into line with the Report Table's work / color / text
styles. Functional columns unique to the Clients table (Select checkbox, Actions,
Search, pagination) are retained — only their styling is conformed.

## Source-of-truth styles (read from the Report Table)

- **Header / caption labels:** text style `Text3 (12px)/Medium`
  (`S:f29b61aa1434cf40e758c1b29870eab2f5b3f84e`), fill bound to `secondary-text-color`.
- **Primary name cell:** text style `Text2 (14px)/Medium`
  (`S:9cbe8a8f628b0e42acdcb48d66693a7a3b4f848b`), fill `primary-text-color`.
- **Regular cell text:** text style `Text2 (14px)/Normal`
  (`S:d8c82873cc7b7ce6f2ff05807948b174a9ded705`), fill `secondary-text-color`.
- **Status pill:** DS **Tag** component, `Positive-Subtle` variant (green),
  main component `25644:72896`.
- **Rows:** dividerless. Header row 44px, body rows 52px.

## Changes

1. **Buttons** (`Add Client` `28300:164779`, `View` `28300:164780`) — remove the
   linear-gradient fill override (`#6271FF → #1039AD`); restore the flat DS primary
   fill (`primary-color`) from the main component.
2. **Column headers** — rebind all labels to `Text3 (12px)/Medium` +
   `secondary-text-color`; convert ALL-CAPS → Title Case (`NAME`→`Name`,
   `CREATED DATE`→`Created Date`, `UPDATED AT`→`Updated At`, etc.).
3. **Name cells** — `Text2/Bold` → `Text2/Medium` (keep `primary-text-color`).
4. **Other cells** (Email, Created, Updated, Projects) — `Text2/Normal` +
   `secondary-text-color`.
5. **Status cells** — replace the plain green "Active" text with a DS Tag
   `Positive-Subtle` pill; inner text "Active".
6. **Work style** — delete the dark header underline and all inter-row dividers;
   set header row to 44px and body rows to 52px (match reference exactly).

## Out of scope

- The Search field, pagination footer, Select checkbox, and Actions column remain
  structurally unchanged (already DS instances; styling conformed only if off-token).
- No React/code changes — this is in-Figma restyle only.

## Verification

figma-console visual-validation loop: screenshot after each batch, compare to the
Report Table, iterate. Final side-by-side screenshot of both frames to confirm
they read as one design language.
