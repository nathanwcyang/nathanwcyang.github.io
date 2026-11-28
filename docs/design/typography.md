# Typography and colour spec

## Font

**One font for the whole site: Atkinson Hyperlegible Next** (variable, weights 200–800). It was built by the Braille Institute for legibility: I, l and 1 look different, and so do 0 and O. Zeros have a slash on purpose.

It's self-hosted through Fontsource (SIL Open Font License), so no requests go to Google. Only the Latin letters are downloaded. The Astryx theme names it as its font (`"Atkinson Hyperlegible Next Variable"`), so Astryx components use it too.

Decided against: a serif for titles (two fonts felt busy), Geist ("AI" reads as "Al"), Lexend (too wide, more wrapping on phones).

## Where styles come from

The site uses [Astryx](https://github.com/facebook/astryx) components with a custom theme called **ayu** (ayu light colours on Astryx's neutral theme). The theme lives in `themes/ayu/` and is changed only with the theme editor:

```bash
pnpm exec astryx experimental theme editor set ayu <thing> <value>
```

Each change rebuilds the app copy in `src/themes/ayu/`, which `src/styles/global.css` imports. Never edit `src/themes/ayu/` by hand.

Tailwind sits alongside Astryx for layout. Astryx's Tailwind bridge (`@astryxdesign/core/tailwind-theme.css`) turns theme tokens into utilities, so `text-primary`, `text-secondary`, `bg-card` and `text-sm` all follow the theme.

**Wrapper rule:** only the files in `src/components/ui/` import Astryx. Pages and sections use those wrappers (`Button`, `Card`, `Tag`, `Icon`, `TopBar`). To swap component libraries, rewrite those files.

## Text sizes

The theme's base text size is **16px** (`text-size larger`). Astryx's own default is 14px, which suits dense apps more than a CV. Tailwind's size utilities follow the theme's scale:

| **Class** | **Size** | **Used for** |
|---|---|---|
| `text-sm` | 13px | Footer, project page date and caption |
| `text-base` / body | 16px | Paragraphs, bullets, CV detail lines |
| `text-lg` | 19px | CV job titles, skill groups, hero subtitle |
| `text-xl` | 23px | Project card titles |
| `text-3xl` | 33px | Section titles ("Experience", "Projects") |
| `text-4xl` → `text-6xl` | 40px → hero size | Page titles and the hero name |

Titles stand out by **size and weight only** (700, `tracking-tight` on big ones). Tailwind's reset clears Astryx's own heading styles, so every heading sets its size and weight with classes.

## Weights and italics

- **400** body, **700** titles, headings and `<strong>`.
- **Italic** only for the CV's job type (Co-op, Full-time), emphasis in body text, and pull quotes in write-ups.
- **Never:** a second font, or weights below 400 for text people need to read.

## Colour

Colours are [ayu light](https://github.com/ayu-theme/ayu-colors), set as Astryx theme tokens:

| **Role** | **Token** | **Tailwind class** | **Hex** | **Contrast on page** |
|---|---|---|---|---|
| Page background | `--color-background-body` | `bg-body` | #F8F9FA | n/a |
| Cards, top-bar menu | `--color-background-card` | `bg-card` | #FFFFFF | n/a |
| Borders and dividers | `--color-border` | `border-border` | #6B7D8F at 12% (ayu's line colour) | decoration only |
| Text and titles | `--color-text-primary` | `text-primary` | #2F3337 | 12.1:1 |
| Secondary text (dates, descriptions) | `--color-text-secondary` | `text-secondary` | #5C6166 (ayu's text colour) | 5.9:1 |
| Links | `--color-text-accent` | `text-accent` | #A85100 | 5.2:1 |
| Accent (timeline dots, photo ring, primary button) | `--color-accent` | `bg-accent-bg` | #F29718 (ayu's accent) | decoration only |
| Text on the accent button | `--color-on-accent` | n/a | #2F3337 | 5.6:1 on the orange |

- Body text is a darkened ayu grey (#2F3337) instead of ayu's own #5C6166, so it reads as near-black.
- Ayu's orange (#F29718) is only 2.2:1 on the page, so it never colours text. Links use the darker #A85100.
- Ayu's own text-on-accent colour (#7E4B01) is only 3.2:1 on the orange, so the Email button uses #2F3337.
- Tests (`tests/content.test.mjs`) check every theme colour against the `ayu` npm package, list the three deliberate departures above, and check that every text colour reaches 4.5:1.
- The site is light-only; there is no dark mode.
- The favicon (`public/favicon.svg`) has its colours written in. Update it by hand if the accent changes.

## Motion

Sections fade up over 300ms when the page loads (`[data-fade]` in `src/styles/global.css`). The rule only exists inside `@media (prefers-reduced-motion: no-preference)`, so visitors who have reduced motion turned on see no movement.
