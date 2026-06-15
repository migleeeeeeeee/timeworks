import type { Meta, StoryObj } from "@storybook/react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./Accordion"

const meta = {
  title: "Components/Accordion",
  component: Accordion,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          'Accordion is a vertically stacked list of items. Each item can be "expanded" or "collapsed" to reveal the content within with that item. Sourced from the TimeWorks Figma file (page "Accordion", node 46939:2840).',
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["single", "multiple"],
    },
  },
  args: {
    type: "single",
  },
} satisfies Meta<typeof Accordion>

export default meta
type Story = StoryObj<typeof meta>

const ITEMS = [
  {
    value: "notifications",
    title: "Notifications",
    body: "Get notified when teammates mention you, assign you a task, or comment on something you follow.",
  },
  {
    value: "privacy",
    title: "Privacy",
    body: "Control who can see your profile, what data is shared with workspaces you join, and how long activity logs are retained.",
  },
  {
    value: "appearance",
    title: "Appearance",
    body: "Pick light or dark theme, density, and the accent color used across the app.",
  },
]

export const Playground: Story = {
  args: {
    type: "single",
    collapsible: true,
    defaultValue: "notifications",
  },
  render: (args) => (
    <div className="max-w-md">
      <Accordion {...args}>
        {ITEMS.map((item) => (
          <AccordionItem key={item.value} value={item.value}>
            <AccordionTrigger>{item.title}</AccordionTrigger>
            <AccordionContent>{item.body}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  ),
}

export const SingleCollapsible: Story = {
  name: "Type · single (collapsible)",
  render: () => (
    <div className="max-w-md">
      <Accordion type="single" collapsible defaultValue="notifications">
        {ITEMS.map((item) => (
          <AccordionItem key={item.value} value={item.value}>
            <AccordionTrigger>{item.title}</AccordionTrigger>
            <AccordionContent>{item.body}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  ),
}

export const Multiple: Story = {
  name: "Type · multiple",
  render: () => (
    <div className="max-w-md">
      <Accordion type="multiple" defaultValue={["notifications", "appearance"]}>
        {ITEMS.map((item) => (
          <AccordionItem key={item.value} value={item.value}>
            <AccordionTrigger>{item.title}</AccordionTrigger>
            <AccordionContent>{item.body}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  ),
}

export const WithLeadingIcons: Story = {
  name: "Icon · leading",
  render: () => (
    <div className="max-w-md">
      <Accordion type="single" collapsible defaultValue="notifications">
        <AccordionItem value="notifications">
          <AccordionTrigger icon="bell">Notifications</AccordionTrigger>
          <AccordionContent>{ITEMS[0]!.body}</AccordionContent>
        </AccordionItem>
        <AccordionItem value="privacy">
          <AccordionTrigger icon="lock">Privacy</AccordionTrigger>
          <AccordionContent>{ITEMS[1]!.body}</AccordionContent>
        </AccordionItem>
        <AccordionItem value="appearance">
          <AccordionTrigger icon="gears">Appearance</AccordionTrigger>
          <AccordionContent>{ITEMS[2]!.body}</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
}

export const States: Story = {
  name: "States · regular / hover / disabled",
  render: () => (
    <div className="max-w-md space-y-6">
      <div>
        <p className="mb-2 text-t3 font-semibold uppercase tracking-wide text-[var(--color-secondary-text-color)]">
          Regular (one item, collapsed / expanded)
        </p>
        <Accordion type="single" collapsible defaultValue="b">
          <AccordionItem value="a">
            <AccordionTrigger>Notifications</AccordionTrigger>
            <AccordionContent>{ITEMS[0]!.body}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="b">
            <AccordionTrigger>Privacy</AccordionTrigger>
            <AccordionContent>{ITEMS[1]!.body}</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div>
        <p className="mb-2 text-t3 font-semibold uppercase tracking-wide text-[var(--color-secondary-text-color)]">
          Disabled item
        </p>
        <Accordion type="single" collapsible>
          <AccordionItem value="a">
            <AccordionTrigger>Notifications</AccordionTrigger>
            <AccordionContent>{ITEMS[0]!.body}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="b" disabled>
            <AccordionTrigger>Privacy (disabled)</AccordionTrigger>
            <AccordionContent>{ITEMS[1]!.body}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="c">
            <AccordionTrigger>Appearance</AccordionTrigger>
            <AccordionContent>{ITEMS[2]!.body}</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  ),
}
