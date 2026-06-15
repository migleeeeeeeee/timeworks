import type { Meta, StoryObj } from "@storybook/react"

type ElevationToken = {
  /** CSS custom property name registered in src/index.css */
  cssVar: string
  /** Display name from the Figma file effect style */
  name: string
  /** Tailwind utility backed by the CSS variable */
  utility: string
  /** Source value (kept verbatim from Figma) */
  value: string
  /** Plain-language guidance on where to use this elevation */
  usage: string
  /** Pixel size of the preview swatch — mirrors the Figma overview */
  previewSize: number
}

const ELEVATIONS: ElevationToken[] = [
  {
    cssVar: "--shadow-lg",
    name: "Shadow/Large",
    utility: "shadow-lg",
    value: "0 15px 50px 0 rgba(0, 0, 0, 0.3)",
    usage: "Extra-large surfaces that float well above the page — modals, popovers anchored over busy content.",
    previewSize: 168,
  },
  {
    cssVar: "--shadow-md",
    name: "Shadow/Medium",
    utility: "shadow-md",
    value: "0 6px 20px 0 rgba(0, 0, 0, 0.2)",
    usage: "Large elements lifted off the canvas — menus, dropdowns, raised cards.",
    previewSize: 120,
  },
  {
    cssVar: "--shadow-sm",
    name: "Shadow/Small",
    utility: "shadow-sm",
    value: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
    usage: "Medium elements with a clear separation from their surface — tooltips, toasts, hover-state cards.",
    previewSize: 80,
  },
  {
    cssVar: "--shadow-xs",
    name: "Shadow/XS",
    utility: "shadow-xs",
    value: "0 4px 6px -4px rgba(0, 0, 0, 0.1)",
    usage: "Small elements that need only a hint of lift — chips, tags, low-emphasis buttons on hover.",
    previewSize: 56,
  },
]

function ElevationRow({ token }: { token: ElevationToken }) {
  return (
    <tr style={{ borderBottom: "1px solid var(--color-layout-border-color)" }}>
      <td className="py-6 pr-6 align-middle">
        <div
          className="flex items-center justify-center rounded-2xl"
          style={{
            background: "var(--color-allgrey-background-color)",
            width: 200,
            height: 200,
          }}
        >
          <div
            className="rounded-[14px]"
            style={{
              background: "var(--color-primary-background-color)",
              width: token.previewSize,
              height: token.previewSize,
              boxShadow: `var(${token.cssVar})`,
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
            {token.cssVar}
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

function ElevationSheet() {
  return (
    <div
      className="flex flex-col gap-12 px-10 py-10"
      style={{ background: "var(--color-primary-background-color)", color: "var(--color-primary-text-color)" }}
    >
      <div className="flex max-w-3xl flex-col gap-3">
        <h1 className="text-h1 font-heading font-bold">Elevation</h1>
        <p className="text-t1" style={{ color: "var(--color-secondary-text-color)" }}>
          Shadows express the level of elevation between surfaces. Use them consistently — items
          that share an elevation cannot occupy the same space. Each elevation is exposed as a CSS
          custom property in
          {" "}
          <code style={{ color: "var(--color-primary-text-color)" }}>src/index.css</code> under Tailwind
          v4&rsquo;s
          {" "}
          <code style={{ color: "var(--color-primary-text-color)" }}>@theme</code> block, which makes it
          available as a utility (e.g.
          {" "}
          <code style={{ color: "var(--color-primary-text-color)" }}>shadow-md</code>).
        </p>
        <p className="text-t1" style={{ color: "var(--color-secondary-text-color)" }}>
          Components must consume elevations through these tokens — never hardcode a raw shadow
          string in component code. Sourced verbatim from the Figma file (page &ldquo;Elevation&rdquo;,
          node 46814:2892) via the Tokens Studio export at{" "}
          <code style={{ color: "var(--color-primary-text-color)" }}>src/tokens/source/Global.json</code>.
        </p>
      </div>

      <section className="flex flex-col gap-4">
        <header className="flex flex-col gap-2">
          <h2
            className="text-h2 font-heading font-semibold"
            style={{ color: "var(--color-primary-text-color)" }}
          >
            The elevation scale
          </h2>
          <p className="text-t1 max-w-prose" style={{ color: "var(--color-secondary-text-color)" }}>
            Pick the lowest elevation that still reads clearly against its parent surface. Larger
            elements take heavier shadows because they sit further from the canvas; small chips and
            tags only need a whisper of lift.
          </p>
        </header>
        <table className="w-full border-collapse text-left">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-ui-border-color)" }}>
              <th
                className="text-t3 pb-3 pr-6 font-semibold uppercase tracking-wide"
                style={{ color: "var(--color-secondary-text-color)", width: "240px" }}
              >
                Sample
              </th>
              <th
                className="text-t3 pb-3 pr-6 font-semibold uppercase tracking-wide"
                style={{ color: "var(--color-secondary-text-color)", width: "260px" }}
              >
                Token
              </th>
              <th
                className="text-t3 pb-3 pr-6 font-semibold uppercase tracking-wide"
                style={{ color: "var(--color-secondary-text-color)", width: "320px" }}
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
            {ELEVATIONS.map((t) => (
              <ElevationRow key={t.cssVar} token={t} />
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}

const meta = {
  title: "Foundations/Elevation",
  component: ElevationSheet,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof ElevationSheet>

export default meta
type Story = StoryObj<typeof meta>

export const Elevation: Story = {}
