# EmptyState component — DS Button reconciliation

Source: Figma node `46946:13793` ("Component" section on the EmptyState page) in fileKey `gqYWCu1K6dJ9gESXtgNeCi` (TimeWorks DS Experiment).

Goal: replace local wrapper components `.Main Action` (46946:13810) and `.Supporting Action` (46946:13801) used inside `.Base Empty State` with direct DS Button (46939:91505) instances. Empty State variants (46946:13840) inherit from `.Base Empty State` and pick up the change automatically.

## Swapped

- `.Base Empty State / Layout=Default / Main Action Container / ↪️ Main Action` (`46946:13827`) → DS Button (Kind=Secondary, Size=Medium, text="Main action") — new node `27849:704118`
- `.Base Empty State / Layout=Compact / Main Action Container / ↪️ Main Action` (`46946:13837`) → DS Button (Kind=Secondary, Size=Small, text="Main action") — new node `27849:704121`
- `.Base Empty State / Layout=Default / Supporting Action Container / ↪️ Supporting Action` (`46946:13829`) → DS Button (Kind=Tertiary, Size=Medium, text="Read more") — new node `27849:704124`
- `.Base Empty State / Layout=Compact / Supporting Action Container / ↪️ Supporting Action` (`46946:13839`) → DS Button (Kind=Tertiary, Size=Small, text="Read more") — new node `27849:704127`

All new instances verified: `mainComponent.parent` resolves to the canonical Button COMPONENT_SET `46939:91505`. Text overrides applied via the `Button text` property; no DS placeholder strings remain.

## Composed

_None._

## Already connected

_None — the section used local wrappers exclusively._

## Blocked

_None._

## Notes

- Empty State component variants (`46946:13840` — Default/Compact/Inline/Main) inherit the swap automatically through their `.Base Empty State` reference.
- The local component sets `.Main Action` (46946:13810) and `.Supporting Action` (46946:13801) were left in place. They are no longer referenced inside `.Base Empty State` and can be deleted in a follow-up if no other consumers exist.
- All four swapped instances kept their original auto-layout positions (parent FRAMEs use VERTICAL auto-layout, `insertChild(idx, …)` preserved order).

## Backup

Backup section: `Backup - Component` — node `27849:704077` (placed to the right of the original on the same page).
