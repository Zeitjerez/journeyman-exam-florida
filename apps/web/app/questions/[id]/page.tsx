import prisma from '@/lib/prisma';

export default async function QuestionDetailPage({ params }: { params: { id: string } }) {
  const question = await prisma.question.findUnique({
    where: { id: Number(params.id) },
    include: { blueprint: true },
  });

  if (!question) {
    return <section className="rounded border border-slate-800 p-6">Question not found.</section>;
  }

  return (
    <section className="space-y-3 rounded border border-slate-800 p-6">
      <h2 className="text-xl font-semibold">Question #{question.id}</h2>
      <p>{question.questionStem}</p>
      <p className="text-sm text-slate-300">Category: {question.blueprint.categoryCode}</p>
      <p className="text-sm text-slate-300">
        NEC refs: {question.necArticle}
        {question.necSection ? `.${question.necSection}` : ''}
      </p>
      <div>
        <h3 className="font-medium">Explanation</h3>
        <p>{question.explanation ?? 'No explanation yet.'}</p>
      </div>
    </section>
  );
}
