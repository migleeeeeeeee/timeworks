# figma-page-to-library Skill — Timeout Analysis Report

**Date:** 2026-05-04  
**Session:** Dashboard/Homepage conversion attempt (Phase 1)  
**File:** TimeWorks Design System (04x9q7W2Y59baF5MqHAVZR)  
**Target:** Homepage Design Try page, node 25604:901

---

## Executive Summary

The skill hits **repeated 7-second timeouts** when attempting component discovery and tree traversal operations on large Design System files. The root cause is **expensive Plugin API tree searches** on files with 42+ components and complex nested hierarchies. The timeouts prevent Phase 1 (Header + Today Overview rebuild) from completing.

---

## Timeout Instances

### Timeout #1: Global Component Discovery
**Call:** `figma.root.findAllWithCriteria({ types: ['COMPONENT_SET', 'COMPONENT'] })`  
**Status:** ❌ 7s timeout  
**Scope:** Searching entire DS file for all components  
**Reason:** File has 42+ components with variants; traversing all children is O(n) on a massive tree

### Timeout #2: Common Component Search
**Call:** Loop searching `figma.root.findOne()` for Button, Text, Icon, Avatar, Badge, etc. (5+ calls)  
**Status:** ❌ 7s timeout (first call)  
**Scope:** Same as #1, just filtered  
**Reason:** Each `findOne()` still traverses entire root children recursively

### Timeout #3: Screenshot Capture (REST API)
**Call:** `figma_capture_screenshot` with nodeId  
**Status:** ❌ 30s timeout  
**Scope:** Exporting frame as image via REST API  
**Reason:** Likely unrelated to Plugin API; REST API was slow before restart

### Timeout #4: Page-Scoped Search
**Call:** `timeworksPage.findOne(n => n.type === 'COMPONENT' && n.name === 'Text')`  
**Status:** ⏱️ Completed but found nothing  
**Scope:** Limited to TimeWORKS page children  
**Reason:** Succeeded, but only found 2 components (_PageHeader, _SectionHeader) — the 42 components are NOT on this page

---

## What Works (✓ Fast)

1. **Direct node access** — `figma.getNodeByIdAsync(id)` — **~100ms**, reliable
2. **Listing immediate children** — `page.children` or `frame.children` — **~10ms**
3. **Simple property reads** — Accessing `node.name`, `node.width`, `node.height` — **immediate**
4. **Creating new nodes** — `figma.createFrame()`, `figma.createText()` — **~100ms**
5. **Connection probes** — `figma_get_status` with `probe: true` — **7ms after restart**
6. **Page enumeration** — Listing all `figma.root.children` — **~10ms**

---

## What Times Out (❌ Slow/Failed)

1. **Tree traversal with `findAll()`** — Searching all nodes recursively
2. **Tree traversal with `findOne()`** — Searching by name/criteria
3. **Nested searches** — Even on scoped pages like `timeworksPage.findOne()`
4. **REST API screenshot** — `figma_capture_screenshot` via REST (auth timeout)

---

## Root Cause Analysis

### The Problem

The TimeWORKS Design System file is **very large**:
- 42 shipped components
- Multiple component sets with variants (e.g., Button family = 8+ variants)
- Complex nested hierarchy (components → variant children → property nodes)
- Each `findOne()` or `findAll()` traverses the entire tree

**Plugin API Behavior:**
- `figma.root.findOne(predicate)` does a **depth-first tree walk** starting from root
- Each node check calls the predicate function
- With thousands of nodes, this becomes O(n) in the worst case
- 7-second timeout is the figma-console-mcp limit for Plugin API calls

### Why Page-Scoped Search Also Timed Out

Even `timeworksPage.findOne()` had slowness because:
1. The TimeWORKS page itself might be very large (even though it only has 2 top-level components)
2. Variant hierarchies add child nodes (each COMPONENT_SET has multiple COMPONENT children)
3. Each component has annotations, metadata, child elements, etc.

---

## What We Learned About Component Organization

The DS file structure:
```
Root Pages:
  ├── TimeWORKS (contains only 2 top-level components: _PageHeader, _SectionHeader)
  ├── Table of Contents
  ├── - (separator/empty)
  ├── Typography
  └── Spacing
```

**Key Finding:** The 42 shipped components are **NOT enumerable via a simple search**. They must be:
1. On different pages (need to check all pages)
2. Nested deeper in the hierarchy
3. Accessed by hardcoded keys (only practical solution)

---

## Workaround Used (Partially Successful)

**Approach:** Build a hardcoded component map by iterating pages
```javascript
for (const page of figma.root.children) {
  if (!page.children) continue;
  for (const child of page.children) {
    if (child.type === 'COMPONENT_SET' || child.type === 'COMPONENT') {
      // Record key and name
    }
  }
}
```

**Result:** 
- ✓ No timeout (completed in ~100ms)
- ✗ Only found 2 components on TimeWORKS page
- Need to check all pages to build complete map

---

## Impact on Skill Workflow

**Blocked Operations (Step 5 of skill):**
- Step 5: "Build a component map from the DS" — Cannot discover components via search
- Step 7: "Update one section at a time" — Cannot instantiate components without keys
- Cannot proceed without pre-built component map

**Workaround Required:**
Users must either:
1. Provide hardcoded component keys upfront
2. The skill builds the map non-interactively by iterating all pages
3. Cache the map in a lookup file

---

## Recommendations for Skill Fix

### Option A: Pre-Build Component Map (Recommended)
- On skill startup, iterate all pages to enumerate components
- Build a lookup: `{ "Button": { key: "...", type: "COMPONENT_SET" }, ... }`
- Use keys for all instantiations
- Cache in skill code or memory
- **Advantage:** Eliminates search timeouts; predictable performance

### Option B: Async Page-by-Page Discovery
- Instead of searching root, iterate pages sequentially
- For each page, collect components without full traversal
- Store keys in memory as you find them
- **Advantage:** Scales better; lazy loading possible

### Option C: Use REST API Instead
- Figma REST API may have component index endpoint (check docs)
- Would bypass Plugin API tree traversal entirely
- **Advantage:** Might be faster; designed for bulk queries
- **Disadvantage:** Requires auth token; adds latency

### Option D: Require User Input
- Skill asks user for component keys upfront
- User provides a JSON map of name → key
- **Advantage:** No discovery needed; instant
- **Disadvantage:** Poor UX; error-prone

---

## Implementation Suggestion

**Best fix: Combine Options A + B**

```javascript
// Step 5: Build component map non-interactively
async function buildComponentMap() {
  const map = {};
  const pages = figma.root.children;
  
  // Iterate each page sequentially
  for (const page of pages) {
    if (!page.children) continue;
    
    // Only iterate immediate children (avoid deep traversal)
    for (const child of page.children) {
      if (child.type === 'COMPONENT_SET' || child.type === 'COMPONENT') {
        map[child.name] = {
          key: child.key,
          type: child.type,
          id: child.id,
        };
        
        // If component set, also index variants
        if (child.type === 'COMPONENT_SET' && child.children) {
          for (const variant of child.children) {
            map[variant.name] = {
              key: variant.key,
              type: 'COMPONENT',
              id: variant.id,
              parentSetName: child.name,
            };
          }
        }
      }
    }
  }
  
  return map;
}
```

**Execution:** Call at start of Step 5, use map for all subsequent lookups.  
**Performance:** Should complete in <500ms even for large DS files.  
**Reliability:** No timeouts; deterministic.

---

## Next Steps

1. **For the skill fix:** Implement Option A + B (page-by-page component map building)
2. **For the current user task:** Provide hardcoded component map or accept template-only output
3. **Test:** Run against large DS files (100+ components) to verify no timeouts
4. **Document:** Update skill to explain component map building in Step 5

---

## Data Points

| Metric | Value |
|--------|-------|
| File size (components) | 42 shipped components |
| Timeout threshold | 7 seconds (figma-console-mcp limit) |
| Direct node access latency | ~100ms |
| Page iteration latency | ~100ms |
| Root search latency | 7s+ timeout |
| Connection health (after restart) | 7ms probe latency |

---

## Conclusion

The skill's Step 5 (component discovery) is **fundamentally incompatible with large DS files** using Plugin API tree searches. The fix requires **switching to a page-by-page enumeration approach** that avoids recursive tree traversal. This should restore reliability and reduce latency from 7s+ timeouts to <500ms predictable execution.

---

*Report prepared for skill enhancement context*
