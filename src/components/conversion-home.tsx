"use client";

import { motion, MotionConfig, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type ReactNode } from "react";
import { ArrowDown, ArrowUpRight, Plus, Pause, Play, Asterisk } from "lucide-react";
import type { Project } from "@/lib/types";
import { services } from "@/lib/services";
import { ProjectCollection } from "@/components/project-showcase";

const ease = [.22, 1, .36, 1] as const;
const steps = [
  ["Discover", "First, the right questions.", "We get close to your business, your audience and the opportunity. Good work starts with a shared understanding."],
  ["Strategize", "Give the idea a direction.", "A clear scope, a sharper message and a practical roadmap. Every decision has a reason behind it."],
  ["Design", "Make every detail matter.", "From the first wireframe to the last interaction, we shape an experience that feels unmistakably yours."],
  ["Build", "Bring the vision to life.", "Thoughtful development, responsive layouts and careful testing turn the design into something people can use."],
  ["Evolve", "Launch is the beginning.", "A considered handover, ongoing support and room to grow. Your next chapter has a solid foundation."],
];
const faqs = [
  ["Can we start with just one service?", "Absolutely. Start with a website, your brand, a store or your content. We’ll connect the right capabilities around what your business actually needs."],
  ["Can you redesign an existing website?", "Yes. We review what works, what gets in the way and what needs to change, then build a clear plan for the next version."],
  ["How long does a project take?", "The timeline depends on scope and content readiness. After our first conversation, you’ll receive a practical plan with milestones and a realistic launch window."],
  ["Do you handle ecommerce and content?", "Yes. Storefronts, product catalogs, checkout and integrations can be planned alongside your messaging, content strategy and design."],
  ["What happens after launch?", "We plan a clear handover and discuss the support you need, from updates and new features to ongoing content and design."],
];

function Reveal({ children, className = "", direction = "up", delay = 0, calm }: { children: ReactNode; className?: string; direction?: "up" | "left" | "right"; delay?: number; calm: boolean }) {
  // Pre-reveal opacity floors at 0.4 rather than 0.2: content that has not yet
  // scrolled into view stays legible (and keeps a passing contrast ratio) instead
  // of being washed out for anyone reading before the animation triggers.
  return <motion.div className={className} initial={false} animate="hidden" whileInView="visible" viewport={{ amount: .12 }} variants={{ visible: { opacity: 1, x: 0, y: 0 }, hidden: { opacity: calm ? 1 : .4, x: calm ? 0 : direction === "left" ? -50 : direction === "right" ? 50 : 0, y: calm || direction !== "up" ? 0 : 40 } }} transition={{ duration: calm ? 0 : .8, ease, delay }}>{children}</motion.div>;
}

function ProcessScene({ calm }: { calm: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotation = useTransform(scrollYProgress, [0, 1], [-60, 210]);
  return <section ref={ref} className="film-process film-section" id="process">
    <div className="process-anchor"><p className="film-label">04 / FROM FIRST SPARK TO WHAT’S NEXT</p><h2>A clear path.<br /><em>Extra care.</em></h2><p className="film-copy">You always know where we are.<br />And where we’re going next.</p><motion.div className="process-orbit" style={{ rotate: calm ? 0 : rotation }} aria-hidden="true"><Asterisk strokeWidth={.8} /></motion.div><Link className="film-text-link" href="/process">Inside our process <ArrowUpRight size={18} /></Link></div>
    <div className="process-chapters">{steps.map(([title, subtitle, copy], i) => <Reveal key={title} calm={calm} direction={i % 2 ? "right" : "left"}><article><span className="chapter-number">0{i + 1}</span><p className="film-label">{title}</p><h3>{subtitle}</h3><p className="film-copy">{copy}</p><span className="chapter-line" /></article></Reveal>)}</div>
  </section>;
}

export function ConversionHome({ projects }: { projects: Project[] }) {
  const prefersReduced = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const calm = !!prefersReduced || paused;
  const hero = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const { scrollYProgress: heroProgress } = useScroll({ target: hero, offset: ["start start", "end start"] });
  const titleY = useTransform(heroProgress, [0, 1], [0, 110]);
  const artY = useTransform(heroProgress, [0, 1], [0, -100]);
  const artRotate = useTransform(heroProgress, [0, 1], [-8, 12]);
  const marqueeX = useTransform(scrollYProgress, [0, 1], [0, -650]);

  return <MotionConfig reducedMotion={calm ? "always" : "never"}><main id="main" className={`film-home ${calm ? "film-calm" : ""}`}>
    <motion.div className="film-progress" style={{ scaleX: progress }} aria-hidden="true" />
    <div className="film-controls">{/* When the OS requests reduced motion, motion is already governed by the
        system — showing a permanently disabled toggle is a dead control, so it is
        omitted entirely. The accessible name is the visible text; adding a
        separate aria-label made the two disagree. */}
      {!prefersReduced && <button onClick={() => setPaused(!paused)} aria-pressed={calm}>{calm ? <Play size={13} /> : <Pause size={13} />}<span>{calm ? "Motion off" : "Motion on"}</span></button>}
      <a href="#main" className="film-top-link">↑<span className="film-sr">Back to top</span></a></div>
    <section className="film-hero film-grid" ref={hero}>
      <div className="film-hero-top"><p className="film-label"><span className="status-dot" /> INDEPENDENT DIGITAL STUDIO</p><span className="film-label hero-edition">STRATEGY × DESIGN × DEVELOPMENT</span></div>
      <motion.div className="film-hero-copy" style={{ y: calm ? 0 : titleY }}>
        <h1><span className="title-mask"><span>GOOD IS</span></span><span className="title-mask"><span>EXPECTED.</span></span><span className="title-mask"><span className="crimson">EXTRA IS US.</span></span></h1>
        <div className="film-hero-bottom"><p>We turn ambitious businesses into<br className="desktop-break" /> brands and digital experiences<br className="desktop-break" /> people remember.</p><Link href="/contact" className="film-button">Let’s build something <ArrowUpRight size={19} /></Link></div>
      </motion.div>
      <motion.div className="hero-project-collage" style={{ y: calm ? 0 : artY, rotate: calm ? -8 : artRotate }}>
        <span className="collage-note">A FEW THINGS WE’VE PUT INTO THE WORLD ↙</span>
        <a href="https://rupaliconstruction.com" target="_blank" rel="noreferrer" className="collage-project collage-rupali"><Image src="/work/rupali-villa.jpg" alt="Duplex villa from Rupali Construction’s portfolio" fill sizes="(max-width: 760px) 55vw, 24vw" /><span>RUPALI CONSTRUCTION <ArrowUpRight size={15} /></span></a>
        <a href="https://www.slugsera.com" target="_blank" rel="noreferrer" className="collage-project collage-slugsera"><Image src="/work/slugsera-campaign.webp" alt="Slugsera’s red campaign with a model wearing its graphic T-shirt" fill priority sizes="(max-width: 760px) 65vw, 30vw" /><span>SLUGSERA® <ArrowUpRight size={16} /></span><b>Made to<br /><i>move.</i></b></a>
        <Link href="/services/graphic-design" className="collage-polaroid"><div><Image src="/work/tracksuit-model.webp" alt="House of Walia tracksuit design" fill sizes="(max-width: 760px) 25vw, 12vw" /></div><span>THE DETAILS MATTER ↗</span></Link>
        <span className="collage-seal" aria-hidden="true"><Asterisk /> EXTRA BY DESIGN</span>
      </motion.div>
      <div className="film-hero-foot"><a href="#selected-work">SCROLL TO DISCOVER <ArrowDown size={16} /></a><span>BUILT WITH INTENT. DOWN TO THE LAST PIXEL.</span><span>01 — 08</span></div>
    </section>
    <div className="film-marquee" aria-hidden="true"><motion.div style={{ x: calm ? 0 : marqueeX }} aria-hidden="true">{Array.from({ length: 3 }, (_, i) => <span key={i}>STRATEGY <Asterisk /> DESIGN <Asterisk /> DEVELOPMENT <Asterisk /> CONTENT <Asterisk /> ECOMMERCE <Asterisk /></span>)}</motion.div></div>
    <section className="film-intro film-section" id="studio"><Reveal calm={calm} direction="left"><p className="film-label">01 / YOUR NEXT CHAPTER</p><h2>Your business<br />has moved on.<br /><em>Let’s make it show.</em></h2></Reveal><div className="intro-right"><Reveal calm={calm} direction="right"><p className="film-copy intro-lead">A new beginning. A better version.<br />A bigger ambition.</p><p className="film-copy">Wherever you are now, we bring strategy, design and development together to make your next move count.</p></Reveal><div className="film-needs">{[["Launch", "Start with a strong foundation."], ["Rebuild", "Make your presence match your potential."], ["Grow", "Create room for what comes next."]].map(([name, text], i) => <Reveal key={name} calm={calm} delay={i * .06}><Link href="/contact"><span>0{i + 1}</span><div><h3>{name}</h3><p>{text}</p></div><ArrowUpRight size={22} /></Link></Reveal>)}</div></div></section>
    <section className="film-services film-section dark-scene" id="capabilities"><Reveal calm={calm}><div className="film-section-heading"><div><p className="film-label">02 / CAPABILITIES, CONNECTED</p><h2>Different skills.<br /><em>Same obsession.</em></h2></div><p className="film-copy">Five ways to move you forward.<br />One studio to bring it all together.</p></div></Reveal><div className="film-service-list">{services.map((service, i) => <Reveal key={service.slug} calm={calm} direction={i % 2 ? "right" : "left"}><Link href={`/services/${service.slug}`} className="film-service"><span className="film-label">{service.number}</span><h3>{service.name}</h3><p>{service.line}</p><span className="service-arrow"><ArrowUpRight /></span></Link></Reveal>)}</div><Link href="/services" className="film-text-link">Explore our capabilities <ArrowUpRight size={18} /></Link></section>
    <section className="film-work film-section" id="selected-work"><Reveal calm={calm}><div className="film-section-heading"><div><p className="film-label">03 / REAL BRANDS. REAL WORLDS.</p><h2>Less telling.<br /><em>More showing.</em></h2></div><Link href="/work" className="film-text-link">All selected work <ArrowUpRight size={18} /></Link></div></Reveal><ProjectCollection projects={projects.slice(0, 3)} /><Reveal calm={calm} className="craft-band"><div className="craft-image"><Image src="/work/tracksuit-overview.webp" alt="House of Walia apparel design showing the complete tracksuit concept" fill sizes="(max-width: 760px) 100vw, 35vw" /></div><div><p className="film-label">BEYOND THE SCREEN / GRAPHIC DESIGN</p><h3>A brand should feel<br />like itself. <em>Everywhere.</em></h3><p className="film-copy">Identity, apparel, packaging and the details that bring your world together.</p><Link href="/services/graphic-design" className="film-text-link">Explore graphic design <ArrowUpRight size={18} /></Link></div></Reveal></section>
    <section className="studio-contact-sheet film-section dark-scene"><div className="film-section-heading"><div><p className="film-label">A CLOSER LOOK / THE FIRST PAGE OF EACH SITE</p><h2>Different worlds.<br /><em>Same eye for detail.</em></h2></div><p className="film-copy">No mockups.<br />This is where each one opens.</p></div><div className="contact-sheet-images">{[
      {src:"/work/slugsera-home.jpg",alt:"The Slugsera homepage hero",label:"01 / SLUGSERA — HOMEPAGE",href:"/work/slugsera"},
      {src:"/work/rupali-home.jpg",alt:"The Rupali Construction homepage hero",label:"02 / RUPALI — HOMEPAGE",href:"/work/rupali-construction"},
      {src:"/work/aw-home.jpg",alt:"The Awaesthetic Wear homepage hero",label:"03 / AESTHETIC WEAR — HOMEPAGE",href:"/work/aesthetic-wear"},
    ].map((item,i)=><Reveal key={item.src} calm={calm} direction={i%2?"right":"left"} delay={i*.08}><Link href={item.href}><div className="contact-sheet-image"><Image src={item.src} alt={item.alt} fill sizes="(max-width: 760px) 85vw, 30vw" /></div><span>{item.label}<ArrowUpRight size={15}/></span></Link></Reveal>)}</div><p className="contact-sheet-foot">LIVE HOMEPAGES, CAPTURED AS THEY OPEN. EVERY BRAND HAS ITS OWN WORLD.</p></section>
    <ProcessScene calm={calm} />
    <section className="film-belief film-section dark-scene"><p className="film-label">05 / THE ICODEEE DIFFERENCE</p><Reveal calm={calm} direction="left"><h2>EXTRA ISN’T</h2></Reveal><Reveal calm={calm} direction="right"><h2 className="belief-outline">DECORATION.</h2></Reveal><div className="belief-bottom"><Asterisk className="belief-star" aria-hidden="true" /><p>It’s the question we ask twice.<br />The detail we refuse to skip.<br /><em>The care you can feel.</em></p><Link href="/about" className="film-button film-button-light">Meet the studio <ArrowUpRight size={18} /></Link></div></section>
    <section className="film-experience film-section"><Reveal calm={calm}><p className="film-label">06 / GREAT WORK. A BETTER WAY TO GET THERE.</p><h2>Good to look at.<br /><em>Great to work with.</em></h2></Reveal><div className="film-values">{[["Clarity, always.", "A defined scope, practical milestones and a clear view of what comes next."], ["Direct by design.", "You work with the people doing the thinking and making the work. Less distance. Better decisions."], ["Beyond the launch.", "Thoughtful handover and support that helps your business keep moving forward."]].map(([title, text], i) => <Reveal key={title} calm={calm} delay={i * .08}><article><span className="value-symbol" aria-hidden="true">{["↗", "◎", "+"][i]}</span><p className="film-label">0{i + 1}</p><h3>{title}</h3><p className="film-copy">{text}</p></article></Reveal>)}</div></section>
    <section className="film-faq film-section"><Reveal calm={calm} direction="left"><p className="film-label">07 / BEFORE WE BEGIN</p><h2>Good questions.<br /><em>Straight answers.</em></h2><Link href="/contact" className="film-text-link">Something else on your mind? <ArrowUpRight size={18} /></Link></Reveal><div className="film-faq-list">{faqs.map(([question, answer], i) => <details key={question} name="studio-faq"><summary><span className="faq-number">0{i + 1}</span>{question}<Plus size={20} /></summary><p>{answer}</p></details>)}</div></section>
    <section className="film-cta film-section film-grid"><p className="film-label">08 / THIS COULD BE THE START OF SOMETHING.</p><Reveal calm={calm} direction="left"><h2>READY FOR THE<br /><em>NEXT VERSION?</em></h2></Reveal><div className="cta-bottom"><div><p className="film-copy">Tell us where you are.<br />Let’s talk about where you could go.</p><Link href="/contact" className="film-button">Discuss your project <ArrowUpRight size={19} /></Link><p className="cta-note">A conversation first. A clear plan next.</p></div><Link className="cta-round" href="/contact" aria-label="Start a project"><ArrowUpRight strokeWidth={1} /></Link></div></section>
  </main></MotionConfig>;
}
