import { useEffect, useState, type ComponentType } from "react"
import { Text } from "../components/Text"
import { cn } from "../lib/cn"
import { Showcase } from "./Showcase"

type PageDef = {
  id: string
  label: string
  component: ComponentType
}

const PAGES: ReadonlyArray<PageDef> = [
  { id: "home", label: "Foundations", component: Showcase },
]

const THEMES = ["light", "black", "pink"] as const
type Theme = (typeof THEMES)[number]
const THEME_STORAGE_KEY = "timeworks-theme"

function getInitialTheme(): Theme {
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
  return (THEMES as readonly string[]).includes(stored ?? "") ? (stored as Theme) : "light"
}

function getPageFromHash(): string {
  const raw = window.location.hash.replace(/^#\/?/, "")
  return PAGES.some((p) => p.id === raw) ? raw : "home"
}

function ThemeToggle({ theme, setTheme }: { theme: Theme; setTheme: (t: Theme) => void }) {
  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className="ml-auto flex items-center gap-1 rounded-md border border-[var(--color-layout-border-color)] p-0.5"
    >
      {THEMES.map((t) => {
        const active = t === theme
        return (
          <button
            key={t}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setTheme(t)}
            className={cn(
              "rounded px-2 py-1 text-t3 font-body capitalize transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-color)]",
              active
                ? "bg-[var(--color-primary-selected-color)] text-[var(--color-primary-color)] font-semibold"
                : "text-[var(--color-primary-text-color)] hover:bg-[var(--color-primary-background-hover-color)]",
            )}
          >
            {t}
          </button>
        )
      })}
    </div>
  )
}

export function ShowcaseNav({
  pageId,
  theme,
  setTheme,
}: {
  pageId: string
  theme: Theme
  setTheme: (t: Theme) => void
}) {
  return (
    <nav className="border-b border-[var(--color-layout-border-color)] bg-[var(--color-primary-background-color)]">
      <div className="mx-auto flex max-w-[1768px] items-center gap-6 px-8 py-3">
        <Text
          as="span"
          variant="t3"
          weight="semibold"
          className="uppercase tracking-widest text-[var(--color-primary-color)]"
        >
          Timeworks DS
        </Text>
        <ul className="flex items-center gap-1">
          {PAGES.map((page) => {
            const isActive = page.id === pageId
            return (
              <li key={page.id}>
                <a
                  href={`#/${page.id}`}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "inline-flex items-center rounded-md px-3 py-1.5 text-t2 font-body transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-color)]",
                    isActive
                      ? "bg-[var(--color-primary-selected-color)] text-[var(--color-primary-color)] font-semibold"
                      : "text-[var(--color-primary-text-color)] hover:bg-[var(--color-primary-background-hover-color)]",
                  )}
                >
                  {page.label}
                </a>
              </li>
            )
          })}
        </ul>
        <ThemeToggle theme={theme} setTheme={setTheme} />
      </div>
    </nav>
  )
}

export function App() {
  const [pageId, setPageId] = useState<string>(() => getPageFromHash())
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme())

  useEffect(() => {
    const onHashChange = () => setPageId(getPageFromHash())
    window.addEventListener("hashchange", onHashChange)
    return () => window.removeEventListener("hashchange", onHashChange)
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  const active = PAGES.find((p) => p.id === pageId) ?? PAGES[0]!
  const ActivePage = active.component

  return (
    <div className="min-h-screen bg-[var(--color-allgrey-background-color)]">
      <ShowcaseNav pageId={pageId} theme={theme} setTheme={setTheme} />
      <ActivePage />
    </div>
  )
}
