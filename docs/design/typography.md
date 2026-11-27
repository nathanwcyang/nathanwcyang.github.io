# Typography and colour spec

## Font

**One font for the whole site: Atkinson Hyperlegible Next** (variable, weights 200–800). It was built by the Braille Institute for legibility: I, l and 1 look different, and so do 0 and O. Zeros have a slash on purpose.

It's self-hosted through Fontsource (SIL Open Font License), so no requests go to Google. Only the Latin letters are downloaded.

Decided against: a serif for titles (two fonts felt busy), Geist ("AI" reads as "Al"), Lexend (too wide, more wrapping on phones).

## Text styles

Titles stand out by **size and weight only**.

**Every text size is Tailwind's default + 1pt** (set in the `@theme` block of `src/styles/global.css`). The pixel sizes in the table below are the Tailwind defaults; add 1.33px to each. Project write-ups get the same +1pt in `src/styles/global.css`. Use these classes (defined in `src/styles/global.css`) instead of setting sizes and weights by hand.

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
| Badge | Project tag next to a title | 400 | 14px, cream on black; see `src/components/ui/badge.tsx` |
| Divider | Line under project titles | n/a | 2px line, 10% black; see `src/pages/projects/[slug].astro` |
| Menu, buttons | Navigation | 600 | see `src/components/ui/button.tsx` |

## Wide screens

The root font size is `clamp(100%, 1vw, 200%)` (in `src/styles/global.css`). Below 1600px wide it is the visitor's own base size. Past 1600px everything sized in rem grows with the window, like browser zoom, up to 2× at 3200px. So set new widths in rem, not px, or they won't scale with the rest of the page. The main column is 56.25rem (900px), and 62.5rem (1000px) from 1280px up.

## Weights and italics

- **400** body, **500** lede, **600** subheadings and labels, **700** titles, headings and `<strong>`.
- **Italic** only for emphasis inside body text and for pull quotes (`>` blockquotes) in write-ups. No italic titles.
- **Never:** a second font, or weights below 400 for text people need to read.

## Colour

Colours are shadcn CSS variables in `src/styles/global.css` holding **Flexoki light** values (https://stephango.com/flexoki).

| **Role** | **Class** | **Flexoki colour** | **Hex** |
|---|---|---|---|
| Page background | `bg-background` | paper | #FFFCF0 |
| Sidebar / card background | `bg-muted` | base-50 | #F2F0E5 |
| Borders / active menu | `border-border` | base-100 | #E6E4D9 |
| Text and titles | `text-foreground` | black | #100F0F |
| Accent (links, avatar) | `text-primary` | blue-600 | #205EA6 |

- Titles stay near-black. Blue is reserved for links, the avatar and small accents, so it stands out.
- Raised cards (the home intro, project cards) use `bg-card shadow-card` with `border border-transparent` (so forced-colors mode still draws an edge), 16px corners (`rounded-2xl`), and 12px corners (`rounded-xl`) on images inside. Hover deepens to `shadow-card-hover`.
- Use shadcn colour names in code (`text-primary`, `bg-muted`), never raw hex values.

## Changing the colours

Edit the RGB channel values in the `:root` block of `src/styles/global.css`. The site is light-only; there is no dark mode.

The avatar and favicon (`public/avatar-ny.svg`, `public/favicon.svg`) have their colours written in. Update those two files by hand if you change the accent colour.
