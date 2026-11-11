'use client';

import React, { useState } from 'react';
import { RefreshCw, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function ManualRefreshButton() {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const router = useRouter();

  const handleRefresh = async () => {
    if (loading) return;
    setLoading(true);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/cron/scrape', { method: 'POST' });
      if (res.ok) {
        const json = await res.json();
        const checkIso = json.data?.lastCheckedAt || new Date().toISOString();
        
        // Record user check time so TimeDetailsCard immediately displays it
        try {
          localStorage.setItem('last_user_check', checkIso);
          window.dispatchEvent(new CustomEvent('bridge-status-refreshed', { detail: { timestamp: checkIso } }));
        } catch {}

        const statusHe = json.data?.status === 'OPEN' ? 'פתוח' : json.data?.status === 'CLOSED' ? 'סגור' : 'מאומת';
        setSuccessMsg(`אומת: ${statusHe}!`);
        router.refresh();
        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        alert('שגיאה בבדיקה מול השרת. אנא נסה שוב.');
      }
    } catch (err) {
      console.error('Refresh error:', err);
      alert('שגיאת תקשורת.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleRefresh}
      disabled={loading}
      className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all duration-200 border cursor-pointer ${
        successMsg
          ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/20'
          : 'bg-white/80 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 shadow-sm hover:shadow'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
      title="בצע אימות חי מיידי מול אתר גני יהושע"
    >
      {successMsg ? (
        <>
          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{successMsg}</span>
        </>
      ) : (
        <>
          <RefreshCw
            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400 ${
              loading ? 'animate-spin' : ''
            }`}
          />
          <span className="hidden sm:inline">{loading ? 'בודק בלייב...' : 'בדוק סטטוס עכשיו'}</span>
          <span className="sm:hidden">{loading ? 'בודק...' : 'רענן'}</span>
        </>
      )}
    </button>
  );
}
