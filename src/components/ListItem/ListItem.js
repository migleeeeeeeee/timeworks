import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cva } from "class-variance-authority";
import { forwardRef, } from "react";
import { Divider } from "../Divider";
import { Icon } from "../Icon";
import { Label } from "../Label";
import { cn } from "../../lib/cn";
/**
 * ListItem — sourced from the TimeWorks Figma file
 * (page "List item", node 46939:7903; component set 46946:17488).
 *
 *   <ListItem>Option 1</ListItem>
 *   <ListItem icon="hexagon-image" rightIcon>Option 1</ListItem>
 *   <ListItem variant="category-title" icon="hexagon-image">Settings</ListItem>
 *   <ListItem variant="divider" />
 *
 * A polymorphic row used inside menus, dropdowns, and selection lists.
 * Six content variants:
 *   - item              · 32px row of text with optional left icon / avatar /
 *                         right chevron / end label.
 *   - button            · 40px centered action row (icon + label).
 *   - category-title    · 34px Section header (semibold, t1).
 *   - category-separator· 32px subdued caption used between groups.
 *   - information       · 32px row with centered helper copy.
 *   - divider           · 1px rule with vertical breathing room.
 *
 * Interactive variants (item/button) render as <button> so they participate
 * in keyboard navigation and focus rings out of the box.
 */
const itemBase = cva([
    "flex w-full items-center text-left",
    "text-t2 font-body text-[var(--color-primary-text-color)]",
    "transition-colors",
], {
    variants: {
        variant: {
            item: "h-8 gap-2 px-2 py-2 rounded-sm",
            button: "h-10 justify-center py-2 rounded-sm",
            "category-title": "h-[34px] gap-2 px-2 py-2 rounded-sm text-t1 font-semibold",
            "category-separator": "h-8 gap-2 px-2 py-2 text-[var(--color-secondary-text-color)]",
            information: "h-8 px-2 py-2 rounded-sm justify-center text-center",
            divider: "block w-full px-0 py-1",
        },
        interactive: {
            true: [
                "cursor-pointer",
                "hover:bg-[var(--color-primary-background-hover-color)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-color)]",
            ],
            false: "",
        },
        active: {
            true: "bg-[var(--color-primary-selected-color)] hover:bg-[var(--color-primary-selected-color)]",
            false: "",
        },
        disabled: {
            true: "text-[var(--color-disabled-text-color)] pointer-events-none",
            false: "",
        },
    },
    defaultVariants: {
        variant: "item",
        interactive: false,
        active: false,
        disabled: false,
    },
});
function isInteractive(variant) {
    return variant === "item" || variant === "button";
}
function renderLabel(label) {
    if (label == null || label === false)
        return null;
    if (typeof label === "string" || typeof label === "number") {
        return _jsx(Label, { children: label });
    }
    if (typeof label === "object" &&
        label !== null &&
        "children" in label &&
        !("$$typeof" in label)) {
        const { children, color, kind, size } = label;
        return (_jsx(Label, { color: color, kind: kind, size: size, children: children }));
    }
    return label;
}
export const ListItem = forwardRef(function ListItem({ variant = "item", active = false, disabled = false, icon, rightIcon, avatar, label, children, className, onClick, onKeyDown, ...rest }, ref) {
    // Divider — render a hairline rule, no interactivity, no children.
    if (variant === "divider") {
        return (_jsx("div", { ref: ref, role: "separator", className: cn("w-full py-1", className), ...rest, children: _jsx(Divider, {}) }));
    }
    const interactive = isInteractive(variant) && !disabled;
    const classes = cn(itemBase({
        variant,
        interactive,
        active: active && !disabled,
        disabled,
    }), className);
    const iconColorClass = disabled
        ? "text-[var(--color-disabled-text-color)]"
        : "text-[var(--color-icon-color)]";
    const leadingIcon = icon ? (_jsx(Icon, { name: icon, size: "sm", "aria-hidden": true, className: iconColorClass })) : null;
    const leadingAvatar = avatar ? (_jsx("span", { className: cn("inline-flex items-center shrink-0", disabled && "opacity-40"), children: avatar })) : null;
    const trailingIconName = rightIcon === true ? "chevron-right" : rightIcon ? rightIcon : null;
    const trailingIcon = trailingIconName ? (_jsx(Icon, { name: trailingIconName, size: "xs", "aria-hidden": true, className: cn("shrink-0", iconColorClass) })) : null;
    const labelPill = renderLabel(label);
    // Left side container — gathers leading icon/avatar, label text, and the
    // optional end-label pill so they share the same min-w-0 / overflow rules.
    // Line-height matches Figma: 22px for category-title (Karla SemiBold 16/22),
    // 20px for the rest (Karla Regular 14/20).
    const textLeading = variant === "category-title" ? "leading-[22px]" : "leading-5";
    const leftSide = (_jsxs("span", { className: "flex flex-1 items-center gap-2 overflow-clip min-w-0", children: [leadingIcon, leadingAvatar, _jsx("span", { className: cn("flex-1 min-w-0 truncate", textLeading), children: children }), labelPill] }));
    if (variant === "button") {
        // Button variant doesn't use the left-side flex; centered icon + text.
        const inner = (_jsxs("span", { className: "inline-flex items-center gap-2 overflow-clip", children: [leadingIcon, _jsx("span", { className: "text-t1 leading-[22px] whitespace-nowrap", children: children })] }));
        return (_jsx("button", { ref: ref, type: "button", disabled: disabled, "aria-disabled": disabled || undefined, className: classes, onClick: onClick, onKeyDown: onKeyDown, ...rest, children: inner }));
    }
    if (variant === "item") {
        return (_jsxs("button", { ref: ref, type: "button", disabled: disabled, "aria-disabled": disabled || undefined, "aria-current": active ? "true" : undefined, className: classes, onClick: onClick, onKeyDown: onKeyDown, ...rest, children: [leftSide, trailingIcon] }));
    }
    // Non-interactive variants render as a div.
    if (variant === "information") {
        return (_jsx("div", { ref: ref, className: classes, ...rest, children: _jsx("span", { className: "leading-5", children: children }) }));
    }
    if (variant === "category-separator") {
        return (_jsx("div", { ref: ref, className: classes, ...rest, children: _jsx("span", { className: "flex-1 truncate leading-5", children: children }) }));
    }
    // category-title
    return (_jsxs("div", { ref: ref, className: classes, ...rest, children: [leftSide, trailingIcon] }));
});
