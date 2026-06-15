import * as RadixSwitch from "@radix-ui/react-switch"
import { cva, type VariantProps } from "class-variance-authority"
import {
  forwardRef,
  useId,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type ReactNode,
} from "react"
import { cn } from "../../lib/cn"

/**
 * Toggle — sourced from the TimeWorks Figma file
 * (page "Toggle", node 46949:40910).
 *
 *   <Toggle defaultChecked />
 *   <Toggle size="sm" checked={value} onCheckedChange={setValue} />
 *   <Toggle labelOff={null} labelOn={null} aria-label="Notifications" />
 *
 * Built on @radix-ui/react-switch so keyboard, focus, and ARIA semantics
 * come from Radix. The flanking "Off" / "On" labels match the canonical
 * Figma look; pass `null` to either to hide it for a bare switch.
 */

export type ToggleSize = "sm" | "md"

const track = cva(
  [
    "peer relative inline-flex shrink-0 items-center rounded-full",
    "transition-colors duration-150 ease-out",
    "outline-none",
    "focus-visible:ring-2 focus-visible:ring-[var(--color-primary-color)] focus-visible:ring-offset-2",
    "data-[state=unchecked]:bg-[var(--color-ui-border-color)]",
    "data-[state=checked]:bg-[var(--color-primary-color)]",
    "hover:data-[state=checked]:bg-[var(--color-primary-hover-color)]",
    "disabled:cursor-not-allowed disabled:opacity-40",
  ].join(" "),
  {
    variants: {
      size: {
        md: "h-6 w-[42px] p-[3px]",
        sm: "h-4 w-7 p-0.5",
      },
    },
    defaultVariants: { size: "md" },
  },
)

const thumb = cva(
  [
    "pointer-events-none block rounded-full bg-[var(--color-primary-background-color)]",
    "transition-transform duration-150 ease-[cubic-bezier(0.32,0.72,0,1)]",
    "data-[state=unchecked]:translate-x-0",
  ],
  {
    variants: {
      size: {
        md: "size-[18px] data-[state=checked]:translate-x-[18px]",
        sm: "size-3 data-[state=checked]:translate-x-[12px]",
      },
    },
    defaultVariants: { size: "md" },
  },
)

type TrackVariants = VariantProps<typeof track>

type RadixSwitchProps = ComponentPropsWithoutRef<typeof RadixSwitch.Root>

export type ToggleProps = Omit<RadixSwitchProps, "asChild" | "children"> & {
  /** Visual size. Defaults to `"md"`. */
  size?: ToggleSize
  /**
   * Label shown to the LEFT of the track. Defaults to `"Off"`.
   * Pass `null` to hide for a bare switch (also pass `aria-label` then).
   */
  labelOff?: ReactNode
  /**
   * Label shown to the RIGHT of the track. Defaults to `"On"`.
   * Pass `null` to hide.
   */
  labelOn?: ReactNode
  /** Class applied to the wrapping label. */
  className?: string
  /** Class applied to the Radix Switch.Root (the track). */
  trackClassName?: string
}

export const Toggle = forwardRef<ElementRef<typeof RadixSwitch.Root>, ToggleProps>(
  function Toggle(
    {
      size = "md",
      labelOff = "Off",
      labelOn = "On",
      className,
      trackClassName,
      id,
      disabled,
      ...rest
    },
    ref,
  ) {
    const sizeKey: NonNullable<TrackVariants["size"]> = size
    const reactId = useId()
    const inputId = id ?? reactId

    const root = (
      <RadixSwitch.Root
        ref={ref}
        id={inputId}
        disabled={disabled}
        className={cn(track({ size: sizeKey }), trackClassName)}
        {...rest}
      >
        <RadixSwitch.Thumb className={thumb({ size: sizeKey })} />
      </RadixSwitch.Root>
    )

    if (labelOff == null && labelOn == null) {
      return <span className={cn("inline-flex", className)}>{root}</span>
    }

    const labelText = cn(
      "select-none font-body text-t2 leading-5 whitespace-nowrap",
      disabled
        ? "text-[var(--color-disabled-text-color)]"
        : "text-[var(--color-primary-text-color)]",
    )

    return (
      <label
        htmlFor={inputId}
        className={cn(
          "inline-flex items-center gap-2",
          disabled ? "cursor-not-allowed" : "cursor-pointer",
          className,
        )}
      >
        {labelOff != null && <span className={labelText}>{labelOff}</span>}
        {root}
        {labelOn != null && <span className={labelText}>{labelOn}</span>}
      </label>
    )
  },
)
