// Map Figma icon names to files in src/svgs/regular/, copy into src/icons/svg/,
// and emit src/icons/registry.ts (lazy SVG imports) + src/icons/names.ts (names list).
//
// Run via: node scripts/build-icons.mjs

import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, "..")
const SRC_SVG_DIR = path.join(ROOT, "src/svgs/regular")
const OUT_SVG_DIR = path.join(ROOT, "src/icons/svg")
const OUT_REGISTRY = path.join(ROOT, "src/icons/registry.ts")
const OUT_NAMES = path.join(ROOT, "src/icons/names.ts")

// 301 names from the Figma "Icons" page (node 25336:96509)
const FIGMA_NAMES = [
  "heart","circle-minus","circle-plus","flag","clapperboard-play","notes-sticky","share-nodes","asterisk","head-side-headphones","user-tie-hair","chart-mixed","calculator-simple","user-xmark","umbrella-beach","brightness","badge-check","house","users-grp","Plus-sparkle","bell","globe","trash","bookmark","hexagon-check","copy","chevron-left","chevron-right","chevron-down","chevron-up","clapperboard","angles-left","arrow-turn-down-left","arrow-turn-down-right","arrow-turn-left","arrow-turn-right","user-check","rotate-clock-left","magnifying-glass-plus","arrow-up-right","arrow-left","arrow-right","arrow-down","magnifying-glass","magnifying-glass-chart","layer-group","ellipsis-vertical","check","less than","greater than","less-than-equal","greater-than-equal","ellipsis","arrow-left-right","arrow-down-left-and-arrow-up-right-to-center","hexagon-image","arrow-right-arrow-left","dollar-sign","List view","grip-lines","circle-info","people-line","lock","sidebar","square-p","slider-new","sparkle  rewrite","calendar-week","triangle-exclamation","loader","thumbstack","delete-left","circle-small","unlock","share-nodes","link","gears","table","badge-percentage","mobile","comment-lines","camera","bars","arrow-up-from-bracket","pen","circle-1","circle-2","circle-3","circle-4","file","circle-half-stroke","calculator","medal","collapse-left","pen-sparkle","Bullhorn","clipboard-check","timer","collapse-right","Scissors","Scissors-sparkle","circle-video","pause-updated","circle","circle-dashed","map","alarm-clock","business-time","calendar-xmark","not equal","box-archive","stars","award","calendar","cloud-arrow-down","arrow-down-to-bracket","location-arrow","user","message-lines","database","user-gear","Sparkle","Text-size","change mood ai","phone-slash","Filled-circle","wand-magic","bars-filter","phone-xmark","forward","user-magnifying-glass","shuffle","key","alarm-exclamation","ai-lengthen","Ai shorten","sliders-simple","Percent","location-dot","angles-right","arrow-down-right","arrow-down-arrow-up","plus-small","minus","divide","equals","arrow-up-arrow-down","arrow left long to line","arrow right long to line","arrow-left-from-line","arrow-right-from-line","face-vomit","face-angry","face-dissapointed","face-smile","face-expressionless","do-not-enter","x-mark small","subscript","folder-user","down","paperclip-vertical","circle-phone-hangup","users","columns","file-arrow-down","file-pdf","ballot-check","shield-check","user-plus","trophy","suitcase","video","scroll","bolt","heart-pulse","books","phone","Clock-new","pen-to-box","table-list","calendar-edit","envelope","calendar-circle-user","volume","volume-slash","Superscript","rank","eye","eye-off","arrows-rotate","comments-question","grid-dots","new file x-mark","person-circle-plus","scale","internet","microphone-slash","question","arrow-up-right-from-square","filter","Paperclip","Phone-volume","input","calendar-pen","file-user","address-book","file-pen","bullhorn","notes","building","expand","arrows-maximize","hourglass","paper-plane","thumbs-up","address-card","bars-staggered","Arrow-rotate-left","item-icon","comment-questionmark","table-layout","paper-plane-side","shield","Toolbox","circle-phone","memo","Folder","arrow-up-right-and-arrow-down-left-from-center (2)","circle-play","Ban","triangle","file-arrow-up-2","glasses","replay","image map","brackets-curly","calendar-clock","buildings","Brain","download","message-exclamation","clone","groups","link-simple","message-question","arrow-progress","user-clock","upload","microphone","clipboard","hand","plus-minus","door-open","flip-horizontal","calendar-circle-plus","volume-slash","filter-settings-new","note","code-branch","file-arrow-up","headset","mobile-notch","users-viewfinder","calendar-lines","lock-a","circle-up","circle-down","user-group","wrench","stop","grid-2","circle-question","circle-check","circle-arrow-up","circle-arrow-down","circle-exclamation","arrow-up","eyedropper","circle-xmark","save","link-slash","arrow-right-from-bracket","location-crosshairs","arrow-rotate-right","star","envelope-dot","bug","envelope-open","chart-pie","envelope-open-text","file-csv","file-excel","file-invoice","cloud-check","file-powerpoint","file-contract","file-spreadsheet","file-word","filter-slash","file-pdf","square-dashed",
]

// Manual overrides for Figma names that don't match a regular/<name>.svg directly.
// Keys are normalized (lowercased, multiple spaces collapsed). Values are filenames in regular/ (without .svg).
const ALIAS = {
  "list view": "list",
  "less than": "less-than",
  "greater than": "greater-than",
  "not equal": "not-equal",
  "x-mark small": "xmark",
  "arrow left long to line": "left-long-to-line",
  "arrow right long to line": "right-long-to-line",
  "users-grp": "user-group",
  "rotate-clock-left": "clock-rotate-left",
  "sparkle rewrite": "sparkles",
  "sparkle": "sparkles",
  "users": "people-group",
  "users-viewfinder": "people-arrows",
  "groups": "users-rectangle",
  "filter-settings-new": "filter-circle-xmark",
  "slider-new": "slider",
  "file-arrow-up-2": "file-arrow-up",
  "lock-a": "lock-keyhole",
  "down": "arrow-down",
  "image map": "image",
  "filled-circle": "circle",
  "clock-new": "clock",
  "pause-updated": "pause",
  "new file x-mark": "file-xmark",
  "change mood ai": "face-smile",
  "ai-lengthen": "right-long",
  "ai shorten": "left-long",
  "internet": "globe-pointer",
  "arrow-up-right-and-arrow-down-left-from-center (2)": "arrow-up-right-and-arrow-down-left-from-center",
  "item-icon": "grip-dots",
  "people-line": "people-line",
  "notes-sticky": "note-sticky",
  "plus-sparkle": "plus",
  "arrow-left-right": "arrows-left-right",
  "thumbstack": "thumbtack",
  "badge-percentage": "badge-percent",
  "collapse-left": "arrow-left-to-line",
  "pen-sparkle": "pen-circle",
  "collapse-right": "arrow-right-to-line",
  "scissors-sparkle": "scissors",
  "plus-small": "plus-large",
  "face-dissapointed": "face-disappointed",
  "columns": "columns-3",
  "pen-to-box": "pen-circle",
  "calendar-edit": "calendar-pen",
  "rank": "ranking-star",
  "eye-off": "eye-slash",
  "grid-dots": "grid",
  "scale": "weight-scale",
  "input": "input-text",
  "comment-questionmark": "comment-question",
  "paper-plane-side": "paper-plane-top",
  "replay": "rotate-left",
  "flip-horizontal": "reflect-horizontal",
  "eyedropper": "eye-dropper",
  "save": "floppy-disk",
}

function slugify(figmaName) {
  return figmaName
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim()
}

// Convert a Figma name to a desired registry slug (kebab-case, valid identifier-friendly).
function toSlug(figmaName) {
  return figmaName
    .toLowerCase()
    .trim()
    .replace(/\s+\(.*?\)\s*$/, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

function findFile(figmaName) {
  const norm = slugify(figmaName)
  if (ALIAS[norm]) {
    const file = path.join(SRC_SVG_DIR, ALIAS[norm] + ".svg")
    if (fs.existsSync(file)) return file
  }
  // Try direct lowercased name
  const direct = path.join(SRC_SVG_DIR, norm.replace(/\s+/g, "-") + ".svg")
  if (fs.existsSync(direct)) return direct
  // Try removing "-new"/"-updated"/" rewrite" suffix
  const stripped = norm
    .replace(/\s+rewrite\b/g, "")
    .replace(/-new\b/g, "")
    .replace(/-updated\b/g, "")
    .replace(/\s*\(.*?\)\s*$/, "")
    .replace(/\s+/g, "-")
  const f2 = path.join(SRC_SVG_DIR, stripped + ".svg")
  if (fs.existsSync(f2)) return f2
  return null
}

// Convert raw SVG: replace hardcoded fills/strokes with currentColor, drop width/height.
function adaptSvg(svg) {
  let s = svg
  // Replace any fill="#xxx"/fill="rgb(...)" with currentColor (keep fill="none")
  s = s.replace(/fill="(?!none")[^"]+"/g, 'fill="currentColor"')
  // Replace stroke="#xxx" similarly (keep stroke="none")
  s = s.replace(/stroke="(?!none")[^"]+"/g, 'stroke="currentColor"')
  // Drop width/height attributes on the root <svg> so we can size via CSS
  s = s.replace(/<svg([^>]*)\swidth="[^"]*"/, "<svg$1")
  s = s.replace(/<svg([^>]*)\sheight="[^"]*"/, "<svg$1")
  // Ensure root <svg> has fill="currentColor" so the icon inherits text color
  if (!/<svg[^>]*\sfill=/.test(s)) {
    s = s.replace(/<svg/, '<svg fill="currentColor"')
  }
  // Strip the FontAwesome license comment to keep bundle small (license still respected via package metadata)
  s = s.replace(/<!--![^]*?-->/g, "")
  return s
}

fs.mkdirSync(OUT_SVG_DIR, { recursive: true })

const matched = []
const unmatched = []
const slugToName = new Map() // detect collisions
const seenSlugs = new Map()

for (const figmaName of FIGMA_NAMES) {
  const file = findFile(figmaName)
  if (!file) {
    unmatched.push(figmaName)
    continue
  }
  let slug = toSlug(figmaName)
  // Disambiguate duplicate slugs by appending numeric suffix
  if (seenSlugs.has(slug)) {
    const prev = seenSlugs.get(slug) + 1
    seenSlugs.set(slug, prev)
    slug = `${slug}-${prev}`
  } else {
    seenSlugs.set(slug, 1)
  }
  const dest = path.join(OUT_SVG_DIR, slug + ".svg")
  const raw = fs.readFileSync(file, "utf8")
  const adapted = adaptSvg(raw)
  fs.writeFileSync(dest, adapted)
  matched.push({ figmaName, slug, sourceFile: path.basename(file) })
}

// Emit names.ts
const namesTs = `// Auto-generated by scripts/build-icons.mjs — do not edit by hand.
export const ICON_NAMES = [
${matched.map((m) => `  ${JSON.stringify(m.slug)},`).join("\n")}
] as const

export type IconName = (typeof ICON_NAMES)[number]
`
fs.writeFileSync(OUT_NAMES, namesTs)

// Emit registry.ts — inline SVG strings directly so the registry is a single JS module.
// (Earlier we used `?raw` imports, but Storybook's dev middleware serves `.svg?raw`
// URLs as `image/svg+xml`, which the browser refuses to evaluate as JS.)
const registryTs = `// Auto-generated by scripts/build-icons.mjs — do not edit by hand.
import type { IconName } from "./names"

export const ICON_SVG: Record<IconName, string> = {
${matched
  .map((m) => {
    const svg = fs.readFileSync(path.join(OUT_SVG_DIR, m.slug + ".svg"), "utf8").trim()
    return `  ${JSON.stringify(m.slug)}: ${JSON.stringify(svg)},`
  })
  .join("\n")}
}
`
fs.writeFileSync(OUT_REGISTRY, registryTs)

console.log(`matched: ${matched.length}`)
console.log(`unmatched: ${unmatched.length}`)
if (unmatched.length) {
  console.log("--- unmatched names ---")
  for (const n of unmatched) console.log(`  ${JSON.stringify(n)}`)
}
