import type { ReactNode } from "react";

export type HeroMeta = { label: string; value: string };

/**
 * Shared page hero.
 *
 * `meta` and `actions` are optional so simple pages (about, process, privacy)
 * keep the original treatment, while pages that need to convert above the fold —
 * the service pages — can carry price, timeline and a direct CTA without a
 * second hero component.
 */
export function PageHero({
  eyebrow,
  title,
  children,
  meta,
  actions,
  dense,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
  meta?: HeroMeta[];
  actions?: ReactNode;
  dense?: boolean;
}) {
  const words = title.split(" ").filter(Boolean);
  // Two-word titles previously fell entirely into the accent span, flattening the
  // hierarchy. Split one word from the last so there is always a lead-in.
  const splitAt = words.length <= 2 ? 1 : 2;
  const lead = words.slice(0, -splitAt).join(" ");
  const accent = words.slice(-splitAt).join(" ");

  return (
    <section className={`page-hero ${dense ? "page-hero-dense" : ""}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h1>
        {lead && <>{lead} </>}
        <span>{accent}</span>
      </h1>
      {children && <div className="page-hero-copy">{children}</div>}
      {meta && meta.length > 0 && (
        <dl className="page-hero-meta">
          {meta.map((item) => (
            <div key={item.label}>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>
      )}
      {actions && <div className="page-hero-actions">{actions}</div>}
      <div className="hero-rule" />
    </section>
  );
}