/**
 * Checks the funnel's arithmetic and the stored lead payload.
 *
 * Run with:  npx tsx scripts/check-estimate.ts
 *
 * Not a replacement for trying the flow in a browser — it covers the parts that
 * would be wrong in a way that is easy to miss by eye: whether every question
 * actually moves the number, whether rounding produces a sensible range, and
 * whether the stored message clears the 20-character minimum in leadSchema.
 */

import { computeEstimate, estimateQuestions, briefMessage, answerLines, type Answers } from "../src/lib/estimate";
import { services } from "../src/lib/services";

/** "Live and ready to grow / Sell online / As soon as possible" */
function labelOf(answers: Answers) {
  return estimateQuestions
    .map((q) => q.options.find((o) => o.id === answers[q.id])?.label)
    .join(" / ");
}

let failures = 0;
const check = (label: string, condition: boolean, detail = "") => {
  if (!condition) failures += 1;
  console.log(`  ${condition ? "pass" : "FAIL"}  ${label}${detail ? `  ${detail}` : ""}`);
};

const service = services.find((s) => s.slug === "ecommerce-setup")!;
const base = service.options[0];
const answersFor = (picks: Record<string, number>) =>
  Object.fromEntries(estimateQuestions.map((q, i) => [q.id, q.options[picks[i] ?? 0].id]));

console.log("\nEvery question must actually move the range");
for (const question of estimateQuestions) {
  const low = { ...answersFor({}), [question.id]: question.options[0].id };
  const high = { ...answersFor({}), [question.id]: question.options[question.options.length - 1].id };
  const a = computeEstimate(base, low).label;
  const b = computeEstimate(base, high).label;
  check(`${question.id}: "${question.options[0].label}" vs "${question.options.at(-1)!.label}"`, a !== b, `${a} vs ${b}`);
}

console.log("\nWidest possible spread across every answer combination");
const combinations = estimateQuestions.reduce<Answers[]>(
  (acc, q) => acc.flatMap((partial) => q.options.map((o) => ({ ...partial, [q.id]: o.id }))),
  [{} as Answers],
);
const results = combinations.map((c) => ({ c, e: computeEstimate(base, c) }));
const cheapest = results.reduce((a, b) => (b.e.from < a.e.from ? b : a));
const dearest = results.reduce((a, b) => (b.e.from > a.e.from ? b : a));
console.log(`  ${combinations.length} combinations`);
console.log(`  cheapest ${cheapest.e.label}  (${labelOf(cheapest.c)})`);
console.log(`  dearest  ${dearest.e.label}  (${labelOf(dearest.c)})`);
check("every combination keeps from <= to", results.every((r) => r.e.from <= r.e.to));
check("spread is wide enough to feel personalised", dearest.e.from / cheapest.e.from > 1.3,
  `${(dearest.e.from / cheapest.e.from).toFixed(2)}x`);

console.log("\nMissing answers must not break it");
const partial = computeEstimate(base, { stage: "grow" });
check("partial answers fall back to factor 1 for the rest", partial.factor === 1.15, `factor ${partial.factor}`);
const empty = computeEstimate(base, {});
check("no answers = untouched base price", empty.from === base.from && empty.to === base.to);

console.log("\nRounding lands on clean numbers");
const messy = computeEstimate(base, { stage: "live", goal: "sell", timing: "asap" });
check("both ends divisible by 5000", messy.from % 5000 === 0 && messy.to % 5000 === 0, `${messy.from}–${messy.to}`);

console.log("\nStored lead payload");
const answers = answersFor({ 0: 2, 1: 1, 2: 0 });
const lines = answerLines(answers);
const message = briefMessage(service.name, base, answers, messy.label);
check("one line per question", lines.length === estimateQuestions.length, `${lines.length}`);
check("message clears leadSchema 20-char minimum", message.length >= 20, `${message.length} chars`);
// The stored message holds option labels, so assert on those rather than ids.
check("message carries all three answers", estimateQuestions.every((q) => {
  const label = q.options.find((o) => o.id === answers[q.id])!.label;
  return message.includes(label);
}));
check("message records the demo ask", /demo landing page/i.test(message));
check("no answers leak raw json", !message.includes("{"));
console.log("\n  --- what gets stored ---");
for (const line of message.split("\n")) console.log(`  | ${line}`);

console.log(`\n${failures === 0 ? "All checks passed." : `${failures} check(s) failed.`}\n`);
process.exit(failures === 0 ? 0 : 1);