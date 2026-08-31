import React, { useState } from 'react';
import { 
  Database, 
  Shield, 
  Info, 
  ExternalLink, 
  Wifi, 
  WifiOff, 
  PhoneCall, 
  MapPin, 
} from 'lucide-react';
import { AboutModal, PrivacyModal } from './AboutModal';

interface FooterProps {
  lastUpdated?: string;
  isOnline?: boolean;
  onNavigateTab?: (tab: 'home' | 'calendar' | 'map' | 'alerts' | 'emergency') => void;
}

export const Footer: React.FC<FooterProps> = ({
  lastUpdated,
  isOnline = true,
  onNavigateTab
}) => {
  const [aboutOpen, setAboutOpen] = useState<boolean>(false);
  const [privacyOpen, setPrivacyOpen] = useState<boolean>(false);

  const handleTabClick = (tab: 'home' | 'calendar' | 'map' | 'alerts' | 'emergency') => {
    if (onNavigateTab) {
      onNavigateTab(tab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <footer className="w-full mt-8 border-t border-slate-200/80 bg-white/80 backdrop-blur-md text-slate-600 transition-all">
        <div className="max-w-[96%] mx-auto px-2 sm:px-4 lg:px-6 py-5">
          
          {/* Main Footer Content - Grid Layout Compact & Align Left */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr] gap-6 pb-4 border-b border-slate-100">
            
            {/* Column 1: Brand & Identity (Mepet Kiri) */}
            <div className="space-y-2 text-left flex flex-col items-start justify-start pl-0 m-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 flex items-center justify-center shrink-0">
                  <img
                    src="/logo.png"
                    alt="Logo Banyumas"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight leading-none">
                    INFO CUACA BANYUMAS
                  </h4>
                  <p className="text-[9px] font-semibold text-sky-600 uppercase tracking-wider flex items-center gap-1 justify-start mt-0.5">
                    <MapPin size={9} /> Kabupaten Banyumas
                  </p>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 leading-snug text-left max-w-xs">
                Platform pemantauan cuaca real-time & peringatan dini bencana Kabupaten Banyumas.
              </p>
              
              {/* Status Koneksi */}
              <div className="inline-flex items-center gap-1.5 text-[10px] font-medium text-slate-600 bg-slate-100/80 px-2.5 py-1 rounded-full border border-slate-200/80 self-start">
                {isOnline ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <Wifi size={11} className="text-emerald-600" />
                    <span>Terhubung BMKG</span>
                  </>
                ) : (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    <WifiOff size={11} className="text-amber-600" />
                    <span>Mode Offline ({lastUpdated || 'Tersimpan'})</span>
                  </>
                )}
              </div>
            </div>

            {/* Column 2: Navigasi Layanan */}
            <div className="space-y-1.5">
              <h5 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">
                Navigasi Layanan
              </h5>
              <ul className="space-y-1 text-[11px]">
                <li>
                  <button 
                    type="button"
                    onClick={() => handleTabClick('home')} 
                    className="hover:text-sky-600 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Prakiraan Cuaca Hari Ini</span>
                  </button>
                </li>
                <li>
                  <button 
                    type="button"
                    onClick={() => handleTabClick('calendar')} 
                    className="hover:text-sky-600 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Kalender Cuaca 30 Hari</span>
                  </button>
                </li>
                <li>
                  <button 
                    type="button"
                    onClick={() => handleTabClick('map')} 
                    className="hover:text-sky-600 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Peta Radar & Citra Satelit</span>
                  </button>
                </li>
                <li>
                  <button 
                    type="button"
                    onClick={() => handleTabClick('alerts')} 
                    className="hover:text-sky-600 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Peringatan Dini Bencana</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Bantuan & Legal */}
            <div className="space-y-1.5">
              <h5 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">
                Informasi & Legal
              </h5>
              <ul className="space-y-1 text-[11px]">
                <li>
                  <button
                    type="button"
                    onClick={() => setAboutOpen(true)}
                    className="hover:text-sky-600 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Info size={12} className="text-slate-400" />
                    <span>Tentang Sistem</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setAboutOpen(true)}
                    className="hover:text-sky-600 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Database size={12} className="text-slate-400" />
                    <span>Sumber & Metodologi Data</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setPrivacyOpen(true)}
                    className="hover:text-sky-600 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Shield size={12} className="text-slate-400" />
                    <span>Kebijakan Privasi & Data</span>
                  </button>
                </li>
                <li>
                  <a
                    href="https://data.bmkg.go.id/"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-sky-600 transition-colors inline-flex items-center gap-1 text-slate-500"
                  >
                    <span>Open Data BMKG</span>
                    <ExternalLink size={10} />
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Kontak Darurat */}
            <div className="space-y-1.5">
              <h5 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">
                Kontak Darurat
              </h5>
              <div className="bg-rose-50/80 border border-rose-200/80 rounded-xl p-2.5 space-y-1">
                <div className="flex items-center gap-1.5 text-rose-700 font-bold text-[11px]">
                  <PhoneCall size={12} />
                  <span>Panggilan Darurat 112</span>
                </div>
                <p className="text-[10px] text-slate-600 leading-tight">
                  Bebas pulsa 24 jam untuk darurat bencana & SAR Banyumas.
                </p>
                <button
                  type="button"
                  onClick={() => handleTabClick('emergency')}
                  className="w-full text-center py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] font-bold transition-colors shadow-2xs cursor-pointer"
                >
                  Daftar Nomor Darurat
                </button>
              </div>
            </div>

          </div>

          {/* Bottom Bar - Copyright & Credits Compact */}
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-1.5 text-[10px] text-slate-400">
            <p className="text-center sm:text-left">
              Data resmi: <span className="text-slate-600 font-medium">BMKG Stasiun Tunggul Wulung</span> • Wilayah.id
            </p>
            <p className="text-center sm:text-right">
              © {new Date().getFullYear()} Pemkab Banyumas. Developed for Public Service
            </p>
          </div>

        </div>
      </footer>

      <AboutModal isOpen={aboutOpen} onClose={() => setAboutOpen(false)} />
      <PrivacyModal isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />
    </>
  );
};