/**
 * Checks the quote request summary and stored lead payload.
 *
 * Run with: npx tsx scripts/check-estimate.ts
 *
 * This keeps unconfirmed rates out of the public service catalogue while
 * ensuring that the visitor's selected scope and answers reach the lead brief.
 */

import { computeEstimate, estimateQuestions, briefMessage, answerLines, type Answers } from "../src/lib/estimate";
import { services } from "../src/lib/services";

let failures = 0;
const check = (label: string, condition: boolean, detail = "") => {
  if (!condition) failures += 1;
  console.log(`  ${condition ? "pass" : "FAIL"}  ${label}${detail ? `  ${detail}` : ""}`);
};

const service = services.find((s) => s.slug === "ecommerce-setup")!;
const option = service.options[0];
const answers: Answers = Object.fromEntries(estimateQuestions.map((question) => [question.id, question.options[0].id]));
const lines = answerLines(answers);
const message = briefMessage(service.name, option, answers, computeEstimate(option, answers).label);

console.log("\nUnconfirmed prices stay unpublished");
check("all service package prices are unset", services.every((s) => s.options.every((o) => o.from === 0 && o.to === 0)));
check("all service add-on prices are unset", services.every((s) => s.addOns.every((addOn) => addOn.price === 0)));
check("quote result remains custom", computeEstimate(option, answers).label === "Custom quote");

console.log("\nThe request contains the visitor's project context");
check("one readable line per question", lines.length === estimateQuestions.length, `${lines.length}`);
check("message clears leadSchema 20-character minimum", message.length >= 20, `${message.length} chars`);
check("message carries every answer", lines.every((line) => message.includes(line)));
check("message does not promise a demo", !/demo landing page/i.test(message));
check("message does not contain raw JSON", !message.includes("{"));

console.log("\n  --- what gets stored ---");
for (const line of message.split("\n")) console.log(`  | ${line}`);

console.log(`\n${failures === 0 ? "All checks passed." : `${failures} check(s) failed.`}\n`);
process.exit(failures === 0 ? 0 : 1);
