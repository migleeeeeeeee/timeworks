import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Toast } from "./Toast";
const meta = {
    title: "Components/Toast",
    component: Toast,
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component: 'Toast notifications surface short, timely feedback (confirmation of actions, alerts, errors). 48px-tall pill with intent color, leading icon, message, optional underlined link / outlined action button, and a dismiss icon. Sourced from the TimeWorks Figma file (page "Toast", node 46939:7920; component set 46949:39726). Visual unit only — wrap with `@radix-ui/react-toast` for queueing, auto-dismiss, and swipe behavior.',
            },
        },
    },
    tags: ["autodocs"],
    argTypes: {
        type: {
            control: "select",
            options: ["primary", "negative", "positive", "warning", "dark"],
        },
        children: { control: "text" },
        loading: { control: "boolean" },
    },
    args: {
        type: "primary",
        children: "General message toast",
        cta: { label: "Link to action" },
        action: { label: "Button" },
        onDismiss: () => { },
    },
};
export default meta;
export const Playground = {};
const TYPES = ["primary", "negative", "positive", "warning", "dark"];
const Stack = ({ children }) => (_jsx("div", { className: "flex flex-col items-start gap-3", children: children }));
const Col = ({ label, children }) => (_jsxs("div", { className: "flex flex-col gap-3", children: [_jsx("span", { className: "text-t3 text-[color:var(--color-secondary-text-color)] uppercase tracking-wide", children: label }), children] }));
export const Types = {
    render: () => (_jsx(Stack, { children: TYPES.map((type) => (_jsx(Toast, { type: type, cta: { label: "Link to action" }, action: { label: "Button" }, onDismiss: () => { }, children: "General message toast" }, type))) })),
};
export const ButtonOnly = {
    render: () => (_jsx(Col, { label: "Button only", children: _jsx(Stack, { children: TYPES.map((type) => (_jsx(Toast, { type: type, action: { label: "Button" }, onDismiss: () => { }, children: "General message toast" }, type))) }) })),
};
export const LinkOnly = {
    render: () => (_jsx(Col, { label: "Link only", children: _jsx(Stack, { children: TYPES.map((type) => (_jsx(Toast, { type: type, cta: { label: "Link to action" }, onDismiss: () => { }, children: "General message toast" }, type))) }) })),
};
export const MessageOnly = {
    render: () => (_jsx(Col, { label: "Message only", children: _jsx(Stack, { children: TYPES.map((type) => (_jsx(Toast, { type: type, onDismiss: () => { }, children: "General message toast" }, type))) }) })),
};
export const Loader = {
    render: () => (_jsx(Col, { label: "Loading", children: _jsx(Stack, { children: TYPES.map((type) => (_jsx(Toast, { type: type, loading: true, onDismiss: () => { }, children: "General message toast" }, type))) }) })),
};
export const Matrix = {
    render: () => (_jsxs("div", { className: "flex flex-col gap-8", children: [_jsx(Col, { label: "Link + button", children: _jsx(Stack, { children: TYPES.map((type) => (_jsx(Toast, { type: type, cta: { label: "Link to action" }, action: { label: "Button" }, onDismiss: () => { }, children: "General message toast" }, `lb-${type}`))) }) }), _jsx(Col, { label: "Button only", children: _jsx(Stack, { children: TYPES.map((type) => (_jsx(Toast, { type: type, action: { label: "Button" }, onDismiss: () => { }, children: "General message toast" }, `b-${type}`))) }) }), _jsx(Col, { label: "Link only", children: _jsx(Stack, { children: TYPES.map((type) => (_jsx(Toast, { type: type, cta: { label: "Link to action" }, onDismiss: () => { }, children: "General message toast" }, `l-${type}`))) }) }), _jsx(Col, { label: "Message only", children: _jsx(Stack, { children: TYPES.map((type) => (_jsx(Toast, { type: type, onDismiss: () => { }, children: "General message toast" }, `m-${type}`))) }) }), _jsx(Col, { label: "Loading", children: _jsx(Stack, { children: TYPES.map((type) => (_jsx(Toast, { type: type, loading: true, onDismiss: () => { }, children: "General message toast" }, `load-${type}`))) }) })] })),
};
