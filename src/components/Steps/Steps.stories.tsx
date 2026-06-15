import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { Steps, type StepsOnColor, type StepsType } from "./Steps"

const meta = {
  title: "Components/Steps",
  component: Steps,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          'Compact step / pagination indicator. Sourced from the TimeWorks Figma file (page "Steps", node 46949:9199). Three layout types — `gallery` (Back · dots · Next), `numbers` (Back · "X / Y" · Next), and `gallery-only` (just dots) — and two `onColor` palettes for use on white surfaces or on the brand-colour primary background.',
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    count: { control: { type: "range", min: 2, max: 7, step: 1 } },
    value: { control: { type: "number", min: 0, max: 6, step: 1 } },
    type: { control: "radio", options: ["gallery", "numbers", "gallery-only"] },
    onColor: { control: "radio", options: ["white", "primary"] },
    backLabel: { control: "text" },
    nextLabel: { control: "text" },
  },
  args: {
    count: 5,
    defaultValue: 1,
    type: "gallery",
    onColor: "white",
  },
} satisfies Meta<typeof Steps>

export default meta
type Story = StoryObj<typeof meta>

const Cell = ({ label, children, onColor }: { label: string; children: React.ReactNode; onColor?: StepsOnColor }) => (
  <div className="flex flex-col gap-3">
    <span className="text-t3 text-[var(--color-secondary-text-color)] uppercase tracking-wide">
      {label}
    </span>
    <div
      className={
        onColor === "primary"
          ? "rounded-md bg-[var(--color-primary-color)] p-6"
          : "rounded-md bg-[var(--color-primary-background-color)] p-6 border border-[var(--color-layout-border-color)]"
      }
    >
      {children}
    </div>
  </div>
)

export const Playground: Story = {}

export const Types: Story = {
  render: (args) => (
    <div className="flex flex-col gap-8">
      {(["gallery", "numbers", "gallery-only"] as const).map((t) => (
        <Cell key={t} label={t}>
          <Steps {...args} type={t} />
        </Cell>
      ))}
    </div>
  ),
}

export const OnColor: Story = {
  render: (args) => {
    const types: StepsType[] = ["gallery", "numbers", "gallery-only"]
    return (
      <div className="grid gap-8 md:grid-cols-2">
        {(["white", "primary"] as const).map((onColor) => (
          <div key={onColor} className="flex flex-col gap-6">
            <span className="text-t3 text-[var(--color-secondary-text-color)] uppercase tracking-wide">
              On {onColor}
            </span>
            <div
              className={
                onColor === "primary"
                  ? "flex flex-col gap-6 rounded-md bg-[var(--color-primary-color)] p-6"
                  : "flex flex-col gap-6 rounded-md bg-[var(--color-primary-background-color)] p-6 border border-[var(--color-layout-border-color)]"
              }
            >
              {types.map((t) => (
                <Steps key={t} {...args} type={t} onColor={onColor} />
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  },
}

export const Counts: Story = {
  render: (args) => (
    <div className="flex flex-col gap-6">
      {[2, 3, 4, 5, 6, 7].map((c) => (
        <Cell key={c} label={`count = ${c}`}>
          <Steps {...args} count={c} defaultValue={Math.min(1, c - 1)} />
        </Cell>
      ))}
    </div>
  ),
}

export const ProgressRange: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 5 }, (_, i) => (
        <Steps key={i} {...args} count={5} value={i} />
      ))}
    </div>
  ),
}

export const DarkSurface: Story = {
  render: (args) => (
    <div className="flex flex-col gap-6 rounded-md bg-[var(--color-inverted-color-background)] p-6">
      <Steps {...args} type="gallery" onColor="primary" />
      <Steps {...args} type="numbers" onColor="primary" />
      <Steps {...args} type="gallery-only" onColor="primary" />
    </div>
  ),
}

export const Interactive: Story = {
  render: (args) => {
    const [value, setValue] = useState(0)
    return (
      <div className="flex flex-col gap-3">
        <Steps {...args} value={value} onValueChange={setValue} />
        <span className="text-t3 text-[var(--color-secondary-text-color)]">
          Page {value + 1} of {args.count ?? 5}
        </span>
      </div>
    )
  },
}
