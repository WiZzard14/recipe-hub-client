'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';
import Protected from '@/components/Protected';
import { apiFetch } from '@/lib/api';
import type { ReportItem } from '@/types';

export default function ReportsPage() {
  return (
    <Protected adminOnly>
      <Reports />
    </Protected>
  );
}

function Reports() {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const load = async () => {
    try {
      setReports(await apiFetch<ReportItem[]>('/reports'));
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const updateReport = async (id: string, action: 'dismiss' | 'remove-recipe') => {
    try {
      const data = await apiFetch<{ message: string; report: ReportItem }>(`/reports/${id}/${action}`, { method: 'PATCH' });
      setReports((prev) => prev.map((report) => report._id === id ? data.report : report));
      setMessage(data.message);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Action failed');
    }
  };

  if (loading) return <LoadingSpinner label="Loading reports..." />;

  return (
    <div className="section-shell">
      <h1 className="text-4xl font-black text-slate-950 dark:text-white">Recipe Reports</h1>
      <p className="mt-2 text-slate-500">Users can report recipes for spam, offensive content, or copyright issues.</p>
      {message && <p className="mt-6 rounded-2xl bg-orange-50 p-4 font-bold text-orange-700 dark:bg-orange-950">{message}</p>}
      <div className="mt-8 grid gap-5">
        {reports.map((report) => (
          <article key={report._id} className="rounded-3xl bg-white p-6 shadow-sm dark:bg-slate-900">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div>
                <h3 className="text-xl font-black text-slate-950 dark:text-white">{report.recipeId?.recipeName || 'Recipe unavailable'}</h3>
                <p className="mt-1 text-sm text-slate-500">Reason: {report.reason} • Reporter: {report.reporterEmail} • Status: {report.status}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {report.recipeId?._id && <Link href={`/recipe/${report.recipeId._id}`} className="rounded-full bg-slate-100 px-4 py-2 font-bold dark:bg-slate-800">View</Link>}
                <button onClick={() => void updateReport(report._id, 'dismiss')} className="rounded-full bg-blue-50 px-4 py-2 font-bold text-blue-600 dark:bg-blue-950">Dismiss</button>
                <button onClick={() => void updateReport(report._id, 'remove-recipe')} className="rounded-full bg-red-50 px-4 py-2 font-bold text-red-600 dark:bg-red-950">Remove Recipe</button>
              </div>
            </div>
          </article>
        ))}
        {reports.length === 0 && <div className="rounded-3xl bg-white p-10 text-center text-slate-500 dark:bg-slate-900">No reports yet.</div>}
      </div>
    </div>
  );
}
