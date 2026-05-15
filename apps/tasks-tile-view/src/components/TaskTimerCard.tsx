import { Button } from "@ds/components/Button"
import { Icon } from "@ds/components/Icon"
import { formatElapsed } from "../state/AppState"
import type { Task, TimerState } from "../types"

type Props = {
  task: Task
  timer: TimerState
  onToggle: () => void
}

export function TaskTimerCard({ task, timer, onToggle }: Props) {
  return (
    <section className="relative rounded-2xl border border-[var(--color-layout-border-color)] bg-[var(--color-secondary-background-color)] p-4">
      {/* Sweep ring — animates only while running */}
      {timer.isRunning && (
        <svg
          className="pointer-events-none absolute inset-0"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <rect
            x="1"
            y="1"
            width="98"
            height="98"
            rx="6"
            fill="none"
            stroke="var(--color-primary-color)"
            strokeWidth="2"
            strokeDasharray="392"
            strokeDashoffset="0"
            style={{
              animation: "ttv-sweep 60s linear infinite",
            }}
          />
        </svg>
      )}
      <style>{`
        @keyframes ttv-sweep {
          from { stroke-dashoffset: 392; }
          to { stroke-dashoffset: 0; }
        }
      `}</style>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onToggle}
          aria-label={timer.isRunning ? "Pause timer" : "Start timer"}
          className="flex h-[62px] w-[62px] items-center justify-center rounded-full bg-[var(--color-primary-color)] text-[var(--color-text-color-on-primary)] transition-colors hover:bg-[var(--color-primary-hover-color)] focus-visible:outline-2 focus-visible:outline-[var(--color-primary-color)]"
        >
          <Icon name={timer.isRunning ? "pause-updated" : "circle-play"} size="md" />
        </button>
        <div className="flex flex-1 flex-col">
          <span className="text-t1 font-semibold text-[var(--color-primary-text-color)]">
            {task.title}
          </span>
          <span className="text-t2 font-mono text-[var(--color-secondary-text-color)]">
            {formatElapsed(timer.elapsedSeconds)}
          </span>
        </div>
      </div>

      <hr className="my-3 border-t border-[var(--color-ui-border-color)]" />

      <div className="flex items-center gap-2">
        <Button kind="primary" size="sm">Working</Button>
        <Button kind="secondary" size="sm" iconLeft="globe">Portal View</Button>
      </div>
    </section>
  )
}
