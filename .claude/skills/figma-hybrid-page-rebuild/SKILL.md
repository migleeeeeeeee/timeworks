---
name: figma-hybrid-page-rebuild
description: Use when the user shares a single Figma URL of a TimeWorks product page and asks to "use the design system", "match the template", "rebuild from the DS", "convert to the design system", or similar — any reference verb plus a single page URL. Rebuilds the page against the fixed canonical template (Mockup w/ Sidebar — Expanded, hardcoded in template-config.json) by keeping the template's Sidebar/Header/Toolbar/Date-range/stat-tile chrome and inserting the source's unique body sections. Always runs a slot-patch from source text, token-binding, pattern-swap (Linear Progress Bar etc.), and card-border pass. Does NOT support a user-supplied reference URL (use figma-page-to-library for those cases) and does NOT generate React code (figma-to-code for that).
---

# figma-hybrid-page-rebuild

<!-- Body written in Tasks 5–9. Section anchors used by the cross-refs: -->
<!--   ## Required tools -->
<!--   ## Core rules -->
<!--   ## Workflow -->
<!--   ### 1. Connection check -->
<!--   ### 2. Parse source URL -->
<!--   ### 3. Inspect source target -->
<!--   ### 4. Backup the source -->
<!--   ### 5. Clone the template -->
<!--   ### 6. Identify source unique sections -->
<!--   ### 7. Insert source unique sections -->
<!--   ### 8. Patch text slots -->
<!--   ### 9. Cleanup passes -->
<!--   ### 10. Delete source + exit gate -->
<!--   ## Failure modes -->
<!--   ## When NOT to use this skill -->
