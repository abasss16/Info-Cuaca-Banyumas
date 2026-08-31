export interface Region {
  id: string; // e.g. "33.02.01"
  name: string; // e.g. "Purwokerto Utara"
  type: 'kecamatan' | 'desa';
  kecamatanId?: string;
  kecamatanName?: string;
  lat: number;
  lng: number;
  elevationMeters: number;
  postalCode?: string;
  description?: string;
  villages?: string[];
  boundaryCoords?: [number, number][]; // Primary Polygon coords [lat, lng]
  boundaryMultiCoords?: [number, number][][]; // All Polygon rings [lat, lng] for MultiPolygon support
  luasWilayahHa?: number;
}

export interface WeatherCondition {
  code: number; // BMKG weather code
  name: string; // e.g. "Cerah Berawan", "Hujan Sedang"
  icon: string; // Lucide icon name or visual icon representation
  color: string;
  isRain: boolean;
}

export interface CurrentWeather {
  regionId: string;
  regionName: string;
  kecamatanName: string;
  desaName?: string;
  lat: number;
  lng: number;
  temp: number; // Celsius
  feelsLike: number;
  condition: WeatherCondition;
  humidity: number; // %
  windSpeed: number; // km/h
  windDirection: string; // e.g. "Barat Daya", "Selatan"
  windDegree: number;
  pressure: number; // hPa
  visibility: number; // km numeric
  visibilityText?: string; // e.g. "> 10 km", "< 6 km", "3 - 5 km"
  uvIndex: number;
  uvDescription: string;
  rainfallPastHour: number; // mm
  cloudCover: number; // %
  updatedAt: string; // ISO string
  updatedAtFormatted: string; // e.g. "13:40 WIB"
  source: string; // e.g. "BMKG Stasiun Meteorologi Tunggul Wulung / Pos Banyumas"
}

export interface HourlyForecastItem {
  time: string; // ISO string
  timeFormatted: string; // e.g. "18.00"
  date: string; // "2026-08-24"
  dateFormatted: string; // "24 Agt 2026"
  hour: number;
  temp: number;
  condition: WeatherCondition;
  humidity: number;
  rainProb: number; // %
  windSpeed: number; // e.g. 3.8
  windDirection: string; // e.g. "Timur", "Timur Laut", "Utara"
  windArrow: string; // e.g. "←", "↙", "↓"
  visibility: string; // e.g. "< 6 km", "< 8 km", "> 10 km"
  isNight: boolean;
}

export interface DailyForecastItem {
  date: string; // YYYY-MM-DD
  dayName: string; // "Hari Ini", "Jumat", "Sabtu"
  dateFormatted: string; // "21 Agustus 2026"
  tempMin: number;
  tempMax: number;
  condition: WeatherCondition;
  humidityAvg: number;
  rainProb: number; // %
  rainfallExpectedMm: number;
  summary: string;
  hourly: HourlyForecastItem[];
  source?: string; // e.g. "BMKG (Resmi)", "Open-Meteo"
  sourceType?: 'bmkg' | 'open-meteo';
}

export interface WeatherAlert {
  id: string;
  title: string;
  level: 'waspada' | 'siaga' | 'awas';
  levelLabel: string;
  eventType: string; // e.g. "Hujan Sedang-Lebat disertai Petir dan Angin Kencang"
  description: string;
  affectedRegions: string[]; // Names of affected Kecamatan
  validFrom: string; // ISO or "13:30 WIB"
  validUntil: string; // ISO or "16:30 WIB"
  issuedAt: string;
  source: string;
  recommendations: string[];
  isActive: boolean;
}

export interface RadarDataPoint {
  lat: number;
  lng: number;
  intensity: number; // 0 to 100 mm/h
  type: 'none' | 'light' | 'moderate' | 'heavy' | 'very_heavy';
}

export interface EmergencyContact {
  id: string;
  name: string;
  category: 'utama' | 'bpbd' | 'damkar' | 'polisi' | 'kesehatan' | 'sar';
  categoryLabel: string;
  phoneNumber: string;
  displayNumber: string;
  address: string;
  subdistrict: string;
  operatingHours: string;
  description: string;
  lat?: number;
  lng?: number;
}

export type WeatherLayerType = 'precipitation' | 'cloud' | 'temperature' | 'wind';
export type BaseMapType = 'standard' | 'topography' | 'satellite';
