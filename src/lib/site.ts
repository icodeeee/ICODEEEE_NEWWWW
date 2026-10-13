import type { Project } from "@/lib/types";

export const navItems = [
  ["Work", "/work"],
  ["Services", "/services"],
  ["Process", "/process"],
  ["About", "/about"],
  ["Privacy", "/privacy"],
] as const;

/**
 * Direct contact routes, shown alongside the enquiry form so a visitor always has
 * a way to reach the studio — including when the form backend is unavailable.
 *
 * Phone and WhatsApp are env-driven and render only when set, because publishing
 * an unverified number would be worse than publishing none. The email address is
 * the one already used in the footer.
 */
export const contact = {
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@icodeee.com",
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || "",
  whatsapp: process.env.NEXT_PUBLIC_CONTACT_WHATSAPP || "",
  location: process.env.NEXT_PUBLIC_CONTACT_LOCATION || "",
};

export const hasPhone = Boolean(contact.phone);
export const hasWhatsApp = Boolean(contact.whatsapp);

/** Digits-only phone number, for tel: and wa.me links. */
function dialDigits(value: string) {
  return value.replace(/[^\d+]/g, "");
}

export const phoneHref = hasPhone ? `tel:${dialDigits(contact.phone)}` : "";
export const whatsappHref = hasWhatsApp ? `https://wa.me/${dialDigits(contact.whatsapp).replace(/^\+/, "")}` : "";

export const projectFallback: Project[] = [
  {
    id: "slugsera",
    slug: "slugsera",
    name: "Slugsera",
    category: "Digital experience",
    short_description: "An ecommerce experience for an independent streetwear brand.",
    description: "Explore the Slugsera storefront, from its collections to its brand story.",
    cover_image: null,
    gallery: [], video: null, services: [], technologies: [], live_url: "https://www.slugsera.com",
    case_study_content: {}, published: true, order: 1,
  },
  {
    id: "rupali-construction",
    slug: "rupali-construction",
    name: "Rupali Construction",
    category: "Web platform",
    short_description: "A digital presence for a construction business, connecting services, projects and enquiries.",
    description: "Explore Rupali Construction’s services and portfolio on the live website.",
    cover_image: null,
    gallery: [], video: null, services: [], technologies: [], live_url: "https://rupaliconstruction.com",
    case_study_content: {}, published: true, order: 2,
  },
  {
    id: "aesthetic-wear",
    slug: "aesthetic-wear",
    name: "Awaesthetic Wear",
    category: "Ecommerce",
    short_description: "A WooCommerce storefront for a streetwear label, organised around graphic apparel.",
    description: "Awaesthetic Wear sells graphic hoodies, sweatshirts and varsity jackets for men and women. We built the storefront so the collections, sizing and checkout are easy to move through on mobile.",
    cover_image: null,
    gallery: [], video: null, services: [], technologies: [], live_url: "https://awaestheticwear.com",
    case_study_content: {}, published: true, order: 3,
  },
];
