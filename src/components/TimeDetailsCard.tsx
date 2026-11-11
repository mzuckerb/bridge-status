'use client';

import React, { useEffect, useState } from 'react';
import { Calendar, RefreshCw, Radio } from 'lucide-react';
import { formatFriendlyDateTime } from '@/lib/schedule';

interface TimeDetailsCardProps {
  lastCheckedAt: string;
  lastScheduledCheckAt?: string;
  sourceDate: string;
  nextScheduledCheckAt: string;
}

export function TimeDetailsCard({
  lastCheckedAt,
  lastScheduledCheckAt,
  sourceDate,
  nextScheduledCheckAt,
}: TimeDetailsCardProps) {
  // Base scheduled check
  const baseScheduled = lastScheduledCheckAt ? new Date(lastScheduledCheckAt) : new Date(lastCheckedAt);
  const nextCheckDate = new Date(nextScheduledCheckAt);

  const [activeLastDate, setActiveLastDate] = useState<Date>(baseScheduled);
  const [isUserCheck, setIsUserCheck] = useState<boolean>(false);

  useEffect(() => {
    // Check if user performed a manual check that is newer than the scheduled check
    const evaluateLastCheck = () => {
      try {
        const storedUserCheck = localStorage.getItem('last_user_check');
        if (storedUserCheck) {
          const userDate = new Date(storedUserCheck);
          if (!isNaN(userDate.getTime()) && userDate.getTime() > baseScheduled.getTime()) {
            setActiveLastDate(userDate);
            setIsUserCheck(true);
            return;
          }
        }
      } catch {}
      setActiveLastDate(baseScheduled);
      setIsUserCheck(false);
    };

    evaluateLastCheck();

    // Listen for manual refresh button event
    const handleRefreshed = (e: Event) => {
      const customEvent = e as CustomEvent<{ timestamp?: string }>;
      if (customEvent.detail?.timestamp) {
        setActiveLastDate(new Date(customEvent.detail.timestamp));
        setIsUserCheck(true);
      } else {
        setActiveLastDate(new Date());
        setIsUserCheck(true);
      }
    };

    window.addEventListener('bridge-status-refreshed', handleRefreshed);
    return () => {
      window.removeEventListener('bridge-status-refreshed', handleRefreshed);
    };
  }, [baseScheduled]);

  const formattedLast = formatFriendlyDateTime(activeLastDate);
  const formattedNext = formatFriendlyDateTime(nextCheckDate);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* 1. Official park update date */}
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

      {/* 2. Last check box (SINGLE unified timestamp: last automatic or manual check) */}
      <div className="relative overflow-hidden rounded-2xl glass-panel p-5 transition-all duration-300 hover:shadow-md hover:border-purple-500/30 group">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 group-hover:scale-110 transition-transform">
            <Radio className="w-5 h-5 text-purple-600 dark:text-purple-400 animate-pulse" />
          </div>
          <div className="flex-1">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              בדיקה אחרונה
            </span>
            <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
              {formattedLast.hebrew}
            </p>
            <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block">
              {isUserCheck ? 'אומת ידנית בלייב' : 'בדיקה אוטומטית (07:00 / 17:00)'}
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
              הבדיקה האוטומטית הבאה
            </span>
            <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
              {formattedNext.hebrew}
            </p>
            <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block">
              מתעדכן פעמיים ביום (07:00 ו-17:00)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
