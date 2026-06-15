import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AlertBanner } from "./AlertBanner";
const meta = {
    title: "Components/AlertBanner",
    component: AlertBanner,
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component: 'Alert banners surface pressing, high-signal messages such as system alerts. They are meant to be noticed and prompt users to take action. Sourced from the TimeWorks Figma file (page "Alert banner", node 46939:87328). Always include a dismiss action; pair with a CTA link or inline action button when a follow-up is expected.',
            },
        },
    },
    tags: ["autodocs"],
    argTypes: {
        type: {
            control: "select",
            options: ["primary", "positive", "negative", "warning", "dark"],
        },
        children: { control: "text" },
    },
    args: {
        type: "primary",
        children: "Alert banner message",
        cta: { label: "this is a CTA" },
        onDismiss: () => { },
    },
};
export default meta;
export const Playground = {};
const TYPES = ["primary", "negative", "positive", "warning", "dark"];
const Stack = ({ children }) => (_jsx("div", { className: "flex flex-col gap-3 w-full max-w-[640px]", children: children }));
const Col = ({ label, children }) => (_jsxs("div", { className: "flex flex-col gap-3", children: [_jsx("span", { className: "text-t3 text-[color:var(--color-secondary-text-color)] uppercase tracking-wide", children: label }), children] }));
export const Types = {
    render: () => (_jsx(Stack, { children: TYPES.map((type) => (_jsx(AlertBanner, { type: type, cta: { label: "this is a CTA" }, onDismiss: () => { }, children: "Alert banner message" }, type))) })),
};
export const LinkOnly = {
    render: () => (_jsx(Col, { label: "Link layout", children: _jsx(Stack, { children: TYPES.map((type) => (_jsx(AlertBanner, { type: type, cta: { label: "this is a CTA" }, onDismiss: () => { }, children: "Alert banner message" }, type))) }) })),
};
export const ButtonOnly = {
    render: () => (_jsx(Col, { label: "Button layout", children: _jsx(Stack, { children: TYPES.map((type) => (_jsx(AlertBanner, { type: type, action: { label: "Title" }, onDismiss: () => { }, children: "Alert banner message" }, type))) }) })),
};
export const LinkAndButton = {
    render: () => (_jsx(Col, { label: "Link + button layout", children: _jsx(Stack, { children: TYPES.map((type) => (_jsx(AlertBanner, { type: type, cta: { label: "this is a CTA" }, action: { label: "Title" }, onDismiss: () => { }, children: "Alert banner message" }, type))) }) })),
};
export const Matrix = {
    render: () => (_jsxs("div", { className: "flex flex-col gap-8", children: [_jsx(Col, { label: "Link", children: _jsx(Stack, { children: TYPES.map((type) => (_jsx(AlertBanner, { type: type, cta: { label: "this is a CTA" }, onDismiss: () => { }, children: "Alert banner message" }, `l-${type}`))) }) }), _jsx(Col, { label: "Button", children: _jsx(Stack, { children: TYPES.map((type) => (_jsx(AlertBanner, { type: type, action: { label: "Title" }, onDismiss: () => { }, children: "Alert banner message" }, `b-${type}`))) }) }), _jsx(Col, { label: "Link + button", children: _jsx(Stack, { children: TYPES.map((type) => (_jsx(AlertBanner, { type: type, cta: { label: "this is a CTA" }, action: { label: "Title" }, onDismiss: () => { }, children: "Alert banner message" }, `lb-${type}`))) }) })] })),
};
