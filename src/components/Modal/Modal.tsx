import * as Dialog from "@radix-ui/react-dialog"
import { cva, type VariantProps } from "class-variance-authority"
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type HTMLAttributes,
  type ReactNode,
} from "react"
import { cn } from "../../lib/cn"
import { Icon } from "../Icon"

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

const overlay = cva(
  "fixed inset-0 z-50 bg-black/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
)

const content = cva(
  [
    "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2",
    "flex flex-col overflow-clip",
    "bg-[var(--color-primary-background-color)] text-[var(--color-primary-text-color)]",
    "rounded-xl shadow-[var(--shadow-lg)]",
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
    "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
    "focus:outline-none",
  ].join(" "),
  {
    variants: {
      size: {
        small: "w-[480px] min-w-[460px] max-w-[520px]",
        medium: "w-[580px] min-w-[540px] max-w-[620px]",
        large: "w-[840px] min-w-[800px] max-w-[900px]",
      },
    },
    defaultVariants: { size: "medium" },
  },
)

type Size = NonNullable<VariantProps<typeof content>["size"]>

/* ─────────────────────────────  Root pieces  ───────────────────────────── */

export const Modal = Dialog.Root
export const ModalTrigger = Dialog.Trigger
export const ModalClose = Dialog.Close
export const ModalPortal = Dialog.Portal

/* ─────────────────────────────  Overlay  ───────────────────────────────── */

export const ModalOverlay = forwardRef<
  ElementRef<typeof Dialog.Overlay>,
  ComponentPropsWithoutRef<typeof Dialog.Overlay>
>(function ModalOverlay({ className, ...rest }, ref) {
  return <Dialog.Overlay ref={ref} className={cn(overlay(), className)} {...rest} />
})

/* ─────────────────────────────  Content  ───────────────────────────────── */

export type ModalContentProps = ComponentPropsWithoutRef<typeof Dialog.Content> & {
  /** Width preset. */
  size?: Size
  /** Optional convenience: render a default header with title/description + close button. */
  title?: ReactNode
  description?: ReactNode
  /** Hide the close (X) button in the top-right corner. Default false. */
  hideCloseButton?: boolean
  /** Accessible label for the close button. Default "Close". */
  closeLabel?: string
}

export const ModalContent = forwardRef<
  ElementRef<typeof Dialog.Content>,
  ModalContentProps
>(function ModalContent(
  {
    className,
    size = "medium",
    title,
    description,
    hideCloseButton = false,
    closeLabel = "Close",
    children,
    ...rest
  },
  ref,
) {
  const hasManagedHeader = title != null || description != null
  return (
    <ModalPortal>
      <ModalOverlay />
      <Dialog.Content ref={ref} className={cn(content({ size }), className)} {...rest}>
        {hasManagedHeader ? (
          <ModalHeader>
            {title != null && <ModalTitle>{title}</ModalTitle>}
            {description != null && <ModalDescription>{description}</ModalDescription>}
          </ModalHeader>
        ) : null}
        {children}
        {!hideCloseButton && (
          <Dialog.Close
            aria-label={closeLabel}
            className={cn(
              "absolute right-6 top-6 inline-flex items-center justify-center size-8 rounded-md",
              "text-[var(--color-icon-color)] hover:bg-[var(--color-primary-background-hover-color)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-color)] focus-visible:ring-offset-1",
              "transition-colors duration-[120ms] ease-out",
            )}
          >
            <Icon name="x-mark-small" size="sm" className="text-current p-0" />
          </Dialog.Close>
        )}
      </Dialog.Content>
    </ModalPortal>
  )
})

/* ─────────────────────────────  Header  ────────────────────────────────── */

export type ModalHeaderProps = HTMLAttributes<HTMLDivElement> & {
  /** Adds a bottom border. Use when the body scrolls. */
  bordered?: boolean
}

export const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(function ModalHeader(
  { className, bordered = false, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      data-slot="header"
      className={cn(
        "flex flex-col gap-1 px-8 pt-8 pb-6 w-full",
        bordered && "border-b border-[var(--color-layout-border-color)]",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
})

/* ─────────────────────────────  Title  ─────────────────────────────────── */

export const ModalTitle = forwardRef<
  ElementRef<typeof Dialog.Title>,
  ComponentPropsWithoutRef<typeof Dialog.Title>
>(function ModalTitle({ className, ...rest }, ref) {
  return (
    <Dialog.Title
      ref={ref}
      className={cn(
        "font-heading font-semibold text-h2 text-[var(--color-primary-text-color)] tracking-[-0.1px] pr-12",
        "max-h-16 max-w-[700px] overflow-hidden text-ellipsis",
        className,
      )}
      {...rest}
    />
  )
})

/* ──────────────────────────  Description  ──────────────────────────────── */

export const ModalDescription = forwardRef<
  ElementRef<typeof Dialog.Description>,
  ComponentPropsWithoutRef<typeof Dialog.Description>
>(function ModalDescription({ className, ...rest }, ref) {
  return (
    <Dialog.Description
      ref={ref}
      className={cn("font-body text-t1 text-[var(--color-primary-text-color)]", className)}
      {...rest}
    />
  )
})

/* ─────────────────────────────  Body  ──────────────────────────────────── */

export type ModalBodyProps = HTMLAttributes<HTMLDivElement> & {
  /** Make the body the scrollable region when content overflows. */
  scrollable?: boolean
}

export const ModalBody = forwardRef<HTMLDivElement, ModalBodyProps>(function ModalBody(
  { className, scrollable = false, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      data-slot="body"
      className={cn(
        "flex flex-col px-8 pb-8 w-full",
        scrollable && "overflow-y-auto max-h-[60vh]",
        className,
      )}
      {...rest}
    />
  )
})

/* ─────────────────────────────  Footer  ────────────────────────────────── */

export type ModalFooterProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  /** Optional left-aligned content (e.g. a "Don't show again" Checkbox). */
  leftContent?: ReactNode
  /** Optional center content (e.g. a stepper). */
  centerContent?: ReactNode
  /** Right-aligned action(s) (typically the primary CTA). */
  rightContent?: ReactNode
  /** Adds a top shadow, matching Figma's "scrolling" footer treatment. */
  elevated?: boolean
}

export const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(function ModalFooter(
  { className, leftContent, centerContent, rightContent, elevated = false, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      data-slot="footer"
      className={cn(
        "flex items-center justify-between gap-2 h-20 px-6 w-full",
        "bg-[var(--color-primary-background-color)]",
        elevated && "shadow-[0_-6px_10px_0_rgba(0,0,0,0.2)]",
        className,
      )}
      {...rest}
    >
      <div className="flex flex-1 min-w-0 items-center">{leftContent}</div>
      {centerContent && (
        <div className="flex shrink-0 items-center">{centerContent}</div>
      )}
      <div className="flex flex-1 min-w-0 items-center justify-end gap-2">
        {rightContent}
      </div>
    </div>
  )
})

/* ─────────────────────────────  Media  ─────────────────────────────────── */

export type ModalMediaProps = HTMLAttributes<HTMLDivElement> & {
  /** Image src, used when no children are provided. */
  src?: string
  /** Alt text for the default image. */
  alt?: string
  /** Height of the media region. Default 260px (matches Figma "Modal / Media"). */
  height?: number | string
}

export const ModalMedia = forwardRef<HTMLDivElement, ModalMediaProps>(function ModalMedia(
  { className, src, alt = "", height = 260, children, style, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      data-slot="media"
      style={{ height, ...style }}
      className={cn(
        "relative w-full shrink-0 overflow-hidden bg-[var(--color-allgrey-background-color)]",
        className,
      )}
      {...rest}
    >
      {children ??
        (src ? (
          <img
            alt={alt}
            src={src}
            className="absolute inset-0 size-full object-cover pointer-events-none"
          />
        ) : null)}
    </div>
  )
})

/* ────────────────────  Side-by-side layout helper  ─────────────────────── */

export type ModalSideBySideProps = HTMLAttributes<HTMLDivElement> & {
  /** Right-side panel content (typically a <ModalMedia /> or custom node). */
  side: ReactNode
  /** Width of the side panel in pixels. Default 340 (matches Figma). */
  sideWidth?: number
}

export const ModalSideBySide = forwardRef<HTMLDivElement, ModalSideBySideProps>(
  function ModalSideBySide(
    { className, side, sideWidth = 340, children, ...rest },
    ref,
  ) {
    return (
      <div
        ref={ref}
        data-slot="side-by-side"
        className={cn("flex w-full overflow-clip", className)}
        {...rest}
      >
        <div className="flex flex-1 min-w-0 flex-col">{children}</div>
        <div
          className="shrink-0 self-stretch"
          style={{ width: sideWidth }}
        >
          {side}
        </div>
      </div>
    )
  },
)
