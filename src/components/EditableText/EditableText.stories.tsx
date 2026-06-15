import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { EditableText } from "./EditableText"

const VARIANTS = ["t1", "t2", "t3"] as const
const WEIGHTS = ["bold", "semibold", "regular"] as const

const meta = {
  title: "Components/EditableText",
  component: EditableText,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Body-text input. Reads as inline copy until hover/focus, then reveals a 1px border (`color-border-ui` on hover, `color-primary` on focus). Enter commits and blurs; Escape reverts. Sourced from the TimeWorks Figma file (page "Editable text", component 46946:4612).',
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
    variant: "t1",
    weight: "bold",
    defaultValue: "Editable text component",
    placeholder: "Editable text component",
  },
  render: (args) => (
    <div className="w-[420px]">
      <EditableText {...args} />
    </div>
  ),
} satisfies Meta<typeof EditableText>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-[420px]">
      <EditableText variant="t1" weight="bold" defaultValue="T1 · Bold body text" />
      <EditableText variant="t2" weight="bold" defaultValue="T2 · Bold body text" />
      <EditableText variant="t3" weight="semibold" defaultValue="T3 · Semibold body text" />
    </div>
  ),
}

export const Weights: Story = {
  name: "Weights (per Figma matrix)",
  render: () => (
    <div className="flex flex-col gap-8 w-[480px]">
      <div className="flex flex-col gap-2">
        <p className="text-t3 text-[var(--color-secondary-text-color)] uppercase tracking-wide">T1 · 16/22</p>
        <EditableText variant="t1" weight="bold"     defaultValue="T1 Bold" />
        <EditableText variant="t1" weight="semibold" defaultValue="T1 Medium" />
        <EditableText variant="t1" weight="regular"  defaultValue="T1 Normal" />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-t3 text-[var(--color-secondary-text-color)] uppercase tracking-wide">T2 · 14/20</p>
        <EditableText variant="t2" weight="bold"     defaultValue="T2 Bold" />
        <EditableText variant="t2" weight="semibold" defaultValue="T2 Medium" />
        <EditableText variant="t2" weight="regular"  defaultValue="T2 Normal" />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-t3 text-[var(--color-secondary-text-color)] uppercase tracking-wide">T3 · 12/16</p>
        <EditableText variant="t3" weight="semibold" defaultValue="T3 Medium" />
        <EditableText variant="t3" weight="regular"  defaultValue="T3 Normal" />
      </div>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-[420px]">
      <EditableText variant="t1" defaultValue="Default — hover and focus me" />
      <EditableText variant="t1" defaultValue="" placeholder="Placeholder text" />
      <EditableText variant="t1" defaultValue="Read-only text" readOnly />
      <EditableText variant="t1" defaultValue="Disabled text" disabled />
    </div>
  ),
}

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState("Item name")
    const [committed, setCommitted] = useState(value)
    return (
      <div className="flex flex-col gap-3 w-[420px]">
        <EditableText
          variant="t1"
          weight="semibold"
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
