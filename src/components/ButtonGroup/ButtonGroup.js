import { jsx as _jsx } from "react/jsx-runtime";
import { Children, cloneElement, createContext, forwardRef, isValidElement, useCallback, useContext, useId, useMemo, useRef, useState, } from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/cn";
const ButtonGroupContext = createContext(null);
function useButtonGroup() {
    const ctx = useContext(ButtonGroupContext);
    if (!ctx) {
        throw new Error("ButtonGroupItem must be rendered inside <ButtonGroup>");
    }
    return ctx;
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
});
// Each segment carries its own border. Adjacent segments overlap their borders
// via `-ml-px` (handled in the item component) to match Figma's flush layout.
const item = cva([
    "relative inline-flex items-center justify-center whitespace-nowrap select-none",
    "transition-colors duration-[120ms] ease-out",
    "focus-visible:outline-none focus-visible:z-20",
    "focus-visible:ring-2 focus-visible:ring-[var(--color-primary-color)] focus-visible:ring-offset-1",
    "disabled:cursor-not-allowed",
].join(" "), {
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
            class: "bg-transparent text-[var(--color-primary-text-color)] hover:bg-[var(--color-primary-background-hover-color)] active:bg-[var(--color-ui-background-color)]",
        },
        {
            variant: "default",
            selected: true,
            disabled: false,
            class: "bg-[var(--color-primary-selected-color)] text-[var(--color-primary-text-color)] border-[var(--color-primary-color)] hover:bg-[var(--color-primary-selected-hover-color)] z-10",
        },
        // Tertiary — borderless. Only the selected segment shows the tint.
        {
            variant: "tertiary",
            selected: false,
            disabled: false,
            class: "bg-transparent text-[var(--color-primary-text-color)] hover:bg-[var(--color-primary-background-hover-color)]",
        },
        {
            variant: "tertiary",
            selected: true,
            disabled: false,
            class: "bg-[var(--color-primary-selected-color)] text-[var(--color-primary-text-color)] hover:bg-[var(--color-primary-selected-hover-color)]",
        },
        // Disabled (Default) — every segment greys out flat, even the selected one.
        {
            variant: "default",
            disabled: true,
            class: "bg-[var(--color-disabled-background-color)] text-[var(--color-disabled-text-color)] border-[var(--color-ui-border-color)]",
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
});
export const ButtonGroup = forwardRef(function ButtonGroup({ className, variant, size, value: controlled, defaultValue = null, onValueChange, disabled = false, children, ...rest }, ref) {
    const [uncontrolled, setUncontrolled] = useState(defaultValue);
    const isControlled = controlled !== undefined;
    const value = isControlled ? controlled ?? null : uncontrolled;
    const itemsRef = useRef(new Map());
    const orderRef = useRef([]);
    const generatedName = useId();
    const registerItem = useCallback((val, el) => {
        const map = itemsRef.current;
        const order = orderRef.current;
        if (el) {
            map.set(val, el);
            if (!order.includes(val))
                order.push(val);
        }
        else {
            map.delete(val);
            const idx = order.indexOf(val);
            if (idx >= 0)
                order.splice(idx, 1);
        }
    }, []);
    const onSelect = useCallback((next) => {
        if (!isControlled)
            setUncontrolled(next);
        onValueChange?.(next);
    }, [isControlled, onValueChange]);
    const focusSibling = useCallback((current, dir) => {
        const order = orderRef.current.filter((v) => {
            const el = itemsRef.current.get(v);
            return el && !el.disabled;
        });
        if (order.length === 0)
            return;
        const idx = order.indexOf(current);
        const nextIdx = idx === -1 ? 0 : (idx + dir + order.length) % order.length;
        const nextVal = order[nextIdx];
        if (!nextVal)
            return;
        const el = itemsRef.current.get(nextVal);
        if (el) {
            el.focus();
            onSelect(nextVal);
        }
    }, [onSelect]);
    const ctx = useMemo(() => ({
        value,
        onSelect,
        size: size ?? "md",
        variant: variant ?? "default",
        disabled,
        registerItem,
        focusSibling,
        name: generatedName,
    }), [value, onSelect, size, variant, disabled, registerItem, focusSibling, generatedName]);
    return (_jsx(ButtonGroupContext.Provider, { value: ctx, children: _jsx("div", { ref: ref, role: "radiogroup", "data-disabled": disabled || undefined, className: cn(root({ variant, size }), className), ...rest, children: (() => {
                const arr = Children.toArray(children).filter(isValidElement);
                const last = arr.length - 1;
                return arr.map((child, index) => cloneElement(child, {
                    "data-index": index,
                    "data-last": index === last,
                }));
            })() }) }));
});
export const ButtonGroupItem = forwardRef(function ButtonGroupItem({ value, className, disabled, onClick, onKeyDown, children, ...rest }, ref) {
    const ctx = useButtonGroup();
    const isSelected = ctx.value === value;
    const isDisabled = disabled || ctx.disabled;
    const dataIndex = rest["data-index"];
    const dataLast = rest["data-last"];
    const isFirst = dataIndex === 0;
    const isLast = dataLast === true;
    const overlap = ctx.variant === "default" && !isFirst ? "-ml-px" : "";
    const radius = cn(isFirst && "rounded-l-full", isLast && "rounded-r-full");
    const setRef = useCallback((el) => {
        ctx.registerItem(value, el);
        if (typeof ref === "function")
            ref(el);
        else if (ref)
            ref.current = el;
    }, [ctx, value, ref]);
    const handleKeyDown = (e) => {
        onKeyDown?.(e);
        if (e.defaultPrevented || isDisabled)
            return;
        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
            e.preventDefault();
            ctx.focusSibling(value, 1);
        }
        else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
            e.preventDefault();
            ctx.focusSibling(value, -1);
        }
        else if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            if (!isSelected)
                ctx.onSelect(value);
        }
    };
    return (_jsx("button", { ref: setRef, type: "button", role: "radio", "aria-checked": isSelected, tabIndex: isDisabled ? -1 : isSelected || ctx.value == null ? 0 : -1, "data-state": isSelected ? "on" : "off", disabled: isDisabled, onClick: (e) => {
            onClick?.(e);
            if (!e.defaultPrevented && !isDisabled && !isSelected)
                ctx.onSelect(value);
        }, onKeyDown: handleKeyDown, className: cn(item({
            size: ctx.size,
            variant: ctx.variant,
            selected: isSelected,
            disabled: isDisabled,
        }), overlap, radius, className), ...rest, children: children }));
});
