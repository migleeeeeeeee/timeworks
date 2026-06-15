import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ListItem } from "./ListItem";
import { Avatar } from "../Avatar";
import { Menu } from "../Menu";
const meta = {
    title: "Components/ListItem",
    component: ListItem,
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component: 'Rows used inside menus, dropdowns, and selection lists. Sourced from the TimeWorks Figma file (page "List item", node 46939:7903). Six content variants — item, button, category-title, category-separator, information, divider.',
            },
        },
    },
    tags: ["autodocs"],
    argTypes: {
        variant: {
            control: "select",
            options: [
                "item",
                "button",
                "category-title",
                "category-separator",
                "information",
                "divider",
            ],
        },
        icon: { control: "text" },
        rightIcon: { control: "boolean" },
        active: { control: "boolean" },
        disabled: { control: "boolean" },
    },
    args: {
        variant: "item",
        children: "Option 1",
    },
    decorators: [
        (Story) => (_jsx("div", { className: "w-[250px]", children: _jsx(Story, {}) })),
    ],
};
export default meta;
export const Playground = {};
const Row = ({ label, children }) => (_jsxs("div", { className: "flex flex-col gap-1", children: [_jsx("span", { className: "text-t3 text-[var(--color-secondary-text-color)] uppercase tracking-wide", children: label }), _jsx("div", { className: "w-[250px] flex flex-col gap-1", children: children })] }));
export const States = {
    render: () => (_jsxs("div", { className: "flex flex-col gap-6", children: [_jsxs(Row, { label: "Default", children: [_jsx(ListItem, { children: "Option 1" }), _jsx(ListItem, { rightIcon: true, children: "Option 1" }), _jsx(ListItem, { icon: "hexagon-image", children: "Option 1" }), _jsx(ListItem, { icon: "hexagon-image", rightIcon: true, children: "Option 1" })] }), _jsxs(Row, { label: "Active", children: [_jsx(ListItem, { active: true, children: "Option 1" }), _jsx(ListItem, { active: true, rightIcon: true, children: "Option 1" }), _jsx(ListItem, { active: true, icon: "hexagon-image", children: "Option 1" })] }), _jsxs(Row, { label: "Disabled", children: [_jsx(ListItem, { disabled: true, children: "Option 1" }), _jsx(ListItem, { disabled: true, rightIcon: true, children: "Option 1" }), _jsx(ListItem, { disabled: true, icon: "hexagon-image", children: "Option 1" })] })] })),
};
export const WithAvatar = {
    render: () => (_jsxs(Row, { label: "Avatar", children: [_jsx(ListItem, { avatar: _jsx(Avatar, { size: "xs", src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=faces", alt: "Riley M." }), children: "Riley M." }), _jsx(ListItem, { rightIcon: true, avatar: _jsx(Avatar, { size: "xs", type: "initials", initials: "JL", alt: "Jordan L." }), children: "Jordan L." }), _jsx(ListItem, { active: true, avatar: _jsx(Avatar, { size: "xs", type: "initials", initials: "AB", alt: "Abigail B." }), rightIcon: true, children: "Abigail B." }), _jsx(ListItem, { disabled: true, avatar: _jsx(Avatar, { size: "xs", type: "initials", initials: "DR", alt: "Dana R." }), children: "Dana R." })] })),
};
export const WithLabel = {
    render: () => (_jsxs(Row, { label: "Label pill", children: [_jsx(ListItem, { label: "New", children: "Option 1" }), _jsx(ListItem, { icon: "hexagon-image", label: { children: "Beta", kind: "fill" }, children: "Option 1" }), _jsx(ListItem, { label: { children: "Active", color: "positive" }, children: "Option 1" }), _jsx(ListItem, { label: { children: "Failed", color: "negative", kind: "fill" }, children: "Option 1" }), _jsx(ListItem, { avatar: _jsx(Avatar, { size: "xs", type: "initials", initials: "JL", alt: "Jordan L." }), label: { children: "Owner", color: "dark" }, children: "Jordan L." })] })),
};
export const ContentVariants = {
    render: () => (_jsxs("div", { className: "w-[250px] flex flex-col gap-1", children: [_jsx(ListItem, { variant: "category-separator", children: "Category 1" }), _jsx(ListItem, { icon: "hexagon-image", children: "Option 1" }), _jsx(ListItem, { icon: "hexagon-image", rightIcon: true, children: "Option 2" }), _jsx(ListItem, { variant: "divider" }), _jsx(ListItem, { variant: "category-title", icon: "hexagon-image", children: "Settings" }), _jsx(ListItem, { icon: "hexagon-image", children: "Profile" }), _jsx(ListItem, { icon: "hexagon-image", children: "Notifications" }), _jsx(ListItem, { variant: "divider" }), _jsx(ListItem, { variant: "information", children: "No more results" }), _jsx(ListItem, { variant: "button", icon: "pen", children: "Edit" })] })),
};
export const InMenu = {
    render: () => (_jsxs(Menu, { size: "lg", children: [_jsx(ListItem, { icon: "user", children: "Profile" }), _jsx(ListItem, { icon: "bell", rightIcon: true, children: "Notifications" }), _jsx(ListItem, { icon: "gears", active: true, children: "Settings" }), _jsx(ListItem, { variant: "divider" }), _jsx(ListItem, { variant: "category-separator", children: "Workspace" }), _jsx(ListItem, { icon: "users-grp", children: "Members" }), _jsx(ListItem, { icon: "folder", children: "Projects" }), _jsx(ListItem, { icon: "lock", disabled: true, children: "Billing" }), _jsx(ListItem, { variant: "divider" }), _jsx(ListItem, { variant: "button", icon: "arrow-right-from-bracket", children: "Sign out" })] })),
};
