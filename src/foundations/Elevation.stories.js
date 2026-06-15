import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const ELEVATIONS = [
    {
        cssVar: "--shadow-lg",
        name: "Shadow/Large",
        utility: "shadow-lg",
        value: "0 15px 50px 0 rgba(0, 0, 0, 0.3)",
        usage: "Extra-large surfaces that float well above the page — modals, popovers anchored over busy content.",
        previewSize: 168,
    },
    {
        cssVar: "--shadow-md",
        name: "Shadow/Medium",
        utility: "shadow-md",
        value: "0 6px 20px 0 rgba(0, 0, 0, 0.2)",
        usage: "Large elements lifted off the canvas — menus, dropdowns, raised cards.",
        previewSize: 120,
    },
    {
        cssVar: "--shadow-sm",
        name: "Shadow/Small",
        utility: "shadow-sm",
        value: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
        usage: "Medium elements with a clear separation from their surface — tooltips, toasts, hover-state cards.",
        previewSize: 80,
    },
    {
        cssVar: "--shadow-xs",
        name: "Shadow/XS",
        utility: "shadow-xs",
        value: "0 4px 6px -4px rgba(0, 0, 0, 0.1)",
        usage: "Small elements that need only a hint of lift — chips, tags, low-emphasis buttons on hover.",
        previewSize: 56,
    },
];
function ElevationRow({ token }) {
    return (_jsxs("tr", { style: { borderBottom: "1px solid var(--color-layout-border-color)" }, children: [_jsx("td", { className: "py-6 pr-6 align-middle", children: _jsx("div", { className: "flex items-center justify-center rounded-2xl", style: {
                        background: "var(--color-allgrey-background-color)",
                        width: 200,
                        height: 200,
                    }, children: _jsx("div", { className: "rounded-[14px]", style: {
                            background: "var(--color-primary-background-color)",
                            width: token.previewSize,
                            height: token.previewSize,
                            boxShadow: `var(${token.cssVar})`,
                        }, "aria-label": `${token.name} preview` }) }) }), _jsx("td", { className: "py-6 pr-6 align-middle", children: _jsxs("div", { className: "flex flex-col gap-0.5", children: [_jsx("code", { className: "text-t2 font-mono", style: { color: "var(--color-primary-text-color)" }, children: token.name }), _jsx("code", { className: "text-t3 font-mono", style: { color: "var(--color-secondary-text-color)" }, children: token.cssVar }), _jsxs("code", { className: "text-t3 font-mono", style: { color: "var(--color-secondary-text-color)" }, children: ["class: ", token.utility] })] }) }), _jsx("td", { className: "py-6 pr-6 align-middle", children: _jsx("code", { className: "text-t2 font-mono", style: { color: "var(--color-primary-text-color)" }, children: token.value }) }), _jsx("td", { className: "py-6 align-middle", children: _jsx("span", { className: "text-t2", style: { color: "var(--color-secondary-text-color)" }, children: token.usage }) })] }));
}
function ElevationSheet() {
    return (_jsxs("div", { className: "flex flex-col gap-12 px-10 py-10", style: { background: "var(--color-primary-background-color)", color: "var(--color-primary-text-color)" }, children: [_jsxs("div", { className: "flex max-w-3xl flex-col gap-3", children: [_jsx("h1", { className: "text-h1 font-heading font-bold", children: "Elevation" }), _jsxs("p", { className: "text-t1", style: { color: "var(--color-secondary-text-color)" }, children: ["Shadows express the level of elevation between surfaces. Use them consistently \u2014 items that share an elevation cannot occupy the same space. Each elevation is exposed as a CSS custom property in", " ", _jsx("code", { style: { color: "var(--color-primary-text-color)" }, children: "src/index.css" }), " under Tailwind v4\u2019s", " ", _jsx("code", { style: { color: "var(--color-primary-text-color)" }, children: "@theme" }), " block, which makes it available as a utility (e.g.", " ", _jsx("code", { style: { color: "var(--color-primary-text-color)" }, children: "shadow-md" }), ")."] }), _jsxs("p", { className: "text-t1", style: { color: "var(--color-secondary-text-color)" }, children: ["Components must consume elevations through these tokens \u2014 never hardcode a raw shadow string in component code. Sourced verbatim from the Figma file (page \u201CElevation\u201D, node 46814:2892) via the Tokens Studio export at", " ", _jsx("code", { style: { color: "var(--color-primary-text-color)" }, children: "src/tokens/source/Global.json" }), "."] })] }), _jsxs("section", { className: "flex flex-col gap-4", children: [_jsxs("header", { className: "flex flex-col gap-2", children: [_jsx("h2", { className: "text-h2 font-heading font-semibold", style: { color: "var(--color-primary-text-color)" }, children: "The elevation scale" }), _jsx("p", { className: "text-t1 max-w-prose", style: { color: "var(--color-secondary-text-color)" }, children: "Pick the lowest elevation that still reads clearly against its parent surface. Larger elements take heavier shadows because they sit further from the canvas; small chips and tags only need a whisper of lift." })] }), _jsxs("table", { className: "w-full border-collapse text-left", children: [_jsx("thead", { children: _jsxs("tr", { style: { borderBottom: "1px solid var(--color-ui-border-color)" }, children: [_jsx("th", { className: "text-t3 pb-3 pr-6 font-semibold uppercase tracking-wide", style: { color: "var(--color-secondary-text-color)", width: "240px" }, children: "Sample" }), _jsx("th", { className: "text-t3 pb-3 pr-6 font-semibold uppercase tracking-wide", style: { color: "var(--color-secondary-text-color)", width: "260px" }, children: "Token" }), _jsx("th", { className: "text-t3 pb-3 pr-6 font-semibold uppercase tracking-wide", style: { color: "var(--color-secondary-text-color)", width: "320px" }, children: "Value" }), _jsx("th", { className: "text-t3 pb-3 font-semibold uppercase tracking-wide", style: { color: "var(--color-secondary-text-color)" }, children: "Usage" })] }) }), _jsx("tbody", { children: ELEVATIONS.map((t) => (_jsx(ElevationRow, { token: t }, t.cssVar))) })] })] })] }));
}
const meta = {
    title: "Foundations/Elevation",
    component: ElevationSheet,
    parameters: {
        layout: "fullscreen",
    },
};
export default meta;
export const Elevation = {};
