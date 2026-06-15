import { cva, type VariantProps } from "class-variance-authority"
import {
  forwardRef,
  useEffect,
  useMemo,
  useState,
  type HTMLAttributes,
} from "react"
import { IconButton } from "../IconButton"
import { cn } from "../../lib/cn"

/**
 * DatePicker — sourced from the TimeWorks Figma file
 * (page "Date Picker", node 46939:7892; component set 46939:100511).
 *
 *   <DatePicker mode="single" onValueChange={setDate} />
 *   <DatePicker mode="range"  onValueChange={setRange} />
 *   <DatePicker mode="single" numberOfMonths={2} />
 *
 * A calendar surface for picking a single date, a date range, or just
 * displaying a month. Three modes match the Figma variant axis:
 *   - default  · read-only month grid, no selection state
 *   - single   · click a day to select it
 *   - range    · click two days to define a from/to range
 *
 * Optional `numberOfMonths={2}` renders two consecutive months side-by-side
 * (Figma "Number of months=2"). `withDialog={false}` removes the floating
 * white surface for inline use inside another container. `theme` switches
 * between the light, pink, and black surface treatments shipped in Figma.
 *
 * Weeks start on Monday to match the Figma column order (Mo Tu … Su).
 */

// ---------- date utilities (kept local — no external dep) -------------------

const WEEKDAY_LABELS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"] as const
const MONTH_LABELS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

function addMonths(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth() + n, 1)
}

function isSameDay(a: Date | null | undefined, b: Date | null | undefined): boolean {
  if (!a || !b) return false
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
}

// JS getDay() returns 0 (Sun) – 6 (Sat). Convert to Mon-first index 0–6.
function monFirstIndex(d: Date): number {
  return (d.getDay() + 6) % 7
}

function buildMonthGrid(view: Date): Array<Array<Date | null>> {
  const first = startOfMonth(view)
  const leading = monFirstIndex(first)
  const daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate()
  const cells: Array<Date | null> = []
  for (let i = 0; i < leading; i++) cells.push(null)
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(new Date(view.getFullYear(), view.getMonth(), day))
  }
  while (cells.length % 7 !== 0) cells.push(null)
  const weeks: Array<Array<Date | null>> = []
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7))
  }
  return weeks
}

// ---------- types -----------------------------------------------------------

export type DatePickerMode = "default" | "single" | "range"
export type DatePickerTheme = "light" | "black" | "pink"
export type DatePickerRange = { from: Date | null; to: Date | null }
export type DatePickerValue = Date | DatePickerRange | null

// ---------- styles ----------------------------------------------------------

// Color tokens resolve via the [data-theme="..."] override blocks; the root
// carries `data-theme={theme}` so child elements pick up the correct mode
// regardless of the surrounding page theme.
const surface = cva(
  "inline-flex items-start text-[var(--color-primary-text-color)]",
  {
    variants: {
      withDialog: {
        true: "rounded-md border shadow-md p-[22px] bg-[var(--color-secondary-background-color)] border-[var(--color-layout-border-color)]",
        false: "p-0",
      },
    },
    defaultVariants: { withDialog: true },
  },
)

type SurfaceVariants = VariantProps<typeof surface>

// ---------- props -----------------------------------------------------------

export type DatePickerProps = Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue" | "children"> &
  Omit<SurfaceVariants, "theme" | "withDialog"> & {
    theme?: DatePickerTheme
    withDialog?: boolean
    /** Selection behavior. */
    mode?: DatePickerMode
    /** Controlled value. Pair with `onValueChange`. */
    value?: DatePickerValue
    /** Uncontrolled initial value. */
    defaultValue?: DatePickerValue
    /** Fires when the user picks a date or completes a range. */
    onValueChange?: (value: DatePickerValue) => void
    /** Controlled visible month (1st of the month). Pair with `onMonthChange`. */
    month?: Date
    /** Uncontrolled initial visible month (defaults to today). */
    defaultMonth?: Date
    /** Fires when the user navigates to a different month. */
    onMonthChange?: (month: Date) => void
    /** Render two consecutive months side-by-side. */
    numberOfMonths?: 1 | 2
    /** Disable individual days (e.g. blackout dates). */
    isDateDisabled?: (date: Date) => boolean
  }

// ---------- internal: a single day cell -------------------------------------

type DayCellProps = {
  date: Date | null
  today: Date
  mode: DatePickerMode
  selected: Date | null
  range: DatePickerRange
  rangeHover: Date | null
  isOutsideMonth: boolean
  disabled: boolean
  /** Column index 0–6 within the week row. Lets the range stripe round
   *  its end-cap when the range straddles a row boundary. */
  columnIndex: number
  onSelect: (d: Date) => void
  onHover: (d: Date | null) => void
}

function DayCell({
  date,
  today,
  mode,
  selected,
  range,
  rangeHover,
  isOutsideMonth,
  disabled,
  columnIndex,
  onSelect,
  onHover,
}: DayCellProps) {
  if (!date || isOutsideMonth) {
    return <div className="size-10 shrink-0" aria-hidden="true" />
  }

  const isToday = isSameDay(date, today)
  const isSelected =
    mode === "single" ? isSameDay(date, selected) : false

  // Range computations — use the live hover end for visual feedback while
  // the user is mid-selection (range.from set, range.to null).
  const rangeStart = range.from
  const rangeEnd = range.to ?? (range.from && rangeHover ? rangeHover : null)
  const lo = rangeStart && rangeEnd && rangeStart.getTime() <= rangeEnd.getTime() ? rangeStart : rangeEnd
  const hi = rangeStart && rangeEnd && rangeStart.getTime() <= rangeEnd.getTime() ? rangeEnd : rangeStart

  const isRangeStart =
    mode === "range" && lo && hi && isSameDay(date, lo) && !isSameDay(lo, hi)
  const isRangeEnd =
    mode === "range" && lo && hi && isSameDay(date, hi) && !isSameDay(lo, hi)
  const isRangeSpan =
    mode === "range" &&
    lo &&
    hi &&
    date.getTime() > lo.getTime() &&
    date.getTime() < hi.getTime()
  const isRangeSingle =
    mode === "range" && rangeStart && !rangeEnd && isSameDay(date, rangeStart)
  const isRangeEdgeFilled = isRangeStart || isRangeEnd || isRangeSingle

  const interactive = mode !== "default" && !disabled

  // Stripe behind range cells — drawn behind the circle so endpoints look
  // like a filled circle attached to a coloured strip.
  const stripeClass = (() => {
    if (!isRangeSpan && !isRangeStart && !isRangeEnd) return null
    const stripeBg = "bg-[var(--color-primary-selected-color)]"
    // Round the stripe end-cap when it terminates at a row boundary,
    // matching Figma's "Range span" wrap behavior.
    const roundLeft = columnIndex === 0 ? "rounded-l-md" : ""
    const roundRight = columnIndex === 6 ? "rounded-r-md" : ""
    if (isRangeSpan)
      return cn("absolute inset-y-0 inset-x-0", stripeBg, roundLeft, roundRight)
    if (isRangeStart)
      return cn("absolute inset-y-0 left-1/2 right-0", stripeBg, roundRight)
    if (isRangeEnd)
      return cn("absolute inset-y-0 left-0 right-1/2", stripeBg, roundLeft)
    return null
  })()

  // Filled circle for selected / range endpoints.
  const filledCircle = isSelected || isRangeEdgeFilled

  // Today gets an outlined circle (Figma "State=Today") only when not
  // already filled by selection.
  const showTodayRing = isToday && !filledCircle

  const textColor = filledCircle
    ? "text-[var(--color-text-color-on-primary)]"
    : "text-[var(--color-primary-text-color)]"

  const hoverBg =
    interactive && !filledCircle
      ? "hover:before:bg-[var(--color-primary-selected-color)]"
      : ""

  return (
    <button
      type="button"
      disabled={!interactive}
      onClick={() => interactive && onSelect(date)}
      onMouseEnter={() => mode === "range" && onHover(date)}
      onFocus={() => mode === "range" && onHover(date)}
      onMouseLeave={() => mode === "range" && onHover(null)}
      data-today={isToday || undefined}
      data-selected={(isSelected || isRangeEdgeFilled) || undefined}
      aria-pressed={isSelected || isRangeEdgeFilled || undefined}
      aria-label={date.toDateString()}
      className={cn(
        "relative size-10 shrink-0 flex items-center justify-center text-t1 font-normal",
        "before:content-[''] before:absolute before:inset-0 before:m-auto before:size-10 before:rounded-full before:transition-colors",
        hoverBg,
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-color)] focus-visible:rounded-full",
        !interactive && "cursor-default",
        interactive && "cursor-pointer",
        disabled && "opacity-40 cursor-not-allowed",
      )}
    >
      {stripeClass ? <span aria-hidden="true" className={cn(stripeClass)} /> : null}
      {filledCircle ? (
        <span
          aria-hidden="true"
          className="absolute inset-0 m-auto size-10 rounded-full bg-[var(--color-primary-color)]"
        />
      ) : null}
      {showTodayRing ? (
        <span
          aria-hidden="true"
          className="absolute inset-0 m-auto size-10 rounded-full border border-[var(--color-primary-color)]"
        />
      ) : null}
      <span className={cn("relative z-[1] leading-[22px]", textColor)}>
        {date.getDate()}
      </span>
    </button>
  )
}

// ---------- internal: a single month panel ----------------------------------

type MonthPanelProps = {
  view: Date
  today: Date
  mode: DatePickerMode
  selected: Date | null
  range: DatePickerRange
  rangeHover: Date | null
  isDateDisabled?: (date: Date) => boolean
  showPrev: boolean
  showNext: boolean
  onPrev: () => void
  onNext: () => void
  onSelect: (d: Date) => void
  onHover: (d: Date | null) => void
}

function MonthPanel({
  view,
  today,
  mode,
  selected,
  range,
  rangeHover,
  isDateDisabled,
  showPrev,
  showNext,
  onPrev,
  onNext,
  onSelect,
  onHover,
}: MonthPanelProps) {
  const weeks = useMemo(() => buildMonthGrid(view), [view])
  const headerLabel = `${MONTH_LABELS[view.getMonth()]} ${view.getFullYear()}`
  const weekDayClass = "text-[var(--color-secondary-text-color)]"

  return (
    <div className="flex flex-col gap-5 px-6">
      {/* Month header */}
      <div className="flex items-center justify-between w-[280px]">
        <div className="size-6 shrink-0">
          {showPrev ? (
            <IconButton
              kind="tertiary"
              size="xs"
              icon="arrow-left"
              aria-label="Previous month"
              onClick={onPrev}
              className="[&>span]:!p-[2px]"
            />
          ) : null}
        </div>
        <div className="flex items-center gap-1">
          <span className="text-h3 font-normal leading-[18px]">
            {headerLabel}
          </span>
          <IconButton
            kind="tertiary"
            size="xs"
            icon="chevron-down"
            aria-label="Choose year"
            tabIndex={-1}
            className="[&>span]:!p-[2px]"
          />
        </div>
        <div className="size-6 shrink-0">
          {showNext ? (
            <IconButton
              kind="tertiary"
              size="xs"
              icon="arrow-right"
              aria-label="Next month"
              onClick={onNext}
              className="[&>span]:!p-[2px]"
            />
          ) : null}
        </div>
      </div>

      {/* Calendar grid */}
      <div className="flex flex-col items-start">
        <div className="flex items-center w-full">
          {WEEKDAY_LABELS.map((d) => (
            <span
              key={d}
              className={cn(
                "w-10 shrink-0 text-center text-t3 font-normal leading-4",
                weekDayClass,
              )}
            >
              {d}
            </span>
          ))}
        </div>
        <div className="flex flex-col gap-0.5 w-full">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex items-center w-full">
              {week.map((date, di) => (
                <DayCell
                  key={di}
                  date={date}
                  today={today}
                  mode={mode}
                  selected={selected}
                  range={range}
                  rangeHover={rangeHover}
                  isOutsideMonth={date != null && !isSameMonth(date, view)}
                  disabled={date != null && (isDateDisabled?.(date) ?? false)}
                  columnIndex={di}
                  onSelect={onSelect}
                  onHover={onHover}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ---------- top-level component ---------------------------------------------

function isDatePickerRange(v: DatePickerValue): v is DatePickerRange {
  return v != null && !(v instanceof Date) && "from" in v
}

function asSingleDate(v: DatePickerValue): Date | null {
  if (v instanceof Date) return v
  return null
}

function asRange(v: DatePickerValue): DatePickerRange {
  if (isDatePickerRange(v)) return v
  return { from: null, to: null }
}

export const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(
  function DatePicker(
    {
      mode = "single",
      value,
      defaultValue,
      onValueChange,
      month,
      defaultMonth,
      onMonthChange,
      numberOfMonths = 1,
      withDialog = true,
      theme = "light",
      isDateDisabled,
      className,
      ...rest
    },
    ref,
  ) {
    const isValueControlled = value !== undefined
    const initialValue = (() => {
      if (defaultValue !== undefined) return defaultValue
      if (mode === "range") return { from: null, to: null } as DatePickerRange
      return null
    })()
    const [internalValue, setInternalValue] = useState<DatePickerValue>(initialValue)
    const current = isValueControlled ? value : internalValue

    const today = useMemo(() => {
      const now = new Date()
      return new Date(now.getFullYear(), now.getMonth(), now.getDate())
    }, [])

    // Visible month: controlled or uncontrolled. Default to today's month,
    // or to the selected date if one is provided.
    const isMonthControlled = month !== undefined
    const initialMonth = (() => {
      if (defaultMonth) return startOfMonth(defaultMonth)
      const single = asSingleDate(current)
      if (single) return startOfMonth(single)
      const r = asRange(current)
      if (r.from) return startOfMonth(r.from)
      return startOfMonth(today)
    })()
    const [internalMonth, setInternalMonth] = useState<Date>(initialMonth)
    const view = isMonthControlled ? startOfMonth(month) : internalMonth

    const setView = (next: Date) => {
      if (!isMonthControlled) setInternalMonth(next)
      onMonthChange?.(next)
    }

    // Hover end for live range preview.
    const [rangeHover, setRangeHover] = useState<Date | null>(null)

    // Reset hover when selection completes.
    useEffect(() => {
      const r = asRange(current)
      if (r.from && r.to) setRangeHover(null)
    }, [current])

    const handleSelect = (d: Date) => {
      if (mode === "default") return
      if (mode === "single") {
        if (!isValueControlled) setInternalValue(d)
        onValueChange?.(d)
        return
      }
      // range
      const r = asRange(current)
      let next: DatePickerRange
      if (!r.from || (r.from && r.to)) {
        next = { from: d, to: null }
      } else {
        // pick second endpoint; auto-swap if user clicked an earlier date.
        if (d.getTime() < r.from.getTime()) {
          next = { from: d, to: r.from }
        } else {
          next = { from: r.from, to: d }
        }
      }
      if (!isValueControlled) setInternalValue(next)
      onValueChange?.(next)
    }

    const single = asSingleDate(current)
    const range = asRange(current)

    const months = numberOfMonths === 2 ? [view, addMonths(view, 1)] : [view]

    return (
      <div
        ref={ref}
        role="group"
        aria-label="Date picker"
        data-theme={theme}
        className={cn(surface({ withDialog }), className)}
        {...rest}
      >
        <div className="flex items-start">
          {months.map((m, i) => (
            <MonthPanel
              key={`${m.getFullYear()}-${m.getMonth()}`}
              view={m}
              today={today}
              mode={mode}
              selected={single}
              range={range}
              rangeHover={rangeHover}
              isDateDisabled={isDateDisabled}
              showPrev={i === 0}
              showNext={i === months.length - 1}
              onPrev={() => setView(addMonths(view, -1))}
              onNext={() => setView(addMonths(view, 1))}
              onSelect={handleSelect}
              onHover={setRangeHover}
            />
          ))}
        </div>
      </div>
    )
  },
)
