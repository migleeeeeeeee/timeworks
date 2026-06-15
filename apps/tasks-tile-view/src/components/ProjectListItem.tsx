import { IconButton } from "@ds/components/IconButton"
import { ListItem } from "@ds/components/ListItem"
import { Menu } from "@ds/components/Menu"
import { useEffect, useRef, useState } from "react"
import type { Project } from "../types"
import { cn } from "@ds/lib/cn"

type Props = {
  project: Project
  selected?: boolean
  onClick?: () => void
  onStartTimer?: () => void
  onPin?: () => void
  onReorder?: () => void
  onViewInPortal?: () => void
}

export function ProjectListItem({
  project,
  selected,
  onClick,
  onStartTimer,
  onPin,
  onReorder,
  onViewInPortal,
}: Props) {
  const pinned = project.pinned === true
  const [menuOpen, setMenuOpen] = useState(false)
  const menuWrapRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const onDocPointer = (e: PointerEvent) => {
      const root = menuWrapRef.current
      if (!root) return
      if (e.target instanceof Node && !root.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false)
    }
    document.addEventListener("pointerdown", onDocPointer)
    document.addEventListener("keydown", onEscape)
    return () => {
      document.removeEventListener("pointerdown", onDocPointer)
      document.removeEventListener("keydown", onEscape)
    }
  }, [menuOpen])

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex w-full items-center gap-2 rounded-full px-3 py-1.5",
        "border border-white/10 bg-white/5",
        "text-left transition-colors",
        "hover:bg-white/10",
        "focus-visible:outline-2 focus-visible:outline-[var(--color-primary-color)]",
        selected &&
          "border-[var(--color-primary-color)]/40 bg-[var(--color-primary-highlighted-color)]",
      )}
    >
      {pinned && (
        <span
          className={cn(
            "shrink-0 transition-opacity",
            // play affordance: hidden until row hover (mirrors Figma's
            // Default → Hover transition on the Pinned Project row)
            "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100",
          )}
        >
          <IconButton
            size="xs"
            kind="secondary"
            icon="circle-play"
            aria-label={`Start timer for ${project.name}`}
            onClick={(e) => {
              e.stopPropagation()
              onStartTimer?.()
            }}
          />
        </span>
      )}
      <span className="flex flex-1 items-center gap-2">
        <span className="flex-1 truncate text-t2 font-semibold text-[var(--color-primary-text-color)]">
          {project.name}
        </span>
        {pinned && typeof project.taskCount === "number" && (
          <span className="text-t3 font-normal text-[var(--color-primary-text-color)]">
            {project.taskCount}
          </span>
        )}
        {pinned && project.deadline && (
          <span className="text-t3 font-normal text-[var(--color-secondary-text-color)]">
            {project.deadline}
          </span>
        )}
        <span className="text-t3 font-medium text-[var(--color-secondary-text-color)]">
          {project.timeSpent}
        </span>
      </span>
      <span ref={menuWrapRef} className="relative inline-flex">
        <IconButton
          size="xs"
          kind="tertiary"
          icon={pinned ? "ellipsis" : "chevron-down"}
          aria-label={
            pinned ? `Open menu for ${project.name}` : `Expand ${project.name}`
          }
          aria-haspopup={pinned ? "menu" : undefined}
          aria-expanded={pinned ? menuOpen : undefined}
          onClick={(e) => {
            e.stopPropagation()
            if (pinned) setMenuOpen((o) => !o)
          }}
        />
        {pinned && menuOpen && (
          <Menu
            size="sm"
            className="absolute right-0 top-full z-50 mt-2"
            onClick={(e) => e.stopPropagation()}
          >
            <ListItem
              icon="thumbstack"
              onClick={(e) => {
                e.stopPropagation()
                setMenuOpen(false)
                onPin?.()
              }}
            >
              Pin
            </ListItem>
            <ListItem
              icon="grip-lines"
              onClick={(e) => {
                e.stopPropagation()
                setMenuOpen(false)
                onReorder?.()
              }}
            >
              Reorder
            </ListItem>
            <ListItem
              icon="arrow-up-right-from-square"
              onClick={(e) => {
                e.stopPropagation()
                setMenuOpen(false)
                onViewInPortal?.()
              }}
            >
              View in portal
            </ListItem>
          </Menu>
        )}
      </span>
    </button>
  )
}
