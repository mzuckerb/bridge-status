import React from 'react';
import { Clock, Calendar, RefreshCw } from 'lucide-react';
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
      <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
        <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
          <Calendar className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs font-semibold text-slate-400 tracking-wider">
            עדכון רשמי של הפארק
          </span>
          <p className="mt-1 text-lg font-bold text-slate-100">
            {sourceDate || 'לא צוין באתר'}
          </p>
          <span className="text-xs text-slate-500">
            נשלף מתוך אתר גני יהושע
          </span>
        </div>
      </div>

      {/* 2. Last system check */}
      <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
        <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
          <Clock className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs font-semibold text-slate-400 tracking-wider">
            בדיקה אחרונה במערכת
          </span>
          <p className="mt-1 text-lg font-bold text-slate-100">
            {formattedLastCheck.hebrew}
          </p>
          <span className="text-xs text-slate-500">
            זמן ישראל (Asia/Jerusalem)
          </span>
        </div>
      </div>

      {/* 3. Next scheduled check */}
      <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
        <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
          <RefreshCw className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs font-semibold text-slate-400 tracking-wider">
            בדיקה אוטומטית הבאה
          </span>
          <p className="mt-1 text-lg font-bold text-slate-100">
            {formattedNextCheck.hebrew}
          </p>
          <span className="text-xs text-slate-500">
            מתעדכן פעמיים ביום (07:00 ו-17:00)
          </span>
        </div>
      </div>
    </div>
  );
}
