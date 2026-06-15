import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { Button } from "../Button"
import { Checkbox } from "../Checkbox"
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalMedia,
  ModalSideBySide,
  ModalTitle,
  ModalTrigger,
} from "./Modal"

const meta = {
  title: "Components/Modal",
  component: ModalContent,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Modal — built on `@radix-ui/react-dialog`. Provides three layout variants (basic, media, side-by-side) and three width sizes (small / medium / large) sourced from the TimeWorks Figma file (page "Modal", node 46939:7907). Compose with `Modal`, `ModalTrigger`, `ModalContent`, `ModalHeader`, `ModalBody`, `ModalFooter`, `ModalMedia`, and `ModalSideBySide`.',
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["small", "medium", "large"],
    },
  },
} satisfies Meta<typeof ModalContent>

export default meta
type Story = StoryObj<typeof meta>

const PlaceholderBody = ({ height = 176 }: { height?: number }) => (
  <div
    className="flex w-full items-center justify-center rounded-sm border border-dashed border-[var(--color-warning-color-hover)] bg-[var(--color-warning-color-selected)]"
    style={{ height }}
  >
    <div className="flex flex-1 items-center justify-center bg-[var(--color-warning-color)]">
      <span className="text-t2 text-[var(--color-primary-text-color)]">
        Replace me. <span className="underline">Slot for body content</span>
      </span>
    </div>
  </div>
)

const SAMPLE_IMAGE =
  "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&q=80&auto=format&fit=crop"

/* ─────────────────────────────  Playground  ────────────────────────────── */

export const Playground: Story = {
  args: {
    size: "medium",
    title: "Modal title",
    description: "Modal subtitle, can come with icon and link.",
  },
  render: (args) => (
    <Modal>
      <ModalTrigger asChild>
        <Button>Open modal</Button>
      </ModalTrigger>
      <ModalContent {...args}>
        <ModalBody>
          <PlaceholderBody />
        </ModalBody>
        <ModalFooter
          leftContent={<Checkbox>Don&rsquo;t show again</Checkbox>}
          rightContent={<Button kind="primary">Main CTA</Button>}
        />
      </ModalContent>
    </Modal>
  ),
}

/* ───────────────────────────────  Sizes  ───────────────────────────────── */

const SizeStory = ({ size }: { size: "small" | "medium" | "large" }) => (
  <Modal>
    <ModalTrigger asChild>
      <Button kind="secondary">Open {size}</Button>
    </ModalTrigger>
    <ModalContent
      size={size}
      title="Modal title"
      description="Modal subtitle, can come with icon and link."
    >
      <ModalBody>
        <PlaceholderBody height={size === "small" ? 96 : size === "medium" ? 159 : 256} />
      </ModalBody>
      <ModalFooter
        leftContent={size !== "small" ? <Checkbox>Don&rsquo;t show again</Checkbox> : undefined}
        rightContent={<Button kind="primary">Main CTA</Button>}
      />
    </ModalContent>
  </Modal>
)

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <SizeStory size="small" />
      <SizeStory size="medium" />
      <SizeStory size="large" />
    </div>
  ),
}

/* ───────────────────────────────  Variants  ────────────────────────────── */

export const Basic: Story = {
  render: () => (
    <Modal defaultOpen={false}>
      <ModalTrigger asChild>
        <Button>Basic modal</Button>
      </ModalTrigger>
      <ModalContent
        size="medium"
        title="Modal title"
        description="Modal subtitle, can come with icon and link."
      >
        <ModalBody>
          <PlaceholderBody />
        </ModalBody>
        <ModalFooter
          leftContent={<Checkbox>Don&rsquo;t show again</Checkbox>}
          rightContent={<Button kind="primary">Main CTA</Button>}
        />
      </ModalContent>
    </Modal>
  ),
}

export const Media: Story = {
  render: () => (
    <Modal>
      <ModalTrigger asChild>
        <Button>Media modal</Button>
      </ModalTrigger>
      <ModalContent size="medium">
        <ModalMedia src={SAMPLE_IMAGE} alt="" />
        <ModalHeader className="items-center text-center">
          <ModalTitle className="pr-0">Modal title</ModalTitle>
          <ModalDescription>
            For marketing modals all the content can be seen here as a longer subtitle text,
            the user can also add a <a className="text-[var(--color-link-color)] underline" href="#">link</a>.
          </ModalDescription>
        </ModalHeader>
        <ModalFooter
          leftContent={
            <Button kind="tertiary" className="-ml-3">
              Back
            </Button>
          }
          rightContent={<Button kind="primary">Main CTA</Button>}
        />
      </ModalContent>
    </Modal>
  ),
}

export const SideBySide: Story = {
  render: () => (
    <Modal>
      <ModalTrigger asChild>
        <Button>Side-by-side modal</Button>
      </ModalTrigger>
      <ModalContent size="large">
        <ModalSideBySide
          side={<ModalMedia src={SAMPLE_IMAGE} alt="" height="100%" />}
        >
          <ModalHeader>
            <ModalTitle>Modal title</ModalTitle>
            <ModalDescription>
              Modal subtitle, can come with icon and{" "}
              <a className="text-[var(--color-link-color)] underline" href="#">
                link
              </a>
              .
            </ModalDescription>
          </ModalHeader>
          <ModalBody>
            <PlaceholderBody height={256} />
          </ModalBody>
        </ModalSideBySide>
        <ModalFooter
          elevated
          leftContent={
            <Button kind="tertiary" className="-ml-3">
              Back
            </Button>
          }
          centerContent={
            <div className="flex items-center gap-2">
              <span className="flex size-2 items-center justify-center">
                <span className="size-2 rounded-full bg-[var(--color-primary-color)]" />
              </span>
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className="flex size-2 items-center justify-center"
                >
                  <span className="size-1.5 rounded-full bg-[var(--color-ui-border-color)]" />
                </span>
              ))}
            </div>
          }
          rightContent={<Button kind="primary">Main CTA</Button>}
        />
      </ModalContent>
    </Modal>
  ),
}

/* ───────────────────────────────  Scrollable  ──────────────────────────── */

export const Scrollable: Story = {
  render: () => (
    <Modal>
      <ModalTrigger asChild>
        <Button>Scrolling content</Button>
      </ModalTrigger>
      <ModalContent size="medium">
        <ModalHeader bordered>
          <ModalTitle>Modal title</ModalTitle>
          <ModalDescription>
            Modal subtitle, can come with icon and link.
          </ModalDescription>
        </ModalHeader>
        <ModalBody scrollable>
          {Array.from({ length: 12 }).map((_, i) => (
            <p key={i} className="text-t1 text-[var(--color-primary-text-color)] py-2">
              Long content paragraph {i + 1}. The header has a bottom border and the footer
              gets a subtle top shadow when the body scrolls.
            </p>
          ))}
        </ModalBody>
        <ModalFooter
          elevated
          leftContent={<Checkbox>Don&rsquo;t show again</Checkbox>}
          rightContent={<Button kind="primary">Main CTA</Button>}
        />
      </ModalContent>
    </Modal>
  ),
}

/* ───────────────────────────────  Controlled  ──────────────────────────── */

export const Controlled: Story = {
  render: () => {
    function Demo() {
      const [open, setOpen] = useState(false)
      return (
        <div className="flex items-center gap-3">
          <Button onClick={() => setOpen(true)}>Open via state</Button>
          <Modal open={open} onOpenChange={setOpen}>
            <ModalContent
              size="small"
              title="Confirm action"
              description="This is a controlled modal — open state lives in the parent."
            >
              <ModalBody>
                <p className="text-t1 text-[var(--color-primary-text-color)]">
                  Click outside, press Escape, or use the buttons below to dismiss.
                </p>
              </ModalBody>
              <ModalFooter
                rightContent={
                  <>
                    <Button kind="tertiary" onClick={() => setOpen(false)}>
                      Cancel
                    </Button>
                    <Button kind="primary" onClick={() => setOpen(false)}>
                      Confirm
                    </Button>
                  </>
                }
              />
            </ModalContent>
          </Modal>
        </div>
      )
    }
    return <Demo />
  },
}
