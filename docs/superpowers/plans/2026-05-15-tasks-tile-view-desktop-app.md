# Tasks Tile View Desktop App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Figma "Tasks tile view" frame (node `27521:263777`) as a runnable Tauri desktop app under `apps/tasks-tile-view/`, pixel-faithful, locally interactive over mock data, consuming the existing DS components from `src/components/` directly from source.

**Architecture:** New top-level folder `apps/tasks-tile-view/` with its own `package.json`. A Vite path alias `@ds → ../../src` lets the app import DS components as `@ds/components/Button`. Tauri wraps the Vite dev server in a native window. No npm workspaces; the DS library at the repo root is untouched.

**Tech Stack:** Tauri 2.x (Rust), Vite 6, React 18, TypeScript 5.7, Tailwind v4 (`@tailwindcss/vite`), `@tauri-apps/api`, `@tauri-apps/cli`. Reuses DS components: `Tabs`, `Avatar`, `Button`, `IconButton`, `Search`, `Breadcrumb`, `Chip`, `LinearProgressBar`, `AvatarGroup`, `Icon`, `Modal`, `ButtonGroup`.

**Spec:** `docs/superpowers/specs/2026-05-15-tasks-tile-view-desktop-app-design.md`
**Branch:** `tasks-tile-view-desktop-app` (already created)

---

## File map

Files this plan creates (all under `apps/tasks-tile-view/` unless noted):

```
apps/tasks-tile-view/
├── .gitignore
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── index.html
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── styles.css
│   ├── types.ts
│   ├── data/mock.ts
│   ├── state/AppState.ts        # tiny hook owning all page state
│   └── components/
│       ├── TopBar.tsx
│       ├── WindowChrome.tsx
│       ├── Sidebar.tsx
│       ├── TaskTimerCard.tsx
│       ├── ProjectsCard.tsx
│       ├── ProjectListItem.tsx
│       ├── ViewSwitcher.tsx
│       ├── MainContent.tsx
│       ├── PageHeader.tsx
│       ├── PageToolbar.tsx
│       ├── TaskTilesGrid.tsx
│       ├── TaskTile.tsx
│       └── TaskDetailModal.tsx
└── src-tauri/
    ├── .gitignore
    ├── Cargo.toml
    ├── build.rs
    ├── tauri.conf.json
    ├── icons/                   # placeholder icons copied from Tauri template
    └── src/main.rs
```

Files this plan modifies: **none** in `src/`. The DS library stays byte-for-byte unchanged.

---

## Task 0: Preflight — install Rust + Tauri CLI

The user has confirmed the Rust toolchain is not installed yet. This task is a manual checkpoint, not automated.

**Files:** none.

- [ ] **Step 1: Install Rust via rustup**

Run:
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
source "$HOME/.cargo/env"
```

Expected: prints `Rust is installed now. Great!`

- [ ] **Step 2: Verify Rust install**

Run: `rustc --version && cargo --version`
Expected: both print versions (rustc ≥ 1.77, cargo matching).

- [ ] **Step 3: Install Tauri CLI as a cargo binary**

Run: `cargo install tauri-cli --version "^2.0" --locked`
Expected: builds + installs `cargo-tauri` to `~/.cargo/bin/`. Takes ~5 min.

- [ ] **Step 4: Verify Tauri CLI**

Run: `cargo tauri --version`
Expected: prints `tauri-cli 2.x.x`.

- [ ] **Step 5: macOS Xcode CLT check (Tauri uses WebKit)**

Run: `xcode-select -p`
Expected: prints a path like `/Library/Developer/CommandLineTools`. If it errors, run `xcode-select --install` and wait for the GUI installer to finish before proceeding.

No commit — this task installs system tools only.

---

## Task 1: Scaffold app folder + package.json + .gitignore

**Files:**
- Create: `apps/tasks-tile-view/.gitignore`
- Create: `apps/tasks-tile-view/package.json`

- [ ] **Step 1: Create the .gitignore**

Write `apps/tasks-tile-view/.gitignore`:
```
node_modules
dist
.DS_Store
src-tauri/target
```

- [ ] **Step 2: Create package.json**

Write `apps/tasks-tile-view/package.json`:
```json
{
  "name": "tasks-tile-view",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "tauri": "tauri"
  },
  "dependencies": {
    "@radix-ui/react-dialog": "^1.1.6",
    "@radix-ui/react-tabs": "^1.1.3",
    "@radix-ui/react-tooltip": "^1.1.8",
    "@tauri-apps/api": "^2.0.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^0.469.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "tailwind-merge": "^2.6.0"
  },
  "devDependencies": {
    "@tauri-apps/cli": "^2.0.0",
    "@tailwindcss/vite": "^4.0.0",
    "@types/react": "^18.3.18",
    "@types/react-dom": "^18.3.5",
    "@vitejs/plugin-react": "^4.3.4",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.7.2",
    "vite": "^6.0.5"
  }
}
```

> Notes for the engineer: versions mirror the root `package.json` for shared libs so the DS components compile identically here. `@radix-ui/react-tabs` is added (not present at root) — Tabs in the DS uses it; double-check the imports in `src/components/Tabs/Tabs.tsx` before installing to confirm.

- [ ] **Step 3: Install**

Run:
```bash
cd apps/tasks-tile-view
npm install
```
Expected: `node_modules/` populated, no peer-dep errors. If a Radix peer warning appears for a primitive the DS uses but this app didn't list, add it to `dependencies` and re-install.

- [ ] **Step 4: Commit**

```bash
cd /Users/MiggleWork/Downloads/Timeworks
git add apps/tasks-tile-view/.gitignore apps/tasks-tile-view/package.json apps/tasks-tile-view/package-lock.json
git commit -m "feat(tasks-tile-view): scaffold app folder + deps"
```

---

## Task 2: TypeScript + Vite + Tailwind config

**Files:**
- Create: `apps/tasks-tile-view/tsconfig.json`
- Create: `apps/tasks-tile-view/tsconfig.node.json`
- Create: `apps/tasks-tile-view/vite.config.ts`
- Create: `apps/tasks-tile-view/index.html`
- Create: `apps/tasks-tile-view/src/styles.css`

- [ ] **Step 1: tsconfig.json**

Write `apps/tasks-tile-view/tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": false,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "jsx": "react-jsx",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "baseUrl": ".",
    "paths": {
      "@ds/*": ["../../src/*"]
    }
  },
  "include": ["src", "../../src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

> `include: ["../../src"]` lets the TS compiler resolve types from the DS source. The DS components use relative imports like `../../lib/cn`, which Vite resolves correctly via the alias because files are read from their real on-disk location.

- [ ] **Step 2: tsconfig.node.json**

Write `apps/tasks-tile-view/tsconfig.node.json`:
```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 3: vite.config.ts**

Write `apps/tasks-tile-view/vite.config.ts`:
```ts
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import path from "node:path"

// Tauri expects a fixed port + no obfuscation of the renderer URL.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@ds": path.resolve(__dirname, "../../src"),
    },
  },
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
  },
})
```

- [ ] **Step 4: index.html**

Write `apps/tasks-tile-view/index.html`:
```html
<!doctype html>
<html lang="en" data-theme="light">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Tasks Tile View</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 5: styles.css (Tailwind entry + DS tokens + fonts)**

Write `apps/tasks-tile-view/src/styles.css`:
```css
/*
 * App entry CSS. Imports Tailwind v4 + the DS token theme so all
 * --color-*, --space-*, --shadow-*, --text-* CSS variables resolve.
 * Mirrors src/index.css at the repo root; do not invent new tokens here.
 */

@import url("https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Karla:wght@400;500;600;700&family=Montserrat:wght@300;400;500;600;700&display=swap");
@import "tailwindcss";
@import "../../../src/tokens/dist/css/variables.css";

html,
body,
#root {
  height: 100%;
  margin: 0;
  font-family: var(--font-body);
  background: transparent;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 6: Commit**

```bash
git add apps/tasks-tile-view/tsconfig.json apps/tasks-tile-view/tsconfig.node.json apps/tasks-tile-view/vite.config.ts apps/tasks-tile-view/index.html apps/tasks-tile-view/src/styles.css
git commit -m "feat(tasks-tile-view): TS, Vite, Tailwind, and HTML entry"
```

---

## Task 3: React entry + smoke test

**Files:**
- Create: `apps/tasks-tile-view/src/main.tsx`
- Create: `apps/tasks-tile-view/src/App.tsx` (temporary skeleton; replaced in Task 14)

- [ ] **Step 1: main.tsx**

Write `apps/tasks-tile-view/src/main.tsx`:
```tsx
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { App } from "./App"
import "./styles.css"

const root = document.getElementById("root")
if (!root) throw new Error("Missing #root")

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- [ ] **Step 2: App.tsx skeleton**

Write `apps/tasks-tile-view/src/App.tsx`:
```tsx
export function App() {
  return (
    <div className="flex h-screen items-center justify-center bg-[var(--color-primary-background-color)] text-[var(--color-primary-text-color)]">
      Tasks tile view — scaffold ready
    </div>
  )
}
```

- [ ] **Step 3: Run Vite dev server**

Run:
```bash
cd apps/tasks-tile-view
npm run dev
```
Expected: starts on `http://localhost:1420`. Open it in a browser and confirm the centred message renders against the light primary-background color from the DS tokens. Stop with Ctrl-C.

- [ ] **Step 4: Commit**

```bash
git add apps/tasks-tile-view/src/main.tsx apps/tasks-tile-view/src/App.tsx
git commit -m "feat(tasks-tile-view): React entry boots against DS tokens"
```

---

## Task 4: Tauri shell

**Files:**
- Create: `apps/tasks-tile-view/src-tauri/.gitignore`
- Create: `apps/tasks-tile-view/src-tauri/Cargo.toml`
- Create: `apps/tasks-tile-view/src-tauri/build.rs`
- Create: `apps/tasks-tile-view/src-tauri/tauri.conf.json`
- Create: `apps/tasks-tile-view/src-tauri/src/main.rs`
- Copy: `apps/tasks-tile-view/src-tauri/icons/*` (from Tauri template)

- [ ] **Step 1: .gitignore for the Rust crate**

Write `apps/tasks-tile-view/src-tauri/.gitignore`:
```
target/
```

- [ ] **Step 2: Cargo.toml**

Write `apps/tasks-tile-view/src-tauri/Cargo.toml`:
```toml
[package]
name = "tasks-tile-view"
version = "0.0.0"
description = "TimeWorks Tasks Tile View desktop app"
authors = ["TimeWorks"]
edition = "2021"

[lib]
name = "tasks_tile_view_lib"
crate-type = ["staticlib", "cdylib", "rlib"]

[build-dependencies]
tauri-build = { version = "2", features = [] }

[dependencies]
tauri = { version = "2", features = [] }
serde = { version = "1", features = ["derive"] }
serde_json = "1"

[profile.release]
panic = "abort"
codegen-units = 1
lto = true
opt-level = "s"
strip = true
```

- [ ] **Step 3: build.rs**

Write `apps/tasks-tile-view/src-tauri/build.rs`:
```rust
fn main() {
    tauri_build::build()
}
```

- [ ] **Step 4: src/main.rs**

Write `apps/tasks-tile-view/src-tauri/src/main.rs`:
```rust
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

- [ ] **Step 5: tauri.conf.json**

Write `apps/tasks-tile-view/src-tauri/tauri.conf.json`:
```json
{
  "$schema": "https://schema.tauri.app/config/2",
  "productName": "Tasks Tile View",
  "version": "0.0.0",
  "identifier": "com.timeworks.tasks-tile-view",
  "build": {
    "beforeDevCommand": "npm run dev",
    "beforeBuildCommand": "npm run build",
    "devUrl": "http://localhost:1420",
    "frontendDist": "../dist"
  },
  "app": {
    "windows": [
      {
        "title": "Tasks Tile View",
        "width": 1400,
        "height": 925,
        "resizable": true,
        "fullscreen": false,
        "decorations": true
      }
    ],
    "security": {
      "csp": null
    }
  },
  "bundle": {
    "active": false,
    "targets": "all",
    "icon": [
      "icons/32x32.png",
      "icons/128x128.png",
      "icons/128x128@2x.png",
      "icons/icon.icns",
      "icons/icon.ico"
    ]
  }
}
```

- [ ] **Step 6: Generate placeholder icons**

Tauri requires icon files even when `bundle.active = false`. Run:
```bash
cd apps/tasks-tile-view/src-tauri
mkdir -p icons
# Generate a 1024x1024 violet square as the source, then derive the rest.
cargo tauri icon --help >/dev/null 2>&1 || true
# Simplest: borrow the template icons.
curl -L https://github.com/tauri-apps/tauri/raw/dev/examples/api/src-tauri/icons/icon.png -o icons/icon.png
cargo tauri icon icons/icon.png
```
Expected: `icons/` populated with `32x32.png`, `128x128.png`, `128x128@2x.png`, `icon.icns`, `icon.ico`.

> If `cargo tauri icon` fails (e.g. ImageMagick missing), substitute any 1024×1024 PNG and re-run. Bundling is disabled, so icon fidelity does not matter for v1.

- [ ] **Step 7: Boot the native window**

Run:
```bash
cd apps/tasks-tile-view
cargo tauri dev
```
Expected: Rust compiles (~3 min first time), Vite spins up, a native 1400×925 window opens showing the same "scaffold ready" text from Task 3. Quit the window.

- [ ] **Step 8: Commit**

```bash
git add apps/tasks-tile-view/src-tauri
git commit -m "feat(tasks-tile-view): Tauri shell wrapping the Vite renderer"
```

---

## Task 5: Types + mock data

**Files:**
- Create: `apps/tasks-tile-view/src/types.ts`
- Create: `apps/tasks-tile-view/src/data/mock.ts`

- [ ] **Step 1: types.ts**

Write `apps/tasks-tile-view/src/types.ts`:
```ts
export type Assignee = {
  id: string
  name: string
  avatarUrl?: string
}

export type Project = {
  id: string
  name: string
  timeSpent: string  // "HH:MM" — pre-formatted, sidebar displays verbatim
}

export type TaskStatus = "open" | "in_progress" | "blocked" | "done"

export type TaskPriority = "low" | "medium" | "high"

export type Task = {
  id: string
  title: string
  status: TaskStatus
  projectId: string
  timeAllocated: string   // "HH:MM:SS"
  timeSpent: string       // "HH:MM:SS"
  subtasksDone: number
  subtasksTotal: number
  responsible: Assignee
  members: Assignee[]     // first three render; extras roll into "+N"
  priority: TaskPriority
}

export type TimerState = {
  currentTaskId: string
  isRunning: boolean
  elapsedSeconds: number
}

export type View = "timeworks" | "chatworks"
```

- [ ] **Step 2: mock.ts**

Write `apps/tasks-tile-view/src/data/mock.ts`:
```ts
/*
 * Mock data populating the page. Strings for the first tile, breadcrumbs,
 * tabs, sidebar header, etc. are lifted verbatim from the Figma source
 * (file gqYWCu1K6dJ9gESXtgNeCi, node 27521:263777). The other 11 tiles
 * follow the same shape with plausible variations to demonstrate the layout.
 */

import type { Assignee, Project, Task } from "../types"

const AVATAR = (seed: string): string =>
  `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(seed)}`

const PEOPLE: Assignee[] = [
  { id: "u1", name: "Aria Patel", avatarUrl: AVATAR("Aria") },
  { id: "u2", name: "Ben Carter", avatarUrl: AVATAR("Ben") },
  { id: "u3", name: "Casey Lin", avatarUrl: AVATAR("Casey") },
  { id: "u4", name: "Dani Vega", avatarUrl: AVATAR("Dani") },
  { id: "u5", name: "Eli Romero", avatarUrl: AVATAR("Eli") },
  { id: "u6", name: "Frey Olsen", avatarUrl: AVATAR("Frey") },
]

export const projects: Project[] = [
  { id: "p1", name: "EverTech", timeSpent: "01:22" },
  { id: "p2", name: "NorthPeak", timeSpent: "00:48" },
  { id: "p3", name: "Helios", timeSpent: "02:05" },
  { id: "p4", name: "BlueRiver", timeSpent: "00:13" },
  { id: "p5", name: "Magnolia", timeSpent: "00:00" },
]

const mk = (
  i: number,
  partial: Partial<Task> & Pick<Task, "title" | "projectId" | "status">,
): Task => ({
  id: `t${i}`,
  timeAllocated: "05:30:00",
  timeSpent: "03:32:00",
  subtasksDone: 8,
  subtasksTotal: 16,
  responsible: PEOPLE[i % PEOPLE.length]!,
  members: PEOPLE.slice(0, 3),
  priority: "medium",
  ...partial,
})

export const tasks: Task[] = [
  mk(1, { title: "Tasks Name", projectId: "p1", status: "in_progress" }),
  mk(2, { title: "Audit landing copy", projectId: "p1", status: "open" }),
  mk(3, { title: "Wire payment retry", projectId: "p2", status: "in_progress" }),
  mk(4, { title: "Migrate onboarding flow", projectId: "p3", status: "blocked" }),
  mk(5, { title: "Refactor billing service", projectId: "p2", status: "in_progress" }),
  mk(6, { title: "Q3 hiring plan", projectId: "p4", status: "done" }),
  mk(7, { title: "Customer interview synthesis", projectId: "p3", status: "in_progress" }),
  mk(8, { title: "Renew TLS certs", projectId: "p1", status: "open" }),
  mk(9, { title: "Design review: settings", projectId: "p5", status: "in_progress" }),
  mk(10, { title: "Backfill analytics events", projectId: "p2", status: "in_progress" }),
  mk(11, { title: "Mobile push payload audit", projectId: "p4", status: "open" }),
  mk(12, { title: "Annual access review", projectId: "p3", status: "in_progress" }),
]

export const initialTimer = {
  currentTaskId: tasks[0]!.id,
  isRunning: false,
  elapsedSeconds: 3 * 3600 + 32 * 60, // matches "03:32:00" from the Figma source
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/tasks-tile-view/src/types.ts apps/tasks-tile-view/src/data/mock.ts
git commit -m "feat(tasks-tile-view): types + mock tasks/projects/timer"
```

---

## Task 6: AppState hook

A single hook owns all page state. Components receive props; no context, no global store.

**Files:**
- Create: `apps/tasks-tile-view/src/state/AppState.ts`

- [ ] **Step 1: AppState.ts**

Write `apps/tasks-tile-view/src/state/AppState.ts`:
```ts
import { useEffect, useMemo, useRef, useState } from "react"
import type { Task, TimerState, View } from "../types"
import { initialTimer, tasks as allTasks } from "../data/mock"

export type AppState = {
  view: View
  setView: (v: View) => void

  searchQuery: string
  setSearchQuery: (q: string) => void

  selectedProjectId: string | null
  setSelectedProjectId: (id: string | null) => void

  compact: boolean
  setCompact: (v: boolean) => void

  selectedTaskId: string | null
  openTask: (id: string) => void
  closeTask: () => void

  timer: TimerState
  toggleTimer: () => void

  /** Tasks filtered by view + search + project selection. */
  filteredTasks: Task[]
}

export function useAppState(): AppState {
  const [view, setView] = useState<View>("timeworks")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [compact, setCompact] = useState(false)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [timer, setTimer] = useState<TimerState>(initialTimer)

  // Tick the timer once per second while running. StrictMode-safe: effect runs
  // twice on mount in dev; the interval is cleaned up before the second run.
  const tickRef = useRef<number | null>(null)
  useEffect(() => {
    if (!timer.isRunning) return
    tickRef.current = window.setInterval(() => {
      setTimer((t) => ({ ...t, elapsedSeconds: t.elapsedSeconds + 1 }))
    }, 1000)
    return () => {
      if (tickRef.current != null) window.clearInterval(tickRef.current)
    }
  }, [timer.isRunning])

  const filteredTasks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return allTasks.filter((t) => {
      if (view === "chatworks") return false // demo: the other tab is empty
      if (selectedProjectId && t.projectId !== selectedProjectId) return false
      if (q && !t.title.toLowerCase().includes(q)) return false
      return true
    })
  }, [view, searchQuery, selectedProjectId])

  return {
    view,
    setView,
    searchQuery,
    setSearchQuery,
    selectedProjectId,
    setSelectedProjectId,
    compact,
    setCompact,
    selectedTaskId,
    openTask: (id) => setSelectedTaskId(id),
    closeTask: () => setSelectedTaskId(null),
    timer,
    toggleTimer: () => setTimer((t) => ({ ...t, isRunning: !t.isRunning })),
    filteredTasks,
  }
}

export function formatElapsed(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${pad(h)}:${pad(m)}:${pad(s)}`
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/tasks-tile-view/src/state/AppState.ts
git commit -m "feat(tasks-tile-view): useAppState hook owning all page state"
```

---

## Task 7: WindowChrome + TopBar

The Figma top bar (1400 × 41) has tabs on the left and avatar + a static three-glyph window-chrome row on the right. The real OS minimize/maximize/close come from Tauri's native title bar; the Figma glyphs are decorative.

**Files:**
- Create: `apps/tasks-tile-view/src/components/WindowChrome.tsx`
- Create: `apps/tasks-tile-view/src/components/TopBar.tsx`

- [ ] **Step 1: WindowChrome.tsx**

Write `apps/tasks-tile-view/src/components/WindowChrome.tsx`:
```tsx
import { Icon } from "@ds/components/Icon"

/**
 * Decorative three-glyph row from the Figma. The real window controls
 * come from the Tauri native title bar; this exists to match the design.
 */
export function WindowChrome() {
  return (
    <div className="flex items-center gap-3 text-[var(--color-icon-color)]">
      <Icon name="minus" size="sm" />
      <Icon name="x" size="sm" />
      <Icon name="square" size="sm" />
    </div>
  )
}
```

> Verify that `minus`, `x`, and `square` exist in `src/icons/names.ts`. If a name differs (e.g. `close` instead of `x`), substitute. Do not invent icon names.

- [ ] **Step 2: TopBar.tsx**

Write `apps/tasks-tile-view/src/components/TopBar.tsx`:
```tsx
import { Tabs, TabsList, TabsTrigger } from "@ds/components/Tabs"
import { Avatar } from "@ds/components/Avatar"
import { WindowChrome } from "./WindowChrome"
import type { View } from "../types"

type Props = {
  view: View
  onViewChange: (v: View) => void
}

export function TopBar({ view, onViewChange }: Props) {
  return (
    <div className="flex h-[41px] items-center justify-between px-6">
      <Tabs value={view} onValueChange={(v) => onViewChange(v as View)}>
        <TabsList>
          <TabsTrigger value="timeworks">TimeWorks</TabsTrigger>
          <TabsTrigger value="chatworks">ChatWorks</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="flex items-center gap-6">
        <Avatar
          size="md"
          src="https://api.dicebear.com/9.x/avataaars/svg?seed=Owner"
          alt="Owner"
        />
        <WindowChrome />
      </div>
    </div>
  )
}
```

> The DS `Tabs` API may export different sub-component names. Open `src/components/Tabs/Tabs.tsx` and `src/components/Tabs/index.ts` to confirm before relying on `TabsList`/`TabsTrigger`. If the DS uses a single `Tabs` with an `items` prop, adapt accordingly.

- [ ] **Step 3: Commit**

```bash
git add apps/tasks-tile-view/src/components/WindowChrome.tsx apps/tasks-tile-view/src/components/TopBar.tsx
git commit -m "feat(tasks-tile-view): TopBar with Tabs, Avatar, WindowChrome"
```

---

## Task 8: ProjectListItem + ProjectsCard

**Figma source (node `27521:263809`):** pill-shaped row, padding 10/12, gap 12, pill radius 35, fill `secondary-background-color` @ 50% opacity, stroke `layout-border-color` @ 18% opacity. Contents: project name (Karla SemiBold 16/22, `primary-text-color`), time (Karla SemiBold 14/20, `secondary-text-color`), expand chevron IconButton (Size=sm, icon `chevron-down`).

**Files:**
- Create: `apps/tasks-tile-view/src/components/ProjectListItem.tsx`
- Create: `apps/tasks-tile-view/src/components/ProjectsCard.tsx`

- [ ] **Step 1: ProjectListItem.tsx**

Write `apps/tasks-tile-view/src/components/ProjectListItem.tsx`:
```tsx
import { IconButton } from "@ds/components/IconButton"
import type { Project } from "../types"
import { cn } from "@ds/lib/cn"

type Props = {
  project: Project
  selected?: boolean
  onClick?: () => void
}

export function ProjectListItem({ project, selected, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-[35px] px-3 py-[10px]",
        "border border-[var(--color-layout-border-color)]/[0.18]",
        "bg-[var(--color-secondary-background-color)]/50",
        "text-left transition-colors",
        "hover:bg-[var(--color-secondary-background-color)]",
        "focus-visible:outline-2 focus-visible:outline-[var(--color-primary-color)]",
        selected && "border-[var(--color-primary-color)] bg-[var(--color-secondary-background-color)]",
      )}
    >
      <span className="flex flex-1 items-center gap-3">
        <span className="flex-1 text-t1 font-semibold text-[var(--color-primary-text-color)]">
          {project.name}
        </span>
        <span className="text-t2 font-semibold text-[var(--color-secondary-text-color)]">
          {project.timeSpent}
        </span>
      </span>
      <IconButton
        size="sm"
        kind="tertiary"
        icon="chevron-down"
        aria-label={`Expand ${project.name}`}
      />
    </button>
  )
}
```

> Confirm the DS `IconButton` prop names by reading `src/components/IconButton/IconButton.tsx`. Likely props: `size`, `kind`, `icon` (icon name), plus standard HTML attributes. If `kind` is `variant`, rename accordingly. Same for the `Chip` and `Button` imports later — read the actual props before guessing.

- [ ] **Step 2: ProjectsCard.tsx**

Write `apps/tasks-tile-view/src/components/ProjectsCard.tsx`:
```tsx
import { Search } from "@ds/components/Search"
import { ProjectListItem } from "./ProjectListItem"
import type { Project } from "../types"

type Props = {
  projects: Project[]
  searchQuery: string
  onSearchChange: (q: string) => void
  selectedProjectId: string | null
  onSelectProject: (id: string | null) => void
}

export function ProjectsCard({
  projects,
  searchQuery,
  onSearchChange,
  selectedProjectId,
  onSelectProject,
}: Props) {
  return (
    <section className="flex flex-1 flex-col gap-4 rounded-2xl border border-[var(--color-layout-border-color)] bg-[var(--color-secondary-background-color)] p-4">
      <header>
        <h2 className="text-t1 font-semibold text-[var(--color-primary-text-color)]">Today</h2>
      </header>
      <Search
        size="md"
        value={searchQuery}
        onValueChange={onSearchChange}
        placeholder="Find a task or project"
      />
      <ul className="flex flex-col gap-2 overflow-y-auto">
        {projects.map((p) => (
          <li key={p.id}>
            <ProjectListItem
              project={p}
              selected={p.id === selectedProjectId}
              onClick={() =>
                onSelectProject(p.id === selectedProjectId ? null : p.id)
              }
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/tasks-tile-view/src/components/ProjectListItem.tsx apps/tasks-tile-view/src/components/ProjectsCard.tsx
git commit -m "feat(tasks-tile-view): ProjectsCard with search + selectable rows"
```

---

## Task 9: TaskTimerCard

**Figma source (sidebar top, 310 × 157):** big circular play button (62×62), current task title + elapsed time, divider, mode toggle row with two `Button`s (one Primary, one Secondary/Small/Icon-Left), an animated SVG ring around the card border that sweeps while running.

**Files:**
- Create: `apps/tasks-tile-view/src/components/TaskTimerCard.tsx`

- [ ] **Step 1: TaskTimerCard.tsx**

Write `apps/tasks-tile-view/src/components/TaskTimerCard.tsx`:
```tsx
import { Button } from "@ds/components/Button"
import { Icon } from "@ds/components/Icon"
import { formatElapsed } from "../state/AppState"
import type { Task, TimerState } from "../types"

type Props = {
  task: Task
  timer: TimerState
  onToggle: () => void
}

export function TaskTimerCard({ task, timer, onToggle }: Props) {
  return (
    <section className="relative rounded-2xl border border-[var(--color-layout-border-color)] bg-[var(--color-secondary-background-color)] p-4">
      {/* Sweep ring — animates only while running */}
      {timer.isRunning && (
        <svg
          className="pointer-events-none absolute inset-0"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <rect
            x="1"
            y="1"
            width="98"
            height="98"
            rx="6"
            fill="none"
            stroke="var(--color-primary-color)"
            strokeWidth="2"
            strokeDasharray="392"
            strokeDashoffset="0"
            style={{
              animation: "ttv-sweep 60s linear infinite",
            }}
          />
        </svg>
      )}
      <style>{`
        @keyframes ttv-sweep {
          from { stroke-dashoffset: 392; }
          to { stroke-dashoffset: 0; }
        }
      `}</style>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onToggle}
          aria-label={timer.isRunning ? "Pause timer" : "Start timer"}
          className="flex h-[62px] w-[62px] items-center justify-center rounded-full bg-[var(--color-primary-color)] text-[var(--color-text-color-on-primary)] transition-colors hover:bg-[var(--color-primary-hover-color)] focus-visible:outline-2 focus-visible:outline-[var(--color-primary-color)]"
        >
          <Icon name={timer.isRunning ? "pause" : "play"} size="md" />
        </button>
        <div className="flex flex-1 flex-col">
          <span className="text-t1 font-semibold text-[var(--color-primary-text-color)]">
            {task.title}
          </span>
          <span className="text-t2 font-mono text-[var(--color-secondary-text-color)]">
            {formatElapsed(timer.elapsedSeconds)}
          </span>
        </div>
      </div>

      <hr className="my-3 border-t border-[var(--color-ui-border-color)]" />

      <div className="flex items-center gap-2">
        <Button variant="primary" size="sm">Working</Button>
        <Button variant="secondary" size="sm" iconLeft="globe">Portal View</Button>
      </div>
    </section>
  )
}
```

> Confirm DS `Button` accepts `iconLeft` (or it might be `leftIcon` / `icon`). Open `src/components/Button/Button.tsx`. Adjust the prop name to match.

- [ ] **Step 2: Commit**

```bash
git add apps/tasks-tile-view/src/components/TaskTimerCard.tsx
git commit -m "feat(tasks-tile-view): TaskTimerCard with play/pause + sweep ring"
```

---

## Task 10: ViewSwitcher + Sidebar

**Files:**
- Create: `apps/tasks-tile-view/src/components/ViewSwitcher.tsx`
- Create: `apps/tasks-tile-view/src/components/Sidebar.tsx`

- [ ] **Step 1: ViewSwitcher.tsx**

Write `apps/tasks-tile-view/src/components/ViewSwitcher.tsx`:
```tsx
import { IconButton } from "@ds/components/IconButton"

type Props = {
  compact: boolean
  onToggleCompact: () => void
}

export function ViewSwitcher({ compact, onToggleCompact }: Props) {
  return (
    <div className="flex items-center justify-center gap-3 py-2">
      <IconButton
        size="xs"
        kind="tertiary"
        icon="clock"
        aria-label="Timer-only view"
      />
      <IconButton
        size="xs"
        kind="tertiary"
        icon={compact ? "chevrons-right" : "chevrons-left"}
        aria-label={compact ? "Expand sidebar" : "Collapse sidebar"}
        onClick={onToggleCompact}
      />
    </div>
  )
}
```

- [ ] **Step 2: Sidebar.tsx**

Write `apps/tasks-tile-view/src/components/Sidebar.tsx`:
```tsx
import { ProjectsCard } from "./ProjectsCard"
import { TaskTimerCard } from "./TaskTimerCard"
import { ViewSwitcher } from "./ViewSwitcher"
import type { Project, Task, TimerState } from "../types"

type Props = {
  currentTask: Task
  timer: TimerState
  onToggleTimer: () => void
  projects: Project[]
  searchQuery: string
  onSearchChange: (q: string) => void
  selectedProjectId: string | null
  onSelectProject: (id: string | null) => void
  compact: boolean
  onToggleCompact: () => void
}

export function Sidebar(props: Props) {
  return (
    <aside className="flex w-[310px] flex-col gap-4 p-4">
      <TaskTimerCard
        task={props.currentTask}
        timer={props.timer}
        onToggle={props.onToggleTimer}
      />
      <ProjectsCard
        projects={props.projects}
        searchQuery={props.searchQuery}
        onSearchChange={props.onSearchChange}
        selectedProjectId={props.selectedProjectId}
        onSelectProject={props.onSelectProject}
      />
      <ViewSwitcher
        compact={props.compact}
        onToggleCompact={props.onToggleCompact}
      />
    </aside>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/tasks-tile-view/src/components/ViewSwitcher.tsx apps/tasks-tile-view/src/components/Sidebar.tsx
git commit -m "feat(tasks-tile-view): Sidebar composed of timer + projects + switcher"
```

---

## Task 11: PageHeader + PageToolbar

**Figma source (node `27521:263873`):**
- Title row (1005 × 32): H1 "Tasks" (Montserrat Bold 24/30), right-aligned cluster of two buttons — "Portal View" (Secondary, icon-left) + "Create new Task" (Primary, icon-left).
- Toolbar row (1005 × 32): left cluster = `Search` (Size=Small) with placeholder "Search" + `Button` "Filters" (Secondary, icon-left `sliders-simple`); right cluster = `Button Group` Size=Small with two buttons: "List " (Secondary/Regular) + "Card" (Secondary/Active).

**Files:**
- Create: `apps/tasks-tile-view/src/components/PageHeader.tsx`
- Create: `apps/tasks-tile-view/src/components/PageToolbar.tsx`

- [ ] **Step 1: PageHeader.tsx**

Write `apps/tasks-tile-view/src/components/PageHeader.tsx`:
```tsx
import { Button } from "@ds/components/Button"

export function PageHeader() {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-h1 font-bold text-[var(--color-primary-text-color)]">
        Tasks
      </h1>
      <div className="flex items-center gap-3">
        <Button variant="secondary" size="sm" iconLeft="external-link">
          Portal View
        </Button>
        <Button variant="primary" size="sm" iconLeft="plus">
          Create new Task
        </Button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: PageToolbar.tsx**

Write `apps/tasks-tile-view/src/components/PageToolbar.tsx`:
```tsx
import { Search } from "@ds/components/Search"
import { Button } from "@ds/components/Button"
import { ButtonGroup, ButtonGroupItem } from "@ds/components/ButtonGroup"

type Props = {
  searchQuery: string
  onSearchChange: (q: string) => void
}

export function PageToolbar({ searchQuery, onSearchChange }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Search
          size="sm"
          value={searchQuery}
          onValueChange={onSearchChange}
          placeholder="Search"
        />
        <Button variant="secondary" size="sm" iconLeft="sliders-horizontal">
          Filters
        </Button>
      </div>
      <ButtonGroup size="sm">
        <ButtonGroupItem iconLeft="list">List</ButtonGroupItem>
        <ButtonGroupItem iconLeft="grid" active>
          Card
        </ButtonGroupItem>
      </ButtonGroup>
    </div>
  )
}
```

> If the DS `ButtonGroup` API uses a different shape (e.g. an `items` prop), open `src/components/ButtonGroup/ButtonGroup.tsx` and adapt. The intent: two segmented buttons, "Card" selected.

- [ ] **Step 3: Commit**

```bash
git add apps/tasks-tile-view/src/components/PageHeader.tsx apps/tasks-tile-view/src/components/PageToolbar.tsx
git commit -m "feat(tasks-tile-view): PageHeader (title + actions) + PageToolbar (search + view-mode)"
```

---

## Task 12: TaskTile

**Figma source (node `27521:265053`, 245.25 × 269):** vertical stack, padding 10/12, gap 12, fill `secondary-background-color`, stroke `layout-border-color`.

Stack (top → bottom):
1. **Title row** — small play IconButton (Primary) + task title (Karla SemiBold 14/20) + trailing `more-options` IconButton (Tertiary).
2. **Divider** — 1px `layout-border-color`.
3. **Progress** — text "8 / 16" (SemiBold 12/16) + "(50% completed)" (Regular 12/16, secondary) + `LinearProgressBar` (Primary, Small, no label).
4. **Stat row #1** — two columns: "Time Allocated" label + value "05:30:00", "Time Spent" label + value "03:32:00".
5. **Stat row #2** — two columns: "Responsible" label + single `Avatar` (Small, IMG), "Members" label + `AvatarGroup` (XS, three avatars + "+10" counter).
6. **Stat row #3** — two columns: "Priority" label + flag `IconButton` (XXS, Tertiary, Negetive [sic] color), "Status" label + `Chip` (Positive-Subtle, "In-Progress", chevron-down trailing).

**Files:**
- Create: `apps/tasks-tile-view/src/components/TaskTile.tsx`

- [ ] **Step 1: TaskTile.tsx**

Write `apps/tasks-tile-view/src/components/TaskTile.tsx`:
```tsx
import { IconButton } from "@ds/components/IconButton"
import { LinearProgressBar } from "@ds/components/LinearProgressBar"
import { Avatar } from "@ds/components/Avatar"
import { AvatarGroup } from "@ds/components/AvatarGroup"
import { Chip } from "@ds/components/Chip"
import type { Task } from "../types"
import { cn } from "@ds/lib/cn"

type Props = {
  task: Task
  onClick: () => void
  compact?: boolean
}

const statusToChip: Record<Task["status"], { label: string; tone: string }> = {
  open: { label: "Open", tone: "neutral-subtle" },
  in_progress: { label: "In-Progress", tone: "positive-subtle" },
  blocked: { label: "Blocked", tone: "negative-subtle" },
  done: { label: "Done", tone: "positive-subtle" },
}

export function TaskTile({ task, onClick, compact }: Props) {
  const percent =
    task.subtasksTotal > 0
      ? Math.round((task.subtasksDone / task.subtasksTotal) * 100)
      : 0
  const chip = statusToChip[task.status]

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col gap-3 rounded-2xl border border-[var(--color-layout-border-color)] bg-[var(--color-secondary-background-color)] p-3 text-left",
        "transition-shadow hover:shadow-md",
        "focus-visible:outline-2 focus-visible:outline-[var(--color-primary-color)]",
        compact ? "min-h-[200px]" : "min-h-[269px]",
      )}
    >
      {/* Title row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-1 items-center gap-2">
          <IconButton
            size="xs"
            kind="primary"
            icon="play"
            aria-label={`Start ${task.title}`}
            onClick={(e) => e.stopPropagation()}
          />
          <span className="truncate text-t2 font-semibold text-[var(--color-primary-text-color)]">
            {task.title}
          </span>
        </div>
        <IconButton
          size="xs"
          kind="tertiary"
          icon="more-vertical"
          aria-label="More options"
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      <hr className="border-t border-[var(--color-layout-border-color)]" />

      {/* Progress */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2 text-t3">
          <span className="font-semibold text-[var(--color-primary-text-color)]">
            {task.subtasksDone} / {task.subtasksTotal}
          </span>
          <span className="text-[var(--color-secondary-text-color)]">
            ({percent}% completed)
          </span>
        </div>
        <LinearProgressBar value={percent} size="sm" />
      </div>

      {/* Stat row 1 */}
      <div className="flex gap-4 text-t3">
        <StatColumn label="Time Allocated" value={task.timeAllocated} />
        <StatColumn label="Time Spent" value={task.timeSpent} />
      </div>

      {/* Stat row 2 */}
      <div className="flex gap-4 text-t3">
        <div className="flex flex-1 flex-col gap-1">
          <span className="text-[var(--color-secondary-text-color)]">Responsible</span>
          <Avatar size="sm" src={task.responsible.avatarUrl} alt={task.responsible.name} />
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <span className="text-[var(--color-secondary-text-color)]">Members</span>
          <AvatarGroup size="xs" max={3}>
            {task.members.map((m) => (
              <Avatar key={m.id} size="xs" src={m.avatarUrl} alt={m.name} />
            ))}
          </AvatarGroup>
        </div>
      </div>

      {/* Stat row 3 */}
      <div className="flex gap-4 text-t3">
        <div className="flex flex-1 flex-col gap-1">
          <span className="text-[var(--color-secondary-text-color)]">Priority</span>
          <IconButton
            size="xxs"
            kind="tertiary"
            icon="flag"
            aria-label="Priority"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <span className="text-[var(--color-secondary-text-color)]">Status</span>
          <Chip size="sm" tone={chip.tone} iconRight="chevron-down">
            {chip.label}
          </Chip>
        </div>
      </div>
    </button>
  )
}

function StatColumn({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-1 flex-col gap-1">
      <span className="text-[var(--color-secondary-text-color)]">{label}</span>
      <span className="font-semibold text-[var(--color-primary-text-color)]">{value}</span>
    </div>
  )
}
```

> The DS may name props slightly differently. The patterns to verify by opening the relevant DS files:
> - `IconButton`: `size` (`xxs`/`xs`/`sm`), `kind` (`primary`/`tertiary`), `icon` (icon name string).
> - `LinearProgressBar`: `value` is `0..100` (assumption); confirm and convert if it's `0..1`.
> - `AvatarGroup`: `max` may be `maxVisible` or `limit` — confirm and pass the right prop name to drive the "+N" overflow.
> - `Chip`: `tone` may be `variant`. The Figma uses variant `Type=Positive-Subtle`; map to whatever the code prop is.

- [ ] **Step 2: Commit**

```bash
git add apps/tasks-tile-view/src/components/TaskTile.tsx
git commit -m "feat(tasks-tile-view): TaskTile matching Figma anatomy"
```

---

## Task 13: TaskTilesGrid

**Files:**
- Create: `apps/tasks-tile-view/src/components/TaskTilesGrid.tsx`

- [ ] **Step 1: TaskTilesGrid.tsx**

Write `apps/tasks-tile-view/src/components/TaskTilesGrid.tsx`:
```tsx
import { TaskTile } from "./TaskTile"
import type { Task } from "../types"

type Props = {
  tasks: Task[]
  onSelectTask: (id: string) => void
  compact: boolean
}

export function TaskTilesGrid({ tasks, onSelectTask, compact }: Props) {
  if (tasks.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-dashed border-[var(--color-layout-border-color)] text-t2 text-[var(--color-secondary-text-color)]">
        No tasks match the current filters.
      </div>
    )
  }
  return (
    <div className="grid grid-cols-4 gap-2">
      {tasks.map((t) => (
        <TaskTile
          key={t.id}
          task={t}
          onClick={() => onSelectTask(t.id)}
          compact={compact}
        />
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/tasks-tile-view/src/components/TaskTilesGrid.tsx
git commit -m "feat(tasks-tile-view): TaskTilesGrid 4-col + empty state"
```

---

## Task 14: MainContent

Composes breadcrumbs + page header + toolbar + grid.

**Files:**
- Create: `apps/tasks-tile-view/src/components/MainContent.tsx`

- [ ] **Step 1: MainContent.tsx**

Write `apps/tasks-tile-view/src/components/MainContent.tsx`:
```tsx
import { Breadcrumb, BreadcrumbItem } from "@ds/components/Breadcrumb"
import { PageHeader } from "./PageHeader"
import { PageToolbar } from "./PageToolbar"
import { TaskTilesGrid } from "./TaskTilesGrid"
import type { Task } from "../types"

type Props = {
  tasks: Task[]
  searchQuery: string
  onSearchChange: (q: string) => void
  onSelectTask: (id: string) => void
  compact: boolean
}

export function MainContent({
  tasks,
  searchQuery,
  onSearchChange,
  onSelectTask,
  compact,
}: Props) {
  return (
    <main className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 pr-6">
      <Breadcrumb>
        <BreadcrumbItem href="#">Workspace</BreadcrumbItem>
        <BreadcrumbItem href="#">Workspace</BreadcrumbItem>
        <BreadcrumbItem current>Workspace</BreadcrumbItem>
      </Breadcrumb>
      <PageHeader />
      <PageToolbar searchQuery={searchQuery} onSearchChange={onSearchChange} />
      <TaskTilesGrid tasks={tasks} onSelectTask={onSelectTask} compact={compact} />
    </main>
  )
}
```

> The Figma encodes all three breadcrumb segments as "Workspace" with no `current` differentiation. In code we mark the last segment current for accessibility and styling. If the DS `Breadcrumb` API differs, adapt.

- [ ] **Step 2: Commit**

```bash
git add apps/tasks-tile-view/src/components/MainContent.tsx
git commit -m "feat(tasks-tile-view): MainContent composing breadcrumbs + header + toolbar + grid"
```

---

## Task 15: TaskDetailModal

**Files:**
- Create: `apps/tasks-tile-view/src/components/TaskDetailModal.tsx`

- [ ] **Step 1: TaskDetailModal.tsx**

Write `apps/tasks-tile-view/src/components/TaskDetailModal.tsx`:
```tsx
import { Modal } from "@ds/components/Modal"
import type { Task } from "../types"

type Props = {
  task: Task | null
  onClose: () => void
}

export function TaskDetailModal({ task, onClose }: Props) {
  return (
    <Modal open={task != null} onOpenChange={(v) => !v && onClose()} title={task?.title ?? ""}>
      {task && (
        <div className="flex flex-col gap-3 text-t2 text-[var(--color-primary-text-color)]">
          <Row label="Status" value={task.status} />
          <Row label="Time allocated" value={task.timeAllocated} />
          <Row label="Time spent" value={task.timeSpent} />
          <Row label="Subtasks" value={`${task.subtasksDone} / ${task.subtasksTotal}`} />
          <Row label="Responsible" value={task.responsible.name} />
          <Row
            label="Members"
            value={task.members.map((m) => m.name).join(", ")}
          />
          <Row label="Priority" value={task.priority} />
        </div>
      )}
    </Modal>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-[var(--color-secondary-text-color)]">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  )
}
```

> Confirm the DS `Modal` API. Likely: `open`, `onOpenChange`, `title`, children. If it follows Radix Dialog more literally (sub-components for `Trigger`, `Content`, `Title`), adapt.

- [ ] **Step 2: Commit**

```bash
git add apps/tasks-tile-view/src/components/TaskDetailModal.tsx
git commit -m "feat(tasks-tile-view): TaskDetailModal showing full task record"
```

---

## Task 16: Wire App.tsx — final composition

Replace the scaffold App.tsx with the full page.

**Files:**
- Modify: `apps/tasks-tile-view/src/App.tsx`

- [ ] **Step 1: App.tsx**

Write `apps/tasks-tile-view/src/App.tsx`:
```tsx
import { useAppState } from "./state/AppState"
import { TopBar } from "./components/TopBar"
import { Sidebar } from "./components/Sidebar"
import { MainContent } from "./components/MainContent"
import { TaskDetailModal } from "./components/TaskDetailModal"
import { projects, tasks as allTasks } from "./data/mock"

export function App() {
  const s = useAppState()
  const currentTask =
    allTasks.find((t) => t.id === s.timer.currentTaskId) ?? allTasks[0]!
  const selectedTask = s.selectedTaskId
    ? allTasks.find((t) => t.id === s.selectedTaskId) ?? null
    : null

  return (
    <div
      data-theme="light"
      className="relative flex h-screen flex-col overflow-hidden bg-[var(--color-primary-background-color)]"
    >
      <BackgroundBlobs />
      <div className="relative z-10 flex h-full flex-col">
        <TopBar view={s.view} onViewChange={s.setView} />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            currentTask={currentTask}
            timer={s.timer}
            onToggleTimer={s.toggleTimer}
            projects={projects}
            searchQuery={s.searchQuery}
            onSearchChange={s.setSearchQuery}
            selectedProjectId={s.selectedProjectId}
            onSelectProject={s.setSelectedProjectId}
            compact={s.compact}
            onToggleCompact={() => s.setCompact(!s.compact)}
          />
          <MainContent
            tasks={s.filteredTasks}
            searchQuery={s.searchQuery}
            onSearchChange={s.setSearchQuery}
            onSelectTask={s.openTask}
            compact={s.compact}
          />
        </div>
      </div>
      <TaskDetailModal task={selectedTask} onClose={s.closeTask} />
    </div>
  )
}

/**
 * Decorative 15%-opacity gradient blobs from the Figma "Background Blobs"
 * group. Approximated with blurred coloured circles — not pixel-traced.
 */
function BackgroundBlobs() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden opacity-15">
      <div className="absolute -left-32 -top-32 h-[440px] w-[440px] rounded-full bg-[var(--color-brand-selected-hover-color)] blur-3xl" />
      <div className="absolute right-[-120px] top-[80px] h-[380px] w-[380px] rounded-full bg-[var(--color-content-purple)] blur-3xl" />
      <div className="absolute bottom-[-80px] left-[300px] h-[420px] w-[420px] rounded-full bg-[var(--color-content-dark-indigo-selected)] blur-3xl" />
      <div className="absolute -right-24 bottom-[-100px] h-[360px] w-[360px] rounded-full bg-[var(--color-content-dark-purple)] blur-3xl" />
    </div>
  )
}
```

> The `--color-content-*` tokens use slugified names from the Figma export (e.g. `content-purple`, `content-dark-indigo-selected`, `content-dark-purple`). Verify the actual variable names in `src/tokens/dist/css/variables.css` by `grep -E '--color-content' src/tokens/dist/css/variables.css` and substitute whichever form exists. If a token doesn't exist in code, swap it for the closest semantic color — do not hardcode a hex.

- [ ] **Step 2: Run the dev server in the browser**

```bash
cd apps/tasks-tile-view
npm run dev
```
Open `http://localhost:1420`. Expected: full page renders. Quick smoke checks:
- Top bar shows TimeWorks/ChatWorks tabs, avatar, three glyphs.
- Sidebar shows the timer card with "Tasks Name", a Search, five project rows, and two icon buttons at the bottom.
- Main column shows three breadcrumbs, "Tasks" H1, two right-aligned buttons, the search + filters row + List/Card group, and a 4×3 grid of tiles.
- Clicking a tile opens the modal.
- Clicking play on the timer card starts the elapsed counter and shows the sweep ring.

Stop the dev server.

- [ ] **Step 3: Boot Tauri**

```bash
cd apps/tasks-tile-view
cargo tauri dev
```
Expected: native window at 1400×925, same render as the browser. Resize and confirm no broken layout (page is fixed-width 310px sidebar + flex main; tiles will fill the remaining width).

- [ ] **Step 4: Visual diff against the Figma**

Take a screenshot of the running window (Cmd-Shift-4 on macOS) and place it next to the Figma frame in another window. Iterate on spacing/typography mismatches before declaring done. Common things to tweak:
- Tile internal padding (Figma: 10/12, currently `p-3` = 12/12 — change to `py-2.5 px-3` if a mismatch is visible).
- Sidebar overall padding.
- Top-bar height (41px target).

For each tweak, commit separately.

- [ ] **Step 5: Commit the final wiring**

```bash
git add apps/tasks-tile-view/src/App.tsx
git commit -m "feat(tasks-tile-view): wire full page + background blobs"
```

---

## Task 17: Final verification + done

- [ ] **Step 1: TS typecheck**

```bash
cd apps/tasks-tile-view
npx tsc --noEmit
```
Expected: zero errors. If any DS prop name guesses in the plan were wrong, this is where they surface — fix the file, re-typecheck, commit per file.

- [ ] **Step 2: Production build**

```bash
cd apps/tasks-tile-view
npm run build
```
Expected: `dist/` produced, no errors.

- [ ] **Step 3: Confirm DS untouched**

```bash
cd /Users/MiggleWork/Downloads/Timeworks
git diff --stat main -- src/ scripts/ package.json
```
Expected: zero lines changed in `src/`, `scripts/`, root `package.json`.

- [ ] **Step 4: Final commit (if needed) + branch summary**

```bash
git log --oneline main..HEAD
```
Expected: a clean list of ~16 commits, all prefixed `feat(tasks-tile-view): …`.

The app is now a runnable Tauri desktop app. Launch with:
```bash
cd apps/tasks-tile-view && cargo tauri dev
```

---

## Self-review notes

- **Spec coverage:** all seven interactions in spec §3 land in `useAppState` (Task 6) and are wired in App.tsx (Task 16). All four page regions in spec §2 have dedicated tasks (TopBar 7, Sidebar 10, MainContent 14, TaskTile 12). Mock-data shape from spec §4 matches Task 5's `Task` type exactly. Out-of-scope items in spec §6 are not introduced (no backend, no tests, no theme toggle, no IPC).
- **Placeholders:** none. Every code step contains the full code for that file. Every command has expected output. The "verify DS prop names" inline notes are warnings, not deferred work — the engineer reads the DS source and adapts.
- **Type consistency:** `Task`, `Project`, `Assignee`, `TimerState`, `View` defined once in `types.ts` (Task 5) and re-imported everywhere. The state hook (`useAppState`) returns exactly the shape consumed by `App.tsx`. `formatElapsed` is exported from `state/AppState.ts` (Task 6) and used in `TaskTimerCard` (Task 9).
- **Known soft spot — DS prop-name guesses.** `Tabs`, `IconButton`, `Button`, `Chip`, `LinearProgressBar`, `AvatarGroup`, `Breadcrumb`, `ButtonGroup`, and `Modal` props are guessed from CLAUDE.md conventions, not verified against the actual `.tsx` files. The plan flags this at each touchpoint; the engineer is expected to open the corresponding DS file and rename props as needed. Task 17 Step 1's typecheck will catch any miss.
