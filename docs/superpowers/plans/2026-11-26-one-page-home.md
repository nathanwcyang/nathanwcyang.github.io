# One-Page Home (Mary Johnson Style) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Put the whole CV on the home page as one long scroll, below Featured Projects, in a Mary Johnson-style layout. The sidebar links scroll to their sections, and Contact becomes its own page.

**Architecture:** The home page becomes a stack of `<section id>` blocks: hero, projects, experience, education, certifications, skills. A new `Section` component gives each block the two-column layout (title left, content right on wide screens, stacked on phones). The CV markup moves into one `CvSections` component that the home page renders. Sidebar links become `/#id` anchors. A small script highlights the link for the section in view.

**Tech Stack:** Astro 4, Tailwind + daisyUI (Flexoki theme, Atkinson only), pnpm 10, `node:test` on built HTML, Playwright and axe-core for checks.

**Spec:** Decisions from the chat with Nathan on 2026-11-26 and the tldraw file `nathanwcyang-website-scratchpad-2026-11-26-v2.tldraw` ("take this whole CV page and just slap it on the home page as one large scroll", sidebar-scroll note, Contact as its own page). Grilling answers: Q1 A, Q2 yes/yes, Q3 a+b+c, Q4 yes, Q5 smooth, Q6 simple contact page.

## Global Constraints

- **Home page order:** hero → Featured Projects → Experience → Education → Certifications → Skills.
- **Section headings unchanged:** `Featured Projects`, `Experience`, `Education`, `Certifications`, `Skills`.
- **Sidebar:** `Home` → `/#top`, `Projects` → `/#projects`, `CV` → `/#experience`, `Contact` → `/contact`. Same labels, same order.
- **Two-column layout on wide screens (≥1024px):** section title in a left column about 11rem wide, content on the right. Stacked on phones. Applies to every home section after the hero, including Featured Projects. *(Assumption to confirm.)*
- **Job entries:** title on the left with dates on the right on the same row. Then employer · city. Then the job type ("Co-op" / "Full-time") in small italic. Then the bullets and Key achievements, as now.
- **No tool tags, no certification cards.**
- **Smooth scroll** only when the visitor hasn't turned on "reduce motion." Apple-style animation is issue #18, out of scope here.
- **All existing wording stays word for word.** Only its layout changes. Use `type-*` classes and theme colours only (`docs/design/typography.md`).
- **`/projects`** stays as the full list. **`/cv`** forwards to `/#experience`.
- No phone number or address. No Maps links.

## Review Focus

- **Phone header covering titles:** after tapping Projects or CV on a phone, the section title must sit *below* the sticky top bar, not under it.
- **Coming from another page:** clicking CV in the sidebar on `/projects/rxcounsel` must open the home page at Experience.
- **Highlight at the edges:** at the very top, Home is highlighted. Scrolled to the bottom (Skills), CV is highlighted, not nothing. Only one link is highlighted at a time.
- **Phone menu:** tapping a link closes the menu and scrolls. Focus doesn't stay trapped in the closed menu.
- **Reduce motion:** with "reduce motion" on, links jump instantly.

---

### Task 1: Tests for the new structure

**Files:**
- Modify: `tests/content.test.mjs`

**Interfaces:**
- Consumes: `html(path)` (existing helper).
- Produces: failing tests that Tasks 2–5 make pass.

- [ ] **Step 1: Rewrite the `cv` and `cv profile removed and Relay added` tests to read `html("/")` instead of `html("/cv")`.** Keep every content string they check, except the four `Employer | Type | City | Dates` subtitle strings. Replace those with separate checks for each part:
  - `Express Scripts Canada Pharmacy`, `Mississauga, ON`, `Co-op`, `May–August 2026`
  - `Relay`, `Toronto, ON`, `Full-time`, `February–December 2023`
  - `CareRx Pharmacy`, `Oakville, ON`, `May–September 2022`
- [ ] **Step 2: Add test `home sections in order`:** on `html("/")`, the indexes of `id="top"`, `id="projects"`, `id="experience"`, `id="education"`, `id="certifications"`, `id="skills"` all exist (> -1) and are strictly increasing. Each heading `>Featured Projects<`, `>Experience<`, `>Education<`, `>Certifications<`, `>Skills<` is present. `href="/projects"` and `All projects` are present.
- [ ] **Step 3: Add test `sidebar links`:** on `html("/")` and `html("/projects/rxcounsel")`, the sidebar has `href="/#top"`, `href="/#projects"`, `href="/#experience"`, `href="/contact"`. No `href="mailto:` inside the `<ul class="menu` block.
- [ ] **Step 4: Add test `cv forwards`:** `dist/cv/index.html` contains `/#experience` and `http-equiv="refresh"`.
- [ ] **Step 5: Add test `contact page`:** `html("/contact")` includes `>Contact</h1>`, `Best way to reach me is email.`, `mailto:nwyang@uwaterloo.ca`, `linkedin.com/in/nathanwcyang`, `Mississauga, Ontario`, and no `google.com/maps`.
- [ ] **Step 6:** Run `pnpm test`. Expected: the new and rewritten tests fail, the others pass.
- [ ] **Step 7:** Commit: `test: one-page home, sidebar anchors, contact page`.

### Task 2: Section component and new job entry layout

**Files:**
- Create: `src/components/home/Section.astro`
- Modify: `src/components/cv/TimeLine.astro`
- Create: `src/components/cv/CvSections.astro` (content moved from `src/pages/cv.astro`)

**Interfaces:**
- `Section` props: `{ id: string; title: string }`. Renders `<section id={id} aria-labelledby={`${id}-title`} class="scroll-mt-20 lg:scroll-mt-6 mb-12 lg:grid lg:grid-cols-[11rem_1fr] lg:gap-10">`, with `<h2 id={`${id}-title`} class="type-title mb-5">{title}</h2>` on the left and the default slot on the right.
- `TimeLineElement` props become `{ title: string; org: string; dates: string; location?: string; type?: string }`. `subtitle` is removed. Slots are unchanged (default and `achievements`). Row 1: `h3.type-subheading` title on the left, `span.type-meta whitespace-nowrap` dates on the right (`flex flex-wrap justify-between gap-x-4`). Row 2: `p.type-meta` showing `org`, plus ` · ${location}` when given. Row 3 when given: `p.type-meta italic` showing `type`.
- `CvSections` (no props) renders four `Section`s in this order: `experience`/"Experience", `education`/"Education", `certifications`/"Certifications", `skills`/"Skills". Contents are copied word for word from `cv.astro`, with each job's subtitle split into `org`, `type`, `location`, `dates`.
  - Education: `title="Doctor of Pharmacy Candidate (PharmD)" org="University of Waterloo" dates="2024–2027"` and `title="Bachelor of Health Sciences, Specialization in Health Sciences" org="Western University" dates="2018–2022"`.

- [ ] **Step 1:** Create `Section.astro` and update `TimeLine.astro` as specified.
- [ ] **Step 2:** Create `CvSections.astro` from `cv.astro`, with the sections reordered (Experience before Education) and the props split.
- [ ] **Step 3:** Run `pnpm build`. Expected: build passes. Tests still fail until Task 3.
- [ ] **Step 4:** Commit: `feat: Section component and Mary Johnson-style job entries`.

### Task 3: One-page home and /cv forwarding

**Files:**
- Modify: `src/pages/index.astro`, `astro.config.mjs`
- Delete: `src/pages/cv.astro`

**Interfaces:**
- Consumes: `Section`, `CvSections` (Task 2).

- [ ] **Step 1:** In `index.astro`, wrap the hero in `<section id="top" class="scroll-mt-20 lg:scroll-mt-6">`. Replace the Featured Projects block with `<Section id="projects" title="Featured Projects">`, holding the same cards plus a final link: `<a class="link link-hover type-meta" href="/projects">All projects →</a>`. Then render `<CvSections />`.
- [ ] **Step 2:** Delete `src/pages/cv.astro`. Add `redirects: { "/cv": "/#experience" }` to `astro.config.mjs`.
- [ ] **Step 3:** Run `pnpm test`. Expected: `home sections in order`, `cv`, `cv profile removed and Relay added` and `cv forwards` pass.
- [ ] **Step 4:** Commit: `feat: CV on the home page; /cv forwards to Experience`.

### Task 4: Sidebar anchors, highlight on scroll, smooth scroll, phone menu

**Files:**
- Modify: `src/components/SideBarMenu.astro`, `src/layouts/BaseLayout.astro`, `src/styles/global.css`

**Interfaces:**
- Menu link ids stay `home`, `projects`, `cv`. Add `contact`. `sideBarActiveItemID` keeps working on other pages: project pages pass `"projects"`, the contact page passes `"contact"`.
- Section → link map for highlighting: `top`→`home`, `projects`→`projects`, `experience|education|certifications|skills`→`cv`.

- [ ] **Step 1:** In `SideBarMenu.astro`, set the hrefs as in Global Constraints. Contact becomes a normal link to `/contact`, no longer `mailto:`.
- [ ] **Step 2:** Add highlight-on-scroll to the existing menu script. It runs only when `#top` exists. Use an `IntersectionObserver` on the six sections with `rootMargin: "-40% 0px -55% 0px"` and put `bg-base-300` on exactly one link. If the page is scrolled to the bottom (`innerHeight + scrollY >= scrollHeight - 2`), the CV link wins. Rerun on `astro:after-swap`.
- [ ] **Step 3:** In `global.css`: `@media (prefers-reduced-motion: no-preference) { html { scroll-behavior: smooth; } }`.
- [ ] **Step 4:** In `BaseLayout.astro`'s `setupMenu`, add a click on any `#site-menu a`: uncheck the drawer toggle and call `sync()`, so the phone menu closes before scrolling.
- [ ] **Step 5:** Run `pnpm test`. Expected: `sidebar links` passes.
- [ ] **Step 6: Behaviour check (Playwright, not committed).** At 1400px and 390px:
  1. Click each sidebar link on `/`. The target section title is visible and its top is ≥ 64px from the viewport top on phones.
  2. The highlighted link matches the section.
  3. From `/projects/rxcounsel`, clicking CV ends at Experience.
  4. With `reducedMotion: "reduce"`, `getComputedStyle(html).scrollBehavior` is `auto`.
  5. On a phone, after tapping a link, the drawer checkbox is unchecked.
- [ ] **Step 7:** Commit: `feat: sidebar scrolls to sections and highlights the one in view`.

### Task 5: Contact page

**Files:**
- Create: `src/pages/contact.astro`

**Exact copy:**
- `h1.type-display`: `Contact`
- `p.type-lede`: `Best way to reach me is email.`
- Buttons: `a.btn.btn-primary` `Email me` → `mailto:${SITE_EMAIL}`. `a.btn.btn-outline` `LinkedIn` → `https://www.linkedin.com/in/nathanwcyang/` (`target="_blank" rel="noopener"`).
- `p.type-meta` lines with the same decorative icons as the hero (`aria-hidden`): `nwyang@uwaterloo.ca` (mailto link) and `Mississauga, Ontario` (plain text).
- `BaseLayout title="Contact" sideBarActiveItemID="contact"`.

- [ ] **Step 1:** Create the page.
- [ ] **Step 2:** Run `pnpm test`. Expected: all tests pass.
- [ ] **Step 3:** Commit: `feat: simple contact page`.

### Task 6: Accessibility review and ship

- [ ] **Step 1:** Run the `/design:accessibility-review` checks. That means axe-core on `/`, `/projects`, `/projects/rxcounsel`, `/contact` and `/404` at 1400px, 390px and 320px, plus a keyboard tab-through of the sidebar links and contrast of any new text. Expected: no new violations beyond the known drawer "region" note.
- [ ] **Step 2:** Layout check at 1024px, 1400px, 390px and 320px: no sideways scroll, no overlap, and dates never collide with job titles (they wrap underneath instead).
- [ ] **Step 3:** Update `CLAUDE.md` "Content": the CV now lives in `src/components/cv/CvSections.astro` and shows on the home page.
- [ ] **Step 4:** Take screenshots (desktop and phone), push, and open a PR listing the changes and the accessibility results.
