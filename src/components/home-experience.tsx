"use client";

import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import type { Project } from "@/lib/types";
import { MagneticLink } from "@/components/magnetic-link";
import { services } from "@/lib/services";

const reveal = { hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0 } };

export function HomeExperience({ projects }: { projects: Project[] }) {
  const extraMeansRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: extraProgress } = useScroll({ target: extraMeansRef, offset: ["start start", "end end"] });




  const beliefRef = useRef<HTMLElement>(null);
  const { scrollYProgress: beliefProgress } = useScroll({ target: beliefRef, offset: ["start 0.8", "end end"] });
  const bOpacity = useTransform(beliefProgress, [0, 1], [0, 1]);
  const topTextY = useTransform(beliefProgress, [0, 1], [120, 0]);
  const bottomTextY = useTransform(beliefProgress, [0, 1], [160, 0]);
  const bScale = useTransform(beliefProgress, [0, 1], [0.2, 1]);

  return <main>
    <section className="home-hero scene-light">
      <div className="hero-blueprint" aria-hidden="true" />
      <div className="hero-grid-container">
        <div className="hero-content">

          <motion.h1 initial="hidden" animate="visible" variants={reveal} transition={{ duration: .8, delay: .08 }}>
            Extra is<br /><span>not more.</span><br />It&apos;s <span>better.</span>
          </motion.h1>
          <motion.p className="hero-statement" initial="hidden" animate="visible" variants={reveal} transition={{ duration: .8, delay: .16 }}>
            iCodeee builds brands, digital products<br className="hero-desktop-break" /> and AI systems without cutting the parts<br className="hero-desktop-break" /> that matter. <span>Engineered with intent.</span>
          </motion.p>
          <motion.div className="hero-actions" initial="hidden" animate="visible" variants={reveal} transition={{ duration: .8, delay: .24 }}>
            <Link href="/contact" className="btn-primary">Start a project <span>↗</span></Link>
            <Link href="/work" className="btn-text"><i aria-hidden="true">▶</i> View our work</Link>
          </motion.div>

        </div>

        <motion.div className="hero-showcase" initial={{ opacity: 0, x: 165 }} animate={{ opacity: 1, x: 120 }} transition={{ duration: 1, delay: .15, ease: [0.2, .8, .2, 1] }} aria-label="A showcase of iCodeee website, ecommerce, design and content services">
          <div className="paper-plane" aria-hidden="true">➤</div>
          <div className="showcase-stage">
            <div className="showcase-panel panel-digital">
              <small><b>K</b> iCodeee <span>≡</span></small>
              <h2>Website<br />Development</h2><p>Fast. Responsive. Scalable.</p>
              <div className="mini-browser"><i /><i /><i /><strong>Built for performance.</strong></div>
            </div>
            <div className="showcase-panel panel-ai">
              <small><b>K</b> iCodeee <span>≡</span></small>
              <h2>Ecommerce<br />Setup <em>Built<br />to Convert</em></h2><p>Everything your store needs</p>
              <div className="metric-grid"><i><b>Shop</b><span>Storefront</span></i><i><b>Pay</b><span>Checkout</span></i><i><b>Sell</b><span>Products</span></i><i><b>Grow</b><span>Analytics</span></i></div>
            </div>
            <div className="showcase-panel panel-mobile">
              <small><b>K</b> iCodeee <span>≡</span></small>
              <h2>UI / UX<br />Design</h2><p>Clear. Useful. Intuitive.</p>
              <div className="mini-browser"><i /><i /><i /><strong>Designed around people.</strong></div>
            </div>
            <div className="showcase-panel panel-brand">
              <small><b>K</b> iCodeee <span>≡</span></small>
              <h2>Content<br />Strategy</h2><p>Voice. Direction. Growth.</p>
              <div className="brand-tiles"><i /><i /><i /></div>
            </div>
            <div className="showcase-panel panel-dark">
              <small><b>K</b> iCodeee</small><h2>Graphic<br />Design</h2><p>Clothing · Packaging<br />Logos · AI mockups</p><span>Explore ↗</span>
            </div>
            <div className="showcase-folder-back" aria-hidden="true" />
            <div className="showcase-bin"><div className="bin-logo">Key 5</div></div>
          </div>
        </motion.div>
      </div>
    </section>

    <section className="legacy-home-hero" aria-hidden="true">
      <div className="hero-grid-container">
        <div className="hero-content">
          <motion.p className="eyebrow" initial="hidden" animate="visible" variants={reveal} transition={{ duration: .7 }}>
            INDEPENDENT DIGITAL STUDIO — 01 —
          </motion.p>
          <motion.h1 initial="hidden" animate="visible" variants={reveal} transition={{ duration: .8, delay: .08 }}>
            EXTRA.<br /><span>BY DESIGN.</span>
          </motion.h1>
          <motion.div className="hero-statement" initial="hidden" animate="visible" variants={reveal} transition={{ duration: .8, delay: .16 }}>
            <p>We build brands, digital products and<br /><span>AI systems</span> without cutting the parts<br />that matter.</p>
          </motion.div>
          <motion.div className="hero-actions" initial="hidden" animate="visible" variants={reveal} transition={{ duration: .8, delay: .24 }}>
            <Link href="/work" className="btn-primary">EXPLORE OUR WORK ↗</Link>
            <Link href="#showreel" className="btn-text">VIEW OUR SYSTEM <span>→</span></Link>
          </motion.div>
          <div className="scroll-cue-new">
            <span className="scroll-dot" /> SCROLL TO EXPLORE <span>↓</span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-3d-wrapper">
            <div className="hero-ic-system">
              <div className="ic-orbit-rings">
                <div className="ic-ring ring-1" />
                <div className="ic-ring ring-2" />
                <div className="ic-ring ring-3" />
              </div>

              <div className="ic-particles">
                {[...Array(25)].map((_, i) => <div key={i} className={`ic-particle p-${i+1}`} />)}
              </div>

              <div className="ic-structure-wrapper">
                <div className="cube-3d">
                  <div className="cube-face cube-front"><div className="cube-border"></div></div>
                  <div className="cube-face cube-back"><div className="cube-border"></div></div>
                  <div className="cube-face cube-right"><div className="cube-border"></div></div>
                  <div className="cube-face cube-left"><div className="cube-border"></div></div>
                  <div className="cube-face cube-top"><div className="cube-border"></div></div>
                  <div className="cube-face cube-bottom"><div className="cube-border"></div></div>
                  <div className="cube-core"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="hc-card hc-branding">
            <div className="hc-line line-branding" />
            <div className="hc-box">
              <div className="hc-icon">◇</div>
              <div>
                <b>BRANDING</b>
                <span>Identity systems that<br/>stand out and scale.</span>
              </div>
            </div>
          </div>
          
          <div className="hc-card hc-ai">
            <div className="hc-line line-ai" />
            <div className="hc-box">
              <div className="hc-icon">⚇</div>
              <div>
                <b>AI SYSTEMS</b>
                <span>Intelligent automation<br/>that works for you.</span>
              </div>
            </div>
          </div>
          
          <div className="hc-card hc-web">
            <div className="hc-line line-web" />
            <div className="hc-box">
              <div className="hc-icon">{'</>'}</div>
              <div>
                <b>WEB / PRODUCT</b>
                <span>Fast, secure and built<br/>for performance.</span>
              </div>
            </div>
          </div>
          
          <div className="hc-card hc-code">
            <div className="hc-line line-code" />
            <div className="hc-box code-box">
              <span className="code-tag">{'</>'}</span>
              <pre>{"function build() {\n  strategy();\n  design();\n  develop();\n  deploy();\n}"}</pre>
            </div>
          </div>

          <div className="hc-card hc-intent">
             <div className="hc-box">
               <b>BUILDING WITH INTENT.</b>
               <span>No templates.<br/>No shortcuts.<br/>Just precision.</span>
             </div>
          </div>
          
          <div className="hc-card hc-slider">
            <p>ICODEE SYSTEM</p>
            <div className="slider-track"><div className="slider-thumb" /></div>
          </div>
        </div>
      </div>

      <div className="hero-stats">
        <div className="stat-item">
           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
           <div className="stat-text"><b>50+</b><span>PROJECTS DELIVERED</span></div>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
           <div className="stat-text"><b>15+</b><span>INDUSTRIES SERVED</span></div>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
           <div className="stat-text"><b>100%</b><span>IN-HOUSE. ZERO OUTSOURCING.</span></div>
        </div>
      </div>
    </section>

    <section ref={beliefRef} className="belief-scene">
      <div className="belief-sticky">
        <div className="belief-bg-elements" aria-hidden="true">
          <motion.div className="b-line l1" style={{ opacity: bOpacity }} />
          <motion.div className="b-line l2" style={{ opacity: bOpacity }} />
          <motion.div className="b-line l3" style={{ opacity: bOpacity }} />
          <motion.div className="b-line l4" style={{ opacity: bOpacity }} />
          <i className="b-node n1" /><i className="b-node n2" /><i className="b-node n3" /><i className="b-node n4" />
        </div>
        <motion.h2 style={{ scale: bScale, opacity: bOpacity, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <motion.div style={{ y: topTextY }}>EXTRA IS <span>NOT MORE.</span></motion.div>
          <motion.div style={{ y: bottomTextY }}>IT&apos;S <span>BETTER.</span></motion.div>
        </motion.h2>
        <motion.p className="belief-footer" style={{ opacity: bOpacity }}>What matters is rarely<br />the obvious part.</motion.p>
      </div>
    </section>

    <section ref={extraMeansRef} className="dark-scene extra-means-scene">
      <div className="extra-means-sticky">
        <div className="extra-means-content">
          <p className="eyebrow">02 / WHAT EXTRA MEANS</p>
          <h2>Extra isn&apos;t<br /><span>decoration.</span></h2>
          <div className="extra-steps">
            <motion.div className="extra-step" style={{ opacity: useTransform(extraProgress, [0, 0.25], [1, 0.3]) }}>
              <span className="step-num">01</span>
              <p>Extra is the thinking.</p>
            </motion.div>
            <motion.div className="extra-step" style={{ opacity: useTransform(extraProgress, [0.15, 0.35, 0.65, 0.85], [0.3, 1, 1, 0.3]) }}>
              <span className="step-num">02</span>
              <p>Extra is the execution.</p>
            </motion.div>
            <motion.div className="extra-step" style={{ opacity: useTransform(extraProgress, [0.75, 0.9], [0.3, 1]) }}>
              <span className="step-num">03</span>
              <p>Extra is the detail.</p>
            </motion.div>
          </div>
        </div>
        <div className="extra-means-visual">
          <div className="extra-visual-grid" />
          <div className="extra-squares">
            <motion.div className="extra-square sq-1" style={{ y: useTransform(extraProgress, [0, 1], [60, -100]) }} />
            <motion.div className="extra-square sq-2" style={{ y: useTransform(extraProgress, [0, 1], [20, -50]) }} />
            <motion.div className="extra-square sq-3" style={{ y: useTransform(extraProgress, [0, 1], [-40, 80]) }} />
          </div>
          <div className="extra-diamond-container">
             <motion.div className="extra-diamond" style={{ scale: useTransform(extraProgress, [0, 0.5, 1], [0.8, 1.2, 0.8]) }} />
             <p className="extra-tiny-text">EVERY ELEMENT<br/>HAS A JOB.</p>
          </div>
        </div>
      </div>
    </section>

    <section id="showreel" className="dark-scene engineer-scene"><div className="scene-heading"><p className="eyebrow">02 — Engineer</p><h2>THE SYSTEM<br />BEHIND THE <span>SHINE.</span></h2><p>We don&apos;t just design what people see. We engineer what makes it work.</p></div><div className="architecture"><div className="architecture-node node-ui">Interface</div><div className="architecture-node node-api">API</div><div className="architecture-node node-db">Database</div><div className="architecture-node node-core">Core</div><span className="architecture-line l-one" /><span className="architecture-line l-two" /><span className="architecture-line l-three" /><div className="architecture-labels">{["Frontend", "Backend", "Authentication", "Payments", "Infrastructure", "Performance"].map((item) => <span key={item}>{item}</span>)}</div></div></section>

    <section className="dark-scene services-scene"><p className="eyebrow">03 — What we evolve</p>{services.map((service, index) => <motion.article key={service.name} initial={{ opacity: .35 }} whileInView={{ opacity: 1 }} viewport={{ amount: .55 }} className="service-row"><span>{service.number}</span><h2>{service.name}</h2><div><p>{service.line}</p><ul>{service.items.map((item) => <li key={item}>{item}</li>)}</ul></div><Link aria-label={`Explore ${service.name}`} href={`/services#${service.name.toLowerCase()}`}>↗</Link></motion.article>)}</section>

    <section className="dark-scene ai-scene"><div><p className="eyebrow">04 — Intelligence</p><h2>THEN WE MAKE<br />IT <span>INTELLIGENT.</span></h2><p className="ai-copy">From signal to decision to automated action: we make technology carry more of the work.</p><MagneticLink href="/services#ai" secondary>Explore AI systems</MagneticLink></div><div className="ai-network" aria-hidden="true"><div className="ai-network-grid" /><div className="ai-orbit ai-orbit-one" /><div className="ai-orbit ai-orbit-two" /><span className="ai-wire ai-wire-one" /><span className="ai-wire ai-wire-two" /><span className="ai-wire ai-wire-three" /><div className="ai-stage ai-input"><small>01</small><b>Input</b><em>Signals</em></div><div className="ai-stage ai-decision"><small>03</small><b>Decision</b><em>Context</em></div><div className="ai-stage ai-output"><small>04</small><b>Output</b><em>Action</em></div><div className="ai-core"><span>02</span><strong>AI</strong><em>iCodeee intelligence</em></div>{["node-a", "node-b", "node-c", "node-d", "node-e", "node-f", "node-g"].map((name) => <i key={name} className={`ai-node ${name}`} />)}</div></section>

    <section className="work-scene"><div className="scene-heading"><p className="eyebrow">05 — Proof</p><h2>REAL WORK.<br /><span>REAL SYSTEMS.</span></h2></div><div className="project-list">{projects.map((project, index) => <Link href={`/work/${project.slug}`} key={project.slug} className="project-row"><span>0{index + 1}</span><h3>{project.name}</h3><p>{project.category}</p><i>View case study ↗</i></Link>)}</div><MagneticLink href="/work">See all work</MagneticLink></section>

    <section className="method-scene"><p className="eyebrow">06 — Our method</p><div className="method-words"><motion.h2 whileInView={{ x: 0 }} initial={{ x: -140 }}>ENGINEER.</motion.h2><motion.h2 whileInView={{ x: 0 }} initial={{ x: 140 }}>ELEVATE.</motion.h2><motion.h2 whileInView={{ x: 0 }} initial={{ x: -140 }}><span>EVOLVE.</span></motion.h2></div><p>Build the foundation. Make the experience matter. Make it ready for what comes next.</p></section>

    <section className="final-cta"><p className="eyebrow">07 — Let&apos;s build</p><h2>BUILD SOMETHING<br /><span>WORTH NOTICING.</span></h2><p>Let&apos;s build the next version of your business.</p><MagneticLink href="/contact">Let&apos;s talk</MagneticLink></section>
  </main>;
}
