import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AttentionBox } from "./AttentionBox";
const meta = {
    title: "Components/AttentionBox",
    component: AttentionBox,
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component: 'Attention boxes are inline content cards used to draw attention to a message inside the page (not at the top of the viewport like AlertBanner). Sourced from the TimeWorks Figma file (page "Attention Box", node 46939:7881). Five intent types — primary, neutral, positive, warning, negative — and two layouts: default (with optional title + body + CTAs) and compact (single 20px row with truncated body).',
            },
        },
    },
    tags: ["autodocs"],
    argTypes: {
        type: {
            control: "select",
            options: ["primary", "neutral", "positive", "warning", "negative"],
        },
        compact: { control: "boolean" },
        withIcon: { control: "boolean" },
        title: { control: "text" },
        children: { control: "text" },
    },
    args: {
        type: "primary",
        compact: false,
        withIcon: true,
        title: "Attention box title",
        children: "This action will cause your team to lose access to the account until you will use the correct SSO source.",
        cta: { label: "Read more" },
        action: { label: "Button" },
        onDismiss: () => { },
    },
};
export default meta;
export const Playground = {};
const TYPES = ["primary", "neutral", "positive", "warning", "negative"];
const Stack = ({ children }) => (_jsx("div", { className: "flex flex-col gap-3 w-full max-w-[640px]", children: children }));
const Col = ({ label, children }) => (_jsxs("div", { className: "flex flex-col gap-3", children: [_jsx("span", { className: "text-t3 text-[color:var(--color-secondary-text-color)] uppercase tracking-wide", children: label }), children] }));
export const Types = {
    render: () => (_jsx(Stack, { children: TYPES.map((type) => (_jsx(AttentionBox, { type: type, title: "Attention box title", cta: { label: "Read more" }, action: { label: "Button" }, onDismiss: () => { }, children: "This action will cause your team to lose access to the account until you will use the correct SSO source." }, type))) })),
};
export const DefaultWithTitle = {
    render: () => (_jsx(Col, { label: "Default \u00B7 with title", children: _jsx(Stack, { children: TYPES.map((type) => (_jsx(AttentionBox, { type: type, title: "Attention box title", cta: { label: "Read more" }, action: { label: "Button" }, onDismiss: () => { }, children: "This action will cause your team to lose access to the account until you will use the correct SSO source." }, type))) }) })),
};
export const DefaultWithoutTitle = {
    render: () => (_jsx(Col, { label: "Default \u00B7 no title", children: _jsx(Stack, { children: TYPES.map((type) => (_jsx(AttentionBox, { type: type, cta: { label: "Read more" }, action: { label: "Button" }, onDismiss: () => { }, children: "This action will cause your team to lose access to the account until you will use the correct SSO source." }, type))) }) })),
};
export const Compact = {
    render: () => (_jsx(Col, { label: "Compact", children: _jsx(Stack, { children: TYPES.map((type) => (_jsx(AttentionBox, { type: type, compact: true, cta: { label: "Read more" }, action: { label: "Button" }, onDismiss: () => { }, children: "This action will cause your team to lose access to the account until you will use the correct SSO source." }, type))) }) })),
};
export const NoCta = {
    render: () => (_jsx(Stack, { children: TYPES.map((type) => (_jsx(AttentionBox, { type: type, title: "Attention box title", onDismiss: () => { }, children: "This action will cause your team to lose access to the account until you will use the correct SSO source." }, type))) })),
};
export const LinkOnly = {
    render: () => (_jsx(Stack, { children: TYPES.map((type) => (_jsx(AttentionBox, { type: type, title: "Attention box title", cta: { label: "Read more" }, onDismiss: () => { }, children: "This action will cause your team to lose access to the account until you will use the correct SSO source." }, type))) })),
};
export const ButtonOnly = {
    render: () => (_jsx(Stack, { children: TYPES.map((type) => (_jsx(AttentionBox, { type: type, title: "Attention box title", action: { label: "Button" }, onDismiss: () => { }, children: "This action will cause your team to lose access to the account until you will use the correct SSO source." }, type))) })),
};
