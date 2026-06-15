import type { Meta, StoryObj } from "@storybook/react"
import { Menu } from "./Menu"
import { ListItem } from "../ListItem"
import { Avatar } from "../Avatar"

const meta = {
  title: "Components/Menu",
  component: Menu,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'A navigable contextual surface that groups ListItem rows. Sourced from the TimeWorks Figma file (page "Menu", node 46939:7906). Owns elevation, radius, padding, and width — pass any combination of `<ListItem>` rows as children.',
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: { control: "radio", options: ["sm", "md", "lg", "fluid"] },
  },
  args: { size: "md", children: null },
} satisfies Meta<typeof Menu>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Menu {...args}>
      <ListItem>Option 1</ListItem>
      <ListItem>Option 2</ListItem>
      <ListItem>Option 3</ListItem>
      <ListItem>Option 4</ListItem>
      <ListItem>Option 5</ListItem>
    </Menu>
  ),
}

export const WithIcons: Story = {
  render: (args) => (
    <Menu {...args}>
      <ListItem icon="user">Profile</ListItem>
      <ListItem icon="bell" rightIcon>
        Notifications
      </ListItem>
      <ListItem icon="gears" active>
        Settings
      </ListItem>
      <ListItem icon="lock" disabled>
        Privacy
      </ListItem>
    </Menu>
  ),
}

export const WithDivider: Story = {
  render: (args) => (
    <Menu {...args}>
      <ListItem icon="user">Profile</ListItem>
      <ListItem icon="bell" rightIcon>
        Notifications
      </ListItem>
      <ListItem variant="divider" />
      <ListItem icon="arrow-right-from-bracket" variant="button">
        Sign out
      </ListItem>
    </Menu>
  ),
}

export const WithCaptions: Story = {
  render: (args) => (
    <Menu {...args}>
      <ListItem variant="category-separator">Account</ListItem>
      <ListItem icon="user">Profile</ListItem>
      <ListItem icon="bell" rightIcon>
        Notifications
      </ListItem>
      <ListItem variant="divider" />
      <ListItem variant="category-separator">Workspace</ListItem>
      <ListItem icon="users-grp">Members</ListItem>
      <ListItem icon="folder">Projects</ListItem>
      <ListItem icon="lock" disabled>
        Billing
      </ListItem>
      <ListItem variant="divider" />
      <ListItem icon="arrow-right-from-bracket" variant="button">
        Sign out
      </ListItem>
    </Menu>
  ),
}

export const WithAvatars: Story = {
  render: (args) => (
    <Menu {...args}>
      <ListItem variant="category-separator">Assignees</ListItem>
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
        avatar={<Avatar size="xs" type="initials" initials="JL" alt="Jordan L." />}
        label={{ children: "Owner", color: "positive" }}
      >
        Jordan L.
      </ListItem>
      <ListItem
        avatar={<Avatar size="xs" type="initials" initials="DR" alt="Dana R." />}
        active
        rightIcon
      >
        Dana R.
      </ListItem>
    </Menu>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-start gap-6">
      {(["sm", "md", "lg"] as const).map((size) => (
        <div key={size} className="flex flex-col gap-2">
          <span className="text-t3 text-[var(--color-secondary-text-color)] uppercase tracking-wide">
            {size}
          </span>
          <Menu size={size}>
            <ListItem icon="user">Profile</ListItem>
            <ListItem icon="bell">Notifications</ListItem>
            <ListItem icon="gears">Settings</ListItem>
          </Menu>
        </div>
      ))}
    </div>
  ),
}
