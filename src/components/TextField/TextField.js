import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cva } from "class-variance-authority";
import { forwardRef, useCallback, useId, useImperativeHandle, useRef, useState, } from "react";
import { Icon } from "../Icon";
import { cn } from "../../lib/cn";
/**
 * TextField — sourced from the TimeWorks Figma file
 * (page "Text Field", node 46939:7918 / component set 46949:33152).
 *
 *   <TextField label="Email" placeholder="you@company.com" />
 *   <TextField size="sm" leadingIcon="magnifying-glass" />
 *   <TextField state="error" helperText="That email is already taken" />
 *   <TextField characterLimit={50} value={value} onValueChange={setValue} />
 *
 * Single-line text input with optional label, leading icon, trailing slot,
 * helper / error text, and character limit. Three sizes (sm/md/lg → 32/40/48px)
 * and six states matching the Figma matrix (default, hover, active, error,
 * disabled, read-only — hover/active fall out of CSS pseudo-classes when the
 * state prop is "default").
 */
const wrapper = cva([
    "flex w-full items-center rounded-md gap-2",
    "pl-4 pr-1 py-1",
    "transition-colors duration-[120ms] ease-out",
    "border bg-[var(--color-secondary-background-color)]",
    "border-[var(--color-ui-border-color)]",
    "[&:hover:not(:focus-within)]:border-[var(--color-primary-text-color)]",
    "focus-within:border-[var(--color-primary-color)]",
    "has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-[var(--color-primary-color)]/20",
].join(" "), {
    variants: {
        size: {
            sm: "h-8",
            md: "h-10",
            lg: "h-12",
        },
        state: {
            default: "",
            error: [
                "border-[var(--color-negative-color)]",
                "[&:hover:not(:focus-within)]:border-[var(--color-negative-color)]",
                "focus-within:border-[var(--color-negative-color)]",
                "has-[input:focus-visible]:ring-[var(--color-negative-color)]/20",
            ].join(" "),
            disabled: [
                "bg-[var(--color-disabled-background-color)]",
                "border-[var(--color-disabled-text-color)]",
                "[&:hover:not(:focus-within)]:border-[var(--color-disabled-text-color)]",
                "cursor-not-allowed",
            ].join(" "),
            readOnly: [
                "bg-[var(--color-allgrey-background-color)]",
                "border-transparent",
                "[&:hover:not(:focus-within)]:border-transparent",
                "focus-within:border-transparent",
                "has-[input:focus-visible]:ring-0",
            ].join(" "),
        },
    },
    defaultVariants: { size: "md", state: "default" },
});
const inputCls = cva([
    "flex-1 min-w-0 bg-transparent outline-none border-0 p-0",
    "font-body text-[var(--color-primary-text-color)]",
    "placeholder:text-[var(--color-placeholder-color)]",
    "disabled:cursor-not-allowed disabled:text-[var(--color-disabled-text-color)]",
    "disabled:placeholder:text-[var(--color-disabled-text-color)]",
    "read-only:cursor-default",
].join(" "), {
    variants: {
        size: {
            sm: "text-t2 leading-5",
            md: "text-t1 leading-[22px]",
            lg: "text-t1 leading-[22px]",
        },
    },
    defaultVariants: { size: "md" },
});
const helperCls = cva("font-body text-t2 leading-5", {
    variants: {
        tone: {
            default: "text-[var(--color-secondary-text-color)]",
            error: "text-[var(--color-negative-color)]",
            disabled: "text-[var(--color-disabled-text-color)]",
        },
    },
    defaultVariants: { tone: "default" },
});
// Figma renders the leading icon at 20×20 across every field size
// (component set 46949:33152). Do not scale it down for `sm` — that
// would diverge from the design.
const LEADING_ICON_SIZE = "sm";
export const TextField = forwardRef(function TextField({ size = "md", state = "default", value, defaultValue, onValueChange, label, required = false, helperText, characterLimit, leadingIcon, trailing, placeholder = "Placeholder text here", className, wrapperClassName, rootClassName, id, type = "text", ...rest }, ref) {
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = useState(defaultValue ?? "");
    const currentValue = isControlled ? value : internalValue;
    const inputRef = useRef(null);
    useImperativeHandle(ref, () => inputRef.current, []);
    const generatedId = useId();
    const fieldId = id ?? generatedId;
    const isDisabled = state === "disabled";
    const isReadOnly = state === "readOnly";
    const handleChange = useCallback((event) => {
        const next = characterLimit != null && event.target.value.length > characterLimit
            ? event.target.value.slice(0, characterLimit)
            : event.target.value;
        if (!isControlled)
            setInternalValue(next);
        onValueChange?.(next);
    }, [characterLimit, isControlled, onValueChange]);
    const helperTone = state === "error" ? "error" : state === "disabled" ? "disabled" : "default";
    const showBottom = helperText != null || characterLimit != null;
    const iconColor = isDisabled
        ? "text-[var(--color-disabled-text-color)]"
        : "text-[var(--color-icon-color)]";
    return (_jsxs("div", { className: cn("flex w-full flex-col gap-1", rootClassName), children: [label && (_jsxs("label", { htmlFor: fieldId, className: "flex gap-1 text-t2 leading-5 font-body text-[var(--color-primary-text-color)]", children: [_jsx("span", { children: label }), required && (_jsx("span", { "aria-hidden": true, className: "text-[var(--color-negative-color)]", children: "*" }))] })), _jsxs("div", { "data-state": state, className: cn(wrapper({ size, state }), wrapperClassName), children: [leadingIcon && (_jsx(Icon, { name: leadingIcon, size: LEADING_ICON_SIZE, "aria-hidden": true, className: cn("shrink-0", iconColor) })), _jsx("input", { ref: inputRef, id: fieldId, type: type, value: currentValue, onChange: handleChange, placeholder: placeholder, disabled: isDisabled, readOnly: isReadOnly, required: required, maxLength: characterLimit, "aria-invalid": state === "error" || undefined, className: cn(inputCls({ size }), className), ...rest }), trailing && _jsx("div", { className: "flex items-center shrink-0", children: trailing })] }), showBottom && (_jsxs("div", { className: "flex items-start justify-between gap-1 w-full", children: [_jsx("p", { className: cn(helperCls({ tone: helperTone }), "flex-1 min-w-0"), children: helperText }), characterLimit != null && (_jsxs("p", { className: cn(helperCls({ tone: helperTone }), "shrink-0 tabular-nums"), children: [currentValue.length, "/", characterLimit] }))] }))] }));
});
