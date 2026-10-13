import { getProjects } from "@/lib/data";

/** Slugs to prerender at build time. Reads no request-bound APIs. */
export async function getStaticProjectSlugs(): Promise<string[]> {
  const projects = await getProjects();
  return projects.map((project) => project.slug);
}