import { cva, type VariantProps } from "class-variance-authority"
import { forwardRef, type ButtonHTMLAttributes } from "react"
import type { IconName } from "../../icons/names"
import { cn } from "../../lib/cn"
import { Icon } from "../Icon"

/**
 * IconButton — sourced from the TimeWorks Figma file
 * (page "Icon Button", node 25757:58850 in the Experiment DS file).
 *
 *   <IconButton icon="hexagon" aria-label="Open menu" />
 *
 * Circular button containing only an icon — used in toolbars and control
 * bars. Always pass `aria-label` (or wrap in a Tooltip) so the button is
 * reachable for screen readers and keyboard users.
 *
 * Maps the Figma matrix (Size × Kind × Color × State × Loader) onto a
 * cva-driven API mirroring `Button`. Defaults match the Figma "Medium /
 * Primary / Primary / Default" cell: 40×40, fully rounded, gradient fill
 * with hue-matched glow.
 */

// Filled variants share a gradient + hue-matched glow + 1px inner highlight.
// Each row's classes are inlined as literal strings so Tailwind v4's source
// scanner can detect them.
const DISABLED_FILL =
  "disabled:bg-none disabled:bg-[var(--color-disabled-background-color)] disabled:shadow-none disabled:text-[var(--color-secondary-text-color)]"

const root = cva(
  [
    "inline-flex items-center justify-center shrink-0 select-none",
    "transition duration-[120ms] ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-color)] focus-visible:ring-offset-2",
    "disabled:cursor-not-allowed",
  ].join(" "),
  {
    variants: {
      size: {
        xxs: "size-4 rounded-full",
        xs: "size-6 rounded-full",
        sm: "size-8 rounded-full",
        md: "size-10 rounded-full",
        lg: "size-12 rounded-full",
      },
      kind: {
        primary: "border border-transparent",
        secondary: "border bg-[var(--color-secondary-background-color)] backdrop-blur-md",
        tertiary: "border border-transparent bg-transparent",
        brand: "border border-transparent",
      },
      color: {
        primary: "",
        negative: "",
        positive: "",
        inverted: "",
        "on-primary": "",
        "on-negative": "",
        "on-positive": "",
        "on-warning": "",
        "on-inverted": "",
      },
    },
    compoundVariants: [
      // Primary (filled gradient)
      {
        kind: "primary",
        color: "primary",
        class:
          "text-[var(--color-text-color-on-primary)] " +
          "bg-[linear-gradient(to_bottom,var(--color-primary-color),var(--color-primary-hover-color))] " +
          "shadow-[0_6px_16px_color-mix(in_srgb,var(--color-primary-color)_45%,transparent),inset_0_1px_0_rgb(255_255_255/0.25)] " +
          "hover:bg-[linear-gradient(to_bottom,var(--color-primary-hover-color),var(--color-primary-hover-color))] " +
          "hover:shadow-[0_6px_20px_color-mix(in_srgb,var(--color-primary-color)_58%,transparent),inset_0_1px_0_rgb(255_255_255/0.25)] " +
          "active:bg-[linear-gradient(to_bottom,var(--color-primary-hover-color),var(--color-primary-color))] " +
          "active:shadow-[0_6px_10px_color-mix(in_srgb,var(--color-primary-color)_28%,transparent),inset_0_1px_0_rgb(255_255_255/0.25)] " +
          "data-[active=true]:bg-[linear-gradient(to_bottom,var(--color-primary-hover-color),var(--color-primary-color))] " +
          DISABLED_FILL,
      },
      {
        kind: "primary",
        color: "inverted",
        class:
          "text-[var(--color-text-color-on-inverted)] " +
          "bg-[linear-gradient(to_bottom,var(--color-inverted-color-background),var(--color-fixed-dark-color))] " +
          "shadow-[0_6px_16px_color-mix(in_srgb,var(--color-inverted-color-background)_45%,transparent),inset_0_1px_0_rgb(255_255_255/0.25)] " +
          "hover:bg-[linear-gradient(to_bottom,var(--color-fixed-dark-color),var(--color-fixed-dark-color))] " +
          "hover:shadow-[0_6px_20px_color-mix(in_srgb,var(--color-inverted-color-background)_58%,transparent),inset_0_1px_0_rgb(255_255_255/0.25)] " +
          "active:bg-[linear-gradient(to_bottom,var(--color-fixed-dark-color),var(--color-inverted-color-background))] " +
          "active:shadow-[0_6px_10px_color-mix(in_srgb,var(--color-inverted-color-background)_28%,transparent),inset_0_1px_0_rgb(255_255_255/0.25)] " +
          "data-[active=true]:bg-[linear-gradient(to_bottom,var(--color-fixed-dark-color),var(--color-inverted-color-background))] " +
          DISABLED_FILL,
      },
      {
        kind: "primary",
        color: "negative",
        class:
          "text-[var(--color-text-color-on-primary)] " +
          "bg-[linear-gradient(to_bottom,var(--color-negative-color),var(--color-negative-color-hover))] " +
          "shadow-[0_6px_16px_color-mix(in_srgb,var(--color-negative-color)_45%,transparent),inset_0_1px_0_rgb(255_255_255/0.25)] " +
          "hover:bg-[linear-gradient(to_bottom,var(--color-negative-color-hover),var(--color-negative-color-hover))] " +
          "hover:shadow-[0_6px_20px_color-mix(in_srgb,var(--color-negative-color)_58%,transparent),inset_0_1px_0_rgb(255_255_255/0.25)] " +
          "active:bg-[linear-gradient(to_bottom,var(--color-negative-color-hover),var(--color-negative-color))] " +
          "active:shadow-[0_6px_10px_color-mix(in_srgb,var(--color-negative-color)_28%,transparent),inset_0_1px_0_rgb(255_255_255/0.25)] " +
          "data-[active=true]:bg-[linear-gradient(to_bottom,var(--color-negative-color-hover),var(--color-negative-color))] " +
          DISABLED_FILL,
      },
      {
        kind: "primary",
        color: "positive",
        class:
          "text-[var(--color-text-color-on-primary)] " +
          "bg-[linear-gradient(to_bottom,var(--color-positive-color),var(--color-positive-color-hover))] " +
          "shadow-[0_6px_16px_color-mix(in_srgb,var(--color-positive-color)_45%,transparent),inset_0_1px_0_rgb(255_255_255/0.25)] " +
          "hover:bg-[linear-gradient(to_bottom,var(--color-positive-color-hover),var(--color-positive-color-hover))] " +
          "hover:shadow-[0_6px_20px_color-mix(in_srgb,var(--color-positive-color)_58%,transparent),inset_0_1px_0_rgb(255_255_255/0.25)] " +
          "active:bg-[linear-gradient(to_bottom,var(--color-positive-color-hover),var(--color-positive-color))] " +
          "active:shadow-[0_6px_10px_color-mix(in_srgb,var(--color-positive-color)_28%,transparent),inset_0_1px_0_rgb(255_255_255/0.25)] " +
          "data-[active=true]:bg-[linear-gradient(to_bottom,var(--color-positive-color-hover),var(--color-positive-color))] " +
          DISABLED_FILL,
      },
      // Secondary (outlined)
      {
        kind: "secondary",
        color: "primary",
        class:
          "border-[var(--color-ui-border-color)] text-[var(--color-primary-text-color)] hover:bg-[var(--color-primary-background-hover-color)] active:bg-[var(--color-primary-selected-color)] data-[active=true]:bg-[var(--color-primary-selected-color)] data-[active=true]:border-[var(--color-primary-color)] data-[active=true]:text-[var(--color-primary-color)] data-[active=true]:hover:bg-[var(--color-primary-selected-hover-color)] disabled:border-[var(--color-ui-border-color)] disabled:text-[var(--color-disabled-text-color)] disabled:bg-[var(--color-disabled-background-color)]",
      },
      {
        kind: "secondary",
        color: "inverted",
        class:
          "border-[var(--color-ui-border-color)] text-[var(--color-primary-text-color)] hover:bg-[var(--color-primary-background-hover-color)] active:bg-[var(--color-primary-selected-color)] data-[active=true]:bg-[var(--color-primary-selected-color)] disabled:border-[var(--color-ui-border-color)] disabled:text-[var(--color-disabled-text-color)] disabled:bg-[var(--color-disabled-background-color)]",
      },
      {
        kind: "secondary",
        color: "negative",
        class:
          "border-[var(--color-negative-color)] text-[var(--color-negative-color)] hover:bg-[var(--color-negative-color-selected)] active:bg-[var(--color-negative-color-selected)] data-[active=true]:bg-[var(--color-negative-color-selected)] disabled:text-[var(--color-disabled-text-color)] disabled:border-[var(--color-ui-border-color)] disabled:bg-[var(--color-disabled-background-color)]",
      },
      {
        kind: "secondary",
        color: "positive",
        class:
          "border-[var(--color-positive-color)] text-[var(--color-positive-color)] hover:bg-[var(--color-positive-color-selected)] active:bg-[var(--color-positive-color-selected)] data-[active=true]:bg-[var(--color-positive-color-selected)] disabled:text-[var(--color-disabled-text-color)] disabled:border-[var(--color-ui-border-color)] disabled:bg-[var(--color-disabled-background-color)]",
      },
      // Tertiary (ghost)
      {
        kind: "tertiary",
        color: "primary",
        class:
          "text-[var(--color-primary-text-color)] hover:bg-[var(--color-primary-background-hover-color)] active:bg-[var(--color-primary-selected-color)] data-[active=true]:bg-[var(--color-primary-selected-color)] data-[active=true]:text-[var(--color-primary-color)] data-[active=true]:hover:bg-[var(--color-primary-selected-hover-color)] disabled:text-[var(--color-disabled-text-color)] disabled:bg-transparent",
      },
      {
        kind: "tertiary",
        color: "inverted",
        class:
          "text-[var(--color-primary-text-color)] hover:bg-[var(--color-primary-background-hover-color)] active:bg-[var(--color-primary-selected-color)] data-[active=true]:bg-[var(--color-primary-selected-color)] disabled:text-[var(--color-disabled-text-color)] disabled:bg-transparent",
      },
      {
        kind: "tertiary",
        color: "negative",
        class:
          "text-[var(--color-negative-color)] hover:bg-[var(--color-negative-color-selected)] active:bg-[var(--color-negative-color-selected)] data-[active=true]:bg-[var(--color-negative-color-selected)] disabled:text-[var(--color-disabled-text-color)] disabled:bg-transparent",
      },
      {
        kind: "tertiary",
        color: "positive",
        class:
          "text-[var(--color-positive-color)] hover:bg-[var(--color-positive-color-selected)] active:bg-[var(--color-positive-color-selected)] data-[active=true]:bg-[var(--color-positive-color-selected)] disabled:text-[var(--color-disabled-text-color)] disabled:bg-transparent",
      },
      // Brand (always brand hue, ignores `color`)
      {
        kind: "brand",
        class:
          "text-[var(--color-text-color-on-primary)] " +
          "bg-[linear-gradient(to_bottom,var(--color-brand-color),var(--color-brand-hover-color))] " +
          "shadow-[0_6px_16px_color-mix(in_srgb,var(--color-brand-color)_45%,transparent),inset_0_1px_0_rgb(255_255_255/0.25)] " +
          "hover:bg-[linear-gradient(to_bottom,var(--color-brand-hover-color),var(--color-brand-hover-color))] " +
          "hover:shadow-[0_6px_20px_color-mix(in_srgb,var(--color-brand-color)_58%,transparent),inset_0_1px_0_rgb(255_255_255/0.25)] " +
          "active:bg-[linear-gradient(to_bottom,var(--color-brand-hover-color),var(--color-brand-color))] " +
          "active:shadow-[0_6px_10px_color-mix(in_srgb,var(--color-brand-color)_28%,transparent),inset_0_1px_0_rgb(255_255_255/0.25)] " +
          "data-[active=true]:bg-[linear-gradient(to_bottom,var(--color-brand-hover-color),var(--color-brand-color))] " +
          DISABLED_FILL,
      },
      // On-color (filled white circle for use on top of a saturated banner/surface)
      {
        kind: "primary",
        color: "on-primary",
        class:
          "bg-[var(--color-text-color-on-primary)] text-[var(--color-primary-color)] hover:bg-[var(--color-primary-selected-color)] active:bg-[var(--color-primary-selected-hover-color)] data-[active=true]:bg-[var(--color-primary-selected-hover-color)] disabled:bg-[var(--color-disabled-background-color)] disabled:text-[var(--color-disabled-text-color)]",
      },
      {
        kind: "primary",
        color: "on-negative",
        class:
          "bg-[var(--color-text-color-on-primary)] text-[var(--color-negative-color)] hover:bg-[var(--color-negative-color-selected)] active:bg-[var(--color-negative-color-selected-hover)] data-[active=true]:bg-[var(--color-negative-color-selected-hover)] disabled:bg-[var(--color-disabled-background-color)] disabled:text-[var(--color-disabled-text-color)]",
      },
      {
        kind: "primary",
        color: "on-positive",
        class:
          "bg-[var(--color-text-color-on-primary)] text-[var(--color-positive-color)] hover:bg-[var(--color-positive-color-selected)] active:bg-[var(--color-positive-color-selected-hover)] data-[active=true]:bg-[var(--color-positive-color-selected-hover)] disabled:bg-[var(--color-disabled-background-color)] disabled:text-[var(--color-disabled-text-color)]",
      },
      {
        kind: "primary",
        color: "on-warning",
        class:
          "bg-[var(--color-text-color-on-primary)] text-[var(--color-fixed-dark-color)] hover:bg-[var(--color-warning-color-selected)] active:bg-[var(--color-warning-color-selected-hover)] data-[active=true]:bg-[var(--color-warning-color-selected-hover)] disabled:bg-[var(--color-disabled-background-color)] disabled:text-[var(--color-disabled-text-color)]",
      },
      // On-inverted: outlined circle for use on top of an inverted/dark surface
      {
        kind: "primary",
        color: "on-inverted",
        class:
          "border-[var(--color-text-color-on-inverted)] bg-[var(--color-primary-background-color)] text-[var(--color-primary-text-color)] hover:bg-[var(--color-primary-background-hover-color)] active:bg-[var(--color-primary-selected-color)] data-[active=true]:bg-[var(--color-primary-selected-color)] disabled:bg-[var(--color-disabled-background-color)] disabled:text-[var(--color-disabled-text-color)] disabled:border-[var(--color-ui-border-color)]",
      },
      {
        kind: "secondary",
        color: "on-inverted",
        class:
          "border-[var(--color-primary-text-color)] text-[var(--color-primary-text-color)] hover:bg-[var(--color-primary-background-hover-color)] active:bg-[var(--color-primary-selected-color)] data-[active=true]:bg-[var(--color-primary-selected-color)] disabled:border-[var(--color-ui-border-color)] disabled:text-[var(--color-disabled-text-color)] disabled:bg-transparent",
      },
    ],
    defaultVariants: {
      kind: "primary",
      size: "md",
      color: "primary",
    },
  },
)

type RootVariants = VariantProps<typeof root>

export type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "color"> &
  RootVariants & {
    /** Icon name from the system library. */
    icon: IconName
    /** Required accessible label (the button has no visible text). */
    "aria-label": string
    /** Toggle / pressed state — renders the "Active" cell from Figma. */
    active?: boolean
    /** Renders a spinning loader icon and disables interaction. */
    loading?: boolean
  }

const ICON_SIZE: Record<NonNullable<RootVariants["size"]>, "2xs" | "xs" | "sm"> = {
  xxs: "2xs",
  xs: "xs",
  sm: "sm",
  md: "sm",
  lg: "sm",
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  {
    className,
    kind,
    size = "md",
    color,
    icon,
    active = false,
    loading = false,
    disabled,
    type = "button",
    ...rest
  },
  ref,
) {
  const iconSize = ICON_SIZE[size ?? "md"]
  const isDisabled = disabled || loading
  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      data-active={active || undefined}
      data-loading={loading || undefined}
      aria-pressed={active || undefined}
      className={cn(root({ kind, size, color }), className)}
      {...rest}
    >
      <Icon
        name={loading ? "loader" : icon}
        size={iconSize}
        className={cn("text-current p-0", loading && "animate-spin")}
      />
    </button>
  )
})
