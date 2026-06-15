import { cva, type VariantProps } from "class-variance-authority"
import { forwardRef, type HTMLAttributes } from "react"
import { cn } from "../../lib/cn"

/**
 * LinearProgressBar — sourced from the TimeWorks Figma file
 * (page "Linear Progress Bar", node 46946:16381).
 *
 *   <LinearProgressBar value={30} />
 *   <LinearProgressBar value={72} type="positive" size="lg" showLabel />
 *   <LinearProgressBar
 *     type="multi"
 *     size="lg"
 *     showLabel
 *     segments={[
 *       { value: 30, color: "primary" },
 *       { value: 25, color: "warning" },
 *       { value: 20, color: "positive" },
 *     ]}
 *   />
 *
 * A horizontal progress indicator. Single-color variants (`primary`,
 * `positive`, `negative`) consume `value` (0–100). The `multi` variant
 * stacks differently-coloured `segments` end-to-end inside one track —
 * useful for budget breakdowns or composition meters. The optional
 * label renders the cumulative percentage to the right of the bar.
 */

const SEGMENT_COLOR_VARS: Record<SegmentColor, string> = {
  primary: "var(--color-primary-color)",
  positive: "var(--color-positive-color)",
  negative: "var(--color-negative-color)",
  warning: "var(--color-warning-color)",
}

const track = cva(
  "relative w-full overflow-hidden rounded-full bg-[var(--color-ui-background-color)]",
  {
    variants: {
      size: {
        sm: "h-1",
        lg: "h-2",
      },
    },
    defaultVariants: { size: "sm" },
  }
)

// Fill is a flat rectangle — the track's `overflow-hidden rounded-full` clips
// the left edge into the pill curve. The right edge stays a sharp vertical
// cut, matching Figma (Rectangle 20 has no cornerRadius).
const fill = cva("absolute inset-y-0 left-0 transition-[width] duration-200 ease-out", {
  variants: {
    type: {
      primary: "bg-[var(--color-primary-color)]",
      positive: "bg-[var(--color-positive-color)]",
      negative: "bg-[var(--color-negative-color)]",
      multi: "",
    },
  },
  defaultVariants: { type: "primary" },
})

type TrackVariants = VariantProps<typeof track>

export type LinearProgressBarType = "primary" | "positive" | "negative" | "multi"
export type SegmentColor = "primary" | "positive" | "negative" | "warning"

export type LinearProgressBarSegment = {
  value: number
  color: SegmentColor
}

export type LinearProgressBarProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> &
  TrackVariants & {
    /** Percentage 0–100. Used for single-colour types and to drive the label. */
    value?: number
    /** Bar style. `multi` stacks `segments` end-to-end. */
    type?: LinearProgressBarType
    /** Show the percentage label to the right of the bar. */
    showLabel?: boolean
    /** Override the displayed label text. Defaults to `${displayValue}%`. */
    labelText?: string
    /** Segments for `type="multi"`. Each `value` is a percentage 0–100. */
    segments?: ReadonlyArray<LinearProgressBarSegment>
    /** Lower bound for the progress range. Defaults to 0. */
    min?: number
    /** Upper bound for the progress range. Defaults to 100. */
    max?: number
    /** Accessible label, used when no visible label is rendered. */
    "aria-label"?: string
  }

const clamp = (n: number, min = 0, max = 100) => Math.max(min, Math.min(max, n))

export const LinearProgressBar = forwardRef<HTMLDivElement, LinearProgressBarProps>(
  function LinearProgressBar(
    {
      className,
      value,
      type = "primary",
      size = "sm",
      showLabel = false,
      labelText,
      segments,
      min = 0,
      max = 100,
      "aria-label": ariaLabel,
      ...rest
    },
    ref
  ) {
    const isMulti = type === "multi"
    const safeSegments = isMulti
      ? (segments ?? []).map((s) => ({ ...s, value: clamp(s.value, 0, 100) }))
      : []
    const segmentSum = safeSegments.reduce((acc, s) => acc + s.value, 0)
    const singleValue = clamp(value ?? 0, min, max)
    const singlePct = max === min ? 0 : ((singleValue - min) / (max - min)) * 100
    const displayPct = isMulti ? clamp(segmentSum) : Math.round(singlePct)
    const display = labelText ?? `${displayPct}%`

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex w-full items-center gap-2",
          showLabel ? undefined : "block",
          className
        )}
        {...rest}
      >
        <div
          role="progressbar"
          aria-valuemin={isMulti ? 0 : min}
          aria-valuemax={isMulti ? 100 : max}
          aria-valuenow={isMulti ? clamp(segmentSum) : singleValue}
          aria-label={ariaLabel}
          className={track({ size })}
        >
          {isMulti ? (
            <div className="absolute inset-0 flex">
              {safeSegments.map((seg, i) => (
                <div
                  key={i}
                  className="h-full"
                  style={{
                    width: `${seg.value}%`,
                    backgroundColor: SEGMENT_COLOR_VARS[seg.color],
                  }}
                />
              ))}
            </div>
          ) : (
            <div
              className={fill({ type })}
              style={{ width: `${singlePct}%` }}
            />
          )}
        </div>
        {showLabel && (
          <span className="shrink-0 font-body text-t2 text-[var(--color-secondary-text-color)] whitespace-nowrap">
            {display}
          </span>
        )}
      </div>
    )
  }
)
