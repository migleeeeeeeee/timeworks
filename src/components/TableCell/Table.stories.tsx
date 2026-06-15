import type { Meta, StoryObj } from "@storybook/react"
import { Table } from "./Table"
import { TableCell } from "./TableCell"
import { TableHeaderCell } from "./TableHeaderCell"
import { TableColumn } from "./TableColumn"
import { TableColumnLoader } from "./TableColumnLoader"
import { Avatar } from "../Avatar"
import { Checkbox } from "../Checkbox"
import { Chip } from "../Chip"
import { IconButton } from "../IconButton"
import { LinearProgressBar } from "../LinearProgressBar"

const meta = {
  title: "Components/Table",
  component: Table,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          'Composed table wrapper. Lays a row of `<TableColumn>` (or `<TableColumnLoader>`) children inside a bordered radius shell, and propagates a default `size` (`sm` | `md` | `lg`) via context so descendant cells inherit it. Sourced from the TimeWorks Figma file (page "Table", showcase node 46939:7915, "Use Case" frame).',
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    bordered: { control: "boolean" },
    size: { control: "radio", options: ["sm", "md", "lg"] },
  },
  args: {
    bordered: true,
    size: "md",
  },
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

const TASKS = [
  { id: 1, name: "Audit Q4 invoices", owner: ["RM", "Riley M."], status: ["warning-subtle", "In review"], progress: 30 },
  { id: 2, name: "Update onboarding", owner: ["AK", "Avery K."], status: ["positive-subtle", "Done"], progress: 100 },
  { id: 3, name: "Migrate auth flow", owner: ["JL", "Jordan L."], status: ["negative-subtle", "Blocked"], progress: 60 },
  { id: 4, name: "Refresh design tokens", owner: ["SP", "Sam P."], status: ["primary-subtle", "Active"], progress: 45 },
  { id: 5, name: "Plan offsite agenda", owner: ["KT", "Kira T."], status: ["primary-subtle", "Active"], progress: 12 },
  { id: 6, name: "Cut release branch", owner: ["DH", "Dani H."], status: ["positive-subtle", "Done"], progress: 100 },
] as const

function ContentColumns() {
  return (
    <>
      <TableColumn width={40}>
        <TableCell variant="control">
          <Checkbox aria-label="Select all" />
        </TableCell>
        {TASKS.map((row) => (
          <TableCell key={row.id} variant="control">
            <Checkbox aria-label={`Select ${row.name}`} />
          </TableCell>
        ))}
      </TableColumn>
      <TableColumn width={228}>
        <TableHeaderCell sortDirection="asc">Task</TableHeaderCell>
        {TASKS.map((row) => (
          <TableCell key={row.id}>
            <span className="flex-1 truncate">{row.name}</span>
          </TableCell>
        ))}
      </TableColumn>
      <TableColumn width={180}>
        <TableHeaderCell iconBefore="user">Owner</TableHeaderCell>
        {TASKS.map((row) => (
          <TableCell key={row.id}>
            <Avatar size="sm" type="initials" initials={row.owner[0]} />
            <span className="flex-1 truncate">{row.owner[1]}</span>
          </TableCell>
        ))}
      </TableColumn>
      <TableColumn width={128}>
        <TableHeaderCell>Status</TableHeaderCell>
        {TASKS.map((row) => (
          <TableCell key={row.id}>
            <Chip type={row.status[0]}>{row.status[1]}</Chip>
          </TableCell>
        ))}
      </TableColumn>
      <TableColumn width={180}>
        <TableHeaderCell>Progress</TableHeaderCell>
        {TASKS.map((row) => (
          <TableCell key={row.id}>
            <LinearProgressBar
              size="sm"
              type={row.progress >= 100 ? "positive" : row.progress < 30 ? "negative" : "primary"}
              value={row.progress}
              showLabel
              className="flex-1"
            />
          </TableCell>
        ))}
      </TableColumn>
      <TableColumn width={40}>
        <TableCell variant="control" border={false} />
        {TASKS.map((row) => (
          <TableCell key={row.id} variant="control" border={false}>
            <IconButton
              icon="ellipsis-vertical"
              size="xs"
              kind="tertiary"
              aria-label={`Actions for ${row.name}`}
            />
          </TableCell>
        ))}
      </TableColumn>
    </>
  )
}

export const Playground: Story = {
  render: (args) => (
    <Table {...args}>
      <ContentColumns />
    </Table>
  ),
}

export const Bordered: Story = {
  name: "Use Case · Bordered",
  args: { bordered: true, size: "md" },
  render: (args) => (
    <Table {...args}>
      <ContentColumns />
    </Table>
  ),
}

export const Borderless: Story = {
  name: "Use Case · No border",
  args: { bordered: false, size: "md" },
  render: (args) => (
    <Table {...args}>
      <ContentColumns />
    </Table>
  ),
}

export const SizeSmall: Story = {
  name: "Size · Small (32)",
  args: { size: "sm" },
  render: (args) => (
    <Table {...args}>
      <ContentColumns />
    </Table>
  ),
}

export const SizeMedium: Story = {
  name: "Size · Medium (40)",
  args: { size: "md" },
  render: (args) => (
    <Table {...args}>
      <ContentColumns />
    </Table>
  ),
}

export const SizeLarge: Story = {
  name: "Size · Large (48)",
  args: { size: "lg" },
  render: (args) => (
    <Table {...args}>
      <ContentColumns />
    </Table>
  ),
}

export const States: Story = {
  name: "States · Default · Hover · Selected",
  render: () => (
    <Table size="md">
      <TableColumn width={40}>
        <TableCell variant="control">
          <Checkbox aria-label="Select all" />
        </TableCell>
        <TableCell variant="control">
          <Checkbox aria-label="Select row 1" />
        </TableCell>
        <TableCell variant="control" state="hover">
          <Checkbox aria-label="Select row 2" />
        </TableCell>
        <TableCell variant="control" state="selected">
          <Checkbox checked aria-label="Select row 3" />
        </TableCell>
        <TableCell variant="control" state="selected-hover">
          <Checkbox checked aria-label="Select row 4" />
        </TableCell>
      </TableColumn>
      <TableColumn width={228}>
        <TableHeaderCell sortDirection="asc">Task</TableHeaderCell>
        <TableCell>
          <span className="flex-1 truncate">Default</span>
        </TableCell>
        <TableCell state="hover">
          <span className="flex-1 truncate">Hover</span>
        </TableCell>
        <TableCell state="selected">
          <span className="flex-1 truncate">Selected</span>
        </TableCell>
        <TableCell state="selected-hover">
          <span className="flex-1 truncate">Selected · Hover</span>
        </TableCell>
      </TableColumn>
      <TableColumn width={128}>
        <TableHeaderCell>Status</TableHeaderCell>
        <TableCell>
          <Chip type="primary-subtle">Active</Chip>
        </TableCell>
        <TableCell state="hover">
          <Chip type="primary-subtle">Active</Chip>
        </TableCell>
        <TableCell state="selected">
          <Chip type="positive-subtle">Done</Chip>
        </TableCell>
        <TableCell state="selected-hover">
          <Chip type="positive-subtle">Done</Chip>
        </TableCell>
      </TableColumn>
    </Table>
  ),
}

export const Loading: Story = {
  name: "Loading · Skeleton columns",
  render: () => (
    <Table size="md">
      <TableColumnLoader
        width={228}
        shape="text"
        rows={8}
        header={<TableHeaderCell sortDirection="asc">Placeholder for text</TableHeaderCell>}
      />
      <TableColumnLoader
        width={112}
        shape="rectangle"
        rows={8}
        header={<TableHeaderCell>Pla...</TableHeaderCell>}
      />
      <TableColumnLoader
        width={112}
        shape="circle"
        rows={8}
        header={<TableHeaderCell>Pla...</TableHeaderCell>}
      />
      <TableColumnLoader
        width={112}
        shape="square"
        rows={8}
        header={<TableHeaderCell>Pla...</TableHeaderCell>}
      />
    </Table>
  ),
}
