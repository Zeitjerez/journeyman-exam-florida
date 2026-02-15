import prisma from '@/lib/prisma';
import { isAdminBlocked } from '@/lib/adminGuard';

export default async function AdminImportPage() {
  if (isAdminBlocked()) {
    return <section className="rounded border border-red-700 p-6">Admin is blocked in production.</section>;
  }

  const exam = await prisma.exam.findFirst({ where: { examCode: 'miami_dade_journeyman_2020' } });

  return (
    <section className="space-y-4 rounded border border-slate-800 p-6">
      <h2 className="text-xl font-semibold">Import Forum Signals</h2>
      <p className="text-sm text-slate-300">Upload CSV with forum signal patterns (no literal questions).</p>
      <form action="/api/admin/import-forum-signals" method="post" encType="multipart/form-data" className="space-y-3">
        <input type="hidden" name="examId" value={exam?.id ?? ''} />
        <input type="file" name="file" accept=".csv,text/csv" required className="block" />
        <button type="submit" className="rounded bg-emerald-600 px-4 py-2 text-white">
          Import CSV
        </button>
      </form>
    </section>
  );
}
