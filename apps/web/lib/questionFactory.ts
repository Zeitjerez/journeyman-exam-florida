import prisma from './prisma';
import { assertQuestionQualityGate } from './qualityGates';
import { templateLibrary } from '@journeyman/db/templates/library';
import { distributeQuestionsByBlueprint } from '@journeyman/db/utils/weightDistributor';

type GenerateInput = {
  examId: number;
  count: number;
  byBlueprintWeight?: boolean;
};

export async function generateQuestions(input: GenerateInput) {
  const { examId, count, byBlueprintWeight = true } = input;
  const exam = await prisma.exam.findUnique({ where: { id: examId } });
  if (!exam) throw new Error('Exam not found');

  const categories = await prisma.blueprintCategory.findMany({
    where: { examId },
    orderBy: { categoryCode: 'asc' },
  });
  if (!categories.length) throw new Error('No blueprint categories configured');

  const refs = await prisma.necRef.findMany({ where: { necEdition: exam.necEdition } });
  if (!refs.length) throw new Error('No NEC references available');

  const refsByKey = new Map(refs.map((ref) => [`${ref.article}:${ref.section ?? ''}`, ref]));

  const distribution = distributeQuestionsByBlueprint(
    count,
    byBlueprintWeight
      ? categories
      : categories.map((category) => ({ ...category, weightPercentage: null })),
  );

  const createdIds: number[] = [];
  let globalIndex = 1;

  for (const bucket of distribution) {
    const category = categories.find((item) => item.id === bucket.categoryId);
    if (!category) continue;

    const templateCandidates = templateLibrary.filter((tpl) => tpl.blueprintCategory === category.categoryCode);
    const pool = templateCandidates.length > 0 ? templateCandidates : templateLibrary;

    for (let i = 0; i < bucket.assignedCount; i += 1) {
      const template = pool[i % pool.length];

      const templateRefs = template.necRefs
        .map((refKey) => refsByKey.get(refKey) ?? null)
        .filter((ref): ref is NonNullable<typeof ref> => Boolean(ref));

      const ref = templateRefs[0] ?? refs[(globalIndex - 1) % refs.length];

      assertQuestionQualityGate({
        examId,
        blueprintCategoryId: category.id,
        necEdition: exam.necEdition,
        difficulty: String(template.difficulty),
        questionType: template.questionType,
        necRefs: [{ article: ref.article, section: ref.section }],
      });

      const scenario = template.stemBuilder(globalIndex, category.categoryName);
      const distractors = template.distractorsBuilder(ref.article);

      const question = await prisma.question.create({
        data: {
          examId,
          blueprintCategory: category.id,
          necEdition: exam.necEdition,
          necArticle: ref.article,
          necSection: ref.section,
          difficulty: String(template.difficulty),
          questionType: template.questionType,
          sourceType: 'template_factory',
          confidence: 0.6,
          questionStem: scenario,
          expectedAnswer: `Reference path: NEC ${ref.article}${ref.section ? `.${ref.section}` : ''}`,
          explanation: `Step-by-step: 1) classify the situation, 2) identify the applicable NEC area, 3) verify with reference NEC ${ref.article}${ref.section ? `.${ref.section}` : ''}. Distractor patterns considered: ${distractors.join(', ')}.`,
        },
      });

      createdIds.push(question.id);
      globalIndex += 1;
    }
  }

  return createdIds;
}
