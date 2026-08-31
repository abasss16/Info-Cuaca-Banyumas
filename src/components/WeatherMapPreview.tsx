import React from 'react';
import { Maximize2, Map } from 'lucide-react';
import { Region } from '../types/weather';
import { WeatherMapLeaflet } from './WeatherMapLeaflet';

interface WeatherMapPreviewProps {
  selectedRegion: Region;
  selectedVillage?: string;
  userExactCoords?: { lat: number; lng: number; accuracy?: number; name?: string } | null;
  onSelectRegion: (
    region: Region,
    village?: string,
    exactCoords?: { lat: number; lng: number; accuracy?: number; name?: string }
  ) => void;
  onViewFullMap: () => void;
}

export const WeatherMapPreview: React.FC<WeatherMapPreviewProps> = ({
  selectedRegion,
  selectedVillage,
  userExactCoords,
  onSelectRegion,
  onViewFullMap,
}) => {
  return (
    <div className="w-full glass-card rounded-3xl p-4 sm:p-5 space-y-3 shadow-2xs border border-slate-200/80">
      {/* Header with Professional Polish Typography */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            Peta Cuaca Wilayah Banyumas
          </h3>
        </div>
      </div>

      {/* Embedded Map Leaflet Container */}
      <div className="w-full overflow-hidden rounded-2xl border border-slate-200/60 shadow-inner">
        <WeatherMapLeaflet
          selectedRegion={selectedRegion}
          selectedVillage={selectedVillage}
          userExactCoords={userExactCoords}
          onSelectRegion={onSelectRegion}
          heightClass="h-[340px] sm:h-[380px]"
          isCompact={true}
          onViewFullMap={onViewFullMap}
        />
      </div>
    </div>
  );
};

