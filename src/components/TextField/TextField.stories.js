import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { TextField } from "./TextField";
import { IconButton } from "../IconButton";
const SIZES = ["sm", "md", "lg"];
const STATES = ["default", "error", "disabled", "readOnly"];
const meta = {
    title: "Components/TextField",
    component: TextField,
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component: 'Single-line text input with optional label, leading icon, trailing slot, helper text, and character limit. Sourced from the TimeWorks Figma file (page "Text Field", node 46939:7918 / component set 46949:33152).',
            },
        },
    },
    tags: ["autodocs"],
    argTypes: {
        size: { control: "radio", options: SIZES },
        state: { control: "radio", options: STATES },
        label: { control: "text" },
        helperText: { control: "text" },
        placeholder: { control: "text" },
        required: { control: "boolean" },
        characterLimit: { control: "number" },
        leadingIcon: { control: "text" },
    },
    args: {
        size: "md",
        state: "default",
        label: "Label",
        placeholder: "Placeholder text here",
        helperText: "Information text",
    },
    render: (args) => (_jsx("div", { className: "w-[300px]", children: _jsx(TextField, { ...args }) })),
};
export default meta;
export const Playground = {};
export const Sizes = {
    render: () => (_jsxs("div", { className: "flex flex-col gap-6 w-[300px]", children: [_jsx(TextField, { size: "lg", label: "Large (48)", helperText: "Information text" }), _jsx(TextField, { size: "md", label: "Medium (40)", helperText: "Information text" }), _jsx(TextField, { size: "sm", label: "Small (32)", helperText: "Information text" })] })),
};
export const States = {
    render: () => (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 w-[680px]", children: [_jsx(TextField, { label: "Default", helperText: "Information text" }), _jsx(TextField, { label: "Error", state: "error", helperText: "Something went wrong" }), _jsx(TextField, { label: "Disabled", state: "disabled", helperText: "Information text" }), _jsx(TextField, { label: "Read-only", state: "readOnly", helperText: "Information text", defaultValue: "This value cannot be edited" })] })),
};
export const LabelAndHelperToggles = {
    render: () => (_jsxs("div", { className: "grid grid-cols-2 gap-6 w-[680px]", children: [_jsx(TextField, { label: "Label on, helper on", helperText: "Information text" }), _jsx(TextField, { helperText: "Information text" }), _jsx(TextField, { label: "Label on, helper off" }), _jsx(TextField, {})] })),
};
export const WithLeadingIcon = {
    render: () => (_jsxs("div", { className: "flex flex-col gap-6 w-[300px]", children: [_jsx(TextField, { size: "lg", label: "Search", leadingIcon: "magnifying-glass", placeholder: "Find a project" }), _jsx(TextField, { size: "md", leadingIcon: "magnifying-glass", placeholder: "Find a project" }), _jsx(TextField, { size: "sm", leadingIcon: "magnifying-glass", placeholder: "Find a project" })] })),
};
export const WithTrailingSlot = {
    render: () => (_jsxs("div", { className: "flex flex-col gap-6 w-[300px]", children: [_jsx(TextField, { label: "With icon button", helperText: "Trailing slot accepts any node", trailing: _jsx(IconButton, { kind: "tertiary", size: "sm", icon: "hexagon-image", "aria-label": "Pick image" }) }), _jsx(TextField, { size: "sm", trailing: _jsx(IconButton, { kind: "tertiary", size: "xs", icon: "hexagon-image", "aria-label": "Pick image" }) })] })),
};
export const WithCharacterLimit = {
    render: () => {
        const [value, setValue] = useState("Type to see the counter update.");
        return (_jsx("div", { className: "w-[300px]", children: _jsx(TextField, { label: "Title", helperText: "Keep it short", characterLimit: 50, value: value, onValueChange: setValue }) }));
    },
};
export const Required = {
    render: () => (_jsx("div", { className: "w-[300px]", children: _jsx(TextField, { label: "Email", required: true, type: "email", placeholder: "you@company.com", helperText: "This field is required" }) })),
};
export const Controlled = {
    render: () => {
        const [value, setValue] = useState("Hello world");
        return (_jsxs("div", { className: "flex flex-col gap-3 w-[300px]", children: [_jsx(TextField, { label: "Name", value: value, onValueChange: setValue, helperText: "Controlled value" }), _jsxs("p", { className: "text-t3 text-[var(--color-secondary-text-color)]", children: ["Value: ", _jsx("span", { className: "font-mono", children: JSON.stringify(value) })] })] }));
    },
};
export const Matrix = {
    parameters: { layout: "padded" },
    render: () => (_jsx("div", { className: "space-y-8", children: SIZES.map((size) => (_jsxs("div", { className: "space-y-3", children: [_jsx("p", { className: "text-t3 uppercase tracking-wide text-[var(--color-secondary-text-color)]", children: size }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-[1280px]", children: STATES.map((state) => (_jsx(TextField, { size: size, state: state, label: state, helperText: "Information text", defaultValue: state === "readOnly" ? "Read-only value" : undefined }, state))) })] }, size))) })),
};
