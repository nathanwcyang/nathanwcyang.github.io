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
  const h = html("/").replace(/\s+/g, " ");
  for (const s of [
    "Pharmacy Student; Workflow Development",
    "Express Scripts Canada Pharmacy", "Rexall Pharmacy #1321", "Trillium Health Partners, Credit Valley Hospital", "CareRx Pharmacy",
    "Mississauga, ON", "Oakville, ON", "Co-op", "Full-time",
    "May–August 2026", "September–December 2025", "January–April 2025", "May–September 2022",
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
  const h = html("/").replace(/\s+/g, " ");
  assert.ok(!h.includes(">Profile</h2>"), "Profile heading still there");
  assert.ok(!h.includes("Third-year Doctor of Pharmacy student"), "Profile text still there");
  for (const s of [
    ">Customer Experience Specialist</h3>",
    "Relay", "Toronto, ON", "February–December 2023",
    "Resolved 10,000+ support cases across email, phone and live chat",
    "Used Zendesk, Jira, Guru and Slack daily to manage support workflows and refine team processes",
    "Earned 20+ five-star reviews on Relay's public Trustpilot page for thorough troubleshooting and attentive service.",
  ]) assert.ok(h.includes(s), `missing: ${s}`);
  const at = (s) => h.indexOf(s);
  assert.ok(at("Trillium Health Partners") < at("Customer Experience Specialist") && at("Customer Experience Specialist") < at("Collections Specialist"), "Relay not between Trillium and CareRx");
  assert.equal((h.match(/<h3/g) || []).length, 8, "expected 1 project card + 2 education + 5 job titles");
});

test("home sections in order", () => {
  const h = html("/");
  const ids = ["projects", "experience", "education", "certifications", "skills"].map((id) => h.indexOf(`id="${id}"`));
  ids.forEach((i, n) => assert.ok(i > -1, `missing section #${n}`));
  for (let n = 1; n < ids.length; n++) assert.ok(ids[n] > ids[n - 1], "sections out of order");
  for (const s of [">Featured Projects<", ">Experience<", ">Education<", ">Certifications<", ">Skills<", 'href="/projects"', "All projects"])
    assert.ok(h.includes(s), `missing: ${s}`);
});

test("sidebar links", () => {
  for (const page of ["/", "/projects/rxcounsel"]) {
    const h = html(page);
    const menu = h.slice(h.indexOf('<ul class="menu'), h.indexOf("</ul>", h.indexOf('<ul class="menu')));
    for (const s of ['href="/#top"', 'href="/#projects"', 'href="/#experience"', 'href="/contact"'])
      assert.ok(menu.includes(s), `${page}: menu missing ${s}`);
    assert.ok(!menu.includes('href="mailto:'), `${page}: menu still has a mailto link`);
  }
});

test("cv forwards", () => {
  const h = html("/cv");
  assert.ok(h.includes("/#experience"), "/cv does not point to /#experience");
  assert.ok(h.includes('http-equiv="refresh"'), "/cv is not a redirect page");
});

test("contact page", () => {
  const h = html("/contact");
  for (const s of [">Contact</h1>", "Best way to reach me is email.", "mailto:nwyang@uwaterloo.ca", "linkedin.com/in/nathanwcyang", "Mississauga, Ontario"])
    assert.ok(h.includes(s), `missing: ${s}`);
  assert.ok(!h.includes("google.com/maps"), "Maps link on contact page");
});

test("no duplicate ids", () => {
  for (const page of ["/", "/projects", "/projects/rxcounsel", "/contact"]) {
    let h;
    try { h = html(page); } catch { continue; }
    const ids = [...h.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
    const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
    assert.deepEqual(dupes, [], `${page}: duplicate ids ${dupes.join(", ")}`);
  }
});

test("rxcounsel humanized copy", () => {
  const h = html("/projects/rxcounsel").replace(/\s+/g, " ");
  for (const s of [
    "Before each call, I spent time pulling together the counselling points, dosing details and kidney or liver considerations from several sources.",
    "The main counselling messages for the patient",
    "tied to a referenced source, so I rebuilt RxCounsel",
  ]) assert.ok(h.includes(s), `missing: ${s}`);
  for (const s of ["That prep took time on every call", "Key counselling messages"])
    assert.ok(!h.includes(s), `still has: ${s}`);
});

test("home link goes to the very top", () => {
  const h = html("/");
  assert.ok(!/\sid="top"/.test(h), 'an element still has id="top", so /#top stops at it instead of the page top');
  assert.ok(h.includes('href="/#top"'), "Home link changed");
});
