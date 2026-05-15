import { Search } from "@ds/components/Search"
import { ProjectListItem } from "./ProjectListItem"
import type { Project } from "../types"

type Props = {
  projects: Project[]
  searchQuery: string
  onSearchChange: (q: string) => void
  selectedProjectId: string | null
  onSelectProject: (id: string | null) => void
}

export function ProjectsCard({
  projects,
  searchQuery,
  onSearchChange,
  selectedProjectId,
  onSelectProject,
}: Props) {
  return (
    <section className="flex flex-1 flex-col gap-4 rounded-2xl border border-[var(--color-layout-border-color)] bg-white/10 p-4 backdrop-blur-xl">
      <header>
        <h2 className="text-t1 font-semibold text-[var(--color-primary-text-color)]">Today</h2>
      </header>
      <Search
        size="md"
        value={searchQuery}
        onValueChange={onSearchChange}
        placeholder="Find a task or project"
      />
      <ul className="flex flex-col gap-2 overflow-y-auto">
        {projects.map((p) => (
          <li key={p.id}>
            <ProjectListItem
              project={p}
              selected={p.id === selectedProjectId}
              onClick={() => onSelectProject(p.id === selectedProjectId ? null : p.id)}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
