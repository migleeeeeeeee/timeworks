import type { Meta, StoryObj } from "@storybook/react"
import { Label } from "./Label"

const COLORS = ["primary", "positive", "negative", "dark"] as const

const meta = {
  title: "Components/Label",
  component: Label,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'A non-clickable status pill placed next to the item it classifies. Sourced from the TimeWorks Figma file (page "Label", node 46939:7900). Two sizes × two kinds (fill, line) × four colors.',
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: { control: "radio", options: ["md", "sm"] },
    kind: { control: "radio", options: ["fill", "line"] },
    color: { control: "select", options: COLORS },
  },
  args: {
    children: "Label",
    size: "md",
    kind: "line",
    color: "primary",
  },
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-center gap-6">
    <span className="w-24 text-t3 text-[var(--color-secondary-text-color)] uppercase tracking-wide">
      {label}
    </span>
    <div className="flex flex-wrap items-center gap-3">{children}</div>
  </div>
)

export const Colors: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Row label="Fill · md">
        {COLORS.map((c) => (
          <Label key={c} kind="fill" color={c}>
            Label
          </Label>
        ))}
      </Row>
      <Row label="Line · md">
        {COLORS.map((c) => (
          <Label key={c} kind="line" color={c}>
            Label
          </Label>
        ))}
      </Row>
      <Row label="Fill · sm">
        {COLORS.map((c) => (
          <Label key={c} size="sm" kind="fill" color={c}>
            Label
          </Label>
        ))}
      </Row>
      <Row label="Line · sm">
        {COLORS.map((c) => (
          <Label key={c} size="sm" kind="line" color={c}>
            Label
          </Label>
        ))}
      </Row>
    </div>
  ),
}
