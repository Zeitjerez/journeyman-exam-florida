import Link from 'next/link';
import { isAdminBlocked } from '@/lib/adminGuard';

export default function AdminPage() {
  if (isAdminBlocked()) {
    return <section className="rounded border border-red-700 p-6">Admin is blocked in production.</section>;
  }

  return (
    <section className="space-y-4 rounded border border-slate-800 p-6">
      <h2 className="text-xl font-semibold">Admin Dashboard (local)</h2>
      <ul className="list-disc space-y-2 pl-6">
        <li>
          <Link href="/admin/import">Import forum signals CSV</Link>
        </li>
        <li>
          <Link href="/admin/blueprint">Confirm blueprint weights</Link>
        </li>
      </ul>
    </section>
  );
}
