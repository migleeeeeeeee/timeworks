import type { Meta, StoryObj } from "@storybook/react"
import { Toast } from "./Toast"

const meta = {
  title: "Components/Toast",
  component: Toast,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          'Toast notifications surface short, timely feedback (confirmation of actions, alerts, errors). 48px-tall pill with intent color, leading icon, message, optional underlined link / outlined action button, and a dismiss icon. Sourced from the TimeWorks Figma file (page "Toast", node 46939:7920; component set 46949:39726). Visual unit only — wrap with `@radix-ui/react-toast` for queueing, auto-dismiss, and swipe behavior.',
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["primary", "negative", "positive", "warning", "dark"],
    },
    children: { control: "text" },
    loading: { control: "boolean" },
  },
  args: {
    type: "primary",
    children: "General message toast",
    cta: { label: "Link to action" },
    action: { label: "Button" },
    onDismiss: () => {},
  },
} satisfies Meta<typeof Toast>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

const TYPES = ["primary", "negative", "positive", "warning", "dark"] as const

const Stack = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col items-start gap-3">{children}</div>
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
        <Toast
          key={type}
          type={type}
          cta={{ label: "Link to action" }}
          action={{ label: "Button" }}
          onDismiss={() => {}}
        >
          General message toast
        </Toast>
      ))}
    </Stack>
  ),
}

export const ButtonOnly: Story = {
  render: () => (
    <Col label="Button only">
      <Stack>
        {TYPES.map((type) => (
          <Toast
            key={type}
            type={type}
            action={{ label: "Button" }}
            onDismiss={() => {}}
          >
            General message toast
          </Toast>
        ))}
      </Stack>
    </Col>
  ),
}

export const LinkOnly: Story = {
  render: () => (
    <Col label="Link only">
      <Stack>
        {TYPES.map((type) => (
          <Toast
            key={type}
            type={type}
            cta={{ label: "Link to action" }}
            onDismiss={() => {}}
          >
            General message toast
          </Toast>
        ))}
      </Stack>
    </Col>
  ),
}

export const MessageOnly: Story = {
  render: () => (
    <Col label="Message only">
      <Stack>
        {TYPES.map((type) => (
          <Toast key={type} type={type} onDismiss={() => {}}>
            General message toast
          </Toast>
        ))}
      </Stack>
    </Col>
  ),
}

export const Loader: Story = {
  render: () => (
    <Col label="Loading">
      <Stack>
        {TYPES.map((type) => (
          <Toast key={type} type={type} loading onDismiss={() => {}}>
            General message toast
          </Toast>
        ))}
      </Stack>
    </Col>
  ),
}

export const Matrix: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <Col label="Link + button">
        <Stack>
          {TYPES.map((type) => (
            <Toast
              key={`lb-${type}`}
              type={type}
              cta={{ label: "Link to action" }}
              action={{ label: "Button" }}
              onDismiss={() => {}}
            >
              General message toast
            </Toast>
          ))}
        </Stack>
      </Col>
      <Col label="Button only">
        <Stack>
          {TYPES.map((type) => (
            <Toast
              key={`b-${type}`}
              type={type}
              action={{ label: "Button" }}
              onDismiss={() => {}}
            >
              General message toast
            </Toast>
          ))}
        </Stack>
      </Col>
      <Col label="Link only">
        <Stack>
          {TYPES.map((type) => (
            <Toast
              key={`l-${type}`}
              type={type}
              cta={{ label: "Link to action" }}
              onDismiss={() => {}}
            >
              General message toast
            </Toast>
          ))}
        </Stack>
      </Col>
      <Col label="Message only">
        <Stack>
          {TYPES.map((type) => (
            <Toast key={`m-${type}`} type={type} onDismiss={() => {}}>
              General message toast
            </Toast>
          ))}
        </Stack>
      </Col>
      <Col label="Loading">
        <Stack>
          {TYPES.map((type) => (
            <Toast key={`load-${type}`} type={type} loading onDismiss={() => {}}>
              General message toast
            </Toast>
          ))}
        </Stack>
      </Col>
    </div>
  ),
}
