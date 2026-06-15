/**
 * One-shot migration: rename old code-side CSS vars to match Figma's
 * Tokens Studio export. Run once after tokens are built; do not re-run.
 *
 * Strategy: collect every (old → new) pair, sort by old-length desc so
 * longer names rewrite before their substrings, then apply in a single
 * forward pass per file.
 */
import { readFileSync, writeFileSync } from "node:fs"
import { execSync } from "node:child_process"

// CSS var renames. Old names ↔ new names per Tokens Studio export.
// Includes only vars actually referenced by components today.
const varRenames = {
  "--color-primary": "--color-primary-color",
  "--color-primary-hover": "--color-primary-hover-color",
  "--color-primary-selected": "--color-primary-selected-color",
  "--color-primary-selected-hover": "--color-primary-selected-hover-color",
  "--color-primary-highlighted": "--color-primary-highlighted-color",
  "--color-text-primary": "--color-primary-text-color",
  "--color-text-secondary": "--color-secondary-text-color",
  "--color-text-on-inverted": "--color-text-color-on-inverted",
  "--color-text-on-primary": "--color-text-color-on-primary",
  "--color-text-disabled": "--color-disabled-text-color",
  "--color-border-ui": "--color-ui-border-color",
  "--color-border-layout": "--color-layout-border-color",
  "--color-placeholder": "--color-placeholder-color",
  "--color-icon": "--color-icon-color",
  "--color-link": "--color-link-color",
  "--color-fixed-dark": "--color-fixed-dark-color",
  "--color-fixed-light": "--color-fixed-light-color",
  "--color-bg-inverted": "--color-inverted-color-background",
  "--color-bg-primary": "--color-primary-background-color",
  "--color-bg-primary-hover": "--color-primary-background-hover-color",
  "--color-bg-secondary": "--color-secondary-background-color",
  "--color-bg-allgrey": "--color-allgrey-background-color",
  "--color-bg-ui": "--color-ui-background-color",
  "--color-bg-disabled": "--color-disabled-background-color",
  "--color-bg-surface": "--color-primary-surface-color",
  "--color-positive": "--color-positive-color",
  "--color-positive-hover": "--color-positive-color-hover",
  "--color-positive-selected": "--color-positive-color-selected",
  "--color-positive-selected-hover": "--color-positive-color-selected-hover",
  "--color-negative": "--color-negative-color",
  "--color-negative-hover": "--color-negative-color-hover",
  "--color-negative-selected": "--color-negative-color-selected",
  "--color-negative-selected-hover": "--color-negative-color-selected-hover",
  "--color-warning": "--color-warning-color",
  "--color-warning-hover": "--color-warning-color-hover",
  "--color-warning-selected": "--color-warning-color-selected",
  "--color-warning-selected-hover": "--color-warning-color-selected-hover",
  "--color-working-orange": "--color-working_orange",
  // --color-done-green stays the same (Content Color names match)
}

// Tailwind utility shorthands derived from @theme vars. Renaming the var
// renames the utility too, so usages like `bg-primary` need the new name.
// Match with word boundaries — must not catch `bg-primary-hover` etc.
const utilityRenames = {
  "bg-primary": "bg-primary-color",
  "bg-primary-hover": "bg-primary-hover-color",
  "text-primary": "text-primary-text-color",
}

// Sort var renames longest-first so substrings don't clobber.
const orderedVarPairs = Object.entries(varRenames).sort(
  (a, b) => b[0].length - a[0].length,
)

// Sort utility renames longest-first too.
const orderedUtilPairs = Object.entries(utilityRenames).sort(
  (a, b) => b[0].length - a[0].length,
)

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

// Single regex with longest-first alternation. The engine scans positions
// left-to-right, and the replacement is consumed (not rescanned), so the new
// name's substrings can't accidentally re-match a shorter old name.
const varRegex = new RegExp(
  `(${orderedVarPairs.map(([k]) => escapeRegex(k)).join("|")})`,
  "g",
)

function migrate(content) {
  content = content.replace(varRegex, (m) => varRenames[m])
  for (const [oldName, newName] of orderedUtilPairs) {
    const re = new RegExp(`(?<![\\w-])${escapeRegex(oldName)}(?![\\w-])`, "g")
    content = content.replace(re, newName)
  }
  return content
}

const files = execSync(
  `find src/showcase src/foundations -type f \\( -name '*.ts' -o -name '*.tsx' \\)`,
)
  .toString()
  .trim()
  .split("\n")
  .filter(Boolean)

let changed = 0
for (const f of files) {
  const before = readFileSync(f, "utf8")
  const after = migrate(before)
  if (before !== after) {
    writeFileSync(f, after)
    changed++
  }
}
console.log(`✓ migrated ${changed} files`)
