import type { Meta, StoryObj } from "@storybook/react"
import { AvatarGroup } from "./AvatarGroup"
import { Avatar } from "../Avatar"

const FACES = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1545996124-0501ebae84d0?w=96&h=96&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1463453091185-61582044d556?w=96&h=96&fit=crop&crop=faces",
]

const NAMES = ["Riley", "Daniel", "Roy", "Guy", "Mara"]

const faces = () =>
  FACES.map((src, i) => <Avatar key={i} src={src} alt={NAMES[i]} />)

const meta = {
  title: "Components/AvatarGroup",
  component: AvatarGroup,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Stacked group of avatars with an optional +N counter chip. Sourced from the TimeWorks Figma file (page "AvatarGroup", node 46939:90057).',
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "md", "lg"] },
    theme: { control: "select", options: ["light", "dark"] },
    disabled: { control: "boolean" },
    max: { control: { type: "number", min: 1, max: 10 } },
    counterText: { control: "text" },
  },
  args: {
    size: "md",
    theme: "light",
    disabled: false,
    max: 3,
    children: faces(),
  },
} satisfies Meta<typeof AvatarGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => (
    <AvatarGroup {...args}>{faces()}</AvatarGroup>
  ),
}

const Row = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-wrap items-center gap-8">{children}</div>
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
    <div className="flex flex-col gap-6">
      {(["lg", "md", "sm", "xs"] as const).map((size) => (
        <Col key={size} label={size}>
          <Row>
            <AvatarGroup size={size} max={3} counterText="+10">
              {faces()}
            </AvatarGroup>
          </Row>
        </Col>
      ))}
    </div>
  ),
}

export const Themes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {(["lg", "md", "sm", "xs"] as const).map((size) => (
        <Col key={size} label={size}>
          <div className="flex flex-wrap items-center gap-12">
            <AvatarGroup size={size} max={3} counterText="+10">
              {faces()}
            </AvatarGroup>
            <AvatarGroup size={size} theme="dark" max={3} counterText="+10">
              {faces()}
            </AvatarGroup>
          </div>
        </Col>
      ))}
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {(["lg", "md", "sm", "xs"] as const).map((size) => (
        <Col key={size} label={size}>
          <Row>
            <AvatarGroup size={size} max={3} counterText="+10" disabled>
              {faces()}
            </AvatarGroup>
          </Row>
        </Col>
      ))}
    </div>
  ),
}

export const NoCounter: Story = {
  render: () => <AvatarGroup>{faces()}</AvatarGroup>,
}

export const MixedAvatarTypes: Story = {
  render: () => (
    <AvatarGroup max={4}>
      <Avatar src={FACES[0]} alt="Riley" />
      <Avatar type="initials" initials="DK" />
      <Avatar type="letter" letter="F" />
      <Avatar type="icon" icon="users-grp" />
      <Avatar src={FACES[1]} alt="Daniel" />
      <Avatar src={FACES[2]} alt="Roy" />
    </AvatarGroup>
  ),
}
