import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { EditableText } from "./EditableText";
const VARIANTS = ["t1", "t2", "t3"];
const WEIGHTS = ["bold", "semibold", "regular"];
const meta = {
    title: "Components/EditableText",
    component: EditableText,
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component: 'Body-text input. Reads as inline copy until hover/focus, then reveals a 1px border (`color-border-ui` on hover, `color-primary` on focus). Enter commits and blurs; Escape reverts. Sourced from the TimeWorks Figma file (page "Editable text", component 46946:4612).',
            },
        },
    },
    tags: ["autodocs"],
    argTypes: {
        variant: { control: "radio", options: VARIANTS },
        weight: { control: "radio", options: WEIGHTS },
        disabled: { control: "boolean" },
        readOnly: { control: "boolean" },
        placeholder: { control: "text" },
    },
    args: {
        variant: "t1",
        weight: "bold",
        defaultValue: "Editable text component",
        placeholder: "Editable text component",
    },
    render: (args) => (_jsx("div", { className: "w-[420px]", children: _jsx(EditableText, { ...args }) })),
};
export default meta;
export const Playground = {};
export const Variants = {
    render: () => (_jsxs("div", { className: "flex flex-col gap-3 w-[420px]", children: [_jsx(EditableText, { variant: "t1", weight: "bold", defaultValue: "T1 \u00B7 Bold body text" }), _jsx(EditableText, { variant: "t2", weight: "bold", defaultValue: "T2 \u00B7 Bold body text" }), _jsx(EditableText, { variant: "t3", weight: "semibold", defaultValue: "T3 \u00B7 Semibold body text" })] })),
};
export const Weights = {
    name: "Weights (per Figma matrix)",
    render: () => (_jsxs("div", { className: "flex flex-col gap-8 w-[480px]", children: [_jsxs("div", { className: "flex flex-col gap-2", children: [_jsx("p", { className: "text-t3 text-[var(--color-secondary-text-color)] uppercase tracking-wide", children: "T1 \u00B7 16/22" }), _jsx(EditableText, { variant: "t1", weight: "bold", defaultValue: "T1 Bold" }), _jsx(EditableText, { variant: "t1", weight: "semibold", defaultValue: "T1 Medium" }), _jsx(EditableText, { variant: "t1", weight: "regular", defaultValue: "T1 Normal" })] }), _jsxs("div", { className: "flex flex-col gap-2", children: [_jsx("p", { className: "text-t3 text-[var(--color-secondary-text-color)] uppercase tracking-wide", children: "T2 \u00B7 14/20" }), _jsx(EditableText, { variant: "t2", weight: "bold", defaultValue: "T2 Bold" }), _jsx(EditableText, { variant: "t2", weight: "semibold", defaultValue: "T2 Medium" }), _jsx(EditableText, { variant: "t2", weight: "regular", defaultValue: "T2 Normal" })] }), _jsxs("div", { className: "flex flex-col gap-2", children: [_jsx("p", { className: "text-t3 text-[var(--color-secondary-text-color)] uppercase tracking-wide", children: "T3 \u00B7 12/16" }), _jsx(EditableText, { variant: "t3", weight: "semibold", defaultValue: "T3 Medium" }), _jsx(EditableText, { variant: "t3", weight: "regular", defaultValue: "T3 Normal" })] })] })),
};
export const States = {
    render: () => (_jsxs("div", { className: "flex flex-col gap-3 w-[420px]", children: [_jsx(EditableText, { variant: "t1", defaultValue: "Default \u2014 hover and focus me" }), _jsx(EditableText, { variant: "t1", defaultValue: "", placeholder: "Placeholder text" }), _jsx(EditableText, { variant: "t1", defaultValue: "Read-only text", readOnly: true }), _jsx(EditableText, { variant: "t1", defaultValue: "Disabled text", disabled: true })] })),
};
export const Controlled = {
    render: () => {
        const [value, setValue] = useState("Item name");
        const [committed, setCommitted] = useState(value);
        return (_jsxs("div", { className: "flex flex-col gap-3 w-[420px]", children: [_jsx(EditableText, { variant: "t1", weight: "semibold", value: value, onValueChange: setValue, onCommit: setCommitted }), _jsxs("p", { className: "text-t3 text-[var(--color-secondary-text-color)]", children: ["Live: ", _jsx("span", { className: "font-mono", children: JSON.stringify(value) })] }), _jsxs("p", { className: "text-t3 text-[var(--color-secondary-text-color)]", children: ["Last committed (Enter / blur):", " ", _jsx("span", { className: "font-mono", children: JSON.stringify(committed) })] })] }));
    },
};
