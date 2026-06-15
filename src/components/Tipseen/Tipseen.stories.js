import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Steps } from "../Steps";
import { Link } from "../Link";
import { Tipseen, TipseenAction } from "./Tipseen";
const meta = {
    title: "Components/Tipseen",
    component: Tipseen,
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component: 'Tipseen — virtual onboarding callout used to highlight features, walk users through a flow, or up-sell a product. Sourced from the TimeWorks Figma file (page "Tipseen", node 46939:7919). Two `type` palettes (inverted / primary), an optional directional pointer (`top` / `bottom` / `left` / `right`), an optional top media slot, and a footer slot for actions and a step indicator.',
            },
        },
    },
    tags: ["autodocs"],
    argTypes: {
        type: {
            control: "select",
            options: ["inverted", "primary"],
        },
        pointerPosition: {
            control: "select",
            options: ["none", "top", "bottom", "left", "right"],
        },
        closeButtonColor: {
            control: "select",
            options: ["light", "dark"],
        },
        title: { control: "text" },
    },
    args: {
        type: "inverted",
        pointerPosition: "none",
        title: "This is a title",
        children: (_jsxs(_Fragment, { children: ["Message will appear here, to give more information about the feature.", " ", _jsx(Link, { href: "#", surface: "inverted", size: "sm", children: "Read more" })] })),
        onDismiss: () => { },
    },
};
export default meta;
const SAMPLE_IMAGE = "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&q=80&auto=format&fit=crop";
const PlaceholderImage = () => (_jsx("div", { className: "h-[145px] w-full", style: {
        background: "linear-gradient(135deg, var(--color-primary-selected-color) 0%, var(--color-primary-highlighted-color) 50%, var(--color-primary-color) 100%)",
    }, "aria-hidden": "true" }));
const TwoActions = ({ stepperVisible = true }) => {
    const [step, setStep] = useState(2);
    return (_jsxs(_Fragment, { children: [_jsx(TipseenAction, { onClick: () => setStep((s) => Math.max(0, s - 1)), children: "Back" }), stepperVisible && (_jsx(Steps, { count: 7, value: step, onValueChange: setStep, type: "gallery-only", onColor: "primary", "aria-label": "Tipseen progress", className: "flex-1 justify-center" })), _jsx(TipseenAction, { kind: "primary", onClick: () => setStep((s) => Math.min(6, s + 1)), children: "Next" })] }));
};
const OneAction = () => _jsx(TipseenAction, { kind: "primary", children: "Got it" });
/* ─────────────────────────────  Playground  ────────────────────────────── */
export const Playground = {
    args: {
        footer: _jsx(TwoActions, {}),
    },
};
/* ─────────────────────────────  Types  ─────────────────────────────────── */
const Row = ({ children }) => (_jsx("div", { className: "flex flex-wrap items-end gap-10", children: children }));
const Cell = ({ label, children }) => (_jsxs("div", { className: "flex flex-col gap-3", children: [_jsx("span", { className: "text-t3 text-[color:var(--color-secondary-text-color)] uppercase tracking-wide", children: label }), children] }));
export const Types = {
    render: () => (_jsxs("div", { className: "flex flex-col gap-12", children: [_jsx(Cell, { label: "Inverted", children: _jsxs(Tipseen, { type: "inverted", title: "This is a title", onDismiss: () => { }, footer: _jsx(TwoActions, {}), children: ["Message will appear here, to give more information about the feature.", " ", _jsx(Link, { href: "#", surface: "inverted", size: "sm", children: "Read more" })] }) }), _jsx(Cell, { label: "Primary", children: _jsxs(Tipseen, { type: "primary", title: "This is a title", onDismiss: () => { }, footer: _jsx(TwoActions, {}), children: ["Message will appear here, to give more information about the feature.", " ", _jsx(Link, { href: "#", surface: "inverted", size: "sm", children: "Read more" })] }) })] })),
};
/* ──────────────────────────  Pointer positions  ────────────────────────── */
export const PointerPositions = {
    render: () => (_jsx(Row, { children: ["none", "top", "bottom", "left", "right"].map((pos) => (_jsx(Cell, { label: `pointer / ${pos}`, children: _jsxs(Tipseen, { type: "inverted", pointerPosition: pos, title: "This is a title", onDismiss: () => { }, footer: _jsx(TwoActions, {}), children: ["Message will appear here, to give more information about the feature.", " ", _jsx(Link, { href: "#", surface: "inverted", size: "sm", children: "Read more" })] }) }, pos))) })),
};
/* ─────────────────────────────  With image  ────────────────────────────── */
export const WithImage = {
    render: () => (_jsxs(Row, { children: [_jsx(Cell, { label: "Inverted \u00B7 with image", children: _jsx(Tipseen, { type: "inverted", pointerPosition: "bottom", title: "This is a title", image: _jsx("img", { src: SAMPLE_IMAGE, alt: "", className: "block h-[145px] w-full object-cover" }), onDismiss: () => { }, footer: _jsx(TwoActions, {}), children: "Message will appear here, to give more information about the feature." }) }), _jsx(Cell, { label: "Primary \u00B7 with placeholder", children: _jsx(Tipseen, { type: "primary", pointerPosition: "bottom", title: "This is a title", image: _jsx(PlaceholderImage, {}), onDismiss: () => { }, footer: _jsx(TwoActions, {}), children: "Message will appear here, to give more information about the feature." }) })] })),
};
/* ─────────────────────────────  Footer types  ──────────────────────────── */
export const FooterTypes = {
    render: () => (_jsxs(Row, { children: [_jsx(Cell, { label: "Stepper \u00B7 2 actions", children: _jsx(Tipseen, { type: "inverted", title: "This is a title", onDismiss: () => { }, footer: _jsx(TwoActions, {}), children: "Message will appear here, to give more information about the feature." }) }), _jsx(Cell, { label: "One action", children: _jsx(Tipseen, { type: "inverted", title: "This is a title", onDismiss: () => { }, footer: _jsx(OneAction, {}), children: "Message will appear here, to give more information about the feature." }) }), _jsx(Cell, { label: "Two actions (no stepper)", children: _jsx(Tipseen, { type: "inverted", title: "This is a title", onDismiss: () => { }, footer: _jsx(TwoActions, { stepperVisible: false }), children: "Message will appear here, to give more information about the feature." }) })] })),
};
/* ─────────────────────────────  Variants matrix  ───────────────────────── */
export const VariantsMatrix = {
    parameters: { layout: "padded" },
    render: () => (_jsx("div", { className: "flex flex-col gap-12", children: ["inverted", "primary"].map((type) => (_jsxs("div", { className: "flex flex-col gap-4", children: [_jsx("span", { className: "text-t3 text-[color:var(--color-secondary-text-color)] uppercase tracking-wide", children: type }), _jsx(Row, { children: ["none", "bottom", "top", "right", "left"].map((pos) => (_jsx(Tipseen, { type: type, pointerPosition: pos, title: "This is a title", onDismiss: () => { }, footer: _jsx(TwoActions, {}), children: "Message will appear here, to give more information about the feature." }, pos))) })] }, type))) })),
};
