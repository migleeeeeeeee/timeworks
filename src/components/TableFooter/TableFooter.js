import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { forwardRef, useMemo } from "react";
import { Pagination } from "../Pagination";
import { Dropdown } from "../Dropdown";
import { cn } from "../../lib/cn";
/**
 * TableFooter — sourced from the TimeWorks Figma file
 * (page "Design suggestions", node 25730:21781 — the table footer).
 *
 *   <TableFooter
 *     totalCount={300}
 *     totalLabel="Total Employees shown"
 *     page={page}
 *     totalPages={Math.ceil(300 / pageSize)}
 *     onPageChange={setPage}
 *     pageSize={pageSize}
 *     pageSizeOptions={[10, 25, 50, 100]}
 *     onPageSizeChange={setPageSize}
 *   />
 *
 * Three-region row laid out with `justify-between`:
 *   left   — total-count caption ("Total Employees shown: 300")
 *   center — Pagination (custom-styled cells, IconButton arrows)
 *   right  — "Show per page" caption + Dropdown
 *
 * Each region is optional: pass `hideTotal`, `hidePagination`, or
 * `hidePageSize` to drop one. The whole row is a `<footer>` landmark with
 * an accessible name so screen readers announce it as the table footer.
 */
const TEXT_MUTED = "text-t2 text-[var(--color-secondary-text-color)] font-body whitespace-nowrap";
const DEFAULT_PAGE_SIZES = [10, 25, 50, 100];
export const TableFooter = forwardRef(function TableFooter({ className, 
// Count
totalCount, totalLabel = "Total shown", renderTotal, hideTotal = false, 
// Pagination
page, totalPages, onPageChange, siblingCount = 1, boundaryCount = 1, hidePagination = false, 
// Page size
pageSize, pageSizeOptions = DEFAULT_PAGE_SIZES, onPageSizeChange, pageSizeLabel = "Show per page", hidePageSize = false, 
// Misc
ariaLabel = "Table footer", ...rest }, ref) {
    const dropdownOptions = useMemo(() => pageSizeOptions.map((n) => ({ value: String(n), label: String(n) })), [pageSizeOptions]);
    const showTotal = !hideTotal && (renderTotal || totalCount != null);
    const showPagination = !hidePagination && page != null && totalPages != null;
    const showPageSize = !hidePageSize && pageSize != null;
    return (_jsxs("footer", { ref: ref, "aria-label": ariaLabel, className: cn("flex w-full items-center justify-between gap-6 py-2", 
        // Footer chrome stays transparent so it composes inside any table surface.
        className), ...rest, children: [_jsx("div", { className: cn("flex items-center", showTotal ? "" : "invisible"), children: showTotal &&
                    (renderTotal ? (renderTotal()) : (_jsxs("span", { className: TEXT_MUTED, children: [totalLabel, ": ", _jsx("span", { className: "text-[var(--color-primary-text-color)]", children: totalCount })] }))) }), _jsx("div", { className: "flex items-center justify-center", children: showPagination && (_jsx(Pagination, { page: page, totalPages: totalPages, onPageChange: onPageChange, siblingCount: siblingCount, boundaryCount: boundaryCount })) }), _jsx("div", { className: cn("flex items-center gap-3", showPageSize ? "" : "invisible"), children: showPageSize && (_jsxs(_Fragment, { children: [_jsx("span", { className: TEXT_MUTED, children: pageSizeLabel }), _jsx(Dropdown, { options: dropdownOptions, value: String(pageSize), onValueChange: (v) => onPageSizeChange?.(Number(v)), size: "sm", className: "w-24", "aria-label": pageSizeLabel })] })) })] }));
});
