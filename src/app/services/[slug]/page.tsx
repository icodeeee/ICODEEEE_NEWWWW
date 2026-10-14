import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Check, Minus } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { EstimateFunnel } from "@/components/estimate-funnel";
import { ApproachSection } from "@/components/approach-section";
import { getService, money, moneyRange, services } from "@/lib/services";
import { pageMetadata } from "@/lib/metadata";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

// The catalogue is static, so unknown slugs should 404 at the routing layer
// rather than render the not-found page with a soft 200.
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const service = getService((await params).slug);
  if (!service) return { title: "Service" };
  const range = service.options.map((o) => moneyRange(o.from, o.to)).join(" · ");
  return pageMetadata({
    title: service.name,
    description: `${service.intro} Indicative ranges ${range}.`,
    path: `/services/${service.slug}`,
  });
}

export default async function ServiceDetail({ params }: { params: Promise<{ slug: string }> }) {
  const service = getService((await params).slug);
  if (!service) notFound();

  const others = services.filter((candidate) => candidate.slug !== service.slug);
  const entry = service.options[0];

  return (
    <main id="main" className="page-main service-detail">
      <PageHero
        eyebrow={service.eyebrow}
        title={service.name}
        dense
        meta={[
          { label: "Indicative range", value: `from ${money(entry.from)}` },
          { label: "Fastest timeline", value: entry.timeline },
          { label: "Includes", value: `${service.options.length} packages · ${service.addOns.length} add-ons` },
        ]}
        actions={
          <>
            <Link href="#estimate" className="button">
              Build my estimate <ArrowUpRight size={17} />
            </Link>
            <Link href="/work" className="button button-secondary">
              See the work <ArrowUpRight size={17} />
            </Link>
          </>
        }
      >
        {service.line}
      </PageHero>

      <section className="content-section service-intro">
        <div className="service-intro-body">
          <p className="service-intro-lead">{service.intro}</p>
          <div className="service-intro-aside">
            <p className="eyebrow">Best for</p>
            <p>{service.bestFor}</p>
          </div>
        </div>
        <ul className="service-scope">
          {service.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <ApproachSection service={service} />

      <section className="content-section service-estimate" id="estimate">
        <p className="eyebrow">Build your estimate</p>
        <h2>
          Three questions. <span>Your rough range, free.</span>
        </h2>
        <p className="service-estimate-lede">
          Pick a starting point, tell us where you are and what has to happen. We&apos;ll show the range
          those answers land on — then build a free demo landing page from the same brief.
        </p>
        <EstimateFunnel service={service} />
        <p className="service-entry-note">
          Not sure where to start? A focused first conversation is free and usually settles it faster
          than any page online.{" "}
          <Link href="/contact">Talk it through →</Link>
        </p>
      </section>

      <section className="content-section service-excluded">
        <div>
          <p className="eyebrow">Not included</p>
          <h2>
            What sits <span>outside the estimate.</span>
          </h2>
          <p className="service-excluded-copy">
            Being clear about this early avoids surprises later. These are quoted separately, or you
            can arrange them with the right supplier.
          </p>
        </div>
        <ul>
          {service.notIncluded.map((item) => (
            <li key={item}>
              <Minus size={15} strokeWidth={2.5} aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="content-section service-others">
        <p className="eyebrow">Other capabilities</p>
        <h2>
          Often booked <span>alongside this.</span>
        </h2>
        <div className="service-others-grid">
          {others.map((candidate) => (
            <Link key={candidate.slug} href={`/services/${candidate.slug}`}>
              <span>{candidate.number}</span>
              <h3>{candidate.name}</h3>
              <p>{candidate.line}</p>
              <i>
                From {money(candidate.options[0].from)}
                <ArrowUpRight size={17} />
              </i>
            </Link>
          ))}
        </div>
      </section>

      <section className="content-section service-cta">
        <div>
          <p className="eyebrow">{entry.name} starts at {money(entry.from)}</p>
          <h2>
            Tell us what you&apos;re <span>actually trying to fix.</span>
          </h2>
        </div>
        <div className="service-cta-actions">
          <Link href="/work" className="button button-secondary">
            See the work <span>↗</span>
          </Link>
          <Link
            href={`/contact?service=${encodeURIComponent(service.projectType)}`}
            className="button"
          >
            Start a project <span>→</span>
          </Link>
          <p>
            <Check size={15} strokeWidth={2.5} aria-hidden="true" />
            No obligation. We&apos;ll tell you honestly if we&apos;re the right fit.
          </p>
        </div>
      </section>
    </main>
  );
}