import type { Meta, StoryObj } from "@storybook/react"
import { Breadcrumb, BreadcrumbItem } from "./Breadcrumb"

const meta = {
  title: "Components/Breadcrumb",
  component: Breadcrumb,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Breadcrumb shows the user\'s location in a hierarchy. Compose with `BreadcrumbItem` children — the last child is automatically marked as `current`. Use `<BreadcrumbItem variant="children" />` to render an overflow ellipsis when intermediate items are collapsed. Sourced from the TimeWorks Figma file (page "Breadcrumb", node 46939:90935).',
      },
    },
  },
  tags: ["autodocs"],
  args: {
    children: (
      <>
        <BreadcrumbItem href="#" icon="hexagon-image">
          Workspace
        </BreadcrumbItem>
        <BreadcrumbItem href="#">Projects</BreadcrumbItem>
        <BreadcrumbItem>Roadmap</BreadcrumbItem>
      </>
    ),
  },
} satisfies Meta<typeof Breadcrumb>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbItem href="#" icon="hexagon-image">
        Workspace
      </BreadcrumbItem>
      <BreadcrumbItem href="#">Projects</BreadcrumbItem>
      <BreadcrumbItem href="#">Acme rebrand</BreadcrumbItem>
      <BreadcrumbItem>Roadmap</BreadcrumbItem>
    </Breadcrumb>
  ),
}

export const WithOverflow: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbItem href="#" icon="hexagon-image">
        Workspace
      </BreadcrumbItem>
      <BreadcrumbItem variant="children" aria-label="More" href="#" />
      <BreadcrumbItem href="#">Acme rebrand</BreadcrumbItem>
      <BreadcrumbItem>Roadmap</BreadcrumbItem>
    </Breadcrumb>
  ),
}

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-center gap-8">
    <span className="w-32 text-t3 text-[var(--color-secondary-text-color)] uppercase tracking-wide">
      {label}
    </span>
    <div className="flex items-center gap-6">{children}</div>
  </div>
)

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <Row label="Default">
        <BreadcrumbItem href="#" icon="hexagon-image" hideSeparator>
          Workspace
        </BreadcrumbItem>
      </Row>
      <Row label="Current">
        <BreadcrumbItem icon="hexagon-image" current hideSeparator>
          Workspace
        </BreadcrumbItem>
      </Row>
      <Row label="Disabled">
        <BreadcrumbItem icon="hexagon-image" disabled hideSeparator>
          Workspace
        </BreadcrumbItem>
      </Row>
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <Row label="Default">
        <Breadcrumb>
          <BreadcrumbItem href="#" icon="hexagon-image">
            Workspace
          </BreadcrumbItem>
          <BreadcrumbItem>Roadmap</BreadcrumbItem>
        </Breadcrumb>
      </Row>
      <Row label="Children">
        <Breadcrumb>
          <BreadcrumbItem href="#" icon="hexagon-image">
            Workspace
          </BreadcrumbItem>
          <BreadcrumbItem variant="children" href="#" aria-label="More" />
          <BreadcrumbItem>Roadmap</BreadcrumbItem>
        </Breadcrumb>
      </Row>
    </div>
  ),
}
