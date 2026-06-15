export type Assignee = {
  id: string
  name: string
  avatarUrl?: string
}

export type Project = {
  id: string
  name: string
  timeSpent: string  // "HH:MM" — pre-formatted, sidebar displays verbatim
  pinned?: boolean
  deadline?: string  // pre-formatted, e.g. "Jun 30"
  taskCount?: number
}

export type TaskStatus = "open" | "in_progress" | "blocked" | "done"

export type TaskPriority = "low" | "medium" | "high"

export type Task = {
  id: string
  title: string
  status: TaskStatus
  projectId: string
  timeAllocated: string   // "HH:MM:SS"
  timeSpent: string       // "HH:MM:SS"
  subtasksDone: number
  subtasksTotal: number
  responsible: Assignee
  members: Assignee[]     // first three render; extras roll into "+N"
  priority: TaskPriority
}

export type TimerState = {
  currentTaskId: string
  isRunning: boolean
  elapsedSeconds: number
}

export type View = "timeworks" | "chatworks"
