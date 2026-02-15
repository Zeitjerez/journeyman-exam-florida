import prisma from '@/lib/prisma';
import { isAdminBlocked } from '@/lib/adminGuard';

export default async function AdminBlueprintPage() {
  if (isAdminBlocked()) {
    return <section className="rounded border border-red-700 p-6">Admin is blocked in production.</section>;
  }

  const exam = await prisma.exam.findFirst({ where: { examCode: 'miami_dade_journeyman_2020' } });
  const categories = exam
    ? await prisma.blueprintCategory.findMany({ where: { examId: exam.id }, orderBy: { categoryCode: 'asc' } })
    : [];

  return (
    <section className="space-y-4 rounded border border-slate-800 p-6">
      <h2 className="text-xl font-semibold">Blueprint Weights (confirm/edit)</h2>
      <p className="text-sm text-slate-300">Local view for confirming target counts by category.</p>
      <ul className="space-y-2">
        {categories.map((category) => (
          <li key={category.id} className="rounded border border-slate-700 p-3">
            {category.categoryCode} · {category.categoryName} · target:{' '}
            {category.questionCountTarget ?? 'pending'}
          </li>
        ))}
      </ul>
    </section>
  );
}
