import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { TextArea } from "./TextArea";
const SIZES = ["sm", "lg"];
const STATES = ["default", "error", "positive", "disabled", "readOnly"];
const meta = {
    title: "Components/TextArea",
    component: TextArea,
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component: 'Multi-line text input with optional label, helper text, and character limit. Sourced from the TimeWorks Figma file (page "Text Area", node 46939:7917 / component set 46949:31916).',
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
        rows: { control: { type: "number", min: 2, max: 12, step: 1 } },
        required: { control: "boolean" },
        characterLimit: { control: "number" },
        noResize: { control: "boolean" },
    },
    args: {
        size: "lg",
        state: "default",
        label: "Label",
        placeholder: "Users can type here",
        helperText: "Information text",
        rows: 4,
    },
    render: (args) => (_jsx("div", { className: "w-[320px]", children: _jsx(TextArea, { ...args }) })),
};
export default meta;
export const Playground = {};
export const Sizes = {
    render: () => (_jsxs("div", { className: "flex flex-col gap-6 w-[320px]", children: [_jsx(TextArea, { size: "lg", label: "Large (16px)", helperText: "Information text" }), _jsx(TextArea, { size: "sm", label: "Small (14px)", helperText: "Information text" })] })),
};
export const States = {
    render: () => (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 w-[680px]", children: [_jsx(TextArea, { label: "Default", helperText: "Information text" }), _jsx(TextArea, { label: "Error", state: "error", helperText: "Something went wrong" }), _jsx(TextArea, { label: "Positive", state: "positive", helperText: "Looks good" }), _jsx(TextArea, { label: "Disabled", state: "disabled", helperText: "Information text" }), _jsx(TextArea, { label: "Read-only", state: "readOnly", helperText: "Information text", defaultValue: "This content cannot be edited." })] })),
};
export const LabelAndHelperToggles = {
    render: () => (_jsxs("div", { className: "grid grid-cols-2 gap-6 w-[680px]", children: [_jsx(TextArea, { label: "Label on, helper on", helperText: "Information text" }), _jsx(TextArea, { helperText: "Information text" }), _jsx(TextArea, { label: "Label on, helper off" }), _jsx(TextArea, {})] })),
};
export const RowCount = {
    render: () => (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 w-[680px]", children: [2, 3, 4, 5, 6].map((rows) => (_jsx(TextArea, { label: `${rows} rows`, rows: rows, helperText: `rows={${rows}}` }, rows))) })),
};
export const WithCharacterLimit = {
    render: () => {
        const [value, setValue] = useState("Type to see the counter update.");
        return (_jsx("div", { className: "w-[320px]", children: _jsx(TextArea, { label: "Bio", helperText: "Tell us about yourself", characterLimit: 200, value: value, onValueChange: setValue }) }));
    },
};
export const Required = {
    render: () => (_jsx("div", { className: "w-[320px]", children: _jsx(TextArea, { label: "Description", required: true, helperText: "This field is required" }) })),
};
export const Controlled = {
    render: () => {
        const [value, setValue] = useState("Hello world");
        return (_jsxs("div", { className: "flex flex-col gap-3 w-[320px]", children: [_jsx(TextArea, { label: "Notes", value: value, onValueChange: setValue, helperText: "Controlled value" }), _jsxs("p", { className: "text-t3 text-[var(--color-secondary-text-color)]", children: ["Value: ", _jsx("span", { className: "font-mono", children: JSON.stringify(value) })] })] }));
    },
};
