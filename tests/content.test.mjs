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

test("cv", () => {
  const h = html("/cv");
  for (const s of [
    "Pharmacy Student; Workflow Development",
    "Express Scripts Canada Pharmacy | Co-op | Mississauga, ON | May–August 2026",
    "Rexall Pharmacy #1321 | Co-op | Mississauga, ON | September–December 2025",
    "Trillium Health Partners, Credit Valley Hospital | Co-op | Mississauga, ON | January–April 2025",
    "CareRx Pharmacy | Full-time | Oakville, ON | May–September 2022",
    "Key achievements",
    "1–1.5 hours a day per pharmacist",
    "lead medication management pharmacist",
    "Collected over $150,000 in the first month.",
  ]) assert.ok(h.includes(s), `missing: ${s}`);
  for (const s of ["Co-op Pharmacy Student", "Partnered with a pharmacist lead", "Rebuilt as a Copilot agent"])
    assert.ok(!h.includes(s), `still has: ${s}`);
  assert.equal((h.match(/<h3/g) || []).length, 6, "expected 2 education + 4 job titles as h3");
});
