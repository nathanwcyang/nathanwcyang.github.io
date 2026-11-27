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
