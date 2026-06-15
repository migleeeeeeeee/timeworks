import { cva, type VariantProps } from "class-variance-authority"
import {
  forwardRef,
  useCallback,
  useId,
  useImperativeHandle,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
  type TextareaHTMLAttributes,
} from "react"
import { cn } from "../../lib/cn"

/**
 * TextArea — sourced from the TimeWorks Figma file
 * (page "Text Area", node 46939:7917 / component set 46949:31916).
 *
 *   <TextArea label="Description" placeholder="Users can type here" />
 *   <TextArea size="sm" rows={4} helperText="Up to 200 characters" />
 *   <TextArea state="error" helperText="This field is required" />
 *   <TextArea characterLimit={200} value={value} onValueChange={setValue} />
 *
 * Multi-line text input with optional label, helper text, and character
 * limit. Two sizes (sm/lg → 14/16px text), six states matching the Figma
 * matrix (default, error, positive, disabled, read-only — plus the
 * implicit hover/focus from CSS pseudo-classes).
 */

const wrapper = cva(
  [
    "relative block w-full rounded-md",
    "transition-colors duration-[120ms] ease-out",
    "border bg-[var(--color-secondary-background-color)]",
    "border-[var(--color-ui-border-color)]",
    "[&:hover:not(:focus-within)]:border-[var(--color-primary-text-color)]",
    "focus-within:border-[var(--color-primary-color)]",
    "has-[textarea:focus-visible]:ring-2 has-[textarea:focus-visible]:ring-[var(--color-primary-color)]/20",
  ].join(" "),
  {
    variants: {
      state: {
        default: "",
        error: [
          "border-[var(--color-negative-color)]",
          "[&:hover:not(:focus-within)]:border-[var(--color-negative-color)]",
          "focus-within:border-[var(--color-negative-color)]",
          "has-[textarea:focus-visible]:ring-[var(--color-negative-color)]/20",
        ].join(" "),
        positive: [
          "border-[var(--color-positive-color)]",
          "[&:hover:not(:focus-within)]:border-[var(--color-positive-color)]",
          "focus-within:border-[var(--color-positive-color)]",
          "has-[textarea:focus-visible]:ring-[var(--color-positive-color)]/20",
        ].join(" "),
        disabled: [
          "bg-[var(--color-disabled-background-color)]",
          "border-[var(--color-disabled-text-color)]",
          "[&:hover:not(:focus-within)]:border-[var(--color-disabled-text-color)]",
          "cursor-not-allowed",
        ].join(" "),
        readOnly: [
          "bg-[var(--color-allgrey-background-color)]",
          "border-transparent",
          "[&:hover:not(:focus-within)]:border-transparent",
          "focus-within:border-transparent",
          "has-[textarea:focus-visible]:ring-0",
        ].join(" "),
      },
    },
    defaultVariants: { state: "default" },
  },
)

const inputCls = cva(
  [
    "block w-full bg-transparent outline-none border-0",
    // Padding lives on the textarea (not the wrapper) so the native
    // ::-webkit-resizer sits flush with the wrapper's bottom-right corner —
    // exactly where the decorative SVG corner-mark is rendered.
    "px-4 py-2",
    "font-body text-[var(--color-primary-text-color)]",
    "placeholder:text-[var(--color-placeholder-color)]",
    "disabled:cursor-not-allowed disabled:text-[var(--color-disabled-text-color)]",
    "disabled:placeholder:text-[var(--color-disabled-text-color)]",
    "read-only:cursor-default",
    // Hide the native WebKit resize triangle so only the decorative SVG
    // corner-mark renders. The resizer is still functional underneath.
    "[&::-webkit-resizer]:[background:transparent]",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "text-t2 leading-5",
        lg: "text-t1 leading-[22px]",
      },
    },
    defaultVariants: { size: "lg" },
  },
)

const helperCls = cva(
  "font-body text-t2 leading-5 text-[var(--color-secondary-text-color)]",
  {
    variants: {
      tone: {
        default: "text-[var(--color-secondary-text-color)]",
        error: "text-[var(--color-negative-color)]",
        positive: "text-[var(--color-positive-color)]",
        disabled: "text-[var(--color-disabled-text-color)]",
      },
    },
    defaultVariants: { tone: "default" },
  },
)

type WrapperVariants = VariantProps<typeof wrapper>
type InputVariants = VariantProps<typeof inputCls>

type NativeTextareaProps = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "size" | "value" | "defaultValue" | "onChange" | "readOnly" | "disabled"
>

export type TextAreaState = NonNullable<WrapperVariants["state"]>
export type TextAreaSize = NonNullable<InputVariants["size"]>

export type TextAreaProps = NativeTextareaProps & {
  /** Visual size of the text inside the field. Defaults to `lg`. */
  size?: TextAreaSize
  /** Visual state. `disabled`/`readOnly` also set the corresponding native attribute. */
  state?: TextAreaState
  /** Controlled value. Pair with `onValueChange`. */
  value?: string
  /** Uncontrolled initial value. */
  defaultValue?: string
  /** Fires on every keystroke with the new string value. */
  onValueChange?: (value: string) => void
  /** Optional label rendered above the field. */
  label?: ReactNode
  /** Mark the label with a red asterisk. Sets the native `required` attribute too. */
  required?: boolean
  /** Helper / error text below the field. */
  helperText?: ReactNode
  /** When set, renders an `n/limit` counter in the bottom-right and caps input length. */
  characterLimit?: number
  /** Hide the resize handle. Defaults to `false` (vertical resize allowed). */
  noResize?: boolean
  /** Number of visible rows. Defaults to 4. */
  rows?: number
  /** Wrapper className (the outer box). Use `className` for the textarea itself. */
  wrapperClassName?: string
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  function TextArea(
    {
      size = "lg",
      state = "default",
      value,
      defaultValue,
      onValueChange,
      label,
      required = false,
      helperText,
      characterLimit,
      noResize = false,
      rows = 4,
      placeholder = "Users can type here",
      className,
      wrapperClassName,
      id,
      ...rest
    },
    ref,
  ) {
    const isControlled = value !== undefined
    const [internalValue, setInternalValue] = useState(defaultValue ?? "")
    const currentValue = isControlled ? value : internalValue

    const textareaRef = useRef<HTMLTextAreaElement>(null)
    useImperativeHandle(ref, () => textareaRef.current as HTMLTextAreaElement, [])

    const generatedId = useId()
    const fieldId = id ?? generatedId

    const isDisabled = state === "disabled"
    const isReadOnly = state === "readOnly"

    const handleChange = useCallback(
      (event: ChangeEvent<HTMLTextAreaElement>) => {
        const next =
          characterLimit != null && event.target.value.length > characterLimit
            ? event.target.value.slice(0, characterLimit)
            : event.target.value
        if (!isControlled) setInternalValue(next)
        onValueChange?.(next)
      },
      [characterLimit, isControlled, onValueChange],
    )

    const helperTone: VariantProps<typeof helperCls>["tone"] =
      state === "error"
        ? "error"
        : state === "positive"
          ? "positive"
          : state === "disabled"
            ? "disabled"
            : "default"

    const showBottom = helperText != null || characterLimit != null

    return (
      <div className="flex w-full flex-col gap-1">
        {label && (
          <label
            htmlFor={fieldId}
            className="flex gap-1 text-t2 leading-5 font-body text-[var(--color-primary-text-color)]"
          >
            <span>{label}</span>
            {required && (
              <span aria-hidden className="text-[var(--color-negative-color)]">
                *
              </span>
            )}
          </label>
        )}

        <div
          data-state={state}
          className={cn(wrapper({ state }), wrapperClassName)}
        >
          <textarea
            ref={textareaRef}
            id={fieldId}
            value={currentValue}
            onChange={handleChange}
            placeholder={placeholder}
            rows={rows}
            disabled={isDisabled}
            readOnly={isReadOnly}
            required={required}
            maxLength={characterLimit}
            aria-invalid={state === "error" || undefined}
            className={cn(
              inputCls({ size }),
              noResize ? "resize-none" : "resize-y",
              className,
            )}
            {...rest}
          />
          {!isReadOnly && !noResize && (
            <svg
              aria-hidden
              viewBox="0 0 8 8"
              className="pointer-events-none absolute bottom-px right-px size-2 text-[var(--color-secondary-text-color)]"
            >
              <path d="M7 1 L1 7" stroke="currentColor" strokeWidth="1" fill="none" />
              <path d="M7 4 L4 7" stroke="currentColor" strokeWidth="1" fill="none" />
            </svg>
          )}
        </div>

        {showBottom && (
          <div className="flex items-start justify-between gap-1 w-full">
            <p className={cn(helperCls({ tone: helperTone }), "flex-1 min-w-0")}>
              {helperText}
            </p>
            {characterLimit != null && (
              <p className={cn(helperCls({ tone: helperTone }), "shrink-0 tabular-nums")}>
                {currentValue.length}/{characterLimit}
              </p>
            )}
          </div>
        )}
      </div>
    )
  },
)
