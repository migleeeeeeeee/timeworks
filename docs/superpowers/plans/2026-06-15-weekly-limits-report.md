# Weekly Limits Report Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. This is an **in-Figma design build** driven by the `figma-console` MCP (Plugin API via `figma_execute`); the "tests" are screenshot verifications compared against the reference, not unit tests.

**Goal:** Design the *Weekly Limits Report* page in Figma (node `27823:196653`, the "Timeworks Web" page of the TimeWorks Design System Experiment file) as a set of state frames cloned and adapted from the existing *Shift Attendance Report* template.

**Architecture:** Clone the *Shift Attendance Report* section (`28116:272798`) as the base, then per-frame: retitle the header, add a Me/All Tabs control and a Group-by Dropdown, add an org/timezone caption, rebuild the table columns to (Week|Member · Time Spent · Weekly Limit · Percentage Used · Remaining), and insert an inline **Linear Progress Bar** in the Percentage Used cell colored by a 3-tier band (`<85%` `primary-color` blue · `85–100%` `warning-color` amber · `>100%` `negative-color` red). Produce six frames: by-Member, by-Week, Empty, Loading, Filters-open, and a progress-bar variants reference.

**Tech Stack:** Figma Plugin API via `figma-console` MCP (`figma_execute`, `figma_capture_screenshot`, `figma_clone_node`, `figma_set_text`, `figma_set_fills`). Semantic color/typography variables already exist in the file.

---

## Reference node IDs (template — READ-ONLY, do not mutate)

| What | Node ID |
| --- | --- |
| Target page "Timeworks Web" | `27823:196653` |
| Template section "Shift Attendance Report" | `28116:272798` |
| Template frame "— by Member" | `28116:273259` |
| Template frame "— by Date" | `28116:272799` |
| Template frame "— Filters Applied" | `28116:273719` |
| Template frame "— Empty" | `28116:274179` |
| Page Header (inside by-Date) | `28116:272822` → title text `28116:272826`, Export button `28116:272828` |
| Toolbar "Frame 1707485097" | `28335:259292` |
| → Group By Group (label `28117:278442` + Group By Tabs `28117:278443`) | `28117:278441` |
| → Filters Icon Button | `28427:58814` |
| → Filter Chips | `28117:278474` |
| → Date Navigator (Prev `28334:243276`, Next `28334:243277`, Dropdown `28334:243278`, Today `28334:243279`) | `28334:243275` |
| Summary Counts (stat tiles — DELETE) | `28116:272830` |
| Report Table | `28117:278533` → Header Row `28117:278534`, sample Group `28117:278549`, sample Row `28117:278551` |
| **Linear Progress Bar** component set | `46946:16381` (variants: Type=Primary/Positive/Negative/Multi × Size=Small/Big × Label=On/Off) |
| Filter Body / Teams component | `28326:225027` |
| Filter Body / Members component | `28325:224200` |
| Empty state page (for reference instances) | `46939:7898` |
| Skeleton page | `46939:7911` |
| Tabs page | `46939:7916` |
| Dropdown page | `46939:7895` |

**Tokens:** `primary-color` (blue), `warning-color` (amber), `negative-color` (red), `primary-text-color`, `secondary-text-color`. Text styles: `Text2 (14px)/Medium` (primary name cell), `Text2 (14px)/Normal` (regular cell), `Text3 (12px)/Medium` (column header & caption).

**IMPORTANT — cloning changes node IDs.** After Task 1 clones the section, every child gets a NEW id. All later tasks therefore locate nodes **by name** inside the cloned section (`section.findOne(n => n.name === '…')`), never by the template ids above. The template ids are for understanding structure only.

**Pre-flight (run once before Task 1):** confirm the bridge and file.

```
figma_get_status  → expect transport.active === "websocket", connectedFile.fileName === "TimeWorks Design System", fileKey "gqYWCu1K6dJ9gESXtgNeCi"
```

---

## File / artifact structure

All output lives in ONE new section on page `27823:196653`:

```
Weekly Limits Report   (SECTION, cloned from 28116:272798)
├── Weekly Limits — by Member      (FRAME)   ← Task 4, 5
├── Weekly Limits — by Week        (FRAME)   ← Task 6
├── Weekly Limits — Filters Open   (FRAME)   ← Task 7
├── Weekly Limits — Empty          (FRAME)   ← Task 8
├── Weekly Limits — Loading        (FRAME)   ← Task 9
└── Progress Bar Variants (ref)    (FRAME)   ← Task 10
```

The run log is appended to `docs/superpowers/runs/2026-06-15-weekly-limits-report.md` (created in Task 1, updated each task).

---

### Task 1: Clone the template section and rename the frame set

**Files:** Figma only. Create run log `docs/superpowers/runs/2026-06-15-weekly-limits-report.md`.

- [ ] **Step 1: Clone the section and offset it below the template**

```js
// figma_execute
const tmpl = await figma.getNodeByIdAsync('28116:272798');
const clone = tmpl.clone();
clone.name = 'Weekly Limits Report';
clone.x = tmpl.x;
clone.y = tmpl.y + tmpl.height + 600;
return {id: clone.id, x: clone.x, y: clone.y, children: clone.children.map(c=>({id:c.id,name:c.name}))};
```

Record the returned `clone.id` as `SECTION_ID` and the child id/name map in the run log.

- [ ] **Step 2: Rename the frames we keep; delete the two extras we will rebuild**

```js
// figma_execute — SECTION_ID from Step 1
const section = await figma.getNodeByIdAsync('SECTION_ID');
const ren = {
  'Shift Attendance — by Member':'Weekly Limits — by Member',
  'Shift Attendance — by Date':'Weekly Limits — by Week',
  'Shift Attendance — Filters Applied':'Weekly Limits — Filters Open',
  'Shift Attendance — Empty':'Weekly Limits — Empty',
};
const log=[];
for (const c of section.children) {
  if (ren[c.name]) { log.push(`${c.name} -> ${ren[c.name]}`); c.name = ren[c.name]; }
  else if (c.name==='Filter Dropdowns' || c.name==='Date Picker') { log.push(`removed ${c.name}`); c.remove(); }
}
return {children: section.children.map(c=>c.name), log};
```

Expect children to read: `Weekly Limits — by Week`, `Weekly Limits — by Member`, `Weekly Limits — Filters Open`, `Weekly Limits — Empty`.

- [ ] **Step 3: Screenshot to confirm the clone landed intact**

```
figma_capture_screenshot { nodeId: "SECTION_ID" }
```

Expected: the section renders identically to the template (4 frames, sidebar + table visible), just relocated. No detached/broken instances.

- [ ] **Step 4: Commit the run log**

```bash
cd /Users/MiggleWork/Downloads/Timeworks
mkdir -p docs/superpowers/runs
printf '# Weekly Limits Report — build run\n\nDate: 2026-06-15\nSection: SECTION_ID (Weekly Limits Report) on page 27823:196653\n\n## Task 1 — clone + rename\nDone. Children: by Week, by Member, Filters Open, Empty.\n' > docs/superpowers/runs/2026-06-15-weekly-limits-report.md
git add docs/superpowers/runs/2026-06-15-weekly-limits-report.md
git commit -m "docs: start Weekly Limits Report build run log"
```

---

### Task 2: Page header — title, breadcrumb, Export + Schedule actions

Apply to **both** primary frames (`Weekly Limits — by Member` and `Weekly Limits — by Week`). Steps below show one frame; repeat the `figma_execute` for the other by changing `FRAME_NAME`.

- [ ] **Step 1: Set the title text to "Weekly Limits Report"**

```js
// figma_execute
const FRAME_NAME = 'Weekly Limits — by Member';
const section = await figma.getNodeByIdAsync('SECTION_ID');
const frame = section.findOne(n=>n.name===FRAME_NAME);
const title = frame.findOne(n=>n.type==='TEXT' && n.name==='User Name'); // template id was 28116:272826
await figma.loadFontAsync(title.fontName);
title.characters = 'Weekly Limits Report';
return {title: title.characters};
```

- [ ] **Step 2: Update the breadcrumb text if present**

```js
// figma_execute — breadcrumb sits in the Sidebar/Header area as "Reports / Shift Attendance"
const section = await figma.getNodeByIdAsync('SECTION_ID');
const frame = section.findOne(n=>n.name==='Weekly Limits — by Member');
const crumbs = frame.findAll(n=>n.type==='TEXT' && /Shift Attendance/i.test(n.characters));
for (const t of crumbs){ await figma.loadFontAsync(t.fontName); t.characters = t.characters.replace(/Shift Attendance/gi,'Weekly Limits'); }
return crumbs.map(t=>t.characters);
```

- [ ] **Step 3: Relabel the existing button to "Export" and make it Primary**

```js
// figma_execute
const section = await figma.getNodeByIdAsync('SECTION_ID');
const frame = section.findOne(n=>n.name==='Weekly Limits — by Member');
const pageHeader = frame.findOne(n=>n.name==='Page Header');
const exportBtn = pageHeader.findOne(n=>n.type==='INSTANCE' && n.name==='Button');
await exportBtn.setProperties({ 'Kind':'Primary' });
const label = exportBtn.findOne(n=>n.type==='TEXT');
await figma.loadFontAsync(label.fontName);
label.characters = 'Export';
return {kind:'Primary', label: label.characters};
```

- [ ] **Step 4: Clone the button as "Schedule" (Secondary, calendar icon) and place it left of Export**

```js
// figma_execute
const section = await figma.getNodeByIdAsync('SECTION_ID');
const frame = section.findOne(n=>n.name==='Weekly Limits — by Member');
const pageHeader = frame.findOne(n=>n.name==='Page Header');
const exportBtn = pageHeader.findOne(n=>n.type==='INSTANCE' && n.name==='Button');
const sched = exportBtn.clone();
sched.name = 'Button / Schedule';
await sched.setProperties({ 'Kind':'Secondary' });
const sl = sched.findOne(n=>n.type==='TEXT'); await figma.loadFontAsync(sl.fontName); sl.characters='Schedule';
// swap the icon glyph to a calendar via the nested Icon Wrapper instance-swap prop
const iconWrap = sched.findOne(n=>n.type==='INSTANCE' && n.name==='Icon Wrapper');
// inspect available icon props at build time:
// figma_get_component_details on the Icon Wrapper main; set its icon# instance-swap prop to "calendar"
// insert Schedule before Export in the header's auto-layout
pageHeader.insertChild(pageHeader.children.indexOf(exportBtn), sched);
return {order: pageHeader.children.map(c=>c.name)};
```

If the icon-swap property name is unknown, run `figma_get_component_details` on the Icon Wrapper's main component, find the `icon#…` instance-swap property, and set it to the calendar glyph (see memory: *figma-icon-wrapper-recipe* node `25320:54477`). Leave the arrow icon only if no calendar glyph exists, and note it in the run log.

- [ ] **Step 5: Repeat Steps 1–4 for `Weekly Limits — by Week`.**

- [ ] **Step 6: Screenshot both page headers and verify**

```
figma_capture_screenshot { nodeId: "<by-Member Page Header id>" }
```

Expected: title "Weekly Limits Report", breadcrumb "Reports / Weekly Limits", and top-right shows `[Schedule] [Export]` with Export filled (primary) and Schedule outlined (secondary).

- [ ] **Step 7: Commit run-log update** (`git add … && git commit -m "design: Weekly Limits header — title + Export/Schedule"`).

---

### Task 3: Toolbar — Me/All Tabs, Group-by Dropdown, date navigator labels

Apply to both primary frames. The Group-by control becomes a **labelled Dropdown** (Member/Week) per the locked decision; the existing "Group By Tabs" instance is replaced. A new **Me/All Tabs** is added at the left of the toolbar.

- [ ] **Step 1: Add a Me/All Tabs control at the start of the Filter Bar**

```js
// figma_execute — clone the existing Group By Tabs instance to get a styled 2-tab control, then relabel
const section = await figma.getNodeByIdAsync('SECTION_ID');
const frame = section.findOne(n=>n.name==='Weekly Limits — by Member');
const filterBar = frame.findOne(n=>n.name==='Filter Bar');
const groupByTabs = frame.findOne(n=>n.type==='INSTANCE' && n.name==='Group By Tabs');
const meAll = groupByTabs.clone();
meAll.name = 'View Tabs';
// relabel the two inner .Tabs base labels to "Me" / "All"; select "All" by default
const tabLabels = meAll.findAll(n=>n.type==='TEXT');
await figma.loadFontAsync(tabLabels[0].fontName);
tabLabels[0].characters = 'Me';
if (tabLabels[1]) { await figma.loadFontAsync(tabLabels[1].fontName); tabLabels[1].characters = 'All'; }
// set the second base (All) selected, first normal, via each .Tabs base State prop
filterBar.insertChild(0, meAll);
return {tabs: meAll.findAll(n=>n.type==='TEXT').map(t=>t.characters)};
```

Set the selected/normal `State` on the two `.Tabs base` instances so **All** reads selected by default (and **Me** selected on the by-Week frame is not required — keep All selected on both).

- [ ] **Step 2: Replace the Group By Tabs with a labelled Dropdown (Member/Week)**

```js
// figma_execute — reuse the Date Navigator's Dropdown instance as the styled source
const section = await figma.getNodeByIdAsync('SECTION_ID');
const frame = section.findOne(n=>n.name==='Weekly Limits — by Member');
const groupByGroup = frame.findOne(n=>n.name==='Group By Group');
const oldTabs = groupByGroup.findOne(n=>n.type==='INSTANCE' && n.name==='Group By Tabs');
const dateDD = frame.findOne(n=>n.type==='INSTANCE' && n.name==='Dropdown'); // date-range dropdown
const dd = dateDD.clone();
dd.name = 'Group By Dropdown';
dd.resize(200, dd.height);
const ddText = dd.findOne(n=>n.type==='TEXT');
await figma.loadFontAsync(ddText.fontName);
ddText.characters = 'Member';                 // by-Member frame
const idx = groupByGroup.children.indexOf(oldTabs);
oldTabs.remove();
groupByGroup.insertChild(idx, dd);
return {label: ddText.characters, order: groupByGroup.children.map(c=>c.name)};
```

On the `Weekly Limits — by Week` frame set the dropdown text to `Week`.

- [ ] **Step 3: Update the date-range value text to a single ISO week**

```js
// figma_execute
const section = await figma.getNodeByIdAsync('SECTION_ID');
const frame = section.findOne(n=>n.name==='Weekly Limits — by Member');
const nav = frame.findOne(n=>n.name==='Date Navigator');
const ddText = nav.findOne(n=>n.type==='TEXT' && /\d/.test(n.characters));
await figma.loadFontAsync(ddText.fontName);
ddText.characters = 'Nov 16 – Nov 22, 2025';
return ddText.characters;
```

- [ ] **Step 4: Update the Filter Chips to read "Teams · 2" and "Members · 5"** (replace the cloned "Status/Clients" chip text).

```js
// figma_execute
const section = await figma.getNodeByIdAsync('SECTION_ID');
const frame = section.findOne(n=>n.name==='Weekly Limits — by Member');
const chips = frame.findOne(n=>n.name==='Filter Chips');
const texts = chips.findAll(n=>n.type==='TEXT');
const want = ['Teams · 2','Members · 5'];
for (let i=0;i<texts.length && i<want.length;i++){ await figma.loadFontAsync(texts[i].fontName); texts[i].characters = want[i]; }
// remove any extra chips beyond 2
return texts.map(t=>t.characters);
```

- [ ] **Step 5: Repeat Steps 1–4 for `Weekly Limits — by Week`** (Group By Dropdown text = `Week`).

- [ ] **Step 6: Screenshot the toolbar row of both frames**

Expected: left side reads `[Me|All]  Group by: [Member ▾]  [⚙ filters]  Teams·2  Members·5`; right side `‹ › [Nov 16 – Nov 22, 2025 ▾] Today`.

- [ ] **Step 7: Commit run-log update.**

---

### Task 4: Report Table — "by Member" columns and member group headers

Rebuild the Report Table inside `Weekly Limits — by Member` to 5 columns: **Week · Time Spent · Weekly Limit · Percentage Used · Remaining**. The table keeps the dividerless work (header 44px, rows 52px). Group headers stay as member avatar+name rows (the by-Member template already groups by member).

Column widths (sum ≈ 1796 incl. existing left pad): Week `300`, Time Spent `220`, Weekly Limit `220`, Percentage Used `420`, Remaining `200`, trailing flex.

- [ ] **Step 1: Set the header-row column labels (Title Case, Text3/Medium, secondary-text-color)**

```js
// figma_execute
const section = await figma.getNodeByIdAsync('SECTION_ID');
const frame = section.findOne(n=>n.name==='Weekly Limits — by Member');
const headerRow = frame.findOne(n=>n.name==='Header Row');
const cols = headerRow.children;                 // 8 template columns
const labels = ['Week','Time Spent','Weekly Limit','Percentage Used','Remaining'];
// keep first 5 columns, delete the rest
for (let i=cols.length-1;i>=5;i--) cols[i].remove();
const widths = [300,220,220,420,200];
for (let i=0;i<5;i++){
  const col = headerRow.children[i];
  col.resize(widths[i], col.height);
  const t = col.findOne(n=>n.type==='TEXT');
  await figma.loadFontAsync(t.fontName); t.characters = labels[i];
}
return headerRow.children.map(c=>({n:c.name, w:Math.round(c.width)}));
```

- [ ] **Step 2: Rewrite one member group's rows to the new 5-column shape**

The by-Member template's group = an avatar+name header frame followed by data rows. For each data row, keep 5 cells: Week (text), Time Spent (text), Weekly Limit (text), Percentage Used (built in Task 5), Remaining (text). Seed realistic values.

```js
// figma_execute — reshape every data row under the member groups
const section = await figma.getNodeByIdAsync('SECTION_ID');
const frame = section.findOne(n=>n.name==='Weekly Limits — by Member');
const table = frame.findOne(n=>n.name==='Report Table' || /Report Table/.test(n.name));
const widths = [300,220,220,420,200];
const rows = table.findAll(n=>n.type==='FRAME' && /^Row \//.test(n.name));
// sample data spanning bands: [week, spent, limit, pct, remaining]
const data = [
  ['Nov 16 – Nov 22','30:48','40:00',77,'9:12'],
  ['Nov 16 – Nov 22','33:36','40:00',84,'6:24'],
  ['Nov 16 – Nov 22','40:00','40:00',100,'0:00'],
  ['Nov 16 – Nov 22','44:48','40:00',112,'-4:48'],
];
for (let r=0;r<rows.length;r++){
  const row = rows[r];
  const cells = row.children;
  for (let i=cells.length-1;i>=5;i--) cells[i].remove();
  const d = data[r % data.length];
  // column 0 currently holds Avatar+name → repurpose to Week text
  const c0 = row.children[0]; c0.resize(widths[0], c0.height);
  const avt = c0.findOne(n=>n.name==='Avatar'); if (avt) avt.remove();
  let c0t = c0.findOne(n=>n.type==='TEXT'); await figma.loadFontAsync(c0t.fontName); c0t.characters = d[0];
  // columns 1,2 = Time Spent, Weekly Limit
  for (const [i,val] of [[1,d[1]],[2,d[2]]]){
    const col = row.children[i]; col.resize(widths[i], col.height);
    const t = col.findOne(n=>n.type==='TEXT'); await figma.loadFontAsync(t.fontName); t.characters = val;
  }
  // column 3 = Percentage Used placeholder (Task 5 fills the bar); store pct in name
  const c3 = row.children[3]; c3.resize(widths[3], c3.height); c3.name = `PctCell::${d[3]}`;
  // column 4 = Remaining
  const c4 = row.children[4]; c4.resize(widths[4], c4.height);
  const t4 = c4.findOne(n=>n.type==='TEXT'); await figma.loadFontAsync(t4.fontName); t4.characters = d[4];
}
return {rowCount: rows.length};
```

- [ ] **Step 3: Confirm member group headers still read avatar + name** (template already provides them — just verify they survived; no change needed).

- [ ] **Step 4: Screenshot the table and verify 5 columns + member groups**

Expected: header row reads `Week | Time Spent | Weekly Limit | Percentage Used | Remaining`; rows grouped under member avatars; column 4 cells empty (bars added next task).

- [ ] **Step 5: Commit run-log update.**

---

### Task 5: Percentage Used cell — inline Linear Progress Bar with 3-tier color

Build the `%`-cell content inside every `PctCell::<pct>` frame from Task 4: a horizontal Linear Progress Bar (Size=Small, Label=Off, 120px track) + a percentage text label. Color band: `<85` → `primary-color`, `85–100` → `warning-color`, `>100` → `negative-color` (and red `%` text). Over-limit fill caps visually at 100%.

- [ ] **Step 1: Inspect the Linear Progress Bar so we know how to set fill width**

```
figma_get_component_details { nodeId: "46946:16381" }
```

Identify (a) the inner "fill"/"bar" frame whose width encodes progress, and (b) whether a numeric component property drives it. Record the path in the run log. (Memory: bars expose progress via an inner fill frame width; see *figma-vertical-frame-width-collapse* and *figma-tokenbind-drops-opacity* for the fill-resize + re-set-opacity gotchas.)

- [ ] **Step 2: Instance a progress bar + label into each PctCell and color by band**

```js
// figma_execute
const section = await figma.getNodeByIdAsync('SECTION_ID');
const frame = section.findOne(n=>n.name==='Weekly Limits — by Member');
const set = await figma.getNodeByIdAsync('46946:16381');
const variant = (band) => {
  // Type=Primary base for all; we override the fill paint to the band token so amber is possible
  return set.defaultVariant || set.children.find(c=>c.name.includes('Type=Primary, Size=Small, Label=Off'));
};
const colorVar = async (name) => (await figma.variables.getLocalVariablesAsync('COLOR')).find(v=>v.name===name);
const primary = await colorVar('primary-color');
const warning = await colorVar('warning-color');
const negative = await colorVar('negative-color');
const TRACK = 120;
const cells = frame.findAll(n=>/^PctCell::/.test(n.name));
const log=[];
for (const cell of cells){
  const pct = Number(cell.name.split('::')[1]);
  const band = pct < 85 ? primary : (pct <= 100 ? warning : negative);
  const inst = variant(pct).createInstance();
  inst.name = 'Percentage Bar';
  inst.resize(TRACK, inst.height);
  // resize inner fill frame to clamp(pct,0,100)% of TRACK
  const fill = inst.findOne(n=> /fill|bar|progress|value/i.test(n.name) && n.type!=='TEXT') || inst.children[0];
  const w = Math.max(2, Math.min(pct,100)/100 * TRACK);
  if ('resize' in fill) fill.resize(w, fill.height);
  // bind the fill paint to the band token, then re-set opacity to 1 (token-bind opacity gotcha)
  if ('fills' in fill && fill.fills.length){
    let paints = fill.fills.map(p=>({...p}));
    paints[0] = figma.variables.setBoundVariableForPaint(paints[0], 'color', band);
    paints[0] = {...paints[0], opacity:1};
    fill.fills = paints;
  }
  // build the cell layout: bar + label
  cell.layoutMode = 'HORIZONTAL'; cell.itemSpacing = 8; cell.counterAxisAlignItems = 'CENTER';
  cell.appendChild(inst);
  const label = figma.createText();
  await figma.loadFontAsync({family:'Karla', style:'Regular'});
  label.characters = pct + '%';
  // red label only when over limit
  if (pct > 100){
    let lp = [{type:'SOLID', color:{r:0,g:0,b:0}}];
    lp[0] = figma.variables.setBoundVariableForPaint(lp[0], 'color', negative);
    label.fills = lp;
  }
  cell.appendChild(label);
  log.push({pct, band: band.name, fillW: Math.round(w)});
}
return log;
```

If `figma_execute` times out mid-loop (5–7s cap, see memory *figma-execute-timeout-continues*), re-run with a filter that skips cells already containing a `Percentage Bar` child to avoid duplicates.

- [ ] **Step 3: Screenshot the table; verify the three bands render**

Expected: 77% & 84% bars blue, partially filled; 100% bar amber, full; 112% bar red, full, with red "112%" text.

- [ ] **Step 4: Commit run-log update.**

---

### Task 6: Report Table — "by Week" frame (group by week range, Member first column)

Adapt `Weekly Limits — by Week` (cloned from the template's by-Date frame). Columns: **Member · Time Spent · Weekly Limit · Percentage Used · Remaining**. Group headers become week-range labels.

- [ ] **Step 1: Set header-row labels and widths**

```js
// figma_execute
const section = await figma.getNodeByIdAsync('SECTION_ID');
const frame = section.findOne(n=>n.name==='Weekly Limits — by Week');
const headerRow = frame.findOne(n=>n.name==='Header Row');
for (let i=headerRow.children.length-1;i>=5;i--) headerRow.children[i].remove();
const labels=['Member','Time Spent','Weekly Limit','Percentage Used','Remaining'];
const widths=[300,220,220,420,200];
for (let i=0;i<5;i++){ const col=headerRow.children[i]; col.resize(widths[i],col.height);
  const t=col.findOne(n=>n.type==='TEXT'); await figma.loadFontAsync(t.fontName); t.characters=labels[i]; }
return headerRow.children.map(c=>c.name);
```

- [ ] **Step 2: Rewrite the group headers to week ranges**

```js
// figma_execute
const section = await figma.getNodeByIdAsync('SECTION_ID');
const frame = section.findOne(n=>n.name==='Weekly Limits — by Week');
const table = frame.findOne(n=>/Report Table/.test(n.name));
const groups = table.findAll(n=>n.type==='FRAME' && /^Group \//.test(n.name));
const ranges=['Sun, Nov 16, 2025 – Sat, Nov 22, 2025','Sun, Nov 9, 2025 – Sat, Nov 15, 2025','Sun, Nov 2, 2025 – Sat, Nov 8, 2025','Sun, Oct 26, 2025 – Sat, Nov 1, 2025'];
for (let i=0;i<groups.length;i++){ const t=groups[i].findOne(n=>n.type==='TEXT');
  await figma.loadFontAsync(t.fontName); t.characters = ranges[i % ranges.length].toUpperCase(); groups[i].name = `Group / Week ${i+1}`; }
return groups.map(g=>g.findOne(n=>n.type==='TEXT').characters);
```

- [ ] **Step 3: Reshape rows — keep Member (avatar+name) as column 0, then the 4 metric columns**

Same reshape as Task 4 Step 2, but **keep** the avatar+name in column 0 (do not remove the Avatar; resize column to 300). Seed member names (Sarah Mitchell, David Park, Maria Lopez, Aisha Khan) and the same band-spanning metric set. Mark column 3 frames `PctCell::<pct>`.

```js
// figma_execute
const section = await figma.getNodeByIdAsync('SECTION_ID');
const frame = section.findOne(n=>n.name==='Weekly Limits — by Week');
const table = frame.findOne(n=>/Report Table/.test(n.name));
const widths=[300,220,220,420,200];
const rows = table.findAll(n=>n.type==='FRAME' && /^Row \//.test(n.name));
const data=[['33:36','40:00',84,'6:24'],['40:00','40:00',100,'0:00'],['44:48','40:00',112,'-4:48'],['30:48','40:00',77,'9:12']];
for (let r=0;r<rows.length;r++){ const row=rows[r]; for (let i=row.children.length-1;i>=5;i--) row.children[i].remove();
  const d=data[r%data.length];
  const c0=row.children[0]; c0.resize(widths[0],c0.height);                  // keep avatar+name
  for (const [i,val] of [[1,d[0]],[2,d[1]]]){ const col=row.children[i]; col.resize(widths[i],col.height);
    const t=col.findOne(n=>n.type==='TEXT'); await figma.loadFontAsync(t.fontName); t.characters=val; }
  const c3=row.children[3]; c3.resize(widths[3],c3.height); c3.name=`PctCell::${d[2]}`;
  const c4=row.children[4]; c4.resize(widths[4],c4.height); const t4=c4.findOne(n=>n.type==='TEXT'); await figma.loadFontAsync(t4.fontName); t4.characters=d[3];
}
return {rows: rows.length};
```

- [ ] **Step 4: Run Task 5 Step 2's progress-bar snippet against the `Weekly Limits — by Week` frame** (change the frame lookup name). Verify bands.

- [ ] **Step 5: Screenshot; verify week-range groups + Member column + colored bars. Commit run-log update.**

---

### Task 7: Filters popover (Filters Open frame)

Adapt `Weekly Limits — Filters Open` (cloned from the template's Filters-Applied frame). The body is a populated by-Member table; overlay a **dropdown popover** anchored under the Filters icon button. The popover has two tabs (Filters / Saved Filters); the Filters tab composes the **Filter Body / Teams** (`28326:225027`) and **Filter Body / Members** (`28325:224200`) components with a Save/Clear footer.

- [ ] **Step 1: Bring the frame's table to the by-Member 5-column shape**

Re-apply Task 2 (header), Task 3 (toolbar), Task 4, and Task 5 to this frame so it matches `Weekly Limits — by Member`. (Or, simpler: delete the cloned table content and `clone()` the finished `Weekly Limits — by Member` table into this frame, then add the overlay.) Record which path was taken.

- [ ] **Step 2: Build the popover container anchored under the Filters icon button**

```js
// figma_execute
const section = await figma.getNodeByIdAsync('SECTION_ID');
const frame = section.findOne(n=>n.name==='Weekly Limits — Filters Open');
const filtBtn = frame.findOne(n=>n.type==='INSTANCE' && n.name==='Filters Icon Button');
const bb = filtBtn.absoluteBoundingBox, fb = frame.absoluteBoundingBox;
const pop = figma.createFrame();
pop.name='Filters Popover'; pop.layoutMode='VERTICAL'; pop.itemSpacing=0; pop.paddingTop=0;
pop.resize(360, 1); pop.primaryAxisSizingMode='AUTO'; pop.cornerRadius=12; pop.clipsContent=true;
frame.appendChild(pop);
pop.x = bb.x - fb.x; pop.y = (bb.y - fb.y) + bb.height + 8;
// fill + elevation via tokens
const cols = await figma.variables.getLocalVariablesAsync('COLOR');
const bgVar = cols.find(v=>v.name==='primary-background-color') || cols.find(v=>/background-color$/.test(v.name));
let paint = {type:'SOLID', color:{r:1,g:1,b:1}}; paint = figma.variables.setBoundVariableForPaint(paint,'color',bgVar);
pop.fills=[paint];
pop.effectStyleId = ''; // then apply shadow-lg equivalent effect style if one exists (Elevation page)
return {id: pop.id, x: pop.x, y: pop.y};
```

Apply the `shadow-lg`/popover elevation effect style from the Elevation page (`46814:2892`) if an effect style exists; otherwise leave the default and note it.

- [ ] **Step 3: Add the two tabs (Filters / Saved Filters) at the popover top**

Clone the relabeled 2-tab control pattern from Task 3 Step 1; labels `Filters` (selected) / `Saved Filters`; insert as the first child of the popover.

- [ ] **Step 4: Compose the Filters tab body — Teams + Members filter bodies**

```js
// figma_execute
const section = await figma.getNodeByIdAsync('SECTION_ID');
const frame = section.findOne(n=>n.name==='Weekly Limits — Filters Open');
const pop = frame.findOne(n=>n.name==='Filters Popover');
const teams = await figma.getNodeByIdAsync('28326:225027');
const members = await figma.getNodeByIdAsync('28325:224200');
const tInst = teams.createInstance(); tInst.name='Filter Body / Teams';
const mInst = members.createInstance(); mInst.name='Filter Body / Members';
pop.appendChild(tInst); pop.appendChild(mInst);
return {added:[tInst.name, mInst.name]};
```

- [ ] **Step 5: Add the Save / Clear footer**

Clone the Export/Today button instances: **Save Filters** (Primary) + **Clear Filters** (Tertiary) in a horizontal footer frame appended to the popover, right-aligned. Reuse the button-relabel pattern from Task 2.

- [ ] **Step 6: Screenshot the frame; verify the popover anchors under the Filters button, shows Filters/Saved-Filters tabs, Teams+Members lists, and a Save/Clear footer, floating over the table.**

- [ ] **Step 7: Commit run-log update.**

---

### Task 8: Empty state frame

Adapt `Weekly Limits — Empty` (cloned from the template's Empty frame). Keep header + toolbar (by-Member styling); replace the table body with an empty-state block.

- [ ] **Step 1: Apply Task 2 + Task 3 to this frame's header and toolbar** (title, Export/Schedule, Me/All, Group-by Dropdown, date range "Nov 16 – Nov 22, 2025").

- [ ] **Step 2: Replace the table area with an Empty-state composition**

```js
// figma_execute — reuse a DS Empty-state instance if one exists on page 46939:7898, else build a centered text block
const section = await figma.getNodeByIdAsync('SECTION_ID');
const frame = section.findOne(n=>n.name==='Weekly Limits — Empty');
const table = frame.findOne(n=>/Report Table/.test(n.name));
// keep the Header Row, remove all Group/Row children
table.findAll(n=>/^(Group|Row) \//.test(n.name)).forEach(n=>n.remove());
const wrap = figma.createFrame(); wrap.name='Empty State'; wrap.layoutMode='VERTICAL';
wrap.counterAxisAlignItems='CENTER'; wrap.primaryAxisAlignItems='CENTER'; wrap.itemSpacing=8;
wrap.resize(table.width, 320); wrap.fills=[];
const h = figma.createText(); await figma.loadFontAsync({family:'Karla',style:'Bold'}); h.characters='No data for the selected range';
const p = figma.createText(); await figma.loadFontAsync({family:'Karla',style:'Regular'}); p.characters='Try a different week or adjust your filters.';
wrap.appendChild(h); wrap.appendChild(p);
table.appendChild(wrap);
// bind h to primary-text-color, p to secondary-text-color
const cols = await figma.variables.getLocalVariablesAsync('COLOR');
const bind=(node,varName)=>{ const v=cols.find(c=>c.name===varName); let f=[{type:'SOLID',color:{r:0,g:0,b:0}}]; f[0]=figma.variables.setBoundVariableForPaint(f[0],'color',v); node.fills=f; };
bind(h,'primary-text-color'); bind(p,'secondary-text-color');
return 'empty built';
```

Prefer a DS Empty-state component instance if one is present on its page; fall back to the text block above and note the choice.

- [ ] **Step 3: Screenshot; verify a centered empty message with header/toolbar intact. Commit run-log update.**

---

### Task 9: Loading state frame

Create `Weekly Limits — Loading` by cloning the finished `Weekly Limits — by Member` frame and swapping table rows for Skeleton rows.

- [ ] **Step 1: Clone the by-Member frame**

```js
// figma_execute
const section = await figma.getNodeByIdAsync('SECTION_ID');
const src = section.findOne(n=>n.name==='Weekly Limits — by Member');
const loading = src.clone(); loading.name='Weekly Limits — Loading';
section.appendChild(loading);
loading.x = src.x; loading.y = src.y + src.height + 200;
return loading.id;
```

- [ ] **Step 2: Replace each data row's cell content with Skeleton bars**

```js
// figma_execute — overlay a Skeleton rectangle in each cell; keep group headers visible
const section = await figma.getNodeByIdAsync('SECTION_ID');
const frame = section.findOne(n=>n.name==='Weekly Limits — Loading');
const table = frame.findOne(n=>/Report Table/.test(n.name));
const cols = await figma.variables.getLocalVariablesAsync('COLOR');
const skVar = cols.find(c=>/skeleton|secondary-background-color/.test(c.name));
const rows = table.findAll(n=>n.type==='FRAME' && /^Row \//.test(n.name));
for (const row of rows){
  for (const cell of row.children){
    cell.findAll(n=>n.type==='TEXT' || n.name==='Percentage Bar' || n.name==='Avatar').forEach(n=>n.remove());
    const sk = figma.createRectangle(); sk.name='Skeleton'; sk.cornerRadius=4;
    sk.resize(Math.max(40, cell.width*0.6), 12);
    let f=[{type:'SOLID',color:{r:.9,g:.9,b:.92}}]; if(skVar) f[0]=figma.variables.setBoundVariableForPaint(f[0],'color',skVar);
    sk.fills=f; cell.appendChild(sk);
  }
}
return {rows: rows.length};
```

Prefer a real DS **Skeleton** component instance (page `46939:7911`) over a raw rectangle if its API allows arbitrary width; otherwise the token-bound rectangle above is acceptable — note the choice.

- [ ] **Step 3: Screenshot; verify skeleton rows under live group headers. Commit run-log update.**

---

### Task 10: Progress-bar variants reference strip

A small standalone reference frame documenting the three bands.

- [ ] **Step 1: Create the reference frame inside the section**

```js
// figma_execute
const section = await figma.getNodeByIdAsync('SECTION_ID');
const ref = figma.createFrame(); ref.name='Progress Bar Variants (ref)';
ref.layoutMode='VERTICAL'; ref.itemSpacing=16; ref.paddingTop=24; ref.paddingBottom=24; ref.paddingLeft=24; ref.paddingRight=24;
ref.primaryAxisSizingMode='AUTO'; ref.counterAxisSizingMode='AUTO'; ref.cornerRadius=12;
section.appendChild(ref);
return ref.id;
```

- [ ] **Step 2: Add three labelled rows (Under 77% blue, At 100% amber, Over 112% red)** using the Task 5 Step 2 bar-build logic for pct = 77, 100, 112, each preceded by a caption text ("Under limit", "At limit", "Over limit"). Bind captions to `secondary-text-color`.

- [ ] **Step 3: Screenshot; verify three bars in blue/amber/red with correct fill proportions and the over-limit red label. Commit run-log update.**

---

### Task 11: Final QA — token-leak audit and full-section verification

- [ ] **Step 1: Audit for raw color leaks across the section**

```js
// figma_execute — flag any visible fill not bound to a variable
const section = await figma.getNodeByIdAsync('SECTION_ID');
const leaks=[];
for (const n of section.findAll(n=>'fills' in n && Array.isArray(n.fills))){
  for (const p of n.fills){ if (p.type==='SOLID' && p.visible!==false && !(p.boundVariables&&p.boundVariables.color)) leaks.push({id:n.id,name:n.name}); }
}
return {leakCount: leaks.length, sample: leaks.slice(0,25)};
```

Fix leaks by binding to the nearest semantic token (background → `*background-color`, text → `*text-color`, bar → band token). Re-run until `leakCount` is only intentional (e.g. background blob gradients, which are decorative — list them in the run log).

- [ ] **Step 2: Full-section screenshot**

```
figma_capture_screenshot { nodeId: "SECTION_ID" }
```

Expected: six frames present and consistent — by-Member, by-Week, Filters-Open, Empty, Loading, Progress-Bar-Variants — all reading as one design language with the Report-Table styling (44px header / 52px rows, Text3/Medium Title-Case headers, Text2 cells).

- [ ] **Step 3: Per-frame screenshots for the record** (one each), pasted/linked into the run log.

- [ ] **Step 4: Final run-log writeup + commit**

```bash
cd /Users/MiggleWork/Downloads/Timeworks
git add docs/superpowers/runs/2026-06-15-weekly-limits-report.md
git commit -m "docs: Weekly Limits Report build run — complete (6 frames, QA passed)"
```

---

## Self-review (against the design spec)

**Spec coverage**

- Page header + title → Task 2 ✓
- Me/All toggle (Tabs) → Task 3 Step 1 ✓
- Date range prev/next + Today → preserved from template, relabeled Task 3 Step 3 ✓
- Group by Member / Week (Dropdown) → Task 3 Step 2; both table modes Task 4 (Member) + Task 6 (Week) ✓
- Org name + timezone above table → **GAP FOUND** in original draft; added below as Task 3.5 ✓
- Percentage Used inline progress bar + 3-tier color → Task 5 + Task 6 Step 4 ✓
- Export + Schedule actions → Task 2 Steps 3–4 ✓
- Filters panel (Teams, Members, Save/Clear, Saved Filters tab) → Task 7 ✓
- States: populated (both modes), Empty, Loading, Filters-open → Tasks 4/6, 8, 9, 7 ✓
- Progress-bar variants (under/at/over) → Task 5 (in-table) + Task 10 (reference) ✓

**Placeholder scan:** no "TODO/TBD"; the two inspect-then-set steps (Task 2 Step 4 icon-swap, Task 5 Step 1 fill mechanism) specify the inspection call and the fallback, which is required because the exact inner-node name is component-internal.

**Consistency:** `SECTION_ID` is captured in Task 1 and referenced verbatim in every later task; node lookups are by-name within the section (cloning invalidates template ids); band tokens (`primary-color`/`warning-color`/`negative-color`) are used identically in Tasks 5, 6, 10.

---

### Task 3.5: Org / timezone caption (insert above the table) — fills the spec gap

Run after Task 3, on both primary frames (and reuse in Tasks 7–9).

- [ ] **Step 1: Delete the Summary Counts stat tiles and insert a caption line in their place**

```js
// figma_execute
const section = await figma.getNodeByIdAsync('SECTION_ID');
for (const FRAME_NAME of ['Weekly Limits — by Member','Weekly Limits — by Week']){
  const frame = section.findOne(n=>n.name===FRAME_NAME);
  const summary = frame.findOne(n=>n.name==='Summary Counts');
  const parent = summary.parent; const idx = parent.children.indexOf(summary);
  summary.remove();
  const cap = figma.createText(); cap.name='Org / Timezone';
  await figma.loadFontAsync({family:'Karla',style:'Medium'});
  cap.characters = 'Abroadworks · GMT+8 (Asia/Manila)';
  cap.fontSize = 12;
  const cols = await figma.variables.getLocalVariablesAsync('COLOR');
  const v = cols.find(c=>c.name==='secondary-text-color');
  let f=[{type:'SOLID',color:{r:0,g:0,b:0}}]; f[0]=figma.variables.setBoundVariableForPaint(f[0],'color',v); cap.fills=f;
  parent.insertChild(idx, cap);
}
return 'caption inserted on both frames';
```

- [ ] **Step 2: Screenshot; verify the caption sits between the toolbar and the table, no stat tiles. Commit run-log update.**

---

## Open note for the user (carried from planning)

The template natively renders **Group by** as a 2-segment **Tabs** control (Date|Member). The locked decision was Group-by = **Dropdown** + Me/All = **Tabs**, which this plan follows (Task 3). If you'd rather keep the file consistent with the sibling Shift Attendance report (Group-by as Tabs, Me/All as a second Tabs/Toggle), that's a one-step change in Task 3 — flag it before execution.
