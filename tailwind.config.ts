import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#262F59",
          deep: "#09090b",
          card: "#18181b",
        },
        brand: {
          blue: "#326CE5",
          pink: "#FF6DAF",
          gold: "#FFB500",
          purple: "#512268",
          hotpink: "#F11F7E",
        },
        warm: {
          white: "#FDF9F9",
        },
      },
      fontFamily: {
        heading: ["var(--font-heading)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
