import { Icon } from "@ds/components/Icon"

/**
 * Decorative three-glyph window-chrome row matching the Figma design.
 * The real window controls are handled by Tauri's native title bar;
 * this component exists purely to replicate the visual layout.
 *
 * Icons chosen as closest semantic matches to minimize / close / maximize
 * from the available DS icon set: minus → x-mark-small → expand.
 */
export function WindowChrome() {
  return (
    <div className="flex items-center gap-3 text-[var(--color-icon-color)]">
      <Icon name="minus" size="sm" aria-hidden="true" />
      <Icon name="x-mark-small" size="sm" aria-hidden="true" />
      <Icon name="expand" size="sm" aria-hidden="true" />
    </div>
  )
}
