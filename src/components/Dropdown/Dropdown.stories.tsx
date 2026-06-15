import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { Dropdown, type DropdownOption } from "./Dropdown"

const OPTIONS: DropdownOption[] = [
  { value: "1", label: "Option 1" },
  { value: "2", label: "Option 2" },
  { value: "3", label: "Option 3" },
  { value: "4", label: "Option 4" },
]

const meta: Meta<typeof Dropdown> = {
  title: "Components/Dropdown",
  component: Dropdown,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Dropdowns present a list of options from which a user can select one option, or several. Sourced from the TimeWorks Figma file (page "Dropdown", node 46946:1926). Three sizes (sm/md/lg), states (default / error / disabled / read-only), and three types: single-select, multi-select with chips on a single row, and multi-select with chips that wrap to multiple lines.',
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: { control: "radio", options: ["sm", "md", "lg"] },
    error: { control: "boolean" },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    multiSelect: { control: "boolean" },
    multiLine: { control: "boolean" },
  },
  args: {
    options: OPTIONS,
    placeholder: "Placeholder text here",
    size: "lg",
  },
  decorators: [
    (Story) => (
      <div style={{ width: 304, minHeight: 320 }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Dropdown>

export const Default: Story = {}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4 w-[304px]">
      {(["sm", "md", "lg"] as const).map((size) => (
        <div key={size} className="flex flex-col gap-1">
          <span className="text-t3 text-[var(--color-secondary-text-color)] uppercase tracking-wide">
            {size}
          </span>
          <Dropdown {...args} size={size} />
        </div>
      ))}
    </div>
  ),
}

export const Selected: Story = {
  args: {
    defaultValue: "2",
  },
}

export const Error: Story = {
  args: {
    error: true,
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    defaultValue: "2",
  },
}

export const Open: Story = {
  args: {
    defaultOpen: true,
  },
}

export const NoResults: Story = {
  args: {
    defaultOpen: true,
    options: [],
  },
}

export const MultiSelectChips: Story = {
  args: {
    multiSelect: true,
    defaultValue: ["1", "2"],
  },
}

export const MultiSelectMultiline: Story = {
  args: {
    multiSelect: true,
    multiLine: true,
    defaultValue: ["1", "2", "3", "4"],
  },
}

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState<string>("")
    return (
      <div className="flex flex-col gap-3">
        <Dropdown
          options={OPTIONS}
          placeholder="Placeholder text here"
          size="lg"
          value={value}
          onValueChange={setValue}
        />
        <div className="text-t3 text-[var(--color-secondary-text-color)]">
          Selected: <code>{value || "—"}</code>
        </div>
      </div>
    )
  },
}

export const Playground: Story = {
  args: {
    size: "lg",
  },
}
