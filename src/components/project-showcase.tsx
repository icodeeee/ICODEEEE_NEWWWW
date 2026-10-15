"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/types";
import { getProjectVisual } from "@/lib/project-visuals";

/**
 * Compact portfolio card.
 *
 * Deliberately one action per card. Previously each card carried a fake browser
 * bar with a preview control, a "Visit website" button and an "Explore the
 * project" link — four ways to leave the page, which read as clutter. The card
 * itself now goes to the case study, with the live site as one quiet link.
 */
export function ProjectShowcase({ project, index }: { project: Project; index: number }) {
  const visual = getProjectVisual(project);
  const host = project.live_url ? new URL(project.live_url).hostname.replace(/^www\./, "") : "";

  return <article className="work-card-tile">
    <Link href={`/work/${project.slug}`} className="work-tile-link">
      <span className="work-tile-visual">
        {visual.image
          ? <Image src={visual.image} alt={visual.alt} fill sizes="(max-width: 900px) 100vw, 33vw" />
          : <span className="project-image-fallback">{project.name}</span>}
      </span>
      <span className="work-tile-body">
        <span className="work-tile-category">{project.category}</span>
        <span className="work-tile-head">
          <b>{project.name}</b>
          <ArrowUpRight size={18} strokeWidth={1.5} aria-hidden="true" />
        </span>
        <span className="work-tile-caption">{visual.caption}</span>
        <span className="work-tile-story">Explore project story <span aria-hidden="true">↗</span></span>
      </span>
    </Link>
    {project.live_url && <a href={project.live_url} target="_blank" rel="noreferrer" className="work-tile-live">{host}</a>}
  </article>;
}

export function ProjectCollection({ projects }: { projects: Project[] }) {
  return <section aria-labelledby="selected-projects-heading">
    <h2 id="selected-projects-heading" className="film-sr">Selected projects</h2>
    <div className="real-projects">{projects.map((project, index) => <ProjectShowcase key={project.id} project={project} index={index} />)}</div>
  </section>;
}
