"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Lock } from "lucide-react";
import type { Service } from "@/lib/services";
import { money } from "@/lib/services";
import { contact } from "@/lib/site";
import {
  answerLines,
  briefMessage,
  computeEstimate,
  estimateQuestions,
  type Answers,
} from "@/lib/estimate";

type Step = "package" | "register" | "questions" | "result";

const STEPS: { id: Step; label: string }[] = [
  { id: "package", label: "Package" },
  { id: "register", label: "Details" },
  { id: "questions", label: "Questions" },
  { id: "result", label: "Quote request" },
];

/**
 * Quote request funnel.
 *
 * Pricing is scoped individually, so this flow captures a useful brief without
 * presenting unconfirmed prices as an estimate.
 *
 * A failed save never blocks the visitor; we say plainly that the request was
 * not stored and point them at a direct email address.
 */
export function EstimateFunnel({ service }: { service: Service }) {
  const [step, setStep] = useState<Step>("package");
  const [optionId, setOptionId] = useState(service.options[0].id);
  const [details, setDetails] = useState({ name: "", email: "", phone: "" });
  const [answers, setAnswers] = useState<Answers>({});
  const [honeypot, setHoneypot] = useState("");
  const [saveState, setSaveState] = useState<"pending" | "saved" | "failed">("pending");
  const heading = useRef<HTMLDivElement>(null);

  const option = service.options.find((o) => o.id === optionId) ?? service.options[0];
  const estimate = useMemo(() => computeEstimate(option, answers), [option, answers]);
  const answered = estimateQuestions.filter((q) => answers[q.id]).length;
  const detailsReady = details.name.trim().length >= 2 && /.+@.+\..+/.test(details.email);
  const directEmailBody = [
    `Name: ${details.name}`,
    `Email: ${details.email}`,
    details.phone && `Phone: ${details.phone}`,
    `Service: ${service.name}`,
    `Requested scope: ${option.name}`,
    ...answerLines(answers),
  ].filter((line): line is string => Boolean(line)).join("\n");
  const directEmail = `mailto:${contact.email}?subject=${encodeURIComponent(`Quote request from ${details.name || "website"}`)}&body=${encodeURIComponent(directEmailBody)}`;

  const stepIndex = STEPS.findIndex((s) => s.id === step);

  // Survive an accidental refresh mid-funnel.
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(`icodeee.estimate.${service.slug}`);
      if (!saved) return;
      const parsed = JSON.parse(saved) as { optionId?: string; details?: typeof details; answers?: Answers };
      if (parsed.optionId && service.options.some((o) => o.id === parsed.optionId)) setOptionId(parsed.optionId);
      if (parsed.details) setDetails((current) => ({ ...current, ...parsed.details }));
      if (parsed.answers) setAnswers(parsed.answers);
    } catch {
      /* corrupt or unavailable storage is not worth surfacing */
    }
  }, [service.slug, service.options]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        `icodeee.estimate.${service.slug}`,
        JSON.stringify({ optionId, details, answers }),
      );
    } catch {
      /* private mode or quota — the funnel still works without it */
    }
  }, [service.slug, optionId, details, answers]);

  // Move focus to the step heading so screen readers announce the change.
  useEffect(() => {
    heading.current?.focus();
  }, [step]);

  async function captureLead() {
    setSaveState("pending");
    const payload = {
      name: details.name,
      email: details.email,
      phone: details.phone,
      project_type: service.projectType,
      budget: estimate.label,
      message: briefMessage(service.name, option, answers, estimate.label),
      package_name: option.name,
      estimate_range: estimate.label,
      demo_requested: false,
      answers: JSON.stringify(answers),
      company_site: honeypot,
    };

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      // 201 = stored. 429 = already had their details in the last hour, which
      // is still a lead we have. Anything else means we do not have it.
      setSaveState(response.status === 201 || response.status === 429 ? "saved" : "failed");
    } catch {
      setSaveState("failed");
    }
  }

  function revealEstimate() {
    setStep("result");
    void captureLead();
  }

  return (
    <div className="funnel">
      <ol className="funnel-progress" aria-label="Progress">
        {STEPS.map((entry, index) => {
          const state = index < stepIndex ? "done" : index === stepIndex ? "current" : "todo";
          return (
            <li key={entry.id} className={`funnel-progress-step is-${state}`}>
              <span className="funnel-progress-dot" aria-hidden="true">
                {state === "done" ? <Check size={11} strokeWidth={3} /> : index + 1}
              </span>
              {entry.label}
            </li>
          );
        })}
      </ol>

      <div
        ref={heading}
        tabIndex={-1}
        className="funnel-panel"
        role="group"
        aria-live="polite"
        aria-label={`Step ${stepIndex + 1} of ${STEPS.length}: ${STEPS[stepIndex].label}`}
      >
        {step === "package" && (
          <div className="funnel-step">
            <h3 className="funnel-step-title">Pick a starting point</h3>
            <p className="funnel-step-sub">
              Choose the closest scope. We&apos;ll review your answers before preparing a quote.
            </p>
            <div className="funnel-options" role="radiogroup" aria-label={`${service.name} packages`}>
              {service.options.map((candidate) => {
                const active = candidate.id === option.id;
                return (
                  <button
                    key={candidate.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    className={`funnel-option ${active ? "is-active" : ""}`}
                    onClick={() => setOptionId(candidate.id)}
                  >
                    <span className="funnel-option-head">
                      <b>{candidate.name}</b>
                      <i>{money(candidate.from)}</i>
                    </span>
                    <span className="funnel-option-pitch">{candidate.pitch}</span>
                    <span className="funnel-option-meta">{candidate.timeline}</span>
                  </button>
                );
              })}
            </div>
            <div className="funnel-includes">
              <h4>{option.name} includes</h4>
              <ul>
                {option.includes.map((item) => (
                  <li key={item}>
                    <Check size={14} strokeWidth={2.5} aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <button type="button" className="button funnel-cta" onClick={() => setStep("register")}>
              Request a quote <ArrowRight size={16} aria-hidden="true" />
            </button>
            <p className="funnel-gate-note">
              <Lock size={12} aria-hidden="true" /> Share a few details to send us your project brief.
            </p>
          </div>
        )}

        {step === "register" && (
          <div className="funnel-step">
            <h3 className="funnel-step-title">Where should we send it?</h3>
            <p className="funnel-step-sub">
              We&apos;ll use these details to follow up about your project.
            </p>
            <form
              className="funnel-form"
              onSubmit={(event) => {
                event.preventDefault();
                if (detailsReady) setStep("questions");
              }}
            >
              <div className="funnel-field">
                <label htmlFor={`${service.slug}-name`}>Name</label>
                <input
                  id={`${service.slug}-name`}
                  name="name"
                  autoComplete="name"
                  required
                  minLength={2}
                  value={details.name}
                  onChange={(e) => setDetails({ ...details, name: e.target.value })}
                />
              </div>
              <div className="funnel-field">
                <label htmlFor={`${service.slug}-email`}>Email</label>
                <input
                  id={`${service.slug}-email`}
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={details.email}
                  onChange={(e) => setDetails({ ...details, email: e.target.value })}
                />
              </div>
              <div className="funnel-field">
                <label htmlFor={`${service.slug}-phone`}>
                  Phone <span className="funnel-optional">optional</span>
                </label>
                <input
                  id={`${service.slug}-phone`}
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={details.phone}
                  onChange={(e) => setDetails({ ...details, phone: e.target.value })}
                />
              </div>
              {/* Honeypot: hidden from people, read by bots. Empty => real visitor. */}
              <div className="funnel-honeypot" aria-hidden="true">
                <label htmlFor={`${service.slug}-company-site`}>Company site</label>
                <input
                  id={`${service.slug}-company-site`}
                  name="company_site"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>
              <button type="submit" className="button funnel-cta" disabled={!detailsReady}>
                Continue <ArrowRight size={16} aria-hidden="true" />
              </button>
              <button type="button" className="funnel-back" onClick={() => setStep("package")}>
                Back
              </button>
            </form>
          </div>
        )}

        {step === "questions" && (
          <div className="funnel-step">
            <h3 className="funnel-step-title">Three quick questions</h3>
            <p className="funnel-step-sub">
              {answered} of {estimateQuestions.length} answered. This helps us understand your scope.
            </p>
            <div className="funnel-questions">
              {estimateQuestions.map((question) => (
                <fieldset key={question.id} className="funnel-question">
                  <legend>{question.label}</legend>
                  <div className="funnel-question-options">
                    {question.options.map((candidate) => {
                      const active = answers[question.id] === candidate.id;
                      return (
                        <label key={candidate.id} className={`funnel-chip ${active ? "is-active" : ""}`}>
                          <input
                            type="radio"
                            name={question.id}
                            value={candidate.id}
                            checked={active}
                            onChange={() => setAnswers({ ...answers, [question.id]: candidate.id })}
                          />
                          <span>{candidate.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              ))}
            </div>
            <button
              type="button"
              className="button funnel-cta"
              disabled={answered < estimateQuestions.length}
              onClick={revealEstimate}
            >
              Send my quote request <ArrowRight size={16} aria-hidden="true" />
            </button>
            <button type="button" className="funnel-back" onClick={() => setStep("register")}>
              Back
            </button>
          </div>
        )}

        {step === "result" && (
          <div className="funnel-step funnel-result">
            <h3 className="funnel-step-title">Your brief is ready</h3>
            <p className="funnel-result-package">
              {option.name} · {service.name}
            </p>
            <p className="funnel-result-value">{estimate.label}</p>

            <ul className="funnel-result-answers">
              {answerLines(answers).map((line) => (
                <li key={line}>
                  <Check size={13} strokeWidth={2.5} aria-hidden="true" />
                  {line}
                </li>
              ))}
            </ul>

            {saveState === "saved" && (
              <p className="funnel-result-status is-ok">
                <Check size={14} strokeWidth={2.5} aria-hidden="true" /> Thanks — we&apos;ve received your brief and will follow up.
              </p>
            )}
            {saveState === "failed" && (
              <p className="funnel-result-status is-warn">
                We couldn&apos;t store your request. Open a prefilled email and send it so we receive your brief.{" "}
                <a href={directEmail}>Email your quote request</a>.
              </p>
            )}
            {saveState === "pending" && <p className="funnel-result-status">Saving…</p>}

            <div className="funnel-demo">
              <h4>What happens next?</h4>
              <p>
                We&apos;ll review the scope and your answers, then get in touch to discuss a tailored quote and timeline.
              </p>
              <Link href="/contact" className="button funnel-cta">
                Add more detail <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>

            <p className="estimator-disclaimer">
              Pricing depends on your requirements, content, integrations and timeline. We&apos;ll confirm
              scope and cost with you before any work begins.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
