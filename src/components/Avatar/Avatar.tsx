import { cva, type VariantProps } from "class-variance-authority"
import { forwardRef, type HTMLAttributes } from "react"
import type { IconName } from "../../icons/names"
import { cn } from "../../lib/cn"
import { Icon } from "../Icon"

/**
 * Avatar — sourced from the TimeWorks Figma file
 * (page "Avatar", node 46939:89419).
 *
 *   <Avatar type="img" src="/me.png" alt="Riley" />
 *   <Avatar type="initials" initials="RM" />
 *   <Avatar type="letter" letter="F" />
 *   <Avatar type="icon" icon="gift" />
 *
 * Maps the Figma matrix (Size × Type × Disabled) onto a cva-driven API.
 * IMG / Initials are circular; Letter and Icon are rounded squares with
 * tinted backgrounds (working-orange / done-green) per the Figma spec.
 */

/**
 * Two-layer structure:
 *   outer  →  solid white backing (`--color-primary-background-color`) + a 2px outside
 *             stroke (`ring-2`, no inset → grows the visible footprint by
 *             2px on each side). Both stay full-opacity so stacked avatars
 *             in an AvatarGroup keep a crisp boundary and the white
 *             backing fully masks the avatars behind.
 *   inner  →  bg + image (the "person"). Only this layer dims to 40% when
 *             `disabled`, so you can't see through to whatever sits behind.
 */
const outer = cva(
  "relative inline-flex shrink-0 bg-[var(--color-primary-background-color)] ring-1 ring-[var(--color-primary-background-color)]",
  {
    variants: {
      size: {
        xs: "size-[18px]",
        sm: "size-6",
        md: "size-8",
        lg: "size-12",
      },
      type: {
        img: "rounded-full",
        initials: "rounded-full",
        letter: "rounded-sm",
        icon: "rounded-sm",
      },
    },
    defaultVariants: { size: "md", type: "img" },
  },
)

const inner = cva(
  "inline-flex size-full items-center justify-center overflow-hidden",
  {
    variants: {
      size: {
        xs: "text-t3",
        sm: "text-t3",
        md: "text-t1",
        lg: "text-h3",
      },
      type: {
        img: "rounded-full bg-[var(--color-ui-background-color)]",
        initials:
          "rounded-full bg-[var(--color-primary-color)] text-[var(--color-text-color-on-primary)]",
        letter:
          "rounded-sm bg-[var(--color-working_orange)] text-[var(--color-text-color-on-inverted)]",
        icon: "rounded-sm bg-[var(--color-done-green)] text-[var(--color-text-color-on-inverted)]",
      },
      disabled: {
        true: "opacity-40",
        false: "",
      },
    },
    defaultVariants: { size: "md", type: "img", disabled: false },
  },
)

const ICON_SIZE = {
  xs: "2xs",
  sm: "xs",
  md: "sm",
  lg: "md",
} as const

type RootVariants = VariantProps<typeof inner>

export type AvatarProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> &
  Omit<RootVariants, "disabled"> & {
    /** When type="img", the image source. */
    src?: string
    /** Alt text for the image; also used as a fallback aria-label. */
    alt?: string
    /** When type="initials", typically two characters (e.g. "RM"). */
    initials?: string
    /** When type="letter", a single character (e.g. "F"). */
    letter?: string
    /** When type="icon", the icon to render at the center. */
    icon?: IconName
    /** Dims the inner container (image + background + stroke) to 40% opacity. The outer backing stays solid so adjacent avatars in an AvatarGroup can't show through. */
    disabled?: boolean
  }

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  {
    className,
    size,
    type = "img",
    src,
    alt,
    initials,
    letter,
    icon,
    disabled = false,
    "aria-label": ariaLabel,
    ...rest
  },
  ref,
) {
  const resolvedSize = size ?? "md"
  const label =
    ariaLabel ??
    alt ??
    (type === "initials" ? initials : type === "letter" ? letter : undefined)

  return (
    <span
      ref={ref}
      role={label ? "img" : undefined}
      aria-label={label}
      data-disabled={disabled || undefined}
      className={cn(outer({ size: resolvedSize, type }), className)}
      {...rest}
    >
      <span className={inner({ size: resolvedSize, type, disabled })}>
        {type === "img" && src && (
          <img src={src} alt={alt ?? ""} className="size-full object-cover" />
        )}
        {type === "initials" && (
          <span className="font-body font-medium leading-none">{initials}</span>
        )}
        {type === "letter" && (
          <span className="font-body font-medium leading-none">{letter?.[0]}</span>
        )}
        {type === "icon" && icon && (
          <Icon name={icon} size={ICON_SIZE[resolvedSize]} className="text-current p-0" />
        )}
      </span>
    </span>
  )
})
