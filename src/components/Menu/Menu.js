import { jsx as _jsx } from "react/jsx-runtime";
import { cva } from "class-variance-authority";
import { forwardRef, } from "react";
import { cn } from "../../lib/cn";
/**
 * Menu — sourced from the TimeWorks Figma file
 * (page "Menu", node 46939:7906; component set 46946:20735).
 *
 *   <Menu>
 *     <ListItem icon="user">Profile</ListItem>
 *     <ListItem icon="bell" rightIcon>Notifications</ListItem>
 *     <ListItem variant="divider" />
 *     <ListItem icon="arrow-right-from-bracket" variant="button">
 *       Sign out
 *     </ListItem>
 *   </Menu>
 *
 * A surface that groups ListItem rows into a contextual menu. Owns the
 * elevation, padding, radius, and width — the rows themselves come from
 * `<ListItem>`. Three width sizes match Figma (sm 160 · md 180 · lg 220);
 * pass `fluid` to opt out and size from the parent.
 */
const menu = cva([
    "flex flex-col items-stretch",
    "bg-[var(--color-secondary-background-color)]",
    "rounded-md p-2",
    "shadow-md",
    "border border-transparent",
], {
    variants: {
        size: {
            sm: "w-[164px]",
            md: "w-[180px]",
            lg: "w-[198px]",
            fluid: "w-full",
        },
    },
    defaultVariants: { size: "md" },
});
export const Menu = forwardRef(function Menu({ size = "md", className, children, ...rest }, ref) {
    return (_jsx("div", { ref: ref, role: "menu", className: cn(menu({ size }), className), ...rest, children: children }));
});
