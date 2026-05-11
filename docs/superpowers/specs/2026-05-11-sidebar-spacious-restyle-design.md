# Sidebar — Spacious Restyle (Hyde-inspired)

**Date:** 2026-05-11
**Type:** Design spec for an existing DS component
**Sequence:** Figma authoring first → code generation after (two-step `figma-design` → `figma-to-code` flow)

## Goal

Restyle the existing `Sidebar` component to feel spacious and deliberate — borrowing the typographic rhythm, sectioned grouping, and expandable groups from the Hyde casino reference — while staying entirely within the existing TimeWorks token system.

This is a **restyle in place** (Approach A). Defaults change; every consumer of `Sidebar` will visually shift. The current Sidebar lives in the working DS Figma file (`gqYWCu1K6dJ9gESXtgNeCi` — "TimeWorks Design System (Experiment)") on the **Sidebar** page (`25685:133449`); the existing component set for rows is `Sidebar Item` (`25694:157418`). No code component exists yet under `src/components/Sidebar/`.

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

Token mapping resolved against the live Color Tokens collection in `gqYWCu1K6dJ9gESXtgNeCi` (Light/Dark/Black modes). No new tokens required — gaps in the original spec (tertiary text, focus ring) are absorbed by existing tokens per user decision 2026-05-11 ("use existing tokens, rhythm carries hierarchy").

| Role | Figma variable | CSS var |
|---|---|---|
| Panel surface | `ui-background-color` | `--color-ui-background-color` |
| Row hover surface | `primary-background-hover-color` | `--color-primary-background-hover-color` |
| Row active surface | `primary-selected-color` | `--color-primary-selected-color` |
| Active row hover | `primary-selected-hover-color` | `--color-primary-selected-hover-color` |
| Active label + icon | `primary-text-color` | `--color-primary-text-color` |
| Inactive label | `secondary-text-color` | `--color-secondary-text-color` |
| Inactive icon | `secondary-text-color` | `--color-secondary-text-color` |
| Section title | `secondary-text-color` | `--color-secondary-text-color` |
| Divider | `layout-border-color` | `--color-layout-border-color` |
| Focus ring | `primary-color` | `--color-primary-color` |
| Group-active dot | `primary-color` | `--color-primary-color` |
| Disabled text/icon | `disabled-text-color` | `--color-disabled-text-color` |
| Spacing | `--space-12 / 16 / 20 / 24 / 32` |
| Type | `text-t3` + Tailwind uppercase + tracking |

Hierarchy now relies on vertical rhythm + weight rather than a third text-color step. Inactive icons sit at the same color as inactive labels (`secondary-text-color`); the larger row height, uppercase labels, and section gaps carry the "airy / scannable" effect from the reference.

## Work order

This spec is the **design contract**. Execution is two phases:

### Phase 1 — Figma (authoritative)

Run the `figma-design` skill against the working DS file `gqYWCu1K6dJ9gESXtgNeCi` ("TimeWorks Design System (Experiment)"), on the **Sidebar** page (`25685:133449`). The existing `Sidebar Item` component set is `25694:157418`; the skill should produce a new component set for the restyled row + group-row + section-title primitives, and a parent `Sidebar` component-set that composes them. The skill must produce the standard four-frame contract for the restyled Sidebar:

- **Anatomy** — annotated structure (panel, header, sections, section title, link row, group row, group children, footer; Radix primitive notes on group rows).
- **Variants** — flat (sections only) and grouped (with one expandable group, open + closed).
- **States** — default, hover, active, focus-visible, group-with-active-child, disabled (if applicable to a row).
- **Tokens** — sticker sheet of every variable consumed.

Every fill, stroke, radius, and spacing in the new design must bind to a Figma variable. The component-set in Figma must include variant props matching the code API (`kind`, `state`, `open`).

**File policy:** the Experiment file (`gqYWCu1K6dJ9gESXtgNeCi`) is the working DS file going forward (decision 2026-05-11). All Figma authoring lands here.

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
