import { useEffect, useMemo, useRef, useState } from "react"
import type { Task, TimerState, View } from "../types"
import { CURRENT_USER_ID, initialTimer, tasks as allTasks } from "../data/mock"

export type Scope = "me" | "all"

export type AppState = {
  view: View
  setView: (v: View) => void

  scope: Scope
  setScope: (s: Scope) => void

  searchQuery: string
  setSearchQuery: (q: string) => void

  selectedProjectId: string | null
  setSelectedProjectId: (id: string | null) => void

  compact: boolean
  setCompact: (v: boolean) => void

  selectedTaskId: string | null
  openTask: (id: string) => void
  closeTask: () => void

  timer: TimerState
  toggleTimer: () => void

  /** Tasks filtered by view + scope + search + project selection. */
  filteredTasks: Task[]
}

export function useAppState(): AppState {
  const [view, setView] = useState<View>("timeworks")
  const [scope, setScope] = useState<Scope>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [compact, setCompact] = useState(false)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [timer, setTimer] = useState<TimerState>(initialTimer)

  // Tick the timer once per second while running. StrictMode-safe: effect runs
  // twice on mount in dev; the interval is cleaned up before the second run.
  const tickRef = useRef<number | null>(null)
  useEffect(() => {
    if (!timer.isRunning) return
    tickRef.current = window.setInterval(() => {
      setTimer((t) => ({ ...t, elapsedSeconds: t.elapsedSeconds + 1 }))
    }, 1000)
    return () => {
      if (tickRef.current != null) window.clearInterval(tickRef.current)
    }
  }, [timer.isRunning])

  const filteredTasks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return allTasks.filter((t) => {
      if (view === "chatworks") return false // demo: the other tab is empty
      if (selectedProjectId && t.projectId !== selectedProjectId) return false
      if (q && !t.title.toLowerCase().includes(q)) return false
      if (scope === "me") {
        const involved =
          t.responsible.id === CURRENT_USER_ID ||
          t.members.some((m) => m.id === CURRENT_USER_ID)
        if (!involved) return false
      }
      return true
    })
  }, [view, scope, searchQuery, selectedProjectId])

  return {
    view,
    setView,
    scope,
    setScope,
    searchQuery,
    setSearchQuery,
    selectedProjectId,
    setSelectedProjectId,
    compact,
    setCompact,
    selectedTaskId,
    openTask: (id) => setSelectedTaskId(id),
    closeTask: () => setSelectedTaskId(null),
    timer,
    toggleTimer: () => setTimer((t) => ({ ...t, isRunning: !t.isRunning })),
    filteredTasks,
  }
}

export function formatElapsed(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${pad(h)}:${pad(m)}:${pad(s)}`
}
