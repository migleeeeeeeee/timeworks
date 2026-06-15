---
name: figma-selection-to-code
description: Legacy quick-codegen escape hatch. Use only when the strict path (`figma-to-code`) is genuinely blocked — e.g. a one-off Figma node that isn't part of the design system's structured pages. Reads the active Figma selection via `figma_get_selection`, emits `src/components/<Name>/<Name>.tsx` + `<Name>.stories.tsx` + `index.ts`, and appends the public re-export to `src/index.ts`. Ends with a *decisions log* of any raw values used so they can be promoted into Tokens Studio. Triggers on "convert my selection to code", "turn the selected node into a component". For all normal new-component work, prefer `figma-to-code`.
---

# figma-selection-to-code

Take the user's currently-selected Figma node and emit the React/TS component, Storybook story, barrel, and public re-export. Legacy escape hatch alongside `figma-to-code`: plain Tailwind utilities with raw values are allowed when the selection isn't backed by Figma variables.

Don't author Figma here — this skill only generates code from an existing selection.

## When to use this vs. `figma-to-code`

| Situation | Use |
| --- | --- |
| `src/tokens/` doesn't exist OR the Figma file has zero variables | `figma-selection-to-code` |
| `src/tokens/` is compiled and Tokens Studio has synced variables into Figma | `figma-to-code` |

If both conditions are met (tokens exist *and* Figma has variables), **stop** and route the user to `figma-to-code` instead.

## Hard guardrails

- Build on the Radix primitive named in the selected node's (or its ancestor's) `Radix:` annotation. If `Radix: none` or the annotation is absent, build on the bare DOM element.
- Use `cva` for variants. No inline ternaries on `className`. No template-string class concatenation.
- `forwardRef` to the root with the correct ref type (`HTMLButtonElement`, `HTMLInputElement`, …).
- Spread `...rest` to the root.
- Export `{ <Name>, type <Name>Props }`.
- `size?: "sm" | "md" | "lg"` with `md` default (or the size set declared in the sibling `Variants` frame).
- Variant prop names match the labels in the sibling `Variants` frame exactly.
- Use `cn()` from `src/lib/cn.ts` for className composition.
- Visible focus ring via `focus-visible:` utilities.
- Component must be in the v1 list of 12 from `CLAUDE.md`.

### Token rule (loosened)

- Plain Tailwind utilities are allowed: `bg-indigo-600`, `rounded-lg`, `px-4`, `text-white`, `shadow-md`, etc.
- Match the values authored in the Figma page (read via `figma_get_component_for_development_deep` — node fills, strokes, corner radii, padding all come back as raw values).
- Do **not** use `bg-[var(--…)]` arbitrary values pointing at CSS variables that haven't been defined.
- Anchor primary-intent fills on the indigo-violet palette (`indigo-500` / `indigo-600` / `indigo-700`) per the brand spec in `CLAUDE.md`. Default radius 8px (`rounded-lg`); cards/modals 12px (`rounded-xl`). Default control height 36px (`h-9`).

## Pre-flight (in order)

1. Read `CLAUDE.md` if not already in this session.
2. Read the most-similar existing component in `src/components/`. If empty, the v1 spec for the target component in `CLAUDE.md` is the only reference.
3. `mcp__figma-console__figma_get_status` — confirm connection.
4. `mcp__figma-console__figma_list_open_files` — confirm focus on the user's design system file.
5. `mcp__figma-console__figma_get_selection` — must return at least one node. If empty, stop and ask the user to select the Anatomy instance (or the parent frame containing Anatomy / Variants / States).
6. `mcp__figma-console__figma_get_component_for_development_deep` on the selected node — primary read. Pull raw fills / strokes / radii / spacing / typography directly from the node properties.
7. **Resolve the component name** in this order:
   1. The page name, if the selection lives on a page named for a v1 component.
   2. The selected node's name.
   3. Ask the user if ambiguous.
8. Confirm the resolved name maps to a v1 list entry. Stop otherwise.
9. Verify `src/lib/cn.ts` exists.
10. Verify the Vite/Storybook scaffold (`package.json`, `vite.config.ts`, `tailwind.config.*`). If absent, flag that build / a11y / dark-mode verification will be skipped — proceed but say so explicitly.
11. **Mode check** — `mcp__figma-console__figma_get_variables`. If variables exist AND `src/tokens/` exists, stop and route the user to `figma-to-code` instead.

## Translation rules (Figma → code)

| Figma artifact | Code |
| --- | --- |
| Selection's containing page name | Component name + folder name (`Button` → `src/components/Button/`) |
| `Radix:` annotation on the root | `import * as RadixX from "<package>"` (or bare DOM if `Radix: none` / absent) |
| Per-part annotations on descendants | JSX slots / props using the same names |
| Sibling `Variants` frame on the same page | `cva` `variants.variant` × `variants.size` keys + Storybook matrices |
| Sibling `States` frame on the same page | Tailwind state utilities: `hover:`, `focus-visible:`, `active:`, `disabled:`, `data-[state=loading]:` |
| Raw hex on a node | Closest Tailwind palette utility (`bg-indigo-600`, `text-white`, etc.) |
| Raw radius / spacing | Tailwind radius / padding / gap utility matching the px |
| Typography | `text-*`, `font-*` utilities |

## File output

For component `<Name>`:

1. `src/components/<Name>/<Name>.tsx`
   - `forwardRef` correctly typed.
   - `cva` block with `variant` and `size` keys; `defaultVariants: { size: "md", variant: <primary> }`.
   - Props type: `<Name>Props` extends the appropriate HTML element props plus `VariantProps<typeof <name>Variants>`.
   - `cn()` for className merging. `...rest` spread to root.
2. `src/components/<Name>/<Name>.stories.tsx`
   - Five stories: `Default`, `Variants`, `Sizes`, `States`, `Playground`.
   - `Variants` and `Sizes` render matrices mirroring the Figma frames.
   - `States` renders each state (use the appropriate trigger — `disabled`, `data-loading`, etc.).
   - `Playground` exposes `argTypes` for every prop.
   - `parameters: { a11y: { disable: false } }` and `tags: ["autodocs"]`.
3. `src/components/<Name>/index.ts` — `export { <Name>, type <Name>Props } from "./<Name>"`.
4. Append to `src/index.ts`: `export { <Name>, type <Name>Props } from "./components/<Name>"`.

## Figma ↔ code linkage — required after file output

Code Connect is **not available** through figma-console-mcp. Persist the link two ways using only that server's tools, so the strict `figma-to-code` skill can pick it up next time without re-resolving by name:

### A. Local manifest (source of truth for the code side)

Write `src/components/<Name>/.figma.json` with this shape:

```json
{
  "fileKey": "<from figma_list_open_files>",
  "componentName": "<Name>",
  "codePath": "src/components/<Name>/<Name>.tsx",
  "exportSymbol": "<Name>",
  "root": { "nodeId": "<root nodeId>" },
  "variants": [
    { "nodeId": "<id>", "props": { "variant": "primary", "size": "md" } }
  ],
  "updatedAt": "<ISO date>"
}
```

Capture `fileKey` from `mcp__figma-console__figma_list_open_files`, the root `nodeId` from `mcp__figma-console__figma_get_selection`, and each variant child's `nodeId` from the sibling `Variants` frame in the deep dev read. Variant `props` are inferred from the variant labels.

### B. Figma annotations (source of truth for the Figma side)

Annotations persist on the node and are readable later via `figma_get_annotations`. For each node we want to remember, call `mcp__figma-console__figma_set_annotations` with a label of the form:

- Root node:
  - `Code: src/components/<Name>/<Name>.tsx`
  - `Export: <Name>`
- Each variant child:
  - `Code: src/components/<Name>/<Name>.tsx`
  - `Props: variant=<value>, size=<value>` (whatever applies)

Don't overwrite existing annotations — first read with `figma_get_annotations`, merge the `Code:` / `Export:` / `Props:` entries alongside any pre-existing ones (like `Radix:`), then write back.

### Failure handling

If `figma_set_annotations` fails (permissions, locked node, etc.) do **not** block the run — the local manifest is enough on its own. Note the failure in the hand-off report.

Record both outputs in the hand-off report under a "Figma linkage" section: the manifest path and each annotated nodeId.

## Decisions log — required output

End the run by surfacing a markdown bullet list of every raw value used, formatted `intended.token.path → value  (where used)`. The user lifts these into `src/tokens/primitives/` + `src/tokens/semantic/` later.

```
- color.action.primary.bg        → #6366F1                (Button variant=primary background)
- color.action.primary.bg.hover  → #4F46E5                (Button variant=primary hover background)
- color.action.primary.fg        → #FFFFFF                (Button variant=primary text)
- radius.md                      → 8px                    (Button root)
- space.button.x.md              → 16px                   (Button md horizontal padding)
- space.button.y.md              → 8px                    (Button md vertical padding)
- shadow.elev-1                  → 0 1px 2px rgba(0,0,0,0.05)  (Button resting shadow)
```

Group entries by component part if it helps. Keep each on one line.

## Definition of done

- [ ] Implementation matches the v1 spec for that component (variants, sizes, states).
- [ ] Built on the appropriate Radix primitive (where one exists).
- [ ] Uses `cva` for variants, no inline ternaries.
- [ ] `forwardRef` correctly typed; `...rest` spread to root.
- [ ] Props type exported alongside the component.
- [ ] Storybook story exists with Default, Variants, Sizes, States, Playground.
- [ ] Visible focus ring via `focus-visible:`.
- [ ] Exported from `src/index.ts`.
- [ ] **Decisions log surfaced** — every raw value mapped to an intended token path.
- [ ] **Figma linkage written** — `src/components/<Name>/.figma.json` saved AND `Code:` / `Export:` / `Props:` annotations set on the matching nodes (or the annotation failure noted in the report).

If the Vite/Storybook scaffold isn't in place, the a11y / dark-mode / build checks can't run — say so explicitly. Don't fake it.

## Out of scope

- Don't write tests.
- Don't add new dependencies — ask first.
- Don't generate components outside the v1 list of 12.
- Don't edit `src/tokens/dist/` — ever.
- Don't modify `package.json`, `tsconfig.json`, `tailwind.config.*`, `vite.config.ts`, or anything in `src/tokens/` without showing the diff and waiting for approval.
- Don't push back to Figma (read-only on the design side).

## Stop conditions — ask the user before continuing

- No selection in Figma.
- Selection's page is not named for a v1 component AND the user provides no name.
- Component not in the v1 list of 12.
- A similar component already exists at `src/components/<Name>/` — ask before overwriting.
- Tokens **do** exist (`src/tokens/` populated AND Figma has variables) — route to `figma-to-code` instead.
