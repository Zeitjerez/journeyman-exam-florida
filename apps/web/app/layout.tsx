import './globals.css';
import Link from 'next/link';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <main className="mx-auto max-w-5xl space-y-6 p-6">
          <header className="rounded border border-slate-800 p-4">
            <h1 className="text-2xl font-bold">Journeyman Exam Florida</h1>
            <nav className="mt-3 flex gap-4 text-sm">
              <Link href="/">Home</Link>
              <Link href="/blueprint">Blueprint</Link>
              <Link href="/questions">Questions</Link>
              <Link href="/templates">Templates</Link>
              <Link href="/admin">Admin</Link>
            </nav>
          </header>
          {children}
        </main>
      </body>
    </html>
  );
}
