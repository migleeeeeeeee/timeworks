import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Checkbox } from "./Checkbox";
const meta = {
    title: "Components/Checkbox",
    component: Checkbox,
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component: 'Checkboxes let users select one or more items from a set. Sourced from the TimeWorks Figma file (page "Checkbox", node 46939:96347). Built on @radix-ui/react-checkbox so keyboard, focus, and indeterminate behavior come from Radix.',
            },
        },
    },
    tags: ["autodocs"],
    argTypes: {
        checked: { control: "select", options: [false, true, "indeterminate"] },
        disabled: { control: "boolean" },
        error: { control: "boolean" },
        children: { control: "text" },
    },
    args: {
        children: "Remember me",
    },
};
export default meta;
export const Playground = {};
const Row = ({ children }) => (_jsx("div", { className: "flex flex-wrap items-center gap-6", children: children }));
const Col = ({ label, children }) => (_jsxs("div", { className: "flex flex-col gap-2", children: [_jsx("span", { className: "text-t3 text-[color:var(--color-secondary-text-color)] uppercase tracking-wide", children: label }), children] }));
export const States = {
    render: () => (_jsxs("div", { className: "flex flex-col gap-6", children: [_jsx(Col, { label: "Unchecked", children: _jsxs(Row, { children: [_jsx(Checkbox, { children: "Regular" }), _jsx(Checkbox, { disabled: true, children: "Disabled" }), _jsx(Checkbox, { error: true, children: "Error" })] }) }), _jsx(Col, { label: "Checked", children: _jsxs(Row, { children: [_jsx(Checkbox, { defaultChecked: true, children: "Regular" }), _jsx(Checkbox, { checked: true, disabled: true, children: "Disabled" }), _jsx(Checkbox, { checked: true, error: true, children: "Error" })] }) }), _jsx(Col, { label: "Indeterminate", children: _jsxs(Row, { children: [_jsx(Checkbox, { checked: "indeterminate", children: "Regular" }), _jsx(Checkbox, { checked: "indeterminate", disabled: true, children: "Disabled" })] }) })] })),
};
export const WithoutLabel = {
    render: () => (_jsxs(Row, { children: [_jsx(Checkbox, { "aria-label": "Unchecked" }), _jsx(Checkbox, { "aria-label": "Checked", defaultChecked: true }), _jsx(Checkbox, { "aria-label": "Indeterminate", checked: "indeterminate" }), _jsx(Checkbox, { "aria-label": "Disabled", disabled: true }), _jsx(Checkbox, { "aria-label": "Error", error: true })] })),
};
export const Controlled = {
    render: () => {
        const [value, setValue] = useState("indeterminate");
        return (_jsxs("div", { className: "flex flex-col gap-3", children: [_jsxs(Checkbox, { checked: value, onCheckedChange: (v) => setValue(v), children: ["Tri-state (", String(value), ")"] }), _jsx("button", { type: "button", className: "text-t3 text-[var(--color-link-color)] underline self-start", onClick: () => setValue("indeterminate"), children: "Reset to indeterminate" })] }));
    },
};
