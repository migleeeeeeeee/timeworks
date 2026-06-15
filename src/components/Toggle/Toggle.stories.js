import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Toggle } from "./Toggle";
const meta = {
    title: "Components/Toggle",
    component: Toggle,
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component: 'Toggles let users turn a single option on or off, typically for activating or deactivating a setting. Sourced from the TimeWorks Figma file (page "Toggle", node 46949:40910). Built on @radix-ui/react-switch so keyboard, focus, and ARIA semantics come from Radix.',
            },
        },
    },
    tags: ["autodocs"],
    argTypes: {
        size: { control: "inline-radio", options: ["sm", "md"] },
        checked: { control: "boolean" },
        disabled: { control: "boolean" },
        labelOff: { control: "text" },
        labelOn: { control: "text" },
    },
    args: {
        size: "md",
        labelOff: "Off",
        labelOn: "On",
    },
};
export default meta;
export const Playground = {};
const Row = ({ children }) => (_jsx("div", { className: "flex flex-wrap items-center gap-6", children: children }));
const Col = ({ label, children }) => (_jsxs("div", { className: "flex flex-col gap-3", children: [_jsx("span", { className: "text-t3 text-[color:var(--color-secondary-text-color)] uppercase tracking-wide", children: label }), children] }));
export const States = {
    render: () => (_jsxs("div", { className: "flex flex-col gap-8", children: [_jsx(Col, { label: "Medium", children: _jsxs(Row, { children: [_jsx(Toggle, {}), _jsx(Toggle, { defaultChecked: true }), _jsx(Toggle, { disabled: true }), _jsx(Toggle, { defaultChecked: true, disabled: true })] }) }), _jsx(Col, { label: "Small", children: _jsxs(Row, { children: [_jsx(Toggle, { size: "sm" }), _jsx(Toggle, { size: "sm", defaultChecked: true }), _jsx(Toggle, { size: "sm", disabled: true }), _jsx(Toggle, { size: "sm", defaultChecked: true, disabled: true })] }) })] })),
};
export const WithoutLabels = {
    render: () => (_jsxs(Row, { children: [_jsx(Toggle, { labelOff: null, labelOn: null, "aria-label": "Off" }), _jsx(Toggle, { labelOff: null, labelOn: null, "aria-label": "On", defaultChecked: true }), _jsx(Toggle, { size: "sm", labelOff: null, labelOn: null, "aria-label": "Off small" }), _jsx(Toggle, { size: "sm", labelOff: null, labelOn: null, "aria-label": "On small", defaultChecked: true })] })),
};
export const SingleLabel = {
    render: () => (_jsxs("div", { className: "flex flex-col gap-4", children: [_jsx(Toggle, { labelOff: null, labelOn: "Email notifications", defaultChecked: true }), _jsx(Toggle, { labelOff: "Auto-save", labelOn: null, defaultChecked: true })] })),
};
export const Controlled = {
    render: function Controlled() {
        const [enabled, setEnabled] = useState(false);
        return (_jsxs("div", { className: "flex flex-col items-start gap-3", children: [_jsx(Toggle, { checked: enabled, onCheckedChange: setEnabled, labelOff: "Disabled", labelOn: "Enabled" }), _jsxs("span", { className: "text-t3 text-[color:var(--color-secondary-text-color)]", children: ["Current value: ", String(enabled)] })] }));
    },
};
