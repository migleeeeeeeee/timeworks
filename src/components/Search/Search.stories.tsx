import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { Search } from "./Search"
import { IconButton } from "../IconButton"

const SIZES = ["sm", "md", "lg"] as const

const meta = {
  title: "Components/Search",
  component: Search,
  parameters: {
    layout: "centered",
    a11y: { disable: false },
    docs: {
      description: {
        component:
          'Search field with a leading magnifying-glass icon, an auto-revealed clear button, and an optional trailing slot for a custom icon button. Pill-shaped — sourced from the TimeWorks Figma file (page "Search", component 46947:9785). Three sizes (sm/md/lg → 32/40/48px).',
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: { control: "radio", options: SIZES },
    disabled: { control: "boolean" },
    hideClearButton: { control: "boolean" },
    placeholder: { control: "text" },
  },
  args: {
    size: "md",
    placeholder: "Placeholder text here",
  },
  render: (args) => (
    <div className="w-[320px]">
      <Search {...args} />
    </div>
  ),
} satisfies Meta<typeof Search>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-[320px]">
      <Search placeholder="Default" />
      <Search defaultValue="Searched text" />
      <Search
        placeholder="With trailing icon button"
        trailing={
          <IconButton
            kind="tertiary"
            size="sm"
            icon="hexagon-image"
            aria-label="Open filters"
          />
        }
      />
      <Search
        defaultValue="Both buttons"
        trailing={
          <IconButton
            kind="tertiary"
            size="sm"
            icon="hexagon-image"
            aria-label="Open filters"
          />
        }
      />
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-[320px]">
      <Search size="sm" placeholder="Small (32px)" />
      <Search size="md" placeholder="Medium (40px)" />
      <Search size="lg" placeholder="Large (48px)" />
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-[320px]">
      <Search placeholder="Default" />
      <Search placeholder="Disabled" disabled />
      <Search defaultValue="Searched text" />
      <Search placeholder="Hover me to see hover state" />
      <Search autoFocus placeholder="Focused (autoFocus)" />
    </div>
  ),
}

export const Playground: Story = {}

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState("hello world")
    return (
      <div className="flex flex-col gap-3 w-[320px]">
        <Search value={value} onValueChange={setValue} />
        <p className="text-t3 text-[var(--color-secondary-text-color)]">
          Value: <span className="font-mono">{JSON.stringify(value)}</span>
        </p>
      </div>
    )
  },
}

export const SubmitOnEnter: Story = {
  render: () => {
    const [submitted, setSubmitted] = useState<string | null>(null)
    return (
      <div className="flex flex-col gap-3 w-[320px]">
        <Search
          placeholder="Type then press Enter"
          onSearch={(value) => setSubmitted(value)}
        />
        <p className="text-t3 text-[var(--color-secondary-text-color)]">
          Last submitted: <span className="font-mono">{submitted ?? "—"}</span>
        </p>
      </div>
    )
  },
}
