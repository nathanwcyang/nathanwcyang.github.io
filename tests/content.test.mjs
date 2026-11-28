// Checks the built site (dist/): what a visitor or crawler receives. Run with: pnpm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync, readdirSync } from "node:fs";

/** Built HTML for a site path, e.g. "/" or "/cv". */
function html(path) {
  const clean = path.replace(/^\/|\/$/g, "");
  const file = clean === "404" ? "404.html" : `${clean ? clean + "/" : ""}index.html`;
  return readFileSync(new URL(`../dist/${file}`, import.meta.url), "utf8");
}
/** Text of the page with whitespace collapsed and common entities decoded. */
const flat = (h) => h.replace(/\s+/g, " ").replace(/&#39;/g, "'").replace(/&amp;/g, "&").replace(/&quot;/g, '"');
/** The HTML of the home-page section with this id, up to the next </section>. */
function section(h, id) {
  const start = h.search(new RegExp(`<section[^>]*\\sid="${id}"`));
  assert.ok(start > -1, `no <section id="${id}">`);
  return h.slice(start, h.indexOf("</section>", start));
}
const PAGES = ["/", "/projects", "/projects/rxcounsel", "/404"];

test("blog is gone from the build", () => {
  assert.ok(!existsSync(new URL("../dist/blog/index.html", import.meta.url)), "dist/blog exists");
  assert.ok(!readFileSync(new URL("../dist/sitemap-0.xml", import.meta.url), "utf8").includes("/blog/"), "sitemap lists /blog/");
});

test("home sections in order: hero, projects, experience, education, skills", () => {
  const h = html("/");
  const at = ["hero", "projects", "experience", "education", "skills"].map((id) => h.search(new RegExp(`<section[^>]*\\sid="${id}"`)));
  at.forEach((i, n) => assert.ok(i > -1, `missing section #${n}`));
  for (let n = 1; n < at.length; n++) assert.ok(at[n] > at[n - 1], "sections out of order");
  assert.ok(!/\sid="(contact|certifications)"/.test(h), "contact or certifications is still its own section");
});

test("hero: photo, name, title, location, email and LinkedIn", () => {
  const h = flat(section(html("/"), "hero"));
  assert.match(h, /<h1[^>]*>Nathan Yang<\/h1>/);
  assert.match(h, /<img[^>]*alt="Nathan Yang[^"]+"/, "photo with alt text");
  for (const s of ["Doctor of Pharmacy Student", "Based in Mississauga, Ontario", "mailto:nwyang@uwaterloo.ca", "linkedin.com/in/nathanwcyang", ">Email<", ">LinkedIn<"])
    assert.ok(h.includes(s), `missing: ${s}`);
  for (const s of [
    "I'm a third-year PharmD student with a background in specialty, community and hospital pharmacy.",
    "When I'm not wearing my white coat, I nerd out on music production, photography",
  ]) assert.ok(h.includes(s), `missing intro: ${s}`);
});

test("no GitHub, phone number, street address or Maps link anywhere", () => {
  for (const page of PAGES) {
    const h = html(page);
    assert.ok(!/github\.com/.test(h), `${page}: GitHub link`);
    assert.ok(!/href="tel:/.test(h), `${page}: phone link`);
    assert.ok(!/\(?\d{3}\)?[ .-]\d{3}[ .-]\d{4}/.test(flat(h).replace(/<[^>]+>/g, " ")), `${page}: something like a phone number`);
    assert.ok(!h.includes("google.com/maps"), `${page}: Maps link`);
  }
});

test("featured projects: at most 3 cards, RxCounsel first, link to all projects", () => {
  const s = flat(section(html("/"), "projects"));
  const cards = [...s.matchAll(/href="\/projects\/([a-z0-9-]+)"/g)].map((m) => m[1]);
  assert.ok(cards.length >= 1 && new Set(cards).size <= 3, `expected 1-3 project cards, got ${cards}`);
  assert.equal(cards[0], "rxcounsel");
  assert.ok(s.includes(">RxCounsel<") && s.includes("saved roughly 1–1.5 hours a day per pharmacist"), "card title or description");
  assert.ok(s.includes(">Pharmacy<"), "category tag");
  assert.ok(!/<img/.test(s), "cards should not show screenshots");
  assert.match(s, /href="\/projects"[^>]*>[^<]*View all projects/, "View all projects link");
});

test("experience timeline: every job from cv.md, with achievements", () => {
  const h = flat(section(html("/"), "experience"));
  for (const s of [
    "Pharmacy Student; Workflow Development",
    "Express Scripts Canada Pharmacy", "Rexall Pharmacy #1321", "Trillium Health Partners, Credit Valley Hospital", "Relay", "CareRx Pharmacy",
    "Mississauga, ON", "Toronto, ON", "Oakville, ON", "Co-op", "Full-time",
    "May–August 2026", "September–December 2025", "January–April 2025", "February–December 2023", "May–September 2022",
    "Key achievements",
    "roughly 1–1.5 hours a day per pharmacist",
    "lead medication management pharmacist",
    "Resolved 10,000+ support cases across email, phone and live chat",
    "Earned 20+ five-star reviews on Relay's public Trustpilot page for thorough troubleshooting and attentive service.",
    "Collected over $150,000 in the first month.",
  ]) assert.ok(h.includes(s), `missing: ${s}`);
  assert.match(h, /<a[^>]*href="\/projects\/rxcounsel"[^>]*>RxCounsel<\/a>/, "RxCounsel achievement link");
  const at = (s) => h.indexOf(s);
  assert.ok(at("Express Scripts") < at("Rexall") && at("Rexall") < at("Trillium") && at("Trillium") < at("Relay") && at("Relay") < at("CareRx"), "jobs out of order");
});

test("education with certifications inside", () => {
  const h = flat(section(html("/"), "education"));
  for (const s of ["Doctor of Pharmacy Candidate (PharmD)", "University of Waterloo", "2024–2027", "Bachelor of Health Sciences", "Western University", "2018–2022",
    ">Certifications<", "Injection certified (2025)", "Standard First Aid, CPR and AED Level C (2024 to 2027)"])
    assert.ok(h.includes(s), `missing: ${s}`);
});

test("skills: one pill per skill, in two labelled groups", () => {
  const h = flat(section(html("/"), "skills"));
  for (const g of ["Pharmacy software", "Technical & creative"]) assert.ok(h.includes(`>${g}<`), `group: ${g}`);
  for (const s of ["Propel", "Kroll", "Lexi-Drug", "Microsoft Office", "Claude and Copilot agents", "React/Tailwind", "DaVinci Resolve", "Audio mixing", "Photography"])
    assert.ok(h.includes(`>${s}<`), `pill: ${s}`);
});

test("top bar links to every home section and the projects page", () => {
  for (const page of ["/", "/projects", "/projects/rxcounsel"]) {
    const h = html(page);
    const nav = h.slice(h.search(/<nav[^>]*aria-label="Main"/), h.indexOf("</nav>", h.search(/<nav[^>]*aria-label="Main"/)));
    assert.ok(nav.length > 0, `${page}: no main nav`);
    for (const s of ['href="/#top"', 'href="/#experience"', 'href="/#education"', 'href="/#skills"', 'href="/projects"'])
      assert.ok(nav.includes(s), `${page}: nav missing ${s}`);
    assert.ok(!h.includes("bounce-sidebar") && !h.includes("fluid-orb"), `${page}: old sidebar or orb`);
    assert.match(h, /<button[^>]*popovertarget="site-menu"/i, `${page}: no phone menu button`);
    assert.match(h, /id="site-menu"[^>]*popover|popover[^>]*id="site-menu"/, `${page}: no phone menu popover`);
    assert.match(h, /<a[^>]*href="#main"/, `${page}: no skip link`);
  }
});

test("projects page: one list, newest first, year + link + tag", () => {
  const h = flat(html("/projects"));
  assert.match(h, /<h1[^>]*>Projects<\/h1>/);
  const items = [...h.matchAll(/<li[^>]*data-project="([^"]+)"[^>]*>(.*?)<\/li>/g)];
  assert.ok(items.length >= 1, "no project entries");
  const rx = items.find((m) => m[1] === "rxcounsel")[2];
  assert.ok(rx.includes(">2026<"), "year");
  assert.match(rx, /href="\/projects\/rxcounsel"[^>]*>RxCounsel</, "link");
  assert.ok(rx.includes(">Pharmacy<"), "category tag");
  assert.ok(rx.includes("AI counselling-prep tool"), "description");
});

test("project page: screenshot, caption and write-up", () => {
  const h = html("/projects/rxcounsel");
  const fig = h.slice(h.indexOf("<figure"), h.indexOf("</figure>"));
  assert.match(fig, /src="\/_astro\/rxcounsel-input-screen[^"]*\.webp"/, "screenshot as webp");
  assert.ok(fig.includes("Generate button"), "alt text");
  assert.ok(flat(fig).includes("RxCounsel's input screen: the pharmacist enters patient details and the new drug, then clicks Generate."), "caption");
  assert.ok(h.indexOf("</h1>") < h.indexOf("<figure") && h.indexOf("<figure") < h.indexOf("The problem"), "figure between title and write-up");
  assert.ok(flat(h).includes("7–12 complex counselling sessions"), "write-up text");
  assert.match(h, /property="og:image" content="[^"]*rxcounsel-input-screen/, "og:image");
});

test("old URLs redirect", () => {
  assert.ok(html("/cv").includes("/#experience") && html("/cv").includes('http-equiv="refresh"'), "/cv");
  assert.ok(html("/contact").includes('http-equiv="refresh"'), "/contact is not a redirect");
});

test("no <div> inside a <p> (the browser would end the paragraph early)", () => {
  for (const page of PAGES) {
    const bad = html(page).match(/<p\b[^>]*>(?:(?!<\/p>).)*?<div/s);
    assert.equal(bad, null, `${page}: ${bad?.[0].slice(0, 80)}`);
  }
});

test("no duplicate ids, and nothing has id=top", () => {
  for (const page of PAGES) {
    const h = html(page);
    const ids = [...h.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
    assert.deepEqual(ids.filter((id, i) => ids.indexOf(id) !== i), [], `${page}: duplicate ids`);
    assert.ok(!ids.includes("top"), `${page}: id="top" stops /#top short of the page top`);
  }
});

/** Every built stylesheet, concatenated. */
function css() {
  const dir = new URL("../dist/_astro/", import.meta.url);
  return readdirSync(dir).filter((f) => f.endsWith(".css")).map((f) => readFileSync(new URL(f, dir), "utf8")).join("\n");
}
const lum = (hex) => {
  const v = parseInt(hex.slice(1, 7), 16), f = (s) => ((s /= 255) <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4);
  return 0.2126 * f(v >> 16) + 0.7152 * f((v >> 8) & 255) + 0.0722 * f(v & 255);
};
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
/** The light value of an Astryx colour token as the ayu theme sets it (inside its @scope). */
const token = (c, name) => {
  const m = [...c.matchAll(new RegExp(`${name}:\\s*(?:light-dark\\()?\\s*(#[0-9a-fA-F]{6})`, "g"))]
    .filter((m) => c.slice(c.lastIndexOf("@scope", m.index), m.index).match(/data-astryx-theme="?ayu"?\]/))
    .at(-1); // the theme layer comes last and wins
  assert.ok(m, `ayu token ${name} not found`);
  return m[1].toLowerCase();
};

test("ayu text colours reach 4.5:1 on the page background", () => {
  const c = css();
  const bg = token(c, "--color-background-body");
  assert.equal(bg, "#f8f9fa", "ayu light background");
  for (const t of ["--color-text-primary", "--color-text-secondary", "--color-text-accent"]) {
    const r = ratio(token(c, t), bg);
    assert.ok(r >= 4.5, `${t} is ${r.toFixed(2)}:1`);
  }
  assert.ok(!c.includes("255 252 240"), "Flexoki paper colour still in the CSS");
});

test("fade-up only runs when reduced motion is off", () => {
  const c = css().replace(/\s+/g, "");
  const at = c.indexOf("@keyframesfade-up");
  assert.ok(at > -1, "no fade-up animation");
  for (const m of c.matchAll(/animation(-name)?:[^;}]*fade-up/g)) {
    const before = c.lastIndexOf("@media", m.index);
    assert.ok(c.slice(before, before + 50).includes("prefers-reduced-motion:no-preference"), "fade-up used outside a no-preference block");
  }
  assert.ok(!/clamp\(100%,1vw,125%\)/.test(c), "wide-screen scaling still there");
});
