import { NextResponse } from 'next/server';
import { z } from 'zod';
import { generateQuestionsAction } from '@/app/questions/actions';

const generateSchema = z.object({
  examId: z.coerce.number().int().positive(),
  count: z.coerce.number().int().min(1).max(25),
});

export async function POST(request: Request) {
  const formData = await request.formData();

  const parsed = generateSchema.safeParse({
    examId: formData.get('examId'),
    count: formData.get('count') ?? 5,
  });

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    await generateQuestionsAction({ ...parsed.data, byBlueprintWeight: true });
    return NextResponse.redirect(new URL('/questions', request.url));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unexpected error' },
      { status: 500 },
    );
  }
}
