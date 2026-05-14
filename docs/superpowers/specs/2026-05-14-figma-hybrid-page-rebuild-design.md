# `figma-hybrid-page-rebuild` — design spec

**Date:** 2026-05-14
**Status:** brainstorm complete, ready for `writing-plans`
**Source session:** `docs/superpowers/runs/2026-05-14-tw-ds-experiment-employee-view-dashboard-conversion.md`
**Sibling skill:** `.claude/skills/figma-page-to-library/`

---

## 1. Identity & scope

**Skill name:** `figma-hybrid-page-rebuild`

**What it does.** Rebuilds a TimeWorks product page against a fixed design-system template (the canonical `Mockup w/ Sidebar — Expanded` frame, node `25730:16658` in the DS Experiment file `gqYWCu1K6dJ9gESXtgNeCi`) by:

1. Cloning the template at the source's position.
2. Keeping the template's chrome (Sidebar, Header, Toolbar, Date-range strip, stat-tile pattern).
3. Replacing the template's reference body content (Activity Timeline, Bottom Containers, Screenshots Container) with the source's unique sections (e.g. Meetings, 24-tile Screenshots grid, 2-large-cards row).
4. Patching every template text slot with the corresponding source value via a static slot-recipe map.
5. Running three cleanup passes: token-binding, known-pattern DS-component swap, card-border.
6. Holding before declaring done — a user visual-confirm checkpoint with `y` / `fix` / `revert` options.

**When to use.** User shares one Figma URL of a TimeWorks product page and uses a reference verb: *"use the design system"*, *"match the template"*, *"rebuild from the DS"*, *"convert to the design system"*.

**When NOT to use.**
- User wants in-place token-binding without structural rebuild → use `figma-page-to-library`.
- User wants to design a new component → `figma-design`.
- User wants React code → `figma-to-code`.
- User supplies TWO URLs intending a custom (non-fixed) reference → out of scope for v1; the template is fixed.

**Relationship to existing skills.** Sibling to `figma-page-to-library`. Does NOT replace it. Reuses `ds-config.json`, `component-map.json`, `icon-map.json` from the sibling's folder (shared, not duplicated).

---

## 2. Configuration & inputs

The skill ships its own folder at `.claude/skills/figma-hybrid-page-rebuild/` with three new config files.

### `template-config.json`

```json
{
  "templateFileKey": "gqYWCu1K6dJ9gESXtgNeCi",
  "templateNodeId": "25730:16658",
  "templateName": "Mockup w/ Sidebar — Expanded",
  "bodyContainerPath": ["Main Container", "Frame 1707485093", "Frame 1707484991"],
  "preserveBodyChildren": ["Frame 1707484994"],
  "replaceableBodyChildren": ["Activity Timeline", "Bottom Containers", "Screenshots Container"]
}
```

- `templateFileKey` / `templateNodeId` — fixed canonical template.
- `bodyContainerPath` — name-path from the template root down to the frame whose children get replaced.
- `preserveBodyChildren` — children of the body container the skill MUST keep (the stat-tiles row, whose values come from source via the slot map).
- `replaceableBodyChildren` — children of the body container the skill removes before inserting source's unique sections.

### `slot-map.json`

One entry per patchable text node in the template, keyed by a stable name-path. Each `from` recipe describes how to find the value in the source.

```json
{
  "Date Range Selector > User Info Container > User Name": {
    "from": { "kind": "sourceText", "where": "main column > title row", "pick": "largest" }
  },
  "Frame 1707484992 > Activity Title": {
    "from": { "kind": "sourceText", "where": "main column > stat-cards row > card 1", "pick": "smallest" }
  },
  "Frame 1707484992 > Activity Value": {
    "from": { "kind": "sourceText", "where": "main column > stat-cards row > card 1", "pick": "largest" }
  }
  // … one row per stat card (2/3/4) and any other slot
}
```

Three `kind` values supported:
- `sourceText` — pull from a source text node located via name-path + a `pick` rule (`largest` / `smallest` / `nth:0`).
- `literal` — use the static string given.
- `keep` — leave the template's existing string alone.

Unresolved slots log `slot unresolved` and fall back to the template's existing placeholder; never halt.

### `pattern-swaps.json`

Growable detector list for known-shape → DS-component swaps.

```json
{
  "Linear Progress Bar": {
    "dsComponent": "Linear Progress Bar",
    "variantPath": "Type=Primary, Size=Small, Label=Off",
    "detector": {
      "kind": "track-and-fill",
      "containerType": ["GROUP", "FRAME"],
      "maxHeight": 10,
      "childCount": 2,
      "childTypes": ["RECTANGLE", "VECTOR"],
      "fillIsSmallerSibling": true
    },
    "props": {
      "Percentage": { "from": "computed:fillWidth/trackWidth*100 + '%'" }
    },
    "preservePositionAndSize": true
  }
}
```

v1 ships with `Linear Progress Bar` only. Future patterns (Divider, Badge / dot indicator) get added by editing this file — no SKILL.md change.

### Reused from `figma-page-to-library/`

- `ds-config.json` — DS file key.
- `component-map.json` — for pattern-swap target lookup.
- `icon-map.json` — for future icon-swap patterns.

---

## 3. Workflow (10 steps)

1. **Connection check.** `figma_get_status`. Confirm the DS Experiment file (`templateFileKey`) is open. Halt with a specific message if not.
2. **Parse source URL.** Extract `sourceFileKey` + `sourceNodeId`. If different from `templateFileKey`, `figma_navigate` to it.
3. **Inspect source target.** `figma_execute` walker returns the source root's `wrapper > main column` children. Halt if shape is unfamiliar (no `main column` child found).
4. **Backup the source.** Clone source target to `Backup - <source name>` on the same page at `(source.x + source.width + 200, source.y)`. **Hard pre-condition** — halt if backup fails.
5. **Clone the template.** Clone `templateNodeId`, place at source's `(x, y)`, rename to source's original name. Don't delete source yet.
6. **Identify source unique sections + confirm.** Compute a signature for each `main column` child, candidate-match against `replaceableBodyChildren`, then `AskUserQuestion` once with the bring/drop list.
7. **Insert source unique sections.** Clone each bring-section from the *backup* (the safety net), append to the template's body container, in source's original order. Remove the `replaceableBodyChildren`.
8. **Patch text slots.** Read `slot-map.json`, resolve each `from` recipe against source, write into the new clone. Log unresolved slots.
9. **Run three cleanup passes** (order matters):
   - **(a) Pattern-swap pass** — walk the new dashboard, evaluate each detector in `pattern-swaps.json`, first-match wins. Replaces raw shapes with DS instances (e.g. 40 progress bars in this session's run).
   - **(b) Token-binding pass** — bind every raw SOLID fill/stroke → nearest DS color var, every non-zero radius → nearest space var, every TEXT without `textStyleId` → nearest DS text style. Skip remote-instance internals. Run a second sub-pass for instance overrides.
   - **(c) Card-border pass** — see Section 4.
10. **Delete source + exit gate.** Remove the original source. Run audit: C1 inserted ≥1 section, C2 zero leaks, C3 zero unbordered cards, C4 zero unswapped pattern matches. If all four pass, ask user `y / fix / revert`. If user says `y`, write report; `fix`, iterate; `revert`, restore backup.

---

## 4. Card-border pass (detailed)

Walks the new dashboard, gives every card-shaped frame a 1px stroke bound to `layout-border-color`, `strokeAlign=INSIDE`. Idempotent — re-running adds nothing.

**Card predicate** (all six must be true):

1. `node.type === "FRAME"`.
2. Has a visible SOLID fill.
3. Has at least one non-zero corner radius.
4. Is NOT inside an `INSTANCE` (walks ancestor chain).
5. `node.width < dashboardWidth * 0.95`.
6. No name (or ancestor name) matches the blocklist (case-insensitive substring):
   ```
   ["dashboard", "header", "toolbar", "wrapper", "main container",
    "background blobs", "sidebar", "frame 1707485095"]
   ```
7. (Idempotency guard) Has no existing stroke (`node.strokes.length === 0`).

**Stroke applied:**

```js
let stroke = { type: "SOLID", color: { r: 0.85, g: 0.85, b: 0.85 } };
stroke = figma.variables.setBoundVariableForPaint(stroke, "color", layoutBorderVar);
node.strokes = [stroke];
node.strokeWeight = 1;
if ("strokeAlign" in node) node.strokeAlign = "INSIDE";
```

`layoutBorderVar` resolved once at pass start via the Color Tokens collection lookup.

**Output:** `{ borderedCount, skippedByPredicate, skippedByName, skippedByWidth }` for the report.

---

## 5. Known-pattern DS-component swap pass

Inserted as a pass between step 7 (insert source sections) and step 9b (token-binding). Runs *before* token-binding so the pattern detector sees raw source shapes.

**Pass logic (per detector in `pattern-swaps.json`):**

1. Walk new dashboard, skip descendants of any `INSTANCE`.
2. Evaluate detector against each non-instance node. First match wins.
3. On match: resolve target component via `component-map.json` + variant lookup against `variantPath`. Create instance, insert at source node's parent index, resize to source bounds (respecting min height), apply `props` mapping, remove source node.
4. Log `{ patternName, swappedNodeId, dsInstanceId, computedProps }`.

**v1 detector — Linear Progress Bar:**

| Aspect | Spec |
|---|---|
| Detector kind | `track-and-fill` |
| Container types | `GROUP`, `FRAME` |
| Container max height | 10px |
| Container child count | exactly 2 |
| Child types | `RECTANGLE`, `VECTOR` |
| Fill is smaller sibling | true |
| DS target | `Linear Progress Bar` (id `46946:16381`) |
| Variant | `Type=Primary, Size=Small, Label=Off` (id `46946:16402`) |
| Props | `Percentage` ← `computed:fillWidth/trackWidth*100 + '%'` |

**Future patterns (design intent only, NOT in v1 detector JSON):**

| Pattern | Detector summary | DS component |
|---|---|---|
| Divider | Single RECTANGLE/LINE, height ≤2, width ≥80, name hint | `Divider / Orientation=horizontal` |
| Badge / dot indicator | ELLIPSE w=h ≤12px, single SOLID fill | `.Base Badge / Type=indicator` |

Adding a new pattern is config-only — edit `pattern-swaps.json`, run skill.

**Failure modes:**
- Pattern matched but DS component not in `component-map.json` → log warning, skip.
- Pattern matched but `variantPath` not found in COMPONENT_SET → log warning, instantiate default variant.
- False-positive detection → user can `revert` at the step-10 exit gate.

---

## 6. Verification & report

### Exit-gate checks

| Check | What it verifies | Pass condition |
|---|---|---|
| **C1** | Structural change happened | `insertedSourceSectionCount >= 1` |
| **C2** | No raw values | `leakCount == 0` |
| **C3** | All cards bordered | `unborderedCardCount == 0` |
| **C4** | All pattern matches swapped | `unswappedPatternMatches == 0` |
| **C5** | User visually approves | Final `AskUserQuestion` returns `y` |

All five must pass to declare success. C1–C4 must pass before C5 is even asked.

### Visual-confirm prompt (exact wording)

> Rebuild done. **C1**: inserted `<N>` source sections. **C2**: 0 raw-value leaks. **C3**: `<M>` cards bordered. **C4**: `<K>` pattern swaps applied. Please look at `<frame name>` (node `<id>`) in Figma and pick: `y` (looks right, write report), `fix` (describe what's wrong), `revert` (delete the new frame, restore the backup).

### Behaviour by user response

- `y` → write full report at `docs/superpowers/runs/YYYY-MM-DD-<source-file-slug>-<source-page-slug>-hybrid-rebuild.md`, run ends.
- `fix` → user describes the issue, skill iterates in-session, re-runs C1–C4, re-asks C5.
- `revert` → delete the new frame, restore backup to source's `(x, y)` and original name, write `-reverted.md` short report, exit.

### Report sections

1. Header (file, source URL, target, template, mode=hybrid, backup, date).
2. Approach (one paragraph for the designer).
3. Sections brought from source.
4. Template sections removed.
5. Text slots patched (table; unresolved slots flagged `⚠️`).
6. Pattern swaps applied (table by pattern, count, sample computed props).
7. Token-bindings applied (counts).
8. Card borders applied (count + exclusion-filter transparency).
9. Raw-value leaks (always present; `✓ No raw values detected.` if zero).
10. Exit gate (C1–C5 pass/fail + user's verbatim C5 response).
11. Backup (name, node id, instruction to delete when confident).
12. Notes for the designer (auto-generated callouts).

### Graceful screenshot failure

`figma_take_screenshot` REST returns `403 Invalid token` for some users. On 403: swallow the error, set a `visual validation skipped` flag in the report, continue. No retries, no fallbacks. Section 9 of the report says `metadata-only run` instead of listing image URIs.

---

## 7. File layout, trigger, and migration

### File layout

```
.claude/skills/figma-hybrid-page-rebuild/
├── SKILL.md                # 10-step workflow + rules from sections 1–6
├── template-config.json    # NEW
├── slot-map.json           # NEW
├── pattern-swaps.json      # NEW
└── README.md               # one-paragraph orientation
```

Shared (not duplicated) from `.claude/skills/figma-page-to-library/`:
- `ds-config.json`
- `component-map.json`
- `icon-map.json`

### SKILL.md frontmatter

```yaml
---
name: figma-hybrid-page-rebuild
description: Use when the user shares a single Figma URL of a TimeWorks product page and asks to "use the design system", "match the template", "rebuild from the DS", "convert to the design system", or similar — any reference verb plus a single page URL. Rebuilds the page against the fixed canonical template (Mockup w/ Sidebar — Expanded, hardcoded in template-config.json) by keeping the template's Sidebar/Header/Toolbar/Date-range/stat-tile chrome and inserting the source's unique body sections. Always runs a slot-patch from source text, token-binding, pattern-swap (Linear Progress Bar etc.), and card-border pass. Does NOT support a user-supplied reference URL (use figma-page-to-library for those cases) and does NOT generate React code (figma-to-code for that).
---
```

### Migration plan

1. **Spec** — this document (committed).
2. **Plan** — `superpowers:writing-plans` turns spec into numbered implementation checklist.
3. **Build the configs first** — `template-config.json`, `slot-map.json`, `pattern-swaps.json`. Validate each resolves correctly against the live DS file.
4. **Build SKILL.md** — lift the 10-step workflow; reuse this session's proven `figma_execute` payloads (binder, audit, card-border, pattern-swap).
5. **Idempotency dry-run** — re-run the skill against the same source URL converted in this session. Expected: skill detects "already converted", exits with no mutation.
6. **Real test** — pick one source page in the DS file that hasn't been touched, run end-to-end.
7. **Update `MEMORY.md`** with a pointer to the new skill.
8. **Leave `figma-page-to-library` alone** — sibling, not replacement.

---

## Lessons encoded (from the source session)

For traceability, the eight session lessons that became spec requirements:

| # | Lesson | Where encoded |
|---|---|---|
| 1 | Clarify intent upfront | Section 1 (scope) + Section 3 step 6 (confirm bring/drop list) |
| 2 | Token-binding alone is a failure if nothing visually changes | Section 6 exit gate C1 (structural change required) |
| 3 | Hybrid rule — ref chrome + source unique content | Section 3 steps 5–7 + Section 2 `template-config.json` |
| 4 | Cards with fill+radius get a 1px stroke bound to `layout-border-color` | Section 4 (card-border pass) |
| 5 | Wrapper-frame exclusion list for the border pass | Section 4 predicate #5 + #6 |
| 6 | Preserve source's side-overlay frames as page-level neighbors | Removed from scope per Q7 ("don't need this") — skill ignores everything outside `main column` |
| 7 | REST screenshot 403 fallback | Section 6 graceful screenshot failure |
| 8 | Explicit backup-first contract | Section 3 step 4 (hard pre-condition) |
| 9 (new) | Linear Progress Bar pattern swap | Section 5 v1 detector |
| 10 (new) | User visual confirm gate | Section 6 exit gate C5 |
