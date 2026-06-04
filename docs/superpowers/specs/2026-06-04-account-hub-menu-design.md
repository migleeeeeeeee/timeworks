# Account Hub Menu — Design Spec

**Date:** 2026-06-04
**Target:** Figma design first (`figma-design` skill), in the TimeWorks Design System file (`gqYWCu1K6dJ9gESXtgNeCi`). Code generation is a later, separate step.
**Trigger node:** `User` (`27873:790325`) — avatar + name + chevron in the `Top Bar` (`27758:293291`) of the `Project table view` (`27758:293285`), Desktop App page.

---

## Purpose

Define the menu that opens when the user clicks the **"Andrea ▾"** account trigger in the top-right of the TimeWorks desktop app. It is a **catch-all account hub** — reachable from every screen, prioritizing one-click reach over compactness. Layout is **Approach A: a flat, sectioned dropdown** with inline controls for presence and theme.

This spec covers the menu's structure, anatomy, states, and token bindings as a Figma component. It does **not** cover the React implementation.

---

## Anatomy

The menu is a Dropdown/Menu surface anchored to the bottom-right of the trigger, opening downward and right-aligned to the trigger's right edge. It is built from DS primitives — **Dropdown/Menu** for the surface and rows, **Avatar** for the identity block, **SegmentedControl** for the inline theme toggle, **Badge** for status/update indicators.

The trigger itself (`User` frame) gains a clear **open state** (chevron rotates, subtle background) while the menu is shown.

### Section order (top → bottom)

1. **Identity header** — non-actionable block (or row that opens profile)
   - Large avatar, name (`Andrea`), email, role
   - Current workspace / org name; if the user belongs to more than one, this row becomes a **workspace switcher** (right-side chevron → submenu of orgs). Single-org users see a static label.
   - Optional `View profile` affordance.

2. **Presence** — set the user's availability, syncing the live timer + ChatWorks presence
   - Options: **Active**, **Away**, **Break**, **Do Not Disturb**
   - Current state shown with a colored status dot (Badge). Inline selectable row group (each option a menu row with a leading dot + trailing check on the active one).

3. **Appearance** — inline theme toggle
   - SegmentedControl with **Light / Dark / Black**, reflecting the active `data-theme`. Selecting one swaps the app theme immediately.

4. **Account & settings**
   - Account settings · Preferences · Notifications · Billing & plan
   - Standard menu rows, leading icon + label.

5. **Integrations**
   - ChatWorks · Connected apps
   - ChatWorks row may carry a status/notification Badge (the top-bar ChatWorks tab shows a red dot).

6. **Help & support**
   - Help center / docs · Keyboard shortcuts (trailing `⌘?` hint) · Send feedback · Report a bug · Contact support

7. **App / desktop**
   - **Version label** — passive, e.g. *TimeWorks v2.4.1* (muted text, not a button)
   - **Check for updates** — actionable; reflects updater state (see States)
   - **View logs / diagnostics** — opens the log viewer / reveals the log file

8. **Footer**
   - **Log out** — destructive-tinted row, visually separated by a divider.

Dividers separate sections 1–2, 3, 4, 5, 6, 7, and the footer.

---

## States

**Trigger (`User`)**
- Default · Hover · **Open** (chevron up/rotated, active background) · Focus-visible ring.

**Menu surface**
- Open / closed (with DS standard motion: fast-to-base ease, respects `prefers-reduced-motion`).

**Rows**
- Default · Hover · Focus-visible · Pressed · Disabled.
- Selected (presence options, theme segment) show a check / active fill.

**Presence**
- Four states, each with its own status-dot color token. Active selection marked.

**Check for updates** — distinct visual states:
- *Up to date* (default label)
- *Update available* (Badge / accent) → row label becomes **Download update**
- *Downloading…* (progress / disabled-busy)
- *Ready to install / Restart to update*

**Workspace switcher** (multi-org only)
- Collapsed row with chevron → expanded submenu listing orgs, active one checked.

---

## Token bindings (Figma variables → CSS vars)

Every fill, stroke, radius, spacing, and shadow binds to a DS Figma variable — no raw values (per CLAUDE.md architecture rules). Expected mappings:

- **Surface:** menu background, border, and **`shadow-lg`** (popover floating over busy content).
- **Radius:** menu container 12px (card/modal radius); rows none/4.
- **Text:** name = `t1`/heading-ish weight, email/role/version = `t3` muted (`--color-text-color-secondary` or equivalent), row labels = `t2`.
- **Rows:** hover/pressed backgrounds, focus ring, disabled text — all semantic tokens.
- **Presence dots & badges:** semantic status colors (success/active, warning/away, neutral/break, danger/DND) — reuse existing status tokens; **flag if a status token is missing** and add it in Tokens Studio first.
- **Log out:** destructive text/hover tokens.
- **Theme correctness:** the menu must render correctly in **light / dark / black** — verify via Figma variable modes and (later) the Storybook toolbar.

If any needed token is missing, **stop and add it in Tokens Studio → push → `npm run tokens:build`** before continuing (Authoring workflow rule).

---

## Figma deliverable (four-frame contract)

Per the `figma-design` skill, the component page carries:

- **Anatomy** — the menu open, annotated, naming the Radix primitive (Dropdown Menu) it maps to.
- **Variants** — single-org vs multi-org header; updater states; presence states.
- **States** — trigger states; row states (hover/focus/pressed/disabled/selected).
- **Tokens** — sticker sheet of every variable consumed.

---

## Out of scope

- React implementation (`figma-to-code` handoff, separate spec/plan).
- The actual update-download mechanism / IPC and log-file plumbing (desktop backend) — the menu only surfaces entry points and states.
- New top-bar layout changes beyond the trigger's open state.

---

## Open questions / assumptions

- **Multi-org:** assumed possible; header degrades to a static workspace label when the user has one org. Confirm whether workspace switching exists in TimeWorks today.
- **Presence vs timer:** assumed presence here is the same signal as the sidebar Active/Break timer state. Confirm they should stay in sync rather than being independent.
- **Status tokens:** assumes success/warning/neutral/danger status colors already exist for the presence dots; verify during the Tokens frame pass.
