import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { DatePicker, type DatePickerValue, type DatePickerRange } from "./DatePicker"

const meta = {
  title: "Components/DatePicker",
  component: DatePicker,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Calendar surface for picking a single date, a date range, or just displaying a month. Sourced from the TimeWorks Figma file (page "Date Picker", node 46939:7892; component set 46939:100511). Wraps a custom Mon-first calendar grid with an optional white dialog surface, two-month layout, and pink / black theme treatments.',
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    mode: { control: "radio", options: ["default", "single", "range"] },
    numberOfMonths: { control: "radio", options: [1, 2] },
    withDialog: { control: "boolean" },
    theme: { control: "radio", options: ["light", "black", "pink"] },
  },
  args: {
    mode: "single",
    numberOfMonths: 1,
    withDialog: true,
    theme: "light",
    defaultMonth: new Date(2023, 4, 1), // May 2023 — matches Figma sample
    defaultValue: new Date(2023, 4, 12),
  },
} satisfies Meta<typeof DatePicker>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { mode: "default", defaultValue: undefined },
}

export const SingleDate: Story = {}

export const DateRange: Story = {
  args: {
    mode: "range",
    defaultValue: { from: new Date(2023, 4, 9), to: new Date(2023, 4, 23) },
  },
}

export const TwoMonths: Story = {
  args: {
    mode: "range",
    numberOfMonths: 2,
    defaultValue: { from: new Date(2023, 4, 9), to: new Date(2023, 5, 12) },
  },
}

export const WithoutDialog: Story = {
  args: { withDialog: false },
  parameters: {
    backgrounds: { default: "light" },
  },
}

export const PinkTheme: Story = {
  args: { theme: "pink" },
}

export const BlackTheme: Story = {
  args: { theme: "black" },
}

export const VariantMatrix: Story = {
  render: (args) => (
    <div className="space-y-10 p-8 bg-[var(--color-allgrey-background-color)]">
      <div>
        <p className="mb-3 text-t2 font-semibold text-[var(--color-secondary-text-color)]">
          Type · default · single · range
        </p>
        <div className="flex flex-wrap items-start gap-6">
          <DatePicker {...args} mode="default" defaultValue={undefined} />
          <DatePicker {...args} mode="single" defaultValue={new Date(2023, 4, 12)} />
          <DatePicker
            {...args}
            mode="range"
            defaultValue={{ from: new Date(2023, 4, 9), to: new Date(2023, 4, 23) }}
          />
        </div>
      </div>
      <div>
        <p className="mb-3 text-t2 font-semibold text-[var(--color-secondary-text-color)]">
          Two months
        </p>
        <DatePicker
          {...args}
          mode="range"
          numberOfMonths={2}
          defaultValue={{ from: new Date(2023, 4, 9), to: new Date(2023, 5, 12) }}
        />
      </div>
      <div>
        <p className="mb-3 text-t2 font-semibold text-[var(--color-secondary-text-color)]">
          Without dialog · pink · black
        </p>
        <div className="flex flex-wrap items-start gap-6">
          <DatePicker {...args} withDialog={false} />
          <DatePicker {...args} theme="pink" />
          <DatePicker {...args} theme="black" />
        </div>
      </div>
    </div>
  ),
}

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState<DatePickerValue>(args.defaultValue ?? null)
    const label = (() => {
      if (!value) return "—"
      if (value instanceof Date) return value.toDateString()
      const r = value as DatePickerRange
      const from = r.from ? r.from.toDateString() : "—"
      const to = r.to ? r.to.toDateString() : "—"
      return `${from} → ${to}`
    })()
    return (
      <div className="space-y-3">
        <p className="text-t2 text-[var(--color-secondary-text-color)]">
          Selected: <span className="font-mono">{label}</span>
        </p>
        <DatePicker {...args} value={value} onValueChange={setValue} />
      </div>
    )
  },
}

export const Playground: Story = {}
