"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Check, X } from "lucide-react";
import type { Service } from "@/lib/services";

const ease = [0.22, 1, 0.36, 1] as const;

export function ApproachSection({ service }: { service: Service }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [forceVisible, setForceVisible] = useState(false);
  const reduced = useReducedMotion();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const active = openIndex === null ? null : service.approach[openIndex];

  // Safety net: whileInView relies on IntersectionObserver, which does not fire
  // reliably in a backgrounded tab or when a browser throttles observers. Without
  // this, the cards would stay at opacity 0 and become genuinely unreachable.
  useEffect(() => {
    if (reduced) return;
    const id = window.setTimeout(() => setForceVisible(true), 2000);
    return () => window.clearTimeout(id);
  }, [reduced]);

  // Modal behaviour: Escape to close, focus moves in and returns, background inert.
  useEffect(() => {
    if (active === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = requestAnimationFrame(() => closeRef.current?.focus());

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenIndex(null);
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>("button, [href], a[href]");
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      triggerRef.current?.focus();
    };
  }, [active]);

  return <section className="content-section service-approach">
    <p className="eyebrow">How we work</p>
    <h2>The method behind <span>the result.</span></h2>

    <ol className="approach-list">
      {service.approach.map((step, index) => (
        <motion.li
          key={step.title}
          className="approach-item"
          variants={{ hidden: { opacity: 0, y: 34 }, visible: { opacity: 1, y: 0 } }}
          initial={reduced ? "visible" : "hidden"}
          animate={forceVisible && !reduced ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, delay: index * 0.12, ease }}
        >
          <span className="approach-index">0{index + 1}</span>
          <div className="approach-body">
            <h3>{step.title}</h3>
            <p className="approach-text">{step.text}</p>
            <button
              type="button"
              className="approach-open"
              onClick={() => setOpenIndex(index)}
              aria-haspopup="dialog"
            >
              Read more <ArrowUpRight size={15} />
            </button>
          </div>
        </motion.li>
      ))}
    </ol>

    <AnimatePresence>
      {active && (
        <motion.div
          className="approach-overlay"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduced ? undefined : { opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={() => setOpenIndex(null)}
        >
          <motion.div
            ref={dialogRef}
            className="approach-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="approach-dialog-title"
            initial={reduced ? false : { opacity: 0, y: 26, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? undefined : { opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.32, ease }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              ref={closeRef}
              type="button"
              className="approach-close"
              onClick={() => setOpenIndex(null)}
              aria-label={`Close: ${active.title}`}
            >
              <X size={18} />
            </button>
            <p className="approach-dialog-index">
              Step 0{service.approach.indexOf(active) + 1} of {service.approach.length}
            </p>
            <h3 id="approach-dialog-title">{active.title}</h3>
            <p className="approach-dialog-detail">{active.detail}</p>
            <p className="approach-dialog-sub">What this includes</p>
            <ul className="approach-deliverables">
              {active.deliverables.map((item) => (
                <li key={item}>
                  <Check size={15} strokeWidth={2.5} aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <a href="#estimate" className="button approach-dialog-cta" onClick={() => setOpenIndex(null)}>
              Price this up <ArrowUpRight size={17} />
            </a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  </section>;
}