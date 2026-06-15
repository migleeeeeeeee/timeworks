import { cva, type VariantProps } from "class-variance-authority"
import { forwardRef, type HTMLAttributes, type ReactNode } from "react"
import { cn } from "../../lib/cn"
import { Icon } from "../Icon"
import type { IconName } from "../../icons/names"

/**
 * Toast — sourced from the TimeWorks Figma file
 * (page "Toast", node 46939:7920; component set 46949:39726).
 *
 *   <Toast type="primary" cta={{ label: "Undo" }} onDismiss={...}>
 *     Item moved to trash
 *   </Toast>
 *
 * 48px-tall pill-shaped notification with a leading intent icon, message,
 * optional underlined link, optional outlined action button, and a dismiss
 * icon. When `loading` is true the action + link are suppressed and a spinner
 * replaces them. Visual unit only — pair with `@radix-ui/react-toast`
 * (Provider + Viewport) for queueing, auto-dismiss, and swipe behavior.
 */

const root = cva(
  [
    "inline-flex items-center h-12 px-4 py-2 rounded-sm shadow-[var(--shadow-md)]",
    "max-w-full",
  ].join(" "),
  {
    variants: {
      type: {
        primary: "bg-[var(--color-primary-color)] text-[var(--color-text-color-on-primary)]",
        negative: "bg-[var(--color-negative-color)] text-[var(--color-fixed-light-color)]",
        positive: "bg-[var(--color-positive-color)] text-[var(--color-fixed-light-color)]",
        warning: "bg-[var(--color-warning-color)] text-[var(--color-fixed-dark-color)]",
        dark: "bg-[var(--color-inverted-color-background)] text-[var(--color-text-color-on-inverted)]",
      },
    },
    defaultVariants: { type: "primary" },
  },
)

const actionButton = cva(
  [
    "inline-flex items-center justify-center shrink-0 select-none whitespace-nowrap cursor-pointer",
    "h-8 px-2 rounded-sm text-t2 font-body bg-transparent",
    "border border-solid border-current text-current",
    "transition-colors duration-[120ms] ease-out",
    "hover:bg-[rgba(255,255,255,0.12)]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-2",
  ].join(" "),
  {
    variants: {
      type: {
        primary: "focus-visible:ring-offset-[var(--color-primary-color)]",
        negative: "focus-visible:ring-offset-[var(--color-negative-color)]",
        positive: "focus-visible:ring-offset-[var(--color-positive-color)]",
        warning:
          "focus-visible:ring-offset-[var(--color-warning-color)] hover:bg-[rgba(0,0,0,0.08)]",
        dark: "focus-visible:ring-offset-[var(--color-inverted-color-background)]",
      },
    },
    defaultVariants: { type: "primary" },
  },
)

const dismissButton = cva(
  [
    "inline-flex items-center justify-center shrink-0 size-8 rounded-sm cursor-pointer text-current",
    "hover:bg-[rgba(255,255,255,0.12)]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-2",
  ].join(" "),
  {
    variants: {
      type: {
        primary: "focus-visible:ring-offset-[var(--color-primary-color)]",
        negative: "focus-visible:ring-offset-[var(--color-negative-color)]",
        positive: "focus-visible:ring-offset-[var(--color-positive-color)]",
        warning:
          "focus-visible:ring-offset-[var(--color-warning-color)] hover:bg-[rgba(0,0,0,0.08)]",
        dark: "focus-visible:ring-offset-[var(--color-inverted-color-background)]",
      },
    },
    defaultVariants: { type: "primary" },
  },
)

type RootVariants = VariantProps<typeof root>
export type ToastType = NonNullable<RootVariants["type"]>

const TYPE_ICON: Record<ToastType, IconName> = {
  primary: "circle-info",
  negative: "triangle-exclamation",
  positive: "check",
  warning: "circle-info",
  dark: "circle-info",
}

export type ToastCta = {
  label: string
  href?: string
  onClick?: () => void
}

export type ToastAction = {
  label: string
  onClick?: () => void
}

export type ToastProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> &
  RootVariants & {
    /** Toast message body. */
    children: ReactNode
    /** Optional inline link (rendered as an underlined CTA after the message). */
    cta?: ToastCta
    /** Optional outlined action button rendered before the dismiss icon. */
    action?: ToastAction
    /** When true, hides cta/action and shows a spinning loader before the dismiss icon. */
    loading?: boolean
    /** When provided, shows the dismiss icon. Called when the user clicks it. */
    onDismiss?: () => void
    /** Accessible label for the dismiss icon. Defaults to "Dismiss". */
    dismissLabel?: string
  }

export const Toast = forwardRef<HTMLDivElement, ToastProps>(function Toast(
  {
    className,
    type = "primary",
    children,
    cta,
    action,
    loading = false,
    onDismiss,
    dismissLabel = "Dismiss",
    ...rest
  },
  ref,
) {
  const showAction = !loading && action
  const showCta = !loading && cta
  const iconName = TYPE_ICON[type ?? "primary"]
  return (
    <div ref={ref} role="status" aria-live="polite" className={cn(root({ type }), className)} {...rest}>
      <div className="flex items-center gap-6 grow min-w-0">
        <div className="flex items-center gap-4 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <Icon name={iconName} size="sm" className="text-current p-[2px]" />
            <span className="text-t2 font-body whitespace-nowrap overflow-hidden text-ellipsis">
              {children}
            </span>
          </div>
          {showCta && (
            <a
              href={cta.href ?? "#"}
              onClick={
                cta.onClick
                  ? (e) => {
                      if (!cta.href) e.preventDefault()
                      cta.onClick?.()
                    }
                  : undefined
              }
              className="shrink-0 text-t2 font-body text-current underline [text-decoration-skip-ink:none] whitespace-nowrap rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
            >
              {cta.label}
            </a>
          )}
        </div>
        <div className="flex items-center justify-end gap-4 shrink-0 ml-auto">
          {showAction && (
            <button type="button" onClick={action.onClick} className={actionButton({ type })}>
              {action.label}
            </button>
          )}
          {loading && (
            <Icon
              name="loader"
              size="xs"
              className="text-current p-0 animate-spin"
              aria-label="Loading"
            />
          )}
          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              aria-label={dismissLabel}
              className={dismissButton({ type })}
            >
              <Icon name="x-mark-small" size="sm" className="text-current p-[2px]" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
})
