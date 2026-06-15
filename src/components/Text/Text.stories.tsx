import type { Meta, StoryObj } from "@storybook/react"
import { Text } from "./Text"

const meta = {
  title: "Foundations/Typography",
  component: Text,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Typography primitive sourced from the TimeWorks Figma file (page \"■ Typography\"). Headings use Montserrat; text styles use Karla. The `link` prop renders the underlined Text variants from the spec.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["h1", "h2", "h3", "t1", "t2", "t3"],
    },
    weight: {
      control: "select",
      options: ["light", "regular", "medium", "semibold", "bold"],
    },
    link: { control: "boolean" },
    children: { control: "text" },
  },
  args: {
    children: "Impact how teams work across the globe",
  },
} satisfies Meta<typeof Text>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  args: {
    variant: "h1",
    weight: "bold",
  },
}

const SAMPLE = "Impact how teams work across the globe"

const SCALE: Array<{
  variant: "h1" | "h2" | "h3" | "t1" | "t2" | "t3"
  family: "Montserrat" | "Karla"
  size: string
  weights: Array<{ weight: "light" | "regular" | "medium" | "semibold" | "bold"; label: string; link?: boolean }>
}> = [
  {
    variant: "h1",
    family: "Montserrat",
    size: "32 / 40",
    weights: [
      { weight: "bold", label: "Bold · 700" },
      { weight: "semibold", label: "SemiBold · 600" },
      { weight: "medium", label: "Medium · 500" },
      { weight: "regular", label: "Regular · 400" },
    ],
  },
  {
    variant: "h2",
    family: "Montserrat",
    size: "24 / 30",
    weights: [
      { weight: "bold", label: "Bold · 700" },
      { weight: "semibold", label: "SemiBold · 600" },
      { weight: "medium", label: "Medium · 500" },
      { weight: "light", label: "Light · 300" },
    ],
  },
  {
    variant: "h3",
    family: "Montserrat",
    size: "18 / 24",
    weights: [
      { weight: "bold", label: "Bold · 700" },
      { weight: "semibold", label: "SemiBold · 600" },
      { weight: "medium", label: "Medium · 500" },
      { weight: "light", label: "Light · 300" },
    ],
  },
  {
    variant: "t1",
    family: "Karla",
    size: "16 / 22",
    weights: [
      { weight: "bold", label: "Bold · 700" },
      { weight: "semibold", label: "SemiBold · 600" },
      { weight: "regular", label: "Regular · 400" },
      { weight: "regular", label: "Regular-link · 400", link: true },
    ],
  },
  {
    variant: "t2",
    family: "Karla",
    size: "14 / 20",
    weights: [
      { weight: "bold", label: "Bold · 700" },
      { weight: "semibold", label: "SemiBold · 600" },
      { weight: "regular", label: "Regular · 400" },
      { weight: "regular", label: "Regular-link · 400", link: true },
    ],
  },
  {
    variant: "t3",
    family: "Karla",
    size: "12 / 16",
    weights: [
      { weight: "semibold", label: "SemiBold · 600" },
      { weight: "regular", label: "Regular · 400" },
      { weight: "regular", label: "Regular-link · 400", link: true },
    ],
  },
]

const VARIANT_LABEL: Record<"h1" | "h2" | "h3" | "t1" | "t2" | "t3", string> = {
  h1: "Heading 1",
  h2: "Heading 2",
  h3: "Heading 3",
  t1: "Text 1",
  t2: "Text 2",
  t3: "Text 3",
}

export const Scale: StoryObj = {
  parameters: {
    docs: {
      description: {
        story: "Full type scale — every variant × every weight defined in the Figma spec.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-12">
      {SCALE.map((row) => (
        <section key={row.variant} className="flex flex-col gap-4">
          <header className="flex items-baseline gap-3 border-b border-zinc-200 pb-2">
            <Text as="h2" variant="h2" weight="semibold">
              {VARIANT_LABEL[row.variant]}
            </Text>
            <Text variant="t3" weight="regular" className="text-zinc-500">
              {row.family} · {row.size}
            </Text>
          </header>
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
            {row.weights.map((w) => (
              <div key={w.label} className="flex flex-col gap-1">
                <Text variant="t3" weight="semibold" className="text-zinc-500">
                  {w.label}
                </Text>
                <Text variant={row.variant} weight={w.weight} link={w.link}>
                  {SAMPLE}
                </Text>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  ),
}

export const Headings: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Text variant="h1" weight="bold">Heading 1 — {SAMPLE}</Text>
      <Text variant="h2" weight="semibold">Heading 2 — {SAMPLE}</Text>
      <Text variant="h3" weight="semibold">Heading 3 — {SAMPLE}</Text>
    </div>
  ),
}

export const BodyText: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Text variant="t1">Text 1 (16/22) — {SAMPLE}</Text>
      <Text variant="t2">Text 2 (14/20) — {SAMPLE}</Text>
      <Text variant="t3">Text 3 (12/16) — {SAMPLE}</Text>
      <Text variant="t1" link>
        Text 1 link variant
      </Text>
    </div>
  ),
}
