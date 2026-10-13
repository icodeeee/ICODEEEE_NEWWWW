"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Globe, X } from "lucide-react";
import type { Project } from "@/lib/types";
import { getProjectVisual } from "@/lib/project-visuals";

export function ProjectShowcase({ project, index, preview, onPreview }: { project: Project; index: number; preview: boolean; onPreview: () => void }) {
  const visual = getProjectVisual(project);
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(.7);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const observer = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / 1440));
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);
  const host = project.live_url ? new URL(project.live_url).hostname.replace(/^www\./, "") : "Selected project";
  return <article className={`real-project ${visual.theme ? `real-${visual.theme}` : ""}`}>
    <div className="real-project-top"><p className="film-label">{String(index + 1).padStart(2, "0")} / {visual.theme === "site" ? project.name : project.category}</p><span><i /> LIVE PROJECT</span></div>
    <div ref={frameRef} className={`real-project-visual ${preview ? "is-preview" : ""}`} style={{ "--site-scale": scale } as CSSProperties}>
      {preview && project.live_url ? <><div className="preview-loading" role="status">{loaded ? "Live website preview" : "Opening the live website…"}</div><div className="preview-canvas" inert><iframe src={project.live_url} title={`${project.name} live website preview`} sandbox="allow-scripts allow-same-origin" tabIndex={-1} onLoad={() => setLoaded(true)} /></div></> : <Link href={`/work/${project.slug}`} className="real-project-image" aria-label={`Explore ${project.name}`}>
        {visual.image ? <Image src={visual.image} alt={visual.alt} fill sizes="(max-width: 760px) 100vw, 86vw" /> : <span className="project-image-fallback">{project.name}</span>}
        {/* A capture of the live site already carries the brand name, so overlaying
            the project title on top just collides with the page's own wordmark. */}
        {visual.theme !== "site" && <span className="real-project-title">{project.name}<ArrowUpRight strokeWidth={1} /></span>}
        <span className="project-image-caption">{visual.label}</span>
      </Link>}
      <div className="real-browser-bar"><span className="browser-dots" aria-hidden="true"><i /><i /><i /></span><span>{host}</span>{project.live_url && <button type="button" onClick={() => { setLoaded(false); onPreview(); }} aria-expanded={preview} aria-label={preview ? `Close ${project.name} preview` : `Preview ${project.name} website`}>{preview ? <><X size={14} /> Close preview</> : <><Globe size={14} /> Preview website</>}</button>}</div>
    </div>
    <div className="real-project-bottom"><div><h3>{visual.caption}</h3><p>{project.short_description}</p></div><div className="real-project-actions">{project.live_url && <a href={project.live_url} target="_blank" rel="noreferrer" className="film-button">Visit website <ArrowUpRight size={17} /></a>}<Link href={`/work/${project.slug}`} className="film-text-link">Explore the project <ArrowUpRight size={16} /></Link></div></div>
    {preview && <p className="preview-note">A live look at {project.name}. Open the website to explore the complete experience.</p>}
  </article>;
}

export function ProjectCollection({ projects }: { projects: Project[] }) {
  const [activePreview, setActivePreview] = useState<string | null>(null);
  return <div className="real-projects">{projects.map((project, index) => <ProjectShowcase key={project.id} project={project} index={index} preview={activePreview === project.id} onPreview={() => setActivePreview(activePreview === project.id ? null : project.id)} />)}</div>;
}
