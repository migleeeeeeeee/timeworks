---
name: figma-page-to-library
description: Connects an existing Figma page or frame in a TimeWorks product file to the published Design System library — replacing detached layers, local wrappers, and one-off components with library instances or compositions of library primitives. Section-by-section, not all-at-once. Drives the figma-console MCP via Plugin API only; both the source file AND the DS file named in `ds-config.json` (currently the Experiment file `gqYWCu1K6dJ9gESXtgNeCi`) must be open in Figma Desktop. Use when the user pastes a Figma URL with intent like "convert this page to the library", "rebuild this in the design system", "swap to library components". Does NOT generate React code — that is the figma-to-code skill.
---

# figma-page-to-library

Adapted from Eden Spiekermann's `apply-design-system` workflow, retargeted at the figma-console MCP (https://github.com/southleft/figma-console-mcp).

Use this skill for an existing Figma page that should reuse the published TimeWorks Design System instead of detached layers, local wrappers, or one-off components.

## Entry modes and prerequisites

**Three entry modes:**

- `review-then-apply` — the user wants a broad pass on a whole page; the offending sections aren't yet identified.
- `apply-known-scope` — the user already knows which section or frame should be brought onto the design system (most common).
- `work-in-DS-file` — the target page has already been duplicated into the DS file; the skill operates locally with no cross-file imports.

If the URL points to a `PAGE` → `review-then-apply`. If it points to a `FRAME` / `SECTION` → `apply-known-scope`. If `fileKey == dsFileKey` (from `ds-config.json`) and the URL points to a duplicated product page → `work-in-DS-file`.

**Prerequisites for best results:**

Both the source product file AND the DS file (key from `ds-config.json`) must be open in Figma Desktop. **For smoothest workflow, manually duplicate the target page into the DS file first:**

1. In the source file, right-click the page tab
2. Select "Move to file" or "Duplicate to file"
3. Choose the TimeWorks Design System file

This unlocks local component access and avoids cross-file import limitations. If you skip this step, the skill can still work with some constraints (see Step 5).

## CRITICAL: figma_execute payload conventions

The figma-console-mcp Desktop Bridge is a **persistent** plugin held open across calls. **Never** call `figma.closePlugin(...)` or `figma.closePluginWithFailure(...)` inside a `figma_execute` payload — those calls shut down the Desktop Bridge and drop the WebSocket, requiring the user to manually re-launch the plugin.

Correct pattern: `return` the result from the async IIFE; `throw` on error.

```javascript
// ✅ Correct — Desktop Bridge stays alive
;(async () => {
  const frame = await figma.getNodeByIdAsync("FRAME_ID")
  // ...do work...
  return { sections }
})()(
  // ❌ Wrong — closes the Desktop Bridge plugin
  async () => {
    // ...
    figma.closePlugin(JSON.stringify({ sections })) // ← BRIDGE DIES HERE
  }
)()
```

Any code pattern copied from skills written for the official Figma MCP (Eden Spiekermann's `apply-design-system`, etc.) must be retargeted to use `return` / `throw`. `figma.notify(...)` is fine for visible debug output and does not affect the bridge.

## Required tools

All Figma I/O goes through `mcp__figma-console__*`. **Plugin API only — no REST, no Team Library indexing.** Both the source file and the DS library file must be open in Figma Desktop.

- `figma_get_status` — connection check.
- `figma_get_file_data` — metadata for a page/frame.
- `figma_navigate` — switch the active file.
- `figma_execute` — run Plugin API code (the main verb for both reads and writes).
- `figma_take_screenshot` — visual validation per section.
- `figma_set_annotations` — informational stickers on rebuilt nodes.

`figma_search_components` and any `figma.root.findOne` / `findAll` / `findAllWithCriteria` calls against the DS file are **forbidden** — they time out on large DS files. All DS component lookup goes through the static `component-map.json` (see Step 5).

## Core rule

Do not treat a section as "connected" just because it contains a few design-system buttons or icons. Classify each section into exactly one bucket:

- `already-connected` — the section is a library instance or a composition the user accepts as canonical.
- `exact-swap` — a published library component or variant can replace the section directly.
- `compose-from-primitives` — no single library component matches, but the section can be rebuilt from library primitives (Button, Avatar, Tag, Text, etc.).
- `blocked` — the library doesn't expose the needed components, imports fail, or the section is intentionally bespoke.

## Workflow

### 1. Verify connection and file state

**Call:** `mcp__figma-console__figma_get_status`. Confirm:

1. A Figma Desktop instance is connected.
2. Source `fileKey` (parsed from the URL) is open.
3. DS `fileKey` (read from `.claude/skills/figma-page-to-library/ds-config.json` as `dsFileKey`) is open.

Read `ds-config.json` once at the start of the run and reuse the resolved `dsFileKey` everywhere below.
If anything is missing, halt with a specific message naming what to fix.

### 2. Determine scope

Parse the URL into `fileKey` + `nodeId`.

**If `fileKey == dsFileKey`:** This is a `work-in-DS-file` run. The DS file contains both the library components AND the duplicated product page. Proceed normally; skip the cross-file import steps below.

**If `fileKey != dsFileKey`:** This is a source-file run. Navigate to that file.

**Call:** `mcp__figma-console__figma_navigate` to the target URL (source file or DS file).

**Call:** `mcp__figma-console__figma_get_file_data` for metadata. Determine entry mode (page vs frame, and whether this is a work-in-DS-file run).

If `review-then-apply` and the page has many sections, list the top-level sections to the user before proceeding section-by-section. The user may narrow the scope.

### 3. Capture current state and back up the target

**Call:** `mcp__figma-console__figma_take_screenshot` of the source target. Save URI for the deliverable.

**Call:** `mcp__figma-console__figma_execute` with code that:

- Duplicates the target page or frame.
- Names the duplicate `Backup - <original name>` and places it to the right of the original.
- Returns the backup node id.

The skill works on the **original** target. The backup is the safety net.

### 4. Inventory the existing screen

**Call:** `mcp__figma-console__figma_execute` with a Plugin API walker that, for the target frame, returns each section's:

- instance id, name
- `mainComponent` name + `key`
- whether `mainComponent` is local, remote (library), or missing
- nested published-component instances inside any local wrapper
- exposed text + variant properties

Read-only inventory pattern (figma-console-mcp safe — uses `return`, NOT `figma.closePlugin`):

```javascript
;(async () => {
  const frame = await figma.getNodeByIdAsync("FRAME_ID")
  if (!frame) {
    throw new Error("Frame FRAME_ID not found on the active page")
  }
  const sections = frame
    .findAll((n) => n.type === "INSTANCE")
    .map((inst) => {
      const mc = inst.mainComponent
      const cs = mc?.parent?.type === "COMPONENT_SET" ? mc.parent : null
      return {
        instanceId: inst.id,
        instanceName: inst.name,
        componentName: mc?.name ?? null,
        componentKey: mc?.key ?? null,
        componentSetName: cs?.name ?? null,
        componentSetKey: cs?.key ?? null,
        isRemote: mc?.remote ?? false
      }
    })
  return { sections }
})()
```

**Do not** wrap this in a `try { ... figma.closePlugin(...) } catch { figma.closePluginWithFailure(...) }` — that pattern is for one-shot plugins. The Desktop Bridge is persistent.

Prefer **exact keys over names**. Names are only hints.

If the target frame has many nodes, walk in chunks (~200 per `figma_execute` call) to avoid the ~7s WebSocket timeout. Use a cursor pattern — return unvisited child ids when the budget is hit, then call again with each child id.

### 5. Load the component map

Read the static lookup file shipped with this skill:

```
.claude/skills/figma-page-to-library/component-map.json
```

It is the authoritative DS component map. Shape:

```json
{ "Button": { "id": "46939:93756", "key": "760bd6382d70689bf1ef2beafa6f21b4519425e0" }, ... }
```

Each entry points at one specific COMPONENT (the "default" variant for variant-bearing components). Variant swapping happens at runtime via `instance.setProperties({...})` — the parent COMPONENT_SET is resolved automatically.

**Never call `figma.root.findOne`, `findAll`, or `findAllWithCriteria` against the DS file.** They will time out on large DS files (7-second WebSocket limit). If a needed component is missing from the map, halt and tell the user to add it to `component-map.json` — do not fall back to searching.

`figma_search_components` is similarly forbidden as a discovery path. The map is the only source.

For each section in the inventory, the agent reasons through the **classification cascade** below. The cascade is **judgment-first**: the agent reads the section's full context (name + ancestors + children + text content + visual signature) and picks the closest DS component before falling back to deterministic rules. The first rule that lands wins.

> **Why judgment-first:** Real product files use semantic layer names that don't match a fixed alias table — "Idle Status", "Task Timer Container", "Project Header", "Time Separator". A deterministic alias table will silently skip these and leave the page raw. The cascade is structured so the agent must explicitly reason about each section before falling through to the dumb-defaults at the end.

#### Step A — Read the section's full context

Before classifying, gather:

1. **Layer name** + the chain of ancestor names up to the target frame. Names usually encode intent (`Task Timer Container > Task Status Container > Idle Status`).
2. **Children:**
   - For each child `TEXT` node: its `name`, `characters`, `fontSize`, `width`, `height`. Text content is the strongest semantic signal (`"IDLE"`, `"00:12:34"`, `"Drafting Proposals"`, `"Details"`).
   - For each child `INSTANCE`: its `mainComponent.name`.
   - Counts of `RECTANGLE` / `VECTOR` / `GROUP` / `FRAME` children.
3. **Visual signature:** `cornerRadius` (bucketed: `none` 0, `xs` ≤4, `sm` ≤8, `md` ≤12, `lg` ≤16, `xl` ≤24, `full` >24), `hasStroke`, `hasFill`, `width`, `height`, `aspect ratio`.
4. **Already-bound state:** does the section already use library instances? Are its fills/text-styles already bound to DS variables?

#### Rule 1 — Existing key match (deterministic)

If the section is itself an `INSTANCE` and its `mainComponent.key` exists in `component-map.json`, treat as `exact-swap`. Preserve overrides via `setProperties` after re-instantiating from the map (or `swapComponent` to repoint at the canonical Experiment-file source).

#### Rule 2 — Semantic match (judgment)

Using the context from Step A, pick the **closest** DS component from `component-map.json` by reasoning about intent. The match doesn't need a literal name overlap — it needs a semantic fit.

**Write a one-line rationale** before swapping, so the report can show the reasoning:

```
<Source path>  →  <DS component>  (variant: <variant>)  — because <one-line reason>
```

Example rationales drawn from a real TimeWorks page (use as a learning reference, not a fixed table):

| Source layer (path) | Children / content | DS pick | Rationale |
| ------------------- | ------------------ | ------- | --------- |
| `Idle Status` (40×24 pill) | text "IDLE" + separator + duration | `Badge` (variant: warning/idle) | Small pill with status label + duration → status indicator. |
| `Break Label` group | text "Lunch" + "-" + "00:30:00" | `Badge` (variant: info) | Same shape as Idle Status; label + duration. |
| `Task Title` | text "Drafting Proposals" only | _no swap_ — Text-style only | Single text node; typography binding is sufficient. |
| `Project Header` (94×24) | text "Projects" | _no swap_ — Text-style only | Section heading; one TEXT child. |
| `Task Timer Container` (310×150) | Title + status pill + time readouts | `compose-from-primitives`: Text + Badge | No single component fits a multi-line timer header. |
| `Project Task Title` row | name + "|" + time + "|" + short title | `compose-from-primitives`: `List item` | Repeated row → DS List item with overrides. |
| `Input Field` | placeholder "Search Tasks" | `Search` (variant: Large/Default) | Magnifying-glass + placeholder → Search field. |
| `"Details" labels` | text "Details", 10px, clickable look | `Link` (or Text styled as link) | Repeated affordance to expand a row. |
| `Bottom Bar` (1400×44) | mixed status bar | Tier-3 `annotate-and-preserve` | App chrome with no DS analogue. |

Variant inference — from visual cues, in order:

- **Size variant** from height bucket: `<28` → `xs/sm`, `28–36` → `md` (DS default), `>36` → `lg`.
- **Tone variant** from text content + fill color:
  - "IDLE" / "Pending" / yellow fill → `warning`
  - "Working" / green fill / "Completed" → `positive`
  - "Error" / "Failed" / red fill → `negative`
  - "Lunch" / "Break" / neutral fill → `info` or `neutral`
- **Outlined vs filled** from stroke presence.
- **With-icon** if a nested INSTANCE name appears in `icon-map.json`.

If the family is right but variant is genuinely ambiguous, instantiate the default and flag in the report with `⚠️ variant ambiguous` — do not silently pick.

#### Rule 3 — Compose from primitives (when no single component fits)

When a section is a container around multiple semantic pieces (e.g. row with avatar + name + role + action button), instantiate two or more DS primitives side-by-side and group them. Rationale line:

```
<Source path>  →  compose: <Primitive A> + <Primitive B> + ...  — because <reason>
```

Typical compositions:

- Header row → `Avatar` + `Text` + `Button`
- Timer header → `Text` (title) + `Badge` (status) + `Text` (time)
- List row → `List item` with text overrides + optional `Tag`
- Stat card → `Text` (label) + `Text` (number) + optional `Badge` (delta)

#### Rule 4 — Token binding only (no component swap)

When the section has no obvious DS component but is just text + simple shapes (e.g. a section heading, a label, a divider), do not swap. Instead:

1. Bind every TEXT to the nearest DS text style by fontSize + weight.
2. Bind every SOLID fill / stroke to a DS color variable. Prefer semantic tokens (`primary-text-color`, `secondary-text-color`, `ui-background-color`, `ui-border-color`) when the source RGB is a neutral; reserve named brand colors for accents.
3. Bind every non-zero corner radius to a `space-*` token if its value matches the DS scale (4/8/12/16/24). If the value is non-standard (e.g. 100 for pill, 10, 5), record it as a **Tokens Studio gap** in the report rather than guessing.

This rule applies to the **majority** of leaf elements on most product pages and is responsible for the bulk of "fonts / colors use the style, not raw values" outcomes.

#### Rule 5 — Annotate-and-preserve (fall through)

Only when Rules 1–4 all fail (truly bespoke chrome, no token equivalent, no semantic match): annotate the node with `figma_set_annotations` explaining why and leave it alone. Examples: custom app titlebars, bespoke marketing illustrations, demo placeholders that aren't part of the product.

#### Tokens Studio gap reporting

While running Rule 4, the skill collects raw values that have no DS equivalent (status palette RGBs, non-standard radii, custom shadows). In Step 10's report, surface these as a **`## Tokens Studio gaps`** section so the human can decide whether to:

- Promote them to a new token family (e.g. add `status-idle`, `status-working`, `radius-full` to Tokens Studio), or
- Rebuild the affected sections with DS primitives that bring their own styling.

This converts every "leak" into either a Tokens Studio task or a compose-from-primitives task — both are clear next actions, neither is the skill's failure.

**Variant matching — never default blindly.** When Rule 1 or Rule 2 yields a family but the variant is genuinely ambiguous, instantiate the default, flag the section with `⚠️ variant ambiguous` in the report, and move on. The Experiment file's component pages document each component's variant properties; consult them when intent is unclear.

### 6. Decide section strategy (per section)

Apply the four buckets:

- `exact-swap` — library component matches the section's job and structure closely enough that swapping preserves intent.
- `compose-from-primitives` — section is a container around library pieces (avatar + badge + text + buttons).
- `already-connected` — leave alone.
- `blocked` — library lacks it, import fails, or it's intentionally bespoke.

TimeWorks-specific patterns to expect:

- Header summary blocks → usually `compose-from-primitives` (Avatar + Text + Button, etc.).
- Banners and Tags → strong `exact-swap` candidates.
- Stat cards / metric cards → usually `compose-from-primitives` unless the DS adds a Stat component.
- Tables → `exact-swap` to the existing Table family (Cell, Column, Header, Row).
- Bottom nav / sidebars → custom containers built from primitives.

### 7. Update one section at a time

**Never rewrite the entire screen in one `figma_execute` call.** For each section:

1. Read the current node ids.
2. Locate the library component (local lookup via key; use the component map from Step 5).
3. Match the closest variant before swapping/rebuilding.
4. Detect whether the parent uses auto-layout.
5. Create or swap only that section.
6. Return all mutated node ids.
7. **Validate per section** — `figma_take_screenshot` of the section after the change, before moving on.

**Component instantiation pattern (use the component map; never `findOne`):**

```javascript
// ✅ Same-file (work-in-DS-file mode): resolve by id
;(async () => {
  const node = await figma.getNodeByIdAsync(MAP_ENTRY_ID) // from component-map.json
  if (!node) throw new Error(`Component ${MAP_ENTRY_ID} not found in this file`)
  const instance = node.createInstance()
  instance.setProperties({
    /* e.g. Variant: "Primary", Size: "md" */
  })
  return { instanceId: instance.id }
})()(
  // ✅ Cross-file (source-file mode): resolve by key
  async () => {
    const component = await figma.importComponentByKeyAsync(MAP_ENTRY_KEY) // from component-map.json
    const instance = component.createInstance()
    instance.setProperties({
      /* variant overrides */
    })
    return { instanceId: instance.id }
  }
)()
```

`setProperties` walks to the parent COMPONENT_SET automatically, so swapping variants from the default works without re-resolving anything.

Prefer `swapComponent()` when the existing node is already an instance of a compatible family and you want to preserve overrides:

```javascript
;(async () => {
  const oldInstance = await figma.getNodeByIdAsync(INSTANCE_ID)
  // Same-file: getNodeByIdAsync. Cross-file: importComponentByKeyAsync.
  const newComponent = await figma.getNodeByIdAsync(MAP_ENTRY_ID)
  oldInstance.swapComponent(newComponent)
  return { success: true }
})()
```

Prefer **rebuilding beside the original** when:

- the old section is a local wrapper around mixed content
- you need to compare visually before replacing
- you're composing from multiple primitives

**Auto-layout vs absolute parents.** When the parent is not auto-layout, treat replacement as a layout-risk operation:

- Preserve `x` and `y` explicitly.
- Preserve width/height explicitly when the replacement should occupy the same footprint.
- Do not assume the new instance will inherit position or size.
- Warn the user that absolute or grouped parents can drift after swaps or rebuilds.
- Suggest converting the parent to auto-layout only when the user wants structural cleanup, not as the default move.

**Post-swap: preserve data, let DS styling work**

After creating or swapping to a DS component, **do not re-apply the old design's colors or typography**. DS components have correct styling built in. Instead:

- Preserve only DATA (text content, icon references)
- Let the new DS component define all visual styling (colors, typography, spacing)

**1. Capture old state (data only, no styling):**

```javascript
// Read the old section's data: text content and icon references only
;(async () => {
  const oldNode = await figma.getNodeByIdAsync(OLD_SECTION_ID)
  const textMap = {}
  const instanceHints = {}

  // Capture ONLY text content (characters), not styling
  oldNode
    .findAll((n) => n.type === "TEXT")
    .forEach((t) => {
      textMap[t.name] = t.characters // Just the text, no fontSize/lineHeight
    })

  // Capture icon instance hints for matching to DS icons
  oldNode
    .findAll((n) => n.type === "INSTANCE")
    .forEach((inst) => {
      instanceHints[inst.name] = inst.mainComponent?.name ?? null
    })

  return { textMap, instanceHints }
})()
```

**2. Apply text content only (let DS text styles work):**

```javascript
;(async () => {
  const textNodes = newInstance.findAll((n) => n.type === "TEXT")

  textNodes.forEach((node) => {
    try {
      // Restore ONLY text content, not styling
      // Let the DS component's text style define the typography
      const oldText = textMap[node.name]
      if (oldText) {
        node.characters = oldText
      }
    } catch (err) {
      console.warn(`Text content update failed for ${node.name}: ${err.message}`)
    }
  })
})()
```

**3. Set icon override on button/icon components (the only hard override needed):**

Load `icon-map.json` at the start of the run alongside `component-map.json`. For each Tier-1 swap whose target has an `INSTANCE_SWAP` property containing "icon", resolve the icon by name through `icon-map.json` — by id when running in the DS file, by key when running cross-file. If the name isn't in the map, log a warning and leave the DS component's default icon in place. **Never** fall back to `figma.root.findOne` — it will time out.

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

**Critical:** Do NOT capture fills, text styles, or other visual properties from the old component. Those MUST come from the DS component definition, not from old overrides. If fills or typography are wrong after the swap, the issue is likely that the DS component was substituted incorrectly (wrong component choice in Step 6), not a property application issue.

**On any failure:** Catch the error, record it with the verbatim message, and move to the next section. **Never halt the run.** Implement the fallback chain (see Step 8).

### 8. Implement the four-tier fallback chain

When a section cannot be handled at Tier 1 (exact match), implement this chain. **Complete all sections; never halt.**

| Tier | Strategy                    | Action                                                                                                     | Report As              |
| ---- | --------------------------- | ---------------------------------------------------------------------------------------------------------- | ---------------------- |
| 1    | **exact-swap**              | Find a single DS component that matches the section's job exactly. Swap or rebuild with a single instance. | `🔄 swapped`           |
| 2    | **compose-from-primitives** | If no single component fits, rebuild the section using 2+ DS primitives (e.g., Avatar + Text + Button).    | `🔄 composed`          |
| 3    | **annotate-and-preserve**   | If the library has no suitable components, keep the node as-is and attach an annotation explaining why.    | `✓ annotated as-is`    |
| 4    | **flag-and-skip**           | For truly bespoke or blocked nodes, leave untouched and flag in the report.                                | `❌ blocked: <reason>` |

**Error handling rule:** When Tier 1 fails, catch the error and attempt Tier 2. When Tier 2 fails or doesn't apply, fall through to Tier 3. When Tier 3 is not applicable (bespoke node), use Tier 4. Never re-throw; always record the error and proceed to the next section.

Example:

```javascript
// Tier 1: Exact match?
const exactComponent = dsComponentMap.find((c) => c.name === NEEDED_COMPONENT)
if (exactComponent) {
  // Tier 1 succeeded
  return { tier: 1, componentKey: exactComponent.key }
}

// Tier 2: Compose from primitives?
const Icon = dsComponentMap.find((c) => c.name === "Icon")
const Text = dsComponentMap.find((c) => c.name === "Text")
if (Icon && Text) {
  // Tier 2 succeeded
  return { tier: 2, primitives: ["Icon", "Text"] }
}

// Tier 3: Preserve as-is
return { tier: 3, reason: "No DS equivalent; preserved with annotation" }
```

### 9. Validate what actually changed

After **each section**:

- `figma_take_screenshot` of the changed section, not only the full frame.
- Confirm placeholder text is gone.
- Confirm the instance is really linked to a library component (`mainComponent.remote === true` or similar check).
- Confirm spacing did not regress.

After **the full pass**:

- `figma_take_screenshot` of the full target.
- `figma_set_annotations` on each section with its bucket: `🔄 swapped`, `🔄 composed`, `✓ already-connected`, or `❌ blocked: <reason>`.

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

### 10. Deliverable

Write a markdown report at:

```
docs/superpowers/runs/YYYY-MM-DD-<source-file-slug>-<page-name>-conversion.md
```

**Report accuracy rules:**

- Only list a section under "Swapped" if the node is now a library instance (`mainComponent.remote === true`) OR was created fresh from a local DS component with `mainComponent.key` matching a known DS key.
- Only list a section under "Composed" if at least one of the component instances is newly created from a DS primitive or swapped.
- If a section has NO changes, it must appear in "Already connected" (if it was already a DS instance) or "Blocked" (if unconverted), NOT in "Swapped" or "Composed".
- If ALL sections are blocked, open the report with `❌ No substitutions made — see Blocked section for details` before any other content.
- The `## Raw-value leaks` section is always present. If empty, render `✓ No raw values detected.`; otherwise list every entry returned by Step 9.5. Leaks annotate their parent section line with `⚠️ raw value leak (N)` but do not change its bucket.

Format:

```markdown
# <source page name> — design-system reconciliation

## Swapped

- <section name> → <DS component> (variant: <variant>) — node `<id>`
- ...

## Composed

- <section name> → <Primitive A> + <Primitive B> + ... — node `<id>`
- ...

## Already connected

- <section name> — node `<id>` (already an instance of <DS component>)

## Blocked

- <section name> — reason: <verbatim error or library-not-enabled> — node `<id>`
- ...

## Raw-value leaks

- <nodeName> (`<nodeId>`) — <property>: <rawValue>
- ...

## Screenshots

| Stage          | Source | Result |
| -------------- | ------ | ------ |
| Full target    | <URI>  | <URI>  |
| <section name> | <URI>  | <URI>  |

## Backup

Backup frame: `Backup - <original name>` (node `<id>`)
```

If nothing was actually substituted, be explicit: `❌ No substitutions made — the target was cloned but no components were upgraded. See Blocked section for details.`

If the Step 9.5 walker returned an empty `leaks` array, render the section as `✓ No raw values detected.` instead of the bullet list. The section is **always present** — never omitted.

For each section in `## Swapped` or `## Composed` that contained at least one leak, append ` ⚠️ raw value leak (N)` to its line (where N is the leak count for that section). The leak marker does **not** demote the section to Blocked.

## Writing rules

- Work incrementally. Preserve the backup.
- Prefer direct DS inspection over `figma_search_components`.
- Prefer exact component keys over names.
- Match the variant to the original visual treatment, not just the correct family.
- Preserve position and size explicitly when replacing inside non-auto-layout parents.
- Use imperative evidence in the report — node names, keys, component families, and whether the final node is local or library-backed.
- Do not claim full reconnection when the result is still a local shell around shared children.
- If a section must remain bespoke, say so and explain why.

## Failure modes

| Symptom                                                                                                       | Likely cause                                                                     | Fix                                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `figma_get_status` reports either file not open                                                               | DS or source not loaded in Figma Desktop                                         | Open both in Figma Desktop and re-run                                                                                                                                                  |
| "Swap component" fails with "component not found"                                                             | Component key doesn't match the target component's main component family         | Verify the component key from Step 5; try a different component family                                                                                                                 |
| `figma_execute` times out                                                                                     | Single call walked too many nodes                                                | Reduce per-call budget below 200 nodes; use chunking for large frames                                                                                                                  |
| 403 / "Invalid token" anywhere                                                                                | A REST call slipped into a `figma_execute` payload                               | Bug — the skill should only use Plugin API (no MCP REST calls). Surface the call site and stop.                                                                                        |
| `figma_execute` times out on a DS lookup                                                                      | A `findOne` / `findAll` slipped into a payload                                   | Bug — DS lookups must use `component-map.json` + `getNodeByIdAsync` / `importComponentByKeyAsync`. Surface the call site and fix.                                                      |
| Component name not in `component-map.json`                                                                    | DS added a new component since the map was generated                             | Halt the section, tell the user which name is missing, and ask them to add an entry. Do not fall back to `findOne`.                                                                    |
| Desktop Bridge plugin closes after one `figma_execute`; subsequent calls fail with "no active Figma instance" | A payload called `figma.closePlugin(...)` or `figma.closePluginWithFailure(...)` | Bug — payloads must `return` results and `throw` errors; never `closePlugin`. Fix the payload, restart Desktop Bridge plugin, re-run.                                                  |
| Backup frame missing after run                                                                                | Step 3 (backup creation) failed silently                                         | Bug; check the backup creation `figma_execute` call, fix it, and re-run.                                                                                                               |
| All sections land in "Blocked" (no swaps or composes)                                                         | Tier 1 and 2 failed for every section; library doesn't have matching components  | Expected in rare cases. Review the library composition; either add missing components or document the sections as intentionally custom.                                                |
| Page duplicated into DS file but skill refuses to run on it                                                   | Skill treating DS file as library-only (Step 2 check)                            | Ensure the page is actually copied into the DS file (fileKey should match `dsFileKey` in `ds-config.json`). Retry. If this is a new page, re-run with `figma_navigate` to the DS file URL first. |

## When NOT to use this skill

- Single targeted finding from a design audit → use a narrower fix workflow instead.
- Brand-new component design → `figma-design`.
- Generating React code from a Figma component → `figma-to-code`.

## References

- Inspired by Eden Spiekermann's `apply-design-system` skill: https://github.com/edenspiekermann/Skills/blob/main/skills/apply-design-system/SKILL.md
- figma-console MCP: https://github.com/southleft/figma-console-mcp
- Spec: `docs/superpowers/specs/2026-04-30-figma-page-to-library-design.md`
- Related skills: `figma-design` (upstream component authoring), `figma-to-code` (downstream code generation)
