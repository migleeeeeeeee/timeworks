import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { TextArea } from "./TextArea"

const SIZES = ["sm", "lg"] as const
const STATES = ["default", "error", "positive", "disabled", "readOnly"] as const

const meta = {
  title: "Components/TextArea",
  component: TextArea,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Multi-line text input with optional label, helper text, and character limit. Sourced from the TimeWorks Figma file (page "Text Area", node 46939:7917 / component set 46949:31916).',
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
    rows: { control: { type: "number", min: 2, max: 12, step: 1 } },
    required: { control: "boolean" },
    characterLimit: { control: "number" },
    noResize: { control: "boolean" },
  },
  args: {
    size: "lg",
    state: "default",
    label: "Label",
    placeholder: "Users can type here",
    helperText: "Information text",
    rows: 4,
  },
  render: (args) => (
    <div className="w-[320px]">
      <TextArea {...args} />
    </div>
  ),
} satisfies Meta<typeof TextArea>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-[320px]">
      <TextArea size="lg" label="Large (16px)" helperText="Information text" />
      <TextArea size="sm" label="Small (14px)" helperText="Information text" />
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-[680px]">
      <TextArea label="Default" helperText="Information text" />
      <TextArea label="Error" state="error" helperText="Something went wrong" />
      <TextArea label="Positive" state="positive" helperText="Looks good" />
      <TextArea label="Disabled" state="disabled" helperText="Information text" />
      <TextArea
        label="Read-only"
        state="readOnly"
        helperText="Information text"
        defaultValue="This content cannot be edited."
      />
    </div>
  ),
}

export const LabelAndHelperToggles: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-6 w-[680px]">
      <TextArea label="Label on, helper on" helperText="Information text" />
      <TextArea helperText="Information text" />
      <TextArea label="Label on, helper off" />
      <TextArea />
    </div>
  ),
}

export const RowCount: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-[680px]">
      {[2, 3, 4, 5, 6].map((rows) => (
        <TextArea
          key={rows}
          label={`${rows} rows`}
          rows={rows}
          helperText={`rows={${rows}}`}
        />
      ))}
    </div>
  ),
}

export const WithCharacterLimit: Story = {
  render: () => {
    const [value, setValue] = useState("Type to see the counter update.")
    return (
      <div className="w-[320px]">
        <TextArea
          label="Bio"
          helperText="Tell us about yourself"
          characterLimit={200}
          value={value}
          onValueChange={setValue}
        />
      </div>
    )
  },
}

export const Required: Story = {
  render: () => (
    <div className="w-[320px]">
      <TextArea
        label="Description"
        required
        helperText="This field is required"
      />
    </div>
  ),
}

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState("Hello world")
    return (
      <div className="flex flex-col gap-3 w-[320px]">
        <TextArea
          label="Notes"
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
