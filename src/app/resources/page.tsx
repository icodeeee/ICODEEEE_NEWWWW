import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
export const metadata: Metadata = {
  title: "Resources",
  description: "Ideas, notes and experiments from iCodeee.",
  // This page is an empty "coming soon" placeholder and is not in the sitemap or
  // main navigation. Keep it out of the index until real notes are published,
  // so a dead-end page cannot dilute the site's quality signals.
  robots: { index: false, follow: true },
};
export default function Resources() { return <main id="main" className="page-main"><PageHero eyebrow="Notes from the studio" title="THINGS WORTH SHARING.">Practical thinking on better brands, useful websites and the details that make a difference.</PageHero><section className="content-section"><div className="empty-state"><p className="eyebrow">In the making</p><h2>GOOD IDEAS.<br /><span>COMING SOON.</span></h2><p>Our first studio notes are on the way. In the meantime, explore our approach or tell us what you&apos;re working on.</p><Link href="/process" className="button">Explore our process <span>↗</span></Link></div></section></main>; }
