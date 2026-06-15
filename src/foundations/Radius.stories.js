import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const RADII = [
    {
        cssVar: "0",
        name: "Rounded/None",
        utility: "rounded-none",
        value: "0",
        usage: "Edges that meet other edges flush — full-bleed bands, dividers, table cells.",
        previewSize: 88,
    },
    {
        cssVar: "--radius-sm",
        name: "Rounded/4",
        utility: "rounded-sm",
        value: "4px",
        usage: "Tight UI accents — chips, tags, dense table affordances.",
        previewSize: 88,
    },
    {
        cssVar: "--radius-md",
        name: "Rounded/8",
        utility: "rounded-md",
        value: "8px",
        usage: "Default for interactive controls — buttons, inputs, selects, switches.",
        previewSize: 112,
    },
    {
        cssVar: "--radius-lg",
        name: "Rounded/12",
        utility: "rounded-lg",
        value: "12px",
        usage: "Surfaces that lift off the page — cards, modals, popovers.",
        previewSize: 136,
    },
    {
        cssVar: "--radius-xl",
        name: "Rounded/16",
        utility: "rounded-xl",
        value: "16px",
        usage: "Large featured surfaces — hero panels, illustrative containers.",
        previewSize: 160,
    },
    {
        cssVar: "--radius-2xl",
        name: "Rounded/24",
        utility: "rounded-2xl",
        value: "24px",
        usage: "Oversized presentational surfaces where softness is the point — onboarding cards, marketing tiles.",
        previewSize: 184,
    },
    {
        cssVar: "9999px",
        name: "Rounded/Full",
        utility: "rounded-full",
        value: "9999px",
        usage: "Pills and circular elements — avatars, badges, segmented toggles.",
        previewSize: 88,
    },
];
function radiusValue(token) {
    if (token.cssVar.startsWith("--"))
        return `var(${token.cssVar})`;
    return token.cssVar;
}
function RadiusRow({ token }) {
    return (_jsxs("tr", { style: { borderBottom: "1px solid var(--color-layout-border-color)" }, children: [_jsx("td", { className: "py-6 pr-6 align-middle", children: _jsx("div", { className: "flex items-center justify-center", style: {
                        background: "var(--color-allgrey-background-color)",
                        width: 224,
                        height: 224,
                        borderRadius: "var(--radius-xl)",
                    }, children: _jsx("div", { style: {
                            background: "var(--color-primary-color)",
                            width: token.previewSize,
                            height: token.previewSize,
                            borderRadius: radiusValue(token),
                        }, "aria-label": `${token.name} preview` }) }) }), _jsx("td", { className: "py-6 pr-6 align-middle", children: _jsxs("div", { className: "flex flex-col gap-0.5", children: [_jsx("code", { className: "text-t2 font-mono", style: { color: "var(--color-primary-text-color)" }, children: token.name }), _jsx("code", { className: "text-t3 font-mono", style: { color: "var(--color-secondary-text-color)" }, children: token.cssVar.startsWith("--") ? token.cssVar : "—" }), _jsxs("code", { className: "text-t3 font-mono", style: { color: "var(--color-secondary-text-color)" }, children: ["class: ", token.utility] })] }) }), _jsx("td", { className: "py-6 pr-6 align-middle", children: _jsx("code", { className: "text-t2 font-mono", style: { color: "var(--color-primary-text-color)" }, children: token.value }) }), _jsx("td", { className: "py-6 align-middle", children: _jsx("span", { className: "text-t2", style: { color: "var(--color-secondary-text-color)" }, children: token.usage }) })] }));
}
function RadiusSheet() {
    return (_jsxs("div", { className: "flex flex-col gap-12 px-10 py-10", style: { background: "var(--color-primary-background-color)", color: "var(--color-primary-text-color)" }, children: [_jsxs("div", { className: "flex max-w-3xl flex-col gap-3", children: [_jsx("h1", { className: "text-h1 font-heading font-bold", children: "Border radius" }), _jsxs("p", { className: "text-t1", style: { color: "var(--color-secondary-text-color)" }, children: ["Border radius softens the corners of UI surfaces and signals their role. Smaller radii read as utility (chips, dense controls); larger radii read as content surfaces (cards, modals). Each step is exposed as a CSS custom property in", " ", _jsx("code", { style: { color: "var(--color-primary-text-color)" }, children: "src/index.css" }), " under Tailwind v4\u2019s", " ", _jsx("code", { style: { color: "var(--color-primary-text-color)" }, children: "@theme" }), " block, so the value ships as a utility (e.g.", " ", _jsx("code", { style: { color: "var(--color-primary-text-color)" }, children: "rounded-md" }), ")."] }), _jsx("p", { className: "text-t1", style: { color: "var(--color-secondary-text-color)" }, children: "Components must consume radii through these tokens \u2014 never hardcode a raw pixel value in component code. Sourced from the Figma file (page \u201CBorder radius\u201D, node 46817:1236) via the Tokens Studio export." })] }), _jsxs("section", { className: "flex flex-col gap-4", children: [_jsxs("header", { className: "flex flex-col gap-2", children: [_jsx("h2", { className: "text-h2 font-heading font-semibold", style: { color: "var(--color-primary-text-color)" }, children: "The radius scale" }), _jsxs("p", { className: "text-t1 max-w-prose", style: { color: "var(--color-secondary-text-color)" }, children: ["The default for interactive controls is", " ", _jsx("code", { style: { color: "var(--color-primary-text-color)" }, children: "rounded-md" }), " (8px). Cards and modals step up to", " ", _jsx("code", { style: { color: "var(--color-primary-text-color)" }, children: "rounded-lg" }), " (12px). Use", " ", _jsx("code", { style: { color: "var(--color-primary-text-color)" }, children: "rounded-full" }), " only for pills and circular elements."] })] }), _jsxs("table", { className: "w-full border-collapse text-left", children: [_jsx("thead", { children: _jsxs("tr", { style: { borderBottom: "1px solid var(--color-ui-border-color)" }, children: [_jsx("th", { className: "text-t3 pb-3 pr-6 font-semibold uppercase tracking-wide", style: { color: "var(--color-secondary-text-color)", width: "264px" }, children: "Sample" }), _jsx("th", { className: "text-t3 pb-3 pr-6 font-semibold uppercase tracking-wide", style: { color: "var(--color-secondary-text-color)", width: "240px" }, children: "Token" }), _jsx("th", { className: "text-t3 pb-3 pr-6 font-semibold uppercase tracking-wide", style: { color: "var(--color-secondary-text-color)", width: "120px" }, children: "Value" }), _jsx("th", { className: "text-t3 pb-3 font-semibold uppercase tracking-wide", style: { color: "var(--color-secondary-text-color)" }, children: "Usage" })] }) }), _jsx("tbody", { children: RADII.map((t) => (_jsx(RadiusRow, { token: t }, t.utility))) })] })] })] }));
}
const meta = {
    title: "Foundations/Border radius",
    component: RadiusSheet,
    parameters: {
        layout: "fullscreen",
    },
};
export default meta;
export const BorderRadius = {};
