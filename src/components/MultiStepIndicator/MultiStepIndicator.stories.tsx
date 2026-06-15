import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import {
  MultiStepIndicator,
  type MultiStepIndicatorStep,
  type MultiStepIndicatorType,
} from "./MultiStepIndicator"

const SAMPLE_STEPS: MultiStepIndicatorStep[] = [
  { title: "Step title", subtitle: "Everything you can do here" },
  { title: "Step title", subtitle: "Everything you can do here" },
  { title: "Step title", subtitle: "Everything you can do here" },
  { title: "Step title", subtitle: "Everything you can do here" },
  { title: "Step title", subtitle: "Everything you can do here" },
]

const meta = {
  title: "Components/MultiStepIndicator",
  component: MultiStepIndicator,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          'Wizard-style step indicator. Sourced from the TimeWorks Figma file (page "Multi Step Indicator (Wizard)", node 46947:3287). Renders fulfilled / active / pending states from a `current` index, with `type` colouring the active+fulfilled discs. Two sizes (regular 48px, compact 24px) and two text placements (below the indicator, or inline beside it).',
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    current: { control: { type: "range", min: 0, max: 4, step: 1 } },
    type: { control: "radio", options: ["primary", "success", "dark", "danger"] },
    size: { control: "radio", options: ["regular", "compact"] },
    textPlacement: { control: "radio", options: ["below", "inline"] },
  },
  args: {
    steps: SAMPLE_STEPS,
    current: 0,
    type: "primary",
    size: "regular",
    textPlacement: "below",
  },
} satisfies Meta<typeof MultiStepIndicator>

export default meta
type Story = StoryObj<typeof meta>

const Cell = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-3">
    <span className="text-t3 text-[var(--color-secondary-text-color)] uppercase tracking-wide">
      {label}
    </span>
    {children}
  </div>
)

export const Playground: Story = {}

export const Types: Story = {
  render: (args) => (
    <div className="flex flex-col gap-10">
      {(["primary", "success", "dark", "danger"] as const).map((type) => (
        <Cell key={type} label={type}>
          <MultiStepIndicator {...args} type={type} current={1} />
        </Cell>
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-10">
      <Cell label="Regular · text below">
        <MultiStepIndicator {...args} size="regular" textPlacement="below" current={1} />
      </Cell>
      <Cell label="Regular · text inline">
        <MultiStepIndicator
          {...args}
          size="regular"
          textPlacement="inline"
          current={1}
          steps={SAMPLE_STEPS.map((s) => ({ title: s.title }))}
        />
      </Cell>
      <Cell label="Compact · inline title">
        <MultiStepIndicator
          {...args}
          size="compact"
          textPlacement="inline"
          current={1}
          steps={SAMPLE_STEPS.map((s) => ({ title: s.title }))}
        />
      </Cell>
    </div>
  ),
}

export const States: Story = {
  render: (args) => (
    <div className="flex flex-col gap-10">
      {[0, 2, 4].map((current) => (
        <Cell key={current} label={`current = ${current}`}>
          <MultiStepIndicator {...args} current={current} />
        </Cell>
      ))}
    </div>
  ),
}

export const Interactive: Story = {
  render: (args) => {
    const [current, setCurrent] = useState(1)
    return (
      <div className="flex flex-col gap-4">
        <MultiStepIndicator
          {...args}
          current={current}
          onStepClick={setCurrent}
          textPlacement="inline"
          steps={SAMPLE_STEPS.map((s) => ({ title: s.title }))}
        />
        <span className="text-t3 text-[var(--color-secondary-text-color)]">
          Click a step number to jump to it.
        </span>
      </div>
    )
  },
}

export const Matrix: Story = {
  render: () => {
    const types: MultiStepIndicatorType[] = ["primary", "success", "dark", "danger"]
    const compactSteps = SAMPLE_STEPS.map((s) => ({ title: s.title }))
    return (
      <div className="flex flex-col gap-12">
        {types.map((type) => (
          <div key={type} className="flex flex-col gap-6">
            <div className="text-t3 text-[var(--color-secondary-text-color)] uppercase tracking-wide">
              Type · {type}
            </div>
            <Cell label="Regular · below">
              <MultiStepIndicator type={type} current={1} steps={SAMPLE_STEPS} />
            </Cell>
            <Cell label="Regular · inline">
              <MultiStepIndicator
                type={type}
                current={1}
                textPlacement="inline"
                steps={compactSteps}
              />
            </Cell>
            <Cell label="Compact · inline">
              <MultiStepIndicator
                type={type}
                current={1}
                size="compact"
                textPlacement="inline"
                steps={compactSteps}
              />
            </Cell>
          </div>
        ))}
      </div>
    )
  },
}
