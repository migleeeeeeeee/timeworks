# Tasks Tile View — Tauri desktop app

**Status:** spec, awaiting plan
**Date:** 2026-05-15
**Figma:** `Tasks tile view`, node `27521:263777`, page `Main View — polish`, fileKey `gqYWCu1K6dJ9gESXtgNeCi`

Build the Figma "Tasks tile view" frame as a runnable Tauri desktop app, pixel-faithful to the design, with local interactivity over mock data. Reuses existing DS components from `src/components/` directly from source via a Vite path alias. The DS library at the repo root is unchanged by this work.

---

## Decisions captured during brainstorming

| Decision | Choice |
| --- | --- |
| Runtime | Tauri (Rust toolchain not yet installed; install steps included) |
| Scope | Single page; no router; no other product pages |
| Fidelity | Pixel-faithful to the Figma frame |
| Interactivity | Locally interactive over in-memory mock data |
| Location | New top-level `apps/tasks-tile-view/`, no monorepo workspaces |
| DS consumption | Vite path alias `@ds → ../../src` — imports DS source directly |
| New deps | Approved — exact list surfaces in the implementation plan |

---

## 1. Architecture

```
apps/tasks-tile-view/
├── package.json               # own deps; no DS package dep
├── vite.config.ts             # Tailwind v4 plugin + alias @ds → ../../src
├── tsconfig.json              # paths: { "@ds/*": ["../../src/*"] }
├── index.html
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── styles.css             # @import "../../src/tokens/dist/css/variables.css" then Tailwind
│   ├── components/
│   │   ├── TopBar.tsx
│   │   ├── Sidebar.tsx
│   │   ├── TaskTimerCard.tsx
│   │   ├── ProjectsCard.tsx
│   │   ├── ProjectListItem.tsx
│   │   ├── ViewSwitcher.tsx
│   │   ├── MainContent.tsx
│   │   ├── TaskTilesGrid.tsx
│   │   ├── TaskTile.tsx
│   │   └── TaskDetailModal.tsx
│   ├── data/
│   │   └── mock.ts            # tasks, projects, currentTimerTask
│   └── types.ts               # Task, Project, Assignee
└── src-tauri/
    ├── Cargo.toml
    ├── tauri.conf.json        # window 1400×925, resizable, native title bar
    ├── build.rs
    └── src/main.rs            # stock template; no custom IPC commands
```

The DS library at the repo root keeps building and shipping Storybook exactly as today; nothing in `src/` is modified by this work. Tokens flow from the DS into the app via a single CSS import of `src/tokens/dist/css/variables.css` at the app's Tailwind entry — the app never edits tokens.

The Tauri shell loads the Vite dev server in development (`http://localhost:1420`) and the built static assets in production. No custom Rust IPC commands; the renderer owns all state.

---

## 2. Page composition

The Figma frame is 1400 × 925, `layoutMode: VERTICAL`, `cornerRadius: 20`, background bound to `--primary-background-color` with a decorative 15%-opacity blue/violet/cyan gradient overlay.

Layout (top to bottom, then left to right):

- **Top bar** — 1400 × 41, horizontal space-between.
- **Below the top bar** — 1400 × 884, horizontal: 310px **sidebar** + ~1053px **main content**.

### `App.tsx`

- Sets `<html data-theme="light">` (theme switching is out of scope for v1).
- Renders the page background: a single `<div>` with the primary background color plus four absolutely-positioned blurred ellipses approximating the Figma "Background Blobs" group (tokens `--color-brand-selected-hover-color`, `--color-content-purple`, `--color-content-dark-indigo-selected`, `--color-content-dark-purple`; `blur-3xl`, 15% opacity).
- Composes `<TopBar />` + `<Sidebar />` + `<MainContent />`.

### `TopBar.tsx`

- Left: DS `Tabs` with two tabs, labels sourced from the Figma deep export step (see §5).
- Right: DS `Avatar` (Size=Medium, Type=IMG) + a static three-glyph `WindowChrome` row (decorative; the real OS-level minimize/maximize/close come from Tauri's native title bar).

### `Sidebar.tsx` (310 × 868)

Stacks four regions:

1. **`TaskTimerCard`** (310 × 157) — local product component, not in the DS.
   - Big circular play button (62 × 62), DS `Icon`.
   - Two text lines: current task title + elapsed time `HH:MM:SS`.
   - Divider (1px, `--color-ui-border-color`).
   - Mode toggles row: one DS `Button` + one DS `Button` (Kind=Secondary, Size=Small, Color=Primary).
   - Animated countdown sweep ring around the card: an SVG `<circle>` with `stroke-dasharray` driven from React state; animates only while the timer is running.
2. **`ProjectsCard`** (310 × 671) — header text "Today"; DS `Search` (Size=Medium) with placeholder "Find a task or project"; vertical list of `ProjectListItem` rows. One row is an expanded sub-tree group with nested children.
3. **`ViewSwitcher`** (310 × 24) — two DS `IconButton`s (Size=XS, Kind=Tertiary).

### `MainContent.tsx`

- DS `Breadcrumbs` (Amount=3) — labels sourced from the Figma deep export step.
- Page title row + filter toolbar (`Frame 1707485112`, 1005 × 82) — exact contents confirmed in plan step 1.
- `<TaskTilesGrid />`.

### `TaskTilesGrid.tsx`

- CSS grid: `grid-cols-4`, `gap-2` (8px), 3 rows. Cell size ≈ 245 × 269 px (fixed).
- Renders 12 `<TaskTile />` instances from filtered mock data.

### `TaskTile.tsx`

Built from DS components only. Anatomy confirmed in plan step 1 via targeted deep-export of `27521:265052` (Row 1). Expected slots:

- Title (DS `Text`, t2)
- Status (DS `Chip` or `Tag`)
- Due-date text (DS `Text`, t3)
- Assignees (DS `AvatarGroup`)
- Optional progress (DS `LinearProgressBar`)
- Project badge (DS `Badge`)

The card surface uses `--color-secondary-background-color` and `--color-layout-border-color`, matching the Figma's 11× / 9× token frequency.

### `TaskDetailModal.tsx`

Wraps the DS `Modal`. Renders the clicked task's full record. Read-only.

---

## 3. Interactivity

All state is in-memory React state in `App.tsx` (no global store, no persistence).

| Surface | Interaction | State |
| --- | --- | --- |
| Top-bar tabs | Click switches `view`; grid renders a different filtered subset of mock tasks. | `view: "all" \| "today"` |
| Sidebar search | Filters visible tiles by title substring, live, no debounce. | `searchQuery: string` |
| Sidebar project rows | Click sets a project filter on the grid; clicking the active row clears it. | `selectedProjectId: string \| null` |
| View switcher (XS icon buttons) | Toggles a `compact` boolean; tile cell sizes shrink. | `compact: boolean` |
| Tile click | Opens `TaskDetailModal` with that task. | `selectedTaskId: string \| null` |
| Timer card play button | Toggles `isRunning`; while running, a `setInterval` increments `elapsedSeconds`. The countdown sweep ring animates only while running. | `isRunning: boolean`, `elapsedSeconds: number` |

Static (decorative only): top-bar avatar, top-bar window-chrome glyphs, breadcrumb segments.

---

## 4. Mock data

`src/data/mock.ts` exports three constants. Strings (task titles, project names, person names, breadcrumb labels) are populated from the Figma deep export in plan step 1, not invented.

```ts
// src/types.ts
export type Assignee = { id: string; name: string; avatarUrl?: string }
export type Project = { id: string; name: string; icon: string }
export type TaskStatus = "open" | "in_progress" | "blocked" | "done"
export type Task = {
  id: string
  title: string
  status: TaskStatus
  projectId: string
  dueDate: string         // ISO 8601
  assignees: Assignee[]
  progress?: number       // 0..1, present when status === "in_progress"
}
```

`tasks: Task[]` has exactly 12 entries (one per Figma tile). `projects: Project[]` covers the sidebar rows. A separate `currentTimerTask: { taskId: string; startedAt: string }` seeds the timer card.

---

## 5. Open items resolved in the implementation plan

1. **Deep-export of tile internals.** First plan step calls `figma_get_component_for_development_deep` on `27521:265052` (Row 1) to enumerate the exact DS components inside one tile, the field positions, and the source strings for all 12 tiles.
2. **Page-title + toolbar row.** Same step deep-exports `Frame 1707485112` to confirm whether it's an H1 title + a filter row, and which DS components fill the filter row.
3. **Tab + breadcrumb labels.** Same step harvests `Tabs/tab` and `Breadcrumbs Bar` subtrees for verbatim copy.
4. **Exact new-dep list.** Plan enumerates Tauri (`@tauri-apps/api`, `@tauri-apps/cli`), Vite, Tailwind v4 + plugin, React, TypeScript, with pinned versions matching the root repo where overlap exists.
5. **Toolchain install steps.** Rust via `rustup` + `cargo install tauri-cli` go in the plan as a preflight section, with verification commands.

---

## 6. Out of scope (explicit)

- No backend, API, or persistence. Refresh wipes the timer.
- No second real page; tabs are a visual demo.
- No Tauri IPC commands; `src-tauri/src/main.rs` is the stock template.
- No tests for the page itself.
- No CI, no packaging, no code-signing.
- No theme switching (the DS supports light/dark/black; this app ships light-only in v1).
- The "Background Blobs" gradient is approximated with `blur-3xl`, not pixel-traced.

---

## 7. Definition of done

- `cd apps/tasks-tile-view && npm install` succeeds.
- `npx tauri dev` boots a native 1400 × 925 window rendering the page.
- The rendered page is visually a match for the Figma frame at the section level: top bar, sidebar regions, main column with breadcrumbs + title + toolbar + 4×3 grid.
- All seven interactions in §3 work end-to-end against the mock data.
- No raw hex colors, raw pixel spacing, or raw shadow strings in any app file — every visual property resolves through a DS token (the same rule as `CLAUDE.md` for the DS itself).
- The DS library at the repo root is byte-for-byte unchanged.
