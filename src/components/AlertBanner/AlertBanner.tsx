import { cva, type VariantProps } from "class-variance-authority"
import { forwardRef, type HTMLAttributes, type ReactNode } from "react"
import { cn } from "../../lib/cn"
import { Button, type ButtonProps } from "../Button"
import { Icon } from "../Icon"
import { Link } from "../Link"

/**
 * AlertBanner — sourced from the TimeWorks Figma file
 * (page "Alert banner", node 46939:87328).
 *
 *   <AlertBanner type="primary" cta={{ label: "Learn more" }} onDismiss={...}>
 *     System maintenance starts at 8 PM.
 *   </AlertBanner>
 *
 * High-signal banner for system messages. Always 40px tall, full-width;
 * the dismiss icon sits on the right and is rendered as a 20px Icon wrapper
 * (matching the Figma "Icon Wrapper" anatomy). The optional inline action
 * pill is a Button-shaped element with the banner's intent color reversed.
 */

const root = cva(
  "flex items-center gap-2 px-4 h-10 w-full",
  {
    variants: {
      type: {
        primary: "bg-[var(--color-primary-color)] text-[var(--color-text-color-on-primary)]",
        positive: "bg-[var(--color-positive-color)] text-[var(--color-fixed-light-color)]",
        negative: "bg-[var(--color-negative-color)] text-[var(--color-fixed-light-color)]",
        warning: "bg-[var(--color-warning-color)] text-[var(--color-fixed-dark-color)]",
        dark: "bg-[var(--color-inverted-color-background)] text-[var(--color-text-color-on-inverted)]",
      },
    },
    defaultVariants: { type: "primary" },
  },
)

type RootVariants = VariantProps<typeof root>

const ACTION_COLOR: Record<NonNullable<RootVariants["type"]>, ButtonProps["color"]> = {
  primary: "on-primary",
  positive: "on-positive",
  negative: "on-negative",
  warning: "on-warning",
  dark: "on-inverted",
}

export type AlertBannerCta = {
  label: string
  href?: string
  onClick?: () => void
}

export type AlertBannerAction = {
  label: string
  onClick?: () => void
}

export type AlertBannerProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> &
  RootVariants & {
    /** The banner message. */
    children: ReactNode
    /** Optional inline link CTA (rendered as an underlined link in the message). */
    cta?: AlertBannerCta
    /** Optional inline action button (rendered as a small pill). */
    action?: AlertBannerAction
    /** When provided, shows the dismiss icon. Called when the user clicks it. */
    onDismiss?: () => void
    /** Accessible label for the dismiss icon. Defaults to "Dismiss". */
    dismissLabel?: string
  }

export const AlertBanner = forwardRef<HTMLDivElement, AlertBannerProps>(function AlertBanner(
  {
    className,
    type = "primary",
    children,
    cta,
    action,
    onDismiss,
    dismissLabel = "Dismiss",
    ...rest
  },
  ref,
) {
  return (
    <div ref={ref} role="status" className={cn(root({ type }), className)} {...rest}>
      <div className="flex flex-1 items-center justify-center gap-2 min-w-0 text-center text-t2">
        <span className="truncate">{children}</span>
        {cta && (
          <Link
            size="sm"
            surface={type === "warning" ? "default" : "inverted"}
            href={cta.href ?? "#"}
            onClick={
              cta.onClick
                ? (e) => {
                    if (!cta.href) e.preventDefault()
                    cta.onClick?.()
                  }
                : undefined
            }
            className={cn("shrink-0 underline", type === "warning" && "text-current")}
          >
            {cta.label}
          </Link>
        )}
        {action && (
          <Button
            kind="primary"
            size="xs"
            color={ACTION_COLOR[type ?? "primary"]}
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        )}
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label={dismissLabel}
          className="inline-flex items-center justify-center shrink-0 size-5 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-fixed-light-color)] focus-visible:ring-offset-2"
        >
          <Icon name="x-mark-small" size="sm" className="text-current p-[2px]" />
        </button>
      )}
    </div>
  )
})
