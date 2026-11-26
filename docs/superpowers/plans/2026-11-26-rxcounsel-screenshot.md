# RxCounsel Screenshot and Home Button Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show the RxCounsel screenshot on the Home and Projects cards and on the RxCounsel page, make the sidebar Home button land at the very top of the page, and ship the humanizer copy edits.

**Architecture:** The screenshot lives in `src/assets/` so Astro resizes it and serves it as WebP. Project frontmatter points at it through Astro's `image()` schema helper, with new `heroAlt` and `heroCaption` fields. A new `ProjectCard` (screenshot on top, text below, bordered) replaces `HorizontalCard` on Home and Projects. For Home, the hero drops `id="top"`. When no element has that id, the browser's built-in rule scrolls `#top` to the top of the document.

**Tech Stack:** Astro 4.16 (`astro:assets`, content collections), Tailwind + daisyUI 4, `node --test` on built HTML, Playwright + axe-core for browser checks.

**Spec:** The decisions Nathan approved in chat on 2026-11-26 (copied verbatim below under Global Constraints). No separate spec file.

## Global Constraints

- Home button: goes to the very top of the page, the same as scrolling all the way up. The gap at the top stays. (Q2: A)
- Cards (Home and Projects): bordered card, screenshot across the top, title and description underneath. Projects without a screenshot get the same card without the image. (Q3: B)
- Keep the blue frame on the screenshot (#19579E border, transparent rounded corners). Do not crop it. (Q4)
- RxCounsel page: screenshot under the title, above "The problem", with this caption, exactly: `RxCounsel's input screen: the pharmacist enters patient details and the new drug, then clicks Generate.` (Q5)
- Image file: `src/assets/projects/rxcounsel/rxcounsel-input-screen.png`, copied from `/mnt/user-data/uploads/14a105b8-image.png` (the solid-blue version, 2698×1540).
- Humanizer edits to `src/content/projects/rxcounsel.md` are already in the working tree. Commit them, word for word.
- Repo rules (CLAUDE.md): one font; use `type-*` classes and theme colour names, never hard-coded fonts, sizes or hex colours; never commit private files; never put a phone number or home address on the site.
- Commits stage files explicitly (`.superpowers/` is not gitignored) and end with the session's Co-Authored-By and Claude-Session lines.

## Review Focus

1. Home click on the home page, from mid-page: the page should end at scrollY 0 on desktop (1400px) and phone (390px), and the phone menu should close.
2. Home click from another page (/projects/rxcounsel, /contact): should open Home at scrollY 0, not partway down.
3. Highlight after the hero loses `id="top"`: Home is highlighted at the top, and Projects or CV as you scroll. Other pages still highlight their own link.
4. Screenshot at 320px wide: no sideways scroll, image fits the card, and the page reserves the image's space before it loads (width and height attributes are set, so the page doesn't jump).
5. Screen readers: the card's link name is the project title, not a long alt text (the card image uses `alt=""`). The RxCounsel page image has the full descriptive alt text.

---

### Task 1: Commit the humanizer copy

**Files:**
- Modify: `tests/content.test.mjs` (add one test)
- Already modified: `src/content/projects/rxcounsel.md`

- [ ] **Step 1: Add test `rxcounsel humanized copy`**

```js
test("rxcounsel humanized copy", () => {
  const h = html("/projects/rxcounsel").replace(/\s+/g, " ");
  for (const s of [
    "Before each call, I spent time pulling together the counselling points, dosing details and kidney or liver considerations from several sources.",
    "The main counselling messages for the patient",
    "tied to a referenced source, so I rebuilt RxCounsel",
  ]) assert.ok(h.includes(s), `missing: ${s}`);
  for (const s of ["That prep took time on every call", "Key counselling messages"])
    assert.ok(!h.includes(s), `still has: ${s}`);
});
```

- [ ] **Step 2: Check it fails without the edit.** Run `git stash push src/content/projects/rxcounsel.md && pnpm test; git stash pop`
Expected: `rxcounsel humanized copy` FAILS, then the stash pops back.

- [ ] **Step 3: Run with the edit.** Run `pnpm test`
Expected: 12 pass, 0 fail.

- [ ] **Step 4: Commit** `tests/content.test.mjs` and `src/content/projects/rxcounsel.md`, with the message "content: humanize RxCounsel page copy".

### Task 2: Home button lands at the very top

**Files:**
- Modify: `src/pages/index.astro` (hero `<section>`)
- Modify: `src/components/SideBarMenu.astro` (script)
- Modify: `tests/content.test.mjs` (`home sections in order`, new test)
- Modify: `CLAUDE.md` (Content section)

**Interfaces:**
- Produces: the hero section has no id. Home-page detection in the sidebar script uses `document.getElementById("projects")`.

- [ ] **Step 1: Write the failing test `home link goes to the very top`**

```js
test("home link goes to the very top", () => {
  const h = html("/");
  assert.ok(!/\sid="top"/.test(h), 'an element still has id="top", so /#top stops at it instead of the page top');
  assert.ok(h.includes('href="/#top"'), "Home link changed");
});
```

Also remove `"top"` from the id list in `home sections in order`. Keep the order check for projects → skills.

- [ ] **Step 2: Run `pnpm test`.** Expected: `home link goes to the very top` FAILS with the id="top" message.

- [ ] **Step 3: Implement**
  - `index.astro`: remove `id="top"` and the `scroll-mt-*` classes from the hero section. Keep `pb-12 mt-5`.
  - `SideBarMenu.astro`: detect the home page with `getElementById("projects")`. Remove `top` from `linkFor`. Keep `let current = "home"` as the default and map the other ids as before, so the hero counts as Home. Leave the AbortController logic alone.
  - `CLAUDE.md`: change "intro (`#top`)" to "intro (no id: `/#top` relies on the browser scrolling to the page top when no element has that id)".

- [ ] **Step 4: Run `pnpm test`.** Expected: all pass.

- [ ] **Step 5: Browser check** (Playwright on `pnpm preview`, at 1400×900 and 390×844):
  - Scroll to the CV, click `#nav-home` (open the drawer first on phone). Expected: `scrollY === 0`, only `nav-home` highlighted.
  - From `/projects/rxcounsel` and `/contact`, click Home. Expected: URL `/#top`, `scrollY === 0`.
  - Run the earlier highlight checks (load, Projects, CV, bottom). Expected: home, projects, cv, cv.
  - Turn on reduced motion and click Home. Expected: an instant jump to 0.

- [ ] **Step 6: Commit** `src/pages/index.astro`, `src/components/SideBarMenu.astro`, `tests/content.test.mjs` and `CLAUDE.md`, with the message "fix: Home goes to the very top of the page".

### Task 3: Screenshot on the RxCounsel page

**Files:**
- Create: `src/assets/projects/rxcounsel/rxcounsel-input-screen.png` (copied, not edited)
- Modify: `src/content/config.ts` (project schema)
- Modify: `src/content/projects/rxcounsel.md` (frontmatter)
- Modify: `src/pages/projects/[slug].astro`
- Modify: `tests/content.test.mjs`

**Interfaces:**
- Produces: `project.data.heroImage` is `ImageMetadata | undefined` (from `image()`), plus `heroAlt?: string` and `heroCaption?: string`. The schema rejects `heroImage` without `heroAlt`. Task 4 uses these.
- Leave the blog schema as it is.

- [ ] **Step 1: Write the failing test `rxcounsel screenshot on project page`**

```js
test("rxcounsel screenshot on project page", () => {
  const h = html("/projects/rxcounsel");
  const fig = h.slice(h.indexOf("<figure"), h.indexOf("</figure>"));
  assert.ok(fig, "no <figure>");
  assert.match(fig, /src="\/_astro\/rxcounsel-input-screen[^"]*\.webp"/, "screenshot not served as webp from _astro");
  assert.match(fig, /width="\d+"/); assert.match(fig, /height="\d+"/);
  assert.ok(fig.includes("Generate button"), "alt text missing");
  assert.ok(fig.replace(/&#39;/g, "'").includes("RxCounsel's input screen: the pharmacist enters patient details and the new drug, then clicks Generate."), "caption missing");
  assert.ok(h.indexOf("</h1>") < h.indexOf("<figure") && h.indexOf("<figure") < h.indexOf("The problem"), "figure not between title and The problem");
  assert.match(h, /property="og:image" content="[^"]*rxcounsel-input-screen/, "og:image not set");
});
```

- [ ] **Step 2: Run `pnpm test`.** Expected: FAIL, "no <figure>".

- [ ] **Step 3: Implement**
  - Copy the PNG to `src/assets/projects/rxcounsel/rxcounsel-input-screen.png`.
  - `config.ts`: change the project schema to `schema: ({ image }) => z.object({...})`, with `heroImage: image().optional()`, `heroAlt: z.string().optional()` and `heroCaption: z.string().optional()`. Add a `.refine` that fails when `heroImage` is set without `heroAlt`.
  - `rxcounsel.md` frontmatter:
    - `heroImage: "../../assets/projects/rxcounsel/rxcounsel-input-screen.png"`
    - `heroAlt: "RxCounsel's input form, with fields for age, sex, renal and hepatic impairment, current medications, medical conditions and an input modifier, a New drug(s) section for drug name, dose and sig, and a Generate button."`
    - `heroCaption` set to the exact caption from Global Constraints.
  - `[slug].astro`:
    - Remove the old top-of-article `<Image>`.
    - After the title, badge and divider, render `<figure class="not-prose my-6">` with `<Image src={heroImage} alt={heroAlt} width={750} format="webp" class="w-full h-auto" />`. Don't pass a height, so Astro keeps the image's own shape.
    - Add `<figcaption class="type-meta mt-2">` when `heroCaption` is set.
    - Pass `image={heroImage?.src}` to BaseLayout.

- [ ] **Step 4: Run `pnpm test`.** Expected: all pass.

- [ ] **Step 5: Commit** the PNG, `config.ts`, `rxcounsel.md`, `[slug].astro` and `tests/content.test.mjs`, with the message "feat: RxCounsel screenshot on its project page".

### Task 4: Screenshot cards on Home and Projects

**Files:**
- Create: `src/components/ProjectCard.astro`
- Delete: `src/components/HorizontalCard.astro` (nothing else uses it)
- Modify: `src/pages/index.astro`, `src/pages/projects.astro`
- Modify: `tests/content.test.mjs`, `CLAUDE.md`

**Interfaces:**
- Consumes: `heroImage` (`ImageMetadata | undefined`) from Task 3.
- Produces: `ProjectCard` with props `{ title: string; desc: string; url: string; img?: ImageMetadata; badge?: string }`.

- [ ] **Step 1: Write the failing test `project cards show the screenshot`**

```js
test("project cards show the screenshot", () => {
  for (const page of ["/", "/projects"]) {
    const h = html(page);
    const start = h.indexOf('href="/projects/rxcounsel"');
    assert.ok(start > -1, `${page}: no RxCounsel card link`);
    const card = h.slice(start, h.indexOf("</a>", start));
    assert.match(card, /<img[^>]*src="\/_astro\/rxcounsel-input-screen[^"]*\.webp"/, `${page}: card has no screenshot`);
    assert.match(card, /<img[^>]*alt=""/, `${page}: card image should be decorative (alt="")`);
    assert.ok(card.includes(">RxCounsel<"), `${page}: card title missing`);
  }
});
```

- [ ] **Step 2: Run `pnpm test`.** Expected: FAIL on "/", "card has no screenshot".

- [ ] **Step 3: Implement**
  - `ProjectCard.astro`: one `<a href={url}>` wraps the whole card. Card classes: `block rounded-box border border-base-300 bg-base-100 overflow-hidden`. Hover: `motion-safe:transition hover:shadow-lg`, with no scale.
    - When `img` is set, render `<Image src={img} alt="" width={750} format="webp" class="w-full h-auto" />` first.
    - Then a `p-5` body with `<h3 class="type-heading">` for the title (plus the badge if set) and `<p class="mt-1">` for the description.
    - Use theme colour names only.
  - In `index.astro` and `projects.astro`, swap `HorizontalCard` for `ProjectCard`. Replace each `divider` between cards with a `flex flex-col gap-6` wrapper. Keep "All projects →" under the Home cards. Delete `HorizontalCard.astro`.
  - `CLAUDE.md` Content section: add "A project's `heroImage` (in `src/assets/projects/<slug>/`) shows on its card and at the top of its page. `heroAlt` is required with it. `heroCaption` is optional."

- [ ] **Step 4: Run `pnpm test`.** Expected: all pass.

- [ ] **Step 5: Browser and accessibility check** (1400, 1024, 390 and 320px; Home, Projects, RxCounsel):
  - `document.documentElement.scrollWidth <= innerWidth`.
  - axe shows no new violations, compared with the known daisyUI drawer "region" note on phones.
  - Take screenshots for the PR.

- [ ] **Step 6: Commit** `src/components/ProjectCard.astro`, the removal of `HorizontalCard.astro`, `index.astro`, `projects.astro`, `tests/content.test.mjs` and `CLAUDE.md`, with the message "feat: screenshot project cards on Home and Projects".
