import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as RadixRadioGroup from "@radix-ui/react-radio-group";
import { cva } from "class-variance-authority";
import { createContext, forwardRef, useContext, useId, } from "react";
import { cn } from "../../lib/cn";
const RadioGroupContext = createContext({ error: false });
const radioBox = cva([
    "relative inline-flex shrink-0 items-center justify-center",
    "size-4 rounded-full border bg-[var(--color-primary-background-color)]",
    "transition-[border-color,border-width,background-color] duration-[120ms] ease-out",
    "outline-none",
    "focus-visible:ring-2 focus-visible:ring-[var(--color-primary-color)] focus-visible:ring-offset-2",
].join(" "), {
    variants: {
        tone: {
            // Regular: 1px neutral border, hover darkens to text-primary-text-color,
            // selected switches to a 4px primary ring (no center dot).
            default: [
                "border-[var(--color-ui-border-color)]",
                "hover:border-[var(--color-primary-text-color)]",
                "data-[state=checked]:border-4 data-[state=checked]:border-[var(--color-primary-color)]",
                "data-[state=checked]:hover:border-[var(--color-primary-hover-color)]",
                // Disabled (unselected): solid disabled fill, no border.
                "disabled:border-transparent disabled:bg-[var(--color-disabled-background-color)]",
                "disabled:hover:border-transparent",
                // Disabled selected: 4px disabled-bg ring around a disabled-text fill.
                "disabled:data-[state=checked]:border-4 disabled:data-[state=checked]:border-[var(--color-disabled-background-color)]",
                "disabled:data-[state=checked]:bg-[var(--color-disabled-text-color)]",
                "disabled:cursor-not-allowed",
            ].join(" "),
            // Error: 1px negative border, hover darkens. Selected keeps the negative
            // tone (Figma has no Error+selected fill — the red border carries it).
            error: [
                "border-[var(--color-negative-color)]",
                "hover:border-[var(--color-negative-color-hover)]",
                "data-[state=checked]:border-4 data-[state=checked]:border-[var(--color-negative-color)]",
                "data-[state=checked]:hover:border-[var(--color-negative-color-hover)]",
                "disabled:cursor-not-allowed",
            ].join(" "),
        },
    },
    defaultVariants: { tone: "default" },
});
export const RadioGroup = forwardRef(function RadioGroup({ error = false, helperText, orientation = "vertical", className, children, ...rest }, ref) {
    const layout = orientation === "horizontal"
        ? "flex flex-row flex-wrap items-center gap-x-4 gap-y-2"
        : "flex flex-col gap-4";
    return (_jsx(RadioGroupContext.Provider, { value: { error }, children: _jsxs("div", { className: "flex flex-col gap-2", children: [_jsx(RadixRadioGroup.Root, { ref: ref, orientation: orientation, className: cn(layout, className), ...rest, children: children }), helperText != null && (_jsx("span", { className: cn("font-body text-t3 leading-4", error
                        ? "text-[var(--color-negative-color)]"
                        : "text-[var(--color-secondary-text-color)]"), children: helperText }))] }) }));
});
export const Radio = forwardRef(function Radio({ children, className, boxClassName, id, disabled, ...rest }, ref) {
    const { error } = useContext(RadioGroupContext);
    const tone = error ? "error" : "default";
    const reactId = useId();
    const inputId = id ?? reactId;
    const box = (_jsx(RadixRadioGroup.Item, { ref: ref, id: inputId, disabled: disabled, className: cn(radioBox({ tone }), boxClassName), ...rest }));
    if (children == null) {
        return _jsx("span", { className: cn("inline-flex", className), children: box });
    }
    return (_jsxs("label", { htmlFor: inputId, className: cn("inline-flex items-center gap-2 select-none font-body text-t2", disabled
            ? "cursor-not-allowed text-[var(--color-disabled-text-color)]"
            : "cursor-pointer text-[var(--color-primary-text-color)]", className), children: [box, _jsx("span", { className: "leading-5", children: children })] }));
});
