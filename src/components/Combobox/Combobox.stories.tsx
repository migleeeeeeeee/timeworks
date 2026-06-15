import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { Combobox } from "./Combobox"

const OPTIONS = [
  { value: "1", label: "Option 1" },
  { value: "2", label: "Option 2" },
  { value: "3", label: "Option 3" },
  { value: "4", label: "Option 4" },
  { value: "5", label: "Option 5" },
  { value: "6", label: "Option 6" },
  { value: "7", label: "Option 7" },
  { value: "8", label: "Option 8" },
]

const meta = {
  title: "Components/Combobox",
  component: Combobox,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Filterable list selector with an inline search field. Sourced from the TimeWorks Figma file (page "Combobox", node 46939:7890). Composes the existing Search and ListItem primitives — the surface owns size, elevation, and the optional bottom button.',
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: { control: "radio", options: ["sm", "md", "lg"] },
    dialog: { control: "boolean" },
  },
  args: {
    size: "md",
    dialog: true,
    options: OPTIONS,
    searchPlaceholder: "Placeholder text here",
  },
} satisfies Meta<typeof Combobox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithBottomButton: Story = {
  args: {
    button: { label: "Edit", icon: "pen" },
  },
}

export const Flat: Story = {
  args: {
    dialog: false,
  },
  parameters: {
    backgrounds: { default: "light" },
  },
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-start gap-6">
      {(["sm", "md", "lg"] as const).map((size) => (
        <div key={size} className="flex flex-col gap-2">
          <span className="text-t3 text-[var(--color-secondary-text-color)] uppercase tracking-wide">
            {size}
          </span>
          <Combobox {...args} size={size} />
        </div>
      ))}
    </div>
  ),
  args: {
    button: { label: "Edit", icon: "pen" },
  },
}

export const VariantMatrix: Story = {
  render: (args) => (
    <div className="space-y-10">
      <div>
        <p className="mb-3 text-t2 font-semibold text-[var(--color-secondary-text-color)]">
          With button
        </p>
        <div className="flex items-start gap-6">
          {(["sm", "md", "lg"] as const).map((size) => (
            <Combobox
              key={`btn-${size}`}
              {...args}
              size={size}
              button={{ label: "Edit", icon: "pen" }}
            />
          ))}
        </div>
      </div>
      <div>
        <p className="mb-3 text-t2 font-semibold text-[var(--color-secondary-text-color)]">
          No button
        </p>
        <div className="flex items-start gap-6">
          {(["sm", "md", "lg"] as const).map((size) => (
            <Combobox key={`no-${size}`} {...args} size={size} />
          ))}
        </div>
      </div>
    </div>
  ),
}

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState("3")
    return (
      <div className="space-y-3">
        <p className="text-t2 text-[var(--color-secondary-text-color)]">
          Selected: <span className="font-mono">{value || "—"}</span>
        </p>
        <Combobox {...args} value={value} onValueChange={setValue} />
      </div>
    )
  },
  args: {
    button: { label: "Edit", icon: "pen" },
  },
}

export const EmptyState: Story = {
  args: {
    options: [],
    emptyState: "No matches found",
  },
}
