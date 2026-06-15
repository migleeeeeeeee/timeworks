import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { Radio, RadioGroup } from "./RadioGroup"

const meta = {
  title: "Components/RadioGroup",
  component: RadioGroup,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'A radio represents an item in a single selection list. Sourced from the TimeWorks Figma file (page "Radio Button", node 46947:8991). Built on @radix-ui/react-radio-group so keyboard, focus, and roving tabindex behavior come from Radix.',
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    orientation: { control: "inline-radio", options: ["vertical", "horizontal"] },
    disabled: { control: "boolean" },
    error: { control: "boolean" },
    helperText: { control: "text" },
  },
  args: {
    "aria-label": "Workspace",
    defaultValue: "work-management",
  },
} satisfies Meta<typeof RadioGroup>

export default meta
type Story = StoryObj<typeof meta>

const OPTIONS = [
  { value: "work-management", label: "Work management" },
  { value: "workforms", label: "WorkForms" },
  { value: "marketer", label: "Marketer" },
  { value: "projects", label: "Projects" },
  { value: "dev", label: "Dev" },
  { value: "sales-crm", label: "Sales CRM" },
] as const

export const Playground: Story = {
  render: (args) => (
    <RadioGroup {...args}>
      {OPTIONS.map((opt) => (
        <Radio key={opt.value} value={opt.value}>
          {opt.label}
        </Radio>
      ))}
    </RadioGroup>
  ),
}

const Section = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-2">
    <span className="text-t3 text-[color:var(--color-secondary-text-color)] uppercase tracking-wide">
      {label}
    </span>
    {children}
  </div>
)

export const Vertical: Story = {
  render: () => (
    <RadioGroup defaultValue="work-management" aria-label="Workspace (vertical)">
      {OPTIONS.slice(0, 4).map((opt) => (
        <Radio key={opt.value} value={opt.value}>
          {opt.label}
        </Radio>
      ))}
    </RadioGroup>
  ),
}

export const Horizontal: Story = {
  render: () => (
    <RadioGroup
      orientation="horizontal"
      defaultValue="day"
      aria-label="View (horizontal)"
    >
      <Radio value="day">Day</Radio>
      <Radio value="week">Week</Radio>
      <Radio value="month">Month</Radio>
      <Radio value="year">Year</Radio>
    </RadioGroup>
  ),
}

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <Section label="Default · unselected & selected">
        <RadioGroup defaultValue="b" aria-label="default">
          <Radio value="a">Unselected</Radio>
          <Radio value="b">Selected</Radio>
        </RadioGroup>
      </Section>

      <Section label="Disabled">
        <RadioGroup defaultValue="b" disabled aria-label="disabled">
          <Radio value="a">Disabled unselected</Radio>
          <Radio value="b">Disabled selected</Radio>
        </RadioGroup>
      </Section>

      <Section label="Error">
        <RadioGroup
          error
          aria-label="error"
          helperText="Please pick one of the options"
        >
          <Radio value="a">Unselected</Radio>
          <Radio value="b">Selected</Radio>
        </RadioGroup>
      </Section>
    </div>
  ),
}

export const WithoutLabels: Story = {
  render: () => (
    <RadioGroup defaultValue="b" orientation="horizontal" aria-label="box only">
      <Radio value="a" aria-label="Option A" />
      <Radio value="b" aria-label="Option B" />
      <Radio value="c" aria-label="Option C" disabled />
      <Radio value="d" aria-label="Option D" />
    </RadioGroup>
  ),
}

export const WithHelperText: Story = {
  render: () => (
    <RadioGroup
      defaultValue="email"
      aria-label="Notifications"
      helperText="You can change this anytime in settings."
    >
      <Radio value="email">Email</Radio>
      <Radio value="sms">SMS</Radio>
      <Radio value="none">None</Radio>
    </RadioGroup>
  ),
}

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState<string>("work-management")
    return (
      <div className="flex flex-col gap-3">
        <RadioGroup
          value={value}
          onValueChange={setValue}
          aria-label="Workspace"
        >
          {OPTIONS.slice(0, 4).map((opt) => (
            <Radio key={opt.value} value={opt.value}>
              {opt.label}
            </Radio>
          ))}
        </RadioGroup>
        <span className="text-t3 text-[var(--color-secondary-text-color)]">
          value: <code>{value}</code>
        </span>
      </div>
    )
  },
}
