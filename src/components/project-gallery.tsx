"use client";

import Image from "next/image";
import { useState } from "react";

export function ProjectGallery({
  name,
  images,
  labels,
}: {
  name: string;
  images: string[];
  labels: string[];
}) {
  const [active, setActive] = useState(0);
  if (!images.length) return null;
  const label = labels[active] || `Project view ${String(active + 1).padStart(2, "0")}`;

  return <section className="case-gallery-section" aria-label={`${name} project gallery`}>
    <div className="case-gallery-heading">
      <p className="eyebrow">A closer look</p>
      <h2>Details in the <em>frame.</em></h2>
      <p>Browse real imagery from the live brand and its work.</p>
    </div>
    <div className="case-gallery-view" aria-live="polite">
      <Image src={images[active]} alt={`${name}: ${label}`} fill sizes="(max-width: 760px) 100vw, 80vw" />
      <span>{String(active + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}</span>
    </div>
    <div className="case-gallery-picker" role="group" aria-label="Choose a project image">
      {images.map((src, index) => {
        const itemLabel = labels[index] || `Project view ${String(index + 1).padStart(2, "0")}`;
        return <button key={src} type="button" aria-pressed={active === index} aria-label={`Show ${itemLabel}`} onClick={() => setActive(index)}>
          <span className="case-gallery-thumb"><Image src={src} alt="" fill sizes="150px" /></span>
          <span>{itemLabel}</span>
        </button>;
      })}
    </div>
  </section>;
}
