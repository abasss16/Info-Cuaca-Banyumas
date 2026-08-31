import React from 'react';
import {
  Droplets,
  Wind,
  Gauge,
  Eye,
  Sun,
  Clock,
  RefreshCw,
} from 'lucide-react';
import { CurrentWeather } from '../types/weather';
import { WeatherIllustration } from './WeatherIcon';

interface WeatherSummaryCardProps {
  weather: CurrentWeather;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export const WeatherSummaryCard: React.FC<WeatherSummaryCardProps> = ({
  weather,
  onRefresh,
  isLoading = false,
}) => {
  return (
    <div className="w-full glass-card rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 transition-all">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-6 items-stretch">
        {/* Left Section: Hero Weather Card with Gradient */}
        <div className="lg:col-span-5 flex flex-col items-center justify-between text-center p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-sky-500 via-sky-600 to-blue-700 text-white shadow-md relative overflow-hidden">
          {/* Subtle Background Radial Glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-sky-400/20 rounded-full blur-2xl pointer-events-none" />

          {/* Top Status & Refresh Button (Dengan Jarak Bawah Tambahan) */}
          <div className="flex items-center justify-between w-full relative z-10 mb-3 sm:mb-4">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-sky-100/90 bg-white/15 backdrop-blur-md px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-white/20">
                Kondisi Saat Ini
              </span>
              {weather.source?.includes('BMKG Live') && (
                <span className="inline-flex items-center gap-1 text-[8px] sm:text-[9px] font-extrabold uppercase tracking-wider text-emerald-300 bg-emerald-950/40 backdrop-blur-md px-1.5 sm:px-2 py-0.5 rounded-full border border-emerald-400/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live BMKG
                </span>
              )}
            </div>
            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={isLoading}
                title="Tarik data live BMKG detik ini juga (Bypass cache)"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] sm:text-xs font-semibold text-white bg-white/15 hover:bg-white/25 active:scale-95 disabled:opacity-75 rounded-xl transition-all border border-white/25 shadow-xs cursor-pointer shrink-0 group"
              >
                <RefreshCw size={12} className={`transition-transform ${isLoading ? 'animate-spin text-amber-300' : 'group-hover:rotate-180 duration-500'}`} />
                <span className="hidden xs:inline sm:inline">{isLoading ? 'Memperbarui...' : 'Refresh'}</span>
              </button>
            )}
          </div>

          {/* Big Temperature & 3D Illustration Layout */}
          <div className="my-1 sm:my-2 flex flex-row sm:flex-col items-center justify-center gap-3 sm:gap-1 relative z-10 w-full">
            <div className="shrink-0">
              <WeatherIllustration code={weather.condition.code} className="w-16 h-16 sm:w-28 sm:h-28 drop-shadow-md" />
            </div>

            <div className="flex flex-col items-start sm:items-center text-left sm:text-center">
              <div className="flex items-baseline justify-center">
                <span className="text-4xl sm:text-6xl font-extrabold tracking-tighter text-white">
                  {Math.round(weather.temp)}
                </span>
                <span className="text-xl sm:text-3xl font-semibold text-sky-200 ml-0.5">°C</span>
              </div>

              <h3 className="text-sm sm:text-lg font-bold text-white tracking-tight leading-tight">
                {weather.condition.name}
              </h3>
              <p className="text-[11px] sm:text-xs text-sky-100/80 font-medium">
                Terasa seperti {Math.round(weather.feelsLike)}°C
              </p>
            </div>
          </div>

          {/* Bottom Timestamp */}
          <div className="w-full pt-2.5 sm:pt-3 border-t border-white/15 flex items-center justify-between text-[10px] sm:text-[11px] text-sky-100/80 relative z-10 mt-3 sm:mt-4">
            <span className="truncate max-w-[140px] sm:max-w-[170px]" title={weather.source || 'BMKG Pos Banyumas'}>
              {weather.source?.includes('BMKG') ? weather.source.replace(' (api.bmkg.go.id)', '') : 'Stasiun Tunggul Wulung'}
            </span>
            <span className="font-semibold text-white shrink-0">{weather.updatedAtFormatted}</span>
          </div>
        </div>

        {/* Right Section: 6 Metrics Grid */}
        <div className="lg:col-span-7 grid grid-cols-2 gap-2 sm:gap-3.5 content-center">
          {/* 1. Kelembapan */}
          <div className="flex items-center gap-2.5 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/90 border border-slate-200/80 shadow-2xs">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 border border-sky-100">
              <Droplets className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">
                Kelembapan
              </p>
              <p className="text-sm sm:text-lg font-extrabold text-slate-800">
                {weather.humidity}%
              </p>
            </div>
          </div>

          {/* 2. Angin */}
          <div className="flex items-center gap-2.5 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/90 border border-slate-200/80 shadow-2xs">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 border border-teal-100">
              <Wind className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">Angin</p>
              <p className="text-sm sm:text-lg font-extrabold text-slate-800 leading-tight truncate">
                {weather.windSpeed} <span className="text-[10px] sm:text-xs font-semibold text-slate-500">km/h</span>
              </p>
            </div>
          </div>

          {/* 3. Tekanan Udara */}
          <div className="flex items-center gap-2.5 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/90 border border-slate-200/80 shadow-2xs">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
              <Gauge className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">
                Tekanan
              </p>
              <p className="text-sm sm:text-lg font-extrabold text-slate-800 truncate">
                {weather.pressure} <span className="text-[10px] sm:text-xs font-semibold text-slate-500">hPa</span>
              </p>
            </div>
          </div>

          {/* 4. Jarak Pandang */}
          <div className="flex items-center gap-2.5 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/90 border border-slate-200/80 shadow-2xs">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0 border border-cyan-100">
              <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">
                Jarak Pandang
              </p>
              <p className="text-sm sm:text-lg font-extrabold text-slate-800 truncate">
                {weather.visibilityText || (weather.visibility >= 10 ? `> ${weather.visibility} km` : `${weather.visibility} km`)}
              </p>
            </div>
          </div>

          {/* 5. UV Index */}
          <div className="flex items-center gap-2.5 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/90 border border-slate-200/80 shadow-2xs">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
              <Sun className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">UV Index</p>
              <div className="flex items-baseline gap-1 truncate">
                <span className="text-sm sm:text-lg font-extrabold text-slate-800">
                  {weather.uvIndex}
                </span>
                <span className="text-[10px] sm:text-xs font-semibold text-slate-500 truncate">
                  {weather.uvDescription}
                </span>
              </div>
            </div>
          </div>

          {/* 6. Diperbarui */}
          <div className="flex items-center gap-2.5 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/90 border border-slate-200/80 shadow-2xs">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">
                Diperbarui
              </p>
              <p className="text-xs sm:text-lg font-extrabold text-slate-800 truncate">
                {weather.updatedAtFormatted}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};