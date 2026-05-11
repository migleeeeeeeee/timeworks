#!/usr/bin/env node
// Manual one-shot. Not wired into npm.
// Requires the Experiment file to be open in Figma Desktop and the
// figma-console MCP Desktop Bridge to be running.
//
// Modes:
//   --dry-run   Print what the script would do; no Figma I/O.
//   (default)   Walk the Experiment file via the figma-console MCP and
//               write component-map.json + icon-map.json.
//
// Implementation note: this script does NOT speak the MCP protocol
// itself. It prints instructions for the operator (or the calling
// agent) to feed into mcp__figma-console__figma_execute. Walks are
// chunked at <=200 nodes per call to stay under the 7s WebSocket
// budget. See SKILL.md Step 4 for the cursor pattern.

import { readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const SKILL_DIR = join(__dirname, "..", ".claude", "skills", "figma-page-to-library")
const CONFIG_PATH = join(SKILL_DIR, "ds-config.json")
const COMPONENT_MAP_PATH = join(SKILL_DIR, "component-map.json")
const ICON_MAP_PATH = join(SKILL_DIR, "icon-map.json")

// Anchors in the Experiment file. Update here if the file is restructured.
const ICON_LIBRARY_NODE_ID = "25336:96509"

function loadConfig() {
  const raw = readFileSync(CONFIG_PATH, "utf8")
  const cfg = JSON.parse(raw)
  if (!cfg.dsFileKey) {
    throw new Error(`ds-config.json missing dsFileKey`)
  }
  return cfg
}

function printPlan(cfg) {
  console.log(`DS file:           ${cfg.dsFileName}`)
  console.log(`DS fileKey:        ${cfg.dsFileKey}`)
  console.log(`Icon library node: ${ICON_LIBRARY_NODE_ID}`)
  console.log(``)
  console.log(`Steps the operator (or agent) must drive via figma-console MCP:`)
  console.log(`  1. mcp__figma-console__figma_get_status — confirm Desktop Bridge connected`)
  console.log(`  2. mcp__figma-console__figma_navigate to https://www.figma.com/design/${cfg.dsFileKey}/`)
  console.log(`  3. figma_execute: walk root.children, find component pages,`)
  console.log(`     collect every top-level COMPONENT and COMPONENT_SET as { name, id, key }.`)
  console.log(`     Chunk to <=200 nodes per call. Return [{ name, id, key }, ...].`)
  console.log(`  4. figma_execute: getNodeByIdAsync("${ICON_LIBRARY_NODE_ID}"), walk its`)
  console.log(`     COMPONENT children, collect { name, id, key }. Chunk likewise.`)
  console.log(`  5. Feed the two arrays back into this script via STDIN as JSON:`)
  console.log(`     { "components": [...], "icons": [...] }`)
  console.log(``)
  console.log(`Then re-run without --dry-run and pipe the JSON in on stdin:`)
  console.log(`  cat collected.json | node scripts/regen-figma-page-to-library-maps.mjs`)
}

function toMap(arr) {
  const out = {}
  for (const { name, id, key } of arr) {
    if (!name || !id) continue
    out[name] = { id, key: key ?? "" }
  }
  return out
}

function writeMaps(payload) {
  if (!payload || !Array.isArray(payload.components) || !Array.isArray(payload.icons)) {
    throw new Error(`stdin payload must be { components: [...], icons: [...] }`)
  }
  const componentMap = toMap(payload.components)
  const iconMap = toMap(payload.icons)
  writeFileSync(COMPONENT_MAP_PATH, JSON.stringify(componentMap, null, 2) + "\n")
  writeFileSync(ICON_MAP_PATH, JSON.stringify(iconMap, null, 2) + "\n")
  console.log(`Wrote ${Object.keys(componentMap).length} components to component-map.json`)
  console.log(`Wrote ${Object.keys(iconMap).length} icons to icon-map.json`)
}

function readStdin() {
  return new Promise((resolve, reject) => {
    let data = ""
    process.stdin.setEncoding("utf8")
    process.stdin.on("data", (chunk) => (data += chunk))
    process.stdin.on("end", () => {
      try {
        resolve(data.trim() ? JSON.parse(data) : null)
      } catch (err) {
        reject(err)
      }
    })
    process.stdin.on("error", reject)
  })
}

const cfg = loadConfig()
if (process.argv.includes("--dry-run")) {
  printPlan(cfg)
} else {
  const payload = await readStdin()
  if (!payload) {
    console.error(`No stdin payload received. Re-run with --dry-run to see how to collect one.`)
    process.exit(1)
  }
  writeMaps(payload)
}
