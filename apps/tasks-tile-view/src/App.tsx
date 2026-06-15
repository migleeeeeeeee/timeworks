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
    console.log("[drag] handler attached, win =", win)

    function isDragTarget(target: HTMLElement | null) {
      if (!target) return false
      if (!target.closest("[data-tauri-drag-region]")) return false
      if (target.closest("button, input, a, [role='tab'], [role='button']"))
        return false
      return true
    }

    async function onMouseDown(e: MouseEvent) {
      const target = e.target as HTMLElement | null
      if (!isDragTarget(target)) return
      console.log("[drag] mousedown in drag region — calling startDragging()")
      e.preventDefault()
      try {
        await win.startDragging()
        console.log("[drag] startDragging() resolved")
      } catch (err) {
        console.error("[drag] startDragging() rejected:", err)
      }
    }

    async function onDoubleClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null
      if (!isDragTarget(target)) return
      try {
        await win.toggleMaximize()
      } catch (err) {
        console.error("[drag] toggleMaximize() rejected:", err)
      }
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
      // Frosted-glass: black tint at 35% over the macOS NSVisualEffectView
      // vibrancy. Lets the desktop blur bleed through evenly.
      className="relative flex h-screen flex-col overflow-hidden rounded-xl bg-black/35"
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
            scope={s.scope}
            onScopeChange={s.setScope}
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
      className="pointer-events-none absolute inset-0 overflow-hidden opacity-20"
    >
      {/* top-left: light violet glow near the timer card */}
      <div className="absolute -left-32 -top-32 h-[440px] w-[440px] rounded-full bg-[#a78bfa] blur-3xl" />
      {/* top-right: brighter magenta-violet */}
      <div className="absolute right-[-120px] top-[80px] h-[380px] w-[380px] rounded-full bg-[#8b5cf6] blur-3xl" />
      {/* bottom-center: rich indigo */}
      <div className="absolute bottom-[-80px] left-[300px] h-[420px] w-[420px] rounded-full bg-[#5b21b6] blur-3xl" />
      {/* bottom-right: deep purple */}
      <div className="absolute -right-24 bottom-[-100px] h-[360px] w-[360px] rounded-full bg-[#7c3aed] blur-3xl" />
    </div>
  )
}
