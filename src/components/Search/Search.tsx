import { cva, type VariantProps } from "class-variance-authority"
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from "react"
import { Icon } from "../Icon"
import type { IconName } from "../../icons/names"
import { cn } from "../../lib/cn"

/**
 * Search — sourced from the TimeWorks Figma file
 * (page "Search", node 46939:7910 / component 46947:9785).
 *
 *   <Search placeholder="Find a project" onValueChange={setQuery} />
 *   <Search size="sm" defaultValue="hello" onSearch={(v) => …} />
 *   <Search trailing={<IconButton icon="hexagon-image" .../>} />
 *
 * Single-line search field with a leading magnifying-glass icon, an
 * auto-revealed clear button, and an optional trailing slot for a custom
 * icon button. Three sizes (sm/md/lg → 32/40/48px). Hover/focus/disabled
 * states match the Figma matrix; "Searched" is the same shape as Default
 * with the clear button visible.
 */

const root = cva(
  [
    "group flex items-center w-full gap-2 rounded-full",
    "pl-4 pr-1 py-1",
    "transition-colors duration-[120ms] ease-out",
    "border bg-[var(--color-secondary-background-color)]",
    "border-[var(--color-ui-border-color)]",
    // Hover only when NOT focused — otherwise click-and-hold leaves the
    // hover border drawn on top of the focus border.
    "[&:hover:not(:focus-within)]:border-[var(--color-primary-text-color)]",
    "focus-within:border-[var(--color-primary-color)]",
    "has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-[var(--color-primary-color)]/20",
    "data-[disabled=true]:bg-[var(--color-disabled-background-color)]",
    "data-[disabled=true]:border-transparent",
    "data-[disabled=true]:hover:border-transparent",
    "data-[disabled=true]:cursor-not-allowed",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "h-8",
        md: "h-10",
        lg: "h-12",
      },
    },
    defaultVariants: { size: "md" },
  },
)

const inputCls = cva(
  [
    "flex-1 min-w-0 bg-transparent outline-none border-0 p-0",
    "font-body text-[var(--color-primary-text-color)]",
    "placeholder:text-[var(--color-placeholder-color)]",
    // Hover-only placeholder shift — drop it once focused so the focus
    // state reads as "active typing" not "hovered".
    "group-[:hover:not(:focus-within)]:placeholder:text-[var(--color-secondary-text-color)]",
    "disabled:cursor-not-allowed disabled:text-[var(--color-disabled-text-color)]",
    "disabled:placeholder:text-[var(--color-disabled-text-color)]",
    // Strip the native search clear UI — we render our own.
    "[&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "text-t2 leading-5",
        md: "text-t1 leading-[22px]",
        lg: "text-t1 leading-[22px]",
      },
    },
    defaultVariants: { size: "md" },
  },
)

type RootVariants = VariantProps<typeof root>

type NativeInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size" | "value" | "defaultValue" | "onChange" | "type"
>

export type SearchProps = NativeInputProps &
  RootVariants & {
    /** Controlled value. Pair with `onValueChange`. */
    value?: string
    /** Uncontrolled initial value. */
    defaultValue?: string
    /** Fires on every keystroke with the new string value. */
    onValueChange?: (value: string) => void
    /** Fires when the user submits the field (Enter key). */
    onSearch?: (value: string) => void
    /** Override the leading icon. Defaults to `magnifying-glass`. */
    leadingIcon?: IconName
    /** Optional trailing slot — typically an `<IconButton/>`. */
    trailing?: ReactNode
    /** Hide the auto-shown clear button when the field has a value. */
    hideClearButton?: boolean
    /** Accessible label for the clear button. Defaults to "Clear search". */
    clearLabel?: string
    /** Wrapper className (the outer pill). Use `className` for the input itself. */
    wrapperClassName?: string
  }

// Maps Search size → Icon size. Figma Icon Wrapper specs:
//   sm  → 16×16 outer (Icon "xs")
//   md  → 20×20 outer (Icon "sm")
//   lg  → 20×20 outer (Icon "sm")
const ICON_SIZE: Record<NonNullable<RootVariants["size"]>, "xs" | "sm"> = {
  sm: "xs",
  md: "sm",
  lg: "sm",
}

const ACTION_SIZE: Record<NonNullable<RootVariants["size"]>, string> = {
  sm: "size-6",
  md: "size-8",
  lg: "size-8",
}

export const Search = forwardRef<HTMLInputElement, SearchProps>(function Search(
  {
    size = "md",
    value,
    defaultValue,
    onValueChange,
    onSearch,
    onKeyDown,
    leadingIcon = "magnifying-glass",
    trailing,
    hideClearButton = false,
    clearLabel = "Clear search",
    placeholder = "Search",
    disabled = false,
    className,
    wrapperClassName,
    ...rest
  },
  ref,
) {
  const isControlled = value !== undefined
  const [internalValue, setInternalValue] = useState(defaultValue ?? "")
  const currentValue = isControlled ? value : internalValue

  const inputRef = useRef<HTMLInputElement>(null)
  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement, [])

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const next = event.target.value
      if (!isControlled) setInternalValue(next)
      onValueChange?.(next)
    },
    [isControlled, onValueChange],
  )

  const handleClear = useCallback(() => {
    if (!isControlled) setInternalValue("")
    onValueChange?.("")
    inputRef.current?.focus()
  }, [isControlled, onValueChange])

  const showClear = !hideClearButton && !disabled && currentValue.length > 0
  const iconSize = ICON_SIZE[size ?? "md"]
  const actionSize = ACTION_SIZE[size ?? "md"]

  return (
    <div
      data-disabled={disabled || undefined}
      data-has-value={currentValue.length > 0 || undefined}
      className={cn(root({ size }), wrapperClassName)}
    >
      <Icon
        name={leadingIcon}
        size={iconSize}
        aria-hidden
        className={cn(
          "shrink-0 text-[var(--color-icon-color)]",
          disabled && "text-[var(--color-disabled-text-color)]",
        )}
      />
      <input
        ref={inputRef}
        type="search"
        role="searchbox"
        value={currentValue}
        onChange={handleChange}
        onKeyDown={(event) => {
          if (event.key === "Enter") onSearch?.(currentValue)
          onKeyDown?.(event)
        }}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(inputCls({ size }), className)}
        {...rest}
      />
      {(showClear || trailing) && (
        <div className="flex items-center shrink-0">
          {showClear && (
            <button
              type="button"
              onClick={handleClear}
              aria-label={clearLabel}
              className={cn(
                "inline-flex items-center justify-center rounded-sm shrink-0 cursor-pointer",
                "text-[var(--color-icon-color)]",
                "hover:bg-[var(--color-primary-background-hover-color)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-color)]",
                actionSize,
              )}
            >
              <Icon name="x-mark-small" size={iconSize} aria-hidden />
            </button>
          )}
          {trailing}
        </div>
      )}
    </div>
  )
})
