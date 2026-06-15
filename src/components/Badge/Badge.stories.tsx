import type { Meta, StoryObj } from "@storybook/react"
import { Badge } from "./Badge"
import { Button } from "../Button"
import { IconButton } from "../IconButton"
import { Avatar } from "../Avatar"

const meta = {
  title: "Components/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Badge overlays a notification indicator (dot) or counter on top of an adjacent component such as Button, IconButton, or Avatar. Sourced from the TimeWorks Figma file (page "Badge", node 46939:90704). Use `anchor="round"` for circular children (Avatar) so the badge clears the visible edge.',
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    type: { control: "radio", options: ["indicator", "counter"] },
    anchor: { control: "radio", options: ["square", "round"] },
    count: { control: { type: "number", min: 0, max: 9999 } },
    max: { control: { type: "number", min: 1, max: 9999 } },
    hidden: { control: "boolean" },
  },
  args: {
    type: "indicator",
    anchor: "square",
    count: 5,
    max: 99,
    hidden: false,
    children: <Button>Inbox</Button>,
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-center gap-8">
    <span className="w-32 text-t3 text-[var(--color-secondary-text-color)] uppercase tracking-wide">
      {label}
    </span>
    <div className="flex items-center gap-10">{children}</div>
  </div>
)

export const Indicator: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <Row label="Button">
        <Badge type="indicator">
          <Button>Button</Button>
        </Badge>
      </Row>
      <Row label="Icon button">
        <Badge type="indicator">
          <IconButton icon="bell" aria-label="Notifications" />
        </Badge>
      </Row>
      <Row label="Avatar">
        <Badge type="indicator" anchor="round">
          <Avatar
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=faces"
            alt="Riley M."
          />
        </Badge>
      </Row>
    </div>
  ),
}

export const Counter: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <Row label="Button">
        <Badge type="counter" count={3}>
          <Button>Inbox</Button>
        </Badge>
        <Badge type="counter" count={42}>
          <Button>Inbox</Button>
        </Badge>
        <Badge type="counter" count={120}>
          <Button>Inbox</Button>
        </Badge>
      </Row>
      <Row label="Icon button">
        <Badge type="counter" count={3}>
          <IconButton icon="bell" aria-label="Notifications" />
        </Badge>
        <Badge type="counter" count={42}>
          <IconButton icon="bell" aria-label="Notifications" />
        </Badge>
        <Badge type="counter" count={120}>
          <IconButton icon="bell" aria-label="Notifications" />
        </Badge>
      </Row>
      <Row label="Avatar">
        <Badge type="counter" count={3} anchor="round">
          <Avatar
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=faces"
            alt="Riley M."
          />
        </Badge>
      </Row>
    </div>
  ),
}

export const AnchorShapes: Story = {
  render: () => (
    <div className="flex items-center gap-12">
      <Badge type="indicator" anchor="square">
        <Button>Square</Button>
      </Badge>
      <Badge type="indicator" anchor="round">
        <Avatar
          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=faces"
          alt="Riley M."
        />
      </Badge>
    </div>
  ),
}
