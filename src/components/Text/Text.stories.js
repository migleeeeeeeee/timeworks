import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Text } from "./Text";
const meta = {
    title: "Foundations/Typography",
    component: Text,
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component: "Typography primitive sourced from the TimeWorks Figma file (page \"■ Typography\"). Headings use Montserrat; text styles use Karla. The `link` prop renders the underlined Text variants from the spec.",
            },
        },
    },
    tags: ["autodocs"],
    argTypes: {
        variant: {
            control: "select",
            options: ["h1", "h2", "h3", "t1", "t2", "t3"],
        },
        weight: {
            control: "select",
            options: ["light", "regular", "medium", "semibold", "bold"],
        },
        link: { control: "boolean" },
        children: { control: "text" },
    },
    args: {
        children: "Impact how teams work across the globe",
    },
};
export default meta;
export const Playground = {
    args: {
        variant: "h1",
        weight: "bold",
    },
};
const SAMPLE = "Impact how teams work across the globe";
const SCALE = [
    {
        variant: "h1",
        family: "Montserrat",
        size: "32 / 40",
        weights: [
            { weight: "bold", label: "Bold · 700" },
            { weight: "semibold", label: "SemiBold · 600" },
            { weight: "medium", label: "Medium · 500" },
            { weight: "regular", label: "Regular · 400" },
        ],
    },
    {
        variant: "h2",
        family: "Montserrat",
        size: "24 / 30",
        weights: [
            { weight: "bold", label: "Bold · 700" },
            { weight: "semibold", label: "SemiBold · 600" },
            { weight: "medium", label: "Medium · 500" },
            { weight: "light", label: "Light · 300" },
        ],
    },
    {
        variant: "h3",
        family: "Montserrat",
        size: "18 / 24",
        weights: [
            { weight: "bold", label: "Bold · 700" },
            { weight: "semibold", label: "SemiBold · 600" },
            { weight: "medium", label: "Medium · 500" },
            { weight: "light", label: "Light · 300" },
        ],
    },
    {
        variant: "t1",
        family: "Karla",
        size: "16 / 22",
        weights: [
            { weight: "bold", label: "Bold · 700" },
            { weight: "semibold", label: "SemiBold · 600" },
            { weight: "regular", label: "Regular · 400" },
            { weight: "regular", label: "Regular-link · 400", link: true },
        ],
    },
    {
        variant: "t2",
        family: "Karla",
        size: "14 / 20",
        weights: [
            { weight: "bold", label: "Bold · 700" },
            { weight: "semibold", label: "SemiBold · 600" },
            { weight: "regular", label: "Regular · 400" },
            { weight: "regular", label: "Regular-link · 400", link: true },
        ],
    },
    {
        variant: "t3",
        family: "Karla",
        size: "12 / 16",
        weights: [
            { weight: "semibold", label: "SemiBold · 600" },
            { weight: "regular", label: "Regular · 400" },
            { weight: "regular", label: "Regular-link · 400", link: true },
        ],
    },
];
const VARIANT_LABEL = {
    h1: "Heading 1",
    h2: "Heading 2",
    h3: "Heading 3",
    t1: "Text 1",
    t2: "Text 2",
    t3: "Text 3",
};
export const Scale = {
    parameters: {
        docs: {
            description: {
                story: "Full type scale — every variant × every weight defined in the Figma spec.",
            },
        },
    },
    render: () => (_jsx("div", { className: "flex flex-col gap-12", children: SCALE.map((row) => (_jsxs("section", { className: "flex flex-col gap-4", children: [_jsxs("header", { className: "flex items-baseline gap-3 border-b border-zinc-200 pb-2", children: [_jsx(Text, { as: "h2", variant: "h2", weight: "semibold", children: VARIANT_LABEL[row.variant] }), _jsxs(Text, { variant: "t3", weight: "regular", className: "text-zinc-500", children: [row.family, " \u00B7 ", row.size] })] }), _jsx("div", { className: "grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2", children: row.weights.map((w) => (_jsxs("div", { className: "flex flex-col gap-1", children: [_jsx(Text, { variant: "t3", weight: "semibold", className: "text-zinc-500", children: w.label }), _jsx(Text, { variant: row.variant, weight: w.weight, link: w.link, children: SAMPLE })] }, w.label))) })] }, row.variant))) })),
};
export const Headings = {
    render: () => (_jsxs("div", { className: "flex flex-col gap-4", children: [_jsxs(Text, { variant: "h1", weight: "bold", children: ["Heading 1 \u2014 ", SAMPLE] }), _jsxs(Text, { variant: "h2", weight: "semibold", children: ["Heading 2 \u2014 ", SAMPLE] }), _jsxs(Text, { variant: "h3", weight: "semibold", children: ["Heading 3 \u2014 ", SAMPLE] })] })),
};
export const BodyText = {
    render: () => (_jsxs("div", { className: "flex flex-col gap-4", children: [_jsxs(Text, { variant: "t1", children: ["Text 1 (16/22) \u2014 ", SAMPLE] }), _jsxs(Text, { variant: "t2", children: ["Text 2 (14/20) \u2014 ", SAMPLE] }), _jsxs(Text, { variant: "t3", children: ["Text 3 (12/16) \u2014 ", SAMPLE] }), _jsx(Text, { variant: "t1", link: true, children: "Text 1 link variant" })] })),
};
