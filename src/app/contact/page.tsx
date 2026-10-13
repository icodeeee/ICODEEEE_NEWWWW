import { pageMetadata } from "@/lib/metadata";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { contact, hasPhone, hasWhatsApp, phoneHref, whatsappHref } from "@/lib/site";

export const metadata = pageMetadata({ title: "Let’s Talk", description: "Tell iCodeee what you’re building.", path: "/contact" });

function read(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export default async function Contact({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const projectType = read(params.service);
  const rawEstimate = read(params.estimate);

  let message = "";
  if (rawEstimate) {
    try {
      const parsed = JSON.parse(decodeURIComponent(rawEstimate)) as {
        service?: string; option?: string; addOns?: string[]; range?: string;
      };
      const addOns = parsed.addOns?.length ? parsed.addOns.join(", ") : "";
      message = [
        `I'm interested in ${parsed.service ?? "a project"} — ${parsed.option ?? "not sure yet"} option.`,
        addOns && `Add-ons I'm considering: ${addOns}.`,
        parsed.range && `Indicative estimate from the site: ${parsed.range}.`,
        "",
        "What I'm trying to achieve:",
      ].filter(Boolean).join("\n");
    } catch {
      message = "";
    }
  }

  return <main id="main" className="contact-page">
    <section className="contact-intro">
      <p className="eyebrow">Start a conversation</p>
      <h1>BUILD SOMETHING<br /><span>WORTH NOTICING.</span></h1>
      <p>Give us the useful version. The goal, the challenge, and where you want it to go.</p>
      {/* Always-visible direct routes. These are the fallback if the form backend is
          unavailable, so they must not be conditional on form state. */}
      <div className="contact-direct">
        <a href={`mailto:${contact.email}`} className="contact-direct-link">
          <Mail size={17} strokeWidth={2} aria-hidden="true" />
          <span><b>Email</b>{contact.email}</span>
        </a>
        {hasPhone && <a href={phoneHref} className="contact-direct-link">
          <Phone size={17} strokeWidth={2} aria-hidden="true" />
          <span><b>Call</b>{contact.phone}</span>
        </a>}
        {hasWhatsApp && <a href={whatsappHref} target="_blank" rel="noreferrer" className="contact-direct-link">
          <MessageCircle size={17} strokeWidth={2} aria-hidden="true" />
          <span><b>WhatsApp</b>{contact.whatsapp}</span>
        </a>}
      </div>
    </section>
    <section className="contact-shell">
      {rawEstimate && <p className="contact-prefill-note">We&apos;ve carried your estimate over. Adjust anything below, or just add your brief.</p>}
      <ContactForm defaults={{ projectType, message }} />
    </section>
  </main>;
}