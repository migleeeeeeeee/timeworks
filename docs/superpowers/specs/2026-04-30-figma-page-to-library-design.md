# Skill design: `figma-page-to-library`

**Status:** SUPERSEDED — see addendum below
**Author:** brainstorming session
**Date:** 2026-04-30

> **Addendum (same day, post first test).** The original strict design (HARD HALT on missing tokens, flag-only on missing components) was wrong. The skill exists to migrate pages onto the *existing* library, so it must always substitute the nearest available token/component and never ask the user to extend the library. The shipped skill in `.claude/skills/figma-page-to-library/` reflects the corrected design: best-fit substitution at all times, layer-4 preserve-as-image as the only "no semantic match" outcome, informational annotations instead of blockers. Read `SKILL.md` and `references/mapping-rules.md` for the live behavior. The sections below document the original design and are preserved for historical context only.

---

## Purpose

Convert any page or frame from a TimeWorks product Figma file (Manager dashboard, future Settings, Onboarding, etc.) into a duplicate that uses Design System library components and tokens for every element. Non-destructive: the original is never mutated.

This is the missing link between product Figma files (which still contain bespoke styling) and the shipped Design System (42 components, three themes, Tokens Studio pipeline). It does **not** generate code — `figma-to-code` owns that step and runs separately.

## Trigger

User pastes a Figma URL pointing at a page or frame in any product Figma file (i.e. not the Design System file itself, `04x9q7W2Y59baF5MqHAVZR`), paired with conversion intent — phrases like "convert this page to the library", "rebuild this in the design system", "swap to library components".

## Inputs

- A Figma URL with `node-id`. Skill parses `fileKey` + `nodeId`.
- Auto-detect granularity from `nodeId`:
  - Resolves to `PAGE` → page-level run (every top-level frame on that page).
  - Resolves to `FRAME` / `SECTION` / `COMPONENT` → frame-level run.
- DS library file (`04x9q7W2Y59baF5MqHAVZR`) is the implicit second input. Components and variables are resolved on demand via `mcp__figma-console__figma_get_library_components` and `mcp__figma-console__figma_get_variables`.

Guardrail: if the URL points to the DS file itself, skill refuses — that file is the source, not a target.

## Output

In the **source file** (whatever product file the URL came from):

- **Page-level run:** duplicate the page in place, suffix the duplicate with ` — DS` (e.g. `Overview` → `Overview — DS`).
- **Frame-level run:** create a new page named `<original page> — DS rebuild` containing only the rebuilt frame.

Plus a markdown decisions log at:
`docs/superpowers/runs/YYYY-MM-DD-<source-file-slug>-<page-name>-conversion.md`

Original page is never touched.

## Pipeline

The skill follows a plan → validate → execute pattern. Each run starts with a checklist the runtime copies into its TodoWrite list.

```
Conversion Progress:
- [ ] Step 1: Parse URL + verify source file is not DS
- [ ] Step 2: Inventory source subtree
- [ ] Step 3: Reconcile tokens (HARD GATE)
- [ ] Step 4: Map components (layered, lenient)
- [ ] Step 5: Duplicate + rebuild
- [ ] Step 6: Visual verify (screenshot pairs)
- [ ] Step 7: Write decisions log
```

### Step 1 — Parse + locate

Extract `fileKey` and `nodeId` from the URL. Convert `-` to `:` in `nodeId` per Figma URL conventions. Confirm `fileKey != 04x9q7W2Y59baF5MqHAVZR`. Resolve the node via `mcp__figma-console__figma_get_file_data` to determine type (page vs frame).

### Step 2 — Inventory

Walk the source subtree depth-first via `mcp__figma-console__figma_get_component_for_development_deep`. For each node, record:

- node id, name, type
- fills, strokes, effects (raw values **and** any bound variable id)
- text style (font family, size, weight, line height) **and** any bound text style id
- auto-layout props (direction, padding, gap, alignment)
- bounds (x, y, w, h)
- child structure signature (a hash of child types in order — used for fingerprint matching)

Output: a flat list of nodes with these fields. This is the "plan."

### Step 3 — Reconcile tokens (HARD GATE)

For every raw fill / stroke / radius / spacing / typography / shadow value found in step 2, look up its match in the DS library's variables (matched by **value**, not name — designers may have used a hex literal that happens to equal a token).

If **any** value has no matching DS variable → halt the run.

On halt, emit:

1. A Figma annotation (`mcp__figma-console__figma_set_annotations`) on each affected source node tagged `❌ missing token: <value>`.
2. A markdown report listing every missing value, the nodes that use it, and the recommended Tokens Studio path to add it (e.g. `Color Tokens / Light / surface / muted`).
3. A user-facing message: "Missing N tokens. Add them via Tokens Studio in Figma, push the export, run `npm run tokens:build`, then re-run the skill."

Why strict: tokens are cheap (minutes in Tokens Studio); a converted page that uses a non-token value silently breaks the dark/black theme rebuild and contradicts CLAUDE.md architecture rule #1.

### Step 4 — Map components (layered, lenient)

For each non-leaf node in the inventory, attempt mapping in three layers:

#### Layer 1 — name match

Tokenize the node name. Convention: `Component / Variant / Size` (e.g. `Button / Primary / Md`). Look up in DS library by exact component name (`mcp__figma-console__figma_get_library_components` → filter). Verify `Variant` and `Size` exist as valid props on that component. If both pass → mapped, exit.

#### Layer 2 — library search

If layer 1 misses, call `mcp__figma-console__figma_search_components` with a query built from the node's name keywords. Accept the top hit only when one of:

- Library component name is a case-insensitive substring of the source node name, **or**
- Library component's child structure signature (computed identically to step 2) matches the source node's signature exactly.

These two confidence rules exist to avoid false positives — a node named `Card` should not silently match `IconButton` just because both have one icon child. If neither rule fires → fall through.

#### Layer 3 — flag

Record the node in the decisions log under "unmapped components" with: node id, name, reason (no name match + no confident library hit), bounds. Mark it for verbatim copy in step 5.

### Step 5 — Duplicate + rebuild

1. Create the rebuild target:
   - **Page-level run:** duplicate the source page in place and rename to `<original> — DS`.
   - **Frame-level run:** create a new page named `<source page> — DS rebuild`, then clone the source frame into that page via `mcp__figma-console__figma_clone_node`.
2. Walk the rebuild target top-down. For each node:
   - **Mapped** → replace with `mcp__figma-console__figma_instantiate_component` using the resolved DS component + props. Preserve position, size, and the parent's auto-layout slot order.
   - **Unmapped** → leave the cloned node in place. Apply a Figma annotation `⚠️ unmapped: <reason>` so reviewers see the gap on canvas.
3. After all node replacements: walk the duplicate once more and re-bind every fill, stroke, radius, spacing, text-style, and shadow to its DS library variable id (resolved in step 3). Zero raw values should remain on mapped nodes.

### Step 6 — Visual verify

For each top-level frame in the rebuild, capture a screenshot of the source frame and the rebuilt frame via `mcp__figma-console__figma_take_screenshot`. Save both URIs. Append both to the decisions log so reviewers can diff visually.

### Step 7 — Decisions log

Write the markdown report to the path under "Output." Sections:

1. **Summary** — source URL, page name, granularity, mapped/unmapped/total counts, run timestamp.
2. **Mapping table** — every non-leaf node: source name → DS component + props, or `UNMAPPED`.
3. **Unmapped components** — grouped by guessed component type; usage count per type so the prioritization is obvious (a missing chart used 8 times beats one used once).
4. **Token reconciliation** — should be empty after a successful run; populated only if a future relaxation allows partial-token runs.
5. **Screenshots** — source / rebuild pairs per top-level frame.
6. **Resume instructions** — what to add to the library before a re-run, with concrete next steps.

## Skill file structure

```
.claude/skills/figma-page-to-library/
├── SKILL.md
└── references/
    ├── mapping-rules.md      # name tokenization, fingerprint hash, confidence rules
    └── output-contract.md    # page naming, annotation format, decisions log schema
```

Both reference files start with a table of contents (per best-practice doc, ≥100-line files need one). All references are one level deep from SKILL.md.

### SKILL.md frontmatter (draft)

```yaml
---
name: figma-page-to-library
description: Converts a page or frame from a TimeWorks product Figma file (e.g. Manager dashboard) into a duplicate that uses Design System library components and Tokens Studio variables. Use when the user pastes a Figma URL with intent like "convert this page to the library", "rebuild this in the design system", or "swap to library components". Does not generate code — that is the figma-to-code skill.
---
```

Body skeleton (≤500 lines):

1. Trigger + inputs (≤30 lines)
2. The 7-step checklist (copy-paste block)
3. Step-by-step instructions, one section per step (≤60 lines each)
4. Pointers to `references/mapping-rules.md` and `references/output-contract.md`
5. Definition of done (mirrors the section below)
6. Failure modes table (short — one row per common failure with the fix)

## Definition of done — per run

- Duplicate page exists with correct ` — DS` suffix; original untouched.
- Every fill / stroke / radius / spacing / text style / shadow on every mapped node is bound to a DS library variable id (zero raw values on mapped nodes).
- Every mapped node is a live instance of a DS library component (not a detached clone).
- Every unmapped node carries a Figma annotation explaining why.
- Decisions log is written, includes screenshots, and is committed to git.
- Console run summary states: `mapped: N, unmapped: M, total: N+M, missing tokens: 0`.

## Non-goals

- Not generating React code. `figma-to-code` runs after this, separately.
- Not creating new DS components or tokens. Skill flags gaps; user fills them via `figma-design` or Tokens Studio.
- Not pixel-perfect parity with the source. When library defaults conflict with bespoke styling, library wins — that is the migration goal.
- Not editing the original page. Ever.

## Evaluations

Three baseline scenarios to validate the skill behaves correctly across the freedom spectrum.

1. **Happy path — small frame, all primitives present.**
   Input: a frame containing a header (Text), a Button, an Input, and a Tag — all already named conventionally and using existing tokens.
   Expected: 4/4 mapped, 0 unmapped, 0 missing tokens, ` — DS rebuild` page created with live instances and bound variables.

2. **Token gap — frame uses a hex color absent from the DS palette.**
   Input: a frame with a Card whose background is `#F5F2FF` (no matching DS variable).
   Expected: HARD HALT after step 3. Source node annotated `❌ missing token: #F5F2FF`. Markdown report names the value, the node, and the recommended Tokens Studio path. No duplicate page created.

3. **Component gap — frame uses a custom donut chart.**
   Input: a frame containing a Button, a Stat label, and a custom donut-chart group.
   Expected: Button + Text mapped, donut chart flagged in step 4 layer 3. Duplicate page is created with the chart copied verbatim and annotated `⚠️ unmapped: no library equivalent`. Decisions log lists the chart under "unmapped components" with usage count 1.

Run baseline (no skill) for each scenario first, then re-run with the skill, compare outcomes against the expected behavior.

## Constants — justifications

- **Layer-2 confidence rules (substring OR identical child signature):** Two rules instead of a numeric threshold because Figma node names are short and arbitrary — a similarity score (e.g. 0.7) would either accept too much or too little. Substring catches well-named-but-imperfect cases (`Submit Button` → `Button`); signature catches renamed components. Either is a strong human-checkable signal; both being false is a clear "give up."
- **Hard halt on missing tokens, not warning:** A converted page that silently uses a non-token value will look correct in light mode and break in dark/black. The cost of stopping is minutes in Tokens Studio. The cost of not stopping is a regression that surfaces only during theme QA.
- **Lenient on missing components, not strict:** Building a new DS component is a multi-hour cycle (figma-design + figma-to-code + tests). Blocking a 50-frame page on one missing chart wastes the run. Triage at the end is cheaper.

## Open questions for the implementation plan

- Does `mcp__figma-console__figma_clone_node` operate on whole pages, or only frames? If only frames, page-level runs need a different duplication primitive.
- What is the exact return shape of `mcp__figma-console__figma_get_variables` — does it expose value-to-id lookup, or do we have to build our own index?
- Page-level runs may exceed token budgets on large dashboards; should the skill auto-shard into per-frame runs and stitch the log? Defer to implementation plan.
