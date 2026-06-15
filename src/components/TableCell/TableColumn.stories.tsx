import type { Meta, StoryObj } from "@storybook/react"
import { TableColumn } from "./TableColumn"
import { TableColumnLoader } from "./TableColumnLoader"
import { TableCell } from "./TableCell"
import { TableHeaderCell } from "./TableHeaderCell"
import { Avatar } from "../Avatar"
import { AvatarGroup } from "../AvatarGroup"
import { Checkbox } from "../Checkbox"
import { Chip } from "../Chip"
import { EditableText } from "../EditableText"
import { IconButton } from "../IconButton"
import { Label } from "../Label"
import { LinearProgressBar } from "../LinearProgressBar"

const meta = {
  title: "Components/TableColumn",
  component: TableColumn,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          'Vertical stack of table cells. Compose with `<TableHeaderCell>` and `<TableCell>` directly. Sourced from the TimeWorks Figma file (page "Table / ColumnContent", node 46949:12272). The loader counterpart, `<TableColumnLoader>`, mirrors the same shell with skeleton placeholders.',
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TableColumn>

export default meta
type Story = StoryObj<typeof meta>

const TEXT_ROWS = [
  "Audit Q4 invoices",
  "Update onboarding",
  "Migrate auth flow",
  "Refresh design tokens",
  "Plan offsite agenda",
  "Cut release branch",
]

export const TextColumn: Story = {
  name: "Type · Text",
  render: () => (
    <TableColumn width={228} className="border border-[var(--color-layout-border-color)] rounded-md overflow-hidden">
      <TableHeaderCell sortDirection="asc">Task</TableHeaderCell>
      {TEXT_ROWS.map((label) => (
        <TableCell key={label}>
          <span className="flex-1 truncate">{label}</span>
        </TableCell>
      ))}
    </TableColumn>
  ),
}

export const ChipColumn: Story = {
  name: "Type · Chip",
  render: () => (
    <TableColumn width={128} className="border border-[var(--color-layout-border-color)] rounded-md overflow-hidden">
      <TableHeaderCell>Status</TableHeaderCell>
      <TableCell><Chip type="primary-subtle">Active</Chip></TableCell>
      <TableCell><Chip type="positive-subtle">Done</Chip></TableCell>
      <TableCell><Chip type="warning-subtle">In review</Chip></TableCell>
      <TableCell><Chip type="negative-subtle">Blocked</Chip></TableCell>
      <TableCell><Chip type="primary-subtle">Active</Chip></TableCell>
      <TableCell><Chip type="positive-subtle">Done</Chip></TableCell>
    </TableColumn>
  ),
}

export const LabelColumn: Story = {
  name: "Type · Label",
  render: () => (
    <TableColumn width={128} className="border border-[var(--color-layout-border-color)] rounded-md overflow-hidden">
      <TableHeaderCell>Tier</TableHeaderCell>
      <TableCell><Label color="primary">Pro</Label></TableCell>
      <TableCell><Label color="positive">Enterprise</Label></TableCell>
      <TableCell><Label>Free</Label></TableCell>
      <TableCell><Label color="negative">Trial</Label></TableCell>
      <TableCell><Label color="primary">Pro</Label></TableCell>
    </TableColumn>
  ),
}

export const AvatarTextColumn: Story = {
  name: "Type · Avatar + Text",
  render: () => (
    <TableColumn width={180} className="border border-[var(--color-layout-border-color)] rounded-md overflow-hidden">
      <TableHeaderCell iconBefore="user">Owner</TableHeaderCell>
      {[
        ["RM", "Riley M."],
        ["AK", "Avery K."],
        ["JL", "Jordan L."],
        ["SP", "Sam P."],
        ["KT", "Kira T."],
      ].map(([initials, name]) => (
        <TableCell key={name}>
          <Avatar size="sm" type="initials" initials={initials!} />
          <span className="flex-1 truncate">{name}</span>
        </TableCell>
      ))}
    </TableColumn>
  ),
}

export const AvatarGroupColumn: Story = {
  name: "Type · Avatar group",
  render: () => (
    <TableColumn width={128} className="border border-[var(--color-layout-border-color)] rounded-md overflow-hidden">
      <TableHeaderCell>Reviewers</TableHeaderCell>
      {[3, 5, 8, 4, 12].map((n, i) => (
        <TableCell key={i}>
          <AvatarGroup size="sm" max={3}>
            {Array.from({ length: n }).map((_, idx) => (
              <Avatar
                key={idx}
                size="sm"
                type="initials"
                initials={`U${idx + 1}`}
              />
            ))}
          </AvatarGroup>
        </TableCell>
      ))}
    </TableColumn>
  ),
}

export const EditableColumn: Story = {
  name: "Type · Editable cell",
  render: () => (
    <TableColumn width={180} className="border border-[var(--color-layout-border-color)] rounded-md overflow-hidden">
      <TableHeaderCell>Note</TableHeaderCell>
      {["Editable cell", "Click to edit", "Some note", "Another note"].map((value, i) => (
        <TableCell key={i}>
          <EditableText
            variant="t2"
            weight="regular"
            defaultValue={value}
            className="flex-1"
          />
        </TableCell>
      ))}
    </TableColumn>
  ),
}

export const ProgressColumn: Story = {
  name: "Type · Progress bar",
  render: () => (
    <TableColumn width={180} className="border border-[var(--color-layout-border-color)] rounded-md overflow-hidden">
      <TableHeaderCell>Progress</TableHeaderCell>
      {[30, 100, 45, 60, 12].map((value, i) => (
        <TableCell key={i}>
          <LinearProgressBar
            size="sm"
            type={value >= 100 ? "positive" : value < 20 ? "negative" : "primary"}
            value={value}
            showLabel
            className="flex-1"
          />
        </TableCell>
      ))}
    </TableColumn>
  ),
}

export const ControlColumns: Story = {
  name: "Type · Selectable + Menu",
  render: () => (
    <div className="flex gap-4">
      <TableColumn width={40} className="border border-[var(--color-layout-border-color)] rounded-md overflow-hidden">
        <TableCell variant="control">
          <Checkbox aria-label="Select all" />
        </TableCell>
        {Array.from({ length: 6 }).map((_, i) => (
          <TableCell key={i} variant="control">
            <Checkbox aria-label={`Select row ${i + 1}`} />
          </TableCell>
        ))}
      </TableColumn>

      <TableColumn width={40} className="border border-[var(--color-layout-border-color)] rounded-md overflow-hidden">
        <TableCell variant="control" border={false} />
        {Array.from({ length: 6 }).map((_, i) => (
          <TableCell key={i} variant="control" border={false}>
            <IconButton
              icon="ellipsis-vertical"
              size="xs"
              kind="tertiary"
              aria-label={`Actions for row ${i + 1}`}
            />
          </TableCell>
        ))}
      </TableColumn>
    </div>
  ),
}

export const ColumnLoader_Text: Story = {
  name: "Loader · Text",
  render: () => (
    <TableColumnLoader
      width={228}
      shape="text"
      rows={20}
      header={<TableHeaderCell sortDirection="asc">Placeholder for text</TableHeaderCell>}
      className="border border-[var(--color-layout-border-color)] rounded-md overflow-hidden"
    />
  ),
}

export const ColumnLoader_Rectangle: Story = {
  name: "Loader · Rectangle",
  render: () => (
    <TableColumnLoader
      width={112}
      shape="rectangle"
      rows={20}
      header={<TableHeaderCell>Pla...</TableHeaderCell>}
      className="border border-[var(--color-layout-border-color)] rounded-md overflow-hidden"
    />
  ),
}

export const ColumnLoader_Circle: Story = {
  name: "Loader · Circle",
  render: () => (
    <TableColumnLoader
      width={112}
      shape="circle"
      rows={20}
      header={<TableHeaderCell>Pla...</TableHeaderCell>}
      className="border border-[var(--color-layout-border-color)] rounded-md overflow-hidden"
    />
  ),
}

export const ColumnLoader_Square: Story = {
  name: "Loader · Square",
  render: () => (
    <TableColumnLoader
      width={112}
      shape="square"
      rows={20}
      header={<TableHeaderCell>Pla...</TableHeaderCell>}
      className="border border-[var(--color-layout-border-color)] rounded-md overflow-hidden"
    />
  ),
}

export const ColumnLoader_AllShapes: Story = {
  name: "Loader · All shapes side-by-side",
  render: () => (
    <div className="flex gap-2">
      <TableColumnLoader
        width={228}
        shape="text"
        rows={12}
        header={<TableHeaderCell>Placeholder for text</TableHeaderCell>}
        className="border border-[var(--color-layout-border-color)] rounded-md overflow-hidden"
      />
      <TableColumnLoader
        width={112}
        shape="rectangle"
        rows={12}
        header={<TableHeaderCell>Pla...</TableHeaderCell>}
        className="border border-[var(--color-layout-border-color)] rounded-md overflow-hidden"
      />
      <TableColumnLoader
        width={112}
        shape="circle"
        rows={12}
        header={<TableHeaderCell>Pla...</TableHeaderCell>}
        className="border border-[var(--color-layout-border-color)] rounded-md overflow-hidden"
      />
      <TableColumnLoader
        width={112}
        shape="square"
        rows={12}
        header={<TableHeaderCell>Pla...</TableHeaderCell>}
        className="border border-[var(--color-layout-border-color)] rounded-md overflow-hidden"
      />
    </div>
  ),
}

export const FullColumnTable: Story = {
  name: "Composed · Column-major table",
  render: () => (
    <div className="flex border border-[var(--color-layout-border-color)] rounded-md overflow-hidden">
      <TableColumn width={40}>
        <TableCell variant="control">
          <Checkbox aria-label="Select all" />
        </TableCell>
        {Array.from({ length: 6 }).map((_, i) => (
          <TableCell key={i} variant="control">
            <Checkbox aria-label={`Select ${i + 1}`} />
          </TableCell>
        ))}
      </TableColumn>
      <TableColumn width={228}>
        <TableHeaderCell sortDirection="asc">Task</TableHeaderCell>
        {TEXT_ROWS.map((label) => (
          <TableCell key={label}>
            <span className="flex-1 truncate">{label}</span>
          </TableCell>
        ))}
      </TableColumn>
      <TableColumn width={160}>
        <TableHeaderCell iconBefore="user">Owner</TableHeaderCell>
        {[
          ["RM", "Riley M."],
          ["AK", "Avery K."],
          ["JL", "Jordan L."],
          ["SP", "Sam P."],
          ["KT", "Kira T."],
          ["DH", "Dani H."],
        ].map(([initials, name]) => (
          <TableCell key={name}>
            <Avatar size="sm" type="initials" initials={initials!} />
            <span className="flex-1 truncate">{name}</span>
          </TableCell>
        ))}
      </TableColumn>
      <TableColumn width={128}>
        <TableHeaderCell>Status</TableHeaderCell>
        <TableCell><Chip type="warning-subtle">In review</Chip></TableCell>
        <TableCell><Chip type="positive-subtle">Done</Chip></TableCell>
        <TableCell><Chip type="negative-subtle">Blocked</Chip></TableCell>
        <TableCell><Chip type="primary-subtle">Active</Chip></TableCell>
        <TableCell><Chip type="primary-subtle">Active</Chip></TableCell>
        <TableCell><Chip type="positive-subtle">Done</Chip></TableCell>
      </TableColumn>
      <TableColumn width={180}>
        <TableHeaderCell>Progress</TableHeaderCell>
        {[30, 100, 60, 45, 80, 22].map((v, i) => (
          <TableCell key={i}>
            <LinearProgressBar
              size="sm"
              type={v >= 100 ? "positive" : v < 30 ? "negative" : "primary"}
              value={v}
              showLabel
              className="flex-1"
            />
          </TableCell>
        ))}
      </TableColumn>
      <TableColumn width={40}>
        <TableCell variant="control" border={false} />
        {Array.from({ length: 6 }).map((_, i) => (
          <TableCell key={i} variant="control" border={false}>
            <IconButton
              icon="ellipsis-vertical"
              size="xs"
              kind="tertiary"
              aria-label={`Actions for row ${i + 1}`}
            />
          </TableCell>
        ))}
      </TableColumn>
    </div>
  ),
}
