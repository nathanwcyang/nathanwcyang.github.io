import { getCollection } from "astro:content";
import { PillIcon, FilmSlateIcon } from "@phosphor-icons/react/dist/ssr";

/** All projects: featured first, then newest first. */
export async function getSortedProjects() {
  const projects = await getCollection("projects");
  return projects.sort(
    (a, b) =>
      Number(b.data.featured) - Number(a.data.featured) ||
      b.data.date.valueOf() - a.data.date.valueOf()
  );
}

/** How each project category is shown: its tag text and icon. */
export const CATEGORY = {
  pharmacy: { label: "Pharmacy", icon: PillIcon },
  creative: { label: "Creative", icon: FilmSlateIcon },
} as const;
