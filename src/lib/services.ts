/**
 * Service catalogue.
 *
 * Prices are intentionally unlisted until the studio confirms its real rates.
 * A zero amount means pricing is scoped individually and must never be rendered
 * as a numeric quote.
 */

export type ServiceOption = {
  id: string;
  name: string;
  pitch: string;
  includes: string[];
  timeline: string;
  /** INR range; zero means the studio scopes this service individually. */
  from: number;
  to: number;
};

export type ServiceAddOn = {
  id: string;
  name: string;
  note: string;
  /** INR add-on price; zero means quote on request. */
  price: number;
};

export type Service = {
  number: string;
  slug: string;
  name: string;
  line: string;
  items: string[];
  /** Matches an option in the contact form's project_type select. */
  projectType: string;
  eyebrow: string;
  intro: string;
  bestFor: string;
  approach: { title: string; text: string; detail: string; deliverables: string[] }[];
  options: ServiceOption[];
  addOns: ServiceAddOn[];
  notIncluded: string[];
};

/** Formats a confirmed rupee price; zero is an unpriced, custom quote. */
export function money(value: number): string {
  if (value <= 0) return "Custom quote";
  if (value >= 100000) {
    const lakhs = value / 100000;
    return `₹${Number.isInteger(lakhs) ? lakhs : lakhs.toFixed(1)}L`;
  }
  return `₹${Math.round(value / 1000)}K`;
}

export function moneyRange(from: number, to: number): string {
  if (from <= 0 || to <= 0) return "Custom quote";
  return from === to ? money(from) : `${money(from)} – ${money(to)}`;
}

export const services: Service[] = [
  {
    number: "01",
    slug: "website-development",
    name: "Website Development",
    line: "Fast, responsive websites designed around business goals.",
    items: ["Marketing websites", "Custom web applications", "Performance & SEO"],
    projectType: "Website or web product",
    eyebrow: "Service 01 / Engineering",
    intro:
      "The easiest thing you own. Fast, mobile-first and structured so your team can update it without a developer.",
    bestFor:
      "Teams replacing a site that no longer reflects the business, or needing one that turns visitors into enquiries.",
    approach: [
      {
        title: "Structure before style",
        text: "We settle the page architecture, navigation and content hierarchy before a single visual decision. Most weak websites are structural problems wearing a design problem.",
        detail: "Before anything is designed, we map every page, what it has to achieve, and what a visitor should do next. If the structure is wrong, no amount of polish fixes it — people still cannot find anything or work out what you do. This is also where we settle what content each page needs, so design stops being guesswork.",
        deliverables: ["Sitemap with a purpose per page", "Journeys for the paths that earn money", "Content inventory and hierarchy", "Navigation model"],
      },
      {
        title: "Built for the phone first",
        text: "Most of your traffic is on a phone, on a connection that is not good. We design and test for that condition, not for a studio monitor.",
        detail: "We design and test in the condition your customers actually have: a small screen, a slow connection, one thumb. If it works there it works everywhere, and you stop paying people to retrofit desktop layouts that were never the problem.",
        deliverables: ["Mobile-first layouts", "Agreed performance budget", "Testing on real devices", "Accessible tap targets and type sizes"],
      },
      {
        title: "Handover you can actually use",
        text: "You get a CMS, documentation and training. We do not build something that only we can maintain.",
        detail: "A site you cannot update goes stale within a month. You get a CMS your team can run, written documentation, and a walkthrough — so copy can change and pages can ship without calling a developer and without breaking anything.",
        deliverables: ["CMS with editor training", "Written handover documentation", "Launch checklist and rollback plan", "30 days of post-launch support"],
      },
    ],
    options: [
      {
        id: "launch",
        name: "Launch",
        pitch: "A sharp, fast 5–8 page site for a business that needs to look credible now.",
        includes: ["Up to 8 pages", "Mobile-first responsive build", "CMS so you can edit content", "Contact / enquiry forms", "Basic on-page SEO setup", "Analytics installed"],
        timeline: "2–3 weeks",
        from: 0,
        to: 0,
      },
      {
        id: "growth",
        name: "Growth",
        pitch: "A larger site with the structure, content and integrations that support growth.",
        includes: ["Up to 20 pages", "Blog or resource centre", "Full CMS with training", "Third-party integrations", "Technical SEO & structured data", "Speed budget + Core Web Vitals work"],
        timeline: "4–6 weeks",
        from: 0,
        to: 0,
      },
      {
        id: "signature",
        name: "Signature",
        pitch: "A fully custom build with advanced functionality and a real design system.",
        includes: ["Unlimited page templates", "Custom web application features", "Headless / hybrid architecture", "Design system & component library", "Advanced SEO and migration plan", "Priority support after launch"],
        timeline: "8–12 weeks",
        from: 0,
        to: 0,
      },
    ],
    addOns: [
      { id: "copy", name: "Copywriting", note: "Words written for the pages, not filled in afterwards.", price: 0 },
      { id: "seo", name: "SEO foundation", note: "Keyword research, technical fixes and an ongoing plan.", price: 0 },
      { id: "care", name: "Care plan (6 months)", note: "Updates, monitoring, backups and small changes.", price: 0 },
    ],
    notIncluded: [
      "Domain and hosting costs",
      "Paid advertising or media spend",
      "Stock photography and licensed imagery",
      "Ongoing content production after handover",
    ],
  },
  {
    number: "02",
    slug: "ecommerce-setup",
    name: "Ecommerce Setup",
    line: "A complete storefront built to make buying simple.",
    items: ["Store setup & catalog", "Payments & checkout", "Analytics & integrations"],
    projectType: "Ecommerce store",
    eyebrow: "Service 02 / Commerce",
    intro:
      "A store that is hard to buy from does not exist. Finding, trusting and paying should all be fast and clear.",
    bestFor:
      "Fashion and lifestyle brands selling direct, and retailers moving off a marketplace.",
    approach: [
      {
        title: "Catalogue architecture first",
        text: "How products are grouped, filtered and described determines whether people can find anything. We fix this before we touch the design.",
        detail: "If someone cannot find a product in three clicks, no amount of visual design brings them back. We decide how your catalogue is grouped, which filters earn their place, and how each product is described — so people actually find what they came for.",
        deliverables: ["Category and filter model", "Product page template", "Naming and description conventions", "Variant and size structure"],
      },
      {
        title: "Checkout is the whole business",
        text: "We remove every field, step and surprise that stands between a customer and payment, then test it on a real phone.",
        detail: "Every extra field, surprise fee and forced account costs you completed orders. We strip the path to payment down to what we genuinely need, remove the friction we can, then test the whole flow repeatedly on a real phone before launch.",
        deliverables: ["Reduced-field checkout", "Payment and shipping configuration", "Mobile checkout testing", "Abandoned cart recovery"],
      },
      {
        title: "Own your customer",
        text: "Email capture, post-purchase flows and analytics that tell you what actually sells — not just what people click.",
        detail: "Selling on a marketplace means renting your customer. We set up first-party email capture, post-purchase flows and reporting that shows what genuinely sells and why — so you own the relationship and can keep it.",
        deliverables: ["Email capture and welcome flow", "Post-purchase automation", "Sales and funnel reporting", "Customer data you own"],
      },
    ],
    options: [
      {
        id: "launch",
        name: "Launch",
        pitch: "A focused storefront for a catalogue of up to 50 products.",
        includes: ["Up to 50 products", "Payments setup (India + international)", "Shipping & tax configuration", "Product photography guidance", "Checkout optimisation", "Order & inventory management setup"],
        timeline: "3–4 weeks",
        from: 0,
        to: 0,
      },
      {
        id: "growth",
        name: "Growth",
        pitch: "A store built to grow into — better discovery, retention and reporting.",
        includes: ["Up to 400 products", "Advanced filtering & search", "Email capture and flows", "Abandoned cart recovery", "Sales and funnel reporting", "Discount and bundle logic"],
        timeline: "5–8 weeks",
        from: 0,
        to: 0,
      },
      {
        id: "signature",
        name: "Signature",
        pitch: "A custom commerce experience for a brand with real scale or unusual needs.",
        includes: ["Unlimited catalogue", "Custom storefront design system", "Headless or hybrid commerce build", "ERP / 3rd-party integrations", "Multi-currency & multi-region", "Warehouse and fulfilment workflow"],
        timeline: "10–16 weeks",
        from: 0,
        to: 0,
      },
    ],
    addOns: [
      { id: "migrate", name: "Store migration", note: "Moving products, customers and order history without losing SEO.", price: 0 },
      { id: "photos", name: "Product photography direction", note: "Shoot brief, styling guide and editing direction.", price: 0 },
      { id: "care", name: "Care plan (6 months)", note: "Monitoring, updates, patches and store changes.", price: 0 },
    ],
    notIncluded: [
      "Inventory, warehousing and shipping operations",
      "Marketplace commissions and payment gateway fees",
      "Product sourcing and photography shoots",
      "Paid acquisition and ad spend",
    ],
  },
  {
    number: "03",
    slug: "ui-ux-design",
    name: "UI / UX Design",
    line: "Useful digital experiences that feel clear from the first click.",
    items: ["User journeys", "Wireframes & prototypes", "Interface design systems"],
    projectType: "UI / UX design",
    eyebrow: "Service 03 / Product design",
    intro:
      "We design the experience before the screen. Journeys and prototypes first, so the interface solves a real problem.",
    bestFor:
      "Teams building a product, and anyone whose interface confuses users or leaks conversions.",
    approach: [
      {
        title: "Understand the actual user",
        text: "We map who is using this, what they are trying to achieve and where they currently give up.",
        detail: "Most redesigns fail because they answer questions nobody asked. We map who really uses the product, what they came to do, and the exact point where they currently give up — so we fix the real obstacle instead of the most visible one.",
        deliverables: ["User and role map", "Current journey with drop-off points", "Prioritised problem list", "Success measures"],
      },
      {
        title: "Sketch the awkward parts",
        text: "The hard flows — empty states, errors, edge cases — get designed first, because they are where products are usually judged.",
        detail: "Happy paths are easy and rarely memorable. We design the parts people actually hit and remember: empty screens, errors, permissions, long names, awkward data. That is where a product feels considered — or cheap.",
        deliverables: ["Empty, loading and error states", "Edge-case and permission handling", "Content and data stress tests", "Accessible interaction patterns"],
      },
      {
        title: "Test before you build",
        text: "A prototype in front of real users is cheaper than a finished screen that does not work.",
        detail: "We build an interactive prototype and watch real people attempt the task. What they struggle with costs a week to fix in a prototype and months to fix after engineering — so the expensive mistakes happen early and cheaply.",
        deliverables: ["Clickable prototype", "Moderated usability sessions", "Findings with recommended fixes", "Tested designs for development"],
      },
    ],
    options: [
      {
        id: "sprint",
        name: "Sprint",
        pitch: "A focused diagnostic and redesign of one critical flow.",
        includes: ["User and flow mapping", "Audit of your current product", "Wireframes for one key journey", "Clickable prototype", "Usability findings and fixes", "Handoff notes for developers"],
        timeline: "1–2 weeks",
        from: 0,
        to: 0,
      },
      {
        id: "product",
        name: "Product",
        pitch: "End-to-end design for a complete product or a substantial redesign.",
        includes: ["Full journey and IA design", "High-fidelity UI for every screen", "Interactive prototype", "Usability testing sessions", "Responsive and mobile design", "Developer handoff and QA support"],
        timeline: "4–7 weeks",
        from: 0,
        to: 0,
      },
      {
        id: "system",
        name: "System",
        pitch: "A design system your team can build on without us in the room.",
        includes: ["Component library and tokens", "Patterns and usage rules", "Accessibility standards (WCAG)", "Documented responsive behaviour", "Team workshops and training", "Governance so it stays coherent"],
        timeline: "8–12 weeks",
        from: 0,
        to: 0,
      },
    ],
    addOns: [
      { id: "research", name: "User research", note: "Interviews and a usability study with real people.", price: 0 },
      { id: "audit", name: "UX audit", note: "A prioritised, evidence-backed review of your existing product.", price: 0 },
      { id: "access", name: "Accessibility remediation", note: "WCAG 2.2 AA fixes with a verification pass.", price: 0 },
    ],
    notIncluded: [
      "Development and engineering",
      "User recruitment costs for research",
      "Usability testing software subscriptions",
      "Content and copywriting",
    ],
  },
  {
    number: "04",
    slug: "content-strategy",
    name: "Content Strategy",
    line: "A sharper message and a practical plan for what to say next.",
    items: ["Brand voice & messaging", "Content planning", "Conversion copy"],
    projectType: "Content strategy",
    eyebrow: "Service 04 / Messaging",
    intro:
      "Most sites are unclear because nobody decided what to say. We define the message, then write it.",
    bestFor:
      "Businesses outgrowing their positioning, or with content that isn't working.",
    approach: [
      {
        title: "Say one thing well",
        text: "A brand that says everything says nothing. We find the one claim that matters most and build everything around it.",
        detail: "We interview your team and your customers, look at what competitors claim, and find the single claim that is both true and hard to copy. Every page, post and pitch is then built to support that one idea.",
        deliverables: ["Stakeholder interviews", "Competitive and audience review", "Positioning statement", "Messaging hierarchy"],
      },
      {
        title: "Write for the decision",
        text: "Copy should answer the question a buyer is actually asking at that point — not describe what you did on Tuesday.",
        detail: "We map the questions a buyer asks in order — what is this, is it for me, can I trust it, what does it cost, what happens next — and write to answer each one at the moment it is asked, instead of describing your process.",
        deliverables: ["Buyer question map", "Website copy by page", "Tone of voice guide", "Sales and proposal language"],
      },
      {
        title: "Plan you can sustain",
        text: "A calendar your team can realistically maintain, not a strategy deck that dies in a folder.",
        detail: "Strategy that nobody can execute is decoration. We build a publishing calendar around the capacity you actually have, with topics researched in advance and a review rhythm — so this is something that keeps running after we leave.",
        deliverables: ["Quarterly content strategy", "Publishing calendar", "Topic research and briefs", "Performance review rhythm"],
      },
    ],
    options: [
      {
        id: "foundation",
        name: "Foundation",
        pitch: "Positioning and messaging for a business that needs a clear answer to 'what do you do?'.",
        includes: ["Stakeholder interviews", "Competitive and audience review", "Positioning statement", "Messaging hierarchy", "Tone of voice guide", "Core website copy"],
        timeline: "2–3 weeks",
        from: 0,
        to: 0,
      },
      {
        id: "narrative",
        name: "Narrative",
        pitch: "A full messaging system applied across the places customers meet you.",
        includes: ["Everything in Foundation", "Brand voice and editorial principles", "Website copy across key pages", "Email and campaign templates", "Social content pillars", "Sales and proposal language"],
        timeline: "4–6 weeks",
        from: 0,
        to: 0,
      },
      {
        id: "always-on",
        name: "Always-on",
        pitch: "A retained engagement producing and publishing content every month.",
        includes: ["Quarterly strategy reset", "Monthly content production", "SEO-led topic research", "Publishing calendar", "Performance review and iteration", "Ongoing brand governance"],
        timeline: "Rolling, 3-month minimum",
        from: 0,
        to: 0,
      },
    ],
    addOns: [
      { id: "website-copy", name: "Full website copy", note: "Every page researched, written and edited to a publishable standard.", price: 0 },
      { id: "video", name: "Video scripts", note: "Scripted and storyboarded for launch and social.", price: 0 },
      { id: "sprint", name: "Messaging sprint", note: "Two focused days to get to a usable position fast.", price: 0 },
    ],
    notIncluded: [
      "Content production such as photography and video filming",
      "Paid media distribution and ad spend",
      "Technical SEO implementation",
      "Translation and localisation",
    ],
  },
  {
    number: "05",
    slug: "graphic-design",
    name: "Graphic Design",
    line: "Distinctive visual work across every place your brand appears.",
    items: ["Logos & identity", "Clothing & packaging", "Campaigns & AI mockups"],
    projectType: "Graphic design",
    eyebrow: "Service 05 / Brand & print",
    intro:
      "A brand should look like itself everywhere — screen, garment, box. We build identities that hold across formats.",
    bestFor:
      "Apparel and lifestyle brands, and anyone whose identity no longer matches their work.",
    approach: [
      {
        title: "Start from what makes you different",
        text: "We find the idea worth building a mark around — usually not the one in the original brief.",
        detail: "We spend time on what you actually do that competitors cannot, rather than accepting the first description in the brief. That honest idea is what the identity is built from, which is why the result feels specific rather than generic.",
        deliverables: ["Discovery workshop", "Positioning and differentiation", "Creative territories", "Chosen direction"],
      },
      {
        title: "Design for the hardest format",
        text: "We test identities on a garment, a packaging box and a phone before we call them finished.",
        detail: "A mark that only works on a big screen falls apart at 32 pixels, on a fold, or across a shirt. We test in the hardest real formats early, so what you approve is what actually ships and stays recognisable everywhere.",
        deliverables: ["Logo suite across formats", "Tested at small and awkward sizes", "Colour and type system", "Real-world mockups"],
      },
      {
        title: "Hand over usable files",
        text: "Organised, editable source files and real usage rules, not a folder of loose exports.",
        detail: "We hand over organised, editable source files plus the rules that keep the work coherent — what to do, what never to do, and who to ask when it is genuinely new. Otherwise identity erodes within two years of normal internal changes.",
        deliverables: ["Organised source files", "Brand guidelines that are usable", "Do and do-not rules", "Team walkthrough"],
      },
    ],
    options: [
      {
        id: "identity",
        name: "Identity",
        pitch: "A distinctive core identity for a new or early-stage brand.",
        includes: ["Logo suite and marks", "Colour and typography system", "Core brand guidelines", "Business card and stationery", "Social profile templates", "Source files and usage rules"],
        timeline: "3–4 weeks",
        from: 0,
        to: 0,
      },
      {
        id: "campaign",
        name: "Campaign",
        pitch: "A campaign system built to run across digital, print and social.",
        includes: ["Campaign concept and art direction", "Key visual system", "Social cut-downs", "Print collateral", "Email and display templates", "Rollout guidance"],
        timeline: "4–6 weeks",
        from: 0,
        to: 0,
      },
      {
        id: "brand-system",
        name: "Brand system",
        pitch: "A full identity that holds up across products, packaging and apparel.",
        includes: ["Full identity and logo suite", "Packaging design system", "Apparel and merchandise artwork", "Photography and art direction", "Brand standards manual", "Team training session"],
        timeline: "8–12 weeks",
        from: 0,
        to: 0,
      },
    ],
    addOns: [
      { id: "apparel", name: "Apparel graphics", note: "Print-ready artwork and mockups for a clothing range.", price: 0 },
      { id: "packaging", name: "Packaging artwork", note: "Dielines, print files and 3D mockups.", price: 0 },
      { id: "mockups", name: "AI mockups", note: "Fast, realistic product mockups for concepts and social.", price: 0 },
    ],
    notIncluded: [
      "Printing, fabrication and production costs",
      "Licensed fonts, stock images and third-party assets",
      "Physical product manufacture",
      "Ongoing design retainer beyond the engagement",
    ],
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}
