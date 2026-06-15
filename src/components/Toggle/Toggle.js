import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as RadixSwitch from "@radix-ui/react-switch";
import { cva } from "class-variance-authority";
import { forwardRef, useId, } from "react";
import { cn } from "../../lib/cn";
const track = cva([
    "peer relative inline-flex shrink-0 items-center rounded-full",
    "transition-colors duration-150 ease-out",
    "outline-none",
    "focus-visible:ring-2 focus-visible:ring-[var(--color-primary-color)] focus-visible:ring-offset-2",
    "data-[state=unchecked]:bg-[var(--color-ui-border-color)]",
    "data-[state=checked]:bg-[var(--color-primary-color)]",
    "hover:data-[state=checked]:bg-[var(--color-primary-hover-color)]",
    "disabled:cursor-not-allowed disabled:opacity-40",
].join(" "), {
    variants: {
        size: {
            md: "h-6 w-[42px] p-[3px]",
            sm: "h-4 w-7 p-0.5",
        },
    },
    defaultVariants: { size: "md" },
});
const thumb = cva([
    "pointer-events-none block rounded-full bg-[var(--color-primary-background-color)]",
    "transition-transform duration-150 ease-[cubic-bezier(0.32,0.72,0,1)]",
    "data-[state=unchecked]:translate-x-0",
], {
    variants: {
        size: {
            md: "size-[18px] data-[state=checked]:translate-x-[18px]",
            sm: "size-3 data-[state=checked]:translate-x-[12px]",
        },
    },
    defaultVariants: { size: "md" },
});
export const Toggle = forwardRef(function Toggle({ size = "md", labelOff = "Off", labelOn = "On", className, trackClassName, id, disabled, ...rest }, ref) {
    const sizeKey = size;
    const reactId = useId();
    const inputId = id ?? reactId;
    const root = (_jsx(RadixSwitch.Root, { ref: ref, id: inputId, disabled: disabled, className: cn(track({ size: sizeKey }), trackClassName), ...rest, children: _jsx(RadixSwitch.Thumb, { className: thumb({ size: sizeKey }) }) }));
    if (labelOff == null && labelOn == null) {
        return _jsx("span", { className: cn("inline-flex", className), children: root });
    }
    const labelText = cn("select-none font-body text-t2 leading-5 whitespace-nowrap", disabled
        ? "text-[var(--color-disabled-text-color)]"
        : "text-[var(--color-primary-text-color)]");
    return (_jsxs("label", { htmlFor: inputId, className: cn("inline-flex items-center gap-2", disabled ? "cursor-not-allowed" : "cursor-pointer", className), children: [labelOff != null && _jsx("span", { className: labelText, children: labelOff }), root, labelOn != null && _jsx("span", { className: labelText, children: labelOn })] }));
});
