import prisma from './prisma';

export async function generateQuestionsFromTemplates(examId: number, count: number) {
  const exam = await prisma.exam.findUnique({ where: { id: examId } });
  if (!exam) throw new Error('Exam not found');

  const categories = await prisma.blueprintCategory.findMany({ where: { examId } });
  const templates = await prisma.questionTemplate.findMany();
  const refs = await prisma.necRef.findMany({ where: { necEdition: exam.necEdition }, take: 100 });

  if (!categories.length) throw new Error('No blueprint categories available');
  if (!templates.length) throw new Error('No templates available');
  if (!refs.length) throw new Error('No NEC references available');

  const created = [];

  for (let i = 0; i < count; i += 1) {
    const category = categories[i % categories.length];
    const template = templates[i % templates.length];
    const ref = refs[i % refs.length];

    const question = await prisma.question.create({
      data: {
        examId,
        blueprintCategory: category.id,
        necEdition: exam.necEdition,
        necArticle: ref.article,
        necSection: ref.section,
        difficulty: template.difficultyDefault ?? 'medium',
        questionType: template.questionType,
        sourceType: 'generated_stub',
        confidence: 0.5,
        questionStem: `Stub Q${i + 1}: ${template.promptTemplate} (Category: ${category.categoryName})`,
        expectedAnswer: `Suggested reference: NEC ${ref.article}${ref.section ? `.${ref.section}` : ''}`,
        explanation: `Generated stub using template "${template.name}" and reference NEC ${ref.article}.`,
        templateId: template.id,
      },
    });

    created.push(question.id);
  }

  return created;
}
