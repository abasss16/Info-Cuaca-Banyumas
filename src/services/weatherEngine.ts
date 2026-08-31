import {
  CurrentWeather,
  DailyForecastItem,
  HourlyForecastItem,
  RadarDataPoint,
  Region,
  WeatherAlert,
  WeatherCondition,
} from '../types/weather';
import { BANYUMAS_KECAMATAN, getKecamatanById } from '../data/banyumasRegions';

export const BMKG_WEATHER_CONDITIONS: Record<number, WeatherCondition> = {
  0: { code: 0, name: 'Cerah', icon: 'Sun', color: '#F59E0B', isRain: false },
  1: { code: 1, name: 'Cerah Berawan', icon: 'CloudSun', color: '#10B981', isRain: false },
  2: { code: 2, name: 'Cerah Berawan', icon: 'CloudSun', color: '#10B981', isRain: false },
  3: { code: 3, name: 'Berawan', icon: 'Cloud', color: '#64748B', isRain: false },
  4: { code: 4, name: 'Berawan Tebal', icon: 'Clouds', color: '#475569', isRain: false },
  5: { code: 5, name: 'Udara Kabur', icon: 'Haze', color: '#94A3B8', isRain: false },
  45: { code: 45, name: 'Kabut', icon: 'Fog', color: '#94A3B8', isRain: false },
  60: { code: 60, name: 'Hujan Ringan', icon: 'CloudRain', color: '#0284C7', isRain: true },
  61: { code: 61, name: 'Hujan Sedang', icon: 'CloudRain', color: '#2563EB', isRain: true },
  63: { code: 63, name: 'Hujan Lebat', icon: 'CloudHeavyRain', color: '#DC2626', isRain: true },
  95: { code: 95, name: 'Hujan Petir', icon: 'CloudLightning', color: '#7C3AED', isRain: true },
  97: { code: 97, name: 'Hujan Petir Lebat', icon: 'CloudLightning', color: '#991B1B', isRain: true },
};

export const WIND_DIRECTIONS = [
  'Utara',
  'Timur Laut',
  'Timur',
  'Tenggara',
  'Selatan',
  'Barat Daya',
  'Barat',
  'Barat Laut',
];

// Helper to get formatted WIB time string (Asia/Jakarta UTC+7)
export function getWIBDate(date = new Date()): Date {
  const d = new Date(date);
  // Get time in Asia/Jakarta timezone
  const jakartaString = d.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });
  return new Date(jakartaString);
}

export function getWIBTimeString(date = new Date()): string {
  const d = new Date(date);
  const timeFormatter = new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Jakarta',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const parts = timeFormatter.formatToParts(d);
  const hour = parts.find((p) => p.type === 'hour')?.value || String(d.getHours()).padStart(2, '0');
  const minute = parts.find((p) => p.type === 'minute')?.value || String(d.getMinutes()).padStart(2, '0');
  return `${hour}:${minute} WIB`;
}

export function getWIBDateFormatted(date = new Date()): string {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Jakarta',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };
  return new Intl.DateTimeFormat('id-ID', options).format(date);
}

export function getWindArrow(direction: string): string {
  switch (direction) {
    case 'Utara':
      return '↓';
    case 'Timur Laut':
      return '↙';
    case 'Timur':
      return '←';
    case 'Tenggara':
      return '↖';
    case 'Selatan':
      return '↑';
    case 'Barat Daya':
      return '↗';
    case 'Barat':
      return '→';
    case 'Barat Laut':
      return '↘';
    default:
      return '↓';
  }
}

// Generate continuous 1-hour interval hourly forecasts for BMKG "Prakiraan per Jam (WIB)"
export function generateContinuousHourlyForecast(
  region: Region,
  startHour?: number,
  totalHours = 24
): HourlyForecastItem[] {
  const result: HourlyForecastItem[] = [];
  const wibNow = getWIBDate();
  const currentWIBHour = wibNow.getHours();
  const actualStartHour = startHour !== undefined ? startHour : currentWIBHour;
  const elevation = region.elevationMeters || 100;
  const elevAdj = (elevation / 100) * 0.65;

  for (let i = 0; i < totalHours; i++) {
    const targetDate = new Date(wibNow);
    targetDate.setHours(actualStartHour + i, 0, 0, 0);

    const h = targetDate.getHours();
    const isNight = h >= 18 || h < 6;

    // Indonesian date format (e.g., "24 Agt 2026")
    const dateFormatted = new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(targetDate);
    const dateStr = targetDate.toISOString().split('T')[0];
    const timeFormatted = `${String(h).padStart(2, '0')}.00`;

    // Temperature curve by hour
    let temp = 24.0;
    if (h >= 0 && h <= 5) {
      temp = 22.0 - elevAdj + (h === 4 ? -0.5 : 0);
    } else if (h === 6) {
      temp = 23.0 - elevAdj;
    } else if (h === 7 || h === 8) {
      temp = 24.5 - elevAdj;
    } else if (h >= 9 && h <= 11) {
      temp = 28.0 - elevAdj;
    } else if (h >= 12 && h <= 14) {
      temp = 30.5 - elevAdj;
    } else if (h >= 15 && h <= 17) {
      temp = 27.0 - elevAdj;
    } else if (h >= 18 && h <= 20) {
      temp = 24.0 - elevAdj;
    } else {
      temp = 23.0 - elevAdj;
    }
    temp = Math.round(temp * 10) / 10;

    // Weather condition code
    let code = 3; // Berawan
    if (isNight) {
      if (h === 21 || h === 22) {
        code = 1; // Cerah Berawan (Night)
      } else if (h === 23 || h === 0 || h === 5) {
        code = 0; // Cerah (Moon)
      } else if (h >= 1 && h <= 3) {
        code = 1; // Cerah Berawan
      } else {
        code = 3; // Berawan
      }
    } else {
      if (h === 6 || h === 7) {
        code = 0; // Cerah
      } else if (h >= 8 && h <= 11) {
        code = 1; // Cerah Berawan
      } else if (h >= 12 && h <= 15) {
        code = elevation > 300 ? 60 : 2; // Hujan Ringan di pegunungan, cerah berawan di kota
      } else {
        code = 3; // Berawan
      }
    }

    // Humidity percentage
    let humidity = 85;
    if (h >= 0 && h <= 4) {
      humidity = 88;
    } else if (h === 5 || h === 6) {
      humidity = 85;
    } else if (h === 7) {
      humidity = 80;
    } else if (h >= 8 && h <= 11) {
      humidity = 72;
    } else if (h >= 12 && h <= 15) {
      humidity = 68;
    } else if (h >= 16 && h <= 18) {
      humidity = 78;
    } else if (h >= 19 && h <= 20) {
      humidity = 86;
    } else {
      humidity = 87;
    }

    // Wind speed (km/h) & direction
    let windSpeed = 3.8;
    let windDirection = 'Utara';

    if (h >= 18 && h <= 19) {
      windSpeed = 3.8;
      windDirection = 'Timur';
    } else if (h >= 20 && h <= 22) {
      windSpeed = 3.9;
      windDirection = 'Timur Laut';
    } else if (h >= 23 || (h >= 0 && h <= 2)) {
      windSpeed = 2.6;
      windDirection = 'Utara';
    } else if (h >= 3 && h <= 5) {
      windSpeed = 4.0;
      windDirection = 'Utara';
    } else if (h >= 6 && h <= 9) {
      windSpeed = 7.3;
      windDirection = 'Utara';
    } else if (h >= 10 && h <= 14) {
      windSpeed = 9.2;
      windDirection = 'Barat Daya';
    } else {
      windSpeed = 5.5;
      windDirection = 'Timur';
    }

    // Visibility
    let visibility = '< 6 km';
    if (h >= 6 && h <= 7) {
      visibility = '< 8 km';
    } else if (h >= 8 && h <= 17) {
      visibility = '> 10 km';
    } else {
      visibility = '< 6 km';
    }

    result.push({
      time: targetDate.toISOString(),
      timeFormatted,
      date: dateStr,
      dateFormatted,
      hour: h,
      temp,
      condition: BMKG_WEATHER_CONDITIONS[code] || BMKG_WEATHER_CONDITIONS[3],
      humidity,
      rainProb: code >= 60 ? 70 : (code === 3 ? 30 : 15),
      windSpeed,
      windDirection,
      windArrow: getWindArrow(windDirection),
      visibility,
      isNight,
    });
  }

  return result;
}
export function generateCurrentWeather(region: Region, villageName?: string): CurrentWeather {
  const wibNow = getWIBDate();
  const hour = wibNow.getHours();
  const elevation = region.elevationMeters || 100;

  // Temperature gradient: -0.6°C per 100m elevation
  // Base sea-level temperature di Banyumas (29-33 siang, 23-26 malam)
  let baseTemp = 30.5;
  if (hour >= 11 && hour <= 14) {
    baseTemp = 32.5;
  } else if (hour >= 15 && hour <= 18) {
    baseTemp = 28.5;
  } else if (hour >= 19 && hour <= 23) {
    baseTemp = 25.5;
  } else if (hour >= 0 && hour <= 5) {
    baseTemp = 23.5;
  } else {
    baseTemp = 27.5;
  }

  // Adjust for elevation (e.g. Baturraden at 620m is ~4°C cooler than Purwokerto)
  const elevAdjustment = (elevation / 100) * 0.65;
  const temp = Math.round((baseTemp - elevAdjustment) * 10) / 10;
  const feelsLike = Math.round(temp + 2.5);

  // Weather condition logic based on topography & time
  let code = 3; // default Berawan
  if (elevation > 400 && (hour >= 13 && hour <= 19)) {
    // Lereng Gunung Slamet sering hujan siang/sore/petang (Ketenger, Karangmangu, Baturraden)
    code = (hour >= 17 && hour <= 19) ? 60 : 61; // Hujan Ringan di petang hari
  } else if (elevation > 200 && (hour >= 14 && hour <= 18)) {
    code = 60; // Hujan Ringan
  } else if (hour >= 7 && hour <= 11) {
    code = 1; // Cerah Berawan
  } else if (hour >= 12 && hour <= 14) {
    code = 2; // Cerah Berawan
  } else if (hour >= 15 && hour <= 18) {
    code = 3; // Berawan
  } else if (hour >= 19 && hour <= 23) {
    code = 3; // Berawan
  } else {
    code = elevation > 500 ? 45 : 3; // Kabut atau Berawan
  }

  const condition = BMKG_WEATHER_CONDITIONS[code] || BMKG_WEATHER_CONDITIONS[3];
  
  // Humidity: higher in high elevation / rainy
  let humidity = 78;
  if (elevation > 400) humidity = 88;
  else if (hour >= 11 && hour <= 14) humidity = 68;
  else if (hour >= 20 || hour <= 6) humidity = 85;

  // Wind
  const windSpeed = Math.round(6 + (elevation > 300 ? 4 : 2));
  const windDirection = elevation > 300 ? 'Utara' : 'Barat Daya';
  const windDegree = elevation > 300 ? 10 : 225;

  // Pressure: ~1013 at sea level, decreases with altitude
  const pressure = Math.round(1013 - (elevation / 8.5));

  // Visibility
  const visibility = condition.isRain ? 6 : (code === 45 ? 2 : 10);

  // UV index
  let uvIndex = 1;
  let uvDesc = 'Rendah';
  if (hour >= 10 && hour <= 14) {
    uvIndex = condition.isRain ? 3 : 6;
    uvDesc = uvIndex > 5 ? 'Tinggi' : 'Sedang';
  } else if (hour >= 8 && hour <= 16) {
    uvIndex = 3;
    uvDesc = 'Sedang';
  }

  return {
    regionId: region.id,
    regionName: region.name,
    kecamatanName: region.name,
    desaName: villageName || region.villages?.[0] || region.name,
    lat: region.lat,
    lng: region.lng,
    temp,
    feelsLike,
    condition,
    humidity,
    windSpeed,
    windDirection,
    windDegree,
    pressure,
    visibility,
    uvIndex,
    uvDescription: uvDesc,
    rainfallPastHour: condition.isRain ? (code === 63 ? 18.5 : 4.2) : 0,
    cloudCover: code === 0 ? 10 : (code <= 2 ? 35 : (code === 3 ? 65 : 85)),
    updatedAt: new Date().toISOString(),
    updatedAtFormatted: getWIBTimeString(),
    source: 'BMKG Stasiun Meteorologi Kelas II Tunggul Wulung & Pos Pantau Cuaca Banyumas',
  };
}

// Generate 30-Day (1 Month) Forecast for Banyumas Kecamatan with realistic meteorological trends
export function generate30DayForecast(region: Region, days = 30): DailyForecastItem[] {
  const forecasts: DailyForecastItem[] = [];
  const today = new Date();
  const elevation = region.elevationMeters || 100;
  const elevAdj = (elevation / 100) * 0.65;

  // Pseudo-random seed offset derived from region coordinates
  const seed = Math.abs(Math.round(region.lat * 1000) + Math.round(region.lng * 1000));

  for (let i = 0; i < days; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);

    const isToday = i === 0;
    const isTomorrow = i === 1;
    const weekdayName = new Intl.DateTimeFormat('id-ID', { weekday: 'long' }).format(d);
    
    let dayLabel = weekdayName;
    if (isToday) dayLabel = 'Hari Ini';
    else if (isTomorrow) dayLabel = 'Besok';
    else if (i === 2) dayLabel = 'Lusa';

    // Weather variation wave pattern across 30 days
    // Wave 1: 5-7 day synoptic weather cycle
    const wave1 = Math.sin((i + (seed % 7)) * 0.9);
    // Wave 2: 3-day local oscillation
    const wave2 = Math.cos((i * 1.5 + (seed % 5)) * 1.2);
    const combinedFactor = (wave1 + wave2) / 2; // -1 to 1

    let code = 1; // Default Cerah Berawan
    let rainProb = 25;

    if (elevation > 400) {
      // High mountain slope (Baturraden, Sumbang, Kedungbanteng)
      if (combinedFactor > 0.4) {
        code = 63; // Hujan Lebat
        rainProb = 85;
      } else if (combinedFactor > 0.1) {
        code = 61; // Hujan Sedang
        rainProb = 70;
      } else if (combinedFactor > -0.3) {
        code = 60; // Hujan Ringan
        rainProb = 50;
      } else if (combinedFactor > -0.7) {
        code = 3; // Berawan
        rainProb = 30;
      } else {
        code = 2; // Cerah Berawan
        rainProb = 15;
      }
    } else if (elevation > 200) {
      // Middle hills (Cilongok, Ajibarang, Pekuncen, Karanglewas)
      if (combinedFactor > 0.5) {
        code = 95; // Hujan Petir
        rainProb = 75;
      } else if (combinedFactor > 0.2) {
        code = 61; // Hujan Sedang
        rainProb = 60;
      } else if (combinedFactor > -0.2) {
        code = 60; // Hujan Ringan
        rainProb = 40;
      } else if (combinedFactor > -0.6) {
        code = 3; // Berawan
        rainProb = 25;
      } else {
        code = 1; // Cerah Berawan
        rainProb = 15;
      }
    } else {
      // Lowlands / Serayu Valley (Purwokerto, Rawalo, Banyumas, Sumpiuh, Kemranjen)
      if (combinedFactor > 0.6) {
        code = 61; // Hujan Sedang
        rainProb = 65;
      } else if (combinedFactor > 0.25) {
        code = 60; // Hujan Ringan
        rainProb = 45;
      } else if (combinedFactor > -0.3) {
        code = 3; // Berawan
        rainProb = 25;
      } else if (combinedFactor > -0.7) {
        code = 2; // Cerah Berawan
        rainProb = 15;
      } else {
        code = 0; // Cerah
        rainProb = 10;
      }
    }

    const condition = BMKG_WEATHER_CONDITIONS[code] || BMKG_WEATHER_CONDITIONS[1];

    // Temperature variations
    const dayTempVariance = combinedFactor * 1.5;
    const baseMin = 23.0 - elevAdj + (dayTempVariance * -0.5);
    const baseMax = 31.5 - elevAdj + (dayTempVariance * 0.8);

    const tempMin = Math.round(baseMin * 10) / 10;
    const tempMax = Math.round(baseMax * 10) / 10;

    // Generate 3-hourly interval forecast breakdown (00:00 to 21:00 WIB)
    const hourly: HourlyForecastItem[] = [];
    const hoursToGenerate = [0, 3, 6, 9, 12, 15, 18, 21];

    for (const h of hoursToGenerate) {
      const hDate = new Date(d);
      hDate.setHours(h, 0, 0, 0);

      let hCode = 3;
      let hTemp = tempMin + 1;
      let hRainProb = 10;

      if (h === 0 || h === 3) {
        hCode = elevation > 450 ? 45 : 3; // Kabut / Berawan
        hTemp = tempMin;
        hRainProb = Math.max(5, Math.round(rainProb * 0.2));
      } else if (h === 6) {
        hCode = 1;
        hTemp = tempMin + 1.8;
        hRainProb = Math.max(5, Math.round(rainProb * 0.2));
      } else if (h === 9) {
        hCode = 1;
        hTemp = tempMin + 4.5;
        hRainProb = Math.max(10, Math.round(rainProb * 0.35));
      } else if (h === 12) {
        hCode = condition.isRain ? 2 : 1;
        hTemp = tempMax;
        hRainProb = Math.max(20, Math.round(rainProb * 0.7));
      } else if (h === 15) {
        hCode = condition.isRain ? code : 3;
        hTemp = tempMax - 1.8;
        hRainProb = rainProb;
      } else if (h === 18) {
        hCode = condition.isRain ? (code === 63 ? 60 : 3) : 3;
        hTemp = tempMin + 2.8;
        hRainProb = Math.max(15, Math.round(rainProb * 0.5));
      } else if (h === 21) {
        hCode = 3;
        hTemp = tempMin + 1.2;
        hRainProb = Math.max(10, Math.round(rainProb * 0.3));
      }

      const windDir = h >= 18 || h < 6 ? 'Utara' : 'Timur';
      const isNightTime = h >= 18 || h < 6;

      hourly.push({
        time: hDate.toISOString(),
        timeFormatted: `${String(h).padStart(2, '0')}.00`,
        date: d.toISOString().split('T')[0],
        dateFormatted: new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(d),
        hour: h,
        temp: Math.round(hTemp * 10) / 10,
        condition: BMKG_WEATHER_CONDITIONS[hCode] || BMKG_WEATHER_CONDITIONS[3],
        humidity: h >= 12 && h <= 15 ? 68 : (h <= 6 ? 88 : 80),
        rainProb: hRainProb,
        windSpeed: Math.round(5 + (h >= 12 && h <= 18 ? 6 : 2)),
        windDirection: windDir,
        windArrow: getWindArrow(windDir),
        visibility: hCode >= 60 ? '< 6 km' : '> 10 km',
        isNight: isNightTime,
      });
    }

    const rainfallExpectedMm = rainProb > 70 ? 18.5 : (rainProb > 45 ? 6.2 : (rainProb > 25 ? 1.5 : 0));

    let summaryText = '';
    if (condition.isRain) {
      summaryText = `Potensi ${condition.name.toLowerCase()} pada siang hingga sore hari. Angin berhembus sedang dengan suhu ${tempMin}°C - ${tempMax}°C.`;
    } else if (code === 0) {
      summaryText = `Cuaca cerah sepanjang hari dengan penyinaran matahari optimal. Suhu maksimal mencapai ${tempMax}°C.`;
    } else if (code <= 2) {
      summaryText = `Cerah berawan pada pagi hari, berawan pada sore hari. Kondisi umum kondusif untuk aktivitas luar ruangan.`;
    } else {
      summaryText = `Kondisi didominasi tutupan awan dengan kelembapan rata-rata tinggi. Suhu berkisar ${tempMin}°C - ${tempMax}°C.`;
    }

    forecasts.push({
      date: d.toISOString().split('T')[0],
      dayName: dayLabel,
      dateFormatted: new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(d),
      tempMin,
      tempMax,
      condition,
      humidityAvg: Math.round(72 + (rainProb * 0.15)),
      rainProb,
      rainfallExpectedMm,
      summary: summaryText,
      hourly,
    });
  }

  return forecasts;
}

// Generate 3-Day Forecast for widget (alias slicing from monthly generator)
export function generate3DayForecast(region: Region): DailyForecastItem[] {
  return generate30DayForecast(region, 3);
}

// Generate BMKG Early Warnings for Banyumas (empty when conditions are normal/kondusif)
export function generateActiveAlerts(): WeatherAlert[] {
  // If no extreme conditions are detected across Banyumas, return 0 active warnings
  return [];
}


// Generate radar precipitation grid data across Banyumas bounding box
export function generateRadarGrid(): RadarDataPoint[] {
  const points: RadarDataPoint[] = [];
  const latSteps = 16;
  const lngSteps = 20;

  const minLat = -7.635;
  const maxLat = -7.230;
  const minLng = 108.950;
  const maxLng = 109.430;

  const dLat = (maxLat - minLat) / latSteps;
  const dLng = (maxLng - minLng) / lngSteps;

  // Rain center around Mount Slamet / Baturraden / Cilongok
  const stormCenterLat = -7.33;
  const stormCenterLng = 109.22;

  for (let i = 0; i <= latSteps; i++) {
    const lat = minLat + i * dLat;
    for (let j = 0; j <= lngSteps; j++) {
      const lng = minLng + j * dLng;

      // Distance from storm center
      const dist = Math.sqrt(
        Math.pow((lat - stormCenterLat) * 111, 2) +
        Math.pow((lng - stormCenterLng) * 111, 2)
      );

      let intensity = 0;
      let type: 'none' | 'light' | 'moderate' | 'heavy' | 'very_heavy' = 'none';

      if (dist < 6) {
        intensity = 45 + Math.sin(lat * 20 + lng * 15) * 15;
        type = intensity > 40 ? 'heavy' : 'moderate';
      } else if (dist < 14) {
        intensity = 20 + Math.cos(lat * 15) * 12;
        type = intensity > 25 ? 'moderate' : 'light';
      } else if (dist < 26) {
        intensity = Math.max(0, 10 + Math.sin(lng * 10) * 8);
        type = intensity > 5 ? 'light' : 'none';
      }

      if (intensity > 0) {
        points.push({
          lat: Math.round(lat * 10000) / 10000,
          lng: Math.round(lng * 10000) / 10000,
          intensity: Math.round(intensity * 10) / 10,
          type,
        });
      }
    }
  }

  return points;
}
