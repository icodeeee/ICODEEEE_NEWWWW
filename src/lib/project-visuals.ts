import type { Project } from "@/lib/types";

type Theme = "fashion" | "architecture" | "site";

const visuals: Record<string, { image: string; alt: string; gallery: string[]; caption: string; theme?: Theme; label?: string }> = {
  slugsera: {
    image: "/work/slugsera-home.jpg",
    alt: "The Slugsera homepage, showing the Slow Fashion hero with the Slugsera wordmark and shop calls to action",
    gallery: ["/work/slugsera-blue.webp", "/work/slugsera-green.webp", "/work/slugsera-outdoors.webp"],
    caption: "Streetwear with a point of view.",
    theme: "site",
    label: "CAMPAIGN / DIGITAL COMMERCE",
  },
  "rupali-construction": {
    image: "/work/rupali-home.jpg",
    alt: "The Rupali Construction homepage, showing the Crafting Architecture Into Reality hero",
    gallery: ["/work/rupali-interior.png", "/work/rupali-villa.jpg"],
    caption: "A stronger presence. From the ground up.",
    theme: "site",
    label: "PORTFOLIO / DIGITAL EXPERIENCE",
  },
  "aesthetic-wear": {
    image: "/work/aw-home.jpg",
    alt: "The Awaesthetic Wear homepage, showing the Layer Up. Stand Out. sweatshirt collection hero",
    gallery: ["/work/aw-gojo.jpg", "/work/aw-black-jacket.jpg", "/work/aw-pink-jacket.jpg", "/work/aw-banner-yoga.jpg"],
    caption: "Statement graphics. An everyday rotation.",
    theme: "site",
    label: "STOREFRONT / APPAREL",
  },
};

export function getProjectVisual(project: Project) {
  const visual = visuals[project.slug];
  return {
    image: project.cover_image || visual?.image,
    alt: visual?.alt || project.name,
    gallery: project.gallery.length ? project.gallery : visual?.gallery || [],
    caption: visual?.caption || project.short_description || project.name,
    theme: visual?.theme,
    label: visual?.label || project.category.toUpperCase(),
  };
}