import { jsx as _jsx } from "react/jsx-runtime";
import { cva } from "class-variance-authority";
import { forwardRef } from "react";
import { cn } from "../../lib/cn";
/**
 * Divider — sourced from the TimeWorks Figma file
 * (page "Divider", node 46946:1080).
 *
 *   <Divider />
 *   <Divider orientation="vertical" />
 *   <Divider decorative={false} />
 *
 * 1px line in `--color-layout-border-color` (Figma `layout-border-color`). Defaults
 * to a decorative role; pass `decorative={false}` for a semantic separator
 * announced to assistive tech.
 *
 * Sizing: horizontal stretches to fill the parent's inline axis. Vertical
 * uses `self-stretch` so it fills the parent's block axis when placed inside
 * a flex container; outside flex contexts, give it an explicit height.
 */
const divider = cva("shrink-0 bg-[var(--color-layout-border-color)]", {
    variants: {
        orientation: {
            horizontal: "h-px w-full",
            vertical: "w-px self-stretch",
        },
    },
    defaultVariants: { orientation: "horizontal" },
});
export const Divider = forwardRef(function Divider({ className, orientation: orientationProp, decorative = true, ...rest }, ref) {
    const orientation = orientationProp ?? "horizontal";
    const semantic = decorative
        ? { role: "none" }
        : { role: "separator", "aria-orientation": orientation };
    return (_jsx("div", { ref: ref, "data-orientation": orientation, className: cn(divider({ orientation }), className), ...semantic, ...rest }));
});
