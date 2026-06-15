import * as RadixTooltip from "@radix-ui/react-tooltip"
import { cva, type VariantProps } from "class-variance-authority"
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type ReactNode,
} from "react"
import { Icon } from "../Icon"
import type { IconName } from "../../icons/names"
import { cn } from "../../lib/cn"

/**
 * Tooltip — sourced from the TimeWorks Figma file
 * (page "Tooltip", node 46939:7922). Built on @radix-ui/react-tooltip so
 * focus management, hover/focus delays, portaling, collision avoidance and
 * keyboard dismissal are handled by Radix.
 *
 *   <Tooltip>
 *     <TooltipTrigger asChild><Button>Hover</Button></TooltipTrigger>
 *     <TooltipContent side="top">Tooltip label</TooltipContent>
 *   </Tooltip>
 *
 * Variants follow the Figma "Variants & States" frame on the Tooltip page:
 *   - side       : top / right / bottom / left (Radix `side`)
 *   - theme      : default (dark bg) / on-dark (white on dark surface) /
 *                  on-black (white on black surface)
 *   - maxWidth   : 240 by default, override via `maxWidth` prop
 *   - title      : optional title row (with optional leading icon)
 *   - image      : optional media slot above the text
 *   - children   : body text (or any ReactNode — Link, etc.)
 *
 * The `Tooltip.Provider` is exposed as `TooltipProvider`. Wrap your app
 * once in a provider so tooltip delays are coordinated; if omitted the
 * component supplies its own provider with the default delay.
 */

export const TooltipProvider = RadixTooltip.Provider
export const TooltipTrigger = RadixTooltip.Trigger
export const TooltipPortal = RadixTooltip.Portal

export type TooltipTheme = "default" | "on-dark" | "on-black"
export type TooltipSide = "top" | "right" | "bottom" | "left"

const content = cva(
  [
    "z-50 inline-flex max-w-(--ttip-max-width) overflow-hidden rounded-sm",
    "shadow-[var(--shadow-sm)]",
    "data-[state=delayed-open]:animate-in data-[state=closed]:animate-out",
    "data-[state=closed]:fade-out-0 data-[state=delayed-open]:fade-in-0",
    "data-[state=closed]:zoom-out-95 data-[state=delayed-open]:zoom-in-95",
    "data-[side=top]:slide-in-from-bottom-1 data-[side=bottom]:slide-in-from-top-1",
    "data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1",
  ].join(" "),
  {
    variants: {
      theme: {
        "default": "bg-[var(--color-inverted-color-background)] text-[var(--color-text-color-on-inverted)]",
        "on-dark": "bg-[var(--color-primary-background-color)] text-[var(--color-primary-text-color)]",
        "on-black": "bg-[var(--color-primary-background-color)] text-[var(--color-fixed-dark-color)]",
      },
    },
    defaultVariants: { theme: "default" },
  },
)

const arrow = cva("", {
  variants: {
    theme: {
      "default": "fill-[var(--color-inverted-color-background)]",
      "on-dark": "fill-[var(--color-primary-background-color)]",
      "on-black": "fill-[var(--color-primary-background-color)]",
    },
  },
  defaultVariants: { theme: "default" },
})

/* ──────────────────────────────  Root  ──────────────────────────────── */

export type TooltipProps = ComponentPropsWithoutRef<typeof RadixTooltip.Root>

/**
 * Root wrapper — supplies a Provider when one is not already present in the tree
 * so consumers can drop a single <Tooltip> in without boilerplate.
 */
export function Tooltip(props: TooltipProps) {
  return (
    <RadixTooltip.Provider delayDuration={200} skipDelayDuration={300}>
      <RadixTooltip.Root {...props} />
    </RadixTooltip.Provider>
  )
}

/* ─────────────────────────────  Content  ────────────────────────────── */

type ContentVariant = NonNullable<VariantProps<typeof content>["theme"]>

export type TooltipContentProps = Omit<
  ComponentPropsWithoutRef<typeof RadixTooltip.Content>,
  "side"
> & {
  /** Visual theme. `default` = dark bg, `on-dark`/`on-black` = light bg for use over dark surfaces. */
  theme?: ContentVariant
  /** Side relative to the trigger — drives both placement and the arrow position. */
  side?: TooltipSide
  /** Maximum content width in pixels. Default 240. */
  maxWidth?: number
  /** Optional title row rendered above the body. */
  title?: ReactNode
  /** Optional leading icon for the title row. */
  titleIcon?: IconName
  /** Optional media slot rendered above the text. */
  image?: ReactNode
  /** Hide the arrow. Default false. */
  hideArrow?: boolean
}

export const TooltipContent = forwardRef<
  ElementRef<typeof RadixTooltip.Content>,
  TooltipContentProps
>(function TooltipContent(
  {
    theme = "default",
    side = "bottom",
    maxWidth = 240,
    title,
    titleIcon,
    image,
    hideArrow = false,
    sideOffset = 8,
    className,
    style,
    children,
    ...rest
  },
  ref,
) {
  return (
    <RadixTooltip.Portal>
      <RadixTooltip.Content
        ref={ref}
        side={side}
        sideOffset={sideOffset}
        collisionPadding={8}
        className={cn(content({ theme }), "flex-col", className)}
        style={{ ["--ttip-max-width" as string]: `${maxWidth}px`, ...style }}
        {...rest}
      >
        {image != null && (
          <div className="flex w-full overflow-hidden">{image}</div>
        )}
        <div className="flex flex-col gap-1 px-4 py-2">
          {title != null && (
            <div className="flex items-center gap-1 text-t2 font-bold leading-5">
              {titleIcon && <Icon name={titleIcon} size="sm" aria-hidden="true" />}
              <span>{title}</span>
            </div>
          )}
          {children != null && (
            <div className="text-t2 leading-5">{children}</div>
          )}
        </div>
        {!hideArrow && (
          <RadixTooltip.Arrow
            width={16}
            height={8}
            className={arrow({ theme })}
          />
        )}
      </RadixTooltip.Content>
    </RadixTooltip.Portal>
  )
})
