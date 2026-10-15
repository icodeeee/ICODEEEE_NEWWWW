import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowDown, ArrowUpRight, MessageCircle } from "lucide-react";
import { getProjectVisual } from "@/lib/project-visuals";
import { getProject } from "@/lib/data";
import { getStaticProjectSlugs } from "@/lib/static-projects";
import { pageMetadata } from "@/lib/metadata";
import { whatsappHref } from "@/lib/site";
import { ProjectGallery } from "@/components/project-gallery";

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
  const editorial = visual.editorial;
  const host = project.live_url ? new URL(project.live_url).hostname.replace(/^www\./, "") : "";
  const intro = editorial?.intro || project.short_description || project.description || `Explore ${project.name} by iCodeee.`;
  const overview = content.challenge || editorial?.overview || project.description;
  const whatsappMessage = encodeURIComponent(`Hi iCodeee, I saw the ${project.name} project and would like to discuss something similar.`);

  return <main id="main" className="case-study">
    <section className="case-intro case-intro-editorial">
      <div className="case-intro-top"><Link href="/work" className="case-back-link">← All projects</Link><span>{editorial?.eyebrow || `Selected project / ${project.category}`}</span></div>
      <p className="eyebrow">{editorial?.eyebrow || project.category}</p>
      <h1>{project.name}</h1>
      <p className="case-intro-deck">{intro}</p>
      <div className="case-intro-actions">
        {project.live_url && <a href={project.live_url} target="_blank" rel="noreferrer" className="case-primary-link">Explore the live site <ArrowUpRight size={17} aria-hidden="true" /></a>}
        <a href="#project-overview" className="case-secondary-link">See the project <ArrowDown size={15} aria-hidden="true" /></a>
      </div>
      <div className="case-intro-index"><span>PROJECT / {String(project.order).padStart(2, "0")}</span><span>{host}</span></div>
    </section>

    {visual.image && <section className="case-site-capture" aria-label={`${project.name} live website capture`}>
      <div className="case-site-bar"><span className="case-site-dots"><i /><i /><i /></span><span>{host || project.name}</span>{project.live_url && <a href={project.live_url} target="_blank" rel="noreferrer" aria-label={`Open ${project.name} website in a new tab`}>Open site <ArrowUpRight size={14} aria-hidden="true" /></a>}</div>
      <div className="case-site-image"><Image src={visual.image} alt={visual.alt} fill priority sizes="(max-width: 900px) 100vw, 88vw" /></div>
      <p>{visual.caption}</p>
    </section>}

    <section className="case-overview" id="project-overview">
      <div className="case-overview-label"><span>01</span><p>The project</p></div>
      <div className="case-overview-copy">
        <p className="eyebrow">{editorial?.eyebrow || project.category}</p>
        <h2>{editorial?.headline || `Inside ${project.name}.`}</h2>
        {overview && <p className="case-overview-description">{overview}</p>}
        {content.build && <p className="case-overview-description">{content.build}</p>}
        {content.result && <p className="case-overview-description"><strong>Outcome:</strong> {content.result}</p>}
        {tags.length > 0 && <ul className="case-tags" aria-label="Services and technologies">{tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>}
      </div>
      {editorial?.highlights && <div className="case-highlights">
        {editorial.highlights.map((item, index) => <article key={item.title}><span>0{index + 1}</span><div><h3>{item.title}</h3><p>{item.detail}</p></div></article>)}
      </div>}
    </section>

    <ProjectGallery name={project.name} images={visual.gallery} labels={visual.galleryLabels} />

    <section className="case-endcap" id="project-links">
      <div><p className="eyebrow">Keep exploring</p><h2>See it in its <em>own world.</em></h2><p>Visit the live project, or tell us what you’re looking to build.</p></div>
      <div className="case-endcap-actions">
        {project.live_url && <a href={project.live_url} target="_blank" rel="noreferrer" className="case-primary-link">Visit {host} <ArrowUpRight size={17} aria-hidden="true" /></a>}
        <Link href="/contact?service=Website%20or%20web%20product" className="case-secondary-link">Discuss a project <ArrowUpRight size={15} aria-hidden="true" /></Link>
        {whatsappHref && <a href={`${whatsappHref}?text=${whatsappMessage}`} target="_blank" rel="noreferrer" className="case-secondary-link"><MessageCircle size={15} aria-hidden="true" /> WhatsApp us</a>}
      </div>
      <Link href="/work" className="case-next-project">← Back to all projects</Link>
    </section>
  </main>;
}
