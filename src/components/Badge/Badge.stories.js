import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Badge } from "./Badge";
import { Button } from "../Button";
import { IconButton } from "../IconButton";
import { Avatar } from "../Avatar";
const meta = {
    title: "Components/Badge",
    component: Badge,
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component: 'Badge overlays a notification indicator (dot) or counter on top of an adjacent component such as Button, IconButton, or Avatar. Sourced from the TimeWorks Figma file (page "Badge", node 46939:90704). Use `anchor="round"` for circular children (Avatar) so the badge clears the visible edge.',
            },
        },
    },
    tags: ["autodocs"],
    argTypes: {
        type: { control: "radio", options: ["indicator", "counter"] },
        anchor: { control: "radio", options: ["square", "round"] },
        count: { control: { type: "number", min: 0, max: 9999 } },
        max: { control: { type: "number", min: 1, max: 9999 } },
        hidden: { control: "boolean" },
    },
    args: {
        type: "indicator",
        anchor: "square",
        count: 5,
        max: 99,
        hidden: false,
        children: _jsx(Button, { children: "Inbox" }),
    },
};
export default meta;
export const Playground = {};
const Row = ({ label, children }) => (_jsxs("div", { className: "flex items-center gap-8", children: [_jsx("span", { className: "w-32 text-t3 text-[var(--color-secondary-text-color)] uppercase tracking-wide", children: label }), _jsx("div", { className: "flex items-center gap-10", children: children })] }));
export const Indicator = {
    render: () => (_jsxs("div", { className: "flex flex-col gap-8", children: [_jsx(Row, { label: "Button", children: _jsx(Badge, { type: "indicator", children: _jsx(Button, { children: "Button" }) }) }), _jsx(Row, { label: "Icon button", children: _jsx(Badge, { type: "indicator", children: _jsx(IconButton, { icon: "bell", "aria-label": "Notifications" }) }) }), _jsx(Row, { label: "Avatar", children: _jsx(Badge, { type: "indicator", anchor: "round", children: _jsx(Avatar, { src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=faces", alt: "Riley M." }) }) })] })),
};
export const Counter = {
    render: () => (_jsxs("div", { className: "flex flex-col gap-8", children: [_jsxs(Row, { label: "Button", children: [_jsx(Badge, { type: "counter", count: 3, children: _jsx(Button, { children: "Inbox" }) }), _jsx(Badge, { type: "counter", count: 42, children: _jsx(Button, { children: "Inbox" }) }), _jsx(Badge, { type: "counter", count: 120, children: _jsx(Button, { children: "Inbox" }) })] }), _jsxs(Row, { label: "Icon button", children: [_jsx(Badge, { type: "counter", count: 3, children: _jsx(IconButton, { icon: "bell", "aria-label": "Notifications" }) }), _jsx(Badge, { type: "counter", count: 42, children: _jsx(IconButton, { icon: "bell", "aria-label": "Notifications" }) }), _jsx(Badge, { type: "counter", count: 120, children: _jsx(IconButton, { icon: "bell", "aria-label": "Notifications" }) })] }), _jsx(Row, { label: "Avatar", children: _jsx(Badge, { type: "counter", count: 3, anchor: "round", children: _jsx(Avatar, { src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=faces", alt: "Riley M." }) }) })] })),
};
export const AnchorShapes = {
    render: () => (_jsxs("div", { className: "flex items-center gap-12", children: [_jsx(Badge, { type: "indicator", anchor: "square", children: _jsx(Button, { children: "Square" }) }), _jsx(Badge, { type: "indicator", anchor: "round", children: _jsx(Avatar, { src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=faces", alt: "Riley M." }) })] })),
};
