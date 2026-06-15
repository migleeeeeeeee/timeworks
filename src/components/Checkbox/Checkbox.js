import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import * as RadixCheckbox from "@radix-ui/react-checkbox";
import { cva } from "class-variance-authority";
import { forwardRef, useId } from "react";
import { cn } from "../../lib/cn";
/**
 * Checkbox — sourced from the TimeWorks Figma file
 * (page "Checkbox", node 46939:96347).
 *
 *   <Checkbox defaultChecked>Remember me</Checkbox>
 *   <Checkbox checked="indeterminate" onCheckedChange={…} />
 *   <Checkbox error>Accept terms</Checkbox>
 *
 * Built on @radix-ui/react-checkbox so keyboard, focus, and indeterminate
 * behavior match the rest of Radix-backed components. Visuals map the Figma
 * State matrix (Regular / Hover / Selected / Selected hover / Disabled /
 * Disabled selected / Indeterminate / Indeterminate hover / Indeterminate
 * disabled / Error / Error hover) onto our CSS variables.
 */
const box = cva([
    "peer relative inline-flex shrink-0 items-center justify-center",
    "size-4 rounded-[2px] border transition-colors duration-[120ms] ease-out",
    "outline-none",
    "focus-visible:ring-2 focus-visible:ring-[var(--color-primary-color)] focus-visible:ring-offset-2"
].join(" "), {
    variants: {
        tone: {
            // Default: white surface, neutral border, primary fill when checked
            default: [
                "bg-[var(--color-primary-background-color)] border-[var(--color-ui-border-color)]",
                "hover:border-[var(--color-primary-text-color)]",
                "data-[state=checked]:bg-[var(--color-primary-color)] data-[state=checked]:border-[var(--color-primary-color)]",
                "data-[state=indeterminate]:bg-[var(--color-primary-color)] data-[state=indeterminate]:border-[var(--color-primary-color)]",
                "data-[state=checked]:hover:bg-[var(--color-primary-hover-color)] data-[state=checked]:hover:border-[var(--color-primary-hover-color)]",
                "data-[state=indeterminate]:hover:bg-[var(--color-primary-hover-color)] data-[state=indeterminate]:hover:border-[var(--color-primary-hover-color)]",
                "disabled:bg-[var(--color-disabled-background-color)] disabled:border-[var(--color-ui-border-color)]",
                "disabled:hover:border-[var(--color-ui-border-color)]",
                "disabled:data-[state=checked]:bg-[var(--color-disabled-background-color)] disabled:data-[state=checked]:border-[var(--color-ui-border-color)]",
                "disabled:data-[state=indeterminate]:bg-[var(--color-disabled-background-color)] disabled:data-[state=indeterminate]:border-[var(--color-ui-border-color)]",
                "disabled:cursor-not-allowed"
            ].join(" "),
            // Error: negative border, no fill — even when checked the spec keeps it outlined
            error: [
                "bg-[var(--color-primary-background-color)] border-[var(--color-negative-color)]",
                "hover:border-[var(--color-negative-color-hover)]",
                "data-[state=checked]:border-[var(--color-negative-color)]",
                "data-[state=indeterminate]:border-[var(--color-negative-color)]",
                "data-[state=checked]:hover:border-[var(--color-negative-color-hover)]",
                "data-[state=indeterminate]:hover:border-[var(--color-negative-color-hover)]",
                "disabled:cursor-not-allowed"
            ].join(" ")
        }
    },
    defaultVariants: { tone: "default" }
});
export const Checkbox = forwardRef(function Checkbox({ children, error = false, className, boxClassName, id, disabled, ...rest }, ref) {
    const tone = error ? "error" : "default";
    const reactId = useId();
    const inputId = id ?? reactId;
    const root = (_jsx(RadixCheckbox.Root, { ref: ref, id: inputId, disabled: disabled, className: cn(box({ tone }), boxClassName), ...rest, children: _jsx(RadixCheckbox.Indicator, { forceMount: true, className: "group flex items-center justify-center", children: !error && (_jsxs(_Fragment, { children: [_jsx(CheckMark, { className: cn("hidden group-data-[state=checked]:block", disabled
                            ? "text-[var(--color-disabled-text-color)]"
                            : "text-[var(--color-text-color-on-primary)]") }), _jsx("span", { "aria-hidden": "true", className: cn("hidden group-data-[state=indeterminate]:block h-px w-[10px]", disabled ? "bg-[var(--color-disabled-text-color)]" : "bg-[var(--color-text-color-on-primary)]") })] })) }) }));
    if (children == null) {
        return _jsx("span", { className: cn("inline-flex", className), children: root });
    }
    return (_jsxs("label", { htmlFor: inputId, className: cn("inline-flex items-center gap-2 select-none font-body text-t2", disabled
            ? "cursor-not-allowed text-[var(--color-disabled-text-color)]"
            : "cursor-pointer text-[var(--color-primary-text-color)]", className), children: [root, _jsx("span", { className: "leading-5", children: children })] }));
});
/**
 * Radix's Indicator only mounts for the active state, so we rely on its
 * forceMount-less behavior: a single Indicator child renders for both
 * `checked` and `indeterminate`. We branch the visual via a data attribute
 * driven by the parent Root's state — read from `peer` is awkward here, so
 * we use the indicator's own state via CSS attribute selectors.
 */
function CheckMark({ className }) {
    return (_jsx("svg", { viewBox: "0 0 16 16", width: "14", height: "14", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", className: className, children: _jsx("path", { d: "M3.5 8.5l3 3 6-6.5" }) }));
}
