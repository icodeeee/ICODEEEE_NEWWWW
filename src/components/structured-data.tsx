import Script from "next/script";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@icodeee.com";
const phone = process.env.NEXT_PUBLIC_CONTACT_PHONE || "";

/**
 * Structured data describing the business.
 *
 * Only verifiable facts are emitted. No aggregateRating or review data is
 * published, because none exists to publish.
 */
export function StructuredData() {
  const graph: object[] = [
    {
      "@type": "ProfessionalService",
      "@id": `${siteUrl}/#business`,
      name: "iCodeee",
      url: siteUrl,
      description:
        "Independent digital studio providing website development, ecommerce, UI/UX design, content strategy and graphic design.",
      email,
      ...(phone ? { telephone: phone } : {}),
      areaServed: "IN",
      knowsAbout: [
        "Website Development",
        "Ecommerce",
        "UI/UX Design",
        "Content Strategy",
        "Graphic Design",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "iCodeee",
      publisher: { "@id": `${siteUrl}/#business` },
      inLanguage: "en",
    },
  ];

  return <Script
    id="structured-data"
    type="application/ld+json"
    // Content is assembled from a fixed internal object, not user input.
    dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }) }}
  />;
}