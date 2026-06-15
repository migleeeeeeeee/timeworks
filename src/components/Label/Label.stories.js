import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Label } from "./Label";
const COLORS = ["primary", "positive", "negative", "dark"];
const meta = {
    title: "Components/Label",
    component: Label,
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component: 'A non-clickable status pill placed next to the item it classifies. Sourced from the TimeWorks Figma file (page "Label", node 46939:7900). Two sizes × two kinds (fill, line) × four colors.',
            },
        },
    },
    tags: ["autodocs"],
    argTypes: {
        size: { control: "radio", options: ["md", "sm"] },
        kind: { control: "radio", options: ["fill", "line"] },
        color: { control: "select", options: COLORS },
    },
    args: {
        children: "Label",
        size: "md",
        kind: "line",
        color: "primary",
    },
};
export default meta;
export const Playground = {};
const Row = ({ label, children }) => (_jsxs("div", { className: "flex items-center gap-6", children: [_jsx("span", { className: "w-24 text-t3 text-[var(--color-secondary-text-color)] uppercase tracking-wide", children: label }), _jsx("div", { className: "flex flex-wrap items-center gap-3", children: children })] }));
export const Colors = {
    render: () => (_jsxs("div", { className: "flex flex-col gap-4", children: [_jsx(Row, { label: "Fill \u00B7 md", children: COLORS.map((c) => (_jsx(Label, { kind: "fill", color: c, children: "Label" }, c))) }), _jsx(Row, { label: "Line \u00B7 md", children: COLORS.map((c) => (_jsx(Label, { kind: "line", color: c, children: "Label" }, c))) }), _jsx(Row, { label: "Fill \u00B7 sm", children: COLORS.map((c) => (_jsx(Label, { size: "sm", kind: "fill", color: c, children: "Label" }, c))) }), _jsx(Row, { label: "Line \u00B7 sm", children: COLORS.map((c) => (_jsx(Label, { size: "sm", kind: "line", color: c, children: "Label" }, c))) })] })),
};
