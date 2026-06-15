import type { Meta, StoryObj } from "@storybook/react"
import { LinearProgressBar } from "./LinearProgressBar"

const meta = {
  title: "Components/LinearProgressBar",
  component: LinearProgressBar,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          'Linear progress bar sourced from the TimeWorks Figma file (page "Linear Progress Bar", node 46946:16381). Single-colour variants (primary, positive, negative) take a `value` 0–100. The `multi` variant stacks segments end-to-end inside a single track for breakdowns/composition meters.',
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
    type: { control: "radio", options: ["primary", "positive", "negative", "multi"] },
    size: { control: "radio", options: ["sm", "lg"] },
    showLabel: { control: "boolean" },
    labelText: { control: "text" },
  },
  args: {
    value: 30,
    type: "primary",
    size: "sm",
    showLabel: true,
  },
} satisfies Meta<typeof LinearProgressBar>

export default meta
type Story = StoryObj<typeof meta>

const Cell = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-2">
    <span className="text-t3 text-[var(--color-secondary-text-color)] uppercase tracking-wide">
      {label}
    </span>
    <div className="w-72">{children}</div>
  </div>
)

export const Playground: Story = {}

export const Sizes: Story = {
  args: { showLabel: false },
  render: (args) => (
    <div className="flex flex-col gap-6 w-72">
      <Cell label="Small (4px)">
        <LinearProgressBar {...args} size="sm" />
      </Cell>
      <Cell label="Large (8px)">
        <LinearProgressBar {...args} size="lg" />
      </Cell>
    </div>
  ),
}

export const Types: Story = {
  args: { showLabel: true },
  render: (args) => (
    <div className="flex flex-col gap-6">
      <Cell label="Primary">
        <LinearProgressBar {...args} type="primary" value={30} />
      </Cell>
      <Cell label="Positive">
        <LinearProgressBar {...args} type="positive" value={72} />
      </Cell>
      <Cell label="Negative">
        <LinearProgressBar {...args} type="negative" value={18} />
      </Cell>
    </div>
  ),
}

export const Multi: Story = {
  args: { type: "multi", showLabel: true, size: "lg" },
  render: (args) => (
    <div className="flex flex-col gap-6">
      <Cell label="Multi · with label">
        <LinearProgressBar
          {...args}
          showLabel
          segments={[
            { value: 30, color: "primary" },
            { value: 25, color: "warning" },
            { value: 20, color: "positive" },
          ]}
        />
      </Cell>
      <Cell label="Multi · no label · small">
        <LinearProgressBar
          type="multi"
          size="sm"
          segments={[
            { value: 35, color: "primary" },
            { value: 25, color: "warning" },
            { value: 25, color: "positive" },
          ]}
        />
      </Cell>
    </div>
  ),
}

export const Matrix: Story = {
  render: () => (
    <div className="flex flex-col gap-10">
      {(["sm", "lg"] as const).map((size) => (
        <div key={size} className="flex flex-col gap-4">
          <div className="text-t3 text-[var(--color-secondary-text-color)] uppercase tracking-wide">
            Size · {size === "sm" ? "Small (4px)" : "Large (8px)"}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
            <Cell label="Primary · with label">
              <LinearProgressBar size={size} type="primary" value={30} showLabel />
            </Cell>
            <Cell label="Primary · no label">
              <LinearProgressBar size={size} type="primary" value={30} />
            </Cell>
            <Cell label="Positive · with label">
              <LinearProgressBar size={size} type="positive" value={30} showLabel />
            </Cell>
            <Cell label="Positive · no label">
              <LinearProgressBar size={size} type="positive" value={30} />
            </Cell>
            <Cell label="Negative · with label">
              <LinearProgressBar size={size} type="negative" value={30} showLabel />
            </Cell>
            <Cell label="Negative · no label">
              <LinearProgressBar size={size} type="negative" value={30} />
            </Cell>
            <Cell label="Multi · with label">
              <LinearProgressBar
                size={size}
                type="multi"
                showLabel
                segments={[
                  { value: 30, color: "primary" },
                  { value: 25, color: "warning" },
                  { value: 20, color: "positive" },
                ]}
              />
            </Cell>
            <Cell label="Multi · no label">
              <LinearProgressBar
                size={size}
                type="multi"
                segments={[
                  { value: 35, color: "primary" },
                  { value: 25, color: "warning" },
                  { value: 25, color: "positive" },
                ]}
              />
            </Cell>
          </div>
        </div>
      ))}
    </div>
  ),
}

export const Range: Story = {
  args: { showLabel: true },
  render: (args) => (
    <div className="flex flex-col gap-4 w-80">
      {[0, 10, 30, 50, 75, 100].map((v) => (
        <LinearProgressBar key={v} {...args} value={v} />
      ))}
    </div>
  ),
}
