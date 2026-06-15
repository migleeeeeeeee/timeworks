import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { DatePicker } from "./DatePicker";
const meta = {
    title: "Components/DatePicker",
    component: DatePicker,
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component: 'Calendar surface for picking a single date, a date range, or just displaying a month. Sourced from the TimeWorks Figma file (page "Date Picker", node 46939:7892; component set 46939:100511). Wraps a custom Mon-first calendar grid with an optional white dialog surface, two-month layout, and dark / black theme treatments.',
            },
        },
    },
    tags: ["autodocs"],
    argTypes: {
        mode: { control: "radio", options: ["default", "single", "range"] },
        numberOfMonths: { control: "radio", options: [1, 2] },
        withDialog: { control: "boolean" },
        theme: { control: "radio", options: ["light", "dark", "black"] },
    },
    args: {
        mode: "single",
        numberOfMonths: 1,
        withDialog: true,
        theme: "light",
        defaultMonth: new Date(2023, 4, 1), // May 2023 — matches Figma sample
        defaultValue: new Date(2023, 4, 12),
    },
};
export default meta;
export const Default = {
    args: { mode: "default", defaultValue: undefined },
};
export const SingleDate = {};
export const DateRange = {
    args: {
        mode: "range",
        defaultValue: { from: new Date(2023, 4, 9), to: new Date(2023, 4, 23) },
    },
};
export const TwoMonths = {
    args: {
        mode: "range",
        numberOfMonths: 2,
        defaultValue: { from: new Date(2023, 4, 9), to: new Date(2023, 5, 12) },
    },
};
export const WithoutDialog = {
    args: { withDialog: false },
    parameters: {
        backgrounds: { default: "light" },
    },
};
export const DarkTheme = {
    args: { theme: "dark" },
};
export const BlackTheme = {
    args: { theme: "black" },
};
export const VariantMatrix = {
    render: (args) => (_jsxs("div", { className: "space-y-10 p-8 bg-[var(--color-allgrey-background-color)]", children: [_jsxs("div", { children: [_jsx("p", { className: "mb-3 text-t2 font-semibold text-[var(--color-secondary-text-color)]", children: "Type \u00B7 default \u00B7 single \u00B7 range" }), _jsxs("div", { className: "flex flex-wrap items-start gap-6", children: [_jsx(DatePicker, { ...args, mode: "default", defaultValue: undefined }), _jsx(DatePicker, { ...args, mode: "single", defaultValue: new Date(2023, 4, 12) }), _jsx(DatePicker, { ...args, mode: "range", defaultValue: { from: new Date(2023, 4, 9), to: new Date(2023, 4, 23) } })] })] }), _jsxs("div", { children: [_jsx("p", { className: "mb-3 text-t2 font-semibold text-[var(--color-secondary-text-color)]", children: "Two months" }), _jsx(DatePicker, { ...args, mode: "range", numberOfMonths: 2, defaultValue: { from: new Date(2023, 4, 9), to: new Date(2023, 5, 12) } })] }), _jsxs("div", { children: [_jsx("p", { className: "mb-3 text-t2 font-semibold text-[var(--color-secondary-text-color)]", children: "Without dialog \u00B7 dark \u00B7 black" }), _jsxs("div", { className: "flex flex-wrap items-start gap-6", children: [_jsx(DatePicker, { ...args, withDialog: false }), _jsx(DatePicker, { ...args, theme: "dark" }), _jsx(DatePicker, { ...args, theme: "black" })] })] })] })),
};
export const Controlled = {
    render: (args) => {
        const [value, setValue] = useState(args.defaultValue ?? null);
        const label = (() => {
            if (!value)
                return "—";
            if (value instanceof Date)
                return value.toDateString();
            const r = value;
            const from = r.from ? r.from.toDateString() : "—";
            const to = r.to ? r.to.toDateString() : "—";
            return `${from} → ${to}`;
        })();
        return (_jsxs("div", { className: "space-y-3", children: [_jsxs("p", { className: "text-t2 text-[var(--color-secondary-text-color)]", children: ["Selected: ", _jsx("span", { className: "font-mono", children: label })] }), _jsx(DatePicker, { ...args, value: value, onValueChange: setValue })] }));
    },
};
export const Playground = {};
