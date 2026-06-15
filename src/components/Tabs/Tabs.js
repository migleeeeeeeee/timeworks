import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, forwardRef, useContext, useId, useMemo, useRef, useState, } from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/cn";
import { Icon } from "../Icon";
const TabsContext = createContext(null);
function useTabs() {
    const ctx = useContext(TabsContext);
    if (!ctx)
        throw new Error("Tabs subcomponents must be rendered inside <Tabs>.");
    return ctx;
}
export const Tabs = forwardRef(function Tabs({ value, defaultValue, onValueChange, onColor = "light", className, children, ...rest }, ref) {
    const [internal, setInternal] = useState(defaultValue ?? "");
    const isControlled = value !== undefined;
    const current = isControlled ? value : internal;
    const baseId = useId();
    // Track triggers in DOM order so arrow-key navigation + auto-activation
    // can move forward / backward through them.
    const triggers = useRef(new Map());
    const setValue = (next) => {
        if (!isControlled)
            setInternal(next);
        onValueChange?.(next);
    };
    const ctx = useMemo(() => ({
        value: current,
        setValue,
        baseId,
        onColor,
        registerTrigger: (val, node) => {
            if (node)
                triggers.current.set(val, node);
            else
                triggers.current.delete(val);
        },
        focusTrigger: (val) => {
            triggers.current.get(val)?.focus();
        },
        triggerOrder: () => {
            // Sort by document position so we follow visual order even if
            // children are rendered in a non-linear shape.
            return Array.from(triggers.current.entries())
                .sort(([, a], [, b]) => a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1)
                .map(([val]) => val);
        },
    }), 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [current, baseId, onColor]);
    return (_jsx(TabsContext.Provider, { value: ctx, children: _jsx("div", { ref: ref, className: cn("flex flex-col", className), ...rest, children: children }) }));
});
const list = cva("flex w-full items-stretch", {
    variants: {
        stretched: {
            true: "[&>[role=tab]]:flex-1",
            false: "",
        },
    },
    defaultVariants: { stretched: false },
});
export const TabsList = forwardRef(function TabsList({ className, stretched = false, "aria-label": ariaLabel, children, ...rest }, ref) {
    return (_jsx("div", { ref: ref, role: "tablist", "aria-label": ariaLabel, "aria-orientation": "horizontal", className: cn(list({ stretched }), className), ...rest, children: children }));
});
const trigger = cva(
// Per-tab layout: a column with the inner row and a 2px underline.
// max-h-[33px] mirrors Figma .Tabs base (4 + 22 + 4 + 1 gap + 2 underline).
"group relative inline-flex flex-col items-stretch gap-px max-h-[33px] rounded-sm font-body outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-color)] focus-visible:ring-offset-1 disabled:cursor-not-allowed", {
    variants: {
        onColor: {
            light: "",
            dark: "",
        },
    },
    defaultVariants: { onColor: "light" },
});
const triggerInner = cva("flex items-center justify-center gap-1 px-4 py-1 rounded-sm text-t1 leading-[22px] whitespace-nowrap transition-colors duration-150", {
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
});
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
});
export const TabsTrigger = forwardRef(function TabsTrigger({ value, leftIcon, rightIcon, counter, disabled = false, className, children, onClick, onKeyDown, ...rest }, ref) {
    const { value: active, setValue, baseId, onColor, registerTrigger, focusTrigger, triggerOrder } = useTabs();
    const selected = active === value;
    const handleRef = (node) => {
        registerTrigger(value, node);
        if (typeof ref === "function")
            ref(node);
        else if (ref)
            ref.current = node;
    };
    const handleKeyDown = (event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented)
            return;
        const order = triggerOrder();
        const index = order.indexOf(value);
        if (index === -1)
            return;
        let nextIndex = null;
        if (event.key === "ArrowRight")
            nextIndex = (index + 1) % order.length;
        else if (event.key === "ArrowLeft")
            nextIndex = (index - 1 + order.length) % order.length;
        else if (event.key === "Home")
            nextIndex = 0;
        else if (event.key === "End")
            nextIndex = order.length - 1;
        if (nextIndex === null)
            return;
        event.preventDefault();
        const nextValue = order[nextIndex];
        if (!nextValue)
            return;
        setValue(nextValue);
        focusTrigger(nextValue);
    };
    const state = disabled
        ? "disabled"
        : selected
            ? "selected"
            : "idle";
    return (_jsxs("button", { ref: handleRef, role: "tab", type: "button", id: `${baseId}-tab-${value}`, "aria-selected": selected, "aria-controls": `${baseId}-panel-${value}`, "aria-disabled": disabled || undefined, disabled: disabled, tabIndex: selected ? 0 : -1, "data-state": selected ? "active" : "inactive", "data-disabled": disabled || undefined, onClick: (event) => {
            onClick?.(event);
            if (event.defaultPrevented || disabled)
                return;
            setValue(value);
        }, onKeyDown: handleKeyDown, className: cn(trigger({ onColor }), className), ...rest, children: [_jsxs("span", { className: triggerInner({ onColor, disabled, hoverable: !disabled }), children: [leftIcon && _jsx(Icon, { name: leftIcon, size: "sm", "aria-hidden": "true" }), _jsx("span", { children: children }), counter !== undefined && (_jsx("span", { "aria-hidden": "true", children: `/ ${counter}` })), rightIcon && _jsx(Icon, { name: rightIcon, size: "sm", "aria-hidden": "true" })] }), _jsx("span", { "aria-hidden": "true", className: underline({ state, onColor }) })] }));
});
export const TabsContent = forwardRef(function TabsContent({ value, forceMount = false, className, children, ...rest }, ref) {
    const { value: active, baseId } = useTabs();
    const selected = active === value;
    if (!selected && !forceMount)
        return null;
    return (_jsx("div", { ref: ref, role: "tabpanel", id: `${baseId}-panel-${value}`, "aria-labelledby": `${baseId}-tab-${value}`, hidden: !selected, tabIndex: 0, className: cn("pt-4 outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-color)] rounded-sm", className), ...rest, children: children }));
});
