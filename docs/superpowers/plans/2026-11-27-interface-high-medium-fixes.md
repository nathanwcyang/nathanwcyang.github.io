# Interface HIGH and MEDIUM Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the 3 HIGH and 4 MEDIUM findings from the 2026-11-27 `better-interface` review.

**Architecture:** Small, separate edits to existing files. CSS fixes go in `src/styles/global.css`, menu behaviour in `src/layouts/BaseLayout.astro`, the nav landmark in `src/components/SideBarMenu.astro`, the orb loop in `src/components/ui/fluid-orb.tsx`. No new files except tests. No new dependencies.

**Tech Stack:** Astro 7, Tailwind 4, React 18 islands, `node --test` against the built `dist/`.

**Spec:** The review's findings table (this conversation's `better-interface` report). The rows covered here, verbatim:

| # | Sev | Finding | Fix |
| --- | --- | --- | --- |
| H1 | HIGH | Inactive sidebar links: `--muted-foreground` #6F6E69 on #F2F0E5 measures 4.47:1, below 4.5:1 (WCAG 1.4.3) | `--muted-foreground: 87 86 83; /* base-700 #575653 */` |
| H2 | HIGH | Phone drawer slide `transition: transform 300ms` ignores `prefers-reduced-motion` | Wrap only that `transition` in `@media (prefers-reduced-motion: no-preference)` |
| H3 | HIGH | At 320px a focused link sits fully under the 64px sticky header (WCAG 2.4.11) | Below 1024px: `html { scroll-padding-top: 5rem; }`; delete `scroll-mt-20` from `Section.astro` (keep `lg:scroll-mt-6`) |
| M1 | MEDIUM | Phone menu open: `.menu-page` stays focusable behind the overlay | In `sync()`, toggle `inert` on `.menu-page` when the menu is open below 1024px |
| M2 | MEDIUM | 404 shows a dead "Open menu" button (`includeSidebar={false}`) | Delete `includeSidebar={false}` from `src/pages/404.astro` |
| M3 | MEDIUM | No `<nav>` landmark around the sidebar links | `SideBarMenu.astro:7` `<div … class="contents">` → `<nav aria-label="Main" … class="contents">` |
| M4 | MEDIUM | Fluid orb animates forever, no pause (WCAG 2.2.2) | Stop the rAF loop 5 s after it starts |

## Global Constraints

- Repo rules in `CLAUDE.md`: shadcn colour names and `type-*` classes; no hard-coded hex in components; never paste Hub theme code.
- Work on branch `fix/interface-high-medium`, never on `main`.
- `pnpm test` (builds, then runs `tests/*.test.mjs`) must pass after every task.
- Commit messages end with: `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`
- Do not touch LOW findings.

## Review Focus

1. Desktop (≥1024px) after H3: `/#projects` and `/#experience` jumps must still land with the title in view (desktop keeps `lg:scroll-mt-6`, no extra padding).
2. M1: pressing Escape or tapping the overlay must still close the menu and restore focus to the toggle; the toggle `#my-drawer` sits outside `.menu-page`, so it must stay focusable.
3. M1 on resize: opening the menu at 375px and widening past 1024px must leave `.menu-page` **not** inert.
4. M2: the 404 page with a sidebar must not produce duplicate ids, and the sidebar's active dot gets no matching link (`sideBarActiveItemID` undefined) without throwing.
5. M4: under reduced motion the orb still draws one static frame; hovering after 5 s does not need to restart (accepted limit).

Items 1–3 and 5 are checked in the browser by the controller after the last task (they need a viewport). Item 4 is pinned by the test in Task 2.

---

### Task 1: CSS fixes (H1, H2, H3)

**Files:**
- Modify: `src/styles/global.css:104` (token), `:224-228` (drawer transition), `:209` block (scroll padding)
- Modify: `src/components/home/Section.astro:7`
- Test: `tests/interface.test.mjs` (create)

**Interfaces:**
- Produces: `tests/interface.test.mjs` with helpers `css(): string` (all `dist/_astro/*.css` concatenated) and `html(path): string` (same as in `content.test.mjs`). Task 2 adds tests to this file.

- [ ] **Step 1: Write the failing tests** in `tests/interface.test.mjs`:

```js
test("sidebar grey passes 4.5:1", () => {
  assert.match(css(), /--muted-foreground:87 86 83/);
});
test("drawer slide only with motion allowed", () => {
  const c = css();
  const at = c.search(/\.menu-panel>aside\{[^}]*transition:transform/);
  assert.ok(at > -1, "drawer transition missing");
  assert.ok(c.slice(c.lastIndexOf("@media", at), at).includes("prefers-reduced-motion:no-preference"), "drawer transition not gated");
});
test("focus clears the sticky phone header", () => {
  assert.match(css(), /scroll-padding-top:5rem/);
  assert.ok(!html("/").includes("scroll-mt-20"), "scroll-mt-20 still on sections");
  assert.ok(html("/").includes("lg:scroll-mt-6"), "desktop scroll margin removed");
});
```

- [ ] **Step 2: Run** `pnpm test` — Expected: the three new tests FAIL, the rest pass.
- [ ] **Step 3: Implement.** Change the token value with comment `/* base-700 #575653 */`. In the `@media not all and (min-width: 1024px)` block, move the `transition:` line of `.menu-panel > aside` into a nested `@media (prefers-reduced-motion: no-preference)` (keep `transform` and `will-change` where they are), and add `html { scroll-padding-top: 5rem; }`. In `Section.astro` delete `scroll-mt-20 ` and update its line-3 comment to say the phone offset now comes from `scroll-padding-top` in `global.css`.
- [ ] **Step 4: Run** `pnpm test` — Expected: all PASS.
- [ ] **Step 5: Commit** `fix: sidebar contrast, reduced-motion drawer, focus under sticky header`

### Task 2: Phone menu and nav landmark (M1, M2, M3)

**Files:**
- Modify: `src/layouts/BaseLayout.astro:53-57` (`sync()`)
- Modify: `src/pages/404.astro:6`
- Modify: `src/components/SideBarMenu.astro:7-9`
- Test: `tests/interface.test.mjs`

**Interfaces:**
- Consumes: `html(path)` from Task 1.

- [ ] **Step 1: Write the failing tests:**

```js
test("sidebar links sit in a nav landmark", () => {
  for (const page of ["/", "/contact", "/projects"])
    assert.match(html(page), /<nav aria-label="Main"[^>]*>[\s\S]*data-slot="bounce-sidebar"/, `${page}: no nav landmark`);
});
test("404 menu button opens a real menu", () => {
  const h = readFileSync(new URL("../dist/404.html", import.meta.url), "utf8");
  assert.ok(h.includes('id="site-menu"'), "404 has a menu toggle but no menu");
  const ids = [...h.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(ids.filter((id, i) => ids.indexOf(id) !== i), [], "duplicate ids on 404");
});
```

Confirm the 404 build path first with `ls dist/404*`; use whichever exists (`dist/404.html` or `dist/404/index.html`).

- [ ] **Step 2: Run** `pnpm test` — Expected: the two new tests FAIL.
- [ ] **Step 3: Implement.**
  - `SideBarMenu.astro`: replace the wrapping `<div data-nav-active=… class="contents">`/`</div>` with `<nav aria-label="Main" data-nav-active=… class="contents">`/`</nav>`; update the line-6 comment if needed.
  - `404.astro`: delete ` includeSidebar={false}` (also tidy `title = "404…"` to `title="404: Not Found"`).
  - `BaseLayout.astro` `setupMenu()`: get `const page = document.querySelector(".menu-page");` next to `menu`, and in `sync()` add `page?.toggleAttribute("inert", !wide.matches && toggle.checked);`. Update the line-41 comment to mention the page behind the open menu.
- [ ] **Step 4: Run** `pnpm test` — Expected: all PASS.
- [ ] **Step 5: Commit** `fix: nav landmark, inert page behind phone menu, working 404 menu`

### Task 3: Orb stops after 5 seconds (M4)

**Files:**
- Modify: `src/components/ui/fluid-orb.tsx:175-190`, header comment lines 4-5

No automated test: the loop runs in WebGL in the browser. The controller checks it in the browser after this task.

- [ ] **Step 1: Implement.** Add `const start = performance.now()` beside `last`, and change the loop condition to `if (!reduce && now - start < 5000) raf = requestAnimationFrame(render)`. Name the constant: `const RUN_MS = 5000 // WCAG 2.2.2: moving content stops within 5 s`. Add a local-change line to the header comment: `// Local change: the animation stops after 5 seconds (WCAG 2.2.2).`
- [ ] **Step 2: Run** `pnpm test` — Expected: all PASS (build compiles).
- [ ] **Step 3: Commit** `fix: stop the avatar orb animation after 5 seconds`

### Final check (controller, in the browser)

At 320px: a focused link near the top is no longer under the header; menu open → `.menu-page.inert === true`; Escape closes and focuses the toggle; widen to 1024px with menu open → `.menu-page.inert === false`. At 1024px: inactive nav link contrast ≥ 4.5:1; `/#experience` lands with its title visible. On `/nope` at 320px the menu opens. The orb stops moving after about 5 s.
