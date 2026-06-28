import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="text-8xl">🥣</div>
      <h1 className="mt-6 text-5xl font-black text-slate-900 dark:text-white">404</h1>
      <p className="mt-3 max-w-md text-slate-600 dark:text-slate-400">Oops! This recipe page is missing from the kitchen.</p>
      <Link href="/" className="mt-8 rounded-full bg-orange-500 px-8 py-3 font-bold text-white hover:bg-orange-600">Back Home</Link>
    </div>
  );
}
