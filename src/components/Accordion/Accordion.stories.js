import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./Accordion";
const meta = {
    title: "Components/Accordion",
    component: Accordion,
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component: 'Accordion is a vertically stacked list of items. Each item can be "expanded" or "collapsed" to reveal the content within with that item. Sourced from the TimeWorks Figma file (page "Accordion", node 46939:2840).',
            },
        },
    },
    tags: ["autodocs"],
    argTypes: {
        type: {
            control: "select",
            options: ["single", "multiple"],
        },
    },
    args: {
        type: "single",
    },
};
export default meta;
const ITEMS = [
    {
        value: "notifications",
        title: "Notifications",
        body: "Get notified when teammates mention you, assign you a task, or comment on something you follow.",
    },
    {
        value: "privacy",
        title: "Privacy",
        body: "Control who can see your profile, what data is shared with workspaces you join, and how long activity logs are retained.",
    },
    {
        value: "appearance",
        title: "Appearance",
        body: "Pick light or dark theme, density, and the accent color used across the app.",
    },
];
export const Playground = {
    args: {
        type: "single",
        collapsible: true,
        defaultValue: "notifications",
    },
    render: (args) => (_jsx("div", { className: "max-w-md", children: _jsx(Accordion, { ...args, children: ITEMS.map((item) => (_jsxs(AccordionItem, { value: item.value, children: [_jsx(AccordionTrigger, { children: item.title }), _jsx(AccordionContent, { children: item.body })] }, item.value))) }) })),
};
export const SingleCollapsible = {
    name: "Type · single (collapsible)",
    render: () => (_jsx("div", { className: "max-w-md", children: _jsx(Accordion, { type: "single", collapsible: true, defaultValue: "notifications", children: ITEMS.map((item) => (_jsxs(AccordionItem, { value: item.value, children: [_jsx(AccordionTrigger, { children: item.title }), _jsx(AccordionContent, { children: item.body })] }, item.value))) }) })),
};
export const Multiple = {
    name: "Type · multiple",
    render: () => (_jsx("div", { className: "max-w-md", children: _jsx(Accordion, { type: "multiple", defaultValue: ["notifications", "appearance"], children: ITEMS.map((item) => (_jsxs(AccordionItem, { value: item.value, children: [_jsx(AccordionTrigger, { children: item.title }), _jsx(AccordionContent, { children: item.body })] }, item.value))) }) })),
};
export const WithLeadingIcons = {
    name: "Icon · leading",
    render: () => (_jsx("div", { className: "max-w-md", children: _jsxs(Accordion, { type: "single", collapsible: true, defaultValue: "notifications", children: [_jsxs(AccordionItem, { value: "notifications", children: [_jsx(AccordionTrigger, { icon: "bell", children: "Notifications" }), _jsx(AccordionContent, { children: ITEMS[0].body })] }), _jsxs(AccordionItem, { value: "privacy", children: [_jsx(AccordionTrigger, { icon: "lock", children: "Privacy" }), _jsx(AccordionContent, { children: ITEMS[1].body })] }), _jsxs(AccordionItem, { value: "appearance", children: [_jsx(AccordionTrigger, { icon: "gears", children: "Appearance" }), _jsx(AccordionContent, { children: ITEMS[2].body })] })] }) })),
};
export const States = {
    name: "States · regular / hover / disabled",
    render: () => (_jsxs("div", { className: "max-w-md space-y-6", children: [_jsxs("div", { children: [_jsx("p", { className: "mb-2 text-t3 font-semibold uppercase tracking-wide text-[var(--color-secondary-text-color)]", children: "Regular (one item, collapsed / expanded)" }), _jsxs(Accordion, { type: "single", collapsible: true, defaultValue: "b", children: [_jsxs(AccordionItem, { value: "a", children: [_jsx(AccordionTrigger, { children: "Notifications" }), _jsx(AccordionContent, { children: ITEMS[0].body })] }), _jsxs(AccordionItem, { value: "b", children: [_jsx(AccordionTrigger, { children: "Privacy" }), _jsx(AccordionContent, { children: ITEMS[1].body })] })] })] }), _jsxs("div", { children: [_jsx("p", { className: "mb-2 text-t3 font-semibold uppercase tracking-wide text-[var(--color-secondary-text-color)]", children: "Disabled item" }), _jsxs(Accordion, { type: "single", collapsible: true, children: [_jsxs(AccordionItem, { value: "a", children: [_jsx(AccordionTrigger, { children: "Notifications" }), _jsx(AccordionContent, { children: ITEMS[0].body })] }), _jsxs(AccordionItem, { value: "b", disabled: true, children: [_jsx(AccordionTrigger, { children: "Privacy (disabled)" }), _jsx(AccordionContent, { children: ITEMS[1].body })] }), _jsxs(AccordionItem, { value: "c", children: [_jsx(AccordionTrigger, { children: "Appearance" }), _jsx(AccordionContent, { children: ITEMS[2].body })] })] })] })] })),
};
