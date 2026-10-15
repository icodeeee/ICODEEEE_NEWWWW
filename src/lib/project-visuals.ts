import type { Project } from "@/lib/types";

export type Feature = {
  title: string;
  detail: string;
  image: string;
  alt: string;
};

export type Product = {
  title: string;
  detail: string;
  image: string;
  alt: string;
  url: string;
  price?: string;
};

export type ProjectSection =
  | { kind: "features"; eyebrow: string; title: string; intro: string; items: Feature[]; sourceLabel: string }
  | { kind: "products"; eyebrow: string; title: string; intro: string; items: Product[]; actionLabel: string; actionUrl: string };

export type ProjectEditorial = {
  eyebrow: string;
  headline: string;
  intro: string;
  overview: string;
  section: ProjectSection;
};

const visuals: Record<string, { image: string; alt: string; caption: string; theme: "fashion" | "architecture" | "site"; label: string; editorial: ProjectEditorial }> = {
  slugsera: {
    image: "/work/slugsera-home.jpg",
    alt: "A capture of the Slugsera storefront homepage",
    caption: "Movement, not merch.",
    theme: "fashion",
    label: "SLOW FASHION / DIGITAL COMMERCE",
    editorial: {
      eyebrow: "Streetwear / Digital commerce",
      headline: "Movement, not merch.",
      intro: "A Delhi-born streetwear label built around original graphics, relaxed fits and a slower approach to fashion.",
      overview: "The live storefront leads with the brand story, then lets the collection take over. Fit guidance, product details and order information sit alongside the shopping journey.",
      section: {
        kind: "products",
        eyebrow: "The T-shirt collection",
        title: "The Essential Five",
        intro: "Five distinct graphics, each with its own story. Browse the pieces below and open any product on Slugsera.",
        actionLabel: "Shop all oversized tees",
        actionUrl: "https://www.slugsera.com/collections/tshirts",
        items: [
          { title: "Seedhe Pahad Se", detail: "A Himalayan-region graphic and a nod to The Slow Club.", image: "/work/slugsera-product-seedhe-pahad-se.webp", alt: "Seedhe Pahad Se graphic tee from Slugsera", url: "https://www.slugsera.com/product/seedhe-pahad-se" },
          { title: "Slow Down", detail: "A forest-green tee with a gentle reminder to take it easy.", image: "/work/slugsera-product-slow-down.webp", alt: "Slow Down graphic tee from Slugsera", url: "https://www.slugsera.com/product/slow-down" },
          { title: "Savage Tortoise", detail: "A sea-turtle graphic with the line: the tortoise always finishes.", image: "/work/slugsera-product-savage-tortoise.webp", alt: "Savage Tortoise tee from Slugsera", url: "https://www.slugsera.com/product/savage-tortoise" },
          { title: "Let The Moment Play", detail: "A vinyl-inspired graphic about taking life one groove at a time.", image: "/work/slugsera-product-let-the-moment-play.jpg", alt: "Let The Moment Play graphic tee from Slugsera", url: "https://www.slugsera.com/product/let-the-moment-play" },
          { title: "Creator", detail: "A dusty-pink polo with a contrast collar and embroidered chest mark.", image: "/work/slugsera-product-creator.webp", alt: "Creator polo from Slugsera", url: "https://www.slugsera.com/product/creator" },
        ],
      },
    },
  },
  "rupali-construction": {
    image: "/work/rupali-home.jpg",
    alt: "A capture of the Rupali Construction homepage",
    caption: "Architecture and construction, brought into view.",
    theme: "architecture",
    label: "CONSTRUCTION / DIGITAL EXPERIENCE",
    editorial: {
      eyebrow: "Construction / Digital experience",
      headline: "The Rupali Advantage.",
      intro: "A digital home for a Gurugram construction studio, bringing its services, residential work and enquiry path into one place.",
      overview: "Rupali Construction’s site presents home building across Delhi NCR alongside Vastu-led architectural design, structural engineering, interiors and cost estimation.",
      section: {
        kind: "features",
        eyebrow: "Why choose us",
        title: "The Rupali Advantage",
        intro: "Explore the promises the live site puts front and centre. Select a card to see the detail.",
        sourceLabel: "Rupali Construction / Why choose us",
        items: [
          { title: "Value-Driven Pricing", detail: "No hidden costs. Complete clarity on every rupee spent. The site describes a transparent pricing model for construction projects.", image: "/work/rupali-advantage-pricing.webp", alt: "Rupali Construction value-driven pricing feature" },
          { title: "Stage-wise Payments", detail: "Pay as construction progresses with milestone-based payments that keep each stage visible.", image: "/work/rupali-advantage-payments.webp", alt: "Rupali Construction stage-wise payments feature" },
          { title: "Quality Checks", detail: "The company describes multiple inspections at each milestone to check structural quality.", image: "/work/rupali-advantage-quality.webp", alt: "Rupali Construction quality checks feature" },
          { title: "Live Tracking", detail: "Track a project in real time with daily photo updates, material logs and progress reports on your device.", image: "/work/rupali-advantage-tracking.webp", alt: "Rupali Construction live project tracking feature" },
          { title: "Expert Team", detail: "The website highlights a construction team with combined experience across the NCR region.", image: "/work/rupali-advantage-team.webp", alt: "Rupali Construction expert team feature" },
        ],
      },
    },
  },
  "aesthetic-wear": {
    image: "/work/aw-home.jpg",
    alt: "A capture of the Awaesthetic Wear storefront homepage",
    caption: "Graphic apparel for every rotation.",
    theme: "fashion",
    label: "APPAREL / ECOMMERCE",
    editorial: {
      eyebrow: "Apparel / Ecommerce",
      headline: "The new hoodie drop.",
      intro: "A graphic-first apparel storefront spanning hoodies, sweatshirts, co-ord sets, jackets and activewear.",
      overview: "The live shop makes its product catalogue the experience: browse a collection, scan the print and color, then choose the available options on the product page.",
      section: {
        kind: "products",
        eyebrow: "Men / Hoodies",
        title: "The new hoodie drop.",
        intro: "A look at four designs from the hoodie collection. Open a card to see current availability and pricing on Awaesthetic Wear.",
        actionLabel: "Shop all hoodies",
        actionUrl: "https://awaestheticwear.com/product-category/men/hoodies/",
        items: [
          { title: "Bunny Hoodie", detail: "A graphic hoodie from the new collection.", image: "/work/aw-product-bunny-hoodie.jpg", alt: "Bunny Hoodie from Awaesthetic Wear", url: "https://awaestheticwear.com/product/bunny-mens-hoodie/", price: "₹1,599" },
          { title: "Dragon Tiger Hoodie", detail: "A bold illustrated back print from the new drop.", image: "/work/aw-product-dragon-tiger-hoodie.jpg", alt: "Dragon Tiger Hoodie from Awaesthetic Wear", url: "https://awaestheticwear.com/product/dragon-tiger-mens-hoodie/", price: "₹1,599" },
          { title: "Fire Hoodie", detail: "A graphic pullover in the current hoodie range.", image: "/work/aw-product-fire-hoodie.jpg", alt: "Fire Hoodie from Awaesthetic Wear", url: "https://awaestheticwear.com/product/fire-mens-hoodie/", price: "₹1,599" },
          { title: "Love Hoodie", detail: "A statement graphic from the latest collection.", image: "/work/aw-product-love-hoodie.jpg", alt: "Love Hoodie from Awaesthetic Wear", url: "https://awaestheticwear.com/product/love-mens-hoodie/", price: "₹1,599" },
        ],
      },
    },
  },
};

export function getProjectVisual(project: Project) {
  const visual = visuals[project.slug];
  return {
    image: project.cover_image || visual?.image,
    alt: visual?.alt || project.name,
    caption: visual?.caption || project.short_description || project.name,
    theme: visual?.theme,
    label: visual?.label || project.category.toUpperCase(),
    editorial: visual?.editorial,
  };
}
