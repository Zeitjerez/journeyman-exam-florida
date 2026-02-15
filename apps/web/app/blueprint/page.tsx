import prisma from '@/lib/prisma';

export default async function BlueprintPage() {
  const exam = await prisma.exam.findFirst({ where: { examCode: 'miami_dade_journeyman_2020' } });
  const categories = exam
    ? await prisma.blueprintCategory.findMany({ where: { examId: exam.id }, orderBy: { categoryCode: 'asc' } })
    : [];

  return (
    <section className="rounded border border-slate-800 p-6">
      <h2 className="mb-4 text-xl font-semibold">Blueprint Categories</h2>
      <ul className="space-y-2">
        {categories.map((category) => (
          <li key={category.id} className="rounded border border-slate-700 p-3">
            <div className="font-medium">
              {category.categoryCode} · {category.categoryName}
            </div>
            <div className="text-sm text-slate-300">
              Weight:{' '}
              {category.questionCountTarget !== null ? category.questionCountTarget : 'Pending official confirmation'}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
