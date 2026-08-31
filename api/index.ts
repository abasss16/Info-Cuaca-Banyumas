import express from 'express';
import path from 'path';
import fs from 'fs';
import {
  BANYUMAS_KECAMATAN,
  findNearestKecamatan,
  findPreciseLocation,
  getKecamatanById,
  getKecamatanByName,
} from '../src/data/banyumasRegions';
import { EMERGENCY_CONTACTS } from '../src/data/emergencyContacts';
import {
  generate30DayForecast,
  generateActiveAlerts,
  generateContinuousHourlyForecast,
  generateCurrentWeather,
  generateRadarGrid,
} from '../src/services/weatherEngine';
import {
  fetchLiveBmkgWeather,
  fetchLiveBmkgAlerts,
  fetchDailyForecastCombined,
} from '../src/services/bmkgLiveService';

const app = express();

// Middlewares
app.use(express.json());

// Security Headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Informasi Cuaca Banyumas API (BMKG Live Connected)',
    timestamp: new Date().toISOString(),
  });
});

// Regions list endpoint
app.get('/api/regions', (req, res) => {
  try {
    res.json({
      county: 'Kabupaten Banyumas',
      province: 'Jawa Tengah',
      totalKecamatan: BANYUMAS_KECAMATAN.length,
      regions: BANYUMAS_KECAMATAN,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Gagal memuat data wilayah' });
  }
});

// Official GeoJSON endpoint (Geoportal Palapa Kabupaten Banyumas WFS 10K 2023)
app.get('/api/regions/geojson', (req, res) => {
  try {
    const geojsonPath = path.join(process.cwd(), 'public', 'data', 'banyumas_kecamatan.geojson');
    if (fs.existsSync(geojsonPath)) {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.sendFile(geojsonPath);
    } else {
      res.status(404).json({ error: 'GeoJSON file not found' });
    }
  } catch (err: any) {
    res.status(500).json({ error: 'Gagal memuat batas GeoJSON wilayah' });
  }
});

// Search regions (kecamatan and desa)
app.get('/api/regions/search', (req, res) => {
  try {
    const q = ((req.query.q as string) || '').toLowerCase().trim();
    if (!q) {
      return res.json({ results: [] });
    }

    const results: Array<{
      name: string;
      type: 'kecamatan' | 'desa';
      kecamatanId: string;
      kecamatanName: string;
      lat: number;
      lng: number;
    }> = [];

    for (const kec of BANYUMAS_KECAMATAN) {
      if (kec.name.toLowerCase().includes(q)) {
        results.push({
          name: kec.name,
          type: 'kecamatan',
          kecamatanId: kec.id,
          kecamatanName: kec.name,
          lat: kec.lat,
          lng: kec.lng,
        });
      }

      if (kec.villages) {
        for (const vil of kec.villages) {
          if (vil.toLowerCase().includes(q)) {
            results.push({
              name: vil,
              type: 'desa',
              kecamatanId: kec.id,
              kecamatanName: kec.name,
              lat: kec.lat,
              lng: kec.lng,
            });
          }
        }
      }
    }

    res.json({ results: results.slice(0, 15) });
  } catch (err: any) {
    res.status(500).json({ error: 'Gagal melakukan pencarian wilayah' });
  }
});

// Nearest kecamatan & desa/kelurahan by GPS coordinates
app.get('/api/regions/nearest', (req, res) => {
  try {
    const lat = parseFloat(req.query.lat as string);
    const lng = parseFloat(req.query.lng as string);

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ error: 'Koordinat latitude dan longitude tidak valid' });
    }

    const precise = findPreciseLocation(lat, lng);
    res.json({
      nearestKecamatan: precise.region,
      village: precise.village,
      method: precise.method,
      distanceApproxMeters: precise.distanceMeters,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Gagal mendeteksi wilayah terdekat' });
  }
});

// Reverse Geocoding endpoint (OSM Nominatim + Local Fallback)
app.get('/api/regions/reverse-geocode', async (req, res) => {
  try {
    const lat = parseFloat(req.query.lat as string);
    const lng = parseFloat(req.query.lng as string);

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ error: 'Koordinat tidak valid' });
    }

    // Default to high-precision local matcher
    const localResult = findPreciseLocation(lat, lng);
    let detectedVillage = localResult.village;
    let detectedRegion = localResult.region;
    let addressDetails: any = null;

    // Try reverse geocoding with OpenStreetMap Nominatim (with 1.8s timeout)
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 1800);

      const osmRes = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: { 'User-Agent': 'BanyumasWeatherApp/2.0 (banyumas-bmkg)' },
          signal: controller.signal,
        }
      );
      clearTimeout(timeout);

      if (osmRes.ok) {
        const osmData = await osmRes.json();
        addressDetails = osmData.address;

        // Check all possible village name fields from OSM
        const candidateVillageNames = [
          addressDetails?.village,
          addressDetails?.suburb,
          addressDetails?.quarter,
          addressDetails?.neighbourhood,
          addressDetails?.residential,
          addressDetails?.hamlet,
        ].filter(Boolean) as string[];

        // 1. If localResult resolved via polygon_containment, detectedRegion is authoritative.
        // Check if OSM gives a village name that specifically exists WITHIN detectedRegion
        let matchedWithinRegion = false;
        if (detectedRegion.villages) {
          for (const cand of candidateVillageNames) {
            const cleanCand = cand.toLowerCase().replace(/kelurahan|desa|kel\.|ds\./gi, '').trim();
            const foundVil = detectedRegion.villages.find(
              (v) => v.toLowerCase() === cleanCand || cleanCand.includes(v.toLowerCase()) || v.toLowerCase().includes(cleanCand)
            );
            if (foundVil) {
              detectedVillage = foundVil;
              matchedWithinRegion = true;
              break;
            }
          }
        }

        // 2. If polygon didn't match and we need OSM district fallback
        if (!matchedWithinRegion && localResult.method !== 'polygon_containment') {
          const candidateDistricts = [
            addressDetails?.city_district,
            addressDetails?.municipality,
            addressDetails?.suburb,
            addressDetails?.district,
            addressDetails?.county,
          ].filter(Boolean) as string[];

          for (const candDist of candidateDistricts) {
            const cleanDist = candDist.replace(/kecamatan|kec\./gi, '').trim();
            const matchedKec = getKecamatanByName(cleanDist);
            if (matchedKec) {
              detectedRegion = matchedKec;
              break;
            }
          }

          if (candidateVillageNames.length > 0 && detectedRegion.villages) {
            for (const cand of candidateVillageNames) {
              const cleanVil = cand.toLowerCase().trim();
              const foundVil = detectedRegion.villages.find((v) =>
                v.toLowerCase().includes(cleanVil) || cleanVil.includes(v.toLowerCase())
              );
              if (foundVil) {
                detectedVillage = foundVil;
                break;
              }
            }
          }
        }
      }
    } catch (e) {
      // Fall back gracefully to local engine
    }

    res.json({
      region: detectedRegion,
      village: detectedVillage,
      lat,
      lng,
      addressDetails,
      method: localResult.method,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Gagal melakukan reverse geocoding' });
  }
});

// Live BMKG Cuaca Terkini & Prakiraan per Jam
app.get('/api/weather/live-bmkg', async (req, res) => {
  try {
    const regionId = (req.query.regionId as string) || '33.02.27';
    const village = req.query.village as string | undefined;
    const forceFresh = req.query.fresh === 'true' || req.query.refresh === '1';
    const region = getKecamatanById(regionId) || BANYUMAS_KECAMATAN[0];

    // Try fetching live data from official BMKG endpoint
    const liveData = await fetchLiveBmkgWeather(region, village, forceFresh);

    if (liveData) {
      return res.json({
        status: 'success',
        source: liveData.source,
        isLive: true,
        current: liveData.current,
        hourly: liveData.hourly,
      });
    }

    // High-precision fallback when BMKG upstream is unreachable
    const fallbackCurrent = generateCurrentWeather(region, village);
    const fallbackHourly = generateContinuousHourlyForecast(region, undefined, 24);

    return res.json({
      status: 'fallback',
      source: 'BMKG Data Model Lokal (Sinkronisasi Otomatis)',
      isLive: false,
      current: fallbackCurrent,
      hourly: fallbackHourly,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Gagal mengambil live data BMKG' });
  }
});

// Current weather endpoint
app.get('/api/weather/current', async (req, res) => {
  try {
    const regionId = (req.query.regionId as string) || '33.02.27'; // Default Purwokerto Utara
    const village = req.query.village as string | undefined;

    const region = getKecamatanById(regionId) || BANYUMAS_KECAMATAN[0];

    // Check if BMKG Live data is available first
    const liveData = await fetchLiveBmkgWeather(region, village);
    if (liveData) {
      return res.json(liveData.current);
    }

    const currentWeather = generateCurrentWeather(region, village);
    res.json(currentWeather);
  } catch (err: any) {
    res.status(500).json({ error: 'Gagal memuat cuaca terkini' });
  }
});

// Hourly forecast endpoint (BMKG 1-hour interval)
app.get('/api/weather/hourly', async (req, res) => {
  try {
    const regionId = (req.query.regionId as string) || '33.02.27';
    const village = req.query.village as string | undefined;
    const region = getKecamatanById(regionId) || BANYUMAS_KECAMATAN[0];

    const liveData = await fetchLiveBmkgWeather(region, village);
    if (liveData && liveData.hourly && liveData.hourly.length > 0) {
      return res.json({
        regionId: region.id,
        regionName: region.name,
        source: liveData.source,
        isLive: true,
        hourly: liveData.hourly,
      });
    }

    const fallbackHourly = generateContinuousHourlyForecast(region, 18, 24);
    res.json({
      regionId: region.id,
      regionName: region.name,
      source: 'BMKG Format Per Jam',
      isLive: false,
      hourly: fallbackHourly,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Gagal memuat data prakiraan per jam' });
  }
});

// Forecast endpoint (supports 30 days / 1 month grounded in BMKG + Open-Meteo)
app.get('/api/weather/forecast', async (req, res) => {
  try {
    const regionId = (req.query.regionId as string) || '33.02.27';
    const village = req.query.village as string | undefined;
    const days = parseInt(req.query.days as string, 10) || 30;
    const region = getKecamatanById(regionId) || BANYUMAS_KECAMATAN[0];

    const forecasts = await fetchDailyForecastCombined(region, village, days);

    res.json({
      regionId: region.id,
      regionName: region.name,
      village: village || region.villages?.[0],
      elevationMeters: region.elevationMeters,
      totalDays: forecasts.length,
      sources: [
        'BMKG (api.bmkg.go.id - Stasiun Meteorologi Kelas II Tunggul Wulung)',
        'Open-Meteo (Model Numerik Global ECMWF/GFS High-Resolution)',
      ],
      forecasts,
    });
  } catch (err: any) {
    console.error('[API Forecast Error]', err);
    const regionId = (req.query.regionId as string) || '33.02.27';
    const region = getKecamatanById(regionId) || BANYUMAS_KECAMATAN[0];
    const days = parseInt(req.query.days as string, 10) || 30;
    const fallbackForecasts = generate30DayForecast(region, days);
    res.json({
      regionId: region.id,
      regionName: region.name,
      elevationMeters: region.elevationMeters,
      totalDays: fallbackForecasts.length,
      sources: ['Model Cuaca Lokal'],
      forecasts: fallbackForecasts,
    });
  }
});

// Radar rainfall reflectivity grid endpoint
app.get('/api/weather/radar-grid', (req, res) => {
  try {
    const points = generateRadarGrid();
    res.json({
      timestamp: new Date().toISOString(),
      radarPoints: points,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Gagal memuat data radar cuaca' });
  }
});

// Early Weather Warnings endpoint (Live BMKG Synchronized)
app.get('/api/weather/alerts', async (req, res) => {
  try {
    const liveAlerts = await fetchLiveBmkgAlerts();
    res.json({
      count: liveAlerts.length,
      hasActiveAlert: liveAlerts.length > 0,
      alerts: liveAlerts,
      source: 'BMKG Stasiun Meteorologi Kelas II Tunggul Wulung / api.bmkg.go.id',
      syncedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    const fallbackAlerts = generateActiveAlerts();
    res.json({
      count: fallbackAlerts.length,
      hasActiveAlert: fallbackAlerts.length > 0,
      alerts: fallbackAlerts,
      source: 'BMKG Data Model Lokal',
      syncedAt: new Date().toISOString(),
    });
  }
});

// Emergency contacts endpoint
app.get('/api/emergency-contacts', (req, res) => {
  try {
    res.json({
      county: 'Kabupaten Banyumas',
      contacts: EMERGENCY_CONTACTS,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Gagal memuat kontak darurat' });
  }
});

// NOTE: no app.listen() here and no static/Vite middleware.
// Vercel calls this exported app directly as the request handler for
// every request that vercel.json rewrites to /api, and serves the
// built frontend (dist/) separately via its static file system.
export default app;
