import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import {
  Layers,
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Minimize2,
  Thermometer,
  Wind,
  Info,
  MapPin,
  Map,
  Mountain,
  Globe,
  Compass,
  Sparkles,
  LocateFixed,
  Loader2,
} from 'lucide-react';
import { Region, BaseMapType } from '../types/weather';
import {
  BANYUMAS_BOUNDS,
  BANYUMAS_CENTER,
  BANYUMAS_COUNTY_BOUNDARY,
  BANYUMAS_KECAMATAN,
  KECAMATAN_ADMIN_COLORS,
  findPreciseLocation,
} from '../data/banyumasRegions';
import {
  renderContinuousScalarLayer,
  WindFieldParticleEngine,
  sampleWeatherScalarField,
} from '../services/weatherLayersRenderer';

interface WeatherMapLeafletProps {
  selectedRegion?: Region;
  selectedVillage?: string;
  userExactCoords?: { lat: number; lng: number; accuracy?: number; name?: string } | null;
  onSelectRegion?: (
    region: Region,
    village?: string,
    exactCoords?: { lat: number; lng: number; accuracy?: number; name?: string }
  ) => void;
  heightClass?: string;
  isCompact?: boolean;
  onViewFullMap?: () => void;
}

export const WeatherMapLeaflet: React.FC<WeatherMapLeafletProps> = ({
  selectedRegion,
  selectedVillage,
  userExactCoords,
  onSelectRegion,
  heightClass = 'h-[480px]',
  isCompact = false,
  onViewFullMap,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const baseTileLayerRef = useRef<L.TileLayer | null>(null);
  const baseLabelsLayerRef = useRef<L.TileLayer | null>(null);
  const boundaryLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const accuracyCircleRef = useRef<L.Circle | null>(null);

  const windEngineRef = useRef<WindFieldParticleEngine>(new WindFieldParticleEngine());
  const animationFrameIdRef = useRef<number | null>(null);

  // Basemap Selector State: 'standard' | 'topography' | 'satellite'
  const [baseMap, setBaseMap] = useState<BaseMapType>('standard');
  const [isLocatingMap, setIsLocatingMap] = useState<boolean>(false);

  // Weather Layer States: single/multi active continuous scalar layers (Suhu & Aliran Angin)
  const [activeLayers, setActiveLayers] = useState<{
    temperature: boolean;
    wind: boolean;
  }>({
    temperature: false, // Default to Temperature 2m Above Ground (like WeatherLayers GL)
    wind: false,
  });

  const [opacity, setOpacity] = useState<number>(0.75);
  const [showBoundaries, setShowBoundaries] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [timeStep, setTimeStep] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [hoverData, setHoverData] = useState<{
    lat: number;
    lng: number;
    temp: number;
    windSpeed: number;
    windDeg: number;
  } | null>(null);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const timeLabels = ['-30 mnt', 'Sekarang', '+30 mnt'];

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: BANYUMAS_CENTER,
        zoom: isCompact ? 10 : 11,
        minZoom: 9,
        maxZoom: 18,
        maxBounds: [
          [-7.8, 108.75],
          [-7.1, 109.6],
        ],
        zoomControl: false,
        attributionControl: false,
      });

      boundaryLayerGroupRef.current = L.layerGroup().addTo(map);

      // Track cursor position to inspect continuous scalar field values
      map.on('mousemove', (e: L.LeafletMouseEvent) => {
        const sample = sampleWeatherScalarField(e.latlng.lat, e.latlng.lng, (timeStep - 2) * 0.5);
        setHoverData({
          lat: e.latlng.lat,
          lng: e.latlng.lng,
          temp: sample.temperature,
          windSpeed: sample.windSpeed,
          windDeg: sample.windDeg,
        });
      });

      map.on('mouseout', () => {
        setHoverData(null);
      });

      // Click on any part of the map to select nearest kecamatan with high-precision polygon / village matcher
      map.on('click', (e: L.LeafletMouseEvent) => {
        const clickLat = e.latlng.lat;
        const clickLng = e.latlng.lng;

        const precise = findPreciseLocation(clickLat, clickLng);
        if (precise.region && onSelectRegion) {
          onSelectRegion(precise.region, precise.village, {
            lat: clickLat,
            lng: clickLng,
            name: precise.village || precise.region.name,
          });
        }
      });

      mapInstanceRef.current = map;
    }
  }, [isCompact, timeStep, onSelectRegion]);

  // Handle Basemap Tile Layer Switching
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (baseTileLayerRef.current) {
      map.removeLayer(baseTileLayerRef.current);
      baseTileLayerRef.current = null;
    }
    if (baseLabelsLayerRef.current) {
      map.removeLayer(baseLabelsLayerRef.current);
      baseLabelsLayerRef.current = null;
    }

    if (baseMap === 'standard') {
      baseTileLayerRef.current = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          maxZoom: 19,
          subdomains: 'abc',
          attribution: '&copy; OpenStreetMap contributors',
        }
      ).addTo(map);
    } else if (baseMap === 'topography') {
      baseTileLayerRef.current = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 19,
          attribution: '&copy; Esri &mdash; National Geographic, DeLorme, HERE, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, increment P Corp.',
        }
      ).addTo(map);
    } else if (baseMap === 'satellite') {
      baseTileLayerRef.current = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 19,
          attribution: '&copy; Esri, Maxar, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, IGP, and GIS User Community',
        }
      ).addTo(map);

      baseLabelsLayerRef.current = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 19, opacity: 0.85 }
      ).addTo(map);
    }

    if (boundaryLayerGroupRef.current) {
      boundaryLayerGroupRef.current.bringToFront?.();
    }
  }, [baseMap]);

  // Render Administrative Boundaries & Region Markers (matching official Peta Administrasi Kabupaten Banyumas)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !boundaryLayerGroupRef.current) return;

    boundaryLayerGroupRef.current.clearLayers();

    if (showBoundaries) {
      const isSat = baseMap === 'satellite';
      const isTopo = baseMap === 'topography';

      // 1. Kecamatan Administrative Polygons & Dashed Boundaries
      BANYUMAS_KECAMATAN.forEach((kec) => {
        const isSelected = selectedRegion?.id === kec.id;
        const adminStyle = KECAMATAN_ADMIN_COLORS[kec.id] || { fill: '#38bdf8', stroke: '#0284c7' };
        const coords = kec.boundaryMultiCoords && kec.boundaryMultiCoords.length > 0 ? kec.boundaryMultiCoords : kec.boundaryCoords;

        if (coords && coords.length > 0) {
          const polygon = L.polygon(coords as any, {
            color: isSelected ? '#ea580c' : (isSat ? '#94a3b8' : adminStyle.stroke),
            weight: isSelected ? 2.5 : 1.2,
            opacity: isSelected ? 1 : 0.8,
            fillColor: isSelected ? '#fb923c' : adminStyle.fill,
            fillOpacity: isSelected ? 0.45 : (isSat ? 0.15 : 0.28),
            dashArray: isSelected ? undefined : '4, 4',
            className: 'cursor-pointer',
          });

          polygon.bindTooltip(
            `<div class="p-1.5 text-left font-sans">
              <div class="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full inline-block" style="background-color: ${adminStyle.stroke}"></span>
                Kecamatan ${kec.name}
              </div>
              <div class="text-[10px] text-slate-600 font-semibold mt-0.5">Elevasi: ${kec.elevationMeters}m dpl</div>
              <div class="text-[9px] text-sky-700 font-bold mt-1">Batas Resmi Geoportal Banyumas</div>
            </div>`,
            { sticky: true, className: 'glass-pill' }
          );

          polygon.on('click', (e) => {
            L.DomEvent.stopPropagation(e);
            if (onSelectRegion) {
              onSelectRegion(kec, kec.villages?.[0] || kec.name, {
                lat: kec.lat,
                lng: kec.lng,
                name: kec.name,
              });
            }
          });

          boundaryLayerGroupRef.current?.addLayer(polygon);
        }

        // 2. Kecamatan Name Labels (Interactive Cartographic Typography)
        const labelHtml = isSelected
          ? `<div class="px-2 py-0.5 text-[10px] font-black text-white bg-orange-600 rounded-md border border-orange-400 shadow-md whitespace-nowrap cursor-pointer scale-105 transition-transform">${kec.name}</div>`
          : isSat
          ? `<div class="px-1.5 py-0.5 text-[9px] font-bold text-slate-100 bg-slate-900/85 hover:bg-slate-800 rounded border border-slate-700 shadow-sm backdrop-blur-xs whitespace-nowrap cursor-pointer transition-colors">${kec.name}</div>`
          : `<div class="px-1.5 py-0.5 text-[9px] font-bold text-slate-800 bg-white/90 hover:bg-sky-50 rounded border border-slate-300 shadow-2xs backdrop-blur-xs whitespace-nowrap cursor-pointer transition-colors">${kec.name}</div>`;

        const labelIcon = L.divIcon({
          className: 'custom-map-label',
          html: labelHtml,
          iconAnchor: [24, 8],
        });
        const marker = L.marker([kec.lat, kec.lng], { icon: labelIcon, interactive: true });
        marker.on('click', (e) => {
          L.DomEvent.stopPropagation(e);
          if (onSelectRegion) {
            onSelectRegion(kec, kec.villages?.[0] || kec.name, {
              lat: kec.lat,
              lng: kec.lng,
              name: kec.name,
            });
          }
        });
        boundaryLayerGroupRef.current?.addLayer(marker);
      });

      // 3. Outer Kabupaten Boundary (Batas Kabupaten - Clean Slim Refined Outline)
      const countyPolygon = L.polygon(BANYUMAS_COUNTY_BOUNDARY, {
        color: isSat ? '#38bdf8' : isTopo ? '#991b1b' : '#334155',
        weight: 1.8,
        opacity: 0.9,
        fillColor: 'transparent',
        fillOpacity: 0,
        interactive: false,
      });
      boundaryLayerGroupRef.current.addLayer(countyPolygon);
    }

    // Selected location pin / Exact GPS pin rendering
    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }
    if (accuracyCircleRef.current) {
      accuracyCircleRef.current.remove();
      accuracyCircleRef.current = null;
    }

    if (userExactCoords) {
      // 1. High precision GPS location marker with accuracy circle
      if (userExactCoords.accuracy && userExactCoords.accuracy > 0) {
        accuracyCircleRef.current = L.circle(
          [userExactCoords.lat, userExactCoords.lng],
          {
            radius: Math.min(Math.max(userExactCoords.accuracy, 15), 350),
            color: '#0284c7',
            fillColor: '#38bdf8',
            fillOpacity: 0.16,
            weight: 1.5,
            dashArray: '3, 4',
            interactive: false,
          }
        ).addTo(map);
      }

      const gpsPinIcon = L.divIcon({
        className: 'custom-gps-pin',
        html: `
          <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
            <div class="absolute w-10 h-10 bg-blue-500/30 rounded-full animate-ping"></div>
            <div class="absolute w-6 h-6 bg-blue-500/40 rounded-full animate-pulse"></div>
            <div class="relative w-4 h-4 bg-blue-600 border-2 border-white rounded-full shadow-lg flex items-center justify-center">
              <div class="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const gpsMarker = L.marker([userExactCoords.lat, userExactCoords.lng], {
        icon: gpsPinIcon,
        zIndexOffset: 1500,
      }).addTo(map);

      const locationLabel = selectedVillage || userExactCoords.name || (selectedRegion ? selectedRegion.name : 'Lokasi Terdeteksi');
      const kecName = selectedRegion ? selectedRegion.name : '';

      gpsMarker.bindPopup(`
        <div class="p-1 font-sans text-left">
          <div class="text-[11px] font-bold text-sky-700 flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            Titik Lokasi GPS Anda
          </div>
          <div class="text-xs font-black text-slate-900 mt-0.5">
            ${locationLabel}${kecName && !locationLabel.includes(kecName) ? `, Kec. ${kecName}` : ''}
          </div>
          <div class="text-[10px] text-slate-500 font-mono mt-0.5">
            ${userExactCoords.lat.toFixed(5)}, ${userExactCoords.lng.toFixed(5)}
          </div>
        </div>
      `);

      markerRef.current = gpsMarker;
      map.flyTo([userExactCoords.lat, userExactCoords.lng], Math.max(map.getZoom(), 14), {
        animate: true,
        duration: 1.2,
      });
    } else if (selectedRegion) {
      // 2. Standard Kecamatan Centroid pin
      const pinIcon = L.divIcon({
        className: 'custom-pin-icon',
        html: `
          <div class="relative flex items-center justify-center">
            <div class="absolute w-8 h-8 bg-sky-500/40 rounded-full animate-ping"></div>
            <div class="w-7 h-7 bg-sky-600 border-2 border-white text-white rounded-full flex items-center justify-center shadow-lg">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
      });

      markerRef.current = L.marker([selectedRegion.lat, selectedRegion.lng], {
        icon: pinIcon,
        zIndexOffset: 1000,
      }).addTo(map);

      map.panTo([selectedRegion.lat, selectedRegion.lng], { animate: true, duration: 0.8 });
    }
  }, [selectedRegion, selectedVillage, userExactCoords, showBoundaries, baseMap]);

  // Main Canvas Rendering Loop: Continuous WeatherLayers GL Scalar Raster + Wind Particles
  const drawWeatherLayers = useCallback(() => {
    const map = mapInstanceRef.current;
    const canvas = canvasRef.current;
    if (!map || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = map.getSize();
    const dpr = window.devicePixelRatio || 1;

    // Synchronize canvas physical size with Leaflet viewport
    if (canvas.width !== size.x * dpr || canvas.height !== size.y * dpr) {
      canvas.width = size.x * dpr;
      canvas.height = size.y * dpr;
      canvas.style.width = `${size.x}px`;
      canvas.style.height = `${size.y}px`;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, size.x, size.y);

    // Get current geographic bounding box of map viewport
    const b = map.getBounds();
    const bounds = {
      minLat: b.getSouth(),
      maxLat: b.getNorth(),
      minLng: b.getWest(),
      maxLng: b.getEast(),
    };

    const timeOffsetHours = (timeStep - 2) * 0.5;

    // 1. Render Continuous Temperature Field (gfs/temperature_2m_above_ground)
    if (activeLayers.temperature) {
      renderContinuousScalarLayer(
        ctx,
        size.x,
        size.y,
        bounds,
        'temperature',
        opacity * 0.78,
        timeOffsetHours
      );
    }

    // 2. Render Continuous Wind Speed Field (Light Blue Gradient) & Animated Streamlines
    if (activeLayers.wind) {
      renderContinuousScalarLayer(
        ctx,
        size.x,
        size.y,
        bounds,
        'wind',
        opacity * 0.72,
        timeOffsetHours
      );
      windEngineRef.current.render(ctx, size.x, size.y, bounds, opacity);
    }

    ctx.restore();
  }, [activeLayers, opacity, timeStep]);

  // Hook Leaflet pan, zoom, and resize events to redraw canvas
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const handleUpdate = () => {
      drawWeatherLayers();
    };

    map.on('move', handleUpdate);
    map.on('zoom', handleUpdate);
    map.on('resize', handleUpdate);
    handleUpdate();

    return () => {
      map.off('move', handleUpdate);
      map.off('zoom', handleUpdate);
      map.off('resize', handleUpdate);
    };
  }, [drawWeatherLayers]);

  // Continuous animation frame loop for wind streamlines
  useEffect(() => {
    let running = true;

    const loop = () => {
      if (activeLayers.wind) {
        drawWeatherLayers();
      }
      if (running) {
        animationFrameIdRef.current = requestAnimationFrame(loop);
      }
    };

    if (activeLayers.wind) {
      animationFrameIdRef.current = requestAnimationFrame(loop);
    } else {
      drawWeatherLayers();
    }

    return () => {
      running = false;
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [activeLayers.wind, drawWeatherLayers]);

  // Timeline player timer
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimeStep((prev) => (prev + 1) % timeLabels.length);
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const toggleFullscreen = () => {
    if (!wrapperRef.current) return;
    if (!document.fullscreenElement) {
      wrapperRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleZoom = (delta: number) => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setZoom(mapInstanceRef.current.getZoom() + delta);
  };

  const handleResetView = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setView(BANYUMAS_CENTER, isCompact ? 10 : 11);
  };

  const handleLocateMeOnMap = () => {
    if (!navigator.geolocation) return;
    setIsLocatingMap(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setIsLocatingMap(false);
        const { latitude, longitude, accuracy } = pos.coords;

        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([latitude, longitude], 15, {
            animate: true,
            duration: 1.2,
          });
        }

        try {
          const res = await fetch(
            `/api/regions/reverse-geocode?lat=${latitude}&lng=${longitude}`
          );
          if (res.ok) {
            const data = await res.json();
            if (data.region && onSelectRegion) {
              const matchedVillage =
                data.village || data.region.villages?.[0] || data.region.name;
              onSelectRegion(data.region, matchedVillage, {
                lat: latitude,
                lng: longitude,
                accuracy: accuracy || 15,
                name: matchedVillage,
              });
              return;
            }
          }
        } catch (e) {
          // Fall back to local
        }

        const precise = findPreciseLocation(latitude, longitude);
        if (precise.region && onSelectRegion) {
          onSelectRegion(precise.region, precise.village, {
            lat: latitude,
            lng: longitude,
            accuracy: accuracy || 15,
            name: precise.village,
          });
        }
      },
      () => {
        setIsLocatingMap(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div
      ref={wrapperRef}
      className={`relative w-full ${isFullscreen ? 'h-screen' : heightClass} rounded-3xl overflow-hidden shadow-md border border-slate-200/80 bg-slate-950 flex flex-col`}
    >
      {/* Top Controls Container: WeatherLayers Selection + Basemap Selector + Fullscreen */}
      <div className="absolute top-2 sm:top-3 left-2 sm:left-3 right-2 sm:right-3 z-20 flex items-center justify-between gap-1 sm:gap-2 pointer-events-none">
        {/* Left Side: Continuous Layer Switchers */}
        <div className="flex items-center gap-0.5 sm:gap-1.5 p-0.5 sm:p-1 bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl border border-slate-200/90 shadow-md pointer-events-auto shrink-0">
          {/* Suhu (gfs/temperature_2m_above_ground) */}
          <button
            onClick={() =>
              setActiveLayers((prev) => ({ ...prev, temperature: !prev.temperature }))
            }
            title="Layer Suhu Permukaan (gfs/temperature_2m_above_ground)"
            className={`flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[9px] sm:text-xs font-bold transition-all shrink-0 ${
              activeLayers.temperature
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Thermometer className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="hidden xs:inline sm:inline">Suhu (°C)</span>
            <span className="xs:hidden sm:hidden">Suhu</span>
          </button>

          {/* Angin (Streamlines & Field) */}
          <button
            onClick={() => setActiveLayers((prev) => ({ ...prev, wind: !prev.wind }))}
            title="Lapisan Kecepatan & Aliran Angin Kontinu (Wind Field & Streamlines)"
            className={`flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[9px] sm:text-xs font-bold transition-all shrink-0 ${
              activeLayers.wind
                ? 'bg-sky-500 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Wind className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="hidden xs:inline sm:inline">Aliran Angin</span>
            <span className="xs:hidden sm:hidden">Angin</span>
          </button>
        </div>

        {/* Right Side: Basemap Switcher + Fullscreen */}
        <div className="flex items-center gap-1 sm:gap-1.5 pointer-events-auto shrink-0">
          <div className="flex items-center gap-0.5 bg-white/95 backdrop-blur-md p-0.5 sm:p-1 rounded-xl sm:rounded-2xl border border-slate-200/90 shadow-md">
            <button
              id="btn-basemap-standard"
              onClick={() => setBaseMap('standard')}
              title="Peta Standar (Jalan & Wilayah)"
              className={`flex items-center gap-0.5 sm:gap-1.5 px-1.5 sm:px-2.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[9px] sm:text-xs font-bold transition-all ${
                baseMap === 'standard'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Map className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Biasa</span>
            </button>

            <button
              id="btn-basemap-topography"
              onClick={() => setBaseMap('topography')}
              title="Topografi Kontur (Relief Elevasi Gunung Slamet)"
              className={`flex items-center gap-0.5 sm:gap-1.5 px-1.5 sm:px-2.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[9px] sm:text-xs font-bold transition-all ${
                baseMap === 'topography'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Mountain className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="hidden sm:inline">Topografi</span>
              <span className="sm:hidden">Medan</span>
            </button>

            <button
              id="btn-basemap-satellite"
              onClick={() => setBaseMap('satellite')}
              title="Citra Satelit Resolusi Tinggi (Esri World Imagery)"
              className={`flex items-center gap-0.5 sm:gap-1.5 px-1.5 sm:px-2.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[9px] sm:text-xs font-bold transition-all ${
                baseMap === 'satellite'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Satelit</span>
            </button>
          </div>

          {isCompact && onViewFullMap ? (
            <button
              onClick={onViewFullMap}
              title="Lihat Peta Penuh"
              className="flex items-center gap-1 px-1.5 sm:px-3 py-1 sm:py-2 bg-white/95 hover:bg-white text-sky-800 backdrop-blur-md rounded-xl sm:rounded-2xl text-[9px] sm:text-xs font-bold border border-slate-200/90 shadow-md transition-all shrink-0"
            >
              <span className="hidden sm:inline">Peta Penuh</span>
              <Maximize2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>
          ) : (
            <button
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Keluar Fullscreen' : 'Layar Penuh'}
              className="p-1 sm:p-2 bg-white/95 hover:bg-white text-slate-700 backdrop-blur-md rounded-xl sm:rounded-2xl border border-slate-200/90 shadow-md transition-all shrink-0"
            >
              {isFullscreen ? (
                <Minimize2 className="w-3 h-3 sm:w-4 sm:h-4" />
              ) : (
                <Maximize2 className="w-3 h-3 sm:w-4 sm:h-4" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* WeatherLayers-Style Continuous Colormap & Administrative Legends (Top-Left Overlay below Layer Toolbar) */}
      <div className="absolute top-12 sm:top-16 left-2.5 sm:left-3 z-20 flex flex-col gap-1 sm:gap-2.5 p-1.5 sm:p-3 bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl border border-slate-200/90 shadow-lg pointer-events-auto max-w-[130px] sm:max-w-[240px] text-[8px] sm:text-[10px] transition-all origin-top-left">
        {/* 1. Suhu Legend */}
        {activeLayers.temperature && (
          <div className="space-y-0.5 sm:space-y-1">
            <div className="flex justify-between items-center font-extrabold text-slate-700">
              <span className="truncate">Suhu 2m (GFS)</span>
              <span className="text-amber-600 font-bold ml-1">°C</span>
            </div>
            {/* Continuous Smooth Colorbar Ramp */}
            <div
              className="w-full h-1.5 sm:h-3 rounded-full shadow-inner border border-slate-300"
              style={{
                background:
                  'linear-gradient(to right, #2c1b82, #1d4ed8, #0284c7, #06b6d4, #14b8a6, #10b981, #84cc16, #eab308, #f97316, #ef4444, #b91c1c)',
              }}
            />
            <div className="flex justify-between text-[7px] sm:text-[9px] font-bold text-slate-500">
              <span>10°</span>
              <span>17°</span>
              <span>24°</span>
              <span>29°</span>
              <span>35°+</span>
            </div>
          </div>
        )}

        {/* 2. Angin Legend (Light Blue Wind Speed & Streamlines) */}
        {activeLayers.wind && (
          <div className="space-y-0.5 sm:space-y-1 pt-0.5 sm:pt-1 border-t border-slate-100">
            <div className="flex justify-between items-center font-extrabold text-slate-700">
              <span className="truncate">Kecepatan Angin</span>
              <span className="text-sky-600 font-bold ml-1">km/j</span>
            </div>
            <div
              className="w-full h-1.5 sm:h-3 rounded-full shadow-inner border border-slate-300"
              style={{
                background:
                  'linear-gradient(to right, #f0f9ff, #e0f2fe, #bae6fd, #7dd3fc, #38bdf8, #0ea5e9)',
              }}
            />
            <div className="flex justify-between text-[7px] sm:text-[9px] font-bold text-slate-500">
              <span>5</span>
              <span>12</span>
              <span>20</span>
              <span>30+</span>
            </div>
          </div>
        )}

        {/* 3. Batas Administrasi Legend */}
        {showBoundaries && (
          <div className="space-y-0.5 sm:space-y-1.5 pt-0.5 sm:pt-1.5 border-t border-slate-100">
            <div className="font-extrabold text-slate-700 uppercase tracking-wider">
              Batas Wilayah
            </div>
            <div className="flex items-center gap-1.5 font-bold text-slate-600">
              <div className="w-3.5 sm:w-6 h-0.5 bg-slate-700 rounded-full shrink-0" />
              <span className="truncate">Kabupaten</span>
            </div>
            <div className="flex items-center gap-1.5 font-bold text-slate-600">
              <div className="w-3.5 sm:w-6 border-b border-dashed border-slate-600 shrink-0" />
              <span className="truncate">Kecamatan</span>
            </div>
          </div>
        )}
      </div>

      {/* Floating Hover Inspector */}
      {hoverData && (
        <div className="absolute top-12 sm:top-16 right-2.5 sm:right-3 z-20 p-1.5 sm:p-2.5 bg-slate-900/90 backdrop-blur-md rounded-xl sm:rounded-2xl border border-slate-700 text-white shadow-xl pointer-events-none animate-in fade-in duration-200">
          <div className="flex items-center gap-1 text-[8px] sm:text-[10px] text-sky-400 font-bold uppercase tracking-wider mb-0.5 sm:mb-1">
            <Sparkles size={10} className="sm:w-3 sm:h-3" />
            <span>({hoverData.lat.toFixed(3)}, {hoverData.lng.toFixed(3)})</span>
          </div>
          <div className="grid grid-cols-2 gap-x-2 sm:gap-x-4 gap-y-0.5 text-[9px] sm:text-xs">
            <div className="flex items-center justify-between gap-1 sm:gap-2">
              <span className="text-slate-400">Suhu:</span>
              <span className="font-extrabold text-amber-400">{hoverData.temp}°C</span>
            </div>
            <div className="flex items-center justify-between gap-1 sm:gap-2">
              <span className="text-slate-400">Angin:</span>
              <span className="font-bold text-sky-400">{hoverData.windSpeed} km/h</span>
            </div>
          </div>
        </div>
      )}

      {/* Map Navigation Controls (Right Side Zoom, Locate & Reset) */}
      <div className="absolute bottom-14 sm:bottom-20 right-2.5 sm:right-3 z-20 flex flex-col gap-1 sm:gap-1.5 pointer-events-auto">
        <button
          onClick={handleLocateMeOnMap}
          disabled={isLocatingMap}
          title="Pusatkan ke Titik Lokasi GPS Saya"
          className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-white/95 hover:bg-white text-sky-600 hover:text-sky-700 backdrop-blur-md rounded-lg sm:rounded-xl border border-slate-200/90 shadow-md transition-all"
        >
          {isLocatingMap ? (
            <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin text-sky-600" />
          ) : (
            <LocateFixed className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          )}
        </button>
        <button
          onClick={() => handleZoom(1)}
          className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-white/95 hover:bg-white text-slate-700 backdrop-blur-md rounded-lg sm:rounded-xl border border-slate-200/90 shadow-md text-xs sm:text-base font-bold transition-all"
        >
          +
        </button>
        <button
          onClick={() => handleZoom(-1)}
          className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-white/95 hover:bg-white text-slate-700 backdrop-blur-md rounded-lg sm:rounded-xl border border-slate-200/90 shadow-md text-xs sm:text-base font-bold transition-all"
        >
          -
        </button>
        <button
          onClick={handleResetView}
          title="Fokus Kabupaten Banyumas"
          className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-white/95 hover:bg-white text-slate-700 backdrop-blur-md rounded-lg sm:rounded-xl border border-slate-200/90 shadow-md transition-all"
        >
          <RotateCcw className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        </button>
      </div>

      {/* Leaflet Base Container */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[300px] z-0" />

      {/* Continuous WeatherLayers HTML5 Canvas Overlay */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10 pointer-events-none"
      />

      {/* Bottom Timeline & Controls Bar (Single Horizontal Row Layout Identical to Desktop) */}
      <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3 z-20 p-1 sm:p-2.5 bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl border border-slate-200/90 shadow-lg pointer-events-auto flex items-center justify-between gap-1 sm:gap-3 overflow-x-auto no-scrollbar">
        {/* Timeline Player */}
        <div className="flex items-center gap-0.5 sm:gap-2 shrink-0">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1 sm:p-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg sm:rounded-xl shadow-xs transition-colors shrink-0"
            title={isPlaying ? 'Jeda Animasi' : 'Putar Animasi'}
          >
            {isPlaying ? (
              <Pause className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            ) : (
              <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            )}
          </button>

          <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-lg sm:rounded-xl">
            {timeLabels.map((label, idx) => (
              <button
                key={label}
                onClick={() => setTimeStep(idx)}
                className={`px-1 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-[8px] sm:text-[10px] font-bold transition-all shrink-0 whitespace-nowrap ${
                  timeStep === idx
                    ? 'bg-white text-sky-800 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Opacity Slider & Boundary Toggles (Exact Same Desktop Position Scaled Proportionally) */}
        <div className="flex items-center justify-end gap-1 sm:gap-3 text-[8px] sm:text-xs font-semibold text-slate-600 shrink-0">
          <div className="flex items-center gap-0.5 sm:gap-2">
            <span className="text-[8px] sm:text-[10px] text-slate-400 font-bold uppercase whitespace-nowrap">
              <span className="hidden sm:inline">Transparansi</span>
              <span className="sm:hidden">Transparan</span>
            </span>
            <input
              type="range"
              min="0.2"
              max="1"
              step="0.05"
              value={opacity}
              onChange={(e) => setOpacity(parseFloat(e.target.value))}
              className="w-10 sm:w-20 accent-sky-600 cursor-pointer h-1 sm:h-1.5"
            />
          </div>

          <label className="flex items-center gap-0.5 sm:gap-1.5 cursor-pointer select-none whitespace-nowrap">
            <input
              type="checkbox"
              checked={showBoundaries}
              onChange={(e) => setShowBoundaries(e.target.checked)}
              className="accent-sky-600 rounded scale-75 sm:scale-100"
            />
            <span className="text-[8px] sm:text-xs">
              <span className="hidden sm:inline">Batas Wilayah</span>
              <span className="sm:hidden">Batas</span>
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};
