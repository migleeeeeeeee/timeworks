import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cva } from "class-variance-authority";
import { forwardRef } from "react";
import { cn } from "../../lib/cn";
import { Icon } from "../Icon";
/**
 * Button — sourced from the TimeWorks Figma file
 * (page "Button", node 46939:7886).
 *
 *   <Button kind="primary" size="md" iconLeft="hexagon">Save</Button>
 *
 * Maps the Figma matrix (Kind × Size × Color × State × Icon) onto a
 * cva-driven API. Defaults match the Figma "Medium / Primary / Primary"
 * cell: 40px high, fully rounded pill, Karla 16/22.
 *
 * Filled variants are gradient pills with a hue-matched drop-shadow glow and
 * an inset 1px white highlight — see `filled()` below.
 */
// Filled variants share a gradient + hue-matched glow + 1px inner highlight.
// Each row's classes are inlined as literal strings so Tailwind v4's source
// scanner can detect them — building them via a template-literal helper makes
// Tailwind skip generating the CSS and the button renders invisible.
const DISABLED_FILL = "disabled:bg-none disabled:bg-[var(--color-disabled-background-color)] disabled:shadow-none disabled:text-[var(--color-secondary-text-color)]";
const root = cva([
    "inline-flex items-center justify-center select-none whitespace-nowrap font-body font-normal",
    "transition duration-[120ms] ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-color)] focus-visible:ring-offset-2",
    "disabled:cursor-not-allowed"
].join(" "), {
    variants: {
        size: {
            xs: "h-6 px-2 gap-2 text-t2 rounded-full",
            sm: "h-8 px-2 gap-2 text-t2 rounded-full",
            md: "h-10 px-4 gap-2 text-t1 rounded-full",
            lg: "h-12 px-6 gap-2 text-t1 rounded-full"
        },
        kind: {
            primary: "border border-transparent",
            secondary: "border bg-[var(--color-secondary-background-color)] backdrop-blur-md",
            tertiary: "border border-transparent bg-transparent",
            brand: "border border-transparent"
        },
        color: {
            primary: "",
            negative: "",
            positive: "",
            inverted: "",
            "on-primary": "",
            "on-negative": "",
            "on-positive": "",
            "on-warning": "",
            "on-inverted": ""
        }
    },
    compoundVariants: [
        // Primary (filled)
        {
            kind: "primary",
            color: "primary",
            class: "text-[var(--color-text-color-on-primary)] " +
                "bg-[linear-gradient(to_bottom,var(--color-primary-color),var(--color-primary-hover-color))] " +
                "shadow-[0_6px_16px_color-mix(in_srgb,var(--color-primary-color)_45%,transparent),inset_0_1px_0_rgb(255_255_255/0.25)] " +
                "hover:bg-[linear-gradient(to_bottom,var(--color-primary-hover-color),var(--color-primary-hover-color))] " +
                "hover:shadow-[0_6px_20px_color-mix(in_srgb,var(--color-primary-color)_58%,transparent),inset_0_1px_0_rgb(255_255_255/0.25)] " +
                "active:bg-[linear-gradient(to_bottom,var(--color-primary-hover-color),var(--color-primary-color))] " +
                "active:shadow-[0_6px_10px_color-mix(in_srgb,var(--color-primary-color)_28%,transparent),inset_0_1px_0_rgb(255_255_255/0.25)] " +
                DISABLED_FILL
        },
        // Inverted (gradient dark pill on light surfaces)
        {
            kind: "primary",
            color: "inverted",
            class: "text-[var(--color-text-color-on-inverted)] " +
                "bg-[linear-gradient(to_bottom,var(--color-inverted-color-background),var(--color-fixed-dark-color))] " +
                "shadow-[0_6px_16px_color-mix(in_srgb,var(--color-inverted-color-background)_45%,transparent),inset_0_1px_0_rgb(255_255_255/0.25)] " +
                "hover:bg-[linear-gradient(to_bottom,var(--color-fixed-dark-color),var(--color-fixed-dark-color))] " +
                "hover:shadow-[0_6px_20px_color-mix(in_srgb,var(--color-inverted-color-background)_58%,transparent),inset_0_1px_0_rgb(255_255_255/0.25)] " +
                "active:bg-[linear-gradient(to_bottom,var(--color-fixed-dark-color),var(--color-inverted-color-background))] " +
                "active:shadow-[0_6px_10px_color-mix(in_srgb,var(--color-inverted-color-background)_28%,transparent),inset_0_1px_0_rgb(255_255_255/0.25)] " +
                DISABLED_FILL
        },
        {
            kind: "primary",
            color: "negative",
            class: "text-[var(--color-text-color-on-primary)] " +
                "bg-[linear-gradient(to_bottom,var(--color-negative-color),var(--color-negative-color-hover))] " +
                "shadow-[0_6px_16px_color-mix(in_srgb,var(--color-negative-color)_45%,transparent),inset_0_1px_0_rgb(255_255_255/0.25)] " +
                "hover:bg-[linear-gradient(to_bottom,var(--color-negative-color-hover),var(--color-negative-color-hover))] " +
                "hover:shadow-[0_6px_20px_color-mix(in_srgb,var(--color-negative-color)_58%,transparent),inset_0_1px_0_rgb(255_255_255/0.25)] " +
                "active:bg-[linear-gradient(to_bottom,var(--color-negative-color-hover),var(--color-negative-color))] " +
                "active:shadow-[0_6px_10px_color-mix(in_srgb,var(--color-negative-color)_28%,transparent),inset_0_1px_0_rgb(255_255_255/0.25)] " +
                DISABLED_FILL
        },
        {
            kind: "primary",
            color: "positive",
            class: "text-[var(--color-text-color-on-primary)] " +
                "bg-[linear-gradient(to_bottom,var(--color-positive-color),var(--color-positive-color-hover))] " +
                "shadow-[0_6px_16px_color-mix(in_srgb,var(--color-positive-color)_45%,transparent),inset_0_1px_0_rgb(255_255_255/0.25)] " +
                "hover:bg-[linear-gradient(to_bottom,var(--color-positive-color-hover),var(--color-positive-color-hover))] " +
                "hover:shadow-[0_6px_20px_color-mix(in_srgb,var(--color-positive-color)_58%,transparent),inset_0_1px_0_rgb(255_255_255/0.25)] " +
                "active:bg-[linear-gradient(to_bottom,var(--color-positive-color-hover),var(--color-positive-color))] " +
                "active:shadow-[0_6px_10px_color-mix(in_srgb,var(--color-positive-color)_28%,transparent),inset_0_1px_0_rgb(255_255_255/0.25)] " +
                DISABLED_FILL
        },
        // Secondary (outlined)
        {
            kind: "secondary",
            color: "primary",
            class: "border-[var(--color-ui-border-color)] text-[var(--color-primary-text-color)] hover:bg-[var(--color-primary-background-hover-color)] active:bg-[var(--color-primary-selected-color)] active:border-[var(--color-primary-color)] active:text-[var(--color-primary-color)] disabled:border-[var(--color-ui-border-color)] disabled:text-[var(--color-disabled-text-color)] disabled:bg-[var(--color-disabled-background-color)]"
        },
        {
            kind: "secondary",
            color: "inverted",
            class: "border-[var(--color-ui-border-color)] text-[var(--color-primary-text-color)] hover:bg-[var(--color-primary-background-hover-color)] active:bg-[var(--color-primary-selected-color)] disabled:border-[var(--color-ui-border-color)] disabled:text-[var(--color-disabled-text-color)] disabled:bg-[var(--color-disabled-background-color)]"
        },
        {
            kind: "secondary",
            color: "negative",
            class: "border-[var(--color-negative-color)] text-[var(--color-negative-color)] hover:bg-[var(--color-negative-color-selected)] active:bg-[var(--color-negative-color-selected)] disabled:text-[var(--color-disabled-text-color)] disabled:border-[var(--color-ui-border-color)] disabled:bg-[var(--color-disabled-background-color)]"
        },
        {
            kind: "secondary",
            color: "positive",
            class: "border-[var(--color-positive-color)] text-[var(--color-positive-color)] hover:bg-[var(--color-positive-color-selected)] active:bg-[var(--color-positive-color-selected)] disabled:text-[var(--color-disabled-text-color)] disabled:border-[var(--color-ui-border-color)] disabled:bg-[var(--color-disabled-background-color)]"
        },
        // Tertiary (ghost)
        {
            kind: "tertiary",
            color: "inverted",
            class: "text-[var(--color-primary-text-color)] hover:bg-[var(--color-primary-background-hover-color)] active:bg-[var(--color-primary-selected-color)] disabled:text-[var(--color-disabled-text-color)] disabled:bg-transparent"
        },
        {
            kind: "tertiary",
            color: "primary",
            class: "text-[var(--color-primary-text-color)] hover:bg-[var(--color-primary-background-hover-color)] active:bg-[var(--color-primary-selected-color)] active:text-[var(--color-primary-color)] disabled:text-[var(--color-disabled-text-color)] disabled:bg-transparent"
        },
        {
            kind: "tertiary",
            color: "negative",
            class: "text-[var(--color-negative-color)] hover:bg-[var(--color-negative-color-selected)] active:bg-[var(--color-negative-color-selected)] disabled:text-[var(--color-disabled-text-color)] disabled:bg-transparent"
        },
        {
            kind: "tertiary",
            color: "positive",
            class: "text-[var(--color-positive-color)] hover:bg-[var(--color-positive-color-selected)] active:bg-[var(--color-positive-color-selected)] disabled:text-[var(--color-disabled-text-color)] disabled:bg-transparent"
        },
        // Brand (always brand hue, ignores `color`)
        {
            kind: "brand",
            class: "text-[var(--color-text-color-on-primary)] " +
                "bg-[linear-gradient(to_bottom,var(--color-brand-color),var(--color-brand-hover-color))] " +
                "shadow-[0_6px_16px_color-mix(in_srgb,var(--color-brand-color)_45%,transparent),inset_0_1px_0_rgb(255_255_255/0.25)] " +
                "hover:bg-[linear-gradient(to_bottom,var(--color-brand-hover-color),var(--color-brand-hover-color))] " +
                "hover:shadow-[0_6px_20px_color-mix(in_srgb,var(--color-brand-color)_58%,transparent),inset_0_1px_0_rgb(255_255_255/0.25)] " +
                "active:bg-[linear-gradient(to_bottom,var(--color-brand-hover-color),var(--color-brand-color))] " +
                "active:shadow-[0_6px_10px_color-mix(in_srgb,var(--color-brand-color)_28%,transparent),inset_0_1px_0_rgb(255_255_255/0.25)] " +
                DISABLED_FILL
        },
        // On-color (filled white pill for use on top of a saturated banner/surface)
        {
            kind: "primary",
            color: "on-primary",
            class: "bg-[var(--color-text-color-on-primary)] text-[var(--color-primary-color)] hover:bg-[var(--color-primary-selected-color)] active:bg-[var(--color-primary-selected-hover-color)] disabled:bg-[var(--color-disabled-background-color)] disabled:text-[var(--color-disabled-text-color)]"
        },
        {
            kind: "primary",
            color: "on-negative",
            class: "bg-[var(--color-text-color-on-primary)] text-[var(--color-negative-color)] hover:bg-[var(--color-negative-color-selected)] active:bg-[var(--color-negative-color-selected-hover)] disabled:bg-[var(--color-disabled-background-color)] disabled:text-[var(--color-disabled-text-color)]"
        },
        {
            kind: "primary",
            color: "on-positive",
            class: "bg-[var(--color-text-color-on-primary)] text-[var(--color-positive-color)] hover:bg-[var(--color-positive-color-selected)] active:bg-[var(--color-positive-color-selected-hover)] disabled:bg-[var(--color-disabled-background-color)] disabled:text-[var(--color-disabled-text-color)]"
        },
        {
            kind: "primary",
            color: "on-warning",
            class: "bg-[var(--color-text-color-on-primary)] text-[var(--color-fixed-dark-color)] hover:bg-[var(--color-warning-color-selected)] active:bg-[var(--color-warning-color-selected-hover)] disabled:bg-[var(--color-disabled-background-color)] disabled:text-[var(--color-disabled-text-color)]"
        },
        // On Inverted: outlined pill for use on top of an inverted/dark surface
        {
            kind: "primary",
            color: "on-inverted",
            class: "border-[var(--color-text-color-on-inverted)] bg-[var(--color-primary-background-color)] text-[var(--color-primary-text-color)] hover:bg-[var(--color-primary-background-hover-color)] active:bg-[var(--color-primary-selected-color)] disabled:bg-[var(--color-disabled-background-color)] disabled:text-[var(--color-disabled-text-color)] disabled:border-[var(--color-ui-border-color)]"
        },
        // Secondary on tinted/inverted surface — dark border + text against any
        // colored attention-box / banner background.
        {
            kind: "secondary",
            color: "on-inverted",
            class: "border-[var(--color-primary-text-color)] text-[var(--color-primary-text-color)] hover:bg-[var(--color-primary-background-hover-color)] active:bg-[var(--color-primary-selected-color)] disabled:border-[var(--color-ui-border-color)] disabled:text-[var(--color-disabled-text-color)] disabled:bg-transparent"
        }
    ],
    defaultVariants: {
        kind: "primary",
        size: "md",
        color: "primary"
    }
});
const ICON_SIZE = {
    xs: "xs",
    sm: "sm",
    md: "sm",
    lg: "sm"
};
export const Button = forwardRef(function Button({ className, kind, size = "md", color, iconLeft, iconRight, loading = false, disabled, type = "button", children, ...rest }, ref) {
    const iconSize = ICON_SIZE[size ?? "md"];
    const isDisabled = disabled || loading;
    return (_jsxs("button", { ref: ref, type: type, disabled: isDisabled, "data-loading": loading || undefined, className: cn(root({ kind, size, color }), className), ...rest, children: [loading ? (_jsx(Icon, { name: "loader", size: iconSize, className: "text-current p-0 animate-spin", "aria-label": "Loading" })) : (iconLeft && _jsx(Icon, { name: iconLeft, size: iconSize, className: "text-current p-0" })), children != null && _jsx("span", { children: children }), !loading && iconRight && (_jsx(Icon, { name: iconRight, size: iconSize, className: "text-current p-0" }))] }));
});
