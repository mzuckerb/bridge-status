import React from 'react';
import { BridgeState } from '@/lib/types';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface BridgeHeroCardProps {
  status: BridgeState;
  rawText: string;
}

export function BridgeHeroCard({ status, rawText }: BridgeHeroCardProps) {
  const isOpen = status === 'OPEN';
  const isClosed = status === 'CLOSED';

  let config = {
    bg: 'bg-emerald-950/40 border-emerald-500/40 shadow-emerald-950/60 text-emerald-400',
    glow: 'from-emerald-500/20 to-teal-500/0',
    titleHe: 'פתוח למעבר',
    titleEn: 'BRIDGE IS OPEN',
    badge: 'bg-emerald-500 text-slate-950 font-bold',
    icon: <CheckCircle2 className="w-16 h-16 text-emerald-400 animate-pulse" />,
    description: 'המעבר להולכי רגל ורוכבי אופניים פתוח ובטוח לתנועה.',
  };

  if (isClosed) {
    config = {
      bg: 'bg-rose-950/40 border-rose-500/40 shadow-rose-950/60 text-rose-400',
      glow: 'from-rose-500/20 to-orange-500/0',
      titleHe: 'סגור למעבר',
      titleEn: 'BRIDGE IS CLOSED',
      badge: 'bg-rose-500 text-white font-bold',
      icon: <XCircle className="w-16 h-16 text-rose-400 animate-pulse" />,
      description: 'הגשר חסום עקב זרימה חזקה או עליית מפלס מי הירקון.',
    };
  } else if (!isOpen) {
    config = {
      bg: 'bg-amber-950/40 border-amber-500/40 shadow-amber-950/60 text-amber-400',
      glow: 'from-amber-500/20 to-yellow-500/0',
      titleHe: 'סטטוס לא ודאי',
      titleEn: 'STATUS UNCERTAIN',
      badge: 'bg-amber-500 text-slate-950 font-bold',
      icon: <AlertCircle className="w-16 h-16 text-amber-400" />,
      description: 'לא ניתן היה לאמת את הסטטוס בוודאות מול אתר הפארק.',
    };
  }

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border-2 p-8 md:p-12 shadow-2xl transition-all duration-300 ${config.bg}`}
    >
      {/* Background ambient radial gradient glow */}
      <div
        className={`pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-gradient-to-br ${config.glow} blur-3xl`}
      />

      <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-col items-center md:items-start text-center md:text-right space-y-3">
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center rounded-full px-4 py-1 text-sm tracking-wide uppercase ${config.badge}`}
            >
              {config.titleEn}
            </span>
            <span className="text-xs text-slate-400 font-mono tracking-wider">
              {rawText}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">
            {config.titleHe}
          </h1>

          <p className="text-lg text-slate-300 max-w-xl">
            {config.description}
          </p>
        </div>

        <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
          {config.icon}
          <span className="mt-3 text-xs text-slate-400 font-semibold tracking-wider uppercase">
            שבע טחנות
          </span>
        </div>
      </div>
    </div>
  );
}
