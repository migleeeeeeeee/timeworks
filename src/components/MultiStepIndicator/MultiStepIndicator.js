import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cva } from "class-variance-authority";
import { forwardRef } from "react";
import { Icon } from "../Icon";
import { cn } from "../../lib/cn";
const TYPE_BG = {
    primary: "var(--color-primary-color)",
    success: "var(--color-positive-color)",
    dark: "var(--color-inverted-color-background)",
    danger: "var(--color-negative-color)",
};
// Hover bg for clickable steps. Dark uses --color-fixed-dark-color since
// --color-inverted-color-background has no native hover token in v1.
const TYPE_BG_HOVER = {
    primary: "var(--color-primary-hover-color)",
    success: "var(--color-positive-color-hover)",
    dark: "var(--color-fixed-dark-color)",
    danger: "var(--color-negative-color-hover)",
};
// Three distinct visual treatments per Figma node 46947:3290:
//   active    → outer ring (2px type-colour) + 2px halo + inner 36px disc
//   fulfilled → flat 48px filled disc + white check
//   pending   → 36px ring (2px ui-border) centred in a 48px frame
// Compact halves the dimensions (24px frame, 18px inner).
const wrapperSize = cva("relative flex shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-background-color)]", {
    variants: {
        size: {
            regular: "size-12",
            compact: "size-6",
        },
    },
    defaultVariants: { size: "regular" },
});
const innerSize = cva("flex shrink-0 items-center justify-center rounded-full font-body transition-colors duration-200 text-[var(--color-text-color-on-primary)]", {
    variants: {
        size: {
            regular: "size-9 text-t2",
            compact: "size-[18px] text-t3",
        },
    },
    defaultVariants: { size: "regular" },
});
const pendingRing = cva("flex shrink-0 items-center justify-center rounded-full font-body bg-transparent text-[var(--color-primary-text-color)] border-2 border-[var(--color-ui-border-color)] transition-colors duration-200", {
    variants: {
        size: {
            regular: "size-9 text-t2",
            compact: "size-[18px] text-t3",
        },
        interactive: { true: "cursor-pointer", false: "" },
    },
    compoundVariants: [
        {
            interactive: true,
            class: "hover:border-[var(--color-secondary-text-color)]",
        },
    ],
    defaultVariants: { size: "regular", interactive: false },
});
const connector = cva("h-0.5 flex-1 self-center bg-[var(--color-ui-border-color)]", {
    variants: {
        size: {
            regular: "min-w-6 mx-2",
            compact: "min-w-3 mx-1",
        },
    },
    defaultVariants: { size: "regular" },
});
const titleClass = cva("font-body font-semibold text-[var(--color-primary-text-color)]", {
    variants: {
        size: {
            regular: "text-t2 leading-5",
            compact: "text-t2 leading-5",
        },
    },
    defaultVariants: { size: "regular" },
});
const subtitleClass = "font-body text-t2 leading-5 text-[var(--color-primary-text-color)]";
const deriveStatus = (index, current, override) => {
    if (override)
        return override;
    if (index < current)
        return "fulfilled";
    if (index === current)
        return "active";
    return "pending";
};
export const MultiStepIndicator = forwardRef(function MultiStepIndicator({ className, steps, current = 0, type = "primary", size = "regular", textPlacement = "below", onStepClick, ...rest }, ref) {
    const isCompact = size === "compact";
    const showText = textPlacement !== "below" || !isCompact;
    const inline = textPlacement === "inline";
    const interactive = Boolean(onStepClick);
    return (_jsx("ol", { ref: ref, className: cn("flex w-full items-stretch", textPlacement === "below" ? "items-start" : "items-center", className), ...rest, children: steps.map((step, index) => {
            const status = deriveStatus(index, current, step.status);
            const isLast = index === steps.length - 1;
            const filled = status !== "pending";
            const bg = filled ? TYPE_BG[type] : undefined;
            const bgHover = filled && interactive ? TYPE_BG_HOVER[type] : undefined;
            const number = _jsx("span", { children: index + 1 });
            const check = (_jsx(Icon, { name: "check", size: isCompact ? "2xs" : "sm", className: "text-[var(--color-text-color-on-primary)]", "aria-hidden": "true" }));
            let dot;
            if (status === "active") {
                // Outer ring + halo + inner filled disc.
                dot = (_jsx("span", { className: wrapperSize({ size }), style: {
                        border: "2px solid",
                        borderColor: bg,
                        "--bg-hover": bgHover,
                    }, "aria-hidden": "true", children: _jsx("span", { className: innerSize({ size }), style: { backgroundColor: bg }, children: number }) }));
            }
            else if (status === "fulfilled") {
                // Flat filled disc.
                dot = (_jsx("span", { className: cn(wrapperSize({ size }), "transition-colors duration-200 text-[var(--color-text-color-on-primary)]", isCompact ? "text-t3" : "text-t2"), style: {
                        backgroundColor: bg,
                        "--bg-hover": bgHover,
                    }, "aria-hidden": "true", children: check }));
            }
            else {
                // Pending — small empty ring centred in the constant 48×48 frame.
                dot = (_jsx("span", { className: cn(wrapperSize({ size }), "bg-transparent"), "aria-hidden": "true", children: _jsx("span", { className: pendingRing({ size, interactive }), children: number }) }));
            }
            const trigger = onStepClick ? (_jsx("button", { type: "button", onClick: () => onStepClick(index), "aria-current": status === "active" ? "step" : undefined, className: cn("rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-color)] focus-visible:ring-offset-2", filled &&
                    "[&>span]:hover:bg-[var(--bg-hover,var(--color-primary-hover-color))]"), children: dot })) : (dot);
            return (_jsxs("li", { className: cn("flex min-w-0", inline ? "flex-1 items-center" : "flex-1 flex-col", isLast && !inline ? "flex-none" : undefined), children: [_jsxs("div", { className: cn("flex min-w-0", inline ? "flex-1 items-center gap-3" : "w-full items-center"), children: [trigger, inline && step.title && showText && (_jsxs("div", { className: "flex min-w-0 flex-col gap-0.5", children: [_jsx("span", { className: titleClass({ size }), children: step.title }), !isCompact && step.subtitle && (_jsx("span", { className: subtitleClass, children: step.subtitle }))] })), !isLast && _jsx("span", { className: connector({ size }), "aria-hidden": "true" })] }), !inline && showText && (step.title || step.subtitle) && (_jsxs("div", { className: cn("flex min-w-0 flex-col gap-0.5", isCompact ? "mt-1" : "mt-3"), children: [step.title && (_jsx("span", { className: titleClass({ size }), children: step.title })), !isCompact && step.subtitle && (_jsx("span", { className: subtitleClass, children: step.subtitle }))] }))] }, index));
        }) }));
});
