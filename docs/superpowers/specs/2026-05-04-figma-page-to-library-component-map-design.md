# figma-page-to-library — Static Component Map

**Date:** 2026-05-04
**Status:** Design approved, awaiting filled-in component table
**Related:** `docs/superpowers/runs/timeout-analysis-report.md`

---

## Problem

The `figma-page-to-library` skill times out at Step 5 ("Build a component map from the DS") when it tries to discover library components via `figma.root.findAllWithCriteria` or `figma.root.findOne`. The TimeWorks DS file is large enough that any recursive tree walk hits the 7-second figma-console MCP timeout. The skill cannot proceed without a component map, so the entire workflow is blocked.

## Goal

Replace runtime component discovery with a pre-built static lookup file. The skill stops searching and instead reads a checked-in JSON map of `name → { key, id }`. Instantiation becomes deterministic, fast, and timeout-proof regardless of DS file size.

## Non-goals

- Auto-detection of new or renamed components (staleness is acceptable; map is regenerated manually).
- Storing variant matrices in the map. Each entry points at one specific variant; the skill handles variant selection at runtime via `setProperties`.
- Changing how the skill writes pages, swaps detached layers, or does anything past Step 5. This change is scoped to component discovery.

---

## Approach

### Artifact

A single JSON file checked into git:

```
.claude/skills/figma-page-to-library/component-map.json
```

### Shape

```json
{
  "Button": { "key": "<component-key>", "id": "<node-id>" },
  "Avatar": { "key": "<component-key>", "id": "<node-id>" },
  "Loader": { "key": "<component-key>", "id": "<node-id>" }
}
```

- **`key`** — stable component key, used with `figma.importComponentByKeyAsync(key)` for cross-file library instantiation.
- **`id`** — node ID in the DS file, used with `figma.getNodeByIdAsync(id)` when the DS file is the active document.
- No `type` field. Every entry is a single COMPONENT node (a specific variant when the component has variants).

### Generation workflow

1. **User fills in the table below** — for each component, paste a Figma URL pointing at a single specific variant (the "default" one for variant-bearing components, the component itself for variant-less ones).
2. **User signals completion.**
3. **Claude resolves URLs → IDs and keys.** Each Figma URL contains a `node-id` query param; that is parsed out (converting `-` to `:`). One batched `figma_execute` call then resolves each node ID to its `.key` via `getNodeByIdAsync`.
4. **Claude writes `component-map.json`** to the path above and commits it.

### Skill changes

`.claude/skills/figma-page-to-library/SKILL.md` is updated:

- Step 5 ("Build a component map from the DS") is replaced with: "Read `component-map.json` from the skill directory. This is the authoritative component map. Do **not** call `figma.root.findOne`, `findAll`, or `findAllWithCriteria` — these will time out on large DS files."
- Instantiation guidance becomes:

  ```js
  const { id } = map["Button"]
  const node = await figma.getNodeByIdAsync(id)
  const instance = node.createInstance()
  instance.setProperties({ Variant: "Primary", Size: "md" })
  ```

  For cross-file instantiation (when the source page is in a different file from the DS), use `key`:

  ```js
  const { key } = map["Button"]
  const component = await figma.importComponentByKeyAsync(key)
  const instance = component.createInstance()
  instance.setProperties({
    /* ... */
  })
  ```

- Skill notes that the map is hand-maintained: if a needed component is missing from the map, the skill must stop and ask the user to add it, not fall back to searching.

### Refresh policy

The map is regenerated manually when components are added, renamed, or restructured in Figma. The user has accepted this maintenance cost. No auto-rebuild logic in the skill.

---

## Component table

Fill in the **Figma URL** column for each component. Right-click the component (or a single specific variant for variant-bearing components) in Figma → **Copy link to selection**.

| Component name                | Figma URL                                                                                                             |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Accordion                     | https://www.figma.com/design/04x9q7W2Y59baF5MqHAVZR/TimeWorks-Design-System?node-id=46939-86867&t=MKxQRvPjlf8llF4n-4  |
| Alert Banner                  | https://www.figma.com/design/04x9q7W2Y59baF5MqHAVZR/TimeWorks-Design-System?node-id=46939-87415&t=MKxQRvPjlf8llF4n-4  |
| Attention Box                 | https://www.figma.com/design/04x9q7W2Y59baF5MqHAVZR/TimeWorks-Design-System?node-id=49719-108084&t=MKxQRvPjlf8llF4n-4 |
| Avatar                        | https://www.figma.com/design/04x9q7W2Y59baF5MqHAVZR/TimeWorks-Design-System?node-id=46939-89614&t=MKxQRvPjlf8llF4n-4  |
| Avatar Group                  | https://www.figma.com/design/04x9q7W2Y59baF5MqHAVZR/TimeWorks-Design-System?node-id=46939-90192&t=MKxQRvPjlf8llF4n-4  |
| Badge                         | https://www.figma.com/design/04x9q7W2Y59baF5MqHAVZR/TimeWorks-Design-System?node-id=46939-90725&t=MKxQRvPjlf8llF4n-4  |
| Breadcrumbs Bar               | https://www.figma.com/design/04x9q7W2Y59baF5MqHAVZR/TimeWorks-Design-System?node-id=46939-91066&t=MKxQRvPjlf8llF4n-4  |
| Button                        | https://www.figma.com/design/04x9q7W2Y59baF5MqHAVZR/TimeWorks-Design-System?node-id=46939-95682&t=MKxQRvPjlf8llF4n-4  |
| Button Group                  | https://www.figma.com/design/04x9q7W2Y59baF5MqHAVZR/TimeWorks-Design-System?node-id=46939-96085&t=MKxQRvPjlf8llF4n-4  |
| Icon Button                   | https://www.figma.com/design/04x9q7W2Y59baF5MqHAVZR/TimeWorks-Design-System?node-id=46946-15607&t=MKxQRvPjlf8llF4n-4  |
| Checkbox                      | https://www.figma.com/design/04x9q7W2Y59baF5MqHAVZR/TimeWorks-Design-System?node-id=46939-96593&t=MKxQRvPjlf8llF4n-4  |
| Chips                         | https://www.figma.com/design/04x9q7W2Y59baF5MqHAVZR/TimeWorks-Design-System?node-id=46939-98065&t=MKxQRvPjlf8llF4n-4  |
| Combobox                      | https://www.figma.com/design/04x9q7W2Y59baF5MqHAVZR/TimeWorks-Design-System?node-id=46939-99069&t=MKxQRvPjlf8llF4n-4  |
| Counter                       | https://www.figma.com/design/04x9q7W2Y59baF5MqHAVZR/TimeWorks-Design-System?node-id=46939-100253&t=MKxQRvPjlf8llF4n-4 |
| Date Picker                   | https://www.figma.com/design/04x9q7W2Y59baF5MqHAVZR/TimeWorks-Design-System?node-id=46939-100532&t=MKxQRvPjlf8llF4n-4 |
| Dialog                        | https://www.figma.com/design/04x9q7W2Y59baF5MqHAVZR/TimeWorks-Design-System?node-id=46946-1069&t=MKxQRvPjlf8llF4n-4   |
| Divider                       | https://www.figma.com/design/04x9q7W2Y59baF5MqHAVZR/TimeWorks-Design-System?node-id=46946-1209&t=MKxQRvPjlf8llF4n-4   |
| Dropdown                      | https://www.figma.com/design/04x9q7W2Y59baF5MqHAVZR/TimeWorks-Design-System?node-id=46946-2417&t=MKxQRvPjlf8llF4n-4   |
| Editable Heading              | https://www.figma.com/design/04x9q7W2Y59baF5MqHAVZR/TimeWorks-Design-System?node-id=46946-4471&t=MKxQRvPjlf8llF4n-4   |
| Editable Text                 | https://www.figma.com/design/04x9q7W2Y59baF5MqHAVZR/TimeWorks-Design-System?node-id=25391-26867&t=MKxQRvPjlf8llF4n-4  |
| Empty state                   | https://www.figma.com/design/04x9q7W2Y59baF5MqHAVZR/TimeWorks-Design-System?node-id=46946-13859&t=MKxQRvPjlf8llF4n-4  |
| Label                         | https://www.figma.com/design/04x9q7W2Y59baF5MqHAVZR/TimeWorks-Design-System?node-id=46946-16199&t=MKxQRvPjlf8llF4n-4  |
| Linear Progress Bar           | https://www.figma.com/design/04x9q7W2Y59baF5MqHAVZR/TimeWorks-Design-System?node-id=46946-16445&t=MKxQRvPjlf8llF4n-4  |
| Link                          | https://www.figma.com/design/04x9q7W2Y59baF5MqHAVZR/TimeWorks-Design-System?node-id=46946-17092&t=MKxQRvPjlf8llF4n-4  |
| List                          | https://www.figma.com/design/04x9q7W2Y59baF5MqHAVZR/TimeWorks-Design-System?node-id=46946-17987&t=MKxQRvPjlf8llF4n-4  |
| Loader                        | https://www.figma.com/design/04x9q7W2Y59baF5MqHAVZR/TimeWorks-Design-System?node-id=46946-20114&t=MKxQRvPjlf8llF4n-4  |
| Menu                          | https://www.figma.com/design/04x9q7W2Y59baF5MqHAVZR/TimeWorks-Design-System?node-id=46946-21012&t=MKxQRvPjlf8llF4n-4  |
| Modal                         | https://www.figma.com/design/04x9q7W2Y59baF5MqHAVZR/TimeWorks-Design-System?node-id=46947-2799&t=MKxQRvPjlf8llF4n-4   |
| Multi Step Indicator (Wizard) | https://www.figma.com/design/04x9q7W2Y59baF5MqHAVZR/TimeWorks-Design-System?node-id=46947-4160&t=MKxQRvPjlf8llF4n-4   |
| Radio Button                  | https://www.figma.com/design/04x9q7W2Y59baF5MqHAVZR/TimeWorks-Design-System?node-id=46947-8995&t=MKxQRvPjlf8llF4n-4   |
| Search                        | https://www.figma.com/design/04x9q7W2Y59baF5MqHAVZR/TimeWorks-Design-System?node-id=46947-9894&t=MKxQRvPjlf8llF4n-4   |
| Skeleton                      | https://www.figma.com/design/04x9q7W2Y59baF5MqHAVZR/TimeWorks-Design-System?node-id=46949-1101&t=MKxQRvPjlf8llF4n-4   |
| Slider                        | https://www.figma.com/design/04x9q7W2Y59baF5MqHAVZR/TimeWorks-Design-System?node-id=46949-2952&t=MKxQRvPjlf8llF4n-4   |
| Split Button                  | https://www.figma.com/design/04x9q7W2Y59baF5MqHAVZR/TimeWorks-Design-System?node-id=46966-7785&t=MKxQRvPjlf8llF4n-4   |
| Steps                         | https://www.figma.com/design/04x9q7W2Y59baF5MqHAVZR/TimeWorks-Design-System?node-id=46949-9204&t=MKxQRvPjlf8llF4n-4   |
| Table                         | https://www.figma.com/design/04x9q7W2Y59baF5MqHAVZR/TimeWorks-Design-System?node-id=46949-12318&t=MKxQRvPjlf8llF4n-4  |
| Tabs                          | https://www.figma.com/design/04x9q7W2Y59baF5MqHAVZR/TimeWorks-Design-System?node-id=46949-28324&t=MKxQRvPjlf8llF4n-4  |
| Text Area                     | https://www.figma.com/design/04x9q7W2Y59baF5MqHAVZR/TimeWorks-Design-System?node-id=46949-32405&t=MKxQRvPjlf8llF4n-4  |
| Text Field                    | https://www.figma.com/design/04x9q7W2Y59baF5MqHAVZR/TimeWorks-Design-System?node-id=46949-34175&t=MKxQRvPjlf8llF4n-4  |
| Tipseen                       | https://www.figma.com/design/04x9q7W2Y59baF5MqHAVZR/TimeWorks-Design-System?node-id=46949-36146&t=MKxQRvPjlf8llF4n-4  |
| Toast                         | https://www.figma.com/design/04x9q7W2Y59baF5MqHAVZR/TimeWorks-Design-System?node-id=46949-39963&t=MKxQRvPjlf8llF4n-4  |
| Toggle                        | https://www.figma.com/design/04x9q7W2Y59baF5MqHAVZR/TimeWorks-Design-System?node-id=46949-40964&t=MKxQRvPjlf8llF4n-4  |
| Tooltip                       | https://www.figma.com/design/04x9q7W2Y59baF5MqHAVZR/TimeWorks-Design-System?node-id=46949-41225&t=MKxQRvPjlf8llF4n-4  |

**Notes:**

- For components with variants (Button, Input, Checkbox, etc.), link to **one specific variant** — typically the default state. The skill swaps variants at runtime via `setProperties`.
- For components with no variants (Loader, Skeleton if variant-less), link to the component itself.
- If a component listed above doesn't actually exist in the DS file as a published component, leave the row blank or delete it — call it out when you signal completion.
- Add rows for any components missing from the list (e.g. `_PageHeader`, `_SectionHeader`, or anything else in `src/index.ts` not captured here).

---

## Risks and mitigations

- **Stale map.** When a DS component is renamed or removed, the map silently rots. Mitigated by user acknowledgment that staleness is acceptable; failures will surface as `getNodeByIdAsync` returning `null`, and the skill must error clearly rather than fall back to search.
- **Cross-file instantiation.** If the source page being converted lives in a different file from the DS, `getNodeByIdAsync` won't work — `importComponentByKeyAsync(key)` is required. Both paths are documented in the skill so the right one is used per situation.
- **Large variant matrices on a single component.** Avoided by design: every entry is a single variant node, not a component set, so resolving the entry is O(1) regardless of how many variants exist.

---

## Definition of done

- [ ] Component table above is filled in by the user.
- [ ] `component-map.json` exists at `.claude/skills/figma-page-to-library/component-map.json` with one entry per filled row.
- [ ] Each entry has both `key` and `id`, both verified to be non-empty.
- [ ] `SKILL.md` updated: Step 5 replaced with "read the map," `findOne`/`findAll` calls forbidden, instantiation pattern documented for both same-file and cross-file cases.
- [ ] Spec, JSON, and skill changes committed in a single coherent change.
