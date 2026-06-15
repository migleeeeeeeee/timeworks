import { forwardRef, useMemo, type HTMLAttributes, type ReactNode } from "react"
import { Pagination } from "../Pagination"
import { Dropdown, type DropdownOption } from "../Dropdown"
import { cn } from "../../lib/cn"

/**
 * TableFooter — sourced from the TimeWorks Figma file
 * (page "Design suggestions", node 25730:21781 — the table footer).
 *
 *   <TableFooter
 *     totalCount={300}
 *     totalLabel="Total Employees shown"
 *     page={page}
 *     totalPages={Math.ceil(300 / pageSize)}
 *     onPageChange={setPage}
 *     pageSize={pageSize}
 *     pageSizeOptions={[10, 25, 50, 100]}
 *     onPageSizeChange={setPageSize}
 *   />
 *
 * Three-region row laid out with `justify-between`:
 *   left   — total-count caption ("Total Employees shown: 300")
 *   center — Pagination (custom-styled cells, IconButton arrows)
 *   right  — "Show per page" caption + Dropdown
 *
 * Each region is optional: pass `hideTotal`, `hidePagination`, or
 * `hidePageSize` to drop one. The whole row is a `<footer>` landmark with
 * an accessible name so screen readers announce it as the table footer.
 */

const TEXT_MUTED = "text-t2 text-[var(--color-secondary-text-color)] font-body whitespace-nowrap"

export type TableFooterProps = Omit<HTMLAttributes<HTMLElement>, "onChange"> & {
  // ── Count region ────────────────────────────────────────────────────────
  /** Total number of items being paginated (e.g. 300). Rendered as `${totalLabel}: ${totalCount}` unless `renderTotal` is provided. */
  totalCount?: number
  /** Caption preceding the count. Default `"Total shown"`. */
  totalLabel?: string
  /** Custom left-region renderer. When set, replaces the default caption + count. */
  renderTotal?: () => ReactNode
  /** Hide the count region entirely. */
  hideTotal?: boolean

  // ── Pagination region ───────────────────────────────────────────────────
  /** Current page (1-indexed). Required unless `hidePagination`. */
  page?: number
  /** Total number of pages. Required unless `hidePagination`. */
  totalPages?: number
  onPageChange?: (page: number) => void
  /** Sibling pages around the active page. Default 1. */
  siblingCount?: number
  /** Pages anchored to the start and end. Default 1. */
  boundaryCount?: number
  /** Hide the pagination region entirely. */
  hidePagination?: boolean

  // ── Page-size region ────────────────────────────────────────────────────
  /** Currently selected page size. Required unless `hidePageSize`. */
  pageSize?: number
  /** Available page sizes. Default `[10, 25, 50, 100]`. */
  pageSizeOptions?: number[]
  onPageSizeChange?: (size: number) => void
  /** Caption preceding the page-size dropdown. Default `"Show per page"`. */
  pageSizeLabel?: string
  /** Hide the page-size region entirely. */
  hidePageSize?: boolean

  /** Accessible name for the footer landmark. Default `"Table footer"`. */
  ariaLabel?: string
}

const DEFAULT_PAGE_SIZES = [10, 25, 50, 100]

export const TableFooter = forwardRef<HTMLElement, TableFooterProps>(function TableFooter(
  {
    className,
    // Count
    totalCount,
    totalLabel = "Total shown",
    renderTotal,
    hideTotal = false,
    // Pagination
    page,
    totalPages,
    onPageChange,
    siblingCount = 1,
    boundaryCount = 1,
    hidePagination = false,
    // Page size
    pageSize,
    pageSizeOptions = DEFAULT_PAGE_SIZES,
    onPageSizeChange,
    pageSizeLabel = "Show per page",
    hidePageSize = false,
    // Misc
    ariaLabel = "Table footer",
    ...rest
  },
  ref,
) {
  const dropdownOptions = useMemo<DropdownOption[]>(
    () => pageSizeOptions.map((n) => ({ value: String(n), label: String(n) })),
    [pageSizeOptions],
  )

  const showTotal = !hideTotal && (renderTotal || totalCount != null)
  const showPagination = !hidePagination && page != null && totalPages != null
  const showPageSize = !hidePageSize && pageSize != null

  return (
    <footer
      ref={ref}
      aria-label={ariaLabel}
      className={cn(
        "flex w-full items-center justify-between gap-6 py-2",
        // Footer chrome stays transparent so it composes inside any table surface.
        className,
      )}
      {...rest}
    >
      <div className={cn("flex items-center", showTotal ? "" : "invisible")}>
        {showTotal &&
          (renderTotal ? (
            renderTotal()
          ) : (
            <span className={TEXT_MUTED}>
              {totalLabel}: <span className="text-[var(--color-primary-text-color)]">{totalCount}</span>
            </span>
          ))}
      </div>

      <div className="flex items-center justify-center">
        {showPagination && (
          <Pagination
            page={page!}
            totalPages={totalPages!}
            onPageChange={onPageChange}
            siblingCount={siblingCount}
            boundaryCount={boundaryCount}
          />
        )}
      </div>

      <div className={cn("flex items-center gap-3", showPageSize ? "" : "invisible")}>
        {showPageSize && (
          <>
            <span className={TEXT_MUTED}>{pageSizeLabel}</span>
            <Dropdown
              options={dropdownOptions}
              value={String(pageSize)}
              onValueChange={(v) => onPageSizeChange?.(Number(v))}
              size="sm"
              className="w-24"
              aria-label={pageSizeLabel}
            />
          </>
        )}
      </div>
    </footer>
  )
})
