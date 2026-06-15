import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { cloneElement, forwardRef, Fragment, isValidElement, } from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/cn";
import { Icon } from "../Icon";
// The hover background pill wraps the icon+label only — the chevron sits
// outside it as a peer separator (matches Figma 46939:90935).
const labelPill = cva([
    "inline-flex items-center rounded-sm gap-1",
    "text-t2 font-body whitespace-nowrap",
    "transition-colors",
    "outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-color)]",
].join(" "), {
    variants: {
        state: {
            regular: "text-[var(--color-secondary-text-color)]",
            current: "text-[var(--color-primary-text-color)]",
            disabled: "text-[var(--color-disabled-text-color)] cursor-not-allowed",
        },
        variant: {
            // pl 2px / pr 4px matches the Icon Container in Figma.
            default: "pl-[2px] pr-1",
            // 16px square pill around the ellipsis glyph.
            children: "size-4 justify-center",
        },
        interactive: {
            true: "cursor-pointer hover:bg-[var(--color-primary-background-hover-color)]",
            false: "",
        },
    },
    defaultVariants: { state: "regular", variant: "default", interactive: false },
});
export const BreadcrumbItem = forwardRef(function BreadcrumbItem({ variant = "default", current = false, disabled = false, icon, href, className, children, hideSeparator = false, onClick, ...rest }, ref) {
    const state = disabled
        ? "disabled"
        : current
            ? "current"
            : "regular";
    const isLink = !!href && !disabled && !current;
    const interactive = isLink || (!disabled && !current && !!onClick);
    const content = variant === "children" ? (_jsx(Icon, { name: "ellipsis", size: "2xs", "aria-label": "More" })) : (_jsxs(_Fragment, { children: [icon ? (_jsx(Icon, { name: icon, size: "xs", "aria-hidden": true, className: "text-current" })) : null, _jsx("span", { className: "leading-5", children: children })] }));
    const pillClasses = cn(labelPill({ state, variant, interactive }), className);
    const ariaCurrent = current ? "page" : undefined;
    const pill = isLink ? (_jsx("a", { ref: ref, href: href, "aria-current": ariaCurrent, className: pillClasses, onClick: onClick, ...rest, children: content })) : (_jsx("span", { ref: ref, "aria-current": ariaCurrent, "aria-disabled": disabled || undefined, className: pillClasses, ...rest, children: content }));
    // Wrapper has the trailing 2px right padding from Figma; chevron is a
    // peer of the pill so the hover background doesn't extend under it.
    return (_jsxs("span", { className: "inline-flex items-center pr-[2px]", children: [pill, !hideSeparator && _jsx(Separator, {})] }));
});
function Separator() {
    return (_jsx("span", { "aria-hidden": true, className: "inline-flex items-center justify-center size-4 text-[var(--color-icon-color)]", children: _jsx(Icon, { name: "chevron-right", size: "2xs", "aria-hidden": true, className: "text-current" }) }));
}
export const Breadcrumb = forwardRef(function Breadcrumb({ children, className, "aria-label": ariaLabel = "Breadcrumb", ...rest }, ref) {
    const items = flattenChildren(children);
    const lastIndex = items.length - 1;
    return (_jsx("nav", { ref: ref, "aria-label": ariaLabel, className: cn("inline-flex items-center", className), ...rest, children: _jsx("ol", { className: "inline-flex items-center m-0 p-0 list-none", children: items.map((child, i) => {
                const isLast = i === lastIndex;
                const cloned = isValidElement(child)
                    ? cloneElement(child, {
                        current: child.props.current ?? isLast,
                        hideSeparator: child.props.hideSeparator ?? isLast,
                    })
                    : child;
                return (_jsx("li", { className: "inline-flex items-center", children: cloned }, i));
            }) }) }));
});
function flattenChildren(children) {
    const out = [];
    const visit = (node) => {
        if (node == null || node === false || node === true)
            return;
        if (Array.isArray(node)) {
            node.forEach(visit);
            return;
        }
        if (typeof node === "object" &&
            node !== null &&
            "type" in node &&
            node.type === Fragment) {
            visit((node.props.children));
            return;
        }
        out.push(node);
    };
    visit(children);
    return out;
}
