import { Icon } from "@ds/components/Icon"
import { formatElapsed } from "../state/AppState"
import { projects } from "../data/mock"
import type { Task, TimerState } from "../types"

type Props = {
  task: Task
  timer: TimerState
  onToggle: () => void
}

/**
 * Sidebar timer card matching the Figma anatomy:
 * - 62×62 primary circle on the left with pause (running) or play triangle (idle).
 * - Big 24/26 mono time display, then a "<Project> — <Task>" subtitle.
 * - Two pill buttons: "● Active" (with status dot) + "Break - 17m" (with break icon).
 * - Gradient sweep border traces the card rim (always visible, animates while running).
 */
export function TaskTimerCard({ task, timer, onToggle }: Props) {
  const project = projects.find((p) => p.id === task.projectId)
  return (
    <section className="relative rounded-2xl bg-white/10 p-4 backdrop-blur-xl">
      <SweepBorder running={timer.isRunning} />

      <div className="relative flex items-center gap-4">
        <button
          type="button"
          onClick={onToggle}
          aria-label={timer.isRunning ? "Pause timer" : "Start timer"}
          className="flex h-[62px] w-[62px] shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-color)] text-[var(--color-text-color-on-primary)] transition-colors hover:bg-[var(--color-primary-hover-color)] focus-visible:outline-2 focus-visible:outline-[var(--color-primary-color)]"
        >
          {timer.isRunning ? (
            <Icon name="pause-updated" size="md" />
          ) : (
            <PlayTriangle />
          )}
        </button>
        <div className="flex flex-1 flex-col leading-tight">
          <span
            className="font-mono text-[26px] font-semibold tracking-tight text-[var(--color-primary-text-color)]"
            aria-live="polite"
          >
            {formatElapsed(timer.elapsedSeconds)}
          </span>
          <span className="truncate text-t3 text-[var(--color-secondary-text-color)]">
            <span className="font-semibold text-[var(--color-primary-text-color)]">
              {project?.name ?? "Project"}
            </span>
            <span className="mx-1">·</span>
            <span>{task.title}</span>
          </span>
        </div>
      </div>

      <div className="relative mt-4 flex items-center gap-2">
        <StatusPill tone="active">Active</StatusPill>
        <StatusPill tone="break" icon="mug-hot">
          Break - 17m
        </StatusPill>
      </div>
    </section>
  )
}

/** Right-pointing filled triangle matching the Figma's raw Polygon glyph. */
function PlayTriangle() {
  return (
    <svg
      width="20"
      height="22"
      viewBox="0 0 20 22"
      aria-hidden="true"
      className="ml-1"
    >
      <polygon points="2,1 19,11 2,21" fill="currentColor" />
    </svg>
  )
}

type PillProps = {
  tone: "active" | "break"
  icon?: string
  children: React.ReactNode
}

function StatusPill({ tone, icon, children }: PillProps) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-t3 font-medium text-[var(--color-primary-text-color)]">
      {tone === "active" && (
        <span className="size-2 rounded-full bg-[var(--color-positive-color)]" />
      )}
      {icon && (
        <span aria-hidden="true" className="text-[var(--color-icon-color)]">
          {/* Tiny inline SVG keeps us off the DS Icon name surface. */}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 7h12v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V7zm14 1h1a3 3 0 0 1 0 6h-1V8zM6 2h2v3H6V2zm4 0h2v3h-2V2z" />
          </svg>
        </span>
      )}
      {children}
    </span>
  )
}

/** Gradient outline tracing the card rim. */
function SweepBorder({ running }: { running: boolean }) {
  return (
    <>
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="ttv-sweep-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-primary-color)" />
            <stop offset="100%" stopColor="var(--color-dark_purple)" />
          </linearGradient>
        </defs>
        <rect
          x="0.6"
          y="0.6"
          width="98.8"
          height="98.8"
          rx="6"
          ry="6"
          fill="none"
          stroke="url(#ttv-sweep-gradient)"
          strokeWidth="1.2"
          vectorEffect="non-scaling-stroke"
          strokeDasharray={running ? "392" : "none"}
          strokeDashoffset={running ? "392" : "0"}
          style={running ? { animation: "ttv-sweep 60s linear infinite" } : undefined}
        />
      </svg>
      <style>{`
        @keyframes ttv-sweep {
          from { stroke-dashoffset: 392; }
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </>
  )
}
