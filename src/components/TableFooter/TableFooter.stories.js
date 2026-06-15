import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { TableFooter } from "./TableFooter";
const meta = {
    title: "Components/TableFooter",
    component: TableFooter,
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component: 'Three-region table footer sourced from the TimeWorks Figma file (page "Design suggestions", node 25730:21781). Composes Pagination + Dropdown with a count caption. Each region is independently hideable; the row stays accessible as a `<footer aria-label="…">` landmark.',
            },
        },
    },
    tags: ["autodocs"],
    args: {
        totalCount: 300,
        totalLabel: "Total Employees shown",
        page: 1,
        totalPages: 10,
        pageSize: 10,
        pageSizeOptions: [10, 25, 50, 100],
        siblingCount: 1,
        boundaryCount: 1,
    },
    argTypes: {
        page: { control: { type: "number", min: 1, max: 99 } },
        totalPages: { control: { type: "number", min: 1, max: 99 } },
        pageSize: { control: { type: "number", min: 1, max: 1000 } },
        totalCount: { control: { type: "number", min: 0, max: 100000 } },
        siblingCount: { control: { type: "number", min: 0, max: 3 } },
        boundaryCount: { control: { type: "number", min: 0, max: 3 } },
        hideTotal: { control: "boolean" },
        hidePagination: { control: "boolean" },
        hidePageSize: { control: "boolean" },
    },
};
export default meta;
const Cell = ({ label, children }) => (_jsxs("div", { className: "flex flex-col gap-2", children: [_jsx("span", { className: "text-t3 text-[var(--color-secondary-text-color)] uppercase tracking-wide", children: label }), children] }));
export const Default = {
    render: (args) => {
        const [page, setPage] = useState(args.page);
        const [pageSize, setPageSize] = useState(args.pageSize);
        return (_jsx(TableFooter, { ...args, page: page, onPageChange: setPage, pageSize: pageSize, onPageSizeChange: setPageSize }));
    },
};
export const Variants = {
    render: (args) => {
        const [page, setPage] = useState(1);
        const [pageSize, setPageSize] = useState(10);
        return (_jsxs("div", { className: "flex flex-col gap-8", children: [_jsx(Cell, { label: "Full (count + pagination + page size)", children: _jsx(TableFooter, { ...args, page: page, onPageChange: setPage, pageSize: pageSize, onPageSizeChange: setPageSize }) }), _jsx(Cell, { label: "Without page size", children: _jsx(TableFooter, { ...args, hidePageSize: true, page: page, onPageChange: setPage }) }), _jsx(Cell, { label: "Without count", children: _jsx(TableFooter, { ...args, hideTotal: true, page: page, onPageChange: setPage, pageSize: pageSize, onPageSizeChange: setPageSize }) }), _jsx(Cell, { label: "Pagination only", children: _jsx(TableFooter, { ...args, hideTotal: true, hidePageSize: true, page: page, onPageChange: setPage }) })] }));
    },
};
export const States = {
    render: (args) => {
        const [pA, setPA] = useState(1);
        const [pB, setPB] = useState(5);
        const [pC, setPC] = useState(10);
        return (_jsxs("div", { className: "flex flex-col gap-8", children: [_jsx(Cell, { label: "At first page", children: _jsx(TableFooter, { ...args, page: pA, onPageChange: setPA, pageSize: 10, onPageSizeChange: () => { } }) }), _jsx(Cell, { label: "Middle page (both ellipses visible)", children: _jsx(TableFooter, { ...args, page: pB, totalPages: 20, onPageChange: setPB, pageSize: 25, onPageSizeChange: () => { } }) }), _jsx(Cell, { label: "At last page", children: _jsx(TableFooter, { ...args, page: pC, onPageChange: setPC, pageSize: 10, onPageSizeChange: () => { } }) }), _jsx(Cell, { label: "Single page (arrows disabled)", children: _jsx(TableFooter, { ...args, page: 1, totalPages: 1, totalCount: 5, pageSize: 10, onPageSizeChange: () => { } }) })] }));
    },
};
export const Sizes = {
    parameters: {
        docs: {
            description: {
                story: "TableFooter inherits the Pagination size axis. Render at the table-row scale you need.",
            },
        },
    },
    render: (args) => {
        const [page, setPage] = useState(3);
        const [pageSize, setPageSize] = useState(10);
        return (_jsx("div", { className: "flex flex-col gap-8", children: _jsx(Cell, { label: "Default", children: _jsx(TableFooter, { ...args, page: page, onPageChange: setPage, pageSize: pageSize, onPageSizeChange: setPageSize }) }) }));
    },
};
export const Playground = {
    render: (args) => {
        const [page, setPage] = useState(args.page);
        const [pageSize, setPageSize] = useState(args.pageSize);
        return (_jsx(TableFooter, { ...args, page: page, onPageChange: setPage, pageSize: pageSize, onPageSizeChange: setPageSize }));
    },
};
