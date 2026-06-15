import type { Meta, StoryObj } from "@storybook/react"
import { SplitButton } from "./SplitButton"
import { Menu } from "../Menu"
import { ListItem } from "../ListItem"
import { ICON_NAMES } from "../../icons/names"

const sampleMenu = (
  <Menu>
    <ListItem icon="copy">Save as…</ListItem>
    <ListItem icon="folder">Save a copy</ListItem>
    <ListItem icon="cloud-arrow-down">Save to cloud</ListItem>
  </Menu>
)

const meta = {
  title: "Components/SplitButton",
  component: SplitButton,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Split Button — sourced from the TimeWorks Figma file (page "Split Button", node 46939:7913; component set 46966:936). A dual-function button: a default action on the left and a chevron trigger on the right that opens a menu of alternative actions.',
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    kind: { control: "select", options: ["primary", "secondary", "tertiary"] },
    size: { control: "select", options: ["sm", "md", "lg"] },
    color: { control: "select", options: ["primary", "negative", "positive", "inverted"] },
    icon: { control: "select", options: ["", ...ICON_NAMES] as const },
    iconPosition: { control: "select", options: ["left", "right", "only"] },
    disabled: { control: "boolean" },
    children: { control: "text" },
  },
  args: {
    kind: "primary",
    size: "md",
    color: "primary",
    icon: "hexagon-image",
    iconPosition: "left",
    children: "Button",
    menu: sampleMenu,
  },
} satisfies Meta<typeof SplitButton>

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
        <SplitButton kind="primary" menu={sampleMenu}>Primary</SplitButton>
        <SplitButton kind="secondary" menu={sampleMenu}>Secondary</SplitButton>
        <SplitButton kind="tertiary" menu={sampleMenu}>Tertiary</SplitButton>
      </Row>
    </Col>
  ),
}

export const Sizes: Story = {
  render: () => (
    <Col label="Size">
      <Row>
        <SplitButton size="lg" menu={sampleMenu}>Large</SplitButton>
        <SplitButton size="md" menu={sampleMenu}>Medium</SplitButton>
        <SplitButton size="sm" menu={sampleMenu}>Small</SplitButton>
      </Row>
    </Col>
  ),
}

export const Colors: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <Col label="Primary kind">
        <Row>
          <SplitButton color="primary" menu={sampleMenu}>Primary</SplitButton>
          <SplitButton color="negative" menu={sampleMenu}>Negative</SplitButton>
          <SplitButton color="positive" menu={sampleMenu}>Positive</SplitButton>
          <SplitButton color="inverted" menu={sampleMenu}>Inverted</SplitButton>
        </Row>
      </Col>
      <Col label="Secondary kind">
        <Row>
          <SplitButton kind="secondary" color="primary" menu={sampleMenu}>Primary</SplitButton>
          <SplitButton kind="secondary" color="negative" menu={sampleMenu}>Negative</SplitButton>
          <SplitButton kind="secondary" color="positive" menu={sampleMenu}>Positive</SplitButton>
          <SplitButton kind="secondary" color="inverted" menu={sampleMenu}>Inverted</SplitButton>
        </Row>
      </Col>
      <Col label="Tertiary kind">
        <Row>
          <SplitButton kind="tertiary" color="primary" menu={sampleMenu}>Primary</SplitButton>
          <SplitButton kind="tertiary" color="negative" menu={sampleMenu}>Negative</SplitButton>
          <SplitButton kind="tertiary" color="positive" menu={sampleMenu}>Positive</SplitButton>
          <SplitButton kind="tertiary" color="inverted" menu={sampleMenu}>Inverted</SplitButton>
        </Row>
      </Col>
    </div>
  ),
}

export const IconPositions: Story = {
  render: () => (
    <Col label="Icon position">
      <Row>
        <SplitButton icon="hexagon-image" iconPosition="left" menu={sampleMenu}>
          Left
        </SplitButton>
        <SplitButton icon="hexagon-image" iconPosition="right" menu={sampleMenu}>
          Right
        </SplitButton>
        <SplitButton menu={sampleMenu}>No icon</SplitButton>
        <SplitButton
          icon="hexagon-image"
          iconPosition="only"
          triggerAriaLabel="More actions"
          menu={sampleMenu}
        >
          Hidden
        </SplitButton>
      </Row>
    </Col>
  ),
}

export const States: Story = {
  render: () => (
    <Col label="State">
      <Row>
        <SplitButton menu={sampleMenu}>Default</SplitButton>
        <SplitButton disabled menu={sampleMenu}>Disabled</SplitButton>
        <SplitButton defaultOpen menu={sampleMenu}>Menu open</SplitButton>
      </Row>
    </Col>
  ),
}
