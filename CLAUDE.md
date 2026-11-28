# nathan-cv-website

## Agent skills

### Issue tracker

Issues live in this repo's GitHub Issues, managed with the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Default five labels: needs-triage, needs-info, ready-for-agent, ready-for-human, wontfix. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `CONTEXT.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.

## Private files and the WordPress theme

This repo is public. Nathan's private files (his CV, the purchased "Hub" WordPress theme, tldraw scratchpads, screenshots) live in a separate folder outside this repo. Never copy them in. The one exception: a screenshot Nathan approves for the site goes in `src/assets/projects/<slug>/` (see Content below). Check it first for patient data, a phone number or a home address.

The Hub theme is **reference only**. Its CSS, images, fonts and design are under a ThemeForest purchase license. When Nathan asks to rebuild a theme component, look at it (or a screenshot of it) and write a new version from scratch in Astro + Tailwind. Never paste the theme's code, images, icons or fonts into this repo.

Never put Nathan's phone number or home address on the site.

## Content

- The CV (experience, education, certifications, skills) lives in one file: `src/content/cv.md`, in its frontmatter. Achievement text can hold markdown links (`[text](/url)`).
- Projects live in `src/content/projects/*.md`. `category` is `pharmacy` or `creative`. `featured: true` pins a project to the top of the home page, which shows the first 3 (featured first, then newest) as cards without screenshots. A project's `heroImage` (in `src/assets/projects/<slug>/`) shows at the top of its page. `heroAlt` is required with it. `heroCaption` is optional.
- Three kinds of page: the home page (`src/pages/index.astro`), the projects list (`/projects`, one list, newest first) and one page per project (`/projects/<slug>`).
- The home page is one long scroll: Hero (`#hero`, photo, location, Email and LinkedIn; no GitHub), Projects (`#projects`), Experience (`#experience`), Education with Certifications (`#education`), Skills (`#skills`). Nothing may have `id="top"`: `/#top` relies on the browser scrolling to the page top when no element has that id.
- The top bar (`src/components/ui/TopBar.tsx`) has no name on the left: one frosted pill on the right links to `/#experience`, `/#education`, `/#skills`, `/projects` and LinkedIn. On the home page, scrolling past 24px shrinks it to `/projects` + LinkedIn (styles at the end of `src/styles/global.css`, script in `BaseLayout.astro`; the prototype and its motion plans are on the `prototype/morphing-navbar` branch). On phones the links move into a native popover menu.
- `/cv` redirects to `/#experience` and `/contact` to `/` (in `astro.config.mjs`).
- The blog was removed. To publish the first post, restore it from the `v1` git tag (`src/pages/blog`, `PostLayout`, `HorizontalCard`, `rss.xml.js` and the blog collection) and add a Blog link to `NAV_LINKS` in the top bar.
- The design before this one (sidebar, Flexoki, avatar orb) is kept under the `v2` git tag.

## Design

Layout follows [react-portfolio-template](https://github.com/yujisatojr/react-portfolio-template) (MIT), rebuilt in Astro. Components come from Astryx with a custom **ayu** theme (ayu light colours, Atkinson Hyperlegible Next, 16px base text). Fonts, text sizes and colours follow `docs/design/typography.md`.

- Only `src/components/ui/` imports Astryx. Pages and sections use those wrappers, so the component library can be swapped later.
- Tailwind handles page layout, so the Astryx guide's "No <div>" and "no arbitrary values" rules apply only inside `src/components/ui/`. Every wrapper renders inside `Themed` (the ayu `<Theme>` from the generated `src/astryx-themes.ts`, which also loads the theme CSS), because Astro renders each React component separately. `src/styles/global.css` must stay the first stylesheet, for its `@layer` order. Before shipping, run `pnpm check` (types), `pnpm test` and `pnpm exec astryx doctor --built .`.
- Change colours, the font or text size through the theme editor (`pnpm exec astryx experimental theme editor set ayu ...`), never by overriding tokens in CSS. Never hard-code fonts, sizes or hex colours on a page: use the theme's Tailwind utilities (`text-primary`, `text-secondary`, `text-accent`, `bg-card`, `bg-accent-bg`).
- Links use `text-accent` (#A85100). Ayu's orange (#F29718) is for decoration only, because it fails contrast as text.
- Icons: Astryx's semantic icons first. Phosphor (`@phosphor-icons/react/dist/ssr`) where Astryx has none (mail, map pin, LinkedIn, category icons).
- The site is light-only; there is no dark mode. Sections fade up only when reduced motion is off.
- Astro renders the React wrappers to static HTML. Pass icons to wrappers as components (`icon={MapPin}`), not as JSX elements: Astro can't hand JSX to React props.

<!-- ASTRYX:START -->
Astryx v0.7.17 · 174 components
CLI: run every command as `pnpm exec astryx <cmd>` (shown below as `astryx ...`).

SETUP (once, in app entry e.g. main.tsx) — without these, components render unstyled:
  import "@astryxdesign/core/reset.css";
  import "@astryxdesign/core/astryx.css";

WORKFLOW — start every page from a template, never from scratch:
1. `astryx build "<idea>"` — names the template to scaffold from and the parts it lacks.
2. `astryx template <name> <path>` — scaffold it; keep its frame, gap and padding; replace the content.
3. `astryx component <Name>` to read props before using one; `astryx template <Block>` prints a block example to read for a part it lacks. Astryx names differ from other libraries: buttons, badges, tokens and tabs take their text in `label` (Text, Heading and Link take children), booleans start with `is` or `has` (`isOpen`, `isDisabled`), and every input takes `value` and `onChange`.
Changing an existing page? Keep it: skip step 2 and add components inside its sections; read a block example when it helps.
Before you deliver a build, run `astryx doctor --built <dir>`; don't deliver it if it fails.

RULES:
- No <div> — components handle all layout and spacing.
- Read `astryx docs layout` before changing a template's frame.
- Dense data = rows (Table, List/Item), not Card-wrapped lists. Badge = counts only.
- Style with component props first, then Tailwind utilities backed by tokens. No raw hex/px.
- THEMES: palettes and custom colors go through the theme, never :root overrides; so does a denser or roomier app (`editor set <name> spacing tight`), never gap and padding changes page by page. A change to one kind of part (the sidebar, its selected item, the gaps in a form) is a theme change too, not props on one page: `editor how "<ask>"` names the `set … --on <part>` line. No app yet: `astryx experimental theme preview app <dir>` makes a starter app that shows the theme. To make or change a theme (colors, fonts, corners, spacing, a look from a picture), prefer the experimental theme editor over hand-written theme files: `astryx experimental theme editor new <name> --like neutral`, then `editor set <name> <thing> <value>` or `editor how "<what you want>"`; wire it with `astryx theme add <name>`; after each change look at it with `astryx experimental theme editor show <name> --png` (takes pictures of real components) and open the PNGs it writes; a theme change is not done until you have looked at the pictures. In code, extend an imported theme to customize it; `theme eject <slug>` only forks source. See `astryx docs theme`.
- SELF-CHECK: re-read the file; replace any style={{…}}, raw <div>/<span>, imported .css/@apply, or hardcoded/arbitrary value (bg-[#fff], p-[13px]) with the component or a token-backed utility.

`astryx help` lists every command. Key ones beyond the workflow:
  search "<query>"   find any component / hook / doc / template
  discover <words>   integrations you could add
  docs <topic>       getting-started, principles, tokens, theme … (`astryx docs` lists all)
  docs cli           commands and API reference
  docs authoring     build an integration package, and every field it holds
  upgrade --from <old version> --apply   run after a dependency bump
To remove this block, run `astryx init --remove-agents`, which removes it from the agent files at the project root and in the folder you run it in; from any other file it leaves, delete everything from ASTRYX:START to ASTRYX:END.
<!-- ASTRYX:END -->
