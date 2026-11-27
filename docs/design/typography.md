# Typography and colour spec

## Font

**One font for the whole site: Atkinson Hyperlegible Next** (variable, weights 200–800). It was built by the Braille Institute for legibility: I, l and 1 look different, and so do 0 and O. Zeros have a slash on purpose.

It's self-hosted through Fontsource (SIL Open Font License), so no requests go to Google. Only the Latin letters are downloaded.

Decided against: a serif for titles (two fonts felt busy), Geist ("AI" reads as "Al"), Lexend (too wide, more wrapping on phones).

## Text styles

Titles stand out by **size and weight only**.

**Every text size is Tailwind's default + 1pt** (set in `tailwind.config.cjs`). The pixel sizes in the table below are the Tailwind defaults; add 1.33px to each. daisyUI buttons, the footer and project write-ups get the same +1pt in `src/styles/global.css`. Use these classes (defined in `src/styles/global.css`) instead of setting sizes and weights by hand.

| **Class** | **Used for** | **Weight** | **Size (phone → desktop)** |
|---|---|---|---|
| `type-display` | Home hero ("I'm Nathan"), project/post page titles | 700, tight spacing | 36 → 48px |
| `type-title` | Section titles ("Experience", "Featured Projects") | 700, tight spacing | 24 → 30px |
| `type-lede` | Hero subtitle | 500 | 18 → 20px |
| `type-heading` | Card titles, write-up `h2` ("The problem") | 700 | 20px |
| `type-subheading` | CV job titles, write-up `h3` | 600 | 16px |
| Body text | Paragraphs, bullets | 400 | 16px, relaxed line height |
| `type-meta` | Dates, captions, CV detail lines | 400 | 14px, 70% opacity |
| `type-label` | Small section labels ("Key achievements") | 600, uppercase, wide spacing | 12px, 70% opacity |
| Menu, buttons | Navigation | daisyUI default | daisyUI default |

## Weights and italics

- **400** body, **500** lede, **600** subheadings and labels, **700** titles, headings and `<strong>`.
- **Italic** only for emphasis inside body text and for pull quotes (`>` blockquotes) in write-ups. No italic titles.
- **Never:** a second font, or weights below 400 for text people need to read.

## Colour

Colours are shadcn CSS variables in `src/styles/global.css` holding **Flexoki light** values (https://stephango.com/flexoki). daisyUI components still read `src/styles/themes.cjs` until they are removed.

| **Role** | **Class** | **Flexoki colour** | **Hex** |
|---|---|---|---|
| Page background | `bg-background` | paper | #FFFCF0 |
| Sidebar / card background | `bg-muted` | base-50 | #F2F0E5 |
| Borders / active menu | `border-border` | base-100 | #E6E4D9 |
| Text and titles | `text-foreground` | black | #100F0F |
| Accent (links, avatar) | `text-primary` | blue-600 | #205EA6 |

- Titles stay near-black. Blue is reserved for links, the avatar and small accents, so it stands out.
- Use shadcn colour names in code (`text-primary`, `bg-muted`), never raw hex values.

## Swapping the theme

1. Open `src/styles/themes.cjs`.
2. Copy a theme, rename it and change the hex values.
3. Set `SITE_THEME` in `src/config.ts` to the new name.

`flexoki-dark` is ready to use. A light/dark toggle isn't built yet.

The avatar and favicon (`public/avatar-ny.svg`, `public/favicon.svg`) have their colours written in. Update those two files by hand if you change the accent colour.
