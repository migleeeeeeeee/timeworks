import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { EditableHeading } from "./EditableHeading";
const VARIANTS = ["h1", "h2", "h3"];
const WEIGHTS = ["bold", "semibold", "medium", "regular", "light"];
const meta = {
    title: "Components/EditableHeading",
    component: EditableHeading,
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component: 'Heading-styled text input. Reads as a heading until hover/focus, then reveals a 1px border (`color-border-ui` on hover, `color-primary` on focus). Enter commits and blurs; Escape reverts. Sourced from the TimeWorks Figma file (page "Editable heading", component 46946:4387).',
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
        variant: "h1",
        weight: "bold",
        defaultValue: "Editable heading component",
        placeholder: "Editable heading",
    },
    render: (args) => (_jsx("div", { className: "w-[480px]", children: _jsx(EditableHeading, { ...args }) })),
};
export default meta;
export const Playground = {};
export const Variants = {
    render: () => (_jsxs("div", { className: "flex flex-col gap-3 w-[480px]", children: [_jsx(EditableHeading, { variant: "h1", weight: "bold", defaultValue: "H1 \u00B7 Bold heading" }), _jsx(EditableHeading, { variant: "h2", weight: "bold", defaultValue: "H2 \u00B7 Bold heading" }), _jsx(EditableHeading, { variant: "h3", weight: "bold", defaultValue: "H3 \u00B7 Bold heading" })] })),
};
export const Weights = {
    name: "Weights (per Figma matrix)",
    render: () => (_jsxs("div", { className: "flex flex-col gap-8 w-[520px]", children: [_jsxs("div", { className: "flex flex-col gap-2", children: [_jsx("p", { className: "text-t3 text-[var(--color-secondary-text-color)] uppercase tracking-wide", children: "H1" }), _jsx(EditableHeading, { variant: "h1", weight: "bold", defaultValue: "H1 Bold" }), _jsx(EditableHeading, { variant: "h1", weight: "semibold", defaultValue: "H1 Medium" }), _jsx(EditableHeading, { variant: "h1", weight: "medium", defaultValue: "H1 Normal" }), _jsx(EditableHeading, { variant: "h1", weight: "regular", defaultValue: "H1 Light" })] }), _jsxs("div", { className: "flex flex-col gap-2", children: [_jsx("p", { className: "text-t3 text-[var(--color-secondary-text-color)] uppercase tracking-wide", children: "H2" }), _jsx(EditableHeading, { variant: "h2", weight: "bold", defaultValue: "H2 Bold" }), _jsx(EditableHeading, { variant: "h2", weight: "semibold", defaultValue: "H2 Medium" }), _jsx(EditableHeading, { variant: "h2", weight: "medium", defaultValue: "H2 Normal" }), _jsx(EditableHeading, { variant: "h2", weight: "light", defaultValue: "H2 Light" })] }), _jsxs("div", { className: "flex flex-col gap-2", children: [_jsx("p", { className: "text-t3 text-[var(--color-secondary-text-color)] uppercase tracking-wide", children: "H3" }), _jsx(EditableHeading, { variant: "h3", weight: "bold", defaultValue: "H3 Bold" }), _jsx(EditableHeading, { variant: "h3", weight: "semibold", defaultValue: "H3 Medium" }), _jsx(EditableHeading, { variant: "h3", weight: "medium", defaultValue: "H3 Normal" }), _jsx(EditableHeading, { variant: "h3", weight: "light", defaultValue: "H3 Light" })] })] })),
};
export const States = {
    render: () => (_jsxs("div", { className: "flex flex-col gap-3 w-[480px]", children: [_jsx(EditableHeading, { variant: "h2", defaultValue: "Default \u2014 hover and focus me" }), _jsx(EditableHeading, { variant: "h2", defaultValue: "", placeholder: "Placeholder text" }), _jsx(EditableHeading, { variant: "h2", defaultValue: "Read-only heading", readOnly: true }), _jsx(EditableHeading, { variant: "h2", defaultValue: "Disabled heading", disabled: true })] })),
};
export const Controlled = {
    render: () => {
        const [value, setValue] = useState("Project Atlas");
        const [committed, setCommitted] = useState(value);
        return (_jsxs("div", { className: "flex flex-col gap-3 w-[480px]", children: [_jsx(EditableHeading, { variant: "h1", value: value, onValueChange: setValue, onCommit: setCommitted }), _jsxs("p", { className: "text-t3 text-[var(--color-secondary-text-color)]", children: ["Live: ", _jsx("span", { className: "font-mono", children: JSON.stringify(value) })] }), _jsxs("p", { className: "text-t3 text-[var(--color-secondary-text-color)]", children: ["Last committed (Enter / blur):", " ", _jsx("span", { className: "font-mono", children: JSON.stringify(committed) })] })] }));
    },
};
