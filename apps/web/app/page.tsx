import prisma from '@/lib/prisma';

export default async function HomePage() {
  const exam = await prisma.exam.findFirst({
    where: { examCode: 'miami_dade_journeyman_2020' },
  });

  return (
    <section className="space-y-4 rounded border border-slate-800 p-6">
      <h2 className="text-xl font-semibold">Study Platform Bootstrap</h2>
      <p>
        This app is the base for a Miami-Dade Journeyman Electrician preparation platform with
        metadata-first workflows.
      </p>
      <p className="font-medium">
        Exam target:{' '}
        {exam
          ? `${exam.name} (NEC ${exam.necEdition})`
          : 'Miami-Dade Journeyman 2020 (NEC 2020)'}
      </p>
    </section>
  );
}
