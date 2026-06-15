import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { Pagination } from "./Pagination"

const meta = {
  title: "Components/Pagination",
  component: Pagination,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Pagination control sourced from the TimeWorks Figma file (page "Design suggestions", node 25730:21781 — table footer). Custom-styled cells (no shared Button/IconButton) so the active page sits on a primary fill while siblings stay flat. Each cell is a real `<button>` inside a `<nav aria-label="Pagination">` landmark.',
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    page: { control: { type: "number", min: 1, max: 99 } },
    totalPages: { control: { type: "number", min: 1, max: 99 } },
    siblingCount: { control: { type: "number", min: 0, max: 3 } },
    boundaryCount: { control: { type: "number", min: 0, max: 3 } },
    size: { control: "radio", options: ["sm", "md"] },
    hideArrows: { control: "boolean" },
  },
  args: {
    page: 1,
    totalPages: 10,
    siblingCount: 1,
    boundaryCount: 1,
    size: "md",
    hideArrows: false,
  },
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof meta>

const Cell = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-2">
    <span className="text-t3 text-[var(--color-secondary-text-color)] uppercase tracking-wide">
      {label}
    </span>
    {children}
  </div>
)

export const Default: Story = {
  render: (args) => {
    const [page, setPage] = useState(args.page)
    return <Pagination {...args} page={page} onPageChange={setPage} />
  },
}

export const Variants: Story = {
  render: () => {
    const [a, setA] = useState(3)
    const [b, setB] = useState(5)
    const [c, setC] = useState(1)
    return (
      <div className="flex flex-col gap-6">
        <Cell label="Few pages — no ellipses">
          <Pagination page={a} totalPages={4} onPageChange={setA} />
        </Cell>
        <Cell label="Many pages — both ellipses">
          <Pagination page={b} totalPages={20} onPageChange={setB} />
        </Cell>
        <Cell label="Single page — arrows disabled">
          <Pagination page={c} totalPages={1} onPageChange={setC} />
        </Cell>
      </div>
    )
  },
}

export const Sizes: Story = {
  render: () => {
    const [a, setA] = useState(3)
    const [b, setB] = useState(3)
    return (
      <div className="flex flex-col gap-6">
        <Cell label="Medium (default)">
          <Pagination size="md" page={a} totalPages={10} onPageChange={setA} />
        </Cell>
        <Cell label="Small">
          <Pagination size="sm" page={b} totalPages={10} onPageChange={setB} />
        </Cell>
      </div>
    )
  },
}

export const States: Story = {
  render: () => {
    const [a, setA] = useState(1)
    const [b, setB] = useState(5)
    const [c, setC] = useState(10)
    return (
      <div className="flex flex-col gap-6">
        <Cell label="At start — previous disabled">
          <Pagination page={a} totalPages={10} onPageChange={setA} />
        </Cell>
        <Cell label="Middle — both arrows active, both ellipses">
          <Pagination page={b} totalPages={10} onPageChange={setB} />
        </Cell>
        <Cell label="At end — next disabled">
          <Pagination page={c} totalPages={10} onPageChange={setC} />
        </Cell>
      </div>
    )
  },
}

export const InTableFooter: Story = {
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "Approximation of the original Figma context — total-count text on the left, Pagination centered, page-size hint on the right. Demonstrates how the component composes inside a table footer.",
      },
    },
  },
  render: () => {
    const [page, setPage] = useState(1)
    return (
      <div className="flex w-full items-center justify-between gap-6">
        <span className="text-t2 text-[var(--color-secondary-text-color)]">
          Total Employees shown: 300
        </span>
        <Pagination page={page} totalPages={10} onPageChange={setPage} />
        <span className="text-t2 text-[var(--color-secondary-text-color)]">
          Show per page: 10
        </span>
      </div>
    )
  },
}

export const Playground: Story = {
  render: (args) => {
    const [page, setPage] = useState(args.page)
    return <Pagination {...args} page={page} onPageChange={setPage} />
  },
}
