# Sidebar Spacious Restyle — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle the Figma `Sidebar` component to a spacious, sectioned, expandable-group pattern (Hyde-inspired), then generate the React + Storybook + test implementation in this repo.

**Architecture:** Figma is authoritative. Phase 1 rebuilds the Sidebar component-set in the working DS file `gqYWCu1K6dJ9gESXtgNeCi` ("TimeWorks Design System (Experiment)") using the `figma-design` skill, producing the four-frame contract (Anatomy, Variants, States, Tokens) on the existing **Sidebar** page (`25685:133449`). Phase 2 generates `src/components/Sidebar/*` from that Figma source using the `figma-to-code` skill. All visual values resolve to existing TimeWorks tokens via Tailwind utilities; behavior for the expandable group is delegated to Radix `Accordion`.

**Tech Stack:** Figma + figma-console MCP (Plugin API), Tokens Studio (only if a needed token is missing), React 18 + TypeScript (strict), Tailwind v4 with CSS variable theming, Radix UI Accordion, cva, Storybook 8, Vitest (test runner pending — see Open work in CLAUDE.md).

**Spec:** `docs/superpowers/specs/2026-05-11-sidebar-spacious-restyle-design.md`

---

## File map

**Created (Phase 2):**

- `src/components/Sidebar/Sidebar.tsx` — the component. cva variants for row + group-header sub-components; Radix `Accordion.Root type="multiple"` under the hood for groups; `forwardRef<HTMLElement>` on `<aside>`; spreads `...rest`.
- `src/components/Sidebar/Sidebar.stories.tsx` — Default, Sections, ExpandableGroup, States, Playground; theme toggle via `addon-themes`.
- `src/components/Sidebar/Sidebar.test.tsx` — keyboard + controlled/uncontrolled group behavior, active-state rendering, section divider rendering.
- `src/components/Sidebar/index.ts` — barrel.

**Modified (Phase 2):**

- `src/index.ts` — add `export { Sidebar, type SidebarProps, type SidebarSection, type SidebarItem } from "./components/Sidebar"`.

**No code consumers exist today** (verified — only one `<nav>` in `src/showcase/App.tsx` for the top bar; no Sidebar in `src/components/`). No migration step needed.

**Figma (Phase 1):**

- Working DS file `gqYWCu1K6dJ9gESXtgNeCi` ("TimeWorks Design System (Experiment)"). Sidebar page `25685:133449`. Existing `Sidebar Item` component set: `25694:157418`. The figma-design skill will produce new primitives (link row, group row, section title) and a parent `Sidebar` component set on this page following the four-frame contract.

---

## Phase 1 — Figma

### Task 1: Pre-flight — confirm Figma surface

**Files:** none (state check)

- [ ] **Step 1: Verify figma-console MCP connection and active file**

Call `mcp__figma-console__figma_get_status` with `probe: true`.

Expected: `setup.valid: true`, `transport.active: "websocket"`, and `transport.websocket.connectedFile.fileKey` equals `gqYWCu1K6dJ9gESXtgNeCi` ("TimeWorks Design System (Experiment)" — the working DS file as of 2026-05-11).

If `connectedFile.fileKey` is anything else, **STOP** and ask the user to switch the active Figma Desktop file to the Experiment file. Do not author into a different file.

- [ ] **Step 2: Confirm the Sidebar page and existing component set resolve**

Call `mcp__figma-console__figma_execute` with the body:

```javascript
await figma.loadAllPagesAsync();
const page = await figma.getNodeByIdAsync("25685:133449");
const sidebarItem = await figma.getNodeByIdAsync("25694:157418");
return {
  page: page ? { id: page.id, name: page.name, type: page.type } : null,
  sidebarItem: sidebarItem ? { id: sidebarItem.id, name: sidebarItem.name, type: sidebarItem.type } : null,
};
```

Expected: `page.name === "Sidebar"`, `sidebarItem.name === "Sidebar Item"` and type `COMPONENT_SET`.

If either is null, surface to the user — node IDs may have moved in the Experiment file.

### Task 2: Author the Sidebar component-set in Figma

**Files:** Figma file `04x9q7W2Y59baF5MqHAVZR`, Sidebar component page.

- [ ] **Step 1: Invoke the figma-design skill**

Invoke `Skill` with `skill: "figma-design"` and pass the spec path `docs/superpowers/specs/2026-05-11-sidebar-spacious-restyle-design.md` plus the explicit scope: "Rebuild the Sidebar component-set per this spec on the existing **Sidebar** page (`25685:133449`) in the active file (`gqYWCu1K6dJ9gESXtgNeCi`). Produce the four-frame contract: Anatomy, Variants, States, Tokens. Every fill/stroke/radius/spacing must bind to a Figma variable. Variant props on the row component-set: `kind` (link | group | section-title), `state` (default | hover | active | focus-visible | disabled), `open` (true | false, only meaningful for kind=group). Leave the existing `Sidebar Item` component-set (`25694:157418`) in place as reference; do not delete it until the new set is signed off."

Follow the skill's flow end-to-end. It owns its own halt-on-missing-token logic per CLAUDE.md "Tokens" rules.

- [ ] **Step 2: If the skill halts on a missing token**

The skill will tell you the token name. Pause this plan, add the token in Tokens Studio (Figma side), export, run `npm run tokens:build`, then resume the skill from where it stopped. Do not invent local hex/px to unblock — that violates Architecture rule #1.

- [ ] **Step 3: Verify the four-frame contract exists**

After the skill reports done, call `mcp__figma-console__figma_execute`:

```javascript
await figma.loadAllPagesAsync();
const page = figma.root.children.find(p => p.name.toLowerCase().includes("sidebar"));
if (!page) return { error: "no sidebar page" };
const frames = page.children.filter(n => n.type === "FRAME").map(n => n.name);
const expected = ["Anatomy", "Variants", "States", "Tokens"];
return { frames, missing: expected.filter(e => !frames.some(f => f.includes(e))) };
```

Expected: `missing: []`.

- [ ] **Step 4: Visual sanity screenshot**

Call `mcp__claude_ai_Figma__get_screenshot` for the component-set node (the skill will have surfaced its id). Eyeball: rhythm matches spec (44px rows, 24px section gaps, uppercase t3 labels, faint dividers, expandable group with chevron).

If anything is off, fix in Figma (re-invoke `figma-design` for the specific frame) before moving on. Code generation is downstream — broken Figma = broken code.

- [ ] **Step 5: User sign-off**

Stop and ask: "Phase 1 done — Sidebar component-set is in the DS library at the Sidebar page with the four-frame contract. Please review in Figma. OK to generate code?" Wait for explicit approval before Task 3.

---

## Phase 2 — Code

### Task 3: Generate Sidebar code via figma-to-code

**Files:**
- Create: `src/components/Sidebar/Sidebar.tsx`
- Create: `src/components/Sidebar/Sidebar.stories.tsx`
- Create: `src/components/Sidebar/index.ts`
- Modify: `src/index.ts`

- [ ] **Step 1: Invoke the figma-to-code skill**

Invoke `Skill` with `skill: "figma-to-code"`. Pass the component-set node id (from Task 2 Step 3) and the spec path. Explicit scope: "Generate `src/components/Sidebar/Sidebar.tsx`, `Sidebar.stories.tsx`, `index.ts`, and append the public re-export to `src/index.ts`. Use the API surface defined in section 'Sections API' of the spec. Use Radix `Accordion.Root type='multiple'` for groups. forwardRef + ...rest spread. cva for variants. All values must resolve to CSS-var-backed Tailwind utilities — no raw hex/px."

The skill will read the Figma source via `figma_get_component_for_development_deep` and write the files.

- [ ] **Step 2: Verify build still passes**

Run: `npm run build` (or `npx tsc --noEmit` if there is no build script — check `package.json` first).

Expected: zero TypeScript errors. If errors, fix them in `Sidebar.tsx` before continuing — common issues are missing prop types in cva variants or mismatched Radix Accordion prop names.

- [ ] **Step 3: Verify Storybook loads the story**

Run: `npm run storybook` in the background. Open the Sidebar story; confirm it renders in all three themes (light / dark / black) via the toolbar. Use the a11y addon — expected: zero violations.

If violations appear, fix in `Sidebar.tsx` and re-check. Most likely: missing `aria-current="page"` on active link, or missing `aria-expanded` on group header (Radix Accordion should provide this — verify it's not overridden).

- [ ] **Step 4: Commit Phase 2 code**

```bash
git add src/components/Sidebar src/index.ts
git commit -m "feat(Sidebar): spacious restyle with sections + expandable groups

Generated from Figma DS source per docs/superpowers/specs/2026-05-11-sidebar-spacious-restyle-design.md.
API: sections-based, Radix Accordion under the hood for groups.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

### Task 4: Co-located tests

**Files:**
- Create: `src/components/Sidebar/Sidebar.test.tsx`

**Note on test runner:** CLAUDE.md Open work calls out that Vitest is the expected runner but isn't yet installed. Before writing tests, check `package.json` for `vitest`:

```bash
grep -E "\"(vitest|@testing-library/react|jsdom)\"" package.json
```

If any are missing, **STOP** and ask the user: "Vitest isn't installed. The CLAUDE.md 'open work' notes this. May I `npm install --save-dev vitest @testing-library/react @testing-library/user-event jsdom @vitejs/plugin-react` and add a `test` script + minimal `vitest.config.ts`?" Wait for approval. CLAUDE.md "Things to never do" forbids unsanctioned dep adds.

Once Vitest is available, proceed.

- [ ] **Step 1: Write the failing test file**

Create `src/components/Sidebar/Sidebar.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Home, Star } from "lucide-react";
import { Sidebar } from "./Sidebar";

const sections = [
  {
    id: "main",
    items: [
      { kind: "link" as const, id: "home", icon: Home, label: "Home", active: true },
      {
        kind: "group" as const,
        id: "favs",
        icon: Star,
        label: "Favorites",
        children: [
          { kind: "link" as const, id: "f1", icon: Home, label: "Pinned" },
        ],
      },
    ],
  },
];

describe("Sidebar", () => {
  it("renders link labels uppercased via styling, with active aria attribute", () => {
    render(<Sidebar sections={sections} />);
    const home = screen.getByRole("link", { name: /home/i });
    expect(home).toHaveAttribute("aria-current", "page");
  });

  it("expandable group is collapsed by default and toggles on click", async () => {
    const user = userEvent.setup();
    render(<Sidebar sections={sections} />);
    expect(screen.queryByRole("link", { name: /pinned/i })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /favorites/i }));
    expect(screen.getByRole("link", { name: /pinned/i })).toBeInTheDocument();
  });

  it("expandable group respects defaultOpen", () => {
    const s = [{ id: "m", items: [{ ...sections[0]!.items[1]!, defaultOpen: true }] }];
    render(<Sidebar sections={s} />);
    expect(screen.getByRole("link", { name: /pinned/i })).toBeInTheDocument();
  });

  it("expandable group supports controlled open + onOpenChange", async () => {
    const onOpenChange = vi.fn();
    const user = userEvent.setup();
    const controlled = [{
      id: "m",
      items: [{ ...sections[0]!.items[1]!, open: false, onOpenChange }],
    }];
    render(<Sidebar sections={controlled} />);
    await user.click(screen.getByRole("button", { name: /favorites/i }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it("renders a section title when provided", () => {
    const titled = [{ id: "t", title: "Workspace", items: sections[0]!.items }];
    render(<Sidebar sections={titled} />);
    expect(screen.getByText(/workspace/i)).toBeInTheDocument();
  });
});
```

(Add `import { vi } from "vitest"` at the top.)

- [ ] **Step 2: Run the tests and verify they fail in the expected way**

Run: `npx vitest run src/components/Sidebar/Sidebar.test.tsx`

Expected: tests fail because either (a) generated code doesn't match the API exactly, or (b) all pass on first try if the figma-to-code output already implements the spec. Either outcome is informative.

If failing for API mismatch (e.g. `aria-current` not set, role mismatch), this is a real gap — fix `Sidebar.tsx` to match the spec, don't rewrite the test.

- [ ] **Step 3: Fix `Sidebar.tsx` until tests pass**

Likely fixes if anything fails:

- Active link missing `aria-current="page"` — add in the link render: `aria-current={item.active ? "page" : undefined}` on the `<a>` (or `<button>` if no `href`).
- Group toggle row using `<div>` not `<button>` — must be a `<button>` (or Radix Accordion's `Trigger` which renders one) so it has the button role.
- `onOpenChange` not wired — make sure `open`/`defaultOpen`/`onOpenChange` are threaded into `Accordion.Item value={item.id}` + `Accordion.Root value={openIds} onValueChange={...}` at the section level (controlled when any group sets `open`).

- [ ] **Step 4: Run tests, verify pass**

Run: `npx vitest run src/components/Sidebar/Sidebar.test.tsx`

Expected: 5 passing.

- [ ] **Step 5: Commit**

```bash
git add src/components/Sidebar/Sidebar.test.tsx src/components/Sidebar/Sidebar.tsx
git commit -m "test(Sidebar): keyboard, controlled/uncontrolled, active state

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

### Task 5: Theme sweep + a11y verification

**Files:** no edits expected; this is a verification task. Any fix lands in `Sidebar.tsx` / `Sidebar.stories.tsx`.

- [ ] **Step 1: Run Storybook a11y**

In Storybook, open `Sidebar / Default`, `Sidebar / Sections`, `Sidebar / ExpandableGroup`, `Sidebar / States`. For each, check the A11y panel.

Expected: zero violations across all four stories.

If any violations, fix in `Sidebar.tsx`. Common culprits: insufficient contrast on `--color-text-color-tertiary` in one theme (likely black theme) — if so, this is a token issue, surface to user; do not change the color in component code.

- [ ] **Step 2: Visual sweep across three themes**

In Storybook, use the theme toolbar to flip light / dark / black on each story. Confirm:

- Dividers visible but quiet in all three.
- Active row clearly distinguishable from hover in all three.
- Section titles legible (tertiary text on panel) in all three.
- Focus ring visible on tab through rows + group toggles in all three.

If any theme is broken, the issue is almost always a token used in the wrong slot, not a tweak to constants. Adjust the token reference in `Sidebar.tsx`; do not hardcode.

- [ ] **Step 3: Run full type check + lint**

```bash
npx tsc --noEmit
```

Expected: zero errors.

If `package.json` defines `lint`, also run `npm run lint` and expect zero errors.

- [ ] **Step 4: Commit any fixes from this task (if any)**

```bash
git add src/components/Sidebar
git commit -m "fix(Sidebar): theme sweep + a11y adjustments

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

If no fixes were needed, skip this step.

### Task 6: Definition-of-done checklist

**Files:** none — this is a verification gate.

- [ ] **Step 1: Walk the CLAUDE.md Definition of "done" checklist**

For each item in the CLAUDE.md "Definition of 'done' for a component" list, confirm satisfied. Reproduced here for convenience:

- [ ] Implementation matches the Figma source spec (variants, sizes, states)
- [ ] Built on the appropriate Radix primitive (Accordion for groups)
- [ ] Uses cva for variants, no inline ternaries on classNames
- [ ] All visual properties come from tokens (no raw colors/spacing/radii/shadows) — grep `Sidebar.tsx` for `#` (hex) and bare digits followed by `px` to confirm; expected: none
- [ ] `forwardRef` correctly typed; `...rest` spread to root
- [ ] Props type exported alongside the component
- [ ] Storybook story exists with: Default, Sections, ExpandableGroup, States, Playground
- [ ] Storybook a11y addon shows zero violations
- [ ] Visible focus ring via `focus-visible:`
- [ ] Renders correctly in all three themes
- [ ] Exported from `src/index.ts`
- [ ] Co-located test file

Run the hex-check:

```bash
grep -nE "#[0-9a-fA-F]{3,8}|[^a-zA-Z-][0-9]+px" src/components/Sidebar/Sidebar.tsx | grep -v "//"
```

Expected: empty. If anything matches, fix and re-run.

- [ ] **Step 2: Final commit if anything was fixed**

```bash
git add src/components/Sidebar
git commit -m "chore(Sidebar): DoD checklist sweep

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Done

After Task 6, the Sidebar is shipped in both Figma and code. Hand back to the user with a summary of:

- Figma component-set node id (from Task 2)
- Code paths created
- Any tokens added in Tokens Studio (if Task 2 Step 2 fired)
- Anything skipped or punted
