---
name: figma-remove-auto-layout
description: Use when the user asks to remove auto layout from a Figma page, flatten page layout, or strip layout mode from frames — e.g. "remove auto layout from this page", "flatten this page", "strip auto layout". Recursively strips layoutMode from every frame on the current Figma page and freezes children at their pre-mutation absolute positions so the visual appearance is preserved.
---

# figma-remove-auto-layout

Remove auto layout from every frame on the current Figma page, recursively, while preserving the visual layout by freezing each child at its absolute position.

This skill **only mutates Figma**. It never writes to `src/` and never generates code. If the user wants code, this is the wrong skill.

## When to use

Trigger phrases:
- "remove auto layout from this page"
- "remove auto layout from the page"
- "flatten this page" / "flatten page layout"
- "strip auto layout from this page"

## When NOT to use

- The user wants auto layout removed from a single selected frame only (this skill processes the whole page).
- The user wants to convert a page to use the design-system library — that's `figma-page-to-library`.
- The user wants code generated — that's `figma-to-code` or `figma-selection-to-code`.

## Required tools

| Tool | Purpose |
|------|---------|
| `mcp__figma-console__figma_get_status` | Connection check |
| `mcp__figma-console__figma_reconnect` | One retry if disconnected |
| `mcp__figma-console__figma_list_open_files` | Confirm active file |
| `mcp__figma-console__figma_execute` | Run plugin API code (collect + mutate) |
| `mcp__figma-console__figma_take_screenshot` | Visual verification after mutation |

## Pre-flight (do these first, in order)

1. Call `mcp__figma-console__figma_get_status`. If `connected !== true`, call `mcp__figma-console__figma_reconnect` once. If still disconnected, stop and tell the user to open Figma Desktop with the plugin running.
2. Call `mcp__figma-console__figma_list_open_files`. Report the active file name to the user.
3. Read the current page name via `figma_execute` and echo it back: *"Working on page 'X' in file 'Y'."* Wait nothing — proceed.

## Workflow

### 1. Collect all auto-layout frames (one `figma_execute` call)

Walk `figma.currentPage` depth-first and collect every node where `layoutMode !== 'NONE'`. Record each id along with its depth so the mutate pass can run bottom-up.

```js
(async () => {
  await figma.loadAllPagesAsync();
  const found = [];
  function walk(node, depth) {
    const isContainer = node.type === 'FRAME'
      || node.type === 'COMPONENT'
      || node.type === 'INSTANCE'
      || node.type === 'COMPONENT_SET';
    if (isContainer && node.layoutMode && node.layoutMode !== 'NONE') {
      found.push({ id: node.id, name: node.name, depth, locked: node.locked });
    }
    if ('children' in node) {
      for (const child of node.children) walk(child, depth + 1);
    }
  }
  for (const child of figma.currentPage.children) walk(child, 1);
  return { page: figma.currentPage.name, frames: found };
})();
```

Report the count: *"Found N auto-layout frames on page 'X'."* If `N === 0`, stop with a friendly message.

### 2. Strip auto layout, freeze children (bottom-up)

Sort the collected list by `depth` descending so the deepest frames mutate first. Then run the mutation in a single `figma_execute` call (passing the sorted id list inline). Skip locked nodes and collect their names for the final report.

**Why bottom-up:** If a parent's `layoutMode` is removed first, its children's `absoluteBoundingBox` values shift before the deeper frames are measured. Bottom-up keeps every freeze calculation accurate.

```js
(async () => {
  // Sorted ids (deepest first) interpolated by the caller:
  const ids = [/* ... */];
  const skipped = [];
  const processed = [];

  for (const id of ids) {
    const node = await figma.getNodeByIdAsync(id);
    if (!node) continue;
    if (node.locked) { skipped.push(node.name); continue; }

    // 1. Capture absolute bounds BEFORE mutation
    const parentAbs = node.absoluteBoundingBox;
    const childData = node.children.map(c => ({
      id: c.id,
      absX: c.absoluteBoundingBox.x,
      absY: c.absoluteBoundingBox.y,
    }));

    // 2. Remove auto layout
    node.layoutMode = 'NONE';

    // 3. Freeze each direct child at its pre-mutation absolute position
    for (const { id: childId, absX, absY } of childData) {
      const child = await figma.getNodeByIdAsync(childId);
      if (!child) continue;
      child.x = absX - parentAbs.x;
      child.y = absY - parentAbs.y;
    }

    processed.push(node.name);
  }

  return { processed: processed.length, skipped };
})();
```

### 3. Screenshot & verify

Call `mcp__figma-console__figma_take_screenshot` of the current page. Scan for obvious collapse (multiple children stacked at 0,0, frames suddenly empty-looking). If anything looks wrong, name the suspect frame in the report.

### 4. Report

Emit a final summary:

- Page name
- Total frames processed
- Skipped (locked) frames by name, if any
- Screenshot taken: yes/no
- Any visual concerns spotted

## Critical conventions (from project context)

- **`figma_execute` payloads must `return` a value or `throw`.** Never call `figma.closePlugin`. This matches the `figma-page-to-library` conventions used elsewhere in this repo.
- **Always `await figma.loadAllPagesAsync()`** before walking the tree — required by the Figma Plugin API in dynamic-page mode.
- **Bottom-up ordering is mandatory.** Top-down corrupts the freeze math.
- **Two `figma_execute` calls** (one collect, one mutate) — don't try to do both in one giant payload; the collect output informs the mutate call's sorted id list.

## Failure modes

| Symptom | Likely cause | Fix |
|---------|-------------|-----|
| `getNodeByIdAsync` returns `null` for a child | Child was deleted/replaced between the collect and mutate calls | Skip silently; continue |
| Children stack at 0,0 after mutation | Parent processed before children (top-down order) | Re-sort by depth descending and rerun |
| `node.absoluteBoundingBox` is `null` | Frame is hidden or has zero size | Skip; log name |
| Plugin disconnected mid-run | Figma Desktop closed or reloaded | Reconnect, re-run from collect step (operation is idempotent — frames already at `layoutMode: 'NONE'` are simply not collected again) |

## Scope boundaries

- This skill does **not** touch `layoutMode` of frames on other pages.
- This skill does **not** rewrite component instances' main components — only the local frame's `layoutMode` property.
- This skill does **not** modify constraints, padding, or any other layout property — just `layoutMode` and direct children's `x`/`y`.
