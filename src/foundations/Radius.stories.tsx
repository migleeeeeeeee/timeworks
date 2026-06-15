import type { Meta, StoryObj } from "@storybook/react"

type RadiusToken = {
  /** CSS custom property name registered in src/index.css (or the literal value for none/full) */
  cssVar: string
  /** Display name from the Figma file */
  name: string
  /** Tailwind utility backed by the CSS variable */
  utility: string
  /** Source value (kept verbatim from Figma) */
  value: string
  /** Plain-language guidance on where to use this radius */
  usage: string
  /** Pixel size of the preview swatch */
  previewSize: number
}

const RADII: RadiusToken[] = [
  {
    cssVar: "0",
    name: "Rounded/None",
    utility: "rounded-none",
    value: "0",
    usage: "Edges that meet other edges flush — full-bleed bands, dividers, table cells.",
    previewSize: 88,
  },
  {
    cssVar: "--radius-sm",
    name: "Rounded/4",
    utility: "rounded-sm",
    value: "4px",
    usage: "Tight UI accents — chips, tags, dense table affordances.",
    previewSize: 88,
  },
  {
    cssVar: "--radius-md",
    name: "Rounded/8",
    utility: "rounded-md",
    value: "8px",
    usage: "Default for interactive controls — buttons, inputs, selects, switches.",
    previewSize: 112,
  },
  {
    cssVar: "--radius-lg",
    name: "Rounded/12",
    utility: "rounded-lg",
    value: "12px",
    usage: "Surfaces that lift off the page — cards, modals, popovers.",
    previewSize: 136,
  },
  {
    cssVar: "--radius-xl",
    name: "Rounded/16",
    utility: "rounded-xl",
    value: "16px",
    usage: "Large featured surfaces — hero panels, illustrative containers.",
    previewSize: 160,
  },
  {
    cssVar: "--radius-2xl",
    name: "Rounded/24",
    utility: "rounded-2xl",
    value: "24px",
    usage: "Oversized presentational surfaces where softness is the point — onboarding cards, marketing tiles.",
    previewSize: 184,
  },
  {
    cssVar: "9999px",
    name: "Rounded/Full",
    utility: "rounded-full",
    value: "9999px",
    usage: "Pills and circular elements — avatars, badges, segmented toggles.",
    previewSize: 88,
  },
]

function radiusValue(token: RadiusToken): string {
  if (token.cssVar.startsWith("--")) return `var(${token.cssVar})`
  return token.cssVar
}

function RadiusRow({ token }: { token: RadiusToken }) {
  return (
    <tr style={{ borderBottom: "1px solid var(--color-layout-border-color)" }}>
      <td className="py-6 pr-6 align-middle">
        <div
          className="flex items-center justify-center"
          style={{
            background: "var(--color-allgrey-background-color)",
            width: 224,
            height: 224,
            borderRadius: "var(--radius-xl)",
          }}
        >
          <div
            style={{
              background: "var(--color-primary-color)",
              width: token.previewSize,
              height: token.previewSize,
              borderRadius: radiusValue(token),
            }}
            aria-label={`${token.name} preview`}
          />
        </div>
      </td>
      <td className="py-6 pr-6 align-middle">
        <div className="flex flex-col gap-0.5">
          <code className="text-t2 font-mono" style={{ color: "var(--color-primary-text-color)" }}>
            {token.name}
          </code>
          <code className="text-t3 font-mono" style={{ color: "var(--color-secondary-text-color)" }}>
            {token.cssVar.startsWith("--") ? token.cssVar : "—"}
          </code>
          <code className="text-t3 font-mono" style={{ color: "var(--color-secondary-text-color)" }}>
            class: {token.utility}
          </code>
        </div>
      </td>
      <td className="py-6 pr-6 align-middle">
        <code className="text-t2 font-mono" style={{ color: "var(--color-primary-text-color)" }}>
          {token.value}
        </code>
      </td>
      <td className="py-6 align-middle">
        <span className="text-t2" style={{ color: "var(--color-secondary-text-color)" }}>
          {token.usage}
        </span>
      </td>
    </tr>
  )
}

function RadiusSheet() {
  return (
    <div
      className="flex flex-col gap-12 px-10 py-10"
      style={{ background: "var(--color-primary-background-color)", color: "var(--color-primary-text-color)" }}
    >
      <div className="flex max-w-3xl flex-col gap-3">
        <h1 className="text-h1 font-heading font-bold">Border radius</h1>
        <p className="text-t1" style={{ color: "var(--color-secondary-text-color)" }}>
          Border radius softens the corners of UI surfaces and signals their role. Smaller radii
          read as utility (chips, dense controls); larger radii read as content surfaces
          (cards, modals). Each step is exposed as a CSS custom property in
          {" "}
          <code style={{ color: "var(--color-primary-text-color)" }}>src/index.css</code> under Tailwind
          v4&rsquo;s
          {" "}
          <code style={{ color: "var(--color-primary-text-color)" }}>@theme</code> block, so the value
          ships as a utility (e.g.
          {" "}
          <code style={{ color: "var(--color-primary-text-color)" }}>rounded-md</code>).
        </p>
        <p className="text-t1" style={{ color: "var(--color-secondary-text-color)" }}>
          Components must consume radii through these tokens — never hardcode a raw pixel value
          in component code. Sourced from the Figma file (page &ldquo;Border radius&rdquo;,
          node 46817:1236) via the Tokens Studio export.
        </p>
      </div>

      <section className="flex flex-col gap-4">
        <header className="flex flex-col gap-2">
          <h2
            className="text-h2 font-heading font-semibold"
            style={{ color: "var(--color-primary-text-color)" }}
          >
            The radius scale
          </h2>
          <p className="text-t1 max-w-prose" style={{ color: "var(--color-secondary-text-color)" }}>
            The default for interactive controls is
            {" "}
            <code style={{ color: "var(--color-primary-text-color)" }}>rounded-md</code> (8px). Cards
            and modals step up to
            {" "}
            <code style={{ color: "var(--color-primary-text-color)" }}>rounded-lg</code> (12px). Use
            {" "}
            <code style={{ color: "var(--color-primary-text-color)" }}>rounded-full</code> only for
            pills and circular elements.
          </p>
        </header>
        <table className="w-full border-collapse text-left">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-ui-border-color)" }}>
              <th
                className="text-t3 pb-3 pr-6 font-semibold uppercase tracking-wide"
                style={{ color: "var(--color-secondary-text-color)", width: "264px" }}
              >
                Sample
              </th>
              <th
                className="text-t3 pb-3 pr-6 font-semibold uppercase tracking-wide"
                style={{ color: "var(--color-secondary-text-color)", width: "240px" }}
              >
                Token
              </th>
              <th
                className="text-t3 pb-3 pr-6 font-semibold uppercase tracking-wide"
                style={{ color: "var(--color-secondary-text-color)", width: "120px" }}
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
            {RADII.map((t) => (
              <RadiusRow key={t.utility} token={t} />
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}

const meta = {
  title: "Foundations/Border radius",
  component: RadiusSheet,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof RadiusSheet>

export default meta
type Story = StoryObj<typeof meta>

export const BorderRadius: Story = {}
