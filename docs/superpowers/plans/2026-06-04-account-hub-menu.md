# Account Hub Menu Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the catch-all account-hub dropdown that opens from the top-bar `User` trigger in the TimeWorks Desktop App, as a Figma component in the Design System file.

**Architecture:** Approach A — a flat, sectioned Dropdown surface composed from shipped DS Figma components (Dropdown, Avatar, Badge, SegmentedControl). Eight sections separated by dividers, with inline controls for presence and theme. Authored in the Experiment/working file `gqYWCu1K6dJ9gESXtgNeCi` via the `figma-design` skill, following the four-frame contract (Anatomy / Variants / States / Tokens).

**Tech Stack:** Figma (figma-console MCP, Plugin API via `figma_execute`), DS Figma library components, Tokens Studio variables. This plan produces **Figma design only** — no React code (that is a later `figma-to-code` handoff).

**Medium note — what "test" means here:** Figma has no unit tests. Each task's verification step is the figma-console **visual-validation loop**: `figma_capture_screenshot` → inspect alignment/spacing/proportion → confirm every fill/stroke/radius/spacing binds to a Figma **variable** (no raw values) → confirm correct rendering when the frame's variable **mode** is switched across Light / Dark / Black. "Commit" steps are replaced by a **checkpoint screenshot** saved as the section's verification.

**Reference spec:** `docs/superpowers/specs/2026-06-04-account-hub-menu-design.md`

**Known component nodes (working file, verify at runtime — node IDs drift):**
- Dropdown — `46946:1926` (componentSet, 42 variants; source of the menu surface + rows)
- Avatar — `46939:89419`
- Badge — `46939:90704`
- Chevron icons — Down `49719:73605`, Up `49719:105389`
- Trigger `User` frame — `27873:790325`; Top Bar `27758:293291`; screen `27758:293285`

---

## Pre-flight (run once before Task 1)

- [ ] **P1: Confirm connection + correct file**

Run: `figma_get_status` with `probe: true`.
Expected: `connectedFile.fileName === "TimeWorks Design System"`, `fileKey === "gqYWCu1K6dJ9gESXtgNeCi"`, `probeResult.success === true`. If a different file is connected, STOP and ask the user to focus the DS working file.

- [ ] **P2: Re-resolve component node IDs (they are session-specific)**

Run: `figma_search_components` for `Dropdown`, `Avatar`, `Badge`, and `Segmented` / `Control` / `Tabs`.
Expected: Dropdown, Avatar, Badge resolve. Record their current `key`/`nodeId`.
If **SegmentedControl** does not resolve in this file, note it and use the **fallback** in Task 4 (a checked menu-row group) instead of blocking.

- [ ] **P3: Invoke the `figma-design` skill**

This plan is the roadmap; `figma-design` owns the authoring mechanics (page scaffold, four-frame contract, token discovery, variable binding, the stop-if-token-missing rule). Invoke it now and drive it section by section using the tasks below.

---

## Task 1: Page + open-menu artboard scaffold

**Figma artifacts:**
- Create: page `Account Hub Menu` (check it does not already exist first)
- Create: section `Component`, containing frame `Menu / Open` (the assembled menu surface)

- [ ] **Step 1: Guard against duplicate page**

Run via `figma_execute`:
```js
await figma.loadAllPagesAsync();
const existing = figma.root.children.find(p => p.name === 'Account Hub Menu');
return { exists: !!existing, id: existing?.id ?? null };
```
Expected: `exists: false`. If it exists, reuse it — do not create a second.

- [ ] **Step 2: Create the page, a `Component` section, and the `Menu / Open` frame**

Create the page (if absent), add a `Section` named `Component`, and inside it an auto-layout frame `Menu / Open`: vertical, hug-contents height, fixed width **280px** (standard account-menu width; adjust only if the identity header demands more), corner radius bound to the **12px card/modal radius** variable, fill bound to the menu/surface background variable, effect bound to **`shadow-lg`**.

- [ ] **Step 3: Verify**

`figma_capture_screenshot` of `Menu / Open`.
Expected: an empty rounded surface with the large drop shadow, no raw hex/px (radius, fill, shadow all from variables). Switch the frame's variable mode Light→Dark→Black; surface + shadow must remain correct.

- [ ] **Step 4: Checkpoint screenshot** — save as the scaffold baseline.

---

## Task 2: Identity header section

**Figma artifacts:** inside `Menu / Open`, add frame `Section / Identity`.

- [ ] **Step 1: Build the header**

Instantiate **Avatar** (size lg) on the left. To its right, a vertical text stack: name `Andrea` (`t1`, primary text token), email `andrea@…` (`t3`, secondary text token), role (`t3`, secondary). Below the avatar row, a **workspace row**: org name label (`t2`) with a trailing chevron-down (`49719:73605`) on the right — this is the workspace switcher affordance.

- [ ] **Step 2: Bind tokens**

Avatar size from Avatar's own variants. All text colors from semantic text tokens (primary vs secondary). Row paddings/gaps from spacing variables. Divider beneath the section bound to the border/divider token.

- [ ] **Step 3: Verify**

`figma_capture_screenshot` of `Section / Identity`.
Expected: avatar + 3 text lines aligned, workspace row with right-aligned chevron, divider below. No raw values. Check all three theme modes — secondary text must stay legible (contrast ≥ 4.5:1) in each.

- [ ] **Step 4: Checkpoint screenshot.**

---

## Task 3: Presence section

**Figma artifacts:** frame `Section / Presence` with four selectable rows.

- [ ] **Step 1: Build four presence rows**

Four Dropdown menu rows: **Active**, **Away**, **Break**, **Do Not Disturb**. Each row has a leading **status dot** (small circle) and a trailing **check** glyph shown only on the active row. Default the `Active` row to selected (matches the live timer in the screen). Add a small section caption `Status` (`t3`, secondary) above the rows.

- [ ] **Step 2: Bind status-dot tokens (STOP-gate)**

Bind each dot fill to a semantic **status color** variable: Active→success/online, Away→warning, Break→neutral, Do Not Disturb→danger. **If any of these status variables does not exist in Tokens Studio, STOP** — add it in Tokens Studio, push, run `npm run tokens:build`, then continue (per CLAUDE.md Authoring workflow). Do not hardcode a hex.

- [ ] **Step 3: Verify**

`figma_capture_screenshot` of `Section / Presence`.
Expected: 4 rows, distinct dot colors, check on `Active` only, caption above, divider below. All three theme modes: dots remain distinguishable.

- [ ] **Step 4: Checkpoint screenshot.**

---

## Task 4: Appearance (theme) section

**Figma artifacts:** frame `Section / Appearance`.

- [ ] **Step 1: Build the theme toggle**

Caption `Appearance` (`t3`, secondary). Below it, a **SegmentedControl** instance with three segments **Light / Dark / Black**, with the segment matching the frame's current mode shown active.
**Fallback (if SegmentedControl is absent in this file, per P2):** three Dropdown menu rows `Light` / `Dark` / `Black`, each with a leading swatch and a trailing check on the active one.

- [ ] **Step 2: Bind tokens**

Segment fills/active state from SegmentedControl's own variants/tokens. Caption and any swatch borders from semantic tokens. Padding/gap from spacing variables. Divider below from divider token.

- [ ] **Step 3: Verify**

`figma_capture_screenshot` of `Section / Appearance`.
Expected: labeled 3-way control, one segment active. Switch modes Light→Dark→Black; the active segment should reflect the mode and the control must render correctly in each.

- [ ] **Step 4: Checkpoint screenshot.**

---

## Task 5: Account & settings section

**Figma artifacts:** frame `Section / Account`.

- [ ] **Step 1: Build four link rows**

Dropdown menu rows, each leading icon + label: **Account settings**, **Preferences**, **Notifications**, **Billing & plan**. Use icons from the DS icon library (e.g. settings/gear, sliders, bell, credit-card). Default row state.

- [ ] **Step 2: Bind tokens**

Row text = `t2` primary token; icons inherit icon/foreground token; row paddings/gaps from spacing variables; hover background variant from the Dropdown row component. Divider below from divider token.

- [ ] **Step 3: Verify**

`figma_capture_screenshot` of `Section / Account`.
Expected: 4 aligned icon+label rows, divider below, no raw values. Check three theme modes.

- [ ] **Step 4: Checkpoint screenshot.**

---

## Task 6: Integrations section

**Figma artifacts:** frame `Section / Integrations`.

- [ ] **Step 1: Build rows**

Two rows: **ChatWorks** (leading ChatWorks/app icon, trailing **Badge** dot to mirror the top-bar notification dot) and **Connected apps** (leading plug/grid icon). Caption `Integrations` (`t3`, secondary) above.

- [ ] **Step 2: Bind tokens**

Badge color from notification/danger status token. Text/icon/padding from semantic + spacing tokens. Divider below from divider token.

- [ ] **Step 3: Verify**

`figma_capture_screenshot` of `Section / Integrations`.
Expected: 2 rows, ChatWorks shows a badge dot, caption above, divider below. Three theme modes correct.

- [ ] **Step 4: Checkpoint screenshot.**

---

## Task 7: Help & support section

**Figma artifacts:** frame `Section / Help`.

- [ ] **Step 1: Build rows**

Five Dropdown rows with leading icons: **Help center** (book/question), **Keyboard shortcuts** (with a trailing muted hint `⌘?` as `t3` secondary text), **Send feedback** (message), **Report a bug** (bug/flag), **Contact support** (life-buoy/mail). Caption `Help & support` (`t3`, secondary) above.

- [ ] **Step 2: Bind tokens**

Row text `t2` primary; the `⌘?` hint `t3` secondary; icons foreground token; paddings/gaps spacing variables. Divider below from divider token.

- [ ] **Step 3: Verify**

`figma_capture_screenshot` of `Section / Help`.
Expected: 5 rows, `⌘?` right-aligned and muted on the shortcuts row, caption above, divider below. Three theme modes correct.

- [ ] **Step 4: Checkpoint screenshot.**

---

## Task 8: App / desktop section

**Figma artifacts:** frame `Section / App`.

- [ ] **Step 1: Build the app rows**

- **Version label** — passive row (not a button): `TimeWorks v2.4.1` as `t3` secondary text, leading info icon, no hover affordance.
- **Check for updates** — actionable row, leading refresh icon. Build it as the **default ("Up to date")** state here; the alternate updater states are added as Variants in Task 11.
- **View logs / diagnostics** — actionable row, leading file/list icon.

Caption `App` (`t3`, secondary) above. Divider below.

- [ ] **Step 2: Bind tokens**

Version text `t3` secondary (clearly non-interactive). Actionable rows `t2` primary with the Dropdown hover variant. Icons + spacing from tokens. Divider from divider token.

- [ ] **Step 3: Verify**

`figma_capture_screenshot` of `Section / App`.
Expected: muted version label visually distinct from the two actionable rows; caption above; divider below. Three theme modes correct.

- [ ] **Step 4: Checkpoint screenshot.**

---

## Task 9: Footer — Log out

**Figma artifacts:** frame `Section / Footer`.

- [ ] **Step 1: Build the log-out row**

Single Dropdown row **Log out** with a leading log-out/exit icon, text bound to the **destructive** text token, hover background bound to the destructive-subtle token. Divider **above** the footer (separating it from the App section).

- [ ] **Step 2: Bind tokens**

Destructive text + destructive hover tokens only (no raw red). Padding/gap from spacing variables.

- [ ] **Step 3: Verify**

`figma_capture_screenshot` of the full `Menu / Open` frame (all sections now assembled).
Expected: complete menu, log-out tinted destructive at the bottom, every section divider present, balanced spacing. Three theme modes correct end-to-end.

- [ ] **Step 4: Checkpoint screenshot** — this is the assembled-menu baseline.

---

## Task 10: Trigger open-state

**Figma artifacts:** a `Trigger` frame group showing the `User` trigger states.

- [ ] **Step 1: Build trigger states**

Replicate the `User` trigger (avatar + `Andrea` + chevron) in three states: **Default**, **Hover** (subtle background token), **Open** (chevron swapped to up `49719:105389`, active background token). These document how the trigger looks while the menu is open.

- [ ] **Step 2: Bind tokens**

Background, text, chevron color from semantic tokens. Focus-visible ring (added in States, Task 11) from the focus-ring token.

- [ ] **Step 3: Verify**

`figma_capture_screenshot` of the `Trigger` group.
Expected: 3 distinguishable states, chevron up in Open. Three theme modes correct.

- [ ] **Step 4: Checkpoint screenshot.**

---

## Task 11: Four-frame contract (Anatomy / Variants / States / Tokens)

**Figma artifacts:** four labeled frames on the `Account Hub Menu` page, per the `figma-design` skill contract.

- [ ] **Step 1: Anatomy**

Place the assembled `Menu / Open` with callout annotations naming each region (Identity / Presence / Appearance / Account / Integrations / Help / App / Footer) and an annotation stating the Radix mapping: **Radix DropdownMenu** (root surface), with the workspace switcher as a **DropdownMenu.Sub**. Use `figma_set_annotations` where possible.

- [ ] **Step 2: Variants**

Show the meaningful variants side by side:
- Identity header: **single-org** (static workspace label) vs **multi-org** (switcher chevron + expanded org submenu).
- **Check for updates** states: *Up to date* · *Update available* (accent Badge, label → **Download update**) · *Downloading…* (busy/disabled) · *Restart to update*.
- Presence: all four states shown selected.

- [ ] **Step 3: States**

Row state matrix using Dropdown row variants: Default · Hover · Focus-visible (focus ring) · Pressed · Disabled · Selected. Plus the three Trigger states from Task 10.

- [ ] **Step 4: Tokens**

Sticker sheet listing every variable the menu consumes: surface bg, divider, primary/secondary text, hover/pressed row bg, focus ring, destructive text+hover, the four status-dot colors, radius (12), spacing steps used, `shadow-lg`. Each swatch labeled with its variable name.

- [ ] **Step 5: Verify**

`figma_capture_screenshot` of each of the four frames.
Expected: all four present and labeled; Variants visibly differ; Tokens sheet names real variables (cross-check against `figma_get_variables`).

- [ ] **Step 6: Checkpoint screenshot.**

---

## Task 12: Three-theme QA pass + parity check

- [ ] **Step 1: Theme sweep**

For the assembled `Menu / Open` and the four-frame contract, switch variable modes **Light → Dark → Black** and screenshot each.
Expected: correct surface, dividers, text contrast (≥ 4.5:1), status dots, destructive tint, and shadow in all three. No element invisible or low-contrast in any mode.

- [ ] **Step 2: No-raw-values audit**

Run an audit (e.g. `figma_audit_design_system` or a `figma_execute` walk of `Menu / Open` descendants) checking that every fill/stroke/effect/corner-radius/spacing resolves to a bound variable, not a literal.
Expected: zero raw values reported. Fix any literal by binding to the correct variable (or, if none exists, STOP and add it in Tokens Studio).

- [ ] **Step 3: Final verification screenshot**

`figma_capture_screenshot` of the whole `Account Hub Menu` page.
Expected: page contains scaffold + assembled menu + Anatomy/Variants/States/Tokens, all theme-correct. This screenshot is the definition-of-done artifact.

- [ ] **Step 4: Summarize for the user**

Report: page name + node ID, the assembled menu node ID, any tokens that had to be added in Tokens Studio, and any open-question resolutions (multi-org, presence↔timer sync). Note that the React build is a separate `figma-to-code` step, not done here.

---

## Self-review notes (author)

- **Spec coverage:** all 8 sections (Identity, Presence, Appearance, Account, Integrations, Help, App/desktop incl. version + updates + logs, Footer/Log out) map to Tasks 2–9; trigger open-state → Task 10; four-frame contract → Task 11; three-theme correctness → Tasks 3/4/.../12.
- **STOP-gates** for missing tokens are placed at the two riskiest points (presence status colors, the raw-value audit), per the Authoring workflow rule.
- **Open assumptions** from the spec (multi-org switcher, presence↔timer sync, status-token existence) surface as a Variant (Task 11.2), a default-selected row (Task 3.1), and a STOP-gate (Task 3.2) respectively — and are reported back in Task 12.4 for the user to confirm.
