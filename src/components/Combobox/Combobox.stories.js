import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Combobox } from "./Combobox";
const OPTIONS = [
    { value: "1", label: "Option 1" },
    { value: "2", label: "Option 2" },
    { value: "3", label: "Option 3" },
    { value: "4", label: "Option 4" },
    { value: "5", label: "Option 5" },
    { value: "6", label: "Option 6" },
    { value: "7", label: "Option 7" },
    { value: "8", label: "Option 8" },
];
const meta = {
    title: "Components/Combobox",
    component: Combobox,
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component: 'Filterable list selector with an inline search field. Sourced from the TimeWorks Figma file (page "Combobox", node 46939:7890). Composes the existing Search and ListItem primitives — the surface owns size, elevation, and the optional bottom button.',
            },
        },
    },
    tags: ["autodocs"],
    argTypes: {
        size: { control: "radio", options: ["sm", "md", "lg"] },
        dialog: { control: "boolean" },
    },
    args: {
        size: "md",
        dialog: true,
        options: OPTIONS,
        searchPlaceholder: "Placeholder text here",
    },
};
export default meta;
export const Default = {};
export const WithBottomButton = {
    args: {
        button: { label: "Edit", icon: "pen" },
    },
};
export const Flat = {
    args: {
        dialog: false,
    },
    parameters: {
        backgrounds: { default: "light" },
    },
};
export const Sizes = {
    render: (args) => (_jsx("div", { className: "flex items-start gap-6", children: ["sm", "md", "lg"].map((size) => (_jsxs("div", { className: "flex flex-col gap-2", children: [_jsx("span", { className: "text-t3 text-[var(--color-secondary-text-color)] uppercase tracking-wide", children: size }), _jsx(Combobox, { ...args, size: size })] }, size))) })),
    args: {
        button: { label: "Edit", icon: "pen" },
    },
};
export const VariantMatrix = {
    render: (args) => (_jsxs("div", { className: "space-y-10", children: [_jsxs("div", { children: [_jsx("p", { className: "mb-3 text-t2 font-semibold text-[var(--color-secondary-text-color)]", children: "With button" }), _jsx("div", { className: "flex items-start gap-6", children: ["sm", "md", "lg"].map((size) => (_jsx(Combobox, { ...args, size: size, button: { label: "Edit", icon: "pen" } }, `btn-${size}`))) })] }), _jsxs("div", { children: [_jsx("p", { className: "mb-3 text-t2 font-semibold text-[var(--color-secondary-text-color)]", children: "No button" }), _jsx("div", { className: "flex items-start gap-6", children: ["sm", "md", "lg"].map((size) => (_jsx(Combobox, { ...args, size: size }, `no-${size}`))) })] })] })),
};
export const Controlled = {
    render: (args) => {
        const [value, setValue] = useState("3");
        return (_jsxs("div", { className: "space-y-3", children: [_jsxs("p", { className: "text-t2 text-[var(--color-secondary-text-color)]", children: ["Selected: ", _jsx("span", { className: "font-mono", children: value || "—" })] }), _jsx(Combobox, { ...args, value: value, onValueChange: setValue })] }));
    },
    args: {
        button: { label: "Edit", icon: "pen" },
    },
};
export const EmptyState = {
    args: {
        options: [],
        emptyState: "No matches found",
    },
};
