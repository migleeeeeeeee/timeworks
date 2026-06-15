import type { Meta, StoryObj } from "@storybook/react"
import { Divider } from "./Divider"
import { Text } from "../Text"
import { Avatar } from "../Avatar"

const meta = {
  title: "Components/Divider",
  component: Divider,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          'Divider draws a 1px line in `--color-layout-border-color` to separate content groups. Sourced from the TimeWorks Figma file (page "Divider", node 46946:1080). Defaults to decorative (`role="none"`); pass `decorative={false}` to expose it as a semantic separator.',
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    orientation: { control: "radio", options: ["horizontal", "vertical"] },
    decorative: { control: "boolean" },
  },
  args: {
    orientation: "horizontal",
    decorative: true,
  },
} satisfies Meta<typeof Divider>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => (
    <div
      className={
        args.orientation === "vertical"
          ? "flex h-24 items-stretch gap-4"
          : "flex flex-col gap-4 w-80"
      }
    >
      <Text variant="t2">Above / before</Text>
      <Divider {...args} />
      <Text variant="t2">Below / after</Text>
    </div>
  ),
}

export const Horizontal: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-96">
      <Text variant="t2" weight="semibold">
        Account
      </Text>
      <Text variant="t3" className="text-[var(--color-secondary-text-color)]">
        Profile, password, and connected services.
      </Text>
      <Divider />
      <Text variant="t2" weight="semibold">
        Workspace
      </Text>
      <Text variant="t3" className="text-[var(--color-secondary-text-color)]">
        Members, billing, and integrations.
      </Text>
      <Divider />
      <Text variant="t2" weight="semibold">
        Notifications
      </Text>
      <Text variant="t3" className="text-[var(--color-secondary-text-color)]">
        Choose what you get pinged about.
      </Text>
    </div>
  ),
}

export const Vertical: Story = {
  render: () => (
    <div className="flex h-12 items-center gap-4">
      <Text variant="t2">Inbox</Text>
      <Divider orientation="vertical" />
      <Text variant="t2">Drafts</Text>
      <Divider orientation="vertical" />
      <Text variant="t2">Archive</Text>
      <Divider orientation="vertical" />
      <Text variant="t2">Spam</Text>
    </div>
  ),
}

export const InCard: Story = {
  render: () => (
    <div className="w-96 rounded-xl border border-[var(--color-layout-border-color)] bg-[var(--color-primary-background-color)] overflow-hidden">
      <div className="flex items-center gap-3 p-4">
        <Avatar
          size="sm"
          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=faces"
          alt="Riley M."
        />
        <div className="flex flex-col">
          <Text variant="t2" weight="semibold">
            Riley M.
          </Text>
          <Text variant="t3" className="text-[var(--color-secondary-text-color)]">
            riley@timeworks.app
          </Text>
        </div>
      </div>
      <Divider />
      <div className="p-4">
        <Text variant="t3" className="text-[var(--color-secondary-text-color)]">
          Joined April 2024 · Admin
        </Text>
      </div>
    </div>
  ),
}

export const Semantic: Story = {
  args: { decorative: false },
  render: (args) => (
    <div className="flex flex-col gap-3 w-96">
      <Text variant="t2">First section</Text>
      <Divider {...args} />
      <Text variant="t2">Second section</Text>
    </div>
  ),
}
