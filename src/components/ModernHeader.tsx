import React from 'react';
import { Waves, ExternalLink } from 'lucide-react';
import { ManualRefreshButton } from './ManualRefreshButton';
import { ThemeToggle } from './ThemeToggle';

interface ModernHeaderProps {
  status: 'OPEN' | 'CLOSED' | 'UNKNOWN';
}

export function ModernHeader({ status }: ModernHeaderProps) {
  const isOpen = status === 'OPEN';

  return (
    <header className="sticky top-4 z-40 w-full mb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 p-3.5 sm:p-4 rounded-2xl glass-panel shadow-lg shadow-black/5 dark:shadow-black/20 border border-slate-200/80 dark:border-slate-800/80">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="relative p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Waves className="w-5 h-5" />
              <span
                className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ${
                  isOpen ? 'bg-emerald-500 ring-2 ring-emerald-500/30' : 'bg-rose-500 ring-2 ring-rose-500/30'
                } animate-pulse`}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                  גשר שבע טחנות
                </span>
                <span className="hidden sm:inline-flex text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                  פארק הירקון
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                ניטור מעבר להולכי רגל ורוכבי אופניים בזמן אמת
              </p>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ManualRefreshButton />
            <ThemeToggle />
            <a
              href="https://park.co.il/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="לאתר פארק הירקון הרשמי"
              className="p-2.5 sm:px-3 sm:py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 transition-colors flex items-center gap-1.5"
              title="לאתר פארק הירקון הרשמי"
            >
              <span className="hidden md:inline">אתר הפארק</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
