import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cva } from "class-variance-authority";
import { forwardRef } from "react";
import { cn } from "../../lib/cn";
import { Button } from "../Button";
import { Icon } from "../Icon";
import { IconButton } from "../IconButton";
import { Link } from "../Link";
/**
 * AttentionBox — sourced from the TimeWorks Figma file
 * (page "Attention Box", node 46939:7881).
 *
 *   <AttentionBox type="primary" title="Heads up" cta={{ label: "Read more" }}>
 *     This action will cause your team to lose access...
 *   </AttentionBox>
 *
 * Inline content card for in-flow messages. Distinct from AlertBanner —
 * AttentionBox sits inside page content (rounded, padded, tinted), AlertBanner
 * sits at the top of the viewport (full-width, 40px tall).
 *
 * Layout has two modes:
 *   - default (compact=false): leading icon, stacked title/body/CTA column.
 *   - compact (compact=true):  single 20px row with leading icon, body
 *     (truncated), and trailing CTAs / dismiss.
 */
const root = cva("rounded-md w-full", {
    variants: {
        type: {
            primary: "bg-[var(--color-primary-selected-color)] text-[var(--color-primary-text-color)]",
            neutral: "bg-[var(--color-allgrey-background-color)] text-[var(--color-primary-text-color)]",
            positive: "bg-[var(--color-positive-color-selected)] text-[var(--color-primary-text-color)]",
            warning: "bg-[var(--color-warning-color-selected)] text-[var(--color-primary-text-color)]",
            negative: "bg-[var(--color-negative-color-selected)] text-[var(--color-primary-text-color)]",
        },
        compact: {
            true: "flex items-center gap-8 px-4 py-3",
            false: "flex items-start gap-1 px-4 py-3",
        },
    },
    defaultVariants: { type: "primary", compact: false },
});
const DEFAULT_ICON = {
    primary: "circle-info",
    neutral: "star",
    positive: "thumbs-up",
    warning: "circle-info",
    negative: "triangle-exclamation",
};
export const AttentionBox = forwardRef(function AttentionBox({ className, type = "primary", compact = false, title, children, cta, action, withIcon = true, icon, onDismiss, dismissLabel = "Dismiss", ...rest }, ref) {
    const resolvedIcon = icon ?? DEFAULT_ICON[type ?? "primary"];
    const role = type === "negative" || type === "warning" ? "alert" : "status";
    const dismiss = onDismiss ? (_jsx(IconButton, { kind: "tertiary", size: "xs", icon: "x-mark-small", "aria-label": dismissLabel, onClick: onDismiss, className: "text-current" })) : null;
    const ctas = (cta || action) ? (_jsxs("div", { className: cn("flex items-center shrink-0", compact ? "gap-3" : "gap-4 pt-2 pr-4 w-full"), children: [cta && (_jsx(Link, { size: "sm", surface: "on-tinted", href: cta.href ?? "#", onClick: cta.onClick
                    ? (e) => {
                        if (!cta.href)
                            e.preventDefault();
                        cta.onClick?.();
                    }
                    : undefined, className: "shrink-0", children: cta.label })), action && (_jsx(Button, { kind: "secondary", size: "sm", color: "on-inverted", onClick: action.onClick, children: action.label }))] })) : null;
    if (compact) {
        return (_jsxs("div", { ref: ref, role: role, className: cn(root({ type, compact: true }), className), ...rest, children: [_jsxs("div", { className: "flex flex-1 min-w-0 items-center gap-1", children: [withIcon && (_jsx(Icon, { name: resolvedIcon, size: "sm", className: "shrink-0 text-current" })), _jsx("p", { className: "flex-1 min-w-0 truncate text-t2 font-body text-current", children: children })] }), ctas, dismiss] }));
    }
    return (_jsxs("div", { ref: ref, role: role, className: cn(root({ type, compact: false }), className), ...rest, children: [withIcon && (_jsx(Icon, { name: resolvedIcon, size: "sm", className: "shrink-0 mt-px text-current" })), _jsxs("div", { className: "flex-1 min-w-0 flex flex-col gap-1", children: [_jsxs("div", { className: "flex items-start gap-2 w-full", children: [_jsxs("div", { className: "flex-1 min-w-0 flex flex-col gap-1", children: [title && (_jsx("p", { className: "text-t1 font-body font-semibold leading-[22px] text-current", children: title })), _jsx("p", { className: "text-t2 font-body text-current pr-2", children: children })] }), dismiss] }), ctas] })] }));
});
