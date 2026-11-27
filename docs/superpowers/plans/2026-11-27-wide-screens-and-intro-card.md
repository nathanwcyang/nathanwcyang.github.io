# Wide Screens and Intro Card Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fill wide desktop screens (up to a 32″ 4K at 3840px, unscaled) without huge side margins, put the home intro in a raised card, and use HyperUI-style pills for Skills.

**Architecture:** Past 1600px of viewport width the root font size grows with the viewport (`clamp(100%, 1vw, 200%)`), so every rem-based size (text, sidebar, spacing, the main column cap) scales together like browser zoom. Remaining pixel sizes that sit next to rem sizes are converted so nothing drifts. The intro and project cards share one shadow token.

**Tech Stack:** Astro 5, Tailwind CSS 4 (`@theme` tokens in `src/styles/global.css`), node:test against the built `dist/`.

**Spec:** Decisions from the 2026-11-27 grilling session (below). Markup: `~/Documents/nathan-cv-website-local/nathanwcyang-website-scratchpad-2026-11-27.tldraw` (red = side gutters on desktop home, blue = intro card).

## Decisions

| Q | Decision |
|---|---|
| 1 | Scale the page up on very wide screens (option B), plus a modest width-cap increase |
| 2 | Applies to all pages, through `BaseLayout` |
| 3 | Intro card: paper card on paper page, depth from a layered shadow only; 16px card corners, 12px photo corners, 32px inner padding |
| 4 | Card shows on phones too, with 20px inner padding |
| 5 | Skills become HyperUI base badges (filled pills); Featured Projects card gets the same shadow as the intro card; timeline unchanged in look |

**Cap value (please confirm):** Q1 said "about 1,100px". At 1100px the CV body column is ~836px, about 96 characters a line, past the 80-character limit in the design guidance. This plan uses **1000px (62.5rem)**: ~85 characters, close to today's ~73. Change the one value in Task 1 if you prefer 1100px (68.75rem).

## Global Constraints

- One font, `type-*` classes and shadcn colour names only; no hex colours or fixed font sizes in pages (CLAUDE.md, `docs/design/typography.md`).
- Light-only; no `dark:` classes needed.
- Breakpoints stay as they are. Tailwind 4 media queries use the browser's default rem, so scaling the root font does not move them.
- Respect a visitor's own larger browser font size: the scale's lower bound is `100%`, never a px value.
- Hover styles via Tailwind 4 `hover:` only (already gated behind `@media (hover: hover)`).
- Keep `border: 1px solid transparent` under every shadow-only card, so forced-colors mode still draws an edge (better-ui).

## Review Focus

1. **Laptop widths (1280–1600px) must look as before, apart from the wider cap.** Root font stays 16px below 1600px. Verified at 1440px in Task 1 step 5.
2. **Timeline line stays on the dots at 200% scale.** Pixel offsets next to rem dots drift. Test in Task 1.
3. **Browser zoom and a larger default font still work.** `clamp(100%, …)` keeps the visitor's base. Checked by test that the min bound is `100%`.
4. **Write-up pages keep a readable line length** when the page is wider. The article cap moves from 750px to 46.875rem so it scales with the root font instead of shrinking relative to it. Test in Task 1.
5. **Forced-colors mode shows card edges.** Cards keep a transparent 1px border. Test in Task 2.

---

### Task 1: Scale the page on wide screens

**Files:**
- Modify: `src/styles/global.css` (the `html` rule, ~line 115)
- Modify: `src/layouts/BaseLayout.astro:32`
- Modify: `src/pages/projects/[slug].astro:22`
- Modify: `src/components/cv/TimeLine.astro:11`
- Modify: `docs/design/typography.md` (add a "Wide screens" section)
- Create: `tests/layout.test.mjs`

**Interfaces:**
- Produces: root font scaling every later task inherits; `tests/layout.test.mjs` with the same `html(path)` and `css()` helpers as `tests/interface.test.mjs` (copy them, they are 6 lines).

- [ ] **Step 1: Write the failing tests** in `tests/layout.test.mjs`

```js
test("root font scales past 1600px, never below the visitor's base", () => {
  assert.match(css(), /html\{[^}]*font-size:clamp\(100%,1vw,200%\)/);
});
test("main column cap is in rem and wider from xl", () => {
  const h = html("/");
  assert.ok(!h.includes("max-w-[900px]"), "old px cap still present");
  assert.ok(h.includes("lg:max-w-[56.25rem]") && h.includes("xl:max-w-[62.5rem]"), "rem caps missing");
});
test("write-up column scales with the root font", () => {
  assert.ok(html("/projects/rxcounsel").includes("max-w-[46.875rem]"));
});
test("timeline line is centred under the dot, not offset in px", () => {
  const h = html("/");
  assert.ok(!h.includes("translate-x-[7px]"));
  assert.match(h, /education__line[^"]*mx-auto/);
});
```

- [ ] **Step 2: Run** `pnpm test` — Expected: the four new tests FAIL; existing tests pass.

- [ ] **Step 3: Implement**
  - `global.css` `html` rule: add `font-size: clamp(100%, 1vw, 200%);` with a one-line comment (starts growing at 1600px wide, 200% at 3200px).
  - `BaseLayout.astro:32`: replace `lg:max-w-[900px]` with `lg:max-w-[56.25rem] xl:max-w-[62.5rem]` (900px → rem; 1000px from 1280px).
  - `[slug].astro:22`: `max-w-[750px]` → `max-w-[46.875rem]`.
  - `TimeLine.astro:11`: replace `translate-x-[7px]` with `mx-auto` (the parent is as wide as the `w-4` dot).
  - `typography.md`: a short "Wide screens" section stating the clamp, the 1600px start, the 200% cap, and that new widths go in rem.

- [ ] **Step 4: Run** `pnpm test` — Expected: all PASS.

- [ ] **Step 5: Check in the browser** (dev server `astro-dev`, `resize_window`) at 1440×900, 2560×1440 and 3840×2160: no horizontal scrollbar; the timeline line runs through the dots; at 1440 the root font is 16px (`getComputedStyle(document.documentElement).fontSize`).

- [ ] **Step 6: Commit** `feat: scale the page up on wide screens`

---

### Task 2: Intro card and shared card shadow

**Files:**
- Modify: `src/styles/global.css` (`@theme` block: two shadow tokens)
- Modify: `src/pages/index.astro` (intro `<section data-home>` and its `<Image>`)
- Modify: `src/components/ProjectCard.astro:17-18`
- Modify: `docs/design/typography.md` (a "Cards" line under Colour)
- Test: `tests/layout.test.mjs`

**Interfaces:**
- Produces: Tailwind utilities `shadow-card` and `shadow-card-hover` from `@theme` tokens `--shadow-card` and `--shadow-card-hover`.

- [ ] **Step 1: Write the failing tests**

```js
test("card shadow tokens exist", () => {
  const c = css();
  assert.match(c, /--shadow-card:/);
  assert.match(c, /--shadow-card-hover:/);
});
test("intro is a raised card with a forced-colors edge", () => {
  const h = html("/");
  assert.match(h, /data-home[^>]*class="[^"]*shadow-card[^"]*"|class="[^"]*shadow-card[^"]*"[^>]*data-home/);
  assert.match(h, /data-home[^>]*border-transparent|border-transparent[^>]*data-home/);
});
test("intro photo and project images offer large sources for scaled screens", () => {
  const h = html("/");
  assert.match(h, /srcset="[^"]*960w/, "intro photo has no 960w source");
  assert.match(h, /srcset="[^"]*1500w/, "project image has no 1500w source");
});
test("project cards share the card shadow", () => {
  for (const page of ["/", "/projects"]) assert.ok(html(page).includes("shadow-card"), page);
});
```

- [ ] **Step 2: Run** `pnpm test` — Expected: the four new tests FAIL.

- [ ] **Step 3: Implement**
  - `@theme` tokens (better-ui light recipe, plus one soft layer so depth reads on paper):
    - `--shadow-card: 0 0 0 1px oklch(0 0 0 / 0.06), 0 1px 2px -1px oklch(0 0 0 / 0.06), 0 2px 4px 0 oklch(0 0 0 / 0.04), 0 12px 32px -8px oklch(0 0 0 / 0.10);`
    - `--shadow-card-hover:` the same four layers at `0.08, 0.08, 0.06, 0.14`.
  - Intro section classes: keep the grid classes; add `bg-card border border-transparent shadow-card rounded-2xl p-5 md:p-8`; drop `mt-5` only if the card's top edge then sits too close to the page top on desktop (judge in the browser). Keep `pb-12`'s job by moving the space outside: `mb-12` instead of `pb-12`.
  - Intro `<Image>`: keep `rounded-xl`; add the better-ui image outline `outline outline-1 -outline-offset-1 outline-black/10`. Replace `width={480} densities={[1, 2]}` with `widths={[320, 640, 960]} sizes="(min-width: 768px) 30vw, 10rem"` so it stays sharp when the page is scaled to 200%.
  - `ProjectCard.astro` `<Image>`: replace `width={750} densities={[1, 2]}` with `widths={[480, 750, 1500]} sizes="(min-width: 1024px) 50vw, 100vw"` for the same reason.
  - `ProjectCard.astro`: `rounded-lg border border-border … hover:shadow-lg` → `rounded-2xl border border-transparent bg-card shadow-card hover:shadow-card-hover` (keep `overflow-hidden` and the `motion-safe:transition-shadow`).
  - `typography.md`: one line: raised cards use `shadow-card` on `bg-card` with a transparent border; corners 16px; images inside 12px.

- [ ] **Step 4: Run** `pnpm test` — Expected: all PASS.

- [ ] **Step 5: Check in the browser** at 1440×900 and 390×844: the card edge is visible against the paper page; photo corners 12px; on phones the padding is 20px and the photo still sits above the name; hovering the RxCounsel card deepens its shadow.

- [ ] **Step 6: Commit** `feat: raised intro card and shared card shadow`

---

### Task 3: Skills as pills

**Files:**
- Modify: `src/components/cv/CvSections.astro:61-69`
- Test: `tests/layout.test.mjs`

**Interfaces:**
- Consumes: nothing from earlier tasks.

- [ ] **Step 1: Write the failing test**

```js
test("skills render as one pill per skill, in two labelled groups", () => {
  const h = html("/");
  const skills = h.slice(h.indexOf('id="skills"'));
  for (const s of ["Propel", "Kroll", "Lexi-Drug", "Microsoft Office", "Claude and Copilot agents", "React/Tailwind", "DaVinci Resolve", "Audio mixing", "Photography"])
    assert.match(skills, new RegExp(`<li[^>]*rounded-full[^>]*>${s}</li>`), s);
  assert.ok(skills.includes("Pharmacy software") && skills.includes("Technical &amp; creative"));
});
```

- [ ] **Step 2: Run** `pnpm test` — Expected: FAIL.

- [ ] **Step 3: Implement** the Skills section as two groups, each a `type-subheading` label (`Pharmacy software`, `Technical & creative`) followed by `<ul class="mt-2 flex flex-wrap gap-2">`. Each skill is an `<li>` with HyperUI base badge classes mapped to tokens: `rounded-full bg-muted px-2.5 py-0.5 text-sm whitespace-nowrap text-foreground`. Skill text exactly as in the test (sentence case: "Audio mixing", "Photography"). Gap between the two groups: `space-y-5`.

- [ ] **Step 4: Run** `pnpm test` — Expected: all PASS.

- [ ] **Step 5: Check in the browser** at 1440 and 390: pills wrap cleanly with no pill split across lines.

- [ ] **Step 6: Commit** `feat: show skills as pills`

---

### Task 4: Final check and fresh screenshots

- [ ] **Step 1:** `pnpm test` — all PASS.
- [ ] **Step 2:** Re-run the screenshot script (`shoot.mjs` from the 2026-11-27 session, or the browser pane) at 1440, 2560, 3840 and 390 wide, and add them to a new page of the tldraw scratchpad next to the marked-up originals so the before and after can be compared.
- [ ] **Step 3:** Push the branch; PR #52 picks the commits up.
