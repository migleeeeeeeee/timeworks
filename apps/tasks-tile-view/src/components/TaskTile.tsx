import { IconButton } from "@ds/components/IconButton"
import { LinearProgressBar } from "@ds/components/LinearProgressBar"
import { Avatar } from "@ds/components/Avatar"
import { AvatarGroup } from "@ds/components/AvatarGroup"
import { Chip } from "@ds/components/Chip"
import { cn } from "@ds/lib/cn"
import type { Task, TaskStatus } from "../types"

type Props = {
  task: Task
  onClick: () => void
  compact?: boolean
}

const statusToChip: Record<
  TaskStatus,
  { label: string; type: "primary" | "positive" | "negative" | "warning" }
> = {
  open: { label: "Open", type: "primary" },
  in_progress: { label: "In-Progress", type: "positive" },
  blocked: { label: "Blocked", type: "negative" },
  done: { label: "Done", type: "positive" },
}

export function TaskTile({ task, onClick, compact }: Props) {
  const percent =
    task.subtasksTotal > 0
      ? Math.round((task.subtasksDone / task.subtasksTotal) * 100)
      : 0
  const chip = statusToChip[task.status]

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col gap-3 rounded-2xl border border-[var(--color-layout-border-color)] bg-[var(--color-secondary-background-color)] p-3 text-left",
        "transition-shadow hover:shadow-md",
        "focus-visible:outline-2 focus-visible:outline-[var(--color-primary-color)]",
        compact ? "min-h-[200px]" : "min-h-[269px]",
      )}
    >
      {/* Title row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <IconButton
            size="xs"
            kind="primary"
            icon="circle-play"
            aria-label={`Start ${task.title}`}
            onClick={(e) => e.stopPropagation()}
          />
          <span className="truncate text-t2 font-semibold text-[var(--color-primary-text-color)]">
            {task.title}
          </span>
        </div>
        <IconButton
          size="xs"
          kind="tertiary"
          icon="ellipsis-vertical"
          aria-label="More options"
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      <hr className="border-t border-[var(--color-layout-border-color)]" />

      {/* Progress */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2 text-t3">
          <span className="font-semibold text-[var(--color-primary-text-color)]">
            {task.subtasksDone} / {task.subtasksTotal}
          </span>
          <span className="text-[var(--color-secondary-text-color)]">
            ({percent}% completed)
          </span>
        </div>
        <LinearProgressBar value={percent} size="sm" type="primary" />
      </div>

      {/* Stat row 1 — Time */}
      <div className="flex gap-4 text-t3">
        <StatColumn label="Time Allocated" value={task.timeAllocated} />
        <StatColumn label="Time Spent" value={task.timeSpent} />
      </div>

      {/* Stat row 2 — People */}
      <div className="flex gap-4 text-t3">
        <div className="flex flex-1 flex-col gap-1">
          <span className="text-[var(--color-secondary-text-color)]">Responsible</span>
          <Avatar
            size="sm"
            type="img"
            src={task.responsible.avatarUrl}
            alt={task.responsible.name}
          />
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <span className="text-[var(--color-secondary-text-color)]">Members</span>
          <AvatarGroup size="xs" max={3}>
            {task.members.map((m) => (
              <Avatar key={m.id} size="xs" type="img" src={m.avatarUrl} alt={m.name} />
            ))}
          </AvatarGroup>
        </div>
      </div>

      {/* Stat row 3 — Priority + Status */}
      <div className="flex gap-4 text-t3">
        <div className="flex flex-1 flex-col gap-1">
          <span className="text-[var(--color-secondary-text-color)]">Priority</span>
          <IconButton
            size="xxs"
            kind="tertiary"
            icon="flag"
            aria-label={`Priority: ${task.priority}`}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <span className="text-[var(--color-secondary-text-color)]">Status</span>
          <Chip
            size="sm"
            type={chip.type}
            icon="chevron-down"
            iconPosition="right"
          >
            {chip.label}
          </Chip>
        </div>
      </div>
    </button>
  )
}

function StatColumn({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-1 flex-col gap-1">
      <span className="text-[var(--color-secondary-text-color)]">{label}</span>
      <span className="font-semibold text-[var(--color-primary-text-color)]">{value}</span>
    </div>
  )
}
