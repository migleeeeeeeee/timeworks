import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cva } from "class-variance-authority";
import { forwardRef } from "react";
import { cn } from "../../lib/cn";
import { Icon } from "../Icon";
/**
 * Link — sourced from the TimeWorks Figma file
 * (page "Link", node 46946:16984).
 *
 *   <Link href="/docs">Read more</Link>
 *   <Link href="/docs" iconRight="arrow-up-right-from-square">Read more</Link>
 *   <Link href="/docs" surface="inverted">Read more</Link>
 *
 * Inline anchor with the system's link styling. Two sizes (Figma "Small"
 * 14/20 ↔ "Large" 16/22) and two surfaces (default = blue link on light
 * surfaces; inverted = white link on dark / colored surfaces). Hover adds
 * an underline; disabled fades to 40% opacity and blocks clicks.
 */
const root = cva([
    "inline-flex items-center font-body font-normal whitespace-nowrap rounded-sm",
    "transition-colors duration-[120ms] ease-out",
    "underline-offset-2",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "data-[disabled=true]:opacity-40 data-[disabled=true]:pointer-events-none data-[disabled=true]:cursor-not-allowed",
].join(" "), {
    variants: {
        size: {
            sm: "text-t2 gap-1",
            md: "text-t1 gap-1",
        },
        surface: {
            default: "text-[var(--color-link-color)] hover:underline focus-visible:ring-[var(--color-primary-color)]",
            inverted: "text-[var(--color-text-color-on-inverted)] hover:underline focus-visible:ring-[var(--color-text-color-on-inverted)]",
            // For use on tinted / colored surfaces (e.g. AttentionBox, AlertBanner).
            // Inherits the surrounding text color and is always underlined.
            "on-tinted": "text-current underline focus-visible:ring-current",
        },
    },
    defaultVariants: { size: "md", surface: "default" },
});
export const Link = forwardRef(function Link({ className, size = "md", surface = "default", iconLeft, iconRight, disabled = false, children, onClick, href, ...rest }, ref) {
    return (_jsxs("a", { ref: ref, href: disabled ? undefined : href, "aria-disabled": disabled || undefined, "data-disabled": disabled || undefined, tabIndex: disabled ? -1 : rest.tabIndex, onClick: (e) => {
            if (disabled) {
                e.preventDefault();
                return;
            }
            onClick?.(e);
        }, className: cn(root({ size, surface }), className), ...rest, children: [iconLeft && _jsx(Icon, { name: iconLeft, size: "sm", className: "text-current", "aria-hidden": true }), children != null && _jsx("span", { children: children }), iconRight && _jsx(Icon, { name: iconRight, size: "sm", className: "text-current", "aria-hidden": true })] }));
});
