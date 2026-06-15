import type { Preview } from "@storybook/react"
import { withThemeByDataAttribute } from "@storybook/addon-themes"
import "../src/index.css"

// Theme switching is driven by `data-theme` on <html>, matching the runtime
// pattern in src/showcase/App.tsx and the override blocks in
// src/tokens/dist/css/variables.css ([data-theme="black"], [data-theme="pink"]).
const preview: Preview = {
  parameters: {
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
    a11y: { disable: false },
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#FFFFFF" },
        { name: "black", value: "#000000" },
        { name: "pink", value: "#FFF0F8" },
      ],
    },
  },
  decorators: [
    withThemeByDataAttribute({
      themes: { light: "light", black: "black", pink: "pink" },
      defaultTheme: "light",
      attributeName: "data-theme",
    }),
  ],
}

export default preview
