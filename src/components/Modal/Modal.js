import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as Dialog from "@radix-ui/react-dialog";
import { cva } from "class-variance-authority";
import { forwardRef, } from "react";
import { cn } from "../../lib/cn";
import { Icon } from "../Icon";
/**
 * Modal — sourced from the TimeWorks Figma file
 * (page "Modal", node 46939:7907). Built on @radix-ui/react-dialog so
 * focus management, escape-to-close, scroll-locking, and aria roles are
 * handled by Radix. Three layout variants:
 *
 *   <Modal open onOpenChange={...}>
 *     <ModalTrigger asChild><Button>Open</Button></ModalTrigger>
 *     <ModalContent size="medium" title="…" description="…">
 *       …body…
 *       <ModalFooter rightContent={<Button>Main CTA</Button>} />
 *     </ModalContent>
 *   </Modal>
 *
 * Variants:
 *   - basic       (default): header → body → footer
 *   - media       : full-bleed image on top, centered text, footer
 *   - sideBySide  : split body (content left, image right), footer below
 */
const overlay = cva("fixed inset-0 z-50 bg-black/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0");
const content = cva([
    "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2",
    "flex flex-col overflow-clip",
    "bg-[var(--color-primary-background-color)] text-[var(--color-primary-text-color)]",
    "rounded-xl shadow-[var(--shadow-lg)]",
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
    "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
    "focus:outline-none",
].join(" "), {
    variants: {
        size: {
            small: "w-[480px] min-w-[460px] max-w-[520px]",
            medium: "w-[580px] min-w-[540px] max-w-[620px]",
            large: "w-[840px] min-w-[800px] max-w-[900px]",
        },
    },
    defaultVariants: { size: "medium" },
});
/* ─────────────────────────────  Root pieces  ───────────────────────────── */
export const Modal = Dialog.Root;
export const ModalTrigger = Dialog.Trigger;
export const ModalClose = Dialog.Close;
export const ModalPortal = Dialog.Portal;
/* ─────────────────────────────  Overlay  ───────────────────────────────── */
export const ModalOverlay = forwardRef(function ModalOverlay({ className, ...rest }, ref) {
    return _jsx(Dialog.Overlay, { ref: ref, className: cn(overlay(), className), ...rest });
});
export const ModalContent = forwardRef(function ModalContent({ className, size = "medium", title, description, hideCloseButton = false, closeLabel = "Close", children, ...rest }, ref) {
    const hasManagedHeader = title != null || description != null;
    return (_jsxs(ModalPortal, { children: [_jsx(ModalOverlay, {}), _jsxs(Dialog.Content, { ref: ref, className: cn(content({ size }), className), ...rest, children: [hasManagedHeader ? (_jsxs(ModalHeader, { children: [title != null && _jsx(ModalTitle, { children: title }), description != null && _jsx(ModalDescription, { children: description })] })) : null, children, !hideCloseButton && (_jsx(Dialog.Close, { "aria-label": closeLabel, className: cn("absolute right-6 top-6 inline-flex items-center justify-center size-8 rounded-md", "text-[var(--color-icon-color)] hover:bg-[var(--color-primary-background-hover-color)]", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-color)] focus-visible:ring-offset-1", "transition-colors duration-[120ms] ease-out"), children: _jsx(Icon, { name: "x-mark-small", size: "sm", className: "text-current p-0" }) }))] })] }));
});
export const ModalHeader = forwardRef(function ModalHeader({ className, bordered = false, children, ...rest }, ref) {
    return (_jsx("div", { ref: ref, "data-slot": "header", className: cn("flex flex-col gap-1 px-8 pt-8 pb-6 w-full", bordered && "border-b border-[var(--color-layout-border-color)]", className), ...rest, children: children }));
});
/* ─────────────────────────────  Title  ─────────────────────────────────── */
export const ModalTitle = forwardRef(function ModalTitle({ className, ...rest }, ref) {
    return (_jsx(Dialog.Title, { ref: ref, className: cn("font-heading font-semibold text-h2 text-[var(--color-primary-text-color)] tracking-[-0.1px] pr-12", "max-h-16 max-w-[700px] overflow-hidden text-ellipsis", className), ...rest }));
});
/* ──────────────────────────  Description  ──────────────────────────────── */
export const ModalDescription = forwardRef(function ModalDescription({ className, ...rest }, ref) {
    return (_jsx(Dialog.Description, { ref: ref, className: cn("font-body text-t1 text-[var(--color-primary-text-color)]", className), ...rest }));
});
export const ModalBody = forwardRef(function ModalBody({ className, scrollable = false, ...rest }, ref) {
    return (_jsx("div", { ref: ref, "data-slot": "body", className: cn("flex flex-col px-8 pb-8 w-full", scrollable && "overflow-y-auto max-h-[60vh]", className), ...rest }));
});
export const ModalFooter = forwardRef(function ModalFooter({ className, leftContent, centerContent, rightContent, elevated = false, ...rest }, ref) {
    return (_jsxs("div", { ref: ref, "data-slot": "footer", className: cn("flex items-center justify-between gap-2 h-20 px-6 w-full", "bg-[var(--color-primary-background-color)]", elevated && "shadow-[0_-6px_10px_0_rgba(0,0,0,0.2)]", className), ...rest, children: [_jsx("div", { className: "flex flex-1 min-w-0 items-center", children: leftContent }), centerContent && (_jsx("div", { className: "flex shrink-0 items-center", children: centerContent })), _jsx("div", { className: "flex flex-1 min-w-0 items-center justify-end gap-2", children: rightContent })] }));
});
export const ModalMedia = forwardRef(function ModalMedia({ className, src, alt = "", height = 260, children, style, ...rest }, ref) {
    return (_jsx("div", { ref: ref, "data-slot": "media", style: { height, ...style }, className: cn("relative w-full shrink-0 overflow-hidden bg-[var(--color-allgrey-background-color)]", className), ...rest, children: children ??
            (src ? (_jsx("img", { alt: alt, src: src, className: "absolute inset-0 size-full object-cover pointer-events-none" })) : null) }));
});
export const ModalSideBySide = forwardRef(function ModalSideBySide({ className, side, sideWidth = 340, children, ...rest }, ref) {
    return (_jsxs("div", { ref: ref, "data-slot": "side-by-side", className: cn("flex w-full overflow-clip", className), ...rest, children: [_jsx("div", { className: "flex flex-1 min-w-0 flex-col", children: children }), _jsx("div", { className: "shrink-0 self-stretch", style: { width: sideWidth }, children: side })] }));
});
