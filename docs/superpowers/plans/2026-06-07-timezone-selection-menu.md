# Timezone Selection Menu Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. This is a **Figma authoring** plan — the "tests" are screenshot-based visual verifications (the figma-console VISUAL VALIDATION WORKFLOW), not unit tests.

**Goal:** Design a timezone-selection dropdown in the TimeWorks DS Figma file that opens from the Toolbar's timezone selector, with plain-language labels, `City, Country (ABBR)` values, and a check + accent on the selected row.

**Architecture:** Author a new component page following the four-frame contract (Anatomy / Variants / States / Tokens) via the `figma-design` skill. The menu surface is built on the DS **Popover** pattern; rows are single-select (radio semantics). Every fill/stroke/radius/spacing/type binds to a DS variable or style — no raw values.

**Tech Stack:** Figma (file `gqYWCu1K6dJ9gESXtgNeCi`, "TimeWorks Design System"), figma-console MCP (Plugin API via `figma_execute`), DS color/text/effect styles + Tokens Studio variables.

**Spec:** `docs/superpowers/specs/2026-06-07-timezone-selection-menu-design.md`

**Key anchors (verified 2026-06-07):**
- Toolbar frame: `28286:14275`
- Timezone trigger (narrow `EST ▾` Dropdown, Toolbar Center): `28286:15280`
- Person Dropdown (reference for open/menu styling): `28286:14278`

---

## File / artifact structure

This plan produces **Figma artifacts only** (no repo files beyond docs). Artifacts:

- A new Figma page: **`Timezone Menu`** (or `Component / Timezone Menu` per DS page-naming convention — confirm in Step 1).
- Four frames on that page: `Anatomy`, `Variants`, `States`, `Tokens`.
- One component/component-set for the menu surface; the trigger references the existing DS Dropdown.

A `runs/` log is written at the end documenting node IDs created and any raw-value decisions.

---

## Task 1: Discovery — confirm DS primitives, styles, and tokens

**Artifacts:** read-only inspection; no mutations.

- [ ] **Step 1: Inspect the timezone trigger and its main component**

Run via `figma_execute`:
```js
const n = await figma.getNodeByIdAsync('28286:15280');
const mc = n.type === 'INSTANCE' ? await n.getMainComponentAsync() : null;
return JSON.stringify({ name:n.name, type:n.type, w:n.width,
  main: mc && {id:mc.id, name:mc.name, parent:mc.parent && mc.parent.name},
  props: n.componentProperties && Object.keys(n.componentProperties) });
```
Expected: identifies the DS Dropdown main component + its variant/text props (so the trigger's open-state chevron can be reused, not redrawn).

- [ ] **Step 2: List text styles and pick the two needed**

Run: `figma_get_text_styles`.
Expected: find the leaf names mapping to `text-t3` (12/16, used for the gray context label) and `text-t1` (16/22, used for the value). Record their style IDs.

- [ ] **Step 3: Resolve color + effect + radius variables**

Run via `figma_execute` to list the variables the spec names, capturing their IDs:
```js
const cols = await figma.variables.getLocalVariableCollectionsAsync();
const vars = await figma.variables.getLocalVariablesAsync();
const want = ['background','background-hover','border','text-primary','text-secondary','primary-color'];
return JSON.stringify(vars
  .filter(v => want.some(w => v.name.toLowerCase().includes(w)))
  .map(v => ({id:v.id, name:v.name, resolvedType:v.resolvedType})));
```
Expected: capture exact variable IDs for `color-background`, `color-background-hover` (or the DS menu-item hover token), `color-border`, `color-text-primary`, `color-text-secondary`, `color-primary-color`. Also note the `shadow-md` effect style and the `12` card-radius token. **If `color-background-hover` (menu-item hover) is missing, STOP and report — per CLAUDE.md, a missing token is added in Figma/Tokens Studio first, not invented.**

- [ ] **Step 4: Capture a baseline screenshot of the open person-Dropdown (if it has an open state)**

Run: `figma_capture_screenshot` on `28286:14278` (or its expanded variant) to use the existing menu surface (radius, padding, shadow, item hover) as the styling reference so the new menu is consistent.
Expected: reference image saved; styling decisions recorded.

- [ ] **Step 5: Record discovery results**

Append findings (node IDs, style IDs, variable IDs, missing-token flags) to the run log section of this task before proceeding. No commit (Figma state is the source of truth); the run log is written at Task 6.

---

## Task 2: Create the page and four empty frames (Anatomy / Variants / States / Tokens)

**Artifacts:** new page + 4 frames.

- [ ] **Step 1: Invoke the figma-design skill**

The `figma-design` skill owns page/frame scaffolding and the four-frame contract. Invoke it with the spec path and the discovery results from Task 1. Let it create the page named per DS convention and the `Anatomy`, `Variants`, `States`, `Tokens` frames.

- [ ] **Step 2: Verify the page does not already exist (avoid duplicates)**

Per the figma-console PAGE CREATION rule, before creating: `await figma.loadAllPagesAsync(); figma.root.children.find(p => p.name === '<page name>')`.
Expected: no existing page; proceed. If it exists, reuse it.

- [ ] **Step 3: Screenshot-verify the empty frames**

Run: `figma_capture_screenshot` of the new page.
Expected: four labelled frames laid out left-to-right, no floating nodes.

---

## Task 3: Build the menu surface in the Variants frame

**Artifacts:** the assembled menu (closed trigger + open menu surface) inside `Variants`.

- [ ] **Step 1: Build the surface container**

Inside `Variants`, create an auto-layout FRAME for the menu surface:
- vertical auto-layout, itemSpacing `20`, padding `16`
- cornerRadius bound to the `12` card-radius token
- fill bound to `color-background` variable (bake the resolved light-mode value if binding a FRAME fill — per the known figma-console quirk that FRAME fill var-binding renders black)
- stroke bound to `color-border`, weight `1`
- effectStyleId set to the `shadow-md` style from Task 1
- counterAxis sizing = AUTO (hug width), targeting ~`280` content width

- [ ] **Step 2: Build one row group as a reusable sub-frame**

Create a vertical auto-layout FRAME `Row` (itemSpacing `4`, vertical padding `8`, fill none, horizontal auto-layout for value+check):
- Line 1: TEXT node, the context label, `textStyleId` = t3 style, fill bound to `color-text-secondary`.
- Line 2: horizontal auto-layout with: TEXT value (`textStyleId` = t1 style, fill `color-text-primary`) + a right-aligned `Check` icon slot (hidden by default).

Set the inner TEXT node text directly with `figma_set_text` (per the known setProperties-TEXT quirk — do not rely on component text props).

- [ ] **Step 3: Duplicate to three rows with the spec content**

Three `Row` instances, content per spec:
1. `Member's time zone` / `Manila, Philippines (PST)`
2. `Your time zone` / `New York, USA (EDT)` — **selected**
3. `Company time zone` / `New York, USA (EDT)`

Build children atomically (clear + append in one `figma_execute`) per the known figma-console data-loss quirk.

- [ ] **Step 4: Apply the selected treatment to row 2**

On `Your time zone`: show its `Check` icon (fill `color-primary-color`) and set the value TEXT fill to `color-primary-color`.

- [ ] **Step 5: Screenshot-verify the menu**

Run: `figma_capture_screenshot` of the menu surface.
Expected matches the spec ASCII: three groups, gray labels, dark values, row 2 with indigo value + right-aligned check. Check alignment, even `20` gaps, hug width. Iterate up to 3× if misaligned.

- [ ] **Step 6: Structural dump to confirm no dropped children**

Run a `figma_execute` tree dump of the surface (per the data-loss quirk — verify structurally, not via the success result).
Expected: surface → 3 rows, each row → label + (value + check). All present.

---

## Task 4: Build the States frame

**Artifacts:** six states in the `States` frame.

- [ ] **Step 1: Place the trigger closed + open states**

Clone the DS Dropdown trigger (`28286:15280`'s main component) twice into `States`:
- **Trigger — closed:** chevron down, label `EDT`.
- **Trigger — open:** chevron up, label `EDT`, with the menu surface (from Task 3) positioned directly below, left-aligned.

- [ ] **Step 2: Add the four row states**

Clone the `Row` into four labelled rows in `States`:
1. **default** — plain.
2. **hover** — full-row background bound to `color-background-hover` (or the DS menu-item hover token from Task 1).
3. **selected** — check + value in `color-primary-color`.
4. **selected + hover** — hover background AND check + accent.

Annotate each with its state name (small caption above each).

- [ ] **Step 3: Screenshot-verify States**

Run: `figma_capture_screenshot` of the `States` frame.
Expected: 2 trigger states + 4 row states, each legible and labelled; hover background spans the full row width; selected accent uses `color-primary-color`. Iterate up to 3×.

---

## Task 5: Anatomy + Tokens frames

**Artifacts:** annotated anatomy + token sticker sheet.

- [ ] **Step 1: Anatomy frame**

Place one open menu instance in `Anatomy`. Add annotation callouts naming: the **Popover** (Radix primitive) as the surface, the **single-select rows** (radio semantics), the context label, the value, and the selected check. Use `figma_set_annotations` where available; else caption TEXT nodes with connector lines.

- [ ] **Step 2: Tokens sticker sheet**

In `Tokens`, lay out swatches/labels for every variable + style consumed, with their exact leaf names from Task 1:
`color-background`, `color-background-hover`, `color-border`, `color-text-primary`, `color-text-secondary`, `color-primary-color`, `shadow-md`, card radius `12`, spacing `4 / 8 / 16 / 20`, `text-t1`, `text-t3`.

- [ ] **Step 3: Screenshot-verify both frames**

Run: `figma_capture_screenshot` of `Anatomy` and `Tokens`.
Expected: anatomy labels point at the right parts; token sheet lists each consumed token with a correct sample. Iterate up to 3×.

---

## Task 6: Final verification + run log

- [ ] **Step 1: Full-page screenshot**

Run: `figma_capture_screenshot` of the whole page.
Expected: four complete frames; nothing floating; matches the spec.

- [ ] **Step 2: figma-design "Definition of done" checklist**

Walk the `figma-design` skill's done-checklist: every fill/stroke/radius/spacing/type binds to a variable or style (no raw values except the documented FRAME-fill bake), all four frames present, states complete, anatomy names the Radix primitive.

- [ ] **Step 3: Write the run log**

Create `docs/superpowers/runs/2026-06-07-timezone-selection-menu-figma.md` recording: page name + node ID, the four frame node IDs, every style/variable ID used, the FRAME-fill bake decision, and any other raw-value decisions. List anything deferred (e.g. token added in Tokens Studio).

- [ ] **Step 4: Commit the run log**

```bash
git add docs/superpowers/runs/2026-06-07-timezone-selection-menu-figma.md
git commit -m "docs: timezone selection menu Figma run log"
```

---

## Self-review notes

- **Spec coverage:** surface styling (T3-S1), three rows + copy (T3-S3), selected check+accent (T3-S4, T4-S2.3), trigger open/closed (T4-S1), hover (T4-S2.2), four-frame contract (T2/T3/T4/T5), tokens sticker sheet (T5-S2) — all mapped.
- **Known figma-console quirks pre-empted:** FRAME-fill var binding bake (T3-S1), atomic child rebuild + structural dump (T3-S3/S6), setProperties-TEXT → set inner TEXT directly (T3-S2), section/relative-coords not relevant (no SECTION used), 5s-timeout → batch small (implicit, keep each `figma_execute` focused).
- **Missing-token gate:** T1-S3 stops if the menu-item hover token is absent rather than inventing one.
