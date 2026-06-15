import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { TableCell } from "./TableCell"
import { TableHeaderCell } from "./TableHeaderCell"
import { Avatar } from "../Avatar"
import { AvatarGroup } from "../AvatarGroup"
import { Checkbox } from "../Checkbox"
import { Chip } from "../Chip"
import { EditableText } from "../EditableText"
import { Icon } from "../Icon"
import { IconButton } from "../IconButton"
import { Label } from "../Label"
import { LinearProgressBar } from "../LinearProgressBar"
import { Text } from "../Text"

const SIZES = ["sm", "md", "lg"] as const
const STATES = ["default", "hover", "selected", "selected-hover"] as const

const meta = {
  title: "Components/TableCell",
  component: TableCell,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          'Structural shell for a row in a data table. Sourced from the TimeWorks Figma file (page "Table / Cell", node 46949:11817). Compose any content inside — text, icons, chips, labels, avatars, progress bars, editable inputs. Use `<TableHeaderCell>` for column titles. Three sizes (sm 32 / md 40 / lg 48), four states (default / hover / selected / selected-hover), and a `control` variant for square menu/select cells.',
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: { control: "radio", options: SIZES },
    state: { control: "select", options: STATES },
    variant: { control: "radio", options: ["content", "control"] },
    interactive: { control: "boolean" },
    border: { control: "boolean" },
  },
  args: {
    size: "md",
    state: "default",
    variant: "content",
    interactive: false,
    border: true,
    children: "Placeholder for text",
  },
} satisfies Meta<typeof TableCell>

export default meta
type Story = StoryObj<typeof meta>

const ColumnLabel = ({ children }: { children: React.ReactNode }) => (
  <Text
    variant="t3"
    className="text-[var(--color-secondary-text-color)] uppercase tracking-wide mb-1"
  >
    {children}
  </Text>
)

const Column = ({
  label,
  children,
}: {
  label: React.ReactNode
  children: React.ReactNode
}) => (
  <div className="w-[200px]">
    <ColumnLabel>{label}</ColumnLabel>
    <div className="border-t border-[var(--color-layout-border-color)]">
      {children}
    </div>
  </div>
)

export const Playground: Story = {}

export const States: Story = {
  render: () => (
    <div className="flex gap-6">
      {STATES.map((state) => (
        <Column key={state} label={state}>
          <TableCell state={state}>Placeholder for text</TableCell>
        </Column>
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex gap-6">
      {SIZES.map((size) => (
        <Column key={size} label={`size = ${size}`}>
          <TableCell size={size}>Placeholder for text</TableCell>
        </Column>
      ))}
    </div>
  ),
}

export const Text_: Story = {
  name: "Type · Text",
  render: () => (
    <div className="flex gap-6">
      <Column label="Plain">
        <TableCell>Placeholder for text</TableCell>
        <TableCell>Riley M.</TableCell>
        <TableCell>—</TableCell>
      </Column>
      <Column label="Long / truncated">
        <TableCell>
          <span className="truncate">A very long string that should clip with ellipsis</span>
        </TableCell>
      </Column>
    </div>
  ),
}

export const TextWithIcons: Story = {
  name: "Type · Text + Icons",
  render: () => (
    <div className="flex gap-6">
      <Column label="Leading icon">
        <TableCell>
          <Icon name="user" size="xs" aria-hidden />
          <span className="flex-1 truncate">Owner</span>
        </TableCell>
      </Column>
      <Column label="Trailing icon">
        <TableCell>
          <span className="flex-1 truncate">Status</span>
          <Icon name="circle-info" size="xs" aria-hidden />
        </TableCell>
      </Column>
      <Column label="Both">
        <TableCell>
          <Icon name="user" size="xs" aria-hidden />
          <span className="flex-1 truncate">Riley M.</span>
          <Icon name="circle-info" size="xs" aria-hidden />
        </TableCell>
      </Column>
    </div>
  ),
}

export const Editable: Story = {
  name: "Type · Editable cell",
  render: () => (
    <Column label="Editable cell">
      <TableCell>
        <EditableText
          variant="t2"
          weight="regular"
          defaultValue="Editable cell"
          className="flex-1"
        />
      </TableCell>
    </Column>
  ),
}

export const LabelCell: Story = {
  name: "Type · Label",
  render: () => (
    <div className="flex gap-6">
      <Column label="Label · fill">
        <TableCell>
          <Label color="primary">Label</Label>
        </TableCell>
      </Column>
      <Column label="Label · positive">
        <TableCell>
          <Label color="positive">Active</Label>
        </TableCell>
      </Column>
    </div>
  ),
}

export const ChipCell: Story = {
  name: "Type · Chip",
  render: () => (
    <div className="flex gap-6">
      <Column label="Chip">
        <TableCell>
          <Chip type="primary-subtle">This is a chip</Chip>
        </TableCell>
      </Column>
      <Column label="Chip · positive">
        <TableCell>
          <Chip type="positive-subtle">Done</Chip>
        </TableCell>
      </Column>
    </div>
  ),
}

export const AvatarCell: Story = {
  name: "Type · Avatar",
  render: () => (
    <div className="flex gap-6">
      <Column label="Avatar">
        <TableCell>
          <Avatar size="sm" type="initials" initials="RM" />
        </TableCell>
      </Column>
      <Column label="Avatar + Text">
        <TableCell>
          <Avatar size="sm" type="initials" initials="RM" />
          <span className="flex-1 truncate">Riley M.</span>
        </TableCell>
      </Column>
      <Column label="Avatar group">
        <TableCell>
          <AvatarGroup size="sm" max={3}>
            <Avatar size="sm" type="initials" initials="AB" />
            <Avatar size="sm" type="initials" initials="CD" />
            <Avatar size="sm" type="initials" initials="EF" />
            <Avatar size="sm" type="initials" initials="GH" />
            <Avatar size="sm" type="initials" initials="IJ" />
          </AvatarGroup>
        </TableCell>
      </Column>
    </div>
  ),
}

export const ProgressBarCell: Story = {
  name: "Type · Progress bar",
  render: () => (
    <div className="flex gap-6">
      <Column label="Primary 30%">
        <TableCell>
          <LinearProgressBar
            size="sm"
            type="primary"
            value={30}
            showLabel
            className="flex-1"
          />
        </TableCell>
      </Column>
      <Column label="Positive 72%">
        <TableCell>
          <LinearProgressBar
            size="sm"
            type="positive"
            value={72}
            showLabel
            className="flex-1"
          />
        </TableCell>
      </Column>
    </div>
  ),
}

export const ControlCells: Story = {
  name: "Type · Control (Menu / Select)",
  render: () => (
    <div className="flex items-start gap-6">
      <div>
        <ColumnLabel>Selectable</ColumnLabel>
        <div className="border-t border-[var(--color-layout-border-color)] inline-block">
          <TableCell variant="control">
            <Checkbox aria-label="Select row" />
          </TableCell>
        </div>
      </div>
      <div>
        <ColumnLabel>MenuButton</ColumnLabel>
        <div className="border-t border-[var(--color-layout-border-color)] inline-block">
          <TableCell variant="control">
            <IconButton
              icon="ellipsis-vertical"
              size="sm"
              kind="tertiary"
              aria-label="Row actions"
            />
          </TableCell>
        </div>
      </div>
    </div>
  ),
}

export const ColumnTitles: Story = {
  name: "Type · ColumnTitle (header)",
  render: () => (
    <div className="flex gap-6">
      <Column label="Plain">
        <TableHeaderCell>Owner</TableHeaderCell>
      </Column>
      <Column label="With icon + sort">
        <TableHeaderCell iconBefore="user" sortDirection="asc">
          Assignee
        </TableHeaderCell>
      </Column>
      <Column label="With menu">
        <TableHeaderCell onMenuClick={() => undefined}>Status</TableHeaderCell>
      </Column>
    </div>
  ),
}

const ROWS = [
  { id: 1, name: "Audit Q4 invoices",  owner: "Riley M.", status: "In review", progress: 30 },
  { id: 2, name: "Update onboarding",  owner: "Avery K.", status: "Done",      progress: 100 },
  { id: 3, name: "Migrate auth flow",  owner: "Jordan L.", status: "Blocked",  progress: 60 },
  { id: 4, name: "Refresh design tokens", owner: "Sam P.", status: "Active",   progress: 45 },
] as const

export const FullTable: Story = {
  name: "Composed · Full table",
  render: () => {
    const [selected, setSelected] = useState<number | null>(2)
    return (
      <div
        role="table"
        className="inline-grid grid-cols-[40px_60px_1fr_180px_140px_180px_40px] border border-[var(--color-layout-border-color)] rounded-md overflow-hidden"
      >
        {/* Header row */}
        <TableCell variant="control" border>
          <Checkbox aria-label="Select all" />
        </TableCell>
        <TableHeaderCell>#</TableHeaderCell>
        <TableHeaderCell sortDirection="asc">Task</TableHeaderCell>
        <TableHeaderCell iconBefore="user">Owner</TableHeaderCell>
        <TableHeaderCell>Status</TableHeaderCell>
        <TableHeaderCell>Progress</TableHeaderCell>
        <TableHeaderCell onMenuClick={() => undefined}>{""}</TableHeaderCell>

        {/* Body rows */}
        {ROWS.map((row) => {
          const state = selected === row.id ? "selected" : "default"
          return (
            <RowFragment
              key={row.id}
              row={row}
              state={state}
              onSelect={() =>
                setSelected((current) => (current === row.id ? null : row.id))
              }
            />
          )
        })}
      </div>
    )
  },
}

function RowFragment({
  row,
  state,
  onSelect,
}: {
  row: (typeof ROWS)[number]
  state: "default" | "selected"
  onSelect: () => void
}) {
  const statusColor =
    row.status === "Done"
      ? ("positive-subtle" as const)
      : row.status === "Blocked"
      ? ("negative-subtle" as const)
      : row.status === "Active"
      ? ("primary-subtle" as const)
      : ("warning-subtle" as const)

  return (
    <>
      <TableCell variant="control" state={state} interactive>
        <Checkbox
          checked={state === "selected"}
          onCheckedChange={onSelect}
          aria-label={`Select ${row.name}`}
        />
      </TableCell>
      <TableCell state={state} interactive>
        <span className="text-[var(--color-secondary-text-color)]">{row.id}</span>
      </TableCell>
      <TableCell state={state} interactive>
        <span className="flex-1 truncate">{row.name}</span>
      </TableCell>
      <TableCell state={state} interactive>
        <Avatar size="sm" type="initials" initials={initialsOf(row.owner)} />
        <span className="flex-1 truncate">{row.owner}</span>
      </TableCell>
      <TableCell state={state} interactive>
        <Chip type={statusColor}>{row.status}</Chip>
      </TableCell>
      <TableCell state={state} interactive>
        <LinearProgressBar
          size="sm"
          type={statusColor === "negative-subtle" ? "negative" : "primary"}
          value={row.progress}
          showLabel
          className="flex-1"
        />
      </TableCell>
      <TableCell variant="control" state={state} interactive>
        <IconButton
          icon="ellipsis-vertical"
          size="sm"
          kind="tertiary"
          aria-label={`Actions for ${row.name}`}
        />
      </TableCell>
    </>
  )
}

function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase()
}
