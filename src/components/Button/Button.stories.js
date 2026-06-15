import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "./Button";
import { ICON_NAMES } from "../../icons/names";
const meta = {
    title: "Components/Button",
    component: Button,
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component: 'Buttons let users trigger an action with a single click. Sourced from the TimeWorks Figma file (page "Button", node 46939:7886). Use only one primary button per view; remaining calls to action should be lower-emphasis kinds.',
            },
        },
    },
    tags: ["autodocs"],
    argTypes: {
        kind: { control: "select", options: ["primary", "secondary", "tertiary", "brand"] },
        size: { control: "select", options: ["xs", "sm", "md", "lg"] },
        color: { control: "select", options: ["primary", "negative", "positive", "inverted"] },
        iconLeft: { control: "select", options: ["", ...ICON_NAMES] },
        iconRight: { control: "select", options: ["", ...ICON_NAMES] },
        loading: { control: "boolean" },
        disabled: { control: "boolean" },
        children: { control: "text" },
    },
    args: {
        kind: "primary",
        size: "md",
        color: "primary",
        children: "Button",
    },
};
export default meta;
export const Playground = {};
const Row = ({ children }) => (_jsx("div", { className: "flex flex-wrap items-center gap-3", children: children }));
const Col = ({ label, children }) => (_jsxs("div", { className: "flex flex-col gap-2", children: [_jsx("span", { className: "text-t3 text-[color:var(--color-secondary-text-color)] uppercase tracking-wide", children: label }), children] }));
export const Kinds = {
    render: () => (_jsx(Col, { label: "Kind", children: _jsxs(Row, { children: [_jsx(Button, { kind: "primary", children: "Primary" }), _jsx(Button, { kind: "secondary", children: "Secondary" }), _jsx(Button, { kind: "tertiary", children: "Tertiary" }), _jsx(Button, { kind: "brand", children: "Brand" })] }) })),
};
export const Sizes = {
    render: () => (_jsx(Col, { label: "Size", children: _jsxs(Row, { children: [_jsx(Button, { size: "lg", children: "Large" }), _jsx(Button, { size: "md", children: "Medium" }), _jsx(Button, { size: "sm", children: "Small" }), _jsx(Button, { size: "xs", children: "XS" })] }) })),
};
export const Colors = {
    render: () => (_jsxs("div", { className: "flex flex-col gap-6", children: [_jsx(Col, { label: "Primary kind", children: _jsxs(Row, { children: [_jsx(Button, { color: "primary", children: "Primary" }), _jsx(Button, { color: "negative", children: "Negative" }), _jsx(Button, { color: "positive", children: "Positive" }), _jsx(Button, { color: "inverted", children: "Inverted" })] }) }), _jsx(Col, { label: "Secondary kind", children: _jsxs(Row, { children: [_jsx(Button, { kind: "secondary", color: "primary", children: "Primary" }), _jsx(Button, { kind: "secondary", color: "negative", children: "Negative" }), _jsx(Button, { kind: "secondary", color: "positive", children: "Positive" }), _jsx(Button, { kind: "secondary", color: "inverted", children: "Inverted" })] }) }), _jsx(Col, { label: "Tertiary kind", children: _jsxs(Row, { children: [_jsx(Button, { kind: "tertiary", color: "primary", children: "Primary" }), _jsx(Button, { kind: "tertiary", color: "negative", children: "Negative" }), _jsx(Button, { kind: "tertiary", color: "positive", children: "Positive" }), _jsx(Button, { kind: "tertiary", color: "inverted", children: "Inverted" })] }) })] })),
};
export const States = {
    render: () => (_jsxs("div", { className: "flex flex-col gap-6", children: [_jsx(Col, { label: "Primary", children: _jsxs(Row, { children: [_jsx(Button, { children: "Regular" }), _jsx(Button, { className: "bg-[var(--color-primary-hover-color)]", children: "Hover" }), _jsx(Button, { disabled: true, children: "Disabled" }), _jsx(Button, { loading: true, children: "Loading" })] }) }), _jsx(Col, { label: "Secondary", children: _jsxs(Row, { children: [_jsx(Button, { kind: "secondary", children: "Regular" }), _jsx(Button, { kind: "secondary", className: "bg-[var(--color-primary-background-hover-color)]", children: "Hover" }), _jsx(Button, { kind: "secondary", disabled: true, children: "Disabled" }), _jsx(Button, { kind: "secondary", loading: true, children: "Loading" })] }) })] })),
};
export const WithIcons = {
    render: () => (_jsx(Col, { label: "Icon", children: _jsxs(Row, { children: [_jsx(Button, { iconLeft: "circle-check", children: "Icon left" }), _jsx(Button, { iconRight: "arrow-right", children: "Icon right" }), _jsx(Button, { kind: "secondary", iconLeft: "circle-check", children: "Confirm" })] }) })),
};
export const VariantsMatrix = {
    render: () => (_jsx("div", { className: "flex flex-col gap-8", children: ["primary", "secondary", "tertiary", "brand"].map((kind) => (_jsx(Col, { label: kind, children: _jsxs(Row, { children: [_jsx(Button, { kind: kind, size: "lg", children: "Large" }), _jsx(Button, { kind: kind, size: "md", children: "Medium" }), _jsx(Button, { kind: kind, size: "sm", children: "Small" }), _jsx(Button, { kind: kind, size: "xs", children: "XS" }), _jsx(Button, { kind: kind, iconLeft: "circle-check", children: "With icon" }), _jsx(Button, { kind: kind, disabled: true, children: "Disabled" })] }) }, kind))) })),
};
