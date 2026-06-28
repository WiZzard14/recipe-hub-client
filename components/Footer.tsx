import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-4 lg:px-8">
        <div>
          <h3 className="text-2xl font-black text-orange-500">Recipe<span className="text-slate-900 dark:text-white">Hub</span></h3>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">A professional recipe sharing platform for discovering, saving, buying and publishing recipes.</p>
        </div>
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white">Quick Links</h4>
          <div className="mt-3 flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-400">
            <Link href="/">Home</Link>
            <Link href="/browse">Browse Recipes</Link>
            <Link href="/dashboard">Dashboard</Link>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white">Social Links</h4>
          <div className="mt-3 flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-400">
            <a href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer">YouTube</a>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white">Contact Information</h4>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">Email: support@recipehub.com</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">Phone: +880 1800-000000</p>
        </div>
      </div>
      <div className="border-t border-slate-100 py-4 text-center text-sm text-slate-500 dark:border-slate-800">
        © {new Date().getFullYear()} RecipeHub. All rights reserved.
      </div>
    </footer>
  );
}
