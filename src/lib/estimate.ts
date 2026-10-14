/**
 * Rough-estimate engine for the service funnel.
 *
 * The funnel gathers useful project context without inventing prices. The
 * studio reviews the selected scope and answers to prepare a real quote.
 */

import type { ServiceOption } from "@/lib/services";

export type EstimateQuestion = {
  id: string;
  label: string;
  options: { id: string; label: string }[];
};

export const estimateQuestions: EstimateQuestion[] = [
  {
    id: "stage",
    label: "Where are you right now?",
    options: [
      { id: "new", label: "Starting fresh" },
      { id: "live", label: "Live, but not working" },
      { id: "grow", label: "Live and ready to grow" },
    ],
  },
  {
    id: "goal",
    label: "What has to happen?",
    options: [
      { id: "found", label: "Get found" },
      { id: "sell", label: "Sell online" },
      { id: "brand", label: "Look the part" },
    ],
  },
  {
    id: "timing",
    label: "How soon do you need it?",
    options: [
      { id: "asap", label: "As soon as possible" },
      { id: "soon", label: "Within 1–3 months" },
      { id: "looking", label: "Just looking" },
    ],
  },
];

export type Answers = Record<string, string>;

export function computeEstimate(_option: ServiceOption, _answers: Answers) {
  return { from: 0, to: 0, label: "Custom quote" };
}

/** The answers the visitor gave, in question order, as readable lines. */
export function answerLines(answers: Answers) {
  return estimateQuestions
    .map((question) => {
      const chosen = question.options.find((option) => option.id === answers[question.id]);
      return chosen ? `${question.label} ${chosen.label}` : null;
    })
    .filter((line): line is string => Boolean(line));
}

/**
 * The `message` stored against the lead. `leadSchema` requires at least 20
 * characters, so this is always long enough even when every answer is a
 * single short option.
 */
export function briefMessage(serviceName: string, option: ServiceOption, answers: Answers, range: string) {
  return [
    `Quote request — ${serviceName}`,
    `Requested scope: ${option.name} (${range})`,
    ...answerLines(answers),
  ].join("\n");
}
