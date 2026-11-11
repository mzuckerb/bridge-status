import React from 'react';
import { BridgeState } from '@/lib/types';
import { CheckCircle2, XCircle, AlertCircle, Sparkles } from 'lucide-react';

interface BridgeHeroCardProps {
  status: BridgeState;
  rawText: string;
}

export function BridgeHeroCard({ status, rawText }: BridgeHeroCardProps) {
  const isOpen = status === 'OPEN';
  const isClosed = status === 'CLOSED';

  let config = {
    cardBg: 'from-emerald-500/10 via-teal-500/5 to-transparent border-emerald-500/30 dark:border-emerald-500/20 shadow-emerald-500/5',
    glowColor: 'bg-emerald-500/20 dark:bg-emerald-500/15',
    beaconColor: '#10b981',
    statusBadge: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
    titleHe: 'פתוח למעבר',
    titleEn: 'BRIDGE IS OPEN',
    description: 'הגשר פתוח ובטוח לתנועת הולכי רגל ורוכבי אופניים לאורך נחל הירקון.',
    icon: <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />,
  };

  if (isClosed) {
    config = {
      cardBg: 'from-rose-500/10 via-orange-500/5 to-transparent border-rose-500/30 dark:border-rose-500/20 shadow-rose-500/5',
      glowColor: 'bg-rose-500/20 dark:bg-rose-500/15',
      beaconColor: '#f43f5e',
      statusBadge: 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30',
      titleHe: 'סגור למעבר',
      titleEn: 'BRIDGE IS CLOSED',
      description: 'המעבר חסום עקב זרימה חזקה או עליית מפלס המים בסמוך לשבע טחנות.',
      icon: <XCircle className="w-8 h-8 text-rose-600 dark:text-rose-400" />,
    };
  } else if (!isOpen) {
    config = {
      cardBg: 'from-amber-500/10 via-yellow-500/5 to-transparent border-amber-500/30 dark:border-amber-500/20 shadow-amber-500/5',
      glowColor: 'bg-amber-500/20 dark:bg-amber-500/15',
      beaconColor: '#f59e0b',
      statusBadge: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30',
      titleHe: 'סטטוס בבדיקה',
      titleEn: 'STATUS PENDING',
      description: 'המערכת ממתינה לעדכון נתונים נוסף מאתר גני יהושע.',
      icon: <AlertCircle className="w-8 h-8 text-amber-600 dark:text-amber-400" />,
    };
  }

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border glass-panel bg-gradient-to-br ${config.cardBg} p-6 sm:p-10 shadow-xl transition-all duration-300 flex flex-col justify-between`}
    >
      {/* Ambient background glow orb */}
      <div
        className={`pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full ${config.glowColor} blur-3xl`}
      />
      <div
        className={`pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full ${config.glowColor} blur-3xl`}
      />

      {/* Top Bar inside Card */}
      <div className="relative flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2.5">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider border uppercase ${config.statusBadge}`}
          >
            <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
            {config.titleEn}
          </span>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-200/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border border-slate-300/40 dark:border-slate-700/40">
            {rawText}
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
          <span>מעודכן ישירות מפארק הירקון</span>
        </div>
      </div>

      {/* Main Content & Illustration Area */}
      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto">
        {/* Text Details (7 cols on desktop) */}
        <div className="lg:col-span-7 flex flex-col space-y-4 text-center lg:text-right">
          <div className="flex items-center justify-center lg:justify-start gap-4">
            <div className="p-3 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-md">
              {config.icon}
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wide uppercase">
                סטטוס נוכחי
              </span>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                {config.titleHe}
              </h2>
            </div>
          </div>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
            {config.description}
          </p>
        </div>

        {/* Modern Vector Illustration of Sheva Tahanot Bridge (5 cols on desktop) */}
        <div className="lg:col-span-5 flex items-center justify-center">
          <div className="relative w-full max-w-[280px] sm:max-w-[320px] aspect-[4/3] rounded-2xl p-4 bg-white/50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 shadow-inner flex items-center justify-center">
            <svg
              viewBox="0 0 200 120"
              className="w-full h-full drop-shadow-md"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Sky backdrop shimmer */}
              <rect x="10" y="10" width="180" height="100" rx="12" fill="currentColor" className="text-slate-100/50 dark:text-slate-800/30" />

              {/* Distant Trees on Riverbank */}
              <path
                d="M15 75 Q 30 65 45 75 Q 60 62 75 75"
                stroke="currentColor"
                className="text-emerald-500/30 dark:text-emerald-400/20"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M125 75 Q 140 64 155 75 Q 170 66 185 75"
                stroke="currentColor"
                className="text-emerald-500/30 dark:text-emerald-400/20"
                strokeWidth="2"
                fill="none"
              />

              {/* Bridge Suspension Cables */}
              <path
                d="M25 65 Q 65 32 100 58 Q 135 32 175 65"
                stroke="currentColor"
                className="text-slate-400 dark:text-slate-500"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Vertical Cables */}
              <line x1="55" y1="45" x2="55" y2="72" stroke="currentColor" className="text-slate-300 dark:text-slate-600" strokeWidth="1.2" strokeDasharray="2 2" />
              <line x1="75" y1="52" x2="75" y2="72" stroke="currentColor" className="text-slate-300 dark:text-slate-600" strokeWidth="1.2" strokeDasharray="2 2" />
              <line x1="125" y1="52" x2="125" y2="72" stroke="currentColor" className="text-slate-300 dark:text-slate-600" strokeWidth="1.2" strokeDasharray="2 2" />
              <line x1="145" y1="45" x2="145" y2="72" stroke="currentColor" className="text-slate-300 dark:text-slate-600" strokeWidth="1.2" strokeDasharray="2 2" />

              {/* Bridge Tower 1 */}
              <rect x="45" y="28" width="8" height="48" rx="2" fill="currentColor" className="text-slate-700 dark:text-slate-300" />
              {/* Tower 1 Status Beacon */}
              <circle cx="49" cy="24" r="3.5" fill={config.beaconColor} />
              <circle cx="49" cy="24" r="7" stroke={config.beaconColor} strokeWidth="1.5" opacity="0.4" className="animate-ping" />

              {/* Bridge Tower 2 */}
              <rect x="147" y="28" width="8" height="48" rx="2" fill="currentColor" className="text-slate-700 dark:text-slate-300" />
              {/* Tower 2 Status Beacon */}
              <circle cx="151" cy="24" r="3.5" fill={config.beaconColor} />
              <circle cx="151" cy="24" r="7" stroke={config.beaconColor} strokeWidth="1.5" opacity="0.4" className="animate-ping" />

              {/* Main Roadway Deck */}
              <rect x="18" y="70" width="164" height="6" rx="2" fill="currentColor" className="text-slate-800 dark:text-slate-200" />
              <rect x="20" y="74" width="160" height="2" fill={config.beaconColor} opacity="0.8" />

              {/* Yarkon River Water Waves */}
              <path
                d="M10 88 C 30 84, 50 92, 70 88 C 90 84, 110 92, 130 88 C 150 84, 170 92, 190 88"
                stroke="#0284c7"
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity="0.8"
              />
              <path
                d="M20 98 C 45 94, 65 102, 90 98 C 115 94, 135 102, 160 98 C 175 95, 185 98, 195 98"
                stroke="#38bdf8"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.6"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
