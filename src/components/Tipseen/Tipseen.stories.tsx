import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { Steps } from "../Steps"
import { Link } from "../Link"
import { Tipseen, TipseenAction } from "./Tipseen"

const meta = {
  title: "Components/Tipseen",
  component: Tipseen,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Tipseen — virtual onboarding callout used to highlight features, walk users through a flow, or up-sell a product. Sourced from the TimeWorks Figma file (page "Tipseen", node 46939:7919). Two `type` palettes (inverted / primary), an optional directional pointer (`top` / `bottom` / `left` / `right`), an optional top media slot, and a footer slot for actions and a step indicator.',
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["inverted", "primary"],
    },
    pointerPosition: {
      control: "select",
      options: ["none", "top", "bottom", "left", "right"],
    },
    closeButtonColor: {
      control: "select",
      options: ["light", "dark"],
    },
    title: { control: "text" },
  },
  args: {
    type: "inverted",
    pointerPosition: "none",
    title: "This is a title",
    children: (
      <>
        Message will appear here, to give more information about the feature.{" "}
        <Link href="#" surface="inverted" size="sm">
          Read more
        </Link>
      </>
    ),
    onDismiss: () => {},
  },
} satisfies Meta<typeof Tipseen>

export default meta
type Story = StoryObj<typeof meta>

const SAMPLE_IMAGE =
  "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&q=80&auto=format&fit=crop"

const PlaceholderImage = () => (
  <div
    className="h-[145px] w-full"
    style={{
      background:
        "linear-gradient(135deg, var(--color-primary-selected-color) 0%, var(--color-primary-highlighted-color) 50%, var(--color-primary-color) 100%)",
    }}
    aria-hidden="true"
  />
)

const TwoActions = ({ stepperVisible = true }: { stepperVisible?: boolean }) => {
  const [step, setStep] = useState(2)
  return (
    <>
      <TipseenAction onClick={() => setStep((s) => Math.max(0, s - 1))}>Back</TipseenAction>
      {stepperVisible && (
        <Steps
          count={7}
          value={step}
          onValueChange={setStep}
          type="gallery-only"
          onColor="primary"
          aria-label="Tipseen progress"
          className="flex-1 justify-center"
        />
      )}
      <TipseenAction kind="primary" onClick={() => setStep((s) => Math.min(6, s + 1))}>
        Next
      </TipseenAction>
    </>
  )
}

const OneAction = () => <TipseenAction kind="primary">Got it</TipseenAction>

/* ─────────────────────────────  Playground  ────────────────────────────── */

export const Playground: Story = {
  args: {
    footer: <TwoActions />,
  },
}

/* ─────────────────────────────  Types  ─────────────────────────────────── */

const Row = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-wrap items-end gap-10">{children}</div>
)

const Cell = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-3">
    <span className="text-t3 text-[color:var(--color-secondary-text-color)] uppercase tracking-wide">
      {label}
    </span>
    {children}
  </div>
)

export const Types: Story = {
  render: () => (
    <div className="flex flex-col gap-12">
      <Cell label="Inverted">
        <Tipseen type="inverted" title="This is a title" onDismiss={() => {}} footer={<TwoActions />}>
          Message will appear here, to give more information about the feature.{" "}
          <Link href="#" surface="inverted" size="sm">
            Read more
          </Link>
        </Tipseen>
      </Cell>
      <Cell label="Primary">
        <Tipseen type="primary" title="This is a title" onDismiss={() => {}} footer={<TwoActions />}>
          Message will appear here, to give more information about the feature.{" "}
          <Link href="#" surface="inverted" size="sm">
            Read more
          </Link>
        </Tipseen>
      </Cell>
    </div>
  ),
}

/* ──────────────────────────  Pointer positions  ────────────────────────── */

export const PointerPositions: Story = {
  render: () => (
    <Row>
      {(["none", "top", "bottom", "left", "right"] as const).map((pos) => (
        <Cell key={pos} label={`pointer / ${pos}`}>
          <Tipseen
            type="inverted"
            pointerPosition={pos}
            title="This is a title"
            onDismiss={() => {}}
            footer={<TwoActions />}
          >
            Message will appear here, to give more information about the feature.{" "}
            <Link href="#" surface="inverted" size="sm">
              Read more
            </Link>
          </Tipseen>
        </Cell>
      ))}
    </Row>
  ),
}

/* ─────────────────────────────  With image  ────────────────────────────── */

export const WithImage: Story = {
  render: () => (
    <Row>
      <Cell label="Inverted · with image">
        <Tipseen
          type="inverted"
          pointerPosition="bottom"
          title="This is a title"
          image={
            <img
              src={SAMPLE_IMAGE}
              alt=""
              className="block h-[145px] w-full object-cover"
            />
          }
          onDismiss={() => {}}
          footer={<TwoActions />}
        >
          Message will appear here, to give more information about the feature.
        </Tipseen>
      </Cell>
      <Cell label="Primary · with placeholder">
        <Tipseen
          type="primary"
          pointerPosition="bottom"
          title="This is a title"
          image={<PlaceholderImage />}
          onDismiss={() => {}}
          footer={<TwoActions />}
        >
          Message will appear here, to give more information about the feature.
        </Tipseen>
      </Cell>
    </Row>
  ),
}

/* ─────────────────────────────  Footer types  ──────────────────────────── */

export const FooterTypes: Story = {
  render: () => (
    <Row>
      <Cell label="Stepper · 2 actions">
        <Tipseen type="inverted" title="This is a title" onDismiss={() => {}} footer={<TwoActions />}>
          Message will appear here, to give more information about the feature.
        </Tipseen>
      </Cell>
      <Cell label="One action">
        <Tipseen type="inverted" title="This is a title" onDismiss={() => {}} footer={<OneAction />}>
          Message will appear here, to give more information about the feature.
        </Tipseen>
      </Cell>
      <Cell label="Two actions (no stepper)">
        <Tipseen
          type="inverted"
          title="This is a title"
          onDismiss={() => {}}
          footer={<TwoActions stepperVisible={false} />}
        >
          Message will appear here, to give more information about the feature.
        </Tipseen>
      </Cell>
    </Row>
  ),
}

/* ─────────────────────────────  Variants matrix  ───────────────────────── */

export const VariantsMatrix: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex flex-col gap-12">
      {(["inverted", "primary"] as const).map((type) => (
        <div key={type} className="flex flex-col gap-4">
          <span className="text-t3 text-[color:var(--color-secondary-text-color)] uppercase tracking-wide">
            {type}
          </span>
          <Row>
            {(["none", "bottom", "top", "right", "left"] as const).map((pos) => (
              <Tipseen
                key={pos}
                type={type}
                pointerPosition={pos}
                title="This is a title"
                onDismiss={() => {}}
                footer={<TwoActions />}
              >
                Message will appear here, to give more information about the feature.
              </Tipseen>
            ))}
          </Row>
        </div>
      ))}
    </div>
  ),
}
