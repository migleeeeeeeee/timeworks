# figma-page-to-library — retarget at the Experiment DS file

**Date:** 2026-05-11
**Owner:** miggle@abroadworks.com
**Status:** Approved design — ready for implementation plan
**Related:** `.claude/skills/figma-page-to-library/SKILL.md`, `docs/superpowers/specs/2026-04-30-figma-page-to-library-design.md`

---

## Problem

The `figma-page-to-library` skill is hard-pinned to the published DS library (`04x9q7W2Y59baF5MqHAVZR`), but all DS authoring now happens in the Experiment file (`gqYWCu1K6dJ9gESXtgNeCi`). Running the skill against any current product page (e.g. the Manager Dashboard at `tvclyUsdCAYDSkSPRlNYut`, node `3685-7078`) targets a stale library, misses recently authored components (Sidebar, Sidebar Icon Button, the canonical 298-icon set at `25336:96509`), and lets raw hex / raw font sizes survive a conversion pass.

Four concrete gaps, as confirmed in brainstorming:

1. **Wrong DS file targeted.** Hardcoded fileKey throughout the skill.
2. **Doesn't pick the closest match.** Step 5's matching is prose; there's no deterministic decision order, so component / variant choice drifts.
3. **Leaves raw hex / raw text styles.** No exit gate verifies that converted sections actually bind every visual property to a token.
4. **Cross-file friction.** Manual page duplication is required and icon resolution silently bails because icons aren't in `component-map.json`.

## Goal

Retarget the skill at the Experiment file, make the DS file a one-line config swap, replace the matching prose with a four-rule deterministic cascade, and add a non-blocking raw-value audit step. The Manager Dashboard page is the first real run, but the deliverable is the hardened skill — the dashboard is the proof.

## Non-goals

- No React / `src/` changes.
- No new component authoring in the DS file. If a needed library component is missing, the run flags it (Tier 4 / blocked) and continues — never halts to extend the library.
- No automated raw-value snapping. The audit surfaces leaks; humans decide.
- No programmatic cross-file page duplication. Figma's plugin API cannot move pages between files; manual duplicate-to-DS-file stays.
- No `npm` wiring for the regen script — it's a manual one-shot.

## Design

### A. DS file as config

Add `.claude/skills/figma-page-to-library/ds-config.json`:

```json
{
  "dsFileKey": "gqYWCu1K6dJ9gESXtgNeCi",
  "dsFileName": "TimeWorks Design System (Experiment)"
}
```

Every reference to `04x9q7W2Y59baF5MqHAVZR` in `SKILL.md` is replaced with a reference to this config. The skill's Step 1 reads `ds-config.json` before the connection check and uses `dsFileKey` everywhere the old constant appeared (Step 2 scope detection, the `work-in-DS-file` mode check, the failure-mode table). The SKILL.md `description` frontmatter is updated to say "Experiment file" and reference the config rather than embedding the key.

When the Experiment file is eventually promoted to the published library, swapping `dsFileKey` in `ds-config.json` is the only change needed.

### B. Regenerated component map + new icon map

`.claude/skills/figma-page-to-library/component-map.json` is regenerated against the Experiment file. New entries are guaranteed for at least:

- `Sidebar` (component set `25694:158051`)
- `Sidebar Icon Button` (`25694:157615`)
- Anything else discovered on the Experiment file's component pages that isn't already in the map

`.claude/skills/figma-page-to-library/icon-map.json` is new. Same shape as `component-map.json` — keyed by icon name, with `{ id, key }` per icon — populated by walking the 298-icon canonical library rooted at node `25336:96509`. This unblocks Step 7's icon-override branch, which today bails with "Icons are not in component-map.json today."

Both maps are committed. Neither is re-walked at runtime — Step 5 loads them as static files.

A new script `scripts/regen-figma-page-to-library-maps.mjs` regenerates both maps. It is invoked manually (`node scripts/regen-figma-page-to-library-maps.mjs`), not wired into `npm run`. The script:

1. Verifies the Experiment file is open in Figma Desktop via `figma_get_status`.
2. Navigates to the Experiment file via `figma_navigate`.
3. Walks the Components page(s) with a chunked `figma_execute` walker (≤200 nodes per call to stay under the 7-second WebSocket budget), collecting every top-level `COMPONENT` / `COMPONENT_SET` and recording `{ name, id, key }`.
4. Walks the icon library node `25336:96509` separately, collecting each icon as `{ name: <leaf>, id, key }`.
5. Writes `component-map.json` and `icon-map.json` next to the skill.

Re-run any time the Experiment file gains, renames, or moves a component.

### C. Four-rule matcher cascade (Step 5)

Replace the prose matching guidance with this decision order, evaluated per source section. The first rule that matches wins.

1. **Existing key match.** If the source section is already an `INSTANCE` and its `mainComponent.key` exists in `component-map.json`, treat as `exact-swap` with variant carried over via `setProperties`. No name guessing.
2. **Name alias match.** Match the source node name (lowercased, punctuation stripped) against a short alias table baked into Step 5 — e.g. `{btn, button, cta, action} → Button`; `{tag, chip, pill, badge} → Tag` (where Tag is the DS canonical, with Badge handled by alias to Tag when appropriate). On hit, instantiate the mapped component and infer variant from visual cues (fill role → primary/secondary, has-stroke → outlined, has-icon → with-icon, etc.) as documented in the existing Step 5 "Variant matching" notes.
3. **Visual signature match.** Compute a small signature for the source section — `{ radiusBucket: none|sm|md|lg|full, hasStroke: bool, hasIcon: bool, hasAvatar: bool, childCount: number, role: container|control|text }` — and compare against signatures for the composable primitives (Button, Tag, Avatar, Text, Banner, Chip). If at least two primitives' signatures match the section's children, route to `compose-from-primitives`.
4. **Fall through to Tier 3** (`annotate-and-preserve`).

Implementation note: the matcher is documented as prose-plus-pseudocode in Step 5, and instantiated inline inside the per-section `figma_execute` payload. No new files, no scoring weights — deterministic four-rule cascade.

### D. Raw-value audit (new Step 9.5)

After the per-section validate (Step 9) and before the deliverable report (Step 10), the skill runs one read-only `figma_execute` walk over the converted target frame and returns an array of leaks. **Non-blocking** — surfaces leaks in the report; never halts the run.

A leak is any of, inside a Tier-1 (`exact-swap`) or Tier-2 (`compose-from-primitives`) section, recursively:

- A `SolidPaint` fill or stroke whose `boundVariables.color` is undefined.
- A `cornerRadius` — or any of the four per-corner radii (`topLeftRadius`, `topRightRadius`, `bottomLeftRadius`, `bottomRightRadius`) — that is not bound to a variable and is not `0`.
- A `TextNode` whose `textStyleId` is empty AND whose `fontName`, `fontSize`, and `lineHeight` are not all bound to variables. All-or-nothing on text bindings.
- An `effects` entry whose parent node has an empty `effectStyleId`.

Explicitly **not** leaks:

- Anything inside a Tier-3 (`annotate-and-preserve`) or Tier-4 (`blocked`) section.
- Image fills and gradient fills.
- The intentional `rgba(...)` overlays in Toast / Slider / Modal — handled via a node-name allowlist seeded in the walker with `["Toast", "Slider", "Modal"]` (substring match, case-insensitive).
- Nodes that are descendants of newly-placed library instances — their styling resolves through the library's own bindings, not the product file.

Walker output shape:

```js
[
  { nodeId: "123:45", nodeName: "Title", property: "fill", rawValue: "#1F2937" },
  { nodeId: "123:46", nodeName: "Card", property: "cornerRadius", rawValue: 10 },
  // ...
]
```

The walker is chunked the same way the inventory walker is (≤200 nodes per call, cursor pattern for large frames).

### E. Report changes (Step 10)

Two additions to the deliverable format:

1. **New `## Raw-value leaks` section.** Lists every walker entry as `- <nodeName> (\`<id>\`) — <property>: <rawValue>`. If the walker returned an empty array, the section reads `✓ No raw values detected.` Always present, never omitted.
2. **`⚠️ raw value leak (N)` annotation** on any Swapped / Composed line whose section contains N ≥ 1 leaks. The section stays in its bucket (does not demote to Blocked); the marker just flags it for follow-up.

## Files touched

**Modified**

- `.claude/skills/figma-page-to-library/SKILL.md` — replace hardcoded fileKey with `ds-config.json` reads (Steps 1, 2, failure-mode table, frontmatter description); rewrite Step 5 with the four-rule cascade and the alias table; update Step 7's icon-override branch to read `icon-map.json`; add Step 9.5 (raw-value audit); update Step 10 report format.
- `.claude/skills/figma-page-to-library/component-map.json` — regenerated against the Experiment file via the new script. Includes Sidebar, Sidebar Icon Button, and any other Experiment-file components not previously mapped.

**New**

- `.claude/skills/figma-page-to-library/ds-config.json` — `{ dsFileKey, dsFileName }`.
- `.claude/skills/figma-page-to-library/icon-map.json` — 298 icon entries from node `25336:96509`.
- `scripts/regen-figma-page-to-library-maps.mjs` — manual regeneration script, not wired into `npm run`.
- `docs/superpowers/specs/2026-05-11-figma-page-to-library-experiment-retarget-design.md` — this spec.

**Unchanged**

- Everything under `src/`. This work is entirely skill-side.

## Validation

After implementation, two checks confirm the work landed:

1. **Skill smoke run** against the Manager Dashboard page (`tvclyUsdCAYDSkSPRlNYut`, node `3685-7078`) duplicated into the Experiment file. The resulting deliverable at `docs/superpowers/runs/2026-05-11-tw-manager-dashboard-conversion.md` must:
   - Contain at least one entry under `## Swapped` referencing a component from the regenerated map (e.g. Sidebar).
   - Contain a populated or empty `## Raw-value leaks` section — its presence is the audit confirmation.
   - Reference `gqYWCu1K6dJ9gESXtgNeCi`, not `04x9q7W2Y59baF5MqHAVZR`, in any file-key context.
2. **Config-swap sanity.** Changing `dsFileKey` in `ds-config.json` to a placeholder value and re-running causes the Step 1 connection check to fail with a message naming the placeholder — proving no hardcoded fallback survived.

## Open questions

None as of approval. The brainstorm resolved direction (update existing skill), pain points (all four), deliverable shape (skill + first real run), and the audit semantics.

## References

- Existing skill: `.claude/skills/figma-page-to-library/SKILL.md`
- Original spec: `docs/superpowers/specs/2026-04-30-figma-page-to-library-design.md`
- Project conventions: `CLAUDE.md`
- Memory: "DS working file is the Experiment file" (2026-05-11), "DS canonical components beyond component-map.json", "page-to-library is substitution, not gap-flagging"
