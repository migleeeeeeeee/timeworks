import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger, type TabsOnColor } from "./Tabs"
import { Text } from "../Text"

const meta = {
  title: "Components/Tabs",
  component: Tabs,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          'Horizontal tabs for navigating between related views. Sourced from the TimeWorks Figma file (page "Tabs", node 46939:7916). Compositional API mirrors Radix UI: `Tabs` / `TabsList` / `TabsTrigger` / `TabsContent`. Trigger types include plain text, leading icon, trailing icon, and counter (`/ N`). `TabsList` accepts a `stretched` prop that forces tabs to share the available width.',
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    onColor: { control: "radio", options: ["light", "dark"] },
    defaultValue: { control: "text" },
  },
  args: {
    defaultValue: "overview",
    onColor: "light",
  },
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

const Cell = ({
  label,
  children,
  onColor = "light",
}: {
  label: string
  children: React.ReactNode
  onColor?: TabsOnColor
}) => (
  <div className="flex flex-col gap-3">
    <span className="text-t3 text-[var(--color-secondary-text-color)] uppercase tracking-wide">
      {label}
    </span>
    <div
      className={
        onColor === "dark"
          ? "rounded-md bg-[var(--color-inverted-color-background)] p-6"
          : "rounded-md bg-[var(--color-primary-background-color)] p-6 border border-[var(--color-layout-border-color)]"
      }
    >
      {children}
    </div>
  </div>
)

export const Playground: Story = {
  render: (args) => (
    <Tabs {...args}>
      <TabsList aria-label="Sections">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="usage">Usage</TabsTrigger>
        <TabsTrigger value="archived" disabled>
          Archived
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <Text variant="t1">Overview content.</Text>
      </TabsContent>
      <TabsContent value="details">
        <Text variant="t1">Details content.</Text>
      </TabsContent>
      <TabsContent value="usage">
        <Text variant="t1">Usage content.</Text>
      </TabsContent>
      <TabsContent value="archived">
        <Text variant="t1">Archived content.</Text>
      </TabsContent>
    </Tabs>
  ),
}

export const Types: Story = {
  render: (args) => (
    <div className="flex flex-col gap-8">
      <Cell label="Plain">
        <Tabs {...args} defaultValue="a">
          <TabsList>
            <TabsTrigger value="a">Tab</TabsTrigger>
            <TabsTrigger value="b">Tab</TabsTrigger>
            <TabsTrigger value="c">Tab</TabsTrigger>
          </TabsList>
        </Tabs>
      </Cell>
      <Cell label="Counter">
        <Tabs {...args} defaultValue="a">
          <TabsList>
            <TabsTrigger value="a" counter={2}>
              Tab
            </TabsTrigger>
            <TabsTrigger value="b" counter={5}>
              Tab
            </TabsTrigger>
            <TabsTrigger value="c" counter={12}>
              Tab
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </Cell>
      <Cell label="Left icon">
        <Tabs {...args} defaultValue="a">
          <TabsList>
            <TabsTrigger value="a" leftIcon="house">
              Tab
            </TabsTrigger>
            <TabsTrigger value="b" leftIcon="bell">
              Tab
            </TabsTrigger>
            <TabsTrigger value="c" leftIcon="globe">
              Tab
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </Cell>
      <Cell label="Right icon">
        <Tabs {...args} defaultValue="a">
          <TabsList>
            <TabsTrigger value="a" rightIcon="chevron-down">
              Tab
            </TabsTrigger>
            <TabsTrigger value="b" rightIcon="chevron-down">
              Tab
            </TabsTrigger>
            <TabsTrigger value="c" rightIcon="chevron-down">
              Tab
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </Cell>
    </div>
  ),
}

export const States: Story = {
  render: (args) => (
    <Cell label="Default · hover (try it) · selected · disabled">
      <Tabs {...args} defaultValue="selected">
        <TabsList>
          <TabsTrigger value="default">Default</TabsTrigger>
          <TabsTrigger value="selected">Selected</TabsTrigger>
          <TabsTrigger value="more">Hover me</TabsTrigger>
          <TabsTrigger value="disabled" disabled>
            Disabled
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </Cell>
  ),
}

export const Stretched: Story = {
  render: (args) => (
    <div className="flex flex-col gap-8">
      <Cell label="stretched = false (default)">
        <Tabs {...args} defaultValue="a">
          <TabsList>
            <TabsTrigger value="a">Overview</TabsTrigger>
            <TabsTrigger value="b">Activity</TabsTrigger>
            <TabsTrigger value="c">Members</TabsTrigger>
            <TabsTrigger value="d">Settings</TabsTrigger>
          </TabsList>
        </Tabs>
      </Cell>
      <Cell label="stretched = true">
        <Tabs {...args} defaultValue="a">
          <TabsList stretched>
            <TabsTrigger value="a">Overview</TabsTrigger>
            <TabsTrigger value="b">Activity</TabsTrigger>
            <TabsTrigger value="c">Members</TabsTrigger>
            <TabsTrigger value="d">Settings</TabsTrigger>
          </TabsList>
        </Tabs>
      </Cell>
    </div>
  ),
}

export const Counts: Story = {
  render: (args) => (
    <div className="flex flex-col gap-6">
      {[2, 3, 5, 7, 10].map((n) => (
        <Cell key={n} label={`${n} tabs`}>
          <Tabs {...args} defaultValue="0">
            <TabsList stretched>
              {Array.from({ length: n }, (_, i) => (
                <TabsTrigger key={i} value={String(i)}>
                  {`Tab ${i + 1}`}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </Cell>
      ))}
    </div>
  ),
}

export const DarkSurface: Story = {
  render: (args) => (
    <Cell label="onColor = dark" onColor="dark">
      <Tabs {...args} onColor="dark" defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity" counter={4}>
            Activity
          </TabsTrigger>
          <TabsTrigger value="members" leftIcon="users-grp">
            Members
          </TabsTrigger>
          <TabsTrigger value="archived" disabled>
            Archived
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Text variant="t1" className="!text-[var(--color-text-color-on-inverted)]">
            Overview content on dark.
          </Text>
        </TabsContent>
      </Tabs>
    </Cell>
  ),
}

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState("a")
    return (
      <div className="flex flex-col gap-3">
        <Tabs {...args} value={value} onValueChange={setValue}>
          <TabsList>
            <TabsTrigger value="a">Alpha</TabsTrigger>
            <TabsTrigger value="b">Beta</TabsTrigger>
            <TabsTrigger value="c">Gamma</TabsTrigger>
          </TabsList>
          <TabsContent value="a">
            <Text variant="t1">Alpha panel.</Text>
          </TabsContent>
          <TabsContent value="b">
            <Text variant="t1">Beta panel.</Text>
          </TabsContent>
          <TabsContent value="c">
            <Text variant="t1">Gamma panel.</Text>
          </TabsContent>
        </Tabs>
        <span className="text-t3 text-[var(--color-secondary-text-color)]">
          Active value: <code>{value}</code>
        </span>
      </div>
    )
  },
}
