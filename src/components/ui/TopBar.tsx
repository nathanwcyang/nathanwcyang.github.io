// The site's top bar. Wide screens show every link; phones get a menu button that opens a
// native popover (closes on Escape or a tap outside, with no JavaScript).
import { TopNav, TopNavHeading, TopNavItem } from "@astryxdesign/core/TopNav";
import { Icon } from "./Icon";

export const NAV_LINKS = [
  { label: "Experience", href: "/#experience" },
  { label: "Education", href: "/#education" },
  { label: "Skills", href: "/#skills" },
  { label: "Projects", href: "/projects" },
];

export function TopBar({ current }: { current?: string }) {
  return (
    <TopNav
      label="Main"
      heading={<TopNavHeading heading="Nathan Yang" headingHref="/#top" />}
      endContent={
        <>
          <span className="hidden sm:contents">
            {NAV_LINKS.map((l) => (
              <TopNavItem key={l.href} label={l.label} href={l.href} isSelected={l.href === current} />
            ))}
          </span>
          <button
            type="button"
            popoverTarget="site-menu"
            aria-label="Menu"
            className="sm:hidden inline-flex size-10 items-center justify-center rounded-md text-primary hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
          >
            <Icon icon="menu" size="md" />
          </button>
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
                    className="block rounded-md px-3 py-2 text-primary hover:bg-muted focus-visible:outline-2 focus-visible:outline-[var(--color-accent)]"
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
  );
}
