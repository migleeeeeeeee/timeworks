import { Tabs, TabsList, TabsTrigger } from "@ds/components/Tabs"
import { Avatar } from "@ds/components/Avatar"
import type { View } from "../types"

type Props = {
  view: View
  onViewChange: (v: View) => void
}

/**
 * Top strip — sits flush with the OS title bar via Tauri's "Overlay" style.
 * `data-tauri-drag-region` on the outer div + the flex-1 spacer marks the
 * entire inert area as a window-drag handle. The drag itself is wired by
 * the document-level mousedown listener in App.tsx (useWindowDrag).
 */
export function TopBar({ view, onViewChange }: Props) {
  return (
    <div
      data-tauri-drag-region
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
