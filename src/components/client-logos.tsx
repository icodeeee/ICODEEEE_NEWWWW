import Image from "next/image";

/**
 * Real client wordmarks, taken from each client's own site.
 *
 * These assert only what is verifiable — that the brand exists and that we
 * worked with them. No invented testimonials, counts or metrics.
 */
const clients = [
  { name: "Slugsera", src: "/work/slugsera-wordmark.webp", href: "/work/slugsera" },
  { name: "Awaesthetic Wear", src: "/work/aw-wordmark.png", href: "/work/aesthetic-wear" },
  { name: "Rupali Construction", src: "/work/rupali-logo.webp", href: "/work/rupali-construction" },
];

export function ClientLogos() {
  return <section className="client-logos" aria-label="Selected clients">
    <div className="client-logos-inner">
      <p className="client-logos-label">Selected clients</p>
      <ul>
        {clients.map((client) => <li key={client.name}>
          <a href={client.href}>
            <Image src={client.src} alt={client.name} width={160} height={54} sizes="(max-width: 760px) 30vw, 160px" />
          </a>
        </li>)}
      </ul>
    </div>
  </section>;
}