/**
 * Service catalogue.
 *
 * Pricing below is an INDICATIVE STARTING RANGE, not a quote. It exists so a
 * visitor can self-select and arrive at a useful conversation instead of
 * guessing. Every number here is meant to be edited to match the studio's real
 * pricing — this is the only file that needs to change.
 */

export type ServiceOption = {
  id: string;
  name: string;
  pitch: string;
  includes: string[];
  timeline: string;
  /** Indicative range in INR. */
  from: number;
  to: number;
};

export type ServiceAddOn = {
  id: string;
  name: string;
  note: string;
  /** Added to both ends of the selected range, in INR. */
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
  approach: { title: string; text: string }[];
  options: ServiceOption[];
  addOns: ServiceAddOn[];
  notIncluded: string[];
};

/** Formats a rupee amount the way the site talks about money: ₹60K / ₹1.2L. */
export function money(value: number): string {
  if (value >= 100000) {
    const lakhs = value / 100000;
    return `₹${Number.isInteger(lakhs) ? lakhs : lakhs.toFixed(1)}L`;
  }
  return `₹${Math.round(value / 1000)}K`;
}

export function moneyRange(from: number, to: number): string {
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
      "A website should be the easiest thing you own. We build fast, accessible, genuinely mobile-first sites — structured so search engines understand them and so your team can change them without calling a developer.",
    bestFor:
      "Founders and teams who need a credible online presence, are replacing something that no longer reflects the business, or need a site that converts enquiries rather than just existing.",
    approach: [
      { title: "Structure before style", text: "We settle the page architecture, navigation and content hierarchy before a single visual decision. Most weak websites are structural problems wearing a design problem." },
      { title: "Built for the phone first", text: "Most of your traffic is on a phone, on a connection that is not good. We design and test for that condition, not for a studio monitor." },
      { title: "Handover you can actually use", text: "You get a CMS, documentation and training. We do not build something that only we can maintain." },
    ],
    options: [
      {
        id: "launch",
        name: "Launch",
        pitch: "A sharp, fast 5–8 page site for a business that needs to look credible now.",
        includes: ["Up to 8 pages", "Mobile-first responsive build", "CMS so you can edit content", "Contact / enquiry forms", "Basic on-page SEO setup", "Analytics installed"],
        timeline: "2–3 weeks",
        from: 60000,
        to: 90000,
      },
      {
        id: "growth",
        name: "Growth",
        pitch: "A larger site with the structure, content and integrations that support growth.",
        includes: ["Up to 20 pages", "Blog or resource centre", "Full CMS with training", "Third-party integrations", "Technical SEO & structured data", "Speed budget + Core Web Vitals work"],
        timeline: "4–6 weeks",
        from: 120000,
        to: 200000,
      },
      {
        id: "signature",
        name: "Signature",
        pitch: "A fully custom build with advanced functionality and a real design system.",
        includes: ["Unlimited page templates", "Custom web application features", "Headless / hybrid architecture", "Design system & component library", "Advanced SEO and migration plan", "Priority support after launch"],
        timeline: "8–12 weeks",
        from: 250000,
        to: 450000,
      },
    ],
    addOns: [
      { id: "copy", name: "Copywriting", note: "Words written for the pages, not filled in afterwards.", price: 25000 },
      { id: "seo", name: "SEO foundation", note: "Keyword research, technical fixes and an ongoing plan.", price: 40000 },
      { id: "care", name: "Care plan (6 months)", note: "Updates, monitoring, backups and small changes.", price: 30000 },
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
      "A store that is hard to buy from is a store that does not exist. We build storefronts where finding a product, trusting the brand and completing checkout are all fast, clear and reassuring — on mobile, where most of your sales will happen.",
    bestFor:
      "Fashion, lifestyle and product brands selling direct, and retailers moving off a marketplace or onto a platform they do not control.",
    approach: [
      { title: "Catalogue architecture first", text: "How products are grouped, filtered and described determines whether people can find anything. We fix this before we touch the design." },
      { title: "Checkout is the whole business", text: "We remove every field, step and surprise that stands between a customer and payment, then test it on a real phone." },
      { title: "Own your customer", text: "Email capture, post-purchase flows and analytics that tell you what actually sells — not just what people click." },
    ],
    options: [
      {
        id: "launch",
        name: "Launch",
        pitch: "A focused storefront for a catalogue of up to 50 products.",
        includes: ["Up to 50 products", "Payments setup (India + international)", "Shipping & tax configuration", "Product photography guidance", "Checkout optimisation", "Order & inventory management setup"],
        timeline: "3–4 weeks",
        from: 90000,
        to: 140000,
      },
      {
        id: "growth",
        name: "Growth",
        pitch: "A store built to grow into — better discovery, retention and reporting.",
        includes: ["Up to 400 products", "Advanced filtering & search", "Email capture and flows", "Abandoned cart recovery", "Sales and funnel reporting", "Discount and bundle logic"],
        timeline: "5–8 weeks",
        from: 180000,
        to: 300000,
      },
      {
        id: "signature",
        name: "Signature",
        pitch: "A custom commerce experience for a brand with real scale or unusual needs.",
        includes: ["Unlimited catalogue", "Custom storefront design system", "Headless or hybrid commerce build", "ERP / 3rd-party integrations", "Multi-currency & multi-region", "Warehouse and fulfilment workflow"],
        timeline: "10–16 weeks",
        from: 350000,
        to: 600000,
      },
    ],
    addOns: [
      { id: "migrate", name: "Store migration", note: "Moving products, customers and order history without losing SEO.", price: 45000 },
      { id: "photos", name: "Product photography direction", note: "Shoot brief, styling guide and editing direction.", price: 30000 },
      { id: "care", name: "Care plan (6 months)", note: "Monitoring, updates, patches and store changes.", price: 35000 },
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
      "We design the experience before we design the screen. Journeys, wireframes and prototypes first — so the interface is solving a real problem rather than decorating a wireframe of one.",
    bestFor:
      "Teams building a product, an app or a complex booking or customer flow, and anyone whose existing interface is confusing users or leaking conversions.",
    approach: [
      { title: "Understand the actual user", text: "We map who is using this, what they are trying to achieve and where they currently give up." },
      { title: "Sketch the awkward parts", text: "The hard flows — empty states, errors, edge cases — get designed first, because they are where products are usually judged." },
      { title: "Test before you build", text: "A prototype in front of real users is cheaper than a finished screen that does not work." },
    ],
    options: [
      {
        id: "sprint",
        name: "Sprint",
        pitch: "A focused diagnostic and redesign of one critical flow.",
        includes: ["User and flow mapping", "Audit of your current product", "Wireframes for one key journey", "Clickable prototype", "Usability findings and fixes", "Handoff notes for developers"],
        timeline: "1–2 weeks",
        from: 60000,
        to: 90000,
      },
      {
        id: "product",
        name: "Product",
        pitch: "End-to-end design for a complete product or a substantial redesign.",
        includes: ["Full journey and IA design", "High-fidelity UI for every screen", "Interactive prototype", "Usability testing sessions", "Responsive and mobile design", "Developer handoff and QA support"],
        timeline: "4–7 weeks",
        from: 120000,
        to: 200000,
      },
      {
        id: "system",
        name: "System",
        pitch: "A design system your team can build on without us in the room.",
        includes: ["Component library and tokens", "Patterns and usage rules", "Accessibility standards (WCAG)", "Documented responsive behaviour", "Team workshops and training", "Governance so it stays coherent"],
        timeline: "8–12 weeks",
        from: 220000,
        to: 400000,
      },
    ],
    addOns: [
      { id: "research", name: "User research", note: "Interviews and a usability study with real people.", price: 60000 },
      { id: "audit", name: "UX audit", note: "A prioritised, evidence-backed review of your existing product.", price: 35000 },
      { id: "access", name: "Accessibility remediation", note: "WCAG 2.2 AA fixes with a verification pass.", price: 50000 },
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
      "Most websites are unclear because nobody decided what they were trying to say. We define the message, the voice and the plan — then write the words that make people act.",
    bestFor:
      "Businesses that have outgrown their original positioning, are launching something new, or have plenty of content that simply isn't working.",
    approach: [
      { title: "Say one thing well", text: "A brand that says everything says nothing. We find the one claim that matters most and build everything around it." },
      { title: "Write for the decision", text: "Copy should answer the question a buyer is actually asking at that point — not describe what you did on Tuesday." },
      { title: "Plan you can sustain", text: "A calendar your team can realistically maintain, not a strategy deck that dies in a folder." },
    ],
    options: [
      {
        id: "foundation",
        name: "Foundation",
        pitch: "Positioning and messaging for a business that needs a clear answer to 'what do you do?'.",
        includes: ["Stakeholder interviews", "Competitive and audience review", "Positioning statement", "Messaging hierarchy", "Tone of voice guide", "Core website copy"],
        timeline: "2–3 weeks",
        from: 60000,
        to: 90000,
      },
      {
        id: "narrative",
        name: "Narrative",
        pitch: "A full messaging system applied across the places customers meet you.",
        includes: ["Everything in Foundation", "Brand voice and editorial principles", "Website copy across key pages", "Email and campaign templates", "Social content pillars", "Sales and proposal language"],
        timeline: "4–6 weeks",
        from: 120000,
        to: 180000,
      },
      {
        id: "always-on",
        name: "Always-on",
        pitch: "A retained engagement producing and publishing content every month.",
        includes: ["Quarterly strategy reset", "Monthly content production", "SEO-led topic research", "Publishing calendar", "Performance review and iteration", "Ongoing brand governance"],
        timeline: "Rolling, 3-month minimum",
        from: 180000,
        to: 300000,
      },
    ],
    addOns: [
      { id: "website-copy", name: "Full website copy", note: "Every page researched, written and edited to a publishable standard.", price: 55000 },
      { id: "video", name: "Video scripts", note: "Scripted and storyboarded for launch and social.", price: 40000 },
      { id: "sprint", name: "Messaging sprint", note: "Two focused days to get to a usable position fast.", price: 40000 },
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
      "A brand should look like itself everywhere — on screen, on a garment, on a box. We build identity systems that hold together across every format you actually use.",
    bestFor:
      "Apparel and lifestyle brands, businesses rebranding, and anyone whose identity no longer matches how good their work has become.",
    approach: [
      { title: "Start from what makes you different", text: "We find the idea worth building a mark around — usually not the one in the original brief." },
      { title: "Design for the hardest format", text: "We test identities on a garment, a packaging box and a phone before we call them finished." },
      { title: "Hand over usable files", text: "Organised, editable source files and real usage rules, not a folder of loose exports." },
    ],
    options: [
      {
        id: "identity",
        name: "Identity",
        pitch: "A distinctive core identity for a new or early-stage brand.",
        includes: ["Logo suite and marks", "Colour and typography system", "Core brand guidelines", "Business card and stationery", "Social profile templates", "Source files and usage rules"],
        timeline: "3–4 weeks",
        from: 80000,
        to: 150000,
      },
      {
        id: "campaign",
        name: "Campaign",
        pitch: "A campaign system built to run across digital, print and social.",
        includes: ["Campaign concept and art direction", "Key visual system", "Social cut-downs", "Print collateral", "Email and display templates", "Rollout guidance"],
        timeline: "4–6 weeks",
        from: 90000,
        to: 160000,
      },
      {
        id: "brand-system",
        name: "Brand system",
        pitch: "A full identity that holds up across products, packaging and apparel.",
        includes: ["Full identity and logo suite", "Packaging design system", "Apparel and merchandise artwork", "Photography and art direction", "Brand standards manual", "Team training session"],
        timeline: "8–12 weeks",
        from: 200000,
        to: 350000,
      },
    ],
    addOns: [
      { id: "apparel", name: "Apparel graphics", note: "Print-ready artwork and mockups for a clothing range.", price: 45000 },
      { id: "packaging", name: "Packaging artwork", note: "Dielines, print files and 3D mockups.", price: 55000 },
      { id: "mockups", name: "AI mockups", note: "Fast, realistic product mockups for concepts and social.", price: 20000 },
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