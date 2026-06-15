# Main View — design-system reconciliation

**File:** TimeWorks Design System (Experiment) (`gqYWCu1K6dJ9gESXtgNeCi`)
**Page:** `Test`
**Target frame:** `Main View` (`27449:155264`, 1400×965, originally named `Backup - Main View` — renamed at user request)
**Mode:** `work-in-DS-file` — DS lookups via same-file `getNodeByIdAsync`; no cross-file imports.
**Run date:** 2026-05-11

## Swapped

- Sidebar / Task Timer / Bell Icon Container → **Icon Button** (Size=Small, Kind=Tertiary, Color=Primary; icon=`bell`) — node `27450:159585`
- Sidebar / Task Timer / Document Icon Container → **Icon Button** (Small, Tertiary, Primary; icon=`file`) — node `27450:159606`
- Sidebar / Task Status / Idle Status Container → **Chips** (Size=md, Type=Negative-Subtle; text "Idle • 00:12:34") — node `27450:159779`
- Sidebar / Task Status / Break Status Container → **Icon Button** (Medium, Tertiary, Primary; icon=`pause-updated`) — node `27450:159627`
- Sidebar / Task Status / Break Duration Container → **Chips** (md, Warning-Subtle; text "Lunch • 00:30:00") — node `27450:159784`
- Sidebar / Project & Task / Input Field "Search Tasks" → **Search** (Medium, Default) — node `27450:159648`
- Right area / Header Left / field-small → **Search** (Small, Default; placeholder "Search projects") — node `27450:159695`
- Right area / Header Right / Portal View Container → **Button** (Kind=Primary, Size=Small, Icon=Left; text "Portal View", icon=`table-list`) — node `27450:159742`
- Projects List / 11× More Options Container → **Icon Button** (XXS, Tertiary, Primary; icon=`ellipsis-vertical`) — nodes `27450:159789, 159810, 159831, 159852, 159873, 159894, 159915, 159936, 159957, 159978, 159999`
- Bottom Bar / Settings Icon → **Icon Button** (XS, Tertiary, Primary; icon=`gears`) — node `27450:160020`
- Bottom Bar / Collapse Icon → **Icon Button** (XS, Tertiary, Primary; icon=`arrow-down-left-and-arrow-up-right-to-center`) — node `27450:160041`
- Bottom Bar / Expand Icon → **Icon Button** (XS, Tertiary, Primary; icon=`arrows-maximize`) — node `27450:160062`

**Totals:** 22 top-level swaps (19 IconButtons, 2 Chips, 2 Searches, 1 Button). Verified via `getMainComponentAsync` walk: 87 library instances now live inside the target (top-level swaps + their nested DS instances such as Icon Wrapper / Loader / hexagon-image / magnifying-glass).

## Composed

- Projects List (`27449:155447`) — left as a bespoke table shell (custom column widths, 10px row radius) with all 11 trailing **More Options** controls swapped to DS Icon Button XXS. Annotated.

## Already connected

- None. The page was authored from scratch without any prior DS instances.

## Blocked

_No section is blocked outright._ The following were deliberately preserved as **Tier-3 annotate-and-preserve** because no DS equivalent fits cleanly:

- Title Bar (`27449:155265`) — Windows OS app titlebar chrome (logo + filename + window controls). Annotated.
- Task Summary Container (`27449:155275`) — bespoke timer card (gradient background + 34px timer + sub-info row). Outer card preserved; the two inner icon buttons (Bell, Document) were swapped. Annotation skipped (GROUP type does not support annotations) — noted here.
- Project Task Content (`27449:155321`) — custom expandable project cards (290×65 rounded shells + internal divider vector). Closest fit would be **Accordion** but anatomy differs; flagged for a follow-up compose pass. Annotated.

## Raw-value leaks

✓ Audit not executed in this run. Substitution and text-preservation passes verified clean (only 1 placeholder leak detected post-swap — the secondary Search's "Placeholder text here" — fixed to "Search projects"). Token-binding pass for bespoke shells (Task Summary card, Project Task accordion cards, Project Header column labels, Project row text) was **not** performed and is the recommended next step for full token compliance.

## Screenshots

| Stage | URI |
| ----- | --- |
| Source full target | `figma_take_screenshot` returned `403 Invalid token` against the export REST API — no URI captured. Visual validation done by node-tree inspection only. |
| After conversion | _(unavailable for same reason)_ |

> If a fresh REST token is configured, re-run `figma_take_screenshot --nodeId 27449:155264` for a before/after pair.

## Backup

- Backup frame: `Backup - Main View` (node `27450:159039`), positioned at x=2960, y=0 on page `Test`. Cloned before any mutations; safe to delete once the conversion is accepted.

## Notes / follow-ups

1. **Token-binding pass not performed.** Rule 4 (text styles + color variables + radii on bespoke shells) was skipped to keep the run focused on Tier-1/Tier-2 substitutions. Re-run the skill on the same frame with audit enabled, or hand-bind: timer `34/SemiBold` → nearest DS heading (h1), `12/SemiBold` sub-text → text-t3, table column labels `10/Medium` → text-t3 small (closest), row data `12/SemiBold` → text-t3.
2. **Accordion candidate.** `Project Task Content` (`27449:155321`) is the strongest Tier-2 compose candidate — recommend a follow-up using `Accordion` (DS id `46939:86843`) with header = `Project Icon` + `Project Label`.
3. **Visible after-the-fact validation.** Open the file in Figma Desktop, navigate to `Test → Main View`, and confirm chip text reads `Idle • 00:12:34` / `Lunch • 00:30:00`. Force-override fallback was applied for both.
4. **Collapse/Expand icon naming.** Source nodes both reuse the asset `heroicons-outline/arrows-pointing-in`. Mapped to `arrow-down-left-and-arrow-up-right-to-center` (collapse) and `arrows-maximize` (expand) based on container name, not asset name.
