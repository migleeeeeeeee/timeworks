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
      {/*
       * Custom search input — the DS Search component flips dark in black
       * mode which doesn't match the Figma. This renders the same in every
       * theme: translucent white pill with magnifier glyph + placeholder.
       */}
      <label className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-t3">
        <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Find a task or project"
          className="flex-1 bg-transparent text-[var(--color-primary-text-color)] placeholder:text-[var(--color-secondary-text-color)] focus:outline-none"
        />
      </label>
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
