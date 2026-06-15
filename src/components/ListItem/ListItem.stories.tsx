import type { Meta, StoryObj } from "@storybook/react"
import { ListItem } from "./ListItem"
import { Avatar } from "../Avatar"
import { Menu } from "../Menu"

const meta = {
  title: "Components/ListItem",
  component: ListItem,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Rows used inside menus, dropdowns, and selection lists. Sourced from the TimeWorks Figma file (page "List item", node 46939:7903). Six content variants — item, button, category-title, category-separator, information, divider.',
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "item",
        "button",
        "category-title",
        "category-separator",
        "information",
        "divider",
      ],
    },
    icon: { control: "text" },
    rightIcon: { control: "boolean" },
    active: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: {
    variant: "item",
    children: "Option 1",
  },
  decorators: [
    (Story) => (
      <div className="w-[250px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ListItem>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-1">
    <span className="text-t3 text-[var(--color-secondary-text-color)] uppercase tracking-wide">
      {label}
    </span>
    <div className="w-[250px] flex flex-col gap-1">{children}</div>
  </div>
)

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <Row label="Default">
        <ListItem>Option 1</ListItem>
        <ListItem rightIcon>Option 1</ListItem>
        <ListItem icon="hexagon-image">Option 1</ListItem>
        <ListItem icon="hexagon-image" rightIcon>
          Option 1
        </ListItem>
      </Row>
      <Row label="Active">
        <ListItem active>Option 1</ListItem>
        <ListItem active rightIcon>
          Option 1
        </ListItem>
        <ListItem active icon="hexagon-image">
          Option 1
        </ListItem>
      </Row>
      <Row label="Disabled">
        <ListItem disabled>Option 1</ListItem>
        <ListItem disabled rightIcon>
          Option 1
        </ListItem>
        <ListItem disabled icon="hexagon-image">
          Option 1
        </ListItem>
      </Row>
    </div>
  ),
}

export const WithAvatar: Story = {
  render: () => (
    <Row label="Avatar">
      <ListItem
        avatar={
          <Avatar
            size="xs"
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=faces"
            alt="Riley M."
          />
        }
      >
        Riley M.
      </ListItem>
      <ListItem
        rightIcon
        avatar={<Avatar size="xs" type="initials" initials="JL" alt="Jordan L." />}
      >
        Jordan L.
      </ListItem>
      <ListItem
        active
        avatar={<Avatar size="xs" type="initials" initials="AB" alt="Abigail B." />}
        rightIcon
      >
        Abigail B.
      </ListItem>
      <ListItem
        disabled
        avatar={<Avatar size="xs" type="initials" initials="DR" alt="Dana R." />}
      >
        Dana R.
      </ListItem>
    </Row>
  ),
}

export const WithLabel: Story = {
  render: () => (
    <Row label="Label pill">
      <ListItem label="New">Option 1</ListItem>
      <ListItem icon="hexagon-image" label={{ children: "Beta", kind: "fill" }}>
        Option 1
      </ListItem>
      <ListItem label={{ children: "Active", color: "positive" }}>Option 1</ListItem>
      <ListItem label={{ children: "Failed", color: "negative", kind: "fill" }}>
        Option 1
      </ListItem>
      <ListItem
        avatar={<Avatar size="xs" type="initials" initials="JL" alt="Jordan L." />}
        label={{ children: "Owner", color: "dark" }}
      >
        Jordan L.
      </ListItem>
    </Row>
  ),
}

export const ContentVariants: Story = {
  render: () => (
    <div className="w-[250px] flex flex-col gap-1">
      <ListItem variant="category-separator">Category 1</ListItem>
      <ListItem icon="hexagon-image">Option 1</ListItem>
      <ListItem icon="hexagon-image" rightIcon>
        Option 2
      </ListItem>
      <ListItem variant="divider" />
      <ListItem variant="category-title" icon="hexagon-image">
        Settings
      </ListItem>
      <ListItem icon="hexagon-image">Profile</ListItem>
      <ListItem icon="hexagon-image">Notifications</ListItem>
      <ListItem variant="divider" />
      <ListItem variant="information">No more results</ListItem>
      <ListItem variant="button" icon="pen">
        Edit
      </ListItem>
    </div>
  ),
}

export const InMenu: Story = {
  render: () => (
    <Menu size="lg">
      <ListItem icon="user">Profile</ListItem>
      <ListItem icon="bell" rightIcon>
        Notifications
      </ListItem>
      <ListItem icon="gears" active>
        Settings
      </ListItem>
      <ListItem variant="divider" />
      <ListItem variant="category-separator">Workspace</ListItem>
      <ListItem icon="users-grp">Members</ListItem>
      <ListItem icon="folder">Projects</ListItem>
      <ListItem icon="lock" disabled>
        Billing
      </ListItem>
      <ListItem variant="divider" />
      <ListItem variant="button" icon="arrow-right-from-bracket">
        Sign out
      </ListItem>
    </Menu>
  ),
}
