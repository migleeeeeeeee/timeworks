import { jsx as _jsx } from "react/jsx-runtime";
import { cva } from "class-variance-authority";
import { forwardRef } from "react";
import { cn } from "../../lib/cn";
import { Icon } from "../Icon";
/**
 * IconButton — sourced from the TimeWorks Figma file
 * (page "Icon Button", node 46946:15233).
 *
 *   <IconButton icon="hexagon" aria-label="Open menu" />
 *
 * Square button containing only an icon — used in toolbars and control bars.
 * Always pass `aria-label` (or wrap in a Tooltip) so the button is reachable
 * for screen readers and keyboard users.
 *
 * Maps the Figma matrix (Size × Kind × State × Loader) onto a cva-driven API.
 * Defaults match the Figma "Medium / Primary / Default" cell: 40×40, 8px radius.
 */
const root = cva([
    "inline-flex items-center justify-center shrink-0 select-none",
    "transition-colors duration-[120ms] ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-color)] focus-visible:ring-offset-2",
    "disabled:cursor-not-allowed",
].join(" "), {
    variants: {
        size: {
            xxs: "size-4 rounded-sm",
            xs: "size-6 rounded-[6px]",
            sm: "size-8 rounded-md",
            md: "size-10 rounded-md",
            lg: "size-12 rounded-md",
        },
        kind: {
            primary: "border border-transparent",
            secondary: "border bg-transparent",
            tertiary: "border border-transparent bg-transparent",
        },
    },
    compoundVariants: [
        {
            kind: "primary",
            class: [
                "bg-[var(--color-primary-color)] text-[var(--color-text-color-on-primary)]",
                "hover:bg-[var(--color-primary-hover-color)]",
                "data-[active=true]:bg-[var(--color-primary-hover-color)]",
                "disabled:bg-[var(--color-disabled-background-color)] disabled:text-[var(--color-disabled-text-color)]",
            ].join(" "),
        },
        {
            kind: "secondary",
            class: [
                "border-[var(--color-ui-border-color)] text-[var(--color-primary-text-color)]",
                "hover:bg-[var(--color-primary-background-hover-color)]",
                "data-[active=true]:bg-[var(--color-primary-selected-color)] data-[active=true]:border-[var(--color-primary-color)] data-[active=true]:text-[var(--color-primary-color)]",
                "data-[active=true]:hover:bg-[var(--color-primary-selected-hover-color)]",
                "disabled:border-[var(--color-disabled-text-color)] disabled:text-[var(--color-disabled-text-color)] disabled:bg-transparent",
            ].join(" "),
        },
        {
            kind: "tertiary",
            class: [
                "text-[var(--color-primary-text-color)]",
                "hover:bg-[var(--color-primary-background-hover-color)]",
                "data-[active=true]:bg-[var(--color-primary-selected-color)] data-[active=true]:text-[var(--color-primary-color)]",
                "data-[active=true]:hover:bg-[var(--color-primary-selected-hover-color)]",
                "disabled:text-[var(--color-disabled-text-color)] disabled:bg-transparent",
            ].join(" "),
        },
    ],
    defaultVariants: {
        kind: "primary",
        size: "md",
    },
});
const ICON_SIZE = {
    xxs: "2xs",
    xs: "xs",
    sm: "sm",
    md: "sm",
    lg: "sm",
};
export const IconButton = forwardRef(function IconButton({ className, kind, size = "md", icon, active = false, loading = false, disabled, type = "button", ...rest }, ref) {
    const iconSize = ICON_SIZE[size ?? "md"];
    const isDisabled = disabled || loading;
    return (_jsx("button", { ref: ref, type: type, disabled: isDisabled, "data-active": active || undefined, "data-loading": loading || undefined, "aria-pressed": active || undefined, className: cn(root({ kind, size }), className), ...rest, children: _jsx(Icon, { name: loading ? "loader" : icon, size: iconSize, className: cn("text-current p-0", loading && "animate-spin") }) }));
});
