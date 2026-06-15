import { Breadcrumb, BreadcrumbItem } from "@ds/components/Breadcrumb"
import { PageHeader } from "./PageHeader"
import { PageToolbar } from "./PageToolbar"
import { TaskTilesGrid } from "./TaskTilesGrid"
import type { Task } from "../types"
import type { Scope } from "../state/AppState"

type Props = {
  tasks: Task[]
  scope: Scope
  onScopeChange: (s: Scope) => void
  searchQuery: string
  onSearchChange: (q: string) => void
  onSelectTask: (id: string) => void
  compact: boolean
}

export function MainContent({
  tasks,
  scope,
  onScopeChange,
  searchQuery,
  onSearchChange,
  onSelectTask,
  compact,
}: Props) {
  return (
    <main className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 pr-6">
      <Breadcrumb>
        <BreadcrumbItem href="#">Workspace</BreadcrumbItem>
        <BreadcrumbItem href="#">Workspace</BreadcrumbItem>
        <BreadcrumbItem current>Workspace</BreadcrumbItem>
      </Breadcrumb>
      <PageHeader />
      <PageToolbar
        scope={scope}
        onScopeChange={onScopeChange}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
      />
      <TaskTilesGrid tasks={tasks} onSelectTask={onSelectTask} compact={compact} />
    </main>
  )
}
