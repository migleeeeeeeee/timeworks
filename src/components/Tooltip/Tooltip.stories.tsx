import type { Meta, StoryObj } from "@storybook/react"
import { Button } from "../Button"
import { Link } from "../Link"
import { Tooltip, TooltipContent, TooltipTrigger } from "./Tooltip"

const meta = {
  title: "Components/Tooltip",
  component: TooltipContent,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Tooltip — built on `@radix-ui/react-tooltip`. Provides a small floating panel of helpful context anchored to a trigger. Three themes (default / on-dark / on-black), four sides (top / right / bottom / left), and optional title, leading icon, link, and image slots. Sourced from the TimeWorks Figma file (page "Tooltip", node 46939:7922).',
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    theme: { control: "select", options: ["default", "on-dark", "on-black"] },
    side: { control: "select", options: ["top", "right", "bottom", "left"] },
    maxWidth: { control: { type: "number", min: 120, max: 480, step: 10 } },
  },
} satisfies Meta<typeof TooltipContent>

export default meta
type Story = StoryObj<typeof meta>

const SAMPLE_IMAGE =
  "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=480&q=80&auto=format&fit=crop"

/* ─────────────────────────────  Playground  ────────────────────────────── */

export const Playground: Story = {
  args: {
    theme: "default",
    side: "bottom",
    maxWidth: 240,
  },
  render: (args) => (
    <Tooltip defaultOpen>
      <TooltipTrigger asChild>
        <Button>Hover me</Button>
      </TooltipTrigger>
      <TooltipContent {...args}>Tooltip label</TooltipContent>
    </Tooltip>
  ),
}

/* ─────────────────────────────  Default  ───────────────────────────────── */

export const Default: Story = {
  render: () => (
    <Tooltip defaultOpen>
      <TooltipTrigger asChild>
        <Button>Hover me</Button>
      </TooltipTrigger>
      <TooltipContent>Tooltip label</TooltipContent>
    </Tooltip>
  ),
}

/* ─────────────────────────────  Arrow position  ────────────────────────── */

export const ArrowPositions: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-16 p-16">
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <div key={side} className="flex items-center justify-center">
          <Tooltip defaultOpen>
            <TooltipTrigger asChild>
              <Button>{side}</Button>
            </TooltipTrigger>
            <TooltipContent side={side}>Tooltip label</TooltipContent>
          </Tooltip>
        </div>
      ))}
    </div>
  ),
}

/* ─────────────────────────────  With title  ────────────────────────────── */

export const WithTitle: Story = {
  render: () => (
    <div className="flex gap-12">
      <Tooltip defaultOpen>
        <TooltipTrigger asChild>
          <Button>Title</Button>
        </TooltipTrigger>
        <TooltipContent title="Tooltip title">Tooltip label</TooltipContent>
      </Tooltip>
      <Tooltip defaultOpen>
        <TooltipTrigger asChild>
          <Button>Title + icon</Button>
        </TooltipTrigger>
        <TooltipContent title="Tooltip title" titleIcon="bell">
          Tooltip label
        </TooltipContent>
      </Tooltip>
    </div>
  ),
}

/* ─────────────────────────────  With link  ─────────────────────────────── */

export const WithLink: Story = {
  render: () => (
    <Tooltip defaultOpen>
      <TooltipTrigger asChild>
        <Button>With link</Button>
      </TooltipTrigger>
      <TooltipContent
        title="Sales CRM"
        titleIcon="bell"
        maxWidth={260}
        image={
          <div
            className="h-[100px] w-full"
            style={{
              background:
                "linear-gradient(135deg, var(--color-primary-selected-color) 0%, var(--color-primary-color) 100%)",
            }}
            aria-hidden="true"
          />
        }
      >
        Manage all stages of customer lifecycle in one place,{" "}
        <Link href="#" surface="inverted" size="sm">read more</Link>.
      </TooltipContent>
    </Tooltip>
  ),
}

/* ─────────────────────────────  With image  ────────────────────────────── */

export const WithImage: Story = {
  render: () => (
    <Tooltip defaultOpen>
      <TooltipTrigger asChild>
        <Button>With image</Button>
      </TooltipTrigger>
      <TooltipContent
        side="right"
        image={
          <img
            src={SAMPLE_IMAGE}
            alt=""
            className="h-[136px] w-full object-cover"
          />
        }
      >
        Tooltip label
      </TooltipContent>
    </Tooltip>
  ),
}

/* ─────────────────────────────  Theme variants  ────────────────────────── */

export const Themes: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-6 p-12">
      <div className="flex h-32 items-center justify-center rounded-md bg-[var(--color-primary-background-color)] border border-[var(--color-layout-border-color)]">
        <Tooltip defaultOpen>
          <TooltipTrigger asChild>
            <Button>default</Button>
          </TooltipTrigger>
          <TooltipContent theme="default">Tooltip label</TooltipContent>
        </Tooltip>
      </div>
      <div
        className="flex h-32 items-center justify-center rounded-md"
        style={{ backgroundColor: "#1F1834" }}
      >
        <Tooltip defaultOpen>
          <TooltipTrigger asChild>
            <Button>on-dark</Button>
          </TooltipTrigger>
          <TooltipContent theme="on-dark">Tooltip label</TooltipContent>
        </Tooltip>
      </div>
      <div
        className="flex h-32 items-center justify-center rounded-md"
        style={{ backgroundColor: "#1E2026" }}
      >
        <Tooltip defaultOpen>
          <TooltipTrigger asChild>
            <Button>on-black</Button>
          </TooltipTrigger>
          <TooltipContent theme="on-black">Tooltip label</TooltipContent>
        </Tooltip>
      </div>
    </div>
  ),
}

/* ─────────────────────────────  Custom max width  ──────────────────────── */

export const CustomMaxWidth: Story = {
  render: () => (
    <Tooltip defaultOpen>
      <TooltipTrigger asChild>
        <Button>Long body</Button>
      </TooltipTrigger>
      <TooltipContent maxWidth={320}>
        Tooltips can wrap to multiple lines once their content exceeds the
        configured maximum width — 240px by default, customizable via the
        maxWidth prop.
      </TooltipContent>
    </Tooltip>
  ),
}
