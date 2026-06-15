import { cva, type VariantProps } from "class-variance-authority"
import { forwardRef, useMemo, type HTMLAttributes, type ReactNode } from "react"
import { IconButton } from "../IconButton"
import { cn } from "../../lib/cn"

/**
 * Pagination — sourced from the TimeWorks Figma file
 * (page "Design suggestions", node 25730:21781 — the table footer pagination).
 *
 *   <Pagination page={1} totalPages={10} onPageChange={setPage} />
 *
 * Custom-built cells (not the shared Button/IconButton) so the active page can
 * sit visually on a primary fill while sibling pages render as flat text — the
 * pattern the table footer in Figma uses. Renders boundary pages, the active
 * page surrounded by `siblingCount` neighbours, and ellipses for the rest.
 *
 * Behaviour comes from a plain nav landmark — no Radix primitive exists for
 * pagination. Each interactive cell is a `<button>` so screen readers and
 * keyboard users navigate it as a button group.
 */

type Item =
  | { kind: "page"; page: number }
  | { kind: "ellipsis"; key: "left" | "right" }

function range(start: number, end: number): number[] {
  return Array.from({ length: Math.max(0, end - start + 1) }, (_, i) => start + i)
}

function buildItems(totalPages: number, page: number, siblingCount: number, boundaryCount: number): Item[] {
  const total = Math.max(1, Math.floor(totalPages))
  const current = Math.min(Math.max(1, Math.floor(page)), total)
  const siblings = Math.max(0, siblingCount)
  const boundaries = Math.max(0, boundaryCount)

  // Slots: boundaries + dots + (siblings*2 + 1 active) + dots + boundaries
  const totalSlots = boundaries * 2 + siblings * 2 + 5
  if (total <= totalSlots) {
    return range(1, total).map<Item>((p) => ({ kind: "page", page: p }))
  }

  const leftSibling = Math.max(current - siblings, boundaries + 2)
  const rightSibling = Math.min(current + siblings, total - boundaries - 1)
  const showLeftDots = leftSibling > boundaries + 2
  const showRightDots = rightSibling < total - boundaries - 1
  const head = range(1, boundaries)
  const tail = range(total - boundaries + 1, total)

  const items: Item[] = [...head.map<Item>((p) => ({ kind: "page", page: p }))]

  if (!showLeftDots && showRightDots) {
    const leftItemCount = boundaries + siblings * 2 + 2
    items.push(...range(boundaries + 1, leftItemCount).map<Item>((p) => ({ kind: "page", page: p })))
    items.push({ kind: "ellipsis", key: "right" })
  } else if (showLeftDots && !showRightDots) {
    const rightItemCount = boundaries + siblings * 2 + 2
    items.push({ kind: "ellipsis", key: "left" })
    items.push(
      ...range(total - boundaries - rightItemCount + 1, total - boundaries).map<Item>((p) => ({
        kind: "page",
        page: p,
      })),
    )
  } else if (showLeftDots && showRightDots) {
    items.push({ kind: "ellipsis", key: "left" })
    items.push(...range(leftSibling, rightSibling).map<Item>((p) => ({ kind: "page", page: p })))
    items.push({ kind: "ellipsis", key: "right" })
  } else {
    items.push(...range(boundaries + 1, total - boundaries).map<Item>((p) => ({ kind: "page", page: p })))
  }

  items.push(...tail.map<Item>((p) => ({ kind: "page", page: p })))
  return items
}

// ──────────────────────────────────────────────────────────────────────────────
// Visual primitives — custom cells, not Button/IconButton
// ──────────────────────────────────────────────────────────────────────────────

const root = cva("inline-flex items-center font-body", {
  variants: {
    size: {
      sm: "gap-1.5",
      md: "gap-2",
    },
  },
  defaultVariants: { size: "md" },
})

const cell = cva(
  [
    "inline-flex items-center justify-center shrink-0 select-none",
    "text-t2 leading-none tabular-nums font-body",
    "transition-colors duration-[120ms] ease-out",
    "border border-transparent bg-transparent",
    "text-[var(--color-primary-text-color)]",
    // Neutral palette: subtle gray hover for inactive, charcoal fill for active.
    // Avoids the brand blue here so the active page sits quietly inside dense data tables.
    "hover:bg-[var(--color-allgrey-background-color)]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-text-color)] focus-visible:ring-offset-2",
    "disabled:cursor-not-allowed disabled:text-[var(--color-disabled-text-color)] disabled:bg-transparent",
    "data-[active=true]:bg-[var(--color-inverted-color-background)]",
    "data-[active=true]:text-[var(--color-text-color-on-inverted)]",
    "data-[active=true]:hover:bg-[var(--color-primary-text-color)]",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "h-6 min-w-6 px-1.5 rounded",
        md: "h-8 min-w-8 px-2 rounded",
      },
    },
    defaultVariants: { size: "md" },
  },
)

const ellipsis = cva(
  "inline-flex items-center justify-center shrink-0 text-[var(--color-secondary-text-color)] font-body select-none",
  {
    variants: {
      size: {
        sm: "h-6 min-w-6 text-t2 leading-none",
        md: "h-8 min-w-8 text-t2 leading-none",
      },
    },
    defaultVariants: { size: "md" },
  },
)

type RootVariants = VariantProps<typeof root>

export type PaginationProps = Omit<HTMLAttributes<HTMLElement>, "onChange"> &
  RootVariants & {
    /** Current page (1-indexed). */
    page: number
    /** Total number of pages. Values < 1 collapse to a single page. */
    totalPages: number
    /** Fired when a page cell or arrow is activated. */
    onPageChange?: (page: number) => void
    /** Pages on each side of the active page. Default 1. */
    siblingCount?: number
    /** Pages anchored to the start and end. Default 1. */
    boundaryCount?: number
    /** Hide the previous/next arrow controls. */
    hideArrows?: boolean
    /** Accessible label for the previous arrow. Default `"Previous page"`. */
    previousLabel?: string
    /** Accessible label for the next arrow. Default `"Next page"`. */
    nextLabel?: string
    /** Format the visible label of a page cell. Default `(p) => p`. */
    renderPageLabel?: (page: number) => ReactNode
  }

export const Pagination = forwardRef<HTMLElement, PaginationProps>(function Pagination(
  {
    className,
    size = "md",
    page,
    totalPages,
    onPageChange,
    siblingCount = 1,
    boundaryCount = 1,
    hideArrows = false,
    previousLabel = "Previous page",
    nextLabel = "Next page",
    renderPageLabel,
    "aria-label": ariaLabel = "Pagination",
    ...rest
  },
  ref,
) {
  const total = Math.max(1, Math.floor(totalPages))
  const current = Math.min(Math.max(1, Math.floor(page)), total)
  const items = useMemo(
    () => buildItems(total, current, siblingCount, boundaryCount),
    [total, current, siblingCount, boundaryCount],
  )

  const goTo = (next: number) => {
    if (next < 1 || next > total || next === current) return
    onPageChange?.(next)
  }

  return (
    <nav ref={ref} aria-label={ariaLabel} className={cn(root({ size }), className)} {...rest}>
      {!hideArrows && (
        <IconButton
          kind="secondary"
          size="xs"
          icon="chevron-left"
          aria-label={previousLabel}
          disabled={current <= 1}
          onClick={() => goTo(current - 1)}
        />
      )}
      <ul className={cn("inline-flex items-center", size === "sm" ? "gap-0.5" : "gap-1")}>
        {items.map((item, idx) => {
          if (item.kind === "ellipsis") {
            return (
              <li key={`${item.key}-${idx}`} aria-hidden className={ellipsis({ size })}>
                …
              </li>
            )
          }
          const isActive = item.page === current
          return (
            <li key={item.page}>
              <button
                type="button"
                className={cell({ size })}
                data-active={isActive || undefined}
                aria-current={isActive ? "page" : undefined}
                aria-label={`Go to page ${item.page}`}
                onClick={() => goTo(item.page)}
              >
                {renderPageLabel ? renderPageLabel(item.page) : item.page}
              </button>
            </li>
          )
        })}
      </ul>
      {!hideArrows && (
        <IconButton
          kind="secondary"
          size="xs"
          icon="chevron-right"
          aria-label={nextLabel}
          disabled={current >= total}
          onClick={() => goTo(current + 1)}
        />
      )}
    </nav>
  )
})
