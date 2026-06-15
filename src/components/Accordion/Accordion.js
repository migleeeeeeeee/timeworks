import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, forwardRef, useContext, useId, useMemo, useState, } from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/cn";
import { Icon } from "../Icon";
const AccordionContext = createContext(null);
function useAccordion() {
    const ctx = useContext(AccordionContext);
    if (!ctx)
        throw new Error("Accordion subcomponents must be rendered inside <Accordion>.");
    return ctx;
}
export const Accordion = forwardRef(function Accordion(props, ref) {
    if (props.type === "single") {
        return _jsx(SingleAccordion, { ref: ref, ...props });
    }
    return _jsx(MultipleAccordion, { ref: ref, ...props });
});
const SingleAccordion = forwardRef(function SingleAccordion({ type: _type, collapsible = false, value, defaultValue, onValueChange, className, children, ...rest }, ref) {
    const [internal, setInternal] = useState(defaultValue);
    const isControlled = value !== undefined;
    const current = isControlled ? value : internal;
    const ctx = useMemo(() => ({
        isOpen: (v) => current === v,
        toggle: (v) => {
            const next = current === v ? (collapsible ? "" : current) : v;
            if (!isControlled)
                setInternal(next);
            onValueChange?.(next ?? "");
        },
    }), [current, isControlled, collapsible, onValueChange]);
    return (_jsx(AccordionContext.Provider, { value: ctx, children: _jsx("div", { ref: ref, className: cn("flex flex-col", className), ...rest, children: children }) }));
});
const MultipleAccordion = forwardRef(function MultipleAccordion({ type: _type, value, defaultValue, onValueChange, className, children, ...rest }, ref) {
    const [internal, setInternal] = useState(defaultValue ?? []);
    const isControlled = value !== undefined;
    const current = isControlled ? value : internal;
    const ctx = useMemo(() => ({
        isOpen: (v) => current.includes(v),
        toggle: (v) => {
            const next = current.includes(v) ? current.filter((x) => x !== v) : [...current, v];
            if (!isControlled)
                setInternal(next);
            onValueChange?.(next);
        },
    }), [current, isControlled, onValueChange]);
    return (_jsx(AccordionContext.Provider, { value: ctx, children: _jsx("div", { ref: ref, className: cn("flex flex-col", className), ...rest, children: children }) }));
});
const AccordionItemContext = createContext(null);
function useAccordionItem() {
    const ctx = useContext(AccordionItemContext);
    if (!ctx)
        throw new Error("AccordionTrigger and AccordionContent must be rendered inside <AccordionItem>.");
    return ctx;
}
const itemStyles = cva(
// First/middle/last items share the look from the Figma "Position" variant:
// outer items get rounded corners; middle items collapse the shared border.
[
    "border border-[var(--color-ui-border-color)] bg-transparent",
    "rounded-md",
    "[&:not(:first-child)]:rounded-t-none [&:not(:first-child)]:border-t-0",
    "[&:not(:last-child)]:rounded-b-none",
    "data-[disabled=true]:bg-[var(--color-disabled-background-color)] data-[disabled=true]:border-[var(--color-disabled-background-color)]",
].join(" "));
export const AccordionItem = forwardRef(function AccordionItem({ value, disabled = false, className, children, ...rest }, ref) {
    const { isOpen } = useAccordion();
    const open = isOpen(value);
    const reactId = useId();
    const itemCtx = useMemo(() => ({
        value,
        open,
        disabled,
        triggerId: `accordion-trigger-${reactId}`,
        contentId: `accordion-content-${reactId}`,
    }), [value, open, disabled, reactId]);
    return (_jsx(AccordionItemContext.Provider, { value: itemCtx, children: _jsx("div", { ref: ref, "data-state": open ? "open" : "closed", "data-disabled": disabled || undefined, className: cn(itemStyles(), className), ...rest, children: children }) }));
});
const triggerStyles = cva([
    "group flex w-full items-center gap-2 px-4 py-4 text-left",
    "font-body text-t1 text-[var(--color-primary-text-color)]",
    "outline-none transition-colors duration-200",
    "hover:bg-[var(--color-primary-background-hover-color)]",
    "focus-visible:ring-2 focus-visible:ring-[var(--color-primary-color)] focus-visible:ring-offset-0",
    "disabled:cursor-not-allowed disabled:bg-[var(--color-disabled-background-color)] disabled:text-[var(--color-disabled-text-color)] disabled:hover:bg-[var(--color-disabled-background-color)]",
    // Match the parent item's rounded corners so the hover bg doesn't bleed past the border.
    "rounded-[inherit]",
].join(" "));
export const AccordionTrigger = forwardRef(function AccordionTrigger({ icon, className, children, onClick, ...rest }, ref) {
    const { toggle } = useAccordion();
    const item = useAccordionItem();
    return (_jsxs("button", { ref: ref, type: "button", id: item.triggerId, "aria-expanded": item.open, "aria-controls": item.contentId, disabled: item.disabled, "data-state": item.open ? "open" : "closed", onClick: (e) => {
            onClick?.(e);
            if (e.defaultPrevented)
                return;
            toggle(item.value);
        }, className: cn(triggerStyles(), className), ...rest, children: [icon ? _jsx(Icon, { name: icon, size: "sm" }) : null, _jsx("span", { className: "flex-1 truncate", children: children }), _jsx(Icon, { name: "chevron-down", size: "sm", className: cn("transition-transform duration-200", item.open && "rotate-180") })] }));
});
export const AccordionContent = forwardRef(function AccordionContent({ className, children, ...rest }, ref) {
    const item = useAccordionItem();
    if (!item.open)
        return null;
    return (_jsx("div", { ref: ref, id: item.contentId, role: "region", "aria-labelledby": item.triggerId, "data-state": item.open ? "open" : "closed", className: cn("px-4 pb-4 text-t2 text-[var(--color-secondary-text-color)]", className), ...rest, children: children }));
});
