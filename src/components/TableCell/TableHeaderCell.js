import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, } from "react";
import { Icon } from "../Icon";
import { IconButton } from "../IconButton";
import { cn } from "../../lib/cn";
import { TableCell } from "./TableCell";
export const TableHeaderCell = forwardRef(function TableHeaderCell({ children, iconBefore, sortDirection, onMenuClick, menuLabel = "Column actions", className, size, state = "default", interactive = false, border = true, ...rest }, ref) {
    return (_jsxs(TableCell, { ref: ref, role: "columnheader", size: size, state: state, interactive: interactive, border: border, 
        // Pull the right padding in to make room for the 24px menu button.
        className: cn(onMenuClick ? "pl-4 pr-2 gap-2" : "px-4 gap-2", className), ...rest, children: [_jsxs("div", { className: "flex flex-1 items-center gap-1 min-w-0", children: [iconBefore ? (_jsx(Icon, { name: iconBefore, size: "xs", "aria-hidden": true, className: "shrink-0 text-[var(--color-icon-color)]" })) : null, _jsx("span", { className: "flex-1 min-w-0 truncate font-semibold leading-5 text-[var(--color-secondary-text-color)]", children: children }), sortDirection ? (_jsx(Icon, { name: sortDirection === "asc" ? "arrow-up" : "arrow-down", size: "xs", "aria-hidden": true, className: "shrink-0 text-[var(--color-icon-color)]" })) : null] }), onMenuClick ? (_jsx(IconButton, { icon: "ellipsis-vertical", size: "xs", kind: "tertiary", "aria-label": menuLabel, onClick: onMenuClick, className: "shrink-0" })) : null] }));
});
