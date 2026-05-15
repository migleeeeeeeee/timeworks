import { Tabs, TabsList, TabsTrigger } from "@ds/components/Tabs"
import { Avatar } from "@ds/components/Avatar"
import { IconButton } from "@ds/components/IconButton"
import { getCurrentWindow } from "@tauri-apps/api/window"
import type { View } from "../types"

type Props = {
  view: View
  onViewChange: (v: View) => void
}

/**
 * Custom top strip. The Tauri window runs with `decorations: false` so there
 * is no OS title bar — this row IS the title bar. The whole row is marked
 * `data-tauri-drag-region`; the document-level mousedown handler in App.tsx
 * (useWindowDrag) translates clicks here into NSWindow drags. Interactive
 * children (buttons, tab triggers) are skipped by the handler so they
 * remain clickable.
 */
export function TopBar({ view, onViewChange }: Props) {
  const win = getCurrentWindow()
  return (
    <div
      data-tauri-drag-region
      className="flex h-[44px] items-center gap-4 px-4"
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
      <div className="flex items-center gap-1">
        <IconButton
          size="xs"
          kind="tertiary"
          icon="minus"
          aria-label="Minimize window"
          onClick={() => void win.minimize()}
        />
        <IconButton
          size="xs"
          kind="tertiary"
          icon="x-mark-small"
          aria-label="Close window"
          onClick={() => void win.close()}
        />
      </div>
    </div>
  )
}
