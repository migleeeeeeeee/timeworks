---
name: figma-design
description: Use when the user asks to design, lay out, or scaffold a component in Figma — pages, frames, variant matrices, anatomy, tokens, or states. Triggers on phrases like "design X in Figma", "set up the Figma page for X", "add the variants/states in Figma", or any authoring step that must happen in Figma before code is generated. Owns the upstream half of the two-step authoring flow defined in CLAUDE.md; the downstream half is the `figma-to-code` skill.
---

# figma-design

Design the Figma page for a component so that `figma-to-code` can later read it and emit conforming code.

This skill **only authors Figma**. It never writes to `src/`. If the user asks for code, hand off to `figma-to-code`.

## Pre-flight (do these first, in order)

1. Read `CLAUDE.md` end-to-end if you haven't this session. The v1 component list, brand differentiation, and architecture rules are non-negotiable.
2. Call `mcp__figma-console__figma_get_status`. If the plugin/console isn't connected, stop and tell the user to open Figma and load the figma-console plugin.
3. Call `mcp__figma-console__figma_list_open_files`. If multiple files are open, ask the user which is the design system file. If none, stop and ask them to open it.
4. Call `mcp__figma-console__figma_get_design_system_kit` and `mcp__figma-console__figma_get_variables` to learn what tokens already exist. Cache these — every fill/stroke/radius/spacing you set must reference one of them.
5. Confirm the target component is in the v1 list in `CLAUDE.md`. If it isn't, stop and ask. Do not invent components.

## Page structure (the contract for `figma-to-code`)

For every component, produce a single page named **exactly the component name** (`Button`, `TextField`, `Select`, …) containing exactly four top-level frames, in this order:

### `Anatomy`

- One canonical instance of the component at `size = md`, `variant = primary` (or the most common pairing).
- Use `mcp__figma-console__figma_set_annotations` to label every meaningful part: `root`, `label`, `icon-leading`, `icon-trailing`, `focus-ring`, `loading-spinner` — whatever applies. The annotation labels become the prop/structure names `figma-to-code` will look for.
- Add one annotation on the root titled exactly `Radix:` followed by the package the component is built on (e.g. `Radix: @radix-ui/react-dialog`). Use `Radix: none` for primitives with no Radix equivalent (Button, Tag, Avatar, Card). This annotation is **load-bearing** — `figma-to-code` reads it to decide which primitive to import.

### `Variants`

- A matrix laid out as rows = `variant`, columns = `size`. Use the cva-keyed names from `CLAUDE.md`:
  - Button-style components: `primary / secondary / tertiary / ghost / destructive` × `sm / md / lg`.
  - Tag intents: `neutral / info / success / warning / danger` × `sm / md`.
  - Avatar: sizes only (`xs / sm / md / lg / xl`).
- Every cell labeled with a text node `<variant>-<size>` directly above it.
- Use `mcp__figma-console__figma_arrange_component_set` to tidy spacing.

### `States`

- For the primary variant only, render: `default / hover / focus / active / disabled / loading` (omit states that don't apply — e.g. Avatar has no `loading`).
- `focus` must show the focus ring exactly as it'll render via `focus-visible:` in code.
- Each state labeled with a text node above it.

### `Tokens`

- Sticker sheet of every variable the component consumes: fills, strokes, radii, spacing, typography, shadows.
- Each swatch labeled with the **full variable path** (e.g. `color.action.primary.bg`, `radius.md`, `space.3`). `figma-to-code` reads these labels to map Figma → CSS-var → Tailwind class.

## Token discipline

- Never set a raw hex, raw number for radius, or raw spacing. Look up the variable via `figma_get_variables` and bind to it.
- If a needed token doesn't exist, **stop**. Surface the gap to the user. Token additions go through code (`src/tokens/primitives/` or `semantic/` → `npm run tokens:build`) — never via Figma.
- If you need to instantiate an existing component (icon, base shape), use `mcp__figma-console__figma_instantiate_component`, never copy-paste.

> If `figma_get_variables` returns zero collections, the token pipeline is in a broken state — stop and ask the user to restore the variables from Tokens Studio before continuing. Authoring without variables is not supported.

## Tool map

| Goal | Tool |
| --- | --- |
| Create a page or frame with auto-layout | `mcp__figma-console__figma_create_child` |
| Set fills / strokes (must bind to variable) | `mcp__figma-console__figma_set_fills`, `mcp__figma-console__figma_set_strokes` |
| Set text content / styles | `mcp__figma-console__figma_set_text` |
| Add anatomy / Radix annotations | `mcp__figma-console__figma_set_annotations` |
| Reuse an existing component | `mcp__figma-console__figma_instantiate_component` |
| Tidy a variant matrix | `mcp__figma-console__figma_arrange_component_set` |
| Inspect existing variables / styles | `mcp__figma-console__figma_get_variables`, `mcp__figma-console__figma_get_design_system_kit` |
| Verify visually | `mcp__figma-console__figma_take_screenshot` |
| Verify a11y | `mcp__figma-console__figma_audit_component_accessibility` |

## Verification (before declaring done)

1. `mcp__figma-console__figma_take_screenshot` of each of the four frames; surface the images to the user.
2. `mcp__figma-console__figma_audit_component_accessibility` on the canonical instance — zero violations.
3. `mcp__figma-console__figma_audit_design_system` — confirm no detached styles or raw values were introduced.
4. Confirm the page name, the four frame names, and the `Radix:` annotation are all present and spelled exactly as specified above. `figma-to-code` matches on these strings.

## Stop conditions — ask the user before continuing

- No Figma file open, or wrong file focused.
- A required token is missing from the variable collection — stop and ask the user to add it via Tokens Studio before continuing.
- The user hasn't named the component or specified which variant set is in scope.
- Tokens Studio is mid-sync (variables look inconsistent or in flight).

## Hand-off

Once verification passes, tell the user the Figma is ready and suggest invoking `figma-to-code` next. Do not generate code yourself.
