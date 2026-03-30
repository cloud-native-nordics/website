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
        // Primary — Logo Blue
        fjord: {
          DEFAULT: "#326CE5",
          light: "#5B8DEF",
        },
        // Warm Accents — Nordic Hearth
        amber: {
          DEFAULT: "#E8A435",
        },
        ember: {
          DEFAULT: "#D4763A",
        },
        // Neutrals — Birch & Stone
        birch: {
          DEFAULT: "#F5EDE3",
        },
        wool: {
          DEFAULT: "#E8DED1",
        },
        stone: {
          DEFAULT: "#9C9489",
        },
        slate: {
          DEFAULT: "#5C564E",
        },
        // Dark Mode — Winter Night
        night: {
          DEFAULT: "#0C0A09",
        },
        charcoal: {
          DEFAULT: "#1C1917",
        },
        ash: {
          DEFAULT: "#A8A29E",
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
