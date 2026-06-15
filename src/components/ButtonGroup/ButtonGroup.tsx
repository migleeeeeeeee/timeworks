import {
  Children,
  cloneElement,
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useId,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/cn"

/**
 * ButtonGroup — segmented selector sourced from the TimeWorks Figma file
 * (page "Button Group", node 46939:7887). Single-select radiogroup with
 * keyboard navigation. Default variant draws a shared bordered container;
 * tertiary variant relies on the selected segment's highlight alone.
 *
 *   <ButtonGroup defaultValue="day">
 *     <ButtonGroupItem value="day">Day</ButtonGroupItem>
 *     <ButtonGroupItem value="week">Week</ButtonGroupItem>
 *     <ButtonGroupItem value="month">Month</ButtonGroupItem>
 *   </ButtonGroup>
 */

type Size = "sm" | "md" | "lg"
type Variant = "default" | "tertiary"

type ButtonGroupContextValue = {
  value: string | null
  onSelect: (next: string) => void
  size: Size
  variant: Variant
  disabled: boolean
  registerItem: (value: string, el: HTMLButtonElement | null) => void
  focusSibling: (current: string, dir: 1 | -1) => void
  name: string
}

const ButtonGroupContext = createContext<ButtonGroupContextValue | null>(null)

function useButtonGroup() {
  const ctx = useContext(ButtonGroupContext)
  if (!ctx) {
    throw new Error("ButtonGroupItem must be rendered inside <ButtonGroup>")
  }
  return ctx
}

const root = cva("inline-flex items-stretch font-body", {
  variants: {
    variant: { default: "", tertiary: "" },
    size: {
      sm: "h-8",
      md: "h-10",
      lg: "h-12",
    },
  },
  defaultVariants: { variant: "default", size: "md" },
})

// Each segment carries its own border. Adjacent segments overlap their borders
// via `-ml-px` (handled in the item component) to match Figma's flush layout.
const item = cva(
  [
    "relative inline-flex items-center justify-center whitespace-nowrap select-none",
    "transition-colors duration-[120ms] ease-out",
    "focus-visible:outline-none focus-visible:z-20",
    "focus-visible:ring-2 focus-visible:ring-[var(--color-primary-color)] focus-visible:ring-offset-1",
    "disabled:cursor-not-allowed",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "h-8 px-2 text-t2",
        md: "h-10 px-4 text-t1",
        lg: "h-12 px-6 text-t1",
      },
      variant: {
        default: "border border-[var(--color-ui-border-color)]",
        tertiary: "border-0",
      },
      selected: { true: "", false: "" },
      disabled: { true: "", false: "" },
    },
    compoundVariants: [
      // Default — bordered. Selected overlays a primary-colored border + tint.
      {
        variant: "default",
        selected: false,
        disabled: false,
        class:
          "bg-transparent text-[var(--color-primary-text-color)] hover:bg-[var(--color-primary-background-hover-color)] active:bg-[var(--color-ui-background-color)]",
      },
      {
        variant: "default",
        selected: true,
        disabled: false,
        class:
          "bg-[var(--color-primary-selected-color)] text-[var(--color-primary-text-color)] border-[var(--color-primary-color)] hover:bg-[var(--color-primary-selected-hover-color)] z-10",
      },
      // Tertiary — borderless. Only the selected segment shows the tint.
      {
        variant: "tertiary",
        selected: false,
        disabled: false,
        class:
          "bg-transparent text-[var(--color-primary-text-color)] hover:bg-[var(--color-primary-background-hover-color)]",
      },
      {
        variant: "tertiary",
        selected: true,
        disabled: false,
        class:
          "bg-[var(--color-primary-selected-color)] text-[var(--color-primary-text-color)] hover:bg-[var(--color-primary-selected-hover-color)]",
      },
      // Disabled (Default) — every segment greys out flat, even the selected one.
      {
        variant: "default",
        disabled: true,
        class:
          "bg-[var(--color-disabled-background-color)] text-[var(--color-disabled-text-color)] border-[var(--color-ui-border-color)]",
      },
      // Disabled (Tertiary) — text dims; selected keeps its tint but desaturated.
      {
        variant: "tertiary",
        disabled: true,
        selected: false,
        class: "bg-transparent text-[var(--color-disabled-text-color)]",
      },
      {
        variant: "tertiary",
        disabled: true,
        selected: true,
        class: "bg-[var(--color-disabled-background-color)] text-[var(--color-disabled-text-color)]",
      },
    ],
    defaultVariants: { size: "md", variant: "default", selected: false, disabled: false },
  }
)

type RootVariants = VariantProps<typeof root>

export type ButtonGroupProps = Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> &
  RootVariants & {
    value?: string | null
    defaultValue?: string | null
    onValueChange?: (value: string) => void
    disabled?: boolean
    /** Accessible label for the radiogroup. */
    "aria-label"?: string
    children?: ReactNode
  }

export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(function ButtonGroup(
  {
    className,
    variant,
    size,
    value: controlled,
    defaultValue = null,
    onValueChange,
    disabled = false,
    children,
    ...rest
  },
  ref
) {
  const [uncontrolled, setUncontrolled] = useState<string | null>(defaultValue)
  const isControlled = controlled !== undefined
  const value = isControlled ? controlled ?? null : uncontrolled

  const itemsRef = useRef(new Map<string, HTMLButtonElement>())
  const orderRef = useRef<string[]>([])
  const generatedName = useId()

  const registerItem = useCallback((val: string, el: HTMLButtonElement | null) => {
    const map = itemsRef.current
    const order = orderRef.current
    if (el) {
      map.set(val, el)
      if (!order.includes(val)) order.push(val)
    } else {
      map.delete(val)
      const idx = order.indexOf(val)
      if (idx >= 0) order.splice(idx, 1)
    }
  }, [])

  const onSelect = useCallback(
    (next: string) => {
      if (!isControlled) setUncontrolled(next)
      onValueChange?.(next)
    },
    [isControlled, onValueChange]
  )

  const focusSibling = useCallback((current: string, dir: 1 | -1) => {
    const order = orderRef.current.filter((v) => {
      const el = itemsRef.current.get(v)
      return el && !el.disabled
    })
    if (order.length === 0) return
    const idx = order.indexOf(current)
    const nextIdx = idx === -1 ? 0 : (idx + dir + order.length) % order.length
    const nextVal = order[nextIdx]
    if (!nextVal) return
    const el = itemsRef.current.get(nextVal)
    if (el) {
      el.focus()
      onSelect(nextVal)
    }
  }, [onSelect])

  const ctx = useMemo<ButtonGroupContextValue>(
    () => ({
      value,
      onSelect,
      size: size ?? "md",
      variant: variant ?? "default",
      disabled,
      registerItem,
      focusSibling,
      name: generatedName,
    }),
    [value, onSelect, size, variant, disabled, registerItem, focusSibling, generatedName]
  )

  return (
    <ButtonGroupContext.Provider value={ctx}>
      <div
        ref={ref}
        role="radiogroup"
        data-disabled={disabled || undefined}
        className={cn(root({ variant, size }), className)}
        {...rest}
      >
        {(() => {
          const arr = Children.toArray(children).filter(isValidElement)
          const last = arr.length - 1
          return arr.map((child, index) =>
            cloneElement(child as ReactElement<{ "data-index"?: number; "data-last"?: boolean }>, {
              "data-index": index,
              "data-last": index === last,
            })
          )
        })()}
      </div>
    </ButtonGroupContext.Provider>
  )
})

export type ButtonGroupItemProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "value" | "type" | "role"
> & {
  value: string
  children?: ReactNode
}

export const ButtonGroupItem = forwardRef<HTMLButtonElement, ButtonGroupItemProps>(
  function ButtonGroupItem(
    { value, className, disabled, onClick, onKeyDown, children, ...rest },
    ref
  ) {
    const ctx = useButtonGroup()
    const isSelected = ctx.value === value
    const isDisabled = disabled || ctx.disabled
    const dataIndex = (rest as { "data-index"?: number })["data-index"]
    const dataLast = (rest as { "data-last"?: boolean })["data-last"]
    const isFirst = dataIndex === 0
    const isLast = dataLast === true
    const overlap = ctx.variant === "default" && !isFirst ? "-ml-px" : ""
    const radius = cn(
      isFirst && "rounded-l-full",
      isLast && "rounded-r-full"
    )

    const setRef = useCallback(
      (el: HTMLButtonElement | null) => {
        ctx.registerItem(value, el)
        if (typeof ref === "function") ref(el)
        else if (ref) (ref as { current: HTMLButtonElement | null }).current = el
      },
      [ctx, value, ref]
    )

    const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
      onKeyDown?.(e)
      if (e.defaultPrevented || isDisabled) return
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault()
        ctx.focusSibling(value, 1)
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault()
        ctx.focusSibling(value, -1)
      } else if (e.key === " " || e.key === "Enter") {
        e.preventDefault()
        if (!isSelected) ctx.onSelect(value)
      }
    }

    return (
      <button
        ref={setRef}
        type="button"
        role="radio"
        aria-checked={isSelected}
        tabIndex={isDisabled ? -1 : isSelected || ctx.value == null ? 0 : -1}
        data-state={isSelected ? "on" : "off"}
        disabled={isDisabled}
        onClick={(e) => {
          onClick?.(e)
          if (!e.defaultPrevented && !isDisabled && !isSelected) ctx.onSelect(value)
        }}
        onKeyDown={handleKeyDown}
        className={cn(
          item({
            size: ctx.size,
            variant: ctx.variant,
            selected: isSelected,
            disabled: isDisabled,
          }),
          overlap,
          radius,
          className
        )}
        {...rest}
      >
        {children}
      </button>
    )
  }
)
