import { pageMetadata } from "@/lib/metadata";
import { ProjectCollection } from "@/components/project-showcase";
import { PageHero } from "@/components/page-hero";
import { getProjects } from "@/lib/data";
export const metadata = pageMetadata({ title: "Work", description: "Selected iCodeee projects and case studies.", path: "/work" });
export default async function Work() { const projects = await getProjects(); return <main id="main" className="page-main work-page"><PageHero eyebrow="Selected projects" title="THE WORK, IN ITS OWN WORLD.">Explore the live sites, visual details and decisions behind each project.</PageHero><section className="content-section"><ProjectCollection projects={projects} /></section></main>; }
