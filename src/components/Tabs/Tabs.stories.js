import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./Tabs";
import { Text } from "../Text";
const meta = {
    title: "Components/Tabs",
    component: Tabs,
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component: 'Horizontal tabs for navigating between related views. Sourced from the TimeWorks Figma file (page "Tabs", node 46939:7916). Compositional API mirrors Radix UI: `Tabs` / `TabsList` / `TabsTrigger` / `TabsContent`. Trigger types include plain text, leading icon, trailing icon, and counter (`/ N`). `TabsList` accepts a `stretched` prop that forces tabs to share the available width.',
            },
        },
    },
    tags: ["autodocs"],
    argTypes: {
        onColor: { control: "radio", options: ["light", "dark"] },
        defaultValue: { control: "text" },
    },
    args: {
        defaultValue: "overview",
        onColor: "light",
    },
};
export default meta;
const Cell = ({ label, children, onColor = "light", }) => (_jsxs("div", { className: "flex flex-col gap-3", children: [_jsx("span", { className: "text-t3 text-[var(--color-secondary-text-color)] uppercase tracking-wide", children: label }), _jsx("div", { className: onColor === "dark"
                ? "rounded-md bg-[var(--color-inverted-color-background)] p-6"
                : "rounded-md bg-[var(--color-primary-background-color)] p-6 border border-[var(--color-layout-border-color)]", children: children })] }));
export const Playground = {
    render: (args) => (_jsxs(Tabs, { ...args, children: [_jsxs(TabsList, { "aria-label": "Sections", children: [_jsx(TabsTrigger, { value: "overview", children: "Overview" }), _jsx(TabsTrigger, { value: "details", children: "Details" }), _jsx(TabsTrigger, { value: "usage", children: "Usage" }), _jsx(TabsTrigger, { value: "archived", disabled: true, children: "Archived" })] }), _jsx(TabsContent, { value: "overview", children: _jsx(Text, { variant: "t1", children: "Overview content." }) }), _jsx(TabsContent, { value: "details", children: _jsx(Text, { variant: "t1", children: "Details content." }) }), _jsx(TabsContent, { value: "usage", children: _jsx(Text, { variant: "t1", children: "Usage content." }) }), _jsx(TabsContent, { value: "archived", children: _jsx(Text, { variant: "t1", children: "Archived content." }) })] })),
};
export const Types = {
    render: (args) => (_jsxs("div", { className: "flex flex-col gap-8", children: [_jsx(Cell, { label: "Plain", children: _jsx(Tabs, { ...args, defaultValue: "a", children: _jsxs(TabsList, { children: [_jsx(TabsTrigger, { value: "a", children: "Tab" }), _jsx(TabsTrigger, { value: "b", children: "Tab" }), _jsx(TabsTrigger, { value: "c", children: "Tab" })] }) }) }), _jsx(Cell, { label: "Counter", children: _jsx(Tabs, { ...args, defaultValue: "a", children: _jsxs(TabsList, { children: [_jsx(TabsTrigger, { value: "a", counter: 2, children: "Tab" }), _jsx(TabsTrigger, { value: "b", counter: 5, children: "Tab" }), _jsx(TabsTrigger, { value: "c", counter: 12, children: "Tab" })] }) }) }), _jsx(Cell, { label: "Left icon", children: _jsx(Tabs, { ...args, defaultValue: "a", children: _jsxs(TabsList, { children: [_jsx(TabsTrigger, { value: "a", leftIcon: "house", children: "Tab" }), _jsx(TabsTrigger, { value: "b", leftIcon: "bell", children: "Tab" }), _jsx(TabsTrigger, { value: "c", leftIcon: "globe", children: "Tab" })] }) }) }), _jsx(Cell, { label: "Right icon", children: _jsx(Tabs, { ...args, defaultValue: "a", children: _jsxs(TabsList, { children: [_jsx(TabsTrigger, { value: "a", rightIcon: "chevron-down", children: "Tab" }), _jsx(TabsTrigger, { value: "b", rightIcon: "chevron-down", children: "Tab" }), _jsx(TabsTrigger, { value: "c", rightIcon: "chevron-down", children: "Tab" })] }) }) })] })),
};
export const States = {
    render: (args) => (_jsx(Cell, { label: "Default \u00B7 hover (try it) \u00B7 selected \u00B7 disabled", children: _jsx(Tabs, { ...args, defaultValue: "selected", children: _jsxs(TabsList, { children: [_jsx(TabsTrigger, { value: "default", children: "Default" }), _jsx(TabsTrigger, { value: "selected", children: "Selected" }), _jsx(TabsTrigger, { value: "more", children: "Hover me" }), _jsx(TabsTrigger, { value: "disabled", disabled: true, children: "Disabled" })] }) }) })),
};
export const Stretched = {
    render: (args) => (_jsxs("div", { className: "flex flex-col gap-8", children: [_jsx(Cell, { label: "stretched = false (default)", children: _jsx(Tabs, { ...args, defaultValue: "a", children: _jsxs(TabsList, { children: [_jsx(TabsTrigger, { value: "a", children: "Overview" }), _jsx(TabsTrigger, { value: "b", children: "Activity" }), _jsx(TabsTrigger, { value: "c", children: "Members" }), _jsx(TabsTrigger, { value: "d", children: "Settings" })] }) }) }), _jsx(Cell, { label: "stretched = true", children: _jsx(Tabs, { ...args, defaultValue: "a", children: _jsxs(TabsList, { stretched: true, children: [_jsx(TabsTrigger, { value: "a", children: "Overview" }), _jsx(TabsTrigger, { value: "b", children: "Activity" }), _jsx(TabsTrigger, { value: "c", children: "Members" }), _jsx(TabsTrigger, { value: "d", children: "Settings" })] }) }) })] })),
};
export const Counts = {
    render: (args) => (_jsx("div", { className: "flex flex-col gap-6", children: [2, 3, 5, 7, 10].map((n) => (_jsx(Cell, { label: `${n} tabs`, children: _jsx(Tabs, { ...args, defaultValue: "0", children: _jsx(TabsList, { stretched: true, children: Array.from({ length: n }, (_, i) => (_jsx(TabsTrigger, { value: String(i), children: `Tab ${i + 1}` }, i))) }) }) }, n))) })),
};
export const DarkSurface = {
    render: (args) => (_jsx(Cell, { label: "onColor = dark", onColor: "dark", children: _jsxs(Tabs, { ...args, onColor: "dark", defaultValue: "overview", children: [_jsxs(TabsList, { children: [_jsx(TabsTrigger, { value: "overview", children: "Overview" }), _jsx(TabsTrigger, { value: "activity", counter: 4, children: "Activity" }), _jsx(TabsTrigger, { value: "members", leftIcon: "users-grp", children: "Members" }), _jsx(TabsTrigger, { value: "archived", disabled: true, children: "Archived" })] }), _jsx(TabsContent, { value: "overview", children: _jsx(Text, { variant: "t1", className: "!text-[var(--color-text-color-on-inverted)]", children: "Overview content on dark." }) })] }) })),
};
export const Controlled = {
    render: (args) => {
        const [value, setValue] = useState("a");
        return (_jsxs("div", { className: "flex flex-col gap-3", children: [_jsxs(Tabs, { ...args, value: value, onValueChange: setValue, children: [_jsxs(TabsList, { children: [_jsx(TabsTrigger, { value: "a", children: "Alpha" }), _jsx(TabsTrigger, { value: "b", children: "Beta" }), _jsx(TabsTrigger, { value: "c", children: "Gamma" })] }), _jsx(TabsContent, { value: "a", children: _jsx(Text, { variant: "t1", children: "Alpha panel." }) }), _jsx(TabsContent, { value: "b", children: _jsx(Text, { variant: "t1", children: "Beta panel." }) }), _jsx(TabsContent, { value: "c", children: _jsx(Text, { variant: "t1", children: "Gamma panel." }) })] }), _jsxs("span", { className: "text-t3 text-[var(--color-secondary-text-color)]", children: ["Active value: ", _jsx("code", { children: value })] })] }));
    },
};
