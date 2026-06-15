import type { Meta, StoryObj } from "@storybook/react"
import { IconButton } from "./IconButton"
import { ICON_NAMES } from "../../icons/names"

const meta = {
  title: "Components/IconButton",
  component: IconButton,
  parameters: {
    layout: "centered",
    a11y: { disable: false },
    docs: {
      description: {
        component:
          'Circular, icon-only button used in toolbars and control bars. Sourced from the TimeWorks DS Experiment file (page "Icon Button", node 25757:58850). Mirrors the `Button` API — Size × Kind × Color × State — and adds an `active` toggle for pressed/selected states. Always pass `aria-label` (or wrap in a Tooltip) so screen readers announce the action.',
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    kind: { control: "select", options: ["primary", "secondary", "tertiary", "brand"] },
    size: { control: "select", options: ["xxs", "xs", "sm", "md", "lg"] },
    color: {
      control: "select",
      options: [
        "primary",
        "negative",
        "positive",
        "inverted",
        "on-primary",
        "on-negative",
        "on-positive",
        "on-warning",
        "on-inverted",
      ],
    },
    icon: { control: "select", options: ICON_NAMES },
    active: { control: "boolean" },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: {
    kind: "primary",
    size: "md",
    color: "primary",
    icon: "ellipsis",
    "aria-label": "More",
  },
} satisfies Meta<typeof IconButton>

export default meta
type Story = StoryObj<typeof meta>

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

export const Default: Story = {}

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {(["primary", "secondary", "tertiary", "brand"] as const).map((kind) => (
        <Col key={kind} label={kind}>
          <Row>
            <IconButton kind={kind} icon="ellipsis" aria-label={`${kind}`} />
            <IconButton kind={kind} icon="ellipsis" aria-label={`${kind} active`} active />
            <IconButton kind={kind} icon="ellipsis" aria-label={`${kind} loading`} loading />
            <IconButton kind={kind} icon="ellipsis" aria-label={`${kind} disabled`} disabled />
          </Row>
        </Col>
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <Col label="Size">
      <Row>
        <IconButton size="lg" icon="ellipsis" aria-label="Large" />
        <IconButton size="md" icon="ellipsis" aria-label="Medium" />
        <IconButton size="sm" icon="ellipsis" aria-label="Small" />
        <IconButton size="xs" icon="ellipsis" aria-label="XS" />
        <IconButton size="xxs" icon="ellipsis" aria-label="XXS" />
      </Row>
    </Col>
  ),
}

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {(["primary", "secondary", "tertiary", "brand"] as const).map((kind) => (
        <Col key={kind} label={kind}>
          <Row>
            <IconButton kind={kind} icon="ellipsis" aria-label="Default" />
            <IconButton kind={kind} icon="ellipsis" aria-label="Active" active />
            <IconButton kind={kind} icon="ellipsis" aria-label="Disabled" disabled />
            <IconButton kind={kind} icon="ellipsis" aria-label="Loading" loading />
          </Row>
        </Col>
      ))}
    </div>
  ),
}

export const Colors: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <Col label="Primary kind · color axis">
        <Row>
          <IconButton color="primary" icon="ellipsis" aria-label="primary" />
          <IconButton color="negative" icon="ellipsis" aria-label="negative" />
          <IconButton color="positive" icon="ellipsis" aria-label="positive" />
          <IconButton color="inverted" icon="ellipsis" aria-label="inverted" />
        </Row>
      </Col>
      <Col label="Secondary kind · color axis">
        <Row>
          <IconButton kind="secondary" color="primary" icon="ellipsis" aria-label="secondary primary" />
          <IconButton kind="secondary" color="negative" icon="ellipsis" aria-label="secondary negative" />
          <IconButton kind="secondary" color="positive" icon="ellipsis" aria-label="secondary positive" />
        </Row>
      </Col>
      <Col label="Tertiary kind · color axis">
        <Row>
          <IconButton kind="tertiary" color="primary" icon="ellipsis" aria-label="tertiary primary" />
          <IconButton kind="tertiary" color="negative" icon="ellipsis" aria-label="tertiary negative" />
          <IconButton kind="tertiary" color="positive" icon="ellipsis" aria-label="tertiary positive" />
        </Row>
      </Col>
      <Col label="On colored surfaces (primary kind)">
        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-full bg-[var(--color-primary-color)] p-2">
            <IconButton color="on-primary" icon="ellipsis" aria-label="on-primary" />
          </div>
          <div className="rounded-full bg-[var(--color-negative-color)] p-2">
            <IconButton color="on-negative" icon="ellipsis" aria-label="on-negative" />
          </div>
          <div className="rounded-full bg-[var(--color-positive-color)] p-2">
            <IconButton color="on-positive" icon="ellipsis" aria-label="on-positive" />
          </div>
          <div className="rounded-full bg-[var(--color-fixed-dark-color)] p-2">
            <IconButton color="on-inverted" icon="ellipsis" aria-label="on-inverted" />
          </div>
        </div>
      </Col>
    </div>
  ),
}

export const Playground: Story = {}
