import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Table } from "./Table";
import { TableCell } from "./TableCell";
import { TableHeaderCell } from "./TableHeaderCell";
import { TableColumn } from "./TableColumn";
import { TableColumnLoader } from "./TableColumnLoader";
import { Avatar } from "../Avatar";
import { Checkbox } from "../Checkbox";
import { Chip } from "../Chip";
import { IconButton } from "../IconButton";
import { LinearProgressBar } from "../LinearProgressBar";
const meta = {
    title: "Components/Table",
    component: Table,
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component: 'Composed table wrapper. Lays a row of `<TableColumn>` (or `<TableColumnLoader>`) children inside a bordered radius shell, and propagates a default `size` (`sm` | `md` | `lg`) via context so descendant cells inherit it. Sourced from the TimeWorks Figma file (page "Table", showcase node 46939:7915, "Use Case" frame).',
            },
        },
    },
    tags: ["autodocs"],
    argTypes: {
        bordered: { control: "boolean" },
        size: { control: "radio", options: ["sm", "md", "lg"] },
    },
    args: {
        bordered: true,
        size: "md",
    },
};
export default meta;
const TASKS = [
    { id: 1, name: "Audit Q4 invoices", owner: ["RM", "Riley M."], status: ["warning", "In review"], progress: 30 },
    { id: 2, name: "Update onboarding", owner: ["AK", "Avery K."], status: ["positive", "Done"], progress: 100 },
    { id: 3, name: "Migrate auth flow", owner: ["JL", "Jordan L."], status: ["negative", "Blocked"], progress: 60 },
    { id: 4, name: "Refresh design tokens", owner: ["SP", "Sam P."], status: ["primary", "Active"], progress: 45 },
    { id: 5, name: "Plan offsite agenda", owner: ["KT", "Kira T."], status: ["primary", "Active"], progress: 12 },
    { id: 6, name: "Cut release branch", owner: ["DH", "Dani H."], status: ["positive", "Done"], progress: 100 },
];
function ContentColumns() {
    return (_jsxs(_Fragment, { children: [_jsxs(TableColumn, { width: 40, children: [_jsx(TableCell, { variant: "control", children: _jsx(Checkbox, { "aria-label": "Select all" }) }), TASKS.map((row) => (_jsx(TableCell, { variant: "control", children: _jsx(Checkbox, { "aria-label": `Select ${row.name}` }) }, row.id)))] }), _jsxs(TableColumn, { width: 228, children: [_jsx(TableHeaderCell, { sortDirection: "asc", children: "Task" }), TASKS.map((row) => (_jsx(TableCell, { children: _jsx("span", { className: "flex-1 truncate", children: row.name }) }, row.id)))] }), _jsxs(TableColumn, { width: 180, children: [_jsx(TableHeaderCell, { iconBefore: "user", children: "Owner" }), TASKS.map((row) => (_jsxs(TableCell, { children: [_jsx(Avatar, { size: "sm", type: "initials", initials: row.owner[0] }), _jsx("span", { className: "flex-1 truncate", children: row.owner[1] })] }, row.id)))] }), _jsxs(TableColumn, { width: 128, children: [_jsx(TableHeaderCell, { children: "Status" }), TASKS.map((row) => (_jsx(TableCell, { children: _jsx(Chip, { type: row.status[0], children: row.status[1] }) }, row.id)))] }), _jsxs(TableColumn, { width: 180, children: [_jsx(TableHeaderCell, { children: "Progress" }), TASKS.map((row) => (_jsx(TableCell, { children: _jsx(LinearProgressBar, { size: "sm", type: row.progress >= 100 ? "positive" : row.progress < 30 ? "negative" : "primary", value: row.progress, showLabel: true, className: "flex-1" }) }, row.id)))] }), _jsxs(TableColumn, { width: 40, children: [_jsx(TableCell, { variant: "control", border: false }), TASKS.map((row) => (_jsx(TableCell, { variant: "control", border: false, children: _jsx(IconButton, { icon: "ellipsis-vertical", size: "xs", kind: "tertiary", "aria-label": `Actions for ${row.name}` }) }, row.id)))] })] }));
}
export const Playground = {
    render: (args) => (_jsx(Table, { ...args, children: _jsx(ContentColumns, {}) })),
};
export const Bordered = {
    name: "Use Case · Bordered",
    args: { bordered: true, size: "md" },
    render: (args) => (_jsx(Table, { ...args, children: _jsx(ContentColumns, {}) })),
};
export const Borderless = {
    name: "Use Case · No border",
    args: { bordered: false, size: "md" },
    render: (args) => (_jsx(Table, { ...args, children: _jsx(ContentColumns, {}) })),
};
export const SizeSmall = {
    name: "Size · Small (32)",
    args: { size: "sm" },
    render: (args) => (_jsx(Table, { ...args, children: _jsx(ContentColumns, {}) })),
};
export const SizeMedium = {
    name: "Size · Medium (40)",
    args: { size: "md" },
    render: (args) => (_jsx(Table, { ...args, children: _jsx(ContentColumns, {}) })),
};
export const SizeLarge = {
    name: "Size · Large (48)",
    args: { size: "lg" },
    render: (args) => (_jsx(Table, { ...args, children: _jsx(ContentColumns, {}) })),
};
export const States = {
    name: "States · Default · Hover · Selected",
    render: () => (_jsxs(Table, { size: "md", children: [_jsxs(TableColumn, { width: 40, children: [_jsx(TableCell, { variant: "control", children: _jsx(Checkbox, { "aria-label": "Select all" }) }), _jsx(TableCell, { variant: "control", children: _jsx(Checkbox, { "aria-label": "Select row 1" }) }), _jsx(TableCell, { variant: "control", state: "hover", children: _jsx(Checkbox, { "aria-label": "Select row 2" }) }), _jsx(TableCell, { variant: "control", state: "selected", children: _jsx(Checkbox, { checked: true, "aria-label": "Select row 3" }) }), _jsx(TableCell, { variant: "control", state: "selected-hover", children: _jsx(Checkbox, { checked: true, "aria-label": "Select row 4" }) })] }), _jsxs(TableColumn, { width: 228, children: [_jsx(TableHeaderCell, { sortDirection: "asc", children: "Task" }), _jsx(TableCell, { children: _jsx("span", { className: "flex-1 truncate", children: "Default" }) }), _jsx(TableCell, { state: "hover", children: _jsx("span", { className: "flex-1 truncate", children: "Hover" }) }), _jsx(TableCell, { state: "selected", children: _jsx("span", { className: "flex-1 truncate", children: "Selected" }) }), _jsx(TableCell, { state: "selected-hover", children: _jsx("span", { className: "flex-1 truncate", children: "Selected \u00B7 Hover" }) })] }), _jsxs(TableColumn, { width: 128, children: [_jsx(TableHeaderCell, { children: "Status" }), _jsx(TableCell, { children: _jsx(Chip, { type: "primary", children: "Active" }) }), _jsx(TableCell, { state: "hover", children: _jsx(Chip, { type: "primary", children: "Active" }) }), _jsx(TableCell, { state: "selected", children: _jsx(Chip, { type: "positive", children: "Done" }) }), _jsx(TableCell, { state: "selected-hover", children: _jsx(Chip, { type: "positive", children: "Done" }) })] })] })),
};
export const Loading = {
    name: "Loading · Skeleton columns",
    render: () => (_jsxs(Table, { size: "md", children: [_jsx(TableColumnLoader, { width: 228, shape: "text", rows: 8, header: _jsx(TableHeaderCell, { sortDirection: "asc", children: "Placeholder for text" }) }), _jsx(TableColumnLoader, { width: 112, shape: "rectangle", rows: 8, header: _jsx(TableHeaderCell, { children: "Pla..." }) }), _jsx(TableColumnLoader, { width: 112, shape: "circle", rows: 8, header: _jsx(TableHeaderCell, { children: "Pla..." }) }), _jsx(TableColumnLoader, { width: 112, shape: "square", rows: 8, header: _jsx(TableHeaderCell, { children: "Pla..." }) })] })),
};
