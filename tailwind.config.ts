import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/flyonui/dist/js/*.js",
    "./node_modules/flyonui/dist/js/accordion.js",
  ],
  theme: {
    extend: {
      colors: {
        blue : '#8098F0',
        secondblue : '#E2E8FF',
        darkblue : '#03042C',
        greey : '#C4C4C4',
        g2 : '#F3F5F9',
        greey2: '#90909E'
      },
    },
  },
  plugins: [
    require("flyonui"),
    require("flyonui/plugin")
  ],
} satisfies Config;
