import { getStoredStatus } from '@/lib/storage';
import { BridgeHeroCard } from '@/components/BridgeHeroCard';
import { TimeDetailsCard } from '@/components/TimeDetailsCard';
import { StatusHistoryTable } from '@/components/StatusHistoryTable';
import { ManualRefreshButton } from '@/components/ManualRefreshButton';
import { ExternalLink, Waves } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const data = await getStoredStatus();

  return (
    <main className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto flex flex-col gap-8">
      {/* Top Navigation / Header */}
      <header className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400">
            <Waves className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              מצב גשר שבע טחנות
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              פארק הירקון — גני יהושע | ניטור מעבר הולכי רגל ורוכבי אופניים
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ManualRefreshButton />
          <a
            href="https://park.co.il/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
          >
            <span>אתר הפארק הרשמי</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </header>

      {/* Main Hero Status Banner */}
      <section>
        <BridgeHeroCard status={data.status} rawText={data.rawText} />
      </section>

      {/* Timestamp & Schedule Details */}
      <section>
        <TimeDetailsCard
          lastCheckedAt={data.lastCheckedAt}
          sourceDate={data.sourceDate}
          nextScheduledCheckAt={data.nextScheduledCheckAt}
        />
      </section>

      {/* Automated Schedule Explanatory Card */}
      <section className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/70 text-slate-300 text-sm leading-relaxed flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <p>
            <strong>לוח זמני הבדיקה:</strong> המערכת דוגמת באופן אוטומטי את אתר פארק הירקון פעמיים בכל יום:
            בשעה <strong>07:00</strong> בבוקר ובשעה <strong>17:00</strong> בערב (לפי שעון ישראל).
          </p>
        </div>
      </section>

      {/* Historical Audit Log */}
      <section>
        <StatusHistoryTable history={data.history} />
      </section>

      {/* Footer */}
      <footer className="mt-auto pt-8 border-t border-slate-800/60 text-center text-xs text-slate-500">
        <p>
          המידע נדגם מתוך אתר גני יהושע הרשמי (park.co.il) לשם נוחות רוכבי האופניים והמטיילים.
        </p>
      </footer>
    </main>
  );
}
