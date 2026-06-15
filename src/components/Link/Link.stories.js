import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "./Link";
import { ICON_NAMES } from "../../icons/names";
const meta = {
    title: "Components/Link",
    component: Link,
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component: 'Inline link with the system\'s actionable text styling. Sourced from the TimeWorks Figma file (page "Link", node 46946:16984). Two sizes (Figma "Small" 14/20 ↔ "Large" 16/22) and two surfaces (default = blue link on light surfaces; inverted = white link on dark or colored surfaces). Supports an optional leading or trailing icon (16px glyph in a 20px wrapper).',
            },
        },
    },
    tags: ["autodocs"],
    argTypes: {
        size: { control: "select", options: ["sm", "md"] },
        surface: { control: "select", options: ["default", "inverted", "on-tinted"] },
        iconLeft: { control: "select", options: ["", ...ICON_NAMES] },
        iconRight: { control: "select", options: ["", ...ICON_NAMES] },
        disabled: { control: "boolean" },
        children: { control: "text" },
    },
    args: {
        size: "md",
        surface: "default",
        children: "Read more",
        href: "#",
    },
};
export default meta;
export const Playground = {};
const Row = ({ children }) => (_jsx("div", { className: "flex flex-wrap items-center gap-6", children: children }));
const Col = ({ label, children }) => (_jsxs("div", { className: "flex flex-col gap-3", children: [_jsx("span", { className: "text-t3 text-[color:var(--color-secondary-text-color)] uppercase tracking-wide", children: label }), children] }));
export const Sizes = {
    render: () => (_jsx(Col, { label: "Size", children: _jsxs(Row, { children: [_jsx(Link, { size: "md", href: "#", children: "Read more" }), _jsx(Link, { size: "sm", href: "#", children: "Read more" })] }) })),
};
export const WithIcons = {
    render: () => (_jsx(Col, { label: "Icon position", children: _jsxs(Row, { children: [_jsx(Link, { href: "#", children: "No icon" }), _jsx(Link, { href: "#", iconLeft: "arrow-up-right-from-square", children: "Leading icon" }), _jsx(Link, { href: "#", iconRight: "arrow-up-right-from-square", children: "Trailing icon" })] }) })),
};
export const States = {
    render: () => (_jsx(Col, { label: "State (hover/focus are interactive)", children: _jsxs(Row, { children: [_jsx(Link, { href: "#", children: "Default" }), _jsx(Link, { href: "#", className: "underline", children: "Hover (forced)" }), _jsx(Link, { href: "#", disabled: true, children: "Disabled" })] }) })),
};
export const Surfaces = {
    render: () => (_jsxs("div", { className: "flex flex-col gap-6", children: [_jsx(Col, { label: "Default surface (light background)", children: _jsxs("div", { className: "flex flex-wrap items-center gap-6 p-6 rounded-md bg-[var(--color-primary-background-color)] border border-[var(--color-layout-border-color)]", children: [_jsx(Link, { size: "md", href: "#", children: "Read more" }), _jsx(Link, { size: "md", href: "#", iconRight: "arrow-up-right-from-square", children: "Read more" }), _jsx(Link, { size: "sm", href: "#", iconLeft: "arrow-up-right-from-square", children: "Read more" }), _jsx(Link, { size: "sm", href: "#", disabled: true, children: "Disabled" })] }) }), _jsx(Col, { label: "Inverted surface (dark background)", children: _jsxs("div", { className: "flex flex-wrap items-center gap-6 p-6 rounded-md bg-[var(--color-inverted-color-background)]", children: [_jsx(Link, { size: "md", surface: "inverted", href: "#", children: "Read more" }), _jsx(Link, { size: "md", surface: "inverted", href: "#", iconRight: "arrow-up-right-from-square", children: "Read more" }), _jsx(Link, { size: "sm", surface: "inverted", href: "#", iconLeft: "arrow-up-right-from-square", children: "Read more" }), _jsx(Link, { size: "sm", surface: "inverted", href: "#", disabled: true, children: "Disabled" })] }) })] })),
};
export const VariantsMatrix = {
    render: () => (_jsx("div", { className: "flex flex-col gap-8", children: ["default", "inverted"].map((surface) => (_jsx(Col, { label: `${surface} surface`, children: _jsx("div", { className: surface === "inverted"
                    ? "flex flex-col gap-4 p-6 rounded-md bg-[var(--color-inverted-color-background)]"
                    : "flex flex-col gap-4 p-6 rounded-md bg-[var(--color-primary-background-color)] border border-[var(--color-layout-border-color)]", children: ["md", "sm"].map((size) => (_jsxs("div", { className: "flex flex-wrap items-center gap-6", children: [_jsx(Link, { size: size, surface: surface, href: "#", children: "Read more" }), _jsx(Link, { size: size, surface: surface, href: "#", iconLeft: "arrow-up-right-from-square", children: "Read more" }), _jsx(Link, { size: size, surface: surface, href: "#", iconRight: "arrow-up-right-from-square", children: "Read more" }), _jsx(Link, { size: size, surface: surface, href: "#", disabled: true, children: "Disabled" })] }, size))) }) }, surface))) })),
};
