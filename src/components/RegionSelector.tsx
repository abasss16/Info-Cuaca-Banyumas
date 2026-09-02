import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Building2,
  MapPin,
  ChevronDown,
  LocateFixed,
  Loader2,
  X,
  Check,
} from 'lucide-react';
import { Region } from '../types/weather';
import {
  BANYUMAS_KECAMATAN,
  BANYUMAS_VILLAGES_COORDS,
  findPreciseLocation,
  getDesaCoordinates,
  findNearestDesaFromCoords,
  getKecamatanById,
  ALL_BANYUMAS_DESA,
} from '../data/banyumasRegions';

interface RegionSelectorProps {
  selectedRegion: Region;
  selectedVillage?: string;
  onSelectRegion: (
    region: Region,
    village?: string,
    exactCoords?: { lat: number; lng: number; accuracy?: number; name?: string }
  ) => void;
}

export const RegionSelector: React.FC<RegionSelectorProps> = ({
  selectedRegion,
  selectedVillage,
  onSelectRegion,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [gpsMessage, setGpsMessage] = useState<string | null>(null);
  const [kecamatanDropdownOpen, setKecamatanDropdownOpen] = useState<boolean>(false);
  const [desaDropdownOpen, setDesaDropdownOpen] = useState<boolean>(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const kecDropdownRef = useRef<HTMLDivElement>(null);
  const desaDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearching(false);
      }
      if (
        kecDropdownRef.current &&
        !kecDropdownRef.current.contains(event.target as Node)
      ) {
        setKecamatanDropdownOpen(false);
      }
      if (
        desaDropdownRef.current &&
        !desaDropdownRef.current.contains(event.target as Node)
      ) {
        setDesaDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter search results - HANYA BERJALAN JIKA QUERY MINIMAL 1 KARAKTER
  const searchResults = React.useMemo(() => {
    const cleanQuery = searchQuery.trim().toLowerCase();
    
    // VALIDASI KETAT: Jika kosong atau kurang dari 1 karakter, jangan tampilkan apapun
    if (!cleanQuery || cleanQuery.length < 1) return [];

    const results: Array<{
      type: 'kecamatan' | 'desa';
      displayName: string;
      kecamatan: Region;
      villageName?: string;
      coords?: { lat: number; lng: number };
    }> = [];

    // 1. Search in all Kecamatan
    for (const kec of BANYUMAS_KECAMATAN) {
      if (kec.name.toLowerCase().includes(cleanQuery)) {
        const defaultVil = kec.villages?.[0] || kec.name;
        const vilCoord = getDesaCoordinates(kec.id, defaultVil);
        results.push({
          type: 'kecamatan',
          displayName: `Kec. ${kec.name}`,
          kecamatan: kec,
          villageName: defaultVil,
          coords: vilCoord ? { lat: vilCoord.lat, lng: vilCoord.lng } : { lat: kec.lat, lng: kec.lng },
        });
      }
    }

    // 2. Search in all 331 Desa/Kelurahan from Geoportal dataset
    for (const d of ALL_BANYUMAS_DESA) {
      if (d.name.toLowerCase().includes(cleanQuery)) {
        const kec = getKecamatanById(d.kecamatanId);
        if (kec) {
          // Avoid duplicate if already exact match
          const alreadyAdded = results.some(
            (r) => r.type === 'desa' && r.villageName?.toLowerCase() === d.name.toLowerCase() && r.kecamatan.id === kec.id
          );
          if (!alreadyAdded) {
            results.push({
              type: 'desa',
              displayName: `Desa/Kel. ${d.name}`,
              kecamatan: kec,
              villageName: d.name,
              coords: { lat: d.lat, lng: d.lng },
            });
          }
        }
      }
    }

    return results.slice(0, 12);
  }, [searchQuery]);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setGpsMessage('Browser Anda tidak mendukung deteksi lokasi.');
      setTimeout(() => setGpsMessage(null), 4000);
      return;
    }

    setIsLocating(true);
    setGpsMessage(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setIsLocating(false);
        const { latitude, longitude, accuracy } = position.coords;
        const exactUserCoords = {
          lat: latitude,
          lng: longitude,
          accuracy: accuracy || 15,
        };

        try {
          const res = await fetch(
            `/api/regions/reverse-geocode?lat=${latitude}&lng=${longitude}`
          );

          if (res.ok) {
            const data = await res.json();
            if (data.region) {
              const matchedVillage =
                data.village || data.region.villages?.[0] || data.region.name;
              onSelectRegion(data.region, matchedVillage, {
                ...exactUserCoords,
                name: matchedVillage,
              });
              setGpsMessage(
                `Lokasi terdeteksi: Kel./Desa ${matchedVillage}, Kec. ${data.region.name}`
              );
              setTimeout(() => setGpsMessage(null), 5000);
              return;
            }
          }
        } catch (e) {
          // Fallback jika offline
        }

        const precise = findPreciseLocation(latitude, longitude);
        onSelectRegion(precise.region, precise.village, {
          ...exactUserCoords,
          name: precise.village,
        });
        setGpsMessage(
          `Lokasi terdeteksi: Kel./Desa ${precise.village}, Kec. ${precise.region.name}`
        );
        setTimeout(() => setGpsMessage(null), 5000);
      },
      (error) => {
        setIsLocating(false);
        let msg = 'Izin lokasi tidak diberikan atau tidak dapat diakses.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Izin akses lokasi ditolak. Menggunakan pilihan manual.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'Waktu permintaan lokasi habis. Silakan coba lagi.';
        }
        setGpsMessage(msg);
        setTimeout(() => setGpsMessage(null), 4000);
      },
      { timeout: 10000, enableHighAccuracy: true, maximumAge: 30000 }
    );
  };

  const currentVillages = selectedRegion.villages || [selectedRegion.name];
  const activeVillage = selectedVillage || currentVillages[0];

  return (
    <div className="w-full space-y-3">
      {/* Search Input Bar */}
      <div ref={searchContainerRef} className="relative w-full">
        <div className="relative flex items-center bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-2xs focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-500/20 transition-all">
          <div className="pl-4 pr-2 text-slate-400">
            <Search size={18} />
          </div>
          <input
            id="region-search-input"
            type="text"
            autoComplete="off" // Menghindari autofill otomatis dari browser
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearching(e.target.value.trim().length > 0);
            }}
            onFocus={() => {
              if (searchQuery.trim().length > 0) {
                setIsSearching(true);
              }
            }}
            placeholder="Cari kecamatan atau desa di Banyumas..."
            className="w-full py-3.5 pr-10 text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
          />

          {searchQuery ? (
            <button
              onClick={() => {
                setSearchQuery('');
                setIsSearching(false);
              }}
              className="p-2 mr-2 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
            >
              <X size={16} />
            </button>
          ) : (
            <button
              id="btn-detect-gps"
              onClick={handleDetectLocation}
              disabled={isLocating}
              title="Gunakan Lokasi GPS Saya"
              className="mr-2 px-3 py-1.5 flex items-center gap-1.5 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-xl border border-sky-200 transition-colors shadow-2xs shrink-0 cursor-pointer"
            >
              {isLocating ? (
                <Loader2 size={14} className="animate-spin text-sky-600 shrink-0" />
              ) : (
                <LocateFixed size={14} className="text-sky-600 shrink-0" />
              )}
              <span className="hidden sm:inline whitespace-nowrap">Lokasi Saya</span>
            </button>
          )}
        </div>

        {/* Autocomplete Search Dropdown - Hanya Muncul Jika Ada Teks Pencarian */}
        {isSearching && searchQuery.trim().length > 0 && searchResults.length > 0 && (
          <div className="absolute z-30 top-full left-0 right-0 mt-1.5 bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in-50 duration-150 max-h-72 overflow-y-auto">
            <div className="p-2 space-y-1">
              {searchResults.map((item, idx) => (
                <button
                  key={`${item.type}-${item.displayName}-${idx}`}
                  onClick={() => {
                    onSelectRegion(
                      item.kecamatan,
                      item.villageName,
                      item.coords
                        ? { ...item.coords, name: item.displayName }
                        : undefined
                    );
                    setSearchQuery('');
                    setIsSearching(false);
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left hover:bg-sky-50 text-slate-700 hover:text-sky-900 transition-colors text-sm group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    {item.type === 'kecamatan' ? (
                      <Building2 size={16} className="text-sky-600 shrink-0" />
                    ) : (
                      <MapPin size={16} className="text-blue-600 shrink-0" />
                    )}
                    <div>
                      <span className="font-semibold">{item.displayName}</span>
                      {item.type === 'desa' && (
                        <span className="text-xs text-slate-400 ml-2">
                          (Kec. {item.kecamatan.name})
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs font-medium text-sky-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    Pilih
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* GPS Feedback Message */}
      {gpsMessage && (
        <div className="px-3.5 py-2 rounded-xl bg-sky-50 border border-sky-200 text-xs font-medium text-sky-800 flex items-center gap-2 animate-in fade-in">
          <LocateFixed size={14} className="text-sky-600 shrink-0" />
          <span>{gpsMessage}</span>
        </div>
      )}

      {/* Dual Selector Pills: Kecamatan & Desa */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {/* Dropdown 1: Kecamatan */}
        <div ref={kecDropdownRef} className="relative">
          <button
            id="dropdown-kecamatan-btn"
            onClick={() => {
              setKecamatanDropdownOpen(!kecamatanDropdownOpen);
              setDesaDropdownOpen(false);
            }}
            className="w-full flex items-center justify-between px-4 py-3 bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-2xs hover:border-sky-400 hover:bg-white text-slate-800 font-semibold text-sm transition-all focus:outline-none cursor-pointer"
          >
            <div className="flex items-center gap-2.5 truncate">
              <Building2 size={18} className="text-sky-600 shrink-0" />
              <span className="truncate">{selectedRegion.name}</span>
            </div>
            <ChevronDown
              size={16}
              className={`text-slate-400 transition-transform duration-200 shrink-0 ${
                kecamatanDropdownOpen ? 'rotate-180 text-sky-600' : ''
              }`}
            />
          </button>

          {kecamatanDropdownOpen && (
            <div className="absolute z-30 top-full left-0 right-0 mt-1.5 bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200 shadow-xl overflow-hidden max-h-64 overflow-y-auto p-1.5 space-y-0.5">
              <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                27 Kecamatan di Banyumas
              </div>
              {BANYUMAS_KECAMATAN.map((kec) => {
                const isSelected = kec.id === selectedRegion.id;
                return (
                  <button
                    key={kec.id}
                    id={`kec-option-${kec.id}`}
                    onClick={() => {
                      const defaultVil = kec.villages?.[0] || kec.name;
                      const vilCoord = getDesaCoordinates(kec.id, defaultVil);
                      onSelectRegion(
                        kec,
                        defaultVil,
                        vilCoord
                          ? { lat: vilCoord.lat, lng: vilCoord.lng, name: defaultVil }
                          : { lat: kec.lat, lng: kec.lng, name: kec.name }
                      );
                      setKecamatanDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs font-semibold transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-sky-50 text-sky-800 font-bold border border-sky-100'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>Kec. {kec.name}</span>
                    {isSelected && <Check size={14} className="text-sky-600" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Dropdown 2: Desa / Kelurahan */}
        <div ref={desaDropdownRef} className="relative">
          <button
            id="dropdown-desa-btn"
            onClick={() => {
              setDesaDropdownOpen(!desaDropdownOpen);
              setKecamatanDropdownOpen(false);
            }}
            className="w-full flex items-center justify-between px-4 py-3 bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-2xs hover:border-sky-400 hover:bg-white text-slate-800 font-semibold text-sm transition-all focus:outline-none cursor-pointer"
          >
            <div className="flex items-center gap-2.5 truncate">
              <MapPin size={18} className="text-blue-600 shrink-0" />
              <span className="truncate">{activeVillage}</span>
            </div>
            <ChevronDown
              size={16}
              className={`text-slate-400 transition-transform duration-200 shrink-0 ${
                desaDropdownOpen ? 'rotate-180 text-blue-600' : ''
              }`}
            />
          </button>

          {desaDropdownOpen && (
            <div className="absolute z-30 top-full left-0 right-0 mt-1.5 bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200 shadow-xl overflow-hidden max-h-64 overflow-y-auto p-1.5 space-y-0.5">
              <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Desa/Kelurahan di Kec. {selectedRegion.name}
              </div>
              {currentVillages.map((vil, idx) => {
                const isSelected = vil === activeVillage;
                return (
                  <button
                    key={`${vil}-${idx}`}
                    id={`village-option-${idx}`}
                    onClick={() => {
                      const vilCoord = getDesaCoordinates(selectedRegion.id, vil);
                      onSelectRegion(
                        selectedRegion,
                        vil,
                        vilCoord
                          ? { lat: vilCoord.lat, lng: vilCoord.lng, name: vil }
                          : undefined
                      );
                      setDesaDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs font-semibold transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 text-blue-800 font-bold border border-blue-100'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{vil}</span>
                    {isSelected && <Check size={14} className="text-blue-600" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};