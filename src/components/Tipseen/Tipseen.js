import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cva } from "class-variance-authority";
import { createContext, forwardRef, useContext, } from "react";
import { Icon } from "../Icon";
import { cn } from "../../lib/cn";
const POINTER_SIZE = 8;
const card = cva([
    "relative flex flex-col w-72 rounded-md overflow-hidden",
    "shadow-[var(--shadow-md)]",
].join(" "), {
    variants: {
        type: {
            inverted: "bg-[var(--color-inverted-color-background)] text-[var(--color-text-color-on-inverted)]",
            primary: "bg-[var(--color-primary-color)] text-[var(--color-text-color-on-primary)]",
        },
    },
    defaultVariants: { type: "inverted" },
});
// DOM order is `pointer → card`, so the flex direction places the pointer
// on the side named by `pointerPosition`:
//   top    → pointer above card    (flex-col)
//   bottom → pointer below card    (flex-col-reverse)
//   left   → pointer left of card  (flex-row)
//   right  → pointer right of card (flex-row-reverse)
const wrapper = cva("relative inline-flex", {
    variants: {
        pointerPosition: {
            none: "",
            top: "flex-col",
            bottom: "flex-col-reverse",
            left: "flex-row",
            right: "flex-row-reverse",
        },
    },
    defaultVariants: { pointerPosition: "none" },
});
// Pull the wedge 1px into the card on the side that faces it — closes a
// subpixel rendering gap between the SVG triangle and the rounded card edge.
const pointerWedge = cva("shrink-0 self-center", {
    variants: {
        pointerPosition: {
            none: "hidden",
            top: "-mb-px",
            bottom: "-mt-px",
            left: "-mr-px",
            right: "-ml-px",
        },
    },
    defaultVariants: { pointerPosition: "none" },
});
const TipseenContext = createContext({ type: "inverted" });
export const Tipseen = forwardRef(function Tipseen({ className, type = "inverted", pointerPosition = "none", title, children, image, footer, onDismiss, dismissLabel = "Dismiss", closeButtonColor, ...rest }, ref) {
    const resolvedType = type ?? "inverted";
    // When there's an image and the X sits on top of it, default to a
    // contrast-aware light icon. Otherwise use the on-bg foreground.
    const resolvedCloseColor = closeButtonColor ?? (image ? "light" : resolvedType === "inverted" ? "light" : "light");
    const closeButtonClass = resolvedCloseColor === "dark"
        ? "text-[var(--color-fixed-dark-color)] hover:bg-black/10 focus-visible:ring-[var(--color-fixed-dark-color)]"
        : "text-[var(--color-fixed-light-color)] hover:bg-white/15 focus-visible:ring-[var(--color-fixed-light-color)]";
    return (_jsx(TipseenContext.Provider, { value: { type: resolvedType }, children: _jsxs("div", { ref: ref, role: "status", className: cn(wrapper({ pointerPosition }), className), ...rest, children: [pointerPosition !== "none" && (_jsx("div", { className: pointerWedge({ pointerPosition }), "aria-hidden": "true", children: _jsx(Pointer, { type: resolvedType, pointerPosition: pointerPosition }) })), _jsxs("div", { className: card({ type: resolvedType }), children: [image && _jsx("div", { "data-slot": "media", className: "w-full", children: image }), _jsxs("div", { className: "flex flex-col gap-1 px-5 pt-4 pb-5", children: [title != null && (_jsx("p", { className: "font-body font-bold text-t1 leading-[22px] pr-6 text-current", children: title })), children != null && (_jsx("div", { className: "font-body text-t2 leading-[20px] text-current", children: children }))] }), footer != null && (_jsx("div", { "data-slot": "footer", className: "flex items-center justify-end gap-2 px-5 pb-6 pt-0 min-h-8", children: footer })), onDismiss && (_jsx("button", { type: "button", onClick: onDismiss, "aria-label": dismissLabel, className: cn("absolute right-2 inline-flex items-center justify-center size-6 rounded-sm cursor-pointer", 
                            // Figma: with-image variant uses top=6 to clear the bright image edge;
                            // no-image variant uses top=8 inside the dark card area.
                            image ? "top-1.5" : "top-2", "transition-colors duration-[120ms] ease-out", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-transparent", closeButtonClass), children: _jsx(Icon, { name: "x-mark-small", size: "xs", className: "text-current" }) }))] })] }) }));
});
/* ─────────────────────────────  Pointer  ───────────────────────────────── */
function Pointer({ type, pointerPosition, }) {
    const fill = type === "inverted" ? "var(--color-inverted-color-background)" : "var(--color-primary-color)";
    // The arrow is a 16×8 wedge for top/bottom and an 8×16 wedge for left/right.
    if (pointerPosition === "top") {
        return (_jsx("svg", { width: 16, height: POINTER_SIZE, viewBox: "0 0 16 8", "aria-hidden": "true", children: _jsx("path", { d: "M8 0 L16 8 L0 8 Z", fill: fill }) }));
    }
    if (pointerPosition === "bottom") {
        return (_jsx("svg", { width: 16, height: POINTER_SIZE, viewBox: "0 0 16 8", "aria-hidden": "true", children: _jsx("path", { d: "M0 0 L16 0 L8 8 Z", fill: fill }) }));
    }
    if (pointerPosition === "left") {
        return (_jsx("svg", { width: POINTER_SIZE, height: 16, viewBox: "0 0 8 16", "aria-hidden": "true", children: _jsx("path", { d: "M0 8 L8 0 L8 16 Z", fill: fill }) }));
    }
    return (_jsx("svg", { width: POINTER_SIZE, height: 16, viewBox: "0 0 8 16", "aria-hidden": "true", children: _jsx("path", { d: "M8 8 L0 0 L0 16 Z", fill: fill }) }));
}
/* ─────────────────────────────  Action  ────────────────────────────────── */
const action = cva([
    "inline-flex items-center justify-center select-none whitespace-nowrap shrink-0",
    "h-8 max-h-8 px-2 rounded-sm text-t2 font-body cursor-pointer",
    "transition-colors duration-[120ms] ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-transparent",
    "disabled:cursor-not-allowed disabled:opacity-50",
].join(" "), {
    variants: {
        kind: {
            // Tertiary-on-inverted/primary: text-only, current foreground.
            tertiary: "bg-transparent text-current border border-transparent",
            // Primary-on-inverted/primary: white pill with dark/brand text.
            primary: "border border-transparent",
        },
        onType: {
            inverted: "",
            primary: "",
        },
    },
    compoundVariants: [
        {
            kind: "tertiary",
            onType: "inverted",
            class: "hover:bg-white/10 focus-visible:ring-[var(--color-fixed-light-color)]",
        },
        {
            kind: "tertiary",
            onType: "primary",
            class: "hover:bg-white/15 focus-visible:ring-[var(--color-fixed-light-color)]",
        },
        {
            kind: "primary",
            onType: "inverted",
            class: "bg-[var(--color-primary-background-color)] text-[var(--color-primary-text-color)] hover:bg-[var(--color-primary-background-hover-color)] focus-visible:ring-[var(--color-fixed-light-color)]",
        },
        {
            kind: "primary",
            onType: "primary",
            class: "bg-[var(--color-primary-background-color)] text-[var(--color-primary-color)] hover:bg-[var(--color-primary-background-hover-color)] focus-visible:ring-[var(--color-fixed-light-color)]",
        },
    ],
    defaultVariants: { kind: "tertiary", onType: "inverted" },
});
export const TipseenAction = forwardRef(function TipseenAction({ className, kind = "tertiary", type = "button", ...rest }, ref) {
    const { type: tipseenType } = useContext(TipseenContext);
    return (_jsx("button", { ref: ref, type: type, className: cn(action({ kind, onType: tipseenType }), className), ...rest }));
});
