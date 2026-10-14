"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Lock } from "lucide-react";
import type { Service } from "@/lib/services";
import { money } from "@/lib/services";
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
  { id: "result", label: "Estimate" },
];

/**
 * Gated estimate funnel.
 *
 * Replaces the old always-open estimator, which gave the full range away to
 * everyone and captured nothing. The flow now withholds the exact number until
 * the visitor has registered and answered three multiple-choice questions, so
 * the range they eventually see reflects their own answers rather than being
 * the same price for everybody.
 *
 * The estimate itself is computed in the browser — the request exists only to
 * capture the lead. A failed save therefore never blocks the visitor: they
 * still get their number, and we say plainly that we could not store their
 * details and point them at a direct email address.
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
      demo_requested: true,
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
              Three levels. Register on the next step and you&apos;ll see the range your answers land on.
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
                      <i>from {money(candidate.from)}</i>
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
              Get my free demo <ArrowRight size={16} aria-hidden="true" />
            </button>
            <p className="funnel-gate-note">
              <Lock size={12} aria-hidden="true" /> The exact range is revealed once you register.
            </p>
          </div>
        )}

        {step === "register" && (
          <div className="funnel-step">
            <h3 className="funnel-step-title">Where should we send it?</h3>
            <p className="funnel-step-sub">
              Two fields. Three quick questions next, and your indicative range.
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
              {answered} of {estimateQuestions.length} answered. These adjust the range.
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
              See my estimate <ArrowRight size={16} aria-hidden="true" />
            </button>
            <button type="button" className="funnel-back" onClick={() => setStep("register")}>
              Back
            </button>
          </div>
        )}

        {step === "result" && (
          <div className="funnel-step funnel-result">
            <h3 className="funnel-step-title">Your indicative range</h3>
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
                <Check size={14} strokeWidth={2.5} aria-hidden="true" /> Saved — this is in your inbox soon.
              </p>
            )}
            {saveState === "failed" && (
              <p className="funnel-result-status is-warn">
                We couldn&apos;t save your details just now, so this isn&apos;t held against your name. Email{" "}
                <a href="mailto:hello@icodeee.com">hello@icodeee.com</a> and we&apos;ll pick it up from there.
              </p>
            )}
            {saveState === "pending" && <p className="funnel-result-status">Saving…</p>}

            <div className="funnel-demo">
              <h4>Next: your free demo landing page</h4>
              <p>
                We&apos;ll build a one-page demo from the brief you just gave us and send it over.
                No obligation, and yours to keep whether or not we work together.
              </p>
              <Link href="/contact" className="button funnel-cta">
                Start my demo <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>

            <p className="estimator-disclaimer">
              A starting range, not a quote. Real scope and pricing depend on your content,
              integrations and timeline — we&apos;ll confirm both in a first conversation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}