import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Menu } from "./Menu";
import { ListItem } from "../ListItem";
import { Avatar } from "../Avatar";
const meta = {
    title: "Components/Menu",
    component: Menu,
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component: 'A navigable contextual surface that groups ListItem rows. Sourced from the TimeWorks Figma file (page "Menu", node 46939:7906). Owns elevation, radius, padding, and width — pass any combination of `<ListItem>` rows as children.',
            },
        },
    },
    tags: ["autodocs"],
    argTypes: {
        size: { control: "radio", options: ["sm", "md", "lg", "fluid"] },
    },
    args: { size: "md", children: null },
};
export default meta;
export const Default = {
    render: (args) => (_jsxs(Menu, { ...args, children: [_jsx(ListItem, { children: "Option 1" }), _jsx(ListItem, { children: "Option 2" }), _jsx(ListItem, { children: "Option 3" }), _jsx(ListItem, { children: "Option 4" }), _jsx(ListItem, { children: "Option 5" })] })),
};
export const WithIcons = {
    render: (args) => (_jsxs(Menu, { ...args, children: [_jsx(ListItem, { icon: "user", children: "Profile" }), _jsx(ListItem, { icon: "bell", rightIcon: true, children: "Notifications" }), _jsx(ListItem, { icon: "gears", active: true, children: "Settings" }), _jsx(ListItem, { icon: "lock", disabled: true, children: "Privacy" })] })),
};
export const WithDivider = {
    render: (args) => (_jsxs(Menu, { ...args, children: [_jsx(ListItem, { icon: "user", children: "Profile" }), _jsx(ListItem, { icon: "bell", rightIcon: true, children: "Notifications" }), _jsx(ListItem, { variant: "divider" }), _jsx(ListItem, { icon: "arrow-right-from-bracket", variant: "button", children: "Sign out" })] })),
};
export const WithCaptions = {
    render: (args) => (_jsxs(Menu, { ...args, children: [_jsx(ListItem, { variant: "category-separator", children: "Account" }), _jsx(ListItem, { icon: "user", children: "Profile" }), _jsx(ListItem, { icon: "bell", rightIcon: true, children: "Notifications" }), _jsx(ListItem, { variant: "divider" }), _jsx(ListItem, { variant: "category-separator", children: "Workspace" }), _jsx(ListItem, { icon: "users-grp", children: "Members" }), _jsx(ListItem, { icon: "folder", children: "Projects" }), _jsx(ListItem, { icon: "lock", disabled: true, children: "Billing" }), _jsx(ListItem, { variant: "divider" }), _jsx(ListItem, { icon: "arrow-right-from-bracket", variant: "button", children: "Sign out" })] })),
};
export const WithAvatars = {
    render: (args) => (_jsxs(Menu, { ...args, children: [_jsx(ListItem, { variant: "category-separator", children: "Assignees" }), _jsx(ListItem, { avatar: _jsx(Avatar, { size: "xs", src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=faces", alt: "Riley M." }), children: "Riley M." }), _jsx(ListItem, { avatar: _jsx(Avatar, { size: "xs", type: "initials", initials: "JL", alt: "Jordan L." }), label: { children: "Owner", color: "positive" }, children: "Jordan L." }), _jsx(ListItem, { avatar: _jsx(Avatar, { size: "xs", type: "initials", initials: "DR", alt: "Dana R." }), active: true, rightIcon: true, children: "Dana R." })] })),
};
export const Sizes = {
    render: () => (_jsx("div", { className: "flex items-start gap-6", children: ["sm", "md", "lg"].map((size) => (_jsxs("div", { className: "flex flex-col gap-2", children: [_jsx("span", { className: "text-t3 text-[var(--color-secondary-text-color)] uppercase tracking-wide", children: size }), _jsxs(Menu, { size: size, children: [_jsx(ListItem, { icon: "user", children: "Profile" }), _jsx(ListItem, { icon: "bell", children: "Notifications" }), _jsx(ListItem, { icon: "gears", children: "Settings" })] })] }, size))) })),
};
