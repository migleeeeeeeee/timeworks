import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Dropdown } from "./Dropdown";
const OPTIONS = [
    { value: "1", label: "Option 1" },
    { value: "2", label: "Option 2" },
    { value: "3", label: "Option 3" },
    { value: "4", label: "Option 4" },
];
const meta = {
    title: "Components/Dropdown",
    component: Dropdown,
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component: 'Dropdowns present a list of options from which a user can select one option, or several. Sourced from the TimeWorks Figma file (page "Dropdown", node 46946:1926). Three sizes (sm/md/lg), states (default / error / disabled / read-only), and three types: single-select, multi-select with chips on a single row, and multi-select with chips that wrap to multiple lines.',
            },
        },
    },
    tags: ["autodocs"],
    argTypes: {
        size: { control: "radio", options: ["sm", "md", "lg"] },
        error: { control: "boolean" },
        disabled: { control: "boolean" },
        readOnly: { control: "boolean" },
        multiSelect: { control: "boolean" },
        multiLine: { control: "boolean" },
    },
    args: {
        options: OPTIONS,
        placeholder: "Placeholder text here",
        size: "lg",
    },
    decorators: [
        (Story) => (_jsx("div", { style: { width: 304, minHeight: 320 }, children: _jsx(Story, {}) })),
    ],
};
export default meta;
export const Default = {};
export const Sizes = {
    render: (args) => (_jsx("div", { className: "flex flex-col gap-4 w-[304px]", children: ["sm", "md", "lg"].map((size) => (_jsxs("div", { className: "flex flex-col gap-1", children: [_jsx("span", { className: "text-t3 text-[var(--color-secondary-text-color)] uppercase tracking-wide", children: size }), _jsx(Dropdown, { ...args, size: size })] }, size))) })),
};
export const Selected = {
    args: {
        defaultValue: "2",
    },
};
export const Error = {
    args: {
        error: true,
    },
};
export const Disabled = {
    args: {
        disabled: true,
    },
};
export const ReadOnly = {
    args: {
        readOnly: true,
        defaultValue: "2",
    },
};
export const Open = {
    args: {
        defaultOpen: true,
    },
};
export const NoResults = {
    args: {
        defaultOpen: true,
        options: [],
    },
};
export const MultiSelectChips = {
    args: {
        multiSelect: true,
        defaultValue: ["1", "2"],
    },
};
export const MultiSelectMultiline = {
    args: {
        multiSelect: true,
        multiLine: true,
        defaultValue: ["1", "2", "3", "4"],
    },
};
export const Controlled = {
    render: () => {
        const [value, setValue] = useState("");
        return (_jsxs("div", { className: "flex flex-col gap-3", children: [_jsx(Dropdown, { options: OPTIONS, placeholder: "Placeholder text here", size: "lg", value: value, onValueChange: setValue }), _jsxs("div", { className: "text-t3 text-[var(--color-secondary-text-color)]", children: ["Selected: ", _jsx("code", { children: value || "—" })] })] }));
    },
};
export const Playground = {
    args: {
        size: "lg",
    },
};
