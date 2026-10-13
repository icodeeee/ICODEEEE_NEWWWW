import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getProjectVisual } from "@/lib/project-visuals";
import { getProject } from "@/lib/data";
import { getStaticProjectSlugs } from "@/lib/static-projects";
import { pageMetadata } from "@/lib/metadata";

/**
 * Prerenders known projects and still allows CMS-added ones to render on demand.
 * Without this the route was force-dynamic, so `notFound()` fired after the
 * response had already begun streaming and unknown slugs returned HTTP 200 —
 * a soft 404 that search engines index as a real page.
 *
 * Uses a cookies-free lookup because generateStaticParams runs at build time.
 */
export async function generateStaticParams() {
  const slugs = await getStaticProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

/**
 * Unknown slugs are rejected at the routing layer and return a real HTTP 404.
 * Leaving this at the default (true) renders them on demand, and because the
 * response has already begun streaming the not-found page ships with HTTP 200 —
 * a soft 404 that crawlers index as a genuine page.
 *
 * Trade-off: a project added through the CMS becomes routable on the next
 * deployment rather than immediately. For a portfolio of this size that is a
 * fair price for correct status codes.
 */
export const dynamicParams = false;
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const project = await getProject((await params).slug); if (!project) return { title: "Project" }; return pageMetadata({ title: project.name, description: project.short_description || `${project.name} — a project by iCodeee.`, path: `/work/${project.slug}` }); }
export default async function CaseStudy({ params }: { params: Promise<{ slug: string }> }) {
  const project = await getProject((await params).slug);
  if (!project) notFound();
  const content = project.case_study_content || {};
  const visual = getProjectVisual(project);
  const tags = [...new Set([...project.services, ...project.technologies])];
  return <main id="main" className="case-study"><section className="case-intro"><Link href="/work" className="film-text-link">← All selected work</Link><p className="eyebrow">Selected work / {project.category}</p><h1>{project.name}</h1><p>{project.short_description}</p></section>
    {visual.image && <div className="case-cover"><Image src={visual.image} alt={visual.alt} fill sizes="100vw" /></div>}
    {(content.challenge || project.description) && <section className="case-detail"><h2>{content.challenge ? "The brief" : "The project"}</h2><p>{content.challenge || project.description}</p></section>}
    {(content.build || tags.length > 0) && <section className="case-detail"><h2>The build</h2><div>{content.build && <p>{content.build}</p>}<div className="case-tags">{tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div></section>}
    {content.result && <section className="case-detail"><h2>The result</h2><p>{content.result}</p></section>}
    {visual.gallery.length > 0 && <section className="case-gallery" aria-label={`${project.name} project imagery`}>{visual.gallery.map((src,i)=><figure key={src}><div><Image src={src} alt={`${project.name} project image ${i+1}`} fill sizes="(max-width: 760px) 100vw, 50vw" /></div><figcaption>{project.name} / 0{i+1}</figcaption></figure>)}</section>}
    <section className="content-section case-actions">{project.live_url && <a href={project.live_url} target="_blank" rel="noreferrer" className="film-button">View live website <span>↗</span></a>}<Link href="/contact" className="film-text-link">Discuss a similar project <span>↗</span></Link></section></main>;
}
