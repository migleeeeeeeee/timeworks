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

/**
 * Status chip palette — hard-coded to the Figma "Subtle" tones so the chip
 * renders the same in every theme (the DS positive-color token flips dark in
 * black mode, which we don't want). Values lifted from the Figma light-mode
 * variables.css block.
 */
const statusToChip: Record<
  TaskStatus,
  { label: string; bg: string; fg: string }
> = {
  open: {
    label: "Open",
    bg: "#eee9ff",
    fg: "#5b3df5",
  },
  in_progress: {
    label: "In-Progress",
    bg: "#e8f4e6",
    fg: "#007d5d",
  },
  blocked: {
    label: "Blocked",
    bg: "#ffe5e7",
    fg: "#c20114",
  },
  done: {
    label: "Done",
    bg: "#e8f4e6",
    fg: "#007d5d",
  },
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
        "flex flex-col gap-3 rounded-2xl border border-[var(--color-layout-border-color)] bg-white/10 p-3 text-left backdrop-blur-xl",
        "transition-shadow hover:shadow-md",
        "focus-visible:outline-2 focus-visible:outline-[var(--color-primary-color)]",
        compact ? "min-h-[200px]" : "min-h-[269px]",
      )}
    >
      {/* Title row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span
            role="button"
            tabIndex={0}
            aria-label={`Start ${task.title}`}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") e.stopPropagation()
            }}
            className="flex size-6 shrink-0 items-center justify-center rounded-[6px] bg-[var(--color-primary-color)] text-[var(--color-text-color-on-primary)] hover:bg-[var(--color-primary-hover-color)]"
          >
            <svg width="10" height="11" viewBox="0 0 10 11" aria-hidden="true">
              <polygon points="1.5,1 9,5.5 1.5,10" fill="currentColor" />
            </svg>
          </span>
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
            type="positive"
            icon="chevron-down"
            iconPosition="right"
            className="self-start font-semibold"
            // Hardcoded Figma "Subtle" colors — DS positive tokens flip dark
            // in black mode, which doesn't match the Figma's pastel chips.
            // Overriding --color-icon-color via inline style tints the
            // trailing chevron to match the label.
            style={
              {
                backgroundColor: chip.bg,
                color: chip.fg,
                "--color-icon-color": chip.fg,
              } as React.CSSProperties
            }
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
