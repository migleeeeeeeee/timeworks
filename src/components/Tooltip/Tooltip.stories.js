import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "../Button";
import { Link } from "../Link";
import { Tooltip, TooltipContent, TooltipTrigger } from "./Tooltip";
const meta = {
    title: "Components/Tooltip",
    component: TooltipContent,
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component: 'Tooltip — built on `@radix-ui/react-tooltip`. Provides a small floating panel of helpful context anchored to a trigger. Three themes (default / on-dark / on-black), four sides (top / right / bottom / left), and optional title, leading icon, link, and image slots. Sourced from the TimeWorks Figma file (page "Tooltip", node 46939:7922).',
            },
        },
    },
    tags: ["autodocs"],
    argTypes: {
        theme: { control: "select", options: ["default", "on-dark", "on-black"] },
        side: { control: "select", options: ["top", "right", "bottom", "left"] },
        maxWidth: { control: { type: "number", min: 120, max: 480, step: 10 } },
    },
};
export default meta;
const SAMPLE_IMAGE = "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=480&q=80&auto=format&fit=crop";
/* ─────────────────────────────  Playground  ────────────────────────────── */
export const Playground = {
    args: {
        theme: "default",
        side: "bottom",
        maxWidth: 240,
    },
    render: (args) => (_jsxs(Tooltip, { defaultOpen: true, children: [_jsx(TooltipTrigger, { asChild: true, children: _jsx(Button, { children: "Hover me" }) }), _jsx(TooltipContent, { ...args, children: "Tooltip label" })] })),
};
/* ─────────────────────────────  Default  ───────────────────────────────── */
export const Default = {
    render: () => (_jsxs(Tooltip, { defaultOpen: true, children: [_jsx(TooltipTrigger, { asChild: true, children: _jsx(Button, { children: "Hover me" }) }), _jsx(TooltipContent, { children: "Tooltip label" })] })),
};
/* ─────────────────────────────  Arrow position  ────────────────────────── */
export const ArrowPositions = {
    render: () => (_jsx("div", { className: "grid grid-cols-2 gap-16 p-16", children: ["top", "right", "bottom", "left"].map((side) => (_jsx("div", { className: "flex items-center justify-center", children: _jsxs(Tooltip, { defaultOpen: true, children: [_jsx(TooltipTrigger, { asChild: true, children: _jsx(Button, { children: side }) }), _jsx(TooltipContent, { side: side, children: "Tooltip label" })] }) }, side))) })),
};
/* ─────────────────────────────  With title  ────────────────────────────── */
export const WithTitle = {
    render: () => (_jsxs("div", { className: "flex gap-12", children: [_jsxs(Tooltip, { defaultOpen: true, children: [_jsx(TooltipTrigger, { asChild: true, children: _jsx(Button, { children: "Title" }) }), _jsx(TooltipContent, { title: "Tooltip title", children: "Tooltip label" })] }), _jsxs(Tooltip, { defaultOpen: true, children: [_jsx(TooltipTrigger, { asChild: true, children: _jsx(Button, { children: "Title + icon" }) }), _jsx(TooltipContent, { title: "Tooltip title", titleIcon: "bell", children: "Tooltip label" })] })] })),
};
/* ─────────────────────────────  With link  ─────────────────────────────── */
export const WithLink = {
    render: () => (_jsxs(Tooltip, { defaultOpen: true, children: [_jsx(TooltipTrigger, { asChild: true, children: _jsx(Button, { children: "With link" }) }), _jsxs(TooltipContent, { title: "Sales CRM", titleIcon: "bell", maxWidth: 260, image: _jsx("div", { className: "h-[100px] w-full", style: {
                        background: "linear-gradient(135deg, var(--color-primary-selected-color) 0%, var(--color-primary-color) 100%)",
                    }, "aria-hidden": "true" }), children: ["Manage all stages of customer lifecycle in one place,", " ", _jsx(Link, { href: "#", surface: "inverted", size: "sm", children: "read more" }), "."] })] })),
};
/* ─────────────────────────────  With image  ────────────────────────────── */
export const WithImage = {
    render: () => (_jsxs(Tooltip, { defaultOpen: true, children: [_jsx(TooltipTrigger, { asChild: true, children: _jsx(Button, { children: "With image" }) }), _jsx(TooltipContent, { side: "right", image: _jsx("img", { src: SAMPLE_IMAGE, alt: "", className: "h-[136px] w-full object-cover" }), children: "Tooltip label" })] })),
};
/* ─────────────────────────────  Theme variants  ────────────────────────── */
export const Themes = {
    render: () => (_jsxs("div", { className: "grid grid-cols-3 gap-6 p-12", children: [_jsx("div", { className: "flex h-32 items-center justify-center rounded-md bg-[var(--color-primary-background-color)] border border-[var(--color-layout-border-color)]", children: _jsxs(Tooltip, { defaultOpen: true, children: [_jsx(TooltipTrigger, { asChild: true, children: _jsx(Button, { children: "default" }) }), _jsx(TooltipContent, { theme: "default", children: "Tooltip label" })] }) }), _jsx("div", { className: "flex h-32 items-center justify-center rounded-md", style: { backgroundColor: "#1F1834" }, children: _jsxs(Tooltip, { defaultOpen: true, children: [_jsx(TooltipTrigger, { asChild: true, children: _jsx(Button, { children: "on-dark" }) }), _jsx(TooltipContent, { theme: "on-dark", children: "Tooltip label" })] }) }), _jsx("div", { className: "flex h-32 items-center justify-center rounded-md", style: { backgroundColor: "#1E2026" }, children: _jsxs(Tooltip, { defaultOpen: true, children: [_jsx(TooltipTrigger, { asChild: true, children: _jsx(Button, { children: "on-black" }) }), _jsx(TooltipContent, { theme: "on-black", children: "Tooltip label" })] }) })] })),
};
/* ─────────────────────────────  Custom max width  ──────────────────────── */
export const CustomMaxWidth = {
    render: () => (_jsxs(Tooltip, { defaultOpen: true, children: [_jsx(TooltipTrigger, { asChild: true, children: _jsx(Button, { children: "Long body" }) }), _jsx(TooltipContent, { maxWidth: 320, children: "Tooltips can wrap to multiple lines once their content exceeds the configured maximum width \u2014 240px by default, customizable via the maxWidth prop." })] })),
};
