import {
  createContext,
  forwardRef,
  useContext,
  useId,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from "react"
import { cva } from "class-variance-authority"
import { cn } from "../../lib/cn"
import { Icon } from "../Icon"
import type { IconName } from "../../icons/names"

/**
 * Tabs — sourced from the TimeWorks Figma file (page "Tabs", node 46939:7916).
 *
 * Compositional API mirrors Radix UI's Tabs primitive so consumers familiar
 * with Radix don't have to learn a second shape:
 *
 *   <Tabs defaultValue="overview">
 *     <TabsList>
 *       <TabsTrigger value="overview">Overview</TabsTrigger>
 *       <TabsTrigger value="details" leftIcon="bell">Details</TabsTrigger>
 *       <TabsTrigger value="usage" counter={12}>Usage</TabsTrigger>
 *     </TabsList>
 *     <TabsContent value="overview">…</TabsContent>
 *   </Tabs>
 *
 * @radix-ui/react-tabs isn't a dependency yet, so the pattern is implemented
 * by hand: arrow-key navigation, roving tabindex, and the WAI-ARIA tab roles
 * are wired up directly. When the Radix dep is approved this can be swapped
 * underneath without changing the public API.
 */

export type TabsOnColor = "light" | "dark"

type TabsContextValue = {
  value: string
  setValue: (next: string) => void
  baseId: string
  onColor: TabsOnColor
  registerTrigger: (value: string, node: HTMLButtonElement | null) => void
  focusTrigger: (value: string) => void
  triggerOrder: () => string[]
}

const TabsContext = createContext<TabsContextValue | null>(null)

function useTabs() {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error("Tabs subcomponents must be rendered inside <Tabs>.")
  return ctx
}

export type TabsProps = Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> & {
  value?: string
  defaultValue?: string
  onValueChange?: (next: string) => void
  /** Switches the palette to read on inverted (dark / black) surfaces. */
  onColor?: TabsOnColor
  children?: ReactNode
}

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  {
    value,
    defaultValue,
    onValueChange,
    onColor = "light",
    className,
    children,
    ...rest
  },
  ref,
) {
  const [internal, setInternal] = useState<string>(defaultValue ?? "")
  const isControlled = value !== undefined
  const current = isControlled ? value : internal
  const baseId = useId()

  // Track triggers in DOM order so arrow-key navigation + auto-activation
  // can move forward / backward through them.
  const triggers = useRef(new Map<string, HTMLButtonElement>())

  const setValue = (next: string) => {
    if (!isControlled) setInternal(next)
    onValueChange?.(next)
  }

  const ctx: TabsContextValue = useMemo(
    () => ({
      value: current,
      setValue,
      baseId,
      onColor,
      registerTrigger: (val, node) => {
        if (node) triggers.current.set(val, node)
        else triggers.current.delete(val)
      },
      focusTrigger: (val) => {
        triggers.current.get(val)?.focus()
      },
      triggerOrder: () => {
        // Sort by document position so we follow visual order even if
        // children are rendered in a non-linear shape.
        return Array.from(triggers.current.entries())
          .sort(([, a], [, b]) =>
            a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
          )
          .map(([val]) => val)
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [current, baseId, onColor],
  )

  return (
    <TabsContext.Provider value={ctx}>
      <div ref={ref} className={cn("flex flex-col", className)} {...rest}>
        {children}
      </div>
    </TabsContext.Provider>
  )
})

const list = cva("flex w-full items-stretch", {
  variants: {
    stretched: {
      true: "[&>[role=tab]]:flex-1",
      false: "",
    },
  },
  defaultVariants: { stretched: false },
})

export type TabsListProps = HTMLAttributes<HTMLDivElement> & {
  /** Tabs share the available width when true; otherwise they hug content. */
  stretched?: boolean
  "aria-label"?: string
}

export const TabsList = forwardRef<HTMLDivElement, TabsListProps>(function TabsList(
  { className, stretched = false, "aria-label": ariaLabel, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      role="tablist"
      aria-label={ariaLabel}
      aria-orientation="horizontal"
      className={cn(list({ stretched }), className)}
      {...rest}
    >
      {children}
    </div>
  )
})

const trigger = cva(
  // Per-tab layout: a column with the inner row and a 2px underline.
  // max-h-[33px] mirrors Figma .Tabs base (4 + 22 + 4 + 1 gap + 2 underline).
  "group relative inline-flex flex-col items-stretch gap-px max-h-[33px] rounded-sm font-body outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-color)] focus-visible:ring-offset-1 disabled:cursor-not-allowed",
  {
    variants: {
      onColor: {
        light: "",
        dark: "",
      },
    },
    defaultVariants: { onColor: "light" },
  },
)

const triggerInner = cva(
  "flex items-center justify-center gap-1 px-4 py-1 rounded-sm text-t1 leading-[22px] whitespace-nowrap transition-colors duration-150",
  {
    variants: {
      onColor: {
        light: "text-[var(--color-primary-text-color)]",
        dark: "text-[var(--color-text-color-on-inverted)]",
      },
      disabled: { true: "", false: "" },
      hoverable: { true: "", false: "" },
    },
    compoundVariants: [
      {
        onColor: "light",
        hoverable: true,
        disabled: false,
        class: "group-hover:bg-[var(--color-primary-background-hover-color)]",
      },
      {
        onColor: "dark",
        hoverable: true,
        disabled: false,
        class: "group-hover:bg-white/10",
      },
      {
        onColor: "light",
        disabled: true,
        class: "text-[var(--color-disabled-text-color)]",
      },
      {
        onColor: "dark",
        disabled: true,
        class: "text-white/40",
      },
    ],
    defaultVariants: { onColor: "light", disabled: false, hoverable: true },
  },
)

const underline = cva("h-[2px] w-full transition-colors duration-150", {
  variants: {
    state: {
      idle: "",
      selected: "bg-[var(--color-primary-color)]",
      disabled: "",
    },
    onColor: { light: "", dark: "" },
  },
  compoundVariants: [
    { state: "idle", onColor: "light", class: "bg-[var(--color-ui-border-color)]" },
    { state: "idle", onColor: "dark", class: "bg-white/30" },
    { state: "disabled", onColor: "light", class: "bg-[var(--color-disabled-background-color)]" },
    { state: "disabled", onColor: "dark", class: "bg-white/10" },
  ],
  defaultVariants: { state: "idle", onColor: "light" },
})

export type TabsTriggerProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "value" | "type"
> & {
  value: string
  /** Optional icon rendered before the label. */
  leftIcon?: IconName
  /** Optional icon rendered after the label. */
  rightIcon?: IconName
  /** Optional counter rendered after the label as `/ N`. */
  counter?: number | string
}

export const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(function TabsTrigger(
  {
    value,
    leftIcon,
    rightIcon,
    counter,
    disabled = false,
    className,
    children,
    onClick,
    onKeyDown,
    ...rest
  },
  ref,
) {
  const { value: active, setValue, baseId, onColor, registerTrigger, focusTrigger, triggerOrder } =
    useTabs()
  const selected = active === value

  const handleRef = (node: HTMLButtonElement | null) => {
    registerTrigger(value, node)
    if (typeof ref === "function") ref(node)
    else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented) return
    const order = triggerOrder()
    const index = order.indexOf(value)
    if (index === -1) return
    let nextIndex: number | null = null
    if (event.key === "ArrowRight") nextIndex = (index + 1) % order.length
    else if (event.key === "ArrowLeft") nextIndex = (index - 1 + order.length) % order.length
    else if (event.key === "Home") nextIndex = 0
    else if (event.key === "End") nextIndex = order.length - 1
    if (nextIndex === null) return
    event.preventDefault()
    const nextValue = order[nextIndex]
    if (!nextValue) return
    setValue(nextValue)
    focusTrigger(nextValue)
  }

  const state: "idle" | "selected" | "disabled" = disabled
    ? "disabled"
    : selected
      ? "selected"
      : "idle"

  return (
    <button
      ref={handleRef}
      role="tab"
      type="button"
      id={`${baseId}-tab-${value}`}
      aria-selected={selected}
      aria-controls={`${baseId}-panel-${value}`}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      tabIndex={selected ? 0 : -1}
      data-state={selected ? "active" : "inactive"}
      data-disabled={disabled || undefined}
      onClick={(event) => {
        onClick?.(event)
        if (event.defaultPrevented || disabled) return
        setValue(value)
      }}
      onKeyDown={handleKeyDown}
      className={cn(trigger({ onColor }), className)}
      {...rest}
    >
      <span className={triggerInner({ onColor, disabled, hoverable: !disabled })}>
        {leftIcon && <Icon name={leftIcon} size="sm" aria-hidden="true" />}
        <span>{children}</span>
        {counter !== undefined && (
          <span aria-hidden="true">{`/ ${counter}`}</span>
        )}
        {rightIcon && <Icon name={rightIcon} size="sm" aria-hidden="true" />}
      </span>
      <span aria-hidden="true" className={underline({ state, onColor })} />
    </button>
  )
})

export type TabsContentProps = HTMLAttributes<HTMLDivElement> & {
  value: string
  /** Keep the panel mounted (and just hidden) when not active. */
  forceMount?: boolean
}

export const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(function TabsContent(
  { value, forceMount = false, className, children, ...rest },
  ref,
) {
  const { value: active, baseId } = useTabs()
  const selected = active === value
  if (!selected && !forceMount) return null
  return (
    <div
      ref={ref}
      role="tabpanel"
      id={`${baseId}-panel-${value}`}
      aria-labelledby={`${baseId}-tab-${value}`}
      hidden={!selected}
      tabIndex={0}
      className={cn("pt-4 outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-color)] rounded-sm", className)}
      {...rest}
    >
      {children}
    </div>
  )
})
