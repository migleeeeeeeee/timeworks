import { cva, type VariantProps } from "class-variance-authority"
import { forwardRef, type HTMLAttributes, type ReactNode } from "react"
import { cn } from "../../lib/cn"
import { Button } from "../Button"
import { Icon, type IconProps } from "../Icon"
import { IconButton } from "../IconButton"
import { Link } from "../Link"
import type { IconName } from "../../icons/names"

/**
 * AttentionBox — sourced from the TimeWorks Figma file
 * (page "Attention Box", node 46939:7881).
 *
 *   <AttentionBox type="primary" title="Heads up" cta={{ label: "Read more" }}>
 *     This action will cause your team to lose access...
 *   </AttentionBox>
 *
 * Inline content card for in-flow messages. Distinct from AlertBanner —
 * AttentionBox sits inside page content (rounded, padded, tinted), AlertBanner
 * sits at the top of the viewport (full-width, 40px tall).
 *
 * Layout has two modes:
 *   - default (compact=false): leading icon, stacked title/body/CTA column.
 *   - compact (compact=true):  single 20px row with leading icon, body
 *     (truncated), and trailing CTAs / dismiss.
 */

const root = cva(
  "rounded-md w-full",
  {
    variants: {
      type: {
        primary: "bg-[var(--color-primary-selected-color)] text-[var(--color-primary-text-color)]",
        neutral: "bg-[var(--color-allgrey-background-color)] text-[var(--color-primary-text-color)]",
        positive: "bg-[var(--color-positive-color-selected)] text-[var(--color-primary-text-color)]",
        warning: "bg-[var(--color-warning-color-selected)] text-[var(--color-primary-text-color)]",
        negative: "bg-[var(--color-negative-color-selected)] text-[var(--color-primary-text-color)]",
      },
      compact: {
        true: "flex items-center gap-8 px-4 py-3",
        false: "flex items-start gap-1 px-4 py-3",
      },
    },
    defaultVariants: { type: "primary", compact: false },
  },
)

const DEFAULT_ICON: Record<NonNullable<RootVariants["type"]>, IconName> = {
  primary: "circle-info",
  neutral: "star",
  positive: "thumbs-up",
  warning: "circle-info",
  negative: "triangle-exclamation",
}

type RootVariants = VariantProps<typeof root>

export type AttentionBoxCta = {
  label: string
  href?: string
  onClick?: () => void
}

export type AttentionBoxAction = {
  label: string
  onClick?: () => void
}

export type AttentionBoxProps = Omit<HTMLAttributes<HTMLDivElement>, "children" | "title"> &
  RootVariants & {
    /** Body message. Required. */
    children: ReactNode
    /** Optional bold title (default layout only — ignored when compact). */
    title?: ReactNode
    /** Optional inline link CTA. */
    cta?: AttentionBoxCta
    /** Optional inline button CTA. */
    action?: AttentionBoxAction
    /** Show the leading status icon. Defaults to true. */
    withIcon?: boolean
    /** Override the leading icon. Defaults to a per-type pick. */
    icon?: IconProps["name"]
    /** When provided, shows the dismiss icon. Called when the user clicks it. */
    onDismiss?: () => void
    /** Accessible label for the dismiss icon. Defaults to "Dismiss". */
    dismissLabel?: string
  }

export const AttentionBox = forwardRef<HTMLDivElement, AttentionBoxProps>(function AttentionBox(
  {
    className,
    type = "primary",
    compact = false,
    title,
    children,
    cta,
    action,
    withIcon = true,
    icon,
    onDismiss,
    dismissLabel = "Dismiss",
    ...rest
  },
  ref,
) {
  const resolvedIcon = icon ?? DEFAULT_ICON[type ?? "primary"]
  const role = type === "negative" || type === "warning" ? "alert" : "status"

  const dismiss = onDismiss ? (
    <IconButton
      kind="tertiary"
      size="xs"
      icon="x-mark-small"
      aria-label={dismissLabel}
      onClick={onDismiss}
      className="text-current"
    />
  ) : null

  const ctas = (cta || action) ? (
    <div
      className={cn(
        "flex items-center shrink-0",
        compact ? "gap-3" : "gap-4 pt-2 pr-4 w-full",
      )}
    >
      {cta && (
        <Link
          size="sm"
          surface="on-tinted"
          href={cta.href ?? "#"}
          onClick={
            cta.onClick
              ? (e) => {
                  if (!cta.href) e.preventDefault()
                  cta.onClick?.()
                }
              : undefined
          }
          className="shrink-0"
        >
          {cta.label}
        </Link>
      )}
      {action && (
        <Button kind="secondary" size="sm" color="on-inverted" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  ) : null

  if (compact) {
    return (
      <div ref={ref} role={role} className={cn(root({ type, compact: true }), className)} {...rest}>
        <div className="flex flex-1 min-w-0 items-center gap-1">
          {withIcon && (
            <Icon name={resolvedIcon} size="sm" className="shrink-0 text-current" />
          )}
          <p className="flex-1 min-w-0 truncate text-t2 font-body text-current">{children}</p>
        </div>
        {ctas}
        {dismiss}
      </div>
    )
  }

  return (
    <div ref={ref} role={role} className={cn(root({ type, compact: false }), className)} {...rest}>
      {withIcon && (
        <Icon name={resolvedIcon} size="sm" className="shrink-0 mt-px text-current" />
      )}
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <div className="flex items-start gap-2 w-full">
          <div className="flex-1 min-w-0 flex flex-col gap-1">
            {title && (
              <p className="text-t1 font-body font-semibold leading-[22px] text-current">
                {title}
              </p>
            )}
            <p className="text-t2 font-body text-current pr-2">{children}</p>
          </div>
          {dismiss}
        </div>
        {ctas}
      </div>
    </div>
  )
})
