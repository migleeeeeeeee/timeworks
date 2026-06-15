import type { Meta, StoryObj } from "@storybook/react"
import { Avatar } from "./Avatar"
import { ICON_NAMES } from "../../icons/names"

const SAMPLE_IMG =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=faces"

const meta = {
  title: "Components/Avatar",
  component: Avatar,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Avatar is a graphical representation of a person through a profile picture, image, icon, or set of initials. Sourced from the TimeWorks Figma file (page "Avatar", node 46939:89419).',
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "md", "lg"] },
    type: { control: "select", options: ["img", "initials", "letter", "icon"] },
    icon: { control: "select", options: ["", ...ICON_NAMES] as const },
    disabled: { control: "boolean" },
    src: { control: "text" },
    alt: { control: "text" },
    initials: { control: "text" },
    letter: { control: "text" },
  },
  args: {
    size: "md",
    type: "img",
    src: SAMPLE_IMG,
    alt: "Riley M.",
    initials: "RM",
    letter: "F",
    icon: "users-grp",
  },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

const Row = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-wrap items-end gap-4">{children}</div>
)
const Col = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-2">
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
        <Avatar size="lg" src={SAMPLE_IMG} alt="Riley" />
        <Avatar size="md" src={SAMPLE_IMG} alt="Riley" />
        <Avatar size="sm" src={SAMPLE_IMG} alt="Riley" />
        <Avatar size="xs" src={SAMPLE_IMG} alt="Riley" />
      </Row>
    </Col>
  ),
}

export const Types: Story = {
  render: () => (
    <Row>
      <Avatar type="img" src={SAMPLE_IMG} alt="Riley" />
      <Avatar type="initials" initials="RM" />
      <Avatar type="letter" letter="F" />
      <Avatar type="icon" icon="users-grp" />
    </Row>
  ),
}

export const Disabled: Story = {
  render: () => (
    <Row>
      <Avatar type="img" src={SAMPLE_IMG} alt="Riley" disabled />
      <Avatar type="initials" initials="RM" disabled />
      <Avatar type="letter" letter="F" disabled />
      <Avatar type="icon" icon="users-grp" disabled />
    </Row>
  ),
}

export const VariantsMatrix: Story = {
  render: () => {
    const sizes = ["lg", "md", "sm", "xs"] as const
    return (
      <div className="flex flex-col gap-6">
        {(["img", "initials", "letter", "icon"] as const).map((type) => (
          <Col key={type} label={type}>
            <Row>
              {sizes.map((size) => (
                <Avatar
                  key={size}
                  size={size}
                  type={type}
                  src={SAMPLE_IMG}
                  alt="Riley"
                  initials="RM"
                  letter="F"
                  icon="users-grp"
                />
              ))}
              {sizes.map((size) => (
                <Avatar
                  key={`${size}-d`}
                  size={size}
                  type={type}
                  src={SAMPLE_IMG}
                  alt="Riley"
                  initials="RM"
                  letter="F"
                  icon="users-grp"
                  disabled
                />
              ))}
            </Row>
          </Col>
        ))}
      </div>
    )
  },
}
