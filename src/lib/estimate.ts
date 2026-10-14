/**
 * Rough-estimate engine for the service funnel.
 *
 * Deliberately kept out of the React component so the arithmetic can be read
 * and adjusted in one place. Nothing here is a quote: the range starts from the
 * indicative pricing in `services.ts` and is nudged by three answers so the
 * number reflects something about the visitor rather than being one flat price
 * everyone sees.
 *
 * The factors below are a judgement about relative effort, not data. They are
 * as editable as the base prices — replace both when real pricing is set.
 */

import { moneyRange, type ServiceOption } from "@/lib/services";

export type EstimateQuestion = {
  id: string;
  label: string;
  options: { id: string; label: string; /** Multiplier on the base range. */ factor: number }[];
};

export const estimateQuestions: EstimateQuestion[] = [
  {
    id: "stage",
    label: "Where are you right now?",
    options: [
      { id: "new", label: "Starting fresh", factor: 1 },
      { id: "live", label: "Live, but not working", factor: 1.05 },
      { id: "grow", label: "Live and ready to grow", factor: 1.15 },
    ],
  },
  {
    id: "goal",
    label: "What has to happen?",
    options: [
      { id: "found", label: "Get found", factor: 1 },
      { id: "sell", label: "Sell online", factor: 1.12 },
      { id: "brand", label: "Look the part", factor: 1.08 },
    ],
  },
  {
    id: "timing",
    label: "How soon do you need it?",
    options: [
      { id: "asap", label: "As soon as possible", factor: 1.1 },
      { id: "soon", label: "Within 1–3 months", factor: 1 },
      { id: "looking", label: "Just looking", factor: 0.92 },
    ],
  },
];

export type Answers = Record<string, string>;

/** Rounds to the nearest 5,000 so the displayed range reads as money, not arithmetic. */
function tidy(value: number) {
  return Math.round(value / 5000) * 5000;
}

export function computeEstimate(option: ServiceOption, answers: Answers) {
  const factor = estimateQuestions.reduce((total, question) => {
    const chosen = question.options.find((option) => option.id === answers[question.id]);
    return total * (chosen?.factor ?? 1);
  }, 1);

  return {
    from: tidy(option.from * factor),
    to: tidy(option.to * factor),
    factor,
    label: moneyRange(tidy(option.from * factor), tidy(option.to * factor)),
  };
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
    `Estimate request — ${serviceName}`,
    `Package: ${option.name} (indicative ${range})`,
    ...answerLines(answers),
    "Requested a free demo landing page built from this brief.",
  ].join("\n");
}