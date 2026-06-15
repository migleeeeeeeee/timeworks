import {
  forwardRef,
  useContext,
  type HTMLAttributes,
  type ReactNode,
} from "react"
import { cn } from "../../lib/cn"
import { Skeleton } from "../Skeleton"
import { TableCell } from "./TableCell"
import { TableColumn } from "./TableColumn"
import { TableSizeContext } from "./Table"
import type { TableCellSize } from "./TableCell"

/**
 * TableColumnLoader — sourced from the TimeWorks Figma file
 * (page "Table / ColumnLoader", node 46949:11180).
 *
 *   <TableColumnLoader
 *     header={<TableHeaderCell>Owner</TableHeaderCell>}
 *     shape="text"
 *     rows={20}
 *     width={228}
 *   />
 *   <TableColumnLoader shape="circle" width={112} />
 *
 * A loading placeholder for an entire table column: an optional header
 * cell on top followed by `rows` body cells, each containing a Skeleton
 * shape. Four shapes match the Figma variants:
 *
 *   text       → alternating 195/130 px pills (24px tall)
 *   rectangle  → single 80×24 pill
 *   circle     → 24×24 circle
 *   square     → 24×24 rounded square
 *
 * Cells inherit the same height as `<TableCell size="md|lg">` so the
 * loader lines up row-for-row with the real content it'll be replaced by.
 */

export type TableColumnLoaderShape = "text" | "rectangle" | "circle" | "square"

export type TableColumnLoaderProps = HTMLAttributes<HTMLDivElement> & {
  /** Optional header cell rendered above the skeleton rows. */
  header?: ReactNode
  /** Number of skeleton rows. Defaults to 20. */
  rows?: number
  /** Skeleton shape per row. Defaults to "text". */
  shape?: TableColumnLoaderShape
  /** Cell height — md (40) or lg (48). Defaults to "md". */
  size?: Extract<TableCellSize, "md" | "lg">
  /** Fixed column width. Number → px, string → passthrough. */
  width?: number | string
  /** Toggle the pulse animation on the inner Skeletons. Defaults to true. */
  animated?: boolean
}

function PlaceholderShape({
  shape,
  rowIndex,
  animated,
}: {
  shape: TableColumnLoaderShape
  rowIndex: number
  animated: boolean
}) {
  switch (shape) {
    case "text": {
      const wide = rowIndex % 2 === 0
      return (
        <Skeleton
          type="rectangle"
          width={wide ? 195 : 130}
          height={24}
          animated={animated}
        />
      )
    }
    case "rectangle":
      return <Skeleton type="rectangle" width={80} height={24} animated={animated} />
    case "circle":
      return <Skeleton type="circle" width={24} height={24} animated={animated} />
    case "square":
      return <Skeleton type="rectangle" width={24} height={24} animated={animated} />
  }
}

export const TableColumnLoader = forwardRef<HTMLDivElement, TableColumnLoaderProps>(
  function TableColumnLoader(
    {
      header,
      rows = 20,
      shape = "text",
      size,
      width,
      animated = true,
      className,
      ...rest
    },
    ref,
  ) {
    const ctxSize = useContext(TableSizeContext)
    const ctxLoaderSize: Extract<TableCellSize, "md" | "lg"> | undefined =
      ctxSize === "lg" ? "lg" : ctxSize === "md" ? "md" : undefined
    const resolvedSize: Extract<TableCellSize, "md" | "lg"> =
      size ?? ctxLoaderSize ?? "md"
    const isControl = shape === "circle" || shape === "square"
    return (
      <TableColumn
        ref={ref}
        width={width}
        className={cn(className)}
        aria-busy="true"
        {...rest}
      >
        {header}
        {Array.from({ length: rows }).map((_, index) => (
          <TableCell
            key={index}
            size={resolvedSize}
            variant={isControl ? "control" : "content"}
          >
            <PlaceholderShape shape={shape} rowIndex={index} animated={animated} />
          </TableCell>
        ))}
      </TableColumn>
    )
  },
)
