# Team Permissions Settings Page — Implementation Plan

> **For agentic workers:** This plan builds a **Figma design** (not code). Execute it inline using the **`figma-design`** skill driving the `figma-console` MCP — the Figma connection is a single live session, so do NOT dispatch parallel subagents for build steps. Steps use checkbox (`- [ ]`) syntax for tracking. Each task's verification step replaces "run tests": capture a screenshot and visually confirm before moving on (the figma-console VISUAL VALIDATION WORKFLOW is mandatory).

**Goal:** Author the complete Settings › Organization › Team Permissions page in Figma (two full-page states + detail callouts) using only TimeWorks DS components, text styles, and color styles.

**Architecture:** Add one new SECTION ("Team Permissions — Settings") to the "Timeworks Web" page (`27823:196653`). Clone the chrome of the DS-aligned "Projects" web frame (`28672:139147`, 1920×1160) for each full page, then build the settings body from DS library instances (Tabs, Toggle, Table, Avatar Group, Modal, Radio, Alert Banner, Tooltip, Badge, Icon Button). Detail callouts are standalone frames placed beside the two pages.

**Tech Stack:** Figma (figma-console MCP via Plugin API), TimeWorks Design System library, DS tokens (`--color-*`, `--space-*`, text styles `text-t1/t2/t3` + headings).

**Spec:** `docs/superpowers/specs/2026-06-15-team-permissions-settings-page-design.md`

---

## Environment & conventions (read before Task 0)

- **File:** TimeWorks Design System `gqYWCu1K6dJ9gESXtgNeCi`, page **"Timeworks Web"** (`27823:196653`). Confirm with `figma_get_status` that this file + page is the active connected one before any mutation.
- **Component IDs are session-specific.** At the start of execution, run `figma_search_components` and `figma_get_library_components` to resolve the live node/key for each DS component named below (Tabs, Toggle, Table, Avatar/Avatar Group, Modal/Dialog, Radio Button, Alert Banner, Tooltip, Badge/Tag, Icon Button, Button). Never reuse IDs from a prior session. In the Experiment file, unpublished components are instanced by node id: `(await figma.getNodeByIdAsync(id)).createInstance()`.
- **Known figma-console hazards (apply throughout):**
  - Rebuilding a component's children: clear + append in ONE `figma_execute` call, then verify with a structural tree dump — not the success result (children silently drop otherwise).
  - After binding a color variable to a tinted fill (e.g. primary @ 8–10%), re-set `paint.opacity` via read-modify-write (`node.fills.map(f => ({...f, opacity}))`) — binding flattens it to solid.
  - Frame fills bound to a color variable keep the placeholder literal (render black) — bake the resolved mode value for FRAME fills.
  - After reparenting a child from a horizontal to a vertical auto-layout frame, reset `layoutGrow = 0` (it carries over and collapses the child to ~1px).
  - `figma_execute` may report a 5s timeout while the script keeps running server-side — batch ops small and diff the tree before retrying to avoid duplicates.
  - Absolute-positioned overlays (popovers/tooltips) look translucent when you screenshot the whole parent frame — capture the overlay node directly to verify opacity.
- **Placement:** the new section goes in empty canvas below the "Daily Limits Report" section. Anchor the section at approximately `x = 5054, y = 38500`. Page 1 at section origin; Page 2 to its right with a 200px gutter; callouts in a row beneath both pages.
- **Tokens only.** Every fill/stroke/radius/spacing binds to a DS variable or uses a DS text style. No raw hex, px spacing, or radius literals (radius scale values 8/12/full are DS-defined and fine to set numerically where the DS components do).
- **Theme:** light only.

---

### Task 0: Create the section and clone chrome for Page 1 (Default)

**Nodes:**
- Create: SECTION "Team Permissions — Settings" on page `27823:196653`
- Create (by clone): FRAME "Team Permissions — Default" from `28672:139147`

- [ ] **Step 1: Confirm the active file/page**

Run `figma_get_status`. Expected: `currentFileKey` = `gqYWCu1K6dJ9gESXtgNeCi` and a connected file named "TimeWorks Design System". If not, stop and reconnect.

- [ ] **Step 2: Create the section (idempotent)**

In one `figma_execute`: load pages, find an existing SECTION named "Team Permissions — Settings" on the page; if none, create it at `x=5054, y=38500`, resize to a generous canvas (e.g. 8640×4000), set name. Return the section id.

- [ ] **Step 3: Clone the Projects chrome into the section**

`figma_clone_node` (or `node.clone()` in `figma_execute`) on `28672:139147`. Move the clone inside the section at section-local origin (remember: SECTION child `.x/.y` are relative to the section). Rename to "Team Permissions — Default". Verify with `absoluteBoundingBox`, not local coords.

- [ ] **Step 4: Strip the body, keep the chrome**

Identify the clone's children: keep the left icon sidebar, top bar (bell + avatar), and gradient background; delete the breadcrumb text and the old page body (the client dropdown, search, projects table card). Do this as one clear+keep operation, then dump the remaining tree to confirm the chrome survived.

- [ ] **Step 5: Verify**

`figma_capture_screenshot` of "Team Permissions — Default". Expected: empty page with sidebar + top bar + gradient, no leftover Projects body. Fix and re-shoot (max 3 iterations) before continuing.

---

### Task 1: Tab bars (top-level + Organization sub-tabs)

**Nodes:** inside "Team Permissions — Default", a vertical container holding two rows: top-level tabs and sub-tab pills.

- [ ] **Step 1: Resolve the Tabs component**

`figma_search_components` for "Tabs". Note the id/key and its variant properties (which control active/inactive).

- [ ] **Step 2: Build the top-level tab bar**

Add a Tabs instance (or three text-tab items) for `Employee · Organization · Teams & Clients`, with **Organization** active. Place it just below the top bar, left-aligned to the content column. Use DS text style for tab labels and `--color-primary-color` / muted text for active/inactive per the Tabs component's own variants.

- [ ] **Step 3: Build the Organization sub-tab pills**

Create a horizontal auto-layout row of four pills: `Role Permissions · Team Permissions · Audit Logs · Security & Login`. **Team Permissions** = filled pill: fill `--color-primary-color`, label text on-primary color, radius full (or 8 per DS pill). The other three = ghost (no fill, muted text). Gap and padding via `--space-*` tokens. If a DS pill/segmented component exists, instance it; otherwise compose from Button (ghost) + a filled variant, or simple auto-layout frames bound to tokens.

- [ ] **Step 4: Verify**

Screenshot the tab region. Expected: Organization highlighted in the top row; Team Permissions a solid blue pill, the other three plain. Confirm no raw hex (inspect a fill's bound variable).

---

### Task 2: Page header (eyebrow + info icon + tooltip + subtitle)

**Nodes:** header block above the master toggle card.

- [ ] **Step 1: Eyebrow + info icon**

Add a horizontal auto-layout row: TEXT "TEAM PERMISSIONS" using `text-t3`, uppercase, muted text color, + an Icon Button / icon-wrapper instance with an info ("i") icon. (Per memory: setting textCase can detach the text style — type the uppercase characters directly instead of applying textCase.)

- [ ] **Step 2: Info-icon tooltip**

Instance the DS Tooltip with text: *"Control Team lead permissions, when added to projects through their teams"*. Position it anchored to the info icon (absolute), pointing at it. This tooltip is the "hover" representation for the header info icon deliverable.

- [ ] **Step 3: Subtitle**

Add a TEXT below the eyebrow using `text-t2`, muted: *"Set the default permissions Team Leads receive when they're added to projects through their teams. Individual teams can override these where allowed."* (Confirm final copy at handoff — open item #2 in the spec; use this as the working copy.)

- [ ] **Step 4: Verify**

Screenshot the header. Capture the tooltip node directly to confirm it's opaque (whole-frame capture renders absolute overlays translucent — known artifact).

---

### Task 3: Master toggle card (ON state) + banner slot

**Nodes:** card frame with icon + label + sublabel + Toggle; plus a hidden/placed yellow Alert Banner used by the OFF page and the post-confirm callout.

- [ ] **Step 1: Card chrome**

Create a frame: fill `--color-secondary-background-color` @ 0.5, 1px stroke `--color-layout-border-color`, radius 12, `clipsContent = true`. (DS table-card chrome recipe.) Re-apply `paint.opacity = 0.5` after binding the fill variable.

- [ ] **Step 2: Card content**

Horizontal auto-layout, space-between: left group = leading icon (icon wrapper) + vertical stack of label "Allow Team Leads to manage projects" (`text-t1`/`text-t2` semibold) + sublabel (muted `text-t2`); right = DS **Toggle** instance set to ON. Pad with `--space-*`; align items center.

- [ ] **Step 3: Verify**

Screenshot the card. Expected: balanced card, toggle ON and right-aligned, tinted card background visible (not solid).

---

### Task 4: General settings table (two columns, 5 rows)

**Nodes:** a card-wrapped DS Table with header row (Team Lead Permissions | Teams) and 5 permission rows.

- [ ] **Step 1: Resolve Table + Avatar Group**

`figma_search_components` for "Table" (and Header/Row/Cell parts) and "Avatar" / "Avatar Group". Note variant props.

- [ ] **Step 2: Header row**

Two columns: **"Team Lead Permissions"** and **"Teams"**. Add an info Icon Button in the Teams header with a Tooltip (working copy: *"Teams that inherit these default permissions."*).

- [ ] **Step 3: Build the 5 rows** (one clear+append `figma_execute`, then dump tree to verify all 5 survived)

Each row, Column 1 = horizontal: DS **Toggle** (ON) + vertical stack(name `text-t2` semibold + description muted `text-t3`). Column 2 = overlapping **Avatar** stack (initials) + "+N" overflow chip.
Rows in order:
1. **Approve time off requests** — desc "Review and approve/deny team members' time off."
2. **Schedule shifts** — desc "Create and assign shifts for the team."
3. **Add and remove team's projects** — desc "Manage which projects the team works on." *(project-related)*
4. **Edit team members and project roles** — desc "Change member assignments and project roles." *(project-related)*
5. **View screenshots of team members** — desc "See activity screenshots captured for the team."

Add the **exception indicator** to at least one row (e.g. row 2): a TEXT/row beneath the name reading `⚠ 2 exception(s)` in a warning/orange color token.

- [ ] **Step 4: Avatar stacks**

Build overlapping avatars per the DS letter-avatar stack recipe: compose Avatar (Letter) instances with `itemReverseZIndex = true`, negative `itemSpacing`, white OUTSIDE ring, circular cornerRadius; trailing "+N" chip. Use 3–4 visible + "+N".

- [ ] **Step 5: Verify**

Screenshot the table. Expected: 5 rows, toggles left-aligned in col 1, avatar stacks + "+N" in col 2, exception line visible under row 2's name. Confirm overlaps render (not collapsed).

---

### Task 5: Assemble & verify Page 1 (Default, all ON)

- [ ] **Step 1: Stack the body**

Place header (Task 2) → master toggle card ON (Task 3, no banner) → table (Task 4) in a vertical auto-layout content column inside "Team Permissions — Default", below the tab bars. Set content max-width + side padding consistent with the Projects frame (inspect its content column padding and match via tokens). After reparenting any horizontal-built child into this vertical column, reset `layoutGrow = 0`.

- [ ] **Step 2: Verify (full page)**

`figma_capture_screenshot` of the whole "Team Permissions — Default" frame. Expected: complete page — chrome + tabs + header + ON card + 5-row table, well-aligned, no detached/black fills. Iterate up to 3× on spacing/alignment.

---

### Task 6: Page 2 — Master toggle OFF state

**Nodes:** clone of Page 1 with OFF modifications.

- [ ] **Step 1: Clone Page 1**

Clone "Team Permissions — Default" → "Team Permissions — Master OFF", place to the right with a 200px gutter (section-local coords). Verify with `absoluteBoundingBox`. (Frame clones can drop instance overrides — re-verify the toggle states and tab pill after cloning.)

- [ ] **Step 2: Master toggle → OFF + yellow banner**

Set the master Toggle instance to OFF. Insert the DS **Alert Banner** (warning/yellow) directly below the card: *"Project-related permissions are disabled while 'Allow Team Leads to manage projects' is off."*

- [ ] **Step 3: Disable project rows (3 & 4)**

For rows 3 and 4: reduce visual emphasis to the DS disabled treatment (muted text/greyed), set their row Toggles to a non-interactive/disabled style, and add an inline DS **Badge/Tag** "Requires master toggle" next to each permission name.

- [ ] **Step 4: Verify**

Screenshot "Team Permissions — Master OFF". Expected: OFF toggle, yellow banner present, rows 3 & 4 greyed with "Requires master toggle" tags and disabled toggles; rows 1/2/5 unchanged.

---

### Task 7: Callout — Confirmation modal (Toggle OFF)

**Nodes:** standalone frame "Modal — Confirm OFF" below the pages.

- [ ] **Step 1: Instance the DS Modal/Dialog**

Resolve and instance the DS Modal. Fill its body slot via `swapComponent` on the body slot (do not `setProperties` the slot-swap prop — it leaves a yellow empty-slot placeholder). Set HUG on slot+body+root so content doesn't clip.

- [ ] **Step 2: Content**

Title: *"Confirm changes: Don't allow Team leads to manage projects"* (set the inner TEXT node directly — a component TEXT prop won't render). Body line: short impact explanation. Two DS **Radio** options:
- **"Team leads assigned to future projects"** — selected
- "All team leads, including those on current projects"
Footer: **Cancel** (secondary) + **Confirm** (primary) Buttons.

- [ ] **Step 3: Verify**

Screenshot the modal node directly. Expected: correct title, first radio selected, Cancel/Confirm present.

---

### Task 8: Callout — Confirmation modal (Toggle ON)

**Nodes:** standalone frame "Modal — Confirm ON".

- [ ] **Step 1: Clone Task 7's modal**

Clone the "Modal — Confirm OFF" frame → "Modal — Confirm ON". Re-verify slot/body overrides survived the clone.

- [ ] **Step 2: Edit content**

Title: *"Confirm changes: Allow Team leads to manage projects"*. Two Radio options:
- **"Team leads on all projects"** — selected
- "Team leads on future projects only"
Keep Cancel / Confirm footer.

- [ ] **Step 3: Verify**

Screenshot the modal node. Expected: correct ON title, first radio selected.

---

### Task 9: Callout — Post-confirm warning banner + hoverable count

**Nodes:** frame "Banner — Post-confirm".

- [ ] **Step 1: Banner**

Instance the yellow Alert Banner with text containing a hoverable **"3 Team Leads"** count (style the count as a link/emphasis token).

- [ ] **Step 2: Tooltip**

Anchor a DS Tooltip listing affected names (working data: "Andrea Gatchallian, Marcus Lee, Priya Shah") to the count.

- [ ] **Step 3: Verify**

Capture the banner + tooltip nodes directly (overlay opacity). Expected: banner with emphasized count and an opaque names tooltip.

---

### Task 10: Callout — Exception indicator states

**Nodes:** frame "Exception indicator" with two specimens.

- [ ] **Step 1: Default specimen**

A permission-name row + `⚠ 2 exception(s)` in warning/orange token beneath it.

- [ ] **Step 2: Hover specimen**

Same, with a DS Tooltip listing team(s) + override state: "Design Team — overridden ON", "QA Team — overridden OFF".

- [ ] **Step 3: Verify**

Capture the frame and the tooltip node directly. Expected: both specimens, tooltip opaque.

---

### Task 11: Callout — Avatar strip (+N overflow)

**Nodes:** frame "Avatar strip".

- [ ] **Step 1: Build specimens**

Show: (a) 3 overlapping avatars, (b) 4 + "+2" overflow, (c) hover state with a per-avatar Tooltip (team/member name). Use the letter-avatar stack recipe (reverse z-index, negative spacing, white outside ring, circular).

- [ ] **Step 2: Verify**

Screenshot. Expected: clean overlaps, "+N" chip styled like the other avatars, hover tooltip on one.

---

### Task 12: Callout — Hover states

**Nodes:** frame "Hover states" grouping the three hover specimens.

- [ ] **Step 1: Compose**

Place three labeled specimens: avatar hover (tooltip), info-icon hover (tooltip), exception-indicator hover (tooltip). Reuse instances from Tasks 2/10/11.

- [ ] **Step 2: Verify**

Capture each tooltip node directly to confirm opacity; screenshot the frame for layout.

---

### Task 13: Handoff — spacing & sizing annotation block

**Nodes:** frame/sticky "Handoff notes".

- [ ] **Step 1: Document specs**

Add a text/annotation block listing the actual values used: content max-width + side padding, card padding + radius (12), table row height + cell padding, toggle↔label gap, sub-tab pill height/padding/gap + radius, banner padding, modal width. Express each as its DS token name (`--space-*`, radius scale step). Note responsive reflow expectation for narrower widths.

- [ ] **Step 2: Verify**

Screenshot the notes block. Expected: legible, values reference tokens.

---

### Task 14: Final section sweep

- [ ] **Step 1: Full-section screenshot**

`figma_capture_screenshot` of the "Team Permissions — Settings" section. Confirm all 9 deliverables present and arranged: two full pages + 7 callouts/notes.

- [ ] **Step 2: DS/token audit**

Spot-check fills on the active pill, card, banner, and exception text are bound to DS variables (not raw hex). Confirm no detached layers (instances still linked to DS components). Confirm light theme throughout.

- [ ] **Step 3: Structural dump**

Dump the section tree; verify every full page has chrome + tabs + header + card + table, and rows didn't drop. Fix any gaps and re-shoot.
