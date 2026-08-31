import React from 'react';
import {
  Layers,
  Info,
  MapPin,
  Compass,
  Building2,
  Thermometer,
  Wind,
} from 'lucide-react';
import { Region } from '../types/weather';
import { WeatherMapLeaflet } from './WeatherMapLeaflet';
import { BANYUMAS_KECAMATAN } from '../data/banyumasRegions';

interface WeatherLayersViewProps {
  selectedRegion: Region;
  selectedVillage?: string;
  userExactCoords?: { lat: number; lng: number; accuracy?: number; name?: string } | null;
  onSelectRegion: (
    region: Region,
    village?: string,
    exactCoords?: { lat: number; lng: number; accuracy?: number; name?: string }
  ) => void;
}

export const WeatherLayersView: React.FC<WeatherLayersViewProps> = ({
  selectedRegion,
  selectedVillage,
  userExactCoords,
  onSelectRegion,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 glass-card rounded-3xl p-5 sm:p-6">
        <div>
          <div className="flex items-center gap-2 text-sky-700 font-bold text-xs uppercase tracking-wider">
            <Layers size={16} />
            <span>Interactive WeatherLayers GL Map</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
            Peta Cuaca Interaktif Kabupaten Banyumas
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Visualisasi cuaca interaktif dengan pilihan basemap Standar, Topografi (Kontur), dan Citra Satelit beserta layer suhu 2m dan aliran angin real-time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-2 rounded-2xl bg-sky-50 border border-sky-200 text-xs font-semibold text-sky-900">
            {userExactCoords ? (
              <span>
                Lokasi GPS: {selectedVillage || userExactCoords.name || selectedRegion.name} ({userExactCoords.lat.toFixed(4)}, {userExactCoords.lng.toFixed(4)})
              </span>
            ) : (
              <span>
                Fokus: {selectedVillage ? `${selectedVillage}, ` : ''}Kec. {selectedRegion.name} ({selectedRegion.lat.toFixed(3)}, {selectedRegion.lng.toFixed(3)})
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Full-Size Map Component */}
      <div className="w-full">
        <WeatherMapLeaflet
          selectedRegion={selectedRegion}
          selectedVillage={selectedVillage}
          userExactCoords={userExactCoords}
          onSelectRegion={onSelectRegion}
          heightClass="h-[560px] sm:h-[620px]"
          isCompact={false}
        />
      </div>

      {/* Quick Subdistrict Selector Grid & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: 27 Kecamatan Quick Select */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-5 sm:p-6 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Building2 size={16} className="text-sky-700" />
              <span>Daftar 27 Kecamatan di Banyumas</span>
            </h3>
            <span className="text-xs text-slate-400">Klik untuk fokus di peta</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-56 overflow-y-auto p-1">
            {BANYUMAS_KECAMATAN.map((kec) => {
              const isSelected = kec.id === selectedRegion.id;
              return (
                <button
                  key={kec.id}
                  onClick={() =>
                    onSelectRegion(
                      kec,
                      kec.villages?.[0] || kec.name,
                      { lat: kec.lat, lng: kec.lng, name: kec.name }
                    )
                  }
                  className={`px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all truncate ${
                    isSelected
                      ? 'bg-sky-600 text-white shadow-sm font-bold'
                      : 'bg-white/80 text-slate-700 hover:bg-slate-100 border border-slate-200/60'
                  }`}
                >
                  {kec.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Col: Selected Region Specs */}
        <div className="glass-card rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xs">
          <div className="flex items-center gap-2 text-sky-700 font-bold text-xs uppercase tracking-wider">
            <MapPin size={16} />
            <span>Informasi Wilayah Terpilih</span>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {selectedVillage ? `${selectedVillage}, ` : ''}Kecamatan {selectedRegion.name}
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {selectedRegion.description}
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Elevasi Rata-rata:</span>
              <span className="font-bold text-slate-800">{selectedRegion.elevationMeters} meter dpl</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Kode Pos:</span>
              <span className="font-bold text-slate-800">{selectedRegion.postalCode}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Jumlah Desa/Kelurahan:</span>
              <span className="font-bold text-slate-800">{selectedRegion.villages?.length || 1} Desa</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
