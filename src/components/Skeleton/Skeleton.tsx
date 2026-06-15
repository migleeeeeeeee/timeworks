import { forwardRef, type CSSProperties, type HTMLAttributes } from "react"
import { cn } from "../../lib/cn"

/**
 * Skeleton — sourced from the TimeWorks Figma file
 * (page "Skeleton loading", node 46949:1064).
 *
 *   <Skeleton type="circle" />
 *   <Skeleton type="rectangle" />
 *   <Skeleton type="text" size="h1" />
 *   <Skeleton type="text" size="paragraph" width="100%" />
 *
 * Loading placeholder shown while real content is fetching. Compose
 * multiple instances to seed an entire view (avatar + heading + paragraph
 * rows). Visuals match Figma: track colour `--color-ui-background-color` and 4px radius
 * for rectangular shapes; `circle` is fully rounded. Pulses by default —
 * disable via `animated={false}`.
 */

export type SkeletonType = "circle" | "rectangle" | "text"
export type SkeletonTextSize = "h1" | "h2" | "paragraph"

export type SkeletonProps = HTMLAttributes<HTMLDivElement> & {
  /** Shape of the placeholder. Defaults to `circle`. */
  type?: SkeletonType
  /** Text-row sizing. Only applied when `type="text"`. Defaults to `paragraph`. */
  size?: SkeletonTextSize
  /** Override the default width. Number → px, string → passthrough (e.g. `"100%"`). */
  width?: number | string
  /** Override the default height. Number → px, string → passthrough. */
  height?: number | string
  /** Pulse animation. Defaults to `true`. */
  animated?: boolean
}

const DEFAULTS = {
  circle: { width: 38, height: 38 },
  rectangle: { width: 144, height: 144 },
  "text-h1": { width: 162, height: 32 },
  "text-h2": { width: 162, height: 24 },
  "text-paragraph": { width: 162, height: 16 },
} as const

const toCss = (v: number | string) => (typeof v === "number" ? `${v}px` : v)

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  {
    className,
    type = "circle",
    size = "paragraph",
    width,
    height,
    animated = true,
    style,
    ...rest
  },
  ref
) {
  const key = type === "text" ? (`text-${size}` as const) : type
  const defaults = DEFAULTS[key]
  const w = width ?? defaults.width
  const h = height ?? defaults.height

  const dimStyle: CSSProperties = {
    width: toCss(w),
    height: toCss(h),
  }

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn(
        "block shrink-0 bg-[var(--color-ui-background-color)]",
        type === "circle" ? "rounded-full" : "rounded-sm",
        animated && "animate-pulse",
        className
      )}
      style={{ ...dimStyle, ...style }}
      {...rest}
    />
  )
})
