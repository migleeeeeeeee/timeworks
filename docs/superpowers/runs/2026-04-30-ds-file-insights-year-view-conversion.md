# Insights / Work tracking - Year View — design-system reconciliation

**Source:** TimeWorks Design System (fileKey `04x9q7W2Y59baF5MqHAVZR`), page `⚒️ Utils`, frame `25557:115758`
**Mode:** `work-in-DS-file` + `apply-known-scope`
**Date:** 2026-04-30

## Swapped

Header (Section 1, `25557:115760`)
- Search field `25557:115767` → **DS Search** (Size=Medium, State=Default), placeholder "Search Employee" — new node `25558:197980`
- Avatar circle `25557:115773` → **DS Avatar** (Size=Medium, Type=Letter, Disabled=Off), initial "A" — new node `25558:198004`

Date controls (Section 2, `25557:115777`)
- Legacy Button Icon (left arrow) `25557:115780` → **DS Icon Button** (Size=Small, Kind=Tertiary, State=Default) — new node `25558:183970`
- Legacy Button Icon (right arrow) `25557:115781` → **DS Icon Button** (same variant) — new node `25558:183982`
- Legacy "Buttons V.2" (Previous Employee) `25557:115786` → **DS Button** (Kind=Secondary, Size=Small, State=Regular, Icon=Left, Color=Primary), text "Previous Employee" — new node `25558:184042`
- Legacy "Buttons V.2" (Next Employee) `25557:115787` → **DS Button** (Kind=Primary, Size=Small, State=Regular, Icon=Right, Color=Primary), text "Next Employee" — new node `25558:184069`

Stat cards (Section 3, `25557:115788`) — chips only
- Delta chip "13%" card 1 `25557:115795` → **DS Chips** Type=Positive — `25558:199094`
- Goal chip "40%" card 1 `25557:115798` → **DS Chips** Type=On-Positive — `25558:199097`
- Delta chip "2%" card 2 `25557:115810` → **DS Chips** Type=Negative — `25558:199100`
- Goal chip "8:00:00" card 2 `25557:115813` → **DS Chips** Type=On-Positive — `25558:199103`
- Delta chip "13%" card 3 `25557:115823` → **DS Chips** Type=Positive — `25558:199106`
- Goal chip "$832.43" card 3 `25557:115826` → **DS Chips** Type=On-Positive — `25558:199109`
- Delta chip "13%" card 4 `25557:115841` → **DS Chips** Type=Positive — `25558:199112`

Alert (Section 4, `25557:115845`)
- Row 1 "View Screenshots" `25557:115863` → **DS Button** (Kind=Tertiary, Size=XS, Color=Primary) — `25558:199693`
- Row 1 "Mark as Resolved" `25557:115864` → **DS Button** (Kind=Primary, Size=Small, Icon=Left, Color=Positive) — `25558:199719`
- Row 2 "View Screenshots" `25557:115870` → **DS Button** (Tertiary, XS) — `25558:199754`
- Row 2 "Mark as Resolved" `25557:115871` → **DS Button** (Primary, Small, Positive) — `25558:199780`

Top Apps + Projects (Section 5, `25557:115872`)
- "View All" (Top Apps) `25557:115876` → **DS Button** (Tertiary, XS) text "View All"
- "View All" (Projects) `25557:115961` → **DS Button** (Tertiary, XS) text "View All"
- 8 Top-Apps progress groups `25557:115878..115948` → **DS Linear Progress Bar** (Type=Primary, Size=Small, Label=Off), per-row Percentage set from row label — new nodes `25558:207448`–`25558:207483`
- 8 Projects progress groups `25557:115963..116047` → **DS Linear Progress Bar** (same variant), Percentage "25%" — new nodes `25558:211003`–`25558:211038`

Screenshots header + controls (Section 6, `25557:116059`)
- "Show Alerted Screenshots" checkbox `25557:116064` → **DS Checkbox** (State=Selected, Label=off) — `25558:215283`
- "Show low activity screenshots" checkbox `25557:116067` → **DS Checkbox** (Selected, Label=off) — `25558:215287`
- "Screenshots intervals" Select `25557:116071` → **DS Dropdown** (Size=Medium, State=Default, Type=Default, Menu open=False) — `25558:215301`
- "Delete Time (06)" custom red button `25557:116073` → **DS Button** (Kind=Primary, Size=Small, Icon=Left, Color=Negetive) — `25558:215326`
- "Add Note (06)" custom blue button `25557:116078` → **DS Button** (Kind=Primary, Size=Small, Icon=Left, Color=Primary) — `25558:215337`

## Composed

None — all conversions were single-component swaps. (Stat-card containers and illustration art were preserved; only the chip slots were swapped.)

## Already connected

- Bell icon wrapper `25557:115771` — already a remote `Icon Wrapper` instance from the icon library; left as-is.
- `magnifying-glass` icon (now inside the new DS Search instance), `flag` icon (`25557:115849`), and other icon-set instances throughout — remote, retained.

## Annotated as-is (Tier 3 — preserved)

- **Offline pill** (`25557:115764`) — small status dot + "Offline" label. No DS status-indicator component exists; kept verbatim.
- **2025 date pill** (`25557:115782`) — local frame styled like a date input. DS does not expose a `DatePicker` COMPONENT_SET in the published library; kept verbatim.
- **Stat-card outer containers + illustrations** (`25557:115789`, `25557:115804`, `25557:115819`, `25557:115836`) — bespoke metric cards with custom 3-D illustrations and rounded backgrounds. No matching DS Card primitive; kept verbatim.
- **Top Apps & Projects card containers** (`25557:115873`, `25557:115958`) — bespoke white cards. No DS Card; container kept verbatim, only the progress rows + View All swapped.
- **Flagged Employee pill** (`25557:115848`) — flag icon + label. Could compose with DS Chips Icon=Left, but icon swap is required for parity; deferred.
- **Screenshot grid** (`25557:116083`) — `Frame 7160` + `Frame 1707484485` (timeline rail + 12 screenshot tiles). Bespoke — no matching DS component; kept verbatim.
- **Alert + Screenshots column-header rows** — text labels only; no DS Table family used here (the existing rows are not table cells but flexbox text rows).
- **Left sidebar `Menu - Closed`** (`25557:116305`) — vertical icon column. Could be composed from DS Icon Button stack, but is structurally a navigation-shell concern outside this component-level pass; kept verbatim.

## Blocked

None. Every targeted substitution succeeded.

## Known visual deltas to verify

- **Section 3 Positive chips** render with a softer outline-style fill in the current DS Chips Type=Positive vs the legacy solid-teal pill. Type=On-Positive matches the legacy filled goal pill.
- **Section 2 Icon Buttons** pulled the DS default icon (not a chevron); the variant is correct but a chevron icon-swap is needed for full visual parity.
- **Section 6 Dropdown** instantiated with default placeholder "Placeholder text here"; the original "Every 10 minutes" value isn't reflected as a top-level component property — needs a follow-up text override on the inner label.
- **Section 4 Mark as Resolved** is now green DS positive (Color=Positive). The legacy version was indigo blue — confirm the green is the intended state.

## Backup

Backup frame retained: `Backup - Insights / Work tracking - Year View` (`25557:116782`), placed 200px to the right of the original on the `⚒️ Utils` page.

## Annotation

A summary annotation has been written to the root frame (`25557:115758`) documenting the bucket of each section.
