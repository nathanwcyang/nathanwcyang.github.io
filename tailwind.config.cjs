/** @type {import('tailwindcss').Config} */
const themes = require("./src/styles/themes.cjs");
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        // Body text and everything you read: Atkinson Hyperlegible Next
        sans: ['"Atkinson Hyperlegible Next Variable"', ...defaultTheme.fontFamily.sans],
        // Big titles only: Newsreader (see docs/design/typography.md)
        serif: ['"Newsreader Variable"', "Georgia", ...defaultTheme.fontFamily.serif],
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    // Each theme in src/styles/themes.cjs becomes a data-theme name.
    themes: Object.entries(themes).map(([name, colors]) => ({ [name]: colors })),
    darkTheme: "flexoki-dark",
    logs: false,
  },
};
