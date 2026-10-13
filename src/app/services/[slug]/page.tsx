import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Check, Minus } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { ServiceEstimator } from "@/components/service-estimator";
import { getService, moneyRange, services } from "@/lib/services";

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
  return {
    title: service.name,
    description: `${service.intro} Indicative ranges ${range}.`,
    alternates: { canonical: `/services/${service.slug}` },
  };
}

export default async function ServiceDetail({ params }: { params: Promise<{ slug: string }> }) {
  const service = getService((await params).slug);
  if (!service) notFound();

  const others = services.filter((candidate) => candidate.slug !== service.slug);
  const entry = service.options[0];

  return (
    <main id="main" className="page-main service-detail">
      <PageHero eyebrow={service.eyebrow} title={service.name}>
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

      <section className="content-section service-approach">
        <p className="eyebrow">How we work</p>
        <h2>
          The method behind <span>the result.</span>
        </h2>
        <div className="service-approach-grid">
          {service.approach.map((step, i) => (
            <article key={step.title}>
              <span>0{i + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section service-estimate" id="estimate">
        <p className="eyebrow">Build your estimate</p>
        <h2>
          Pick a starting point. <span>See roughly what it takes.</span>
        </h2>
        <p className="service-estimate-lede">
          Every {service.name.toLowerCase()} engagement looks different. Choose the option closest to
          what you have in mind and add anything else you already know you&apos;ll need — the estimate
          updates as you go, and comes with you into the brief.
        </p>
        <ServiceEstimator service={service} />
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
                {moneyRange(candidate.options[0].from, candidate.options[0].to)} from
                <ArrowUpRight size={17} />
              </i>
            </Link>
          ))}
        </div>
      </section>

      <section className="content-section service-cta">
        <div>
          <p className="eyebrow">{entry.name} starts at {moneyRange(entry.from, entry.to)}</p>
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