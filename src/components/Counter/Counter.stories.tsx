import type { Meta, StoryObj } from "@storybook/react"
import { Counter } from "./Counter"

const meta = {
  title: "Components/Counter",
  component: Counter,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Counter is a standalone numeric pill that shows the count of some adjacent data. Sourced from the TimeWorks Figma file (page "Counter", node 46939:100209). Unlike Badge, Counter does not wrap a child — place it inline next to whatever it counts (tab labels, list items, etc.).',
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    count: { control: { type: "number", min: 0, max: 9999 } },
    max: { control: { type: "number", min: 1, max: 9999 } },
    size: { control: "radio", options: ["sm", "lg"] },
    kind: { control: "radio", options: ["fill", "line"] },
    color: { control: "radio", options: ["primary", "negative", "dark", "light"] },
  },
  args: {
    count: 5,
    max: 99,
    size: "lg",
    kind: "fill",
    color: "primary",
  },
} satisfies Meta<typeof Counter>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

const Cell = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col items-center gap-2">
    <div className="flex items-center justify-center h-7">{children}</div>
    <span className="text-t3 text-[var(--color-secondary-text-color)] uppercase tracking-wide">
      {label}
    </span>
  </div>
)

const COLORS = ["primary", "negative", "dark", "light"] as const
const KINDS = ["fill", "line"] as const

export const Matrix: Story = {
  render: () => (
    <div className="space-y-8">
      {(["lg", "sm"] as const).map((size) => (
        <div key={size} className="space-y-4">
          <div className="text-t3 text-[var(--color-secondary-text-color)] uppercase tracking-wide">
            Size · {size === "lg" ? "Large (24)" : "Small (18)"}
          </div>
          <div className="flex flex-wrap gap-x-10 gap-y-6">
            {KINDS.map((kind) =>
              COLORS.map((color) => (
                <Cell key={`${size}-${kind}-${color}`} label={`${color} · ${kind}`}>
                  <Counter size={size} kind={kind} color={color} count={5} />
                </Cell>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <Counter size="sm" count={5} />
      <Counter size="lg" count={5} />
    </div>
  ),
}

export const Colors: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      {COLORS.map((color) => (
        <Counter key={color} color={color} count={5} />
      ))}
    </div>
  ),
}

export const Overflow: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Counter count={3} />
      <Counter count={42} />
      <Counter count={120} />
      <Counter count={1500} max={999} />
    </div>
  ),
}
