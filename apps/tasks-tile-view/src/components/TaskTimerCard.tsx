import { Button } from "@ds/components/Button"
import { Icon } from "@ds/components/Icon"
import { formatElapsed } from "../state/AppState"
import type { Task, TimerState } from "../types"

type Props = {
  task: Task
  timer: TimerState
  onToggle: () => void
}

/**
 * Sidebar timer card. Mirrors the Figma "Task Timer Container":
 * - Big 62×62 primary circle with a play triangle (inline SVG, matching the
 *   Figma's raw Polygon — `circle-play` would render a play-in-circle which
 *   would double up inside the already-circular button background).
 * - When running, swaps the triangle for the DS `pause-updated` icon.
 * - Always-visible gradient sweep border (primary-color → dark_purple) traces
 *   the card rim, matching Figma's "Countdown Sweep Border". The dasharray
 *   animation only runs while the timer is active.
 */
export function TaskTimerCard({ task, timer, onToggle }: Props) {
  return (
    <section className="relative rounded-2xl bg-white/10 p-4 backdrop-blur-xl">
      <SweepBorder running={timer.isRunning} />

      <div className="relative flex items-center gap-4">
        <button
          type="button"
          onClick={onToggle}
          aria-label={timer.isRunning ? "Pause timer" : "Start timer"}
          className="flex h-[62px] w-[62px] items-center justify-center rounded-full bg-[var(--color-primary-color)] text-[var(--color-text-color-on-primary)] transition-colors hover:bg-[var(--color-primary-hover-color)] focus-visible:outline-2 focus-visible:outline-[var(--color-primary-color)]"
        >
          {timer.isRunning ? (
            <Icon name="pause-updated" size="md" />
          ) : (
            <PlayTriangle />
          )}
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

      <hr className="relative my-3 border-t border-[var(--color-ui-border-color)]" />

      <div className="relative flex items-center gap-2">
        <Button kind="primary" size="sm">
          Working
        </Button>
        <Button kind="secondary" size="sm">
          Portal View
        </Button>
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

/**
 * Gradient stroke that traces the card outline. Uses an SVG `<rect>` with
 * 1% inset so the 3px stroke isn't clipped by the parent's overflow.
 * The dasharray animation only runs while `running` is true.
 */
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
          style={
            running
              ? { animation: "ttv-sweep 60s linear infinite" }
              : undefined
          }
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
