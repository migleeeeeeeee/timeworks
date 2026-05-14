---
name: figma-hybrid-page-rebuild
description: Use when the user shares a single Figma URL of a TimeWorks product page and asks to "use the design system", "match the template", "rebuild from the DS", "convert to the design system", or similar — any reference verb plus a single page URL. Rebuilds the page against the fixed canonical template (Mockup w/ Sidebar — Expanded, hardcoded in template-config.json) by keeping the template's Sidebar/Header/Toolbar/Date-range/stat-tile chrome and inserting the source's unique body sections. Always runs a slot-patch from source text, token-binding, pattern-swap (Linear Progress Bar etc.), and card-border pass. Does NOT support a user-supplied reference URL (use figma-page-to-library for those cases) and does NOT generate React code (figma-to-code for that).
---

# figma-hybrid-page-rebuild

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
const parent = await figma.getNodeByIdAsync("<bodyContainerId>"); // resolved via template-config.bodyContainerPath against the new clone
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
