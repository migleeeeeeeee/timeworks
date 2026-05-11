# figma-page-to-library — Experiment Retarget Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Retarget the `figma-page-to-library` skill at the Experiment DS file (`gqYWCu1K6dJ9gESXtgNeCi`), parameterize the DS file via config, regenerate the component map, add a new icon map, replace Step 5's prose matching with a four-rule deterministic cascade, and add a non-blocking raw-value audit (Step 9.5).

**Architecture:** Skill-side only — no `src/` changes. Three new files (`ds-config.json`, `icon-map.json`, a manual regen script), one regenerated file (`component-map.json`), and a substantial edit pass on `SKILL.md`. The skill continues to drive figma-console MCP via Plugin API only; no REST, no Team Library indexing.

**Tech Stack:** Markdown, JSON, Node.js (ESM, for the regen script), `mcp__figma-console__*` (Plugin API).

**Spec:** `docs/superpowers/specs/2026-05-11-figma-page-to-library-experiment-retarget-design.md`

---

## File Structure

**Created:**
- `.claude/skills/figma-page-to-library/ds-config.json` — `{ dsFileKey, dsFileName }`. Single source of truth for the DS file identity.
- `.claude/skills/figma-page-to-library/icon-map.json` — icon name → `{ id, key }` map for the 298 canonical icons rooted at Experiment file node `25336:96509`.
- `scripts/regen-figma-page-to-library-maps.mjs` — manual one-shot regen script. Reads `ds-config.json`, walks the Experiment file via figma-console MCP, writes `component-map.json` and `icon-map.json`. Not wired into `npm run`.

**Modified:**
- `.claude/skills/figma-page-to-library/component-map.json` — fully regenerated against the Experiment file. Same JSON shape (`{ "<Name>": { "id": "...", "key": "..." } }`).
- `.claude/skills/figma-page-to-library/SKILL.md` — frontmatter description, Steps 1, 2, 5, 7, 9.5 (new), 10, and the failure-mode table.

**Unchanged:**
- Everything under `src/`. All other skills. All other docs.

---

## Conventions for this plan

- "Verify the edit landed" steps use `grep` against the modified file rather than re-reading it.
- Each task ends with a commit, even when it's only a markdown edit. Frequent commits per CLAUDE.md.
- The Experiment file's `dsFileKey` is `gqYWCu1K6dJ9gESXtgNeCi`. This is the value to write everywhere `ds-config.json` is referenced; never hardcoded in `SKILL.md` after Task 5.

---

### Task 1: Add `ds-config.json`

**Files:**
- Create: `.claude/skills/figma-page-to-library/ds-config.json`

- [ ] **Step 1: Write the config file**

```json
{
  "dsFileKey": "gqYWCu1K6dJ9gESXtgNeCi",
  "dsFileName": "TimeWorks Design System (Experiment)"
}
```

- [ ] **Step 2: Verify it parses as JSON**

Run: `node -e "console.log(JSON.parse(require('fs').readFileSync('.claude/skills/figma-page-to-library/ds-config.json', 'utf8')).dsFileKey)"`
Expected output: `gqYWCu1K6dJ9gESXtgNeCi`

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/figma-page-to-library/ds-config.json
git commit -m "feat(figma-page-to-library): add ds-config.json (Experiment file)"
```

---

### Task 2: Write the regen script (with a `--dry-run` mode that validates config without touching Figma)

**Files:**
- Create: `scripts/regen-figma-page-to-library-maps.mjs`

The script has two modes:
- `--dry-run` — reads `ds-config.json` and prints the resolved fileKey + the figma-console MCP commands it *would* run. No Figma I/O. Used for verification in this task.
- (default) — performs the walk and writes the maps. Used in Task 3.

- [ ] **Step 1: Write the script**

```javascript
#!/usr/bin/env node
// Manual one-shot. Not wired into npm.
// Requires the Experiment file to be open in Figma Desktop and the
// figma-console MCP Desktop Bridge to be running.
//
// Modes:
//   --dry-run   Print what the script would do; no Figma I/O.
//   (default)   Walk the Experiment file via the figma-console MCP and
//               write component-map.json + icon-map.json.
//
// Implementation note: this script does NOT speak the MCP protocol
// itself. It prints instructions for the operator (or the calling
// agent) to feed into mcp__figma-console__figma_execute. Walks are
// chunked at <=200 nodes per call to stay under the 7s WebSocket
// budget. See SKILL.md Step 4 for the cursor pattern.

import { readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const SKILL_DIR = join(__dirname, "..", ".claude", "skills", "figma-page-to-library")
const CONFIG_PATH = join(SKILL_DIR, "ds-config.json")
const COMPONENT_MAP_PATH = join(SKILL_DIR, "component-map.json")
const ICON_MAP_PATH = join(SKILL_DIR, "icon-map.json")

// Anchors in the Experiment file. Update here if the file is restructured.
const ICON_LIBRARY_NODE_ID = "25336:96509"

function loadConfig() {
  const raw = readFileSync(CONFIG_PATH, "utf8")
  const cfg = JSON.parse(raw)
  if (!cfg.dsFileKey) {
    throw new Error(`ds-config.json missing dsFileKey`)
  }
  return cfg
}

function printPlan(cfg) {
  console.log(`DS file:           ${cfg.dsFileName}`)
  console.log(`DS fileKey:        ${cfg.dsFileKey}`)
  console.log(`Icon library node: ${ICON_LIBRARY_NODE_ID}`)
  console.log(``)
  console.log(`Steps the operator (or agent) must drive via figma-console MCP:`)
  console.log(`  1. mcp__figma-console__figma_get_status — confirm Desktop Bridge connected`)
  console.log(`  2. mcp__figma-console__figma_navigate to https://www.figma.com/design/${cfg.dsFileKey}/`)
  console.log(`  3. figma_execute: walk root.children, find component pages,`)
  console.log(`     collect every top-level COMPONENT and COMPONENT_SET as { name, id, key }.`)
  console.log(`     Chunk to <=200 nodes per call. Return [{ name, id, key }, ...].`)
  console.log(`  4. figma_execute: getNodeByIdAsync("${ICON_LIBRARY_NODE_ID}"), walk its`)
  console.log(`     COMPONENT children, collect { name, id, key }. Chunk likewise.`)
  console.log(`  5. Feed the two arrays back into this script via STDIN as JSON:`)
  console.log(`     { "components": [...], "icons": [...] }`)
  console.log(``)
  console.log(`Then re-run without --dry-run and pipe the JSON in on stdin:`)
  console.log(`  cat collected.json | node scripts/regen-figma-page-to-library-maps.mjs`)
}

function toMap(arr) {
  const out = {}
  for (const { name, id, key } of arr) {
    if (!name || !id) continue
    out[name] = { id, key: key ?? "" }
  }
  return out
}

function writeMaps(payload) {
  if (!payload || !Array.isArray(payload.components) || !Array.isArray(payload.icons)) {
    throw new Error(`stdin payload must be { components: [...], icons: [...] }`)
  }
  const componentMap = toMap(payload.components)
  const iconMap = toMap(payload.icons)
  writeFileSync(COMPONENT_MAP_PATH, JSON.stringify(componentMap, null, 2) + "\n")
  writeFileSync(ICON_MAP_PATH, JSON.stringify(iconMap, null, 2) + "\n")
  console.log(`Wrote ${Object.keys(componentMap).length} components to component-map.json`)
  console.log(`Wrote ${Object.keys(iconMap).length} icons to icon-map.json`)
}

function readStdin() {
  return new Promise((resolve, reject) => {
    let data = ""
    process.stdin.setEncoding("utf8")
    process.stdin.on("data", (chunk) => (data += chunk))
    process.stdin.on("end", () => {
      try {
        resolve(data.trim() ? JSON.parse(data) : null)
      } catch (err) {
        reject(err)
      }
    })
    process.stdin.on("error", reject)
  })
}

const cfg = loadConfig()
if (process.argv.includes("--dry-run")) {
  printPlan(cfg)
} else {
  const payload = await readStdin()
  if (!payload) {
    console.error(`No stdin payload received. Re-run with --dry-run to see how to collect one.`)
    process.exit(1)
  }
  writeMaps(payload)
}
```

- [ ] **Step 2: Make the script executable and run dry-run**

Run: `chmod +x scripts/regen-figma-page-to-library-maps.mjs && node scripts/regen-figma-page-to-library-maps.mjs --dry-run`
Expected output (first three lines):
```
DS file:           TimeWorks Design System (Experiment)
DS fileKey:        gqYWCu1K6dJ9gESXtgNeCi
Icon library node: 25336:96509
```

- [ ] **Step 3: Verify config-swap sanity (per spec Validation §2)**

Temporarily edit `ds-config.json` and change `dsFileKey` to `PLACEHOLDER_KEY`, then re-run `--dry-run`. Confirm the second line reads `DS fileKey:        PLACEHOLDER_KEY`. Revert the change.

- [ ] **Step 4: Commit**

```bash
git add scripts/regen-figma-page-to-library-maps.mjs
git commit -m "feat(figma-page-to-library): regen script (component-map + icon-map)"
```

---

### Task 3: Regenerate `component-map.json` + write new `icon-map.json` against the Experiment file

**Prerequisite:** Both the user's Manager Dashboard source file and the Experiment DS file must be open in Figma Desktop with the figma-console MCP Desktop Bridge plugin running. Ask the user to confirm before starting.

**Files:**
- Modify: `.claude/skills/figma-page-to-library/component-map.json`
- Create: `.claude/skills/figma-page-to-library/icon-map.json`

- [ ] **Step 1: Verify Desktop Bridge connection**

Call: `mcp__figma-console__figma_get_status`
Expected: a connected instance with the Experiment file (`gqYWCu1K6dJ9gESXtgNeCi`) listed as open.
If not open: halt and tell the user to open the file.

- [ ] **Step 2: Navigate to the Experiment file**

Call: `mcp__figma-console__figma_navigate` with URL `https://www.figma.com/design/gqYWCu1K6dJ9gESXtgNeCi/`.

- [ ] **Step 3: Walk component pages and collect components**

Call: `mcp__figma-console__figma_execute` with the payload below. **Persistent-bridge convention** — uses `return` / `throw`, never `figma.closePlugin`.

```javascript
;(async () => {
  await figma.loadAllPagesAsync()
  const pages = figma.root.children.filter((p) =>
    /component|primitive|library/i.test(p.name)
  )
  if (pages.length === 0) {
    throw new Error("No component-bearing pages found by name pattern; widen the filter or pass page IDs explicitly")
  }
  const out = []
  for (const page of pages) {
    for (const child of page.children) {
      if (child.type === "COMPONENT" || child.type === "COMPONENT_SET") {
        out.push({ name: child.name, id: child.id, key: child.key ?? "" })
      }
    }
  }
  return { components: out, pageNames: pages.map((p) => p.name) }
})()
```

If `out.length` is suspiciously small (< 30), inspect `pageNames` in the result and re-run with a corrected page filter. The current published map has ~45 entries; the Experiment file should be similar or larger.

- [ ] **Step 4: Walk the icon library**

Call: `mcp__figma-console__figma_execute` with:

```javascript
;(async () => {
  const root = await figma.getNodeByIdAsync("25336:96509")
  if (!root) {
    throw new Error("Icon library root 25336:96509 not found on this file")
  }
  const icons = []
  const visit = (node) => {
    if (!node) return
    if (node.type === "COMPONENT") {
      icons.push({ name: node.name, id: node.id, key: node.key ?? "" })
      return
    }
    if ("children" in node) {
      for (const c of node.children) visit(c)
    }
  }
  visit(root)
  return { icons, count: icons.length }
})()
```

Expected `count` ≈ 298 per the memory note. If it's significantly off, halt and inspect the icon library structure before writing the map.

- [ ] **Step 5: Pipe the collected data into the regen script**

Combine the two results into a single JSON blob and pipe it through the regen script:

```bash
cat <<'EOF' | node scripts/regen-figma-page-to-library-maps.mjs
{ "components": [ ... from Step 3 ... ], "icons": [ ... from Step 4 ... ] }
EOF
```

Expected output:
```
Wrote <N> components to component-map.json
Wrote <M> icons to icon-map.json
```
Where N ≥ 30 and M ≈ 298.

- [ ] **Step 6: Spot-check the maps**

Run: `node -e "const m = require('./.claude/skills/figma-page-to-library/component-map.json'); console.log(Object.keys(m).length, m['Sidebar']?.id, m['Sidebar Icon Button']?.id)"`

Expected: a count ≥ 30 and two non-empty IDs. Specifically `Sidebar` should resolve to component set `25694:158051` and `Sidebar Icon Button` to `25694:157615` per the memory note. (Names may differ slightly — `Sidebar` vs `sidebar` — in which case adjust the spot-check; the critical bit is that both nodes appear in the map under some key.)

- [ ] **Step 7: Commit**

```bash
git add .claude/skills/figma-page-to-library/component-map.json .claude/skills/figma-page-to-library/icon-map.json
git commit -m "feat(figma-page-to-library): regenerate maps against Experiment file"
```

---

### Task 4: Replace hardcoded fileKey in `SKILL.md` with `ds-config.json` references

**Files:**
- Modify: `.claude/skills/figma-page-to-library/SKILL.md`

- [ ] **Step 1: Update the frontmatter description**

Replace the existing description sentence that mentions `04x9q7W2Y59baF5MqHAVZR` with one that references the config. Apply this exact edit to line 3 (the `description:` line):

- Old fragment: `the DS library file (\`04x9q7W2Y59baF5MqHAVZR\`) must be open in Figma Desktop`
- New fragment: `the DS file named in \`ds-config.json\` (currently the Experiment file \`gqYWCu1K6dJ9gESXtgNeCi\`) must be open in Figma Desktop`

- [ ] **Step 2: Update Step 1 ("Verify connection and file state")**

Replace the third bullet under "Confirm:" — currently `3. DS \`fileKey\` \`04x9q7W2Y59baF5MqHAVZR\` is open.` — with:

```
3. DS `fileKey` (read from `.claude/skills/figma-page-to-library/ds-config.json` as `dsFileKey`) is open.
```

Add a new sentence immediately before "If anything is missing, halt…":

```
Read `ds-config.json` once at the start of the run and reuse the resolved `dsFileKey` everywhere below.
```

- [ ] **Step 3: Update Step 2 ("Determine scope")**

Replace both `fileKey == 04x9q7W2Y59baF5MqHAVZR` checks (the conditional paragraphs starting `**If \`fileKey == 04x9q7W2Y59baF5MqHAVZR\`:**` and `**If \`fileKey != 04x9q7W2Y59baF5MqHAVZR\`:**`) with `fileKey == dsFileKey` and `fileKey != dsFileKey` respectively, and update the surrounding prose to say "the DS file" rather than naming the key.

Also update the bullet in the "Three entry modes" list:

- Old: `If \`fileKey == 04x9q7W2Y59baF5MqHAVZR\` and the URL points to a duplicated product page → \`work-in-DS-file\`.`
- New: `If \`fileKey == dsFileKey\` (from \`ds-config.json\`) and the URL points to a duplicated product page → \`work-in-DS-file\`.`

- [ ] **Step 4: Update the failure-mode table row**

Find the row beginning `| Page duplicated into DS file but skill refuses to run on it`. Replace `(fileKey should be \`04x9q7W2Y59baF5MqHAVZR\`)` with `(fileKey should match \`dsFileKey\` in \`ds-config.json\`)`.

- [ ] **Step 5: Verify no hardcoded key remains**

Run: `grep -n "04x9q7W2Y59baF5MqHAVZR" .claude/skills/figma-page-to-library/SKILL.md`
Expected: no matches (exit code 1).

Run: `grep -c "ds-config.json" .claude/skills/figma-page-to-library/SKILL.md`
Expected: ≥ 4 (frontmatter + Step 1 + Step 2 + failure-mode row).

- [ ] **Step 6: Commit**

```bash
git add .claude/skills/figma-page-to-library/SKILL.md
git commit -m "refactor(figma-page-to-library): read DS fileKey from ds-config.json"
```

---

### Task 5: Rewrite Step 5 with the four-rule matcher cascade

**Files:**
- Modify: `.claude/skills/figma-page-to-library/SKILL.md` — replace the "For each section in the inventory, decide:" paragraph and the "Variant matching" paragraph within Step 5 with the cascade below. The "Load the component map" preamble and the `findOne`-forbidden warning stay untouched.

- [ ] **Step 1: Replace the matching guidance with the cascade**

Locate the paragraph in Step 5 that begins `For each section in the inventory, decide:` and ends before `### 6. Decide section strategy (per section)`. Replace everything from that paragraph through (and including) the existing "Variant matching — never default blindly" block with the following:

````markdown
For each section in the inventory, run the **four-rule matcher cascade**. The first rule that matches wins.

#### Rule 1 — Existing key match

If the source section is already an `INSTANCE` and its `mainComponent.key` exists as a value in `component-map.json`, treat it as `exact-swap`. Preserve `instance.componentProperties` and carry variants over via `setProperties` after re-instantiating from the map (or, if the section is already in the same family, `swapComponent` to the canonical map entry to repoint at the Experiment-file source).

#### Rule 2 — Name alias match

Lowercase the source node name, strip punctuation, and look up against this alias table baked into the skill:

| Source alias (lowercased)                             | DS component (from `component-map.json`) |
| ----------------------------------------------------- | ---------------------------------------- |
| `btn`, `button`, `cta`, `action`, `primary`, `secondary` | `Button`                                 |
| `icon button`, `iconbutton`, `icon btn`               | `Icon Button`                            |
| `tag`, `chip`, `pill`, `badge`                        | `Tag` (use `Badge` only if Tag absent)   |
| `avatar`, `profile pic`, `user pic`                   | `Avatar`                                 |
| `banner`, `alert`, `notice`                           | `Alert Banner`                           |
| `input`, `text field`, `textfield`                    | `Input`                                  |
| `checkbox`                                            | `Checkbox`                               |
| `radio`                                               | `Radio Group`                            |
| `switch`, `toggle`                                    | `Switch`                                 |
| `dropdown`, `select`                                  | `Dropdown`                               |
| `modal`, `dialog`                                     | `Modal`                                  |
| `tooltip`                                             | `Tooltip`                                |
| `sidebar`, `side nav`, `navigation rail`              | `Sidebar`                                |

On hit, instantiate the mapped component and infer variant from visual cues — primary/secondary from fill role; outlined from stroke presence; with-icon from any nested `INSTANCE` whose name matches an `icon-map.json` entry; size from height bucket (`<32` → sm, `32–40` → md, `>40` → lg). Apply via `setProperties`.

#### Rule 3 — Visual signature match (composition)

Compute a small signature for the section:

```js
{
  radiusBucket: "none" | "sm" | "md" | "lg" | "full",   // cornerRadius bucketed: 0, ≤4, ≤8, ≤16, full
  hasStroke: boolean,                                    // any visible stroke
  hasIcon: boolean,                                      // any child INSTANCE whose name is in icon-map.json
  hasAvatar: boolean,                                    // any child INSTANCE whose name matches /avatar|profile/i
  childCount: number,
  role: "container" | "control" | "text"                 // container if has 2+ visible children; text if all children are TEXT; else control
}
```

If at least two DS primitives' signatures match the section's children (e.g. an Avatar child and a Text child → compose Avatar + Text + optional Button), route to `compose-from-primitives` (Tier 2 in Step 8).

#### Rule 4 — Fall through

If none of Rules 1–3 fire, fall through to Tier 3 in Step 8 (`annotate-and-preserve`).

**Variant matching — never default blindly.** When Rule 1 or Rule 2 yields a family but the variant is still ambiguous, call it out in the report rather than silently choosing the component's default. The Experiment file's component pages document each component's available variant properties; consult them when intent is unclear.
````

- [ ] **Step 2: Verify the cascade landed**

Run: `grep -c "Rule 1 — Existing key match" .claude/skills/figma-page-to-library/SKILL.md`
Expected: `1`.

Run: `grep -c "Rule 4 — Fall through" .claude/skills/figma-page-to-library/SKILL.md`
Expected: `1`.

Run: `grep -c "Variant matching — never default blindly" .claude/skills/figma-page-to-library/SKILL.md`
Expected: `1` (preserved at the bottom of the new cascade).

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/figma-page-to-library/SKILL.md
git commit -m "feat(figma-page-to-library): four-rule matcher cascade in Step 5"
```

---

### Task 6: Wire the icon override in Step 7 to `icon-map.json`

**Files:**
- Modify: `.claude/skills/figma-page-to-library/SKILL.md` — the icon-override code block inside Step 7's "3. Set icon override on button/icon components" subsection.

- [ ] **Step 1: Replace the icon-override block**

Locate the existing block beginning with `**3. Set icon override on button/icon components (the only hard override needed):**` and replace its JavaScript code block with:

```javascript
;(async () => {
  try {
    const props = newInstance.componentProperties
    const iconPropKey = Object.keys(props ?? {}).find(
      (k) => k.toLowerCase().includes("icon") && props[k].type === "INSTANCE_SWAP"
    )
    if (!iconPropKey || !instanceHints) return

    // Extract icon name from the captured hint (e.g., "Icons/ChevronDown" → "ChevronDown").
    const oldIconName = instanceHints[iconPropKey] ?? ""
    const iconNameHint = oldIconName.split("/").pop()
    if (!iconNameHint) return

    // Resolve via icon-map.json (loaded at the start of the run alongside component-map.json).
    // Same-file (work-in-DS-file mode): use the id.
    // Cross-file (source-file mode): import by key.
    const entry = iconMap[iconNameHint]
    if (!entry) {
      console.warn(`Icon "${iconNameHint}" not in icon-map.json; leaving DS default`)
      return
    }

    let iconNodeId
    if (figma.fileKey === dsFileKey) {
      const node = await figma.getNodeByIdAsync(entry.id)
      iconNodeId = node?.id
    } else {
      const imported = await figma.importComponentByKeyAsync(entry.key)
      iconNodeId = imported?.id
    }
    if (iconNodeId) {
      newInstance.setProperties({ [iconPropKey]: iconNodeId })
    }
  } catch (err) {
    console.warn(`Icon override failed: ${err.message}`)
  }
})()
```

- [ ] **Step 2: Update the surrounding prose**

Find the sentence currently reading `// Icons are not in component-map.json today.` (now removed) and any nearby "If the source instance already exposes a usable icon node id…" guidance — replace the paragraph immediately above the code block with:

```markdown
Load `icon-map.json` at the start of the run alongside `component-map.json`. For each Tier-1 swap whose target has an `INSTANCE_SWAP` property containing "icon", resolve the icon by name through `icon-map.json` — by id when running in the DS file, by key when running cross-file. If the name isn't in the map, log a warning and leave the DS component's default icon in place. **Never** fall back to `figma.root.findOne` — it will time out.
```

- [ ] **Step 3: Verify**

Run: `grep -c "iconMap\[iconNameHint\]" .claude/skills/figma-page-to-library/SKILL.md`
Expected: `1`.

Run: `grep -c "icon-map.json" .claude/skills/figma-page-to-library/SKILL.md`
Expected: ≥ `2`.

- [ ] **Step 4: Commit**

```bash
git add .claude/skills/figma-page-to-library/SKILL.md
git commit -m "feat(figma-page-to-library): wire icon override to icon-map.json"
```

---

### Task 7: Insert Step 9.5 — raw-value audit

**Files:**
- Modify: `.claude/skills/figma-page-to-library/SKILL.md` — insert a new section between the existing Step 9 ("Validate what actually changed") and Step 10 ("Deliverable").

- [ ] **Step 1: Insert the new section**

After the closing line of Step 9 (the bullet beginning `- \`figma_set_annotations\` on each section with its bucket`) and before `### 10. Deliverable`, insert exactly:

````markdown
### 9.5. Audit for raw values

One read-only `figma_execute` walk over the converted target frame. **Non-blocking** — surfaces leaks in the report; never halts the run.

**A leak is** any of, inside a Tier-1 (`exact-swap`) or Tier-2 (`compose-from-primitives`) section, recursively:

- A `SolidPaint` fill or stroke whose `boundVariables.color` is undefined.
- A `cornerRadius` — or any of `topLeftRadius`, `topRightRadius`, `bottomLeftRadius`, `bottomRightRadius` — that is not bound to a variable and is not `0`.
- A `TextNode` whose `textStyleId` is empty AND whose `fontName`, `fontSize`, and `lineHeight` are not all bound to variables. All-or-nothing on text bindings.
- An `effects` entry on a node with empty `effectStyleId`.

**Not leaks:**

- Anything inside a Tier-3 (`annotate-and-preserve`) or Tier-4 (`blocked`) section.
- Image fills and gradient fills.
- Nodes whose name (case-insensitive substring) matches the allowlist `["Toast", "Slider", "Modal"]` — these carry intentional `rgba(...)` overlays per CLAUDE.md.
- Descendants of newly-placed library instances — their styling resolves through the library's own bindings.

**Walker pattern** (chunked at ≤200 nodes per call; cursor pattern for large frames):

```javascript
;(async () => {
  const ALLOWLIST = ["toast", "slider", "modal"]
  const TIER_OK = new Set(tier12SectionIds) // ids of sections classified as Tier 1 or Tier 2 in Step 6
  const skipUnderInstance = (node) => {
    let p = node.parent
    while (p) {
      if (p.type === "INSTANCE" && p.mainComponent?.remote) return true
      p = p.parent
    }
    return false
  }
  const isAllowlisted = (node) => {
    let p = node
    while (p) {
      if (ALLOWLIST.some((name) => p.name?.toLowerCase().includes(name))) return true
      p = p.parent
    }
    return false
  }
  const isBound = (boundVariables, key) => Boolean(boundVariables?.[key])

  const leaks = []
  const visit = (node) => {
    if (!node || skipUnderInstance(node) || isAllowlisted(node)) return
    // Fills
    if (Array.isArray(node.fills)) {
      for (const paint of node.fills) {
        if (paint.type === "SOLID" && !isBound(paint.boundVariables, "color")) {
          leaks.push({
            nodeId: node.id,
            nodeName: node.name,
            property: "fill",
            rawValue: paint.color
          })
        }
      }
    }
    // Strokes
    if (Array.isArray(node.strokes)) {
      for (const paint of node.strokes) {
        if (paint.type === "SOLID" && !isBound(paint.boundVariables, "color")) {
          leaks.push({
            nodeId: node.id,
            nodeName: node.name,
            property: "stroke",
            rawValue: paint.color
          })
        }
      }
    }
    // Radii (per corner)
    const radiusKeys = ["topLeftRadius", "topRightRadius", "bottomLeftRadius", "bottomRightRadius"]
    for (const k of radiusKeys) {
      const v = node[k]
      if (typeof v === "number" && v !== 0 && !isBound(node.boundVariables, k)) {
        leaks.push({ nodeId: node.id, nodeName: node.name, property: k, rawValue: v })
      }
    }
    // Text — all-or-nothing on bindings
    if (node.type === "TEXT" && !node.textStyleId) {
      const bv = node.boundVariables ?? {}
      if (!bv.fontFamily || !bv.fontSize || !bv.lineHeight) {
        leaks.push({
          nodeId: node.id,
          nodeName: node.name,
          property: "text",
          rawValue: `${node.fontSize}/${node.lineHeight?.value ?? node.lineHeight}`
        })
      }
    }
    // Effects
    if (Array.isArray(node.effects) && node.effects.length > 0 && !node.effectStyleId) {
      leaks.push({
        nodeId: node.id,
        nodeName: node.name,
        property: "effect",
        rawValue: node.effects.length
      })
    }
    if ("children" in node) {
      for (const c of node.children) visit(c)
    }
  }

  for (const sectionId of TIER_OK) {
    const root = await figma.getNodeByIdAsync(sectionId)
    if (root) visit(root)
  }
  return { leaks }
})()
```

The returned `leaks` array feeds Step 10's report. The audit never throws; if the walker errors, surface the error in the report under `## Raw-value leaks` as `⚠️ audit failed: <message>` and continue.
````

- [ ] **Step 2: Verify**

Run: `grep -c "### 9.5. Audit for raw values" .claude/skills/figma-page-to-library/SKILL.md`
Expected: `1`.

Run: `grep -c "A leak is" .claude/skills/figma-page-to-library/SKILL.md`
Expected: `1`.

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/figma-page-to-library/SKILL.md
git commit -m "feat(figma-page-to-library): add Step 9.5 raw-value audit"
```

---

### Task 8: Update Step 10 report format with the leak section + marker

**Files:**
- Modify: `.claude/skills/figma-page-to-library/SKILL.md` — Step 10 markdown template and the surrounding prose.

- [ ] **Step 1: Add the `## Raw-value leaks` section to the report template**

Locate the markdown template inside Step 10 (the fenced block starting with `# <source page name> — design-system reconciliation`). Insert a new section between `## Blocked` and `## Screenshots`:

```markdown
## Raw-value leaks

- <nodeName> (`<nodeId>`) — <property>: <rawValue>
- ...
```

Immediately below the template (still inside Step 10), add this paragraph:

```markdown
If the Step 9.5 walker returned an empty `leaks` array, render the section as `✓ No raw values detected.` instead of the bullet list. The section is **always present** — never omitted.

For each section in `## Swapped` or `## Composed` that contained at least one leak, append ` ⚠️ raw value leak (N)` to its line (where N is the leak count for that section). The leak marker does **not** demote the section to Blocked.
```

- [ ] **Step 2: Update the "Report accuracy rules"**

In Step 10's "Report accuracy rules" bullet list (just above the template), add a new bullet at the end:

```markdown
- The `## Raw-value leaks` section is always present. If empty, render `✓ No raw values detected.`; otherwise list every entry returned by Step 9.5. Leaks annotate their parent section line with `⚠️ raw value leak (N)` but do not change its bucket.
```

- [ ] **Step 3: Verify**

Run: `grep -c "## Raw-value leaks" .claude/skills/figma-page-to-library/SKILL.md`
Expected: ≥ `2` (template section + accuracy-rule mention).

Run: `grep -c "⚠️ raw value leak" .claude/skills/figma-page-to-library/SKILL.md`
Expected: ≥ `2`.

- [ ] **Step 4: Commit**

```bash
git add .claude/skills/figma-page-to-library/SKILL.md
git commit -m "feat(figma-page-to-library): report raw-value leaks in Step 10"
```

---

### Task 9: Smoke run against the Manager Dashboard page

This is the spec's Validation §1 — proof the hardened skill works end-to-end.

**Prerequisite:** The Manager Dashboard page (`tvclyUsdCAYDSkSPRlNYut`, node `3685-7078`) has been manually duplicated into the Experiment file per SKILL.md's "Prerequisites for best results." Both files are open in Figma Desktop.

**Files:**
- Create (by the skill): `docs/superpowers/runs/2026-05-11-tw-manager-dashboard-conversion.md`

- [ ] **Step 1: Invoke the skill**

Ask the user (or, in subagent-driven mode, dispatch a subagent): "Run `figma-page-to-library` against the Manager Dashboard page duplicated into the Experiment file." The skill drives itself per `SKILL.md`.

- [ ] **Step 2: Verify the deliverable was written**

Run: `ls docs/superpowers/runs/2026-05-11-tw-manager-dashboard-conversion.md`
Expected: file exists.

- [ ] **Step 3: Validate report shape per spec Validation §1**

Run: `grep -c "## Raw-value leaks" docs/superpowers/runs/2026-05-11-tw-manager-dashboard-conversion.md`
Expected: `1` (the audit section is always present).

Run: `grep -c "gqYWCu1K6dJ9gESXtgNeCi" docs/superpowers/runs/2026-05-11-tw-manager-dashboard-conversion.md`
Expected: ≥ `1`.

Run: `grep -c "04x9q7W2Y59baF5MqHAVZR" docs/superpowers/runs/2026-05-11-tw-manager-dashboard-conversion.md`
Expected: `0`.

Inspect manually that `## Swapped` contains at least one entry referencing a component from the regenerated map (Sidebar is a likely candidate, given the dashboard).

- [ ] **Step 4: Commit the run report**

```bash
git add docs/superpowers/runs/2026-05-11-tw-manager-dashboard-conversion.md
git commit -m "docs: run report — Manager Dashboard conversion via Experiment-retargeted skill"
```

---

## Self-review

**Spec coverage:**

| Spec section                              | Task(s)            |
| ----------------------------------------- | ------------------ |
| A. DS file as config                      | 1, 4               |
| B. Regenerated component map + icon map   | 2, 3               |
| C. Four-rule matcher cascade              | 5                  |
| D. Raw-value audit (Step 9.5)             | 7                  |
| E. Report changes (leak section + marker) | 8                  |
| Validation §1 (smoke run)                 | 9                  |
| Validation §2 (config-swap sanity)        | 2 step 3           |

Every spec section maps to at least one task. No gaps.

**Placeholder scan:** No "TBD" / "TODO" / "implement later" entries. Every code step shows real code; every command shows expected output.

**Type consistency:** `dsFileKey` is used consistently (Tasks 1, 2, 4, 6). `icon-map.json` shape (`{ name: { id, key } }`) is consistent between Tasks 2 (writer) and 6 (reader). `leaks` array shape is consistent between Task 7 (producer) and Task 8 (consumer).
