# `figma-page-to-library` Skill Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a project-level Claude skill that converts a Figma page or frame from any TimeWorks product file into a duplicate using Design System library components and Tokens Studio variables, with a decisions log of unmappable elements.

**Architecture:** Three markdown files in `.claude/skills/figma-page-to-library/`. SKILL.md is the entry point and stays under 500 lines; two reference files (`mapping-rules.md`, `output-contract.md`) hold the detail-heavy material and are linked one level deep from SKILL.md. Skill drives the existing `mcp__figma-console__*` MCP tool surface — no new code is added to the codebase.

**Tech Stack:** Markdown only (skills are not executable code). Skill consumes `mcp__figma-console__*` tools at runtime.

**Spec reference:** `docs/superpowers/specs/2026-04-30-figma-page-to-library-design.md`

---

## File Structure

| Path | Purpose |
|------|---------|
| `.claude/skills/figma-page-to-library/SKILL.md` | Frontmatter (name + description) and the 7-step workflow with the copy-paste checklist. Entry point loaded when the skill is invoked. |
| `.claude/skills/figma-page-to-library/references/mapping-rules.md` | Layered name → search → flag matching rules, fingerprint hash definition, name-tokenization grammar. Loaded only when the runtime is about to map a node. |
| `.claude/skills/figma-page-to-library/references/output-contract.md` | Page-naming rules, Figma annotation format, decisions-log markdown schema. Loaded only when the runtime is writing output. |

No source code, no tests, no package changes. The skill itself is data.

---

## Task 1: Create skill directory and SKILL.md

**Files:**
- Create: `.claude/skills/figma-page-to-library/SKILL.md`

- [ ] **Step 1: Create the skill directory**

Run:
```bash
mkdir -p .claude/skills/figma-page-to-library/references
```

Expected: directory exists, no errors.

- [ ] **Step 2: Write SKILL.md**

Create `.claude/skills/figma-page-to-library/SKILL.md` with exactly this content:

````markdown
---
name: figma-page-to-library
description: Converts a page or frame from a TimeWorks product Figma file into a duplicate that uses Design System library components and Tokens Studio variables. Reads the source via the figma-console MCP, swaps every fill/stroke/radius/spacing/text-style/shadow to a DS variable, replaces matched elements with live DS component instances, flags anything unmappable with a Figma annotation, and writes a decisions log. Use when the user pastes a Figma URL with intent like "convert this page to the library", "rebuild this in the design system", "swap to library components", or any conversion intent paired with a non-DS Figma URL. Does NOT generate React code — that is the figma-to-code skill, which runs after this one.
---

# figma-page-to-library

Two-step authoring already covers single new components (`figma-design` → `figma-to-code`). This skill closes the remaining gap: existing product pages that were designed before the system stabilized and still carry bespoke values. It produces a Figma rebuild side-by-side with the original so designers and reviewers can diff visually.

## When to invoke

Trigger on any of:

- "convert this page to the library"
- "rebuild this in the design system"
- "swap to library components"
- A `figma.com/design/...` URL paired with conversion intent

Do NOT invoke if:

- The URL points to the Design System file itself (`fileKey == 04x9q7W2Y59baF5MqHAVZR`). That file is the source of truth, not a target. Refuse the run.
- The user is asking for code generation. Hand off to `figma-to-code`.
- The user is starting a brand-new component design. Hand off to `figma-design`.

## Inputs

- A single Figma URL with `node-id`. Parse `fileKey` and `nodeId` (convert `-` to `:` in `nodeId`).
- Auto-detect granularity by resolving the node:
  - Type `PAGE` → page-level run (every top-level frame on the page).
  - Type `FRAME` / `SECTION` / `COMPONENT` → frame-level run.

## Outputs

In the **source file**:

- **Page-level run:** duplicate the page in place; rename to `<original> — DS`.
- **Frame-level run:** create a new page named `<source page> — DS rebuild` containing only the rebuilt frame.

Plus a markdown decisions log at:

```
docs/superpowers/runs/YYYY-MM-DD-<source-file-slug>-<page-name>-conversion.md
```

The original page is never mutated.

## Workflow

Copy this checklist into your TodoWrite list and check items off as you complete them:

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

Extract `fileKey` and `nodeId` from the URL. Convert `-` to `:` in `nodeId`. If `fileKey == 04x9q7W2Y59baF5MqHAVZR`, refuse: tell the user the DS file is the source library and cannot be a conversion target.

Resolve the node via `mcp__figma-console__figma_get_file_data` to determine its type. Record granularity (page vs frame).

### Step 2 — Inventory

Walk the source subtree depth-first via `mcp__figma-console__figma_get_component_for_development_deep`. For each node, record:

- node id, name, type
- fills, strokes, effects (raw values **and** any bound variable id)
- text style (font family, size, weight, line height) **and** any bound text-style id
- auto-layout props (direction, padding, gap, alignment)
- bounds (x, y, w, h)
- child structure signature (a stable hash of child types in order — used in step 4 layer 2)

Output: a flat list of nodes with these fields. This is the **plan** that steps 3–5 validate and execute.

### Step 3 — Reconcile tokens (HARD GATE)

For every raw fill / stroke / radius / spacing / typography / shadow value found in step 2, look up its match in the DS library's variables (matched by **value**, not name — designers may have used a hex literal that happens to equal a token). Resolve via `mcp__figma-console__figma_get_variables` against the DS file (`04x9q7W2Y59baF5MqHAVZR`).

If **any** value has no matching DS variable → halt the run.

On halt:

1. Add a Figma annotation via `mcp__figma-console__figma_set_annotations` on each affected source node, tagged `❌ missing token: <value>`.
2. Write a markdown report listing every missing value, the nodes that use it, and the recommended Tokens Studio path (e.g. `Color Tokens / Light / surface / muted`).
3. Tell the user: "Missing N tokens. Add them via Tokens Studio in Figma, push the export, run `npm run tokens:build`, then re-run the skill."

Why strict: tokens are cheap (minutes in Tokens Studio); a converted page using a non-token value silently breaks dark/black themes and contradicts CLAUDE.md architecture rule #1.

### Step 4 — Map components (layered, lenient)

For each non-leaf node in the inventory, apply layered matching. Detailed rules in `references/mapping-rules.md`. Summary:

1. **Name match** — tokenize the node name, look up exact component name in the DS library, verify variant/size are valid props.
2. **Library search** — miss layer 1 → call `mcp__figma-console__figma_search_components`, accept top hit only on substring or identical child-signature match.
3. **Flag** — miss layer 2 → record in decisions log; node will be copied verbatim with a `⚠️ unmapped` annotation.

Lenient by design: building a new DS component is a multi-hour cycle. Triage at the end is cheaper than blocking the run.

### Step 5 — Duplicate + rebuild

1. Create the rebuild target:
   - **Page-level run:** duplicate the source page in place; rename to `<original> — DS`.
   - **Frame-level run:** create a new page `<source page> — DS rebuild`; clone the source frame into it via `mcp__figma-console__figma_clone_node`.
2. Walk the rebuild target top-down. For each node:
   - **Mapped** → replace with `mcp__figma-console__figma_instantiate_component` using the resolved DS component + props. Preserve position, size, and the parent's auto-layout slot order.
   - **Unmapped** → leave the cloned node in place. Apply a Figma annotation `⚠️ unmapped: <reason>`.
3. Walk the rebuild once more and re-bind every fill, stroke, radius, spacing, text-style, and shadow to its DS variable id. Zero raw values should remain on mapped nodes.

### Step 6 — Visual verify

For each top-level frame in the rebuild, capture a screenshot of the source frame and the rebuilt frame via `mcp__figma-console__figma_take_screenshot`. Save both URIs.

### Step 7 — Write decisions log

Write the markdown report to the path under "Outputs". Schema and conventions are in `references/output-contract.md`. Required sections:

1. **Summary** — source URL, page name, granularity, mapped/unmapped/total counts, run timestamp.
2. **Mapping table** — every non-leaf node: source name → DS component + props, or `UNMAPPED`.
3. **Unmapped components** — grouped by guessed component type, with usage count per type.
4. **Token reconciliation** — should be empty after a successful run.
5. **Screenshots** — source / rebuild pairs.
6. **Resume instructions** — what to add to the library before a re-run.

Commit the log to git.

## Definition of done

- Duplicate page exists with the correct ` — DS` suffix; original untouched.
- Every fill / stroke / radius / spacing / text-style / shadow on every mapped node is bound to a DS library variable id (zero raw values on mapped nodes).
- Every mapped node is a live instance of a DS library component, not a detached clone.
- Every unmapped node carries a Figma annotation explaining why.
- Decisions log written, includes screenshots, committed to git.
- Console summary states: `mapped: N, unmapped: M, total: N+M, missing tokens: 0`.

## Failure modes

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| Skill refuses with "DS file is the source library" | URL points at the DS file | Use a product file URL (Manager dashboard, etc.) |
| Halt at step 3 with missing-tokens report | Raw value with no DS variable equivalent | Add the token in Tokens Studio, push, `npm run tokens:build`, re-run |
| Many layer-3 flags for the same component type | Library is missing that component | Build it via `figma-design` → `figma-to-code`, then re-run |
| Mapped node renders wrong in dark/black after rebuild | A semantic token resolved differently across modes | Inspect the bound variable; reconcile in Tokens Studio |

## References

- Mapping rules and name-tokenization grammar: `references/mapping-rules.md`
- Output contract (page naming, annotation format, log schema): `references/output-contract.md`
- Spec: `docs/superpowers/specs/2026-04-30-figma-page-to-library-design.md`
- Related skills: `figma-design` (upstream component authoring), `figma-to-code` (downstream code generation)
````

- [ ] **Step 3: Verify SKILL.md is under 500 lines and has frontmatter**

Run:
```bash
wc -l .claude/skills/figma-page-to-library/SKILL.md
head -3 .claude/skills/figma-page-to-library/SKILL.md
```

Expected: line count under 500; first three lines show `---`, `name: figma-page-to-library`, `description: ...`.

- [ ] **Step 4: Commit**

Run:
```bash
git add .claude/skills/figma-page-to-library/SKILL.md
git commit -m "feat(skills): add figma-page-to-library SKILL.md entry point

Adds the entry point for the figma-page-to-library skill: parses a Figma URL, runs a 7-step conversion pipeline (parse → inventory → reconcile tokens → map components → duplicate + rebuild → screenshot → log), and refuses to run against the Design System file itself. References to mapping-rules.md and output-contract.md are added in subsequent tasks."
```

Note: `git init` may need to run first if this directory isn't a repo yet. Skip the commit step if `git status` reports `not a git repository`.

---

## Task 2: Write `references/mapping-rules.md`

**Files:**
- Create: `.claude/skills/figma-page-to-library/references/mapping-rules.md`

- [ ] **Step 1: Write mapping-rules.md**

Create `.claude/skills/figma-page-to-library/references/mapping-rules.md` with exactly this content:

````markdown
# Mapping rules

How the skill decides which DS library component a source Figma node maps to.

## Contents

- Name tokenization grammar
- Layer 1: exact name match
- Layer 2: library search with confidence rules
- Layer 3: flag for triage
- Child structure signature
- Worked examples

## Name tokenization grammar

Source node names follow the convention `Component / Variant / Size` with optional further `/ Modifier` segments. Tokenizer rules:

1. Split on ` / ` (space-slash-space).
2. First segment = component name. Compare case-insensitively to DS library component names.
3. Second segment (if present) = variant. Compare case-insensitively to the component's `variant` prop values.
4. Third segment (if present) = size. Compare case-insensitively to the component's `size` prop values.
5. Further segments = modifiers; mapped to boolean props by exact name match (e.g. `Loading`, `Disabled`, `Icon-only`).

If the name does not contain ` / `, treat the entire name as the component name and no variant/size.

## Layer 1: exact name match

After tokenization, the layer succeeds iff:

- The component name matches a DS library component exactly (case-insensitive).
- Every parsed variant / size / modifier resolves to a valid prop value on that component.

If any prop is invalid → fall through to layer 2 (do not partially map).

## Layer 2: library search

Run `mcp__figma-console__figma_search_components` with the source node's tokenized component name as the query. Inspect the top result. Accept it iff **at least one** of these confidence rules holds:

- **Substring rule:** the library component name is a case-insensitive substring of the source node name (e.g. source `Submit Button` matches library `Button`).
- **Signature rule:** the library component's child structure signature equals the source node's signature exactly.

Both rules require zero ambiguity — they are designed to produce false negatives, not false positives. A miss is cheap (flag and continue); a wrong map silently corrupts the rebuild.

If neither rule holds → fall through to layer 3.

## Layer 3: flag

Record the node in the decisions log under "unmapped components" with:

- node id
- node name
- inferred component-type guess (the first segment of the name, or `unknown` if the name has no segments)
- bounds (x, y, w, h)
- reason: `no-name-match` | `name-match-invalid-props` | `search-low-confidence`

The node is copied verbatim into the rebuild and tagged with `⚠️ unmapped: <reason>` via `mcp__figma-console__figma_set_annotations`.

## Child structure signature

Used by layer 2's signature rule and recorded in the inventory step.

Definition: a deterministic string built from the immediate children of a node, of the form:

```
<count>:<type1>,<type2>,...
```

Where `<count>` is the integer child count and `<typeN>` is the Figma node type (e.g. `TEXT`, `RECTANGLE`, `INSTANCE`, `FRAME`), in the order children appear in the parent's auto-layout flow.

Example: a node with two text children and one icon child renders as `3:TEXT,TEXT,INSTANCE`.

The signature is intentionally shallow (one level). Going deeper produces too many false negatives because the DS library may decompose internals differently than the source.

## Worked examples

### Example 1 — clean layer-1 hit

Source node name: `Button / Primary / Md`
Tokenization: component=`Button`, variant=`Primary`, size=`Md`
DS library has `Button` with `variant: "primary" | "secondary" | ...` and `size: "sm" | "md" | "lg"`.
Both props valid (case-insensitive) → **layer 1 mapped**, instantiate `Button` with `{variant: "primary", size: "md"}`.

### Example 2 — layer-1 miss, layer-2 substring hit

Source node name: `Submit Button`
Tokenization: component=`Submit Button` (no slash).
DS library has no `Submit Button`. Search returns top hit `Button`.
Substring rule: `button` is a case-insensitive substring of `submit button` → **layer 2 mapped** with default props.

### Example 3 — layer-2 signature hit

Source node name: `CTA`
DS library has no `CTA`. Search returns top hit `Button`.
Substring rule: `button` is not a substring of `cta` → fails.
Signature rule: source children `[TEXT]`, library `Button` children `[TEXT]` → both `1:TEXT` → **layer 2 mapped**.

### Example 4 — layer-3 flag

Source node name: `Donut Chart`
DS library has no `Donut Chart`. Search returns top hit `Pagination` (low relevance, just the closest in the index).
Substring rule: `pagination` not in `donut chart` → fails.
Signature rule: source has 4 path children, library `Pagination` has 5 instance children → fails.
→ **layer 3 flagged**, copied verbatim with `⚠️ unmapped: search-low-confidence`.
````

- [ ] **Step 2: Verify the file exists and has a TOC**

Run:
```bash
head -12 .claude/skills/figma-page-to-library/references/mapping-rules.md
```

Expected: file shows a `## Contents` section listing six bullet points, before any other H2.

- [ ] **Step 3: Commit**

Run:
```bash
git add .claude/skills/figma-page-to-library/references/mapping-rules.md
git commit -m "feat(skills): add mapping rules reference for figma-page-to-library

Defines the layered name → search → flag matching algorithm with worked examples. Layer 1 does an exact name + props match against the DS library; layer 2 falls back to figma_search_components with substring or child-signature confidence rules; layer 3 flags the node for triage in the decisions log."
```

---

## Task 3: Write `references/output-contract.md`

**Files:**
- Create: `.claude/skills/figma-page-to-library/references/output-contract.md`

- [ ] **Step 1: Write output-contract.md**

Create `.claude/skills/figma-page-to-library/references/output-contract.md` with exactly this content:

````markdown
# Output contract

Naming, annotation, and log conventions the skill must follow so the rebuild is reviewable side-by-side with the original.

## Contents

- Page naming
- Figma annotation format
- Decisions log path
- Decisions log schema
- Console run summary

## Page naming

- **Page-level run.** Duplicate the source page in place. Rename the duplicate to `<original> — DS`. Use an em-dash (` — `, U+2014 surrounded by spaces), not a hyphen, so the suffix sorts adjacent to the original in the page list.
- **Frame-level run.** Create a new page named `<source page> — DS rebuild`. Place only the rebuilt frame in it. Do not place loose nodes outside a frame on the new page.

If the suffixed name already exists (re-run), append ` (N)` where N is the smallest positive integer that produces an unused name. Do not silently overwrite.

## Figma annotation format

Annotations are added via `mcp__figma-console__figma_set_annotations`.

- **Missing token (step 3, on the source node before halt):**
  - Label: `❌ missing token`
  - Body: `value: <raw value>; recommended path: <Tokens Studio path>`
- **Unmapped node (step 5, on the cloned node in the rebuild):**
  - Label: `⚠️ unmapped`
  - Body: `reason: <reason code>; guessed: <component-type guess>`

Reason codes: `no-name-match`, `name-match-invalid-props`, `search-low-confidence`.

## Decisions log path

```
docs/superpowers/runs/YYYY-MM-DD-<source-file-slug>-<page-name>-conversion.md
```

- `YYYY-MM-DD` is the run start date in UTC.
- `<source-file-slug>` is the source file's name lower-cased, with non-alphanumeric characters replaced by `-`, collapsed runs of `-` reduced to one, and leading/trailing `-` stripped.
- `<page-name>` is the source page's name with the same slug treatment.

If the path collides on re-run, suffix the file with `-2`, `-3`, etc. before `.md`.

## Decisions log schema

Required sections, in order:

```markdown
# Conversion: <source page name>

## Summary

- Source: <full Figma URL>
- File: <source file name> (`<fileKey>`)
- Page: <page name>
- Granularity: page | frame
- Mapped: N
- Unmapped: M
- Total non-leaf nodes: N + M
- Missing tokens: 0
- Run started: <ISO 8601 timestamp>
- Run completed: <ISO 8601 timestamp>

## Mapping table

| Source node | Source name | DS component | Props | Layer | Status |
|-------------|-------------|--------------|-------|-------|--------|
| <id>        | <name>      | <component>  | <json> | 1/2 | mapped |
| <id>        | <name>      | —            | —     | 3   | UNMAPPED |

## Unmapped components

Grouped by inferred component-type guess. One subsection per guess, sorted by usage count descending.

### <type guess> (used N times)

- <id> — <name> — reason: <code>
- ...

## Token reconciliation

Empty after a successful run. Populated only when the run halted at step 3 (in which case the rebuild is not produced and most other sections are absent).

## Screenshots

One subsection per top-level frame in the rebuild.

### <frame name>

- Source: <screenshot URI>
- Rebuild: <screenshot URI>

## Resume instructions

Concrete next steps the user should take before re-running, based on what was unmapped or missing. If everything mapped, this section reads "No follow-up — rebuild is complete."
```

## Console run summary

After the run, print a single line to the user:

```
mapped: N, unmapped: M, total: N+M, missing tokens: 0 — log: <path to log>
```

If the run halted at step 3, print instead:

```
HALTED at token reconciliation: K missing tokens — log: <path to log>
```
````

- [ ] **Step 2: Verify the file exists and has a TOC**

Run:
```bash
head -12 .claude/skills/figma-page-to-library/references/output-contract.md
```

Expected: file shows a `## Contents` section listing five bullet points, before any other H2.

- [ ] **Step 3: Commit**

Run:
```bash
git add .claude/skills/figma-page-to-library/references/output-contract.md
git commit -m "feat(skills): add output contract reference for figma-page-to-library

Locks down page naming (em-dash suffix, collision handling), Figma annotation labels and bodies for missing tokens and unmapped nodes, the decisions-log filename rules with slug treatment, the required log sections in order, and the one-line console summary printed at the end of every run."
```

---

## Task 4: Verify skill is discoverable

**Files:** none (verification only)

- [ ] **Step 1: Confirm directory layout**

Run:
```bash
find .claude/skills/figma-page-to-library -type f | sort
```

Expected output:
```
.claude/skills/figma-page-to-library/SKILL.md
.claude/skills/figma-page-to-library/references/mapping-rules.md
.claude/skills/figma-page-to-library/references/output-contract.md
```

- [ ] **Step 2: Confirm frontmatter parses**

Run:
```bash
awk '/^---$/{c++; next} c==1' .claude/skills/figma-page-to-library/SKILL.md | head -3
```

Expected: outputs the `name:` line followed by the `description:` line. No errors.

- [ ] **Step 3: Confirm references are reachable from SKILL.md**

Run:
```bash
grep -E "references/(mapping-rules|output-contract)\.md" .claude/skills/figma-page-to-library/SKILL.md
```

Expected: at least two matches — one per reference file. This confirms the one-level-deep linking pattern from the best-practice doc.

- [ ] **Step 4: Confirm no nested references**

Run:
```bash
grep -E "\[.*\]\(.*\.md\)" .claude/skills/figma-page-to-library/references/*.md || echo "no nested links — good"
```

Expected: prints `no nested links — good`. If references link to other reference files, flatten them per the best-practice "one level deep" rule.

---

## Self-Review Checklist

- [x] Spec section "Trigger" → Task 1 SKILL.md "When to invoke"
- [x] Spec section "Inputs" → Task 1 SKILL.md "Inputs"
- [x] Spec section "Output" → Task 1 SKILL.md "Outputs" + Task 3 page-naming rules
- [x] Spec pipeline 7 steps → Task 1 SKILL.md "Workflow" with all 7 steps
- [x] Spec "Step 3 hard gate" → Task 1 SKILL.md step 3 with halt + annotation + report
- [x] Spec "Step 4 layered match" → Task 1 SKILL.md step 4 + Task 2 detailed rules
- [x] Spec "Skill file structure" → matches Tasks 1–3 file layout exactly
- [x] Spec "Definition of done" → Task 1 SKILL.md "Definition of done"
- [x] Spec "Constants — justifications" → Task 2 mapping-rules layer-2 confidence rules with rationale
- [x] Best-practice "≤500 lines, references one level deep" → Task 4 step 3+4 verifies
- [x] Best-practice "TOC on ≥100-line references" → Tasks 2 and 3 include `## Contents`
- [x] Best-practice "fully qualified MCP names" → all references use `mcp__figma-console__*`

No placeholders. No TBDs. All file contents are written verbatim into the plan.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-04-30-figma-page-to-library.md`. Two execution options:

1. **Subagent-Driven (recommended)** — dispatch a fresh subagent per task, review between tasks, fast iteration.
2. **Inline Execution** — execute tasks in this session using executing-plans, batch execution with checkpoints.

Which approach?
