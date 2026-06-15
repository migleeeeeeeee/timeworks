import { cva, type VariantProps } from "class-variance-authority"
import {
  forwardRef,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react"
import { Icon } from "../Icon"
import type { IconName } from "../../icons/names"
import { cn } from "../../lib/cn"

/**
 * Chip — sourced from the TimeWorks Figma file
 * (page "Chips", node 46939:97283).
 *
 *   <Chip>This is a chip</Chip>                       // neutral / Default
 *   <Chip type="positive-subtle" icon="circle-check">Active</Chip>
 *   <Chip type="primary">Primary</Chip>               // solid
 *   <Chip avatar={<Avatar size="xs" .../>} onClose={() => …}>Riley M.</Chip>
 *
 * 13 color types matching the Figma variant matrix:
 *   - `default`                                    — neutral grey
 *   - `primary` / `positive` / `negative` / `warning`               — solid
 *   - `primary-subtle` / `positive-subtle` / `negative-subtle` / `warning-subtle` — tinted
 *   - `on-primary` / `on-positive` / `on-negative` / `on-warning`   — tinted + border
 *
 * Icon/text color cascade through `currentColor` so every glyph inside picks
 * up the per-type foreground without each child class needing to know.
 */

const chip = cva(
  [
    "inline-flex items-center gap-1 rounded-full",
    "font-body whitespace-nowrap select-none",
  ],
  {
    variants: {
      size: {
        sm: "h-5 text-t3",
        md: "h-6 text-t2",
      },
      type: {
        // Default — page background fill, dark text, hairline border.
        default:
          "bg-[var(--color-primary-background-color)] text-[var(--color-fixed-dark-color)] border border-[var(--color-layout-border-color)] hover:bg-[var(--color-primary-background-hover-color)]",
        // Solid — saturated brand/semantic backgrounds.
        primary:
          "bg-[var(--color-primary-color)] text-[var(--color-fixed-light-color)] hover:bg-[var(--color-primary-hover-color)]",
        positive:
          "bg-[var(--color-positive-color)] text-[var(--color-fixed-light-color)] hover:bg-[var(--color-positive-color-hover)]",
        negative:
          "bg-[var(--color-negative-color)] text-[var(--color-fixed-light-color)] hover:bg-[var(--color-negative-color-hover)]",
        // Warning is yellow — Figma binds the dark fixed text instead of white.
        warning:
          "bg-[var(--color-warning-color)] text-[var(--color-fixed-dark-color)] hover:bg-[var(--color-warning-color-hover)]",
        // Subtle — tinted backgrounds with saturated brand-tone text per Figma.
        "primary-subtle":
          "bg-[var(--color-primary-selected-color)] text-[var(--color-blue-text-on-primary)] hover:bg-[var(--color-primary-selected-hover-color)]",
        "positive-subtle":
          "bg-[var(--color-positive-color-selected)] text-[var(--color-Green-text-on-primary)] hover:bg-[var(--color-positive-color-selected-hover)]",
        "negative-subtle":
          "bg-[var(--color-negative-color-selected)] text-[var(--color-red-text-on-primary)] hover:bg-[var(--color-negative-color-selected-hover)]",
        "warning-subtle":
          "bg-[var(--color-warning-color-selected)] text-[var(--color-orange-text-on-primary)] hover:bg-[var(--color-warning-color-selected-hover)]",
        // On-* — saturated background plus a same-as-canvas border for placement
        // on top of a matching tinted surface. No hover.
        "on-primary":
          "bg-[var(--color-primary-color)] text-[var(--color-fixed-light-color)] border border-[var(--color-primary-background-color)]",
        "on-positive":
          "bg-[var(--color-positive-color)] text-[var(--color-fixed-light-color)] border border-[var(--color-primary-background-color)]",
        "on-negative":
          "bg-[var(--color-negative-color)] text-[var(--color-fixed-light-color)] border border-[var(--color-primary-background-color)]",
        "on-warning":
          "bg-[var(--color-warning-color)] text-[var(--color-fixed-dark-color)] border border-[var(--color-primary-background-color)]",
      },
      // When a close button is present, the padding on the close-button
      // side shrinks so the icon's hit area sits flush with the chip edge.
      closeSlot: {
        none: "px-2",
        right: "pl-2 pr-1",
        left: "pl-1 pr-2",
      },
      disabled: {
        true: "pointer-events-none",
        false: "",
      },
    },
    compoundVariants: [
      { size: "sm", closeSlot: "none", class: "px-1.5" },
      { size: "sm", closeSlot: "right", class: "pl-1.5 pr-0.5" },
      { size: "sm", closeSlot: "left", class: "pl-0.5 pr-1.5" },
      // Disabled overrides every type's bg + text + border via tokens.
      // Listed last so it wins against the `type` rules above.
      {
        disabled: true,
        class:
          "bg-[var(--color-disabled-background-color)] text-[var(--color-disabled-text-color)] border-transparent hover:bg-[var(--color-disabled-background-color)]",
      },
    ],
    defaultVariants: {
      size: "md",
      type: "default",
      closeSlot: "none",
      disabled: false,
    },
  },
)

type ChipVariants = VariantProps<typeof chip>

export type ChipType = NonNullable<ChipVariants["type"]>

export type ChipProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> &
  Pick<ChipVariants, "type" | "size"> & {
    /** Chip label. */
    children: ReactNode
    /** Icon rendered inside the chip. */
    icon?: IconName
    /** Side the icon sits on. Defaults to "left". */
    iconPosition?: "left" | "right"
    /** Custom avatar element (typically `<Avatar size="xs" />`). */
    avatar?: ReactNode
    /** Side the avatar sits on. Defaults to "left". */
    avatarPosition?: "left" | "right"
    /** When provided, renders a dismiss button after the label. */
    onClose?: (event: MouseEvent<HTMLButtonElement>) => void
    /** Side the close button sits on. Defaults to "right". */
    closePosition?: "left" | "right"
    /** Accessible label for the close button. Defaults to "Remove". */
    closeLabel?: string
    /** Visually dim the chip and drop pointer interactions. */
    disabled?: boolean
  }

export const Chip = forwardRef<HTMLSpanElement, ChipProps>(function Chip(
  {
    children,
    size = "md",
    type = "default",
    icon,
    iconPosition = "left",
    avatar,
    avatarPosition = "left",
    onClose,
    closePosition = "right",
    closeLabel = "Remove",
    disabled = false,
    className,
    ...rest
  },
  ref,
) {
  const closeSlot: ChipVariants["closeSlot"] = onClose ? closePosition : "none"
  const iconSize = size === "sm" ? "2xs" : "xs"
  const labelLeading = size === "sm" ? "leading-4" : "leading-5"

  const closeButton = onClose ? (
    <button
      type="button"
      onClick={onClose}
      disabled={disabled}
      aria-label={closeLabel}
      className={cn(
        "inline-flex items-center justify-center size-4 rounded-sm shrink-0 cursor-pointer",
        // Inherit chip foreground via currentColor so the X tracks the type.
        "text-current",
        "hover:bg-[var(--color-primary-background-hover-color)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-color)]",
      )}
    >
      <Icon name="x-mark-small" size="2xs" aria-hidden />
    </button>
  ) : null

  return (
    <span
      ref={ref}
      data-disabled={disabled || undefined}
      className={cn(chip({ size, type, closeSlot, disabled }), className)}
      {...rest}
    >
      {closeButton && closePosition === "left" ? closeButton : null}
      {avatar && avatarPosition === "left" ? (
        <span className="inline-flex items-center shrink-0">{avatar}</span>
      ) : null}
      {icon && iconPosition === "left" ? (
        <Icon name={icon} size={iconSize} aria-hidden />
      ) : null}
      <span className={cn("inline-flex items-center overflow-clip", labelLeading)}>{children}</span>
      {icon && iconPosition === "right" ? (
        <Icon name={icon} size={iconSize} aria-hidden />
      ) : null}
      {avatar && avatarPosition === "right" ? (
        <span className="inline-flex items-center shrink-0">{avatar}</span>
      ) : null}
      {closeButton && closePosition === "right" ? closeButton : null}
    </span>
  )
})
