import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cva } from "class-variance-authority";
import { forwardRef } from "react";
import { cn } from "../../lib/cn";
import { Button } from "../Button";
import { Icon } from "../Icon";
import { Link } from "../Link";
/**
 * AlertBanner — sourced from the TimeWorks Figma file
 * (page "Alert banner", node 46939:87328).
 *
 *   <AlertBanner type="primary" cta={{ label: "Learn more" }} onDismiss={...}>
 *     System maintenance starts at 8 PM.
 *   </AlertBanner>
 *
 * High-signal banner for system messages. Always 40px tall, full-width;
 * the dismiss icon sits on the right and is rendered as a 20px Icon wrapper
 * (matching the Figma "Icon Wrapper" anatomy). The optional inline action
 * pill is a Button-shaped element with the banner's intent color reversed.
 */
const root = cva("flex items-center gap-2 px-4 h-10 w-full", {
    variants: {
        type: {
            primary: "bg-[var(--color-primary-color)] text-[var(--color-text-color-on-primary)]",
            positive: "bg-[var(--color-positive-color)] text-[var(--color-fixed-light-color)]",
            negative: "bg-[var(--color-negative-color)] text-[var(--color-fixed-light-color)]",
            warning: "bg-[var(--color-warning-color)] text-[var(--color-fixed-dark-color)]",
            dark: "bg-[var(--color-inverted-color-background)] text-[var(--color-text-color-on-inverted)]",
        },
    },
    defaultVariants: { type: "primary" },
});
const ACTION_COLOR = {
    primary: "on-primary",
    positive: "on-positive",
    negative: "on-negative",
    warning: "on-warning",
    dark: "on-inverted",
};
export const AlertBanner = forwardRef(function AlertBanner({ className, type = "primary", children, cta, action, onDismiss, dismissLabel = "Dismiss", ...rest }, ref) {
    return (_jsxs("div", { ref: ref, role: "status", className: cn(root({ type }), className), ...rest, children: [_jsxs("div", { className: "flex flex-1 items-center justify-center gap-2 min-w-0 text-center text-t2", children: [_jsx("span", { className: "truncate", children: children }), cta && (_jsx(Link, { size: "sm", surface: type === "warning" ? "default" : "inverted", href: cta.href ?? "#", onClick: cta.onClick
                            ? (e) => {
                                if (!cta.href)
                                    e.preventDefault();
                                cta.onClick?.();
                            }
                            : undefined, className: cn("shrink-0 underline", type === "warning" && "text-current"), children: cta.label })), action && (_jsx(Button, { kind: "primary", size: "xs", color: ACTION_COLOR[type ?? "primary"], onClick: action.onClick, children: action.label }))] }), onDismiss && (_jsx("button", { type: "button", onClick: onDismiss, "aria-label": dismissLabel, className: "inline-flex items-center justify-center shrink-0 size-5 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-fixed-light-color)] focus-visible:ring-offset-2", children: _jsx(Icon, { name: "x-mark-small", size: "sm", className: "text-current p-[2px]" }) }))] }));
});
