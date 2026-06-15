# Timezone Selection Menu — Design Spec

**Date:** 2026-06-07
**Surface:** Figma (TimeWorks Design System, file `gqYWCu1K6dJ9gESXtgNeCi`)
**Output stage:** Figma design first (code may follow in a later cycle)
**Anchor:** Toolbar timezone selector — node `28286:14275` (the `EST ▾` / `EDT ▾` control)

---

## Purpose

When a manager clicks the Toolbar's timezone selector, a dropdown opens listing the
three timezones relevant to the current view — the **member** being viewed, the
**manager** (you), and the **organization**. Picking a row sets which timezone the
view's times render in and updates the trigger label.

The existing mock labels (`Member's time zone` / `My time zone` / `ChabadWorks`) and
the `ABBR: Region - City` value format read as un-intuitive. This redesign keeps the
grouping but rewrites the copy in plain language and adds a clear selected cue.

## Decisions (locked)

- **Build location:** Figma design first, in the DS file, bound to DS styles.
- **Copy:** plain-language, no live clock.
- **Labels:** generic — `Member's time zone`, `Your time zone`, `Company time zone`.
- **Value format:** `City, Country (ABBR)` — e.g. `New York, USA (EDT)`.
- **Selected cue:** active row gets a `Check` icon (right) + value in primary indigo.

## Revision 2026-06-07 — Filters Modal reference alignment

The menu was restyled to match the DS **Filters Modal** (node `28288:125395`) as the
canonical surface/selection language. This supersedes a few earlier "locked" values:

- **Surface:** solid `primary-background-color` (#FAFBFD), radius **16**, **no stroke**
  (elevation carried by the standard raw drop-shadow: radius 20 / y6 / black 20%, the
  same shadow the Filters Modal uses — this file binds no `shadow-*` effect style).
- **Labels:** Karla **SemiBold 12/16, UPPERCASE** (`textCase: UPPER`), `secondary-text-color`.
- **Selected cue:** full-width **`primary-selected-color`** (#C7D9FF) row highlight,
  radius 6 — value text stays **`primary-text-color`** (dark, for contrast on the
  lavender); accent is the highlight + a `primary-color` check (right-aligned).
- **Type:** raw Karla at t-scale sizes with bound color vars (no Figma text styles —
  consistent with the rest of this file).

Applied directly to the existing build (node `28292:162342`); see the run log.

## Anatomy

Built on the DS **Popover** (Radix Popover under the hood) — anchored, dismiss on
outside-click / Esc, focus-managed. Rows behave as a single-select menu (radio
semantics: exactly one selected).

```
Trigger:  [ EDT  ⌄ ]                 ← chevron down closed / up open
           │
           ▼  (popover, below, left-aligned to trigger)
┌────────────────────────────────────┐
│  Member's time zone                 │  ← label  (t3, text-secondary)
│  Manila, Philippines (PST)          │  ← value  (t1, text-primary, medium)
│                                     │
│  Your time zone                  ✓  │  ← SELECTED: check + primary accent
│  New York, USA (EDT)                │
│                                     │
│  Company time zone                  │
│  New York, USA (EDT)                │
└────────────────────────────────────┘
```

## Layout & tokens

All visual properties bind to DS variables — no raw values.

**Surface**
- Radius: `12` (card radius)
- Fill: `color-background`
- Border: hairline, `color-border`
- Elevation: `shadow-md`
- Padding: `16`
- Width: hugs content (~`280`); left-aligned to trigger

**Row group** (×3)
- Gap between groups: `20`
- Gap between a row's label and value: `4`
- Row hit area padding: `8` vertical (so hover/selected background reads as a row)

**Type**
- Context label: `text-t3` (12/16), `color-text-secondary`
- Value: `text-t1` (16/22), medium weight, `color-text-primary`
- Selected value: `color-primary-color`

**Selected indicator**
- `Check` icon (lucide), right-aligned, `color-primary-color`

## States (Figma States frame)

1. **Trigger — closed:** label + chevron down.
2. **Trigger — open:** label + chevron up; popover visible.
3. **Row — default**
4. **Row — hover:** background `color-background-hover` (or DS menu-item hover token), full-row.
5. **Row — selected:** check icon + value in `color-primary-color`. Default mock = `Your time zone`.
6. **Row — selected + hover** (combination).

## Variants (Figma Variants frame)

The menu is a single composition; the meaningful variation is per-row state
(default / hover / selected), exercised in the States frame. The Variants frame shows
the assembled menu (closed trigger + open menu).

## Content (default mock)

| Context label        | Value                       | Selected |
|----------------------|-----------------------------|----------|
| Member's time zone   | Manila, Philippines (PST)   |          |
| Your time zone       | New York, USA (EDT)         | ✓        |
| Company time zone    | New York, USA (EDT)         |          |

## Tokens consumed (sticker sheet)

`color-background`, `color-background-hover`, `color-border`, `color-text-primary`,
`color-text-secondary`, `color-primary-color`, `shadow-md`, card radius `12`, spacing
`4 / 8 / 16 / 20`, `text-t1`, `text-t3`. (Exact leaf-key names verified against Tokens
Studio during authoring.)

## Out of scope

- Live local-clock per zone (declined).
- Search / filtering of timezones (only three contextual zones shown).
- React/Storybook implementation (separate, later cycle).
- Changing the Toolbar's other controls.

## Open questions

- None blocking. Exact DS hover-background token and Popover component node ID to be
  confirmed against the live DS file during the `figma-design` authoring pass.
