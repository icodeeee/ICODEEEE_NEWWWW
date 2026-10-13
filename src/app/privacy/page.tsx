import { pageMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/page-hero";
import { contact } from "@/lib/site";

export const metadata = pageMetadata({ title: "Privacy", description: "How iCodeee handles data and advertising cookies.", path: "/privacy" });

export default function Privacy() {
  return <main id="main" className="page-main"><PageHero eyebrow="Legal" title="PRIVACY, IN PLAIN WORDS.">What we collect, why we collect it, and how to opt out.</PageHero><section className="content-section legal-copy">
    <h2>What we collect</h2>
    <p>When you send us an enquiry we store the details you entered — your name, email, and anything else you chose to share — so we can reply. We do not sell your data.</p>

    <h2>Campaign attribution</h2>
    <p>If you arrive from an advertisement, we store the campaign parameters in your browser (source, medium, campaign, and click identifiers) for up to 30 days, and attach them to your enquiry. This tells us which advertising produced a conversation. It does not identify you personally.</p>

    <h2>Analytics and advertising cookies</h2>
    <p>We use the Meta Pixel and a first-party analytics tool to measure page views and enquiries. Nothing is loaded until you accept analytics cookies in the banner. If you decline, those requests are never made. You can change your choice at any time by clearing this site&apos;s local storage and reloading.</p>

    <h2>Third parties</h2>
    <p>Our hosting and database providers process data on our behalf. Live website previews on our work page load the client site inside a sandboxed frame only when you click to preview.</p>

    <h2>Contact</h2>
    <p>Questions about this page, or want your data removed? Email <a href={`mailto:${contact.email}`}>{contact.email}</a>.</p>
  </section></main>;
}