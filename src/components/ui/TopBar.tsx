// PROTOTYPE (branch prototype/morphing-navbar): the 21st.dev morphing scroll navbar, rebuilt on Astryx TopNav.
// No brand on the left; every link sits on the right, next to one LinkedIn button.
// The morph itself is CSS + a small script in BaseLayout.astro; this file stays static HTML.
// Phones still get the native popover menu (closes on Escape or a tap outside, with no JavaScript).
import { TopNav, TopNavItem } from "@astryxdesign/core/TopNav";
import { LinkedinLogoIcon } from "@phosphor-icons/react/dist/ssr";
import { SITE_LINKEDIN } from "../../config";
import { Icon } from "./Icon";
import { Themed } from "./Themed";

export const NAV_LINKS = [
  { label: "Experience", href: "/#experience" },
  { label: "Education", href: "/#education" },
  { label: "Skills", href: "/#skills" },
  { label: "Projects", href: "/projects" },
];

export function TopBar({ current }: { current?: string }) {
  return (
    <Themed>
    <TopNav
      label="Main"
      endContent={
        <>
          {/* Home-page sections: fade away once you scroll (variants D and E) */}
          <span data-section-links className="hidden sm:flex">
            {NAV_LINKS.slice(0, 3).map((l) => (
              <TopNavItem key={l.href} label={l.label} href={l.href} isSelected={l.href === current} />
            ))}
          </span>
          {/* Projects + LinkedIn: always visible; D draws a pill around this group */}
          <span data-pill className="flex items-center gap-3 rounded-2xl border border-transparent p-1">
          <span data-projects className="hidden sm:flex">
            <TopNavItem label={NAV_LINKS[3].label} href={NAV_LINKS[3].href} isSelected={NAV_LINKS[3].href === current} />
          </span>
          {/* The snippet's button: white surface, hairline border, lifts on hover, presses in on click */}
          <a
            data-nav-cta
            href={SITE_LINKEDIN}
            target="_blank"
            rel="noopener"
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-semibold text-primary transition-[transform,box-shadow] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:shadow-md motion-safe:hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97]"
          >
            {/* LinkedIn brand blue: the one hard-coded colour, a logo's own colour (prototype) */}
            <LinkedinLogoIcon size={18} weight="fill" className="text-[#0A66C2]" aria-hidden="true" />
            LinkedIn
          </a>
          {/* A native <button>: Astryx's IconButton doesn't type popoverTarget, which the no-JS menu needs. */}
          <button
            type="button"
            popoverTarget="site-menu"
            aria-label="Menu"
            className="sm:hidden inline-flex size-10 items-center justify-center rounded-md text-primary hover:bg-muted"
          >
            <Icon icon="menu" size="md" />
          </button>
          </span>
          <div
            id="site-menu"
            popover="auto"
            className="sm:hidden m-0 ms-auto mt-16 me-4 w-56 rounded-lg border border-border bg-card p-2 shadow-lg"
          >
            <ul>
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="block rounded-md px-3 py-2 text-primary hover:bg-muted"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </>
      }
    />
    </Themed>
  );
}
