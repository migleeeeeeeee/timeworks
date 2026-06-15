import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AvatarGroup } from "./AvatarGroup";
import { Avatar } from "../Avatar";
const FACES = [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=faces",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&fit=crop&crop=faces",
    "https://images.unsplash.com/photo-1545996124-0501ebae84d0?w=96&h=96&fit=crop&crop=faces",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop&crop=faces",
    "https://images.unsplash.com/photo-1463453091185-61582044d556?w=96&h=96&fit=crop&crop=faces",
];
const NAMES = ["Riley", "Daniel", "Roy", "Guy", "Mara"];
const faces = () => FACES.map((src, i) => _jsx(Avatar, { src: src, alt: NAMES[i] }, i));
const meta = {
    title: "Components/AvatarGroup",
    component: AvatarGroup,
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component: 'Stacked group of avatars with an optional +N counter chip. Sourced from the TimeWorks Figma file (page "AvatarGroup", node 46939:90057).',
            },
        },
    },
    tags: ["autodocs"],
    argTypes: {
        size: { control: "select", options: ["xs", "sm", "md", "lg"] },
        theme: { control: "select", options: ["light", "dark"] },
        disabled: { control: "boolean" },
        max: { control: { type: "number", min: 1, max: 10 } },
        counterText: { control: "text" },
    },
    args: {
        size: "md",
        theme: "light",
        disabled: false,
        max: 3,
        children: faces(),
    },
};
export default meta;
export const Playground = {
    render: (args) => (_jsx(AvatarGroup, { ...args, children: faces() })),
};
const Row = ({ children }) => (_jsx("div", { className: "flex flex-wrap items-center gap-8", children: children }));
const Col = ({ label, children }) => (_jsxs("div", { className: "flex flex-col gap-2", children: [_jsx("span", { className: "text-t3 text-[color:var(--color-secondary-text-color)] uppercase tracking-wide", children: label }), children] }));
export const Sizes = {
    render: () => (_jsx("div", { className: "flex flex-col gap-6", children: ["lg", "md", "sm", "xs"].map((size) => (_jsx(Col, { label: size, children: _jsx(Row, { children: _jsx(AvatarGroup, { size: size, max: 3, counterText: "+10", children: faces() }) }) }, size))) })),
};
export const Themes = {
    render: () => (_jsx("div", { className: "flex flex-col gap-6", children: ["lg", "md", "sm", "xs"].map((size) => (_jsx(Col, { label: size, children: _jsxs("div", { className: "flex flex-wrap items-center gap-12", children: [_jsx(AvatarGroup, { size: size, max: 3, counterText: "+10", children: faces() }), _jsx(AvatarGroup, { size: size, theme: "dark", max: 3, counterText: "+10", children: faces() })] }) }, size))) })),
};
export const Disabled = {
    render: () => (_jsx("div", { className: "flex flex-col gap-6", children: ["lg", "md", "sm", "xs"].map((size) => (_jsx(Col, { label: size, children: _jsx(Row, { children: _jsx(AvatarGroup, { size: size, max: 3, counterText: "+10", disabled: true, children: faces() }) }) }, size))) })),
};
export const NoCounter = {
    render: () => _jsx(AvatarGroup, { children: faces() }),
};
export const MixedAvatarTypes = {
    render: () => (_jsxs(AvatarGroup, { max: 4, children: [_jsx(Avatar, { src: FACES[0], alt: "Riley" }), _jsx(Avatar, { type: "initials", initials: "DK" }), _jsx(Avatar, { type: "letter", letter: "F" }), _jsx(Avatar, { type: "icon", icon: "users-grp" }), _jsx(Avatar, { src: FACES[1], alt: "Daniel" }), _jsx(Avatar, { src: FACES[2], alt: "Roy" })] })),
};
