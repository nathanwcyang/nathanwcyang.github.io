# Audit Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all 8 findings from the 2026-11-27 ponytail audit: CI type check, escaped CV achievement text, a small `og:image`, project pages typed as articles, two unused dependencies removed, an unused schema field removed, and the headshot ring on a theme utility.

**Architecture:** Mostly one-line edits. The only new code is `inlineMd` moved into `src/lib/inline-md.ts` so a unit test can import it (Node runs `.ts` directly via type stripping). Every other change is checked by the existing built-site tests in `tests/content.test.mjs`, plus new assertions there.

**Tech Stack:** Astro 7, Tailwind 4, Astryx 0.7.17, pnpm 10, `node:test`.

**Spec:** The ponytail audit report from this session (findings 1–8), summarised below. No separate spec file.

## Global Constraints

- Work on the current branch, `redesign`. One commit per task.
- `pnpm check` (0 errors), `pnpm test` (all pass) and `pnpm exec astryx doctor --built .` must pass after every task.
- No hard-coded hex, px or arbitrary Tailwind values on pages (CLAUDE.md). Use theme utilities.
- `src/components/ui/` is the only place that imports Astryx.
- Don't change how the site looks, except: the headshot ring stays the same colour on a new class.
- Commit messages end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

1. Achievement text with `&` (like "Q&A") must still read "Q&A" on the page, not "Q&amp;amp;A". Test in Task 2.
2. A link whose text has `<` or `&` (like `[Q&A](/x)`) must keep its link and its text. Test in Task 2.
3. A project with no `heroImage` must build with no `og:image` tag and still be `og:type` article. Covered by the conditional in Task 3. It isn't testable until a second project exists, so the reviewer checks it by reading the code.
4. Removing `sharp` from `dependencies` must not break image builds on CI's clean install (`--frozen-lockfile`). Task 4 verifies with a clean install.
5. Removing the MDX integration must not leave a `.mdx` glob that silently ignores files. Task 4 narrows the glob to `.md`.

---

### Task 1: Type check in CI

**Files:**
- Modify: `.github/workflows/test.yml` (the `run:` steps at the end)

**Interfaces:** none.

- [ ] **Step 1: Confirm both checks pass locally**

Run: `pnpm check && pnpm exec astryx doctor --built .`
Expected: `0 errors` from check, and doctor reports no failures. If doctor fails, stop and report. Don't add it to CI until it passes.

- [ ] **Step 2: Add the steps**

In `test.yml`, between `pnpm install --frozen-lockfile` and `pnpm test`, add `- run: pnpm check`. After `pnpm test` (which builds `dist/`), add `- run: pnpm exec astryx doctor --built .`.

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/test.yml
git commit -m "ci: run type check and astryx doctor on pull requests"
```

---

### Task 2: Escape CV achievement text

**Files:**
- Create: `src/lib/inline-md.ts`
- Modify: `src/components/cv/CvSections.astro:11-13` (delete local `inlineMd`, import it)
- Test: `tests/inline-md.test.mjs`

**Interfaces:**
- Produces: `export function inlineMd(s: string): string`. It escapes `&`, `<` and `>`, then turns `[text](url)` into `<a href="url" class="font-semibold text-accent underline">text</a>`. Keep the existing `// shortcut:` comment.

- [ ] **Step 1: Write the failing test**

```js
// tests/inline-md.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { inlineMd } from "../src/lib/inline-md.ts";

test("inlineMd escapes text and keeps links", () => {
  assert.equal(inlineMd("Cut waits to <5 min"), "Cut waits to &lt;5 min");
  assert.equal(inlineMd("Q&A"), "Q&amp;A");
  assert.equal(
    inlineMd("See [Q&A](/projects/x)"),
    'See <a href="/projects/x" class="font-semibold text-accent underline">Q&amp;A</a>',
  );
});
```

The existing `pnpm test` glob (`tests/*.test.mjs`) already picks up the new file. Importing `.ts` needs Node 22.18 or newer: local is 26, and CI's `lts/*` qualifies.

- [ ] **Step 2: Run it to see it fail**

Run: `node --test tests/inline-md.test.mjs`
Expected: FAIL, cannot find module `src/lib/inline-md.ts`.

- [ ] **Step 3: Create `src/lib/inline-md.ts`**

Escape first, then replace links. Use only erasable TypeScript (no enums), so Node can strip the types.

- [ ] **Step 4: Use it in `CvSections.astro`**

Delete the local `inlineMd` and import it from `../../lib/inline-md`.

- [ ] **Step 5: Run everything**

Run: `pnpm test`
Expected: all pass, including the existing "RxCounsel achievement link" assertion.

- [ ] **Step 6: Commit**

```bash
git add src/lib/inline-md.ts src/components/cv/CvSections.astro tests/inline-md.test.mjs
git commit -m "fix: escape CV achievement text before adding links"
```

---

### Task 3: Link previews: small JPG and article type

**Files:**
- Modify: `src/pages/projects/[slug].astro:4,16,19`
- Test: `tests/content.test.mjs` (the "project page" test)

**Interfaces:**
- Consumes: `BaseLayout` props `image?: string` and `ogType?: string` (they already exist).

- [ ] **Step 1: Write the failing assertions**

In the test `"project page: screenshot, caption and write-up"`, replace the `og:image` line with:

```js
const og = h.match(/property="og:image" content="[^"]*(\/_astro\/rxcounsel-input-screen[^"]*\.jpg)"/);
assert.ok(og, "og:image is a JPG of the screenshot");
assert.ok(statSync(new URL(`../dist${og[1]}`, import.meta.url)).size < 300_000, "og:image under 300 KB");
assert.match(h, /property="og:type" content="article"/);
```

Add `statSync` to the `node:fs` import.

- [ ] **Step 2: Run to see it fail**

Run: `pnpm test`
Expected: FAIL on "og:image is a JPG".

- [ ] **Step 3: Implement**

Import `getImage` from `astro:assets`. Compute `const ogImage = heroImage && (await getImage({ src: heroImage, width: 1200, format: "jpg" }))`. Pass `image={ogImage?.src}` and `ogType="article"` to `BaseLayout`.

- [ ] **Step 4: Run tests**

Run: `pnpm test`
Expected: all pass.

- [ ] **Step 5: Tick the item in issue #22**

Run `gh issue view 22`. In the body, change `- [ ] Use a 1200px JPG` to `- [x]` and add `_(Done in the audit fixes.)_`, using `gh issue edit 22 --body-file`. While you're there, tick the `heroAlt` item too: `[slug].astro` already handles it with `heroAlt!`, and `pnpm check` is clean.

- [ ] **Step 6: Commit**

```bash
git add src/pages/projects/[slug].astro tests/content.test.mjs
git commit -m "fix: 1200px JPG og:image and article og:type on project pages"
```

---

### Task 4: Drop unused MDX and sharp

**Files:**
- Modify: `astro.config.mjs` (remove `import mdx` and `mdx()`)
- Modify: `src/content.config.ts:26` (glob `"**/*.md"`)
- Modify: `package.json` (remove `@astrojs/mdx` and `sharp` from `dependencies`; keep `sharp` in `pnpm.onlyBuiltDependencies`)
- Modify: `pnpm-lock.yaml` (via pnpm)
- Modify: `CLAUDE.md` (the blog-restore bullet: add "and re-add `@astrojs/mdx`")

**Interfaces:** none.

- [ ] **Step 1: Remove the dependencies**

Run: `pnpm remove @astrojs/mdx sharp`
Then edit `astro.config.mjs` and the glob.

- [ ] **Step 2: Clean install, as CI does**

Run: `rm -rf node_modules && pnpm install --frozen-lockfile && pnpm test && pnpm check`
Expected: all pass. The project page test still finds the `.webp` screenshot, which shows Astro's own `sharp` is in use.

- [ ] **Step 3: Confirm one sharp left**

Run: `ls node_modules/.pnpm | grep '^sharp@'`
Expected: no `sharp@0.32.6`.

- [ ] **Step 4: Update CLAUDE.md**

In the "The blog was removed" bullet, add that restoring it means re-adding `@astrojs/mdx` and `mdx()` if the posts are `.mdx`.

- [ ] **Step 5: Commit**

```bash
git add astro.config.mjs src/content.config.ts package.json pnpm-lock.yaml CLAUDE.md
git commit -m "chore: drop unused MDX integration and pinned sharp"
```

---

### Task 5: Unused badge field and the headshot ring

**Files:**
- Modify: `src/content.config.ts:20` (delete `badge`)
- Modify: `src/components/home/Hero.astro:19` (`ring-[var(--color-accent)]` → `ring-accent`)
- Test: `tests/content.test.mjs` (the "hero" test)

**Interfaces:** none.

- [ ] **Step 1: Write the failing assertion**

In `"hero: photo, name, title, location, email and LinkedIn"`, add:

```js
assert.match(h, /<img[^>]*\bring-accent\b/, "headshot ring uses the theme utility");
```

- [ ] **Step 2: Run to see it fail**

Run: `pnpm test`
Expected: FAIL on "headshot ring uses the theme utility".

- [ ] **Step 3: Make both edits**

- [ ] **Step 4: Check the ring still renders orange**

Run: `pnpm test && grep -o '\.ring-accent{[^}]*}' dist/_astro/*.css`
Expected: tests pass, and the rule uses `var(--color-accent)`.

- [ ] **Step 5: Commit**

```bash
git add src/content.config.ts src/components/home/Hero.astro tests/content.test.mjs
git commit -m "chore: drop unused badge field, headshot ring on ring-accent"
```

---

**Not in this plan:** The footer year only updates on a rebuild, and Node versions differ between the test and deploy jobs. The audit left both out as minor.
