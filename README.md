# Design System Starter

A pre-configured starter for a solo-built design system inspired by (but distinct from) [Vibe](https://vibe.monday.com).

This is not a fully scaffolded Vite app — it's the **opinionated layer on top**: project conventions, the Claude Code context file, and the folder structure. You'll run a Vite scaffold inside it (or scaffold first and copy these files in).

---

## First-time setup

You have two paths. Pick one.

### Path A — Use this folder as the project root (recommended)

```bash
# 1. From inside this folder, scaffold Vite *into the current directory*
npm create vite@latest . -- --template react-ts
# When prompted "Current directory is not empty", choose "Ignore files and continue"
# This adds Vite's files alongside the ones already here.

# 2. Install base deps
npm install

# 3. Install design system deps (add Radix primitives as components need them)
npm install class-variance-authority clsx tailwind-merge lucide-react

# 4. Install dev deps
npm install -D tailwindcss @tailwindcss/vite

# 5. Init Storybook
npx storybook@latest init --type react
```

### Path B — Scaffold separately, copy these files in

```bash
npm create vite@latest my-design-system -- --template react-ts
cd my-design-system
# Then copy the contents of THIS folder into it, overwriting where prompted.
```

---

## Working with Claude Code

This project is set up for Claude Code from day one.

- `CLAUDE.md` is the project context file — read it. It defines architecture rules, API conventions, brand differentiation, the v1 scope, and the definition of "done" for each component. Tune the **brand differentiation** section to your taste before building.
- `.claudeignore` keeps `node_modules`, build output, and lockfiles out of context.
- `.vscode/settings.json` enables Tailwind IntelliSense for the patterns this project uses (the `cn()` and `cva()` helpers).
- `.vscode/extensions.json` recommends the extensions you want installed.

When you open the folder in VS Code, accept the recommended extensions prompt, then click the Spark icon to launch Claude Code.

---

## Project structure

```
.
├── CLAUDE.md                   # Project context — Claude Code reads this every session
├── .claudeignore               # Files to exclude from Claude Code's context
├── .vscode/
│   ├── settings.json           # Tailwind IntelliSense config
│   └── extensions.json         # Recommended extensions
├── src/
│   ├── components/             # One folder per component (empty — built one by one)
│   ├── lib/
│   │   └── cn.ts               # clsx + tailwind-merge helper
│   ├── index.ts                # Public package entry
│   └── index.css               # Tailwind + global resets
└── README.md
```

The token pipeline (`src/tokens/`, `style-dictionary.config.js`) and icon re-exports (`src/icons/`) will be added back when needed.

---

## Scripts you'll add to package.json

After `npm create vite@latest .` completes, add these to your `scripts` block:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  }
}
```

---

## Vite + Tailwind v4 config

After scaffolding Vite, edit `vite.config.ts`:

```ts
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [react(), tailwindcss()]
})
```

---

## Day 1 checklist

- [ ] Path A or B completed
- [ ] `npm run dev` works
- [ ] `npm run storybook` works
- [ ] Open `CLAUDE.md` and tune the **Brand differentiation** section to your taste
- [ ] Sign into Claude Code via the Spark icon in VS Code
- [ ] First prompt: "Read CLAUDE.md and confirm you understand the project."

You're ready to build.
# timeworks
