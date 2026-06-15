import { cva, type VariantProps } from "class-variance-authority"
import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from "react"
import { Icon } from "../Icon"
import { ListItem } from "../ListItem"
import type { IconName } from "../../icons/names"
import { cn } from "../../lib/cn"

/**
 * Dropdown — sourced from the TimeWorks Figma file
 * (page "Dropdown", node 46946:1926).
 *
 *   <Dropdown
 *     options={[{ value: "1", label: "Option 1" }, …]}
 *     onValueChange={setValue}
 *   />
 *
 *   <Dropdown
 *     multiSelect
 *     multiLine
 *     options={options}
 *     defaultValue={["1", "2"]}
 *   />
 *
 * Trigger + popover for single or multi-select. Three sizes (sm 32 · md 40
 * · lg 48), states (default / hover / active / error / disabled / read-only),
 * and three presentations: single (`Default`), multi-select chips on one
 * row (`MultiSelect (chips)`), and chips that wrap to multiple lines
 * (`MultiSelect multi-line (chips)`). Clicking outside or pressing Escape
 * closes the menu; Enter / arrow keys drive keyboard navigation.
 */

// `:hover` only paints the dark border when the trigger is not already in
// open/error/disabled/readonly — those each have their own border treatment
// and shouldn't get clobbered by hover.
const HOVER_BORDER =
  "[&:hover:not([data-state=open]):not([data-error=true]):not([data-disabled]):not([data-readonly])]:border-[var(--color-primary-text-color)]"

const TRIGGER_BASE = [
  "flex w-full items-center gap-2 rounded-md border bg-[var(--color-secondary-background-color)]",
  "border-[var(--color-ui-border-color)]",
  "transition-colors text-left",
  "data-[state=open]:border-[var(--color-primary-color)]",
  "data-[error=true]:border-[var(--color-negative-color)]",
  HOVER_BORDER,
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-color)]/20",
  "data-[disabled=true]:bg-[var(--color-disabled-background-color)] data-[disabled=true]:border-transparent data-[disabled=true]:cursor-not-allowed",
  "data-[readonly=true]:bg-[var(--color-allgrey-background-color)] data-[readonly=true]:border-transparent data-[readonly=true]:cursor-default",
].join(" ")

const trigger = cva(TRIGGER_BASE, {
  variants: {
    size: {
      sm: "h-8 pl-4 pr-1 py-1 cursor-pointer",
      md: "h-10 pl-4 pr-1 py-1 cursor-pointer",
      lg: "h-12 pl-4 pr-1 py-1 cursor-pointer",
    },
  },
  defaultVariants: { size: "md" },
})

const triggerMulti = cva(
  [TRIGGER_BASE, "pl-3 pr-1 cursor-pointer"].join(" "),
  {
    variants: {
      multiLine: {
        true: "items-start py-1",
        false: "items-center",
      },
      size: {
        sm: "min-h-8",
        md: "min-h-10",
        lg: "min-h-12",
      },
    },
    compoundVariants: [
      // Single-row chip mode pads the wrapper to grow the trigger to 32/40/48
      // around a 24px chip — matches Figma py values on the multi-chip
      // single-row variants.
      { multiLine: false, size: "sm", class: "py-1" },
      { multiLine: false, size: "md", class: "py-2" },
      { multiLine: false, size: "lg", class: "py-3" },
    ],
    defaultVariants: { multiLine: false, size: "md" },
  },
)

type TriggerVariants = VariantProps<typeof trigger>
export type DropdownSize = NonNullable<TriggerVariants["size"]>
export type DropdownType = "default" | "multi-chips" | "multi-chips-multiline"
export type DropdownState =
  | "default"
  | "error"
  | "disabled"
  | "readonly"

export type DropdownOption = {
  value: string
  label: string
  icon?: IconName
  disabled?: boolean
}

type DropdownBaseProps = {
  /** Source list of options. */
  options: DropdownOption[]
  /** Placeholder text shown when nothing is selected. */
  placeholder?: string
  /** Field height. */
  size?: DropdownSize
  /** Render an error border. */
  error?: boolean
  /** Disable the trigger and prevent opening the menu. */
  disabled?: boolean
  /** Render in a non-interactive read-only style (no border, grey surface). */
  readOnly?: boolean
  /** Optional leading icon shown inside the trigger. */
  icon?: IconName
  /** Controlled menu open state. Pair with `onOpenChange`. */
  open?: boolean
  /** Uncontrolled initial open state. */
  defaultOpen?: boolean
  /** Fires when the menu opens or closes. */
  onOpenChange?: (open: boolean) => void
  /** Rendered when the filtered list is empty. */
  emptyState?: ReactNode
  /** Skip the click-outside / Escape close behavior. */
  manual?: boolean
  /** Hide the chevron toggle button. */
  hideChevron?: boolean
}

type DropdownSingleProps = DropdownBaseProps & {
  multiSelect?: false
  /** Controlled selected value. */
  value?: string
  /** Uncontrolled initial value. */
  defaultValue?: string
  /** Fires when the user picks an option. */
  onValueChange?: (value: string) => void
  multiLine?: never
}

type DropdownMultiProps = DropdownBaseProps & {
  multiSelect: true
  /** Controlled list of selected values. */
  value?: string[]
  /** Uncontrolled initial selected values. */
  defaultValue?: string[]
  /** Fires when the selection changes. */
  onValueChange?: (value: string[]) => void
  /** Wrap chips onto multiple rows; trigger height grows to fit. */
  multiLine?: boolean
}

export type DropdownProps = (DropdownSingleProps | DropdownMultiProps) &
  Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue">

function isMultiProps(
  p: DropdownSingleProps | DropdownMultiProps,
): p is DropdownMultiProps {
  return p.multiSelect === true
}

const ICON_BUTTON_SIZE: Record<DropdownSize, string> = {
  sm: "size-6 rounded-sm",
  md: "size-8 rounded-md",
  lg: "size-10 rounded-md",
}

const ICON_SIZE: Record<DropdownSize, "xs" | "sm"> = {
  sm: "xs",
  md: "sm",
  lg: "sm",
}

function nextEnabled(
  options: DropdownOption[],
  from: number,
  step: 1 | -1,
): number {
  if (options.length === 0) return -1
  const n = options.length
  for (let i = 0; i < n; i++) {
    const idx = (from + step * (i + 1) + n * (i + 1)) % n
    if (!options[idx]?.disabled) return idx
  }
  return -1
}

function firstEnabled(options: DropdownOption[]): number {
  return options.findIndex((o) => !o.disabled)
}

export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
  function Dropdown(props, ref) {
    const {
      options,
      placeholder = "Placeholder text here",
      size = "md",
      error = false,
      disabled = false,
      readOnly = false,
      icon,
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      emptyState = "No results",
      manual = false,
      hideChevron = false,
      className,
      id,
      onKeyDown,
      ...rest
    } = props

    const isMulti = isMultiProps(props)

    const isOpenControlled = openProp !== undefined
    const [internalOpen, setInternalOpen] = useState(defaultOpen)
    const isOpen = isOpenControlled ? !!openProp : internalOpen

    const setOpen = useCallback(
      (next: boolean) => {
        if (disabled || readOnly) return
        if (!isOpenControlled) setInternalOpen(next)
        onOpenChange?.(next)
      },
      [disabled, readOnly, isOpenControlled, onOpenChange],
    )

    // Single value ----------------------------------------------------
    const singleProps = props as DropdownSingleProps
    const isSingleValueControlled = !isMulti && singleProps.value !== undefined
    const [internalSingle, setInternalSingle] = useState<string>(
      !isMulti ? (singleProps.defaultValue ?? "") : "",
    )
    const singleValue = isSingleValueControlled
      ? (singleProps.value ?? "")
      : internalSingle

    // Multi value -----------------------------------------------------
    const multiProps = props as DropdownMultiProps
    const isMultiValueControlled = isMulti && multiProps.value !== undefined
    const [internalMulti, setInternalMulti] = useState<string[]>(
      isMulti ? (multiProps.defaultValue ?? []) : [],
    )
    const multiValue = isMultiValueControlled
      ? (multiProps.value ?? [])
      : internalMulti

    const selectedSet = useMemo(
      () => new Set<string>(isMulti ? multiValue : []),
      [isMulti, multiValue],
    )

    const handleSingleSelect = (next: string) => {
      if (!isSingleValueControlled) setInternalSingle(next)
      ;(singleProps.onValueChange as ((v: string) => void) | undefined)?.(next)
      setOpen(false)
    }

    const toggleMulti = (next: string) => {
      const has = selectedSet.has(next)
      const updated = has
        ? multiValue.filter((v) => v !== next)
        : [...multiValue, next]
      if (!isMultiValueControlled) setInternalMulti(updated)
      ;(multiProps.onValueChange as ((v: string[]) => void) | undefined)?.(
        updated,
      )
    }

    const removeChip = (val: string, e: MouseEvent) => {
      e.stopPropagation()
      const updated = multiValue.filter((v) => v !== val)
      if (!isMultiValueControlled) setInternalMulti(updated)
      ;(multiProps.onValueChange as ((v: string[]) => void) | undefined)?.(
        updated,
      )
    }

    const clearAllMulti = (e: MouseEvent) => {
      e.stopPropagation()
      if (!isMultiValueControlled) setInternalMulti([])
      ;(multiProps.onValueChange as ((v: string[]) => void) | undefined)?.([])
    }

    // Active descendant — -1 until the user moves the keyboard cursor or
    // hovers a row. Matches the Figma open state, which shows all rows flat
    // until the user interacts. Selected rows still paint via `selected`.
    const [activeIndex, setActiveIndex] = useState<number>(-1)

    useEffect(() => {
      if (!isOpen) {
        setActiveIndex(-1)
        return
      }
      if (options.length === 0) {
        setActiveIndex(-1)
        return
      }
      // On open, land the cursor on the selected row if there is one — that
      // matches the Figma "Selected" + "Active" composite. Otherwise leave
      // the menu un-highlighted until the user navigates.
      const target = isMulti
        ? -1
        : options.findIndex((o) => o.value === singleValue && !o.disabled)
      setActiveIndex(target >= 0 ? target : -1)
    }, [isOpen, options, isMulti, singleValue])

    // Click outside / Escape ------------------------------------------
    const rootRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
      if (!isOpen || manual) return
      const onDocPointer = (e: PointerEvent) => {
        const root = rootRef.current
        if (!root) return
        if (e.target instanceof Node && !root.contains(e.target)) {
          setOpen(false)
        }
      }
      const onEscape = (e: globalThis.KeyboardEvent) => {
        if (e.key === "Escape") {
          e.stopPropagation()
          setOpen(false)
        }
      }
      document.addEventListener("pointerdown", onDocPointer)
      document.addEventListener("keydown", onEscape)
      return () => {
        document.removeEventListener("pointerdown", onDocPointer)
        document.removeEventListener("keydown", onEscape)
      }
    }, [isOpen, manual, setOpen])

    const reactId = useId()
    const rootId = id ?? `dropdown-${reactId}`
    const listboxId = `${rootId}-listbox`
    const optionId = (i: number) => `${rootId}-option-${i}`

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(e)
      if (disabled || readOnly) return
      if (!isOpen) {
        if (
          e.key === "Enter" ||
          e.key === " " ||
          e.key === "ArrowDown" ||
          e.key === "ArrowUp"
        ) {
          e.preventDefault()
          setOpen(true)
        }
        return
      }
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          setActiveIndex((prev) => nextEnabled(options, prev, 1))
          break
        case "ArrowUp":
          e.preventDefault()
          setActiveIndex((prev) => nextEnabled(options, prev, -1))
          break
        case "Home":
          e.preventDefault()
          setActiveIndex(firstEnabled(options))
          break
        case "End": {
          e.preventDefault()
          for (let i = options.length - 1; i >= 0; i--) {
            if (!options[i]?.disabled) {
              setActiveIndex(i)
              break
            }
          }
          break
        }
        case "Enter":
        case " ": {
          if (activeIndex >= 0 && activeIndex < options.length) {
            const option = options[activeIndex]
            if (option && !option.disabled) {
              e.preventDefault()
              if (isMulti) toggleMulti(option.value)
              else handleSingleSelect(option.value)
            }
          }
          break
        }
        case "Tab":
          setOpen(false)
          break
      }
    }

    const selectedSingle = useMemo(
      () => options.find((o) => o.value === singleValue),
      [options, singleValue],
    )
    const selectedMulti = useMemo(
      () => options.filter((o) => selectedSet.has(o.value)),
      [options, selectedSet],
    )

    const dataState: "open" | "closed" = isOpen ? "open" : "closed"
    const showError = !!error && !disabled
    const triggerInteractive = !disabled && !readOnly

    // In multi-select the chevron toggle is always 24x24 with a 16px icon —
    // it shares the rail with the clear-all button. In single-select it
    // matches the field height (24/32/40 → sm/md/lg).
    const chevronContainerCls = isMulti
      ? "size-6 rounded-md"
      : ICON_BUTTON_SIZE[size]
    const chevronIconSize: "xs" | "sm" = isMulti ? "xs" : ICON_SIZE[size]

    const chevronIcon = !hideChevron && !readOnly && (
      <span
        aria-hidden
        className={cn(
          "inline-flex items-center justify-center shrink-0",
          chevronContainerCls,
          "text-[var(--color-icon-color)]",
          disabled && "text-[var(--color-disabled-text-color)]",
        )}
      >
        <Icon name="chevron-down" size={chevronIconSize} aria-hidden />
      </span>
    )

    const leadingIcon =
      icon != null ? (
        <Icon
          name={icon}
          size={ICON_SIZE[size]}
          aria-hidden
          className={cn(
            "shrink-0 text-[var(--color-icon-color)]",
            disabled && "text-[var(--color-disabled-text-color)]",
          )}
        />
      ) : null

    // ---- Trigger contents -------------------------------------------
    const renderSingleLabel = () => {
      const empty = !singleValue
      return (
        <span
          className={cn(
            "flex-1 min-w-0 truncate text-t2 leading-5 font-body",
            empty
              ? "text-[var(--color-placeholder-color)]"
              : "text-[var(--color-primary-text-color)]",
            disabled && "text-[var(--color-disabled-text-color)]",
          )}
        >
          {empty ? placeholder : (selectedSingle?.label ?? singleValue)}
        </span>
      )
    }

    const renderChips = () => {
      if (selectedMulti.length === 0) {
        return (
          <span
            className={cn(
              "flex-1 min-w-0 truncate text-t2 leading-5 font-body",
              "text-[var(--color-placeholder-color)]",
              disabled && "text-[var(--color-disabled-text-color)]",
            )}
          >
            {placeholder}
          </span>
        )
      }
      return (
        <div
          className={cn(
            "flex flex-1 min-w-0 gap-2 items-start",
            (props as DropdownMultiProps).multiLine
              ? "flex-wrap"
              : "flex-nowrap overflow-hidden",
          )}
        >
          {selectedMulti.map((opt) => (
            <span
              key={opt.value}
              className={cn(
                "inline-flex items-center gap-1 h-6 rounded-md shrink-0",
                "bg-[var(--color-primary-selected-color)]",
                "pl-2 pr-1",
                "text-t2 font-body text-[var(--color-primary-text-color)]",
              )}
            >
              <span className="leading-5 truncate max-w-[160px]">
                {opt.label}
              </span>
              {triggerInteractive && (
                <button
                  type="button"
                  onClick={(e) => removeChip(opt.value, e)}
                  aria-label={`Remove ${opt.label}`}
                  className={cn(
                    "inline-flex items-center justify-center size-4 rounded-sm shrink-0 cursor-pointer",
                    "text-[var(--color-icon-color)]",
                    "hover:bg-[var(--color-primary-background-hover-color)]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-color)]",
                  )}
                >
                  <Icon name="x-mark-small" size="2xs" aria-hidden />
                </button>
              )}
            </span>
          ))}
        </div>
      )
    }

    // ---- Trigger element --------------------------------------------
    const triggerCommonProps = {
      role: "combobox" as const,
      "aria-expanded": isOpen,
      "aria-controls": listboxId,
      "aria-haspopup": "listbox" as const,
      "aria-activedescendant":
        isOpen && activeIndex >= 0 ? optionId(activeIndex) : undefined,
      "aria-disabled": disabled || undefined,
      "aria-readonly": readOnly || undefined,
      "data-state": dataState,
      "data-error": showError || undefined,
      "data-disabled": disabled || undefined,
      "data-readonly": readOnly || undefined,
      tabIndex: triggerInteractive ? 0 : -1,
      onClick: () => {
        if (triggerInteractive) setOpen(!isOpen)
      },
      onKeyDown: handleKeyDown,
    }

    const renderTrigger = () => {
      if (isMulti) {
        const multiLine = !!(props as DropdownMultiProps).multiLine
        return (
          <div
            className={cn(
              triggerMulti({
                size,
                multiLine,
              }),
            )}
            {...triggerCommonProps}
          >
            {leadingIcon}
            {renderChips()}
            {triggerInteractive && selectedMulti.length > 0 && (
              <button
                type="button"
                onClick={clearAllMulti}
                aria-label="Clear all"
                className={cn(
                  "inline-flex items-center justify-center shrink-0 cursor-pointer rounded-md",
                  "size-6 text-[var(--color-icon-color)]",
                  "hover:bg-[var(--color-primary-background-hover-color)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-color)]",
                )}
              >
                <Icon name="x-mark-small" size="xs" aria-hidden />
              </button>
            )}
            {chevronIcon}
          </div>
        )
      }
      return (
        <div className={cn(trigger({ size }))} {...triggerCommonProps}>
          {leadingIcon}
          {renderSingleLabel()}
          {chevronIcon}
        </div>
      )
    }

    // ---- Menu list ---------------------------------------------------
    const menu = isOpen ? (
      <div
        className={cn(
          "absolute left-0 right-0 top-full mt-2 z-50",
          "rounded-md bg-[var(--color-secondary-background-color)] p-2 shadow-md",
          "border border-transparent",
        )}
      >
        <div
          role="listbox"
          id={listboxId}
          aria-multiselectable={isMulti || undefined}
          className="flex flex-col items-stretch w-full"
        >
          {options.length === 0 ? (
            <ListItem variant="information">{emptyState}</ListItem>
          ) : (
            options.map((option, index) => {
              const isSelected = isMulti
                ? selectedSet.has(option.value)
                : option.value === singleValue
              const isHighlighted = index === activeIndex
              return (
                <ListItem
                  key={option.value}
                  id={optionId(index)}
                  role="option"
                  icon={option.icon}
                  active={isSelected || isHighlighted}
                  disabled={option.disabled}
                  aria-selected={isSelected}
                  onMouseEnter={() => {
                    if (!option.disabled) setActiveIndex(index)
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    if (option.disabled) return
                    if (isMulti) toggleMulti(option.value)
                    else handleSingleSelect(option.value)
                  }}
                >
                  {option.label}
                </ListItem>
              )
            })
          )}
        </div>
      </div>
    ) : null

    return (
      <div
        ref={(node) => {
          ;(rootRef as { current: HTMLDivElement | null }).current = node
          if (typeof ref === "function") ref(node)
          else if (ref)
            (ref as { current: HTMLDivElement | null }).current = node
        }}
        id={rootId}
        className={cn("relative w-full", className)}
        {...rest}
      >
        {renderTrigger()}
        {menu}
      </div>
    )
  },
)
