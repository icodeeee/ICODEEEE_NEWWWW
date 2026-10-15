"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import type { ProjectSection } from "@/lib/project-visuals";

export function ProjectWebsiteSection({
  section,
  projectName,
  liveUrl,
}: {
  section: ProjectSection;
  projectName: string;
  liveUrl: string | null;
}) {
  if (section.kind === "features") {
    return <FeatureCarousel section={section} liveUrl={liveUrl} />;
  }

  return <ProductCollection section={section} projectName={projectName} />;
}

function FeatureCarousel({ section, liveUrl }: { section: Extract<ProjectSection, { kind: "features" }>; liveUrl: string | null }) {
  const [active, setActive] = useState(0);
  const feature = section.items[active];
  const move = (amount: number) => setActive((current) => (current + amount + section.items.length) % section.items.length);

  return <section className="project-website-section project-website-section--rupali" aria-labelledby="website-section-title">
    <header className="project-website-heading">
      <p className="eyebrow">{section.eyebrow}</p>
      <h2 id="website-section-title">{section.title}</h2>
      <p>{section.intro}</p>
    </header>
    <div className="rupali-feature-stage" aria-live="polite">
      <div className="rupali-feature-image"><Image key={feature.image} src={feature.image} alt={feature.alt} fill sizes="(max-width: 760px) 100vw, 65vw" priority /></div>
      <div className="rupali-feature-copy">
        <span className="rupali-feature-count">{String(active + 1).padStart(2, "0")} <i>/</i> {String(section.items.length).padStart(2, "0")}</span>
        <p className="eyebrow">Rupali Construction</p>
        <h3>{feature.title}</h3>
        <p>{feature.detail}</p>
        <div className="rupali-feature-controls">
          <button type="button" onClick={() => move(-1)} aria-label="Show previous Rupali advantage"><ArrowLeft size={18} /></button>
          <button type="button" onClick={() => move(1)} aria-label="Show next Rupali advantage"><ArrowRight size={18} /></button>
        </div>
      </div>
    </div>
    <div className="rupali-feature-picker" role="tablist" aria-label="The Rupali Advantage">
      {section.items.map((item, index) => <button type="button" role="tab" aria-selected={active === index} key={item.title} onClick={() => setActive(index)}>
        <span>{String(index + 1).padStart(2, "0")}</span>{item.title}
      </button>)}
    </div>
    <footer className="project-website-footer"><span>{section.sourceLabel}</span>{liveUrl && <a href={liveUrl} target="_blank" rel="noreferrer">Explore Rupali Construction <ArrowUpRight size={15} /></a>}</footer>
  </section>;
}

function ProductCollection({ section, projectName }: { section: Extract<ProjectSection, { kind: "products" }>; projectName: string }) {
  const isSlugsera = projectName.toLowerCase().includes("slugsera");
  return <section className={`project-website-section project-website-section--products ${isSlugsera ? "project-website-section--slugsera" : "project-website-section--aw"}`} aria-labelledby="website-section-title">
    <header className="project-website-heading project-product-heading">
      <div><p className="eyebrow">{section.eyebrow}</p><h2 id="website-section-title">{section.title}</h2><p>{section.intro}</p></div>
      <a className="project-collection-link" href={section.actionUrl} target="_blank" rel="noreferrer">{section.actionLabel}<ArrowUpRight size={17} aria-hidden="true" /></a>
    </header>
    <div className="live-product-grid">
      {section.items.map((item, index) => <a className="live-product-card" key={item.title} href={item.url} target="_blank" rel="noreferrer">
        <span className="live-product-image"><Image src={item.image} alt={item.alt} fill sizes="(max-width: 650px) 82vw, (max-width: 1000px) 42vw, 22vw" /></span>
        <span className="live-product-info"><span className="live-product-number">{String(index + 1).padStart(2, "0")} / {String(section.items.length).padStart(2, "0")}</span><b>{item.title}</b><span className="live-product-detail">{item.detail}</span><span className="live-product-meta">{item.price && <b>{item.price}</b>}<span>View on site <ArrowUpRight size={14} /></span></span></span>
      </a>)}
    </div>
    <div className="project-website-footer"><span>Product photos and names from {projectName}.</span><a href={section.actionUrl} target="_blank" rel="noreferrer">See the full collection <ArrowUpRight size={15} /></a></div>
  </section>;
}
