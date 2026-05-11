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

For each section in the inventory, decide:

- which map entry (by name) is the right family
- what variant properties to apply via `setProperties` after instantiation
- one-to-one swap vs composition
- text/instance property keys needed for overrides

**Variant matching — never default blindly.** Before choosing variant properties, inspect the source section for:

- semantic cues from name, copy, usage
- visual cues — fills, strokes, effects, radius, typography
- existing variant-like traits in the screen (primary vs secondary buttons, etc.)

If the family is right but the variant is ambiguous, call it out instead of silently using the default. The Figma component pages (Accordion, Button, etc.) document each component's available variant properties; consult them when a section's intent isn't obvious.

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

```javascript
;(async () => {
  try {
    const props = newInstance.componentProperties
    // Find icon property (e.g., 'Icon', 'LeftIcon', 'StartIcon', etc.)
    const iconPropKey = Object.keys(props ?? {}).find(
      (k) => k.toLowerCase().includes("icon") && props[k].type === "INSTANCE_SWAP"
    )

    if (!iconPropKey || !instanceHints) return

    // Extract icon name from old component (e.g., "Icons/ChevronDown")
    const oldIconName = instanceHints[iconPropKey] ?? ""
    const iconNameHint = oldIconName.split("/").pop() // "ChevronDown"

    if (!iconNameHint) return // No icon hint to work with

    // Icons are not in component-map.json today. If the source instance
    // already exposes a usable icon node id via instanceHints, set it
    // directly; otherwise leave the DS default and flag in the report.
    const oldIconId = instanceHints[`${iconPropKey}__id`]
    if (oldIconId) {
      newInstance.setProperties({ [iconPropKey]: oldIconId })
    }
    // Do NOT fall back to figma.root.findOne — it will time out on the DS file.
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

## Screenshots

| Stage          | Source | Result |
| -------------- | ------ | ------ |
| Full target    | <URI>  | <URI>  |
| <section name> | <URI>  | <URI>  |

## Backup

Backup frame: `Backup - <original name>` (node `<id>`)
```

If nothing was actually substituted, be explicit: `❌ No substitutions made — the target was cloned but no components were upgraded. See Blocked section for details.`

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
