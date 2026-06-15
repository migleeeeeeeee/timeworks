import {
  forwardRef,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react"
import { Icon } from "../Icon"
import { IconButton } from "../IconButton"
import type { IconName } from "../../icons/names"
import { cn } from "../../lib/cn"
import { TableCell, type TableCellProps } from "./TableCell"

/**
 * TableHeaderCell — column-title variant of `<TableCell>` sourced from
 * the same Figma component (page "Table / Cell", node 46949:11817,
 * ColumnTitle row).
 *
 *   <TableHeaderCell>Owner</TableHeaderCell>
 *   <TableHeaderCell iconBefore="user" sortDirection="asc">Assignee</TableHeaderCell>
 *   <TableHeaderCell onMenuClick={openMenu}>Status</TableHeaderCell>
 *
 * Uses `<TableCell>` for the shell, then layers Karla SemiBold secondary
 * text with optional leading icon, sort indicator (asc/desc) and a
 * 24px ellipsis trigger that fires `onMenuClick`.
 */

export type TableHeaderCellSortDirection = "asc" | "desc"

export type TableHeaderCellProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children" | "title"
> &
  Pick<TableCellProps, "size" | "state" | "interactive" | "border"> & {
    /** Column title. */
    children: ReactNode
    /** Icon rendered before the title. */
    iconBefore?: IconName
    /** Adds a sort indicator after the title. */
    sortDirection?: TableHeaderCellSortDirection
    /** When provided, renders a 24px ellipsis-vertical button on the right. */
    onMenuClick?: (event: MouseEvent<HTMLButtonElement>) => void
    /** Accessible label for the menu trigger. Defaults to "Column actions". */
    menuLabel?: string
  }

export const TableHeaderCell = forwardRef<HTMLDivElement, TableHeaderCellProps>(
  function TableHeaderCell(
    {
      children,
      iconBefore,
      sortDirection,
      onMenuClick,
      menuLabel = "Column actions",
      className,
      size,
      state = "default",
      interactive = false,
      border = true,
      ...rest
    },
    ref,
  ) {
    return (
      <TableCell
        ref={ref}
        role="columnheader"
        size={size}
        state={state}
        interactive={interactive}
        border={border}
        // Pull the right padding in to make room for the 24px menu button.
        className={cn(onMenuClick ? "pl-4 pr-2 gap-2" : "px-4 gap-2", className)}
        {...rest}
      >
        <div className="flex flex-1 items-center gap-1 min-w-0">
          {iconBefore ? (
            <Icon
              name={iconBefore}
              size="xs"
              aria-hidden
              className="shrink-0 text-[var(--color-icon-color)]"
            />
          ) : null}
          <span className="flex-1 min-w-0 truncate font-semibold leading-5 text-[var(--color-secondary-text-color)]">
            {children}
          </span>
          {sortDirection ? (
            <Icon
              name={sortDirection === "asc" ? "arrow-up" : "arrow-down"}
              size="xs"
              aria-hidden
              className="shrink-0 text-[var(--color-icon-color)]"
            />
          ) : null}
        </div>
        {onMenuClick ? (
          <IconButton
            icon="ellipsis-vertical"
            size="xs"
            kind="tertiary"
            aria-label={menuLabel}
            onClick={onMenuClick}
            className="shrink-0"
          />
        ) : null}
      </TableCell>
    )
  },
)
