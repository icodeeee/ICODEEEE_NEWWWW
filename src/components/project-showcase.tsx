"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import type { Project } from "@/lib/types";
import { getProjectVisual } from "@/lib/project-visuals";

/** Each project gets its own scroll reveal and gently moving preview. */
export function ProjectShowcase({ project, index, calm = false }: { project: Project; index: number; calm?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const still = calm || !!reducedMotion;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], [28, -28]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.12, 1.02]);
  const visual = getProjectVisual(project);
  const host = project.live_url ? new URL(project.live_url).hostname.replace(/^www\./, "") : "";

  return <motion.article
    ref={ref}
    className={`work-card-tile portfolio-chapter ${index % 2 ? "portfolio-chapter-reverse" : ""}`}
    initial={still ? false : "below"}
    animate={still ? "visible" : undefined}
    whileInView="visible"
    viewport={{ once: true, amount: .15 }}
    variants={{ below: { opacity: 0, y: 120, scale: .96 }, visible: { opacity: 1, y: 0, scale: 1 } }}
    transition={{ duration: still ? 0 : 1.1, ease: [.22, 1, .36, 1] }}
  >
    <Link href={`/work/${project.slug}`} className="work-tile-link">
      <span className="work-tile-visual">
        <motion.span className="work-tile-media" style={{ y: still ? 0 : imageY, scale: still ? 1 : imageScale }}>
        {visual.image
          ? <Image src={visual.image} alt={visual.alt} fill sizes="(max-width: 760px) 100vw, 60vw" />
          : <span className="project-image-fallback">{project.name}</span>}
        </motion.span>
        <span className="work-tile-image-label" aria-hidden="true">SELECTED WORK / {String(index + 1).padStart(2, "0")}</span>
        <span className="work-tile-open" aria-hidden="true"><ArrowUpRight size={26} strokeWidth={1.3} /></span>
      </span>
      <span className="work-tile-body">
        <span className="work-tile-category">{project.category}</span>
        <span className="work-tile-head">
          <b>{project.name}</b>
          <ArrowUpRight size={18} strokeWidth={1.5} aria-hidden="true" />
        </span>
        <span className="work-tile-caption">{visual.caption}</span>
        {project.services.length > 0 && <span className="work-tile-tags">{project.services.slice(0, 3).map(service => <span key={service}>{service}</span>)}</span>}
        <span className="work-tile-story">Inside the project <span aria-hidden="true">↗</span></span>
      </span>
    </Link>
    <div className="work-tile-footer"><span>PROJECT {String(index + 1).padStart(2, "0")} <span aria-hidden="true">/</span> {project.category}</span>{project.live_url && <a href={project.live_url} target="_blank" rel="noreferrer" className="work-tile-live">{host} <ArrowUpRight size={13} aria-hidden="true" /></a>}</div>
  </motion.article>;
}

export function ProjectCollection({ projects }: { projects: Project[] }) {
  return <section aria-labelledby="selected-projects-heading">
    <h2 id="selected-projects-heading" className="film-sr">Selected projects</h2>
    <div className="real-projects">{projects.map((project, index) => <ProjectShowcase key={project.id} project={project} index={index} />)}</div>
  </section>;
}
