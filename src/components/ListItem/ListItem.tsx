import { cva, type VariantProps } from "class-variance-authority"
import {
  forwardRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from "react"
import { Divider } from "../Divider"
import { Icon } from "../Icon"
import { Label, type LabelProps } from "../Label"
import type { IconName } from "../../icons/names"
import { cn } from "../../lib/cn"

/**
 * ListItem — sourced from the TimeWorks Figma file
 * (page "List item", node 46939:7903; component set 46946:17488).
 *
 *   <ListItem>Option 1</ListItem>
 *   <ListItem icon="hexagon-image" rightIcon>Option 1</ListItem>
 *   <ListItem variant="category-title" icon="hexagon-image">Settings</ListItem>
 *   <ListItem variant="divider" />
 *
 * A polymorphic row used inside menus, dropdowns, and selection lists.
 * Six content variants:
 *   - item              · 32px row of text with optional left icon / avatar /
 *                         right chevron / end label.
 *   - button            · 40px centered action row (icon + label).
 *   - category-title    · 34px Section header (semibold, t1).
 *   - category-separator· 32px subdued caption used between groups.
 *   - information       · 32px row with centered helper copy.
 *   - divider           · 1px rule with vertical breathing room.
 *
 * Interactive variants (item/button) render as <button> so they participate
 * in keyboard navigation and focus rings out of the box.
 */

const itemBase = cva(
  [
    "flex w-full items-center text-left",
    "text-t2 font-body text-[var(--color-primary-text-color)]",
    "transition-colors",
  ],
  {
    variants: {
      variant: {
        item: "h-8 gap-2 px-2 py-2 rounded-sm",
        button: "h-10 justify-center py-2 rounded-sm",
        "category-title":
          "h-[34px] gap-2 px-2 py-2 rounded-sm text-t1 font-semibold",
        "category-separator":
          "h-8 gap-2 px-2 py-2 text-[var(--color-secondary-text-color)]",
        information: "h-8 px-2 py-2 rounded-sm justify-center text-center",
        divider: "block w-full px-0 py-1",
      },
      interactive: {
        true: [
          "cursor-pointer",
          "hover:bg-[var(--color-primary-background-hover-color)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-color)]",
        ],
        false: "",
      },
      active: {
        true: "bg-[var(--color-primary-selected-color)] hover:bg-[var(--color-primary-selected-color)]",
        false: "",
      },
      disabled: {
        true: "text-[var(--color-disabled-text-color)] pointer-events-none",
        false: "",
      },
    },
    defaultVariants: {
      variant: "item",
      interactive: false,
      active: false,
      disabled: false,
    },
  },
)

type ItemVariants = VariantProps<typeof itemBase>
export type ListItemVariant = NonNullable<ItemVariants["variant"]>

type CommonProps = {
  /** Content type — defaults to "item". */
  variant?: ListItemVariant
  /** Active/selected state — uses the primary-selected fill from Figma. */
  active?: boolean
  /** Disabled — drops opacity on text/icons and removes pointer events. */
  disabled?: boolean
  /** Leading icon. */
  icon?: IconName
  /** Trailing icon. Pass `true` for the default chevron-right, or an IconName to override. */
  rightIcon?: IconName | boolean
  /** Custom avatar element (typically `<Avatar size="xs" />`). Mutually exclusive with `icon`. */
  avatar?: ReactNode
  /**
   * Optional status pill rendered after the row text. Pass a string for the
   * default Label (line · primary · md), or pass an object to override
   * Label props (`{ children, color, kind, size }`), or pass any ReactNode
   * to fully control rendering.
   */
  label?:
    | string
    | ReactNode
    | ({ children: ReactNode } & Pick<LabelProps, "color" | "kind" | "size">)
}

export type ListItemProps = Omit<HTMLAttributes<HTMLElement>, "children"> &
  CommonProps & {
    children?: ReactNode
  }

function isInteractive(variant: ListItemVariant): boolean {
  return variant === "item" || variant === "button"
}

function renderLabel(label: ListItemProps["label"]): ReactNode {
  if (label == null || label === false) return null
  if (typeof label === "string" || typeof label === "number") {
    return <Label>{label}</Label>
  }
  if (
    typeof label === "object" &&
    label !== null &&
    "children" in (label as Record<string, unknown>) &&
    !("$$typeof" in (label as Record<string, unknown>))
  ) {
    const { children, color, kind, size } = label as {
      children: ReactNode
      color?: LabelProps["color"]
      kind?: LabelProps["kind"]
      size?: LabelProps["size"]
    }
    return (
      <Label color={color} kind={kind} size={size}>
        {children}
      </Label>
    )
  }
  return label as ReactNode
}

export const ListItem = forwardRef<HTMLElement, ListItemProps>(function ListItem(
  {
    variant = "item",
    active = false,
    disabled = false,
    icon,
    rightIcon,
    avatar,
    label,
    children,
    className,
    onClick,
    onKeyDown,
    ...rest
  },
  ref,
) {
  // Divider — render a hairline rule, no interactivity, no children.
  if (variant === "divider") {
    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        role="separator"
        className={cn("w-full py-1", className)}
        {...rest}
      >
        <Divider />
      </div>
    )
  }

  const interactive = isInteractive(variant) && !disabled
  const classes = cn(
    itemBase({
      variant,
      interactive,
      active: active && !disabled,
      disabled,
    }),
    className,
  )

  const iconColorClass = disabled
    ? "text-[var(--color-disabled-text-color)]"
    : "text-[var(--color-icon-color)]"

  const leadingIcon = icon ? (
    <Icon name={icon} size="sm" aria-hidden className={iconColorClass} />
  ) : null

  const leadingAvatar = avatar ? (
    <span
      className={cn(
        "inline-flex items-center shrink-0",
        disabled && "opacity-40",
      )}
    >
      {avatar}
    </span>
  ) : null

  const trailingIconName: IconName | null =
    rightIcon === true ? "chevron-right" : rightIcon ? rightIcon : null

  const trailingIcon = trailingIconName ? (
    <Icon
      name={trailingIconName}
      size="xs"
      aria-hidden
      className={cn("shrink-0", iconColorClass)}
    />
  ) : null

  const labelPill = renderLabel(label)

  // Left side container — gathers leading icon/avatar, label text, and the
  // optional end-label pill so they share the same min-w-0 / overflow rules.
  // Line-height matches Figma: 22px for category-title (Karla SemiBold 16/22),
  // 20px for the rest (Karla Regular 14/20).
  const textLeading =
    variant === "category-title" ? "leading-[22px]" : "leading-5"
  const leftSide = (
    <span className="flex flex-1 items-center gap-2 overflow-clip min-w-0">
      {leadingIcon}
      {leadingAvatar}
      <span className={cn("flex-1 min-w-0 truncate", textLeading)}>{children}</span>
      {labelPill}
    </span>
  )

  if (variant === "button") {
    // Button variant doesn't use the left-side flex; centered icon + text.
    const inner = (
      <span className="inline-flex items-center gap-2 overflow-clip">
        {leadingIcon}
        <span className="text-t1 leading-[22px] whitespace-nowrap">{children}</span>
      </span>
    )
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type="button"
        disabled={disabled}
        aria-disabled={disabled || undefined}
        className={classes}
        onClick={onClick as ((e: MouseEvent<HTMLButtonElement>) => void) | undefined}
        onKeyDown={onKeyDown as ((e: KeyboardEvent<HTMLButtonElement>) => void) | undefined}
        {...(rest as HTMLAttributes<HTMLButtonElement>)}
      >
        {inner}
      </button>
    )
  }

  if (variant === "item") {
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type="button"
        disabled={disabled}
        aria-disabled={disabled || undefined}
        aria-current={active ? "true" : undefined}
        className={classes}
        onClick={onClick as ((e: MouseEvent<HTMLButtonElement>) => void) | undefined}
        onKeyDown={onKeyDown as ((e: KeyboardEvent<HTMLButtonElement>) => void) | undefined}
        {...(rest as HTMLAttributes<HTMLButtonElement>)}
      >
        {leftSide}
        {trailingIcon}
      </button>
    )
  }

  // Non-interactive variants render as a div.
  if (variant === "information") {
    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        className={classes}
        {...rest}
      >
        <span className="leading-5">{children}</span>
      </div>
    )
  }

  if (variant === "category-separator") {
    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        className={classes}
        {...rest}
      >
        <span className="flex-1 truncate leading-5">{children}</span>
      </div>
    )
  }

  // category-title
  return (
    <div
      ref={ref as React.Ref<HTMLDivElement>}
      className={classes}
      {...rest}
    >
      {leftSide}
      {trailingIcon}
    </div>
  )
})
