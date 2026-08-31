import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Droplets,
  Wind,
  Thermometer,
  CloudSun,
  Clock,
  Info,
  LayoutGrid,
  List,
  Sparkles,
  Sun,
  CloudRain,
  Sprout,
  Compass,
  Car,
  Database,
} from 'lucide-react';
import { DailyForecastItem, Region } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';

interface WeatherCalendarViewProps {
  forecasts: DailyForecastItem[];
  selectedRegion?: Region | null;
}

export const WeatherCalendarView: React.FC<WeatherCalendarViewProps> = ({
  forecasts,
  selectedRegion,
}) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterType, setFilterType] = useState<
    'all' | 'week1' | 'week2' | 'week3' | 'week4' | 'rain' | 'clear'
  >('all');

  const selectedDay = forecasts[selectedDayIndex] || forecasts[0];

  // Kalkulasi statistik iklim bulanan (30 Hari)
  const monthlyStats = useMemo(() => {
    if (!forecasts || forecasts.length === 0) {
      return {
        rainyDays: 0,
        clearDays: 0,
        avgMinTemp: 23,
        avgMaxTemp: 31,
        totalRainfallMm: 0,
        maxRainProb: 0,
      };
    }

    let rainy = 0;
    let clear = 0;
    let sumMin = 0;
    let sumMax = 0;
    let totalRain = 0;
    let maxProb = 0;

    forecasts.forEach((f) => {
      if (f.condition.isRain || f.rainProb >= 50) {
        rainy++;
      } else {
        clear++;
      }
      sumMin += f.tempMin;
      sumMax += f.tempMax;
      totalRain += f.rainfallExpectedMm || 0;
      if (f.rainProb > maxProb) maxProb = f.rainProb;
    });

    return {
      rainyDays: rainy,
      clearDays: clear,
      avgMinTemp: Math.round((sumMin / forecasts.length) * 10) / 10,
      avgMaxTemp: Math.round((sumMax / forecasts.length) * 10) / 10,
      totalRainfallMm: Math.round(totalRain * 10) / 10,
      maxRainProb: maxProb,
    };
  }, [forecasts]);

  // Filter daftar hari berdasarkan kategori
  const filteredForecasts = useMemo(() => {
    return forecasts.filter((item, idx) => {
      if (filterType === 'all') return true;
      if (filterType === 'week1') return idx >= 0 && idx < 7;
      if (filterType === 'week2') return idx >= 7 && idx < 14;
      if (filterType === 'week3') return idx >= 14 && idx < 21;
      if (filterType === 'week4') return idx >= 21 && idx < 30;
      if (filterType === 'rain') return item.condition.isRain || item.rainProb >= 45;
      if (filterType === 'clear') return !item.condition.isRain && item.rainProb < 45;
      return true;
    });
  }, [forecasts, filterType]);

  // Posisi offset awal hari Senin = 0, Minggu = 6
  const firstDayOffset = useMemo(() => {
    if (!forecasts || forecasts.length === 0) return 0;
    const firstDate = new Date(forecasts[0].date);
    const day = firstDate.getDay();
    return day === 0 ? 6 : day - 1;
  }, [forecasts]);

  const startDateFormatted = forecasts[0]?.dateFormatted || '';
  const endDateFormatted = forecasts[forecasts.length - 1]?.dateFormatted || '';

  const weekDayLabels = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-300">
      {/* Header Halaman */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5 glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-1.5 text-sky-700 font-bold text-[11px] sm:text-xs uppercase tracking-wider">
            <CalendarIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Prakiraan Cuaca 30 Hari</span>
          </div>
          <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900 mt-1 leading-tight">
            Kalender Cuaca {selectedRegion ? `Kec. ${selectedRegion.name}` : 'Kab. Banyumas'}
          </h2>
          <p className="text-[11px] sm:text-sm text-slate-500 mt-1">
            Periode {startDateFormatted} s/d {endDateFormatted}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
          {selectedRegion && (
            <div className="px-3 py-1 rounded-xl bg-sky-50 border border-sky-200 text-[11px] sm:text-xs font-semibold text-sky-900">
              Elevasi: {selectedRegion.elevationMeters}m dpl
            </div>
          )}

          {/* Switcher Grid / List */}
          <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200 ml-auto sm:ml-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-sky-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid size={14} />
              <span className="text-[11px] sm:text-xs">Grid</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white text-sky-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List size={14} />
              <span className="text-[11px] sm:text-xs">Daftar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Rangkuman Iklim 30 Hari */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="glass-card rounded-2xl p-3 sm:p-4 flex flex-col justify-between shadow-2xs border border-slate-200/80">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Cerah / Berawan
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Sun className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3">
            <p className="text-xl sm:text-2xl font-extrabold text-slate-900">
              {monthlyStats.clearDays} <span className="text-xs font-semibold text-slate-500">Hari</span>
            </p>
            <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 truncate">Kondusif luar ruangan</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-3 sm:p-4 flex flex-col justify-between shadow-2xs border border-slate-200/80">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Potensi Hujan
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
              <CloudRain className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3">
            <p className="text-xl sm:text-2xl font-extrabold text-slate-900">
              {monthlyStats.rainyDays} <span className="text-xs font-semibold text-slate-500">Hari</span>
            </p>
            <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 truncate">Siang-sore / orografis</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-3 sm:p-4 flex flex-col justify-between shadow-2xs border border-slate-200/80">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Rata-rata Suhu
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <Thermometer className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3">
            <p className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
              {monthlyStats.avgMinTemp}°-{monthlyStats.avgMaxTemp}°C
            </p>
            <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 truncate">Rentang bulanan</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-3 sm:p-4 flex flex-col justify-between shadow-2xs border border-slate-200/80">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Estimasi Hujan
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3">
            <p className="text-xl sm:text-2xl font-extrabold text-slate-900">
              ~{monthlyStats.totalRainfallMm} <span className="text-xs font-semibold text-slate-500">mm</span>
            </p>
            <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 truncate">Total 30 hari</p>
          </div>
        </div>
      </div>

      {/* Filter Quick Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 text-xs no-scrollbar -mx-1 px-1">
        <span className="text-slate-400 font-semibold text-[11px] shrink-0 mr-1">Filter:</span>
        {[
          { id: 'all', label: 'Semua (30 Hari)' },
          { id: 'week1', label: 'Minggu 1' },
          { id: 'week2', label: 'Minggu 2' },
          { id: 'week3', label: 'Minggu 3' },
          { id: 'week4', label: 'Minggu 4' },
          { id: 'rain', label: 'Hujan', icon: CloudRain },
          { id: 'clear', label: 'Cerah', icon: Sun },
        ].map((f) => {
          const Icon = f.icon;
          const isActive = filterType === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id as any)}
              className={`px-3 py-1.5 rounded-xl font-bold shrink-0 transition-all text-xs flex items-center gap-1 cursor-pointer ${
                isActive
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-white/90 text-slate-700 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              {Icon && <Icon size={12} />}
              <span>{f.label}</span>
            </button>
          );
        })}
      </div>

      {/* VIEW MODE 1: MONTHLY CALENDAR GRID */}
      {viewMode === 'grid' && (
        <div className="glass-card rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 space-y-3 shadow-2xs border border-slate-200/80 overflow-hidden">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <CalendarIcon size={16} className="text-sky-600" />
              <span>Matriks Kalender 30 Hari</span>
            </h3>
            <span className="text-[10px] sm:text-xs text-slate-400">Pilih tanggal</span>
          </div>

          <div className="overflow-x-auto no-scrollbar -mx-1 px-1">
            <div className="min-w-[550px] sm:min-w-full">
              {/* Header Nama Hari */}
              <div className="grid grid-cols-7 gap-1.5 text-center text-[11px] sm:text-xs font-extrabold text-slate-500 py-1.5 border-b border-slate-200/80">
                {weekDayLabels.map((lbl, i) => (
                  <div key={lbl} className={i >= 5 ? 'text-rose-500' : ''}>
                    {lbl}
                  </div>
                ))}
              </div>

              {/* Grid Sel Kalender */}
              <div className="grid grid-cols-7 gap-1.5 sm:gap-2.5 pt-2">
                {/* Cell Kosong Awal */}
                {Array.from({ length: firstDayOffset }).map((_, i) => (
                  <div
                    key={`empty-leading-${i}`}
                    className="min-h-[75px] sm:min-h-[105px] rounded-xl bg-slate-50/40 border border-dashed border-slate-200/50 opacity-30"
                  />
                ))}

                {/* Sel Kalender 30 Hari */}
                {forecasts.map((item, idx) => {
                  const isSelected = selectedDayIndex === idx;
                  const isToday = idx === 0;
                  const dateObj = new Date(item.date);
                  const dayNumber = dateObj.getDate();
                  const monthNameShort = new Intl.DateTimeFormat('id-ID', { month: 'short' }).format(dateObj);

                  const isMatchFilter =
                    filterType === 'all' ||
                    (filterType === 'week1' && idx < 7) ||
                    (filterType === 'week2' && idx >= 7 && idx < 14) ||
                    (filterType === 'week3' && idx >= 14 && idx < 21) ||
                    (filterType === 'week4' && idx >= 21) ||
                    (filterType === 'rain' && (item.condition.isRain || item.rainProb >= 45)) ||
                    (filterType === 'clear' && !item.condition.isRain && item.rainProb < 45);

                  return (
                    <button
                      key={item.date}
                      onClick={() => setSelectedDayIndex(idx)}
                      className={`min-h-[75px] sm:min-h-[105px] p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl border text-left flex flex-col justify-between transition-all relative cursor-pointer ${
                        !isMatchFilter ? 'opacity-30 grayscale-[50%]' : ''
                      } ${
                        isSelected
                          ? 'bg-sky-600 text-white shadow-md border-sky-700 ring-2 ring-sky-400/40 z-10 scale-[1.02]'
                          : isToday
                          ? 'bg-sky-50 text-slate-800 border-sky-300 ring-1 ring-sky-400/30'
                          : 'bg-white/90 text-slate-800 border-slate-200/80 hover:bg-sky-50/50'
                      }`}
                    >
                      {/* Atas: Tanggal & Badge Sumber Data */}
                      <div className="flex items-start justify-between w-full gap-0.5">
                        <div className="flex items-baseline gap-0.5">
                          <span className={`text-xs sm:text-base font-extrabold ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                            {dayNumber}
                          </span>
                          <span className={`text-[9px] font-semibold ${isSelected ? 'text-sky-100' : 'text-slate-400'}`}>
                            {monthNameShort}
                          </span>
                        </div>

                        {/* Badge BMKG / OM + Tag Hari Ini */}
                        <div className="flex flex-col items-end gap-0.5">
                          {item.sourceType === 'bmkg' ? (
                            <span
                              className={`px-1 py-0.2 rounded text-[7px] sm:text-[8px] font-black uppercase tracking-wider ${
                                isSelected
                                  ? 'bg-emerald-300 text-emerald-950'
                                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              }`}
                            >
                              BMKG
                            </span>
                          ) : (
                            <span
                              className={`px-1 py-0.2 rounded text-[7px] sm:text-[8px] font-black uppercase tracking-wider ${
                                isSelected
                                  ? 'bg-sky-300/80 text-sky-950'
                                  : 'bg-slate-100 text-slate-600 border border-slate-200'
                              }`}
                            >
                              OM
                            </span>
                          )}

                          {isToday && (
                            <span
                              className={`px-1 py-0.2 rounded text-[7px] sm:text-[8px] font-black uppercase ${
                                isSelected ? 'bg-white text-sky-700' : 'bg-sky-600 text-white'
                              }`}
                            >
                              Hari Ini
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Tengah: Ikon Cuaca */}
                      <div className="my-0.5 flex items-center justify-center">
                        <WeatherIcon
                          condition={item.condition}
                          size={20}
                          className={isSelected ? 'text-white' : ''}
                        />
                      </div>

                      {/* Bawah: Suhu & Peluang Hujan */}
                      <div className="w-full flex items-center justify-between text-[10px] sm:text-[11px]">
                        <span className={`font-bold ${isSelected ? 'text-white' : 'text-slate-700'}`}>
                          {Math.round(item.tempMax)}°
                        </span>

                        <div
                          className={`flex items-center gap-0.5 font-bold text-[9px] sm:text-[10px] ${
                            isSelected
                              ? 'text-sky-100'
                              : item.rainProb > 50
                              ? 'text-blue-600'
                              : 'text-slate-400'
                          }`}
                        >
                          <Droplets size={9} />
                          <span>{item.rainProb}%</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: LIST VIEW DAFTAR 30 HARI */}
      {viewMode === 'list' && (
        <div className="space-y-2 sm:space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
            {filteredForecasts.map((item) => {
              const originalIndex = forecasts.findIndex((f) => f.date === item.date);
              const isSelected = selectedDayIndex === originalIndex;

              return (
                <button
                  key={item.date}
                  onClick={() => setSelectedDayIndex(originalIndex)}
                  className={`flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-sky-600 text-white shadow-md border-sky-700 ring-2 ring-sky-400/30'
                      : 'bg-white/90 text-slate-800 border-slate-200/80 hover:bg-sky-50/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div
                      className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-white/20' : 'bg-slate-100'
                      }`}
                    >
                      <WeatherIcon
                        condition={item.condition}
                        size={22}
                        className={isSelected ? 'text-white' : ''}
                      />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold leading-tight flex items-center gap-1.5">
                        <span>{item.dayName}</span>
                        {originalIndex === 0 && (
                          <span className={`px-1 py-0.2 text-[8px] sm:text-[9px] rounded font-black ${
                            isSelected ? 'bg-white text-sky-700' : 'bg-sky-600 text-white'
                          }`}>
                            Hari Ini
                          </span>
                        )}
                      </p>
                      <p className={`text-[11px] sm:text-xs ${isSelected ? 'text-sky-100' : 'text-slate-500'}`}>
                        {item.dateFormatted}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`text-[10px] font-medium block truncate max-w-[100px] ${
                          isSelected ? 'text-sky-200' : 'text-slate-600'
                        }`}>
                          {item.condition.name}
                        </span>
                        <span className={`px-1 py-0.2 rounded text-[8px] font-black uppercase ${
                          item.sourceType === 'bmkg'
                            ? isSelected ? 'bg-emerald-300 text-emerald-950' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : isSelected ? 'bg-white/20 text-sky-100' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {item.sourceType === 'bmkg' ? 'BMKG' : 'OM'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-xs sm:text-sm font-extrabold">
                      {Math.round(item.tempMin)}° - {Math.round(item.tempMax)}°C
                    </p>
                    <div
                      className={`flex items-center justify-end gap-1 text-[10px] sm:text-[11px] font-bold mt-0.5 ${
                        isSelected ? 'text-sky-100' : 'text-sky-600'
                      }`}
                    >
                      <Droplets size={10} />
                      <span>{item.rainProb}% Hujan</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* INSPEKTUR RINCIAN HARI TERPILIH */}
      {selectedDay && (
        <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-7 space-y-4 sm:space-y-6 shadow-2xs border border-slate-200/80 animate-in fade-in duration-200">
          {/* Top Bar Inspektur */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/70 pb-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] sm:text-xs font-bold text-sky-700 uppercase tracking-wider">
                  Rincian Cuaca Harian
                </span>
                {selectedDayIndex === 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-sky-600 text-white text-[9px] font-bold uppercase">
                    Hari Ini
                  </span>
                )}
              </div>

              {/* Teks Penjelas Sumber Data BMKG / OM */}
              <div className="flex items-center gap-1.5 mt-1">
                {selectedDay.sourceType === 'bmkg' ? (
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] sm:text-xs font-bold">
                    <Database size={12} className="text-emerald-600 shrink-0" />
                    <span>BMKG Resmi (api.bmkg.go.id)</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-[10px] sm:text-xs font-bold">
                    <Database size={12} className="text-slate-500 shrink-0" />
                    <span>Open-Meteo (Model Numerik Global)</span>
                  </div>
                )}
              </div>

              <h3 className="text-base sm:text-2xl font-extrabold text-slate-900 mt-1.5">
                {selectedDay.dayName}, {selectedDay.dateFormatted}
              </h3>
            </div>

            {/* Navigasi Hari */}
            <div className="flex items-center justify-between sm:justify-end gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200/60 shrink-0">
              <button
                disabled={selectedDayIndex === 0}
                onClick={() => setSelectedDayIndex((prev) => Math.max(0, prev - 1))}
                className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-30 cursor-pointer shadow-2xs"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-xs font-bold text-slate-700 px-2">
                Hari ke-{selectedDayIndex + 1} / {forecasts.length}
              </span>
              <button
                disabled={selectedDayIndex === forecasts.length - 1}
                onClick={() => setSelectedDayIndex((prev) => Math.min(forecasts.length - 1, prev + 1))}
                className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-30 cursor-pointer shadow-2xs"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Narasi Ringkas */}
          <div className="p-3.5 rounded-2xl bg-sky-50/80 border border-sky-200/70 text-xs sm:text-sm text-sky-950 leading-relaxed flex items-start gap-2.5 shadow-2xs">
            <Info size={18} className="text-sky-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sky-900">{selectedDay.summary}</p>
              {selectedRegion && (
                <p className="text-[11px] text-sky-800/80 mt-0.5">
                  Wilayah Kec. {selectedRegion.name} ({selectedRegion.elevationMeters}m dpl) dipengaruhi oleh sirkulasi angin lokal Serayu dan Gunung Slamet.
                </p>
              )}
            </div>
          </div>

          {/* 4 Parameter Utama */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            <div className="p-3 rounded-2xl bg-white/90 border border-slate-200/80 shadow-2xs space-y-0.5">
              <div className="flex items-center gap-1 text-slate-500 text-[11px] font-bold">
                <Thermometer size={13} className="text-rose-500" />
                <span>Rentang Suhu</span>
              </div>
              <p className="text-base sm:text-lg font-extrabold text-slate-900">
                {Math.round(selectedDay.tempMin)}° - {Math.round(selectedDay.tempMax)}°C
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-white/90 border border-slate-200/80 shadow-2xs space-y-0.5">
              <div className="flex items-center gap-1 text-slate-500 text-[11px] font-bold">
                <Droplets size={13} className="text-sky-500" />
                <span>Peluang Hujan</span>
              </div>
              <p className="text-base sm:text-lg font-extrabold text-slate-900">
                {selectedDay.rainProb}%
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-white/90 border border-slate-200/80 shadow-2xs space-y-0.5">
              <div className="flex items-center gap-1 text-slate-500 text-[11px] font-bold">
                <CloudSun size={13} className="text-amber-500" />
                <span>Kelembapan</span>
              </div>
              <p className="text-base sm:text-lg font-extrabold text-slate-900">
                {selectedDay.humidityAvg}%
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-white/90 border border-slate-200/80 shadow-2xs space-y-0.5">
              <div className="flex items-center gap-1 text-slate-500 text-[11px] font-bold">
                <Wind size={13} className="text-teal-500" />
                <span>Kondisi Umum</span>
              </div>
              <p className="text-xs sm:text-sm font-extrabold text-slate-900 truncate">
                {selectedDay.condition.name}
              </p>
            </div>
          </div>

          {/* Timeline Interval 3 Jam */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Clock size={15} className="text-sky-600" />
                <span>Prakiraan Interval 3 Jam</span>
              </h4>
              <span className="text-[10px] text-slate-400">00:00 - 21:00 WIB</span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar -mx-1 px-1">
              {selectedDay.hourly.map((hItem) => (
                <div
                  key={hItem.time}
                  className="min-w-[85px] sm:min-w-[100px] flex-1 flex flex-col items-center justify-between p-2.5 rounded-2xl bg-white/90 border border-slate-200/70 shadow-2xs text-center shrink-0"
                >
                  <p className="text-[11px] font-bold text-slate-600">{hItem.timeFormatted}</p>

                  <div className="my-1.5 flex items-center justify-center h-7">
                    <WeatherIcon condition={hItem.condition} size={22} />
                  </div>

                  <p className="text-sm font-extrabold text-slate-800">{Math.round(hItem.temp)}°C</p>
                  <p className="text-[9px] font-semibold text-slate-500 h-5 flex items-center justify-center truncate w-full">
                    {hItem.condition.name}
                  </p>

                  <div className="w-full mt-1.5 pt-1.5 border-t border-slate-100">
                    <div className="flex items-center justify-center gap-0.5 text-[10px] font-bold text-sky-600 mb-0.5">
                      <Droplets size={10} />
                      <span>{hItem.rainProb}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1 overflow-hidden">
                      <div
                        className="bg-sky-500 h-full rounded-full"
                        style={{ width: `${hItem.rainProb}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Panduan Rekomendasi Lokal */}
          <div className="p-3.5 sm:p-5 rounded-2xl bg-slate-50/90 border border-slate-200/80 space-y-2.5">
            <h4 className="text-[11px] sm:text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles size={13} className="text-sky-600" />
              <span>Panduan Aktivitas & Mitigasi Lokal</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-white border border-slate-200/70 space-y-0.5">
                <p className="font-bold text-slate-800 flex items-center gap-1">
                  <Sprout size={13} className="text-emerald-600" />
                  <span>Pertanian & Penjemuran</span>
                </p>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {selectedDay.rainProb > 50
                    ? 'Penjemuran gabah disarankan pagi hari (07:00-11:00 WIB). Amankan sebelum awan mendung siang hari.'
                    : 'Kondisi penyinaran matahari baik sepanjang hari untuk penjemuran gabah.'}
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-slate-200/70 space-y-0.5">
                <p className="font-bold text-slate-800 flex items-center gap-1">
                  <Compass size={13} className="text-sky-600" />
                  <span>Wisata & Aktivitas Luar</span>
                </p>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {selectedRegion && selectedRegion.elevationMeters > 300
                    ? 'Wisata alam lereng Slamet (Baturraden) disarankan pagi-siang hari. Waspada debit air curug saat hujan.'
                    : 'Aktivitas perkotaan Purwokerto aman, persiapkan payung/jas hujan untuk sore hari.'}
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-slate-200/70 space-y-0.5">
                <p className="font-bold text-slate-800 flex items-center gap-1">
                  <Car size={13} className="text-amber-600" />
                  <span>Transportasi & Jalan</span>
                </p>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Lalu lintas perkotaan dan underpass Jensud lancar. Waspada jalanan licin saat potensi hujan sore hari.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};