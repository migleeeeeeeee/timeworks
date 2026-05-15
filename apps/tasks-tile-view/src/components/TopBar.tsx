import { Tabs, TabsList, TabsTrigger } from "@ds/components/Tabs"
import { Avatar } from "@ds/components/Avatar"
import { WindowChrome } from "./WindowChrome"
import type { View } from "../types"

type Props = {
  view: View
  onViewChange: (v: View) => void
}

export function TopBar({ view, onViewChange }: Props) {
  return (
    <div className="flex h-[41px] items-center justify-between px-6">
      <Tabs value={view} onValueChange={(v) => onViewChange(v as View)}>
        <TabsList>
          <TabsTrigger value="timeworks">TimeWorks</TabsTrigger>
          <TabsTrigger value="chatworks">ChatWorks</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="flex items-center gap-6">
        <Avatar
          type="img"
          size="md"
          src="https://api.dicebear.com/9.x/avataaars/svg?seed=Owner"
          alt="Owner"
        />
        <WindowChrome />
      </div>
    </div>
  )
}
