// Checks the built site (dist/) for wide-screen scaling, cards and skill pills. Run with: pnpm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";

/** Built HTML for a site path, e.g. "/" or "/projects". */
function html(path) {
  const clean = path.replace(/^\/|\/$/g, "");
  return readFileSync(new URL(`../dist/${clean ? clean + "/" : ""}index.html`, import.meta.url), "utf8");
}

/** Every built stylesheet, concatenated. */
function css() {
  const dir = new URL("../dist/_astro/", import.meta.url);
  return readdirSync(dir).filter((f) => f.endsWith(".css")).map((f) => readFileSync(new URL(f, dir), "utf8")).join("\n");
}

test("root font scales past 1600px, never below the visitor's base", () => {
  assert.match(css(), /html\{[^}]*font-size:clamp\(100%,1vw,125%\)/);
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
  // The photo file is 912px wide; Astro serves it full size rather than enlarging it to 960w.
  assert.match(h, /srcset="[^"]*nathan-yang[^"]*912w/, "intro photo has no full-size source");
  assert.match(h, /srcset="[^"]*1500w/, "project image has no 1500w source");
});
test("project cards share the card shadow", () => {
  for (const page of ["/", "/projects"]) assert.ok(html(page).includes("shadow-card"), page);
});

test("skills render as one pill per skill, in two labelled groups", () => {
  const h = html("/");
  const skills = h.slice(h.indexOf('id="skills"'));
  for (const s of ["Propel", "Kroll", "Lexi-Drug", "Microsoft Office", "Claude and Copilot agents", "React/Tailwind", "DaVinci Resolve", "Audio mixing", "Photography"])
    assert.match(skills, new RegExp(`<li[^>]*rounded-full[^>]*>${s}</li>`), s);
  assert.ok(skills.includes("Pharmacy software") && skills.includes("Technical &amp; creative"));
});
test("sidebar icons are sized in rem so they scale with the page", () => {
  const h = html("/");
  const footer = h.slice(h.indexOf("social-icons"));
  assert.ok(!/<svg[^>]*width="24"/.test(footer.slice(0, 2000)), "sidebar icons still fixed at 24px");
  assert.equal((footer.slice(0, 2000).match(/<svg[^>]*class="size-6"/g) || []).length, 2);
});
test("avatar orb fills its rem-sized frame instead of a fixed 136px", () => {
  const orb = html("/").match(/data-slot="fluid-orb"[^>]*/)?.[0] ?? "";
  assert.ok(orb, "orb not rendered");
  assert.ok(!orb.includes("width:136px"), "orb still fixed at 136px");
  assert.match(orb, /width:100%;height:100%/);
});
