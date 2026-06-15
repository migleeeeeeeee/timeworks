import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Slider } from "./Slider";
import { Icon } from "../Icon";
const meta = {
    title: "Components/Slider",
    component: Slider,
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component: 'Slider is a visual input component that reflects current state status in its appearance. Sourced from the TimeWorks Figma file (page "Slider", node 46939:7912; variants at 46949:2542). Supports single-thumb and range (`[lo, hi]`) modes, three intent colours, three sizes, optional value read-outs, and optional bookend icons. Built on pointer + keyboard events directly — no Radix slider primitive in our deps yet.',
            },
        },
    },
    tags: ["autodocs"],
    argTypes: {
        type: { control: "radio", options: ["primary", "negative", "positive"] },
        size: { control: "radio", options: ["sm", "md", "lg"] },
        min: { control: { type: "number" } },
        max: { control: { type: "number" } },
        step: { control: { type: "number", min: 0.1 } },
        showLabel: { control: "boolean" },
        disabled: { control: "boolean" },
    },
    args: {
        type: "primary",
        size: "md",
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 40,
        showLabel: false,
        disabled: false,
    },
};
export default meta;
const Cell = ({ label, children }) => (_jsxs("div", { className: "flex flex-col gap-3", children: [_jsx("span", { className: "text-t3 text-[var(--color-secondary-text-color)] uppercase tracking-wide", children: label }), _jsx("div", { className: "w-[340px]", children: children })] }));
export const Playground = {};
export const Sizes = {
    render: (args) => (_jsxs("div", { className: "flex flex-col gap-8", children: [_jsx(Cell, { label: "Small", children: _jsx(Slider, { ...args, size: "sm", defaultValue: 30 }) }), _jsx(Cell, { label: "Medium", children: _jsx(Slider, { ...args, size: "md", defaultValue: 50 }) }), _jsx(Cell, { label: "Large", children: _jsx(Slider, { ...args, size: "lg", defaultValue: 70 }) })] })),
};
export const Types = {
    render: (args) => (_jsxs("div", { className: "flex flex-col gap-8", children: [_jsx(Cell, { label: "Primary", children: _jsx(Slider, { ...args, type: "primary", defaultValue: 40 }) }), _jsx(Cell, { label: "Negative", children: _jsx(Slider, { ...args, type: "negative", defaultValue: 40 }) }), _jsx(Cell, { label: "Positive", children: _jsx(Slider, { ...args, type: "positive", defaultValue: 40 }) })] })),
};
export const Range = {
    args: { defaultValue: [25, 75] },
    render: (args) => (_jsxs("div", { className: "flex flex-col gap-8", children: [_jsx(Cell, { label: "Range \u00B7 Primary", children: _jsx(Slider, { ...args, type: "primary", defaultValue: [20, 60] }) }), _jsx(Cell, { label: "Range \u00B7 Negative", children: _jsx(Slider, { ...args, type: "negative", defaultValue: [10, 45] }) }), _jsx(Cell, { label: "Range \u00B7 Positive", children: _jsx(Slider, { ...args, type: "positive", defaultValue: [55, 90] }) })] })),
};
export const WithIcons = {
    args: { size: "md", defaultValue: 50 },
    render: (args) => (_jsxs("div", { className: "flex flex-col gap-8", children: [_jsx(Cell, { label: "Volume", children: _jsx(Slider, { ...args, startIcon: _jsx(Icon, { name: "minus", size: "sm" }), endIcon: _jsx(Icon, { name: "plus-small", size: "sm" }) }) }), _jsx(Cell, { label: "Brightness \u00B7 range", children: _jsx(Slider, { ...args, defaultValue: [20, 80], startIcon: _jsx(Icon, { name: "brightness", size: "sm" }), endIcon: _jsx(Icon, { name: "brightness", size: "sm" }) }) })] })),
};
export const WithLabel = {
    args: { showLabel: true },
    render: (args) => (_jsxs("div", { className: "flex flex-col gap-8", children: [_jsx(Cell, { label: "Single \u00B7 with read-out", children: _jsx(Slider, { ...args, defaultValue: 42 }) }), _jsx(Cell, { label: "Range \u00B7 with read-outs", children: _jsx(Slider, { ...args, defaultValue: [30, 70] }) })] })),
};
export const States = {
    render: (args) => (_jsxs("div", { className: "flex flex-col gap-8", children: [_jsx(Cell, { label: "Default", children: _jsx(Slider, { ...args, defaultValue: 40 }) }), _jsx(Cell, { label: "Disabled \u00B7 single", children: _jsx(Slider, { ...args, defaultValue: 40, disabled: true }) }), _jsx(Cell, { label: "Disabled \u00B7 range", children: _jsx(Slider, { ...args, defaultValue: [20, 60], disabled: true }) })] })),
};
export const Controlled = {
    render: () => {
        function Demo() {
            const [v, setV] = useState(35);
            return (_jsxs("div", { className: "flex flex-col gap-4 w-[340px]", children: [_jsx(Slider, { value: v, onValueChange: setV, showLabel: true, formatLabel: (n) => `${n}%`, "aria-label": "Opacity" }), _jsxs("div", { className: "text-t3 text-[var(--color-secondary-text-color)] font-mono", children: ["value: ", Array.isArray(v) ? `[${v[0]}, ${v[1]}]` : v] })] }));
        }
        return _jsx(Demo, {});
    },
};
export const CustomRange = {
    args: { min: 0, max: 1000, step: 50, defaultValue: 350 },
    render: (args) => (_jsx("div", { className: "w-[340px]", children: _jsx(Slider, { ...args, showLabel: true, formatLabel: (n) => `$${n}`, "aria-label": "Price" }) })),
};
export const Matrix = {
    render: () => (_jsx("div", { className: "flex flex-col gap-12", children: ["primary", "negative", "positive"].map((type) => (_jsxs("div", { className: "flex flex-col gap-5", children: [_jsxs("div", { className: "text-t3 text-[var(--color-secondary-text-color)] uppercase tracking-wide", children: ["Type \u00B7 ", type] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8", children: [_jsx(Cell, { label: "Single \u00B7 sm", children: _jsx(Slider, { type: type, size: "sm", defaultValue: 30 }) }), _jsx(Cell, { label: "Range \u00B7 sm", children: _jsx(Slider, { type: type, size: "sm", defaultValue: [20, 60] }) }), _jsx(Cell, { label: "Single \u00B7 md", children: _jsx(Slider, { type: type, size: "md", defaultValue: 50 }) }), _jsx(Cell, { label: "Range \u00B7 md", children: _jsx(Slider, { type: type, size: "md", defaultValue: [30, 70] }) }), _jsx(Cell, { label: "Single \u00B7 lg", children: _jsx(Slider, { type: type, size: "lg", defaultValue: 70 }) }), _jsx(Cell, { label: "Range \u00B7 lg", children: _jsx(Slider, { type: type, size: "lg", defaultValue: [40, 80] }) })] })] }, type))) })),
};
