import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { ButtonGroup, ButtonGroupItem } from "./ButtonGroup"

const meta = {
  title: "Components/ButtonGroup",
  component: ButtonGroup,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Segmented selector for picking a single value from a small set of related options. Sourced from the TimeWorks Figma file (page "Button Group", node 46939:7887). Use sparingly — limit to 2–5 options that are mutually exclusive and roughly equal in length.',
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["default", "tertiary"] },
    size: { control: "select", options: ["sm", "md", "lg"] },
    disabled: { control: "boolean" },
  },
  args: {
    variant: "default",
    size: "md",
    disabled: false,
  },
} satisfies Meta<typeof ButtonGroup>

export default meta
type Story = StoryObj<typeof meta>

const ITEMS = ["Day", "Week", "Month", "Quarter", "Year"]

const Col = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-2">
    <span className="text-t3 text-[color:var(--color-secondary-text-color)] uppercase tracking-wide">
      {label}
    </span>
    {children}
  </div>
)

export const Playground: Story = {
  render: (args) => (
    <ButtonGroup {...args} aria-label="Time range" defaultValue="Week">
      {ITEMS.map((v) => (
        <ButtonGroupItem key={v} value={v}>
          {v}
        </ButtonGroupItem>
      ))}
    </ButtonGroup>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <Col label="Default">
        <ButtonGroup aria-label="Default variant" defaultValue="Day">
          {ITEMS.map((v) => (
            <ButtonGroupItem key={v} value={v}>
              {v}
            </ButtonGroupItem>
          ))}
        </ButtonGroup>
      </Col>
      <Col label="Tertiary">
        <ButtonGroup variant="tertiary" aria-label="Tertiary variant" defaultValue="Day">
          {ITEMS.map((v) => (
            <ButtonGroupItem key={v} value={v}>
              {v}
            </ButtonGroupItem>
          ))}
        </ButtonGroup>
      </Col>
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {(["sm", "md", "lg"] as const).map((size) => (
        <Col key={size} label={size}>
          <ButtonGroup size={size} aria-label={`Size ${size}`} defaultValue="Day">
            {ITEMS.map((v) => (
              <ButtonGroupItem key={v} value={v}>
                {v}
              </ButtonGroupItem>
            ))}
          </ButtonGroup>
        </Col>
      ))}
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <Col label="Disabled (group)">
        <ButtonGroup disabled aria-label="Disabled group" defaultValue="Day">
          {ITEMS.map((v) => (
            <ButtonGroupItem key={v} value={v}>
              {v}
            </ButtonGroupItem>
          ))}
        </ButtonGroup>
      </Col>
      <Col label="Disabled (single item)">
        <ButtonGroup aria-label="Single disabled" defaultValue="Day">
          <ButtonGroupItem value="Day">Day</ButtonGroupItem>
          <ButtonGroupItem value="Week" disabled>
            Week
          </ButtonGroupItem>
          <ButtonGroupItem value="Month">Month</ButtonGroupItem>
        </ButtonGroup>
      </Col>
    </div>
  ),
}

export const Controlled: Story = {
  render: () => {
    function ControlledExample() {
      const [value, setValue] = useState("Week")
      return (
        <div className="flex flex-col gap-3">
          <ButtonGroup value={value} onValueChange={setValue} aria-label="Range">
            {ITEMS.map((v) => (
              <ButtonGroupItem key={v} value={v}>
                {v}
              </ButtonGroupItem>
            ))}
          </ButtonGroup>
          <span className="text-t2 text-[color:var(--color-secondary-text-color)]">
            Selected: <span className="font-mono">{value}</span>
          </span>
        </div>
      )
    }
    return <ControlledExample />
  },
}
