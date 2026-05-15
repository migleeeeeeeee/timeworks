import { Tabs, TabsList, TabsTrigger } from "@ds/components/Tabs"
import { Avatar } from "@ds/components/Avatar"
import type { View } from "../types"
import { getCurrentWindow } from "@tauri-apps/api/window"

type Props = {
  view: View
  onViewChange: (v: View) => void
}

/**
 * Manual drag handler — Tauri 2's auto-injection of `data-tauri-drag-region`
 * can fail to fire reliably in dev mode. Calling `startDragging()` directly
 * on mousedown is the bulletproof path. Skips when the user mousedowns on an
 * interactive element (button/input/anchor) so clicks still register.
 */
function handleDragMouseDown(e: React.MouseEvent<HTMLDivElement>) {
  const target = e.target as HTMLElement
  if (target.closest("button, input, a, [role='tab'], [role='button']")) return
  e.preventDefault()
  void getCurrentWindow().startDragging()
}

/** Detect macOS double-click-titlebar maximize behavior. */
function handleDragDoubleClick(e: React.MouseEvent<HTMLDivElement>) {
  const target = e.target as HTMLElement
  if (target.closest("button, input, a, [role='tab'], [role='button']")) return
  void getCurrentWindow().toggleMaximize()
}

export function TopBar({ view, onViewChange }: Props) {
  return (
    <div
      data-tauri-drag-region
      onMouseDown={handleDragMouseDown}
      onDoubleClick={handleDragDoubleClick}
      className="flex h-[44px] items-center pl-28 pr-6"
    >
      <Tabs value={view} onValueChange={(v) => onViewChange(v as View)}>
        <TabsList>
          <TabsTrigger value="timeworks">TimeWorks</TabsTrigger>
          <TabsTrigger value="chatworks">ChatWorks</TabsTrigger>
        </TabsList>
      </Tabs>
      <div data-tauri-drag-region className="flex-1 self-stretch" />
      <Avatar
        type="img"
        size="md"
        src="https://api.dicebear.com/9.x/avataaars/svg?seed=Owner"
        alt="Owner"
      />
    </div>
  )
}
