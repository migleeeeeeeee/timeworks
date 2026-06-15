import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { ButtonGroup, ButtonGroupItem } from "./ButtonGroup";
const meta = {
    title: "Components/ButtonGroup",
    component: ButtonGroup,
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component: 'Segmented selector for picking a single value from a small set of related options. Sourced from the TimeWorks Figma file (page "Button Group", node 46939:7887). Use sparingly — limit to 2–5 options that are mutually exclusive and roughly equal in length.',
            },
        },
    },
    tags: ["autodocs"],
    argTypes: {
        variant: { control: "select", options: ["default", "tertiary"] },
        size: { control: "select", options: ["sm", "md", "lg"] },
        disabled: { control: "boolean" },
    },
    args: {
        variant: "default",
        size: "md",
        disabled: false,
    },
};
export default meta;
const ITEMS = ["Day", "Week", "Month", "Quarter", "Year"];
const Col = ({ label, children }) => (_jsxs("div", { className: "flex flex-col gap-2", children: [_jsx("span", { className: "text-t3 text-[color:var(--color-secondary-text-color)] uppercase tracking-wide", children: label }), children] }));
export const Playground = {
    render: (args) => (_jsx(ButtonGroup, { ...args, "aria-label": "Time range", defaultValue: "Week", children: ITEMS.map((v) => (_jsx(ButtonGroupItem, { value: v, children: v }, v))) })),
};
export const Variants = {
    render: () => (_jsxs("div", { className: "flex flex-col gap-6", children: [_jsx(Col, { label: "Default", children: _jsx(ButtonGroup, { "aria-label": "Default variant", defaultValue: "Day", children: ITEMS.map((v) => (_jsx(ButtonGroupItem, { value: v, children: v }, v))) }) }), _jsx(Col, { label: "Tertiary", children: _jsx(ButtonGroup, { variant: "tertiary", "aria-label": "Tertiary variant", defaultValue: "Day", children: ITEMS.map((v) => (_jsx(ButtonGroupItem, { value: v, children: v }, v))) }) })] })),
};
export const Sizes = {
    render: () => (_jsx("div", { className: "flex flex-col gap-6", children: ["sm", "md", "lg"].map((size) => (_jsx(Col, { label: size, children: _jsx(ButtonGroup, { size: size, "aria-label": `Size ${size}`, defaultValue: "Day", children: ITEMS.map((v) => (_jsx(ButtonGroupItem, { value: v, children: v }, v))) }) }, size))) })),
};
export const States = {
    render: () => (_jsxs("div", { className: "flex flex-col gap-6", children: [_jsx(Col, { label: "Disabled (group)", children: _jsx(ButtonGroup, { disabled: true, "aria-label": "Disabled group", defaultValue: "Day", children: ITEMS.map((v) => (_jsx(ButtonGroupItem, { value: v, children: v }, v))) }) }), _jsx(Col, { label: "Disabled (single item)", children: _jsxs(ButtonGroup, { "aria-label": "Single disabled", defaultValue: "Day", children: [_jsx(ButtonGroupItem, { value: "Day", children: "Day" }), _jsx(ButtonGroupItem, { value: "Week", disabled: true, children: "Week" }), _jsx(ButtonGroupItem, { value: "Month", children: "Month" })] }) })] })),
};
export const Controlled = {
    render: () => {
        function ControlledExample() {
            const [value, setValue] = useState("Week");
            return (_jsxs("div", { className: "flex flex-col gap-3", children: [_jsx(ButtonGroup, { value: value, onValueChange: setValue, "aria-label": "Range", children: ITEMS.map((v) => (_jsx(ButtonGroupItem, { value: v, children: v }, v))) }), _jsxs("span", { className: "text-t2 text-[color:var(--color-secondary-text-color)]", children: ["Selected: ", _jsx("span", { className: "font-mono", children: value })] })] }));
        }
        return _jsx(ControlledExample, {});
    },
};
