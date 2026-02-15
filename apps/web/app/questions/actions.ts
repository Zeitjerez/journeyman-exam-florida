'use server';

import { z } from 'zod';
import { generateQuestions } from '@/lib/questionFactory';

const generateSchema = z.object({
  examId: z.coerce.number().int().positive(),
  count: z.coerce.number().int().min(1).max(50),
  byBlueprintWeight: z.coerce.boolean().optional().default(true),
});

export async function generateQuestionsAction(rawInput: unknown) {
  const input = generateSchema.parse(rawInput);
  return generateQuestions(input);
}
