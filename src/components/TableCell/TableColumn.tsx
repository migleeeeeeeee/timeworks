import {
  forwardRef,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react"
import { cn } from "../../lib/cn"

/**
 * TableColumn — sourced from the TimeWorks Figma file
 * (page "Table / ColumnContent", node 46949:12272).
 *
 *   <TableColumn width={228}>
 *     <TableHeaderCell>Owner</TableHeaderCell>
 *     <TableCell>Riley M.</TableCell>
 *     <TableCell>Avery K.</TableCell>
 *   </TableColumn>
 *
 * A vertical stack of table cells, typically used as a column inside a
 * column-major table layout. Compose with `<TableHeaderCell>` and
 * `<TableCell>` directly. Width defaults to fluid; pass `width` to
 * lock a fixed pixel size matching the Figma column ranges (text 228,
 * label/chip/avatar 128, control 40).
 */

export type TableColumnProps = HTMLAttributes<HTMLDivElement> & {
  /** Fixed column width. Number → px, string → passthrough. */
  width?: number | string
  /** Stack of header cell + body cells. */
  children?: ReactNode
}

export const TableColumn = forwardRef<HTMLDivElement, TableColumnProps>(
  function TableColumn({ width, className, style, children, ...rest }, ref) {
    const dimStyle: CSSProperties =
      width !== undefined
        ? { width: typeof width === "number" ? `${width}px` : width }
        : {}
    return (
      <div
        ref={ref}
        role="columnheader-group"
        className={cn("flex flex-col items-stretch", className)}
        style={{ ...dimStyle, ...style }}
        {...rest}
      >
        {children}
      </div>
    )
  },
)
