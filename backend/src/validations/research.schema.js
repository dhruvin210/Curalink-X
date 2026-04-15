import { z } from "zod";

export const researchQuerySchema = z.object({
  sessionId: z.string().optional(),
  disease: z.string().trim().optional(),
  query: z.string().trim().optional(),
  naturalLanguage: z.string().trim().optional(),
  location: z.string().trim().optional(),
  age: z.coerce.number().int().positive().max(120).optional(),
  gender: z.string().trim().optional(),
  treatment: z.string().trim().optional(),
  whatIf: z.string().trim().optional()
});

export const validateResearchQuery = (payload) =>
  researchQuerySchema
    .superRefine((data, ctx) => {
      const hasStructuredInput = Boolean(
        data.disease || data.location || data.treatment || data.whatIf
      );

      if (!data.query && !data.naturalLanguage && !hasStructuredInput) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["query"],
          message:
            "Add a natural language question, or fill structured fields like disease or what-if treatment."
        });
      }
    })
    .parse(payload);
