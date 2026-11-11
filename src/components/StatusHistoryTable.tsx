'use client';

import React, { useEffect, useState } from 'react';
import { StatusHistoryItem } from '@/lib/types';
import { formatIsraelDateTime } from '@/lib/schedule';
import { CheckCircle2, XCircle, AlertCircle, History } from 'lucide-react';

interface StatusHistoryTableProps {
  history: StatusHistoryItem[];
}

export function StatusHistoryTable({ history }: StatusHistoryTableProps) {
  const [items, setItems] = useState<StatusHistoryItem[]>(history || []);

  useEffect(() => {
    // Merge server history with any locally saved manual user checks
    const loadMergedHistory = () => {
      try {
        const storedManual = localStorage.getItem('bridge_manual_history');
        const manualItems: StatusHistoryItem[] = storedManual ? JSON.parse(storedManual) : [];

        // Combine and deduplicate by ID or identical timestamp
        const combined = [...manualItems, ...(history || [])];
        const seen = new Set<string>();
        const unique = combined.filter((item) => {
          const key = `${item.id}_${item.timestamp}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });

        // Sort descending by timestamp
        unique.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setItems(unique.slice(0, 30));
      } catch (err) {
        console.error('Error loading manual history:', err);
        setItems(history || []);
      }
    };

    loadMergedHistory();

    // Listen for real-time manual check events
    const handleNewCheck = (e: Event) => {
      const customEvent = e as CustomEvent<{ item?: StatusHistoryItem }>;
      if (customEvent.detail?.item) {
        const newItem = customEvent.detail.item;
        setItems((prev) => {
          const filtered = prev.filter((p) => p.id !== newItem.id);
          return [newItem, ...filtered].slice(0, 30);
        });
      }
    };

    window.addEventListener('bridge-status-refreshed', handleNewCheck);
    return () => {
      window.removeEventListener('bridge-status-refreshed', handleNewCheck);
    };
  }, [history]);

  if (!items || items.length === 0) {
    return (
      <div className="p-8 rounded-2xl glass-panel text-center text-slate-500 dark:text-slate-400">
        טרם נרשמו בדיקות קודמות בהיסטוריה.
      </div>
    );
  }

  return (
    <div className="rounded-3xl glass-panel overflow-hidden shadow-lg border border-slate-200/80 dark:border-slate-800/80 transition-all duration-300">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/70 dark:border-slate-800/70 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-slate-200/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              היסטוריית בדיקות אחרונות
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              תיעוד רציף של בדיקות אוטומטיות ואימותים ידניים
            </p>
          </div>
        </div>

        <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-slate-200/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border border-slate-300/40 dark:border-slate-700/40">
          {items.length} רשומות
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-right text-sm">
          <thead className="bg-slate-100/60 dark:bg-slate-950/40 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider border-b border-slate-200/60 dark:border-slate-800/60">
            <tr>
              <th className="px-6 py-3.5 font-semibold">מועד הבדיקה</th>
              <th className="px-6 py-3.5 font-semibold">סטטוס המעבר</th>
              <th className="px-6 py-3.5 font-semibold">טקסט שנשלף</th>
              <th className="px-6 py-3.5 font-semibold">תאריך מקור הפארק</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/40 dark:divide-slate-800/40">
            {items.map((item) => {
              const formatted = formatIsraelDateTime(item.timestamp);
              const isOpen = item.status === 'OPEN';
              const isClosed = item.status === 'CLOSED';

              return (
                <tr
                  key={item.id}
                  className="hover:bg-slate-500/5 dark:hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4 font-mono text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    {formatted.hebrew}
                  </td>
                  <td className="px-6 py-4">
                    {isOpen ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        פתוח למעבר
                      </span>
                    ) : isClosed ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/30">
                        <XCircle className="w-3.5 h-3.5" />
                        סגור למעבר
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                        <AlertCircle className="w-3.5 h-3.5" />
                        בבדיקה
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-800 dark:text-slate-200 font-medium">
                    {item.rawText}
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs">
                    {item.sourceDate || '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
