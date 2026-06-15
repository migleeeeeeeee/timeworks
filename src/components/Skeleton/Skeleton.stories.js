import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Skeleton } from "./Skeleton";
const meta = {
    title: "Components/Skeleton",
    component: Skeleton,
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component: 'Skeleton placeholder shown while content loads. Sourced from the TimeWorks Figma file (page "Skeleton loading", node 46949:1064). Compose `circle`, `rectangle`, and `text` (h1/h2/paragraph) primitives to mimic the eventual UI. Pulses by default; pass `animated={false}` for a static placeholder.',
            },
        },
    },
    tags: ["autodocs"],
    argTypes: {
        type: { control: "radio", options: ["circle", "rectangle", "text"] },
        size: { control: "radio", options: ["h1", "h2", "paragraph"] },
        width: { control: "text" },
        height: { control: "text" },
        animated: { control: "boolean" },
    },
    args: {
        type: "circle",
        size: "paragraph",
        animated: true,
    },
};
export default meta;
const Cell = ({ label, children }) => (_jsxs("div", { className: "flex flex-col gap-2", children: [_jsx("span", { className: "text-t3 text-[var(--color-secondary-text-color)] uppercase tracking-wide", children: label }), children] }));
export const Playground = {};
export const Types = {
    render: () => (_jsxs("div", { className: "flex flex-wrap items-end gap-10", children: [_jsx(Cell, { label: "Circle \u00B7 38\u00D738", children: _jsx(Skeleton, { type: "circle" }) }), _jsx(Cell, { label: "Rectangle \u00B7 144\u00D7144", children: _jsx(Skeleton, { type: "rectangle" }) }), _jsx(Cell, { label: "Text \u00B7 H1 \u00B7 162\u00D732", children: _jsx(Skeleton, { type: "text", size: "h1" }) }), _jsx(Cell, { label: "Text \u00B7 H2 \u00B7 162\u00D724", children: _jsx(Skeleton, { type: "text", size: "h2" }) }), _jsx(Cell, { label: "Text \u00B7 Paragraph \u00B7 162\u00D716", children: _jsx(Skeleton, { type: "text", size: "paragraph" }) })] })),
};
export const Animation = {
    render: () => (_jsxs("div", { className: "flex flex-col gap-6", children: [_jsx(Cell, { label: "Animated (default)", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Skeleton, { type: "circle" }), _jsx(Skeleton, { type: "text", size: "paragraph", width: 220 })] }) }), _jsx(Cell, { label: "Static \u00B7 animated={false}", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Skeleton, { type: "circle", animated: false }), _jsx(Skeleton, { type: "text", size: "paragraph", width: 220, animated: false })] }) })] })),
};
export const CustomSize = {
    render: () => (_jsxs("div", { className: "flex flex-col gap-6 w-[480px]", children: [_jsx(Cell, { label: "Fluid width \u00B7 width='100%'", children: _jsx(Skeleton, { type: "text", size: "h2", width: "100%" }) }), _jsx(Cell, { label: "Tall rectangle \u00B7 320\u00D780", children: _jsx(Skeleton, { type: "rectangle", width: 320, height: 80 }) }), _jsx(Cell, { label: "Larger circle \u00B7 64\u00D764", children: _jsx(Skeleton, { type: "circle", width: 64, height: 64 }) })] })),
};
export const ProfileCard = {
    name: "Composed · Profile card",
    render: () => (_jsxs("div", { className: "flex flex-col gap-3 w-80 p-4 rounded-lg border border-[var(--color-layout-border-color)] bg-[var(--color-primary-background-color)]", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Skeleton, { type: "circle" }), _jsx(Skeleton, { type: "text", size: "paragraph", width: 93 })] }), _jsxs("div", { className: "flex items-start gap-4 w-full", children: [_jsx(Skeleton, { type: "rectangle", width: 144, height: 144 }), _jsxs("div", { className: "flex flex-col gap-2 flex-1 min-w-0", children: [_jsx(Skeleton, { type: "text", size: "h1", width: "100%" }), _jsx(Skeleton, { type: "text", size: "paragraph", width: "100%" }), _jsx(Skeleton, { type: "text", size: "paragraph", width: "100%" }), _jsx(Skeleton, { type: "text", size: "paragraph", width: "100%" }), _jsx(Skeleton, { type: "text", size: "paragraph", width: 100 })] })] })] })),
};
export const ListRows = {
    name: "Composed · List rows",
    render: () => (_jsx("div", { className: "flex flex-col gap-4 w-[420px]", children: Array.from({ length: 4 }).map((_, i) => (_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Skeleton, { type: "circle" }), _jsxs("div", { className: "flex flex-col gap-2 flex-1", children: [_jsx(Skeleton, { type: "text", size: "h2", width: "60%" }), _jsx(Skeleton, { type: "text", size: "paragraph", width: "90%" })] })] }, i))) })),
};
