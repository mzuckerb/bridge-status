'use client';

import React, { useState } from 'react';
import { RefreshCw, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function ManualRefreshButton() {
  const [loading, setLoading] = useState(false);
  const [justUpdated, setJustUpdated] = useState(false);
  const router = useRouter();

  const handleRefresh = async () => {
    if (loading) return;
    setLoading(true);
    setJustUpdated(false);

    try {
      const res = await fetch('/api/cron/scrape', { method: 'POST' });
      if (res.ok) {
        setJustUpdated(true);
        router.refresh();
        setTimeout(() => setJustUpdated(false), 3000);
      } else {
        alert('שגיאה בעדכון הסטטוס. אנא נסה שוב.');
      }
    } catch (err) {
      console.error('Refresh error:', err);
      alert('שגיאת תקשורת עם השרת.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleRefresh}
      disabled={loading}
      className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all duration-200 border cursor-pointer ${
        justUpdated
          ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-700 dark:text-emerald-300'
          : 'bg-white/80 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 shadow-sm hover:shadow'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
      title="בצע בדיקה ידנית מיידית מול אתר גני יהושע"
    >
      {justUpdated ? (
        <>
          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>עודכן בהצלחה!</span>
        </>
      ) : (
        <>
          <RefreshCw
            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400 ${
              loading ? 'animate-spin' : ''
            }`}
          />
          <span className="hidden sm:inline">{loading ? 'בודק כעת...' : 'בדוק סטטוס עכשיו'}</span>
          <span className="sm:hidden">{loading ? 'בודק...' : 'רענן'}</span>
        </>
      )}
    </button>
  );
}
