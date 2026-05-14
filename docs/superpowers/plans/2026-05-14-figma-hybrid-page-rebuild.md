# figma-hybrid-page-rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a new project skill `figma-hybrid-page-rebuild` that rebuilds a TimeWorks product page against the fixed DS template (Mockup w/ Sidebar — Expanded), inserts source's unique body sections, patches text slots from source, and runs three cleanup passes (pattern-swap, token-binding, card-border) before a user visual-confirm exit gate.

**Architecture:** Markdown skill body (`SKILL.md`) + three JSON config files (`template-config.json`, `slot-map.json`, `pattern-swaps.json`) + one README. Reads (does not duplicate) three sibling configs from `.claude/skills/figma-page-to-library/`. All Figma I/O via `mcp__figma-console__*` Plugin API only — no REST, no Team Library indexing. Proven `figma_execute` payloads from the source session (`docs/superpowers/runs/2026-05-14-tw-ds-experiment-employee-view-dashboard-conversion.md`) are lifted directly into SKILL.md, not rewritten.

**Tech Stack:**
- Markdown for SKILL.md.
- JSON for the three config files.
- `mcp__figma-console__figma_execute` for all Figma reads/writes (Plugin API).
- `mcp__figma-console__figma_get_status` for connection probes.
- Shell (`node -e`, `jq`) for static JSON validity checks.
- Source verification against live Figma file `gqYWCu1K6dJ9gESXtgNeCi` ("TimeWorks Design System (Experiment)") which must be open in Figma Desktop.

**Spec:** `docs/superpowers/specs/2026-05-14-figma-hybrid-page-rebuild-design.md`

---

## File structure

Files this plan creates:

| File | Responsibility |
|---|---|
| `.claude/skills/figma-hybrid-page-rebuild/SKILL.md` | The 10-step workflow + all rules from spec sections 1–6. |
| `.claude/skills/figma-hybrid-page-rebuild/template-config.json` | Fixed template metadata (file key, node id, body container path, body-children lists). |
| `.claude/skills/figma-hybrid-page-rebuild/slot-map.json` | Source → template text-slot recipes. |
| `.claude/skills/figma-hybrid-page-rebuild/pattern-swaps.json` | Detectors for known shapes that should become DS instances. v1: Linear Progress Bar only. |
| `.claude/skills/figma-hybrid-page-rebuild/README.md` | One-paragraph orientation pointing into SKILL.md. |

Files this plan modifies:

| File | Why |
|---|---|
| `/Users/MiggleWork/.claude/projects/-Users-MiggleWork-Downloads-Timeworks/memory/MEMORY.md` | Add pointer to the new skill. |
| `/Users/MiggleWork/.claude/projects/-Users-MiggleWork-Downloads-Timeworks/memory/figma_hybrid_page_rebuild.md` (new) | Memory file with skill summary. |

Files this plan reads (never modifies):

- `.claude/skills/figma-page-to-library/ds-config.json` — DS file key reference.
- `.claude/skills/figma-page-to-library/component-map.json` — DS component lookup (used by pattern-swap pass).
- `.claude/skills/figma-page-to-library/icon-map.json` — Icon lookup (reserved for future patterns).
- `docs/superpowers/specs/2026-05-14-figma-hybrid-page-rebuild-design.md` — the spec being implemented.
- `docs/superpowers/runs/2026-05-14-tw-ds-experiment-employee-view-dashboard-conversion.md` — source session whose payloads are lifted.

---

## Pre-conditions

Before executing this plan:

- Figma Desktop is running.
- The DS Experiment file (`gqYWCu1K6dJ9gESXtgNeCi`, "TimeWorks Design System (Experiment)") is open.
- The figma-console MCP bridge plugin is running in Figma Desktop.
- The user's current branch is **not** `main` (current branch from session start: `figma-page-to-library-experiment-retarget`, which is acceptable).

---

## Task 0: Pre-flight + skill folder

**Files:**
- Create: `.claude/skills/figma-hybrid-page-rebuild/` (directory)

- [ ] **Step 1: Verify Figma bridge is up**

Run: `mcp__figma-console__figma_get_status` with `probe: true`.
Expected: `setup.valid === true`, `connectedFile.fileKey === "gqYWCu1K6dJ9gESXtgNeCi"`. If not, halt and ask the user to open the DS Experiment file in Figma Desktop.

- [ ] **Step 2: Create skill directory**

Run: `mkdir -p /Users/MiggleWork/Downloads/Timeworks/.claude/skills/figma-hybrid-page-rebuild`
Expected: no output, directory exists.

- [ ] **Step 3: Verify sibling configs exist**

Run:
```bash
ls -la /Users/MiggleWork/Downloads/Timeworks/.claude/skills/figma-page-to-library/{ds-config.json,component-map.json,icon-map.json}
```
Expected: all three files listed with non-zero size. If any are missing, halt — the new skill cannot run without them.

- [ ] **Step 4: Commit the empty folder marker**

Skip commit at this stage — git doesn't track empty directories. The folder will be committed in Task 1 when README is added.

---

## Task 1: README + SKILL.md frontmatter

**Files:**
- Create: `.claude/skills/figma-hybrid-page-rebuild/README.md`
- Create: `.claude/skills/figma-hybrid-page-rebuild/SKILL.md` (frontmatter only — body in Tasks 5–9)

- [ ] **Step 1: Write README.md**

Path: `.claude/skills/figma-hybrid-page-rebuild/README.md`

```markdown
# figma-hybrid-page-rebuild

Rebuilds a TimeWorks product page against the fixed DS template (`Mockup w/ Sidebar — Expanded`, node `25730:16658` in the Experiment file). Keeps the template's chrome — Sidebar, Header, Toolbar, Date-range strip, stat-tile pattern — and inserts the source's unique body sections in place of the template's reference body content. Patches every template text slot from source via `slot-map.json`, then runs three cleanup passes (pattern-swap, token-binding, card-border) before a user visual-confirm exit gate.

**Read `SKILL.md` for the full workflow.** Sibling skill at `../figma-page-to-library/` holds the shared configs (`ds-config.json`, `component-map.json`, `icon-map.json`) this skill reads but does not duplicate.

**Triggers on:** any reference verb ("use the DS", "match the template", "rebuild from the DS") plus a single Figma URL.

**Does NOT support:** user-supplied alternative reference URLs (use `figma-page-to-library` instead) or React code generation (use `figma-to-code`).
```

- [ ] **Step 2: Write SKILL.md frontmatter and table of contents**

Path: `.claude/skills/figma-hybrid-page-rebuild/SKILL.md`

```markdown
---
name: figma-hybrid-page-rebuild
description: Use when the user shares a single Figma URL of a TimeWorks product page and asks to "use the design system", "match the template", "rebuild from the DS", "convert to the design system", or similar — any reference verb plus a single page URL. Rebuilds the page against the fixed canonical template (Mockup w/ Sidebar — Expanded, hardcoded in template-config.json) by keeping the template's Sidebar/Header/Toolbar/Date-range/stat-tile chrome and inserting the source's unique body sections. Always runs a slot-patch from source text, token-binding, pattern-swap (Linear Progress Bar etc.), and card-border pass. Does NOT support a user-supplied reference URL (use figma-page-to-library for those cases) and does NOT generate React code (figma-to-code for that).
---

# figma-hybrid-page-rebuild

<!-- Body written in Tasks 5–9. Section anchors used by the cross-refs: -->
<!--   ## Required tools -->
<!--   ## Core rules -->
<!--   ## Workflow -->
<!--   ### 1. Connection check -->
<!--   ### 2. Parse source URL -->
<!--   ### 3. Inspect source target -->
<!--   ### 4. Backup the source -->
<!--   ### 5. Clone the template -->
<!--   ### 6. Identify source unique sections -->
<!--   ### 7. Insert source unique sections -->
<!--   ### 8. Patch text slots -->
<!--   ### 9. Cleanup passes -->
<!--   ### 10. Delete source + exit gate -->
<!--   ## Failure modes -->
<!--   ## When NOT to use this skill -->
```

- [ ] **Step 3: Verify frontmatter parses**

Run:
```bash
head -5 /Users/MiggleWork/Downloads/Timeworks/.claude/skills/figma-hybrid-page-rebuild/SKILL.md
```
Expected: first line is `---`, second line is `name: figma-hybrid-page-rebuild`, third line starts with `description:`, frontmatter closes with `---`.

Also run:
```bash
ls -la /Users/MiggleWork/Downloads/Timeworks/.claude/skills/figma-hybrid-page-rebuild/
```
Expected: `README.md` and `SKILL.md` both present, non-zero size.

- [ ] **Step 4: Commit**

```bash
cd /Users/MiggleWork/Downloads/Timeworks
git add .claude/skills/figma-hybrid-page-rebuild/README.md .claude/skills/figma-hybrid-page-rebuild/SKILL.md
git commit -m "feat(figma-hybrid-page-rebuild): scaffold skill folder with README + SKILL.md frontmatter

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: `template-config.json`

**Files:**
- Create: `.claude/skills/figma-hybrid-page-rebuild/template-config.json`

- [ ] **Step 1: Write the file**

Path: `.claude/skills/figma-hybrid-page-rebuild/template-config.json`

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

- [ ] **Step 2: Verify JSON parses**

Run:
```bash
node -e "JSON.parse(require('fs').readFileSync('/Users/MiggleWork/Downloads/Timeworks/.claude/skills/figma-hybrid-page-rebuild/template-config.json','utf8'))" && echo OK
```
Expected: `OK`.

- [ ] **Step 3: Verify template node resolves in the live DS file**

Run `mcp__figma-console__figma_execute` with this code:

```javascript
await figma.loadAllPagesAsync();
const config = {
  templateNodeId: "25730:16658",
  bodyContainerPath: ["Main Container", "Frame 1707485093", "Frame 1707484991"],
  replaceableBodyChildren: ["Activity Timeline", "Bottom Containers", "Screenshots Container"]
};
const root = await figma.getNodeByIdAsync(config.templateNodeId);
if (!root) throw new Error("templateNodeId not found");
let cur = root;
for (const seg of config.bodyContainerPath) {
  if (!cur || !("children" in cur)) throw new Error("bodyContainerPath broke at " + seg);
  cur = cur.children.find(c => c.name === seg);
  if (!cur) throw new Error("Missing child name " + seg);
}
const bodyChildren = cur.children.map(c => c.name);
const missing = config.replaceableBodyChildren.filter(n => !bodyChildren.includes(n));
return { rootName: root.name, bodyContainer: cur.id, bodyChildren, missingReplaceable: missing };
```

Expected: `rootName === "Mockup w/ Sidebar — Expanded"`, `bodyContainer` is a valid node id, `bodyChildren` contains `"Frame 1707484994"` and `"Activity Timeline"` and `"Bottom Containers"` and `"Screenshots Container"`, `missingReplaceable === []`. If any verification fails, fix the config and re-run.

- [ ] **Step 4: Commit**

```bash
cd /Users/MiggleWork/Downloads/Timeworks
git add .claude/skills/figma-hybrid-page-rebuild/template-config.json
git commit -m "feat(figma-hybrid-page-rebuild): add template-config.json with verified body container path

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: `pattern-swaps.json`

**Files:**
- Create: `.claude/skills/figma-hybrid-page-rebuild/pattern-swaps.json`

- [ ] **Step 1: Write the file**

Path: `.claude/skills/figma-hybrid-page-rebuild/pattern-swaps.json`

```json
{
  "Linear Progress Bar": {
    "dsComponent": "Linear Progress Bar",
    "variantId": "46946:16402",
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

- [ ] **Step 2: Verify JSON parses**

Run:
```bash
node -e "JSON.parse(require('fs').readFileSync('/Users/MiggleWork/Downloads/Timeworks/.claude/skills/figma-hybrid-page-rebuild/pattern-swaps.json','utf8'))" && echo OK
```
Expected: `OK`.

- [ ] **Step 3: Verify Linear Progress Bar variant resolves**

Run `mcp__figma-console__figma_execute`:

```javascript
await figma.loadAllPagesAsync();
const variant = await figma.getNodeByIdAsync("46946:16402");
if (!variant) throw new Error("variantId not found");
const parentSet = variant.parent?.type === "COMPONENT_SET" ? variant.parent : null;
return {
  variantId: variant.id,
  variantName: variant.name,
  parentSetName: parentSet?.name,
  hasPercentageProp: !!parentSet?.componentPropertyDefinitions?.["Percentage #29884:449"] || Object.keys(variant.componentProperties || {}).some(k => k.toLowerCase().startsWith("percentage"))
};
```

Expected: `variantName === "Type=Primary, Size=Small, Label=Off"`, `parentSetName === "Linear Progress Bar"`, `hasPercentageProp === true`. If any fails, the variant id in `pattern-swaps.json` is wrong — find the correct id by listing the COMPONENT_SET children of `46946:16381` and update.

- [ ] **Step 4: Commit**

```bash
cd /Users/MiggleWork/Downloads/Timeworks
git add .claude/skills/figma-hybrid-page-rebuild/pattern-swaps.json
git commit -m "feat(figma-hybrid-page-rebuild): add pattern-swaps.json with Linear Progress Bar detector

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: `slot-map.json`

**Files:**
- Create: `.claude/skills/figma-hybrid-page-rebuild/slot-map.json`

The slot map encodes which template text node receives which source value. Slot keys are name-paths from the template root; `from` recipes locate the source value.

- [ ] **Step 1: Walk the template to capture exact slot name-paths**

Run `mcp__figma-console__figma_execute`:

```javascript
await figma.loadAllPagesAsync();
const root = await figma.getNodeByIdAsync("25730:16658");
const out = [];
const walk = (n, path) => {
  if (n.type === "TEXT") {
    out.push({ path, name: n.name, chars: (n.characters||"").slice(0, 50), fontSize: typeof n.fontSize === "number" ? n.fontSize : null });
    return;
  }
  // Skip descendants of INSTANCE nodes — those text strings live in the main component
  if (n.type === "INSTANCE" && path.length > 0) return;
  if ("children" in n) for (const c of n.children) walk(c, path.concat([c.name || c.type]));
};
walk(root, []);
return { textNodeCount: out.length, sample: out.slice(0, 30) };
```

Capture the output. The sample will show the actual name-path for each non-instance TEXT node. Identify the slot paths for: User Name, Stat tiles 1–4 (Activity Title + Activity Value each).

- [ ] **Step 2: Write the slot-map file**

Path: `.claude/skills/figma-hybrid-page-rebuild/slot-map.json`

Use the actual name-paths captured in Step 1. Template draft below — adjust the keys if Step 1 shows different paths.

```json
{
  "Date Range Selector > User Info Container > User Name": {
    "from": { "kind": "sourceText", "where": "main column > title row", "pick": "largest" }
  },

  "Frame 1707484994 > Frame 1707484992 > Activity Title": {
    "from": { "kind": "sourceText", "where": "main column > stat-cards row > card 1", "pick": "smallest" }
  },
  "Frame 1707484994 > Frame 1707484992 > Activity Value": {
    "from": { "kind": "sourceText", "where": "main column > stat-cards row > card 1", "pick": "largest" }
  },

  "Frame 1707484994 > Frame 1707484993 > Activity Title": {
    "from": { "kind": "sourceText", "where": "main column > stat-cards row > card 2", "pick": "smallest" }
  },
  "Frame 1707484994 > Frame 1707484993 > Activity Value": {
    "from": { "kind": "sourceText", "where": "main column > stat-cards row > card 2", "pick": "largest" }
  },

  "Frame 1707484994 > Frame 1707484994 > Activity Title": {
    "from": { "kind": "sourceText", "where": "main column > stat-cards row > card 3", "pick": "smallest" }
  },
  "Frame 1707484994 > Frame 1707484994 > Activity Value": {
    "from": { "kind": "sourceText", "where": "main column > stat-cards row > card 3", "pick": "largest" }
  },

  "Frame 1707484994 > Frame 1707484995 > Activity Title": {
    "from": { "kind": "sourceText", "where": "main column > stat-cards row > card 4", "pick": "smallest" }
  },
  "Frame 1707484994 > Frame 1707484995 > Activity Value": {
    "from": { "kind": "sourceText", "where": "main column > stat-cards row > card 4", "pick": "largest" }
  }
}
```

If Step 1 surfaced more text nodes worth patching (e.g. search placeholder, button labels), add them with `{ "kind": "literal", "value": "..." }` recipes — but only after asking the user whether those slots should be source-driven or kept as the template's defaults. v1 ships with the 9 entries above.

- [ ] **Step 3: Verify JSON parses**

Run:
```bash
node -e "JSON.parse(require('fs').readFileSync('/Users/MiggleWork/Downloads/Timeworks/.claude/skills/figma-hybrid-page-rebuild/slot-map.json','utf8'))" && echo OK
```
Expected: `OK`.

- [ ] **Step 4: Verify every slot path resolves in the template**

Run `mcp__figma-console__figma_execute`:

```javascript
await figma.loadAllPagesAsync();
const slotMap = JSON.parse(`<contents of slot-map.json>`); // paste contents inline
const root = await figma.getNodeByIdAsync("25730:16658");
const resolve = (root, pathStr) => {
  const segs = pathStr.split(" > ").map(s => s.trim());
  let cur = root;
  for (const seg of segs) {
    if (!cur || !("children" in cur)) return null;
    cur = cur.children.find(c => c.name === seg);
    if (!cur) return null;
  }
  return cur;
};
const results = {};
for (const slotPath of Object.keys(slotMap)) {
  const node = resolve(root, slotPath);
  results[slotPath] = node ? { id: node.id, type: node.type } : "UNRESOLVED";
}
return results;
```

Expected: every entry has an `{ id, type: "TEXT" }`. Any `UNRESOLVED` entry means the path doesn't match the template — fix the slot key in `slot-map.json` using the captures from Step 1.

- [ ] **Step 5: Commit**

```bash
cd /Users/MiggleWork/Downloads/Timeworks
git add .claude/skills/figma-hybrid-page-rebuild/slot-map.json
git commit -m "feat(figma-hybrid-page-rebuild): add slot-map.json with verified template paths

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: SKILL.md — header sections (Required tools + Core rules + workflow steps 1–5)

**Files:**
- Modify: `.claude/skills/figma-hybrid-page-rebuild/SKILL.md`

- [ ] **Step 1: Append the static header sections after the frontmatter**

Append to SKILL.md (after the frontmatter and the H1 line, replacing the placeholder comments):

```markdown
## When to use this skill

Use when the user shares ONE Figma URL of a TimeWorks product page (any frame whose root has a `wrapper > main column` shape) and asks to rebuild it against the design system — any of these verbs: *"use the DS"*, *"match the template"*, *"rebuild from the DS"*, *"convert to the design system"*, *"use the design system"*, *"make this DS-clean"*.

The reference template is **fixed** and lives in `template-config.json` — the user does NOT supply a reference URL. If the user wants to use a custom reference, decline and point them at `figma-page-to-library`.

## When NOT to use this skill

- User only wants token-binding without structural rebuild → use `figma-page-to-library`.
- User wants a new component → `figma-design`.
- User wants React code → `figma-to-code`.
- User supplies TWO URLs intending a custom (non-fixed) reference → out of scope for v1.

## Required tools

All Figma I/O goes through `mcp__figma-console__*`. Plugin API only — no REST, no Team Library indexing. Both the source file AND the DS Experiment file (`templateFileKey` from `template-config.json`) must be open in Figma Desktop.

- `figma_get_status` — connection probe.
- `figma_get_file_data` — metadata.
- `figma_navigate` — switch active file.
- `figma_execute` — run Plugin API code (main verb for reads and writes).
- `figma_take_screenshot` — visual sanity (graceful failure on 403; see step 10).
- `figma_set_annotations` — optional, for reporting bucket labels on swapped sections.

`figma_search_components` and any `figma.root.findOne`/`findAll`/`findAllWithCriteria` against the DS file are **forbidden** — they time out on large DS files. DS components are resolved via `component-map.json` + `getNodeByIdAsync`.

## Core rules

- **Backup-first.** Cloning the source target into `Backup - <name>` is a hard pre-condition. The skill refuses to mutate without a backup.
- **Plugin API only.** No REST calls. `figma_execute` payloads must `return` from the IIFE and `throw` on error — never `figma.closePlugin` (it kills the Desktop Bridge).
- **No invented tokens.** Source values without exact DS equivalents get bound to the nearest match. Never halt with "missing from DS." This skill is substitution + composition, not gap-flagging.
- **Skip remote-instance internals during binding.** Their styling comes from the main component. Instance-level overrides on the instance root ARE bound (second sub-pass).
- **One section at a time.** Each insertion / swap / pattern-match runs inside its own `figma_execute` call — never rewrite the whole page in one payload.
- **No `figma.closePlugin`.** Ever. Desktop Bridge is persistent.

## Configuration files

The skill reads four configs at the start of every run:

| File | Purpose |
|---|---|
| `template-config.json` (this folder) | Fixed template file key + node id + body container path + body-children lists. |
| `slot-map.json` (this folder) | Source → template text-slot recipes. |
| `pattern-swaps.json` (this folder) | Known-shape DS-component swap detectors. |
| `../figma-page-to-library/component-map.json` | DS component lookup. Read, not duplicated. |
| `../figma-page-to-library/ds-config.json` | DS file key cross-check. |

If any config is missing or fails to parse, halt with a specific message naming the file.

## Workflow

The workflow is a 10-step pipeline. Steps 1–5 below; steps 6–10 in the sections that follow.

### 1. Connection check

**Call:** `mcp__figma-console__figma_get_status` (probe: true).

Verify:
1. A Figma Desktop instance is connected.
2. `currentFileKey === templateFileKey` from `template-config.json` (the DS Experiment file is open and active).
3. `setup.valid === true`.

If anything is missing, halt with a specific message: *"DS Experiment file not open in Figma Desktop. Open `gqYWCu1K6dJ9gESXtgNeCi` and re-run."*

### 2. Parse source URL

Parse the URL the user shared into `sourceFileKey` + `sourceNodeId`. Convert hyphenated `node-id=27604-160057` to `27604:160057`.

**If `sourceFileKey !== templateFileKey`:** call `figma_navigate` to switch active file to the source. Most common path: source is already in the DS Experiment file (same file as the template), so no navigation needed.

### 3. Inspect source target

**Call:** `figma_execute`:

```javascript
await figma.loadAllPagesAsync();
const src = await figma.getNodeByIdAsync("<sourceNodeId>");
if (!src) throw new Error("Source node not found: <sourceNodeId>");
const pageOf = (n) => { let p = n; while (p && p.type !== "PAGE") p = p.parent; return p?.name; };
const wrapper = src.children?.find(c => c.name === "wrapper");
const mainColumn = wrapper?.children?.find(c => c.name === "main column");
if (!mainColumn) throw new Error("Source does not have the expected wrapper > main column shape — this skill is built for that layout only");
return {
  src: { id: src.id, name: src.name, page: pageOf(src), x: Math.round(src.x), y: Math.round(src.y), w: Math.round(src.width), h: Math.round(src.height) },
  mainColumnId: mainColumn.id,
  sections: mainColumn.children.map(c => ({ id: c.id, name: c.name, type: c.type, w: Math.round(c.width||0), h: Math.round(c.height||0) }))
};
```

If the inspection throws (no `wrapper > main column`), halt with that message — the skill doesn't try to rebuild arbitrary structures.

### 4. Backup the source

**Hard pre-condition.** No mutation proceeds until backup succeeds.

```javascript
await figma.loadAllPagesAsync();
const src = await figma.getNodeByIdAsync("<sourceNodeId>");
const parent = src.parent;
const dup = src.clone();
dup.name = "Backup - " + src.name;
dup.x = src.x + src.width + 200;
dup.y = src.y;
parent.appendChild(dup);
return { backupId: dup.id, backupName: dup.name };
```

Save `backupId` and `backupName` for the report and the revert path.

### 5. Clone the template

```javascript
await figma.loadAllPagesAsync();
const tpl = await figma.getNodeByIdAsync("<templateNodeId>");
const src = await figma.getNodeByIdAsync("<sourceNodeId>");
const parent = src.parent;
const clone = tpl.clone();
clone.name = src.name; // keep original target name
parent.appendChild(clone);
clone.x = src.x;
clone.y = src.y;
return { cloneId: clone.id, cloneName: clone.name };
```

Do NOT delete the source yet — sections 6–7 still need to read from it (technically from the backup), and step 10 handles the deletion + exit gate.
```

- [ ] **Step 2: Verify the file still parses as markdown**

Run:
```bash
wc -l /Users/MiggleWork/Downloads/Timeworks/.claude/skills/figma-hybrid-page-rebuild/SKILL.md
```
Expected: line count > 50 (file grew with new content).

Also verify the frontmatter wasn't damaged:
```bash
head -1 /Users/MiggleWork/Downloads/Timeworks/.claude/skills/figma-hybrid-page-rebuild/SKILL.md
```
Expected: `---`.

- [ ] **Step 3: Commit**

```bash
cd /Users/MiggleWork/Downloads/Timeworks
git add .claude/skills/figma-hybrid-page-rebuild/SKILL.md
git commit -m "feat(figma-hybrid-page-rebuild): SKILL.md header + workflow steps 1-5

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: SKILL.md — steps 6 + 7 (identify + insert source sections)

**Files:**
- Modify: `.claude/skills/figma-hybrid-page-rebuild/SKILL.md`

- [ ] **Step 1: Append step 6**

Append to SKILL.md:

````markdown
### 6. Identify source unique sections + confirm with user

Walk the source's `main column` children. For each, compute a signature: name (lowercased), child count, dominant child type (TEXT-heavy, INSTANCE-heavy, FRAME-heavy), max child height. Compare against the template's `replaceableBodyChildren` (read from `template-config.json`).

A section is "unique to source" if:
- Its lowercased name does not match any `replaceableBodyChildren` name (case-insensitive substring) AND
- Its signature does not closely match any template-body signature (close = same dominant child type and within 30% of dimensions).

Candidate sections — typically `Frame 1707484126` (2 large cards), `Frame 1707484132` (Meetings), `Frame 1707484134` (Screenshots grid) for the canonical employees source — are presented to the user via `AskUserQuestion`:

```
Question: "Bring these N source sections into the rebuilt dashboard?"
Header: "Bring sections"
multiSelect: true
options: [
  { label: "<sectionName1> (<dimensions>)", description: "Will replace template's body content with this." },
  ...
]
```

If the user deselects everything, halt (no point continuing — exit-gate C1 would fail anyway).

Also document which template body children will be removed (`replaceableBodyChildren`) — list them in the question's body text so the user understands the trade.

### 7. Insert source unique sections

For each bring-section the user confirmed:

```javascript
await figma.loadAllPagesAsync();
const parent = await figma.getNodeByIdAsync("<bodyContainerId>"); // resolved via Section 2 → bodyContainerPath against the new clone
const backupSection = await figma.getNodeByIdAsync("<sectionId in Backup - ...>"); // pick from backup, not from soon-to-be-deleted source
const c = backupSection.clone();
parent.appendChild(c);
// Append order matches source's original section order
return { insertedId: c.id, name: c.name, h: Math.round(c.height) };
```

After all bring-sections inserted, remove the template's `replaceableBodyChildren`:

```javascript
await figma.loadAllPagesAsync();
const removeNames = ["Activity Timeline", "Bottom Containers", "Screenshots Container"]; // from template-config.replaceableBodyChildren
const bodyContainer = await figma.getNodeByIdAsync("<bodyContainerId>");
const removed = [];
for (const name of removeNames) {
  const n = bodyContainer.children.find(c => c.name === name);
  if (n) { removed.push({ id: n.id, name: n.name }); n.remove(); }
}
return { removed };
```

`insertedSourceSectionCount` (used by exit-gate C1) is the count of successful inserts from this step.
````

- [ ] **Step 2: Verify file**

Run:
```bash
grep -c "^### " /Users/MiggleWork/Downloads/Timeworks/.claude/skills/figma-hybrid-page-rebuild/SKILL.md
```
Expected: 7 (steps 1–7 sections present).

- [ ] **Step 3: Commit**

```bash
cd /Users/MiggleWork/Downloads/Timeworks
git add .claude/skills/figma-hybrid-page-rebuild/SKILL.md
git commit -m "feat(figma-hybrid-page-rebuild): SKILL.md workflow steps 6-7 (identify + insert)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 7: SKILL.md — step 8 (slot patching) + step 9a (pattern-swap)

**Files:**
- Modify: `.claude/skills/figma-hybrid-page-rebuild/SKILL.md`

- [ ] **Step 1: Append step 8 (slot patching)**

Append to SKILL.md:

````markdown
### 8. Patch text slots from source via slot-map

Read `slot-map.json`. For each entry:

1. Locate the target TEXT node in the new clone by resolving the slot key as a name-path under the clone root.
2. Resolve the `from` recipe:
   - `kind: "sourceText"` — walk the source (or the backup) using `where` as a name-path, then pick by the `pick` rule (`largest` / `smallest` / `nth:N` based on `fontSize`).
   - `kind: "literal"` — use `value` verbatim.
   - `kind: "keep"` — leave the template's string unchanged; continue.
3. Write the resolved value into the target TEXT node.

Bulletproof text-writing pattern (lifted from the source session):

```javascript
await figma.loadAllPagesAsync();
const findByPath = (root, pathStr) => {
  const segs = pathStr.split(" > ").map(s => s.trim());
  let cur = root;
  for (const seg of segs) {
    if (!cur || !("children" in cur)) return null;
    cur = cur.children.find(c => c.name === seg);
    if (!cur) return null;
  }
  return cur;
};
const writeText = async (node, value) => {
  if (typeof node.fontName === "object" && node.fontName !== figma.mixed) {
    await figma.loadFontAsync(node.fontName);
  }
  node.characters = value;
};

// Apply one slot:
const clone = await figma.getNodeByIdAsync("<cloneId>");
const target = findByPath(clone, "<slotKey>");
const value = "<resolvedValue>";
if (!target) {
  // log "slot unresolved: <slotKey>" — do NOT halt
} else {
  await writeText(target, value);
}
```

For `sourceText` recipes, the `where` path is resolved against the source (or its backup) by the same `findByPath` helper. The `pick` rule:

```javascript
const pickRule = (textNodes, pick) => {
  if (pick === "largest") return textNodes.slice().sort((a, b) => (b.fontSize ?? 0) - (a.fontSize ?? 0))[0];
  if (pick === "smallest") return textNodes.slice().sort((a, b) => (a.fontSize ?? 0) - (b.fontSize ?? 0))[0];
  if (pick.startsWith("nth:")) return textNodes[Number(pick.slice(4))];
  return textNodes[0];
};
const allText = (root) => root.findAllWithCriteria ? root.findAllWithCriteria({ types: ["TEXT"] }) : root.findAll(n => n.type === "TEXT");
```

For each unresolved slot, log `{ slotKey, reason }` and continue. Track unresolved-count for the report.

### 9. Cleanup passes (a, b, c — in order)

#### 9a. Pattern-swap pass

Read `pattern-swaps.json`. For each pattern (currently: Linear Progress Bar), walk the new dashboard and evaluate the detector. First-match wins per node.

**`track-and-fill` detector logic:**

```javascript
const isInsideInstance = (n) => { let p = n.parent; while (p) { if (p.type === "INSTANCE") return true; p = p.parent; } return false; };

const candidates = [];
const visit = (n, rootId) => {
  if (!n) return;
  if (n.id !== rootId && isInsideInstance(n)) return;
  if ((n.type === "GROUP" || n.type === "FRAME") && n.children?.length === 2 && n.height && n.height <= 10) {
    const [a, b] = n.children;
    const isThinShape = (x) => (x.type === "RECTANGLE" || x.type === "VECTOR") && x.height <= 10;
    if (isThinShape(a) && isThinShape(b)) {
      const track = a.width >= b.width ? a : b;
      const fill = a.width >= b.width ? b : a;
      if (fill.width / track.width < 1.0) {
        candidates.push({ node: n, trackW: track.width, fillW: fill.width });
      }
    }
  }
  if ("children" in n) for (const c of n.children) visit(c, rootId);
};
const root = await figma.getNodeByIdAsync("<cloneId>");
visit(root, root.id);
```

For each candidate:

```javascript
const lpb = await figma.getNodeByIdAsync("46946:16402"); // variantId from pattern-swaps.json
let swapped = 0;
for (const { node, trackW, fillW } of candidates) {
  const parent = node.parent;
  const x = node.x, y = node.y;
  const w = node.width, h = node.height;
  const idx = parent.children.indexOf(node);
  const pct = Math.round((fillW / trackW) * 100);
  const instance = lpb.createInstance();
  parent.insertChild(idx, instance);
  instance.x = x;
  instance.y = y;
  instance.resize(w, Math.max(h, instance.height));
  const pctKey = Object.keys(instance.componentProperties).find(k => k.toLowerCase().startsWith("percentage"));
  if (pctKey) {
    try { instance.setProperties({ [pctKey]: pct + "%" }); } catch (e) {}
  }
  node.remove();
  swapped++;
}
return { swapped };
```

Log `{ patternName: "Linear Progress Bar", swappedCount, sampleProps }` for the report.

After the pass, re-scan to confirm `unswappedPatternMatches === 0` (used by exit-gate C4). If any remain, log them with reasons and continue — don't halt.
````

- [ ] **Step 2: Verify file**

Run:
```bash
grep -c "^### " /Users/MiggleWork/Downloads/Timeworks/.claude/skills/figma-hybrid-page-rebuild/SKILL.md
```
Expected: 9 (now 1–9, where 9 is "Cleanup passes (a, b, c)").

Also check that `9a. Pattern-swap pass` appears:
```bash
grep -c "9a. Pattern-swap" /Users/MiggleWork/Downloads/Timeworks/.claude/skills/figma-hybrid-page-rebuild/SKILL.md
```
Expected: 1.

- [ ] **Step 3: Commit**

```bash
cd /Users/MiggleWork/Downloads/Timeworks
git add .claude/skills/figma-hybrid-page-rebuild/SKILL.md
git commit -m "feat(figma-hybrid-page-rebuild): SKILL.md step 8 (slot patching) + 9a (pattern-swap)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 8: SKILL.md — step 9b (token-binding) + step 9c (card-border)

**Files:**
- Modify: `.claude/skills/figma-hybrid-page-rebuild/SKILL.md`

- [ ] **Step 1: Append 9b (token-binding pass)**

Append to SKILL.md:

````markdown
#### 9b. Token-binding pass

Walks the new dashboard, snaps every raw fill/stroke/radius/text to the nearest DS token. Skips descendants of remote DS instances (their styling resolves through the library). Runs a second sub-pass over instance-level overrides.

Loaded from the source session run; proven on 791 nodes / 1229 bindings with zero errors. Lifted verbatim:

```javascript
await figma.loadAllPagesAsync();
const collections = await figma.variables.getLocalVariableCollectionsAsync();
const colorColl = collections.find(c => c.name === "Color Tokens");
const spaceColl = collections.find(c => c.name === "Spacing Tokens");
const vars = await figma.variables.getLocalVariablesAsync();
const colorVars = vars.filter(v => v.variableCollectionId === colorColl.id);
const spaceVars = vars.filter(v => v.variableCollectionId === spaceColl.id);
const byName = {};
for (const v of colorVars) byName[v.name] = v;
const colorEntries = colorVars.map(v => ({ v, c: v.valuesByMode[colorColl.defaultModeId] }));
const neutrals = [
  "primary-background-color","secondary-background-color","ui-background-color","grey-background-color",
  "allgrey-background-color","primary-text-color","secondary-text-color","placeholder-color","icon-color",
  "ui-border-color","layout-border-color","disabled-text-color","disabled-background-color",
  "primary-color","text-color-on-primary","fixed-light-color","fixed-dark-color"
];
const semEntries = neutrals.map(n => byName[n] ? { v: byName[n], c: byName[n].valuesByMode[colorColl.defaultModeId] } : null).filter(Boolean);
const dist = (a, b) => { const dr = a.r-b.r, dg = a.g-b.g, db = a.b-b.b; return dr*dr + dg*dg + db*db; };
function nearestColor(rgb) {
  const sat = Math.max(rgb.r, rgb.g, rgb.b) - Math.min(rgb.r, rgb.g, rgb.b);
  const pool = sat < 0.10 ? semEntries : colorEntries;
  let best = pool[0], bestD = Infinity;
  for (const e of pool) { const d = dist(rgb, e.c); if (d < bestD) { bestD = d; best = e; } }
  return best.v;
}
const spaceList = spaceVars.map(v => ({ v, value: v.valuesByMode[spaceColl.defaultModeId] }));
function nearestSpace(n) { let b = spaceList[0], bd = Infinity; for (const s of spaceList) { const d = Math.abs(s.value - n); if (d < bd) { bd = d; b = s; } } return b.v; }
const textStyles = await figma.getLocalTextStylesAsync();
function pickTextStyle(fontSize, weight) {
  const buckets = [32, 24, 18, 16, 14, 12];
  let bucket = buckets[0], bd = Infinity;
  for (const b of buckets) { const d = Math.abs(b - fontSize); if (d < bd) { bd = d; bucket = b; } }
  const prefix = bucket === 32 ? "H1 (32px)" : bucket === 24 ? "H2 (24px)" : bucket === 18 ? "H3 (18px)" :
                 bucket === 16 ? "Text1 (16px)" : bucket === 14 ? "Text2 (14px)" : "Text3 (12px)";
  const w = (weight || "Regular").toLowerCase();
  let suffix = w.includes("bold") && !w.includes("semi") ? "Bold" :
               w.includes("semi") ? "Medium" :
               w.includes("medium") ? "Normal" :
               (w.includes("light") || w.includes("thin")) ? "Light" : "Normal";
  return textStyles.find(s => s.name === `${prefix}/${suffix}`) || textStyles.find(s => s.name.startsWith(prefix));
}

const stats = { textsBound: 0, fillsBound: 0, strokesBound: 0, radiiBound: 0, visited: 0, skippedInstances: 0, errors: [] };
async function bindNode(n) {
  if (Array.isArray(n.fills)) {
    const nf = []; let ch = false;
    for (const p of n.fills) {
      if (p.type === "SOLID" && !p.boundVariables?.color) {
        try { nf.push(figma.variables.setBoundVariableForPaint(p, "color", nearestColor(p.color))); stats.fillsBound++; ch = true; }
        catch (e) { nf.push(p); stats.errors.push("f " + n.id + ": " + e.message); }
      } else nf.push(p);
    }
    if (ch) try { n.fills = nf; } catch (e) { stats.errors.push("sf " + n.id + ": " + e.message); }
  }
  if (Array.isArray(n.strokes)) {
    const ns = []; let ch = false;
    for (const p of n.strokes) {
      if (p.type === "SOLID" && !p.boundVariables?.color) {
        try { ns.push(figma.variables.setBoundVariableForPaint(p, "color", nearestColor(p.color))); stats.strokesBound++; ch = true; }
        catch (e) { ns.push(p); }
      } else ns.push(p);
    }
    if (ch) try { n.strokes = ns; } catch (e) {}
  }
  for (const k of ["topLeftRadius","topRightRadius","bottomLeftRadius","bottomRightRadius"]) {
    const val = n[k];
    if (typeof val === "number" && val !== 0 && !n.boundVariables?.[k]) {
      try { n.setBoundVariable(k, nearestSpace(val)); stats.radiiBound++; } catch (e) {}
    }
  }
  if (n.type === "TEXT" && !n.textStyleId) {
    const fs = typeof n.fontSize === "number" ? n.fontSize : 14;
    const fn = n.fontName === figma.mixed ? null : n.fontName;
    const style = pickTextStyle(fs, fn?.style);
    if (style) {
      try { await n.setTextStyleIdAsync(style.id); stats.textsBound++; } catch (e) {}
    }
  }
}

// Pass A — walk skipping into INSTANCE children
async function walkA(n, isRoot) {
  if (!n) return;
  stats.visited++;
  if (!isRoot && n.type === "INSTANCE") { stats.skippedInstances++; return; }
  await bindNode(n);
  if ("children" in n) for (const c of n.children) await walkA(c, false);
}

// Pass B — bind instance overrides on the instance node itself, do not descend
async function walkB(n, depth) {
  if (!n) return;
  await bindNode(n);
  if (n.type === "INSTANCE" && depth > 0) return;
  if ("children" in n) for (const c of n.children) await walkB(c, depth + 1);
}

const root = await figma.getNodeByIdAsync("<cloneId>");
await walkA(root, true);
await walkB(root, 0);
return stats;
```

Run with `timeout: 30000` (max). For 800-node pages this completes in ~5–8 seconds.
````

- [ ] **Step 2: Append 9c (card-border pass)**

Append to SKILL.md:

````markdown
#### 9c. Card-border pass

Adds a 1px stroke bound to `layout-border-color` to every card-shaped frame. Idempotent — re-running adds nothing.

```javascript
await figma.loadAllPagesAsync();
const vars = await figma.variables.getLocalVariablesAsync();
const collections = await figma.variables.getLocalVariableCollectionsAsync();
const colorColl = collections.find(c => c.name === "Color Tokens");
const borderVar = vars.find(v => v.name === "layout-border-color" && v.variableCollectionId === colorColl.id);
if (!borderVar) throw new Error("layout-border-color not found");

const BLOCKLIST = ["dashboard","header","toolbar","wrapper","main container","background blobs","sidebar","frame 1707485095"];
const isInsideInstance = (n) => { let p = n.parent; while (p) { if (p.type === "INSTANCE") return true; p = p.parent; } return false; };
const isBlocklisted = (n) => {
  let p = n;
  while (p && p.type !== "PAGE") {
    if (BLOCKLIST.some(name => (p.name || "").toLowerCase().includes(name))) return true;
    p = p.parent;
  }
  return false;
};

const root = await figma.getNodeByIdAsync("<cloneId>");
const pageWidth = root.width;
const candidates = [];
const visit = (n, rootId) => {
  if (!n) return;
  if (n.id !== rootId && isInsideInstance(n)) return;
  if (n.type === "FRAME") {
    const hasFill = Array.isArray(n.fills) && n.fills.some(p => p.type === "SOLID" && p.visible !== false);
    const hasRadius = ["topLeftRadius","topRightRadius","bottomLeftRadius","bottomRightRadius"].some(k => typeof n[k] === "number" && n[k] !== 0);
    const hasStroke = Array.isArray(n.strokes) && n.strokes.length > 0;
    const widthOK = n.width < pageWidth * 0.95;
    const nameOK = !isBlocklisted(n);
    if (hasFill && hasRadius && !hasStroke && widthOK && nameOK) candidates.push(n);
  }
  if ("children" in n) for (const c of n.children) visit(c, rootId);
};
visit(root, root.id);

let added = 0;
for (const n of candidates) {
  let stroke = { type: "SOLID", color: { r: 0.85, g: 0.85, b: 0.85 } };
  stroke = figma.variables.setBoundVariableForPaint(stroke, "color", borderVar);
  n.strokes = [stroke];
  n.strokeWeight = 1;
  if ("strokeAlign" in n) n.strokeAlign = "INSIDE";
  added++;
}
return { borderedCount: added, candidateCount: candidates.length };
```

`unborderedCardCount` (used by exit-gate C3) is `candidates.length - added` (should be 0).
````

- [ ] **Step 3: Verify file**

Run:
```bash
grep -c "^#### " /Users/MiggleWork/Downloads/Timeworks/.claude/skills/figma-hybrid-page-rebuild/SKILL.md
```
Expected: at least 3 (9a, 9b, 9c).

- [ ] **Step 4: Commit**

```bash
cd /Users/MiggleWork/Downloads/Timeworks
git add .claude/skills/figma-hybrid-page-rebuild/SKILL.md
git commit -m "feat(figma-hybrid-page-rebuild): SKILL.md steps 9b (token-binding) + 9c (card-border)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 9: SKILL.md — step 10 (exit gate + report) + Failure modes

**Files:**
- Modify: `.claude/skills/figma-hybrid-page-rebuild/SKILL.md`

- [ ] **Step 1: Append step 10 (exit gate)**

Append to SKILL.md:

````markdown
### 10. Delete source + exit gate

#### 10a. Audit walker

Run a read-only audit across the new clone:

```javascript
await figma.loadAllPagesAsync();
const ALLOW = ["toast","slider","modal"];
const skipUnderInstance = (n) => { let p = n.parent; while (p) { if (p.type === "INSTANCE") return true; p = p.parent; } return false; };
const allowlisted = (n) => { let p = n; while (p) { if (ALLOW.some(a => (p.name || "").toLowerCase().includes(a))) return true; p = p.parent; } return false; };
const leaks = [];
const visit = (n, rootId) => {
  if (!n) return;
  if (n.id !== rootId && skipUnderInstance(n)) return;
  if (allowlisted(n)) return;
  if (Array.isArray(n.fills)) for (const p of n.fills) if (p.type === "SOLID" && !p.boundVariables?.color) leaks.push({ id: n.id, name: n.name, prop: "fill" });
  if (Array.isArray(n.strokes)) for (const p of n.strokes) if (p.type === "SOLID" && !p.boundVariables?.color) leaks.push({ id: n.id, name: n.name, prop: "stroke" });
  for (const k of ["topLeftRadius","topRightRadius","bottomLeftRadius","bottomRightRadius"]) {
    const v = n[k];
    if (typeof v === "number" && v !== 0 && !n.boundVariables?.[k]) leaks.push({ id: n.id, name: n.name, prop: k });
  }
  if (n.type === "TEXT" && !n.textStyleId) {
    const bv = n.boundVariables ?? {};
    if (!bv.fontFamily || !bv.fontSize || !bv.lineHeight) leaks.push({ id: n.id, name: n.name, prop: "text" });
  }
  if ("children" in n) for (const c of n.children) visit(c, rootId);
};
const root = await figma.getNodeByIdAsync("<cloneId>");
visit(root, root.id);
return { leakCount: leaks.length, sample: leaks.slice(0, 10) };
```

#### 10b. Evaluate exit gate

Compute the five checks:

| Check | Pass condition |
|---|---|
| C1 | `insertedSourceSectionCount >= 1` (from step 7) |
| C2 | `leakCount === 0` (from 10a) |
| C3 | `unborderedCardCount === 0` (from 9c) |
| C4 | `unswappedPatternMatches === 0` (from 9a re-scan) |
| C5 | User visual confirm (next sub-step) |

If any of C1–C4 fails, write a `-halted.md` report naming the failing checks and exit. Do NOT proceed to C5.

#### 10c. Delete the original source

If C1–C4 all pass:

```javascript
await figma.loadAllPagesAsync();
const src = await figma.getNodeByIdAsync("<sourceNodeId>");
src.remove();
return { removed: "<sourceNodeId>" };
```

The backup is preserved.

#### 10d. Screenshot attempt (graceful 403)

```
Try: figma_take_screenshot({ nodeId: "<cloneId>" })
On 403: log "visual validation skipped — REST 403", set `screenshotSkipped = true`, continue.
On success: save the URI for the report.
```

Never halt on screenshot failure.

#### 10e. User visual confirm — exact prompt

Use `AskUserQuestion`:

> Rebuild done. **C1**: inserted `<N>` source sections. **C2**: 0 raw-value leaks. **C3**: `<M>` cards bordered. **C4**: `<K>` pattern swaps applied. Please look at `<cloneName>` (node `<cloneId>`) in Figma and pick: `y` (looks right, write report), `fix` (describe what's wrong), `revert` (delete the new frame, restore the backup).

Behavior:
- **`y`** — write full report (10f), run ends successful.
- **`fix`** — user describes the issue in free text, skill iterates in-session (re-run targeted passes, re-check C1–C4, re-ask C5).
- **`revert`** — delete the new clone, restore the backup to source's original `(x, y)` and original name, write `-reverted.md` short report, exit.

```javascript
// Revert path
await figma.loadAllPagesAsync();
const clone = await figma.getNodeByIdAsync("<cloneId>");
const backup = await figma.getNodeByIdAsync("<backupId>");
const parent = clone.parent;
const x = clone.x, y = clone.y;
const origName = "<original source name>";
clone.remove();
backup.x = x;
backup.y = y;
backup.name = origName;
return { restored: backup.id };
```

#### 10f. Write the report

On `y`, write `docs/superpowers/runs/YYYY-MM-DD-<source-file-slug>-<source-page-slug>-hybrid-rebuild.md` with sections:

1. Header (file, source URL, target node, template node, mode=hybrid, backup, date).
2. Approach (one paragraph for the designer).
3. Sections brought from source (list with new node ids).
4. Template sections removed (the `replaceableBodyChildren` list).
5. Text slots patched (table; unresolved slots flagged `⚠️`).
6. Pattern swaps applied (table by pattern + count + sample computed props).
7. Token-bindings applied (counts: texts/fills/strokes/radii/instance overrides).
8. Card borders applied (count + exclusion filter transparency).
9. Raw-value leaks (always present; `✓ No raw values detected.` if zero).
10. Exit gate (C1–C5 pass/fail + user's verbatim C5 response).
11. Backup (name + node id + instruction to delete when confident).
12. Notes for the designer (auto-generated callouts).

## Failure modes

| Symptom | Likely cause | Fix |
|---|---|---|
| `figma_get_status` reports DS file not open | DS Experiment file not loaded in Figma Desktop | Open `gqYWCu1K6dJ9gESXtgNeCi`, re-run. |
| Step 3 throws "no wrapper > main column" | Source doesn't have the expected layout shape | This skill is built for the wrapper+main-column shape only. Use `figma-page-to-library` for arbitrary layouts. |
| `figma_execute` times out (>30s) | Per-payload node budget too high | Chunk by section, ≤200 nodes per call. Use a cursor pattern. |
| 403 "Invalid token" from `figma_take_screenshot` | REST endpoint auth not configured | Skill swallows and continues. Report says "metadata-only run". |
| Pattern-swap matched but variant not found | `variantId` in `pattern-swaps.json` is stale | Find the new id by listing the COMPONENT_SET's children. |
| Component not in `component-map.json` | DS added a new component since the map was regenerated | Log warning, skip swap. User adds entry + re-runs. |
| Desktop Bridge plugin closes mid-run | Payload called `figma.closePlugin` | Bug — fix the payload to `return` results / `throw` errors instead. |
| All exit checks pass but user says `fix` | Visual issue not caught by C1–C4 | Iterate in-session per user's description, re-run targeted passes. |
| Backup frame missing at end of run | Step 4 failed silently | Bug — Step 4 is a hard pre-condition. Restore backup creation. |
| C5 not reached because C1–C4 failed | Earlier pass broke | Read the `-halted.md` report. Most common: C1 fails because user deselected every section in step 6. |
````

- [ ] **Step 2: Verify file**

Run:
```bash
grep -c "^#### " /Users/MiggleWork/Downloads/Timeworks/.claude/skills/figma-hybrid-page-rebuild/SKILL.md
```
Expected: at least 9 (9a, 9b, 9c, 10a–10f).

Also:
```bash
grep -c "^## Failure modes" /Users/MiggleWork/Downloads/Timeworks/.claude/skills/figma-hybrid-page-rebuild/SKILL.md
```
Expected: 1.

- [ ] **Step 3: Commit**

```bash
cd /Users/MiggleWork/Downloads/Timeworks
git add .claude/skills/figma-hybrid-page-rebuild/SKILL.md
git commit -m "feat(figma-hybrid-page-rebuild): SKILL.md step 10 (exit gate + report) + failure modes

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 10: Idempotency dry-run

The skill should detect "already converted" on its second run and exit without mutation. We use the dashboard converted in this session (`27604:164892`) as the dry-run target.

**Files:** none modified.

- [ ] **Step 1: Run the skill against the already-converted dashboard**

User invokes:

```
Re-run figma-hybrid-page-rebuild on https://www.figma.com/design/gqYWCu1K6dJ9gESXtgNeCi/TimeWorks-Design-System--Experiment-?node-id=27604-164892
```

The skill should:
1. Pass step 1 (connection OK).
2. Parse URL → `sourceNodeId = "27604:164892"`.
3. Step 3 should detect this node doesn't have a `wrapper > main column` child (the rebuilt dashboard has `Main Container`, `Background Blobs`, no `wrapper`).
4. **Expected outcome:** Step 3 halts with the message *"Source does not have the expected wrapper > main column shape"*.

This is the right behavior — the rebuilt dashboard isn't a source-shaped page anymore. The skill correctly refuses to rebuild a rebuild.

- [ ] **Step 2: Document the dry-run result**

Append a short note to the run docs (or a comment in this plan checking the box). No commit needed.

---

## Task 11: Memory + final commit

**Files:**
- Create: `/Users/MiggleWork/.claude/projects/-Users-MiggleWork-Downloads-Timeworks/memory/figma_hybrid_page_rebuild.md`
- Modify: `/Users/MiggleWork/.claude/projects/-Users-MiggleWork-Downloads-Timeworks/memory/MEMORY.md`

- [ ] **Step 1: Write the memory file**

Path: `/Users/MiggleWork/.claude/projects/-Users-MiggleWork-Downloads-Timeworks/memory/figma_hybrid_page_rebuild.md`

```markdown
---
name: figma-hybrid-page-rebuild skill
description: New project skill that rebuilds product pages against the fixed DS template, keeping template chrome + inserting source unique sections + pattern-swap + token-bind + card-border + user visual confirm exit gate
type: project
---

The `figma-hybrid-page-rebuild` skill (at `.claude/skills/figma-hybrid-page-rebuild/`) is the substitution-with-template path; sibling `figma-page-to-library` is the in-place substitution path. Use the hybrid skill when a user shares one Figma URL and asks to rebuild against the DS — it always uses the fixed `Mockup w/ Sidebar — Expanded` template (`25730:16658`), never a user-supplied reference.

The skill ships three configs: `template-config.json` (fixed template metadata), `slot-map.json` (source → template text-slot recipes), `pattern-swaps.json` (known-shape DS-component swaps, v1 has Linear Progress Bar). Shared configs (`ds-config.json`, `component-map.json`, `icon-map.json`) come from the sibling — read but not duplicated.
```

- [ ] **Step 2: Add a pointer line in MEMORY.md**

Append to `/Users/MiggleWork/.claude/projects/-Users-MiggleWork-Downloads-Timeworks/memory/MEMORY.md`:

```markdown
- [figma-hybrid-page-rebuild skill](figma_hybrid_page_rebuild.md) — new sibling to figma-page-to-library; rebuild against fixed DS template + slot patch + pattern-swap + card-border + visual-confirm gate
```

- [ ] **Step 3: Final commit**

```bash
cd /Users/MiggleWork/Downloads/Timeworks
git add docs/superpowers/plans/2026-05-14-figma-hybrid-page-rebuild.md
git commit -m "docs(figma-hybrid-page-rebuild): add implementation plan

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

(Memory files live outside the repo; they don't get committed.)

---

## Self-review notes

Plan checked against the spec — all 10 lessons encoded:

| Spec lesson | Implementing task |
|---|---|
| 1. Clarify intent upfront | Task 6 step 6 (AskUserQuestion confirm bring/drop list) |
| 2. Token-binding alone is failure | Task 9 (exit-gate C1 requires inserted section count ≥ 1) |
| 3. Hybrid: ref chrome + source content | Tasks 5–6 (clone template, then insert source sections) |
| 4. `layout-border-color` on cards | Task 8 step 2 (9c card-border pass) |
| 5. Wrapper-frame exclusion list | Task 8 step 2 (BLOCKLIST in 9c) |
| 6. Side overlays | Out of scope per Q7 (skill ignores anything outside `main column`) — encoded in Task 5 step 3 (halt if no `main column`) |
| 7. Screenshot 403 fallback | Task 9 step 1 (10d graceful fallback) |
| 8. Backup-first | Task 5 step 1 (step 4 hard pre-condition) |
| 9. Linear Progress Bar pattern swap | Tasks 3 + 7 (config + 9a pass) |
| 10. User visual confirm gate | Task 9 step 1 (10e exact prompt) |

All file paths absolute. All payloads complete (lifted verbatim from the source session). No TBDs, no "fill in details," no "similar to Task N." Type names consistent (`insertedSourceSectionCount`, `unborderedCardCount`, `unswappedPatternMatches`, `leakCount` used identically across the spec, the exit gate, and the report).
