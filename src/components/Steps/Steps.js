import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cva } from "class-variance-authority";
import { forwardRef, useCallback, useState } from "react";
import { Icon } from "../Icon";
import { cn } from "../../lib/cn";
const root = cva("inline-flex items-center", {
    variants: {
        type: {
            gallery: "gap-1",
            numbers: "gap-1",
            "gallery-only": "",
        },
    },
    defaultVariants: { type: "gallery" },
});
const navButton = cva("inline-flex items-center justify-center gap-2 rounded-sm px-2 min-h-8 max-h-8 text-t2 font-body transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-40", {
    variants: {
        onColor: {
            white: "text-[var(--color-primary-text-color)] hover:bg-[var(--color-primary-background-hover-color)] focus-visible:ring-[var(--color-primary-color)] focus-visible:ring-offset-[var(--color-primary-background-color)]",
            primary: "text-[var(--color-text-color-on-primary)] hover:bg-white/10 focus-visible:ring-white focus-visible:ring-offset-[var(--color-primary-color)]",
        },
    },
    defaultVariants: { onColor: "white" },
});
const dotsRow = "flex h-2 items-center justify-center gap-2";
// Each dot lives inside an 8×8 frame so the row stays a constant height
// regardless of which dot is active. Active = 8px disc, inactive = 6px.
const dot = cva("rounded-full transition-colors duration-150", {
    variants: {
        onColor: {
            white: "",
            primary: "",
        },
        active: { true: "size-2", false: "size-1.5" },
    },
    compoundVariants: [
        { onColor: "white", active: true, class: "bg-[var(--color-primary-color)]" },
        { onColor: "white", active: false, class: "bg-[var(--color-ui-border-color)]" },
        { onColor: "primary", active: true, class: "bg-[var(--color-text-color-on-primary)]" },
        { onColor: "primary", active: false, class: "bg-white/40" },
    ],
    defaultVariants: { onColor: "white", active: false },
});
const numberDisplay = cva("inline-flex items-center justify-center px-2 min-h-8 text-t2 font-body whitespace-nowrap tabular-nums", {
    variants: {
        onColor: {
            white: "text-[var(--color-primary-text-color)]",
            primary: "text-[var(--color-text-color-on-primary)]",
        },
    },
    defaultVariants: { onColor: "white" },
});
export const Steps = forwardRef(function Steps({ className, count, value, defaultValue = 0, onValueChange, type = "gallery", onColor = "white", backLabel = "Back", nextLabel = "Next", "aria-label": ariaLabel = "Steps", ...rest }, ref) {
    const isControlled = value !== undefined;
    const [internal, setInternal] = useState(defaultValue);
    const current = clamp(isControlled ? value : internal, 0, Math.max(0, count - 1));
    const setCurrent = useCallback((next) => {
        const clamped = clamp(next, 0, Math.max(0, count - 1));
        if (!isControlled)
            setInternal(clamped);
        onValueChange?.(clamped);
    }, [count, isControlled, onValueChange]);
    const goBack = () => setCurrent(current - 1);
    const goNext = () => setCurrent(current + 1);
    const atStart = current <= 0;
    const atEnd = current >= count - 1;
    const showButtons = type !== "gallery-only";
    const showNumbers = type === "numbers";
    const showDots = type !== "numbers";
    return (_jsxs("div", { ref: ref, role: "navigation", "aria-label": ariaLabel, className: cn(root({ type }), className), ...rest, children: [showButtons && (_jsxs("button", { type: "button", onClick: goBack, disabled: atStart, "aria-label": backLabel, className: navButton({ onColor }), children: [_jsx(Icon, { name: "chevron-left", size: "sm", "aria-hidden": "true" }), _jsx("span", { children: backLabel })] })), showDots && (_jsx("div", { className: dotsRow, role: "presentation", children: Array.from({ length: count }, (_, i) => (_jsx("span", { className: "inline-flex size-2 items-center justify-center", children: _jsx("span", { className: dot({ onColor, active: i === current }) }) }, i))) })), showNumbers && (_jsxs("span", { className: numberDisplay({ onColor }), "aria-live": "polite", children: [current + 1, " / ", count] })), showButtons && (_jsxs("button", { type: "button", onClick: goNext, disabled: atEnd, "aria-label": nextLabel, className: navButton({ onColor }), children: [_jsx("span", { children: nextLabel }), _jsx(Icon, { name: "chevron-right", size: "sm", "aria-hidden": "true" })] }))] }));
});
function clamp(n, min, max) {
    if (n < min)
        return min;
    if (n > max)
        return max;
    return n;
}
