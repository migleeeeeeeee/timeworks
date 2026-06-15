---
name: figma-to-code
description: Use when the user asks to turn a Figma component into code, generate the React component from a Figma design, scaffold the Storybook story from Figma, or "build the code for the X component" once the Figma is ready. Reads the Figma file via figma-console MCP and writes `src/components/<Name>/*` plus the public export in `src/index.ts`. This is the downstream half of the two-step authoring flow defined in CLAUDE.md; the upstream half is the `figma-design` skill.
---

# figma-to-code

Read a finished Figma component page (produced by `figma-design`) and emit the React/TS component, Storybook story, barrel export, and public re-export — all conforming to every rule in `CLAUDE.md`.

This skill **only writes code**. It never edits Figma. If the user wants to change the design, route them back to `figma-design`.

## Hard guardrails (from `CLAUDE.md` — these are non-negotiable)

- Build on the Radix primitive named in the `Anatomy` frame's `Radix:` annotation. If `Radix: none`, build on the bare DOM element.
- Use `cva` for variants. No inline ternaries on `className`. No template-string class concatenation.
- Tokens only. No raw hex, raw px, or raw shadow strings. Map every Figma variable name to its CSS-var-backed Tailwind utility.
- `forwardRef` to the root element with the correct ref type (`HTMLButtonElement`, `HTMLInputElement`, …).
- Spread `...rest` to the root so consumers can pass `aria-*`, `data-*`, `id`.
- Export both the component and its props type: `export { Button, type ButtonProps }`.
- `size?: "sm" | "md" | "lg"` with `md` default (or the size set declared in the Figma `Variants` frame).
- Variant prop names match the labels in the Figma `Variants` frame exactly.
- Use `cn()` from `src/lib/cn.ts` for className composition.
- Visible focus ring via `focus-visible:` utilities.

> If `src/tokens/` doesn't exist or the Figma file has zero variables, the token pipeline is in a broken state — stop and ask the user to restore it via Tokens Studio before continuing. Code generation without tokens is not supported.

## Pre-flight (in order)

1. Read `CLAUDE.md` if not already in this session.
2. Read the most-similar existing component in `src/components/` and match its patterns. If `src/components/` is empty, the v1 spec for the target component in `CLAUDE.md` is the only reference.
3. `mcp__figma-console__figma_get_status` — confirm connection.
4. `mcp__figma-console__figma_list_open_files` — confirm the design system file is the focused one.
5. **Linkage lookup** (in order — stop at the first hit):
   1. Local manifest: read `src/components/<Name>/.figma.json` if present. The `root.nodeId` is authoritative — use it directly and skip the name search.
   2. Figma annotations: call `mcp__figma-console__figma_get_annotations` on candidate nodes (or scan the page). A node carrying a `Code: src/components/<Name>/<Name>.tsx` annotation is the mapped root. If found and no manifest exists, **rewrite** `src/components/<Name>/.figma.json` from the annotation data so future runs hit the fast path.
   3. Name search fallback: `mcp__figma-console__figma_search_components` for the target name. If still not found, **stop** and tell the user to run `figma-design` first.
6. Record which lookup path was used in the hand-off report.
6. `mcp__figma-console__figma_get_component_for_development_deep` on the component — this is the primary read.
7. `mcp__figma-console__figma_get_design_system_kit` and `mcp__figma-console__figma_get_token_values` — needed to map Figma variables to code tokens.
8. Confirm the page contains all four required frames (`Anatomy`, `Variants`, `States`, `Tokens`) and the `Radix:` annotation. If anything is missing, stop and route back to `figma-design`.
9. Verify the Vite scaffold exists (`package.json`, `vite.config.ts`). If not, flag that build verification will be skipped and ask the user whether to proceed.

## Translation rules (Figma → code)

| Figma artifact | Code |
| --- | --- |
| Page name | Component name + folder name (`Button` → `src/components/Button/`) |
| `Radix:` annotation on Anatomy root | `import * as RadixX from "<package>"`; structural skeleton wraps Radix parts |
| Anatomy part annotations (`label`, `icon-leading`, …) | JSX slots / props in the same names |
| `Variants` frame row labels | `cva` `variants.variant` keys |
| `Variants` frame column labels | `cva` `variants.size` keys (`md` is default) |
| `States` frame entries | Tailwind state utilities: `hover:`, `focus-visible:`, `active:`, `disabled:`, `data-[state=loading]:` |
| Token swatch labels in `Tokens` frame | Resolve via `figma_get_token_values` → CSS variable name → Tailwind utility (e.g. `bg-[var(--color-action-primary-bg)]` or, preferably, the matching `@theme`-mapped utility class) |
| Typography variable | Tailwind text utility backed by the same CSS var |
| Radius / spacing / shadow variable | Matching Tailwind utility (`rounded-md`, `px-3`, `shadow-elev-2`, etc.) |

If a Figma variable has no code counterpart yet, **stop**. Tell the user the token is missing and point them at `src/tokens/semantic/`. Do not invent a class.

## File output (matches `CLAUDE.md` folder shape)

For component `<Name>`:

1. `src/components/<Name>/<Name>.tsx` — the component:
   - `forwardRef` correctly typed.
   - `cva` block defining `variant` and `size`, with `defaultVariants` set.
   - Props type: `<Name>Props` extending the appropriate HTML element props (`React.ButtonHTMLAttributes<HTMLButtonElement>`, etc.) plus `VariantProps<typeof <name>Variants>`.
   - Spreads `...rest` to the root.
   - Uses `cn()` to merge.
   - Comments only when *why* is non-obvious.
2. `src/components/<Name>/<Name>.stories.tsx` — the story:
   - Five stories named exactly `Default`, `Variants`, `Sizes`, `States`, `Playground`.
   - `Variants` and `Sizes` render the matrices to mirror the Figma frames of the same names.
   - `States` renders each state from the Figma `States` frame.
   - `Playground` exposes typed `argTypes` for every prop.
   - `parameters: { a11y: { disable: false } }` so the addon runs.
   - `tags: ["autodocs"]` for inline docs.
3. `src/components/<Name>/index.ts` — barrel: `export { <Name>, type <Name>Props } from "./<Name>"`.
4. Append re-export to `src/index.ts`: `export { <Name>, type <Name>Props } from "./components/<Name>"`.

## Definition of done — walk this checklist before claiming complete

Reproduce the checklist from `CLAUDE.md` literally. Do not mark complete until each is true:

- [ ] Implementation matches the v1 spec for that component (variants, sizes, states).
- [ ] Built on the appropriate Radix primitive (where one exists).
- [ ] Uses `cva` for variants, no inline ternaries on classNames.
- [ ] All visual properties come from tokens (no raw colors/spacing/radii).
- [ ] `forwardRef` correctly typed; `...rest` spread to root.
- [ ] Props type exported alongside the component.
- [ ] Storybook story exists with Default, Variants, Sizes, States, Playground.
- [ ] Storybook a11y addon shows zero violations.
- [ ] Visible focus ring via `focus-visible:`.
- [ ] Works in both light and dark mode (toggle the theme in Storybook to verify).
- [ ] Exported from `src/index.ts`.

If the Vite/Storybook scaffold isn't in place yet, you cannot tick the last four boxes — say so explicitly. Don't fake it.

## Hand-off / next steps

After writing files, surface a short report:

- Files created (with paths).
- Tokens consumed (Figma variable name → code class).
- Any items on the done checklist that couldn't be verified (and why).
- Suggested next command to run: `npm run storybook` to inspect, or the next component in the v1 list.

## Out of scope — do not do these

- Don't write tests (`CLAUDE.md`: "Don't add tests yet").
- Don't add new dependencies — ask first.
- Don't generate components outside the v1 list of 12.
- Don't edit `src/tokens/dist/` — ever.
- Don't modify `package.json`, `tsconfig.json`, `tailwind.config.*`, `vite.config.ts`, or anything in `src/tokens/` without showing the diff and waiting for approval.
- Don't push changes back to Figma (this skill is read-only on Figma).

## Stop conditions — ask the user before continuing

- The Figma page is missing one of the four required frames or the `Radix:` annotation.
- A token referenced in `Tokens` doesn't exist in code yet.
- The component is not in the v1 list.
- A similar component already exists at `src/components/<Name>/` and would be overwritten.
