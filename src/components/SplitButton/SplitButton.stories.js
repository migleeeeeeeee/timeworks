import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { SplitButton } from "./SplitButton";
import { Menu } from "../Menu";
import { ListItem } from "../ListItem";
import { ICON_NAMES } from "../../icons/names";
const sampleMenu = (_jsxs(Menu, { children: [_jsx(ListItem, { icon: "copy", children: "Save as\u2026" }), _jsx(ListItem, { icon: "folder", children: "Save a copy" }), _jsx(ListItem, { icon: "cloud-arrow-down", children: "Save to cloud" })] }));
const meta = {
    title: "Components/SplitButton",
    component: SplitButton,
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component: 'Split Button — sourced from the TimeWorks Figma file (page "Split Button", node 46939:7913; component set 46966:936). A dual-function button: a default action on the left and a chevron trigger on the right that opens a menu of alternative actions.',
            },
        },
    },
    tags: ["autodocs"],
    argTypes: {
        kind: { control: "select", options: ["primary", "secondary", "tertiary"] },
        size: { control: "select", options: ["sm", "md", "lg"] },
        color: { control: "select", options: ["primary", "negative", "positive", "inverted"] },
        icon: { control: "select", options: ["", ...ICON_NAMES] },
        iconPosition: { control: "select", options: ["left", "right", "only"] },
        disabled: { control: "boolean" },
        children: { control: "text" },
    },
    args: {
        kind: "primary",
        size: "md",
        color: "primary",
        icon: "hexagon-image",
        iconPosition: "left",
        children: "Button",
        menu: sampleMenu,
    },
};
export default meta;
export const Playground = {};
const Row = ({ children }) => (_jsx("div", { className: "flex flex-wrap items-center gap-3", children: children }));
const Col = ({ label, children }) => (_jsxs("div", { className: "flex flex-col gap-2", children: [_jsx("span", { className: "text-t3 text-[color:var(--color-secondary-text-color)] uppercase tracking-wide", children: label }), children] }));
export const Kinds = {
    render: () => (_jsx(Col, { label: "Kind", children: _jsxs(Row, { children: [_jsx(SplitButton, { kind: "primary", menu: sampleMenu, children: "Primary" }), _jsx(SplitButton, { kind: "secondary", menu: sampleMenu, children: "Secondary" }), _jsx(SplitButton, { kind: "tertiary", menu: sampleMenu, children: "Tertiary" })] }) })),
};
export const Sizes = {
    render: () => (_jsx(Col, { label: "Size", children: _jsxs(Row, { children: [_jsx(SplitButton, { size: "lg", menu: sampleMenu, children: "Large" }), _jsx(SplitButton, { size: "md", menu: sampleMenu, children: "Medium" }), _jsx(SplitButton, { size: "sm", menu: sampleMenu, children: "Small" })] }) })),
};
export const Colors = {
    render: () => (_jsxs("div", { className: "flex flex-col gap-6", children: [_jsx(Col, { label: "Primary kind", children: _jsxs(Row, { children: [_jsx(SplitButton, { color: "primary", menu: sampleMenu, children: "Primary" }), _jsx(SplitButton, { color: "negative", menu: sampleMenu, children: "Negative" }), _jsx(SplitButton, { color: "positive", menu: sampleMenu, children: "Positive" }), _jsx(SplitButton, { color: "inverted", menu: sampleMenu, children: "Inverted" })] }) }), _jsx(Col, { label: "Secondary kind", children: _jsxs(Row, { children: [_jsx(SplitButton, { kind: "secondary", color: "primary", menu: sampleMenu, children: "Primary" }), _jsx(SplitButton, { kind: "secondary", color: "negative", menu: sampleMenu, children: "Negative" }), _jsx(SplitButton, { kind: "secondary", color: "positive", menu: sampleMenu, children: "Positive" }), _jsx(SplitButton, { kind: "secondary", color: "inverted", menu: sampleMenu, children: "Inverted" })] }) }), _jsx(Col, { label: "Tertiary kind", children: _jsxs(Row, { children: [_jsx(SplitButton, { kind: "tertiary", color: "primary", menu: sampleMenu, children: "Primary" }), _jsx(SplitButton, { kind: "tertiary", color: "negative", menu: sampleMenu, children: "Negative" }), _jsx(SplitButton, { kind: "tertiary", color: "positive", menu: sampleMenu, children: "Positive" }), _jsx(SplitButton, { kind: "tertiary", color: "inverted", menu: sampleMenu, children: "Inverted" })] }) })] })),
};
export const IconPositions = {
    render: () => (_jsx(Col, { label: "Icon position", children: _jsxs(Row, { children: [_jsx(SplitButton, { icon: "hexagon-image", iconPosition: "left", menu: sampleMenu, children: "Left" }), _jsx(SplitButton, { icon: "hexagon-image", iconPosition: "right", menu: sampleMenu, children: "Right" }), _jsx(SplitButton, { menu: sampleMenu, children: "No icon" }), _jsx(SplitButton, { icon: "hexagon-image", iconPosition: "only", triggerAriaLabel: "More actions", menu: sampleMenu, children: "Hidden" })] }) })),
};
export const States = {
    render: () => (_jsx(Col, { label: "State", children: _jsxs(Row, { children: [_jsx(SplitButton, { menu: sampleMenu, children: "Default" }), _jsx(SplitButton, { disabled: true, menu: sampleMenu, children: "Disabled" }), _jsx(SplitButton, { defaultOpen: true, menu: sampleMenu, children: "Menu open" })] }) })),
};
