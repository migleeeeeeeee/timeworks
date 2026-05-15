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
        "flex w-full items-center gap-2 rounded-full px-3 py-1.5",
        "border border-white/10 bg-white/5",
        "text-left transition-colors",
        "hover:bg-white/10",
        "focus-visible:outline-2 focus-visible:outline-[var(--color-primary-color)]",
        selected && "border-[var(--color-primary-color)] bg-white/10",
      )}
    >
      <span className="flex flex-1 items-center gap-2">
        <span className="flex-1 truncate text-t2 font-semibold text-[var(--color-primary-text-color)]">
          {project.name}
        </span>
        <span className="text-t3 font-medium text-[var(--color-secondary-text-color)]">
          {project.timeSpent}
        </span>
      </span>
      {/* stopPropagation prevents the expand click from toggling row selection */}
      <IconButton
        size="xs"
        kind="tertiary"
        icon="chevron-down"
        aria-label={`Expand ${project.name}`}
        onClick={(e) => e.stopPropagation()}
      />
    </button>
  )
}
