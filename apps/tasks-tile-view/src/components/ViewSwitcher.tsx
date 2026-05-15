import { IconButton } from "@ds/components/IconButton"

type Props = {
  compact: boolean
  onToggleCompact: () => void
}

export function ViewSwitcher({ compact, onToggleCompact }: Props) {
  return (
    <div className="flex items-center justify-center gap-3 py-2">
      <IconButton
        size="xs"
        kind="tertiary"
        icon="clock-new"
        aria-label="Timer-only view"
      />
      <IconButton
        size="xs"
        kind="tertiary"
        icon={compact ? "chevron-right" : "chevron-left"}
        aria-label={compact ? "Expand sidebar" : "Collapse sidebar"}
        onClick={onToggleCompact}
      />
    </div>
  )
}
