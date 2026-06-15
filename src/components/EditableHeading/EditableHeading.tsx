import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
  type KeyboardEvent,
} from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/cn"

/**
 * EditableHeading — heading-styled text input sourced from the TimeWorks
 * Figma file (page "Editable heading", component 46946:4387).
 *
 *   <EditableHeading defaultValue="Project Atlas" variant="h1" />
 *   <EditableHeading value={title} onValueChange={setTitle} variant="h2" weight="medium" />
 *   <EditableHeading defaultValue="Read only" readOnly variant="h3" />
 *
 * Reads as a heading until hover/focus, then reveals a 1px border
 * (`color-border-ui` on hover, `color-primary` on focus) so users discover
 * it’s editable. Enter commits and blurs; Escape reverts to the last
 * committed value and blurs.
 *
 * Three sizes (h1 / h2 / h3) and four weights per the Figma matrix.
 * `bold | semibold | medium | regular` for h1; `bold | semibold | medium |
 * light` for h2 / h3 — matches the Figma "Bold / Medium / Normal / Light"
 * naming from the spec.
 */

const root = cva(
  [
    // Reset native input chrome.
    "appearance-none bg-transparent outline-none",
    "border border-transparent rounded-sm",
    "text-[var(--color-primary-text-color)]",
    "placeholder:text-[var(--color-placeholder-color)]",
    "transition-colors duration-[120ms] ease-out",
    "font-heading",
    // Default: p-1. Hover/focus: switch to px-2 to match Figma.
    "px-1 py-1",
    // Hover only when NOT focused — otherwise the focus-color border gets
    // overwritten by the hover-color border on click-and-hold.
    "[&:hover:not(:focus-visible)]:border-[var(--color-ui-border-color)]",
    "hover:px-2",
    "focus-visible:border-[var(--color-primary-color)] focus-visible:px-2",
    "read-only:cursor-default read-only:hover:border-transparent read-only:hover:px-1",
    "read-only:focus-visible:border-transparent read-only:focus-visible:px-1",
    "disabled:cursor-not-allowed disabled:text-[var(--color-disabled-text-color)]",
    "disabled:hover:border-transparent disabled:hover:px-1",
  ].join(" "),
  {
    variants: {
      variant: {
        h1: "text-h1",
        h2: "text-h2",
        h3: "text-h3",
      },
      weight: {
        light: "font-light",
        regular: "font-normal",
        medium: "font-medium",
        semibold: "font-semibold",
        bold: "font-bold",
      },
    },
    // Tracking pulled from the Figma typography spec — not collapsible to a
    // single per-variant value because Figma mixes pixel and percent units.
    compoundVariants: [
      // H1 (32 / 40)
      { variant: "h1", weight: "bold", class: "tracking-[-0.005em]" },
      { variant: "h1", weight: "semibold", class: "tracking-[-0.005em]" },
      { variant: "h1", weight: "medium", class: "tracking-[-0.5px]" },
      { variant: "h1", weight: "regular", class: "tracking-[-0.005em]" },
      // H2 (24 / 30)
      { variant: "h2", weight: "bold", class: "tracking-[-0.1px]" },
      { variant: "h2", weight: "semibold", class: "tracking-[-0.1px]" },
      { variant: "h2", weight: "medium", class: "tracking-[-0.005em]" },
      { variant: "h2", weight: "light", class: "tracking-[-0.008em]" },
      // H3 (18 / 24)
      { variant: "h3", weight: "bold", class: "tracking-[-0.1px]" },
      { variant: "h3", weight: "semibold", class: "tracking-[-0.1px]" },
      { variant: "h3", weight: "medium", class: "tracking-[-0.005em]" },
      { variant: "h3", weight: "light", class: "tracking-[-0.005em]" },
    ],
    defaultVariants: {
      variant: "h1",
      weight: "bold",
    },
  },
)

type RootVariants = VariantProps<typeof root>

type NativeInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size" | "value" | "defaultValue" | "onChange" | "type"
>

export type EditableHeadingProps = NativeInputProps &
  RootVariants & {
    /** Controlled value. Pair with `onValueChange`. */
    value?: string
    /** Uncontrolled initial value. */
    defaultValue?: string
    /** Fires on every keystroke with the new string value. */
    onValueChange?: (value: string) => void
    /** Fires when the user commits a change (Enter or blur with a different value). */
    onCommit?: (value: string) => void
  }

export const EditableHeading = forwardRef<HTMLInputElement, EditableHeadingProps>(
  function EditableHeading(
    {
      variant = "h1",
      weight = "bold",
      value,
      defaultValue,
      onValueChange,
      onCommit,
      onKeyDown,
      onBlur,
      onFocus,
      placeholder = "Editable heading",
      disabled = false,
      readOnly = false,
      className,
      "aria-label": ariaLabel,
      ...rest
    },
    ref,
  ) {
    const isControlled = value !== undefined
    const [internalValue, setInternalValue] = useState(defaultValue ?? "")
    const currentValue = isControlled ? value : internalValue

    // Snapshot the value on focus so Esc can revert to it.
    const lastCommittedRef = useRef(currentValue)
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

    const commit = useCallback(
      (next: string) => {
        if (next !== lastCommittedRef.current) {
          onCommit?.(next)
          lastCommittedRef.current = next
        }
      },
      [onCommit],
    )

    const handleKeyDown = useCallback(
      (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
          event.preventDefault()
          commit(currentValue)
          inputRef.current?.blur()
        } else if (event.key === "Escape") {
          event.preventDefault()
          const reverted = lastCommittedRef.current
          if (!isControlled) setInternalValue(reverted)
          onValueChange?.(reverted)
          inputRef.current?.blur()
        }
        onKeyDown?.(event)
      },
      [commit, currentValue, isControlled, onKeyDown, onValueChange],
    )

    return (
      <input
        ref={inputRef}
        type="text"
        value={currentValue}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        aria-label={ariaLabel ?? placeholder}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={(event) => {
          lastCommittedRef.current = event.target.value
          onFocus?.(event)
        }}
        onBlur={(event) => {
          commit(event.target.value)
          onBlur?.(event)
        }}
        className={cn(root({ variant, weight }), className)}
        {...rest}
      />
    )
  },
)
