# figma-hybrid-page-rebuild

Rebuilds a TimeWorks product page against the fixed DS template (`Mockup w/ Sidebar — Expanded`, node `25730:16658` in the Experiment file). Keeps the template's chrome — Sidebar, Header, Toolbar, Date-range strip, stat-tile pattern — and inserts the source's unique body sections in place of the template's reference body content. Patches every template text slot from source via `slot-map.json`, then runs three cleanup passes (pattern-swap, token-binding, card-border) before a user visual-confirm exit gate.

**Read `SKILL.md` for the full workflow.** Sibling skill at `../figma-page-to-library/` holds the shared configs (`ds-config.json`, `component-map.json`, `icon-map.json`) this skill reads but does not duplicate.

**Triggers on:** any reference verb ("use the DS", "match the template", "rebuild from the DS") plus a single Figma URL.

**Does NOT support:** user-supplied alternative reference URLs (use `figma-page-to-library` instead) or React code generation (use `figma-to-code`).
