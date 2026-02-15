import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { parseCsv } from '@/lib/csv';
import { forumSignalImportSchema } from '@/lib/qualityGates';

export async function POST(request: Request) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Admin routes are blocked in production' }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get('file');
  const examId = Number(formData.get('examId'));

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'CSV file is required' }, { status: 400 });
  }

  const text = await file.text();
  const rows = parseCsv(text);
  const categories = await prisma.blueprintCategory.findMany({ where: { examId } });
  const categoryMap = new Map(categories.map((c) => [c.categoryCode, c]));

  let inserted = 0;

  for (const row of rows) {
    const parsed = forumSignalImportSchema.safeParse(row);
    if (!parsed.success) continue;

    const payload = parsed.data;
    const category = categoryMap.get(payload.blueprint_category);
    if (!category) continue;

    const source = await prisma.source.create({
      data: {
        type: 'forum_signal',
        url: payload.source_url,
        notes: `source_name=${payload.source_name}; note=${payload.note}`,
        confidenceDefault: payload.confidence,
      },
    });

    await prisma.forumSignal.create({
      data: {
        examId,
        blueprintCategory: category.id,
        necEdition: payload.nec_edition,
        topic: payload.blueprint_category,
        pattern: payload.pattern,
        suggestedNecReference: `${payload.nec_article}${payload.nec_section ? `.${payload.nec_section}` : ''}`,
        sourceId: source.id,
        confidence: payload.confidence,
        notes: payload.note,
      },
    });

    inserted += 1;
  }

  return NextResponse.json({ inserted, totalRows: rows.length });
}
