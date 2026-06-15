import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { TableCell } from "./TableCell";
import { TableHeaderCell } from "./TableHeaderCell";
import { Avatar } from "../Avatar";
import { AvatarGroup } from "../AvatarGroup";
import { Checkbox } from "../Checkbox";
import { Chip } from "../Chip";
import { EditableText } from "../EditableText";
import { Icon } from "../Icon";
import { IconButton } from "../IconButton";
import { Label } from "../Label";
import { LinearProgressBar } from "../LinearProgressBar";
import { Text } from "../Text";
const SIZES = ["sm", "md", "lg"];
const STATES = ["default", "hover", "selected", "selected-hover"];
const meta = {
    title: "Components/TableCell",
    component: TableCell,
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component: 'Structural shell for a row in a data table. Sourced from the TimeWorks Figma file (page "Table / Cell", node 46949:11817). Compose any content inside — text, icons, chips, labels, avatars, progress bars, editable inputs. Use `<TableHeaderCell>` for column titles. Three sizes (sm 32 / md 40 / lg 48), four states (default / hover / selected / selected-hover), and a `control` variant for square menu/select cells.',
            },
        },
    },
    tags: ["autodocs"],
    argTypes: {
        size: { control: "radio", options: SIZES },
        state: { control: "select", options: STATES },
        variant: { control: "radio", options: ["content", "control"] },
        interactive: { control: "boolean" },
        border: { control: "boolean" },
    },
    args: {
        size: "md",
        state: "default",
        variant: "content",
        interactive: false,
        border: true,
        children: "Placeholder for text",
    },
};
export default meta;
const ColumnLabel = ({ children }) => (_jsx(Text, { variant: "t3", className: "text-[var(--color-secondary-text-color)] uppercase tracking-wide mb-1", children: children }));
const Column = ({ label, children, }) => (_jsxs("div", { className: "w-[200px]", children: [_jsx(ColumnLabel, { children: label }), _jsx("div", { className: "border-t border-[var(--color-layout-border-color)]", children: children })] }));
export const Playground = {};
export const States = {
    render: () => (_jsx("div", { className: "flex gap-6", children: STATES.map((state) => (_jsx(Column, { label: state, children: _jsx(TableCell, { state: state, children: "Placeholder for text" }) }, state))) })),
};
export const Sizes = {
    render: () => (_jsx("div", { className: "flex gap-6", children: SIZES.map((size) => (_jsx(Column, { label: `size = ${size}`, children: _jsx(TableCell, { size: size, children: "Placeholder for text" }) }, size))) })),
};
export const Text_ = {
    name: "Type · Text",
    render: () => (_jsxs("div", { className: "flex gap-6", children: [_jsxs(Column, { label: "Plain", children: [_jsx(TableCell, { children: "Placeholder for text" }), _jsx(TableCell, { children: "Riley M." }), _jsx(TableCell, { children: "\u2014" })] }), _jsx(Column, { label: "Long / truncated", children: _jsx(TableCell, { children: _jsx("span", { className: "truncate", children: "A very long string that should clip with ellipsis" }) }) })] })),
};
export const TextWithIcons = {
    name: "Type · Text + Icons",
    render: () => (_jsxs("div", { className: "flex gap-6", children: [_jsx(Column, { label: "Leading icon", children: _jsxs(TableCell, { children: [_jsx(Icon, { name: "user", size: "xs", "aria-hidden": true }), _jsx("span", { className: "flex-1 truncate", children: "Owner" })] }) }), _jsx(Column, { label: "Trailing icon", children: _jsxs(TableCell, { children: [_jsx("span", { className: "flex-1 truncate", children: "Status" }), _jsx(Icon, { name: "circle-info", size: "xs", "aria-hidden": true })] }) }), _jsx(Column, { label: "Both", children: _jsxs(TableCell, { children: [_jsx(Icon, { name: "user", size: "xs", "aria-hidden": true }), _jsx("span", { className: "flex-1 truncate", children: "Riley M." }), _jsx(Icon, { name: "circle-info", size: "xs", "aria-hidden": true })] }) })] })),
};
export const Editable = {
    name: "Type · Editable cell",
    render: () => (_jsx(Column, { label: "Editable cell", children: _jsx(TableCell, { children: _jsx(EditableText, { variant: "t2", weight: "regular", defaultValue: "Editable cell", className: "flex-1" }) }) })),
};
export const LabelCell = {
    name: "Type · Label",
    render: () => (_jsxs("div", { className: "flex gap-6", children: [_jsx(Column, { label: "Label \u00B7 fill", children: _jsx(TableCell, { children: _jsx(Label, { color: "primary", children: "Label" }) }) }), _jsx(Column, { label: "Label \u00B7 positive", children: _jsx(TableCell, { children: _jsx(Label, { color: "positive", children: "Active" }) }) })] })),
};
export const ChipCell = {
    name: "Type · Chip",
    render: () => (_jsxs("div", { className: "flex gap-6", children: [_jsx(Column, { label: "Chip", children: _jsx(TableCell, { children: _jsx(Chip, { type: "primary", children: "This is a chip" }) }) }), _jsx(Column, { label: "Chip \u00B7 positive", children: _jsx(TableCell, { children: _jsx(Chip, { type: "positive", children: "Done" }) }) })] })),
};
export const AvatarCell = {
    name: "Type · Avatar",
    render: () => (_jsxs("div", { className: "flex gap-6", children: [_jsx(Column, { label: "Avatar", children: _jsx(TableCell, { children: _jsx(Avatar, { size: "sm", type: "initials", initials: "RM" }) }) }), _jsx(Column, { label: "Avatar + Text", children: _jsxs(TableCell, { children: [_jsx(Avatar, { size: "sm", type: "initials", initials: "RM" }), _jsx("span", { className: "flex-1 truncate", children: "Riley M." })] }) }), _jsx(Column, { label: "Avatar group", children: _jsx(TableCell, { children: _jsxs(AvatarGroup, { size: "sm", max: 3, children: [_jsx(Avatar, { size: "sm", type: "initials", initials: "AB" }), _jsx(Avatar, { size: "sm", type: "initials", initials: "CD" }), _jsx(Avatar, { size: "sm", type: "initials", initials: "EF" }), _jsx(Avatar, { size: "sm", type: "initials", initials: "GH" }), _jsx(Avatar, { size: "sm", type: "initials", initials: "IJ" })] }) }) })] })),
};
export const ProgressBarCell = {
    name: "Type · Progress bar",
    render: () => (_jsxs("div", { className: "flex gap-6", children: [_jsx(Column, { label: "Primary 30%", children: _jsx(TableCell, { children: _jsx(LinearProgressBar, { size: "sm", type: "primary", value: 30, showLabel: true, className: "flex-1" }) }) }), _jsx(Column, { label: "Positive 72%", children: _jsx(TableCell, { children: _jsx(LinearProgressBar, { size: "sm", type: "positive", value: 72, showLabel: true, className: "flex-1" }) }) })] })),
};
export const ControlCells = {
    name: "Type · Control (Menu / Select)",
    render: () => (_jsxs("div", { className: "flex items-start gap-6", children: [_jsxs("div", { children: [_jsx(ColumnLabel, { children: "Selectable" }), _jsx("div", { className: "border-t border-[var(--color-layout-border-color)] inline-block", children: _jsx(TableCell, { variant: "control", children: _jsx(Checkbox, { "aria-label": "Select row" }) }) })] }), _jsxs("div", { children: [_jsx(ColumnLabel, { children: "MenuButton" }), _jsx("div", { className: "border-t border-[var(--color-layout-border-color)] inline-block", children: _jsx(TableCell, { variant: "control", children: _jsx(IconButton, { icon: "ellipsis-vertical", size: "sm", kind: "tertiary", "aria-label": "Row actions" }) }) })] })] })),
};
export const ColumnTitles = {
    name: "Type · ColumnTitle (header)",
    render: () => (_jsxs("div", { className: "flex gap-6", children: [_jsx(Column, { label: "Plain", children: _jsx(TableHeaderCell, { children: "Owner" }) }), _jsx(Column, { label: "With icon + sort", children: _jsx(TableHeaderCell, { iconBefore: "user", sortDirection: "asc", children: "Assignee" }) }), _jsx(Column, { label: "With menu", children: _jsx(TableHeaderCell, { onMenuClick: () => undefined, children: "Status" }) })] })),
};
const ROWS = [
    { id: 1, name: "Audit Q4 invoices", owner: "Riley M.", status: "In review", progress: 30 },
    { id: 2, name: "Update onboarding", owner: "Avery K.", status: "Done", progress: 100 },
    { id: 3, name: "Migrate auth flow", owner: "Jordan L.", status: "Blocked", progress: 60 },
    { id: 4, name: "Refresh design tokens", owner: "Sam P.", status: "Active", progress: 45 },
];
export const FullTable = {
    name: "Composed · Full table",
    render: () => {
        const [selected, setSelected] = useState(2);
        return (_jsxs("div", { role: "table", className: "inline-grid grid-cols-[40px_60px_1fr_180px_140px_180px_40px] border border-[var(--color-layout-border-color)] rounded-md overflow-hidden", children: [_jsx(TableCell, { variant: "control", border: true, children: _jsx(Checkbox, { "aria-label": "Select all" }) }), _jsx(TableHeaderCell, { children: "#" }), _jsx(TableHeaderCell, { sortDirection: "asc", children: "Task" }), _jsx(TableHeaderCell, { iconBefore: "user", children: "Owner" }), _jsx(TableHeaderCell, { children: "Status" }), _jsx(TableHeaderCell, { children: "Progress" }), _jsx(TableHeaderCell, { onMenuClick: () => undefined, children: "" }), ROWS.map((row) => {
                    const state = selected === row.id ? "selected" : "default";
                    return (_jsx(RowFragment, { row: row, state: state, onSelect: () => setSelected((current) => (current === row.id ? null : row.id)) }, row.id));
                })] }));
    },
};
function RowFragment({ row, state, onSelect, }) {
    const statusColor = row.status === "Done"
        ? "positive"
        : row.status === "Blocked"
            ? "negative"
            : row.status === "Active"
                ? "primary"
                : "warning";
    return (_jsxs(_Fragment, { children: [_jsx(TableCell, { variant: "control", state: state, interactive: true, children: _jsx(Checkbox, { checked: state === "selected", onCheckedChange: onSelect, "aria-label": `Select ${row.name}` }) }), _jsx(TableCell, { state: state, interactive: true, children: _jsx("span", { className: "text-[var(--color-secondary-text-color)]", children: row.id }) }), _jsx(TableCell, { state: state, interactive: true, children: _jsx("span", { className: "flex-1 truncate", children: row.name }) }), _jsxs(TableCell, { state: state, interactive: true, children: [_jsx(Avatar, { size: "sm", type: "initials", initials: initialsOf(row.owner) }), _jsx("span", { className: "flex-1 truncate", children: row.owner })] }), _jsx(TableCell, { state: state, interactive: true, children: _jsx(Chip, { type: statusColor, children: row.status }) }), _jsx(TableCell, { state: state, interactive: true, children: _jsx(LinearProgressBar, { size: "sm", type: statusColor === "negative" ? "negative" : "primary", value: row.progress, showLabel: true, className: "flex-1" }) }), _jsx(TableCell, { variant: "control", state: state, interactive: true, children: _jsx(IconButton, { icon: "ellipsis-vertical", size: "sm", kind: "tertiary", "aria-label": `Actions for ${row.name}` }) })] }));
}
function initialsOf(name) {
    return name
        .split(/\s+/)
        .map((part) => part[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase();
}
