import React, { useRef, useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Info, Calendar, Droplets } from 'lucide-react';
import { DailyForecastItem, Region, HourlyForecastItem } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';
import { generateContinuousHourlyForecast } from '../services/weatherEngine';

interface ForecastSummaryProps {
  forecasts: DailyForecastItem[];
  selectedRegion?: Region;
  hourlyData?: HourlyForecastItem[];
  isLive?: boolean;
  onViewAll?: () => void;
}

export const ForecastSummary: React.FC<ForecastSummaryProps> = ({
  forecasts,
  selectedRegion,
  hourlyData: liveHourlyData,
  isLive = false,
  onViewAll,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showInfoTooltip, setShowInfoTooltip] = useState(false);

  // 1. Urutkan & Bikin Data Per Jam Kontinu
  const displayHourlyData = useMemo<HourlyForecastItem[]>(() => {
    let baseData: HourlyForecastItem[] = [];

    if (liveHourlyData && liveHourlyData.length > 0) {
      baseData = [...liveHourlyData];
    } else {
      const region = selectedRegion || {
        id: '33.02.27',
        name: 'Purwokerto Utara',
        type: 'kecamatan',
        lat: -7.4008,
        lng: 109.2458,
        elevationMeters: 130,
      };
      baseData = generateContinuousHourlyForecast(region, undefined, 48);
    }

    const sorted = baseData.sort((a, b) => {
      const timeA = new Date(a.time).getTime();
      const timeB = new Date(b.time).getTime();
      return timeA - timeB;
    });

    const continuous: HourlyForecastItem[] = [];
    for (let i = 0; i < sorted.length; i++) {
      const current = sorted[i];
      continuous.push(current);

      if (i < sorted.length - 1) {
        const next = sorted[i + 1];
        const timeCurrent = new Date(current.time).getTime();
        const timeNext = new Date(next.time).getTime();
        const diffHours = Math.round((timeNext - timeCurrent) / (1000 * 60 * 60));

        if (diffHours > 1 && diffHours <= 6) {
          for (let h = 1; h < diffHours; h++) {
            const fillTime = new Date(timeCurrent + h * 60 * 60 * 1000);
            const hourNum = fillTime.getHours();
            const ratio = h / diffHours;

            const fillTemp = Math.round((current.temp + (next.temp - current.temp) * ratio) * 10) / 10;
            const fillHum = Math.round(current.humidity + (next.humidity - current.humidity) * ratio);
            const fillWind = Math.round((current.windSpeed + (next.windSpeed - current.windSpeed) * ratio) * 10) / 10;

            const dateFormatted = new Intl.DateTimeFormat('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              timeZone: 'Asia/Jakarta',
            }).format(fillTime);

            continuous.push({
              time: fillTime.toISOString(),
              timeFormatted: `${String(hourNum).padStart(2, '0')}.00`,
              date: fillTime.toISOString().split('T')[0],
              dateFormatted,
              hour: hourNum,
              temp: fillTemp,
              condition: ratio < 0.5 ? current.condition : next.condition,
              humidity: fillHum,
              rainProb: Math.round(current.rainProb + (next.rainProb - current.rainProb) * ratio),
              windSpeed: fillWind,
              windDirection: current.windDirection,
              windArrow: current.windArrow,
              visibility: current.visibility,
              isNight: hourNum >= 18 || hourNum < 6,
            });
          }
        }
      }
    }

    return continuous;
  }, [liveHourlyData, selectedRegion]);

  // 2. Grouping Berdasarkan Tanggal untuk Header
  const groupedByDate = useMemo(() => {
    const groups: { dateFormatted: string; items: HourlyForecastItem[] }[] = [];
    displayHourlyData.forEach((item) => {
      const lastGroup = groups[groups.length - 1];
      if (lastGroup && lastGroup.dateFormatted === item.dateFormatted) {
        lastGroup.items.push(item);
      } else {
        groups.push({
          dateFormatted: item.dateFormatted,
          items: [item],
        });
      }
    });
    return groups;
  }, [displayHourlyData]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 288; // 4 kartu * 72px
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const formatSpeed = (val: number) => val.toString().replace('.', ',');

  const ITEM_WIDTH = 72; // Ukuran tetap per kolom jam (72px)

  return (
    <div className="w-full bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 border border-slate-200/90 shadow-2xs transition-all space-y-3.5 sm:space-y-5">
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2.5 relative min-w-0">
          <h3 className="text-sm sm:text-lg font-extrabold text-slate-900 tracking-tight truncate">
            Prakiraan per Jam (WIB)
          </h3>

          {isLive ? (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              LIVE
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200 shrink-0">
              BMKG
            </span>
          )}

          <button
            type="button"
            onClick={() => setShowInfoTooltip(!showInfoTooltip)}
            className="text-slate-400 hover:text-slate-700 transition-colors p-0.5 rounded-full shrink-0 cursor-pointer"
            aria-label="Informasi Prakiraan"
          >
            <Info size={16} className="stroke-[2.2] sm:w-[18px] sm:h-[18px]" />
          </button>

          {showInfoTooltip && (
            <div className="absolute top-8 left-0 z-30 w-64 sm:w-72 p-3 bg-slate-900/95 text-white text-xs rounded-xl shadow-xl backdrop-blur-md border border-slate-700 animate-in fade-in zoom-in-95">
              <p className="font-bold text-sky-400 mb-1">Prakiraan Cuaca Resmi BMKG</p>
              <p className="text-slate-300 text-[10px] sm:text-[11px] leading-relaxed">
                Data terhubung langsung ke API Publik BMKG (api.bmkg.go.id) sesuai wilayah administratif desa/kecamatan di Kabupaten Banyumas.
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {onViewAll && (
            <button
              onClick={onViewAll}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 transition-colors cursor-pointer"
            >
              <Calendar size={12} className="sm:w-[13px] sm:h-[13px]" />
              <span>30 Hari</span>
            </button>
          )}

          <div className="hidden xs:flex items-center gap-1">
            <button
              onClick={() => handleScroll('left')}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center transition-colors shadow-2xs active:scale-95 cursor-pointer"
              aria-label="Geser ke kiri"
            >
              <ChevronLeft size={16} className="stroke-[2.5]" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center transition-colors shadow-2xs active:scale-95 cursor-pointer"
              aria-label="Geser ke kanan"
            >
              <ChevronRight size={16} className="stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div
        ref={scrollContainerRef}
        className="overflow-x-auto pb-1.5 pt-0.5 select-none no-scrollbar touch-pan-x scroll-smooth"
      >
        <div className="inline-flex flex-col gap-2">
          {/* Row 0: Header Tanggal yang Presisi Memayungi Jam di bawahnya */}
          <div className="flex items-center gap-2">
            {groupedByDate.map((group) => {
              const groupWidth = group.items.length * ITEM_WIDTH + (group.items.length - 1) * 8; // Calc total width termasuk gap 8px (gap-2)
              return (
                <div
                  key={group.dateFormatted}
                  style={{ width: `${groupWidth}px`, minWidth: `${groupWidth}px` }}
                  className="px-2.5 py-1 rounded-xl bg-sky-50/90 border border-sky-200/80 text-sky-950 font-extrabold text-xs truncate shrink-0"
                >
                  {group.dateFormatted}
                </div>
              );
            })}
          </div>

          {/* Row 1: Kartu Per Jam */}
          <div className="inline-flex items-stretch gap-2">
            {displayHourlyData.map((item, idx) => (
              <div
                key={idx}
                style={{ width: `${ITEM_WIDTH}px`, minWidth: `${ITEM_WIDTH}px` }}
                className="flex flex-col items-center gap-1 shrink-0 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 px-1.5 py-2.5 transition-colors"
              >
                <span className="text-xs font-bold text-slate-600">{item.timeFormatted}</span>

                <div className="py-0.5">
                  <WeatherIcon condition={item.condition} size={28} isNight={item.isNight} />
                </div>

                <span className="text-base font-extrabold text-slate-900 tracking-tight">
                  {Math.round(item.temp)}°
                </span>

                <span
                  className={`flex items-center gap-0.5 text-[10px] font-bold h-3.5 ${
                    item.rainProb > 0 ? 'text-sky-600' : 'text-transparent'
                  }`}
                >
                  <Droplets size={10} className={item.rainProb > 0 ? 'fill-sky-100' : ''} />
                  {item.rainProb > 0 ? `${item.rainProb}%` : '0%'}
                </span>

                <div className="w-full h-px bg-slate-200 my-0.5" />

                <div className="flex items-center gap-1 text-[10px] text-slate-500 font-semibold">
                  <span className="text-slate-700">{item.windArrow}</span>
                  <span>{formatSpeed(item.windSpeed)} km/h</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};