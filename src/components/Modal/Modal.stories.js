import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { Button } from "../Button";
import { Checkbox } from "../Checkbox";
import { Modal, ModalBody, ModalContent, ModalDescription, ModalFooter, ModalHeader, ModalMedia, ModalSideBySide, ModalTitle, ModalTrigger, } from "./Modal";
const meta = {
    title: "Components/Modal",
    component: ModalContent,
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component: 'Modal — built on `@radix-ui/react-dialog`. Provides three layout variants (basic, media, side-by-side) and three width sizes (small / medium / large) sourced from the TimeWorks Figma file (page "Modal", node 46939:7907). Compose with `Modal`, `ModalTrigger`, `ModalContent`, `ModalHeader`, `ModalBody`, `ModalFooter`, `ModalMedia`, and `ModalSideBySide`.',
            },
        },
    },
    tags: ["autodocs"],
    argTypes: {
        size: {
            control: "select",
            options: ["small", "medium", "large"],
        },
    },
};
export default meta;
const PlaceholderBody = ({ height = 176 }) => (_jsx("div", { className: "flex w-full items-center justify-center rounded-sm border border-dashed border-[var(--color-warning-color-hover)] bg-[var(--color-warning-color-selected)]", style: { height }, children: _jsx("div", { className: "flex flex-1 items-center justify-center bg-[var(--color-warning-color)]", children: _jsxs("span", { className: "text-t2 text-[var(--color-primary-text-color)]", children: ["Replace me. ", _jsx("span", { className: "underline", children: "Slot for body content" })] }) }) }));
const SAMPLE_IMAGE = "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&q=80&auto=format&fit=crop";
/* ─────────────────────────────  Playground  ────────────────────────────── */
export const Playground = {
    args: {
        size: "medium",
        title: "Modal title",
        description: "Modal subtitle, can come with icon and link.",
    },
    render: (args) => (_jsxs(Modal, { children: [_jsx(ModalTrigger, { asChild: true, children: _jsx(Button, { children: "Open modal" }) }), _jsxs(ModalContent, { ...args, children: [_jsx(ModalBody, { children: _jsx(PlaceholderBody, {}) }), _jsx(ModalFooter, { leftContent: _jsx(Checkbox, { children: "Don\u2019t show again" }), rightContent: _jsx(Button, { kind: "primary", children: "Main CTA" }) })] })] })),
};
/* ───────────────────────────────  Sizes  ───────────────────────────────── */
const SizeStory = ({ size }) => (_jsxs(Modal, { children: [_jsx(ModalTrigger, { asChild: true, children: _jsxs(Button, { kind: "secondary", children: ["Open ", size] }) }), _jsxs(ModalContent, { size: size, title: "Modal title", description: "Modal subtitle, can come with icon and link.", children: [_jsx(ModalBody, { children: _jsx(PlaceholderBody, { height: size === "small" ? 96 : size === "medium" ? 159 : 256 }) }), _jsx(ModalFooter, { leftContent: size !== "small" ? _jsx(Checkbox, { children: "Don\u2019t show again" }) : undefined, rightContent: _jsx(Button, { kind: "primary", children: "Main CTA" }) })] })] }));
export const Sizes = {
    render: () => (_jsxs("div", { className: "flex flex-wrap items-center gap-4", children: [_jsx(SizeStory, { size: "small" }), _jsx(SizeStory, { size: "medium" }), _jsx(SizeStory, { size: "large" })] })),
};
/* ───────────────────────────────  Variants  ────────────────────────────── */
export const Basic = {
    render: () => (_jsxs(Modal, { defaultOpen: false, children: [_jsx(ModalTrigger, { asChild: true, children: _jsx(Button, { children: "Basic modal" }) }), _jsxs(ModalContent, { size: "medium", title: "Modal title", description: "Modal subtitle, can come with icon and link.", children: [_jsx(ModalBody, { children: _jsx(PlaceholderBody, {}) }), _jsx(ModalFooter, { leftContent: _jsx(Checkbox, { children: "Don\u2019t show again" }), rightContent: _jsx(Button, { kind: "primary", children: "Main CTA" }) })] })] })),
};
export const Media = {
    render: () => (_jsxs(Modal, { children: [_jsx(ModalTrigger, { asChild: true, children: _jsx(Button, { children: "Media modal" }) }), _jsxs(ModalContent, { size: "medium", children: [_jsx(ModalMedia, { src: SAMPLE_IMAGE, alt: "" }), _jsxs(ModalHeader, { className: "items-center text-center", children: [_jsx(ModalTitle, { className: "pr-0", children: "Modal title" }), _jsxs(ModalDescription, { children: ["For marketing modals all the content can be seen here as a longer subtitle text, the user can also add a ", _jsx("a", { className: "text-[var(--color-link-color)] underline", href: "#", children: "link" }), "."] })] }), _jsx(ModalFooter, { leftContent: _jsx(Button, { kind: "tertiary", className: "-ml-3", children: "Back" }), rightContent: _jsx(Button, { kind: "primary", children: "Main CTA" }) })] })] })),
};
export const SideBySide = {
    render: () => (_jsxs(Modal, { children: [_jsx(ModalTrigger, { asChild: true, children: _jsx(Button, { children: "Side-by-side modal" }) }), _jsxs(ModalContent, { size: "large", children: [_jsxs(ModalSideBySide, { side: _jsx(ModalMedia, { src: SAMPLE_IMAGE, alt: "", height: "100%" }), children: [_jsxs(ModalHeader, { children: [_jsx(ModalTitle, { children: "Modal title" }), _jsxs(ModalDescription, { children: ["Modal subtitle, can come with icon and", " ", _jsx("a", { className: "text-[var(--color-link-color)] underline", href: "#", children: "link" }), "."] })] }), _jsx(ModalBody, { children: _jsx(PlaceholderBody, { height: 256 }) })] }), _jsx(ModalFooter, { elevated: true, leftContent: _jsx(Button, { kind: "tertiary", className: "-ml-3", children: "Back" }), centerContent: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "flex size-2 items-center justify-center", children: _jsx("span", { className: "size-2 rounded-full bg-[var(--color-primary-color)]" }) }), [0, 1, 2, 3].map((i) => (_jsx("span", { className: "flex size-2 items-center justify-center", children: _jsx("span", { className: "size-1.5 rounded-full bg-[var(--color-ui-border-color)]" }) }, i)))] }), rightContent: _jsx(Button, { kind: "primary", children: "Main CTA" }) })] })] })),
};
/* ───────────────────────────────  Scrollable  ──────────────────────────── */
export const Scrollable = {
    render: () => (_jsxs(Modal, { children: [_jsx(ModalTrigger, { asChild: true, children: _jsx(Button, { children: "Scrolling content" }) }), _jsxs(ModalContent, { size: "medium", children: [_jsxs(ModalHeader, { bordered: true, children: [_jsx(ModalTitle, { children: "Modal title" }), _jsx(ModalDescription, { children: "Modal subtitle, can come with icon and link." })] }), _jsx(ModalBody, { scrollable: true, children: Array.from({ length: 12 }).map((_, i) => (_jsxs("p", { className: "text-t1 text-[var(--color-primary-text-color)] py-2", children: ["Long content paragraph ", i + 1, ". The header has a bottom border and the footer gets a subtle top shadow when the body scrolls."] }, i))) }), _jsx(ModalFooter, { elevated: true, leftContent: _jsx(Checkbox, { children: "Don\u2019t show again" }), rightContent: _jsx(Button, { kind: "primary", children: "Main CTA" }) })] })] })),
};
/* ───────────────────────────────  Controlled  ──────────────────────────── */
export const Controlled = {
    render: () => {
        function Demo() {
            const [open, setOpen] = useState(false);
            return (_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Button, { onClick: () => setOpen(true), children: "Open via state" }), _jsx(Modal, { open: open, onOpenChange: setOpen, children: _jsxs(ModalContent, { size: "small", title: "Confirm action", description: "This is a controlled modal \u2014 open state lives in the parent.", children: [_jsx(ModalBody, { children: _jsx("p", { className: "text-t1 text-[var(--color-primary-text-color)]", children: "Click outside, press Escape, or use the buttons below to dismiss." }) }), _jsx(ModalFooter, { rightContent: _jsxs(_Fragment, { children: [_jsx(Button, { kind: "tertiary", onClick: () => setOpen(false), children: "Cancel" }), _jsx(Button, { kind: "primary", onClick: () => setOpen(false), children: "Confirm" })] }) })] }) })] }));
        }
        return _jsx(Demo, {});
    },
};
