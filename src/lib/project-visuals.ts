import type { Project } from "@/lib/types";

type Theme = "fashion" | "architecture" | "site";

type ProjectEditorial = {
  eyebrow: string;
  headline: string;
  intro: string;
  overview: string;
  highlights: { title: string; detail: string }[];
  galleryLabels: string[];
};

const visuals: Record<string, { image: string; alt: string; gallery: string[]; caption: string; theme?: Theme; label?: string; editorial: ProjectEditorial }> = {
  slugsera: {
    image: "/work/slugsera-home.jpg",
    alt: "The Slugsera homepage, showing the Slow Fashion hero with the Slugsera wordmark and shop calls to action",
    gallery: ["/work/slugsera-blue.webp", "/work/slugsera-green.webp", "/work/slugsera-outdoors.webp"],
    caption: "Streetwear with a point of view.",
    theme: "site",
    label: "CAMPAIGN / DIGITAL COMMERCE",
    editorial: {
      eyebrow: "Streetwear / Digital commerce",
      headline: "Movement, not merch.",
      intro: "An independent streetwear label built around considered graphics, substantial cotton and a slower approach to fashion.",
      overview: "Slugsera’s storefront brings the brand story and the shopping journey together. Visitors can move from the campaign into tees, hoodies and printed shirts, with fit guidance and order information close at hand.",
      highlights: [
        { title: "260 GSM cotton", detail: "A weighty, structured feel is part of the brand’s product story." },
        { title: "Graphic drops", detail: "Campaign imagery gives each collection its own point of view." },
        { title: "Shop with confidence", detail: "Sizing, shipping and returns information support the path to checkout." },
      ],
      galleryLabels: ["Blue campaign / Collection", "Green campaign / Collection", "Outdoors / Lookbook"],
    },
  },
  "rupali-construction": {
    image: "/work/rupali-home.jpg",
    alt: "The Rupali Construction homepage, showing the Crafting Architecture Into Reality hero",
    gallery: ["/work/rupali-interior.png", "/work/rupali-villa.jpg"],
    caption: "A stronger presence. From the ground up.",
    theme: "site",
    label: "PORTFOLIO / DIGITAL EXPERIENCE",
    editorial: {
      eyebrow: "Construction / Digital experience",
      headline: "Crafting architecture into reality.",
      intro: "A digital home for a Gurugram construction studio, bringing its services, residential work and enquiry path into one place.",
      overview: "The website pairs a strong architectural point of view with clear routes to explore projects and get in touch. The portfolio imagery lets prospective clients see the spaces before starting a conversation.",
      highlights: [
        { title: "Project-led storytelling", detail: "Residential imagery gives the work the first word." },
        { title: "Services in context", detail: "Architecture and construction sit alongside completed spaces." },
        { title: "A clear next step", detail: "Enquiry links connect inspiration with a practical conversation." },
      ],
      galleryLabels: ["Duplex luxury villa / Residential", "Apartment at Sushant Lok / Interior"],
    },
  },
  "aesthetic-wear": {
    image: "/work/aw-home.jpg",
    alt: "The Awaesthetic Wear homepage, showing the Layer Up. Stand Out. sweatshirt collection hero",
    gallery: ["/work/aw-gojo.jpg", "/work/aw-black-jacket.jpg", "/work/aw-pink-jacket.jpg", "/work/aw-banner-yoga.jpg"],
    caption: "Statement graphics. An everyday rotation.",
    theme: "site",
    label: "STOREFRONT / APPAREL",
    editorial: {
      eyebrow: "Apparel / Ecommerce",
      headline: "Wear your world.",
      intro: "A graphic apparel storefront spanning streetwear, everyday layers and activewear for different styles and routines.",
      overview: "Awaesthetic Wear gives shoppers clear routes into hoodies, sweatshirts, tees, co-ord sets, jackets and gym wear. Product imagery and collection navigation do the heavy lifting, while size choices stay close to each item.",
      highlights: [
        { title: "Collections for every rotation", detail: "Men’s and women’s ranges sit alongside gym wear and coordinated sets." },
        { title: "Graphic-first product pages", detail: "Prints, colors and styled photography make each piece easy to scan." },
        { title: "Flexible sizing", detail: "Selected co-ord sets let shoppers choose top and lower sizes separately." },
      ],
      galleryLabels: ["Graphic hoodie / Collection", "Black jacket / Women’s edit", "Pink jacket / Women’s edit", "Yoga banner / Activewear"],
    },
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
    editorial: visual?.editorial,
    galleryLabels: visual?.editorial?.galleryLabels || [],
  };
}
