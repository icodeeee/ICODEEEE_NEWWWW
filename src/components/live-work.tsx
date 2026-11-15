"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const projects = [
  { name: "Slugsera", type: "FASHION / ECOMMERCE", url: "https://www.slugsera.com/", copy: "An ecommerce storefront built around the collection.", embed: true },
  { name: "Rupali Construction", type: "CONSTRUCTION / DIGITAL EXPERIENCE", url: "https://rupaliconstruction.com/projects", copy: "A construction portfolio, services and enquiry experience.", embed: false },
  { name: "Stress Unwind", type: "WELLNESS / DIGITAL EXPERIENCE", url: "https://stress-unwind.com/", copy: "A digital space for wellbeing and connection.", embed: true },
];

export function LiveWork() {
  const [active, setActive] = useState<string | null>(null);
  return <div className="hn-featured hn-live-featured">{projects.map((project, i) => <article className="hn-project hn-live-project" key={project.name}>
    <div className="hn-live-viewport">
      {project.embed ? <>
        <iframe title={`${project.name} live website preview`} src={project.url} loading="lazy" tabIndex={active === project.name ? 0 : -1} className={active === project.name ? "hn-frame-active" : ""} sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox" referrerPolicy="strict-origin-when-cross-origin" />
        {active !== project.name && <div className="hn-live-overlay"><span>LIVE WEBSITE / 0{i + 1}</span><button type="button" onClick={() => setActive(project.name)}>Explore live preview <ArrowUpRight size={16} /></button><small>Scroll to see the next project</small></div>}
        {active === project.name && <button className="hn-frame-exit" type="button" onClick={() => setActive(null)}>Close preview scrolling ×</button>}
      </> : <div className="hn-live-unavailable hn-live-rupali"><Image src="/work/rupali-villa.jpg" alt="Duplex luxury villa from Rupali Construction’s portfolio" fill sizes="100vw" /><div className="hn-live-rupali-copy"><p>RUPALI CONSTRUCTION / 0{i + 1}</p><h3>Built with<br />purpose<span>.</span></h3><p>Explore the live portfolio, services and project pages.</p><a href={project.url} target="_blank" rel="noopener noreferrer">Visit the website <ArrowUpRight size={18} /></a><small>This website opens in a new tab.</small></div></div>}
    </div>
    <div className="hn-project-info"><p>{project.type}</p><h3>{project.name}</h3><div><span>{project.copy}</span><a className="hn-live-visit" href={project.url} target="_blank" rel="noopener noreferrer">Visit website <ArrowUpRight size={15} /></a></div></div>
  </article>)}</div>;
}
