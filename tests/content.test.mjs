// Checks the built site (dist/) for exact copy. Run with: pnpm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

/** Built HTML for a site path, e.g. "/" or "/cv". */
function html(path) {
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
  });

test("rxcounsel", () => {
  assert.ok(html("/projects/rxcounsel").includes("7–12 complex counselling sessions"), "missing: sessions range on project page");
  assert.ok(html("/").includes("roughly 1–1.5 hours a day per pharmacist"), "missing: time saved on home card");
});

test("intro and location", () => {
  const h = html("/");
  for (const s of [
    "I'm a third-year PharmD student with a background in specialty, community and hospital pharmacy. Before pharmacy, I spent time in fintech. I'm always happy to talk about AI, vibe coding and design!",
    "When I'm not wearing my white coat, I nerd out on music production, photography and what makes an image look great on a cinema screen :)",
    "Mississauga, Ontario",
  ]) assert.ok(h.replace(/\s+/g, " ").includes(s), `missing: ${s}`);
  assert.ok(!h.includes("I like finding the slow parts"), "old intro still there");
  for (const page of ["/", "/cv", "/projects", "/projects/rxcounsel"])
    assert.ok(!html(page).includes("google.com/maps"), `Maps link still on ${page}`);
});

test("cv profile removed and Relay added", () => {
  const h = html("/cv");
  assert.ok(!h.includes(">Profile</h2>"), "Profile heading still there");
  assert.ok(!h.includes("Third-year Doctor of Pharmacy student"), "Profile text still there");
  for (const s of [
    ">Customer Experience Specialist</h3>",
    "Relay | Full-time | Toronto, ON | February–December 2023",
    "Resolved 10,000+ support cases across email, phone and live chat",
    "Used Zendesk, Jira, Guru and Slack daily to manage support workflows and refine team processes",
    "Earned 20+ five-star reviews on Relay's public Trustpilot page for thorough troubleshooting and attentive service.",
  ]) assert.ok(h.replace(/\s+/g, " ").includes(s), `missing: ${s}`);
  const at = (s) => h.indexOf(s);
  assert.ok(at("Trillium Health Partners") < at("Relay | Full-time") && at("Relay | Full-time") < at("CareRx Pharmacy |"), "Relay not between Trillium and CareRx");
  assert.equal((h.match(/<h3/g) || []).length, 7, "expected 2 education + 5 job titles");
});
