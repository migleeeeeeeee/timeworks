import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { TextField } from "./TextField"
import { IconButton } from "../IconButton"

const SIZES = ["sm", "md", "lg"] as const
const STATES = ["default", "error", "disabled", "readOnly"] as const

const meta = {
  title: "Components/TextField",
  component: TextField,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Single-line text input with optional label, leading icon, trailing slot, helper text, and character limit. Sourced from the TimeWorks Figma file (page "Text Field", node 46939:7918 / component set 46949:33152).',
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: { control: "radio", options: SIZES },
    state: { control: "radio", options: STATES },
    label: { control: "text" },
    helperText: { control: "text" },
    placeholder: { control: "text" },
    required: { control: "boolean" },
    characterLimit: { control: "number" },
    leadingIcon: { control: "text" },
  },
  args: {
    size: "md",
    state: "default",
    label: "Label",
    placeholder: "Placeholder text here",
    helperText: "Information text",
  },
  render: (args) => (
    <div className="w-[300px]">
      <TextField {...args} />
    </div>
  ),
} satisfies Meta<typeof TextField>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-[300px]">
      <TextField size="lg" label="Large (48)" helperText="Information text" />
      <TextField size="md" label="Medium (40)" helperText="Information text" />
      <TextField size="sm" label="Small (32)" helperText="Information text" />
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-[680px]">
      <TextField label="Default" helperText="Information text" />
      <TextField label="Error" state="error" helperText="Something went wrong" />
      <TextField label="Disabled" state="disabled" helperText="Information text" />
      <TextField
        label="Read-only"
        state="readOnly"
        helperText="Information text"
        defaultValue="This value cannot be edited"
      />
    </div>
  ),
}

export const LabelAndHelperToggles: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-6 w-[680px]">
      <TextField label="Label on, helper on" helperText="Information text" />
      <TextField helperText="Information text" />
      <TextField label="Label on, helper off" />
      <TextField />
    </div>
  ),
}

export const WithLeadingIcon: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-[300px]">
      <TextField
        size="lg"
        label="Search"
        leadingIcon="magnifying-glass"
        placeholder="Find a project"
      />
      <TextField
        size="md"
        leadingIcon="magnifying-glass"
        placeholder="Find a project"
      />
      <TextField
        size="sm"
        leadingIcon="magnifying-glass"
        placeholder="Find a project"
      />
    </div>
  ),
}

export const WithTrailingSlot: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-[300px]">
      <TextField
        label="With icon button"
        helperText="Trailing slot accepts any node"
        trailing={
          <IconButton
            kind="tertiary"
            size="sm"
            icon="hexagon-image"
            aria-label="Pick image"
          />
        }
      />
      <TextField
        size="sm"
        trailing={
          <IconButton
            kind="tertiary"
            size="xs"
            icon="hexagon-image"
            aria-label="Pick image"
          />
        }
      />
    </div>
  ),
}

export const WithCharacterLimit: Story = {
  render: () => {
    const [value, setValue] = useState("Type to see the counter update.")
    return (
      <div className="w-[300px]">
        <TextField
          label="Title"
          helperText="Keep it short"
          characterLimit={50}
          value={value}
          onValueChange={setValue}
        />
      </div>
    )
  },
}

export const Required: Story = {
  render: () => (
    <div className="w-[300px]">
      <TextField
        label="Email"
        required
        type="email"
        placeholder="you@company.com"
        helperText="This field is required"
      />
    </div>
  ),
}

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState("Hello world")
    return (
      <div className="flex flex-col gap-3 w-[300px]">
        <TextField
          label="Name"
          value={value}
          onValueChange={setValue}
          helperText="Controlled value"
        />
        <p className="text-t3 text-[var(--color-secondary-text-color)]">
          Value: <span className="font-mono">{JSON.stringify(value)}</span>
        </p>
      </div>
    )
  },
}

export const Matrix: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="space-y-8">
      {SIZES.map((size) => (
        <div key={size} className="space-y-3">
          <p className="text-t3 uppercase tracking-wide text-[var(--color-secondary-text-color)]">
            {size}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-[1280px]">
            {STATES.map((state) => (
              <TextField
                key={state}
                size={size}
                state={state}
                label={state}
                helperText="Information text"
                defaultValue={state === "readOnly" ? "Read-only value" : undefined}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
}
