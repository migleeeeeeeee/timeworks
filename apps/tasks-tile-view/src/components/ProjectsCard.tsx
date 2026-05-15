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
    <section className="flex flex-1 flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-xl">
      <header>
        <h2 className="text-t1 font-semibold text-[var(--color-primary-text-color)]">
          Today
        </h2>
      </header>
      <Search
        size="md"
        value={searchQuery}
        onValueChange={onSearchChange}
        placeholder="Find a task or project"
        // DS Search defaults to --color-secondary-background-color which is 8%
        // white in black mode — invisible against our vibrancy window. Tint it
        // to a stronger translucent white pill and drop the border so it reads
        // like the Figma's frosted Search.
        wrapperClassName="!bg-white/10 !border-white/10"
      />
      <ul className="flex flex-col gap-1 overflow-y-auto">
        {projects.map((p) => (
          <li key={p.id}>
            <ProjectListItem
              project={p}
              selected={p.id === selectedProjectId}
              onClick={() =>
                onSelectProject(p.id === selectedProjectId ? null : p.id)
              }
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
