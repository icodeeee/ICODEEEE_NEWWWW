import Link from "next/link";
import { Logo } from "@/components/logo";
import { contact, navItems } from "@/lib/site";

export function Footer() {
  return <footer className="footer"><div className="footer-top"><Logo dark /><p>Extra. By design.<br /><span>Built with intent.</span></p></div><div className="footer-grid"><div><p className="eyebrow">Explore</p>{navItems.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</div><div><p className="eyebrow">Have something in mind?</p><Link href="/contact">Let’s make it happen ↗</Link><a href={`mailto:${contact.email}`}>{contact.email}</a></div><p className="footer-signoff">© {new Date().getFullYear()} iCodeee<br />Independent by design.</p></div><div className="footer-wordmark" aria-hidden="true">iCodeee<span>↗</span></div><div className="footer-bottom"><span>STRATEGY. DESIGN. DEVELOPMENT.</span><a href="#main">BACK TO TOP ↑</a></div></footer>;
}
