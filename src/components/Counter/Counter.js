import { jsx as _jsx } from "react/jsx-runtime";
import { cva } from "class-variance-authority";
import { forwardRef } from "react";
import { cn } from "../../lib/cn";
/**
 * Counter — sourced from the TimeWorks Figma file
 * (page "Counter", node 46939:100209).
 *
 *   <Counter count={5} />
 *   <Counter color="negative" count={42} />
 *   <Counter kind="line" color="dark" count={8} />
 *
 * A standalone numeric pill used to show the count of adjacent data
 * (tab counts, list totals, inline indicators). Unlike Badge, Counter
 * does not wrap a child element — compose it inline next to whatever
 * it counts.
 */
const counter = cva([
    "inline-flex items-center justify-center shrink-0",
    "rounded-full whitespace-nowrap font-body",
    "text-t2 leading-none",
].join(" "), {
    variants: {
        size: {
            sm: "h-[18px] min-w-[18px]",
            lg: "h-6 min-w-6",
        },
        kind: {
            fill: "",
            line: "border bg-transparent",
        },
        color: {
            primary: "",
            negative: "",
            dark: "",
            light: "",
        },
    },
    compoundVariants: [
        // Fill
        {
            kind: "fill",
            color: "primary",
            class: "bg-[var(--color-primary-color)] text-[var(--color-text-color-on-primary)]",
        },
        {
            kind: "fill",
            color: "negative",
            class: "bg-[var(--color-negative-color)] text-[var(--color-text-color-on-primary)]",
        },
        {
            kind: "fill",
            color: "dark",
            class: "bg-[var(--color-inverted-color-background)] text-[var(--color-text-color-on-inverted)]",
        },
        {
            kind: "fill",
            color: "light",
            class: "bg-[var(--color-ui-background-color)] text-[var(--color-primary-text-color)]",
        },
        // Line
        {
            kind: "line",
            color: "primary",
            class: "border-[var(--color-primary-color)] text-[var(--color-primary-color)]",
        },
        {
            kind: "line",
            color: "negative",
            class: "border-[var(--color-negative-color)] text-[var(--color-negative-color)]",
        },
        {
            kind: "line",
            color: "dark",
            class: "border-[var(--color-primary-text-color)] text-[var(--color-primary-text-color)]",
        },
        {
            kind: "line",
            color: "light",
            class: "border-[var(--color-ui-border-color)] text-[var(--color-primary-text-color)]",
        },
    ],
    defaultVariants: {
        size: "lg",
        kind: "fill",
        color: "primary",
    },
});
export const Counter = forwardRef(function Counter({ className, count, max = 99, size = "lg", kind = "fill", color = "primary", "aria-label": ariaLabel, ...rest }, ref) {
    const display = count > max ? `${max}+` : String(count);
    // Single-character display gets no horizontal padding so `min-w` (= height)
    // wins and the outer box renders as a perfect circle. Multi-character
    // display gets `px-2` for breathing room and pills out horizontally.
    // Mirrors the Figma component's behaviour where the default single-digit
    // variant is a fixed 24x24 circle.
    const padding = display.length <= 1 ? "px-0" : "px-2";
    return (_jsx("span", { ref: ref, role: "status", "aria-label": ariaLabel ?? `${display} new`, className: cn(counter({ size, kind, color }), padding, className), ...rest, children: display }));
});
