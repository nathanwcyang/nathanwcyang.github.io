// Checks the built site (dist/) for interface fixes (contrast, motion, focus). Run with: pnpm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";

/** Built HTML for a site path, e.g. "/" or "/cv". */
function html(path) {
  const clean = path.replace(/^\/|\/$/g, "");
  return readFileSync(new URL(`../dist/${clean ? clean + "/" : ""}index.html`, import.meta.url), "utf8");
}

/** Every built stylesheet, concatenated. */
function css() {
  const dir = new URL("../dist/_astro/", import.meta.url);
  return readdirSync(dir).filter((f) => f.endsWith(".css")).map((f) => readFileSync(new URL(f, dir), "utf8")).join("\n");
}

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
