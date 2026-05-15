import { ProjectsCard } from "./ProjectsCard"
import { TaskTimerCard } from "./TaskTimerCard"
import { ViewSwitcher } from "./ViewSwitcher"
import type { Project, Task, TimerState } from "../types"

type Props = {
  currentTask: Task
  timer: TimerState
  onToggleTimer: () => void
  projects: Project[]
  searchQuery: string
  onSearchChange: (q: string) => void
  selectedProjectId: string | null
  onSelectProject: (id: string | null) => void
  compact: boolean
  onToggleCompact: () => void
}

export function Sidebar(props: Props) {
  return (
    <aside className="flex w-[310px] flex-col gap-4 p-4">
      <TaskTimerCard
        task={props.currentTask}
        timer={props.timer}
        onToggle={props.onToggleTimer}
      />
      <ProjectsCard
        projects={props.projects}
        searchQuery={props.searchQuery}
        onSearchChange={props.onSearchChange}
        selectedProjectId={props.selectedProjectId}
        onSelectProject={props.onSelectProject}
      />
      <ViewSwitcher
        compact={props.compact}
        onToggleCompact={props.onToggleCompact}
      />
    </aside>
  )
}
