import type { Meta, StoryObj } from "@storybook/react"
import { Skeleton } from "./Skeleton"

const meta = {
  title: "Components/Skeleton",
  component: Skeleton,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          'Skeleton placeholder shown while content loads. Sourced from the TimeWorks Figma file (page "Skeleton loading", node 46949:1064). Compose `circle`, `rectangle`, and `text` (h1/h2/paragraph) primitives to mimic the eventual UI. Pulses by default; pass `animated={false}` for a static placeholder.',
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    type: { control: "radio", options: ["circle", "rectangle", "text"] },
    size: { control: "radio", options: ["h1", "h2", "paragraph"] },
    width: { control: "text" },
    height: { control: "text" },
    animated: { control: "boolean" },
  },
  args: {
    type: "circle",
    size: "paragraph",
    animated: true,
  },
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

const Cell = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-2">
    <span className="text-t3 text-[var(--color-secondary-text-color)] uppercase tracking-wide">
      {label}
    </span>
    {children}
  </div>
)

export const Playground: Story = {}

export const Types: Story = {
  render: () => (
    <div className="flex flex-wrap items-end gap-10">
      <Cell label="Circle · 38×38">
        <Skeleton type="circle" />
      </Cell>
      <Cell label="Rectangle · 144×144">
        <Skeleton type="rectangle" />
      </Cell>
      <Cell label="Text · H1 · 162×32">
        <Skeleton type="text" size="h1" />
      </Cell>
      <Cell label="Text · H2 · 162×24">
        <Skeleton type="text" size="h2" />
      </Cell>
      <Cell label="Text · Paragraph · 162×16">
        <Skeleton type="text" size="paragraph" />
      </Cell>
    </div>
  ),
}

export const Animation: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <Cell label="Animated (default)">
        <div className="flex items-center gap-3">
          <Skeleton type="circle" />
          <Skeleton type="text" size="paragraph" width={220} />
        </div>
      </Cell>
      <Cell label="Static · animated={false}">
        <div className="flex items-center gap-3">
          <Skeleton type="circle" animated={false} />
          <Skeleton type="text" size="paragraph" width={220} animated={false} />
        </div>
      </Cell>
    </div>
  ),
}

export const CustomSize: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-[480px]">
      <Cell label="Fluid width · width='100%'">
        <Skeleton type="text" size="h2" width="100%" />
      </Cell>
      <Cell label="Tall rectangle · 320×80">
        <Skeleton type="rectangle" width={320} height={80} />
      </Cell>
      <Cell label="Larger circle · 64×64">
        <Skeleton type="circle" width={64} height={64} />
      </Cell>
    </div>
  ),
}

export const ProfileCard: Story = {
  name: "Composed · Profile card",
  render: () => (
    <div className="flex flex-col gap-3 w-80 p-4 rounded-lg border border-[var(--color-layout-border-color)] bg-[var(--color-primary-background-color)]">
      <div className="flex items-center gap-2">
        <Skeleton type="circle" />
        <Skeleton type="text" size="paragraph" width={93} />
      </div>
      <div className="flex items-start gap-4 w-full">
        <Skeleton type="rectangle" width={144} height={144} />
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <Skeleton type="text" size="h1" width="100%" />
          <Skeleton type="text" size="paragraph" width="100%" />
          <Skeleton type="text" size="paragraph" width="100%" />
          <Skeleton type="text" size="paragraph" width="100%" />
          <Skeleton type="text" size="paragraph" width={100} />
        </div>
      </div>
    </div>
  ),
}

export const ListRows: Story = {
  name: "Composed · List rows",
  render: () => (
    <div className="flex flex-col gap-4 w-[420px]">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton type="circle" />
          <div className="flex flex-col gap-2 flex-1">
            <Skeleton type="text" size="h2" width="60%" />
            <Skeleton type="text" size="paragraph" width="90%" />
          </div>
        </div>
      ))}
    </div>
  ),
}
