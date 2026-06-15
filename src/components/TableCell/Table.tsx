import { cva, type VariantProps } from "class-variance-authority"
import {
  createContext,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react"
import { cn } from "../../lib/cn"
import type { TableCellSize } from "./TableCell"

/**
 * Table — composed wrapper sourced from the TimeWorks Figma file
 * (page "Table", showcase node 46939:7915, "Use Case" frame).
 *
 *   <Table size="md">
 *     <TableColumn width={228}>
 *       <TableHeaderCell sortDirection="asc">Task</TableHeaderCell>
 *       <TableCell>Audit Q4 invoices</TableCell>
 *     </TableColumn>
 *     <TableColumn width={128}>
 *       <TableHeaderCell>Status</TableHeaderCell>
 *       <TableCell><Chip type="positive-subtle">Done</Chip></TableCell>
 *     </TableColumn>
 *   </Table>
 *
 * Two visual variants from the Figma "Use Case" frame:
 *   `bordered` (default) — outer border + 8px radius, columns clipped flush
 *   borderless           — pass `bordered={false}` for the no-border variant
 *
 * `size` (sm | md | lg, default md) propagates via context so all
 * descendant `<TableCell>`, `<TableHeaderCell>` and `<TableColumnLoader>`
 * pick it up automatically. Cells/headers can still override individually
 * by passing their own `size` prop.
 */

export const TableSizeContext = createContext<TableCellSize | undefined>(undefined)

const tableShell = cva("flex items-stretch overflow-hidden bg-[var(--color-primary-background-color)]", {
  variants: {
    bordered: {
      true: "border border-[var(--color-layout-border-color)] rounded-md",
      false: "",
    },
  },
  defaultVariants: {
    bordered: true,
  },
})

type TableShellVariants = VariantProps<typeof tableShell>

export type TableProps = HTMLAttributes<HTMLDivElement> &
  TableShellVariants & {
    /** Default size for all cells and headers within the table. */
    size?: TableCellSize
    /** A row of `<TableColumn>` (or `<TableColumnLoader>`) children. */
    children?: ReactNode
  }

export const Table = forwardRef<HTMLDivElement, TableProps>(function Table(
  { bordered = true, size = "md", className, children, role = "table", ...rest },
  ref,
) {
  return (
    <TableSizeContext.Provider value={size}>
      <div
        ref={ref}
        role={role}
        data-size={size}
        className={cn(tableShell({ bordered }), className)}
        {...rest}
      >
        {children}
      </div>
    </TableSizeContext.Provider>
  )
})
