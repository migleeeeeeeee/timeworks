# Overtime Modal (Figma) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the post-clock-out Overtime Modal on the Desktop App page of the TimeWorks DS Figma file, mirroring the existing Idle Modal pattern (new body component + Modal/Basic instance with slot swap).

**Architecture:** Clone the existing `Idle Modal Body` component → re-text → `Overtime Modal Body`; clone the existing `Idle Modal` instance → swap its body slot to the new component → re-text title/buttons → `Overtime Modal`. All styling/tokens are inherited via cloning — nothing is rebuilt from primitives.

**Tech Stack:** figma-console MCP (`figma_execute` Plugin API, `figma_take_screenshot` for verification). No code changes in this repo. Spec: `docs/superpowers/specs/2026-06-02-overtime-modal-design.md`.

---

## Ground truth (discovered 2026-06-02, this session)

- **File:** `gqYWCu1K6dJ9gESXtgNeCi` (TimeWorks Design System, Experiment file) — Desktop Bridge plugin must be open in this file.
- **Page:** `Desktop App` (canvas `27464:128248`).
- **Idle Modal instance:** `28077:24276` at (2954, 11654), 480×450. Main component: `Modal / Basic` variant `Size=Small, Scroll=No` (`46947:768`, local, "Modal" page).
- **Body slot prop on the modal instance:** `🔁 slot#5121:17` (INSTANCE_SWAP), currently → `27922:980314`.
- **`Idle Modal Body` component `27922:980314` is a GHOST** — `parent === null`, not placed on any page (kept alive by instances). Spec's "place beside Idle Modal Body" is therefore adapted: the new body component is placed on the Desktop App page beside the new modal instance. `clone()` on a parentless node may throw — Task 2 has a fallback.
- **Right of Idle Modal is occupied** ("Add checklist (modal)" instance at x=3486, y=11654). New nodes go **below** the Idle Modal: modal at (2954, 12204), body component at (3966, 12204). Free space is verified in Task 1. Nearest neighbors: Idle Modal bottom edge y=12104; "New Task/Edit Task" starts y=12797.
- **Text nodes inside `Idle Modal Body` component** (find by current characters, not by ID — clones get new IDs):
  - pill duration: `"20 minutes"` · pill range: `"2:14 PM"`, `"2:34 PM"` (arrow icon between)
  - bold message: `"We tracked the last 20 minutes while you were away on Client Portal Redesign."`
  - helper: `"Keep it as worked time, discard the idle gap, or stop the timer entirely."`
  - Text Area instance named `Text Area`, label/placeholder set via props `Label text#29874:179` and `↳ Placholder#29802:33` (note Figma's typo "Placholder" — use it verbatim)
- **Modal instance texts:** title `"You went idle"`; hidden header subtitle `"20 minutes — 2:14 PM → 2:34 PM"`.
- **Footer Button instances** (find by `name === 'Button'` + prop `Button text#24152:0`):
  - `"Discard idle time"` — Kind=Secondary, Color=Negetive (sic, Figma's spelling)
  - `"Keep time"` — Kind=Primary, Color=Primary
  - Kind/Color stay as-is; only `Button text#24152:0` changes.

## Target copy (from spec)

| Element | Value |
|---|---|
| Modal name | `Overtime Modal` |
| Body component name | `Overtime Modal Body` |
| Title | `You clocked out with overtime` |
| Pill duration | `1:32:00 overtime` |
| Pill range | `5:00 PM` → `6:32 PM` |
| Bold message | `You tracked 9:32:00 today — 1:32:00 over your 8-hour shift.` |
| Helper | `Submit the overtime for approval, or discard it from your timesheet.` |
| Text Area label | `Reason for overtime` |
| Text Area placeholder | `type reason…` |
| Hidden header subtitle | `1:32:00 overtime — 5:00 PM → 6:32 PM` |
| Left button | `Discard overtime` |
| Right button | `Submit for approval` |

---

### Task 1: Pre-flight — connection + free-space check

**Files:** none (Figma only)

- [ ] **Step 1: Verify the Desktop Bridge connection**

Call `mcp__figma-console__figma_get_status` with `probe: true`.
Expected: `setup.valid: true`, `connectedFile.fileKey: "gqYWCu1K6dJ9gESXtgNeCi"`. If not, ask the user to open Plugins → Development → Figma Desktop Bridge in the DS file and re-check. Do not proceed until connected.

- [ ] **Step 2: Confirm the target rectangle is empty**

Call `mcp__figma-console__figma_execute`:

```javascript
const page = figma.root.children.find(p => p.name === 'Desktop App');
await page.loadAsync();
const rect = { x: 2900, y: 12150, w: 1600, h: 600 };
const hits = page.children
  .filter(n => n.x < rect.x + rect.w && n.x + n.width > rect.x &&
               n.y < rect.y + rect.h && n.y + n.height > rect.y)
  .map(n => ({ name: n.name, id: n.id, x: n.x, y: n.y, w: n.width, h: n.height }));
return hits;
```

Expected: `[]` (empty array). If anything intersects, shift both target positions down in increments of 100px (modal y and body y move together, keeping x) until the equivalent check returns empty, and use the adjusted coordinates in Tasks 2–3.

### Task 2: Create the `Overtime Modal Body` component

**Files:** none (Figma only)

- [ ] **Step 1: Clone the ghost component, place it, re-text it**

Call `mcp__figma-console__figma_execute` (timeout 30000):

```javascript
await figma.loadAllPagesAsync();
const src = await figma.getNodeByIdAsync('27922:980314'); // Idle Modal Body (ghost)
const page = figma.root.children.find(p => p.name === 'Desktop App');
await page.loadAsync();

let comp;
try {
  comp = src.clone(); // COMPONENT.clone() → new COMPONENT
} catch (e) {
  // ghost components can refuse clone(): instantiate → detach → re-componentize
  const inst = src.createInstance();
  page.appendChild(inst);
  const frame = inst.detachInstance();
  comp = figma.createComponentFromNode(frame);
}
page.appendChild(comp);
comp.name = 'Overtime Modal Body';
comp.x = 3966;
comp.y = 12204;

async function setText(node, chars) {
  if (!node) throw new Error('text node not found: ' + chars);
  const fonts = node.getRangeAllFontNames(0, node.characters.length);
  for (const f of fonts) await figma.loadFontAsync(f);
  node.characters = chars;
}
const txt = (pred) => comp.findOne(n => n.type === 'TEXT' && pred(n.characters));

await setText(txt(c => c === '20 minutes'), '1:32:00 overtime');
await setText(txt(c => c === '2:14 PM'), '5:00 PM');
await setText(txt(c => c === '2:34 PM'), '6:32 PM');
await setText(txt(c => c.startsWith('We tracked')), 'You tracked 9:32:00 today — 1:32:00 over your 8-hour shift.');
await setText(txt(c => c.startsWith('Keep it as worked time')), 'Submit the overtime for approval, or discard it from your timesheet.');

const ta = comp.findOne(n => n.type === 'INSTANCE' && n.name === 'Text Area');
ta.setProperties({
  'Label text#29874:179': 'Reason for overtime',
  '↳ Placholder#29802:33': 'type reason…'  // "Placholder" typo is Figma's, keep it
});

return { id: comp.id, name: comp.name, x: comp.x, y: comp.y, w: comp.width, h: comp.height };
```

Expected: returns the new component's id (**record it — Task 3 needs it as `OVERTIME_BODY_ID`**), name `Overtime Modal Body`, ~432×296. If any `setText` throws "text node not found", re-inspect the clone's text nodes (`comp.findAll(n => n.type === 'TEXT')`, log `characters`) and adjust the predicates — do not skip the re-text.

- [ ] **Step 2: Verify the body component visually**

Call `mcp__figma-console__figma_take_screenshot` with `nodeId` = the new component id.
Expected: pill reads `1:32:00 overtime  5:00 PM → 6:32 PM` with clock + arrow icons intact; bold message and helper match the copy table; Text Area label `Reason for overtime`, placeholder `type reason…`, no stray "Information text" line, no required asterisk. Layout identical to Idle Modal Body apart from text. Fix and re-screenshot if not (max 3 iterations).

### Task 3: Create the `Overtime Modal` instance

**Files:** none (Figma only)

- [ ] **Step 1: Clone the Idle Modal, swap the body slot, re-text title and buttons**

Call `mcp__figma-console__figma_execute` (timeout 30000), replacing `OVERTIME_BODY_ID` with the id returned by Task 2:

```javascript
const idle = await figma.getNodeByIdAsync('28077:24276');
const page = figma.root.children.find(p => p.name === 'Desktop App');
await page.loadAsync();

const modal = idle.clone();
page.appendChild(modal);
modal.name = 'Overtime Modal';
modal.x = 2954;
modal.y = 12204;

// 1) swap the body slot FIRST (swapping can reset overrides inside the slot)
modal.setProperties({ '🔁 slot#5121:17': 'OVERTIME_BODY_ID' });

// 2) header texts (part of Modal/Basic, unaffected by the swap)
async function setText(node, chars) {
  if (!node) throw new Error('text node not found: ' + chars);
  const fonts = node.getRangeAllFontNames(0, node.characters.length);
  for (const f of fonts) await figma.loadFontAsync(f);
  node.characters = chars;
}
await setText(modal.findOne(n => n.type === 'TEXT' && n.characters === 'You went idle'),
  'You clocked out with overtime');
const sub = modal.findOne(n => n.type === 'TEXT' && n.characters.includes('2:14 PM →'));
if (sub) await setText(sub, '1:32:00 overtime — 5:00 PM → 6:32 PM'); // hidden subtitle, kept consistent

// 3) footer buttons — change label prop only, keep Kind/Color
const btns = modal.findAll(n => n.type === 'INSTANCE' && n.name === 'Button' &&
  n.componentProperties && n.componentProperties['Button text#24152:0']);
const changed = [];
for (const b of btns) {
  const t = b.componentProperties['Button text#24152:0'].value;
  if (t === 'Discard idle time') { b.setProperties({ 'Button text#24152:0': 'Discard overtime' }); changed.push('discard'); }
  if (t === 'Keep time') { b.setProperties({ 'Button text#24152:0': 'Submit for approval' }); changed.push('submit'); }
}
if (changed.length !== 2) throw new Error('expected 2 button renames, got: ' + JSON.stringify(changed));

return { id: modal.id, name: modal.name, x: modal.x, y: modal.y, w: modal.width, h: modal.height };
```

Expected: returns the new instance id, name `Overtime Modal`, 480×~450, and both button renames applied. If the slot swap throws (INSTANCE_SWAP may want a component **key** rather than an id in some files), retry the `setProperties` line with the component's `key` (fetch via `(await figma.getNodeByIdAsync('OVERTIME_BODY_ID')).key`).

### Task 4: Visual confirmation against the Idle Modal

**Files:** none (Figma only)

- [ ] **Step 1: Screenshot the new modal**

Call `mcp__figma-console__figma_take_screenshot` with `nodeId` = the Overtime Modal instance id.

- [ ] **Step 2: Screenshot the Idle Modal for side-by-side reference**

Call `mcp__figma-console__figma_take_screenshot` with `nodeId: "28077:24276"`.

- [ ] **Step 3: Compare and fix (max 3 iterations)**

Checklist — every row must pass:
- Title: `You clocked out with overtime` + close icon button; no visible subtitle
- Pill: clock icon, `1:32:00 overtime` left, `5:00 PM → 6:32 PM` right — same alignment as Idle pill
- Bold message + helper text match the copy table, same wrap behavior (no overflow/clipping)
- Text Area: label `Reason for overtime`, placeholder `type reason…`, no asterisk, no "Information text"
- Footer: `Discard overtime` outline/red left, `Submit for approval` primary/indigo right; no "Don't show again" visible (matches Idle)
- Same corner radius, padding, and shadow as the Idle Modal (inherited — flag if visibly different)
- No overlap with any neighboring frame on the canvas

Fix any failure via targeted `figma_execute` edits and re-screenshot. If a fix attempt fails partway, delete the partial artifacts before retrying (`node.remove()`).

- [ ] **Step 4: Final placement screenshot**

Call `mcp__figma-console__figma_take_screenshot` with no nodeId scoped to the region — or `figma_execute` re-running the Task 1 intersection check with the rect tightened to the modal's final bounds, expecting exactly the two new nodes. Confirm clean placement.

### Task 5: Wrap-up

**Files:**
- Modify: `docs/superpowers/specs/2026-06-02-overtime-modal-design.md` (placement note only)

- [ ] **Step 1: Reconcile the spec's placement line with reality**

In the spec, update the Deliverables item 1 location sentence to reflect what was discovered: `Idle Modal Body` is a ghost component (no canvas placement), so `Overtime Modal Body` was placed on the Desktop App page at (3966, 12204) beside the modal instance, and the modal went **below** the Idle Modal at (2954, 12204) because the space to its right is occupied. Replace the sentence "placed beside Idle Modal Body in the same location/page" and the placement bullet accordingly; record the final node IDs.

- [ ] **Step 2: Report**

Post the final screenshot URL and the two node IDs (body component, modal instance) to the user. No git commit — spec/plan stay untracked per user preference (2026-06-02).
