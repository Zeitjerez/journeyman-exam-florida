import Link from 'next/link';
import prisma from '@/lib/prisma';

type SearchParams = {
  category?: string;
  difficulty?: string;
  type?: string;
};

export default async function QuestionsPage({ searchParams }: { searchParams: SearchParams }) {
  const where: Record<string, unknown> = {};
  if (searchParams.difficulty) where.difficulty = searchParams.difficulty;
  if (searchParams.type) where.questionType = searchParams.type;
  if (searchParams.category) where.blueprint = { categoryCode: searchParams.category };

  const questions = await prisma.question.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { blueprint: true },
    take: 100,
  });

  const categories = await prisma.blueprintCategory.findMany({ orderBy: { categoryCode: 'asc' } });

  return (
    <section className="rounded border border-slate-800 p-6">
      <h2 className="mb-4 text-xl font-semibold">Questions</h2>
      <form className="mb-4 grid grid-cols-1 gap-2 md:grid-cols-4">
        <select name="category" defaultValue={searchParams.category ?? ''} className="rounded border border-slate-700 bg-slate-900 p-2">
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.categoryCode}>
              {category.categoryCode}
            </option>
          ))}
        </select>
        <select name="difficulty" defaultValue={searchParams.difficulty ?? ''} className="rounded border border-slate-700 bg-slate-900 p-2">
          <option value="">All difficulty</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
        <select name="type" defaultValue={searchParams.type ?? ''} className="rounded border border-slate-700 bg-slate-900 p-2">
          <option value="">All types</option>
          <option value="lookup">lookup</option>
          <option value="calc">calc</option>
          <option value="scenario">scenario</option>
        </select>
        <button type="submit" className="rounded bg-sky-700 px-3 py-2 text-white">Apply filters</button>
      </form>

      {questions.length === 0 ? (
        <div className="space-y-3">
          <p>No questions yet.</p>
          <Link href="/templates" className="inline-block rounded bg-sky-600 px-4 py-2 text-white">
            Generate from templates
          </Link>
        </div>
      ) : (
        <ul className="space-y-2">
          {questions.map((question) => (
            <li key={question.id} className="rounded border border-slate-700 p-3">
              <p className="font-medium">{question.questionStem}</p>
              <p className="text-sm text-slate-300">
                {question.blueprint.categoryCode} · NEC {question.necArticle}
                {question.necSection ? `.${question.necSection}` : ''} · {question.difficulty} · {question.questionType}
              </p>
              <Link className="text-sm" href={`/questions/${question.id}`}>Open question</Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
