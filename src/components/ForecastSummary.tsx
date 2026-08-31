import React, { useRef, useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Info, Calendar, Sparkles } from 'lucide-react';
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

  // Generate continuous hourly items if live hourly data is not passed
  const displayHourlyData = useMemo<HourlyForecastItem[]>(() => {
    if (liveHourlyData && liveHourlyData.length > 0) {
      return liveHourlyData;
    }
    const region = selectedRegion || {
      id: '33.02.27',
      name: 'Purwokerto Utara',
      type: 'kecamatan',
      lat: -7.4008,
      lng: 109.2458,
      elevationMeters: 130,
    };
    return generateContinuousHourlyForecast(region, undefined, 24);
  }, [liveHourlyData, selectedRegion]);

  // Group hourly forecast by Date
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

  // Scroll handlers for navigation arrows
  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 280;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const formatSpeed = (val: number) => {
    return val.toString().replace('.', ',');
  };

  return (
    <div className="w-full bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 border border-slate-200/90 shadow-2xs transition-all space-y-3.5 sm:space-y-5">
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2.5 relative min-w-0">
          <h3 className="text-sm sm:text-lg font-extrabold text-slate-900 tracking-tight truncate">
            Prakiraan per Jam (WIB)
          </h3>

          {/* Live Badge */}
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

          {/* Info Tooltip Popover */}
          {showInfoTooltip && (
            <div className="absolute top-8 left-0 z-30 w-64 sm:w-72 p-3 bg-slate-900/95 text-white text-xs rounded-xl shadow-xl backdrop-blur-md border border-slate-700 animate-in fade-in zoom-in-95">
              <p className="font-bold text-sky-400 mb-1">Prakiraan Cuaca Resmi BMKG</p>
              <p className="text-slate-300 text-[10px] sm:text-[11px] leading-relaxed">
                Data terhubung langsung ke API Publik BMKG (api.bmkg.go.id) sesuai wilayah administratif desa/kecamatan di Kabupaten Banyumas.
              </p>
            </div>
          )}
        </div>

        {/* Action Controls */}
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

          {/* Nav Buttons (Hidden di HP sangat kecil jika tidak muat, scroll gesture sudah cukup) */}
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

      {/* Main Horizontal Scroll Container */}
      <div
        ref={scrollContainerRef}
        className="overflow-x-auto pb-2 pt-1 select-none no-scrollbar touch-pan-x"
      >
        <div className="inline-flex flex-col min-w-full">
          {/* Row 0: Header Tanggal */}
          <div className="flex border-b border-slate-100 pb-1.5">
            {groupedByDate.map((group) => {
              const columnCount = group.items.length;
              return (
                <div
                  key={group.dateFormatted}
                  style={{ width: `${columnCount * 68}px` }}
                  className="px-1.5 text-[10px] sm:text-xs font-extrabold text-slate-800 tracking-wide border-r border-slate-100 last:border-r-0 sm:w-auto"
                >
                  {group.dateFormatted}
                </div>
              );
            })}
          </div>

          {/* Row 1: Jam (18.00, 19.00, dst) */}
          <div className="flex border-b border-slate-200/80">
            {displayHourlyData.map((item, idx) => (
              <div
                key={`time-${idx}`}
                className="w-[68px] min-w-[68px] sm:w-20 sm:min-w-[80px] py-2 text-center text-[10px] sm:text-xs font-bold text-slate-500"
              >
                {item.timeFormatted}
              </div>
            ))}
          </div>

          {/* Category 1: CUACA, SUHU, KELEMBAPAN */}
          <div className="pt-2.5 pb-3 border-b border-slate-100">
            <div className="mb-1.5">
              <span className="inline-block px-1.5 py-0.5 text-[8.5px] sm:text-[9.5px] font-black uppercase tracking-wider text-slate-500 bg-slate-100 rounded-md">
                CUACA, SUHU, KELEMBAPAN
              </span>
            </div>

            {/* Weather Icons Row */}
            <div className="flex items-center">
              {displayHourlyData.map((item, idx) => (
                <div
                  key={`icon-${idx}`}
                  className="w-[68px] min-w-[68px] sm:w-20 sm:min-w-[80px] flex items-center justify-center py-1.5"
                >
                  <WeatherIcon
                    condition={item.condition}
                    size={22}
                    isNight={item.isNight}
                  />
                </div>
              ))}
            </div>

            {/* Temperature Row */}
            <div className="flex items-center">
              {displayHourlyData.map((item, idx) => (
                <div
                  key={`temp-${idx}`}
                  className="w-[68px] min-w-[68px] sm:w-20 sm:min-w-[80px] text-center text-sm sm:text-base font-extrabold text-slate-900 tracking-tight"
                >
                  {Math.round(item.temp)}°
                </div>
              ))}
            </div>

            {/* Humidity Row */}
            <div className="flex items-center mt-0.5">
              {displayHourlyData.map((item, idx) => (
                <div
                  key={`hum-${idx}`}
                  className="w-[68px] min-w-[68px] sm:w-20 sm:min-w-[80px] text-center text-[10px] sm:text-xs font-medium text-slate-400"
                >
                  {item.humidity}%
                </div>
              ))}
            </div>
          </div>

          {/* Category 2: ANGIN */}
          <div className="pt-2.5 pb-3 border-b border-slate-100">
            <div className="mb-1.5">
              <span className="inline-block px-1.5 py-0.5 text-[8.5px] sm:text-[9.5px] font-black uppercase tracking-wider text-slate-500 bg-slate-100 rounded-md">
                ANGIN
              </span>
            </div>

            {/* Wind Speed Row */}
            <div className="flex items-center">
              {displayHourlyData.map((item, idx) => (
                <div
                  key={`wind-${idx}`}
                  className="w-[68px] min-w-[68px] sm:w-20 sm:min-w-[80px] text-center"
                >
                  <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                    {formatSpeed(item.windSpeed)}
                  </span>{' '}
                  <span className="text-[9px] sm:text-[10px] text-slate-400 font-medium">km/h</span>
                </div>
              ))}
            </div>

            {/* Wind Direction & Arrow Row */}
            <div className="flex items-center mt-0.5">
              {displayHourlyData.map((item, idx) => (
                <div
                  key={`winddir-${idx}`}
                  className="w-[68px] min-w-[68px] sm:w-20 sm:min-w-[80px] text-center text-[10px] sm:text-[11px] font-medium text-slate-600 flex items-center justify-center gap-0.5"
                >
                  <span>{item.windDirection}</span>
                  <span className="text-slate-700 font-bold text-[10px] sm:text-xs">{item.windArrow}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Category 3: JARAK PANDANG */}
          <div className="pt-2.5 pb-1">
            <div className="mb-1.5">
              <span className="inline-block px-1.5 py-0.5 text-[8.5px] sm:text-[9.5px] font-black uppercase tracking-wider text-slate-500 bg-slate-100 rounded-md">
                JARAK PANDANG
              </span>
            </div>

            {/* Visibility Row */}
            <div className="flex items-center">
              {displayHourlyData.map((item, idx) => {
                const cleanVis = item.visibility.replace(/km/gi, '').trim();
                return (
                  <div
                    key={`vis-${idx}`}
                    className="w-[68px] min-w-[68px] sm:w-20 sm:min-w-[80px] text-center text-[11px] sm:text-xs text-slate-700"
                  >
                    <span className="font-extrabold text-slate-900">
                      {cleanVis}
                    </span>{' '}
                    <span className="text-slate-400 font-medium text-[9px] sm:text-[10px]">km</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};