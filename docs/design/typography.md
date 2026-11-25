# Typography and colour spec

## Fonts

| **Role** | **Font** | **Why** |
|---|---|---|
| Titles (serif) | Newsreader (variable, optical sizes) | Calm and credible. Marks where a section starts. |
| Everything else (sans) | Atkinson Hyperlegible Next (variable) | Built for legibility. Carries everything you read for facts. |

Both are self-hosted through Fontsource (SIL Open Font License), so no requests go to Google. Only the Latin letters are downloaded.

**Rule:** the serif is for short titles you read once to find your place. If someone reads it to learn something, it's Atkinson.

## Text styles

Use these classes (defined in `src/styles/global.css`) instead of setting fonts, sizes and weights by hand.

| **Class** | **Used for** | **Font** | **Weight** | **Size (phone → desktop)** |
|---|---|---|---|---|
| `type-display` | Home hero ("I'm Nathan") | Newsreader | 600 | 36 → 48px |
| `type-title` | Section titles ("Experience", "Featured Projects") | Newsreader | 600 | 24 → 30px |
| Project/post page title (`h1`) | The one title at the top of a write-up | Newsreader | 600 | 36px |
| `type-lede` | Hero subtitle | Atkinson | 500 | 18 → 20px |
| `type-heading` | Card titles, write-up `h2` ("The problem") | Atkinson | 700 | 20px |
| `type-subheading` | CV job titles, write-up `h3` | Atkinson | 600 | 16px |
| Body text | Paragraphs, bullets | Atkinson | 400 | 16px, relaxed line height |
| `type-meta` | Dates, captions | Atkinson | 400 | 14px, 70% opacity |
| Menu, buttons | Navigation | Atkinson | daisyUI default | daisyUI default |

## Weights and italics

- **Newsreader:** always 600 (semibold). Never 700; bold serif looks heavy next to Atkinson.
- **Atkinson:** 400 body, 500 lede, 600 subheadings and labels, 700 headings and `<strong>`.
- **Italic:** Atkinson italic for emphasis inside body text. Newsreader italic only for pull quotes (`>` blockquotes in write-ups). No italic titles.
- **Never:** serif on long lines (job titles, card titles, subtitles), serif below 24px, or a third font.

## Colour

Colours come from the active theme in `src/styles/themes.cjs`. Default: **Flexoki light** (https://stephango.com/flexoki).

| **Role** | **Flexoki colour** | **Hex** |
|---|---|---|
| Page background | paper | #FFFCF0 |
| Sidebar / card background | base-50 | #F2F0E5 |
| Borders / active menu | base-100 | #E6E4D9 |
| Text and titles | black | #100F0F |
| Accent (links, avatar) | blue-600 | #205EA6 |

- Titles stay near-black. Blue is reserved for links, the avatar and small accents, so it stands out.
- Use theme names in code (`text-primary`, `bg-base-200`), never raw hex values. That keeps themes swappable.

## Swapping the theme

1. Open `src/styles/themes.cjs`.
2. Copy a theme, rename it and change the hex values.
3. Set `SITE_THEME` in `src/config.ts` to the new name.

`flexoki-dark` is ready to use. A light/dark toggle isn't built yet.

The avatar and favicon (`public/avatar-ny.svg`, `public/favicon.svg`) have their colours written in. Update those two files by hand if you change the accent colour.
