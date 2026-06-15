import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Counter } from "./Counter";
const meta = {
    title: "Components/Counter",
    component: Counter,
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component: 'Counter is a standalone numeric pill that shows the count of some adjacent data. Sourced from the TimeWorks Figma file (page "Counter", node 46939:100209). Unlike Badge, Counter does not wrap a child — place it inline next to whatever it counts (tab labels, list items, etc.).',
            },
        },
    },
    tags: ["autodocs"],
    argTypes: {
        count: { control: { type: "number", min: 0, max: 9999 } },
        max: { control: { type: "number", min: 1, max: 9999 } },
        size: { control: "radio", options: ["sm", "lg"] },
        kind: { control: "radio", options: ["fill", "line"] },
        color: { control: "radio", options: ["primary", "negative", "dark", "light"] },
    },
    args: {
        count: 5,
        max: 99,
        size: "lg",
        kind: "fill",
        color: "primary",
    },
};
export default meta;
export const Playground = {};
const Cell = ({ label, children }) => (_jsxs("div", { className: "flex flex-col items-center gap-2", children: [_jsx("div", { className: "flex items-center justify-center h-7", children: children }), _jsx("span", { className: "text-t3 text-[var(--color-secondary-text-color)] uppercase tracking-wide", children: label })] }));
const COLORS = ["primary", "negative", "dark", "light"];
const KINDS = ["fill", "line"];
export const Matrix = {
    render: () => (_jsx("div", { className: "space-y-8", children: ["lg", "sm"].map((size) => (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "text-t3 text-[var(--color-secondary-text-color)] uppercase tracking-wide", children: ["Size \u00B7 ", size === "lg" ? "Large (24)" : "Small (18)"] }), _jsx("div", { className: "flex flex-wrap gap-x-10 gap-y-6", children: KINDS.map((kind) => COLORS.map((color) => (_jsx(Cell, { label: `${color} · ${kind}`, children: _jsx(Counter, { size: size, kind: kind, color: color, count: 5 }) }, `${size}-${kind}-${color}`)))) })] }, size))) })),
};
export const Sizes = {
    render: () => (_jsxs("div", { className: "flex items-center gap-6", children: [_jsx(Counter, { size: "sm", count: 5 }), _jsx(Counter, { size: "lg", count: 5 })] })),
};
export const Colors = {
    render: () => (_jsx("div", { className: "flex items-center gap-3", children: COLORS.map((color) => (_jsx(Counter, { color: color, count: 5 }, color))) })),
};
export const Overflow = {
    render: () => (_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Counter, { count: 3 }), _jsx(Counter, { count: 42 }), _jsx(Counter, { count: 120 }), _jsx(Counter, { count: 1500, max: 999 })] })),
};
