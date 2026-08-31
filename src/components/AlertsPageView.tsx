import React from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  Clock,
  MapPin,
  CheckCircle2,
  PhoneCall,
  Info,
  Layers,
} from 'lucide-react';
import { WeatherAlert } from '../types/weather';

interface AlertsPageViewProps {
  alerts: WeatherAlert[];
  onNavigateEmergency?: () => void;
}

export const AlertsPageView: React.FC<AlertsPageViewProps> = ({
  alerts,
  onNavigateEmergency,
}) => {
  const activeAlerts = alerts.filter((a) => a.isActive);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 glass-card rounded-3xl p-5 sm:p-6">
        <div>
          <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-wider">
            <ShieldAlert size={16} />
            <span>Pusat Peringatan Dini Cuaca BMKG</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
            Peringatan Dini Cuaca Kabupaten Banyumas
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Informasi resmi peringatan dini cuaca ekstrem yang dirilis oleh BMKG Stasiun Meteorologi Kelas II Tunggul Wulung.
          </p>
        </div>

        {activeAlerts.length > 0 ? (
          <div className="px-4 py-2 rounded-2xl bg-amber-500 text-white text-xs font-bold shadow-sm self-start sm:self-auto flex items-center gap-1.5 animate-pulse">
            <AlertTriangle size={15} />
            <span>{activeAlerts.length} Peringatan Aktif</span>
          </div>
        ) : (
          <div className="px-4 py-2 rounded-2xl bg-emerald-100 text-emerald-800 text-xs font-bold self-start sm:self-auto flex items-center gap-1.5">
            <CheckCircle2 size={15} />
            <span>Kondusif</span>
          </div>
        )}
      </div>

      {/* Active Alerts List */}
      {activeAlerts.length === 0 ? (
        <div className="glass-card rounded-3xl p-8 sm:p-12 text-center space-y-4 border border-emerald-200/80 bg-emerald-50/30">
          <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-inner border border-emerald-200">
            <CheckCircle2 size={32} />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg font-bold text-slate-900">
              Tidak Ada Peringatan Dini Cuaca Aktif (Status Aman)
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
              Berdasarkan rilis dan pantauan data resmi BMKG (Stasiun Meteorologi Kelas II Tunggul Wulung & api.bmkg.go.id), dinamika atmosfer di seluruh 27 kecamatan Kabupaten Banyumas terpantau kondusif tanpa ada potensi cuaca ekstrem saat ini.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white text-emerald-800 text-xs font-semibold border border-emerald-200/80 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Sinkronisasi Live Data BMKG Terverifikasi</span>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {activeAlerts.map((alert) => (
            <div
              key={alert.id}
              className="glass-card rounded-3xl p-5 sm:p-7 border-l-8 border-l-amber-500 space-y-5"
            >
              {/* Alert Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="px-3 py-1 text-xs font-extrabold uppercase rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                    Status: {alert.levelLabel}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">
                    Diterbitkan: {alert.issuedAt}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-xl">
                  <Clock size={13} className="text-slate-500" />
                  <span>Masa Berlaku: {alert.validFrom} – {alert.validUntil}</span>
                </div>
              </div>

              {/* Event Title */}
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
                  {alert.eventType}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                  {alert.description}
                </p>
              </div>

              {/* Affected Regions Grid */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/70">
                <p className="text-xs font-bold text-amber-950 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <MapPin size={14} className="text-amber-700" />
                  <span>Kecamatan Terdampak:</span>
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {alert.affectedRegions.map((regionName) => (
                    <span
                      key={regionName}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white text-amber-900 border border-amber-200/80 shadow-2xs"
                    >
                      Kec. {regionName}
                    </span>
                  ))}
                </div>
              </div>

              {/* Safety Recommendations */}
              <div className="space-y-2.5 pt-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert size={14} className="text-emerald-700" />
                  <span>Langkah Kesiapsiagaan & Mitigasi:</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {alert.recommendations.map((rec, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-white/80 border border-slate-200/60 text-xs font-medium text-slate-700 flex items-start gap-2"
                    >
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Source & Emergency Action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
                <span className="text-slate-400 font-medium">
                  Sumber Resmi: {alert.source}
                </span>

                {onNavigateEmergency && (
                  <button
                    onClick={onNavigateEmergency}
                    className="flex items-center justify-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-xs transition-colors"
                  >
                    <PhoneCall size={14} />
                    <span>Hubungi Kontak Darurat BPBD 112</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Banyumas Regional Disaster Risk Education Card */}
      <div className="glass-card rounded-3xl p-5 sm:p-7 space-y-4 shadow-2xs">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Info size={18} className="text-sky-700" />
          <span>Panduan Karakteristik Cuaca & Mitigasi Bencana Kabupaten Banyumas</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-white/90 border border-slate-200/70 space-y-1.5 shadow-2xs">
            <h4 className="font-bold text-slate-800">1. Wilayah Lereng Gunung Slamet</h4>
            <p className="text-slate-600 leading-relaxed">
              Baturraden, Sumbang, Kedungbanteng, dan Cilongok memiliki curah hujan orografis tinggi. Waspada peningkatan aliran curug, debit sungai pegunungan, dan tebing labil.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/90 border border-slate-200/70 space-y-1.5 shadow-2xs">
            <h4 className="font-bold text-slate-800">2. Koridor Aliran Sungai Serayu</h4>
            <p className="text-slate-600 leading-relaxed">
              Rawalo, Kebasen, Patikraja, Kalibagor, dan Somagede. Waspada kenaikan muka air Sungai Serayu saat hujan lebat merata di wilayah hulu (Wonosobo/Banjarnegara).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/90 border border-slate-200/70 space-y-1.5 shadow-2xs">
            <h4 className="font-bold text-slate-800">3. Kawasan Perkotaan Purwokerto</h4>
            <p className="text-slate-600 leading-relaxed">
              Purwokerto Timur, Barat, Utara, dan Selatan. Waspada genangan sesaat pada underpass, drainase perkotaan, dan hembusan angin kencang di jalur berpepohonan rimbun.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
