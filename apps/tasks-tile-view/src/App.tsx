import { useAppState } from "./state/AppState"
import { TopBar } from "./components/TopBar"
import { Sidebar } from "./components/Sidebar"
import { MainContent } from "./components/MainContent"
import { TaskDetailModal } from "./components/TaskDetailModal"
import { projects, tasks as allTasks } from "./data/mock"

export function App() {
  const s = useAppState()
  const currentTask =
    allTasks.find((t) => t.id === s.timer.currentTaskId) ?? allTasks[0]!
  const selectedTask = s.selectedTaskId
    ? allTasks.find((t) => t.id === s.selectedTaskId) ?? null
    : null

  return (
    <div
      data-theme="light"
      /*
       * No solid bg here — macOS NSVisualEffectView vibrancy is mounted under
       * the WebView (see src-tauri/src/lib.rs). A faint translucent tint via
       * bg-white/40 gives the design a touch of warmth on top of the blur,
       * while still letting the desktop show through.
       */
      className="relative flex h-screen flex-col overflow-hidden bg-white/40"
    >
      <BackgroundBlobs />
      <div className="relative z-10 flex h-full flex-col">
        <TopBar view={s.view} onViewChange={s.setView} />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            currentTask={currentTask}
            timer={s.timer}
            onToggleTimer={s.toggleTimer}
            projects={projects}
            searchQuery={s.searchQuery}
            onSearchChange={s.setSearchQuery}
            selectedProjectId={s.selectedProjectId}
            onSelectProject={s.setSelectedProjectId}
            compact={s.compact}
            onToggleCompact={() => s.setCompact(!s.compact)}
          />
          <MainContent
            tasks={s.filteredTasks}
            searchQuery={s.searchQuery}
            onSearchChange={s.setSearchQuery}
            onSelectTask={s.openTask}
            compact={s.compact}
          />
        </div>
      </div>
      <TaskDetailModal task={selectedTask} onClose={s.closeTask} />
    </div>
  )
}

function BackgroundBlobs() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden opacity-15"
    >
      {/* top-left: brand selected hover — light violet */}
      <div className="absolute -left-32 -top-32 h-[440px] w-[440px] rounded-full bg-[var(--color-brand-selected-hover-color)] blur-3xl" />
      {/* top-right: purple */}
      <div className="absolute right-[-120px] top-[80px] h-[380px] w-[380px] rounded-full bg-[var(--color-purple)] blur-3xl" />
      {/* bottom-center: dark indigo selected */}
      <div className="absolute bottom-[-80px] left-[300px] h-[420px] w-[420px] rounded-full bg-[var(--color-dark_indigo-selected)] blur-3xl" />
      {/* bottom-right: dark purple */}
      <div className="absolute -right-24 bottom-[-100px] h-[360px] w-[360px] rounded-full bg-[var(--color-dark_purple)] blur-3xl" />
    </div>
  )
}
