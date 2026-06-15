import type { Meta, StoryObj } from "@storybook/react"

type Swatch = {
  /** CSS custom property name registered in src/index.css */
  cssVar: string
  /** Display name from the Figma file */
  name: string
  /** Source value (kept verbatim from Figma) */
  value: string
  /** Plain-language guidance on where to use this color */
  usage: string
  /** When true, render a 1px border so light swatches read on a white background */
  light?: boolean
}

type Group = {
  title: string
  description: string
  swatches: Swatch[]
}

const GROUPS: Group[] = [
  {
    title: "Primary colors",
    description:
      "Indigo-violet brand colors. Drive primary actions, focus rings, and selected states across the system.",
    swatches: [
      {
        cssVar: "--color-primary-color",
        name: "primary-color",
        value: "#6F54EB",
        usage: "Primary buttons, links on emphasis, focus ring, active brand surfaces.",
      },
      {
        cssVar: "--color-primary-hover-color",
        name: "primary-hover-color",
        value: "#6249D4",
        usage: "Hover state for primary buttons and brand-tinted controls.",
      },
      {
        cssVar: "--color-primary-selected-color",
        name: "primary-selected-color",
        value: "#E1DBFF",
        light: true,
        usage: "Selected rows, chips, or list items on a primary surface.",
      },
      {
        cssVar: "--color-primary-selected-hover-color",
        name: "primary-selected-hover-color",
        value: "#C2B7FF",
        light: true,
        usage: "Hover over a `primary-selected` item.",
      },
      {
        cssVar: "--color-primary-highlighted-color",
        name: "primary-highlighted-color",
        value: "#F6F4FF",
        light: true,
        usage: "Subtle brand-tinted highlight (e.g. callout backgrounds, soft hovers).",
      },
    ],
  },
  {
    title: "Text colors",
    description: "Foreground colors for typography. Pick the tier that matches the surface beneath it.",
    swatches: [
      {
        cssVar: "--color-primary-text-color",
        name: "primary-text-color",
        value: "#30343F",
        usage: "Default body and heading text on light surfaces.",
      },
      {
        cssVar: "--color-secondary-text-color",
        name: "secondary-text-color",
        value: "#6A6D76",
        usage: "Supporting copy, helper text, captions.",
      },
      {
        cssVar: "--color-text-color-on-inverted",
        name: "text-color-on-inverted",
        value: "#FFFFFF",
        light: true,
        usage: "Text rendered on `bg-inverted` (dark) surfaces.",
      },
      {
        cssVar: "--color-text-color-on-primary",
        name: "text-color-on-primary",
        value: "#FFFFFF",
        light: true,
        usage: "Text rendered on `primary-color` fills (e.g. inside a primary button).",
      },
      {
        cssVar: "--color-disabled-text-color",
        name: "disabled-text-color",
        value: "rgba(50, 51, 56, 0.38)",
        light: true,
        usage: "Disabled text labels and disabled control values.",
      },
    ],
  },
  {
    title: "Utility",
    description: "Borders, icons, links, and fixed neutrals that do not invert across themes.",
    swatches: [
      {
        cssVar: "--color-ui-border-color",
        name: "ui-border-color",
        value: "#C3C6D4",
        light: true,
        usage: "Borders on inputs, cards, menus, and other UI containers.",
      },
      {
        cssVar: "--color-layout-border-color",
        name: "layout-border-color",
        value: "#D0D4E4",
        light: true,
        usage: "Dividers and structural separators between layout regions.",
      },
      {
        cssVar: "--color-placeholder-color",
        name: "placeholder-color",
        value: "#676879",
        usage: "Input placeholder text and empty-state copy.",
      },
      {
        cssVar: "--color-icon-color",
        name: "icon-color",
        value: "#676879",
        usage: "Default icon fill on light surfaces.",
      },
      {
        cssVar: "--color-link-color",
        name: "link-color",
        value: "#1F76C2",
        usage: "Inline hyperlinks within body copy.",
      },
      {
        cssVar: "--color-fixed-dark-color",
        name: "fixed-dark-color",
        value: "#111111",
        usage: "A neutral dark that does not invert across themes (e.g. logos, fixed badges).",
      },
      {
        cssVar: "--color-fixed-light-color",
        name: "fixed-light-color",
        value: "#FFFFFF",
        light: true,
        usage: "A neutral light that does not invert across themes.",
      },
    ],
  },
  {
    title: "Backgrounds",
    description: "Surface tiers from primary white through to inverted dark. Compose by stacking quieter tiers behind louder content.",
    swatches: [
      {
        cssVar: "--color-primary-background-color",
        name: "primary-background-color",
        value: "#FFFFFF",
        light: true,
        usage: "Default page and card surface.",
      },
      {
        cssVar: "--color-secondary-background-color",
        name: "secondary-background-color",
        value: "#FFFFFF",
        light: true,
        usage: "Secondary surface — currently identical to `primary-background`; reserved for theme variation.",
      },
      {
        cssVar: "--color-primary-background-hover-color",
        name: "primary-background-hover-color",
        value: "rgba(103, 104, 121, 0.1)",
        light: true,
        usage: "Translucent hover overlay on neutral rows and list items.",
      },
      {
        cssVar: "--color-allgrey-background-color",
        name: "allgrey-background-color",
        value: "#F6F7FB",
        light: true,
        usage: "App canvas / page background behind cards.",
      },
      {
        cssVar: "--color-ui-background-color",
        name: "ui-background-color",
        value: "#E7E9EF",
        light: true,
        usage: "Resting fill for UI controls (e.g. tag/chip backgrounds, input filled state).",
      },
      {
        cssVar: "--color-disabled-background-color",
        name: "disabled-background-color",
        value: "#ECEDF5",
        light: true,
        usage: "Disabled control fill.",
      },
      {
        cssVar: "--color-primary-surface-color",
        name: "primary-surface-color",
        value: "#ECEFF8",
        light: true,
        usage: "Raised surface tint (e.g. selected nav, subtle panels).",
      },
      {
        cssVar: "--color-inverted-color-background",
        name: "inverted-color-background",
        value: "#323338",
        usage: "Dark inverted surfaces — tooltips, toasts, dark menus.",
      },
    ],
  },
  {
    title: "Severity",
    description: "Intent colors for positive, negative, and warning feedback. Use the matching `selected` pair for chips/tags and the `hover` for interactive states.",
    swatches: [
      {
        cssVar: "--color-positive-color",
        name: "positive-color",
        value: "#519A42",
        usage: "Success messages, valid states, positive metrics.",
      },
      {
        cssVar: "--color-positive-color-hover",
        name: "positive-color-hover",
        value: "#36672C",
        usage: "Hover state for positive buttons and links.",
      },
      {
        cssVar: "--color-positive-color-selected",
        name: "positive-color-selected",
        value: "#EFF8ED",
        light: true,
        usage: "Background for positive tags / chips / soft callouts.",
      },
      {
        cssVar: "--color-positive-color-selected-hover",
        name: "positive-color-selected-hover",
        value: "#BADFB3",
        light: true,
        usage: "Hover over a `positive-selected` chip.",
      },
      {
        cssVar: "--color-negative-color",
        name: "negative-color",
        value: "#D62839",
        usage: "Error messages, destructive actions, invalid states.",
      },
      {
        cssVar: "--color-negative-color-hover",
        name: "negative-color-hover",
        value: "#A71C2B",
        usage: "Hover state for destructive buttons and error links.",
      },
      {
        cssVar: "--color-negative-color-selected",
        name: "negative-color-selected",
        value: "#F9D3D7",
        light: true,
        usage: "Background for negative tags / chips / error callouts.",
      },
      {
        cssVar: "--color-negative-color-selected-hover",
        name: "negative-color-selected-hover",
        value: "#F9D3D7",
        light: true,
        usage: "Hover over a `negative-selected` chip. ⚠ Same hex as `negative-selected` in Figma — flag during token promotion.",
      },
      {
        cssVar: "--color-warning-color",
        name: "warning-color",
        value: "#FFCB00",
        light: true,
        usage: "Warning indicators and caution messages.",
      },
      {
        cssVar: "--color-warning-color-hover",
        name: "warning-color-hover",
        value: "#EAAA15",
        usage: "Hover state for warning controls.",
      },
      {
        cssVar: "--color-warning-color-selected",
        name: "warning-color-selected",
        value: "#FCEBA1",
        light: true,
        usage: "Background for warning tags / chips / soft callouts.",
      },
      {
        cssVar: "--color-warning-color-selected-hover",
        name: "warning-color-selected-hover",
        value: "#F2D973",
        light: true,
        usage: "Hover over a `warning-selected` chip.",
      },
      {
        cssVar: "--color-private",
        name: "private-color",
        value: "#F65F7C",
        usage: "Marker for private / restricted-visibility content.",
      },
      {
        cssVar: "--color-sharable",
        name: "sharable-color",
        value: "#A358DF",
        usage: "Marker for shareable / public content.",
      },
    ],
  },
]

function SwatchRow({ swatch }: { swatch: Swatch }) {
  return (
    <tr style={{ borderBottom: "1px solid var(--color-layout-border-color)" }}>
      <td className="py-4 pr-6 align-middle">
        <div
          className="h-12 w-20 rounded-md"
          style={{
            background: `var(${swatch.cssVar})`,
            boxShadow: swatch.light ? "inset 0 0 0 1px rgba(17, 17, 17, 0.08)" : undefined,
          }}
          aria-label={`${swatch.name} swatch — ${swatch.value}`}
        />
      </td>
      <td className="py-4 pr-6 align-middle">
        <div className="flex flex-col gap-0.5">
          <code className="text-t2 font-mono" style={{ color: "var(--color-primary-text-color)" }}>
            {swatch.name}
          </code>
          <code className="text-t3 font-mono" style={{ color: "var(--color-secondary-text-color)" }}>
            {swatch.cssVar}
          </code>
        </div>
      </td>
      <td className="py-4 pr-6 align-middle whitespace-nowrap">
        <code className="text-t2 font-mono" style={{ color: "var(--color-primary-text-color)" }}>
          {swatch.value}
        </code>
      </td>
      <td className="py-4 align-middle">
        <span className="text-t2" style={{ color: "var(--color-secondary-text-color)" }}>
          {swatch.usage}
        </span>
      </td>
    </tr>
  )
}

function GroupSection({ group }: { group: Group }) {
  return (
    <section className="flex flex-col gap-4">
      <header className="flex flex-col gap-2">
        <h2
          className="text-h2 font-heading font-semibold"
          style={{ color: "var(--color-primary-text-color)" }}
        >
          {group.title}
        </h2>
        <p className="text-t1 max-w-prose" style={{ color: "var(--color-secondary-text-color)" }}>
          {group.description}
        </p>
      </header>
      <table className="w-full border-collapse text-left">
        <thead>
          <tr style={{ borderBottom: "1px solid var(--color-ui-border-color)" }}>
            <th
              className="text-t3 pb-3 pr-6 font-semibold uppercase tracking-wide"
              style={{ color: "var(--color-secondary-text-color)", width: "120px" }}
            >
              Sample
            </th>
            <th
              className="text-t3 pb-3 pr-6 font-semibold uppercase tracking-wide"
              style={{ color: "var(--color-secondary-text-color)", width: "320px" }}
            >
              Token
            </th>
            <th
              className="text-t3 pb-3 pr-6 font-semibold uppercase tracking-wide"
              style={{ color: "var(--color-secondary-text-color)", width: "200px" }}
            >
              Value
            </th>
            <th
              className="text-t3 pb-3 font-semibold uppercase tracking-wide"
              style={{ color: "var(--color-secondary-text-color)" }}
            >
              Usage
            </th>
          </tr>
        </thead>
        <tbody>
          {group.swatches.map((s) => (
            <SwatchRow key={s.cssVar} swatch={s} />
          ))}
        </tbody>
      </table>
    </section>
  )
}

function ColorsSheet() {
  return (
    <div
      className="flex flex-col gap-12 px-10 py-10"
      style={{ background: "var(--color-primary-background-color)", color: "var(--color-primary-text-color)" }}
    >
      <div className="flex max-w-3xl flex-col gap-3">
        <h1 className="text-h1 font-heading font-bold">Colors</h1>
        <p className="text-t1" style={{ color: "var(--color-secondary-text-color)" }}>
          The TimeWorks color palette. Each color is exposed as a CSS custom property in
          {" "}
          <code style={{ color: "var(--color-primary-text-color)" }}>src/index.css</code> under Tailwind v4’s
          {" "}
          <code style={{ color: "var(--color-primary-text-color)" }}>@theme</code> block, which makes it available as a
          utility (e.g.
          {" "}
          <code style={{ color: "var(--color-primary-text-color)" }}>bg-primary-color</code>,
          {" "}
          <code style={{ color: "var(--color-primary-text-color)" }}>text-text-primary</code>).
        </p>
        <p className="text-t1" style={{ color: "var(--color-secondary-text-color)" }}>
          Components must consume colors through these tokens — never hardcode a hex value or write a literal raw
          color in component code. Sourced verbatim from the Figma file (page “■ Colors”, node 46814:454) via the
          Tokens Studio export at{" "}
          <code style={{ color: "var(--color-primary-text-color)" }}>src/tokens/source/Color Tokens/</code>.
        </p>
      </div>

      {GROUPS.map((g) => (
        <GroupSection key={g.title} group={g} />
      ))}
    </div>
  )
}

const meta = {
  title: "Foundations/Colors",
  component: ColorsSheet,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof ColorsSheet>

export default meta
type Story = StoryObj<typeof meta>

export const Colors: Story = {}
