import { useEffect, useState } from "react";
import { BounceSidebar } from "@/components/ui/bounce-sidebar";

// Sidebar links. Ids are "nav-" + name so they never clash with section ids on the page.
const LINKS = [
  { name: "home", label: "Home", href: "/#top" },
  { name: "projects", label: "Projects", href: "/#projects" },
  { name: "cv", label: "CV", href: "/#experience" },
  { name: "contact", label: "Contact", href: "/contact" },
];

declare global {
  interface Window {
    __navActive?: string;
  }
}

// The dot follows the "nav:active" event sent by the scroll tracking script in SideBarMenu.astro.
export default function NavMenu({ active, className }: { active?: string; className?: string }) {
  const [current, setCurrent] = useState(active);

  useEffect(() => {
    // The script may have run before this island hydrated
    if (window.__navActive) setCurrent(window.__navActive);
    const onActive = (e: Event) => setCurrent((e as CustomEvent<string>).detail);
    window.addEventListener("nav:active", onActive);
    return () => window.removeEventListener("nav:active", onActive);
  }, []);

  return (
    <BounceSidebar
      className={className}
      items={LINKS.map(({ name, label, href }) => ({ label, href, id: `nav-${name}` }))}
      value={LINKS.findIndex((l) => l.name === current)}
      onChange={(i) => setCurrent(LINKS[i].name)}
      dotColor="rgb(var(--nav-dot))"
    />
  );
}
