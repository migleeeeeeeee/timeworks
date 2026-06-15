import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Steps } from "./Steps";
const meta = {
    title: "Components/Steps",
    component: Steps,
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component: 'Compact step / pagination indicator. Sourced from the TimeWorks Figma file (page "Steps", node 46949:9199). Three layout types — `gallery` (Back · dots · Next), `numbers` (Back · "X / Y" · Next), and `gallery-only` (just dots) — and two `onColor` palettes for use on white surfaces or on the brand-colour primary background.',
            },
        },
    },
    tags: ["autodocs"],
    argTypes: {
        count: { control: { type: "range", min: 2, max: 7, step: 1 } },
        value: { control: { type: "number", min: 0, max: 6, step: 1 } },
        type: { control: "radio", options: ["gallery", "numbers", "gallery-only"] },
        onColor: { control: "radio", options: ["white", "primary"] },
        backLabel: { control: "text" },
        nextLabel: { control: "text" },
    },
    args: {
        count: 5,
        defaultValue: 1,
        type: "gallery",
        onColor: "white",
    },
};
export default meta;
const Cell = ({ label, children, onColor }) => (_jsxs("div", { className: "flex flex-col gap-3", children: [_jsx("span", { className: "text-t3 text-[var(--color-secondary-text-color)] uppercase tracking-wide", children: label }), _jsx("div", { className: onColor === "primary"
                ? "rounded-md bg-[var(--color-primary-color)] p-6"
                : "rounded-md bg-[var(--color-primary-background-color)] p-6 border border-[var(--color-layout-border-color)]", children: children })] }));
export const Playground = {};
export const Types = {
    render: (args) => (_jsx("div", { className: "flex flex-col gap-8", children: ["gallery", "numbers", "gallery-only"].map((t) => (_jsx(Cell, { label: t, children: _jsx(Steps, { ...args, type: t }) }, t))) })),
};
export const OnColor = {
    render: (args) => {
        const types = ["gallery", "numbers", "gallery-only"];
        return (_jsx("div", { className: "grid gap-8 md:grid-cols-2", children: ["white", "primary"].map((onColor) => (_jsxs("div", { className: "flex flex-col gap-6", children: [_jsxs("span", { className: "text-t3 text-[var(--color-secondary-text-color)] uppercase tracking-wide", children: ["On ", onColor] }), _jsx("div", { className: onColor === "primary"
                            ? "flex flex-col gap-6 rounded-md bg-[var(--color-primary-color)] p-6"
                            : "flex flex-col gap-6 rounded-md bg-[var(--color-primary-background-color)] p-6 border border-[var(--color-layout-border-color)]", children: types.map((t) => (_jsx(Steps, { ...args, type: t, onColor: onColor }, t))) })] }, onColor))) }));
    },
};
export const Counts = {
    render: (args) => (_jsx("div", { className: "flex flex-col gap-6", children: [2, 3, 4, 5, 6, 7].map((c) => (_jsx(Cell, { label: `count = ${c}`, children: _jsx(Steps, { ...args, count: c, defaultValue: Math.min(1, c - 1) }) }, c))) })),
};
export const ProgressRange = {
    render: (args) => (_jsx("div", { className: "flex flex-col gap-4", children: Array.from({ length: 5 }, (_, i) => (_jsx(Steps, { ...args, count: 5, value: i }, i))) })),
};
export const DarkSurface = {
    render: (args) => (_jsxs("div", { className: "flex flex-col gap-6 rounded-md bg-[var(--color-inverted-color-background)] p-6", children: [_jsx(Steps, { ...args, type: "gallery", onColor: "primary" }), _jsx(Steps, { ...args, type: "numbers", onColor: "primary" }), _jsx(Steps, { ...args, type: "gallery-only", onColor: "primary" })] })),
};
export const Interactive = {
    render: (args) => {
        const [value, setValue] = useState(0);
        return (_jsxs("div", { className: "flex flex-col gap-3", children: [_jsx(Steps, { ...args, value: value, onValueChange: setValue }), _jsxs("span", { className: "text-t3 text-[var(--color-secondary-text-color)]", children: ["Page ", value + 1, " of ", args.count ?? 5] })] }));
    },
};
