import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { MultiStepIndicator, } from "./MultiStepIndicator";
const SAMPLE_STEPS = [
    { title: "Step title", subtitle: "Everything you can do here" },
    { title: "Step title", subtitle: "Everything you can do here" },
    { title: "Step title", subtitle: "Everything you can do here" },
    { title: "Step title", subtitle: "Everything you can do here" },
    { title: "Step title", subtitle: "Everything you can do here" },
];
const meta = {
    title: "Components/MultiStepIndicator",
    component: MultiStepIndicator,
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component: 'Wizard-style step indicator. Sourced from the TimeWorks Figma file (page "Multi Step Indicator (Wizard)", node 46947:3287). Renders fulfilled / active / pending states from a `current` index, with `type` colouring the active+fulfilled discs. Two sizes (regular 48px, compact 24px) and two text placements (below the indicator, or inline beside it).',
            },
        },
    },
    tags: ["autodocs"],
    argTypes: {
        current: { control: { type: "range", min: 0, max: 4, step: 1 } },
        type: { control: "radio", options: ["primary", "success", "dark", "danger"] },
        size: { control: "radio", options: ["regular", "compact"] },
        textPlacement: { control: "radio", options: ["below", "inline"] },
    },
    args: {
        steps: SAMPLE_STEPS,
        current: 0,
        type: "primary",
        size: "regular",
        textPlacement: "below",
    },
};
export default meta;
const Cell = ({ label, children }) => (_jsxs("div", { className: "flex flex-col gap-3", children: [_jsx("span", { className: "text-t3 text-[var(--color-secondary-text-color)] uppercase tracking-wide", children: label }), children] }));
export const Playground = {};
export const Types = {
    render: (args) => (_jsx("div", { className: "flex flex-col gap-10", children: ["primary", "success", "dark", "danger"].map((type) => (_jsx(Cell, { label: type, children: _jsx(MultiStepIndicator, { ...args, type: type, current: 1 }) }, type))) })),
};
export const Sizes = {
    render: (args) => (_jsxs("div", { className: "flex flex-col gap-10", children: [_jsx(Cell, { label: "Regular \u00B7 text below", children: _jsx(MultiStepIndicator, { ...args, size: "regular", textPlacement: "below", current: 1 }) }), _jsx(Cell, { label: "Regular \u00B7 text inline", children: _jsx(MultiStepIndicator, { ...args, size: "regular", textPlacement: "inline", current: 1, steps: SAMPLE_STEPS.map((s) => ({ title: s.title })) }) }), _jsx(Cell, { label: "Compact \u00B7 inline title", children: _jsx(MultiStepIndicator, { ...args, size: "compact", textPlacement: "inline", current: 1, steps: SAMPLE_STEPS.map((s) => ({ title: s.title })) }) })] })),
};
export const States = {
    render: (args) => (_jsx("div", { className: "flex flex-col gap-10", children: [0, 2, 4].map((current) => (_jsx(Cell, { label: `current = ${current}`, children: _jsx(MultiStepIndicator, { ...args, current: current }) }, current))) })),
};
export const Interactive = {
    render: (args) => {
        const [current, setCurrent] = useState(1);
        return (_jsxs("div", { className: "flex flex-col gap-4", children: [_jsx(MultiStepIndicator, { ...args, current: current, onStepClick: setCurrent, textPlacement: "inline", steps: SAMPLE_STEPS.map((s) => ({ title: s.title })) }), _jsx("span", { className: "text-t3 text-[var(--color-secondary-text-color)]", children: "Click a step number to jump to it." })] }));
    },
};
export const Matrix = {
    render: () => {
        const types = ["primary", "success", "dark", "danger"];
        const compactSteps = SAMPLE_STEPS.map((s) => ({ title: s.title }));
        return (_jsx("div", { className: "flex flex-col gap-12", children: types.map((type) => (_jsxs("div", { className: "flex flex-col gap-6", children: [_jsxs("div", { className: "text-t3 text-[var(--color-secondary-text-color)] uppercase tracking-wide", children: ["Type \u00B7 ", type] }), _jsx(Cell, { label: "Regular \u00B7 below", children: _jsx(MultiStepIndicator, { type: type, current: 1, steps: SAMPLE_STEPS }) }), _jsx(Cell, { label: "Regular \u00B7 inline", children: _jsx(MultiStepIndicator, { type: type, current: 1, textPlacement: "inline", steps: compactSteps }) }), _jsx(Cell, { label: "Compact \u00B7 inline", children: _jsx(MultiStepIndicator, { type: type, current: 1, size: "compact", textPlacement: "inline", steps: compactSteps }) })] }, type))) }));
    },
};
