import prisma from '@/lib/prisma';
import { templateLibrary } from '@journeyman/db/templates/library';

export default async function TemplatesPage() {
  const exam = await prisma.exam.findFirst({ where: { examCode: 'miami_dade_journeyman_2020' } });
  const coverage = templateLibrary.reduce<Record<string, number>>((acc, template) => {
    acc[template.blueprintCategory] = (acc[template.blueprintCategory] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <section className="space-y-4 rounded border border-slate-800 p-6">
      <h2 className="text-xl font-semibold">Template Library v1</h2>
      <form action="/api/generate" method="post" className="flex gap-3">
        <input type="hidden" name="examId" value={exam?.id ?? ''} />
        <input type="number" min={1} max={25} defaultValue={5} name="count" className="w-24 rounded border border-slate-700 bg-slate-900 px-2 py-1" />
        <button type="submit" className="rounded bg-emerald-600 px-4 py-1.5 text-white">Generate stubs</button>
      </form>

      <div className="rounded border border-slate-700 p-3 text-sm">
        {Object.entries(coverage)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([category, count]) => (
            <div key={category}>
              {category}: {count}
            </div>
          ))}
      </div>

      <ul className="space-y-2">
        {templateLibrary.slice(0, 20).map((template) => (
          <li key={template.id} className="rounded border border-slate-700 p-3">
            <div className="font-medium">{template.id} · {template.blueprintCategory}</div>
            <div className="text-sm text-slate-300">{template.questionType} · difficulty {template.difficulty}</div>
          </li>
        ))}
      </ul>
    </section>
  );
}
