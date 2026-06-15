import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cva } from "class-variance-authority";
import { forwardRef, useCallback, useEffect, useId, useMemo, useRef, useState, } from "react";
import { Icon } from "../Icon";
import { ListItem } from "../ListItem";
import { cn } from "../../lib/cn";
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
const HOVER_BORDER = "[&:hover:not([data-state=open]):not([data-error=true]):not([data-disabled]):not([data-readonly])]:border-[var(--color-primary-text-color)]";
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
].join(" ");
const trigger = cva(TRIGGER_BASE, {
    variants: {
        size: {
            sm: "h-8 pl-4 pr-1 py-1 cursor-pointer",
            md: "h-10 pl-4 pr-1 py-1 cursor-pointer",
            lg: "h-12 pl-4 pr-1 py-1 cursor-pointer",
        },
    },
    defaultVariants: { size: "md" },
});
const triggerMulti = cva([TRIGGER_BASE, "pl-3 pr-1 cursor-pointer"].join(" "), {
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
});
function isMultiProps(p) {
    return p.multiSelect === true;
}
const ICON_BUTTON_SIZE = {
    sm: "size-6 rounded-sm",
    md: "size-8 rounded-md",
    lg: "size-10 rounded-md",
};
const ICON_SIZE = {
    sm: "xs",
    md: "sm",
    lg: "sm",
};
function nextEnabled(options, from, step) {
    if (options.length === 0)
        return -1;
    const n = options.length;
    for (let i = 0; i < n; i++) {
        const idx = (from + step * (i + 1) + n * (i + 1)) % n;
        if (!options[idx]?.disabled)
            return idx;
    }
    return -1;
}
function firstEnabled(options) {
    return options.findIndex((o) => !o.disabled);
}
export const Dropdown = forwardRef(function Dropdown(props, ref) {
    const { options, placeholder = "Placeholder text here", size = "md", error = false, disabled = false, readOnly = false, icon, open: openProp, defaultOpen = false, onOpenChange, emptyState = "No results", manual = false, hideChevron = false, className, id, onKeyDown, ...rest } = props;
    const isMulti = isMultiProps(props);
    const isOpenControlled = openProp !== undefined;
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const isOpen = isOpenControlled ? !!openProp : internalOpen;
    const setOpen = useCallback((next) => {
        if (disabled || readOnly)
            return;
        if (!isOpenControlled)
            setInternalOpen(next);
        onOpenChange?.(next);
    }, [disabled, readOnly, isOpenControlled, onOpenChange]);
    // Single value ----------------------------------------------------
    const singleProps = props;
    const isSingleValueControlled = !isMulti && singleProps.value !== undefined;
    const [internalSingle, setInternalSingle] = useState(!isMulti ? (singleProps.defaultValue ?? "") : "");
    const singleValue = isSingleValueControlled
        ? (singleProps.value ?? "")
        : internalSingle;
    // Multi value -----------------------------------------------------
    const multiProps = props;
    const isMultiValueControlled = isMulti && multiProps.value !== undefined;
    const [internalMulti, setInternalMulti] = useState(isMulti ? (multiProps.defaultValue ?? []) : []);
    const multiValue = isMultiValueControlled
        ? (multiProps.value ?? [])
        : internalMulti;
    const selectedSet = useMemo(() => new Set(isMulti ? multiValue : []), [isMulti, multiValue]);
    const handleSingleSelect = (next) => {
        if (!isSingleValueControlled)
            setInternalSingle(next);
        singleProps.onValueChange?.(next);
        setOpen(false);
    };
    const toggleMulti = (next) => {
        const has = selectedSet.has(next);
        const updated = has
            ? multiValue.filter((v) => v !== next)
            : [...multiValue, next];
        if (!isMultiValueControlled)
            setInternalMulti(updated);
        multiProps.onValueChange?.(updated);
    };
    const removeChip = (val, e) => {
        e.stopPropagation();
        const updated = multiValue.filter((v) => v !== val);
        if (!isMultiValueControlled)
            setInternalMulti(updated);
        multiProps.onValueChange?.(updated);
    };
    const clearAllMulti = (e) => {
        e.stopPropagation();
        if (!isMultiValueControlled)
            setInternalMulti([]);
        multiProps.onValueChange?.([]);
    };
    // Active descendant — -1 until the user moves the keyboard cursor or
    // hovers a row. Matches the Figma open state, which shows all rows flat
    // until the user interacts. Selected rows still paint via `selected`.
    const [activeIndex, setActiveIndex] = useState(-1);
    useEffect(() => {
        if (!isOpen) {
            setActiveIndex(-1);
            return;
        }
        if (options.length === 0) {
            setActiveIndex(-1);
            return;
        }
        // On open, land the cursor on the selected row if there is one — that
        // matches the Figma "Selected" + "Active" composite. Otherwise leave
        // the menu un-highlighted until the user navigates.
        const target = isMulti
            ? -1
            : options.findIndex((o) => o.value === singleValue && !o.disabled);
        setActiveIndex(target >= 0 ? target : -1);
    }, [isOpen, options, isMulti, singleValue]);
    // Click outside / Escape ------------------------------------------
    const rootRef = useRef(null);
    useEffect(() => {
        if (!isOpen || manual)
            return;
        const onDocPointer = (e) => {
            const root = rootRef.current;
            if (!root)
                return;
            if (e.target instanceof Node && !root.contains(e.target)) {
                setOpen(false);
            }
        };
        const onEscape = (e) => {
            if (e.key === "Escape") {
                e.stopPropagation();
                setOpen(false);
            }
        };
        document.addEventListener("pointerdown", onDocPointer);
        document.addEventListener("keydown", onEscape);
        return () => {
            document.removeEventListener("pointerdown", onDocPointer);
            document.removeEventListener("keydown", onEscape);
        };
    }, [isOpen, manual, setOpen]);
    const reactId = useId();
    const rootId = id ?? `dropdown-${reactId}`;
    const listboxId = `${rootId}-listbox`;
    const optionId = (i) => `${rootId}-option-${i}`;
    const handleKeyDown = (e) => {
        onKeyDown?.(e);
        if (disabled || readOnly)
            return;
        if (!isOpen) {
            if (e.key === "Enter" ||
                e.key === " " ||
                e.key === "ArrowDown" ||
                e.key === "ArrowUp") {
                e.preventDefault();
                setOpen(true);
            }
            return;
        }
        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setActiveIndex((prev) => nextEnabled(options, prev, 1));
                break;
            case "ArrowUp":
                e.preventDefault();
                setActiveIndex((prev) => nextEnabled(options, prev, -1));
                break;
            case "Home":
                e.preventDefault();
                setActiveIndex(firstEnabled(options));
                break;
            case "End": {
                e.preventDefault();
                for (let i = options.length - 1; i >= 0; i--) {
                    if (!options[i]?.disabled) {
                        setActiveIndex(i);
                        break;
                    }
                }
                break;
            }
            case "Enter":
            case " ": {
                if (activeIndex >= 0 && activeIndex < options.length) {
                    const option = options[activeIndex];
                    if (option && !option.disabled) {
                        e.preventDefault();
                        if (isMulti)
                            toggleMulti(option.value);
                        else
                            handleSingleSelect(option.value);
                    }
                }
                break;
            }
            case "Tab":
                setOpen(false);
                break;
        }
    };
    const selectedSingle = useMemo(() => options.find((o) => o.value === singleValue), [options, singleValue]);
    const selectedMulti = useMemo(() => options.filter((o) => selectedSet.has(o.value)), [options, selectedSet]);
    const dataState = isOpen ? "open" : "closed";
    const showError = !!error && !disabled;
    const triggerInteractive = !disabled && !readOnly;
    // In multi-select the chevron toggle is always 24x24 with a 16px icon —
    // it shares the rail with the clear-all button. In single-select it
    // matches the field height (24/32/40 → sm/md/lg).
    const chevronContainerCls = isMulti
        ? "size-6 rounded-md"
        : ICON_BUTTON_SIZE[size];
    const chevronIconSize = isMulti ? "xs" : ICON_SIZE[size];
    const chevronIcon = !hideChevron && !readOnly && (_jsx("span", { "aria-hidden": true, className: cn("inline-flex items-center justify-center shrink-0", chevronContainerCls, "text-[var(--color-icon-color)]", disabled && "text-[var(--color-disabled-text-color)]"), children: _jsx(Icon, { name: "chevron-down", size: chevronIconSize, "aria-hidden": true }) }));
    const leadingIcon = icon != null ? (_jsx(Icon, { name: icon, size: ICON_SIZE[size], "aria-hidden": true, className: cn("shrink-0 text-[var(--color-icon-color)]", disabled && "text-[var(--color-disabled-text-color)]") })) : null;
    // ---- Trigger contents -------------------------------------------
    const renderSingleLabel = () => {
        const empty = !singleValue;
        return (_jsx("span", { className: cn("flex-1 min-w-0 truncate text-t2 leading-5 font-body", empty
                ? "text-[var(--color-placeholder-color)]"
                : "text-[var(--color-primary-text-color)]", disabled && "text-[var(--color-disabled-text-color)]"), children: empty ? placeholder : (selectedSingle?.label ?? singleValue) }));
    };
    const renderChips = () => {
        if (selectedMulti.length === 0) {
            return (_jsx("span", { className: cn("flex-1 min-w-0 truncate text-t2 leading-5 font-body", "text-[var(--color-placeholder-color)]", disabled && "text-[var(--color-disabled-text-color)]"), children: placeholder }));
        }
        return (_jsx("div", { className: cn("flex flex-1 min-w-0 gap-2 items-start", props.multiLine
                ? "flex-wrap"
                : "flex-nowrap overflow-hidden"), children: selectedMulti.map((opt) => (_jsxs("span", { className: cn("inline-flex items-center gap-1 h-6 rounded-md shrink-0", "bg-[var(--color-primary-selected-color)]", "pl-2 pr-1", "text-t2 font-body text-[var(--color-primary-text-color)]"), children: [_jsx("span", { className: "leading-5 truncate max-w-[160px]", children: opt.label }), triggerInteractive && (_jsx("button", { type: "button", onClick: (e) => removeChip(opt.value, e), "aria-label": `Remove ${opt.label}`, className: cn("inline-flex items-center justify-center size-4 rounded-sm shrink-0 cursor-pointer", "text-[var(--color-icon-color)]", "hover:bg-[var(--color-primary-background-hover-color)]", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-color)]"), children: _jsx(Icon, { name: "x-mark-small", size: "2xs", "aria-hidden": true }) }))] }, opt.value))) }));
    };
    // ---- Trigger element --------------------------------------------
    const triggerCommonProps = {
        role: "combobox",
        "aria-expanded": isOpen,
        "aria-controls": listboxId,
        "aria-haspopup": "listbox",
        "aria-activedescendant": isOpen && activeIndex >= 0 ? optionId(activeIndex) : undefined,
        "aria-disabled": disabled || undefined,
        "aria-readonly": readOnly || undefined,
        "data-state": dataState,
        "data-error": showError || undefined,
        "data-disabled": disabled || undefined,
        "data-readonly": readOnly || undefined,
        tabIndex: triggerInteractive ? 0 : -1,
        onClick: () => {
            if (triggerInteractive)
                setOpen(!isOpen);
        },
        onKeyDown: handleKeyDown,
    };
    const renderTrigger = () => {
        if (isMulti) {
            const multiLine = !!props.multiLine;
            return (_jsxs("div", { className: cn(triggerMulti({
                    size,
                    multiLine,
                })), ...triggerCommonProps, children: [leadingIcon, renderChips(), triggerInteractive && selectedMulti.length > 0 && (_jsx("button", { type: "button", onClick: clearAllMulti, "aria-label": "Clear all", className: cn("inline-flex items-center justify-center shrink-0 cursor-pointer rounded-md", "size-6 text-[var(--color-icon-color)]", "hover:bg-[var(--color-primary-background-hover-color)]", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-color)]"), children: _jsx(Icon, { name: "x-mark-small", size: "xs", "aria-hidden": true }) })), chevronIcon] }));
        }
        return (_jsxs("div", { className: cn(trigger({ size })), ...triggerCommonProps, children: [leadingIcon, renderSingleLabel(), chevronIcon] }));
    };
    // ---- Menu list ---------------------------------------------------
    const menu = isOpen ? (_jsx("div", { className: cn("absolute left-0 right-0 top-full mt-2 z-50", "rounded-md bg-[var(--color-secondary-background-color)] p-2 shadow-md", "border border-transparent"), children: _jsx("div", { role: "listbox", id: listboxId, "aria-multiselectable": isMulti || undefined, className: "flex flex-col items-stretch w-full", children: options.length === 0 ? (_jsx(ListItem, { variant: "information", children: emptyState })) : (options.map((option, index) => {
                const isSelected = isMulti
                    ? selectedSet.has(option.value)
                    : option.value === singleValue;
                const isHighlighted = index === activeIndex;
                return (_jsx(ListItem, { id: optionId(index), role: "option", icon: option.icon, active: isSelected || isHighlighted, disabled: option.disabled, "aria-selected": isSelected, onMouseEnter: () => {
                        if (!option.disabled)
                            setActiveIndex(index);
                    }, onClick: (e) => {
                        e.stopPropagation();
                        if (option.disabled)
                            return;
                        if (isMulti)
                            toggleMulti(option.value);
                        else
                            handleSingleSelect(option.value);
                    }, children: option.label }, option.value));
            })) }) })) : null;
    return (_jsxs("div", { ref: (node) => {
            ;
            rootRef.current = node;
            if (typeof ref === "function")
                ref(node);
            else if (ref)
                ref.current = node;
        }, id: rootId, className: cn("relative w-full", className), ...rest, children: [renderTrigger(), menu] }));
});
