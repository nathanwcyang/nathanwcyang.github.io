/** @type {import('tailwindcss').Config} */
const themes = require("./src/styles/themes.cjs");
const defaultTheme = require("tailwindcss/defaultTheme");

// Every text size is Tailwind's default + 1pt (1pt = 1/12rem), keeping the same
// line-height ratio. See docs/design/typography.md.
const ONE_PT_REM = 1 / 12;
const fontSize = Object.fromEntries(
  Object.entries(defaultTheme.fontSize).map(([name, [size, { lineHeight }]]) => {
    const rem = parseFloat(size);
    const ratio = lineHeight.endsWith("rem") ? parseFloat(lineHeight) / rem : Number(lineHeight);
    return [name, [`${(rem + ONE_PT_REM).toFixed(4)}rem`, { lineHeight: `${+ratio.toFixed(4)}` }]];
  })
);

module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    fontSize,
    extend: {
      colors: {
        border: "rgb(var(--border) / <alpha-value>)",
        input: "rgb(var(--input) / <alpha-value>)",
        ring: "rgb(var(--ring) / <alpha-value>)",
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        primary: {
          DEFAULT: "rgb(var(--primary) / <alpha-value>)",
          foreground: "rgb(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "rgb(var(--secondary) / <alpha-value>)",
          foreground: "rgb(var(--secondary-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "rgb(var(--destructive) / <alpha-value>)",
          foreground: "rgb(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "rgb(var(--muted) / <alpha-value>)",
          foreground: "rgb(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
          foreground: "rgb(var(--accent-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "rgb(var(--popover) / <alpha-value>)",
          foreground: "rgb(var(--popover-foreground) / <alpha-value>)",
        },
        card: {
          DEFAULT: "rgb(var(--card) / <alpha-value>)",
          foreground: "rgb(var(--card-foreground) / <alpha-value>)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        // One font for the whole site: Atkinson Hyperlegible Next (see docs/design/typography.md)
        sans: ['"Atkinson Hyperlegible Next Variable"', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    // Each theme in src/styles/themes.cjs becomes a data-theme name.
    themes: Object.entries(themes).map(([name, colors]) => ({ [name]: colors })),
    logs: false,
  },
};
