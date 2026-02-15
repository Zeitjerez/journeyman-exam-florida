import { z } from 'zod';

export const forumSignalImportSchema = z.object({
  source_url: z.string().url(),
  source_name: z.string().min(1),
  note: z.string().optional().default(''),
  blueprint_category: z.string().min(1),
  nec_edition: z.coerce.literal(2020),
  nec_article: z.string().min(1),
  nec_section: z.string().optional().default(''),
  pattern: z.string().min(1).max(280),
  confidence: z.coerce.number().min(0).max(1),
});

const questionQualityGateSchema = z.object({
  examId: z.number().int().positive(),
  blueprintCategoryId: z.number().int().positive(),
  necEdition: z.literal(2020),
  difficulty: z.string().min(1),
  questionType: z.string().min(1),
  necRefs: z.array(z.object({ article: z.string().min(1), section: z.string().nullable().optional() })).min(1),
});

export function assertQuestionQualityGate(input: unknown) {
  return questionQualityGateSchema.parse(input);
}
