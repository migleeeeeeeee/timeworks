import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef, } from "react";
import { cn } from "../../lib/cn";
export const TableColumn = forwardRef(function TableColumn({ width, className, style, children, ...rest }, ref) {
    const dimStyle = width !== undefined
        ? { width: typeof width === "number" ? `${width}px` : width }
        : {};
    return (_jsx("div", { ref: ref, role: "columnheader-group", className: cn("flex flex-col items-stretch", className), style: { ...dimStyle, ...style }, ...rest, children: children }));
});
