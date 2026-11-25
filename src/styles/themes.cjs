// Site colour themes.
//
// To try a new palette (from Flexoki or anywhere else):
//   1. Copy one theme below, rename it, and swap in the new hex values.
//   2. Set SITE_THEME in src/config.ts to the new name.
// Every page reads its colours from these names, so nothing else needs to change.
//
// What each name controls:
//   base-100      main page background
//   base-200      sidebar and card backgrounds
//   base-300      borders and the highlighted menu item
//   base-content  main text colour
//   primary       links, buttons and accents (the avatar circle uses this too)
//   neutral       dark badges and tags

// Shape settings shared by every theme (kept from the original "lofi" look:
// square-ish corners, no button bounce).
const shape = {
  "--rounded-box": "0.25rem",
  "--rounded-btn": "0.125rem",
  "--rounded-badge": "0.125rem",
  "--tab-radius": "0.125rem",
  "--animation-btn": "0",
  "--animation-input": "0",
  "--btn-focus-scale": "1",
};

// Flexoki by Steph Ango (MIT licence): https://stephango.com/flexoki
const flexoki = {
  paper: "#FFFCF0",
  black: "#100F0F",
  base50: "#F2F0E5",
  base100: "#E6E4D9",
  base200: "#CECDC3",
  base600: "#6F6E69",
  base900: "#282726",
  base950: "#1C1B1A",
  blue400: "#4385BE",
  blue600: "#205EA6",
  green400: "#879A39",
  green600: "#66800B",
  yellow400: "#D0A215",
  yellow600: "#AD8301",
  red400: "#D14D41",
  red600: "#AF3029",
};

module.exports = {
  "flexoki-light": {
    "color-scheme": "light",
    "base-100": flexoki.paper,
    "base-200": flexoki.base50,
    "base-300": flexoki.base100,
    "base-content": flexoki.black,
    primary: flexoki.blue600,
    "primary-content": flexoki.paper,
    secondary: flexoki.black,
    "secondary-content": flexoki.paper,
    accent: flexoki.blue400,
    "accent-content": flexoki.black,
    neutral: flexoki.black,
    "neutral-content": flexoki.paper,
    info: flexoki.blue600,
    success: flexoki.green600,
    warning: flexoki.yellow600,
    error: flexoki.red600,
    ...shape,
  },
  "flexoki-dark": {
    "color-scheme": "dark",
    "base-100": flexoki.black,
    "base-200": flexoki.base950,
    "base-300": flexoki.base900,
    "base-content": flexoki.base200,
    primary: flexoki.blue400,
    "primary-content": flexoki.black,
    secondary: flexoki.base200,
    "secondary-content": flexoki.black,
    accent: flexoki.blue600,
    "accent-content": flexoki.paper,
    neutral: flexoki.base200,
    "neutral-content": flexoki.black,
    info: flexoki.blue400,
    success: flexoki.green400,
    warning: flexoki.yellow400,
    error: flexoki.red400,
    ...shape,
  },
};
