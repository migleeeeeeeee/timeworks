import { forwardRef, type ComponentPropsWithoutRef } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/cn"
import { ICON_SVG } from "../../icons/registry"
import type { IconName } from "../../icons/names"

/**
 * Icon — renders one of the 301 icons sourced from the TimeWorks Figma
 * "Icons" page (node 25320:50806). Each SVG is normalised to use
 * `fill="currentColor"` so color is driven by the parent's text color.
 *
 * Sizes match the Figma "Icon Wrapper" component (node 25320:54477):
 *   2xs → 12px,  xs → 16px,  sm → 20px,  md → 24px,  lg → 32px
 *
 * The wrapper is a `span` with the wrapper sizing rules from Figma; the inner
 * SVG fills it. Pass `className` to override color (e.g. text-[var(--color-primary-color)]).
 */

const wrapper = cva(
  "inline-flex items-center justify-center shrink-0 text-[var(--color-icon-color)] [&>svg]:h-full [&>svg]:w-full",
  {
    variants: {
      size: {
        "2xs": "size-3 p-[2px]",
        xs: "size-4 p-[2px]",
        sm: "size-5 p-[2px]",
        md: "size-6 p-[2px]",
        lg: "size-8 p-[2px]",
      },
    },
    defaultVariants: { size: "md" },
  },
)

type WrapperVariants = VariantProps<typeof wrapper>

export type IconProps = WrapperVariants &
  Omit<ComponentPropsWithoutRef<"span">, "children"> & {
    name: IconName
    "aria-label"?: string
  }

export const Icon = forwardRef<HTMLSpanElement, IconProps>(function Icon(
  { name, size, className, "aria-label": ariaLabel, role, ...rest },
  ref,
) {
  const svg = ICON_SVG[name]
  const decorative = !ariaLabel
  return (
    <span
      ref={ref}
      role={role ?? (decorative ? undefined : "img")}
      aria-label={ariaLabel}
      aria-hidden={decorative ? true : undefined}
      className={cn(wrapper({ size }), className)}
      // SVGs are pre-built at build-time from local FA Pro assets and contain no user content.
      dangerouslySetInnerHTML={{ __html: svg }}
      {...rest}
    />
  )
})
