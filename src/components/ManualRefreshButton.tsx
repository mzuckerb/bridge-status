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
        alert('שגיאה בעדכון הסטטוס. אנא נסה שוב מאוחר יותר.');
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
      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 border cursor-pointer ${
        justUpdated
          ? 'bg-emerald-600/20 border-emerald-500/50 text-emerald-300'
          : 'bg-slate-800 hover:bg-slate-700/80 active:scale-95 border-slate-700 text-slate-200 shadow-md'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
      title="בצע בדיקה ידנית מיידית מול אתר גני יהושע"
    >
      {justUpdated ? (
        <>
          <Check className="w-4 h-4 text-emerald-400" />
          <span>עודכן בהצלחה!</span>
        </>
      ) : (
        <>
          <RefreshCw
            className={`w-4 h-4 text-slate-300 ${loading ? 'animate-spin' : ''}`}
          />
          <span>{loading ? 'בודק כעת...' : 'בדוק סטטוס עכשיו'}</span>
        </>
      )}
    </button>
  );
}
