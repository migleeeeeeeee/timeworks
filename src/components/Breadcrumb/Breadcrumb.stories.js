import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Breadcrumb, BreadcrumbItem } from "./Breadcrumb";
const meta = {
    title: "Components/Breadcrumb",
    component: Breadcrumb,
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component: 'Breadcrumb shows the user\'s location in a hierarchy. Compose with `BreadcrumbItem` children — the last child is automatically marked as `current`. Use `<BreadcrumbItem variant="children" />` to render an overflow ellipsis when intermediate items are collapsed. Sourced from the TimeWorks Figma file (page "Breadcrumb", node 46939:90935).',
            },
        },
    },
    tags: ["autodocs"],
    args: {
        children: (_jsxs(_Fragment, { children: [_jsx(BreadcrumbItem, { href: "#", icon: "hexagon-image", children: "Workspace" }), _jsx(BreadcrumbItem, { href: "#", children: "Projects" }), _jsx(BreadcrumbItem, { children: "Roadmap" })] })),
    },
};
export default meta;
export const Default = {
    render: () => (_jsxs(Breadcrumb, { children: [_jsx(BreadcrumbItem, { href: "#", icon: "hexagon-image", children: "Workspace" }), _jsx(BreadcrumbItem, { href: "#", children: "Projects" }), _jsx(BreadcrumbItem, { href: "#", children: "Acme rebrand" }), _jsx(BreadcrumbItem, { children: "Roadmap" })] })),
};
export const WithOverflow = {
    render: () => (_jsxs(Breadcrumb, { children: [_jsx(BreadcrumbItem, { href: "#", icon: "hexagon-image", children: "Workspace" }), _jsx(BreadcrumbItem, { variant: "children", "aria-label": "More", href: "#" }), _jsx(BreadcrumbItem, { href: "#", children: "Acme rebrand" }), _jsx(BreadcrumbItem, { children: "Roadmap" })] })),
};
const Row = ({ label, children }) => (_jsxs("div", { className: "flex items-center gap-8", children: [_jsx("span", { className: "w-32 text-t3 text-[var(--color-secondary-text-color)] uppercase tracking-wide", children: label }), _jsx("div", { className: "flex items-center gap-6", children: children })] }));
export const States = {
    render: () => (_jsxs("div", { className: "flex flex-col gap-6", children: [_jsx(Row, { label: "Default", children: _jsx(BreadcrumbItem, { href: "#", icon: "hexagon-image", hideSeparator: true, children: "Workspace" }) }), _jsx(Row, { label: "Current", children: _jsx(BreadcrumbItem, { icon: "hexagon-image", current: true, hideSeparator: true, children: "Workspace" }) }), _jsx(Row, { label: "Disabled", children: _jsx(BreadcrumbItem, { icon: "hexagon-image", disabled: true, hideSeparator: true, children: "Workspace" }) })] })),
};
export const Variants = {
    render: () => (_jsxs("div", { className: "flex flex-col gap-6", children: [_jsx(Row, { label: "Default", children: _jsxs(Breadcrumb, { children: [_jsx(BreadcrumbItem, { href: "#", icon: "hexagon-image", children: "Workspace" }), _jsx(BreadcrumbItem, { children: "Roadmap" })] }) }), _jsx(Row, { label: "Children", children: _jsxs(Breadcrumb, { children: [_jsx(BreadcrumbItem, { href: "#", icon: "hexagon-image", children: "Workspace" }), _jsx(BreadcrumbItem, { variant: "children", href: "#", "aria-label": "More" }), _jsx(BreadcrumbItem, { children: "Roadmap" })] }) })] })),
};
