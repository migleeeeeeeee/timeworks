import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Radio, RadioGroup } from "./RadioGroup";
const meta = {
    title: "Components/RadioGroup",
    component: RadioGroup,
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component: 'A radio represents an item in a single selection list. Sourced from the TimeWorks Figma file (page "Radio Button", node 46947:8991). Built on @radix-ui/react-radio-group so keyboard, focus, and roving tabindex behavior come from Radix.',
            },
        },
    },
    tags: ["autodocs"],
    argTypes: {
        orientation: { control: "inline-radio", options: ["vertical", "horizontal"] },
        disabled: { control: "boolean" },
        error: { control: "boolean" },
        helperText: { control: "text" },
    },
    args: {
        "aria-label": "Workspace",
        defaultValue: "work-management",
    },
};
export default meta;
const OPTIONS = [
    { value: "work-management", label: "Work management" },
    { value: "workforms", label: "WorkForms" },
    { value: "marketer", label: "Marketer" },
    { value: "projects", label: "Projects" },
    { value: "dev", label: "Dev" },
    { value: "sales-crm", label: "Sales CRM" },
];
export const Playground = {
    render: (args) => (_jsx(RadioGroup, { ...args, children: OPTIONS.map((opt) => (_jsx(Radio, { value: opt.value, children: opt.label }, opt.value))) })),
};
const Section = ({ label, children }) => (_jsxs("div", { className: "flex flex-col gap-2", children: [_jsx("span", { className: "text-t3 text-[color:var(--color-secondary-text-color)] uppercase tracking-wide", children: label }), children] }));
export const Vertical = {
    render: () => (_jsx(RadioGroup, { defaultValue: "work-management", "aria-label": "Workspace (vertical)", children: OPTIONS.slice(0, 4).map((opt) => (_jsx(Radio, { value: opt.value, children: opt.label }, opt.value))) })),
};
export const Horizontal = {
    render: () => (_jsxs(RadioGroup, { orientation: "horizontal", defaultValue: "day", "aria-label": "View (horizontal)", children: [_jsx(Radio, { value: "day", children: "Day" }), _jsx(Radio, { value: "week", children: "Week" }), _jsx(Radio, { value: "month", children: "Month" }), _jsx(Radio, { value: "year", children: "Year" })] })),
};
export const States = {
    render: () => (_jsxs("div", { className: "flex flex-col gap-8", children: [_jsx(Section, { label: "Default \u00B7 unselected & selected", children: _jsxs(RadioGroup, { defaultValue: "b", "aria-label": "default", children: [_jsx(Radio, { value: "a", children: "Unselected" }), _jsx(Radio, { value: "b", children: "Selected" })] }) }), _jsx(Section, { label: "Disabled", children: _jsxs(RadioGroup, { defaultValue: "b", disabled: true, "aria-label": "disabled", children: [_jsx(Radio, { value: "a", children: "Disabled unselected" }), _jsx(Radio, { value: "b", children: "Disabled selected" })] }) }), _jsx(Section, { label: "Error", children: _jsxs(RadioGroup, { error: true, "aria-label": "error", helperText: "Please pick one of the options", children: [_jsx(Radio, { value: "a", children: "Unselected" }), _jsx(Radio, { value: "b", children: "Selected" })] }) })] })),
};
export const WithoutLabels = {
    render: () => (_jsxs(RadioGroup, { defaultValue: "b", orientation: "horizontal", "aria-label": "box only", children: [_jsx(Radio, { value: "a", "aria-label": "Option A" }), _jsx(Radio, { value: "b", "aria-label": "Option B" }), _jsx(Radio, { value: "c", "aria-label": "Option C", disabled: true }), _jsx(Radio, { value: "d", "aria-label": "Option D" })] })),
};
export const WithHelperText = {
    render: () => (_jsxs(RadioGroup, { defaultValue: "email", "aria-label": "Notifications", helperText: "You can change this anytime in settings.", children: [_jsx(Radio, { value: "email", children: "Email" }), _jsx(Radio, { value: "sms", children: "SMS" }), _jsx(Radio, { value: "none", children: "None" })] })),
};
export const Controlled = {
    render: () => {
        const [value, setValue] = useState("work-management");
        return (_jsxs("div", { className: "flex flex-col gap-3", children: [_jsx(RadioGroup, { value: value, onValueChange: setValue, "aria-label": "Workspace", children: OPTIONS.slice(0, 4).map((opt) => (_jsx(Radio, { value: opt.value, children: opt.label }, opt.value))) }), _jsxs("span", { className: "text-t3 text-[var(--color-secondary-text-color)]", children: ["value: ", _jsx("code", { children: value })] })] }));
    },
};
