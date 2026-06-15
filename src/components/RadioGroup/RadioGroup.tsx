import * as RadixRadioGroup from "@radix-ui/react-radio-group"
import { cva, type VariantProps } from "class-variance-authority"
import {
  createContext,
  forwardRef,
  useContext,
  useId,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type ReactNode,
} from "react"
import { cn } from "../../lib/cn"

/**
 * RadioGroup — sourced from the TimeWorks Figma file
 * (page "Radio Button", node 46947:8991).
 *
 *   <RadioGroup defaultValue="day" aria-label="View">
 *     <Radio value="day">Day</Radio>
 *     <Radio value="week">Week</Radio>
 *   </RadioGroup>
 *
 * Built on @radix-ui/react-radio-group so keyboard, focus, and roving
 * tabindex behavior come from Radix. Visuals map the Figma State matrix
 * (Regular / Hover / Selected / Selected hover / Disabled / Disabled
 * selected / Error / Error hover) onto our CSS variables.
 *
 * The "selected" indicator is rendered via a 4px border on the box itself
 * (purple ring + white inner) — matching Figma. No center-dot SVG.
 */

type RadioGroupContextValue = { error: boolean }
const RadioGroupContext = createContext<RadioGroupContextValue>({ error: false })

const radioBox = cva(
  [
    "relative inline-flex shrink-0 items-center justify-center",
    "size-4 rounded-full border bg-[var(--color-primary-background-color)]",
    "transition-[border-color,border-width,background-color] duration-[120ms] ease-out",
    "outline-none",
    "focus-visible:ring-2 focus-visible:ring-[var(--color-primary-color)] focus-visible:ring-offset-2",
  ].join(" "),
  {
    variants: {
      tone: {
        // Regular: 1px neutral border, hover darkens to text-primary-text-color,
        // selected switches to a 4px primary ring (no center dot).
        default: [
          "border-[var(--color-ui-border-color)]",
          "hover:border-[var(--color-primary-text-color)]",
          "data-[state=checked]:border-4 data-[state=checked]:border-[var(--color-primary-color)]",
          "data-[state=checked]:hover:border-[var(--color-primary-hover-color)]",
          // Disabled (unselected): solid disabled fill, no border.
          "disabled:border-transparent disabled:bg-[var(--color-disabled-background-color)]",
          "disabled:hover:border-transparent",
          // Disabled selected: 4px disabled-bg ring around a disabled-text fill.
          "disabled:data-[state=checked]:border-4 disabled:data-[state=checked]:border-[var(--color-disabled-background-color)]",
          "disabled:data-[state=checked]:bg-[var(--color-disabled-text-color)]",
          "disabled:cursor-not-allowed",
        ].join(" "),
        // Error: 1px negative border, hover darkens. Selected keeps the negative
        // tone (Figma has no Error+selected fill — the red border carries it).
        error: [
          "border-[var(--color-negative-color)]",
          "hover:border-[var(--color-negative-color-hover)]",
          "data-[state=checked]:border-4 data-[state=checked]:border-[var(--color-negative-color)]",
          "data-[state=checked]:hover:border-[var(--color-negative-color-hover)]",
          "disabled:cursor-not-allowed",
        ].join(" "),
      },
    },
    defaultVariants: { tone: "default" },
  },
)

type RadioBoxVariants = VariantProps<typeof radioBox>

type RadixRadioGroupRootProps = ComponentPropsWithoutRef<typeof RadixRadioGroup.Root>

export type RadioGroupProps = Omit<RadixRadioGroupRootProps, "asChild"> & {
  /** Tints every child Radio's box with the negative border. */
  error?: boolean
  /** Optional helper / error text rendered below the group. */
  helperText?: ReactNode
}

export const RadioGroup = forwardRef<
  ElementRef<typeof RadixRadioGroup.Root>,
  RadioGroupProps
>(function RadioGroup(
  {
    error = false,
    helperText,
    orientation = "vertical",
    className,
    children,
    ...rest
  },
  ref,
) {
  const layout =
    orientation === "horizontal"
      ? "flex flex-row flex-wrap items-center gap-x-4 gap-y-2"
      : "flex flex-col gap-4"

  return (
    <RadioGroupContext.Provider value={{ error }}>
      <div className="flex flex-col gap-2">
        <RadixRadioGroup.Root
          ref={ref}
          orientation={orientation}
          className={cn(layout, className)}
          {...rest}
        >
          {children}
        </RadixRadioGroup.Root>
        {helperText != null && (
          <span
            className={cn(
              "font-body text-t3 leading-4",
              error
                ? "text-[var(--color-negative-color)]"
                : "text-[var(--color-secondary-text-color)]",
            )}
          >
            {helperText}
          </span>
        )}
      </div>
    </RadioGroupContext.Provider>
  )
})

type RadixRadioItemProps = ComponentPropsWithoutRef<typeof RadixRadioGroup.Item>

export type RadioProps = Omit<RadixRadioItemProps, "asChild"> & {
  /** Optional label rendered to the right of the box. */
  children?: ReactNode
  /** Class applied to the wrapping label / box-only container. */
  className?: string
  /** Class applied to the Radix Item (the box itself). */
  boxClassName?: string
}

export const Radio = forwardRef<
  ElementRef<typeof RadixRadioGroup.Item>,
  RadioProps
>(function Radio(
  { children, className, boxClassName, id, disabled, ...rest },
  ref,
) {
  const { error } = useContext(RadioGroupContext)
  const tone: NonNullable<RadioBoxVariants["tone"]> = error ? "error" : "default"
  const reactId = useId()
  const inputId = id ?? reactId

  const box = (
    <RadixRadioGroup.Item
      ref={ref}
      id={inputId}
      disabled={disabled}
      className={cn(radioBox({ tone }), boxClassName)}
      {...rest}
    />
  )

  if (children == null) {
    return <span className={cn("inline-flex", className)}>{box}</span>
  }

  return (
    <label
      htmlFor={inputId}
      className={cn(
        "inline-flex items-center gap-2 select-none font-body text-t2",
        disabled
          ? "cursor-not-allowed text-[var(--color-disabled-text-color)]"
          : "cursor-pointer text-[var(--color-primary-text-color)]",
        className,
      )}
    >
      {box}
      <span className="leading-5">{children}</span>
    </label>
  )
})
