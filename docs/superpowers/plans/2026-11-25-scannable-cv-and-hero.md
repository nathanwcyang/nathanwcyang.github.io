# Scannable CV and Hero Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the home hero and CV page short and scannable by eye: new hero (name, info row, two buttons) and each CV job cut to role, what was done, and key achievements.

**Architecture:** Text-only change in the current Astrofy layout. A small `node:test` suite checks the built HTML for the exact copy. The timeline component gets structured props (role, employer, details) so the later Claude Code redesign can restyle it without touching the words.

**Tech Stack:** Astro 4, Tailwind + daisyUI (Flexoki theme), pnpm 10, Node 22 `node:test`.

**Spec:** Decisions from the chat with Nathan on 2026-11-25. The tldraw annotations (hero box, "Let's connect!" circled, CV "way too wordy, lay it out like Mary Johnson") and his answers are copied as exact values below.

## Global Constraints

- Copy below is final. Use it exactly, including punctuation and en dashes.
- Use the `type-*` classes and theme colour names only (see `docs/design/typography.md`). No new fonts, no hex values.
- No phone number or street address anywhere. Location is city level only.
- The printed CV (.docx) is out of scope. Website only.
- The home page intro paragraph stays as is. Nathan will rewrite it next (pinned).
- Divider between items on one line is ` | ` (space, pipe, space).
- Design polish (icons, button styling, Mary Johnson layout) is out of scope. It happens later in Claude Code.

## Review Focus

- **Phone width (390px):** the info row and the two buttons wrap cleanly and stay tappable (≥44px tall). Expect no sideways scroll.
- **Links:** "Email me" opens `mailto:nwyang@uwaterloo.ca`. "LinkedIn" and the Maps link open in a new tab with `rel="noopener"`.
- **Screen readers:** the pin and envelope icons are decorative (`aria-hidden`). Link text alone says where each goes.
- **Headings:** the page still has one `h1` ("Nathan Yang"), and CV job titles stay `h3` under the "Experience" `h2`.
- **Old copy gone:** no "Hey there", no 👋, no "Let's connect!", and no "Co-op Pharmacy Student" left in the built site.

---

### Task 1: Content test harness

**Files:**
- Create: `tests/content.test.mjs`
- Modify: `package.json` (add `"test": "astro build && node --test tests/*.test.mjs"`)

**Interfaces:**
- Produces: `html(path: string): string`, which reads `dist/<path>/index.html` (or `dist/index.html` for `/`). Later tasks add assertions to this file.

- [ ] **Step 1:** Write `tests/content.test.mjs` with the `html()` helper and one smoke test: `html("/")` contains `<h1`.
- [ ] **Step 2:** Run `pnpm test`. Expected: build succeeds, 1 test passes.
- [ ] **Step 3:** Commit: `test: add built-HTML content checks`.

### Task 2: Hero

**Files:**
- Modify: `src/pages/index.astro` (hero block, lines 11–24)
- Test: `tests/content.test.mjs`

**Exact copy and markup:**
- Remove the "Hey there 👋" line.
- `h1.type-display`: `Nathan Yang`
- `p.type-lede` (unchanged): `Doctor of Pharmacy Student, University of Waterloo · Class of 2027`
- Intro paragraph: unchanged.
- Info row, `p.type-meta` (flex-wrap, gap). Each icon is an inline SVG with `aria-hidden="true"`:
  - 📍 pin icon + link `Mississauga, Ontario` → `https://www.google.com/maps/search/?api=1&query=Mississauga%2C+Ontario`, `target="_blank" rel="noopener"`
  - ` | ` divider (`aria-hidden="true"`)
  - ✉ envelope icon + link `nwyang@uwaterloo.ca` → `mailto:nwyang@uwaterloo.ca`
- Buttons row, replacing "Let's connect!":
  - `a.btn.btn-primary`: `Email me` → `mailto:nwyang@uwaterloo.ca`
  - `a.btn.btn-outline`: `LinkedIn` → `https://www.linkedin.com/in/nathanwcyang/`, `target="_blank" rel="noopener"`

- [ ] **Step 1: Write failing tests** in `tests/content.test.mjs`, test name `hero`:
  - `html("/")` includes `>Nathan Yang</h1>`, `Mississauga, Ontario`, `google.com/maps/search/?api=1&query=Mississauga%2C+Ontario`, `>Email me<`, `>LinkedIn<`, `linkedin.com/in/nathanwcyang`
  - does not include `Hey there`, `👋` or `Let&#39;s connect` / `Let's connect`
- [ ] **Step 2:** Run `pnpm test`. Expected: `hero` fails.
- [ ] **Step 3:** Edit the hero in `src/pages/index.astro` as specified.
- [ ] **Step 4:** Run `pnpm test`. Expected: all pass.
- [ ] **Step 5:** Commit: `feat: new hero with location, email and two buttons`.

### Task 3: Scannable CV entries

**Files:**
- Modify: `src/components/cv/TimeLine.astro` (props), `src/pages/cv.astro` (Experience section)
- Test: `tests/content.test.mjs`

**Interfaces:**
- `TimeLineElement` props become `{ title: string; subtitle: string }` (unchanged names, so Education entries keep working). Experience entries pass `title` = role, `subtitle` = `Employer | Type | City | Dates`.
- New optional named slot `achievements`. When present, render a `p.type-meta` label `Key achievements` (uppercase, letter-spaced) followed by the slot. Default slot = "what was done" bullets.

**Exact copy (one entry each, in this order):**

1. Title `Pharmacy Student; Workflow Development` · subtitle `Express Scripts Canada Pharmacy | Co-op | Mississauga, ON | May–August 2026`
   - Counselled patients by phone on specialty medications, including GLP-1/GIP agonists, CGRP antibodies, antiepileptics and injectable biologics
   - Verified cold-chain prescriptions against manufacturer handling requirements
   - *Key achievements:* Built <a href="/projects/rxcounsel">RxCounsel</a>, a self-initiated AI counselling-prep tool. Piloted with 3 pharmacists, it saved about 8 minutes per complex counselling session: roughly 1–1.5 hours a day per pharmacist.
2. Title `Pharmacy Student` · subtitle `Rexall Pharmacy #1321 | Co-op | Mississauga, ON | September–December 2025`
   - Counselled patients on new and refill prescriptions and over-the-counter options
   - Adjudicated insurance claims and set up InnoviCares copay assistance
   - *Key achievements:* Led a two-month vaccine clinic, giving 500+ COVID-19 and flu vaccinations.
3. Title `Pharmacy Student` · subtitle `Trillium Health Partners, Credit Valley Hospital | Co-op | Mississauga, ON | January–April 2025`
   - Stocked Pyxis cabinets with unit-dose and ward-stock medications, and tracked expiries and recalls
   - Compounded and prepackaged narcotics, oral suspensions and PRN doses to NAPRA standards
   - *Key achievements:* Led a data-analysis project for the lead medication management pharmacist, comparing the hospital's hazardous-medication list with the SaPHE list used by 5 Toronto hospitals, and presented the gap analysis.
4. Title `Collections Specialist` · subtitle `CareRx Pharmacy | Full-time | Oakville, ON | May–September 2022`
   - Managed 120+ day overdue accounts after the Medical Pharmacies acquisition, working with long-term care and retirement homes across the GTA
   - *Key achievements:* Collected over $150,000 in the first month.

- [ ] **Step 1: Write failing tests**, test name `cv`, on `html("/cv")`:
  - includes each title and subtitle string above (HTML-escaped `&amp;` where needed), `Key achievements`, `1–1.5 hours a day per pharmacist`, `lead medication management pharmacist`, `Oakville, ON`
  - does not include `Co-op Pharmacy Student`, `Partnered with a pharmacist lead`, `Rebuilt as a Copilot agent` (moved to the project page)
  - count of `<h3` equals 6 (2 education + 4 jobs)
- [ ] **Step 2:** Run `pnpm test`. Expected: `cv` fails.
- [ ] **Step 3:** Add the `achievements` slot to `TimeLine.astro`, then replace the Experience entries in `cv.astro` with the copy above.
- [ ] **Step 4:** Run `pnpm test`. Expected: all pass.
- [ ] **Step 5:** Commit: `feat: shorter, scannable CV entries`.

### Task 4: RxCounsel page numbers

**Files:**
- Modify: `src/content/projects/rxcounsel.md` (front-matter `description`, "Result" section)
- Test: `tests/content.test.mjs`

**Exact copy:**
- `description`: `An AI counselling-prep tool I built on my own initiative during my Express Scripts co-op. Piloted with 3 pharmacists, it saved roughly 1–1.5 hours a day per pharmacist.`
- "Result" section: `Three pharmacists tested RxCounsel in a pilot. Each handles about 7–12 complex counselling sessions a day, and the tool saved about 8 minutes on each: roughly 1–1.5 hours a day per pharmacist.`

- [ ] **Step 1: Write failing test** `rxcounsel`: `html("/projects/rxcounsel")` includes `7–12 complex counselling sessions`. `html("/")` includes `roughly 1–1.5 hours a day per pharmacist`.
- [ ] **Step 2:** Run `pnpm test`. Expected: fails.
- [ ] **Step 3:** Edit `rxcounsel.md`.
- [ ] **Step 4:** Run `pnpm test`. Expected: all pass.
- [ ] **Step 5:** Commit: `content: RxCounsel time saved per day`.

### Task 5: Verify and ship

- [ ] **Step 1:** Run the axe-core scan on `/`, `/cv` and `/projects/rxcounsel` at 1400px and 390px. Expected: no new violations beyond the known drawer "region" note.
- [ ] **Step 2:** Take screenshots (desktop and phone) of Home and CV. Check that the info row and buttons wrap cleanly at 390px with no sideways scroll.
- [ ] **Step 3:** Push the branch and open a PR listing the copy changes, with screenshots.
- [ ] **Step 4:** Remind Nathan of the pinned task: rewrite the home intro.
