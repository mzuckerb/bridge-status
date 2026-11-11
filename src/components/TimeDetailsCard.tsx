import React from 'react';
import { Clock, Calendar, RefreshCw, Radio } from 'lucide-react';
import { formatIsraelDateTime } from '@/lib/schedule';

interface TimeDetailsCardProps {
  lastCheckedAt: string;
  sourceDate: string;
  nextScheduledCheckAt: string;
}

export function TimeDetailsCard({
  lastCheckedAt,
  sourceDate,
  nextScheduledCheckAt,
}: TimeDetailsCardProps) {
  const formattedLastCheck = formatIsraelDateTime(lastCheckedAt);
  const formattedNextCheck = formatIsraelDateTime(nextScheduledCheckAt);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* 1. Official park date */}
      <div className="relative overflow-hidden rounded-2xl glass-panel p-5 transition-all duration-300 hover:shadow-md hover:border-blue-500/30 group">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 group-hover:scale-110 transition-transform">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              עדכון רשמי של הפארק
            </span>
            <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
              {sourceDate || 'עודכן היום'}
            </p>
            <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block">
              נדגם ישירות מאתר גני יהושע
            </span>
          </div>
        </div>
      </div>

      {/* 2. Last system check */}
      <div className="relative overflow-hidden rounded-2xl glass-panel p-5 transition-all duration-300 hover:shadow-md hover:border-purple-500/30 group">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 group-hover:scale-110 transition-transform">
            <Radio className="w-5 h-5 text-purple-600 dark:text-purple-400 animate-pulse" />
          </div>
          <div className="flex-1">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              בדיקה אחרונה במערכת
            </span>
            <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
              {formattedLastCheck.hebrew}
            </p>
            <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block">
              זמן ישראל (Asia/Jerusalem)
            </span>
          </div>
        </div>
      </div>

      {/* 3. Next scheduled check */}
      <div className="relative overflow-hidden rounded-2xl glass-panel p-5 transition-all duration-300 hover:shadow-md hover:border-emerald-500/30 group">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              בדיקה אוטומטית הבאה
            </span>
            <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
              {formattedNextCheck.hebrew}
            </p>
            <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block">
              לוח זמנים קבוע: 07:00 ו-17:00
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
