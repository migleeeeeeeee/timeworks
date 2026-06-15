import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Divider } from "./Divider";
import { Text } from "../Text";
import { Avatar } from "../Avatar";
const meta = {
    title: "Components/Divider",
    component: Divider,
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component: 'Divider draws a 1px line in `--color-layout-border-color` to separate content groups. Sourced from the TimeWorks Figma file (page "Divider", node 46946:1080). Defaults to decorative (`role="none"`); pass `decorative={false}` to expose it as a semantic separator.',
            },
        },
    },
    tags: ["autodocs"],
    argTypes: {
        orientation: { control: "radio", options: ["horizontal", "vertical"] },
        decorative: { control: "boolean" },
    },
    args: {
        orientation: "horizontal",
        decorative: true,
    },
};
export default meta;
export const Playground = {
    render: (args) => (_jsxs("div", { className: args.orientation === "vertical"
            ? "flex h-24 items-stretch gap-4"
            : "flex flex-col gap-4 w-80", children: [_jsx(Text, { variant: "t2", children: "Above / before" }), _jsx(Divider, { ...args }), _jsx(Text, { variant: "t2", children: "Below / after" })] })),
};
export const Horizontal = {
    render: () => (_jsxs("div", { className: "flex flex-col gap-3 w-96", children: [_jsx(Text, { variant: "t2", weight: "semibold", children: "Account" }), _jsx(Text, { variant: "t3", className: "text-[var(--color-secondary-text-color)]", children: "Profile, password, and connected services." }), _jsx(Divider, {}), _jsx(Text, { variant: "t2", weight: "semibold", children: "Workspace" }), _jsx(Text, { variant: "t3", className: "text-[var(--color-secondary-text-color)]", children: "Members, billing, and integrations." }), _jsx(Divider, {}), _jsx(Text, { variant: "t2", weight: "semibold", children: "Notifications" }), _jsx(Text, { variant: "t3", className: "text-[var(--color-secondary-text-color)]", children: "Choose what you get pinged about." })] })),
};
export const Vertical = {
    render: () => (_jsxs("div", { className: "flex h-12 items-center gap-4", children: [_jsx(Text, { variant: "t2", children: "Inbox" }), _jsx(Divider, { orientation: "vertical" }), _jsx(Text, { variant: "t2", children: "Drafts" }), _jsx(Divider, { orientation: "vertical" }), _jsx(Text, { variant: "t2", children: "Archive" }), _jsx(Divider, { orientation: "vertical" }), _jsx(Text, { variant: "t2", children: "Spam" })] })),
};
export const InCard = {
    render: () => (_jsxs("div", { className: "w-96 rounded-xl border border-[var(--color-layout-border-color)] bg-[var(--color-primary-background-color)] overflow-hidden", children: [_jsxs("div", { className: "flex items-center gap-3 p-4", children: [_jsx(Avatar, { size: "sm", src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=faces", alt: "Riley M." }), _jsxs("div", { className: "flex flex-col", children: [_jsx(Text, { variant: "t2", weight: "semibold", children: "Riley M." }), _jsx(Text, { variant: "t3", className: "text-[var(--color-secondary-text-color)]", children: "riley@timeworks.app" })] })] }), _jsx(Divider, {}), _jsx("div", { className: "p-4", children: _jsx(Text, { variant: "t3", className: "text-[var(--color-secondary-text-color)]", children: "Joined April 2024 \u00B7 Admin" }) })] })),
};
export const Semantic = {
    args: { decorative: false },
    render: (args) => (_jsxs("div", { className: "flex flex-col gap-3 w-96", children: [_jsx(Text, { variant: "t2", children: "First section" }), _jsx(Divider, { ...args }), _jsx(Text, { variant: "t2", children: "Second section" })] })),
};
