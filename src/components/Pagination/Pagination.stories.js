import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Pagination } from "./Pagination";
const meta = {
    title: "Components/Pagination",
    component: Pagination,
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component: 'Pagination control sourced from the TimeWorks Figma file (page "Design suggestions", node 25730:21781 — table footer). Custom-styled cells (no shared Button/IconButton) so the active page sits on a primary fill while siblings stay flat. Each cell is a real `<button>` inside a `<nav aria-label="Pagination">` landmark.',
            },
        },
    },
    tags: ["autodocs"],
    argTypes: {
        page: { control: { type: "number", min: 1, max: 99 } },
        totalPages: { control: { type: "number", min: 1, max: 99 } },
        siblingCount: { control: { type: "number", min: 0, max: 3 } },
        boundaryCount: { control: { type: "number", min: 0, max: 3 } },
        size: { control: "radio", options: ["sm", "md"] },
        hideArrows: { control: "boolean" },
    },
    args: {
        page: 1,
        totalPages: 10,
        siblingCount: 1,
        boundaryCount: 1,
        size: "md",
        hideArrows: false,
    },
};
export default meta;
const Cell = ({ label, children }) => (_jsxs("div", { className: "flex flex-col gap-2", children: [_jsx("span", { className: "text-t3 text-[var(--color-secondary-text-color)] uppercase tracking-wide", children: label }), children] }));
export const Default = {
    render: (args) => {
        const [page, setPage] = useState(args.page);
        return _jsx(Pagination, { ...args, page: page, onPageChange: setPage });
    },
};
export const Variants = {
    render: () => {
        const [a, setA] = useState(3);
        const [b, setB] = useState(5);
        const [c, setC] = useState(1);
        return (_jsxs("div", { className: "flex flex-col gap-6", children: [_jsx(Cell, { label: "Few pages \u2014 no ellipses", children: _jsx(Pagination, { page: a, totalPages: 4, onPageChange: setA }) }), _jsx(Cell, { label: "Many pages \u2014 both ellipses", children: _jsx(Pagination, { page: b, totalPages: 20, onPageChange: setB }) }), _jsx(Cell, { label: "Single page \u2014 arrows disabled", children: _jsx(Pagination, { page: c, totalPages: 1, onPageChange: setC }) })] }));
    },
};
export const Sizes = {
    render: () => {
        const [a, setA] = useState(3);
        const [b, setB] = useState(3);
        return (_jsxs("div", { className: "flex flex-col gap-6", children: [_jsx(Cell, { label: "Medium (default)", children: _jsx(Pagination, { size: "md", page: a, totalPages: 10, onPageChange: setA }) }), _jsx(Cell, { label: "Small", children: _jsx(Pagination, { size: "sm", page: b, totalPages: 10, onPageChange: setB }) })] }));
    },
};
export const States = {
    render: () => {
        const [a, setA] = useState(1);
        const [b, setB] = useState(5);
        const [c, setC] = useState(10);
        return (_jsxs("div", { className: "flex flex-col gap-6", children: [_jsx(Cell, { label: "At start \u2014 previous disabled", children: _jsx(Pagination, { page: a, totalPages: 10, onPageChange: setA }) }), _jsx(Cell, { label: "Middle \u2014 both arrows active, both ellipses", children: _jsx(Pagination, { page: b, totalPages: 10, onPageChange: setB }) }), _jsx(Cell, { label: "At end \u2014 next disabled", children: _jsx(Pagination, { page: c, totalPages: 10, onPageChange: setC }) })] }));
    },
};
export const InTableFooter = {
    parameters: {
        layout: "padded",
        docs: {
            description: {
                story: "Approximation of the original Figma context — total-count text on the left, Pagination centered, page-size hint on the right. Demonstrates how the component composes inside a table footer.",
            },
        },
    },
    render: () => {
        const [page, setPage] = useState(1);
        return (_jsxs("div", { className: "flex w-full items-center justify-between gap-6", children: [_jsx("span", { className: "text-t2 text-[var(--color-secondary-text-color)]", children: "Total Employees shown: 300" }), _jsx(Pagination, { page: page, totalPages: 10, onPageChange: setPage }), _jsx("span", { className: "text-t2 text-[var(--color-secondary-text-color)]", children: "Show per page: 10" })] }));
    },
};
export const Playground = {
    render: (args) => {
        const [page, setPage] = useState(args.page);
        return _jsx(Pagination, { ...args, page: page, onPageChange: setPage });
    },
};
