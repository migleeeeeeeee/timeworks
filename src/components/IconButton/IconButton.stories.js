import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { IconButton } from "./IconButton";
import { ICON_NAMES } from "../../icons/names";
const meta = {
    title: "Components/IconButton",
    component: IconButton,
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component: 'Square, icon-only button used in toolbars and control bars. Sourced from the TimeWorks Figma file (page "Icon Button", node 46946:15233). Always pass `aria-label` (or wrap in a Tooltip) so screen readers announce the action.',
            },
        },
    },
    tags: ["autodocs"],
    argTypes: {
        kind: { control: "select", options: ["primary", "secondary", "tertiary"] },
        size: { control: "select", options: ["xxs", "xs", "sm", "md", "lg"] },
        icon: { control: "select", options: ICON_NAMES },
        active: { control: "boolean" },
        loading: { control: "boolean" },
        disabled: { control: "boolean" },
    },
    args: {
        kind: "primary",
        size: "md",
        icon: "ellipsis",
        "aria-label": "More",
    },
};
export default meta;
export const Playground = {};
const Row = ({ children }) => (_jsx("div", { className: "flex flex-wrap items-center gap-3", children: children }));
const Col = ({ label, children }) => (_jsxs("div", { className: "flex flex-col gap-2", children: [_jsx("span", { className: "text-t3 text-[color:var(--color-secondary-text-color)] uppercase tracking-wide", children: label }), children] }));
export const Kinds = {
    render: () => (_jsx(Col, { label: "Kind", children: _jsxs(Row, { children: [_jsx(IconButton, { kind: "primary", icon: "ellipsis", "aria-label": "Primary" }), _jsx(IconButton, { kind: "secondary", icon: "ellipsis", "aria-label": "Secondary" }), _jsx(IconButton, { kind: "tertiary", icon: "ellipsis", "aria-label": "Tertiary" })] }) })),
};
export const Sizes = {
    render: () => (_jsx(Col, { label: "Size", children: _jsxs(Row, { children: [_jsx(IconButton, { size: "lg", icon: "ellipsis", "aria-label": "Large" }), _jsx(IconButton, { size: "md", icon: "ellipsis", "aria-label": "Medium" }), _jsx(IconButton, { size: "sm", icon: "ellipsis", "aria-label": "Small" }), _jsx(IconButton, { size: "xs", icon: "ellipsis", "aria-label": "XS" }), _jsx(IconButton, { size: "xxs", icon: "ellipsis", "aria-label": "XXS" })] }) })),
};
export const States = {
    render: () => (_jsx("div", { className: "flex flex-col gap-6", children: ["primary", "secondary", "tertiary"].map((kind) => (_jsx(Col, { label: kind, children: _jsxs(Row, { children: [_jsx(IconButton, { kind: kind, icon: "ellipsis", "aria-label": "Default" }), _jsx(IconButton, { kind: kind, icon: "ellipsis", "aria-label": "Active", active: true }), _jsx(IconButton, { kind: kind, icon: "ellipsis", "aria-label": "Disabled", disabled: true }), _jsx(IconButton, { kind: kind, icon: "ellipsis", "aria-label": "Loading", loading: true })] }) }, kind))) })),
};
export const VariantsMatrix = {
    render: () => (_jsx("div", { className: "flex flex-col gap-8", children: ["primary", "secondary", "tertiary"].map((kind) => (_jsx(Col, { label: kind, children: _jsxs(Row, { children: [_jsx(IconButton, { kind: kind, size: "lg", icon: "ellipsis", "aria-label": "Large" }), _jsx(IconButton, { kind: kind, size: "md", icon: "ellipsis", "aria-label": "Medium" }), _jsx(IconButton, { kind: kind, size: "sm", icon: "ellipsis", "aria-label": "Small" }), _jsx(IconButton, { kind: kind, size: "xs", icon: "ellipsis", "aria-label": "XS" }), _jsx(IconButton, { kind: kind, size: "xxs", icon: "ellipsis", "aria-label": "XXS" }), _jsx(IconButton, { kind: kind, icon: "ellipsis", "aria-label": "Active", active: true }), _jsx(IconButton, { kind: kind, icon: "ellipsis", "aria-label": "Disabled", disabled: true })] }) }, kind))) })),
};
