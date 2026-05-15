import { useEffect } from "react"
import { getCurrentWindow } from "@tauri-apps/api/window"
import { useAppState } from "./state/AppState"
import { TopBar } from "./components/TopBar"
import { Sidebar } from "./components/Sidebar"
import { MainContent } from "./components/MainContent"
import { TaskDetailModal } from "./components/TaskDetailModal"
import { projects, tasks as allTasks } from "./data/mock"

/**
 * Document-level mousedown listener that drives window dragging. Tauri 2's
 * auto-injected `data-tauri-drag-region` handler can fail to bind in dev
 * mode (HMR remounts, transparent windows + WebKit). Registering manually
 * at the document level survives every remount and bypasses React's
 * synthetic event chain.
 */
function useWindowDrag() {
  useEffect(() => {
    const win = getCurrentWindow()
    function onMouseDown(e: MouseEvent) {
      const target = e.target as HTMLElement | null
      if (!target) return
      // Only when the click landed inside an explicit drag region.
      if (!target.closest("[data-tauri-drag-region]")) return
      // Don't hijack clicks on interactive controls inside the drag region.
      if (target.closest("button, input, a, [role='tab'], [role='button']")) return
      e.preventDefault()
      void win.startDragging()
    }
    function onDoubleClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null
      if (!target?.closest("[data-tauri-drag-region]")) return
      if (target.closest("button, input, a, [role='tab'], [role='button']")) return
      void win.toggleMaximize()
    }
    document.addEventListener("mousedown", onMouseDown)
    document.addEventListener("dblclick", onDoubleClick)
    return () => {
      document.removeEventListener("mousedown", onMouseDown)
      document.removeEventListener("dblclick", onDoubleClick)
    }
  }, [])
}

export function App() {
  useWindowDrag()
  const s = useAppState()
  const currentTask =
    allTasks.find((t) => t.id === s.timer.currentTaskId) ?? allTasks[0]!
  const selectedTask = s.selectedTaskId
    ? allTasks.find((t) => t.id === s.selectedTaskId) ?? null
    : null

  return (
    <div
      data-theme="black"
      /*
       * Black theme over macOS vibrancy. A heavier black tint gives the dark
       * UI proper contrast while the underlying NSVisualEffectView still
       * blurs the desktop through. The rounded outer container + overflow
       * hidden gives the window soft 12px corners under decorations:false.
       */
      className="relative flex h-screen flex-col overflow-hidden rounded-xl bg-black/55"
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
