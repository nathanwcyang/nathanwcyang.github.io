import { getCollection } from "astro:content";

/** All projects: featured first, then newest first. */
export async function getSortedProjects() {
  const projects = await getCollection("projects");
  return projects.sort(
    (a, b) =>
      Number(b.data.featured) - Number(a.data.featured) ||
      b.data.date.valueOf() - a.data.date.valueOf()
  );
}
