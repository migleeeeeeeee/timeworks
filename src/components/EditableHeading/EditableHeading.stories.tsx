import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { EditableHeading } from "./EditableHeading"

const VARIANTS = ["h1", "h2", "h3"] as const
const WEIGHTS = ["bold", "semibold", "medium", "regular", "light"] as const

const meta = {
  title: "Components/EditableHeading",
  component: EditableHeading,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Heading-styled text input. Reads as a heading until hover/focus, then reveals a 1px border (`color-border-ui` on hover, `color-primary` on focus). Enter commits and blurs; Escape reverts. Sourced from the TimeWorks Figma file (page "Editable heading", component 46946:4387).',
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "radio", options: VARIANTS },
    weight: { control: "radio", options: WEIGHTS },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    placeholder: { control: "text" },
  },
  args: {
    variant: "h1",
    weight: "bold",
    defaultValue: "Editable heading component",
    placeholder: "Editable heading",
  },
  render: (args) => (
    <div className="w-[480px]">
      <EditableHeading {...args} />
    </div>
  ),
} satisfies Meta<typeof EditableHeading>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-[480px]">
      <EditableHeading variant="h1" weight="bold" defaultValue="H1 · Bold heading" />
      <EditableHeading variant="h2" weight="bold" defaultValue="H2 · Bold heading" />
      <EditableHeading variant="h3" weight="bold" defaultValue="H3 · Bold heading" />
    </div>
  ),
}

export const Weights: Story = {
  name: "Weights (per Figma matrix)",
  render: () => (
    <div className="flex flex-col gap-8 w-[520px]">
      <div className="flex flex-col gap-2">
        <p className="text-t3 text-[var(--color-secondary-text-color)] uppercase tracking-wide">H1</p>
        <EditableHeading variant="h1" weight="bold"     defaultValue="H1 Bold" />
        <EditableHeading variant="h1" weight="semibold" defaultValue="H1 Medium" />
        <EditableHeading variant="h1" weight="medium"   defaultValue="H1 Normal" />
        <EditableHeading variant="h1" weight="regular"  defaultValue="H1 Light" />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-t3 text-[var(--color-secondary-text-color)] uppercase tracking-wide">H2</p>
        <EditableHeading variant="h2" weight="bold"     defaultValue="H2 Bold" />
        <EditableHeading variant="h2" weight="semibold" defaultValue="H2 Medium" />
        <EditableHeading variant="h2" weight="medium"   defaultValue="H2 Normal" />
        <EditableHeading variant="h2" weight="light"    defaultValue="H2 Light" />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-t3 text-[var(--color-secondary-text-color)] uppercase tracking-wide">H3</p>
        <EditableHeading variant="h3" weight="bold"     defaultValue="H3 Bold" />
        <EditableHeading variant="h3" weight="semibold" defaultValue="H3 Medium" />
        <EditableHeading variant="h3" weight="medium"   defaultValue="H3 Normal" />
        <EditableHeading variant="h3" weight="light"    defaultValue="H3 Light" />
      </div>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-[480px]">
      <EditableHeading variant="h2" defaultValue="Default — hover and focus me" />
      <EditableHeading variant="h2" defaultValue="" placeholder="Placeholder text" />
      <EditableHeading variant="h2" defaultValue="Read-only heading" readOnly />
      <EditableHeading variant="h2" defaultValue="Disabled heading" disabled />
    </div>
  ),
}

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState("Project Atlas")
    const [committed, setCommitted] = useState(value)
    return (
      <div className="flex flex-col gap-3 w-[480px]">
        <EditableHeading
          variant="h1"
          value={value}
          onValueChange={setValue}
          onCommit={setCommitted}
        />
        <p className="text-t3 text-[var(--color-secondary-text-color)]">
          Live: <span className="font-mono">{JSON.stringify(value)}</span>
        </p>
        <p className="text-t3 text-[var(--color-secondary-text-color)]">
          Last committed (Enter / blur):{" "}
          <span className="font-mono">{JSON.stringify(committed)}</span>
        </p>
      </div>
    )
  },
}
