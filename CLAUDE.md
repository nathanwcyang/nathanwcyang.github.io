# nathan-cv-website

## Agent skills

### Issue tracker

Issues live in this repo's GitHub Issues, managed with the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Default five labels: needs-triage, needs-info, ready-for-agent, ready-for-human, wontfix. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `CONTEXT.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.

## Private files and the WordPress theme

This repo is public. Nathan's private files (his CV, the purchased "Hub" WordPress theme, tldraw scratchpads, screenshots) live in a separate folder outside this repo. Never copy them in.

The Hub theme is **reference only**. Its CSS, images, fonts and design are under a ThemeForest purchase license. When Nathan asks to rebuild a theme component, look at it (or a screenshot of it) and write a new version from scratch in Astro + Tailwind. Never paste the theme's code, images, icons or fonts into this repo.

Never put Nathan's phone number or home address on the site.

## Content

- Projects live in `src/content/projects/*.md`. `category` is `pharmacy` or `creative`. `featured: true` pins a project to the top of the home page. The home page shows the first 3 (featured first, then newest).
- The blog is hidden from the menu until the first real post. Re-add the Blog link in `src/components/SideBarMenu.astro` when publishing one.

## Design

Fonts, text styles and colours follow `docs/design/typography.md`. Use the `type-*` classes and theme colour names (`text-primary`, `bg-base-200`); never hard-code fonts, sizes or hex colours on a page.
