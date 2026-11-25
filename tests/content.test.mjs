// Checks the built site (dist/) for exact copy. Run with: pnpm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

/** Built HTML for a site path, e.g. "/" or "/cv". */
export function html(path) {
  const clean = path.replace(/^\/|\/$/g, "");
  return readFileSync(new URL(`../dist/${clean ? clean + "/" : ""}index.html`, import.meta.url), "utf8");
}

test("smoke", () => {
  assert.ok(html("/").includes("<h1"));
});

test("hero", () => {
  const h = html("/");
  for (const s of [
    ">Nathan Yang</h1>",
    "Mississauga, Ontario",
    "google.com/maps/search/?api=1&query=Mississauga%2C+Ontario",
    ">Email me<",
    ">LinkedIn<",
    "linkedin.com/in/nathanwcyang",
  ]) assert.ok(h.includes(s), `missing: ${s}`);
  for (const s of ["Hey there", "👋", "Let&#39;s connect", "Let's connect"]) assert.ok(!h.includes(s), `still has: ${s}`);
});
