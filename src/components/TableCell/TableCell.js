import { jsx as _jsx } from "react/jsx-runtime";
import { cva } from "class-variance-authority";
import { forwardRef, useContext, } from "react";
import { cn } from "../../lib/cn";
import { TableSizeContext } from "./Table";
/**
 * TableCell — sourced from the TimeWorks Figma file
 * (page "Table / Cell", node 46949:11817).
 *
 * The cell is the structural shell of a data-table row: a fixed-height
 * box with a bottom divider and one of four background states
 * (default / hover / selected / selected-hover). Compose any content
 * inside it — text, icons, chips, labels, avatars, progress bars,
 * editable inputs, or `<TableHeaderCell>` for column titles.
 *
 *   <TableCell>Placeholder for text</TableCell>
 *   <TableCell state="selected" interactive>Riley M.</TableCell>
 *   <TableCell variant="control" size="md">
 *     <Checkbox />
 *   </TableCell>
 *   <TableHeaderCell sortDirection="asc">Owner</TableHeaderCell>
 *
 * Three sizes (sm 32 / md 40 / lg 48) and two layout variants:
 *   `content` (default) — flex row, 16px horizontal padding, 4px gap
 *   `control` — square cell, centered, used for menu / select handles
 *
 * Pass `interactive` to opt the cell into a CSS `:hover` state so a
 * parent row can drive hover styling via pointer position rather than
 * a controlled prop.
 */
const cell = cva([
    "flex items-center font-body text-t2 text-[var(--color-primary-text-color)]",
    "transition-colors duration-[120ms] ease-out",
], {
    variants: {
        size: {
            sm: "h-8",
            md: "h-10",
            lg: "h-12",
        },
        variant: {
            // Text/label/chip/avatar/progress/editable cells share this layout.
            content: "px-4 gap-1 w-full",
            // MenuButton / Selectable square cells. Aspect-square + center
            // is enough — the inner control sizes itself and is centered both
            // axes, matching Figma whether it's a 24px IconButton or 16px Checkbox.
            control: "justify-center aspect-square shrink-0",
        },
        state: {
            default: "bg-[var(--color-primary-background-color)]",
            hover: "bg-[var(--color-primary-background-hover-color)]",
            selected: "bg-[var(--color-primary-selected-color)]",
            "selected-hover": "bg-[var(--color-primary-selected-hover-color)]",
        },
        interactive: {
            true: "cursor-pointer",
            false: "",
        },
        border: {
            true: "border-b border-[var(--color-layout-border-color)]",
            false: "",
        },
    },
    compoundVariants: [
        // Hover hint applies on top of the resting state.
        {
            interactive: true,
            state: "default",
            className: "hover:bg-[var(--color-primary-background-hover-color)]",
        },
        {
            interactive: true,
            state: "selected",
            className: "hover:bg-[var(--color-primary-selected-hover-color)]",
        },
    ],
    defaultVariants: {
        size: "md",
        variant: "content",
        state: "default",
        interactive: false,
        border: true,
    },
});
export const TableCell = forwardRef(function TableCell({ size, variant = "content", state = "default", interactive = false, border = true, className, children, role = "cell", ...rest }, ref) {
    const ctxSize = useContext(TableSizeContext);
    const resolvedSize = size ?? ctxSize ?? "md";
    return (_jsx("div", { ref: ref, role: role, "data-state": state, "data-size": resolvedSize, className: cn(cell({ size: resolvedSize, variant, state, interactive, border }), className), ...rest, children: children }));
});
