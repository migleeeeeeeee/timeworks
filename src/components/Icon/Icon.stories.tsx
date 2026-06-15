import { useState, useMemo } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { Icon } from "./Icon"
import { ICON_NAMES, type IconName } from "../../icons/names"

const meta = {
  title: "Foundations/Icons",
  component: Icon,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "301 icons sourced from the TimeWorks Figma `Icons` page (node 25320:50806). Every SVG is normalised to `fill=\"currentColor\"`, so the icon colour is driven by its parent's text colour. Sizes match the Figma `Icon Wrapper` component: 2xs (12), xs (16), sm (20), md (24), lg (32).",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    name: { control: "select", options: [...ICON_NAMES] },
    size: { control: "inline-radio", options: ["2xs", "xs", "sm", "md", "lg"] },
    "aria-label": { control: "text" },
  },
  args: {
    name: "heart",
    size: "md",
  },
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-end gap-8">
      {(["2xs", "xs", "sm", "md", "lg"] as const).map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <Icon {...args} size={size} />
          <span className="text-t3 font-mono text-[var(--color-secondary-text-color)]">{size}</span>
        </div>
      ))}
    </div>
  ),
}

export const Colors: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-8">
      {[
        { label: "icon (default)", className: undefined },
        { label: "primary", className: "text-[var(--color-primary-color)]" },
        { label: "text-primary-text-color", className: "text-[var(--color-primary-text-color)]" },
        { label: "text-secondary", className: "text-[var(--color-secondary-text-color)]" },
        { label: "positive", className: "text-[var(--color-positive-color)]" },
        { label: "warning", className: "text-[var(--color-warning-color)]" },
        { label: "negative", className: "text-[var(--color-negative-color)]" },
      ].map((c) => (
        <div key={c.label} className="flex flex-col items-center gap-2">
          <Icon {...args} size="lg" className={c.className} />
          <span className="text-t3 font-mono text-[var(--color-secondary-text-color)]">{c.label}</span>
        </div>
      ))}
    </div>
  ),
}

export const Gallery: Story = {
  parameters: { controls: { disable: true } },
  render: () => <IconGallery />,
}

function IconGallery() {
  const [query, setQuery] = useState("")
  const filtered = useMemo<readonly IconName[]>(() => {
    const q = query.trim().toLowerCase()
    if (!q) return ICON_NAMES
    return ICON_NAMES.filter((n) => n.includes(q))
  }, [query])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search ${ICON_NAMES.length} icons…`}
          className="w-72 rounded-md border border-[var(--color-ui-border-color)] bg-[var(--color-primary-background-color)] px-3 py-2 text-t2 text-[var(--color-primary-text-color)] outline-none focus-visible:border-[var(--color-primary-color)]"
        />
        <span className="text-t3 text-[var(--color-secondary-text-color)]">
          {filtered.length} / {ICON_NAMES.length}
        </span>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-3">
        {filtered.map((n) => (
          <div
            key={n}
            className="flex flex-col items-center justify-center gap-2 rounded-lg border border-[var(--color-layout-border-color)] bg-[var(--color-primary-background-color)] p-3 hover:border-[var(--color-primary-color)] hover:text-[var(--color-primary-color)]"
          >
            <Icon name={n} size="md" aria-label={n} />
            <span className="truncate w-full text-center text-t3 font-mono text-[var(--color-secondary-text-color)]">
              {n}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
