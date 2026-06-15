import { cva, type VariantProps } from "class-variance-authority"
import {
  forwardRef,
  useEffect,
  useId,
  useMemo,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from "react"
import { Search } from "../Search"
import { ListItem } from "../ListItem"
import type { IconName } from "../../icons/names"
import { cn } from "../../lib/cn"

/**
 * Combobox — sourced from the TimeWorks Figma file
 * (page "Combobox", node 46939:7890; component set 46939:99013).
 *
 *   <Combobox
 *     options={[{ value: "1", label: "Option 1" }, ...]}
 *     onValueChange={setSelected}
 *   />
 *
 * Filters a long list of options against a search query. A surface around
 * a `<Search>` field, a list of `<ListItem>` rows, and an optional bottom
 * action button. Two presentations:
 *   - dialog (default) · elevated white popover with shadow + 8px radius
 *   - flat              · transparent surface for inline use inside a panel
 *
 * Three sizes match Figma — sm (244px) · md (273px) · lg (273px, taller search).
 *
 * Wires WAI-ARIA combobox + listbox semantics:
 *   - search input is the combobox (aria-controls / aria-activedescendant)
 *   - arrow keys move the highlight, Home/End jump, Enter selects
 *   - Disabled options are skipped during keyboard nav
 */

const surface = cva(
  ["flex flex-col items-stretch gap-2 p-2 relative"],
  {
    variants: {
      size: {
        sm: "w-[244px] rounded-md",
        md: "w-[273px] rounded-md",
        lg: "w-[273px] rounded-md",
      },
      dialog: {
        true: "bg-[var(--color-secondary-background-color)] shadow-md border border-transparent",
        false: "",
      },
    },
    defaultVariants: { size: "md", dialog: true },
  },
)

type SurfaceVariants = VariantProps<typeof surface>
export type ComboboxSize = NonNullable<SurfaceVariants["size"]>

export type ComboboxOption = {
  value: string
  label: string
  icon?: IconName
  disabled?: boolean
}

export type ComboboxBottomButton = {
  label: string
  icon?: IconName
  onClick?: () => void
  disabled?: boolean
}

export type ComboboxProps = Omit<HTMLAttributes<HTMLDivElement>, "onChange"> &
  SurfaceVariants & {
    /** Source list of options. */
    options: ComboboxOption[]
    /** Controlled selected value. Pair with `onValueChange`. */
    value?: string
    /** Uncontrolled initial selected value. */
    defaultValue?: string
    /** Fires when the user picks an option. */
    onValueChange?: (value: string) => void
    /** Controlled search query. Pair with `onSearchChange` and pre-filter `options`. */
    searchValue?: string
    /** Uncontrolled initial search query. */
    defaultSearchValue?: string
    /** Fires on every keystroke in the search input. */
    onSearchChange?: (query: string) => void
    /** Placeholder for the search field. */
    searchPlaceholder?: string
    /**
     * Optional bottom action row (e.g. "Edit"). Pass an object for the
     * default button-style ListItem, a custom ReactNode for full control,
     * or omit to hide.
     */
    button?: ComboboxBottomButton | ReactNode
    /** Rendered inside the list when no options match the query. */
    emptyState?: ReactNode
  }

function isBottomButtonConfig(
  value: ComboboxBottomButton | ReactNode,
): value is ComboboxBottomButton {
  return (
    typeof value === "object" &&
    value !== null &&
    !("$$typeof" in (value as Record<string, unknown>)) &&
    "label" in (value as Record<string, unknown>)
  )
}

const SEARCH_SIZE: Record<ComboboxSize, "sm" | "md" | "lg"> = {
  sm: "sm",
  md: "md",
  lg: "lg",
}

// Walk the filtered list to find the next/previous enabled option index,
// wrapping around. Returns -1 only if every option is disabled.
function nextEnabled(
  options: ComboboxOption[],
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

function firstEnabled(options: ComboboxOption[]): number {
  return options.findIndex((o) => !o.disabled)
}

function lastEnabled(options: ComboboxOption[]): number {
  for (let i = options.length - 1; i >= 0; i--) {
    if (!options[i]?.disabled) return i
  }
  return -1
}

export const Combobox = forwardRef<HTMLDivElement, ComboboxProps>(
  function Combobox(
    {
      options,
      value,
      defaultValue,
      onValueChange,
      searchValue,
      defaultSearchValue,
      onSearchChange,
      searchPlaceholder = "Placeholder text here",
      size = "md",
      dialog = true,
      button,
      emptyState,
      className,
      id,
      ...rest
    },
    ref,
  ) {
    const isValueControlled = value !== undefined
    const [internalValue, setInternalValue] = useState(defaultValue ?? "")
    const selected = isValueControlled ? value : internalValue

    const isSearchControlled = searchValue !== undefined
    const [internalQuery, setInternalQuery] = useState(defaultSearchValue ?? "")
    const query = isSearchControlled ? searchValue : internalQuery

    const filtered = useMemo(() => {
      if (isSearchControlled) return options
      const q = query.trim().toLowerCase()
      if (!q) return options
      return options.filter((o) => o.label.toLowerCase().includes(q))
    }, [options, query, isSearchControlled])

    // Highlight (active descendant) — distinct from `selected`.
    const [activeIndex, setActiveIndex] = useState<number>(() =>
      firstEnabled(filtered),
    )

    // Keep highlight in range when the filtered list changes (typing,
    // controlled prop changes). Land on the selected option when present;
    // otherwise the first enabled row.
    useEffect(() => {
      if (filtered.length === 0) {
        setActiveIndex(-1)
        return
      }
      const selectedIdx = filtered.findIndex(
        (o) => o.value === selected && !o.disabled,
      )
      if (selectedIdx >= 0) {
        setActiveIndex(selectedIdx)
        return
      }
      setActiveIndex((prev) => {
        if (prev >= 0 && prev < filtered.length && !filtered[prev]?.disabled) {
          return prev
        }
        return firstEnabled(filtered)
      })
    }, [filtered, selected])

    const handleSearch = (next: string) => {
      if (!isSearchControlled) setInternalQuery(next)
      onSearchChange?.(next)
    }

    const handleSelect = (next: string) => {
      if (!isValueControlled) setInternalValue(next)
      onValueChange?.(next)
    }

    const reactId = useId()
    const rootId = id ?? `combobox-${reactId}`
    const listboxId = `${rootId}-listbox`
    const optionId = (i: number) => `${rootId}-option-${i}`

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (filtered.length === 0) return
      switch (e.key) {
        case "ArrowDown": {
          e.preventDefault()
          setActiveIndex((prev) => nextEnabled(filtered, prev, 1))
          break
        }
        case "ArrowUp": {
          e.preventDefault()
          setActiveIndex((prev) => nextEnabled(filtered, prev, -1))
          break
        }
        case "Home": {
          e.preventDefault()
          setActiveIndex(firstEnabled(filtered))
          break
        }
        case "End": {
          e.preventDefault()
          setActiveIndex(lastEnabled(filtered))
          break
        }
        case "Enter": {
          if (activeIndex >= 0 && activeIndex < filtered.length) {
            const option = filtered[activeIndex]
            if (option && !option.disabled) {
              e.preventDefault()
              handleSelect(option.value)
            }
          }
          break
        }
      }
    }

    const bottomButton = (() => {
      if (button == null || button === false) return null
      if (isBottomButtonConfig(button)) {
        return (
          <ListItem
            variant="button"
            icon={button.icon}
            disabled={button.disabled}
            onClick={button.onClick}
          >
            {button.label}
          </ListItem>
        )
      }
      return button as ReactNode
    })()

    const activeDescendantId =
      activeIndex >= 0 && activeIndex < filtered.length
        ? optionId(activeIndex)
        : undefined

    return (
      <div
        ref={ref}
        id={rootId}
        className={cn(surface({ size, dialog }), className)}
        {...rest}
      >
        <Search
          size={SEARCH_SIZE[size ?? "md"]}
          value={query}
          onValueChange={handleSearch}
          onKeyDown={handleKeyDown}
          placeholder={searchPlaceholder}
          aria-label="Filter options"
          role="combobox"
          aria-expanded={true}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={activeDescendantId}
        />
        <div
          role="listbox"
          id={listboxId}
          className="flex flex-col items-stretch w-full"
        >
          {filtered.length === 0 ? (
            <ListItem variant="information">
              {emptyState ?? "No results"}
            </ListItem>
          ) : (
            filtered.map((option, index) => {
              const isSelected = option.value === selected
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
                  // Hover follows the keyboard highlight so mouse + keyboard
                  // stay in sync without stealing focus from the input.
                  onMouseEnter={() => {
                    if (!option.disabled) setActiveIndex(index)
                  }}
                  onClick={() => {
                    if (!option.disabled) handleSelect(option.value)
                  }}
                >
                  {option.label}
                </ListItem>
              )
            })
          )}
        </div>
        {bottomButton}
      </div>
    )
  },
)
