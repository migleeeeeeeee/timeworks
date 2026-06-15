import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/cn";
/**
 * Text — typography primitive sourced from the TimeWorks Figma file
 * (page "■ Typography", node 14812:9205).
 *
 * Variants:
 *   h1, h2, h3 → Montserrat (font-heading)
 *   t1, t2, t3 → Karla     (font-body)
 *
 * Weight availability per the Figma spec:
 *   h1       → bold | semibold | medium | regular
 *   h2 / h3  → bold | semibold | medium | light
 *   t1 / t2  → bold | semibold | regular
 *   t3       → semibold | regular
 *
 * The `link` prop adds the underlined "Regular-link" treatment shown in the
 * Text 1/2/3 rows of the Figma sheet.
 */
/* Letter-spacing is per (variant × weight) because the Figma typography
 * sheet mixes pixel- and percent-based tracking by weight. Do not collapse
 * these into a single `tracking-[…]` on the variant. */
const text = cva("font-body", {
    variants: {
        variant: {
            h1: "font-heading text-h1",
            h2: "font-heading text-h2",
            h3: "font-heading text-h3",
            t1: "font-body text-t1",
            t2: "font-body text-t2",
            t3: "font-body text-t3",
        },
        weight: {
            light: "font-light",
            regular: "font-normal",
            medium: "font-medium",
            semibold: "font-semibold",
            bold: "font-bold",
        },
        link: {
            true: "underline underline-offset-2",
            false: "",
        },
    },
    compoundVariants: [
        // Figma PERCENT units are percent-of-font-size = em. Pixel units stay px.
        // H1 — Figma "H1 (32px)/{Bold|Medium|Normal|Light}"
        { variant: "h1", weight: "bold", class: "tracking-[-0.005em]" },
        { variant: "h1", weight: "semibold", class: "tracking-[-0.005em]" },
        { variant: "h1", weight: "medium", class: "tracking-[-0.5px]" },
        { variant: "h1", weight: "regular", class: "tracking-[-0.005em]" },
        // H2 — Figma "H2 (24px)/{Bold|Medium|Normal|Light}"
        { variant: "h2", weight: "bold", class: "tracking-[-0.1px]" },
        { variant: "h2", weight: "semibold", class: "tracking-[-0.1px]" },
        { variant: "h2", weight: "medium", class: "tracking-[-0.005em]" },
        { variant: "h2", weight: "light", class: "tracking-[-0.008em]" },
        // H3 — Figma "H3 (18px)/{Bold|Medium|Normal|Light}"
        { variant: "h3", weight: "bold", class: "tracking-[-0.1px]" },
        { variant: "h3", weight: "semibold", class: "tracking-[-0.1px]" },
        { variant: "h3", weight: "medium", class: "tracking-[-0.005em]" },
        { variant: "h3", weight: "light", class: "tracking-[-0.005em]" },
        // T1/T2/T3 letter-spacing is 0 in Figma — no tracking utility needed.
    ],
    defaultVariants: {
        variant: "t1",
        weight: "regular",
        link: false,
    },
});
const DEFAULT_TAG_BY_VARIANT = {
    h1: "h1",
    h2: "h2",
    h3: "h3",
    t1: "p",
    t2: "p",
    t3: "p",
};
function TextImpl({ as, variant, weight, link, className, ...rest }, ref) {
    const Tag = (as ?? DEFAULT_TAG_BY_VARIANT[variant ?? "t1"]);
    return _jsx(Tag, { ref: ref, className: cn(text({ variant, weight, link }), className), ...rest });
}
export const Text = forwardRef(TextImpl);
