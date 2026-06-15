import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cva } from "class-variance-authority";
import { forwardRef, useMemo } from "react";
import { IconButton } from "../IconButton";
import { cn } from "../../lib/cn";
function range(start, end) {
    return Array.from({ length: Math.max(0, end - start + 1) }, (_, i) => start + i);
}
function buildItems(totalPages, page, siblingCount, boundaryCount) {
    const total = Math.max(1, Math.floor(totalPages));
    const current = Math.min(Math.max(1, Math.floor(page)), total);
    const siblings = Math.max(0, siblingCount);
    const boundaries = Math.max(0, boundaryCount);
    // Slots: boundaries + dots + (siblings*2 + 1 active) + dots + boundaries
    const totalSlots = boundaries * 2 + siblings * 2 + 5;
    if (total <= totalSlots) {
        return range(1, total).map((p) => ({ kind: "page", page: p }));
    }
    const leftSibling = Math.max(current - siblings, boundaries + 2);
    const rightSibling = Math.min(current + siblings, total - boundaries - 1);
    const showLeftDots = leftSibling > boundaries + 2;
    const showRightDots = rightSibling < total - boundaries - 1;
    const head = range(1, boundaries);
    const tail = range(total - boundaries + 1, total);
    const items = [...head.map((p) => ({ kind: "page", page: p }))];
    if (!showLeftDots && showRightDots) {
        const leftItemCount = boundaries + siblings * 2 + 2;
        items.push(...range(boundaries + 1, leftItemCount).map((p) => ({ kind: "page", page: p })));
        items.push({ kind: "ellipsis", key: "right" });
    }
    else if (showLeftDots && !showRightDots) {
        const rightItemCount = boundaries + siblings * 2 + 2;
        items.push({ kind: "ellipsis", key: "left" });
        items.push(...range(total - boundaries - rightItemCount + 1, total - boundaries).map((p) => ({
            kind: "page",
            page: p,
        })));
    }
    else if (showLeftDots && showRightDots) {
        items.push({ kind: "ellipsis", key: "left" });
        items.push(...range(leftSibling, rightSibling).map((p) => ({ kind: "page", page: p })));
        items.push({ kind: "ellipsis", key: "right" });
    }
    else {
        items.push(...range(boundaries + 1, total - boundaries).map((p) => ({ kind: "page", page: p })));
    }
    items.push(...tail.map((p) => ({ kind: "page", page: p })));
    return items;
}
// ──────────────────────────────────────────────────────────────────────────────
// Visual primitives — custom cells, not Button/IconButton
// ──────────────────────────────────────────────────────────────────────────────
const root = cva("inline-flex items-center font-body", {
    variants: {
        size: {
            sm: "gap-1.5",
            md: "gap-2",
        },
    },
    defaultVariants: { size: "md" },
});
const cell = cva([
    "inline-flex items-center justify-center shrink-0 select-none",
    "text-t2 leading-none tabular-nums font-body",
    "transition-colors duration-[120ms] ease-out",
    "border border-transparent bg-transparent",
    "text-[var(--color-primary-text-color)]",
    // Neutral palette: subtle gray hover for inactive, charcoal fill for active.
    // Avoids the brand blue here so the active page sits quietly inside dense data tables.
    "hover:bg-[var(--color-allgrey-background-color)]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-text-color)] focus-visible:ring-offset-2",
    "disabled:cursor-not-allowed disabled:text-[var(--color-disabled-text-color)] disabled:bg-transparent",
    "data-[active=true]:bg-[var(--color-inverted-color-background)]",
    "data-[active=true]:text-[var(--color-text-color-on-inverted)]",
    "data-[active=true]:hover:bg-[var(--color-primary-text-color)]",
].join(" "), {
    variants: {
        size: {
            sm: "h-6 min-w-6 px-1.5 rounded",
            md: "h-8 min-w-8 px-2 rounded",
        },
    },
    defaultVariants: { size: "md" },
});
const ellipsis = cva("inline-flex items-center justify-center shrink-0 text-[var(--color-secondary-text-color)] font-body select-none", {
    variants: {
        size: {
            sm: "h-6 min-w-6 text-t2 leading-none",
            md: "h-8 min-w-8 text-t2 leading-none",
        },
    },
    defaultVariants: { size: "md" },
});
export const Pagination = forwardRef(function Pagination({ className, size = "md", page, totalPages, onPageChange, siblingCount = 1, boundaryCount = 1, hideArrows = false, previousLabel = "Previous page", nextLabel = "Next page", renderPageLabel, "aria-label": ariaLabel = "Pagination", ...rest }, ref) {
    const total = Math.max(1, Math.floor(totalPages));
    const current = Math.min(Math.max(1, Math.floor(page)), total);
    const items = useMemo(() => buildItems(total, current, siblingCount, boundaryCount), [total, current, siblingCount, boundaryCount]);
    const goTo = (next) => {
        if (next < 1 || next > total || next === current)
            return;
        onPageChange?.(next);
    };
    return (_jsxs("nav", { ref: ref, "aria-label": ariaLabel, className: cn(root({ size }), className), ...rest, children: [!hideArrows && (_jsx(IconButton, { kind: "secondary", size: "xs", icon: "chevron-left", "aria-label": previousLabel, disabled: current <= 1, onClick: () => goTo(current - 1) })), _jsx("ul", { className: cn("inline-flex items-center", size === "sm" ? "gap-0.5" : "gap-1"), children: items.map((item, idx) => {
                    if (item.kind === "ellipsis") {
                        return (_jsx("li", { "aria-hidden": true, className: ellipsis({ size }), children: "\u2026" }, `${item.key}-${idx}`));
                    }
                    const isActive = item.page === current;
                    return (_jsx("li", { children: _jsx("button", { type: "button", className: cell({ size }), "data-active": isActive || undefined, "aria-current": isActive ? "page" : undefined, "aria-label": `Go to page ${item.page}`, onClick: () => goTo(item.page), children: renderPageLabel ? renderPageLabel(item.page) : item.page }) }, item.page));
                }) }), !hideArrows && (_jsx(IconButton, { kind: "secondary", size: "xs", icon: "chevron-right", "aria-label": nextLabel, disabled: current >= total, onClick: () => goTo(current + 1) }))] }));
});
