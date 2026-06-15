import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { TableFooter } from "./TableFooter"

const meta = {
  title: "Components/TableFooter",
  component: TableFooter,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          'Three-region table footer sourced from the TimeWorks Figma file (page "Design suggestions", node 25730:21781). Composes Pagination + Dropdown with a count caption. Each region is independently hideable; the row stays accessible as a `<footer aria-label="…">` landmark.',
      },
    },
  },
  tags: ["autodocs"],
  args: {
    totalCount: 300,
    totalLabel: "Total Employees shown",
    page: 1,
    totalPages: 10,
    pageSize: 10,
    pageSizeOptions: [10, 25, 50, 100],
    siblingCount: 1,
    boundaryCount: 1,
  },
  argTypes: {
    page: { control: { type: "number", min: 1, max: 99 } },
    totalPages: { control: { type: "number", min: 1, max: 99 } },
    pageSize: { control: { type: "number", min: 1, max: 1000 } },
    totalCount: { control: { type: "number", min: 0, max: 100000 } },
    siblingCount: { control: { type: "number", min: 0, max: 3 } },
    boundaryCount: { control: { type: "number", min: 0, max: 3 } },
    hideTotal: { control: "boolean" },
    hidePagination: { control: "boolean" },
    hidePageSize: { control: "boolean" },
  },
} satisfies Meta<typeof TableFooter>

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
    const [page, setPage] = useState(args.page!)
    const [pageSize, setPageSize] = useState(args.pageSize!)
    return (
      <TableFooter
        {...args}
        page={page}
        onPageChange={setPage}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
      />
    )
  },
}

export const Variants: Story = {
  render: (args) => {
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    return (
      <div className="flex flex-col gap-8">
        <Cell label="Full (count + pagination + page size)">
          <TableFooter
            {...args}
            page={page}
            onPageChange={setPage}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
          />
        </Cell>
        <Cell label="Without page size">
          <TableFooter {...args} hidePageSize page={page} onPageChange={setPage} />
        </Cell>
        <Cell label="Without count">
          <TableFooter
            {...args}
            hideTotal
            page={page}
            onPageChange={setPage}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
          />
        </Cell>
        <Cell label="Pagination only">
          <TableFooter {...args} hideTotal hidePageSize page={page} onPageChange={setPage} />
        </Cell>
      </div>
    )
  },
}

export const States: Story = {
  render: (args) => {
    const [pA, setPA] = useState(1)
    const [pB, setPB] = useState(5)
    const [pC, setPC] = useState(10)
    return (
      <div className="flex flex-col gap-8">
        <Cell label="At first page">
          <TableFooter {...args} page={pA} onPageChange={setPA} pageSize={10} onPageSizeChange={() => {}} />
        </Cell>
        <Cell label="Middle page (both ellipses visible)">
          <TableFooter
            {...args}
            page={pB}
            totalPages={20}
            onPageChange={setPB}
            pageSize={25}
            onPageSizeChange={() => {}}
          />
        </Cell>
        <Cell label="At last page">
          <TableFooter {...args} page={pC} onPageChange={setPC} pageSize={10} onPageSizeChange={() => {}} />
        </Cell>
        <Cell label="Single page (arrows disabled)">
          <TableFooter
            {...args}
            page={1}
            totalPages={1}
            totalCount={5}
            pageSize={10}
            onPageSizeChange={() => {}}
          />
        </Cell>
      </div>
    )
  },
}

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "TableFooter inherits the Pagination size axis. Render at the table-row scale you need.",
      },
    },
  },
  render: (args) => {
    const [page, setPage] = useState(3)
    const [pageSize, setPageSize] = useState(10)
    return (
      <div className="flex flex-col gap-8">
        <Cell label="Default">
          <TableFooter
            {...args}
            page={page}
            onPageChange={setPage}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
          />
        </Cell>
      </div>
    )
  },
}

export const Playground: Story = {
  render: (args) => {
    const [page, setPage] = useState(args.page!)
    const [pageSize, setPageSize] = useState(args.pageSize!)
    return (
      <TableFooter
        {...args}
        page={page}
        onPageChange={setPage}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
      />
    )
  },
}
