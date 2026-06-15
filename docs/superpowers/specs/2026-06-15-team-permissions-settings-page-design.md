# Team Permissions — Settings Page (Figma design spec)

**Date:** 2026-06-15
**Surface:** Figma — TimeWorks Design System file (`gqYWCu1K6dJ9gESXtgNeCi`), page **"Timeworks Web"** (`27823:196653`)
**Type:** Figma UI design deliverable (no React code in this ticket)
**Author:** miggle@abroadworks.com

---

## Overview

As an Owner or Manager, I want a centralized settings page at **Settings › Organization › Team Permissions** where I can define and manage the global default permissions for all Team Leads across the organization — so I can control what Team Leads can do without configuring each team individually.

This spec covers **all design deliverables** required before development begins. The page is authored in Figma using the TimeWorks Design System (DS) for every component, text style, and color style. No raw hex/spacing/radius values — everything binds to DS tokens.

## Goals

- A complete, handoff-ready Figma design for the Team Permissions settings page.
- Two full-page states (Default all-ON, and Master-toggle-OFF) plus zoomed detail callouts for modals, banners, exception indicators, the avatar strip, and hover states.
- Built entirely from DS library instances so it stays consistent with the rest of the "Timeworks Web" canvas.

## Non-goals

- React/TypeScript component code (that is a separate `figma-to-code` task, if requested later).
- Phase-2 permissions, per-team override editing screens, Role Permissions / Audit Logs / Security & Login tab contents (only the Team Permissions tab is designed; sibling tabs appear in the bar but are inactive).
- Backend/permission-model logic.

---

## Approach

**Hybrid rebuild from DS chrome.** Clone the chrome of an existing DS-aligned web frame (sidebar + top bar + gradient background — e.g. the "Projects" frame `28672:139147`, 1920×1160), then build the settings body entirely from DS library instances: Tabs, Toggle, Table, Avatar Group, Modal/Dialog, Radio Button, Alert Banner, Tooltip, Badge, Icon Button.

Rationale: guarantees pixel-consistent chrome, matches how every other web page on this canvas was built, and honors the DS-first rule in `CLAUDE.md`. Component node IDs are resolved at build time via `figma_search_components` (session-specific; never reused across sessions).

All new frames live in a **new SECTION** named **"Team Permissions — Settings"** added to the "Timeworks Web" page, placed in clear empty canvas space below/beside existing sections.

---

## Deliverables & frame plan

Two complete page frames + standalone zoomed callout frames, all inside the new section.

1. **Full page — Default (all ON)** — 1920×1160. The canonical state.
2. **Full page — Master toggle OFF** — 1920×1160. Disabled project rows + yellow warning banner.
3. **Callout — Confirmation modal (Toggle OFF)**.
4. **Callout — Confirmation modal (Toggle ON)**.
5. **Callout — Post-confirm warning banner** with hoverable "N Team Lead" count + tooltip.
6. **Callout — Exception indicator states** (default + hover tooltip).
7. **Callout — Avatar strip** (overlapping circles + "+N" overflow).
8. **Callout — Hover states** (avatars, info icons, exception indicators).
9. **Handoff note** — spacing/sizing annotations (paddings, gaps, radii, tab pill sizing).

---

## Detailed design

### 1. Page chrome & navigation

- **Shell:** cloned 1920×1160 frame. Left icon sidebar (~64px), top bar with notification bell + user avatar top-right, light gradient background. The breadcrumb region is replaced by the settings title + tab bars.
- **Top-level tab bar:** `Employee · Organization · Teams & Clients`. Text tabs built on DS **Tabs**. **Organization** is active.
- **Organization sub-tab bar:** `Role Permissions · Team Permissions · Audit Logs · Security & Login` rendered as **filled blue pills**. **Team Permissions** is active — filled `--color-primary-color` pill with on-primary text; the other three are ghost/unfilled. Active style = highlighted blue filled pill per ticket.

### 2. Page header

- Eyebrow label **"TEAM PERMISSIONS"** — uppercase, `text-t3`, muted text color — with an inline **info icon** (DS Icon Button / icon wrapper).
- Info-icon **Tooltip**: *"Control Team lead permissions, when added to projects through their teams"*.
- Descriptive subtitle below the eyebrow in body text (`text-t2`), muted, e.g. *"Set the default permissions Team Leads receive when they're added to projects through their teams. Individual teams can override these where allowed."*

### 3. Master toggle card

- DS card chrome: `--color-secondary-background-color` @ 0.5 fill + 1px `--color-layout-border-color` + radius 12, clipped.
- **Left:** leading icon + **label** ("Allow Team Leads to manage projects") + sublabel (short description).
- **Right (aligned):** DS **Toggle**.
- **Two states rendered:** ON and OFF.
- **OFF → yellow Alert Banner** directly below the card: *"Project-related permissions are disabled while 'Allow Team Leads to manage projects' is off."* Uses the DS warning/yellow Alert Banner variant.
- **Post-confirm warning banner** variant: same yellow banner containing a hoverable **"N Team Lead"** count (e.g. "3 Team Leads"). On hover, a **Tooltip** lists the affected names.

### 4. General settings table

DS **Table**, two columns.

- **Column 1 — "Team Lead Permissions":** each row = DS **Toggle** (left) + permission **name** + **description** (secondary text) + optional **exception indicator** beneath the name.
- **Column 2 — "Teams":** overlapping **avatar** circles showing team initials + **"+N"** overflow chip. Column header carries an **info icon** with tooltip; individual avatars have hover tooltips (team name).

**Phase-1 permission rows (in order):**
1. Approve time off requests
2. Schedule shifts
3. Add and remove team's projects *(project-related — disabled when master toggle is OFF)*
4. Edit team members and project roles *(project-related — disabled when master toggle is OFF)*
5. View screenshots of team members

**Exception indicator:** `⚠ N exception(s)` in red/orange (`--color` warning/danger token) directly under the permission label. Hover **Tooltip** lists the team name(s) and each override state (e.g. "Design Team — overridden ON", "QA — overridden OFF").

### 5. Master toggle OFF state (full page 2)

- Rows **3 & 4** (project-related) greyed out and non-interactive.
- Inline **"Requires master toggle"** tag (DS Badge/Tag) next to the permission name on each disabled row.
- The individual Toggles on those rows render in a non-interactive/disabled style.
- Yellow warning banner (section 3) present below the master toggle card.

### 6. Confirmation modals (DS Modal / Dialog)

Triggered by toggling the master toggle. Both use the DS Modal with Cancel / Confirm actions (Confirm = primary button).

- **Turning OFF (ON → OFF):**
  - Title: *"Confirm changes: Don't allow Team leads to manage projects"*
  - Body: short explanatory line about the impact.
  - Two **Radio** options:
    - **"Team leads assigned to future projects"** — *selected by default*
    - "All team leads, including those on current projects"
  - Actions: **Cancel** / **Confirm**.
- **Turning ON (OFF → ON):**
  - Title: *"Confirm changes: Allow Team leads to manage projects"*
  - Body: short explanatory line about the impact.
  - Two **Radio** options:
    - **"Team leads on all projects"** — *selected by default*
    - "Team leads on future projects only"
  - Actions: **Cancel** / **Confirm**.

> Second radio-option wording (the non-default option in each modal) is proposed above and should be confirmed with product during handoff; the *default* selections are fixed per the ticket.

### 7. Detail callouts

Zoomed, component-level frames (placed around the two full pages, clearly labeled):

- **Exception indicator:** default + hover tooltip open.
- **Avatar strip:** overlapping circles with initials, including the "+N" overflow chip.
- **Hover states:** avatars (tooltip), info icons (tooltip), exception indicators (tooltip).

### 8. Responsive / spacing & handoff note

A text/annotation block documenting: content max-width and side padding, card padding, table row height and cell padding, gap between toggle and label, sub-tab pill height/padding/gap, banner padding, and the radii used (card 12, pill full/8). All values reference DS spacing tokens (`--space-*` / Tailwind `--spacing-*`). Note any responsive reflow expectations for narrower widths.

---

## DS components used (resolved at build via `figma_search_components`)

Tabs, Toggle, Table (+ Header/Row/Cell), Avatar / Avatar Group, Modal (Dialog), Radio Button, Alert Banner (warning/yellow), Tooltip, Badge/Tag, Icon Button / icon wrapper, Button (primary + secondary for modal actions).

## Tokens

- Colors: `--color-primary-color` (active pill), on-primary text, `--color-secondary-background-color` (card), `--color-layout-border-color`, muted/secondary text tokens, warning/yellow tokens (banner), danger/orange tokens (exception indicator). Light theme only.
- Text styles: `text-t3` (eyebrow/labels), `text-t2` (body/subtitle), heading style for modal titles.
- Spacing/radius: DS spacing tokens; radius 12 (cards/modals), 8/full (pills, toggles).

## Constraints / rules followed

- DS-first: every value binds to a DS component, text style, or color style. No raw hex/px/radius.
- New work lives in a single new SECTION on "Timeworks Web"; existing sections are not modified.
- Light theme only (matches every reference frame on this canvas).
- Sample data uses realistic placeholders consistent with existing frames (e.g. Andrea Gatchallian; team/initial names).

## Open items to confirm at handoff

1. Final wording of the **second (non-default) radio option** in each confirmation modal.
2. Exact subtitle copy under the eyebrow label.
3. Sample team names / initials and the affected-Team-Lead names used in tooltips.

## Success criteria

- All 9 deliverables present in the "Team Permissions — Settings" section.
- Both full pages render correctly with DS instances (no detached/raw layers).
- Master-OFF state correctly disables rows 3 & 4 with the "Requires master toggle" tag and disabled toggles.
- Both modals match the specified titles, default radio selections, and Cancel/Confirm actions.
- Exception indicators, avatar strip/+N, and all hover tooltips are shown as callouts.
- A spacing/handoff annotation block is included.
