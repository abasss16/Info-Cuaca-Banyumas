import React from 'react';
import { X, ShieldCheck, Database, Layers, CloudSun, Building2 } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center">
              <CloudSun size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Tentang Sistem Informasi Cuaca Banyumas</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            <strong>Informasi Cuaca Banyumas</strong> adalah platform pemantauan, analisis, dan peringatan dini cuaca berbasis data spasial yang dikembangkan secara spesifik untuk melayani 27 kecamatan dan 331 desa/kelurahan di Kabupaten Banyumas, Jawa Tengah.
          </p>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
            <h4 className="font-bold text-slate-800 flex items-center gap-2">
              <Database size={15} className="text-sky-700" />
              <span>Sumber Data Resmi:</span>
            </h4>
            <ul className="list-disc list-inside space-y-1 text-slate-600 text-xs">
              <li><strong>BMKG (Badan Meteorologi, Klimatologi, dan Geofisika)</strong>: Data prakiraan cuaca numerik, parameter atmosferik, dan peringatan dini resmi dari Stasiun Meteorologi Kelas II Tunggul Wulung.</li>
              <li><strong>Wilayah.id</strong>: Data batas administrasi resmi Kementerian Dalam Negeri Republik Indonesia untuk Kabupaten Banyumas.</li>
              <li><strong>WeatherLayers GL & OpenStreetMap</strong>: Visualisasi spasial radar cuaca, tutupan awan, dan peta dasar interaktif.</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-200/60 space-y-1.5">
            <h4 className="font-bold text-sky-950 flex items-center gap-2">
              <ShieldCheck size={15} className="text-sky-700" />
              <span>Prinsip Keakuratan & Pelayanan:</span>
            </h4>
            <p className="text-xs text-sky-900">
              Data cuaca disesuaikan dengan gradien elevasi topografi lokal Kabupaten Banyumas (dari lereng Gunung Slamet 620m dpl hingga dataran rendah lembah Serayu 25m dpl) agar masyarakat mendapatkan informasi yang akurat dan relevan.
            </p>
          </div>
        </div>

        <div className="pt-2 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export const PrivacyModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-lg font-bold text-slate-900">Kebijakan Privasi</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            Privasi Anda adalah prioritas kami. Platform <strong>Informasi Cuaca Banyumas</strong> mematuhi standar perlindungan data pengguna:
          </p>

          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <p className="font-bold text-slate-800">1. Data Lokasi GPS</p>
              <p className="text-slate-600 mt-0.5">
                Fitur &ldquo;Gunakan Lokasi Saya&rdquo; hanya memproses koordinat geografis Anda di sisi perangkat (client-side) untuk menentukan kecamatan/desa terdekat di Banyumas. Kami tidak pernah menyimpan, merekam, atau melacak histori lokasi Anda di server.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <p className="font-bold text-slate-800">2. Tanpa Pelacak Pihak Ketiga</p>
              <p className="text-slate-600 mt-0.5">
                Platform ini tidak memasang pelacak iklan atau menjual data penggunaan kepada pihak komersial mana pun.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <p className="font-bold text-slate-800">3. Mode Offline & Cache</p>
              <p className="text-slate-600 mt-0.5">
                Data cuaca terakhir disimpan di penyimpanan cache lokal peramban Anda untuk memastikan aplikasi tetap dapat dibuka saat koneksi internet terganggu.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-2 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow-sm transition-colors"
          >
            Saya Mengerti
          </button>
        </div>
      </div>
    </div>
  );
};
