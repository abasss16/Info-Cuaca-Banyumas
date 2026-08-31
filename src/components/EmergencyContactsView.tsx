import React, { useState } from 'react';
import {
  PhoneCall,
  MapPin,
  Clock,
  AlertCircle,
  Phone,
} from 'lucide-react';
import { EMERGENCY_CONTACTS } from '../data/emergencyContacts';

export const EmergencyContactsView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Semua Kontak' },
    { id: 'utama', label: 'Layanan 112' },
    { id: 'bpbd', label: 'BPBD & Kebencanaan' },
    { id: 'damkar', label: 'Pemadam Kebakaran' },
    { id: 'kesehatan', label: 'Rumah Sakit & Ambulans' },
    { id: 'polisi', label: 'Kepolisian' },
    { id: 'sar', label: 'SAR & Evakuasi' },
  ];

  const filteredContacts = EMERGENCY_CONTACTS.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-300">
      {/* Page Header & Quick Dial 112 Banner */}
      <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-rose-600 font-bold text-[11px] sm:text-xs uppercase tracking-wider">
            <PhoneCall size={15} />
            <span>Direktori Darurat Terverifikasi</span>
          </div>
          <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900 leading-tight">
            Kontak Darurat Kab. Banyumas
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Nomor darurat resmi terverifikasi untuk penanganan bencana alam, cuaca ekstrem, medis, dan kebakaran.
          </p>
        </div>

        {/* Primary 112 Quick Dial Box */}
        <a
          href="tel:112"
          id="btn-call-112-top"
          className="w-full md:w-auto flex items-center justify-between sm:justify-start gap-3.5 px-4 sm:px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white shadow-md active:scale-[0.99] transition-all shrink-0 group cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <PhoneCall size={20} className="text-white" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-rose-100">Bebas Pulsa 24 Jam</p>
              <p className="text-base sm:text-lg font-black leading-tight">Call Center 112</p>
            </div>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-white/20 text-xs font-bold whitespace-nowrap">
            Panggil
          </div>
        </a>
      </div>

      {/* Category Pills (Horizontal Scroll di Mobile) */}
      <div className="relative">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 text-xs no-scrollbar -mx-1 px-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              id={`filter-category-${cat.id}`}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white/90 text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Emergency Contacts Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {filteredContacts.map((contact) => (
          <div
            key={contact.id}
            className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex flex-col justify-between space-y-3.5 hover:border-sky-300 transition-all shadow-2xs"
          >
            <div className="space-y-2">
              {/* Category Badge & Operating Hours */}
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold text-slate-600 bg-slate-100 rounded-full truncate">
                  {contact.categoryLabel}
                </span>
                <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md shrink-0">
                  <Clock size={11} />
                  <span>{contact.operatingHours}</span>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
                {contact.name}
              </h3>

              {/* Description */}
              <p className="text-xs text-slate-600 leading-relaxed">
                {contact.description}
              </p>

              {/* Address */}
              {contact.address && (
                <div className="flex items-start gap-1.5 text-[11px] sm:text-xs text-slate-500 pt-0.5">
                  <MapPin size={13} className="text-slate-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{contact.address}</span>
                </div>
              )}
            </div>

            {/* Direct Dial Action */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400">Nomor Telepon</p>
                <p className="text-xs sm:text-sm font-extrabold text-slate-900 truncate">{contact.displayNumber}</p>
              </div>

              <a
                href={`tel:${contact.phoneNumber}`}
                id={`btn-call-${contact.id}`}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white text-xs font-bold shadow-xs transition-colors shrink-0 cursor-pointer"
              >
                <Phone size={13} />
                <span>Hubungi</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Emergency Guidance Protocol */}
      <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-3 bg-gradient-to-r from-emerald-50/50 via-white/80 to-slate-50 border border-emerald-200/60">
        <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
          <AlertCircle size={16} className="text-emerald-700 shrink-0" />
          <span>Panduan Pelaporan Keadaan Darurat Banyumas</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-slate-600">
          <div className="p-3 rounded-xl bg-white/90 border border-slate-200/60 space-y-1">
            <span className="font-bold text-emerald-800 block">1. Tetap Tenang</span>
            <p className="text-[11px] sm:text-xs leading-relaxed">Sebutkan nama Anda, jenis kejadian bencana/darurat secara ringkas dan jelas.</p>
          </div>
          <div className="p-3 rounded-xl bg-white/90 border border-slate-200/60 space-y-1">
            <span className="font-bold text-emerald-800 block">2. Sebutkan Lokasi Presisi</span>
            <p className="text-[11px] sm:text-xs leading-relaxed">Sebutkan nama Desa/Kelurahan & Kecamatan di Banyumas, serta patokan terdekat.</p>
          </div>
          <div className="p-3 rounded-xl bg-white/90 border border-slate-200/60 space-y-1">
            <span className="font-bold text-emerald-800 block">3. Ikuti Instruksi Petugas</span>
            <p className="text-[11px] sm:text-xs leading-relaxed">Jangan menutup telepon hingga operator 112 atau BPBD selesai mencatat seluruh data.</p>
          </div>
        </div>
      </div>
    </div>
  );
};