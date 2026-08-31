import React from 'react';
import {
  Sun,
  CloudSun,
  Cloud,
  CloudRain,
  CloudLightning,
  CloudFog,
  Wind,
  CloudDrizzle,
  Moon,
  CloudMoon,
} from 'lucide-react';
import { WeatherCondition } from '../types/weather';

interface WeatherIconProps {
  condition?: WeatherCondition;
  code?: number;
  size?: number;
  className?: string;
  isNight?: boolean;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({
  condition,
  code,
  size = 32,
  className = '',
  isNight = false,
}) => {
  const weatherCode = code !== undefined ? code : condition?.code ?? 1;

  if (isNight) {
    switch (weatherCode) {
      case 0: // Cerah Malam
        return <Moon size={size} className={`text-indigo-400 fill-indigo-100/30 ${className}`} />;
      case 1: // Cerah Berawan Malam
      case 2:
        return <CloudMoon size={size} className={`text-indigo-400 ${className}`} />;
      case 3: // Berawan
        return <Cloud size={size} className={`text-sky-300 ${className}`} />;
      case 4: // Berawan Tebal
        return <Cloud size={size} className={`text-slate-400 ${className}`} />;
      case 5: // Udara Kabur
      case 45: // Kabut
        return <CloudFog size={size} className={`text-slate-400 ${className}`} />;
      case 60: // Hujan Ringan
        return <CloudDrizzle size={size} className={`text-sky-400 ${className}`} />;
      case 61: // Hujan Sedang
        return <CloudRain size={size} className={`text-blue-400 ${className}`} />;
      case 63: // Hujan Lebat
        return <CloudRain size={size} className={`text-indigo-500 ${className}`} />;
      case 95: // Hujan Petir
      case 97:
        return <CloudLightning size={size} className={`text-purple-400 ${className}`} />;
      default:
        return <CloudMoon size={size} className={`text-indigo-400 ${className}`} />;
    }
  }

  switch (weatherCode) {
    case 0: // Cerah Siang
      return <Sun size={size} className={`text-amber-500 animate-spin-slow ${className}`} />;
    case 1: // Cerah Berawan
    case 2:
      return <CloudSun size={size} className={`text-emerald-500 ${className}`} />;
    case 3: // Berawan
      return <Cloud size={size} className={`text-sky-400/90 ${className}`} />;
    case 4: // Berawan Tebal
      return <Cloud size={size} className={`text-slate-500 ${className}`} />;
    case 5: // Udara Kabur
    case 45: // Kabut
      return <CloudFog size={size} className={`text-slate-400 ${className}`} />;
    case 60: // Hujan Ringan
      return <CloudDrizzle size={size} className={`text-sky-500 ${className}`} />;
    case 61: // Hujan Sedang
      return <CloudRain size={size} className={`text-blue-500 ${className}`} />;
    case 63: // Hujan Lebat
      return <CloudRain size={size} className={`text-indigo-600 ${className}`} />;
    case 95: // Hujan Petir
    case 97:
      return <CloudLightning size={size} className={`text-purple-600 ${className}`} />;
    default:
      return <CloudSun size={size} className={`text-emerald-500 ${className}`} />;
  }
};

// 3D-feel styled weather illustration badge
export const WeatherIllustration: React.FC<{ code?: number; className?: string }> = ({
  code = 1,
  className = 'w-20 h-20',
}) => {
  if (code === 0) {
    // Cerah / Sun
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <div className="absolute w-14 h-14 bg-gradient-to-tr from-amber-400 to-yellow-300 rounded-full shadow-lg shadow-amber-300/60 animate-pulse" />
        <div className="relative z-10 w-10 h-10 bg-yellow-200/80 rounded-full" />
      </div>
    );
  }

  if (code === 60 || code === 61 || code === 63 || code === 95) {
    // Rain / Storm
    return (
      <div className={`relative flex flex-col items-center justify-center ${className}`}>
        <div className="relative w-16 h-11 bg-gradient-to-b from-slate-200 to-slate-400 rounded-full shadow-md">
          <div className="absolute -top-3 left-3 w-8 h-8 bg-slate-300 rounded-full" />
          <div className="absolute -top-1 right-2 w-7 h-7 bg-slate-200 rounded-full" />
        </div>
        <div className="flex gap-2 mt-2">
          <div className="w-1 h-3 bg-sky-500 rounded-full animate-bounce delay-100" />
          <div className="w-1 h-3 bg-blue-500 rounded-full animate-bounce delay-200" />
          <div className="w-1 h-3 bg-sky-400 rounded-full animate-bounce delay-300" />
        </div>
      </div>
    );
  }

  // Default Cerah Berawan / Berawan
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <div className="absolute -top-1 -right-1 w-10 h-10 bg-gradient-to-tr from-amber-400 to-yellow-300 rounded-full shadow-md shadow-amber-300/40" />
      <div className="relative z-10 w-16 h-10 bg-gradient-to-b from-white to-slate-100 rounded-full shadow-md border border-white/60">
        <div className="absolute -top-3 left-3 w-8 h-8 bg-white rounded-full" />
        <div className="absolute -top-1.5 right-3 w-7 h-7 bg-slate-100 rounded-full" />
      </div>
    </div>
  );
};
