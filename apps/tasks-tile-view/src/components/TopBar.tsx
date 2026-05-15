import { Tabs, TabsList, TabsTrigger } from "@ds/components/Tabs"
import { Avatar } from "@ds/components/Avatar"
import type { View } from "../types"

type Props = {
  view: View
  onViewChange: (v: View) => void
}

/**
 * Top bar — sits flush with the OS title bar via Tauri's "Overlay" titleBarStyle.
 * The native traffic-light buttons render on top of the left side; pl-20 leaves
 * room. data-tauri-drag-region on the root lets the user drag the window from
 * any non-interactive area of this strip.
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
      {/*
       * Wide drag handle between the tabs and the avatar — flex-1 so any empty
       * space at the top is grab-to-move. data-tauri-drag-region on this child
       * AND the parent ensures the window moves regardless of where the user
       * mouses down in the inert middle band.
       */}
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
