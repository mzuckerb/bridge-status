import { getStoredStatus } from '@/lib/storage';
import { ModernHeader } from '@/components/ModernHeader';
import { BridgeHeroCard } from '@/components/BridgeHeroCard';
import { TimeDetailsCard } from '@/components/TimeDetailsCard';
import { StatusHistoryTable } from '@/components/StatusHistoryTable';
import { Sparkles, MapPin } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const data = await getStoredStatus();

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Sticky Top Navigation */}
      <ModernHeader status={data.status} />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 flex flex-col gap-8">
        {/* Main Hero Card */}
        <section>
          <BridgeHeroCard status={data.status} rawText={data.rawText} />
        </section>

        {/* Schedule & Timing Bento Grid */}
        <section>
          <TimeDetailsCard
            lastCheckedAt={data.lastCheckedAt}
            sourceDate={data.sourceDate}
            nextScheduledCheckAt={data.nextScheduledCheckAt}
          />
        </section>

        {/* Schedule Cadence Info Card */}
        <section className="rounded-2xl glass-panel p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                זמני בדיקה אוטומטיים
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                המערכת דוגמת את אתר פארק הירקון מדי יום בשעות <strong>07:00</strong> ו-<strong>17:00</strong> (שעון ישראל).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>פארק גני יהושע, תל אביב-יפו</span>
          </div>
        </section>

        {/* Audit History Log */}
        <section>
          <StatusHistoryTable history={data.history} />
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200/70 dark:border-slate-800/70 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            הנתונים נדגמים ישירות מאתר גני יהושע הרשמי לשירות המטיילים ורוכבי האופניים.
          </p>
          <p className="font-mono text-[11px]">
            Sheva Tahanot Bridge Status · 2026
          </p>
        </div>
      </footer>
    </div>
  );
}
