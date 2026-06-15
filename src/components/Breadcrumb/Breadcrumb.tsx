import {
  cloneElement,
  forwardRef,
  Fragment,
  isValidElement,
  type AnchorHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from "react"
import { cva } from "class-variance-authority"
import { cn } from "../../lib/cn"
import { Icon } from "../Icon"
import type { IconName } from "../../icons/names"

/**
 * Breadcrumb — sourced from the TimeWorks Figma file
 * (page "Breadcrumb", node 46939:90935).
 *
 *   <Breadcrumb>
 *     <BreadcrumbItem href="/" icon="home-fill">Workspace</BreadcrumbItem>
 *     <BreadcrumbItem href="/projects">Projects</BreadcrumbItem>
 *     <BreadcrumbItem current>Roadmap</BreadcrumbItem>
 *   </Breadcrumb>
 *
 * Renders a horizontal trail of links separated by chevrons. The last item
 * is automatically marked as `current` (sets `aria-current="page"` and uses
 * the primary text color) unless an explicit `current` prop overrides it.
 * Use `<BreadcrumbItem variant="children" />` to render an overflow ellipsis
 * placeholder where intermediate items have been collapsed.
 */

type ItemState = "regular" | "current" | "disabled"

// The hover background pill wraps the icon+label only — the chevron sits
// outside it as a peer separator (matches Figma 46939:90935).
const labelPill = cva(
  [
    "inline-flex items-center rounded-sm gap-1",
    "text-t2 font-body whitespace-nowrap",
    "transition-colors",
    "outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-color)]",
  ].join(" "),
  {
    variants: {
      state: {
        regular: "text-[var(--color-secondary-text-color)]",
        current: "text-[var(--color-primary-text-color)]",
        disabled: "text-[var(--color-disabled-text-color)] cursor-not-allowed",
      } satisfies Record<ItemState, string>,
      variant: {
        // pl 2px / pr 4px matches the Icon Container in Figma.
        default: "pl-[2px] pr-1",
        // 16px square pill around the ellipsis glyph.
        children: "size-4 justify-center",
      },
      interactive: {
        true: "cursor-pointer hover:bg-[var(--color-primary-background-hover-color)]",
        false: "",
      },
    },
    defaultVariants: { state: "regular", variant: "default", interactive: false },
  },
)

export type BreadcrumbItemProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "children"
> & {
  /** "default" renders icon + label, "children" renders an overflow ellipsis. */
  variant?: "default" | "children"
  /** Marks this item as the current page. Set automatically on the last child. */
  current?: boolean
  /** Disables interaction. */
  disabled?: boolean
  /** Optional leading icon (default variant only). */
  icon?: IconName
  /** Item label (default variant only). */
  children?: ReactNode
  /** Suppresses the trailing chevron. Set automatically on the last child. */
  hideSeparator?: boolean
}

export const BreadcrumbItem = forwardRef<HTMLAnchorElement, BreadcrumbItemProps>(
  function BreadcrumbItem(
    {
      variant = "default",
      current = false,
      disabled = false,
      icon,
      href,
      className,
      children,
      hideSeparator = false,
      onClick,
      ...rest
    },
    ref,
  ) {
    const state: ItemState = disabled
      ? "disabled"
      : current
        ? "current"
        : "regular"
    const isLink = !!href && !disabled && !current
    const interactive = isLink || (!disabled && !current && !!onClick)

    const content =
      variant === "children" ? (
        <Icon name="ellipsis" size="2xs" aria-label="More" />
      ) : (
        <>
          {icon ? (
            <Icon
              name={icon}
              size="xs"
              aria-hidden
              className="text-current"
            />
          ) : null}
          <span className="leading-5">{children}</span>
        </>
      )

    const pillClasses = cn(labelPill({ state, variant, interactive }), className)
    const ariaCurrent = current ? "page" : undefined

    const pill = isLink ? (
      <a
        ref={ref}
        href={href}
        aria-current={ariaCurrent}
        className={pillClasses}
        onClick={onClick}
        {...rest}
      >
        {content}
      </a>
    ) : (
      <span
        ref={ref as unknown as React.Ref<HTMLSpanElement>}
        aria-current={ariaCurrent}
        aria-disabled={disabled || undefined}
        className={pillClasses}
        {...(rest as HTMLAttributes<HTMLSpanElement>)}
      >
        {content}
      </span>
    )

    // Wrapper has the trailing 2px right padding from Figma; chevron is a
    // peer of the pill so the hover background doesn't extend under it.
    return (
      <span className="inline-flex items-center pr-[2px]">
        {pill}
        {!hideSeparator && <Separator />}
      </span>
    )
  },
)

function Separator() {
  return (
    <span
      aria-hidden
      className="inline-flex items-center justify-center size-4 text-[var(--color-icon-color)]"
    >
      <Icon name="chevron-right" size="2xs" aria-hidden className="text-current" />
    </span>
  )
}

export type BreadcrumbProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode
  /** Accessible label for the navigation landmark. Defaults to "Breadcrumb". */
  "aria-label"?: string
}

export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(
  function Breadcrumb(
    { children, className, "aria-label": ariaLabel = "Breadcrumb", ...rest },
    ref,
  ) {
    const items = flattenChildren(children)
    const lastIndex = items.length - 1

    return (
      <nav
        ref={ref}
        aria-label={ariaLabel}
        className={cn("inline-flex items-center", className)}
        {...rest}
      >
        <ol className="inline-flex items-center m-0 p-0 list-none">
          {items.map((child, i) => {
            const isLast = i === lastIndex
            const cloned = isValidElement<BreadcrumbItemProps>(child)
              ? cloneElement(child, {
                  current: child.props.current ?? isLast,
                  hideSeparator: child.props.hideSeparator ?? isLast,
                })
              : child
            return (
              <li key={i} className="inline-flex items-center">
                {cloned}
              </li>
            )
          })}
        </ol>
      </nav>
    )
  },
)

function flattenChildren(children: ReactNode): ReactNode[] {
  const out: ReactNode[] = []
  const visit = (node: ReactNode) => {
    if (node == null || node === false || node === true) return
    if (Array.isArray(node)) {
      node.forEach(visit)
      return
    }
    if (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      (node as { type: unknown }).type === Fragment
    ) {
      visit(((node as { props: { children: ReactNode } }).props.children))
      return
    }
    out.push(node)
  }
  visit(children)
  return out
}

