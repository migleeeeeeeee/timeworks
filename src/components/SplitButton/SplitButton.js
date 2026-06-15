import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cva } from "class-variance-authority";
import { forwardRef, useCallback, useEffect, useRef, useState, } from "react";
import { cn } from "../../lib/cn";
import { Icon } from "../Icon";
/**
 * SplitButton — sourced from the TimeWorks Figma file
 * (page "Split Button", node 46939:7913; component set 46966:936).
 *
 *   <SplitButton
 *     onClick={handleSave}
 *     menu={
 *       <Menu>
 *         <ListItem onClick={handleSaveAs}>Save as…</ListItem>
 *         <ListItem onClick={handleSaveCopy}>Save a copy</ListItem>
 *       </Menu>
 *     }
 *   >
 *     Save
 *   </SplitButton>
 *
 * A dual-function button: a default action on the left and a chevron
 * trigger on the right that opens a menu of alternative actions. Two
 * `<button>` elements share a single rounded container split by a 1px
 * divider line. Hover/active state is tracked independently per side
 * so the visual matches the Figma matrix
 * (Default / Hover / Active / HoverSecondary / ActiveSecondary / …).
 */
// Outer wrapper. Holds the size (height) + radius + the optional
// secondary-kind 1px border. Inner halves use `h-full` so the wrapper's
// border-box height is the visual height regardless of kind.
const root = cva([
    "relative inline-flex items-stretch align-middle select-none whitespace-nowrap",
    "rounded-md",
].join(" "), {
    variants: {
        size: {
            sm: "h-8",
            md: "h-10",
            lg: "h-12",
        },
        kind: {
            primary: "",
            secondary: "border",
            tertiary: "",
        },
        color: {
            primary: "",
            negative: "",
            positive: "",
            inverted: "",
        },
    },
    compoundVariants: [
        // Secondary border picks up the color tone (matches Button).
        {
            kind: "secondary",
            color: "primary",
            class: "border-[var(--color-ui-border-color)]",
        },
        {
            kind: "secondary",
            color: "negative",
            class: "border-[var(--color-negative-color)]",
        },
        {
            kind: "secondary",
            color: "positive",
            class: "border-[var(--color-positive-color)]",
        },
        {
            kind: "secondary",
            color: "inverted",
            class: "border-[var(--color-inverted-color-background)]",
        },
    ],
    defaultVariants: { size: "md", kind: "primary", color: "primary" },
});
// Main (left) button — the default action. Height inherited via h-full so
// the secondary kind's 1px border sits on the wrapper, not duplicated here.
const main = cva([
    "inline-flex items-center justify-center h-full font-body font-normal",
    "transition-colors duration-[120ms] ease-out",
    "focus-visible:outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-[var(--color-primary-color)] focus-visible:ring-offset-2",
    "disabled:cursor-not-allowed",
    "rounded-l-md",
].join(" "), {
    variants: {
        size: {
            sm: "px-2 gap-2 text-t2",
            md: "px-4 gap-2 text-t1",
            lg: "px-6 gap-2 text-t1",
        },
        kind: {
            primary: "",
            secondary: "bg-transparent",
            tertiary: "bg-transparent",
        },
        color: {
            primary: "",
            negative: "",
            positive: "",
            inverted: "",
        },
    },
    compoundVariants: [
        // ── Primary (filled) ──────────────────────────────────────────
        {
            kind: "primary",
            color: "primary",
            class: "bg-[var(--color-primary-color)] text-[var(--color-text-color-on-primary)] hover:bg-[var(--color-primary-hover-color)] active:bg-[var(--color-primary-hover-color)] disabled:bg-[var(--color-disabled-background-color)] disabled:text-[var(--color-disabled-text-color)]",
        },
        {
            kind: "primary",
            color: "negative",
            class: "bg-[var(--color-negative-color)] text-[var(--color-text-color-on-primary)] hover:bg-[var(--color-negative-color-hover)] active:bg-[var(--color-negative-color-hover)] disabled:bg-[var(--color-disabled-background-color)] disabled:text-[var(--color-disabled-text-color)]",
        },
        {
            kind: "primary",
            color: "positive",
            class: "bg-[var(--color-positive-color)] text-[var(--color-text-color-on-primary)] hover:bg-[var(--color-positive-color-hover)] active:bg-[var(--color-positive-color-hover)] disabled:bg-[var(--color-disabled-background-color)] disabled:text-[var(--color-disabled-text-color)]",
        },
        {
            kind: "primary",
            color: "inverted",
            class: "bg-[var(--color-inverted-color-background)] text-[var(--color-text-color-on-inverted)] hover:bg-[var(--color-placeholder-color)] active:bg-[var(--color-placeholder-color)] disabled:bg-[var(--color-disabled-background-color)] disabled:text-[var(--color-disabled-text-color)]",
        },
        // ── Secondary (outlined) ──────────────────────────────────────
        {
            kind: "secondary",
            color: "primary",
            class: "text-[var(--color-secondary-text-color)] hover:bg-[var(--color-primary-background-hover-color)] active:bg-[var(--color-primary-selected-color)] active:text-[var(--color-primary-color)] disabled:text-[var(--color-disabled-text-color)] disabled:bg-transparent",
        },
        {
            kind: "secondary",
            color: "negative",
            class: "text-[var(--color-negative-color)] hover:bg-[var(--color-negative-color-selected)] active:bg-[var(--color-negative-color-selected)] disabled:text-[var(--color-disabled-text-color)] disabled:bg-transparent",
        },
        {
            kind: "secondary",
            color: "positive",
            class: "text-[var(--color-positive-color)] hover:bg-[var(--color-positive-color-selected)] active:bg-[var(--color-positive-color-selected)] disabled:text-[var(--color-disabled-text-color)] disabled:bg-transparent",
        },
        {
            kind: "secondary",
            color: "inverted",
            class: "text-[var(--color-inverted-color-background)] hover:bg-[var(--color-primary-background-hover-color)] active:bg-[var(--color-primary-background-hover-color)] disabled:text-[var(--color-disabled-text-color)] disabled:bg-transparent",
        },
        // ── Tertiary (ghost) ──────────────────────────────────────────
        {
            kind: "tertiary",
            color: "primary",
            class: "text-[var(--color-secondary-text-color)] hover:bg-[var(--color-primary-background-hover-color)] active:bg-[var(--color-primary-selected-color)] active:text-[var(--color-primary-color)] disabled:text-[var(--color-disabled-text-color)] disabled:bg-transparent",
        },
        {
            kind: "tertiary",
            color: "negative",
            class: "text-[var(--color-negative-color)] hover:bg-[var(--color-negative-color-selected)] active:bg-[var(--color-negative-color-selected)] disabled:text-[var(--color-disabled-text-color)] disabled:bg-transparent",
        },
        {
            kind: "tertiary",
            color: "positive",
            class: "text-[var(--color-positive-color)] hover:bg-[var(--color-positive-color-selected)] active:bg-[var(--color-positive-color-selected)] disabled:text-[var(--color-disabled-text-color)] disabled:bg-transparent",
        },
        {
            kind: "tertiary",
            color: "inverted",
            class: "text-[var(--color-inverted-color-background)] hover:bg-[var(--color-primary-background-hover-color)] active:bg-[var(--color-primary-background-hover-color)] disabled:text-[var(--color-disabled-text-color)] disabled:bg-transparent",
        },
    ],
    defaultVariants: {
        size: "md",
        kind: "primary",
        color: "primary",
    },
});
// Trigger (right) button — fixed 24px wide, full height. Hover/active
// background mirror the main button's hover tone so the divider line
// (painted in the same tone) visually disappears when this side is hot.
const trigger = cva([
    "relative inline-flex items-center justify-center h-full w-6 shrink-0",
    "transition-colors duration-[120ms] ease-out",
    "focus-visible:outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-[var(--color-primary-color)] focus-visible:ring-offset-2",
    "disabled:cursor-not-allowed",
    "rounded-r-md",
].join(" "), {
    variants: {
        kind: {
            primary: "",
            secondary: "bg-transparent",
            tertiary: "bg-transparent",
        },
        color: {
            primary: "",
            negative: "",
            positive: "",
            inverted: "",
        },
    },
    compoundVariants: [
        // ── Primary (filled) ──────────────────────────────────────────
        {
            kind: "primary",
            color: "primary",
            class: "bg-[var(--color-primary-color)] text-[var(--color-text-color-on-primary)] hover:bg-[var(--color-primary-hover-color)] data-[state=open]:bg-[var(--color-primary-hover-color)] disabled:bg-[var(--color-disabled-background-color)] disabled:text-[var(--color-disabled-text-color)]",
        },
        {
            kind: "primary",
            color: "negative",
            class: "bg-[var(--color-negative-color)] text-[var(--color-text-color-on-primary)] hover:bg-[var(--color-negative-color-hover)] data-[state=open]:bg-[var(--color-negative-color-hover)] disabled:bg-[var(--color-disabled-background-color)] disabled:text-[var(--color-disabled-text-color)]",
        },
        {
            kind: "primary",
            color: "positive",
            class: "bg-[var(--color-positive-color)] text-[var(--color-text-color-on-primary)] hover:bg-[var(--color-positive-color-hover)] data-[state=open]:bg-[var(--color-positive-color-hover)] disabled:bg-[var(--color-disabled-background-color)] disabled:text-[var(--color-disabled-text-color)]",
        },
        {
            kind: "primary",
            color: "inverted",
            class: "bg-[var(--color-inverted-color-background)] text-[var(--color-text-color-on-inverted)] hover:bg-[var(--color-placeholder-color)] data-[state=open]:bg-[var(--color-placeholder-color)] disabled:bg-[var(--color-disabled-background-color)] disabled:text-[var(--color-disabled-text-color)]",
        },
        // ── Secondary (outlined) ──────────────────────────────────────
        {
            kind: "secondary",
            color: "primary",
            class: "text-[var(--color-secondary-text-color)] hover:bg-[var(--color-primary-background-hover-color)] data-[state=open]:bg-[var(--color-primary-selected-color)] data-[state=open]:text-[var(--color-primary-color)] disabled:text-[var(--color-disabled-text-color)] disabled:bg-transparent",
        },
        {
            kind: "secondary",
            color: "negative",
            class: "text-[var(--color-negative-color)] hover:bg-[var(--color-negative-color-selected)] data-[state=open]:bg-[var(--color-negative-color-selected)] disabled:text-[var(--color-disabled-text-color)] disabled:bg-transparent",
        },
        {
            kind: "secondary",
            color: "positive",
            class: "text-[var(--color-positive-color)] hover:bg-[var(--color-positive-color-selected)] data-[state=open]:bg-[var(--color-positive-color-selected)] disabled:text-[var(--color-disabled-text-color)] disabled:bg-transparent",
        },
        {
            kind: "secondary",
            color: "inverted",
            class: "text-[var(--color-inverted-color-background)] hover:bg-[var(--color-primary-background-hover-color)] data-[state=open]:bg-[var(--color-primary-background-hover-color)] disabled:text-[var(--color-disabled-text-color)] disabled:bg-transparent",
        },
        // ── Tertiary (ghost) ──────────────────────────────────────────
        {
            kind: "tertiary",
            color: "primary",
            class: "text-[var(--color-secondary-text-color)] hover:bg-[var(--color-primary-background-hover-color)] data-[state=open]:bg-[var(--color-primary-selected-color)] data-[state=open]:text-[var(--color-primary-color)] disabled:text-[var(--color-disabled-text-color)] disabled:bg-transparent",
        },
        {
            kind: "tertiary",
            color: "negative",
            class: "text-[var(--color-negative-color)] hover:bg-[var(--color-negative-color-selected)] data-[state=open]:bg-[var(--color-negative-color-selected)] disabled:text-[var(--color-disabled-text-color)] disabled:bg-transparent",
        },
        {
            kind: "tertiary",
            color: "positive",
            class: "text-[var(--color-positive-color)] hover:bg-[var(--color-positive-color-selected)] data-[state=open]:bg-[var(--color-positive-color-selected)] disabled:text-[var(--color-disabled-text-color)] disabled:bg-transparent",
        },
        {
            kind: "tertiary",
            color: "inverted",
            class: "text-[var(--color-inverted-color-background)] hover:bg-[var(--color-primary-background-hover-color)] data-[state=open]:bg-[var(--color-primary-background-hover-color)] disabled:text-[var(--color-disabled-text-color)] disabled:bg-transparent",
        },
    ],
    defaultVariants: { kind: "primary", color: "primary" },
});
// Divider colour. Picked so it merges with the trigger half on hover
// (matches Figma's HoverSecondary / ActiveSecondary states which hide
// the line). For tertiary, no divider at all.
const DIVIDER_COLOR = {
    primary: {
        primary: "bg-[var(--color-primary-hover-color)]",
        negative: "bg-[var(--color-negative-color-hover)]",
        positive: "bg-[var(--color-positive-color-hover)]",
        inverted: "bg-[var(--color-placeholder-color)]",
    },
    secondary: {
        primary: "bg-[var(--color-ui-border-color)]",
        negative: "bg-[var(--color-negative-color)]",
        positive: "bg-[var(--color-positive-color)]",
        inverted: "bg-[var(--color-inverted-color-background)]",
    },
    tertiary: {
        primary: "bg-transparent",
        negative: "bg-transparent",
        positive: "bg-transparent",
        inverted: "bg-transparent",
    },
};
export const SplitButton = forwardRef(function SplitButton({ className, kind = "primary", size = "md", color = "primary", children, icon, iconPosition = "left", disabled = false, onClick, triggerAriaLabel = "Open menu", menu, open: controlledOpen, defaultOpen = false, onOpenChange, ...rest }, ref) {
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : internalOpen;
    const setOpen = useCallback((next) => {
        if (!isControlled)
            setInternalOpen(next);
        onOpenChange?.(next);
    }, [isControlled, onOpenChange]);
    const wrapperRef = useRef(null);
    const popoverRef = useRef(null);
    // Close on outside click + Escape.
    useEffect(() => {
        if (!open)
            return;
        const onDown = (e) => {
            const t = e.target;
            if (wrapperRef.current?.contains(t) ||
                popoverRef.current?.contains(t)) {
                return;
            }
            setOpen(false);
        };
        const onKey = (e) => {
            if (e.key === "Escape")
                setOpen(false);
        };
        document.addEventListener("mousedown", onDown);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onDown);
            document.removeEventListener("keydown", onKey);
        };
    }, [open, setOpen]);
    const isIconOnly = iconPosition === "only" && !!icon;
    const showLabel = !isIconOnly;
    const leadingIcon = icon && iconPosition === "left" ? icon : undefined;
    const trailingIcon = icon && iconPosition === "right" ? icon : undefined;
    return (_jsxs("div", { ref: (node) => {
            wrapperRef.current = node;
            if (typeof ref === "function")
                ref(node);
            else if (ref)
                ref.current = node;
        }, className: cn(root({ size, kind, color }), className), ...rest, children: [_jsxs("button", { type: "button", disabled: disabled, onClick: onClick, className: cn(main({ size, kind, color })), children: [leadingIcon && (_jsx(Icon, { name: leadingIcon, size: "sm", className: "text-current" })), isIconOnly && icon && (_jsx(Icon, { name: icon, size: "sm", className: "text-current" })), showLabel && children != null && _jsx("span", { children: children }), trailingIcon && (_jsx(Icon, { name: trailingIcon, size: "sm", className: "text-current" }))] }), _jsxs("button", { type: "button", disabled: disabled, "aria-haspopup": "menu", "aria-expanded": open, "aria-label": triggerAriaLabel, "data-state": open ? "open" : "closed", onClick: () => setOpen(!open), className: cn(trigger({ kind, color })), children: [_jsx("span", { "aria-hidden": true, className: cn("absolute left-0 top-0 bottom-0 w-px pointer-events-none", DIVIDER_COLOR[kind ?? "primary"][color ?? "primary"], disabled && "opacity-0") }), _jsx(Icon, { name: "chevron-down", size: "sm", className: "text-current" })] }), open && menu && (_jsx("div", { ref: popoverRef, role: "menu", className: "absolute left-0 top-full z-50 mt-1", children: menu }))] }));
});
