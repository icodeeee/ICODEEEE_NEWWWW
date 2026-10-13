"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Check, Plus } from "lucide-react";
import { moneyRange, type Service } from "@/lib/services";

export function ServiceEstimator({ service }: { service: Service }) {
  const [optionId, setOptionId] = useState(service.options[1]?.id ?? service.options[0].id);
  const [addOns, setAddOns] = useState<string[]>([]);

  const option = service.options.find((o) => o.id === optionId) ?? service.options[0];
  const chosenAddOns = service.addOns.filter((a) => addOns.includes(a.id));
  const addOnTotal = chosenAddOns.reduce((sum, a) => sum + a.price, 0);

  const from = option.from + addOnTotal;
  const to = option.to + addOnTotal;

  const estimate = useMemo(
    () =>
      encodeURIComponent(
        JSON.stringify({
          service: service.name,
          option: option.name,
          addOns: chosenAddOns.map((a) => a.name),
          range: moneyRange(from, to),
        }),
      ),
    [service.name, option.name, chosenAddOns, from, to],
  );

  const toggleAddOn = (id: string) =>
    setAddOns((current) => (current.includes(id) ? current.filter((value) => value !== id) : [...current, id]));

  const contactHref = `/contact?service=${encodeURIComponent(service.projectType)}&estimate=${estimate}`;

  return (
    <div className="estimator">
      <div className="estimator-options" role="radiogroup" aria-label={`${service.name} options`}>
        {service.options.map((candidate) => {
          const active = candidate.id === option.id;
          return (
            <button
              key={candidate.id}
              type="button"
              role="radio"
              aria-checked={active}
              className={`estimator-option ${active ? "is-active" : ""}`}
              onClick={() => setOptionId(candidate.id)}
            >
              <span className="estimator-option-head">
                <b>{candidate.name}</b>
                <i>{moneyRange(candidate.from, candidate.to)}</i>
              </span>
              <span className="estimator-option-pitch">{candidate.pitch}</span>
              <span className="estimator-option-meta">{candidate.timeline}</span>
            </button>
          );
        })}
      </div>

      <div className="estimator-detail" key={option.id}>
        <h3>What&apos;s included</h3>
        <ul>
          {option.includes.map((item) => (
            <li key={item}>
              <Check size={15} strokeWidth={2.5} aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="estimator-addons">
        <h3>Add anything you already know you need</h3>
        <div className="estimator-addon-list">
          {service.addOns.map((addOn) => {
            const active = addOns.includes(addOn.id);
            return (
              <label key={addOn.id} className={`estimator-addon ${active ? "is-active" : ""}`}>
                <input
                  type="checkbox"
                  checked={active}
                  onChange={() => toggleAddOn(addOn.id)}
                  className="estimator-addon-input"
                />
                <span className="estimator-addon-mark" aria-hidden="true">
                  {active ? <Check size={14} strokeWidth={3} /> : <Plus size={14} strokeWidth={2.5} />}
                </span>
                <span className="estimator-addon-text">
                  <b>{addOn.name}</b>
                  <span>{addOn.note}</span>
                </span>
                <span className="estimator-addon-price">+{moneyRange(addOn.price, addOn.price).replace("₹", "₹")}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="estimator-total">
        <div>
          <p className="estimator-total-label">Indicative estimate</p>
          <p className="estimator-total-value">{moneyRange(from, to)}</p>
          <p className="estimator-total-note">
            {option.name}
            {chosenAddOns.length > 0 && ` + ${chosenAddOns.map((a) => a.name).join(", ")}`}
          </p>
        </div>
        <Link href={contactHref} className="button estimator-cta">
          Send me this estimate <span>→</span>
        </Link>
      </div>

      <p className="estimator-disclaimer">
        This is a starting range, not a quote. Final scope and pricing depend on your specific content,
        integrations and timeline — we&apos;ll confirm both in a first conversation.
      </p>
    </div>
  );
}