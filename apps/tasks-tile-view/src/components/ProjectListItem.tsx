import { IconButton } from "@ds/components/IconButton"
import type { Project } from "../types"
import { cn } from "@ds/lib/cn"

type Props = {
  project: Project
  selected?: boolean
  onClick?: () => void
}

export function ProjectListItem({ project, selected, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-[35px] px-3 py-[10px]",
        "border border-[var(--color-layout-border-color)]/[0.18]",
        "bg-[var(--color-secondary-background-color)]/50",
        "text-left transition-colors",
        "hover:bg-[var(--color-secondary-background-color)]",
        "focus-visible:outline-2 focus-visible:outline-[var(--color-primary-color)]",
        selected &&
          "border-[var(--color-primary-color)] bg-[var(--color-secondary-background-color)]",
      )}
    >
      <span className="flex flex-1 items-center gap-3">
        <span className="flex-1 text-t1 font-semibold text-[var(--color-primary-text-color)]">
          {project.name}
        </span>
        <span className="text-t2 font-semibold text-[var(--color-secondary-text-color)]">
          {project.timeSpent}
        </span>
      </span>
      {/* stopPropagation prevents the expand click from toggling row selection */}
      <IconButton
        size="sm"
        kind="tertiary"
        icon="chevron-down"
        aria-label={`Expand ${project.name}`}
        onClick={(e) => e.stopPropagation()}
      />
    </button>
  )
}
