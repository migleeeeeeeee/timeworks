import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Avatar } from "./Avatar";
import { ICON_NAMES } from "../../icons/names";
const SAMPLE_IMG = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=faces";
const meta = {
    title: "Components/Avatar",
    component: Avatar,
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component: 'Avatar is a graphical representation of a person through a profile picture, image, icon, or set of initials. Sourced from the TimeWorks Figma file (page "Avatar", node 46939:89419).',
            },
        },
    },
    tags: ["autodocs"],
    argTypes: {
        size: { control: "select", options: ["xs", "sm", "md", "lg"] },
        type: { control: "select", options: ["img", "initials", "letter", "icon"] },
        icon: { control: "select", options: ["", ...ICON_NAMES] },
        disabled: { control: "boolean" },
        src: { control: "text" },
        alt: { control: "text" },
        initials: { control: "text" },
        letter: { control: "text" },
    },
    args: {
        size: "md",
        type: "img",
        src: SAMPLE_IMG,
        alt: "Riley M.",
        initials: "RM",
        letter: "F",
        icon: "users-grp",
    },
};
export default meta;
export const Playground = {};
const Row = ({ children }) => (_jsx("div", { className: "flex flex-wrap items-end gap-4", children: children }));
const Col = ({ label, children }) => (_jsxs("div", { className: "flex flex-col gap-2", children: [_jsx("span", { className: "text-t3 text-[color:var(--color-secondary-text-color)] uppercase tracking-wide", children: label }), children] }));
export const Sizes = {
    render: () => (_jsx(Col, { label: "Size", children: _jsxs(Row, { children: [_jsx(Avatar, { size: "lg", src: SAMPLE_IMG, alt: "Riley" }), _jsx(Avatar, { size: "md", src: SAMPLE_IMG, alt: "Riley" }), _jsx(Avatar, { size: "sm", src: SAMPLE_IMG, alt: "Riley" }), _jsx(Avatar, { size: "xs", src: SAMPLE_IMG, alt: "Riley" })] }) })),
};
export const Types = {
    render: () => (_jsxs(Row, { children: [_jsx(Avatar, { type: "img", src: SAMPLE_IMG, alt: "Riley" }), _jsx(Avatar, { type: "initials", initials: "RM" }), _jsx(Avatar, { type: "letter", letter: "F" }), _jsx(Avatar, { type: "icon", icon: "users-grp" })] })),
};
export const Disabled = {
    render: () => (_jsxs(Row, { children: [_jsx(Avatar, { type: "img", src: SAMPLE_IMG, alt: "Riley", disabled: true }), _jsx(Avatar, { type: "initials", initials: "RM", disabled: true }), _jsx(Avatar, { type: "letter", letter: "F", disabled: true }), _jsx(Avatar, { type: "icon", icon: "users-grp", disabled: true })] })),
};
export const VariantsMatrix = {
    render: () => {
        const sizes = ["lg", "md", "sm", "xs"];
        return (_jsx("div", { className: "flex flex-col gap-6", children: ["img", "initials", "letter", "icon"].map((type) => (_jsx(Col, { label: type, children: _jsxs(Row, { children: [sizes.map((size) => (_jsx(Avatar, { size: size, type: type, src: SAMPLE_IMG, alt: "Riley", initials: "RM", letter: "F", icon: "users-grp" }, size))), sizes.map((size) => (_jsx(Avatar, { size: size, type: type, src: SAMPLE_IMG, alt: "Riley", initials: "RM", letter: "F", icon: "users-grp", disabled: true }, `${size}-d`)))] }) }, type))) }));
    },
};
