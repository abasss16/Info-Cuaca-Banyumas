import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Calendar,
  AlertTriangle,
  PhoneCall,
  Menu,
  X,
  Home,
  Layers,
  Info,
  RefreshCw,
} from 'lucide-react';
import { Region } from '../types/weather';
import { getWIBDateFormatted } from '../services/weatherEngine';

interface NavbarProps {
  currentTab: 'home' | 'calendar' | 'map' | 'alerts' | 'emergency';
  onSelectTab: (tab: 'home' | 'calendar' | 'map' | 'alerts' | 'emergency') => void;
  selectedRegion: Region;
  selectedVillage?: string;
  hasActiveAlert?: boolean;
  onOpenAbout?: () => void;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  selectedRegion,
  selectedVillage,
  hasActiveAlert = false,
  onOpenAbout,
  onRefresh,
  isLoading = false,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const dateStr = getWIBDateFormatted(now);
      setCurrentTime(`${hours}.${minutes}.${seconds} WIB • ${dateStr}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  interface NavItem {
    id: 'home' | 'calendar' | 'map' | 'alerts' | 'emergency';
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    badge?: string;
  }

  const navItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'calendar', label: 'Kalender Cuaca', icon: Calendar },
    { id: 'map', label: 'Peta Cuaca', icon: Layers },
    {
      id: 'alerts',
      label: 'Peringatan Dini',
      icon: AlertTriangle,
      badge: hasActiveAlert ? 'Aktif' : undefined,
    },
    { id: 'emergency', label: 'Kontak Darurat', icon: PhoneCall },
  ];

  return (
    <header className="sticky top-0 z-50 w-full pt-3 sm:pt-4 px-2 sm:px-4 max-w-[96%] mx-auto">
      {/* Floating Capsule Bar */}
      <div className="bg-white/95 backdrop-blur-md border border-slate-100 shadow-md shadow-slate-200/50 rounded-3xl sm:rounded-full px-4 sm:px-6 py-1 transition-all duration-300">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo & Info Location */}
          <button
            onClick={() => {
              onSelectTab('home');
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-3 text-left focus:outline-none group"
          >
            {/* Logo Circle */}
            <div className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
              <img
                src="/logo.png"
                alt="Logo Cuaca Banyumas"
                className="w-full h-full object-contain"
              />
            </div>

            <div>
              <span className="text-[8px] sm:text-[9px] text-slate-500 font-semibold tracking-wide uppercase block">
                {currentTime || '09.51.56 WIB • RABU, 26 AGUSTUS 2026'}
              </span>
              <h1 className="text-sm sm:text-base font-black tracking-tight text-slate-900 uppercase leading-none mt-0.5">
                INFO CUACA BANYUMAS
              </h1>
              <div className="flex items-center gap-1 text-[8px] sm:text-[9px] font-bold text-slate-500 mt-0.5 uppercase tracking-wider">
                <MapPin size={11} className="text-slate-800 shrink-0" />
                <span>
                  {selectedVillage || selectedRegion.villages?.[0] || selectedRegion.name}, KEC. {selectedRegion.name}
                </span>
              </div>
            </div>
          </button>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1 sm:gap-2">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`relative px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-sky-100/80 text-sky-600 font-bold shadow-xs'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/60'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {item.label}
                    {item.badge && (
                      <span className="px-1.5 py-0.2 text-[9px] font-bold bg-rose-500 text-white rounded-full animate-pulse">
                        {item.badge}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}

            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={isLoading}
                title="Tarik data live BMKG detik ini juga"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100/80 active:scale-95 transition-all border border-sky-200/70 shadow-2xs cursor-pointer ml-1"
              >
                <RefreshCw size={13} className={isLoading ? 'animate-spin text-sky-600' : 'text-sky-600'} />
                <span>{isLoading ? 'Mengambil...' : ''}</span>
              </button>
            )}

            {onOpenAbout && (
              <button
                onClick={onOpenAbout}
                title="Tentang Sistem"
                className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <Info size={16} />
              </button>
            )}
          </nav>

          {/* Mobile Action Buttons */}
          <div className="flex items-center gap-1.5 lg:hidden">
            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={isLoading}
                title="Tarik data live BMKG detik ini"
                className="p-2 rounded-full bg-sky-50 text-sky-700 border border-sky-200/70 hover:bg-sky-100 transition-colors"
                aria-label="Refresh cuaca live BMKG"
              >
                <RefreshCw size={14} className={isLoading ? 'animate-spin text-sky-600' : ''} />
              </button>
            )}
            {hasActiveAlert && (
              <button
                onClick={() => onSelectTab('alerts')}
                className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold bg-rose-500 text-white rounded-full shadow-sm animate-pulse"
              >
                <AlertTriangle size={11} />
                <span>Waspada</span>
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Menu inside capsule */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-slate-100 space-y-1 animate-in fade-in duration-200">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-2xl text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-sky-100/80 text-sky-600 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={16} className={isActive ? 'text-sky-600' : 'text-slate-400'} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-500 text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

      </div>
    </header>
  );
};