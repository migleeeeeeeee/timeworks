import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from "react";
import { cn } from "../../lib/cn";
const DEFAULTS = {
    circle: { width: 38, height: 38 },
    rectangle: { width: 144, height: 144 },
    "text-h1": { width: 162, height: 32 },
    "text-h2": { width: 162, height: 24 },
    "text-paragraph": { width: 162, height: 16 },
};
const toCss = (v) => (typeof v === "number" ? `${v}px` : v);
export const Skeleton = forwardRef(function Skeleton({ className, type = "circle", size = "paragraph", width, height, animated = true, style, ...rest }, ref) {
    const key = type === "text" ? `text-${size}` : type;
    const defaults = DEFAULTS[key];
    const w = width ?? defaults.width;
    const h = height ?? defaults.height;
    const dimStyle = {
        width: toCss(w),
        height: toCss(h),
    };
    return (_jsx("div", { ref: ref, "aria-hidden": true, className: cn("block shrink-0 bg-[var(--color-ui-background-color)]", type === "circle" ? "rounded-full" : "rounded-sm", animated && "animate-pulse", className), style: { ...dimStyle, ...style }, ...rest }));
});
