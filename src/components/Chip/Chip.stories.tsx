import type { Meta, StoryObj } from "@storybook/react"
import { Chip, type ChipType } from "./Chip"
import { Avatar } from "../Avatar"

const SOLID_TYPES = ["primary", "positive", "negative", "warning"] as const
const SUBTLE_TYPES = [
  "primary-subtle",
  "positive-subtle",
  "negative-subtle",
  "warning-subtle",
] as const
const ON_TYPES = ["on-primary", "on-positive", "on-negative", "on-warning"] as const
const ALL_TYPES = ["default", ...SOLID_TYPES, ...SUBTLE_TYPES, ...ON_TYPES] satisfies ChipType[]

const meta = {
  title: "Components/Chip",
  component: Chip,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Chips are compact elements that represent an input, attribute, or action. Sourced from the TimeWorks Figma file (page "Chips", node 46939:97283). Thirteen color types: a neutral `default`, four solid severity tones, their `*-subtle` siblings, and an `on-*` pair of each subtle for placement on top of a matching tinted surface.',
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: { control: "radio", options: ["sm", "md"] },
    type: { control: "select", options: ALL_TYPES },
    icon: { control: "text" },
    iconPosition: { control: "radio", options: ["left", "right"] },
    avatarPosition: { control: "radio", options: ["left", "right"] },
    closePosition: { control: "radio", options: ["left", "right"] },
    disabled: { control: "boolean" },
  },
  args: {
    type: "default",
    children: "This is a chip",
  },
} satisfies Meta<typeof Chip>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-center gap-6">
    <span className="w-32 text-t3 text-[var(--color-secondary-text-color)] uppercase tracking-wide">
      {label}
    </span>
    <div className="flex flex-wrap items-center gap-3">{children}</div>
  </div>
)

// Matching tinted backgrounds for the `on-*` types so they render on a
// surface that mirrors their Figma context.
const ON_SURFACE: Record<(typeof ON_TYPES)[number], string> = {
  "on-primary": "var(--color-primary-selected-color)",
  "on-positive": "var(--color-positive-color-selected)",
  "on-negative": "var(--color-negative-color-selected)",
  "on-warning": "var(--color-warning-color-selected)",
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Row label="Small">
        <Chip size="sm">This is a chip</Chip>
        <Chip size="sm" type="positive-subtle" icon="circle-check">
          Active
        </Chip>
        <Chip
          size="sm"
          avatar={<Avatar size="xs" type="initials" initials="RM" alt="Riley M." />}
        >
          Riley M.
        </Chip>
        <Chip size="sm" onClose={() => {}}>
          Closeable
        </Chip>
      </Row>
      <Row label="Medium">
        <Chip>This is a chip</Chip>
        <Chip type="positive-subtle" icon="circle-check">
          Active
        </Chip>
        <Chip avatar={<Avatar size="xs" type="initials" initials="RM" alt="Riley M." />}>
          Riley M.
        </Chip>
        <Chip onClose={() => {}}>Closeable</Chip>
      </Row>
    </div>
  ),
}

export const Types: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Row label="Default">
        <Chip type="default">Default</Chip>
      </Row>
      <Row label="Solid">
        {SOLID_TYPES.map((t) => (
          <Chip key={t} type={t}>
            {t}
          </Chip>
        ))}
      </Row>
      <Row label="Subtle">
        {SUBTLE_TYPES.map((t) => (
          <Chip key={t} type={t}>
            {t}
          </Chip>
        ))}
      </Row>
      {ON_TYPES.map((t) => (
        <div
          key={t}
          className="flex items-center gap-6 p-3 rounded-md"
          style={{ background: ON_SURFACE[t] }}
        >
          <span className="w-32 text-t3 text-[var(--color-secondary-text-color)] uppercase tracking-wide">
            {t}
          </span>
          <Chip type={t}>This is a chip</Chip>
        </div>
      ))}
    </div>
  ),
}

// Hover backgrounds mirror the `hover:bg-…` rules in Chip.tsx so the Hover
// row renders the resting hover color statically (no pseudo-states addon).
const SOLID_HOVER_BG: Record<(typeof SOLID_TYPES)[number], string> = {
  primary: "bg-[var(--color-primary-hover-color)]",
  positive: "bg-[var(--color-positive-color-hover)]",
  negative: "bg-[var(--color-negative-color-hover)]",
  warning: "bg-[var(--color-warning-color-hover)]",
}
const SUBTLE_HOVER_BG: Record<(typeof SUBTLE_TYPES)[number], string> = {
  "primary-subtle": "bg-[var(--color-primary-selected-hover-color)]",
  "positive-subtle": "bg-[var(--color-positive-color-selected-hover)]",
  "negative-subtle": "bg-[var(--color-negative-color-selected-hover)]",
  "warning-subtle": "bg-[var(--color-warning-color-selected-hover)]",
}

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Row label="Default">
        {SOLID_TYPES.map((t) => (
          <Chip key={t} type={t}>
            {t}
          </Chip>
        ))}
      </Row>
      <Row label="Hover (solid)">
        {SOLID_TYPES.map((t) => (
          <Chip key={t} type={t} className={SOLID_HOVER_BG[t]}>
            {t}
          </Chip>
        ))}
      </Row>
      <Row label="Hover (subtle)">
        {SUBTLE_TYPES.map((t) => (
          <Chip key={t} type={t} className={SUBTLE_HOVER_BG[t]}>
            {t}
          </Chip>
        ))}
      </Row>
      <Row label="Disabled">
        {SOLID_TYPES.map((t) => (
          <Chip key={t} type={t} disabled>
            {t}
          </Chip>
        ))}
      </Row>
    </div>
  ),
}

export const WithIcon: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Row label="Icon left">
        <Chip icon="hexagon-image">This is a chip</Chip>
        <Chip type="positive-subtle" icon="circle-check">
          Active
        </Chip>
        <Chip type="negative-subtle" icon="triangle-exclamation">
          Failed
        </Chip>
        <Chip type="warning-subtle" icon="triangle-exclamation">
          Pending
        </Chip>
      </Row>
      <Row label="Icon right">
        <Chip icon="hexagon-image" iconPosition="right">
          This is a chip
        </Chip>
        <Chip type="positive-subtle" icon="circle-check" iconPosition="right">
          Active
        </Chip>
      </Row>
      <Row label="On solid">
        <Chip type="primary" icon="hexagon-image">
          Primary
        </Chip>
        <Chip type="positive" icon="circle-check">
          Positive
        </Chip>
        <Chip type="negative" icon="triangle-exclamation">
          Negative
        </Chip>
      </Row>
    </div>
  ),
}

export const WithAvatar: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Row label="Avatar left">
        <Chip
          avatar={
            <Avatar
              size="xs"
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=faces"
              alt="Riley M."
            />
          }
        >
          Riley M.
        </Chip>
        <Chip
          type="positive-subtle"
          avatar={<Avatar size="xs" type="initials" initials="RM" alt="Riley M." />}
        >
          Riley M.
        </Chip>
      </Row>
      <Row label="Avatar right">
        <Chip
          avatarPosition="right"
          avatar={
            <Avatar
              size="xs"
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=faces"
              alt="Riley M."
            />
          }
        >
          Riley M.
        </Chip>
      </Row>
    </div>
  ),
}

export const Closeable: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Row label="Plain">
        <Chip onClose={() => {}}>This is a chip</Chip>
        <Chip type="positive-subtle" onClose={() => {}}>
          Positive
        </Chip>
        <Chip type="negative-subtle" onClose={() => {}}>
          Negative
        </Chip>
        <Chip type="warning-subtle" onClose={() => {}}>
          Warning
        </Chip>
      </Row>
      <Row label="Solid">
        <Chip type="primary" onClose={() => {}}>
          Primary
        </Chip>
        <Chip type="negative" onClose={() => {}}>
          Negative
        </Chip>
      </Row>
      <Row label="With icon">
        <Chip icon="hexagon-image" onClose={() => {}}>
          With icon
        </Chip>
        <Chip icon="hexagon-image" iconPosition="right" onClose={() => {}}>
          Icon right
        </Chip>
      </Row>
      <Row label="With avatar">
        <Chip
          avatar={<Avatar size="xs" type="initials" initials="RM" alt="Riley M." />}
          onClose={() => {}}
        >
          Riley M.
        </Chip>
      </Row>
      <Row label="Disabled">
        <Chip onClose={() => {}} disabled>
          Disabled
        </Chip>
      </Row>
    </div>
  ),
}
