import { useMemo, useState, type ReactNode } from "react"
import { Text } from "../components/Text"
import { Icon } from "../components/Icon"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/Accordion"
import { Button } from "../components/Button"
import { ButtonGroup, ButtonGroupItem } from "../components/ButtonGroup"
import { SplitButton } from "../components/SplitButton"
import { Checkbox } from "../components/Checkbox"
import { Radio, RadioGroup } from "../components/RadioGroup"
import { Toggle } from "../components/Toggle"
import { Avatar } from "../components/Avatar"
import { AvatarGroup } from "../components/AvatarGroup"
import { IconButton } from "../components/IconButton"
import { AlertBanner } from "../components/AlertBanner"
import { AttentionBox } from "../components/AttentionBox"
import { Toast } from "../components/Toast"
import { Badge } from "../components/Badge"
import { Counter } from "../components/Counter"
import { Breadcrumb, BreadcrumbItem } from "../components/Breadcrumb"
import { Chip } from "../components/Chip"
import { Search } from "../components/Search"
import { TextArea } from "../components/TextArea"
import { TextField } from "../components/TextField"
import { ListItem } from "../components/ListItem"
import { Label } from "../components/Label"
import { Menu } from "../components/Menu"
import { Combobox } from "../components/Combobox"
import { DatePicker } from "../components/DatePicker"
import { Divider } from "../components/Divider"
import { Dropdown } from "../components/Dropdown"
import { EditableHeading } from "../components/EditableHeading"
import { EditableText } from "../components/EditableText"
import { LinearProgressBar } from "../components/LinearProgressBar"
import {
  Table,
  TableCell,
  TableHeaderCell,
  TableColumn,
  TableColumnLoader,
} from "../components/TableCell"
import { Slider } from "../components/Slider"
import { MultiStepIndicator } from "../components/MultiStepIndicator"
import { Steps } from "../components/Steps"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/Tabs"
import { Link } from "../components/Link"
import { Skeleton } from "../components/Skeleton"
import { Tipseen, TipseenAction } from "../components/Tipseen"
import { Tooltip, TooltipContent, TooltipTrigger } from "../components/Tooltip"
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalMedia,
  ModalSideBySide,
  ModalTitle,
  ModalTrigger,
} from "../components/Modal"
import { ICON_NAMES } from "../icons/names"

/**
 * Local showcase page — not part of the public package.
 * Renders the foundations and components shipped so far so the system
 * can be eyeballed end-to-end in a browser via `npm run dev`.
 */

const COLOR_GROUPS: Array<{ heading: string; swatches: Array<{ name: string; varName: string }> }> = [
  {
    heading: "Primary / brand",
    swatches: [
      { name: "primary", varName: "--color-primary-color" },
      { name: "primary-hover", varName: "--color-primary-hover-color" },
      { name: "primary-selected", varName: "--color-primary-selected-color" },
      { name: "primary-selected-hover", varName: "--color-primary-selected-hover-color" },
      { name: "primary-highlighted", varName: "--color-primary-highlighted-color" },
    ],
  },
  {
    heading: "Text",
    swatches: [
      { name: "text-primary-text-color", varName: "--color-primary-text-color" },
      { name: "text-secondary", varName: "--color-secondary-text-color" },
      { name: "text-on-inverted", varName: "--color-text-color-on-inverted" },
      { name: "text-on-primary", varName: "--color-text-color-on-primary" },
      { name: "text-disabled", varName: "--color-disabled-text-color" },
    ],
  },
  {
    heading: "Utility / borders / icons",
    swatches: [
      { name: "border-ui", varName: "--color-ui-border-color" },
      { name: "border-layout", varName: "--color-layout-border-color" },
      { name: "placeholder", varName: "--color-placeholder-color" },
      { name: "icon", varName: "--color-icon-color" },
      { name: "link", varName: "--color-link-color" },
      { name: "fixed-dark", varName: "--color-fixed-dark-color" },
      { name: "fixed-light", varName: "--color-fixed-light-color" },
    ],
  },
  {
    heading: "Backgrounds",
    swatches: [
      { name: "bg-inverted", varName: "--color-inverted-color-background" },
      { name: "bg-primary-color", varName: "--color-primary-background-color" },
      { name: "bg-primary-hover-color", varName: "--color-primary-background-hover-color" },
      { name: "bg-secondary", varName: "--color-secondary-background-color" },
      { name: "bg-allgrey", varName: "--color-allgrey-background-color" },
      { name: "bg-ui", varName: "--color-ui-background-color" },
      { name: "bg-disabled", varName: "--color-disabled-background-color" },
      { name: "bg-surface", varName: "--color-primary-surface-color" },
    ],
  },
  {
    heading: "Severity",
    swatches: [
      { name: "positive", varName: "--color-positive-color" },
      { name: "positive-hover", varName: "--color-positive-color-hover" },
      { name: "positive-selected", varName: "--color-positive-color-selected" },
      { name: "negative", varName: "--color-negative-color" },
      { name: "negative-hover", varName: "--color-negative-color-hover" },
      { name: "negative-selected", varName: "--color-negative-color-selected" },
      { name: "warning", varName: "--color-warning-color" },
      { name: "warning-hover", varName: "--color-warning-color-hover" },
      { name: "warning-selected", varName: "--color-warning-color-selected" },
      { name: "private", varName: "--color-private" },
      { name: "sharable", varName: "--color-sharable" },
    ],
  },
]

const SHADOWS = [
  { name: "shadow-xs", varName: "--shadow-xs", usage: "chips, tags" },
  { name: "shadow-sm", varName: "--shadow-sm", usage: "tooltips, toasts" },
  { name: "shadow-md", varName: "--shadow-md", usage: "menus, raised cards" },
  { name: "shadow-lg", varName: "--shadow-lg", usage: "modals, popovers" },
]

const RADII: Array<{ name: string; utility: string; radius: string; usage: string }> = [
  { name: "none", utility: "rounded-none", radius: "0", usage: "flush edges" },
  { name: "sm · 4px", utility: "rounded-sm", radius: "var(--radius-sm)", usage: "chips, tags" },
  { name: "md · 8px", utility: "rounded-md", radius: "var(--radius-md)", usage: "buttons, inputs" },
  { name: "lg · 12px", utility: "rounded-lg", radius: "var(--radius-lg)", usage: "cards, modals" },
  { name: "xl · 16px", utility: "rounded-xl", radius: "var(--radius-xl)", usage: "hero panels" },
  { name: "2xl · 24px", utility: "rounded-2xl", radius: "var(--radius-2xl)", usage: "marketing tiles" },
  { name: "full", utility: "rounded-full", radius: "9999px", usage: "pills, avatars" },
]

const SPACING: Array<{ name: string; varName: string; px: number; utility: string; usage: string }> = [
  { name: "space-2",  varName: "--space-2",  px: 2,  utility: "p-0.5",  usage: "small compact components" },
  { name: "space-4",  varName: "--space-4",  px: 4,  utility: "p-1",    usage: "small compact components" },
  { name: "space-8",  varName: "--space-8",  px: 8,  utility: "p-2",    usage: "small compact components" },
  { name: "space-12", varName: "--space-12", px: 12, utility: "p-3",    usage: "medium / less-condense" },
  { name: "space-16", varName: "--space-16", px: 16, utility: "p-4",    usage: "larger components" },
  { name: "space-20", varName: "--space-20", px: 20, utility: "p-5",    usage: "larger UI / patterns" },
  { name: "space-24", varName: "--space-24", px: 24, utility: "p-6",    usage: "larger UI / layout" },
  { name: "space-32", varName: "--space-32", px: 32, utility: "p-8",    usage: "patterns / layout" },
  { name: "space-40", varName: "--space-40", px: 40, utility: "p-10",   usage: "patterns / layout" },
  { name: "space-48", varName: "--space-48", px: 48, utility: "p-12",   usage: "increased spacing" },
  { name: "space-64", varName: "--space-64", px: 64, utility: "p-16",   usage: "increased spacing" },
  { name: "space-80", varName: "--space-80", px: 80, utility: "p-20",   usage: "increased spacing" },
]

function IconShowcase() {
  const [query, setQuery] = useState("")
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return q ? ICON_NAMES.filter((n) => n.includes(q)) : ICON_NAMES
  }, [query])
  const sizes = ["2xs", "xs", "sm", "md", "lg"] as const

  return (
    <div className="space-y-8">
      <div className="rounded-xl bg-[var(--color-primary-background-color)] p-6 border border-[var(--color-layout-border-color)]">
        <Text variant="t2" weight="semibold" className="mb-4 text-[var(--color-secondary-text-color)] uppercase tracking-wide">
          Sizes
        </Text>
        <div className="flex items-end gap-10">
          {sizes.map((size) => (
            <div key={size} className="flex flex-col items-center gap-2">
              <Icon name="heart" size={size} />
              <Text variant="t3" className="font-mono text-[var(--color-secondary-text-color)]">
                {size}
              </Text>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-[var(--color-primary-background-color)] p-6 border border-[var(--color-layout-border-color)]">
        <Text variant="t2" weight="semibold" className="mb-4 text-[var(--color-secondary-text-color)] uppercase tracking-wide">
          Colors via currentColor
        </Text>
        <div className="flex flex-wrap items-center gap-10">
          {[
            { label: "icon (default)", className: undefined },
            { label: "text-primary-text-color", className: "text-[var(--color-primary-text-color)]" },
            { label: "primary", className: "text-[var(--color-primary-color)]" },
            { label: "positive", className: "text-[var(--color-positive-color)]" },
            { label: "warning", className: "text-[var(--color-warning-color)]" },
            { label: "negative", className: "text-[var(--color-negative-color)]" },
          ].map((c) => (
            <div key={c.label} className="flex flex-col items-center gap-2">
              <Icon name="badge-check" size="lg" className={c.className} />
              <Text variant="t3" className="font-mono text-[var(--color-secondary-text-color)]">
                {c.label}
              </Text>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-[var(--color-primary-background-color)] p-6 border border-[var(--color-layout-border-color)]">
        <div className="flex items-center justify-between gap-4 mb-4">
          <Text variant="t2" weight="semibold" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
            Library ({ICON_NAMES.length})
          </Text>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${ICON_NAMES.length} icons…`}
            className="w-72 rounded-md border border-[var(--color-ui-border-color)] bg-[var(--color-primary-background-color)] px-3 py-2 text-t2 text-[var(--color-primary-text-color)] outline-none focus-visible:border-[var(--color-primary-color)]"
          />
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-2">
          {filtered.map((n) => (
            <div
              key={n}
              className="flex flex-col items-center justify-center gap-2 rounded-md border border-[var(--color-layout-border-color)] p-3 hover:border-[var(--color-primary-color)] hover:text-[var(--color-primary-color)]"
            >
              <Icon name={n} size="md" aria-label={n} />
              <span className="truncate w-full text-center text-t3 font-mono text-[var(--color-secondary-text-color)]">
                {n}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-[var(--color-layout-border-color)] pt-10 pb-12">
      <Text as="h2" variant="h2" weight="semibold" className="mb-6 text-[var(--color-primary-text-color)]">
        {title}
      </Text>
      {children}
    </section>
  )
}

type ShowcaseTableRowData = {
  id: number
  name: string
  owner: string
  status: string
  color: "primary-subtle" | "positive-subtle" | "negative-subtle" | "warning-subtle"
  progress: number
  selected?: boolean
}

function ShowcaseTableRow({
  row,
  state,
}: {
  row: ShowcaseTableRowData
  state: "default" | "selected"
}) {
  const ownerInitials = row.owner
    .split(/\s+/)
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase()
  return (
    <>
      <TableCell variant="control" state={state} interactive>
        <Checkbox checked={state === "selected"} aria-label={`Select ${row.name}`} />
      </TableCell>
      <TableCell state={state} interactive>
        <span className="text-[var(--color-secondary-text-color)]">{row.id}</span>
      </TableCell>
      <TableCell state={state} interactive>
        <span className="flex-1 truncate">{row.name}</span>
      </TableCell>
      <TableCell state={state} interactive>
        <Avatar size="sm" type="initials" initials={ownerInitials} />
        <span className="flex-1 truncate">{row.owner}</span>
      </TableCell>
      <TableCell state={state} interactive>
        <Chip type={row.color}>{row.status}</Chip>
      </TableCell>
      <TableCell state={state} interactive>
        <LinearProgressBar
          size="sm"
          type={row.color === "negative-subtle" ? "negative" : row.color === "positive-subtle" ? "positive" : "primary"}
          value={row.progress}
          showLabel
          className="flex-1"
        />
      </TableCell>
      <TableCell variant="control" state={state} interactive>
        <IconButton
          icon="ellipsis-vertical"
          size="sm"
          kind="tertiary"
          aria-label={`Actions for ${row.name}`}
        />
      </TableCell>
    </>
  )
}

function Swatch({ name, varName }: { name: string; varName: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className="h-20 w-full rounded-lg border border-[var(--color-layout-border-color)]"
        style={{ background: `var(${varName})` }}
      />
      <div className="flex flex-col">
        <Text variant="t3" weight="semibold" className="text-[var(--color-primary-text-color)]">
          {name}
        </Text>
        <Text variant="t3" className="text-[var(--color-secondary-text-color)] font-mono">
          {varName}
        </Text>
      </div>
    </div>
  )
}

function TipseenShowcaseFooter() {
  const [step, setStep] = useState(2)
  return (
    <>
      <TipseenAction onClick={() => setStep((s) => Math.max(0, s - 1))}>Back</TipseenAction>
      <Steps
        count={7}
        value={step}
        onValueChange={setStep}
        type="gallery-only"
        onColor="primary"
        aria-label="Tipseen progress"
        className="flex-1 justify-center"
      />
      <TipseenAction kind="primary" onClick={() => setStep((s) => Math.min(6, s + 1))}>
        Next
      </TipseenAction>
    </>
  )
}

export function Showcase() {
  return (
    <main className="min-h-screen text-[var(--color-primary-text-color)]">
      <div className="mx-auto max-w-6xl px-8 py-16">
        <header className="mb-12">
          <Text as="p" variant="t3" weight="semibold" className="text-[var(--color-primary-color)] uppercase tracking-widest mb-3">
            Timeworks Design System · v1
          </Text>
          <Text as="h1" variant="h1" weight="bold" className="mb-4">
            Foundations showcase
          </Text>
          <Text variant="t1" className="text-[var(--color-secondary-text-color)] max-w-2xl">
            A live preview of the tokens and components built so far. As components ship, they’ll be added here
            alongside their canonical states.
          </Text>
        </header>

        <Section title="Typography">
          <div className="space-y-6 rounded-xl bg-[var(--color-primary-background-color)] p-8 border border-[var(--color-layout-border-color)]">
            <div>
              <Text variant="t3" className="text-[var(--color-secondary-text-color)] mb-1">h1 · Montserrat 32/40</Text>
              <Text variant="h1" weight="bold">The quick brown fox jumps over the lazy dog</Text>
            </div>
            <div>
              <Text variant="t3" className="text-[var(--color-secondary-text-color)] mb-1">h2 · Montserrat 24/30</Text>
              <Text variant="h2" weight="semibold">The quick brown fox jumps over the lazy dog</Text>
            </div>
            <div>
              <Text variant="t3" className="text-[var(--color-secondary-text-color)] mb-1">h3 · Montserrat 18/24</Text>
              <Text variant="h3" weight="semibold">The quick brown fox jumps over the lazy dog</Text>
            </div>
            <div>
              <Text variant="t3" className="text-[var(--color-secondary-text-color)] mb-1">t1 · Karla 16/22</Text>
              <Text variant="t1">The quick brown fox jumps over the lazy dog</Text>
            </div>
            <div>
              <Text variant="t3" className="text-[var(--color-secondary-text-color)] mb-1">t2 · Karla 14/20</Text>
              <Text variant="t2">The quick brown fox jumps over the lazy dog</Text>
            </div>
            <div>
              <Text variant="t3" className="text-[var(--color-secondary-text-color)] mb-1">t3 · Karla 12/16</Text>
              <Text variant="t3">The quick brown fox jumps over the lazy dog</Text>
            </div>

            <div className="pt-4 border-t border-[var(--color-layout-border-color)]">
              <Text variant="t3" className="text-[var(--color-secondary-text-color)] mb-2">Weights (t1)</Text>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                <Text variant="t1" weight="regular">Regular</Text>
                <Text variant="t1" weight="medium">Medium</Text>
                <Text variant="t1" weight="semibold">Semibold</Text>
                <Text variant="t1" weight="bold">Bold</Text>
                <Text variant="t1" link>Underlined link</Text>
              </div>
            </div>
          </div>
        </Section>

        <Section title="Color palette">
          <div className="space-y-10">
            {COLOR_GROUPS.map((group) => (
              <div key={group.heading}>
                <Text variant="t2" weight="semibold" className="mb-4 text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                  {group.heading}
                </Text>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                  {group.swatches.map((s) => (
                    <Swatch key={s.varName} name={s.name} varName={s.varName} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Elevation">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {SHADOWS.map((s) => (
              <div key={s.varName} className="flex flex-col items-center gap-4 p-6 rounded-xl bg-[var(--color-allgrey-background-color)]">
                <div
                  className="h-24 w-24 rounded-xl bg-[var(--color-primary-background-color)]"
                  style={{ boxShadow: `var(${s.varName})` }}
                />
                <div className="text-center">
                  <Text variant="t2" weight="semibold">{s.name}</Text>
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)]">{s.usage}</Text>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Border radius">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
            {RADII.map((r) => (
              <div key={r.utility} className="flex flex-col items-center gap-4 p-6 rounded-xl bg-[var(--color-allgrey-background-color)]">
                <div
                  className="h-20 w-20 bg-[var(--color-primary-color)]"
                  style={{ borderRadius: r.radius }}
                />
                <div className="text-center">
                  <Text variant="t2" weight="semibold">{r.name}</Text>
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] font-mono">{r.utility}</Text>
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)]">{r.usage}</Text>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Spacing">
          <div className="rounded-xl bg-[var(--color-primary-background-color)] p-8 border border-[var(--color-layout-border-color)]">
            <Text variant="t3" className="text-[var(--color-secondary-text-color)] mb-6 max-w-2xl">
              The spacing scale is sourced from the TimeWorks Figma file (page “Spacing”, node 46814:2218). Each token
              is registered as a CSS variable. Values map 1:1 with Tailwind v4’s default 4px-step utilities, so
              <span className="font-mono"> p-1 </span>(4px) and <span className="font-mono">p-2</span> (8px) match
              the design tokens by pixel value.
            </Text>
            <div className="space-y-2">
              <div className="grid grid-cols-[180px_minmax(0,1fr)_220px_minmax(0,1fr)] items-center gap-x-6 pb-2 border-b border-[var(--color-layout-border-color)]">
                <Text variant="t3" weight="semibold" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">Token</Text>
                <Text variant="t3" weight="semibold" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">Value</Text>
                <Text variant="t3" weight="semibold" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">Tailwind utility</Text>
                <Text variant="t3" weight="semibold" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">Usage</Text>
              </div>
              {SPACING.map((s) => (
                <div
                  key={s.varName}
                  className="grid grid-cols-[180px_minmax(0,1fr)_220px_minmax(0,1fr)] items-center gap-x-6 py-2 border-b border-[var(--color-layout-border-color)] last:border-b-0"
                >
                  <div className="flex flex-col">
                    <Text variant="t2" weight="semibold" className="font-mono">{s.name}</Text>
                    <Text variant="t3" className="text-[var(--color-secondary-text-color)] font-mono">{s.varName}</Text>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className="h-3 rounded-sm bg-[var(--color-primary-color)]"
                      style={{ width: `var(${s.varName})` }}
                      aria-hidden
                    />
                    <Text variant="t3" className="text-[var(--color-secondary-text-color)] font-mono">{s.px}px</Text>
                  </div>
                  <Text variant="t3" className="font-mono">{s.utility}</Text>
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)]">{s.usage}</Text>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section title="Icons">
          <IconShowcase />
        </Section>

        <Section title="Components">
          <div className="space-y-8">
            <div className="rounded-xl bg-[var(--color-primary-background-color)] p-8 border border-[var(--color-layout-border-color)]">
              <Text variant="t2" weight="semibold" className="mb-4 text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                Accordion · single, collapsible
              </Text>
              <div className="max-w-md">
                <Accordion type="single" collapsible defaultValue="notifications">
                  <AccordionItem value="notifications">
                    <AccordionTrigger icon="bell">Notifications</AccordionTrigger>
                    <AccordionContent>
                      Get notified when teammates mention you, assign you a task, or comment on
                      something you follow.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="privacy">
                    <AccordionTrigger icon="lock">Privacy</AccordionTrigger>
                    <AccordionContent>
                      Control who can see your profile, what data is shared with workspaces you
                      join, and how long activity logs are retained.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="appearance" disabled>
                    <AccordionTrigger icon="gears">Appearance (disabled)</AccordionTrigger>
                    <AccordionContent>
                      Pick light or dark theme, density, and accent color.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>

            <div className="rounded-xl bg-[var(--color-primary-background-color)] p-8 border border-[var(--color-layout-border-color)] space-y-6">
              <Text variant="t2" weight="semibold" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                Button · kind × size × color
              </Text>
              <div className="space-y-5">
                <div className="flex flex-wrap items-center gap-3">
                  <Button kind="primary">Primary</Button>
                  <Button kind="secondary">Secondary</Button>
                  <Button kind="tertiary">Tertiary</Button>
                  <Button kind="brand">Brand</Button>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="lg">Large</Button>
                  <Button size="md">Medium</Button>
                  <Button size="sm">Small</Button>
                  <Button size="xs">XS</Button>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Button color="primary">Primary</Button>
                  <Button color="negative">Negative</Button>
                  <Button color="positive">Positive</Button>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Button kind="secondary" color="primary">Primary</Button>
                  <Button kind="secondary" color="negative">Negative</Button>
                  <Button kind="secondary" color="positive">Positive</Button>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Button iconLeft="circle-check">Confirm</Button>
                  <Button kind="secondary" iconRight="arrow-right">Continue</Button>
                  <Button loading>Saving</Button>
                  <Button disabled>Disabled</Button>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-[var(--color-primary-background-color)] p-8 border border-[var(--color-layout-border-color)] space-y-6">
              <Text variant="t2" weight="semibold" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                Button group · variant × size
              </Text>
              <div className="space-y-5">
                <div className="flex flex-wrap items-center gap-6">
                  <ButtonGroup aria-label="Default variant" defaultValue="week">
                    <ButtonGroupItem value="day">Day</ButtonGroupItem>
                    <ButtonGroupItem value="week">Week</ButtonGroupItem>
                    <ButtonGroupItem value="month">Month</ButtonGroupItem>
                    <ButtonGroupItem value="quarter">Quarter</ButtonGroupItem>
                    <ButtonGroupItem value="year">Year</ButtonGroupItem>
                  </ButtonGroup>
                  <ButtonGroup variant="tertiary" aria-label="Tertiary variant" defaultValue="week">
                    <ButtonGroupItem value="day">Day</ButtonGroupItem>
                    <ButtonGroupItem value="week">Week</ButtonGroupItem>
                    <ButtonGroupItem value="month">Month</ButtonGroupItem>
                    <ButtonGroupItem value="quarter">Quarter</ButtonGroupItem>
                    <ButtonGroupItem value="year">Year</ButtonGroupItem>
                  </ButtonGroup>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <ButtonGroup size="sm" aria-label="Small" defaultValue="day">
                    <ButtonGroupItem value="day">Day</ButtonGroupItem>
                    <ButtonGroupItem value="week">Week</ButtonGroupItem>
                    <ButtonGroupItem value="month">Month</ButtonGroupItem>
                  </ButtonGroup>
                  <ButtonGroup size="md" aria-label="Medium" defaultValue="day">
                    <ButtonGroupItem value="day">Day</ButtonGroupItem>
                    <ButtonGroupItem value="week">Week</ButtonGroupItem>
                    <ButtonGroupItem value="month">Month</ButtonGroupItem>
                  </ButtonGroup>
                  <ButtonGroup size="lg" aria-label="Large" defaultValue="day">
                    <ButtonGroupItem value="day">Day</ButtonGroupItem>
                    <ButtonGroupItem value="week">Week</ButtonGroupItem>
                    <ButtonGroupItem value="month">Month</ButtonGroupItem>
                  </ButtonGroup>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <ButtonGroup disabled aria-label="Disabled" defaultValue="day">
                    <ButtonGroupItem value="day">Day</ButtonGroupItem>
                    <ButtonGroupItem value="week">Week</ButtonGroupItem>
                    <ButtonGroupItem value="month">Month</ButtonGroupItem>
                  </ButtonGroup>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-[var(--color-primary-background-color)] p-8 border border-[var(--color-layout-border-color)] space-y-6">
              <Text variant="t2" weight="semibold" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                Split button · kind × size × color
              </Text>
              <div className="space-y-5">
                <div className="flex flex-wrap items-center gap-3">
                  <SplitButton
                    kind="primary"
                    icon="hexagon-image"
                    menu={
                      <Menu>
                        <ListItem icon="copy">Save as…</ListItem>
                        <ListItem icon="folder">Save a copy</ListItem>
                      </Menu>
                    }
                  >
                    Primary
                  </SplitButton>
                  <SplitButton
                    kind="secondary"
                    icon="hexagon-image"
                    menu={
                      <Menu>
                        <ListItem icon="copy">Save as…</ListItem>
                        <ListItem icon="folder">Save a copy</ListItem>
                      </Menu>
                    }
                  >
                    Secondary
                  </SplitButton>
                  <SplitButton
                    kind="tertiary"
                    icon="hexagon-image"
                    menu={
                      <Menu>
                        <ListItem icon="copy">Save as…</ListItem>
                        <ListItem icon="folder">Save a copy</ListItem>
                      </Menu>
                    }
                  >
                    Tertiary
                  </SplitButton>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <SplitButton size="lg" menu={<Menu><ListItem>Option</ListItem></Menu>}>Large</SplitButton>
                  <SplitButton size="md" menu={<Menu><ListItem>Option</ListItem></Menu>}>Medium</SplitButton>
                  <SplitButton size="sm" menu={<Menu><ListItem>Option</ListItem></Menu>}>Small</SplitButton>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <SplitButton color="primary" menu={<Menu><ListItem>Option</ListItem></Menu>}>Primary</SplitButton>
                  <SplitButton color="negative" menu={<Menu><ListItem>Option</ListItem></Menu>}>Negative</SplitButton>
                  <SplitButton color="positive" menu={<Menu><ListItem>Option</ListItem></Menu>}>Positive</SplitButton>
                  <SplitButton color="inverted" menu={<Menu><ListItem>Option</ListItem></Menu>}>Inverted</SplitButton>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <SplitButton icon="hexagon-image" iconPosition="left" menu={<Menu><ListItem>Option</ListItem></Menu>}>Left</SplitButton>
                  <SplitButton icon="hexagon-image" iconPosition="right" menu={<Menu><ListItem>Option</ListItem></Menu>}>Right</SplitButton>
                  <SplitButton icon="hexagon-image" iconPosition="only" triggerAriaLabel="More" menu={<Menu><ListItem>Option</ListItem></Menu>}>Only</SplitButton>
                  <SplitButton disabled menu={<Menu><ListItem>Option</ListItem></Menu>}>Disabled</SplitButton>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-[var(--color-primary-background-color)] p-8 border border-[var(--color-layout-border-color)] space-y-6">
              <Text variant="t2" weight="semibold" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                Checkbox · state × label
              </Text>
              <div className="grid grid-cols-[auto_auto_auto] gap-x-10 gap-y-4 items-center">
                <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">Unchecked</Text>
                <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">Checked</Text>
                <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">Indeterminate</Text>

                <Checkbox>Regular</Checkbox>
                <Checkbox defaultChecked>Regular</Checkbox>
                <Checkbox checked="indeterminate">Regular</Checkbox>

                <Checkbox disabled>Disabled</Checkbox>
                <Checkbox checked disabled>Disabled</Checkbox>
                <Checkbox checked="indeterminate" disabled>Disabled</Checkbox>

                <Checkbox error>Error</Checkbox>
                <Checkbox error defaultChecked>Error</Checkbox>
                <Checkbox error checked="indeterminate">Error</Checkbox>
              </div>
              <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-[var(--color-layout-border-color)]">
                <Checkbox aria-label="Box only" />
                <Checkbox aria-label="Box only checked" defaultChecked />
                <Checkbox aria-label="Box only indeterminate" checked="indeterminate" />
                <Checkbox aria-label="Box only disabled" disabled />
                <Checkbox aria-label="Box only error" error />
              </div>
            </div>

            <div className="rounded-xl bg-[var(--color-primary-background-color)] p-8 border border-[var(--color-layout-border-color)] space-y-6">
              <Text variant="t2" weight="semibold" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                RadioGroup · orientation × state
              </Text>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                <div className="flex flex-col gap-2">
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">Vertical</Text>
                  <RadioGroup defaultValue="work-management" aria-label="Workspace vertical">
                    <Radio value="work-management">Work management</Radio>
                    <Radio value="workforms">WorkForms</Radio>
                    <Radio value="marketer">Marketer</Radio>
                    <Radio value="projects">Projects</Radio>
                  </RadioGroup>
                </div>
                <div className="flex flex-col gap-2">
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">Horizontal</Text>
                  <RadioGroup orientation="horizontal" defaultValue="day" aria-label="View horizontal">
                    <Radio value="day">Day</Radio>
                    <Radio value="week">Week</Radio>
                    <Radio value="month">Month</Radio>
                    <Radio value="year">Year</Radio>
                  </RadioGroup>
                </div>
                <div className="flex flex-col gap-2">
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">Disabled</Text>
                  <RadioGroup defaultValue="b" disabled aria-label="Disabled">
                    <Radio value="a">Disabled unselected</Radio>
                    <Radio value="b">Disabled selected</Radio>
                  </RadioGroup>
                </div>
                <div className="flex flex-col gap-2">
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">Error</Text>
                  <RadioGroup error aria-label="Error" helperText="Please pick one of the options">
                    <Radio value="a">Work management</Radio>
                    <Radio value="b">WorkForms</Radio>
                    <Radio value="c">Marketer</Radio>
                  </RadioGroup>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-[var(--color-layout-border-color)]">
                <RadioGroup orientation="horizontal" defaultValue="b" aria-label="Box only">
                  <Radio value="a" aria-label="Option A" />
                  <Radio value="b" aria-label="Option B" />
                  <Radio value="c" aria-label="Option C" />
                  <Radio value="d" aria-label="Option D" disabled />
                </RadioGroup>
              </div>
            </div>

            <div className="rounded-xl bg-[var(--color-primary-background-color)] p-8 border border-[var(--color-layout-border-color)] space-y-6">
              <Text variant="t2" weight="semibold" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                Toggle · size × state × disabled
              </Text>
              <div className="grid grid-cols-[auto_auto_auto_auto] gap-x-10 gap-y-4 items-center">
                <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">Off</Text>
                <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">On</Text>
                <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">Off · disabled</Text>
                <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">On · disabled</Text>

                <Toggle />
                <Toggle defaultChecked />
                <Toggle disabled />
                <Toggle defaultChecked disabled />

                <Toggle size="sm" />
                <Toggle size="sm" defaultChecked />
                <Toggle size="sm" disabled />
                <Toggle size="sm" defaultChecked disabled />
              </div>
              <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-[var(--color-layout-border-color)]">
                <Toggle labelOff={null} labelOn={null} aria-label="Bare off" />
                <Toggle labelOff={null} labelOn={null} aria-label="Bare on" defaultChecked />
                <Toggle size="sm" labelOff={null} labelOn={null} aria-label="Bare off small" />
                <Toggle size="sm" labelOff={null} labelOn={null} aria-label="Bare on small" defaultChecked />
                <Toggle labelOff={null} labelOn="Email notifications" defaultChecked />
              </div>
            </div>

            <div className="rounded-xl bg-[var(--color-primary-background-color)] p-8 border border-[var(--color-layout-border-color)] space-y-6">
              <Text variant="t2" weight="semibold" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                Avatar · type × size × disabled
              </Text>
              <div className="space-y-5">
                {(["img", "initials", "letter", "icon"] as const).map((type) => (
                  <div key={type} className="flex flex-wrap items-end gap-4">
                    <span className="w-20 text-t3 text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                      {type}
                    </span>
                    {(["lg", "md", "sm", "xs"] as const).map((size) => (
                      <Avatar
                        key={`${type}-${size}`}
                        type={type}
                        size={size}
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=faces"
                        alt="Riley M."
                        initials="RM"
                        letter="F"
                        icon="users-grp"
                      />
                    ))}
                    <span className="w-20 text-t3 text-[var(--color-secondary-text-color)] uppercase tracking-wide pl-6">
                      disabled
                    </span>
                    {(["lg", "md", "sm", "xs"] as const).map((size) => (
                      <Avatar
                        key={`${type}-${size}-d`}
                        type={type}
                        size={size}
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=faces"
                        alt="Riley M."
                        initials="RM"
                        letter="F"
                        icon="users-grp"
                        disabled
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-[var(--color-primary-background-color)] p-8 border border-[var(--color-layout-border-color)] space-y-6">
              <Text variant="t2" weight="semibold" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                Avatar group · size × theme × disabled
              </Text>
              <div className="space-y-5">
                {(["lg", "md", "sm", "xs"] as const).map((size) => (
                  <div key={size} className="flex flex-wrap items-center gap-8">
                    <span className="w-20 text-t3 text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                      {size}
                    </span>
                    <AvatarGroup size={size} max={3} counterText="+10">
                      {[
                        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=faces",
                        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&fit=crop&crop=faces",
                        "https://images.unsplash.com/photo-1545996124-0501ebae84d0?w=96&h=96&fit=crop&crop=faces",
                      ].map((src, i) => (
                        <Avatar key={i} src={src} alt={`Member ${i + 1}`} />
                      ))}
                    </AvatarGroup>
                    <AvatarGroup size={size} theme="dark" max={3} counterText="+10">
                      {[
                        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=faces",
                        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&fit=crop&crop=faces",
                        "https://images.unsplash.com/photo-1545996124-0501ebae84d0?w=96&h=96&fit=crop&crop=faces",
                      ].map((src, i) => (
                        <Avatar key={i} src={src} alt={`Member ${i + 1}`} />
                      ))}
                    </AvatarGroup>
                    <AvatarGroup size={size} max={3} counterText="+10" disabled>
                      {[
                        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=faces",
                        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&fit=crop&crop=faces",
                        "https://images.unsplash.com/photo-1545996124-0501ebae84d0?w=96&h=96&fit=crop&crop=faces",
                      ].map((src, i) => (
                        <Avatar key={i} src={src} alt={`Member ${i + 1}`} />
                      ))}
                    </AvatarGroup>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-[var(--color-primary-background-color)] p-8 border border-[var(--color-layout-border-color)] space-y-6">
              <Text variant="t2" weight="semibold" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                Icon button · kind × size × state
              </Text>
              <div className="space-y-5">
                {(["primary", "secondary", "tertiary", "brand"] as const).map((kind) => (
                  <div key={kind} className="flex flex-wrap items-center gap-3">
                    <span className="w-20 text-t3 text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                      {kind}
                    </span>
                    <IconButton kind={kind} size="lg" icon="ellipsis" aria-label={`${kind} large`} />
                    <IconButton kind={kind} size="md" icon="ellipsis" aria-label={`${kind} medium`} />
                    <IconButton kind={kind} size="sm" icon="ellipsis" aria-label={`${kind} small`} />
                    <IconButton kind={kind} size="xs" icon="ellipsis" aria-label={`${kind} xs`} />
                    <IconButton kind={kind} size="xxs" icon="ellipsis" aria-label={`${kind} xxs`} />
                    <span className="w-16 text-t3 text-[var(--color-secondary-text-color)] uppercase tracking-wide pl-4">
                      states
                    </span>
                    <IconButton kind={kind} icon="ellipsis" aria-label={`${kind} active`} active />
                    <IconButton kind={kind} icon="ellipsis" aria-label={`${kind} loading`} loading />
                    <IconButton kind={kind} icon="ellipsis" aria-label={`${kind} disabled`} disabled />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-[var(--color-primary-background-color)] p-8 border border-[var(--color-layout-border-color)] space-y-6">
              <Text variant="t2" weight="semibold" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                Alert banner · type × layout
              </Text>
              <div className="space-y-6">
                {(
                  [
                    { label: "Link", layout: "link" as const },
                    { label: "Button", layout: "button" as const },
                    { label: "Link + button", layout: "link+button" as const },
                  ]
                ).map(({ label, layout }) => (
                  <div key={label} className="space-y-2">
                    <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                      {label}
                    </Text>
                    <div className="space-y-2">
                      {(["primary", "negative", "positive", "warning", "dark"] as const).map(
                        (type) => (
                          <AlertBanner
                            key={`${layout}-${type}`}
                            type={type}
                            cta={
                              layout === "link" || layout === "link+button"
                                ? { label: "this is a CTA" }
                                : undefined
                            }
                            action={
                              layout === "button" || layout === "link+button"
                                ? { label: "Title" }
                                : undefined
                            }
                            onDismiss={() => {}}
                          >
                            Alert banner message
                          </AlertBanner>
                        ),
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-[var(--color-primary-background-color)] p-8 border border-[var(--color-layout-border-color)] space-y-6">
              <Text variant="t2" weight="semibold" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                Attention box · type × layout
              </Text>
              <div className="space-y-6">
                {(
                  [
                    { label: "Default · with title", layout: "with-title" as const },
                    { label: "Default · no title", layout: "no-title" as const },
                    { label: "Compact", layout: "compact" as const },
                  ]
                ).map(({ label, layout }) => (
                  <div key={label} className="space-y-2">
                    <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                      {label}
                    </Text>
                    <div className="space-y-2 max-w-[640px]">
                      {(["primary", "neutral", "positive", "warning", "negative"] as const).map(
                        (type) => (
                          <AttentionBox
                            key={`${layout}-${type}`}
                            type={type}
                            compact={layout === "compact"}
                            title={layout === "with-title" ? "Attention box title" : undefined}
                            cta={{ label: "Read more" }}
                            action={{ label: "Button" }}
                            onDismiss={() => {}}
                          >
                            This action will cause your team to lose access to the account
                            until you will use the correct SSO source.
                          </AttentionBox>
                        ),
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-[var(--color-primary-background-color)] p-8 border border-[var(--color-layout-border-color)] space-y-6">
              <Text variant="t2" weight="semibold" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                Toast · type × button × link × loader
              </Text>
              <div className="space-y-6">
                {(
                  [
                    { label: "Link + button", layout: "link+button" as const },
                    { label: "Button only", layout: "button" as const },
                    { label: "Link only", layout: "link" as const },
                    { label: "Message only", layout: "message" as const },
                    { label: "Loading", layout: "loading" as const },
                  ]
                ).map(({ label, layout }) => (
                  <div key={label} className="space-y-2">
                    <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                      {label}
                    </Text>
                    <div className="flex flex-col items-start gap-2">
                      {(["primary", "negative", "positive", "warning", "dark"] as const).map(
                        (type) => (
                          <Toast
                            key={`${layout}-${type}`}
                            type={type}
                            cta={
                              layout === "link" || layout === "link+button"
                                ? { label: "Link to action" }
                                : undefined
                            }
                            action={
                              layout === "button" || layout === "link+button"
                                ? { label: "Button" }
                                : undefined
                            }
                            loading={layout === "loading"}
                            onDismiss={() => {}}
                          >
                            General message toast
                          </Toast>
                        ),
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-[var(--color-primary-background-color)] p-8 border border-[var(--color-layout-border-color)] space-y-6">
              <Text variant="t2" weight="semibold" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                Badge · indicator × counter × anchor
              </Text>
              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-10">
                  <span className="w-28 text-t3 text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                    Indicator
                  </span>
                  <Badge type="indicator">
                    <Button>Button</Button>
                  </Badge>
                  <Badge type="indicator">
                    <IconButton icon="bell" aria-label="Notifications" />
                  </Badge>
                  <Badge type="indicator" anchor="round">
                    <Avatar
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=faces"
                      alt="Riley M."
                    />
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-10">
                  <span className="w-28 text-t3 text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                    Counter
                  </span>
                  <Badge type="counter" count={3}>
                    <Button>Inbox</Button>
                  </Badge>
                  <Badge type="counter" count={42}>
                    <IconButton icon="bell" aria-label="Notifications" />
                  </Badge>
                  <Badge type="counter" count={120}>
                    <IconButton icon="bell" aria-label="Notifications" />
                  </Badge>
                  <Badge type="counter" count={5} anchor="round">
                    <Avatar
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=faces"
                      alt="Riley M."
                    />
                  </Badge>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-[var(--color-primary-background-color)] p-8 border border-[var(--color-layout-border-color)] space-y-6">
              <Text variant="t2" weight="semibold" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                Counter · color × kind × size
              </Text>
              <div className="space-y-5">
                {(["lg", "sm"] as const).map((size) => (
                  <div key={size} className="flex flex-wrap items-center gap-4">
                    <span className="w-24 text-t3 text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                      {size === "lg" ? "Large · 24" : "Small · 18"}
                    </span>
                    {(["fill", "line"] as const).map((kind) =>
                      (["primary", "negative", "dark", "light"] as const).map((color) => (
                        <Counter
                          key={`${size}-${kind}-${color}`}
                          size={size}
                          kind={kind}
                          color={color}
                          count={5}
                        />
                      ))
                    )}
                  </div>
                ))}
                <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-[var(--color-layout-border-color)]">
                  <span className="w-24 text-t3 text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                    Overflow
                  </span>
                  <Counter count={3} />
                  <Counter count={42} />
                  <Counter count={120} />
                  <Counter count={1500} max={999} />
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-[var(--color-primary-background-color)] p-8 border border-[var(--color-layout-border-color)] space-y-6">
              <Text variant="t2" weight="semibold" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                Breadcrumb · trail × overflow
              </Text>
              <div className="space-y-5">
                <Breadcrumb>
                  <BreadcrumbItem href="#" icon="hexagon-image">
                    Workspace
                  </BreadcrumbItem>
                  <BreadcrumbItem href="#">Projects</BreadcrumbItem>
                  <BreadcrumbItem href="#">Acme rebrand</BreadcrumbItem>
                  <BreadcrumbItem>Roadmap</BreadcrumbItem>
                </Breadcrumb>
                <Breadcrumb>
                  <BreadcrumbItem href="#" icon="hexagon-image">
                    Workspace
                  </BreadcrumbItem>
                  <BreadcrumbItem variant="children" href="#" aria-label="More" />
                  <BreadcrumbItem href="#">Acme rebrand</BreadcrumbItem>
                  <BreadcrumbItem>Roadmap</BreadcrumbItem>
                </Breadcrumb>
                <Breadcrumb>
                  <BreadcrumbItem href="#" icon="hexagon-image">
                    Workspace
                  </BreadcrumbItem>
                  <BreadcrumbItem disabled>Archived</BreadcrumbItem>
                  <BreadcrumbItem>Old plan</BreadcrumbItem>
                </Breadcrumb>
              </div>
            </div>

            <div className="rounded-xl bg-[var(--color-primary-background-color)] p-8 border border-[var(--color-layout-border-color)] space-y-6">
              <Text variant="t2" weight="semibold" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                Chip · type × icon × avatar × close
              </Text>
              <div className="space-y-5">
                <div className="flex flex-wrap items-center gap-3">
                  <Chip type="primary-subtle">Primary</Chip>
                  <Chip type="positive-subtle">Positive</Chip>
                  <Chip type="negative-subtle">Negative</Chip>
                  <Chip type="warning-subtle">Warning</Chip>
                  <Chip disabled>Disabled</Chip>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Chip icon="hexagon-image">Icon left</Chip>
                  <Chip icon="hexagon-image" iconPosition="right">
                    Icon right
                  </Chip>
                  <Chip type="positive-subtle" icon="circle-check">
                    Active
                  </Chip>
                  <Chip type="warning-subtle" icon="triangle-exclamation">
                    Pending
                  </Chip>
                  <Chip type="negative-subtle" icon="triangle-exclamation">
                    Failed
                  </Chip>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Chip
                    avatar={
                      <Avatar
                        size="xs"
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=faces"
                        alt="Riley M."
                      />
                    }
                  >
                    Riley M.
                  </Chip>
                  <Chip
                    type="positive-subtle"
                    avatar={<Avatar size="xs" type="initials" initials="JL" alt="Jordan L." />}
                  >
                    Jordan L.
                  </Chip>
                  <Chip onClose={() => {}}>Dismissable</Chip>
                  <Chip type="negative-subtle" onClose={() => {}}>
                    Remove
                  </Chip>
                  <Chip
                    icon="hexagon-image"
                    onClose={() => {}}
                  >
                    Icon + close
                  </Chip>
                </div>
                <div className="flex flex-wrap items-center gap-3 p-4 rounded-md bg-[var(--color-primary-selected-color)]">
                  <span className="text-t3 text-[var(--color-secondary-text-color)] uppercase tracking-wide mr-2">
                    On selected
                  </span>
                  <Chip type="on-primary">On surface</Chip>
                  <Chip type="on-primary" onClose={() => {}}>
                    With close
                  </Chip>
                </div>
                <div className="flex flex-wrap items-center gap-3 p-4 rounded-md bg-[var(--color-warning-color-selected)]">
                  <span className="text-t3 text-[var(--color-secondary-text-color)] uppercase tracking-wide mr-2">
                    On warning
                  </span>
                  <Chip type="on-warning">On surface</Chip>
                  <Chip type="on-warning" icon="triangle-exclamation">
                    With icon
                  </Chip>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-[var(--color-primary-background-color)] p-8 border border-[var(--color-layout-border-color)] space-y-6">
              <Text variant="t2" weight="semibold" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                Search · size × state
              </Text>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">Small (32)</Text>
                  <Search size="sm" placeholder="Placeholder text here" />
                  <Search size="sm" defaultValue="Searched text" />
                  <Search size="sm" placeholder="Disabled" disabled />
                  <Search
                    size="sm"
                    placeholder="With filter"
                    trailing={<IconButton kind="tertiary" size="xs" icon="hexagon-image" aria-label="Open filters" />}
                  />
                </div>
                <div className="space-y-3">
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">Medium (40)</Text>
                  <Search size="md" placeholder="Placeholder text here" />
                  <Search size="md" defaultValue="Searched text" />
                  <Search size="md" placeholder="Disabled" disabled />
                  <Search
                    size="md"
                    placeholder="With filter"
                    trailing={<IconButton kind="tertiary" size="sm" icon="hexagon-image" aria-label="Open filters" />}
                  />
                </div>
                <div className="space-y-3">
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">Large (48)</Text>
                  <Search size="lg" placeholder="Placeholder text here" />
                  <Search size="lg" defaultValue="Searched text" />
                  <Search size="lg" placeholder="Disabled" disabled />
                  <Search
                    size="lg"
                    placeholder="With filter"
                    trailing={<IconButton kind="tertiary" size="sm" icon="hexagon-image" aria-label="Open filters" />}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-[var(--color-primary-background-color)] p-8 border border-[var(--color-layout-border-color)] space-y-6">
              <Text variant="t2" weight="semibold" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                Text area · size × state
              </Text>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-3">
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">Large (16px)</Text>
                  <TextArea size="lg" label="Label" helperText="Information text" />
                  <TextArea size="lg" label="Error" state="error" helperText="Something went wrong" />
                  <TextArea size="lg" label="Positive" state="positive" helperText="Looks good" />
                  <TextArea size="lg" label="Disabled" state="disabled" helperText="Information text" />
                  <TextArea
                    size="lg"
                    label="Read-only"
                    state="readOnly"
                    helperText="Information text"
                    defaultValue="This content cannot be edited."
                  />
                </div>
                <div className="space-y-3">
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">Small (14px)</Text>
                  <TextArea size="sm" label="Label" helperText="Information text" />
                  <TextArea size="sm" label="Error" state="error" helperText="Something went wrong" />
                  <TextArea size="sm" label="Positive" state="positive" helperText="Looks good" />
                  <TextArea size="sm" label="Disabled" state="disabled" helperText="Information text" />
                  <TextArea
                    size="sm"
                    label="Read-only"
                    state="readOnly"
                    helperText="Information text"
                    defaultValue="This content cannot be edited."
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6 pt-4 border-t border-[var(--color-layout-border-color)]">
                <div className="space-y-2">
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">Required</Text>
                  <TextArea label="Description" required helperText="This field is required" />
                </div>
                <div className="space-y-2">
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">Character limit</Text>
                  <TextArea label="Bio" helperText="Tell us about yourself" characterLimit={200} defaultValue="A few words…" />
                </div>
                <div className="space-y-2">
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">6 rows · no resize</Text>
                  <TextArea label="Notes" rows={6} noResize helperText="Fixed height" />
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-[var(--color-primary-background-color)] p-8 border border-[var(--color-layout-border-color)] space-y-6">
              <Text variant="t2" weight="semibold" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                Text field · size × state
              </Text>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">Small (32)</Text>
                  <TextField size="sm" label="Default" helperText="Information text" />
                  <TextField size="sm" label="Error" state="error" helperText="Something went wrong" />
                  <TextField size="sm" label="Disabled" state="disabled" helperText="Information text" />
                  <TextField
                    size="sm"
                    label="Read-only"
                    state="readOnly"
                    helperText="Information text"
                    defaultValue="Read-only value"
                  />
                </div>
                <div className="space-y-3">
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">Medium (40)</Text>
                  <TextField size="md" label="Default" helperText="Information text" />
                  <TextField size="md" label="Error" state="error" helperText="Something went wrong" />
                  <TextField size="md" label="Disabled" state="disabled" helperText="Information text" />
                  <TextField
                    size="md"
                    label="Read-only"
                    state="readOnly"
                    helperText="Information text"
                    defaultValue="Read-only value"
                  />
                </div>
                <div className="space-y-3">
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">Large (48)</Text>
                  <TextField size="lg" label="Default" helperText="Information text" />
                  <TextField size="lg" label="Error" state="error" helperText="Something went wrong" />
                  <TextField size="lg" label="Disabled" state="disabled" helperText="Information text" />
                  <TextField
                    size="lg"
                    label="Read-only"
                    state="readOnly"
                    helperText="Information text"
                    defaultValue="Read-only value"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6 pt-4 border-t border-[var(--color-layout-border-color)]">
                <div className="space-y-2">
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">Required</Text>
                  <TextField
                    label="Email"
                    required
                    type="email"
                    placeholder="you@company.com"
                    helperText="This field is required"
                  />
                </div>
                <div className="space-y-2">
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">Leading icon</Text>
                  <TextField
                    label="Search"
                    leadingIcon="magnifying-glass"
                    placeholder="Find a project"
                    helperText="Press Enter to search"
                  />
                </div>
                <div className="space-y-2">
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">Character limit</Text>
                  <TextField
                    label="Title"
                    helperText="Keep it short"
                    characterLimit={50}
                    defaultValue="A few words…"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-[var(--color-primary-background-color)] p-8 border border-[var(--color-layout-border-color)] space-y-6">
              <Text variant="t2" weight="semibold" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                Editable heading · variant × weight
              </Text>
              <Text variant="t3" className="text-[var(--color-secondary-text-color)] -mt-2">
                Reads as a heading until you hover or focus it. Enter commits, Esc reverts.
              </Text>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-3">
                <div className="space-y-2">
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">H1 (32)</Text>
                  <EditableHeading variant="h1" weight="bold"     defaultValue="H1 Bold" />
                  <EditableHeading variant="h1" weight="semibold" defaultValue="H1 Medium" />
                  <EditableHeading variant="h1" weight="medium"   defaultValue="H1 Normal" />
                  <EditableHeading variant="h1" weight="regular"  defaultValue="H1 Light" />
                </div>
                <div className="space-y-2">
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">H2 (24)</Text>
                  <EditableHeading variant="h2" weight="bold"     defaultValue="H2 Bold" />
                  <EditableHeading variant="h2" weight="semibold" defaultValue="H2 Medium" />
                  <EditableHeading variant="h2" weight="medium"   defaultValue="H2 Normal" />
                  <EditableHeading variant="h2" weight="light"    defaultValue="H2 Light" />
                </div>
                <div className="space-y-2">
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">H3 (18)</Text>
                  <EditableHeading variant="h3" weight="bold"     defaultValue="H3 Bold" />
                  <EditableHeading variant="h3" weight="semibold" defaultValue="H3 Medium" />
                  <EditableHeading variant="h3" weight="medium"   defaultValue="H3 Normal" />
                  <EditableHeading variant="h3" weight="light"    defaultValue="H3 Light" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 border-t border-[var(--color-layout-border-color)]">
                <EditableHeading variant="h2" placeholder="Click to add a title…" />
                <EditableHeading variant="h2" defaultValue="Read-only" readOnly />
                <EditableHeading variant="h2" defaultValue="Disabled" disabled />
              </div>
            </div>

            <div className="rounded-xl bg-[var(--color-primary-background-color)] p-8 border border-[var(--color-layout-border-color)] space-y-6">
              <Text variant="t2" weight="semibold" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                Editable text · variant × weight
              </Text>
              <Text variant="t3" className="text-[var(--color-secondary-text-color)] -mt-2">
                Inline body-text input. Hover for the UI border, focus for the primary border. Enter commits, Esc reverts.
              </Text>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-3">
                <div className="space-y-2">
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">T1 (16)</Text>
                  <EditableText variant="t1" weight="bold"     defaultValue="T1 Bold" />
                  <EditableText variant="t1" weight="semibold" defaultValue="T1 Medium" />
                  <EditableText variant="t1" weight="regular"  defaultValue="T1 Normal" />
                </div>
                <div className="space-y-2">
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">T2 (14)</Text>
                  <EditableText variant="t2" weight="bold"     defaultValue="T2 Bold" />
                  <EditableText variant="t2" weight="semibold" defaultValue="T2 Medium" />
                  <EditableText variant="t2" weight="regular"  defaultValue="T2 Normal" />
                </div>
                <div className="space-y-2">
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">T3 (12)</Text>
                  <EditableText variant="t3" weight="semibold" defaultValue="T3 Medium" />
                  <EditableText variant="t3" weight="regular"  defaultValue="T3 Normal" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 border-t border-[var(--color-layout-border-color)]">
                <EditableText variant="t1" placeholder="Click to add text…" />
                <EditableText variant="t1" defaultValue="Read-only" readOnly />
                <EditableText variant="t1" defaultValue="Disabled" disabled />
              </div>
            </div>

            <div className="rounded-xl bg-[var(--color-primary-background-color)] p-8 border border-[var(--color-layout-border-color)] space-y-6">
              <Text variant="t2" weight="semibold" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                Label · color × kind × size
              </Text>
              <div className="space-y-5">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="w-24 text-t3 text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                    Fill · md
                  </span>
                  <Label kind="fill" color="primary">Primary</Label>
                  <Label kind="fill" color="positive">Positive</Label>
                  <Label kind="fill" color="negative">Negative</Label>
                  <Label kind="fill" color="dark">Dark</Label>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="w-24 text-t3 text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                    Line · md
                  </span>
                  <Label kind="line" color="primary">Primary</Label>
                  <Label kind="line" color="positive">Positive</Label>
                  <Label kind="line" color="negative">Negative</Label>
                  <Label kind="line" color="dark">Dark</Label>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="w-24 text-t3 text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                    Fill · sm
                  </span>
                  <Label size="sm" kind="fill" color="primary">Primary</Label>
                  <Label size="sm" kind="fill" color="positive">Positive</Label>
                  <Label size="sm" kind="fill" color="negative">Negative</Label>
                  <Label size="sm" kind="fill" color="dark">Dark</Label>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="w-24 text-t3 text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                    Line · sm
                  </span>
                  <Label size="sm" kind="line" color="primary">Primary</Label>
                  <Label size="sm" kind="line" color="positive">Positive</Label>
                  <Label size="sm" kind="line" color="negative">Negative</Label>
                  <Label size="sm" kind="line" color="dark">Dark</Label>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-[var(--color-primary-background-color)] p-8 border border-[var(--color-layout-border-color)] space-y-6">
              <Text variant="t2" weight="semibold" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                List item · variant × icon × state
              </Text>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">States</Text>
                  <Menu size="lg">
                    <ListItem icon="hexagon-image">Default</ListItem>
                    <ListItem icon="hexagon-image" rightIcon>Default + chevron</ListItem>
                    <ListItem active icon="hexagon-image" rightIcon>Active</ListItem>
                    <ListItem disabled icon="hexagon-image">Disabled</ListItem>
                    <ListItem disabled icon="hexagon-image" rightIcon>Disabled + chevron</ListItem>
                  </Menu>
                </div>
                <div className="space-y-2">
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">Avatar &amp; label</Text>
                  <Menu size="lg">
                    <ListItem
                      avatar={
                        <Avatar
                          size="xs"
                          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=faces"
                          alt="Riley M."
                        />
                      }
                    >
                      Riley M.
                    </ListItem>
                    <ListItem
                      rightIcon
                      avatar={<Avatar size="xs" type="initials" initials="JL" alt="Jordan L." />}
                    >
                      Jordan L.
                    </ListItem>
                    <ListItem icon="hexagon-image" label={{ children: "New", kind: "fill" }}>
                      Option 1
                    </ListItem>
                    <ListItem
                      avatar={<Avatar size="xs" type="initials" initials="DR" alt="Dana R." />}
                      label={{ children: "Owner", color: "positive" }}
                    >
                      Dana R.
                    </ListItem>
                  </Menu>
                </div>
                <div className="space-y-2">
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">Menu composition</Text>
                  <Menu size="lg">
                    <ListItem variant="category-title" icon="hexagon-image">Settings</ListItem>
                    <ListItem icon="user">Profile</ListItem>
                    <ListItem icon="bell" rightIcon>Notifications</ListItem>
                    <ListItem icon="gears" active>Preferences</ListItem>
                    <ListItem variant="divider" />
                    <ListItem variant="category-separator">Workspace</ListItem>
                    <ListItem icon="users-grp">Members</ListItem>
                    <ListItem icon="folder">Projects</ListItem>
                    <ListItem icon="lock" disabled>Billing</ListItem>
                    <ListItem variant="divider" />
                    <ListItem variant="information">No more results</ListItem>
                    <ListItem variant="button" icon="pen">Edit</ListItem>
                  </Menu>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-[var(--color-primary-background-color)] p-8 border border-[var(--color-layout-border-color)] space-y-6">
              <Text variant="t2" weight="semibold" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                Menu · size × content
              </Text>
              <div className="flex flex-wrap items-start gap-8">
                <div className="space-y-2">
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">Small</Text>
                  <Menu size="sm">
                    <ListItem>Option 1</ListItem>
                    <ListItem>Option 2</ListItem>
                    <ListItem>Option 3</ListItem>
                  </Menu>
                </div>
                <div className="space-y-2">
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">Medium</Text>
                  <Menu size="md">
                    <ListItem icon="user">Profile</ListItem>
                    <ListItem icon="bell" rightIcon>Notifications</ListItem>
                    <ListItem icon="gears" active>Settings</ListItem>
                  </Menu>
                </div>
                <div className="space-y-2">
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">Large · with caption + divider</Text>
                  <Menu size="lg">
                    <ListItem variant="category-separator">Account</ListItem>
                    <ListItem icon="user">Profile</ListItem>
                    <ListItem icon="bell" rightIcon>Notifications</ListItem>
                    <ListItem variant="divider" />
                    <ListItem variant="button" icon="arrow-right-from-bracket">Sign out</ListItem>
                  </Menu>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-[var(--color-primary-background-color)] p-8 border border-[var(--color-layout-border-color)] space-y-6">
              <Text variant="t2" weight="semibold" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                Combobox · size × dialog × button
              </Text>
              <div className="space-y-6">
                <div>
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide mb-3">
                    Dialog · with button
                  </Text>
                  <div className="flex flex-wrap items-start gap-6">
                    {(["sm", "md", "lg"] as const).map((size) => (
                      <Combobox
                        key={`d-btn-${size}`}
                        size={size}
                        button={{ label: "Edit", icon: "pen" }}
                        options={[
                          { value: "1", label: "Option 1" },
                          { value: "2", label: "Option 2" },
                          { value: "3", label: "Option 3" },
                          { value: "4", label: "Option 4" },
                          { value: "5", label: "Option 5" },
                          { value: "6", label: "Option 6" },
                          { value: "7", label: "Option 7" },
                          { value: "8", label: "Option 8" },
                        ]}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide mb-3">
                    Dialog · no button
                  </Text>
                  <div className="flex flex-wrap items-start gap-6">
                    {(["sm", "md", "lg"] as const).map((size) => (
                      <Combobox
                        key={`d-${size}`}
                        size={size}
                        options={[
                          { value: "1", label: "Option 1" },
                          { value: "2", label: "Option 2" },
                          { value: "3", label: "Option 3" },
                          { value: "4", label: "Option 4" },
                          { value: "5", label: "Option 5" },
                          { value: "6", label: "Option 6" },
                          { value: "7", label: "Option 7" },
                          { value: "8", label: "Option 8" },
                        ]}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide mb-3">
                    Flat · inline (no shadow)
                  </Text>
                  <div className="flex flex-wrap items-start gap-6">
                    {(["sm", "md", "lg"] as const).map((size) => (
                      <Combobox
                        key={`f-${size}`}
                        size={size}
                        dialog={false}
                        button={{ label: "Edit", icon: "pen" }}
                        options={[
                          { value: "1", label: "Option 1" },
                          { value: "2", label: "Option 2" },
                          { value: "3", label: "Option 3" },
                          { value: "4", label: "Option 4" },
                          { value: "5", label: "Option 5" },
                          { value: "6", label: "Option 6" },
                          { value: "7", label: "Option 7" },
                          { value: "8", label: "Option 8" },
                        ]}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6 rounded-xl bg-[var(--color-primary-background-color)] p-8 border border-[var(--color-layout-border-color)]">
              <div>
                <Text variant="t2" weight="semibold" className="mb-2 text-[var(--color-primary-text-color)]">
                  DatePicker
                </Text>
                <Text variant="t3" className="text-[var(--color-secondary-text-color)]">
                  Calendar surface for picking a single date or a date range. Mon-first weeks, optional two-month layout, optional white dialog surface, and pink / black theme treatments — sourced from Figma node 46939:7892.
                </Text>
              </div>

              <div className="space-y-8">
                <div>
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide mb-3">
                    Type · default · single · range
                  </Text>
                  <div className="flex flex-wrap items-start gap-6">
                    <DatePicker
                      mode="default"
                      defaultMonth={new Date(2023, 4, 1)}
                    />
                    <DatePicker
                      mode="single"
                      defaultMonth={new Date(2023, 4, 1)}
                      defaultValue={new Date(2023, 4, 12)}
                    />
                    <DatePicker
                      mode="range"
                      defaultMonth={new Date(2023, 4, 1)}
                      defaultValue={{ from: new Date(2023, 4, 9), to: new Date(2023, 4, 23) }}
                    />
                  </div>
                </div>

                <div>
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide mb-3">
                    Two months
                  </Text>
                  <DatePicker
                    mode="range"
                    numberOfMonths={2}
                    defaultMonth={new Date(2023, 4, 1)}
                    defaultValue={{ from: new Date(2023, 4, 9), to: new Date(2023, 5, 12) }}
                  />
                </div>

                <div>
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide mb-3">
                    Without dialog · inline
                  </Text>
                  <DatePicker
                    mode="single"
                    withDialog={false}
                    defaultMonth={new Date(2023, 4, 1)}
                    defaultValue={new Date(2023, 4, 12)}
                  />
                </div>

                <div>
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide mb-3">
                    Pink theme · black theme
                  </Text>
                  <div className="flex flex-wrap items-start gap-6">
                    <DatePicker
                      mode="single"
                      theme="pink"
                      defaultMonth={new Date(2023, 4, 1)}
                      defaultValue={new Date(2023, 4, 12)}
                    />
                    <DatePicker
                      mode="single"
                      theme="black"
                      defaultMonth={new Date(2023, 4, 1)}
                      defaultValue={new Date(2023, 4, 12)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-[var(--color-primary-background-color)] p-8 border border-[var(--color-layout-border-color)] space-y-6">
              <div>
                <Text variant="t2" weight="semibold" className="mb-2 text-[var(--color-primary-text-color)]">
                  Dropdown
                </Text>
                <Text variant="t3" className="text-[var(--color-secondary-text-color)]">
                  Trigger + popover for picking one option or several. Three sizes (sm/md/lg), states (default / error / disabled / read-only), and three types: single-select, multi-select with chips on a single row, and multi-select with chips that wrap. Sourced from Figma node 46946:1926.
                </Text>
              </div>

              <div className="space-y-8">
                <div>
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide mb-3">
                    Sizes · default
                  </Text>
                  <div className="flex flex-wrap items-start gap-6">
                    {(["sm", "md", "lg"] as const).map((size) => (
                      <div key={`d-size-${size}`} className="w-[304px]">
                        <Dropdown
                          size={size}
                          options={[
                            { value: "1", label: "Option 1" },
                            { value: "2", label: "Option 2" },
                            { value: "3", label: "Option 3" },
                            { value: "4", label: "Option 4" },
                          ]}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide mb-3">
                    States · selected · error · disabled · read-only
                  </Text>
                  <div className="flex flex-wrap items-start gap-6">
                    <div className="w-[304px]">
                      <Dropdown
                        size="lg"
                        defaultValue="2"
                        options={[
                          { value: "1", label: "Option 1" },
                          { value: "2", label: "Option 2" },
                          { value: "3", label: "Option 3" },
                          { value: "4", label: "Option 4" },
                        ]}
                      />
                    </div>
                    <div className="w-[304px]">
                      <Dropdown
                        size="lg"
                        error
                        options={[
                          { value: "1", label: "Option 1" },
                          { value: "2", label: "Option 2" },
                        ]}
                      />
                    </div>
                    <div className="w-[304px]">
                      <Dropdown
                        size="lg"
                        disabled
                        options={[
                          { value: "1", label: "Option 1" },
                          { value: "2", label: "Option 2" },
                        ]}
                      />
                    </div>
                    <div className="w-[304px]">
                      <Dropdown
                        size="lg"
                        readOnly
                        defaultValue="2"
                        options={[
                          { value: "1", label: "Option 1" },
                          { value: "2", label: "Option 2" },
                        ]}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide mb-3">
                    Open · single-select with active option
                  </Text>
                  <div className="flex flex-wrap items-start gap-6 pb-40">
                    <div className="w-[304px]">
                      <Dropdown
                        size="lg"
                        defaultOpen
                        manual
                        options={[
                          { value: "1", label: "Option 1" },
                          { value: "2", label: "Option 2" },
                          { value: "3", label: "Option 3" },
                          { value: "4", label: "Option 4" },
                        ]}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide mb-3">
                    Multi-select · chips on a single row
                  </Text>
                  <div className="flex flex-wrap items-start gap-6">
                    {(["sm", "md", "lg"] as const).map((size) => (
                      <div key={`d-multi-${size}`} className="w-[304px]">
                        <Dropdown
                          size={size}
                          multiSelect
                          defaultValue={["1", "2"]}
                          options={[
                            { value: "1", label: "Option 1" },
                            { value: "2", label: "Option 2" },
                            { value: "3", label: "Option 3" },
                            { value: "4", label: "Option 4" },
                          ]}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide mb-3">
                    Multi-select · chips wrap to multiple rows
                  </Text>
                  <div className="flex flex-wrap items-start gap-6">
                    {(["sm", "md", "lg"] as const).map((size) => (
                      <div key={`d-multiline-${size}`} className="w-[304px]">
                        <Dropdown
                          size={size}
                          multiSelect
                          multiLine
                          defaultValue={["1", "2", "3", "4"]}
                          options={[
                            { value: "1", label: "Option 1" },
                            { value: "2", label: "Option 2" },
                            { value: "3", label: "Option 3" },
                            { value: "4", label: "Option 4" },
                          ]}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-[var(--color-primary-background-color)] p-8 border border-[var(--color-layout-border-color)] space-y-6">
              <Text variant="t2" weight="semibold" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                Divider · orientation × usage
              </Text>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                    Horizontal · between content blocks
                  </Text>
                  <div className="flex flex-col gap-3 max-w-md">
                    <Text variant="t2" weight="semibold">Account</Text>
                    <Text variant="t3" className="text-[var(--color-secondary-text-color)]">
                      Profile, password, and connected services.
                    </Text>
                    <Divider />
                    <Text variant="t2" weight="semibold">Workspace</Text>
                    <Text variant="t3" className="text-[var(--color-secondary-text-color)]">
                      Members, billing, and integrations.
                    </Text>
                    <Divider />
                    <Text variant="t2" weight="semibold">Notifications</Text>
                    <Text variant="t3" className="text-[var(--color-secondary-text-color)]">
                      Choose what you get pinged about.
                    </Text>
                  </div>
                </div>
                <div className="space-y-2">
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                    Vertical · inline separators
                  </Text>
                  <div className="flex h-10 items-center gap-4">
                    <Text variant="t2">Inbox</Text>
                    <Divider orientation="vertical" />
                    <Text variant="t2">Drafts</Text>
                    <Divider orientation="vertical" />
                    <Text variant="t2">Archive</Text>
                    <Divider orientation="vertical" />
                    <Text variant="t2">Spam</Text>
                  </div>
                </div>
                <div className="space-y-2">
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                    Inside a card
                  </Text>
                  <div className="w-96 rounded-xl border border-[var(--color-layout-border-color)] bg-[var(--color-allgrey-background-color)] overflow-hidden">
                    <div className="flex items-center gap-3 p-4">
                      <Avatar
                        size="sm"
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=faces"
                        alt="Riley M."
                      />
                      <div className="flex flex-col">
                        <Text variant="t2" weight="semibold">Riley M.</Text>
                        <Text variant="t3" className="text-[var(--color-secondary-text-color)]">
                          riley@timeworks.app
                        </Text>
                      </div>
                    </div>
                    <Divider />
                    <div className="p-4">
                      <Text variant="t3" className="text-[var(--color-secondary-text-color)]">
                        Joined April 2024 · Admin
                      </Text>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-[var(--color-primary-background-color)] p-8 border border-[var(--color-layout-border-color)] space-y-6">
              <Text variant="t2" weight="semibold" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                Linear Progress Bar · type × size × label
              </Text>
              <Text variant="t3" className="text-[var(--color-secondary-text-color)] -mt-2">
                Continuous progress through a process. Single-colour types take a 0–100 value; the
                multi type stacks segments end-to-end for breakdowns.
              </Text>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                <div className="space-y-4">
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                    Small (4px) · with label
                  </Text>
                  <LinearProgressBar size="sm" type="primary"  value={30} showLabel />
                  <LinearProgressBar size="sm" type="positive" value={72} showLabel />
                  <LinearProgressBar size="sm" type="negative" value={18} showLabel />
                </div>
                <div className="space-y-4">
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                    Small (4px) · no label
                  </Text>
                  <LinearProgressBar size="sm" type="primary"  value={30} />
                  <LinearProgressBar size="sm" type="positive" value={72} />
                  <LinearProgressBar size="sm" type="negative" value={18} />
                </div>
                <div className="space-y-4">
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                    Large (8px) · with label
                  </Text>
                  <LinearProgressBar size="lg" type="primary"  value={30} showLabel />
                  <LinearProgressBar size="lg" type="positive" value={72} showLabel />
                  <LinearProgressBar size="lg" type="negative" value={18} showLabel />
                </div>
                <div className="space-y-4">
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                    Large (8px) · no label
                  </Text>
                  <LinearProgressBar size="lg" type="primary"  value={30} />
                  <LinearProgressBar size="lg" type="positive" value={72} />
                  <LinearProgressBar size="lg" type="negative" value={18} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 pt-4 border-t border-[var(--color-layout-border-color)]">
                <div className="space-y-4">
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                    Multi · with label
                  </Text>
                  <LinearProgressBar
                    size="sm"
                    type="multi"
                    showLabel
                    segments={[
                      { value: 30, color: "primary" },
                      { value: 25, color: "warning" },
                      { value: 20, color: "positive" },
                    ]}
                  />
                  <LinearProgressBar
                    size="lg"
                    type="multi"
                    showLabel
                    segments={[
                      { value: 30, color: "primary" },
                      { value: 25, color: "warning" },
                      { value: 20, color: "positive" },
                    ]}
                  />
                </div>
                <div className="space-y-4">
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                    Multi · no label
                  </Text>
                  <LinearProgressBar
                    size="sm"
                    type="multi"
                    segments={[
                      { value: 35, color: "primary" },
                      { value: 25, color: "warning" },
                      { value: 25, color: "positive" },
                    ]}
                  />
                  <LinearProgressBar
                    size="lg"
                    type="multi"
                    segments={[
                      { value: 35, color: "primary" },
                      { value: 25, color: "warning" },
                      { value: 25, color: "positive" },
                    ]}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-[var(--color-primary-background-color)] p-8 border border-[var(--color-layout-border-color)] space-y-6">
              <div>
                <Text variant="t2" weight="semibold" className="mb-2 text-[var(--color-primary-text-color)]">
                  Slider · type × size × range × icons × label
                </Text>
                <Text variant="t3" className="text-[var(--color-secondary-text-color)]">
                  Visual input that reflects current state status. Pass a number for a single thumb
                  or a <span className="font-mono">[lo, hi]</span> tuple for range mode. Sourced from
                  Figma node 46939:7912.
                </Text>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                <div className="space-y-5">
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                    Sizes · single
                  </Text>
                  <Slider size="sm" defaultValue={30} aria-label="Small slider" />
                  <Slider size="md" defaultValue={50} aria-label="Medium slider" />
                  <Slider size="lg" defaultValue={70} aria-label="Large slider" />
                </div>
                <div className="space-y-5">
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                    Sizes · range
                  </Text>
                  <Slider size="sm" defaultValue={[20, 60]} aria-label="Small range" />
                  <Slider size="md" defaultValue={[30, 70]} aria-label="Medium range" />
                  <Slider size="lg" defaultValue={[40, 80]} aria-label="Large range" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-8 pt-4 border-t border-[var(--color-layout-border-color)]">
                <div className="space-y-3">
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                    Primary
                  </Text>
                  <Slider type="primary" defaultValue={[20, 65]} aria-label="Primary range" />
                </div>
                <div className="space-y-3">
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                    Negative
                  </Text>
                  <Slider type="negative" defaultValue={[15, 50]} aria-label="Negative range" />
                </div>
                <div className="space-y-3">
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                    Positive
                  </Text>
                  <Slider type="positive" defaultValue={[55, 90]} aria-label="Positive range" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 pt-4 border-t border-[var(--color-layout-border-color)]">
                <div className="space-y-3">
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                    With icons · single
                  </Text>
                  <Slider
                    defaultValue={50}
                    startIcon={<Icon name="minus" size="sm" />}
                    endIcon={<Icon name="plus-small" size="sm" />}
                    aria-label="Volume"
                  />
                </div>
                <div className="space-y-3">
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                    With icons · range
                  </Text>
                  <Slider
                    defaultValue={[25, 75]}
                    startIcon={<Icon name="brightness" size="sm" />}
                    endIcon={<Icon name="brightness" size="sm" />}
                    aria-label="Brightness range"
                  />
                </div>
                <div className="space-y-3">
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                    With label · single
                  </Text>
                  <Slider defaultValue={42} showLabel aria-label="Single with label" />
                </div>
                <div className="space-y-3">
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                    With label · range
                  </Text>
                  <Slider defaultValue={[30, 70]} showLabel aria-label="Range with label" />
                </div>
                <div className="space-y-3">
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                    Disabled · single
                  </Text>
                  <Slider defaultValue={40} disabled aria-label="Disabled single" />
                </div>
                <div className="space-y-3">
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                    Disabled · range
                  </Text>
                  <Slider defaultValue={[20, 60]} disabled aria-label="Disabled range" />
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-[var(--color-primary-background-color)] p-8 border border-[var(--color-layout-border-color)] space-y-6">
              <div>
                <Text variant="t2" weight="semibold" className="mb-2 text-[var(--color-primary-text-color)]">
                  Skeleton · loading placeholder
                </Text>
                <Text variant="t3" className="text-[var(--color-secondary-text-color)]">
                  Loading placeholder shown while content fetches. Compose <span className="font-mono">circle</span>,{" "}
                  <span className="font-mono">rectangle</span>, and <span className="font-mono">text</span>{" "}
                  primitives to seed real layouts. Sourced from Figma node 46949:1064.
                </Text>
              </div>

              <div className="space-y-4">
                <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                  Primitive types · default dimensions
                </Text>
                <div className="flex flex-wrap items-end gap-10">
                  <div className="flex flex-col gap-2">
                    <Text variant="t3" className="text-[var(--color-secondary-text-color)]">Circle · 38×38</Text>
                    <Skeleton type="circle" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Text variant="t3" className="text-[var(--color-secondary-text-color)]">Rectangle · 144×144</Text>
                    <Skeleton type="rectangle" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Text variant="t3" className="text-[var(--color-secondary-text-color)]">Text · H1 · 162×32</Text>
                    <Skeleton type="text" size="h1" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Text variant="t3" className="text-[var(--color-secondary-text-color)]">Text · H2 · 162×24</Text>
                    <Skeleton type="text" size="h2" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Text variant="t3" className="text-[var(--color-secondary-text-color)]">Paragraph · 162×16</Text>
                    <Skeleton type="text" size="paragraph" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 pt-4 border-t border-[var(--color-layout-border-color)]">
                <div className="space-y-3">
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                    Composed · profile card
                  </Text>
                  <div className="flex flex-col gap-3 p-4 rounded-lg border border-[var(--color-layout-border-color)]">
                    <div className="flex items-center gap-2">
                      <Skeleton type="circle" />
                      <Skeleton type="text" size="paragraph" width={93} />
                    </div>
                    <div className="flex items-start gap-4 w-full">
                      <Skeleton type="rectangle" width={144} height={144} />
                      <div className="flex flex-col gap-2 flex-1">
                        <Skeleton type="text" size="h1" width="100%" />
                        <Skeleton type="text" size="paragraph" width="100%" />
                        <Skeleton type="text" size="paragraph" width="100%" />
                        <Skeleton type="text" size="paragraph" width="100%" />
                        <Skeleton type="text" size="paragraph" width={100} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                    Composed · list rows
                  </Text>
                  <div className="flex flex-col gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <Skeleton type="circle" />
                        <div className="flex flex-col gap-2 flex-1">
                          <Skeleton type="text" size="h2" width="60%" />
                          <Skeleton type="text" size="paragraph" width="90%" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-[var(--color-primary-background-color)] p-8 border border-[var(--color-layout-border-color)] space-y-8">
              <div>
                <Text variant="t2" weight="semibold" className="mb-2 text-[var(--color-primary-text-color)]">
                  Multi Step Indicator (Wizard)
                </Text>
                <Text variant="t3" className="text-[var(--color-secondary-text-color)]">
                  Numbered step indicator for wizard-style flows. The active step is filled with the
                  type colour, completed steps show a check, and pending steps stay neutral. Sourced
                  from Figma node 46947:3287.
                </Text>
              </div>

              {(() => {
                const steps = [
                  { title: "Account", subtitle: "Sign up with your work email" },
                  { title: "Profile", subtitle: "Tell us about yourself" },
                  { title: "Workspace", subtitle: "Pick a plan that fits" },
                  { title: "Invite", subtitle: "Bring your team along" },
                  { title: "Done", subtitle: "Start tracking time" },
                ]
                const titleOnly = steps.map((s) => ({ title: s.title }))
                const types = ["primary", "success", "dark", "danger"] as const
                return (
                  <div className="space-y-10">
                    <div className="space-y-4">
                      <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                        Regular · text below · current step 1
                      </Text>
                      <MultiStepIndicator current={1} steps={steps} />
                    </div>

                    <div className="space-y-4">
                      <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                        Regular · text inline · current step 2
                      </Text>
                      <MultiStepIndicator
                        current={2}
                        textPlacement="inline"
                        steps={titleOnly}
                      />
                    </div>

                    <div className="space-y-4">
                      <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                        Compact · current step 3
                      </Text>
                      <MultiStepIndicator
                        current={3}
                        size="compact"
                        textPlacement="inline"
                        steps={titleOnly}
                      />
                    </div>

                    <div className="space-y-4 pt-4 border-t border-[var(--color-layout-border-color)]">
                      <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                        Type matrix · regular · text below · current step 1
                      </Text>
                      <div className="grid grid-cols-1 gap-8">
                        {types.map((t) => (
                          <div key={t} className="space-y-2">
                            <Text variant="t3" className="text-[var(--color-secondary-text-color)]">
                              {t}
                            </Text>
                            <MultiStepIndicator type={t} current={1} steps={steps} />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-[var(--color-layout-border-color)]">
                      <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                        Progress range · primary · text inline
                      </Text>
                      <div className="space-y-6">
                        {[0, 1, 2, 3, 4].map((c) => (
                          <MultiStepIndicator
                            key={c}
                            current={c}
                            textPlacement="inline"
                            steps={titleOnly}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })()}
            </div>

            <div className="rounded-xl bg-[var(--color-primary-background-color)] p-8 border border-[var(--color-layout-border-color)] space-y-8">
              <div>
                <Text variant="t2" weight="semibold" className="mb-2 text-[var(--color-primary-text-color)]">
                  Steps
                </Text>
                <Text variant="t3" className="text-[var(--color-secondary-text-color)]">
                  Compact step / pagination indicator for galleries and short flows. Three layout types
                  — gallery (Back · dots · Next), numbers (Back · "X / Y" · Next), and gallery-only
                  (just dots) — and two onColor palettes for white surfaces or the brand-colour primary
                  background. Sourced from Figma node 46949:9199.
                </Text>
              </div>

              {(() => {
                const types = ["gallery", "numbers", "gallery-only"] as const
                return (
                  <div className="space-y-10">
                    <div className="space-y-4">
                      <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                        Type matrix · on white · current step 2
                      </Text>
                      <div className="flex flex-col gap-6 rounded-md border border-[var(--color-layout-border-color)] bg-[var(--color-primary-background-color)] p-6">
                        {types.map((t) => (
                          <div key={t} className="flex flex-col gap-2">
                            <Text variant="t3" className="text-[var(--color-secondary-text-color)]">
                              {t}
                            </Text>
                            <Steps type={t} count={5} defaultValue={2} />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                        Type matrix · on primary · current step 2
                      </Text>
                      <div className="flex flex-col gap-6 rounded-md bg-[var(--color-primary-color)] p-6">
                        {types.map((t) => (
                          <div key={t} className="flex flex-col gap-2">
                            <Text variant="t3" className="text-white/70">
                              {t}
                            </Text>
                            <Steps type={t} onColor="primary" count={5} defaultValue={2} />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-[var(--color-layout-border-color)]">
                      <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                        Counts · gallery · on white
                      </Text>
                      <div className="flex flex-col gap-4 rounded-md border border-[var(--color-layout-border-color)] bg-[var(--color-primary-background-color)] p-6">
                        {[2, 3, 4, 5, 6, 7].map((c) => (
                          <div key={c} className="flex items-center gap-6">
                            <Text variant="t3" className="w-16 font-mono text-[var(--color-secondary-text-color)]">
                              count {c}
                            </Text>
                            <Steps count={c} defaultValue={Math.min(1, c - 1)} />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-[var(--color-layout-border-color)]">
                      <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                        Progress range · numbers
                      </Text>
                      <div className="flex flex-col gap-3 rounded-md border border-[var(--color-layout-border-color)] bg-[var(--color-primary-background-color)] p-6">
                        {[0, 1, 2, 3, 4].map((c) => (
                          <Steps key={c} type="numbers" count={5} value={c} />
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })()}
            </div>

            <div className="rounded-xl bg-[var(--color-primary-background-color)] p-8 border border-[var(--color-layout-border-color)] space-y-8">
              <div>
                <Text variant="t2" weight="semibold" className="mb-2 text-[var(--color-primary-text-color)]">
                  Tabs
                </Text>
                <Text variant="t3" className="text-[var(--color-secondary-text-color)]">
                  Horizontal tabs for navigating between related views. Compositional API mirrors
                  Radix (Tabs / TabsList / TabsTrigger / TabsContent) with optional left/right icons,
                  counter (`/ N`), a `stretched` list, and an `onColor` switch for inverted surfaces.
                  Sourced from Figma node 46939:7916.
                </Text>
              </div>

              <div className="space-y-4">
                <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                  Types · plain · counter · left icon · right icon
                </Text>
                <div className="flex flex-col gap-6 rounded-md border border-[var(--color-layout-border-color)] bg-[var(--color-primary-background-color)] p-6">
                  <Tabs defaultValue="a">
                    <TabsList aria-label="Plain">
                      <TabsTrigger value="a">Tab</TabsTrigger>
                      <TabsTrigger value="b">Tab</TabsTrigger>
                      <TabsTrigger value="c">Tab</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <Tabs defaultValue="a">
                    <TabsList aria-label="Counter">
                      <TabsTrigger value="a" counter={2}>Tab</TabsTrigger>
                      <TabsTrigger value="b" counter={5}>Tab</TabsTrigger>
                      <TabsTrigger value="c" counter={12}>Tab</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <Tabs defaultValue="a">
                    <TabsList aria-label="Left icon">
                      <TabsTrigger value="a" leftIcon="house">Tab</TabsTrigger>
                      <TabsTrigger value="b" leftIcon="bell">Tab</TabsTrigger>
                      <TabsTrigger value="c" leftIcon="globe">Tab</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <Tabs defaultValue="a">
                    <TabsList aria-label="Right icon">
                      <TabsTrigger value="a" rightIcon="chevron-down">Tab</TabsTrigger>
                      <TabsTrigger value="b" rightIcon="chevron-down">Tab</TabsTrigger>
                      <TabsTrigger value="c" rightIcon="chevron-down">Tab</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>

              <div className="space-y-4">
                <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                  States · default · selected · disabled
                </Text>
                <div className="rounded-md border border-[var(--color-layout-border-color)] bg-[var(--color-primary-background-color)] p-6">
                  <Tabs defaultValue="selected">
                    <TabsList>
                      <TabsTrigger value="default">Default</TabsTrigger>
                      <TabsTrigger value="selected">Selected</TabsTrigger>
                      <TabsTrigger value="hover">Hover me</TabsTrigger>
                      <TabsTrigger value="disabled" disabled>Disabled</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>

              <div className="space-y-4">
                <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                  Stretched · share available width
                </Text>
                <div className="space-y-4 rounded-md border border-[var(--color-layout-border-color)] bg-[var(--color-primary-background-color)] p-6">
                  <Tabs defaultValue="a">
                    <TabsList>
                      <TabsTrigger value="a">Overview</TabsTrigger>
                      <TabsTrigger value="b">Activity</TabsTrigger>
                      <TabsTrigger value="c">Members</TabsTrigger>
                      <TabsTrigger value="d">Settings</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <Tabs defaultValue="a">
                    <TabsList stretched>
                      <TabsTrigger value="a">Overview</TabsTrigger>
                      <TabsTrigger value="b">Activity</TabsTrigger>
                      <TabsTrigger value="c">Members</TabsTrigger>
                      <TabsTrigger value="d">Settings</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>

              <div className="space-y-4">
                <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                  On dark surface
                </Text>
                <div className="rounded-md bg-[var(--color-inverted-color-background)] p-6">
                  <Tabs onColor="dark" defaultValue="overview">
                    <TabsList>
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="activity" counter={4}>Activity</TabsTrigger>
                      <TabsTrigger value="members" leftIcon="users-grp">Members</TabsTrigger>
                      <TabsTrigger value="archived" disabled>Archived</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>

              <div className="space-y-4">
                <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                  With panels · click or use ←/→ arrow keys
                </Text>
                <div className="rounded-md border border-[var(--color-layout-border-color)] bg-[var(--color-primary-background-color)] p-6">
                  <Tabs defaultValue="overview">
                    <TabsList aria-label="Project sections">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="details" leftIcon="notes-sticky">Details</TabsTrigger>
                      <TabsTrigger value="usage" counter={12}>Usage</TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview">
                      <Text variant="t1">A high-level look at the workspace and its activity.</Text>
                    </TabsContent>
                    <TabsContent value="details">
                      <Text variant="t1">Owner, members, billing, and audit history.</Text>
                    </TabsContent>
                    <TabsContent value="usage">
                      <Text variant="t1">12 active integrations across 3 environments.</Text>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-[var(--color-primary-background-color)] p-8 border border-[var(--color-layout-border-color)] space-y-6">
              <Text variant="t2" weight="semibold" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                Link · size × surface × icon
              </Text>
              <div className="space-y-5">
                <div className="flex flex-wrap items-center gap-6">
                  <Link href="#">Read more</Link>
                  <Link size="sm" href="#">Read more</Link>
                  <Link href="#" iconLeft="arrow-up-right-from-square">Read more</Link>
                  <Link href="#" iconRight="arrow-up-right-from-square">Read more</Link>
                  <Link href="#" disabled>Disabled</Link>
                </div>
                <div className="flex flex-wrap items-center gap-6 p-4 rounded-md bg-[var(--color-inverted-color-background)]">
                  <Link surface="inverted" href="#">Read more</Link>
                  <Link surface="inverted" size="sm" href="#">Read more</Link>
                  <Link surface="inverted" href="#" iconLeft="arrow-up-right-from-square">
                    Read more
                  </Link>
                  <Link surface="inverted" href="#" iconRight="arrow-up-right-from-square">
                    Read more
                  </Link>
                  <Link surface="inverted" href="#" disabled>Disabled</Link>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-[var(--color-primary-background-color)] p-8 border border-[var(--color-layout-border-color)] space-y-6">
              <div>
                <Text variant="t2" weight="semibold" className="mb-2 text-[var(--color-primary-text-color)]">
                  Modal
                </Text>
                <Text variant="t3" className="text-[var(--color-secondary-text-color)]">
                  Dialog surface built on @radix-ui/react-dialog. Three width sizes (small / medium / large) and three layouts (basic, media, side-by-side), plus an optional bordered/elevated treatment for scrolling content. Sourced from Figma node 46939:7907.
                </Text>
              </div>

              <div className="space-y-6">
                <div>
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide mb-3">
                    Sizes · basic
                  </Text>
                  <div className="flex flex-wrap items-center gap-3">
                    {(["small", "medium", "large"] as const).map((size) => (
                      <Modal key={`m-${size}`}>
                        <ModalTrigger asChild>
                          <Button kind="secondary">Open {size}</Button>
                        </ModalTrigger>
                        <ModalContent
                          size={size}
                          title="Modal title"
                          description="Modal subtitle, can come with icon and link."
                        >
                          <ModalBody>
                            <div
                              className="flex w-full items-center justify-center rounded-sm bg-[var(--color-allgrey-background-color)]"
                              style={{ height: size === "small" ? 96 : size === "medium" ? 159 : 256 }}
                            >
                              <Text variant="t2" className="text-[var(--color-secondary-text-color)]">
                                Body content
                              </Text>
                            </div>
                          </ModalBody>
                          <ModalFooter
                            leftContent={
                              size !== "small" ? (
                                <Checkbox>Don&rsquo;t show again</Checkbox>
                              ) : undefined
                            }
                            rightContent={<Button kind="primary">Main CTA</Button>}
                          />
                        </ModalContent>
                      </Modal>
                    ))}
                  </div>
                </div>

                <div>
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide mb-3">
                    Variants · media · side-by-side · scrollable
                  </Text>
                  <div className="flex flex-wrap items-center gap-3">
                    <Modal>
                      <ModalTrigger asChild>
                        <Button>Media modal</Button>
                      </ModalTrigger>
                      <ModalContent size="medium">
                        <ModalMedia
                          src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&q=80&auto=format&fit=crop"
                          alt=""
                        />
                        <ModalHeader className="items-center text-center">
                          <ModalTitle className="pr-0">Modal title</ModalTitle>
                          <ModalDescription>
                            For marketing modals all the content can be seen here as a longer subtitle text.
                          </ModalDescription>
                        </ModalHeader>
                        <ModalFooter
                          leftContent={
                            <Button kind="tertiary" className="-ml-3">
                              Back
                            </Button>
                          }
                          rightContent={<Button kind="primary">Main CTA</Button>}
                        />
                      </ModalContent>
                    </Modal>

                    <Modal>
                      <ModalTrigger asChild>
                        <Button>Side-by-side modal</Button>
                      </ModalTrigger>
                      <ModalContent size="large">
                        <ModalSideBySide
                          side={
                            <ModalMedia
                              src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200&q=80&auto=format&fit=crop"
                              alt=""
                              height="100%"
                            />
                          }
                        >
                          <ModalHeader>
                            <ModalTitle>Modal title</ModalTitle>
                            <ModalDescription>
                              Modal subtitle, can come with icon and link.
                            </ModalDescription>
                          </ModalHeader>
                          <ModalBody>
                            <div className="flex w-full items-center justify-center rounded-sm bg-[var(--color-allgrey-background-color)] h-[256px]">
                              <Text variant="t2" className="text-[var(--color-secondary-text-color)]">
                                Body content
                              </Text>
                            </div>
                          </ModalBody>
                        </ModalSideBySide>
                        <ModalFooter
                          elevated
                          leftContent={
                            <Button kind="tertiary" className="-ml-3">
                              Back
                            </Button>
                          }
                          centerContent={
                            <div className="flex items-center gap-2">
                              <span className="flex size-2 items-center justify-center">
                                <span className="size-2 rounded-full bg-[var(--color-primary-color)]" />
                              </span>
                              {[0, 1, 2, 3].map((i) => (
                                <span
                                  key={i}
                                  className="flex size-2 items-center justify-center"
                                >
                                  <span className="size-1.5 rounded-full bg-[var(--color-ui-border-color)]" />
                                </span>
                              ))}
                            </div>
                          }
                          rightContent={<Button kind="primary">Main CTA</Button>}
                        />
                      </ModalContent>
                    </Modal>

                    <Modal>
                      <ModalTrigger asChild>
                        <Button kind="secondary">Scrolling content</Button>
                      </ModalTrigger>
                      <ModalContent size="medium">
                        <ModalHeader bordered>
                          <ModalTitle>Modal title</ModalTitle>
                          <ModalDescription>
                            Modal subtitle, can come with icon and link.
                          </ModalDescription>
                        </ModalHeader>
                        <ModalBody scrollable>
                          {Array.from({ length: 12 }).map((_, i) => (
                            <p
                              key={i}
                              className="text-t1 text-[var(--color-primary-text-color)] py-2"
                            >
                              Long content paragraph {i + 1}. The header has a bottom border and the footer gets a subtle top shadow when the body scrolls.
                            </p>
                          ))}
                        </ModalBody>
                        <ModalFooter
                          elevated
                          leftContent={<Checkbox>Don&rsquo;t show again</Checkbox>}
                          rightContent={<Button kind="primary">Main CTA</Button>}
                        />
                      </ModalContent>
                    </Modal>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-[var(--color-primary-background-color)] p-8 border border-[var(--color-layout-border-color)] space-y-6">
              <div>
                <Text variant="t2" weight="semibold" className="mb-2 text-[var(--color-primary-text-color)]">
                  Tipseen · onboarding callout
                </Text>
                <Text variant="t3" className="text-[var(--color-secondary-text-color)]">
                  Virtual unboxing experience for feature discovery, onboarding, and up-sell.
                  Two palettes (inverted / primary), five pointer positions, optional top media,
                  and a flexible footer slot. Sourced from Figma node 46939:7919.
                </Text>
              </div>

              <div className="space-y-8">
                <div>
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide mb-3">
                    Types
                  </Text>
                  <div className="flex flex-wrap items-end gap-8">
                    <Tipseen type="inverted" title="This is a title" onDismiss={() => {}} footer={<TipseenShowcaseFooter />}>
                      Message will appear here, to give more information about the feature.{" "}
                      <Link href="#" surface="inverted" size="sm">Read more</Link>
                    </Tipseen>
                    <Tipseen type="primary" title="This is a title" onDismiss={() => {}} footer={<TipseenShowcaseFooter />}>
                      Message will appear here, to give more information about the feature.{" "}
                      <Link href="#" surface="inverted" size="sm">Read more</Link>
                    </Tipseen>
                  </div>
                </div>

                <div>
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide mb-3">
                    Pointer · top / bottom / left / right / none
                  </Text>
                  <div className="flex flex-wrap items-end gap-8">
                    {(["none", "bottom", "top", "right", "left"] as const).map((pos) => (
                      <Tipseen
                        key={pos}
                        type="inverted"
                        pointerPosition={pos}
                        title="This is a title"
                        onDismiss={() => {}}
                        footer={<TipseenShowcaseFooter />}
                      >
                        Message will appear here, to give more information about the feature.
                      </Tipseen>
                    ))}
                  </div>
                </div>

                <div>
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide mb-3">
                    With image
                  </Text>
                  <div className="flex flex-wrap items-end gap-8">
                    <Tipseen
                      type="inverted"
                      pointerPosition="bottom"
                      title="This is a title"
                      image={
                        <div
                          className="h-[145px] w-full"
                          style={{
                            background:
                              "linear-gradient(135deg, var(--color-primary-selected-color) 0%, var(--color-primary-highlighted-color) 50%, var(--color-primary-color) 100%)",
                          }}
                          aria-hidden="true"
                        />
                      }
                      onDismiss={() => {}}
                      footer={<TipseenShowcaseFooter />}
                    >
                      Message will appear here, to give more information about the feature.
                    </Tipseen>
                    <Tipseen
                      type="primary"
                      pointerPosition="bottom"
                      title="This is a title"
                      image={
                        <div
                          className="h-[145px] w-full"
                          style={{
                            background:
                              "linear-gradient(135deg, color-mix(in srgb, var(--color-primary-color) 70%, white), color-mix(in srgb, var(--color-primary-color) 40%, white))",
                          }}
                          aria-hidden="true"
                        />
                      }
                      onDismiss={() => {}}
                      footer={<TipseenShowcaseFooter />}
                    >
                      Message will appear here, to give more information about the feature.
                    </Tipseen>
                  </div>
                </div>

                <div>
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide mb-3">
                    Footer · stepper · one action · two actions
                  </Text>
                  <div className="flex flex-wrap items-end gap-8">
                    <Tipseen type="inverted" title="This is a title" onDismiss={() => {}} footer={<TipseenShowcaseFooter />}>
                      Message will appear here, to give more information about the feature.
                    </Tipseen>
                    <Tipseen
                      type="inverted"
                      title="This is a title"
                      onDismiss={() => {}}
                      footer={<TipseenAction kind="primary">Got it</TipseenAction>}
                    >
                      Message will appear here, to give more information about the feature.
                    </Tipseen>
                    <Tipseen
                      type="inverted"
                      title="This is a title"
                      onDismiss={() => {}}
                      footer={
                        <>
                          <TipseenAction>Back</TipseenAction>
                          <TipseenAction kind="primary">Next</TipseenAction>
                        </>
                      }
                    >
                      Message will appear here, to give more information about the feature.
                    </Tipseen>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-[var(--color-primary-background-color)] p-8 border border-[var(--color-layout-border-color)] space-y-6">
              <div>
                <Text variant="t2" weight="semibold" className="mb-2 text-[var(--color-primary-text-color)]">
                  TableCell · type × state × size
                </Text>
                <Text variant="t3" className="text-[var(--color-secondary-text-color)]">
                  Structural shell of a row in a data table. Compose any
                  content inside — text, icons, chips, labels, avatars, progress
                  bars, editable inputs. Use <span className="font-mono">TableHeaderCell</span> for column titles.
                  Sourced from Figma node 46949:11817.
                </Text>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-8">
                <div className="space-y-3">
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                    States
                  </Text>
                  <div className="grid grid-cols-4 border border-[var(--color-layout-border-color)] rounded-md overflow-hidden">
                    <TableCell state="default">Default</TableCell>
                    <TableCell state="hover">Hover</TableCell>
                    <TableCell state="selected">Selected</TableCell>
                    <TableCell state="selected-hover">Sel-hover</TableCell>
                  </div>
                </div>
                <div className="space-y-3">
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                    Sizes
                  </Text>
                  <div className="grid grid-cols-3 border border-[var(--color-layout-border-color)] rounded-md overflow-hidden">
                    <TableCell size="sm">Small (32)</TableCell>
                    <TableCell size="md">Medium (40)</TableCell>
                    <TableCell size="lg">Large (48)</TableCell>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-[var(--color-layout-border-color)]">
                <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                  Composed table
                </Text>
                <div
                  role="table"
                  className="inline-grid grid-cols-[40px_60px_1fr_180px_140px_180px_40px] border border-[var(--color-layout-border-color)] rounded-md overflow-hidden"
                >
                  <TableCell variant="control">
                    <Checkbox aria-label="Select all" />
                  </TableCell>
                  <TableHeaderCell>#</TableHeaderCell>
                  <TableHeaderCell sortDirection="asc">Task</TableHeaderCell>
                  <TableHeaderCell iconBefore="user">Owner</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell>Progress</TableHeaderCell>
                  <TableHeaderCell onMenuClick={() => undefined}>{""}</TableHeaderCell>

                  {([
                    { id: 1, name: "Audit Q4 invoices",   owner: "Riley M.",  status: "In review", color: "warning-subtle",  progress: 30 },
                    { id: 2, name: "Update onboarding",   owner: "Avery K.",  status: "Done",      color: "positive-subtle", progress: 100, selected: true },
                    { id: 3, name: "Migrate auth flow",   owner: "Jordan L.", status: "Blocked",   color: "negative-subtle", progress: 60 },
                    { id: 4, name: "Refresh design tokens", owner: "Sam P.", status: "Active",    color: "primary-subtle",  progress: 45 },
                  ] satisfies ShowcaseTableRowData[]).map((row) => {
                    const state = row.selected ? ("selected" as const) : ("default" as const)
                    return (
                      <ShowcaseTableRow key={row.id} row={row} state={state} />
                    )
                  })}
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-[var(--color-layout-border-color)]">
                <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                  Column-major layout · TableColumn
                </Text>
                <Text variant="t3" className="text-[var(--color-secondary-text-color)] -mt-1">
                  A vertical stack of cells. Compose with TableHeaderCell + TableCell. Sourced from Figma node 46949:12272.
                </Text>
                <div className="flex border border-[var(--color-layout-border-color)] rounded-md overflow-hidden">
                  <TableColumn width={228}>
                    <TableHeaderCell sortDirection="asc">Task</TableHeaderCell>
                    {[
                      "Audit Q4 invoices",
                      "Update onboarding",
                      "Migrate auth flow",
                      "Refresh design tokens",
                    ].map((label) => (
                      <TableCell key={label}>
                        <span className="flex-1 truncate">{label}</span>
                      </TableCell>
                    ))}
                  </TableColumn>
                  <TableColumn width={128}>
                    <TableHeaderCell>Status</TableHeaderCell>
                    <TableCell><Chip type="warning-subtle">In review</Chip></TableCell>
                    <TableCell><Chip type="positive-subtle">Done</Chip></TableCell>
                    <TableCell><Chip type="negative-subtle">Blocked</Chip></TableCell>
                    <TableCell><Chip type="primary-subtle">Active</Chip></TableCell>
                  </TableColumn>
                  <TableColumn width={180}>
                    <TableHeaderCell>Progress</TableHeaderCell>
                    {[30, 100, 60, 45].map((v, i) => (
                      <TableCell key={i}>
                        <LinearProgressBar
                          size="sm"
                          type={v >= 100 ? "positive" : v < 30 ? "negative" : "primary"}
                          value={v}
                          showLabel
                          className="flex-1"
                        />
                      </TableCell>
                    ))}
                  </TableColumn>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-[var(--color-layout-border-color)]">
                <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                  Loading state · TableColumnLoader
                </Text>
                <Text variant="t3" className="text-[var(--color-secondary-text-color)] -mt-1">
                  Skeleton placeholders for an entire column. Four shapes — text / rectangle / circle / square. Sourced from Figma node 46949:11180.
                </Text>
                <div className="flex gap-2">
                  <TableColumnLoader
                    width={228}
                    shape="text"
                    rows={8}
                    header={<TableHeaderCell>Placeholder for text</TableHeaderCell>}
                    className="border border-[var(--color-layout-border-color)] rounded-md overflow-hidden"
                  />
                  <TableColumnLoader
                    width={112}
                    shape="rectangle"
                    rows={8}
                    header={<TableHeaderCell>Pla...</TableHeaderCell>}
                    className="border border-[var(--color-layout-border-color)] rounded-md overflow-hidden"
                  />
                  <TableColumnLoader
                    width={112}
                    shape="circle"
                    rows={8}
                    header={<TableHeaderCell>Pla...</TableHeaderCell>}
                    className="border border-[var(--color-layout-border-color)] rounded-md overflow-hidden"
                  />
                  <TableColumnLoader
                    width={112}
                    shape="square"
                    rows={8}
                    header={<TableHeaderCell>Pla...</TableHeaderCell>}
                    className="border border-[var(--color-layout-border-color)] rounded-md overflow-hidden"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-[var(--color-primary-background-color)] p-8 border border-[var(--color-layout-border-color)] space-y-6">
              <div>
                <Text variant="t2" weight="semibold" className="mb-2 text-[var(--color-primary-text-color)]">
                  Table · composed wrapper
                </Text>
                <Text variant="t3" className="text-[var(--color-secondary-text-color)]">
                  Wraps a row of <span className="font-mono">TableColumn</span>s in
                  a bordered radius shell and propagates a default <span className="font-mono">size</span>{" "}
                  (sm / md / lg) via context. Mirrors the Figma{" "}
                  <span className="font-mono">Use Case</span> frame
                  (bordered & no-border × small / medium / large). Sourced from
                  Figma node 46939:7915.
                </Text>
              </div>

              <div className="space-y-3">
                <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                  Bordered · medium
                </Text>
                <Table size="md">
                  <TableColumn width={40}>
                    <TableCell variant="control">
                      <Checkbox aria-label="Select all" />
                    </TableCell>
                    {[1, 2, 3, 4].map((i) => (
                      <TableCell key={i} variant="control">
                        <Checkbox aria-label={`Select ${i}`} />
                      </TableCell>
                    ))}
                  </TableColumn>
                  <TableColumn width={228}>
                    <TableHeaderCell sortDirection="asc">Task</TableHeaderCell>
                    {[
                      "Audit Q4 invoices",
                      "Update onboarding",
                      "Migrate auth flow",
                      "Refresh design tokens",
                    ].map((label) => (
                      <TableCell key={label}>
                        <span className="flex-1 truncate">{label}</span>
                      </TableCell>
                    ))}
                  </TableColumn>
                  <TableColumn width={160}>
                    <TableHeaderCell iconBefore="user">Owner</TableHeaderCell>
                    {[
                      ["RM", "Riley M."],
                      ["AK", "Avery K."],
                      ["JL", "Jordan L."],
                      ["SP", "Sam P."],
                    ].map(([initials, name]) => (
                      <TableCell key={name}>
                        <Avatar size="sm" type="initials" initials={initials!} />
                        <span className="flex-1 truncate">{name}</span>
                      </TableCell>
                    ))}
                  </TableColumn>
                  <TableColumn width={128}>
                    <TableHeaderCell>Status</TableHeaderCell>
                    <TableCell><Chip type="warning-subtle">In review</Chip></TableCell>
                    <TableCell><Chip type="positive-subtle">Done</Chip></TableCell>
                    <TableCell><Chip type="negative-subtle">Blocked</Chip></TableCell>
                    <TableCell><Chip type="primary-subtle">Active</Chip></TableCell>
                  </TableColumn>
                  <TableColumn width={180}>
                    <TableHeaderCell>Progress</TableHeaderCell>
                    {[30, 100, 60, 45].map((v, i) => (
                      <TableCell key={i}>
                        <LinearProgressBar
                          size="sm"
                          type={v >= 100 ? "positive" : v < 30 ? "negative" : "primary"}
                          value={v}
                          showLabel
                          className="flex-1"
                        />
                      </TableCell>
                    ))}
                  </TableColumn>
                  <TableColumn width={40}>
                    <TableCell variant="control" border={false} />
                    {[1, 2, 3, 4].map((i) => (
                      <TableCell key={i} variant="control" border={false}>
                        <IconButton
                          icon="ellipsis-vertical"
                          size="xs"
                          kind="tertiary"
                          aria-label={`Actions for row ${i}`}
                        />
                      </TableCell>
                    ))}
                  </TableColumn>
                </Table>
              </div>

              <div className="space-y-3 pt-4 border-t border-[var(--color-layout-border-color)]">
                <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                  Sizes · sm · md · lg
                </Text>
                <div className="flex flex-col gap-4">
                  {(["sm", "md", "lg"] as const).map((s) => (
                    <Table key={s} size={s}>
                      <TableColumn width={228}>
                        <TableHeaderCell sortDirection="asc">Task</TableHeaderCell>
                        {["Audit Q4 invoices", "Update onboarding", "Migrate auth flow"].map(
                          (label) => (
                            <TableCell key={label}>
                              <span className="flex-1 truncate">{label}</span>
                            </TableCell>
                          ),
                        )}
                      </TableColumn>
                      <TableColumn width={128}>
                        <TableHeaderCell>Status</TableHeaderCell>
                        <TableCell><Chip type="warning-subtle">In review</Chip></TableCell>
                        <TableCell><Chip type="positive-subtle">Done</Chip></TableCell>
                        <TableCell><Chip type="primary-subtle">Active</Chip></TableCell>
                      </TableColumn>
                      <TableColumn width={180}>
                        <TableHeaderCell>Progress</TableHeaderCell>
                        {[30, 100, 60].map((v, i) => (
                          <TableCell key={i}>
                            <LinearProgressBar
                              size="sm"
                              type={v >= 100 ? "positive" : v < 30 ? "negative" : "primary"}
                              value={v}
                              showLabel
                              className="flex-1"
                            />
                          </TableCell>
                        ))}
                      </TableColumn>
                    </Table>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-[var(--color-layout-border-color)]">
                <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                  No-border · medium
                </Text>
                <Table bordered={false} size="md">
                  <TableColumn width={228}>
                    <TableHeaderCell sortDirection="asc">Task</TableHeaderCell>
                    {["Plan offsite agenda", "Cut release branch", "Pair on infra rollout"].map(
                      (label) => (
                        <TableCell key={label}>
                          <span className="flex-1 truncate">{label}</span>
                        </TableCell>
                      ),
                    )}
                  </TableColumn>
                  <TableColumn width={160}>
                    <TableHeaderCell iconBefore="user">Owner</TableHeaderCell>
                    {[
                      ["KT", "Kira T."],
                      ["DH", "Dani H."],
                      ["MP", "Morgan P."],
                    ].map(([initials, name]) => (
                      <TableCell key={name}>
                        <Avatar size="sm" type="initials" initials={initials!} />
                        <span className="flex-1 truncate">{name}</span>
                      </TableCell>
                    ))}
                  </TableColumn>
                  <TableColumn width={128}>
                    <TableHeaderCell>Status</TableHeaderCell>
                    <TableCell><Chip type="primary-subtle">Active</Chip></TableCell>
                    <TableCell><Chip type="positive-subtle">Done</Chip></TableCell>
                    <TableCell><Chip type="warning-subtle">In review</Chip></TableCell>
                  </TableColumn>
                </Table>
              </div>

              <div className="space-y-3 pt-4 border-t border-[var(--color-layout-border-color)]">
                <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide">
                  Loading · skeleton columns inherit table size
                </Text>
                <Table size="md">
                  <TableColumnLoader
                    width={228}
                    shape="text"
                    rows={6}
                    header={<TableHeaderCell sortDirection="asc">Placeholder for text</TableHeaderCell>}
                  />
                  <TableColumnLoader
                    width={112}
                    shape="rectangle"
                    rows={6}
                    header={<TableHeaderCell>Pla...</TableHeaderCell>}
                  />
                  <TableColumnLoader
                    width={112}
                    shape="circle"
                    rows={6}
                    header={<TableHeaderCell>Pla...</TableHeaderCell>}
                  />
                  <TableColumnLoader
                    width={112}
                    shape="square"
                    rows={6}
                    header={<TableHeaderCell>Pla...</TableHeaderCell>}
                  />
                </Table>
              </div>
            </div>

            <div className="rounded-xl bg-[var(--color-primary-background-color)] p-8 border border-[var(--color-layout-border-color)] space-y-6">
              <div>
                <Text variant="t2" weight="semibold" className="mb-2 text-[var(--color-primary-text-color)]">
                  Tooltip · side × theme × content slots
                </Text>
                <Text variant="t3" className="text-[var(--color-secondary-text-color)]">
                  Small floating panel anchored to a trigger. Built on
                  <span className="font-mono"> @radix-ui/react-tooltip</span> for
                  hover/focus delays, portal placement, and collision avoidance.
                  Sourced from Figma node 46939:7922.
                </Text>
              </div>

              <div className="space-y-8">
                <div>
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide mb-3">
                    Arrow position · top / right / bottom / left
                  </Text>
                  <div className="grid grid-cols-4 gap-6 py-12">
                    {(["top", "right", "bottom", "left"] as const).map((side) => (
                      <div key={side} className="flex items-center justify-center">
                        <Tooltip defaultOpen>
                          <TooltipTrigger asChild>
                            <Button kind="secondary">{side}</Button>
                          </TooltipTrigger>
                          <TooltipContent side={side}>Tooltip label</TooltipContent>
                        </Tooltip>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide mb-3">
                    Content · title · title + icon · long body
                  </Text>
                  <div className="flex flex-wrap items-end gap-12 py-10">
                    <Tooltip defaultOpen>
                      <TooltipTrigger asChild>
                        <Button kind="secondary">Title</Button>
                      </TooltipTrigger>
                      <TooltipContent title="Tooltip title">Tooltip label</TooltipContent>
                    </Tooltip>
                    <Tooltip defaultOpen>
                      <TooltipTrigger asChild>
                        <Button kind="secondary">Title + icon</Button>
                      </TooltipTrigger>
                      <TooltipContent title="Tooltip title" titleIcon="bell">
                        Tooltip label
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip defaultOpen>
                      <TooltipTrigger asChild>
                        <Button kind="secondary">Long body</Button>
                      </TooltipTrigger>
                      <TooltipContent maxWidth={280}>
                        Tooltips wrap to multiple lines once content exceeds the
                        configured maximum width — 240px by default.
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>

                <div>
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide mb-3">
                    Image and link
                  </Text>
                  <div className="flex flex-wrap items-end gap-12 py-12">
                    <Tooltip defaultOpen>
                      <TooltipTrigger asChild>
                        <Button kind="secondary">With image</Button>
                      </TooltipTrigger>
                      <TooltipContent
                        side="right"
                        image={
                          <div
                            className="h-[136px] w-full"
                            style={{
                              background:
                                "linear-gradient(135deg, var(--color-primary-selected-color) 0%, var(--color-primary-color) 100%)",
                            }}
                            aria-hidden="true"
                          />
                        }
                      >
                        Tooltip label
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip defaultOpen>
                      <TooltipTrigger asChild>
                        <Button kind="secondary">With link</Button>
                      </TooltipTrigger>
                      <TooltipContent
                        title="Sales CRM"
                        titleIcon="bell"
                        maxWidth={260}
                      >
                        Manage all stages of customer lifecycle in one place,{" "}
                        <Link href="#" surface="inverted" size="sm">read more</Link>.
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>

                <div>
                  <Text variant="t3" className="text-[var(--color-secondary-text-color)] uppercase tracking-wide mb-3">
                    Theme · default · on-dark · on-black
                  </Text>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="flex h-32 items-center justify-center rounded-md bg-[var(--color-allgrey-background-color)] border border-[var(--color-layout-border-color)]">
                      <Tooltip defaultOpen>
                        <TooltipTrigger asChild>
                          <Button kind="secondary">default</Button>
                        </TooltipTrigger>
                        <TooltipContent theme="default">Tooltip label</TooltipContent>
                      </Tooltip>
                    </div>
                    <div
                      className="flex h-32 items-center justify-center rounded-md"
                      style={{ backgroundColor: "#1F1834" }}
                    >
                      <Tooltip defaultOpen>
                        <TooltipTrigger asChild>
                          <Button kind="secondary">on-dark</Button>
                        </TooltipTrigger>
                        <TooltipContent theme="on-dark">Tooltip label</TooltipContent>
                      </Tooltip>
                    </div>
                    <div
                      className="flex h-32 items-center justify-center rounded-md"
                      style={{ backgroundColor: "#1E2026" }}
                    >
                      <Tooltip defaultOpen>
                        <TooltipTrigger asChild>
                          <Button kind="secondary">on-black</Button>
                        </TooltipTrigger>
                        <TooltipContent theme="on-black">Tooltip label</TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-[var(--color-primary-background-color)] p-8 border border-[var(--color-layout-border-color)]">
              <Text variant="t1" className="text-[var(--color-secondary-text-color)]">
                <Text as="span" variant="t1" weight="semibold" className="text-[var(--color-primary-text-color)]">Text</Text>,{" "}
                <Text as="span" variant="t1" weight="semibold" className="text-[var(--color-primary-text-color)]">Icon</Text>,{" "}
                <Text as="span" variant="t1" weight="semibold" className="text-[var(--color-primary-text-color)]">Accordion</Text>,{" "}
                <Text as="span" variant="t1" weight="semibold" className="text-[var(--color-primary-text-color)]">Button</Text>,{" "}
                <Text as="span" variant="t1" weight="semibold" className="text-[var(--color-primary-text-color)]">ButtonGroup</Text>,{" "}
                <Text as="span" variant="t1" weight="semibold" className="text-[var(--color-primary-text-color)]">Checkbox</Text>, and{" "}
                <Text as="span" variant="t1" weight="semibold" className="text-[var(--color-primary-text-color)]">Avatar</Text>,{" "}
                <Text as="span" variant="t1" weight="semibold" className="text-[var(--color-primary-text-color)]">AvatarGroup</Text>, and{" "}
                <Text as="span" variant="t1" weight="semibold" className="text-[var(--color-primary-text-color)]">IconButton</Text>, and{" "}
                <Text as="span" variant="t1" weight="semibold" className="text-[var(--color-primary-text-color)]">AlertBanner</Text>, and{" "}
                <Text as="span" variant="t1" weight="semibold" className="text-[var(--color-primary-text-color)]">AttentionBox</Text>, and{" "}
                <Text as="span" variant="t1" weight="semibold" className="text-[var(--color-primary-text-color)]">Badge</Text>, and{" "}
                <Text as="span" variant="t1" weight="semibold" className="text-[var(--color-primary-text-color)]">Counter</Text>, and{" "}
                <Text as="span" variant="t1" weight="semibold" className="text-[var(--color-primary-text-color)]">Breadcrumb</Text>, and{" "}
                <Text as="span" variant="t1" weight="semibold" className="text-[var(--color-primary-text-color)]">Chip</Text>, and{" "}
                <Text as="span" variant="t1" weight="semibold" className="text-[var(--color-primary-text-color)]">Search</Text>, and{" "}
                <Text as="span" variant="t1" weight="semibold" className="text-[var(--color-primary-text-color)]">Label</Text>, and{" "}
                <Text as="span" variant="t1" weight="semibold" className="text-[var(--color-primary-text-color)]">ListItem</Text>, and{" "}
                <Text as="span" variant="t1" weight="semibold" className="text-[var(--color-primary-text-color)]">Menu</Text>, and{" "}
                <Text as="span" variant="t1" weight="semibold" className="text-[var(--color-primary-text-color)]">Combobox</Text>, and{" "}
                <Text as="span" variant="t1" weight="semibold" className="text-[var(--color-primary-text-color)]">DatePicker</Text>, and{" "}
                <Text as="span" variant="t1" weight="semibold" className="text-[var(--color-primary-text-color)]">Divider</Text>, and{" "}
                <Text as="span" variant="t1" weight="semibold" className="text-[var(--color-primary-text-color)]">Dropdown</Text>, and{" "}
                <Text as="span" variant="t1" weight="semibold" className="text-[var(--color-primary-text-color)]">LinearProgressBar</Text>, and{" "}
                <Text as="span" variant="t1" weight="semibold" className="text-[var(--color-primary-text-color)]">Link</Text>, and{" "}
                <Text as="span" variant="t1" weight="semibold" className="text-[var(--color-primary-text-color)]">Modal</Text>, and{" "}
                <Text as="span" variant="t1" weight="semibold" className="text-[var(--color-primary-text-color)]">Slider</Text>, and{" "}
                <Text as="span" variant="t1" weight="semibold" className="text-[var(--color-primary-text-color)]">Skeleton</Text>, and{" "}
                <Text as="span" variant="t1" weight="semibold" className="text-[var(--color-primary-text-color)]">TableCell</Text>, and{" "}
                <Text as="span" variant="t1" weight="semibold" className="text-[var(--color-primary-text-color)]">TableColumn / TableColumnLoader / Table</Text>, and{" "}
                <Text as="span" variant="t1" weight="semibold" className="text-[var(--color-primary-text-color)]">TextArea</Text>, and{" "}
                <Text as="span" variant="t1" weight="semibold" className="text-[var(--color-primary-text-color)]">Toggle</Text>, and{" "}
                <Text as="span" variant="t1" weight="semibold" className="text-[var(--color-primary-text-color)]">Tooltip</Text> have shipped so far. Select, Tag, and Card
                are still on the v1 backlog.
              </Text>
            </div>
          </div>
        </Section>

        <footer className="pt-8">
          <Text variant="t3" className="text-[var(--color-secondary-text-color)]">
            Source: <span className="font-mono">src/showcase/Showcase.tsx</span>
          </Text>
        </footer>
      </div>
    </main>
  )
}
