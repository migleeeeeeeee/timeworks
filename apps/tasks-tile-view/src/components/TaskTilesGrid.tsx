import { TaskTile } from "./TaskTile"
import type { Task } from "../types"

type Props = {
  tasks: Task[]
  onSelectTask: (id: string) => void
  compact: boolean
}

export function TaskTilesGrid({ tasks, onSelectTask, compact }: Props) {
  if (tasks.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-dashed border-[var(--color-layout-border-color)] text-t2 text-[var(--color-secondary-text-color)]">
        No tasks match the current filters.
      </div>
    )
  }
  return (
    <div className="grid grid-cols-4 gap-2">
      {tasks.map((t) => (
        <TaskTile
          key={t.id}
          task={t}
          onClick={() => onSelectTask(t.id)}
          compact={compact}
        />
      ))}
    </div>
  )
}
