/**
 * Token build — Phase 2.
 *
 * Reads the Tokens Studio export under src/tokens/source/ and emits
 * src/tokens/dist/css/variables.css with three theme modes:
 *   - light  → @theme block (default; Tailwind v4 picks these up as utilities)
 *   - pink   → [data-theme="pink"]   override block
 *   - black  → [data-theme="black"]  override block
 *
 * Source structure:
 *   Global.json                       — shadows + typography globals (mode-less)
 *   Color Tokens/{Light,Pink,Black}.json — UI + Content colors, one file per mode
 *   Spacing Tokens/Mode 1.json        — spacing scale (mode-less)
 *
 * Naming: each Tokens Studio token may carry a Figma codeSyntax extension
 * (`$extensions["com.figma.codeSyntax"].Web = "var(--color-X)"`). When present
 * we use that name as the canonical CSS variable. Otherwise we synthesize
 * `--{prefix}-{kebab(key)}`.
 *
 * Run: npm run tokens:build
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs"
import { join } from "node:path"

const SOURCE_DIR = "src/tokens/source"
const OUT_PATH = "src/tokens/dist/css/variables.css"

const readJson = (p) => JSON.parse(readFileSync(p, "utf8"))

/** Extract the canonical CSS var name from a token's codeSyntax extension. */
function codeSyntaxVar(token) {
  const cs = token?.$extensions?.["com.figma.codeSyntax"]?.Web
  if (!cs) return null
  const m = cs.match(/var\((--[a-zA-Z0-9_-]+)\)/)
  return m ? m[1] : null
}

/** Stringify a Tokens Studio boxShadow value (object or array of objects) to CSS. */
function shadowToCss(value) {
  const one = (s) => {
    const inset = s.type === "innerShadow" ? "inset " : ""
    return `${inset}${s.x}px ${s.y}px ${s.blur}px ${s.spread}px ${s.color}`
  }
  return Array.isArray(value) ? value.map(one).join(", ") : one(value)
}

/** Convert a Tokens Studio token value to the string written into CSS. */
function valueToCss(token) {
  const v = token.$value
  switch (token.$type) {
    case "boxShadow":
      return shadowToCss(v)
    case "color":
    case "dimension":
    default:
      return String(v)
  }
}

/** Walk a Tokens Studio JSON tree, yielding [pathSegments[], token] for each leaf. */
function* walkTokens(obj, path = []) {
  if (obj && typeof obj === "object") {
    if ("$value" in obj) {
      yield [path, obj]
    } else {
      for (const [k, v] of Object.entries(obj)) {
        yield* walkTokens(v, [...path, k])
      }
    }
  }
}

/**
 * Decide the CSS var name for a token.
 * Priority: explicit codeSyntax → fallback synthesis from path.
 * Fallback synthesis collapses underscores/spaces and joins path with dashes.
 */
function varNameFor(token, path, prefix) {
  const explicit = codeSyntaxVar(token)
  if (explicit) return explicit
  const slug = path
    .filter((seg) => seg && seg !== "") // skip empty groups (Figma sometimes nests under "")
    .join("-")
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
  return `--${prefix}-${slug}`
}

/**
 * Read one of the three color mode files into a map of `varName → cssValue`.
 *
 * NOTE: We deliberately ignore each token's `codeSyntax` extension here. The
 * Figma file's codeSyntax is inconsistent — UI tokens lack the `--color-`
 * prefix (`var(--primary-color)`), Content Colors have it
 * (`var(--color-dark_purple)`), and at least one entry contains a typo
 * (`backdrop-color → var(--shareable-color)`). Instead, we synthesize a
 * consistent `--color-{token-key}` for every color, regardless of group.
 */
function readColorMode(file) {
  const tree = readJson(file)
  const map = new Map()
  for (const [path, token] of walkTokens(tree)) {
    if (token.$type !== "color") continue
    const key = path[path.length - 1]
    const name = `--color-${key}`
    // The Figma export self-references backdrop-color (`{Set.--backdrop-color}`),
    // which Tokens Studio leaves unresolved. Substitute the standard modal-
    // overlay value so the var still emits.
    if (typeof token.$value === "string" && token.$value.startsWith("{")) {
      if (key === "backdrop-color") {
        map.set(name, "rgba(0, 0, 0, 0.5)")
      }
      continue
    }
    map.set(name, valueToCss(token))
  }
  return map
}

/** Read mode-less sets (Global shadows + typography globals, Spacing). */
function readGlobal() {
  const tree = readJson(join(SOURCE_DIR, "Global.json"))
  const tokens = []
  // Shadows — derive friendly names, ignore unsupported types.
  const shadowNameMap = {
    XS: "--shadow-xs",
    Small: "--shadow-sm",
    Medium: "--shadow-md",
    Large: "--shadow-lg",
    "Click inner shadow": "--shadow-click-inner",
    "sticky-cell-box-shadow": "--shadow-sticky-cell",
  }
  const shadowGroup = tree.Shadow ?? {}
  // top-level entries
  for (const [k, v] of Object.entries(shadowGroup)) {
    if (k === "") {
      // nested under empty key (Tokens Studio quirk)
      for (const [kk, vv] of Object.entries(v)) {
        if (vv?.$type === "boxShadow") {
          const name = shadowNameMap[kk] ?? `--shadow-${kk.toLowerCase().replace(/[^a-z0-9-]+/g, "-")}`
          tokens.push([name, valueToCss(vv)])
        }
      }
    } else if (v?.$type === "boxShadow") {
      const name = shadowNameMap[k] ?? `--shadow-${k.toLowerCase().replace(/[^a-z0-9-]+/g, "-")}`
      tokens.push([name, valueToCss(v)])
    }
  }
  return tokens
}

/**
 * Resolve typography composites and font families from Global.json.
 *
 * Tokens Studio stores headings as composite `typography` tokens whose
 * fontFamily/fontSize/lineHeight are aliases (`{fontSize.5}`) into primitive
 * groups in the same file. We resolve those references and emit Tailwind v4
 * `--text-{slug}` + `--text-{slug}--line-height` pairs and `--font-*` family
 * vars. Only one weight variant per heading level is emitted (`Normal` if
 * present, else the first); fontSize/lineHeight are weight-invariant for the
 * heading levels in this file, so the choice is cosmetic.
 *
 * Numeric primitive values are pixels in the Figma export — divided by 16
 * to produce rem.
 */
function readTypography() {
  const tree = readJson(join(SOURCE_DIR, "Global.json"))
  const families = Object.fromEntries(
    Object.entries(tree.fontFamilies ?? {}).map(([k, v]) => [k, v.$value]),
  )
  const fontSize = Object.fromEntries(
    Object.entries(tree.fontSize ?? {}).map(([k, v]) => [k, v.$value]),
  )
  const lineHeights = Object.fromEntries(
    Object.entries(tree.lineHeights ?? {}).map(([k, v]) => [k, v.$value]),
  )
  const aliasRe = /^\{([^.]+)\.([^}]+)\}$/
  const resolve = (val, table) => {
    if (typeof val !== "string") return val
    const m = val.match(aliasRe)
    if (!m) return val
    return table[m[2]]
  }
  const pxToRem = (px) => `${Number(px) / 16}rem`

  const slugMap = {
    "H1 (32px)": "h1",
    "H2 (24px)": "h2",
    "H3 (18px)": "h3",
    "Text1 (16px)": "t1",
    "Text2 (14px)": "t2",
    "Text3 (12px)": "t3",
  }
  const tokens = []
  for (const [groupKey, slug] of Object.entries(slugMap)) {
    const group = tree[groupKey]
    if (!group) continue
    // Pick a canonical weight — Normal if available, else first composite found.
    const variantKey = "Normal" in group ? "Normal" : Object.keys(group).find((k) => group[k]?.$type === "typography")
    const variant = variantKey ? group[variantKey] : null
    if (!variant?.$value) continue
    const sizePx = resolve(variant.$value.fontSize, fontSize)
    const lhPx = resolve(variant.$value.lineHeight, lineHeights)
    if (sizePx != null) tokens.push([`--text-${slug}`, pxToRem(sizePx)])
    if (lhPx != null) tokens.push([`--text-${slug}--line-height`, pxToRem(lhPx)])
  }

  // Font family stacks. Heading uses Montserrat, body/sans use Karla.
  // Mono isn't in the Figma export — keep JetBrains Mono as a hardcoded stack.
  const heading = families.montserrat ?? "Montserrat"
  const body = families.karla ?? "Karla"
  tokens.push(["--font-heading", `${heading}, ui-sans-serif, system-ui, sans-serif`])
  tokens.push(["--font-body", `${body}, ui-sans-serif, system-ui, sans-serif`])
  tokens.push(["--font-sans", `${body}, ui-sans-serif, system-ui, sans-serif`])
  tokens.push(["--font-mono", "JetBrains Mono, ui-monospace, SFMono-Regular, monospace"])
  return tokens
}

/**
 * Read spacing scale. Emits two parallel sets:
 *   1. `--space-{px}` — Figma-authoritative names (`--space-16` = 1rem).
 *   2. `--spacing-{step}` — Tailwind v4 scale overrides so utilities like
 *      `p-2`, `gap-4` resolve through these tokens. Tailwind step = px / 4;
 *      values not divisible by 4 are skipped for the step set (kept under
 *      the px-based name only).
 */
function readSpacing() {
  const tree = readJson(join(SOURCE_DIR, "Spacing Tokens", "Mode 1.json"))
  const tokens = []
  for (const [path, token] of walkTokens(tree)) {
    if (token.$type !== "dimension" && token.$type !== "number") continue
    const cs = token.$extensions?.["com.figma.codeSyntax"]?.Web
    const m = cs?.match(/var\((--[a-zA-Z0-9_-]+)\)/)
    const name = m ? m[1] : `--${path.join("-")}`
    // Tokens Studio now emits spacing as { $type: "number", $value: 16 } where it
    // previously used "dimension" with "16px". Append px when the raw value lacks a unit.
    let value = valueToCss(token)
    if (token.$type === "number" && /^-?\d+(\.\d+)?$/.test(value)) value = `${value}px`
    tokens.push([name, value])
    // Mirror to Tailwind v4 spacing scale. Name is `--space-{N}` where N is px.
    const pxMatch = name.match(/^--space-(\d+)$/)
    if (pxMatch) {
      const px = Number(pxMatch[1])
      if (px % 4 === 0) tokens.push([`--spacing-${px / 4}`, value])
    }
  }
  return tokens
}

// ── Build ────────────────────────────────────────────────────────────────────

const light = readColorMode(join(SOURCE_DIR, "Color Tokens", "Light.json"))
const pink = readColorMode(join(SOURCE_DIR, "Color Tokens", "Pink.json"))
const black = readColorMode(join(SOURCE_DIR, "Color Tokens", "Black.json"))
const globalTokens = readGlobal() // shadows
const spacingTokens = readSpacing()
const typographyAndFonts = readTypography()

// ── Emit ─────────────────────────────────────────────────────────────────────

const lines = [
  "/**",
  " * Generated by scripts/build-tokens.mjs — do not edit by hand.",
  " * Source: src/tokens/source/ (Tokens Studio export from the Figma file)",
  " * Run `npm run tokens:build` to regenerate.",
  " */",
  "",
  "@theme {",
]

for (const [name, value] of typographyAndFonts) {
  lines.push(`  ${name}: ${value};`)
}
for (const [name, value] of [...light]) {
  lines.push(`  ${name}: ${value};`)
}
for (const [name, value] of globalTokens) {
  lines.push(`  ${name}: ${value};`)
}
for (const [name, value] of spacingTokens) {
  lines.push(`  ${name}: ${value};`)
}
lines.push("}")
lines.push("")

// Theme overrides — only emit colors that actually differ from light, to keep
// the override blocks small and the diff readable.
function emitOverrides(modeName, mode) {
  const overrides = []
  for (const [name, value] of mode) {
    if (light.get(name) !== value) overrides.push([name, value])
  }
  if (overrides.length === 0) return
  lines.push(`[data-theme="${modeName}"] {`)
  for (const [name, value] of overrides) {
    lines.push(`  ${name}: ${value};`)
  }
  lines.push("}")
  lines.push("")
}

emitOverrides("pink", pink)
emitOverrides("black", black)

mkdirSync("src/tokens/dist/css", { recursive: true })
writeFileSync(OUT_PATH, lines.join("\n"))
console.log(
  `✓ tokens built → ${OUT_PATH}\n` +
    `  light: ${light.size} colors · pink overrides: ${[...pink].filter(([k, v]) => light.get(k) !== v).length} · black overrides: ${[...black].filter(([k, v]) => light.get(k) !== v).length}\n` +
    `  shadows: ${globalTokens.length} · spacing: ${spacingTokens.length}`,
)
