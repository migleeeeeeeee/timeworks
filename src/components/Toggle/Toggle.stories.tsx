import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { Toggle } from "./Toggle"

const meta = {
  title: "Components/Toggle",
  component: Toggle,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Toggles let users turn a single option on or off, typically for activating or deactivating a setting. Sourced from the TimeWorks Figma file (page "Toggle", node 46949:40910). Built on @radix-ui/react-switch so keyboard, focus, and ARIA semantics come from Radix.',
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md"] },
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
    labelOff: { control: "text" },
    labelOn: { control: "text" },
  },
  args: {
    size: "md",
    labelOff: "Off",
    labelOn: "On",
  },
} satisfies Meta<typeof Toggle>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

const Row = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-wrap items-center gap-6">{children}</div>
)
const Col = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-3">
    <span className="text-t3 text-[color:var(--color-secondary-text-color)] uppercase tracking-wide">
      {label}
    </span>
    {children}
  </div>
)

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <Col label="Medium">
        <Row>
          <Toggle />
          <Toggle defaultChecked />
          <Toggle disabled />
          <Toggle defaultChecked disabled />
        </Row>
      </Col>
      <Col label="Small">
        <Row>
          <Toggle size="sm" />
          <Toggle size="sm" defaultChecked />
          <Toggle size="sm" disabled />
          <Toggle size="sm" defaultChecked disabled />
        </Row>
      </Col>
    </div>
  ),
}

export const WithoutLabels: Story = {
  render: () => (
    <Row>
      <Toggle labelOff={null} labelOn={null} aria-label="Off" />
      <Toggle labelOff={null} labelOn={null} aria-label="On" defaultChecked />
      <Toggle size="sm" labelOff={null} labelOn={null} aria-label="Off small" />
      <Toggle
        size="sm"
        labelOff={null}
        labelOn={null}
        aria-label="On small"
        defaultChecked
      />
    </Row>
  ),
}

export const SingleLabel: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Toggle labelOff={null} labelOn="Email notifications" defaultChecked />
      <Toggle labelOff="Auto-save" labelOn={null} defaultChecked />
    </div>
  ),
}

export const Controlled: Story = {
  render: function Controlled() {
    const [enabled, setEnabled] = useState(false)
    return (
      <div className="flex flex-col items-start gap-3">
        <Toggle
          checked={enabled}
          onCheckedChange={setEnabled}
          labelOff="Disabled"
          labelOn="Enabled"
        />
        <span className="text-t3 text-[color:var(--color-secondary-text-color)]">
          Current value: {String(enabled)}
        </span>
      </div>
    )
  },
}
