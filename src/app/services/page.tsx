import { pageMetadata } from "@/lib/metadata";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { services, moneyRange } from "@/lib/services";

export const metadata = pageMetadata({ title: "Services", description: "Website development, ecommerce, UI/UX, content strategy and graphic design from iCodeee.", path: "/services" });

export default function Services() {
  return <main id="main" className="page-main"><PageHero eyebrow="Capability, connected" title="ONE PARTNER. THE WHOLE SYSTEM.">Strategy, content, design and development move faster and stay sharper when they are built together.</PageHero><section className="content-section"><div className="card-grid">{services.map((service) => <article className="info-card service-index-card" id={service.slug} key={service.slug}><p className="eyebrow">{service.number}</p><h3>{service.name}</h3><p>{service.line}</p><ul>{service.items.map((item) => <li key={item}>{item}</li>)}</ul><p className="service-index-from">{moneyRange(service.options[0].from, service.options[0].to)} <span>based on project scope</span></p><Link href={`/services/${service.slug}`} className="service-index-link">Explore {service.name} <ArrowUpRight size={16} /></Link></article>)}</div></section></main>;
}
