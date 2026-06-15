import type { Meta, StoryObj } from "@storybook/react"
import { AttentionBox } from "./AttentionBox"

const meta = {
  title: "Components/AttentionBox",
  component: AttentionBox,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          'Attention boxes are inline content cards used to draw attention to a message inside the page (not at the top of the viewport like AlertBanner). Sourced from the TimeWorks Figma file (page "Attention Box", node 46939:7881). Five intent types — primary, neutral, positive, warning, negative — and two layouts: default (with optional title + body + CTAs) and compact (single 20px row with truncated body).',
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["primary", "neutral", "positive", "warning", "negative"],
    },
    compact: { control: "boolean" },
    withIcon: { control: "boolean" },
    title: { control: "text" },
    children: { control: "text" },
  },
  args: {
    type: "primary",
    compact: false,
    withIcon: true,
    title: "Attention box title",
    children:
      "This action will cause your team to lose access to the account until you will use the correct SSO source.",
    cta: { label: "Read more" },
    action: { label: "Button" },
    onDismiss: () => {},
  },
} satisfies Meta<typeof AttentionBox>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

const TYPES = ["primary", "neutral", "positive", "warning", "negative"] as const

const Stack = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col gap-3 w-full max-w-[640px]">{children}</div>
)
const Col = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-3">
    <span className="text-t3 text-[color:var(--color-secondary-text-color)] uppercase tracking-wide">
      {label}
    </span>
    {children}
  </div>
)

export const Types: Story = {
  render: () => (
    <Stack>
      {TYPES.map((type) => (
        <AttentionBox
          key={type}
          type={type}
          title="Attention box title"
          cta={{ label: "Read more" }}
          action={{ label: "Button" }}
          onDismiss={() => {}}
        >
          This action will cause your team to lose access to the account until you will use the
          correct SSO source.
        </AttentionBox>
      ))}
    </Stack>
  ),
}

export const DefaultWithTitle: Story = {
  render: () => (
    <Col label="Default · with title">
      <Stack>
        {TYPES.map((type) => (
          <AttentionBox
            key={type}
            type={type}
            title="Attention box title"
            cta={{ label: "Read more" }}
            action={{ label: "Button" }}
            onDismiss={() => {}}
          >
            This action will cause your team to lose access to the account until you will use the
            correct SSO source.
          </AttentionBox>
        ))}
      </Stack>
    </Col>
  ),
}

export const DefaultWithoutTitle: Story = {
  render: () => (
    <Col label="Default · no title">
      <Stack>
        {TYPES.map((type) => (
          <AttentionBox
            key={type}
            type={type}
            cta={{ label: "Read more" }}
            action={{ label: "Button" }}
            onDismiss={() => {}}
          >
            This action will cause your team to lose access to the account until you will use the
            correct SSO source.
          </AttentionBox>
        ))}
      </Stack>
    </Col>
  ),
}

export const Compact: Story = {
  render: () => (
    <Col label="Compact">
      <Stack>
        {TYPES.map((type) => (
          <AttentionBox
            key={type}
            type={type}
            compact
            cta={{ label: "Read more" }}
            action={{ label: "Button" }}
            onDismiss={() => {}}
          >
            This action will cause your team to lose access to the account until you will use the
            correct SSO source.
          </AttentionBox>
        ))}
      </Stack>
    </Col>
  ),
}

export const NoCta: Story = {
  render: () => (
    <Stack>
      {TYPES.map((type) => (
        <AttentionBox key={type} type={type} title="Attention box title" onDismiss={() => {}}>
          This action will cause your team to lose access to the account until you will use the
          correct SSO source.
        </AttentionBox>
      ))}
    </Stack>
  ),
}

export const LinkOnly: Story = {
  render: () => (
    <Stack>
      {TYPES.map((type) => (
        <AttentionBox
          key={type}
          type={type}
          title="Attention box title"
          cta={{ label: "Read more" }}
          onDismiss={() => {}}
        >
          This action will cause your team to lose access to the account until you will use the
          correct SSO source.
        </AttentionBox>
      ))}
    </Stack>
  ),
}

export const ButtonOnly: Story = {
  render: () => (
    <Stack>
      {TYPES.map((type) => (
        <AttentionBox
          key={type}
          type={type}
          title="Attention box title"
          action={{ label: "Button" }}
          onDismiss={() => {}}
        >
          This action will cause your team to lose access to the account until you will use the
          correct SSO source.
        </AttentionBox>
      ))}
    </Stack>
  ),
}
