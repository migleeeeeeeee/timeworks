import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { TableColumn } from "./TableColumn";
import { TableColumnLoader } from "./TableColumnLoader";
import { TableCell } from "./TableCell";
import { TableHeaderCell } from "./TableHeaderCell";
import { Avatar } from "../Avatar";
import { AvatarGroup } from "../AvatarGroup";
import { Checkbox } from "../Checkbox";
import { Chip } from "../Chip";
import { EditableText } from "../EditableText";
import { IconButton } from "../IconButton";
import { Label } from "../Label";
import { LinearProgressBar } from "../LinearProgressBar";
const meta = {
    title: "Components/TableColumn",
    component: TableColumn,
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component: 'Vertical stack of table cells. Compose with `<TableHeaderCell>` and `<TableCell>` directly. Sourced from the TimeWorks Figma file (page "Table / ColumnContent", node 46949:12272). The loader counterpart, `<TableColumnLoader>`, mirrors the same shell with skeleton placeholders.',
            },
        },
    },
    tags: ["autodocs"],
};
export default meta;
const TEXT_ROWS = [
    "Audit Q4 invoices",
    "Update onboarding",
    "Migrate auth flow",
    "Refresh design tokens",
    "Plan offsite agenda",
    "Cut release branch",
];
export const TextColumn = {
    name: "Type · Text",
    render: () => (_jsxs(TableColumn, { width: 228, className: "border border-[var(--color-layout-border-color)] rounded-md overflow-hidden", children: [_jsx(TableHeaderCell, { sortDirection: "asc", children: "Task" }), TEXT_ROWS.map((label) => (_jsx(TableCell, { children: _jsx("span", { className: "flex-1 truncate", children: label }) }, label)))] })),
};
export const ChipColumn = {
    name: "Type · Chip",
    render: () => (_jsxs(TableColumn, { width: 128, className: "border border-[var(--color-layout-border-color)] rounded-md overflow-hidden", children: [_jsx(TableHeaderCell, { children: "Status" }), _jsx(TableCell, { children: _jsx(Chip, { type: "primary", children: "Active" }) }), _jsx(TableCell, { children: _jsx(Chip, { type: "positive", children: "Done" }) }), _jsx(TableCell, { children: _jsx(Chip, { type: "warning", children: "In review" }) }), _jsx(TableCell, { children: _jsx(Chip, { type: "negative", children: "Blocked" }) }), _jsx(TableCell, { children: _jsx(Chip, { type: "primary", children: "Active" }) }), _jsx(TableCell, { children: _jsx(Chip, { type: "positive", children: "Done" }) })] })),
};
export const LabelColumn = {
    name: "Type · Label",
    render: () => (_jsxs(TableColumn, { width: 128, className: "border border-[var(--color-layout-border-color)] rounded-md overflow-hidden", children: [_jsx(TableHeaderCell, { children: "Tier" }), _jsx(TableCell, { children: _jsx(Label, { color: "primary", children: "Pro" }) }), _jsx(TableCell, { children: _jsx(Label, { color: "positive", children: "Enterprise" }) }), _jsx(TableCell, { children: _jsx(Label, { children: "Free" }) }), _jsx(TableCell, { children: _jsx(Label, { color: "negative", children: "Trial" }) }), _jsx(TableCell, { children: _jsx(Label, { color: "primary", children: "Pro" }) })] })),
};
export const AvatarTextColumn = {
    name: "Type · Avatar + Text",
    render: () => (_jsxs(TableColumn, { width: 180, className: "border border-[var(--color-layout-border-color)] rounded-md overflow-hidden", children: [_jsx(TableHeaderCell, { iconBefore: "user", children: "Owner" }), [
                ["RM", "Riley M."],
                ["AK", "Avery K."],
                ["JL", "Jordan L."],
                ["SP", "Sam P."],
                ["KT", "Kira T."],
            ].map(([initials, name]) => (_jsxs(TableCell, { children: [_jsx(Avatar, { size: "sm", type: "initials", initials: initials }), _jsx("span", { className: "flex-1 truncate", children: name })] }, name)))] })),
};
export const AvatarGroupColumn = {
    name: "Type · Avatar group",
    render: () => (_jsxs(TableColumn, { width: 128, className: "border border-[var(--color-layout-border-color)] rounded-md overflow-hidden", children: [_jsx(TableHeaderCell, { children: "Reviewers" }), [3, 5, 8, 4, 12].map((n, i) => (_jsx(TableCell, { children: _jsx(AvatarGroup, { size: "sm", max: 3, children: Array.from({ length: n }).map((_, idx) => (_jsx(Avatar, { size: "sm", type: "initials", initials: `U${idx + 1}` }, idx))) }) }, i)))] })),
};
export const EditableColumn = {
    name: "Type · Editable cell",
    render: () => (_jsxs(TableColumn, { width: 180, className: "border border-[var(--color-layout-border-color)] rounded-md overflow-hidden", children: [_jsx(TableHeaderCell, { children: "Note" }), ["Editable cell", "Click to edit", "Some note", "Another note"].map((value, i) => (_jsx(TableCell, { children: _jsx(EditableText, { variant: "t2", weight: "regular", defaultValue: value, className: "flex-1" }) }, i)))] })),
};
export const ProgressColumn = {
    name: "Type · Progress bar",
    render: () => (_jsxs(TableColumn, { width: 180, className: "border border-[var(--color-layout-border-color)] rounded-md overflow-hidden", children: [_jsx(TableHeaderCell, { children: "Progress" }), [30, 100, 45, 60, 12].map((value, i) => (_jsx(TableCell, { children: _jsx(LinearProgressBar, { size: "sm", type: value >= 100 ? "positive" : value < 20 ? "negative" : "primary", value: value, showLabel: true, className: "flex-1" }) }, i)))] })),
};
export const ControlColumns = {
    name: "Type · Selectable + Menu",
    render: () => (_jsxs("div", { className: "flex gap-4", children: [_jsxs(TableColumn, { width: 40, className: "border border-[var(--color-layout-border-color)] rounded-md overflow-hidden", children: [_jsx(TableCell, { variant: "control", children: _jsx(Checkbox, { "aria-label": "Select all" }) }), Array.from({ length: 6 }).map((_, i) => (_jsx(TableCell, { variant: "control", children: _jsx(Checkbox, { "aria-label": `Select row ${i + 1}` }) }, i)))] }), _jsxs(TableColumn, { width: 40, className: "border border-[var(--color-layout-border-color)] rounded-md overflow-hidden", children: [_jsx(TableCell, { variant: "control", border: false }), Array.from({ length: 6 }).map((_, i) => (_jsx(TableCell, { variant: "control", border: false, children: _jsx(IconButton, { icon: "ellipsis-vertical", size: "xs", kind: "tertiary", "aria-label": `Actions for row ${i + 1}` }) }, i)))] })] })),
};
export const ColumnLoader_Text = {
    name: "Loader · Text",
    render: () => (_jsx(TableColumnLoader, { width: 228, shape: "text", rows: 20, header: _jsx(TableHeaderCell, { sortDirection: "asc", children: "Placeholder for text" }), className: "border border-[var(--color-layout-border-color)] rounded-md overflow-hidden" })),
};
export const ColumnLoader_Rectangle = {
    name: "Loader · Rectangle",
    render: () => (_jsx(TableColumnLoader, { width: 112, shape: "rectangle", rows: 20, header: _jsx(TableHeaderCell, { children: "Pla..." }), className: "border border-[var(--color-layout-border-color)] rounded-md overflow-hidden" })),
};
export const ColumnLoader_Circle = {
    name: "Loader · Circle",
    render: () => (_jsx(TableColumnLoader, { width: 112, shape: "circle", rows: 20, header: _jsx(TableHeaderCell, { children: "Pla..." }), className: "border border-[var(--color-layout-border-color)] rounded-md overflow-hidden" })),
};
export const ColumnLoader_Square = {
    name: "Loader · Square",
    render: () => (_jsx(TableColumnLoader, { width: 112, shape: "square", rows: 20, header: _jsx(TableHeaderCell, { children: "Pla..." }), className: "border border-[var(--color-layout-border-color)] rounded-md overflow-hidden" })),
};
export const ColumnLoader_AllShapes = {
    name: "Loader · All shapes side-by-side",
    render: () => (_jsxs("div", { className: "flex gap-2", children: [_jsx(TableColumnLoader, { width: 228, shape: "text", rows: 12, header: _jsx(TableHeaderCell, { children: "Placeholder for text" }), className: "border border-[var(--color-layout-border-color)] rounded-md overflow-hidden" }), _jsx(TableColumnLoader, { width: 112, shape: "rectangle", rows: 12, header: _jsx(TableHeaderCell, { children: "Pla..." }), className: "border border-[var(--color-layout-border-color)] rounded-md overflow-hidden" }), _jsx(TableColumnLoader, { width: 112, shape: "circle", rows: 12, header: _jsx(TableHeaderCell, { children: "Pla..." }), className: "border border-[var(--color-layout-border-color)] rounded-md overflow-hidden" }), _jsx(TableColumnLoader, { width: 112, shape: "square", rows: 12, header: _jsx(TableHeaderCell, { children: "Pla..." }), className: "border border-[var(--color-layout-border-color)] rounded-md overflow-hidden" })] })),
};
export const FullColumnTable = {
    name: "Composed · Column-major table",
    render: () => (_jsxs("div", { className: "flex border border-[var(--color-layout-border-color)] rounded-md overflow-hidden", children: [_jsxs(TableColumn, { width: 40, children: [_jsx(TableCell, { variant: "control", children: _jsx(Checkbox, { "aria-label": "Select all" }) }), Array.from({ length: 6 }).map((_, i) => (_jsx(TableCell, { variant: "control", children: _jsx(Checkbox, { "aria-label": `Select ${i + 1}` }) }, i)))] }), _jsxs(TableColumn, { width: 228, children: [_jsx(TableHeaderCell, { sortDirection: "asc", children: "Task" }), TEXT_ROWS.map((label) => (_jsx(TableCell, { children: _jsx("span", { className: "flex-1 truncate", children: label }) }, label)))] }), _jsxs(TableColumn, { width: 160, children: [_jsx(TableHeaderCell, { iconBefore: "user", children: "Owner" }), [
                        ["RM", "Riley M."],
                        ["AK", "Avery K."],
                        ["JL", "Jordan L."],
                        ["SP", "Sam P."],
                        ["KT", "Kira T."],
                        ["DH", "Dani H."],
                    ].map(([initials, name]) => (_jsxs(TableCell, { children: [_jsx(Avatar, { size: "sm", type: "initials", initials: initials }), _jsx("span", { className: "flex-1 truncate", children: name })] }, name)))] }), _jsxs(TableColumn, { width: 128, children: [_jsx(TableHeaderCell, { children: "Status" }), _jsx(TableCell, { children: _jsx(Chip, { type: "warning", children: "In review" }) }), _jsx(TableCell, { children: _jsx(Chip, { type: "positive", children: "Done" }) }), _jsx(TableCell, { children: _jsx(Chip, { type: "negative", children: "Blocked" }) }), _jsx(TableCell, { children: _jsx(Chip, { type: "primary", children: "Active" }) }), _jsx(TableCell, { children: _jsx(Chip, { type: "primary", children: "Active" }) }), _jsx(TableCell, { children: _jsx(Chip, { type: "positive", children: "Done" }) })] }), _jsxs(TableColumn, { width: 180, children: [_jsx(TableHeaderCell, { children: "Progress" }), [30, 100, 60, 45, 80, 22].map((v, i) => (_jsx(TableCell, { children: _jsx(LinearProgressBar, { size: "sm", type: v >= 100 ? "positive" : v < 30 ? "negative" : "primary", value: v, showLabel: true, className: "flex-1" }) }, i)))] }), _jsxs(TableColumn, { width: 40, children: [_jsx(TableCell, { variant: "control", border: false }), Array.from({ length: 6 }).map((_, i) => (_jsx(TableCell, { variant: "control", border: false, children: _jsx(IconButton, { icon: "ellipsis-vertical", size: "xs", kind: "tertiary", "aria-label": `Actions for row ${i + 1}` }) }, i)))] })] })),
};
