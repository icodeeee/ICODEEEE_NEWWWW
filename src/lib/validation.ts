import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  website: z.string().trim().url().max(250).optional().or(z.literal("")),
  project_type: z.string().trim().max(100).optional().or(z.literal("")),
  budget: z.string().trim().max(100).optional().or(z.literal("")),
  message: z.string().trim().min(20).max(3000),
  company_site: z.string().max(0).optional(),

  // Estimate funnel. `answers` arrives as a JSON string from the client and is
  // parsed here so a malformed payload can never reach the insert path.
  package_name: z.string().trim().max(120).optional().or(z.literal("")),
  estimate_range: z.string().trim().max(60).optional().or(z.literal("")),
  demo_requested: z.boolean().optional(),
  answers: z
    .string()
    .max(2000)
    .optional()
    .transform((raw, ctx) => {
      if (!raw) return undefined;
      try {
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: "answers must be an object" });
          return z.NEVER;
        }
        return Object.fromEntries(
          Object.entries(parsed as Record<string, unknown>)
            .filter(([, value]) => typeof value === "string")
            .map(([key, value]) => [key.slice(0, 60), String(value).slice(0, 60)]),
        );
      } catch {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "answers must be valid JSON" });
        return z.NEVER;
      }
    }),
});
