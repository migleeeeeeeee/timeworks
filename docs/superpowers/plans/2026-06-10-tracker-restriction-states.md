# Tracker Restriction States — Figma Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 8 new `State=…` variants (tracking disabled, daily/weekly limits, fixed shift) to the `Task Timer Container` component set in the TimeWorks Experiment Figma file.

**Architecture:** Figma-only work driven through the figma-console MCP (`figma_execute` for mutations, structural dumps + screenshots for verification). Each new variant is a clone of the closest existing variant with children edited in place — clone-edit-verify, one variant at a time, never batch-mutating the set blind. Blocked states clone `State=Ready` (it already carries the grey disabled-look play button); in-progress states clone `State=Active`.

**Tech Stack:** figma-console MCP (Desktop Bridge, WebSocket), Figma Plugin API. No repo code changes except docs.

**Spec:** `docs/superpowers/specs/2026-06-10-tracker-restriction-states-design.md`

---

## Ground truth (verified 2026-06-10, this session)

| Thing | Node ID |
| --- | --- |
| Component set `Task Timer Container` | `27522:282279` (in section `Timer` `27522:282280`) |
| `State=Ready` variant (clone source for blocked states) | `27522:282278` — 310×144, has grey play button |
| `State=Active` variant (clone source for in-progress states) | `27522:282277` — 310×158, has blue pause + `Countdown Sweep Border` vector |
| Icon `lock` (canonical icon library) | `25321:16443` |
| Icon `Clock-new` (canonical icon library) | `25321:16381` |
| Variable `primary-text-color` | `VariableID:46810:1430` |
| Variable `secondary-text-color` | `VariableID:46810:1421` |
| Variable `Content Color/working_orange` (warning hue) | `VariableID:46810:1539` |

**Card anatomy (every variant):** root COMPONENT, vertical auto-layout, padding 24/16/16/16, gap 10, radius 16.
Children: `Frame 1707485098` (horizontal, gap 24 → `Play Button (big circle)` instance 62×62 + `Frame 1707485099` column (vertical, gap 4 → time TEXT 32px Montserrat Bold + caption frame `Frame 1707485100` (horizontal, gap 5 → TEXT "Project Name" 14px + TEXT "Task Title" 12px))) and `Mode Toggles` (horizontal, gap 8 → `Button` chip frame (Ellipse dot + `Title` TEXT 14px Karla) + `Portal View (button)` Break-chip instance). `State=Active` additionally has the `Countdown Sweep Border` VECTOR (289×144, absolutely positioned).

**Layout target:** existing 5 variants sit in one row at y=20, x = 20 + 350·i. New variants go in two rows of four inside the set:
- Row 2 (y=220): `State=Disabled`, `State=Daily Limit`, `State=Daily Limit Reached`, `State=Weekly Limit`
- Row 3 (y=440): `State=Weekly Limit Reached`, `State=Shift Upcoming`, `State=Shift Active`, `State=Shift Ended`
- x = 20 + 350·column. Resize the set to 1750×640 at the end of Task 2 (component sets don't reliably auto-grow).

**Known figma-console hazards (from project memory):**
- `figma_execute` times out at 5s client-side but the script keeps running server-side — always pass `timeout: 30000`, keep scripts small, and if a call errors, **dump the set's children before retrying** to avoid duplicate variants.
- Component edits can silently drop children — after every mutation, run the structural dump and compare against the expected child list before moving on.
- Don't use `node.getMainComponent` synchronously (dynamic-page file) — use `getMainComponentAsync` or avoid entirely.

---

### Task 1: Preflight + baseline

**Files:** none (Figma only)

- [ ] **Step 1: Verify connection and targets**

Run `mcp__figma-console__figma_get_status` with `probe: true`.
Expected: `setup.valid: true`, `currentFileKey: gqYWCu1K6dJ9gESXtgNeCi`.

- [ ] **Step 2: Baseline structural dump**

```javascript
const set = await figma.getNodeByIdAsync('27522:282279');
return set.children.map(c => ({ id: c.id, name: c.name, x: c.x, y: c.y, w: c.width, h: c.height }));
```

Expected: exactly 5 children — `State=Ready`, `State=Active`, `State=Break`, `State=Idle`, `State=State5`, all at y=20. If there are more than 5, a previous attempt left debris: stop and report, do not delete anything without showing the user.

- [ ] **Step 3: Baseline screenshot**

Run `mcp__figma-console__figma_take_screenshot` with `nodeId: "27522:282279"`, `scale: 1`. Save mentally as the before-state.

---

### Task 2: Build `State=Disabled` (the template blocked card)

This is the carefully-built blocked card; Task 3 clones it four times. Everything here runs in **one** `figma_execute` call (atomic), then verifies.

**Files:** none (Figma only)

- [ ] **Step 1: Create and edit the variant**

```javascript
// --- State=Disabled: clone Ready, rebuild caption + chips ---
await figma.loadFontAsync({ family: 'Montserrat', style: 'Bold' });
await figma.loadFontAsync({ family: 'Karla', style: 'Regular' });
const SEC = await figma.variables.getVariableByIdAsync('VariableID:46810:1421'); // secondary-text-color

const set = await figma.getNodeByIdAsync('27522:282279');
if (set.children.some(c => c.name === 'State=Disabled')) return { error: 'State=Disabled already exists — debris from earlier run' };

const ready = await figma.getNodeByIdAsync('27522:282278');
const card = ready.clone();                       // clone of a COMPONENT is a COMPONENT
if (card.parent.id !== set.id) set.appendChild(card);
card.name = 'State=Disabled';
card.x = 20; card.y = 220;                        // row 2, col 0

const row = card.children.find(c => c.name === 'Frame 1707485098');
const col = row.children.find(c => c.name === 'Frame 1707485099');
const time = col.children.find(c => c.type === 'TEXT');
const caption = col.children.find(c => c.name === 'Frame 1707485100');

// time: static, muted
time.characters = '00:00:00';
time.fills = time.fills.map(p => figma.variables.setBoundVariableForPaint(p, 'color', SEC));

// caption: drop Project Name, turn Task Title into the wrapped message, prepend lock icon
caption.children.find(c => c.name === 'Project Name').remove();
const msg = caption.children.find(c => c.name === 'Task Title');
msg.characters = 'Time tracking has been disabled for your account.';
col.layoutSizingHorizontal = 'FILL';
caption.layoutSizingHorizontal = 'FILL';
msg.textAutoResize = 'HEIGHT';
msg.layoutSizingHorizontal = 'FILL';

const lockComp = await figma.getNodeByIdAsync('25321:16443'); // lock icon
const icon = lockComp.createInstance();
icon.resize(16, 16);
caption.insertChild(0, icon);
icon.findAll(n => 'fills' in n).forEach(n => {
  try { n.fills = n.fills.map(p => p.type === 'SOLID' ? figma.variables.setBoundVariableForPaint(p, 'color', SEC) : p); } catch (e) {}
});

// chips: remove Break chip, relabel Active chip → neutral "Disabled"
const toggles = card.children.find(c => c.name === 'Mode Toggles');
toggles.children.find(c => c.name === 'Portal View (button)').remove();
const chip = toggles.children.find(c => c.name === 'Button');
const dot = chip.children.find(c => c.type === 'ELLIPSE');
dot.fills = [figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }, 'color', SEC)];
const title = chip.children.find(c => c.name === 'Title');
title.characters = 'Disabled';

return { id: card.id, h: card.height, children: card.children.map(c => c.name) };
```

Run with `timeout: 30000`. Expected return: new card id, height ≥ 144, children `['Frame 1707485098', 'Mode Toggles']`.
**Record the returned card id — Task 3 clones from it.**

- [ ] **Step 2: Structural verify**

```javascript
const set = await figma.getNodeByIdAsync('27522:282279');
const card = set.children.find(c => c.name === 'State=Disabled');
function names(n) { return { name: n.name, type: n.type, kids: 'children' in n ? n.children.map(names) : undefined }; }
return { count: set.children.length, tree: names(card) };
```

Expected: `count: 6`; tree shows the play-button instance, time text, caption frame containing **icon instance first, then one TEXT**, and Mode Toggles with **one** `Button` chip. Any missing branch → the clone dropped children; delete this variant (`card.remove()`) and redo Step 1.

- [ ] **Step 3: Visual verify**

`figma_take_screenshot` `nodeId: <card id from Step 1>`, `scale: 2`.
Check: grey play button, muted `00:00:00`, lock icon + message (wrapping is fine), single neutral "Disabled" chip, card silhouette matches the Ready card. Iterate (max 3) on spacing/wrap issues.

---

### Task 3: Clone Disabled → 4 remaining blocked variants

Same script run **four times**, changing only the `CFG` block each run. One run = one variant = one verify cycle. **Do not run all four then verify** — verify after each.

**Files:** none (Figma only)

| Run | name | x | y | time | message | icon | chip label | chip hue |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `State=Daily Limit Reached` | 720 | 220 | `08:00:00` | You've reached your daily time limit (8h). Tracking will resume tomorrow. | `25321:16381` | Limit reached | warning |
| 2 | `State=Weekly Limit Reached` | 20 | 440 | `07:15:08` | You've reached your weekly time limit (40h). Tracking will resume next week. | `25321:16381` | Weekly limit reached | warning |
| 3 | `State=Shift Upcoming` | 370 | 440 | `00:00:00` | Your shift hasn't started yet. You can track time starting at 9:00 AM. | none | Shift · 9:00 AM – 5:00 PM | neutral |
| 4 | `State=Shift Ended` | 1070 | 440 | `07:32:54` | Your shift has ended. Time tracking is no longer available until your next shift. | none | Shift ended | neutral |

- [ ] **Step 1–4: For each row above, run this script with that row's CFG, then verify (Steps A/B below) before the next row**

```javascript
// CFG — EDIT PER RUN (values from the table)
const CFG = {
  name: 'State=Daily Limit Reached', x: 720, y: 220,
  time: '08:00:00',
  message: "You've reached your daily time limit (8h). Tracking will resume tomorrow.",
  iconId: '25321:16381',          // or null for shift states
  chipLabel: 'Limit reached',
  warning: true                    // true → working_orange dot+title; false → neutral
};
// --- no edits below this line ---
await figma.loadFontAsync({ family: 'Montserrat', style: 'Bold' });
await figma.loadFontAsync({ family: 'Karla', style: 'Regular' });
const SEC = await figma.variables.getVariableByIdAsync('VariableID:46810:1421');
const WARN = await figma.variables.getVariableByIdAsync('VariableID:46810:1539');

const set = await figma.getNodeByIdAsync('27522:282279');
if (set.children.some(c => c.name === CFG.name)) return { error: CFG.name + ' already exists' };
const tpl = set.children.find(c => c.name === 'State=Disabled');
const card = tpl.clone();
if (card.parent.id !== set.id) set.appendChild(card);
card.name = CFG.name;
card.x = CFG.x; card.y = CFG.y;

const row = card.children.find(c => c.name === 'Frame 1707485098');
const col = row.children.find(c => c.name === 'Frame 1707485099');
const time = col.children.find(c => c.type === 'TEXT');
const caption = col.children.find(c => c.name === 'Frame 1707485100');
time.characters = CFG.time;

const msg = caption.children.find(c => c.type === 'TEXT');
msg.characters = CFG.message;

const oldIcon = caption.children.find(c => c.type === 'INSTANCE');
if (CFG.iconId) {
  const comp = await figma.getNodeByIdAsync(CFG.iconId);
  const icon = comp.createInstance();
  icon.resize(16, 16);
  caption.insertChild(0, icon);
  icon.findAll(n => 'fills' in n).forEach(n => {
    try { n.fills = n.fills.map(p => p.type === 'SOLID' ? figma.variables.setBoundVariableForPaint(p, 'color', SEC) : p); } catch (e) {}
  });
  if (oldIcon) oldIcon.remove();
} else if (oldIcon) {
  oldIcon.remove();
}

const chip = card.children.find(c => c.name === 'Mode Toggles').children.find(c => c.name === 'Button');
chip.primaryAxisSizingMode = 'AUTO';            // hug — long shift label must not clip
const title = chip.children.find(c => c.name === 'Title');
title.textAutoResize = 'WIDTH_AND_HEIGHT';
title.characters = CFG.chipLabel;
const dot = chip.children.find(c => c.type === 'ELLIPSE');
const hue = CFG.warning ? WARN : SEC;
dot.fills = [figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }, 'color', hue)];
if (CFG.warning) title.fills = title.fills.map(p => figma.variables.setBoundVariableForPaint(p, 'color', WARN));

return { id: card.id, name: card.name, h: card.height };
```

- [ ] **Step A (after each run): structural verify** — run with `NAME` set to the CFG.name just created. Expected `count` grows by 1 each run (7, 8, 9, 10); tree shows play instance, time text, caption (icon first when the row has one, then one TEXT), one `Button` chip.

```javascript
const NAME = 'State=Daily Limit Reached'; // EDIT PER RUN
const set = await figma.getNodeByIdAsync('27522:282279');
const card = set.children.find(c => c.name === NAME);
function names(n) { return { name: n.name, type: n.type, kids: 'children' in n ? n.children.map(names) : undefined }; }
return { count: set.children.length, tree: card ? names(card) : 'MISSING' };
```

- [ ] **Step B (after each run): screenshot verify** — `figma_take_screenshot` on the new card id. Check message text, icon presence/absence, chip label fits (no clipping), warning chips render orange.

---

### Task 4: In-progress variants (clone `State=Active`)

Three runs of one parameterized script — same one-run-one-verify discipline.

**Files:** none (Figma only)

| Run | name | x | y | time | extra caption line | remove Break chip |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `State=Daily Limit` | 370 | 220 | `06:30:12` | 6h 30m / 8h tracked today | no |
| 2 | `State=Weekly Limit` | 1070 | 220 | `06:30:12` | 32h 15m / 40h this week | no |
| 3 | `State=Shift Active` | 720 | 440 | `02:12:33` | Shift: 9:00 AM – 5:00 PM · 2h 30m left | yes |

- [ ] **Step 1–3: For each row, run with that row's CFG, then verify**

```javascript
// CFG — EDIT PER RUN (values from the table)
const CFG = {
  name: 'State=Daily Limit', x: 370, y: 220,
  time: '06:30:12',
  extraCaption: '6h 30m / 8h tracked today',
  removeBreak: false
};
// --- no edits below this line ---
await figma.loadFontAsync({ family: 'Montserrat', style: 'Bold' });
await figma.loadFontAsync({ family: 'Karla', style: 'Regular' });
const SEC = await figma.variables.getVariableByIdAsync('VariableID:46810:1421');

const set = await figma.getNodeByIdAsync('27522:282279');
if (set.children.some(c => c.name === CFG.name)) return { error: CFG.name + ' already exists' };
const active = await figma.getNodeByIdAsync('27522:282277');
const card = active.clone();
if (card.parent.id !== set.id) set.appendChild(card);
card.name = CFG.name;
card.x = CFG.x; card.y = CFG.y;

const row = card.children.find(c => c.name === 'Frame 1707485098');
const col = row.children.find(c => c.name === 'Frame 1707485099');
col.children.find(c => c.type === 'TEXT').characters = CFG.time;

const toggles = card.children.find(c => c.name === 'Mode Toggles');
if (CFG.removeBreak) toggles.children.find(c => c.name === 'Portal View (button)').remove();

// counter/shift caption: clone the Task Title text (keeps secondary-text-color binding),
// re-home it as a full-width line after Mode Toggles
const caption = col.children.find(c => c.name === 'Frame 1707485100');
const src = caption.children.find(c => c.name === 'Task Title');
const line = src.clone();
card.appendChild(line);
line.name = 'Restriction Caption';
line.characters = CFG.extraCaption;
line.textAutoResize = 'HEIGHT';
line.layoutSizingHorizontal = 'FILL';

// the decorative sweep border was drawn for h=158 — stretch to the grown card
const sweep = card.children.find(c => c.name === 'Countdown Sweep Border');
if (sweep) sweep.resize(sweep.width, card.height - 14);

return { id: card.id, name: card.name, h: card.height, children: card.children.map(c => c.name) };
```

Expected children: `['Frame 1707485098', 'Mode Toggles', 'Restriction Caption', 'Countdown Sweep Border']` (order of the vector may differ — it's absolutely positioned; presence is what matters).

- [ ] **Step A (after each run): structural verify** — dump as before. Child count: 11, 12, 13.

- [ ] **Step B (after each run): screenshot verify** — running-timer look preserved (blue pause, task name, chips), new caption line readable, sweep border reaches the new bottom edge without obvious distortion. If the stretched sweep border looks bad, remove it from the variant (`sweep.remove()`) and note that in the run report — a misaligned border is worse than none.

---

### Task 5: Resize set, annotate tooltip behavior, final verify, docs

**Files:**
- Modify: `docs/superpowers/specs/2026-06-10-tracker-restriction-states-design.md` (status line)

- [ ] **Step 1: Resize the component set to fit both new rows**

```javascript
const set = await figma.getNodeByIdAsync('27522:282279');
const maxY = Math.max(...set.children.map(c => c.y + c.height));
set.resizeWithoutConstraints(1750, maxY + 20);
return { w: set.width, h: set.height, count: set.children.length };
```

Expected: `count: 13`, height ≈ 620–660.

- [ ] **Step 2: Annotate the tooltip/auto-stop behavior on `State=Shift Ended`**

```javascript
const set = await figma.getNodeByIdAsync('27522:282279');
const card = set.children.find(c => c.name === 'State=Shift Ended');
const NOTE = 'Behavior: disabled start button shows tooltip "Tracking is only allowed during your assigned shift." Daily/weekly limits and shift end auto-stop a running tracker.';
try {
  card.annotations = [{ label: NOTE }];
  return { via: 'annotation' };
} catch (e) {
  // fallback: text note inside the Timer section, right of the set
  await figma.loadFontAsync({ family: 'Karla', style: 'Regular' });
  const section = await figma.getNodeByIdAsync('27522:282280');
  const t = figma.createText();
  section.appendChild(t);
  t.fontSize = 12;
  t.characters = NOTE;
  t.x = 50; t.y = set.y + set.height + 24;
  t.resize(500, t.height);
  return { via: 'text-note', id: t.id };
}
```

- [ ] **Step 3: Final full-set screenshot vs spec**

`figma_take_screenshot` `nodeId: "27522:282279"`, `scale: 1`. Walk the spec's variant table — all 13 variants present (5 old + 8 new), every message verbatim, icons on Disabled + the two limit-reached cards only, warning hue on the two limit chips, no overlapping cards, original 5 variants untouched.

- [ ] **Step 4: Update spec status + commit**

Change the spec's status line to `**Status:** implemented (Figma)` and commit:

```bash
git add docs/superpowers/specs/2026-06-10-tracker-restriction-states-design.md
git commit -m "docs: mark tracker restriction states spec implemented

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Failure recovery

- A `figma_execute` timeout does **not** mean the script failed — re-dump the set's children first; if the variant exists and the tree is complete, continue. If it exists but is malformed, `card.remove()` and rerun that one script.
- Never retry a creation script without the existence guard returning clean (`already exists` → inspect, don't duplicate).
- If a clone drops children (known component-edit hazard): remove the bad variant, rerun its single script, verify again. Do not patch a half-broken clone.
