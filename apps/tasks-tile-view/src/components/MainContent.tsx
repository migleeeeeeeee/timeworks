import { Breadcrumb, BreadcrumbItem } from "@ds/components/Breadcrumb"
import { PageHeader } from "./PageHeader"
import { PageToolbar } from "./PageToolbar"
import { TaskTilesGrid } from "./TaskTilesGrid"
import type { Task } from "../types"

type Props = {
  tasks: Task[]
  searchQuery: string
  onSearchChange: (q: string) => void
  onSelectTask: (id: string) => void
  compact: boolean
}

export function MainContent({
  tasks,
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
      <PageToolbar searchQuery={searchQuery} onSearchChange={onSearchChange} />
      <TaskTilesGrid tasks={tasks} onSelectTask={onSelectTask} compact={compact} />
    </main>
  )
}
