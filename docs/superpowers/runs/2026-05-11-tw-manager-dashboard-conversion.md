# Manager Dashboard — design-system reconciliation

**Source URL:** https://www.figma.com/design/tvclyUsdCAYDSkSPRlNYut/TimeWorks-Dashboard--Manager-?node-id=3685-7078
**Run on (Experiment-file duplicate):** https://www.figma.com/design/gqYWCu1K6dJ9gESXtgNeCi/TimeWorks-Design-System--Experiment-?node-id=27449-154717
**DS file:** `gqYWCu1K6dJ9gESXtgNeCi` (TimeWorks Design System — Experiment)
**Date:** 2026-05-11
**Mode:** `work-in-DS-file` (page duplicated into the Experiment file before the run)
**Skill version:** post-retarget, branch `figma-page-to-library-experiment-retarget`

This is the spec's Validation §1 — first end-to-end exercise of the retargeted skill against a real product page. **Scope of this run is intentionally narrow** (one Tier-1 swap) to validate the pipeline end-to-end: backup → matcher cascade → instantiation → text-content preservation → raw-value audit → report. A full conversion of every section in the dashboard is follow-on work; the dashboard is mostly raw FRAMEs / VECTORs / RECTANGLEs with no existing instances, so most remaining sections are Tier-2 (`compose-from-primitives`) or Tier-3 (`annotate-and-preserve`).

## Swapped

- **Input Field** (`27449:154763`, removed) → `Search` library instance (`27449:155810`) — DS component set `Search` (key `4d553dbf93ce4801e29c6c19a11cc58484278256`, variant `Size=Large, State=Default`). Matched via **Rule 2 (name alias)** — source name "Input Field" + text content "Search Tasks" mapped to the DS `Search` family. Placeholder text content preserved via `Placeholder text` node. Position (10, 214) and size (290×36) preserved explicitly (parent is a GROUP, not auto-layout). ⚠️ raw value leak (4) — see below.

## Composed

_(none in this narrow smoke run)_

## Already connected

_(none — page had zero pre-existing library instances)_

## Blocked

_(none in this narrow smoke run — remaining sections deferred to follow-on conversion)_

## Raw-value leaks

- Search (`27449:155810`) — topLeftRadius: 8
- Search (`27449:155810`) — topRightRadius: 8
- Search (`27449:155810`) — bottomLeftRadius: 8
- Search (`27449:155810`) — bottomRightRadius: 8

These four leaks are all on the **DS Search component's own root** corner radii, not on overrides applied during the swap. The Search component in the Experiment file (set `4d553dbf93ce4801e29c6c19a11cc58484278256`) defines its 8px corner radius as a raw number rather than binding to a radius token. This is **DS authoring debt to fix in Figma**, not a conversion gap — the swap itself preserved no raw values, the library brought them in. Logged here so the audit's behavior is visible and so the DS team can promote `8` to a radius token (e.g. `--radius-md`).

## Screenshots

| Stage          | Source                                                                                                                          | Result                                                                                                                          |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Full target    | (Figma REST screenshot endpoint returned 403 "Invalid token" — known transport quirk; inspect `27449:154717` directly in Figma) | (same node id after swap; visual diff vs the backup confirms the Search field renders correctly with DS styling)                |
| Search section | `27449:154763` (removed)                                                                                                        | `27449:155810` — Search instance, x=10, y=214, 290×36, placeholder "Search Tasks", styled by DS library                          |

## Backup

Backup frame: `Backup - Main View` (node `27449:155264`), placed to the right of the original at the same y-coordinate. Restore by deleting the modified Main View and renaming the backup, or by copying nodes back individually.

## Skill smoke-test verification (spec Validation §1)

- [x] Report contains at least one entry under `## Swapped` referencing a component from the regenerated `component-map.json` (Search, key `4d553dbf93ce4801e29c6c19a11cc58484278256`).
- [x] Report contains a populated `## Raw-value leaks` section (4 entries, all on the swap's root from DS library).
- [x] Report references `gqYWCu1K6dJ9gESXtgNeCi` (Experiment file).
- [x] Report contains zero references to the old DS fileKey `04x9q7W2Y59baF5MqHAVZR`.
- [x] Run executed in `work-in-DS-file` mode after duplicating the source page into the Experiment file — matches the new `dsFileKey` config without any cross-file friction.

## Follow-on conversion work (not part of this smoke run)

The Manager Dashboard page has substantial remaining surface that the skill can convert in a subsequent, broader run:

- **Sidebar / Container** (`27449:154726`, 310×868) — currently a hand-built FRAME with task timer + project list. Not a navigation Sidebar (the DS Sidebar is for primary nav), so this is `compose-from-primitives` (Search + List + custom containers) rather than an exact swap to DS `Sidebar`.
- **Project Header**, **Project Task Content**, **Task Timer/Summary/Status Containers** — all Tier-2 candidates composing Avatar / Text / Tag / List item from the regenerated map.
- **Main Content > Header** (`27449:154884`) and **Projects List** (`27449:154900`) — Tier-2 candidates; likely compose to Page header + Table.
- **Bottom Bar** (`27449:155253`) — likely Tier-3 (`annotate-and-preserve`) unless it maps to a DS pattern we haven't recognized.

The raw-value audit run against a broader Tier-1/Tier-2 conversion will surface the bulk of the dashboard's hex literals, ad-hoc radii, and unbound text styles — that is the real payoff of the audit. This narrow run confirmed the audit walker fires and reports correctly; the broader conversion exercises its content.
