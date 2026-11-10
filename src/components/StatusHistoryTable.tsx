import React from 'react';
import { StatusHistoryItem } from '@/lib/types';
import { formatIsraelDateTime } from '@/lib/schedule';
import { CheckCircle2, XCircle, AlertCircle, History } from 'lucide-react';

interface StatusHistoryTableProps {
  history: StatusHistoryItem[];
}

export function StatusHistoryTable({ history }: StatusHistoryTableProps) {
  if (!history || history.length === 0) {
    return (
      <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 text-center text-slate-500">
        טרם נרשמו בדיקות קודמות בהיסטוריה.
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden shadow-xl backdrop-blur-md">
      <div className="flex items-center gap-2.5 px-6 py-4 border-b border-slate-800 bg-slate-900/80">
        <History className="w-5 h-5 text-slate-400" />
        <h2 className="text-base font-semibold text-slate-200">
          היסטוריית בדיקות אחרונות
        </h2>
        <span className="text-xs text-slate-500 font-mono">
          ({history.length} רשומות)
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-right text-sm">
          <thead className="bg-slate-950/60 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="px-6 py-3.5">מועד הבדיקה (זמן ישראל)</th>
              <th className="px-6 py-3.5">סטטוס</th>
              <th className="px-6 py-3.5">טקסט שנשלף</th>
              <th className="px-6 py-3.5">תאריך מקור</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {history.map((item) => {
              const formatted = formatIsraelDateTime(item.timestamp);
              const isOpen = item.status === 'OPEN';
              const isClosed = item.status === 'CLOSED';

              return (
                <tr
                  key={item.id}
                  className="hover:bg-slate-800/30 transition-colors"
                >
                  <td className="px-6 py-4 font-mono text-slate-300">
                    {formatted.hebrew}
                  </td>
                  <td className="px-6 py-4">
                    {isOpen ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        פתוח
                      </span>
                    ) : isClosed ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                        <XCircle className="w-3.5 h-3.5" />
                        סגור
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                        <AlertCircle className="w-3.5 h-3.5" />
                        לא ודאי
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-300">
                    {item.rawText}
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-xs">
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
