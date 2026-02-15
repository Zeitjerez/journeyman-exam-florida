import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { distributeQuestionsByBlueprint } from '@journeyman/db/utils/weightDistributor';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const count = Number(searchParams.get('count') ?? 70);

  if (!Number.isFinite(count) || count <= 0) {
    return NextResponse.json({ error: 'count must be a positive number' }, { status: 400 });
  }

  const exam = await prisma.exam.findFirst({ where: { examCode: 'miami_dade_journeyman_2020' } });
  if (!exam) {
    return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
  }

  const categories = await prisma.blueprintCategory.findMany({
    where: { examId: exam.id },
    orderBy: { categoryCode: 'asc' },
  });

  const distribution = distributeQuestionsByBlueprint(count, categories);

  return NextResponse.json({
    total: count,
    exam: exam.name,
    distribution: distribution.map((item) => ({
      category: item.categoryName,
      assigned: item.assignedCount,
      total: count,
    })),
  });
}
