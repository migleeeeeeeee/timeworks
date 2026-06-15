import { cva } from "class-variance-authority"
import { forwardRef, type CSSProperties, type HTMLAttributes } from "react"
import { Icon } from "../Icon"
import { cn } from "../../lib/cn"

/**
 * MultiStepIndicator — sourced from the TimeWorks Figma file
 * (page "Multi Step Indicator (Wizard)", node 46947:3287).
 *
 *   <MultiStepIndicator
 *     current={1}
 *     steps={[
 *       { title: "Account",  subtitle: "Sign up" },
 *       { title: "Profile",  subtitle: "About you" },
 *       { title: "Workspace", subtitle: "Pick a plan" },
 *     ]}
 *   />
 *
 * Numbered step indicator for wizard-style flows. Steps left of `current`
 * render as fulfilled (flat filled disc + check), the step at `current` is
 * active (outer ring + halo + inner filled disc — the "current step pops"
 * treatment), and steps right of `current` are pending (neutral 36px ring
 * inside a 48px frame). Per-step `status` overrides the auto-derived
 * value when a flow needs to skip ahead or surface a failed step.
 *
 * `type` colours the active + fulfilled discs; pending steps stay neutral
 * regardless. `textPlacement="below"` stacks title/subtitle under each
 * indicator (the default), `"inline"` puts them to the right.
 * `size="compact"` swaps in 24px discs for dense surfaces (filter bars,
 * sidebars) — subtitles are hidden in compact mode.
 */

export type MultiStepIndicatorType = "primary" | "success" | "dark" | "danger"
export type MultiStepIndicatorSize = "regular" | "compact"
export type MultiStepIndicatorTextPlacement = "below" | "inline"
export type MultiStepIndicatorStepStatus = "pending" | "active" | "fulfilled"

export type MultiStepIndicatorStep = {
  title?: string
  subtitle?: string
  /** Override the index-derived status (e.g. surface a failed step). */
  status?: MultiStepIndicatorStepStatus
}

const TYPE_BG: Record<MultiStepIndicatorType, string> = {
  primary: "var(--color-primary-color)",
  success: "var(--color-positive-color)",
  dark: "var(--color-inverted-color-background)",
  danger: "var(--color-negative-color)",
}

// Hover bg for clickable steps. Dark uses --color-fixed-dark-color since
// --color-inverted-color-background has no native hover token in v1.
const TYPE_BG_HOVER: Record<MultiStepIndicatorType, string> = {
  primary: "var(--color-primary-hover-color)",
  success: "var(--color-positive-color-hover)",
  dark: "var(--color-fixed-dark-color)",
  danger: "var(--color-negative-color-hover)",
}

// Three distinct visual treatments per Figma node 46947:3290:
//   active    → outer ring (2px type-colour) + 2px halo + inner 36px disc
//   fulfilled → flat 48px filled disc + white check
//   pending   → 36px ring (2px ui-border) centred in a 48px frame
// Compact halves the dimensions (24px frame, 18px inner).
const wrapperSize = cva(
  "relative flex shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-background-color)]",
  {
    variants: {
      size: {
        regular: "size-12",
        compact: "size-6",
      },
    },
    defaultVariants: { size: "regular" },
  },
)

const innerSize = cva(
  "flex shrink-0 items-center justify-center rounded-full font-body transition-colors duration-200 text-[var(--color-text-color-on-primary)]",
  {
    variants: {
      size: {
        regular: "size-9 text-t2",
        compact: "size-[18px] text-t3",
      },
    },
    defaultVariants: { size: "regular" },
  },
)

const pendingRing = cva(
  "flex shrink-0 items-center justify-center rounded-full font-body bg-transparent text-[var(--color-primary-text-color)] border-2 border-[var(--color-ui-border-color)] transition-colors duration-200",
  {
    variants: {
      size: {
        regular: "size-9 text-t2",
        compact: "size-[18px] text-t3",
      },
      interactive: { true: "cursor-pointer", false: "" },
    },
    compoundVariants: [
      {
        interactive: true,
        class: "hover:border-[var(--color-secondary-text-color)]",
      },
    ],
    defaultVariants: { size: "regular", interactive: false },
  },
)

const connector = cva("h-0.5 flex-1 self-center bg-[var(--color-ui-border-color)]", {
  variants: {
    size: {
      regular: "min-w-6 mx-2",
      compact: "min-w-3 mx-1",
    },
  },
  defaultVariants: { size: "regular" },
})

const titleClass = cva("font-body font-semibold text-[var(--color-primary-text-color)]", {
  variants: {
    size: {
      regular: "text-t2 leading-5",
      compact: "text-t2 leading-5",
    },
  },
  defaultVariants: { size: "regular" },
})

const subtitleClass =
  "font-body text-t2 leading-5 text-[var(--color-primary-text-color)]"

export type MultiStepIndicatorProps = Omit<
  HTMLAttributes<HTMLOListElement>,
  "children" | "onChange"
> & {
  steps: ReadonlyArray<MultiStepIndicatorStep>
  /** Zero-based index of the active step. Defaults to 0. */
  current?: number
  /** Colour applied to active + fulfilled steps. Pending stays neutral. */
  type?: MultiStepIndicatorType
  size?: MultiStepIndicatorSize
  /** Text position relative to the step indicator. */
  textPlacement?: MultiStepIndicatorTextPlacement
  /** Optional click handler — when provided, steps render as buttons. */
  onStepClick?: (index: number) => void
}

const deriveStatus = (
  index: number,
  current: number,
  override: MultiStepIndicatorStepStatus | undefined,
): MultiStepIndicatorStepStatus => {
  if (override) return override
  if (index < current) return "fulfilled"
  if (index === current) return "active"
  return "pending"
}

export const MultiStepIndicator = forwardRef<
  HTMLOListElement,
  MultiStepIndicatorProps
>(function MultiStepIndicator(
  {
    className,
    steps,
    current = 0,
    type = "primary",
    size = "regular",
    textPlacement = "below",
    onStepClick,
    ...rest
  },
  ref,
) {
  const isCompact = size === "compact"
  const showText = textPlacement !== "below" || !isCompact
  const inline = textPlacement === "inline"
  const interactive = Boolean(onStepClick)

  return (
    <ol
      ref={ref}
      className={cn(
        "flex w-full items-stretch",
        textPlacement === "below" ? "items-start" : "items-center",
        className,
      )}
      {...rest}
    >
      {steps.map((step, index) => {
        const status = deriveStatus(index, current, step.status)
        const isLast = index === steps.length - 1
        const filled = status !== "pending"
        const bg = filled ? TYPE_BG[type] : undefined
        const bgHover = filled && interactive ? TYPE_BG_HOVER[type] : undefined

        const number = <span>{index + 1}</span>
        const check = (
          <Icon
            name="check"
            size={isCompact ? "2xs" : "sm"}
            className="text-[var(--color-text-color-on-primary)]"
            aria-hidden="true"
          />
        )

        let dot: React.ReactNode
        if (status === "active") {
          // Outer ring + halo + inner filled disc.
          dot = (
            <span
              className={wrapperSize({ size })}
              style={{
                border: "2px solid",
                borderColor: bg,
                "--bg-hover": bgHover,
              } as CSSProperties}
              aria-hidden="true"
            >
              <span
                className={innerSize({ size })}
                style={{ backgroundColor: bg } as CSSProperties}
              >
                {number}
              </span>
            </span>
          )
        } else if (status === "fulfilled") {
          // Flat filled disc.
          dot = (
            <span
              className={cn(
                wrapperSize({ size }),
                "transition-colors duration-200 text-[var(--color-text-color-on-primary)]",
                isCompact ? "text-t3" : "text-t2",
              )}
              style={{
                backgroundColor: bg,
                "--bg-hover": bgHover,
              } as CSSProperties}
              aria-hidden="true"
            >
              {check}
            </span>
          )
        } else {
          // Pending — small empty ring centred in the constant 48×48 frame.
          dot = (
            <span
              className={cn(wrapperSize({ size }), "bg-transparent")}
              aria-hidden="true"
            >
              <span className={pendingRing({ size, interactive })}>{number}</span>
            </span>
          )
        }

        const trigger = onStepClick ? (
          <button
            type="button"
            onClick={() => onStepClick(index)}
            aria-current={status === "active" ? "step" : undefined}
            className={cn(
              "rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-color)] focus-visible:ring-offset-2",
              filled &&
                "[&>span]:hover:bg-[var(--bg-hover,var(--color-primary-hover-color))]",
            )}
          >
            {dot}
          </button>
        ) : (
          dot
        )

        return (
          <li
            key={index}
            className={cn(
              "flex min-w-0",
              inline ? "flex-1 items-center" : "flex-1 flex-col",
              isLast && !inline ? "flex-none" : undefined,
            )}
          >
            <div
              className={cn(
                "flex min-w-0",
                inline ? "flex-1 items-center gap-3" : "w-full items-center",
              )}
            >
              {trigger}

              {inline && step.title && showText && (
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className={titleClass({ size })}>{step.title}</span>
                  {!isCompact && step.subtitle && (
                    <span className={subtitleClass}>{step.subtitle}</span>
                  )}
                </div>
              )}

              {!isLast && <span className={connector({ size })} aria-hidden="true" />}
            </div>

            {!inline && showText && (step.title || step.subtitle) && (
              <div
                className={cn(
                  "flex min-w-0 flex-col gap-0.5",
                  isCompact ? "mt-1" : "mt-3",
                )}
              >
                {step.title && (
                  <span className={titleClass({ size })}>{step.title}</span>
                )}
                {!isCompact && step.subtitle && (
                  <span className={subtitleClass}>{step.subtitle}</span>
                )}
              </div>
            )}
          </li>
        )
      })}
    </ol>
  )
})
