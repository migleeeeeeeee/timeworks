import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { Checkbox } from "./Checkbox"

const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Checkboxes let users select one or more items from a set. Sourced from the TimeWorks Figma file (page "Checkbox", node 46939:96347). Built on @radix-ui/react-checkbox so keyboard, focus, and indeterminate behavior come from Radix.',
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    checked: { control: "select", options: [false, true, "indeterminate"] },
    disabled: { control: "boolean" },
    error: { control: "boolean" },
    children: { control: "text" },
  },
  args: {
    children: "Remember me",
  },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

const Row = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-wrap items-center gap-6">{children}</div>
)
const Col = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-2">
    <span className="text-t3 text-[color:var(--color-secondary-text-color)] uppercase tracking-wide">
      {label}
    </span>
    {children}
  </div>
)

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <Col label="Unchecked">
        <Row>
          <Checkbox>Regular</Checkbox>
          <Checkbox disabled>Disabled</Checkbox>
          <Checkbox error>Error</Checkbox>
        </Row>
      </Col>
      <Col label="Checked">
        <Row>
          <Checkbox defaultChecked>Regular</Checkbox>
          <Checkbox checked disabled>Disabled</Checkbox>
          <Checkbox checked error>Error</Checkbox>
        </Row>
      </Col>
      <Col label="Indeterminate">
        <Row>
          <Checkbox checked="indeterminate">Regular</Checkbox>
          <Checkbox checked="indeterminate" disabled>Disabled</Checkbox>
        </Row>
      </Col>
    </div>
  ),
}

export const WithoutLabel: Story = {
  render: () => (
    <Row>
      <Checkbox aria-label="Unchecked" />
      <Checkbox aria-label="Checked" defaultChecked />
      <Checkbox aria-label="Indeterminate" checked="indeterminate" />
      <Checkbox aria-label="Disabled" disabled />
      <Checkbox aria-label="Error" error />
    </Row>
  ),
}

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState<boolean | "indeterminate">("indeterminate")
    return (
      <div className="flex flex-col gap-3">
        <Checkbox checked={value} onCheckedChange={(v) => setValue(v)}>
          Tri-state ({String(value)})
        </Checkbox>
        <button
          type="button"
          className="text-t3 text-[var(--color-link-color)] underline self-start"
          onClick={() => setValue("indeterminate")}
        >
          Reset to indeterminate
        </button>
      </div>
    )
  },
}
