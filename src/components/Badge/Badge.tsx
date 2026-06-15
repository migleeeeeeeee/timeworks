import { cva, type VariantProps } from "class-variance-authority"
import { forwardRef, type HTMLAttributes, type ReactNode } from "react"
import { cn } from "../../lib/cn"

/**
 * Badge — sourced from the TimeWorks Figma file
 * (page "Badge", node 46939:90704).
 *
 *   <Badge type="indicator"><Button>Inbox</Button></Badge>
 *   <Badge type="counter" count={5}><IconButton icon="bell" aria-label="Alerts" /></Badge>
 *   <Badge type="indicator" anchor="round"><Avatar src="/me.png" alt="Me" /></Badge>
 *
 * Wrapper that overlays a notification dot ("indicator") or numeric pill
 * ("counter") at the top-right of any child. The `anchor` prop tunes the
 * offset so the badge clears the visible bounds of square (button/card)
 * vs. round (avatar) children.
 */

const positioner = cva("absolute z-[1] pointer-events-none", {
  variants: {
    anchor: {
      square: "",
      round: ""
    },
    type: {
      indicator: "",
      counter: "top-0 right-0 translate-x-1/2 -translate-y-1/2"
    }
  },
  compoundVariants: [
    { type: "indicator", anchor: "square", class: "top-[-6px] right-[-6px]" },
    { type: "indicator", anchor: "round", class: "top-[-3px] right-[-3px]" }
  ],
  defaultVariants: { anchor: "square", type: "indicator" }
})

// Figma's indicator is an 8px anchor box with the visible SVG rendered at
// `inset:[-25%]` — i.e. the disc visually extends 25% past the box on each
// side (8px × 1.5 = 12px visual). Mirrored 1:1 here.
const indicatorBox = cva(
  "block size-3 rounded-full bg-[var(--color-negative-color)] ring-2 ring-[var(--color-primary-background-color)]"
)

const counter = cva(
  [
    "inline-flex items-center justify-center",
    "h-7 px-2 rounded-full",
    "bg-[var(--color-negative-color)] text-[var(--color-text-color-on-primary)]",
    "border-2 border-[var(--color-primary-background-color)]",
    "text-t2 font-body whitespace-nowrap"
  ].join(" ")
)

type PositionerVariants = VariantProps<typeof positioner>

export type BadgeProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> &
  PositionerVariants & {
    /** Child element the badge decorates (Button, IconButton, Avatar, etc.). */
    children: ReactNode
    /** "indicator" shows a small dot. "counter" shows a numeric pill. */
    type?: "indicator" | "counter"
    /** Count to render when `type="counter"`. Values above `max` show as `${max}+`. */
    count?: number
    /** Cap before the count is rendered as `${max}+`. Defaults to 99. */
    max?: number
    /** When set, hides the badge while keeping layout — useful for `count === 0`. */
    hidden?: boolean
    /** Accessible label announced for the badge itself. */
    "aria-label"?: string
  }

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  {
    className,
    children,
    type = "indicator",
    count,
    max = 99,
    anchor = "square",
    hidden = false,
    "aria-label": ariaLabel,
    ...rest
  },
  ref
) {
  const showBadge =
    !hidden && (type === "indicator" || (type === "counter" && typeof count === "number"))
  const display =
    type === "counter" && typeof count === "number"
      ? count > max
        ? `${max}+`
        : String(count)
      : null

  return (
    <span ref={ref} className={cn("relative inline-flex shrink-0", className)} {...rest}>
      {children}
      {showBadge && (
        <span className={positioner({ anchor, type })} aria-hidden={ariaLabel ? undefined : true}>
          {type === "indicator" ? (
            <span
              className={indicatorBox()}
              role={ariaLabel ? "status" : undefined}
              aria-label={ariaLabel}
            />
          ) : (
            <span
              className={counter()}
              role={ariaLabel ? "status" : undefined}
              aria-label={ariaLabel ?? `${display} new`}
            >
              {display}
            </span>
          )}
        </span>
      )}
    </span>
  )
})
