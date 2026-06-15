import type { Meta, StoryObj } from "@storybook/react"
import { Link } from "./Link"
import { ICON_NAMES } from "../../icons/names"

const meta = {
  title: "Components/Link",
  component: Link,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Inline link with the system\'s actionable text styling. Sourced from the TimeWorks Figma file (page "Link", node 46946:16984). Two sizes (Figma "Small" 14/20 ↔ "Large" 16/22) and two surfaces (default = blue link on light surfaces; inverted = white link on dark or colored surfaces). Supports an optional leading or trailing icon (16px glyph in a 20px wrapper).',
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md"] },
    surface: { control: "select", options: ["default", "inverted", "on-tinted"] },
    iconLeft: { control: "select", options: ["", ...ICON_NAMES] as const },
    iconRight: { control: "select", options: ["", ...ICON_NAMES] as const },
    disabled: { control: "boolean" },
    children: { control: "text" },
  },
  args: {
    size: "md",
    surface: "default",
    children: "Read more",
    href: "#",
  },
} satisfies Meta<typeof Link>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

const Row = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-wrap items-center gap-6">{children}</div>
)
const Col = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-3">
    <span className="text-t3 text-[color:var(--color-secondary-text-color)] uppercase tracking-wide">
      {label}
    </span>
    {children}
  </div>
)

export const Sizes: Story = {
  render: () => (
    <Col label="Size">
      <Row>
        <Link size="md" href="#">
          Read more
        </Link>
        <Link size="sm" href="#">
          Read more
        </Link>
      </Row>
    </Col>
  ),
}

export const WithIcons: Story = {
  render: () => (
    <Col label="Icon position">
      <Row>
        <Link href="#">No icon</Link>
        <Link href="#" iconLeft="arrow-up-right-from-square">
          Leading icon
        </Link>
        <Link href="#" iconRight="arrow-up-right-from-square">
          Trailing icon
        </Link>
      </Row>
    </Col>
  ),
}

export const States: Story = {
  render: () => (
    <Col label="State (hover/focus are interactive)">
      <Row>
        <Link href="#">Default</Link>
        <Link href="#" className="underline">
          Hover (forced)
        </Link>
        <Link href="#" disabled>
          Disabled
        </Link>
      </Row>
    </Col>
  ),
}

export const Surfaces: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <Col label="Default surface (light background)">
        <div className="flex flex-wrap items-center gap-6 p-6 rounded-md bg-[var(--color-primary-background-color)] border border-[var(--color-layout-border-color)]">
          <Link size="md" href="#">
            Read more
          </Link>
          <Link size="md" href="#" iconRight="arrow-up-right-from-square">
            Read more
          </Link>
          <Link size="sm" href="#" iconLeft="arrow-up-right-from-square">
            Read more
          </Link>
          <Link size="sm" href="#" disabled>
            Disabled
          </Link>
        </div>
      </Col>
      <Col label="Inverted surface (dark background)">
        <div className="flex flex-wrap items-center gap-6 p-6 rounded-md bg-[var(--color-inverted-color-background)]">
          <Link size="md" surface="inverted" href="#">
            Read more
          </Link>
          <Link size="md" surface="inverted" href="#" iconRight="arrow-up-right-from-square">
            Read more
          </Link>
          <Link size="sm" surface="inverted" href="#" iconLeft="arrow-up-right-from-square">
            Read more
          </Link>
          <Link size="sm" surface="inverted" href="#" disabled>
            Disabled
          </Link>
        </div>
      </Col>
    </div>
  ),
}

export const VariantsMatrix: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {(["default", "inverted"] as const).map((surface) => (
        <Col key={surface} label={`${surface} surface`}>
          <div
            className={
              surface === "inverted"
                ? "flex flex-col gap-4 p-6 rounded-md bg-[var(--color-inverted-color-background)]"
                : "flex flex-col gap-4 p-6 rounded-md bg-[var(--color-primary-background-color)] border border-[var(--color-layout-border-color)]"
            }
          >
            {(["md", "sm"] as const).map((size) => (
              <div key={size} className="flex flex-wrap items-center gap-6">
                <Link size={size} surface={surface} href="#">
                  Read more
                </Link>
                <Link
                  size={size}
                  surface={surface}
                  href="#"
                  iconLeft="arrow-up-right-from-square"
                >
                  Read more
                </Link>
                <Link
                  size={size}
                  surface={surface}
                  href="#"
                  iconRight="arrow-up-right-from-square"
                >
                  Read more
                </Link>
                <Link size={size} surface={surface} href="#" disabled>
                  Disabled
                </Link>
              </div>
            ))}
          </div>
        </Col>
      ))}
    </div>
  ),
}
