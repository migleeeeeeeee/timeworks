import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { Slider, type SliderValue } from "./Slider"
import { Icon } from "../Icon"

const meta = {
  title: "Components/Slider",
  component: Slider,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          'Slider is a visual input component that reflects current state status in its appearance. Sourced from the TimeWorks Figma file (page "Slider", node 46939:7912; variants at 46949:2542). Supports single-thumb and range (`[lo, hi]`) modes, three intent colours, three sizes, optional value read-outs, and optional bookend icons. Built on pointer + keyboard events directly — no Radix slider primitive in our deps yet.',
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    type: { control: "radio", options: ["primary", "negative", "positive"] },
    size: { control: "radio", options: ["sm", "md", "lg"] },
    min: { control: { type: "number" } },
    max: { control: { type: "number" } },
    step: { control: { type: "number", min: 0.1 } },
    showLabel: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: {
    type: "primary",
    size: "md",
    min: 0,
    max: 100,
    step: 1,
    defaultValue: 40,
    showLabel: false,
    disabled: false,
  },
} satisfies Meta<typeof Slider>

export default meta
type Story = StoryObj<typeof meta>

const Cell = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-3">
    <span className="text-t3 text-[var(--color-secondary-text-color)] uppercase tracking-wide">
      {label}
    </span>
    <div className="w-[340px]">{children}</div>
  </div>
)

export const Playground: Story = {}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-8">
      <Cell label="Small">
        <Slider {...args} size="sm" defaultValue={30} />
      </Cell>
      <Cell label="Medium">
        <Slider {...args} size="md" defaultValue={50} />
      </Cell>
      <Cell label="Large">
        <Slider {...args} size="lg" defaultValue={70} />
      </Cell>
    </div>
  ),
}

export const Types: Story = {
  render: (args) => (
    <div className="flex flex-col gap-8">
      <Cell label="Primary">
        <Slider {...args} type="primary" defaultValue={40} />
      </Cell>
      <Cell label="Negative">
        <Slider {...args} type="negative" defaultValue={40} />
      </Cell>
      <Cell label="Positive">
        <Slider {...args} type="positive" defaultValue={40} />
      </Cell>
    </div>
  ),
}

export const Range: Story = {
  args: { defaultValue: [25, 75] },
  render: (args) => (
    <div className="flex flex-col gap-8">
      <Cell label="Range · Primary">
        <Slider {...args} type="primary" defaultValue={[20, 60]} />
      </Cell>
      <Cell label="Range · Negative">
        <Slider {...args} type="negative" defaultValue={[10, 45]} />
      </Cell>
      <Cell label="Range · Positive">
        <Slider {...args} type="positive" defaultValue={[55, 90]} />
      </Cell>
    </div>
  ),
}

export const WithIcons: Story = {
  args: { size: "md", defaultValue: 50 },
  render: (args) => (
    <div className="flex flex-col gap-8">
      <Cell label="Volume">
        <Slider
          {...args}
          startIcon={<Icon name="minus" size="sm" />}
          endIcon={<Icon name="plus-small" size="sm" />}
        />
      </Cell>
      <Cell label="Brightness · range">
        <Slider
          {...args}
          defaultValue={[20, 80]}
          startIcon={<Icon name="brightness" size="sm" />}
          endIcon={<Icon name="brightness" size="sm" />}
        />
      </Cell>
    </div>
  ),
}

export const WithLabel: Story = {
  args: { showLabel: true },
  render: (args) => (
    <div className="flex flex-col gap-8">
      <Cell label="Single · with read-out">
        <Slider {...args} defaultValue={42} />
      </Cell>
      <Cell label="Range · with read-outs">
        <Slider {...args} defaultValue={[30, 70]} />
      </Cell>
    </div>
  ),
}

export const States: Story = {
  render: (args) => (
    <div className="flex flex-col gap-8">
      <Cell label="Default">
        <Slider {...args} defaultValue={40} />
      </Cell>
      <Cell label="Disabled · single">
        <Slider {...args} defaultValue={40} disabled />
      </Cell>
      <Cell label="Disabled · range">
        <Slider {...args} defaultValue={[20, 60]} disabled />
      </Cell>
    </div>
  ),
}

export const Controlled: Story = {
  render: () => {
    function Demo() {
      const [v, setV] = useState<SliderValue>(35)
      return (
        <div className="flex flex-col gap-4 w-[340px]">
          <Slider
            value={v}
            onValueChange={setV}
            showLabel
            formatLabel={(n) => `${n}%`}
            aria-label="Opacity"
          />
          <div className="text-t3 text-[var(--color-secondary-text-color)] font-mono">
            value: {Array.isArray(v) ? `[${v[0]}, ${v[1]}]` : v}
          </div>
        </div>
      )
    }
    return <Demo />
  },
}

export const CustomRange: Story = {
  args: { min: 0, max: 1000, step: 50, defaultValue: 350 },
  render: (args) => (
    <div className="w-[340px]">
      <Slider
        {...args}
        showLabel
        formatLabel={(n) => `$${n}`}
        aria-label="Price"
      />
    </div>
  ),
}

export const Matrix: Story = {
  render: () => (
    <div className="flex flex-col gap-12">
      {(["primary", "negative", "positive"] as const).map((type) => (
        <div key={type} className="flex flex-col gap-5">
          <div className="text-t3 text-[var(--color-secondary-text-color)] uppercase tracking-wide">
            Type · {type}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            <Cell label="Single · sm">
              <Slider type={type} size="sm" defaultValue={30} />
            </Cell>
            <Cell label="Range · sm">
              <Slider type={type} size="sm" defaultValue={[20, 60]} />
            </Cell>
            <Cell label="Single · md">
              <Slider type={type} size="md" defaultValue={50} />
            </Cell>
            <Cell label="Range · md">
              <Slider type={type} size="md" defaultValue={[30, 70]} />
            </Cell>
            <Cell label="Single · lg">
              <Slider type={type} size="lg" defaultValue={70} />
            </Cell>
            <Cell label="Range · lg">
              <Slider type={type} size="lg" defaultValue={[40, 80]} />
            </Cell>
          </div>
        </div>
      ))}
    </div>
  ),
}
