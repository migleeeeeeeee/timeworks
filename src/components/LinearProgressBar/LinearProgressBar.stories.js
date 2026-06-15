import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { LinearProgressBar } from "./LinearProgressBar";
const meta = {
    title: "Components/LinearProgressBar",
    component: LinearProgressBar,
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component: 'Linear progress bar sourced from the TimeWorks Figma file (page "Linear Progress Bar", node 46946:16381). Single-colour variants (primary, positive, negative) take a `value` 0–100. The `multi` variant stacks segments end-to-end inside a single track for breakdowns/composition meters.',
            },
        },
    },
    tags: ["autodocs"],
    argTypes: {
        value: { control: { type: "range", min: 0, max: 100, step: 1 } },
        type: { control: "radio", options: ["primary", "positive", "negative", "multi"] },
        size: { control: "radio", options: ["sm", "lg"] },
        showLabel: { control: "boolean" },
        labelText: { control: "text" },
    },
    args: {
        value: 30,
        type: "primary",
        size: "sm",
        showLabel: true,
    },
};
export default meta;
const Cell = ({ label, children }) => (_jsxs("div", { className: "flex flex-col gap-2", children: [_jsx("span", { className: "text-t3 text-[var(--color-secondary-text-color)] uppercase tracking-wide", children: label }), _jsx("div", { className: "w-72", children: children })] }));
export const Playground = {};
export const Sizes = {
    args: { showLabel: false },
    render: (args) => (_jsxs("div", { className: "flex flex-col gap-6 w-72", children: [_jsx(Cell, { label: "Small (4px)", children: _jsx(LinearProgressBar, { ...args, size: "sm" }) }), _jsx(Cell, { label: "Large (8px)", children: _jsx(LinearProgressBar, { ...args, size: "lg" }) })] })),
};
export const Types = {
    args: { showLabel: true },
    render: (args) => (_jsxs("div", { className: "flex flex-col gap-6", children: [_jsx(Cell, { label: "Primary", children: _jsx(LinearProgressBar, { ...args, type: "primary", value: 30 }) }), _jsx(Cell, { label: "Positive", children: _jsx(LinearProgressBar, { ...args, type: "positive", value: 72 }) }), _jsx(Cell, { label: "Negative", children: _jsx(LinearProgressBar, { ...args, type: "negative", value: 18 }) })] })),
};
export const Multi = {
    args: { type: "multi", showLabel: true, size: "lg" },
    render: (args) => (_jsxs("div", { className: "flex flex-col gap-6", children: [_jsx(Cell, { label: "Multi \u00B7 with label", children: _jsx(LinearProgressBar, { ...args, showLabel: true, segments: [
                        { value: 30, color: "primary" },
                        { value: 25, color: "warning" },
                        { value: 20, color: "positive" },
                    ] }) }), _jsx(Cell, { label: "Multi \u00B7 no label \u00B7 small", children: _jsx(LinearProgressBar, { type: "multi", size: "sm", segments: [
                        { value: 35, color: "primary" },
                        { value: 25, color: "warning" },
                        { value: 25, color: "positive" },
                    ] }) })] })),
};
export const Matrix = {
    render: () => (_jsx("div", { className: "flex flex-col gap-10", children: ["sm", "lg"].map((size) => (_jsxs("div", { className: "flex flex-col gap-4", children: [_jsxs("div", { className: "text-t3 text-[var(--color-secondary-text-color)] uppercase tracking-wide", children: ["Size \u00B7 ", size === "sm" ? "Small (4px)" : "Large (8px)"] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5", children: [_jsx(Cell, { label: "Primary \u00B7 with label", children: _jsx(LinearProgressBar, { size: size, type: "primary", value: 30, showLabel: true }) }), _jsx(Cell, { label: "Primary \u00B7 no label", children: _jsx(LinearProgressBar, { size: size, type: "primary", value: 30 }) }), _jsx(Cell, { label: "Positive \u00B7 with label", children: _jsx(LinearProgressBar, { size: size, type: "positive", value: 30, showLabel: true }) }), _jsx(Cell, { label: "Positive \u00B7 no label", children: _jsx(LinearProgressBar, { size: size, type: "positive", value: 30 }) }), _jsx(Cell, { label: "Negative \u00B7 with label", children: _jsx(LinearProgressBar, { size: size, type: "negative", value: 30, showLabel: true }) }), _jsx(Cell, { label: "Negative \u00B7 no label", children: _jsx(LinearProgressBar, { size: size, type: "negative", value: 30 }) }), _jsx(Cell, { label: "Multi \u00B7 with label", children: _jsx(LinearProgressBar, { size: size, type: "multi", showLabel: true, segments: [
                                    { value: 30, color: "primary" },
                                    { value: 25, color: "warning" },
                                    { value: 20, color: "positive" },
                                ] }) }), _jsx(Cell, { label: "Multi \u00B7 no label", children: _jsx(LinearProgressBar, { size: size, type: "multi", segments: [
                                    { value: 35, color: "primary" },
                                    { value: 25, color: "warning" },
                                    { value: 25, color: "positive" },
                                ] }) })] })] }, size))) })),
};
export const Range = {
    args: { showLabel: true },
    render: (args) => (_jsx("div", { className: "flex flex-col gap-4 w-80", children: [0, 10, 30, 50, 75, 100].map((v) => (_jsx(LinearProgressBar, { ...args, value: v }, v))) })),
};
