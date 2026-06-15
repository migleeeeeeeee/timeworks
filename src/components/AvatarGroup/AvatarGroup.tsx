import { cva, type VariantProps } from "class-variance-authority"
import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  type HTMLAttributes,
  type ReactElement,
} from "react"
import { cn } from "../../lib/cn"
import { type AvatarProps } from "../Avatar"

/**
 * AvatarGroup — sourced from the TimeWorks Figma file
 * (page "AvatarGroup", node 46939:90057).
 *
 *   <AvatarGroup max={3}>
 *     <Avatar src="/a.png" alt="Ada" />
 *     <Avatar src="/b.png" alt="Ben" />
 *     <Avatar src="/c.png" alt="Cal" />
 *     <Avatar initials="DK" />
 *     ...
 *   </AvatarGroup>
 *
 * Stacks Avatar children with overlap, then renders a +N counter when the
 * child count exceeds `max`. Size and disabled propagate to children so the
 * group reads as a single unit. Children must be direct Avatar elements
 * (or a fragment of them) — wrapping them in another component hides them
 * from `Children.toArray`, breaking `max` and `size` propagation.
 */

/**
 * Counter chip mirrors the Avatar's two-layer structure:
 *   outer  →  solid white backing + 2px outside stroke (`ring-2`); never
 *             dims, masks the avatar behind in the overlap region.
 *   inner  →  the tone background (light / dark / disabled palette) + text.
 */
const counterOuter = cva(
  "relative inline-flex shrink-0 rounded-full bg-[var(--color-primary-background-color)] ring-1 ring-[var(--color-primary-background-color)]",
  {
    variants: {
      size: {
        xs: "h-5",
        sm: "h-6",
        md: "size-8",
        lg: "size-12",
      },
    },
    defaultVariants: { size: "md" },
  },
)

const counterInner = cva(
  "inline-flex size-full items-center justify-center rounded-full font-body whitespace-nowrap px-2",
  {
    variants: {
      size: {
        xs: "text-t3 font-semibold",
        sm: "text-t2",
        md: "text-t2",
        lg: "text-t2",
      },
      tone: {
        light: "bg-[var(--color-ui-background-color)] text-[var(--color-primary-text-color)]",
        dark: "bg-[var(--color-inverted-color-background)] text-[var(--color-text-color-on-inverted)]",
        disabled:
          "bg-[var(--color-disabled-background-color)] text-[var(--color-disabled-text-color)]",
      },
    },
    defaultVariants: { size: "md", tone: "light" },
  },
)

const OVERLAP: Record<NonNullable<AvatarGroupSize>, string> = {
  xs: "-mr-2",
  sm: "-mr-2",
  md: "-mr-2",
  lg: "-mr-3",
}

type AvatarGroupSize = "xs" | "sm" | "md" | "lg"
type CounterVariants = VariantProps<typeof counterInner>

export type AvatarGroupProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  /** Avatar children. Non-Avatar children are rendered as-is. */
  children: React.ReactNode
  /** Maximum avatars to show before collapsing the rest into a +N counter. */
  max?: number
  /** Override the counter text (e.g. "+99"). Defaults to `+{remaining}`. */
  counterText?: string
  /** Propagates `disabled` to all child Avatars (each dims to 40%) and switches the counter to the disabled palette — light gray bg + dimmed text — for both light and dark themes. */
  disabled?: boolean
  /** Visual theme for the counter chip. Avatars themselves are theme-agnostic. */
  theme?: "light" | "dark"
  size?: AvatarGroupSize
}

export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  function AvatarGroup(
    {
      children,
      max,
      counterText,
      disabled = false,
      theme = "light",
      size = "md",
      className,
      ...rest
    },
    ref,
  ) {
    const all = Children.toArray(children).filter(isValidElement)
    const visible = typeof max === "number" ? all.slice(0, max) : all
    const remaining = typeof max === "number" ? Math.max(all.length - max, 0) : 0
    const showCounter = remaining > 0 || counterText !== undefined
    const overlap = OVERLAP[size]
    const tone: CounterVariants["tone"] = disabled
      ? "disabled"
      : theme === "dark"
        ? "dark"
        : "light"

    return (
      <div
        ref={ref}
        data-disabled={disabled || undefined}
        className={cn("inline-flex items-center", className)}
        {...rest}
      >
        {visible.map((child, i) => {
          const element = child as ReactElement<AvatarProps>
          const isLast = i === visible.length - 1 && !showCounter
          const cloned = cloneElement(element, {
            size: element.props.size ?? size,
            disabled: disabled || element.props.disabled,
          } as Partial<AvatarProps>)
          return (
            <span
              key={element.key ?? i}
              className={cn("inline-flex shrink-0", !isLast && overlap)}
            >
              {cloned}
            </span>
          )
        })}
        {showCounter && (
          <span className={cn(counterOuter({ size }))}>
            <span className={cn(counterInner({ size, tone }))}>
              {counterText ?? `+${remaining}`}
            </span>
          </span>
        )}
      </div>
    )
  },
)
