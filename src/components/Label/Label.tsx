import { cva, type VariantProps } from "class-variance-authority"
import { forwardRef, type HTMLAttributes, type ReactNode } from "react"
import { cn } from "../../lib/cn"

/**
 * Label — sourced from the TimeWorks Figma file
 * (page "Label", node 46939:7900; component set 46946:16083).
 *
 *   <Label>New</Label>
 *   <Label color="positive" kind="line">Active</Label>
 *   <Label size="sm">Beta</Label>
 *
 * A non-clickable status pill that sits next to the item it classifies.
 * Two sizes (md 24, sm 16) × two kinds (fill, line) × four colors
 * (primary, positive, negative, dark) × an optional `active` state.
 */

const label = cva(
  [
    "inline-flex items-center justify-center shrink-0",
    "font-body whitespace-nowrap select-none",
  ],
  {
    variants: {
      size: {
        // Figma medium uses a 6px corner radius — no matching token in the
        // current scale; raw value retained until a 6px step is added.
        md: "h-6 px-2 text-t2 rounded-[6px]",
        sm: "h-4 px-1 text-t3 rounded-sm",
      },
      kind: {
        fill: "",
        line: "bg-transparent border",
      },
      color: {
        primary: "",
        positive: "",
        negative: "",
        dark: "",
      },
      active: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      // ── Fill: solid bg, white text ─────────────────────────────────────
      {
        kind: "fill",
        color: "primary",
        className:
          "bg-[var(--color-primary-color)] text-[var(--color-text-color-on-primary)] hover:bg-[var(--color-primary-hover-color)]",
      },
      {
        kind: "fill",
        color: "positive",
        className:
          "bg-[var(--color-positive-color)] text-[var(--color-text-color-on-primary)] hover:bg-[var(--color-positive-color-hover)]",
      },
      {
        kind: "fill",
        color: "negative",
        className:
          "bg-[var(--color-negative-color)] text-[var(--color-text-color-on-primary)] hover:bg-[var(--color-negative-color-hover)]",
      },
      {
        kind: "fill",
        color: "dark",
        className:
          "bg-[var(--color-inverted-color-background)] text-[var(--color-text-color-on-inverted)]",
      },
      // ── Line: colored border + text, transparent bg ────────────────────
      // Figma hover for line uses the matching *-selected-hover fill, except
      // primary/dark which use the neutral 10% overlay.
      {
        kind: "line",
        color: "primary",
        className:
          "border-[var(--color-primary-color)] text-[var(--color-primary-color)] hover:bg-[var(--color-primary-background-hover-color)]",
      },
      {
        kind: "line",
        color: "positive",
        className:
          "border-[var(--color-positive-color)] text-[var(--color-positive-color)] hover:bg-[var(--color-positive-color-selected-hover)]",
      },
      {
        kind: "line",
        color: "negative",
        className:
          "border-[var(--color-negative-color)] text-[var(--color-negative-color)] hover:bg-[var(--color-negative-color-selected-hover)]",
      },
      {
        kind: "line",
        color: "dark",
        className:
          "border-[var(--color-inverted-color-background)] text-[var(--color-primary-text-color)] hover:bg-[var(--color-primary-background-hover-color)]",
      },
      // ── Active state — sticky version of each kind's hover fill ────────
      {
        active: true,
        kind: "line",
        color: "primary",
        className: "bg-[var(--color-primary-background-hover-color)]",
      },
      {
        active: true,
        kind: "line",
        color: "positive",
        className: "bg-[var(--color-positive-color-selected-hover)]",
      },
      {
        active: true,
        kind: "line",
        color: "negative",
        className: "bg-[var(--color-negative-color-selected-hover)]",
      },
      {
        active: true,
        kind: "line",
        color: "dark",
        className: "bg-[var(--color-primary-background-hover-color)]",
      },
      {
        active: true,
        kind: "fill",
        color: "primary",
        className: "bg-[var(--color-primary-hover-color)]",
      },
      {
        active: true,
        kind: "fill",
        color: "positive",
        className: "bg-[var(--color-positive-color-hover)]",
      },
      {
        active: true,
        kind: "fill",
        color: "negative",
        className: "bg-[var(--color-negative-color-hover)]",
      },
    ],
    defaultVariants: {
      size: "md",
      kind: "line",
      color: "primary",
      active: false,
    },
  },
)

type LabelVariants = VariantProps<typeof label>

export type LabelProps = Omit<HTMLAttributes<HTMLSpanElement>, "color"> &
  LabelVariants & {
    children: ReactNode
  }

export const Label = forwardRef<HTMLSpanElement, LabelProps>(function Label(
  {
    size = "md",
    kind = "line",
    color = "primary",
    active = false,
    className,
    children,
    ...rest
  },
  ref,
) {
  return (
    <span
      ref={ref}
      data-active={active || undefined}
      className={cn(label({ size, kind, color, active }), className)}
      {...rest}
    >
      {children}
    </span>
  )
})
