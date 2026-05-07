# Time Tracker Daily View — Figma Build Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. This plan builds a **Figma frame**, not React code — "tests" in this plan are screenshot validations, and "commits" are user review checkpoints.

**Goal:** Build the Daily-view redesign (Direction A — week heatmap + smart day rows) as a new Figma frame in the TimeWorks DS file, in three state variants (empty / partial / full week), using only library instances and Figma variables.

**Architecture:** Page-level composition over the 43 shipped DS components plus existing Tokens Studio variables. No new components, no new tokens. Built section-by-section via the figma-console MCP Plugin API; every task ends with a screenshot and a user review checkpoint before the next task begins.

**Tech Stack:** Figma desktop + figma-console MCP (Plugin API via `figma_execute`), Figma library instances from file `04x9q7W2Y59baF5MqHAVZR`, Figma variables (Tokens Studio).

**Spec reference:** `docs/superpowers/specs/2026-05-07-time-tracker-daily-redesign.md`

---

## File Structure

This deliverable is a Figma frame, not files in the repo. The "files" we touch are nodes in the DS file:

- **Source / reference:** node `25770:5342` (current Daily view) — read-only.
- **Inspiration:** node `25730:13127` — read-only, used during design only.
- **New frame (created by Task 1):** sibling frame next to `25770:5342`, named `"Daily view — redesign (A) [partial week]"`.
- **State variants (created by Tasks 7 and 8):** sibling frames `"Daily view — redesign (A) [empty week]"` and `"Daily view — redesign (A) [full week]"`.

The design spec stays at `docs/superpowers/specs/2026-05-07-time-tracker-daily-redesign.md` and is the contract; the plan below builds it.

## Conventions for every task

1. **Plugin API only.** All mutations go through `mcp__figma-console__figma_execute`. No clicking, no manual node creation.
2. **Library instances only.** When placing a DS component, look it up in `.claude/skills/figma-page-to-library/component-map.json` for the `key`, then use `figma.importComponentByKeyAsync(key).then(c => c.createInstance())`. Never duplicate primitives that have a library version.
3. **Variables, not raw values.** Every fill, stroke, radius, spacing, and text style binds to a Figma variable. If you find yourself typing a hex code or a px value into a `figma_execute` payload, stop and bind a variable instead.
4. **Screenshot every task.** End each task with `mcp__figma-console__figma_take_screenshot` of the affected frame, attached to the user review checkpoint.
5. **User review between tasks.** Do not start Task N+1 before the user has approved the screenshot from Task N. This is the project's discipline; honor it.

---

## Task 0: Setup and component map

**Files:** none in repo. Operates entirely in Figma.

- [ ] **Step 1: Confirm figma-console connection**

Run: `mcp__figma-console__figma_get_status`
Expected: connection ok, currently-open file shows TimeWorks DS file. If the source file (`04x9q7W2Y59baF5MqHAVZR`) is not the active file, ask the user to switch tabs in Figma desktop.

- [ ] **Step 2: List components needed by this build**

Reference `.claude/skills/figma-page-to-library/component-map.json` for keys. The build uses:

| Component | Use site |
|---|---|
| Button | Toolbar primary "Log time", per-row "Add entry" ghost |
| Tabs | Existing Daily/Weekly toolbar tabs |
| Date Picker | Existing toolbar date picker |
| Dropdown | Existing toolbar employee filter |
| Breadcrumbs Bar | Top of canvas |
| Avatar | Top-right user avatar |
| Icon Button | Bell, edit-pencil per entry, overflow |
| Badge | "Today" pill on filled day card |
| Chip / Chips | Delta chip in hero ("↑ +6h vs last week"), weekend pill |
| Linear Progress Bar | Optional fallback inside Top Projects panel |
| Divider | Section separators |
| Pagination + Table Footer | Existing footer (preserved) |
| Sidebar + Sidebar Icon Button | Existing left rail |
| Tooltip | Heatmap-cell hover ("Mon: 8h logged") |

If any of these are absent from `component-map.json`, fall back to a search via `mcp__figma-console__figma_search_components` and update the local map (do not introduce new local one-offs).

- [ ] **Step 3: Locate canvas placement**

Run: `mcp__figma-console__figma_execute` with code that reads `25770:5342`'s parent page, finds its bounding rect, and computes a placement 200px below the source frame on the same page so the redesign sits next to (not on top of) the original.

```javascript
const src = await figma.getNodeByIdAsync("25770:5342");
return { x: src.x, y: src.y + src.height + 200, width: src.width };
```

Expected return: `{ x, y, width }` — record these for Task 1.

- [ ] **Step 4: User review checkpoint**

Show the user the placement coordinates and confirm they want the redesign on the same page (not a fresh page). If they want a separate page, create one named "Redesign — Daily view (A)" first via `figma.root.children.find` / `figma.createPage()`, and use that page going forward.

---

## Task 1: Page shell + toolbar (no content yet)

**Files:** new frame in Figma — `"Daily view — redesign (A) [partial week]"`.

- [ ] **Step 1: Create the outer frame**

Run `figma_execute` with code that:
1. Loads all pages: `await figma.loadAllPagesAsync();`
2. Creates a frame at the placement from Task 0 Step 3, sized to match the source frame width (likely 1440 × variable height — start at 1080 and let auto-layout grow it).
3. Sets it to vertical auto-layout, padding 0, gap 0.
4. Names it `"Daily view — redesign (A) [partial week]"`.
5. Sets background fill to the canvas background variable used by the source frame (read it from `25770:5342` and reuse the same variable binding).
6. Returns the new frame's id.

- [ ] **Step 2: Place the existing top bar (breadcrumb row)**

Inside the new frame, instance:
- `Breadcrumbs Bar` (key from map) on the left, populated with "Home › Employees › John Doe".
- A right cluster containing `Icon Button` (bell) and `Avatar` (initial "A").

Use auto-layout horizontal, space-between, padding 24px, with a 1px bottom border using the divider color variable.

- [ ] **Step 3: Place the toolbar row**

Inside the frame, below the breadcrumb row, instance:
- Left: `Icon Button` (filter), `Dropdown` ("Saph").
- Center: `Tabs` with two tabs ("Daily" selected, "Weekly").
- Right: `Date Picker` ("Aug 15, 2025"), `Icon Button` (overflow), then the **single primary `Button`** with `variant=primary, leadingIcon=Plus, label="Log time"`. This button replaces the seven duplicates from the original.

- [ ] **Step 4: Screenshot the shell**

Run `mcp__figma-console__figma_take_screenshot` of the new frame.

- [ ] **Step 5: User review checkpoint**

Show the screenshot. Verify: top bar matches the existing pattern, toolbar reads left-to-right correctly, the new "Log time" button is present and prominent. Wait for approval.

---

## Task 2: Hero panel — "This week"

**Files:** child frame inside the page frame.

- [ ] **Step 1: Build the hero panel container**

Inside the page frame, append a horizontal auto-layout row with 16px gap and 24px horizontal padding (this is the row that will hold both hero panels). Inside it, create the "This week" panel as a frame:
- Width: 70% of available (use auto-layout `layoutGrow = 1` with a min width).
- Height: hugs content.
- Padding: 24px.
- Radius: bind to the card-radius variable (12px).
- Fill: `--color-primary-color`.
- Shadow: `shadow-md` token.
- Vertical auto-layout, 16px gap.

- [ ] **Step 2: Add the hero number block**

Inside the panel, add:
- Eyebrow text "This week" using `text-t3` style + the `text-color-on-primary` variable at 70% opacity (use a separate token if available, else a tinted variant).
- Number row: `text-h1` for `"32h"` and `text-h1` for `" / 40h"` with the latter at 60% opacity, both using on-primary text color.

Bind every text style to a typography variable (`text-t3`, `text-h1`). No raw font-size.

- [ ] **Step 3: Add the 7-cell day strip**

Build a horizontal auto-layout row, 8px gap, with seven cells. Each cell is a vertical auto-layout frame with:
- Width 1.5× height (set explicit width so the row totals to the panel's inner width minus padding).
- Radius bound to the small-radius variable (8px).
- Day label `text-t3` at top.
- Hours `text-t3` below.

Encode state per the spec (Task notes only — actual data goes in Task 5):
- Empty: 1px stroke at `rgba(255,255,255,0.25)`, transparent fill. **Replace with a tinted variable if available** (look for an `on-primary-outline` token); only use raw rgba if no variable exists, and flag it.
- Partial: white fill at 35% opacity (same caveat: prefer a token).
- Complete: solid white fill, day-label and hours flip to `--color-primary-color`.
- Today: 2px white stroke ring on top of any of the above.

For Task 2, build all seven cells in the **empty** state. Real values go in later tasks.

- [ ] **Step 4: Add the footer line**

Below the strip, an auto-layout row with:
- `text-t3` "8h to go · 3 projects · 12 entries" using on-primary at 70% opacity.
- Right-aligned `Chip` instance with `variant=success, label="↑ +6h vs last week"`.

- [ ] **Step 5: Screenshot and user review**

Screenshot the hero panel. Confirm visual hierarchy: number reads first, strip second, footer third. Confirm the strip cells look distinct enough to communicate state. Wait for approval.

---

## Task 3: "Top projects" panel

**Files:** sibling card inside the same hero row as Task 2.

- [ ] **Step 1: Build the panel container**

Add a frame next to the hero panel inside the same horizontal row. 30% width (use `layoutGrow = 0` with explicit width or `layoutGrow = 1` with a smaller flex weight). Padding 24px, radius bound to card-radius, fill `--color-card-background-color`, shadow `shadow-xs`, vertical auto-layout 16px gap.

- [ ] **Step 2: Add the title**

`text-t2` "Top projects · this week" in `--color-text-color`.

- [ ] **Step 3: Add the stacked bar**

A horizontal auto-layout frame, height 12px, radius bound to small-radius (the bar itself is a rounded pill), `clipsContent=true`. Inside, three child frames:
- Project 1 segment: `layoutGrow` proportional to its hours, fill bound to the **primary** semantic Chip-color variable.
- Project 2 segment: fill bound to **success**.
- Project 3 segment: fill bound to **warning**.

Use the same project ranking the spec defines (hours desc, alpha tiebreak). Hardcode the partial-week values for now: Acme 14h / Saph 9h / Other 9h.

- [ ] **Step 4: Add the legend list**

Below the bar, three vertical rows. Each row is horizontal auto-layout:
- 8px circle (frame with full radius) using the project's color variable.
- `text-t2` project name.
- `text-t2` hours, right-aligned with `layoutGrow = 1` on a spacer.

- [ ] **Step 5: Screenshot and user review**

Screenshot the full hero row (both panels). Verify: the two panels sit side-by-side, the stacked bar reads cleanly, project colors stay consistent. Wait for approval.

---

## Task 4: Day-row variants (build once, reuse)

**Files:** three reusable patterns inside the page frame, defined as local component sets so Tasks 5, 7, and 8 can instance them.

- [ ] **Step 1: Filled-day card variant**

Build the filled card per the spec section 2a. Convert it to a local `COMPONENT_SET` with property `entryCount: 1 | 2 | 3 | 4+` so the same card can render different entry counts. Inside:
- Header row: compact two-line date chip + day name + month-year + optional `Badge variant=primary "Today"` + right-aligned `text-t2 "Total {Xh}"`.
- Entry rows (variants by `entryCount`): each row is a horizontal auto-layout with:
  - 8px project-color dot (variable-bound).
  - 24–48px tinted mini-bar (variable-bound, length = `layoutGrow` proportional inside a fixed-width container).
  - `text-t2` "Project · task" (truncate single-line via `textTruncation = "ENDING"`).
  - Right cluster: `text-t2` duration + `IconButton` (pencil).
- Footer: ghost `Button leadingIcon=Plus` "Add entry".

- [ ] **Step 2: Empty-weekday thin row variant**

Build per spec 2b. 40px height, 50% opacity card surface, no shadow, 8px radius. Layout: `[muted date chip]  Tuesday Apr 28  ·  no entries  [spacer]  [+ Log time link]`. Convert to a local `COMPONENT`.

- [ ] **Step 3: Empty-weekend thin row variant**

Same as Step 2, but adds a `Chip variant=neutral "weekend"` between the day name and "no entries", and lowers text opacity to 60%. Convert to a local `COMPONENT`.

- [ ] **Step 4: Screenshot and user review**

Screenshot the three variants laid out next to each other on a scratch frame for review. Verify: filled card hierarchy reads cleanly, thin rows are unmistakably less weighty, weekend pill differentiates from weekday. Wait for approval. Once approved, delete or hide the scratch layout — the components stay.

---

## Task 5: Compose the partial-week state

**Files:** the page frame from Task 1, populated with day rows.

- [ ] **Step 1: Add the "Days" section header**

Below the hero row, add `text-t2` "Days" in `--color-text-color` with 24px horizontal padding and 8px bottom margin. Add a `Divider` instance below it.

- [ ] **Step 2: Instance the seven day rows in reverse-chronological order**

Use the variants from Task 4. Per the spec wireframe, the partial-week state is:

| Date | Variant | Notes |
|---|---|---|
| Thu Apr 30 | Filled (3 entries) | Has "Today" Badge. Entries: Acme · Design review (3h), Acme · QA pass (2h), Saph · Client call + notes (3h). |
| Wed Apr 29 | Filled (1 entry) | Acme · Discovery workshop (8h). |
| Tue Apr 28 | Empty weekday | — |
| Mon Apr 27 | Filled (2 entries) | Acme · Sprint planning (4h), Other · Internal sync (4h). |
| Sun Apr 26 | Empty weekend | — |
| Sat Apr 25 | Empty weekend | — |
| Fri Apr 24 | Filled (1 entry) | Saph · Wrap-up (4h). |

Set the project-color dots and bar tints to match the project ranking (Acme=primary, Saph=success, Other=warning).

- [ ] **Step 3: Update the hero strip and Top Projects panel to match**

Mutate the seven heatmap cells to reflect the table above:
- Thu (today): partial fill (8h is target met but it's "today" and the user is mid-day in the spec story — choose: partial fill, today ring). Actually for the wireframe story we said today logged 8h → complete fill + today ring.
- Wed: complete fill.
- Tue: empty (this is the gap to spot).
- Mon: complete fill.
- Sun, Sat: empty weekend (use a slightly differentiated style — same as empty but no ring).
- Fri: partial fill (4h of 8h).

Update the footer line to "8h to go · 3 projects · 7 entries" and the delta chip to "↑ +6h vs last week".

The Top Projects stacked bar already shows the values from Task 3 — verify those still match: Acme 14h, Saph 9h, Other 8h. Update if math drifted.

- [ ] **Step 4: Add the existing footer (pagination)**

At the bottom of the page frame, instance `Pagination` and `Table Footer` exactly as they appear in the source frame `25770:5342`. Bind to the same variables.

- [ ] **Step 5: Screenshot the entire page frame**

Take a full screenshot of the partial-week frame.

- [ ] **Step 6: User review checkpoint — partial-week state**

Show the screenshot. This is the **canonical state** of the redesign and the moment the user decides whether the direction is working. Iterate on this frame until approved before moving on. Per the spec, the partial-week approval gates the empty/full variants.

---

## Task 6: Theme verification — partial week

**Files:** none (read-only verification on the partial-week frame).

- [ ] **Step 1: Toggle to dark mode**

Run `figma_execute` to set the page or frame's mode to "Dark". Take a screenshot.

- [ ] **Step 2: Toggle to black mode**

Same, mode "Black". Screenshot.

- [ ] **Step 3: Audit results**

Inspect both screenshots for:
- Heatmap cell legibility — empty/partial/complete states still distinguishable.
- Hero panel contrast — the on-primary text remains readable.
- Project-color dots and stacked-bar segments still differentiated.
- Day-row card surfaces still distinct from the canvas background.

If anything fails, swap the offending raw rgba/opacity for a discrete tint variable. (Spec risk #1 anticipates this.)

- [ ] **Step 4: User review checkpoint**

Show all three theme screenshots side by side. Wait for approval before building empty/full variants.

---

## Task 7: Empty-week state variant

**Files:** new sibling frame `"Daily view — redesign (A) [empty week]"`.

- [ ] **Step 1: Clone the partial-week frame**

Run `figma_execute` to clone the partial-week frame and rename to "[empty week]". Position it 200px below the partial-week frame.

- [ ] **Step 2: Update the hero**

- Number: `0h / 40h`.
- Strip: all cells in the empty state. Today still gets the white ring.
- Footer: `40h to go · let's log the first one`. Suppress the delta chip.

- [ ] **Step 3: Update the Top Projects panel**

Replace the stacked bar with the empty-state placeholder per spec: a striped neutral bar (use a neutral skeleton fill or `Skeleton` instance) with caption "No project data yet — log time to see your split."

- [ ] **Step 4: Replace all seven day rows with thin variants**

Empty weekdays for Mon–Fri (with "Today" pill on Thu Apr 30). Empty weekend for Sat–Sun. Verify the page is much shorter now (target: fits in one viewport on a 1080px screen).

- [ ] **Step 5: Screenshot and theme check**

Screenshot in light, dark, and black modes.

- [ ] **Step 6: User review checkpoint** — wait for approval.

---

## Task 8: Full-week state variant

**Files:** new sibling frame `"Daily view — redesign (A) [full week]"`.

- [ ] **Step 1: Clone the partial-week frame**

Clone and rename. Position 200px below the empty-week frame.

- [ ] **Step 2: Update the hero**

- Number: `42h / 40h` (slight overshoot to communicate "exceeded target").
- Strip: all seven cells in the **complete** state, today retains its ring.
- Footer: `Target met · 4 projects · 18 entries` with delta chip `success` `↑ +14h vs last week`.

- [ ] **Step 3: Update the Top Projects panel**

Adjust segment weights to a 4-project split: Acme 18h, Saph 12h, Other 8h, Internal 4h. Add the 4th legend row.

- [ ] **Step 4: Replace all seven day rows with filled cards**

Populate plausible content for each day (1–4 entries each). Keep weekday/weekend visual distinction subtle — weekend filled cards show the `Chip variant=neutral "weekend"` in the header so the weight-vs-state contrast is preserved.

- [ ] **Step 5: Screenshot and theme check**

Screenshot in light, dark, and black modes.

- [ ] **Step 6: User review checkpoint** — wait for approval.

---

## Task 9: Final assembly review

**Files:** none (read-only).

- [ ] **Step 1: Capture all three frames in one shot**

Use `figma_take_screenshot` on the parent section/page that holds all three frames so the user can see the empty / partial / full progression in a single image, in the default theme.

- [ ] **Step 2: Verify spec coverage**

Walk the spec's "Definition of done" checklist against the built frames:

- [ ] All three states exist as separate frames.
- [ ] Frame is built with library instances (no detached primitives, no local one-offs duplicating library components).
- [ ] Every fill/stroke/radius/spacing/text style binds to a Figma variable. Spot-check 5 random nodes for raw values; if any are found, fix and re-check.
- [ ] All three themes verified (light/dark/black).
- [ ] No new components or tokens were introduced.

- [ ] **Step 3: User sign-off**

Show the user the three-up screenshot, the per-theme screenshots, and the spec-coverage checklist. On approval, the Figma deliverable is done. The downstream React implementation, if commissioned, is a separate spec/plan and is **not part of this plan**.

---

## Self-review notes

- **Spec coverage:** every section of the spec maps to a task — Hero (Task 2), Top Projects (Task 3), three day-row variants (Task 4), partial-week canonical state (Task 5), theme correctness (Tasks 6/7/8), states (Tasks 5/7/8), DoD (Task 9). No gaps.
- **Placeholder scan:** no TBDs, no "implement later", no "similar to Task N" without inlined detail. Every text label, hour value, and visual state is concrete in the task it appears in.
- **Type consistency:** the spec mentions `Badge variant="primary"` for the Today pill; Task 4 and Task 5 both use the same `variant=primary` naming. Project-color mapping (primary/success/warning/info/neutral) is consistent across Tasks 3, 4, 5, 7, 8. Frame names are consistent: `"[empty week]"`, `"[partial week]"`, `"[full week]"`.
- **Known compromise:** Task 2 Step 3 currently uses raw rgba for the empty cell stroke as a fallback. Task 6 Step 3 catches this in the audit and forces a swap to a tint variable if the audit finds a contrast issue. Both tasks reference the same risk by number. This is honest about the open token question without blocking the build.
