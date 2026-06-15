import type { Meta, StoryObj } from "@storybook/react"
import { AlertBanner } from "./AlertBanner"

const meta = {
  title: "Components/AlertBanner",
  component: AlertBanner,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          'Alert banners surface pressing, high-signal messages such as system alerts. They are meant to be noticed and prompt users to take action. Sourced from the TimeWorks Figma file (page "Alert banner", node 46939:87328). Always include a dismiss action; pair with a CTA link or inline action button when a follow-up is expected.',
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["primary", "positive", "negative", "warning", "dark"],
    },
    children: { control: "text" },
  },
  args: {
    type: "primary",
    children: "Alert banner message",
    cta: { label: "this is a CTA" },
    onDismiss: () => {},
  },
} satisfies Meta<typeof AlertBanner>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

const TYPES = ["primary", "negative", "positive", "warning", "dark"] as const

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
        <AlertBanner
          key={type}
          type={type}
          cta={{ label: "this is a CTA" }}
          onDismiss={() => {}}
        >
          Alert banner message
        </AlertBanner>
      ))}
    </Stack>
  ),
}

export const LinkOnly: Story = {
  render: () => (
    <Col label="Link layout">
      <Stack>
        {TYPES.map((type) => (
          <AlertBanner
            key={type}
            type={type}
            cta={{ label: "this is a CTA" }}
            onDismiss={() => {}}
          >
            Alert banner message
          </AlertBanner>
        ))}
      </Stack>
    </Col>
  ),
}

export const ButtonOnly: Story = {
  render: () => (
    <Col label="Button layout">
      <Stack>
        {TYPES.map((type) => (
          <AlertBanner
            key={type}
            type={type}
            action={{ label: "Title" }}
            onDismiss={() => {}}
          >
            Alert banner message
          </AlertBanner>
        ))}
      </Stack>
    </Col>
  ),
}

export const LinkAndButton: Story = {
  render: () => (
    <Col label="Link + button layout">
      <Stack>
        {TYPES.map((type) => (
          <AlertBanner
            key={type}
            type={type}
            cta={{ label: "this is a CTA" }}
            action={{ label: "Title" }}
            onDismiss={() => {}}
          >
            Alert banner message
          </AlertBanner>
        ))}
      </Stack>
    </Col>
  ),
}

export const Matrix: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <Col label="Link">
        <Stack>
          {TYPES.map((type) => (
            <AlertBanner
              key={`l-${type}`}
              type={type}
              cta={{ label: "this is a CTA" }}
              onDismiss={() => {}}
            >
              Alert banner message
            </AlertBanner>
          ))}
        </Stack>
      </Col>
      <Col label="Button">
        <Stack>
          {TYPES.map((type) => (
            <AlertBanner
              key={`b-${type}`}
              type={type}
              action={{ label: "Title" }}
              onDismiss={() => {}}
            >
              Alert banner message
            </AlertBanner>
          ))}
        </Stack>
      </Col>
      <Col label="Link + button">
        <Stack>
          {TYPES.map((type) => (
            <AlertBanner
              key={`lb-${type}`}
              type={type}
              cta={{ label: "this is a CTA" }}
              action={{ label: "Title" }}
              onDismiss={() => {}}
            >
              Alert banner message
            </AlertBanner>
          ))}
        </Stack>
      </Col>
    </div>
  ),
}
