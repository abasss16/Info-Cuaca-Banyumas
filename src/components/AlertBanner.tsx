import React from 'react';
import { AlertTriangle, ChevronRight, CheckCircle2 } from 'lucide-react';
import { WeatherAlert } from '../types/weather';

interface AlertBannerProps {
  alerts: WeatherAlert[];
  onViewDetails: () => void;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({
  alerts,
  onViewDetails,
}) => {
  const activeAlert = alerts.find((a) => a.isActive);

  // Status Aman (Tanpa Peringatan Aktif)
  if (!activeAlert) {
    return (
      <div className="w-full glass-card rounded-2xl p-3 sm:p-4 border border-sky-200/80 bg-sky-50/40 flex items-center justify-between gap-2.5 shadow-2xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 border border-sky-200">
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-[11px] sm:text-xs font-bold text-slate-800 uppercase tracking-wider truncate">
              Status Cuaca Terpantau Aman
            </h4>
            <p className="text-[11px] sm:text-xs text-slate-600 font-medium truncate">
              Tidak ada peringatan Aktif Saat Ini
            </p>
          </div>
        </div>
        <button
          onClick={onViewDetails}
          className="px-2.5 py-1.5 sm:px-3.5 rounded-xl text-[11px] sm:text-xs font-bold text-sky-800 bg-white hover:bg-sky-50 border border-sky-200/80 shadow-2xs transition-colors shrink-0 cursor-pointer"
        >
          Detail
        </button>
      </div>
    );
  }

  // Status Ada Peringatan Aktif (Extreme Weather Alert)
  return (
    <div className="w-full rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 bg-gradient-to-r from-rose-50 via-amber-50 to-rose-50 border border-rose-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
      <div className="flex items-start gap-2.5 sm:gap-3.5 min-w-0">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-rose-500/20 animate-pulse mt-0.5">
          <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-tight">
              Peringatan Dini BMKG
            </h4>
            <span className="px-1.5 py-0.2 text-[9px] sm:text-[10px] font-black uppercase bg-rose-200/90 text-rose-950 rounded-md border border-rose-300">
              {activeAlert.levelLabel}
            </span>
          </div>
          <p className="text-[11px] sm:text-xs font-medium text-slate-700 mt-0.5 line-clamp-1 sm:line-clamp-2 leading-relaxed">
            {activeAlert.description}
          </p>
          <p className="text-[10px] sm:text-[11px] font-bold text-rose-700 mt-0.5">
            Berlaku: {activeAlert.validFrom} – {activeAlert.validUntil}
          </p>
        </div>
      </div>

      <button
        onClick={onViewDetails}
        className="w-full sm:w-auto px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 shadow-xs transition-all flex items-center justify-center gap-1 shrink-0 cursor-pointer"
      >
        <span>Lihat Mitigasi</span>
        <ChevronRight size={14} />
      </button>
    </div>
  );
};