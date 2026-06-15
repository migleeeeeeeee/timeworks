import { cva } from "class-variance-authority"
import { forwardRef, useCallback, useState, type HTMLAttributes } from "react"
import { Icon } from "../Icon"
import { cn } from "../../lib/cn"

/**
 * Steps — sourced from the TimeWorks Figma file (page "Steps", node 46949:9199).
 *
 *   <Steps count={6} defaultValue={4} />
 *
 * Compact step / pagination indicator for galleries and short flows. Three
 * `type` layouts:
 *   - `gallery`      → Back · dots · Next
 *   - `numbers`      → Back · "X / Y" · Next
 *   - `gallery-only` → just the dots, no buttons
 *
 * Two `onColor` values flip the palette: `white` (default) for light
 * surfaces, `primary` for the brand-colour background. Both colour modes
 * stay legible on the dark/black surfaces shown in the Figma "Variants &
 * states" page since the white-on-primary treatment relies on translucent
 * white for inactive dots.
 */

export type StepsType = "gallery" | "numbers" | "gallery-only"
export type StepsOnColor = "white" | "primary"

const root = cva("inline-flex items-center", {
  variants: {
    type: {
      gallery: "gap-1",
      numbers: "gap-1",
      "gallery-only": "",
    },
  },
  defaultVariants: { type: "gallery" },
})

const navButton = cva(
  "inline-flex items-center justify-center gap-2 rounded-sm px-2 min-h-8 max-h-8 text-t2 font-body transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-40",
  {
    variants: {
      onColor: {
        white:
          "text-[var(--color-primary-text-color)] hover:bg-[var(--color-primary-background-hover-color)] focus-visible:ring-[var(--color-primary-color)] focus-visible:ring-offset-[var(--color-primary-background-color)]",
        primary:
          "text-[var(--color-text-color-on-primary)] hover:bg-white/10 focus-visible:ring-white focus-visible:ring-offset-[var(--color-primary-color)]",
      },
    },
    defaultVariants: { onColor: "white" },
  },
)

const dotsRow = "flex h-2 items-center justify-center gap-2"

// Each dot lives inside an 8×8 frame so the row stays a constant height
// regardless of which dot is active. Active = 8px disc, inactive = 6px.
const dot = cva("rounded-full transition-colors duration-150", {
  variants: {
    onColor: {
      white: "",
      primary: "",
    },
    active: { true: "size-2", false: "size-1.5" },
  },
  compoundVariants: [
    { onColor: "white", active: true, class: "bg-[var(--color-primary-color)]" },
    { onColor: "white", active: false, class: "bg-[var(--color-ui-border-color)]" },
    { onColor: "primary", active: true, class: "bg-[var(--color-text-color-on-primary)]" },
    { onColor: "primary", active: false, class: "bg-white/40" },
  ],
  defaultVariants: { onColor: "white", active: false },
})

const numberDisplay = cva(
  "inline-flex items-center justify-center px-2 min-h-8 text-t2 font-body whitespace-nowrap tabular-nums",
  {
    variants: {
      onColor: {
        white: "text-[var(--color-primary-text-color)]",
        primary: "text-[var(--color-text-color-on-primary)]",
      },
    },
    defaultVariants: { onColor: "white" },
  },
)

export type StepsProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children" | "onChange"
> & {
  /** Total number of steps. */
  count: number
  /** Zero-based active step (controlled). */
  value?: number
  /** Zero-based active step (uncontrolled). Defaults to 0. */
  defaultValue?: number
  /** Fires when Back/Next is pressed. */
  onValueChange?: (next: number) => void
  type?: StepsType
  onColor?: StepsOnColor
  backLabel?: string
  nextLabel?: string
  /** Accessible label for the navigation region. */
  "aria-label"?: string
}

export const Steps = forwardRef<HTMLDivElement, StepsProps>(function Steps(
  {
    className,
    count,
    value,
    defaultValue = 0,
    onValueChange,
    type = "gallery",
    onColor = "white",
    backLabel = "Back",
    nextLabel = "Next",
    "aria-label": ariaLabel = "Steps",
    ...rest
  },
  ref,
) {
  const isControlled = value !== undefined
  const [internal, setInternal] = useState(defaultValue)
  const current = clamp(isControlled ? (value as number) : internal, 0, Math.max(0, count - 1))

  const setCurrent = useCallback(
    (next: number) => {
      const clamped = clamp(next, 0, Math.max(0, count - 1))
      if (!isControlled) setInternal(clamped)
      onValueChange?.(clamped)
    },
    [count, isControlled, onValueChange],
  )

  const goBack = () => setCurrent(current - 1)
  const goNext = () => setCurrent(current + 1)
  const atStart = current <= 0
  const atEnd = current >= count - 1

  const showButtons = type !== "gallery-only"
  const showNumbers = type === "numbers"
  const showDots = type !== "numbers"

  return (
    <div
      ref={ref}
      role="navigation"
      aria-label={ariaLabel}
      className={cn(root({ type }), className)}
      {...rest}
    >
      {showButtons && (
        <button
          type="button"
          onClick={goBack}
          disabled={atStart}
          aria-label={backLabel}
          className={navButton({ onColor })}
        >
          <Icon name="chevron-left" size="sm" aria-hidden="true" />
          <span>{backLabel}</span>
        </button>
      )}

      {showDots && (
        <div className={dotsRow} role="presentation">
          {Array.from({ length: count }, (_, i) => (
            <span
              key={i}
              className="inline-flex size-2 items-center justify-center"
            >
              <span className={dot({ onColor, active: i === current })} />
            </span>
          ))}
        </div>
      )}

      {showNumbers && (
        <span className={numberDisplay({ onColor })} aria-live="polite">
          {current + 1} / {count}
        </span>
      )}

      {showButtons && (
        <button
          type="button"
          onClick={goNext}
          disabled={atEnd}
          aria-label={nextLabel}
          className={navButton({ onColor })}
        >
          <span>{nextLabel}</span>
          <Icon name="chevron-right" size="sm" aria-hidden="true" />
        </button>
      )}
    </div>
  )
})

function clamp(n: number, min: number, max: number) {
  if (n < min) return min
  if (n > max) return max
  return n
}
