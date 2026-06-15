import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Text } from "../components/Text";
import { cn } from "../lib/cn";
import { Showcase } from "./Showcase";
const PAGES = [
    { id: "home", label: "Foundations", component: Showcase },
];
const THEMES = ["light", "dark", "black"];
const THEME_STORAGE_KEY = "timeworks-theme";
function getInitialTheme() {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return THEMES.includes(stored ?? "") ? stored : "light";
}
function getPageFromHash() {
    const raw = window.location.hash.replace(/^#\/?/, "");
    return PAGES.some((p) => p.id === raw) ? raw : "home";
}
function ThemeToggle({ theme, setTheme }) {
    return (_jsx("div", { role: "radiogroup", "aria-label": "Theme", className: "ml-auto flex items-center gap-1 rounded-md border border-[var(--color-layout-border-color)] p-0.5", children: THEMES.map((t) => {
            const active = t === theme;
            return (_jsx("button", { type: "button", role: "radio", "aria-checked": active, onClick: () => setTheme(t), className: cn("rounded px-2 py-1 text-t3 font-body capitalize transition-colors", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-color)]", active
                    ? "bg-[var(--color-primary-selected-color)] text-[var(--color-primary-color)] font-semibold"
                    : "text-[var(--color-primary-text-color)] hover:bg-[var(--color-primary-background-hover-color)]"), children: t }, t));
        }) }));
}
export function ShowcaseNav({ pageId, theme, setTheme, }) {
    return (_jsx("nav", { className: "border-b border-[var(--color-layout-border-color)] bg-[var(--color-primary-background-color)]", children: _jsxs("div", { className: "mx-auto flex max-w-[1768px] items-center gap-6 px-8 py-3", children: [_jsx(Text, { as: "span", variant: "t3", weight: "semibold", className: "uppercase tracking-widest text-[var(--color-primary-color)]", children: "Timeworks DS" }), _jsx("ul", { className: "flex items-center gap-1", children: PAGES.map((page) => {
                        const isActive = page.id === pageId;
                        return (_jsx("li", { children: _jsx("a", { href: `#/${page.id}`, "aria-current": isActive ? "page" : undefined, className: cn("inline-flex items-center rounded-md px-3 py-1.5 text-t2 font-body transition-colors", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-color)]", isActive
                                    ? "bg-[var(--color-primary-selected-color)] text-[var(--color-primary-color)] font-semibold"
                                    : "text-[var(--color-primary-text-color)] hover:bg-[var(--color-primary-background-hover-color)]"), children: page.label }) }, page.id));
                    }) }), _jsx(ThemeToggle, { theme: theme, setTheme: setTheme })] }) }));
}
export function App() {
    const [pageId, setPageId] = useState(() => getPageFromHash());
    const [theme, setTheme] = useState(() => getInitialTheme());
    useEffect(() => {
        const onHashChange = () => setPageId(getPageFromHash());
        window.addEventListener("hashchange", onHashChange);
        return () => window.removeEventListener("hashchange", onHashChange);
    }, []);
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    }, [theme]);
    const active = PAGES.find((p) => p.id === pageId) ?? PAGES[0];
    const ActivePage = active.component;
    return (_jsxs("div", { className: "min-h-screen bg-[var(--color-allgrey-background-color)]", children: [_jsx(ShowcaseNav, { pageId: pageId, theme: theme, setTheme: setTheme }), _jsx(ActivePage, {})] }));
}
