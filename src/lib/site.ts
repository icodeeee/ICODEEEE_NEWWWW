import type { Project } from "@/lib/types";

export const navItems = [
  ["Work", "/work"],
  ["Services", "/services"],
  ["Process", "/process"],
  ["About", "/about"],
  ["Resources", "/resources"],
] as const;

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
