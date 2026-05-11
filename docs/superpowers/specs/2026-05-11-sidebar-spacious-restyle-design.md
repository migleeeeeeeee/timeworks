# Sidebar — Spacious Restyle (Hyde-inspired)

**Date:** 2026-05-11
**Type:** Design spec for an existing DS component
**Sequence:** Figma authoring first → code generation after (two-step `figma-design` → `figma-to-code` flow)

## Goal

Restyle the existing `Sidebar` component to feel spacious and deliberate — borrowing the typographic rhythm, sectioned grouping, and expandable groups from the Hyde casino reference — while staying entirely within the existing TimeWorks token system.

This is a **restyle in place** (Approach A). Defaults change; every consumer of `Sidebar` will visually shift. The current Sidebar lives in the DS Figma library at node `25694:158051` and is exported from `src/components/Sidebar/`.

## Non-goals

- No new theming surface; reuses existing tokens.
- No top-of-panel context switcher (Casino/Sports-style pill toggle).
- No nested groups (groups contain only links in v1).
- No left accent bar / pill active treatment.
- No new Figma tokens unless an existing one is genuinely missing (flag during authoring, add via Tokens Studio first).

## Reference

The Hyde casino sidebar provided by the user — read for *rhythm*, not literal styling. We keep our type families (Montserrat / Karla), our token palette, and our existing icons. We borrow:

1. Spacious vertical rhythm (taller rows, generous gaps).
2. Sectioned groups with subtle dividers and optional uppercase section titles.
3. Expandable group rows with trailing chevron.

## Visual rhythm

| Property | Value |
|---|---|
| Panel width | 240 (`width` prop, configurable) |
| Outer panel padding (top/bottom) | 20 |
| Side padding | 16 |
| Nav row height | **44** |
| Section-title row height | 28 |
| Expanded child row height | 36 |
| Gap between sections | 24 |
| Divider between sections | 1px, `--color-border-color-subtle`, inside side padding |
| Icon size | 20 |
| Icon → label gap | 12 |

## Typography

- **Nav row label:** `text-t3` (12/16), **UPPERCASE**, letter-spacing `+0.06em`, weight 600.
- **Section title:** `text-t3` UPPERCASE, `--color-text-color-tertiary`, no icon, 28px row.
- Active label uses `--color-text-color`; inactive uses `--color-text-color-secondary`.
- Inactive icon uses `--color-text-color-tertiary` (one step dimmer than the label — icons recede, labels lead).

## States

- **Default:** transparent row bg, label `secondary`, icon `tertiary`.
- **Hover:** bg `--color-background-hover-color`, 120ms ease.
- **Active (current route):** bg `--color-background-selected-color`, label + icon `--color-text-color`. Flat fill — no accent bar, no pill.
- **Focus-visible:** 2px inset ring `--color-border-focus-color`, full row.
- **Expandable group with active child:** 4px dot indicator on the chevron side in `--color-primary-color`. Parent row itself is NOT painted as active; the child row remains the loudest signal.

## Sections API

```ts
type SidebarLink = {
  kind: "link"
  id: string
  icon: IconType
  label: string
  href?: string
  active?: boolean
  onSelect?: () => void
}

type SidebarGroup = {
  kind: "group"
  id: string
  icon: IconType
  label: string
  defaultOpen?: boolean
  open?: boolean                       // controlled
  onOpenChange?: (open: boolean) => void
  children: SidebarLink[]              // no nested groups in v1
}

type SidebarItem = SidebarLink | SidebarGroup

type SidebarSection = {
  id: string
  title?: string                       // omit for untitled section (gap+divider only)
  items: SidebarItem[]
}

interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  sections: SidebarSection[]
  renderHeader?: () => ReactNode       // defaults to brand mark
  renderFooter?: () => ReactNode       // defaults to nothing
  width?: number                       // default 240
}

export { Sidebar, type SidebarProps, type SidebarSection, type SidebarItem }
```

**API migration: clean break.** The previous flat `items` prop is removed. Existing consumers in this repo (showcase + any pages) are updated to wrap their items in a single untitled section. No deprecation alias.

## Expandable group behavior

- Built on `Radix Accordion.Root type="multiple"` internally; each group is an `Accordion.Item`.
- Trailing chevron: right when collapsed, down when expanded, 200ms ease (brand standard cubic-bezier).
- Children render **indented 32px** from the panel side padding (aligns under the parent label, not the parent icon), at 36px row height.
- Keyboard: Enter/Space toggles; ArrowRight expands; ArrowLeft collapses (Radix Accordion defaults).
- Whole parent row is the toggle target.
- Controlled + uncontrolled via `open` / `defaultOpen` / `onOpenChange`.

## Header & footer

- **Header (64px):** brand mark left-aligned at 24px. Divider below.
- **Footer:** divider above, 56px tall, side-padded. Rendered only when `renderFooter` is provided.
- Both slots are content-agnostic in the DS; consumers fill them via render props.

## Tokens

All values resolve to existing tokens — **no new tokens expected**:

| Role | Token |
|---|---|
| Panel surface | `--color-background-color` |
| Row hover surface | `--color-background-hover-color` |
| Row active surface | `--color-background-selected-color` |
| Active label/icon | `--color-text-color` |
| Inactive label | `--color-text-color-secondary` |
| Inactive icon | `--color-text-color-tertiary` |
| Section title | `--color-text-color-tertiary` |
| Divider | `--color-border-color-subtle` |
| Focus ring | `--color-border-focus-color` |
| Group-active dot | `--color-primary-color` |
| Spacing | `--space-12 / 16 / 20 / 24 / 32` |
| Type | `text-t3` + Tailwind uppercase + tracking |

If any of these is missing in the live token export, the `figma-design` step halts and we add it in Tokens Studio first per CLAUDE.md "Tokens" rules.

## Work order

This spec is the **design contract**. Execution is two phases:

### Phase 1 — Figma (authoritative)

Run the `figma-design` skill against the DS library file `04x9q7W2Y59baF5MqHAVZR`, on the Sidebar component page (component node `25694:158051`, related Sidebar Icon Button `25694:157615`). The skill must produce the standard four-frame contract for the restyled Sidebar:

- **Anatomy** — annotated structure (panel, header, sections, section title, link row, group row, group children, footer; Radix primitive notes on group rows).
- **Variants** — flat (sections only) and grouped (with one expandable group, open + closed).
- **States** — default, hover, active, focus-visible, group-with-active-child, disabled (if applicable to a row).
- **Tokens** — sticker sheet of every variable consumed.

Every fill, stroke, radius, and spacing in the new design must bind to a Figma variable. The component-set in Figma must include variant props matching the code API (`kind`, `state`, `open`).

**Caveat:** the figma-console MCP is currently connected to the Experiment file (`gqYWCu1K6dJ9gESXtgNeCi`), not the DS library file (`04x9q7W2Y59baF5MqHAVZR`). Before authoring, switch the active Figma Desktop file to the DS library so component edits land in the published source — or, if intentionally exploring in the Experiment file first, copy results back to the DS library before code generation.

### Phase 2 — Code (after Figma sign-off)

Run the `figma-to-code` skill against the updated Sidebar component. Expected output:

- `src/components/Sidebar/Sidebar.tsx` — replaced with the new API; cva variants; Radix Accordion under the hood; forwardRef + ...rest spread.
- `src/components/Sidebar/Sidebar.stories.tsx` — Default, Sections, ExpandableGroup, States, Playground; theme toggle exercised for light/dark/black.
- `src/components/Sidebar/Sidebar.test.tsx` — keyboard + controlled/uncontrolled group behavior; active-state rendering.
- `src/components/Sidebar/index.ts` — barrel.
- `src/index.ts` — types added to public export.
- Migrate any in-repo consumers from the old `items` prop to `sections`.

## Definition of done

Per CLAUDE.md component checklist, plus:

- [ ] Figma component-set published in the DS library with Anatomy / Variants / States / Tokens frames.
- [ ] All visual properties bound to Figma variables (no raw hex / px in the Figma source).
- [ ] React component rebuilt against the new API; old `items` prop removed; consumers migrated.
- [ ] Storybook stories cover sections, expandable groups, all states; a11y addon clean.
- [ ] Renders correctly in light / dark / black via the Storybook toolbar.
- [ ] Co-located test file.

## Open questions

None at spec time. Any missing token surfaces (e.g. `--color-background-selected-color` for the active row) get raised during Phase 1 and resolved in Tokens Studio before Phase 2.
