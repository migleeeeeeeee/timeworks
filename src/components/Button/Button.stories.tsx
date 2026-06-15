import type { Meta, StoryObj } from "@storybook/react"
import { Button } from "./Button"
import { ICON_NAMES } from "../../icons/names"

const meta = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Buttons let users trigger an action with a single click. Sourced from the TimeWorks Figma file (page "Button", node 46939:7886). Use only one primary button per view; remaining calls to action should be lower-emphasis kinds.',
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    kind: { control: "select", options: ["primary", "secondary", "tertiary", "brand"] },
    size: { control: "select", options: ["xs", "sm", "md", "lg"] },
    color: { control: "select", options: ["primary", "negative", "positive", "inverted"] },
    iconLeft: { control: "select", options: ["", ...ICON_NAMES] as const },
    iconRight: { control: "select", options: ["", ...ICON_NAMES] as const },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
    children: { control: "text" },
  },
  args: {
    kind: "primary",
    size: "md",
    color: "primary",
    children: "Button",
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

const Row = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-wrap items-center gap-3">{children}</div>
)
const Col = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-2">
    <span className="text-t3 text-[color:var(--color-secondary-text-color)] uppercase tracking-wide">
      {label}
    </span>
    {children}
  </div>
)

export const Kinds: Story = {
  render: () => (
    <Col label="Kind">
      <Row>
        <Button kind="primary">Primary</Button>
        <Button kind="secondary">Secondary</Button>
        <Button kind="tertiary">Tertiary</Button>
        <Button kind="brand">Brand</Button>
      </Row>
    </Col>
  ),
}

export const Sizes: Story = {
  render: () => (
    <Col label="Size">
      <Row>
        <Button size="lg">Large</Button>
        <Button size="md">Medium</Button>
        <Button size="sm">Small</Button>
        <Button size="xs">XS</Button>
      </Row>
    </Col>
  ),
}

export const Colors: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <Col label="Primary kind">
        <Row>
          <Button color="primary">Primary</Button>
          <Button color="negative">Negative</Button>
          <Button color="positive">Positive</Button>
          <Button color="inverted">Inverted</Button>
        </Row>
      </Col>
      <Col label="Secondary kind">
        <Row>
          <Button kind="secondary" color="primary">Primary</Button>
          <Button kind="secondary" color="negative">Negative</Button>
          <Button kind="secondary" color="positive">Positive</Button>
          <Button kind="secondary" color="inverted">Inverted</Button>
        </Row>
      </Col>
      <Col label="Tertiary kind">
        <Row>
          <Button kind="tertiary" color="primary">Primary</Button>
          <Button kind="tertiary" color="negative">Negative</Button>
          <Button kind="tertiary" color="positive">Positive</Button>
          <Button kind="tertiary" color="inverted">Inverted</Button>
        </Row>
      </Col>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <Col label="Primary">
        <Row>
          <Button>Regular</Button>
          <Button className="bg-[var(--color-primary-hover-color)]">Hover</Button>
          <Button disabled>Disabled</Button>
          <Button loading>Loading</Button>
        </Row>
      </Col>
      <Col label="Secondary">
        <Row>
          <Button kind="secondary">Regular</Button>
          <Button kind="secondary" className="bg-[var(--color-primary-background-hover-color)]">Hover</Button>
          <Button kind="secondary" disabled>Disabled</Button>
          <Button kind="secondary" loading>Loading</Button>
        </Row>
      </Col>
    </div>
  ),
}

export const WithIcons: Story = {
  render: () => (
    <Col label="Icon">
      <Row>
        <Button iconLeft="circle-check">Icon left</Button>
        <Button iconRight="arrow-right">Icon right</Button>
        <Button kind="secondary" iconLeft="circle-check">Confirm</Button>
      </Row>
    </Col>
  ),
}

export const VariantsMatrix: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {(["primary", "secondary", "tertiary", "brand"] as const).map((kind) => (
        <Col key={kind} label={kind}>
          <Row>
            <Button kind={kind} size="lg">Large</Button>
            <Button kind={kind} size="md">Medium</Button>
            <Button kind={kind} size="sm">Small</Button>
            <Button kind={kind} size="xs">XS</Button>
            <Button kind={kind} iconLeft="circle-check">With icon</Button>
            <Button kind={kind} disabled>Disabled</Button>
          </Row>
        </Col>
      ))}
    </div>
  ),
}
