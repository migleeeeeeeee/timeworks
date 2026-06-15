import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useContext, } from "react";
import { cn } from "../../lib/cn";
import { Skeleton } from "../Skeleton";
import { TableCell } from "./TableCell";
import { TableColumn } from "./TableColumn";
import { TableSizeContext } from "./Table";
function PlaceholderShape({ shape, rowIndex, animated, }) {
    switch (shape) {
        case "text": {
            const wide = rowIndex % 2 === 0;
            return (_jsx(Skeleton, { type: "rectangle", width: wide ? 195 : 130, height: 24, animated: animated }));
        }
        case "rectangle":
            return _jsx(Skeleton, { type: "rectangle", width: 80, height: 24, animated: animated });
        case "circle":
            return _jsx(Skeleton, { type: "circle", width: 24, height: 24, animated: animated });
        case "square":
            return _jsx(Skeleton, { type: "rectangle", width: 24, height: 24, animated: animated });
    }
}
export const TableColumnLoader = forwardRef(function TableColumnLoader({ header, rows = 20, shape = "text", size, width, animated = true, className, ...rest }, ref) {
    const ctxSize = useContext(TableSizeContext);
    const ctxLoaderSize = ctxSize === "lg" ? "lg" : ctxSize === "md" ? "md" : undefined;
    const resolvedSize = size ?? ctxLoaderSize ?? "md";
    const isControl = shape === "circle" || shape === "square";
    return (_jsxs(TableColumn, { ref: ref, width: width, className: cn(className), "aria-busy": "true", ...rest, children: [header, Array.from({ length: rows }).map((_, index) => (_jsx(TableCell, { size: resolvedSize, variant: isControl ? "control" : "content", children: _jsx(PlaceholderShape, { shape: shape, rowIndex: index, animated: animated }) }, index)))] }));
});
