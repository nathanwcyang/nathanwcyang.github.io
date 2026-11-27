# Code-review tidy-up Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the four small findings from the 2026-11-27 code review (v1...HEAD) without changing how the site looks, except the one footer change Nathan approves.

**Architecture:** Four independent edits on one branch, one PR. No new dependencies, no new abstractions: two tiny Astro components replace one string-switched component, and existing `type-*` classes replace hand-set sizes.

**Tech Stack:** Astro 7, Tailwind 4, shadcn `buttonVariants`, React (bounce-sidebar).

**Spec:** the code review findings in this conversation (Standards #1–#3 and the Mysterious Name smell; Spec (a) "unused default dot colour").

## Global Constraints

- CLAUDE.md: use `type-*` classes and theme colour names; never hard-code fonts, sizes or hex colours on a page.
- Rendered text on every page stays identical (no words merged or added).
- `pnpm test` (16 tests) passes; no new build warnings.
- Out of scope: the divider class string, `button.tsx`/`badge.tsx` unused React exports, the `r g b` colour format, sitemap pin, ticket wording.

## Review Focus

1. Header "Nathan" link: same 48px height, 21.33px bold text, vertically centred after swapping to `type-heading` (its `leading-snug` replaces the button's `leading-none`).
2. Footer © line: centred, same size; colour change only if Nathan picks `type-meta`.
3. Home and Contact: Email/LinkedIn buttons and the pin + "Mississauga, Ontario" line render the same markup in the same order after the split.
4. Sidebar dot still shows Flexoki orange (`rgb(188, 82, 21)`) once `dotColor` has no default.
5. Nothing else imports `ContactLinks` after it is deleted (build fails if something does).

---

### Task 1: Header and footer use `type-*` classes

**Files:**
- Modify: `src/components/Header.astro:17` — `"text-xl font-bold"` → `"type-heading"`
- Modify: `src/components/Footer.astro:5` — `text-sm leading-5` → `type-meta` (Nathan chose this 2026-11-27: the © line turns 70% grey)

- [ ] **Step 1:** Make the two class edits.
- [ ] **Step 2:** Run `pnpm test`. Expected: 16 pass, no warnings.
- [ ] **Step 3:** In the browser at 375px: "Nathan" link is 48px tall, 21.33px, weight 700. Footer text is 15.33px and centred.

### Task 2: Split `ContactLinks` into `ContactButtons` and `Location`

**Files:**
- Create: `src/components/ContactButtons.astro` — the `mt-6 flex flex-wrap gap-3` div with Email me (`buttonVariants()`) and LinkedIn (`buttonVariants({ variant: "outline" })`), moved verbatim. No props.
- Create: `src/components/Location.astro` — the pin `<svg>` + `<span>Mississauga, Ontario</span>` fragment, moved verbatim. No props; the page keeps its wrapper.
- Delete: `src/components/ContactLinks.astro`
- Modify: `src/pages/index.astro:7,30,38`, `src/pages/contact.astro:3,11,17` — import and use the two new components.

- [ ] **Step 1:** Create both files, update both pages, delete `ContactLinks.astro`.
- [ ] **Step 2:** `grep -rn ContactLinks src` → no output.
- [ ] **Step 3:** `pnpm test` → 16 pass (the hero and contact tests already pin the buttons, LinkedIn URL and location text).

### Task 3: `dotColor` has no hidden default

**Files:**
- Modify: `src/components/ui/bounce-sidebar.tsx:27,35` — `dotColor?: string` → `dotColor: string`; drop `= "#FC4C01"`. Add "required dot colour" to the "Local changes" header comment.

- [ ] **Step 1:** Make the edit. `NavMenu.tsx` already passes `dotColor="rgb(var(--nav-dot))"`.
- [ ] **Step 2:** `grep -rn "#FC4C01" src` → no output; `pnpm test` → 16 pass.
- [ ] **Step 3:** In the browser the dot's background is `rgb(188, 82, 21)`.

### Task 4: Document Badge and divider

**Files:**
- Modify: `docs/design/typography.md:17-27` — add two table rows after `type-label`:
  - `Badge` | Project tag next to a title | 400 | 14px, cream on black — see `src/components/ui/badge.tsx`
  - `Divider` | Line under project titles | — | 2px line, 10% black — see `src/pages/projects/[slug].astro`

- [ ] **Step 1:** Add the rows (match the table's existing column style).

### Finish

- [ ] Commit per task on branch `chore/code-review-tidy-up` (conventional messages, `Co-Authored-By` line), push, open one PR listing the four fixes, wait for the `test` check.
- [ ] Browser check of Review Focus 1–4; text comparison of all pages against `main` (identical).
