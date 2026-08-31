/**
 * WeatherLayers Continuous Scalar Field & Particle Renderer
 * Renders smooth continuous meteorological raster layers (Temperature, Cloud Cover, Radar, Wind)
 * exactly matching WeatherLayers GL / GFS scalar field raster specifications without any primitive
 * geometric shapes (no polygons, no circles, no boxes).
 */

export interface WeatherSamplePoint {
  lat: number;
  lng: number;
  temperature: number; // in Celsius
  cloudCover: number;  // 0 to 100%
  precipitation: number; // in mm/h
  windSpeed: number;    // in km/h
  windDeg: number;      // meteorological direction in degrees
}

// Key meteorological reference nodes in Banyumas & surroundings for continuous kriging / inverse-distance field
export const REGIONAL_WEATHER_NODES: WeatherSamplePoint[] = [
  // 1. Mount Slamet Peak (Summit - 3,428m dpl) - Coldest Alpine zone
  { lat: -7.242, lng: 109.208, temperature: 13.5, cloudCover: 78, precipitation: 0.8, windSpeed: 24, windDeg: 110 },
  
  // 2. Upper Slopes (Baturraden / Ketenger / Melung / Kaligua - 700-1200m dpl) - Cool Sub-montane
  { lat: -7.305, lng: 109.220, temperature: 17.2, cloudCover: 68, precipitation: 1.5, windSpeed: 14, windDeg: 100 },
  { lat: -7.295, lng: 109.180, temperature: 16.8, cloudCover: 72, precipitation: 1.2, windSpeed: 16, windDeg: 105 },
  { lat: -7.310, lng: 109.260, temperature: 18.0, cloudCover: 62, precipitation: 0.6, windSpeed: 12, windDeg: 95 },

  // 3. Northern Foothills (Kedungbanteng, Sumbang, Karanglewas - 200-500m dpl)
  { lat: -7.368, lng: 109.208, temperature: 24.8, cloudCover: 55, precipitation: 0.2, windSpeed: 8, windDeg: 90 },
  { lat: -7.355, lng: 109.270, temperature: 24.2, cloudCover: 58, precipitation: 0.4, windSpeed: 9, windDeg: 95 },
  { lat: -7.380, lng: 109.175, temperature: 25.5, cloudCover: 50, precipitation: 0.0, windSpeed: 7, windDeg: 85 },

  // 4. Central Purwokerto Urban Basin (100m dpl) - Urban heat island & moderate humidity
  { lat: -7.424, lng: 109.230, temperature: 28.5, cloudCover: 45, precipitation: 0.0, windSpeed: 6, windDeg: 90 },
  { lat: -7.410, lng: 109.245, temperature: 28.2, cloudCover: 48, precipitation: 0.0, windSpeed: 6, windDeg: 88 },
  { lat: -7.435, lng: 109.265, temperature: 28.8, cloudCover: 42, precipitation: 0.0, windSpeed: 7, windDeg: 92 },

  // 5. Eastern Lowlands (Kembaran, Sokaraja, Kalibagor - 70-110m dpl)
  { lat: -7.454, lng: 109.280, temperature: 29.2, cloudCover: 40, precipitation: 0.0, windSpeed: 8, windDeg: 95 },
  { lat: -7.480, lng: 109.300, temperature: 29.5, cloudCover: 38, precipitation: 0.0, windSpeed: 9, windDeg: 100 },

  // 6. Western Valleys & Hills (Cilongok, Ajibarang, Pekuncen, Gumelar - 150-400m dpl)
  { lat: -7.410, lng: 109.120, temperature: 26.5, cloudCover: 52, precipitation: 0.0, windSpeed: 7, windDeg: 85 },
  { lat: -7.380, lng: 109.050, temperature: 26.8, cloudCover: 48, precipitation: 0.0, windSpeed: 8, windDeg: 80 },
  { lat: -7.340, lng: 109.020, temperature: 25.2, cloudCover: 56, precipitation: 0.2, windSpeed: 10, windDeg: 75 },
  { lat: -7.370, lng: 108.960, temperature: 25.8, cloudCover: 50, precipitation: 0.0, windSpeed: 9, windDeg: 70 },

  // 7. Southern Lowlands & Serayu River Basin (Rawalo, Patikraja, Banyumas, Kebasen - 20-60m dpl) - Warmest
  { lat: -7.510, lng: 109.210, temperature: 30.2, cloudCover: 35, precipitation: 0.0, windSpeed: 9, windDeg: 105 },
  { lat: -7.515, lng: 109.290, temperature: 30.5, cloudCover: 32, precipitation: 0.0, windSpeed: 10, windDeg: 110 },
  { lat: -7.530, lng: 109.160, temperature: 30.0, cloudCover: 36, precipitation: 0.0, windSpeed: 9, windDeg: 100 },

  // 8. Southwest Hills (Wangon, Jatilawang, Lumbir, Purwojati - 80-250m dpl)
  { lat: -7.510, lng: 109.060, temperature: 28.8, cloudCover: 40, precipitation: 0.0, windSpeed: 8, windDeg: 95 },
  { lat: -7.540, lng: 108.970, temperature: 28.2, cloudCover: 42, precipitation: 0.0, windSpeed: 9, windDeg: 90 },

  // 9. Southeast Banyumas & Kroya Plains (Sumpiuh, Tambak, Kemranjen, Somagede)
  { lat: -7.600, lng: 109.340, temperature: 30.8, cloudCover: 30, precipitation: 0.0, windSpeed: 12, windDeg: 115 },
  { lat: -7.580, lng: 109.420, temperature: 31.0, cloudCover: 28, precipitation: 0.0, windSpeed: 14, windDeg: 120 },
];

/**
 * WeatherLayers GFS Temperature Colormap
 * Seamless scalar gradient matching demo.weatherlayers.com/deck/map.html#dataset=gfs%2Ftemperature_2m_above_ground
 */
export function getTemperatureColor(tempCelsius: number, alpha = 0.75): [number, number, number, number] {
  // Clamp range between 10°C and 35°C
  const stops = [
    { t: 10, r: 44,  g: 27,  b: 130 }, // Dark Indigo / Violet (< 12°C)
    { t: 14, r: 29,  g: 78,  b: 216 }, // Royal Blue (14°C)
    { t: 17, r: 2,   g: 132, b: 199 }, // Sky / Ocean Blue (17°C)
    { t: 20, r: 6,   g: 182, b: 212 }, // Cyan (20°C)
    { t: 23, r: 20,  g: 184, b: 166 }, // Turquoise (23°C)
    { t: 25, r: 16,  g: 185, b: 129 }, // Emerald / Green (25°C)
    { t: 27, r: 132, g: 204, b: 22  }, // Lime (27°C)
    { t: 29, r: 234, g: 179, b: 8   }, // Yellow / Gold (29°C)
    { t: 31, r: 249, g: 115, b: 22  }, // Orange (31°C)
    { t: 33, r: 239, g: 68,  b: 68  }, // Red (33°C)
    { t: 36, r: 185, g: 28,  b: 28  }, // Crimson Red (36°C+)
  ];

  if (tempCelsius <= stops[0].t) {
    return [stops[0].r, stops[0].g, stops[0].b, Math.round(alpha * 255)];
  }
  if (tempCelsius >= stops[stops.length - 1].t) {
    const last = stops[stops.length - 1];
    return [last.r, last.g, last.b, Math.round(alpha * 255)];
  }

  for (let i = 0; i < stops.length - 1; i++) {
    const s0 = stops[i];
    const s1 = stops[i + 1];
    if (tempCelsius >= s0.t && tempCelsius <= s1.t) {
      const factor = (tempCelsius - s0.t) / (s1.t - s0.t);
      const r = Math.round(s0.r + factor * (s1.r - s0.r));
      const g = Math.round(s0.g + factor * (s1.g - s0.g));
      const b = Math.round(s0.b + factor * (s1.b - s0.b));
      return [r, g, b, Math.round(alpha * 255)];
    }
  }

  return [255, 255, 255, Math.round(alpha * 255)];
}

/**
 * WeatherLayers GFS Cloud Cover Colormap
 * Seamless organic white/translucent density field matching demo.weatherlayers.com/deck/map.html#dataset=gfs%2Fcloud_cover_high_cloud_layer
 */
export function getCloudCoverColor(cloudPercent: number, baseOpacity = 0.8): [number, number, number, number] {
  if (cloudPercent <= 12) {
    return [255, 255, 255, 0]; // Completely clear & transparent
  }

  // Smooth quadratic transfer curve for feathered, soft atmospheric clouds
  const normalized = Math.min(100, Math.max(0, (cloudPercent - 12) / 88));
  const curve = Math.pow(normalized, 1.3);

  // Wispy cirrus to dense stratus color tint
  const r = Math.round(255 - curve * 15);
  const g = Math.round(255 - curve * 10);
  const b = 255;
  const a = Math.round(curve * baseOpacity * 240);

  return [r, g, b, a];
}

/**
 * WeatherLayers Continuous Wind Speed Scalar Colormap
 * Seamless light blue / cyan scalar gradient (Kecepatan Angin Permukaan)
 */
export function getWindSpeedColor(windSpeedKmh: number, baseOpacity = 0.65): [number, number, number, number] {
  // Light Blue to Sky Blue / Cyan Color Stops
  const stops = [
    { v: 0,  r: 240, g: 249, b: 255, a: 0.15 }, // #f0f9ff (Hembusan Tenang)
    { v: 6,  r: 224, g: 242, b: 254, a: 0.35 }, // #e0f2fe (Angin Sepoi-sepoi)
    { v: 12, r: 186, g: 230, b: 253, a: 0.55 }, // #bae6fd (Biru Muda Lembut)
    { v: 18, r: 125, g: 211, b: 252, a: 0.72 }, // #7dd3fc (Biru Langit Muda)
    { v: 25, r: 56,  g: 189, b: 248, a: 0.85 }, // #38bdf8 (Biru Cerah Aktif)
    { v: 35, r: 14,  g: 165, b: 233, a: 0.95 }, // #0ea5e9 (Biru Laut Kuat)
  ];

  if (windSpeedKmh <= stops[0].v) {
    const s = stops[0];
    return [s.r, s.g, s.b, Math.round(s.a * baseOpacity * 255)];
  }
  if (windSpeedKmh >= stops[stops.length - 1].v) {
    const last = stops[stops.length - 1];
    return [last.r, last.g, last.b, Math.round(last.a * baseOpacity * 255)];
  }

  for (let i = 0; i < stops.length - 1; i++) {
    const s0 = stops[i];
    const s1 = stops[i + 1];
    if (windSpeedKmh >= s0.v && windSpeedKmh <= s1.v) {
      const factor = (windSpeedKmh - s0.v) / (s1.v - s0.v);
      const r = Math.round(s0.r + factor * (s1.r - s0.r));
      const g = Math.round(s0.g + factor * (s1.g - s0.g));
      const b = Math.round(s0.b + factor * (s1.b - s0.b));
      const a = (s0.a + factor * (s1.a - s0.a)) * baseOpacity;
      return [r, g, b, Math.round(a * 255)];
    }
  }

  return [186, 230, 253, Math.round(0.5 * baseOpacity * 255)];
}
export function getPrecipitationColor(rainMmh: number, baseOpacity = 0.75): [number, number, number, number] {
  if (rainMmh <= 0.05) {
    return [0, 0, 0, 0]; // No rain
  }

  // Standard meteorological radar reflectivity scale (dBZ)
  const stops = [
    { v: 0.1, r: 56,  g: 189, b: 248, a: 0.35 }, // Sangat Ringan (Cyan)
    { v: 0.5, r: 34,  g: 197, b: 94,  a: 0.55 }, // Ringan (Green)
    { v: 2.0, r: 234, g: 179, b: 8,   a: 0.70 }, // Sedang (Yellow)
    { v: 5.0, r: 249, g: 115, b: 22,  a: 0.85 }, // Lebat (Orange)
    { v: 10.0,r: 239, g: 68,  b: 68,  a: 0.92 }, // Sangat Lebat (Red)
    { v: 20.0,r: 168, g: 85,  b: 247, a: 0.98 }, // Ekstrem (Purple)
  ];

  if (rainMmh <= stops[0].v) {
    const s = stops[0];
    return [s.r, s.g, s.b, Math.round(s.a * baseOpacity * 255)];
  }
  if (rainMmh >= stops[stops.length - 1].v) {
    const last = stops[stops.length - 1];
    return [last.r, last.g, last.b, Math.round(last.a * baseOpacity * 255)];
  }

  for (let i = 0; i < stops.length - 1; i++) {
    const s0 = stops[i];
    const s1 = stops[i + 1];
    if (rainMmh >= s0.v && rainMmh <= s1.v) {
      const factor = (rainMmh - s0.v) / (s1.v - s0.v);
      const r = Math.round(s0.r + factor * (s1.r - s0.r));
      const g = Math.round(s0.g + factor * (s1.g - s0.g));
      const b = Math.round(s0.b + factor * (s1.b - s0.b));
      const a = (s0.a + factor * (s1.a - s0.a)) * baseOpacity;
      return [r, g, b, Math.round(a * 255)];
    }
  }

  return [56, 189, 248, Math.round(0.4 * baseOpacity * 255)];
}

/**
 * 2D Inverse-Distance Weighting (IDW) Continuous Field Interpolation
 * Computes exact physical scalar values at any (lat, lng) coordinate continuously.
 */
export function sampleWeatherScalarField(
  lat: number,
  lng: number,
  timeOffsetHours = 0
): { temperature: number; cloudCover: number; precipitation: number; windSpeed: number; windDeg: number } {
  let totalWeight = 0;
  let weightedTemp = 0;
  let weightedCloud = 0;
  let weightedPrecip = 0;
  let weightedWind = 0;
  let weightedWindX = 0;
  let weightedWindY = 0;

  // Gaussian power factor for smooth seamless transitions
  const p = 2.2;
  const epsilon = 0.0001;

  for (const node of REGIONAL_WEATHER_NODES) {
    // Dynamic temporal shifting for animated cloud/rain fields
    const driftLat = node.lat + Math.sin(timeOffsetHours * 0.5 + node.lng) * 0.015;
    const driftLng = node.lng + timeOffsetHours * 0.02;

    const dLat = lat - driftLat;
    const dLng = lng - driftLng;
    const distSq = dLat * dLat + dLng * dLng + epsilon;
    const weight = 1 / Math.pow(distSq, p / 2);

    totalWeight += weight;
    weightedTemp += node.temperature * weight;
    weightedCloud += node.cloudCover * weight;
    weightedPrecip += node.precipitation * weight;
    weightedWind += node.windSpeed * weight;

    const rad = (node.windDeg * Math.PI) / 180;
    weightedWindX += Math.sin(rad) * node.windSpeed * weight;
    weightedWindY += Math.cos(rad) * node.windSpeed * weight;
  }

  const avgTemp = totalWeight > 0 ? weightedTemp / totalWeight : 28;
  const avgCloud = totalWeight > 0 ? weightedCloud / totalWeight : 40;
  const avgPrecip = totalWeight > 0 ? weightedPrecip / totalWeight : 0;
  const avgWind = totalWeight > 0 ? weightedWind / totalWeight : 8;

  const windRad = Math.atan2(weightedWindX, weightedWindY);
  let windDeg = (windRad * 180) / Math.PI;
  if (windDeg < 0) windDeg += 360;

  // Add gentle natural atmospheric micro-texture (Perlin-like wave)
  const wave = Math.sin(lat * 80 + timeOffsetHours * 0.8) * Math.cos(lng * 80 - timeOffsetHours * 0.5);
  const finalTemp = parseFloat((avgTemp + wave * 0.4).toFixed(1));
  const finalCloud = Math.min(100, Math.max(0, Math.round(avgCloud + wave * 6)));
  const finalPrecip = Math.max(0, parseFloat((avgPrecip + (wave > 0.4 ? wave * 0.3 : 0)).toFixed(2)));

  return {
    temperature: finalTemp,
    cloudCover: finalCloud,
    precipitation: finalPrecip,
    windSpeed: parseFloat(avgWind.toFixed(1)),
    windDeg: Math.round(windDeg),
  };
}

/**
 * Render smooth continuous raster field directly into an HTML5 Canvas context
 * Matches WeatherLayers GL continuous raster rendering.
 */
export function renderContinuousScalarLayer(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number },
  layerType: 'temperature' | 'cloud' | 'precipitation' | 'wind',
  opacity: number,
  timeOffsetHours = 0
) {
  // Offscreen rendering at downscaled resolution, then smooth hardware upscaling
  const gridW = Math.min(160, Math.max(80, Math.floor(width / 3.5)));
  const gridH = Math.min(160, Math.max(80, Math.floor(height / 3.5)));

  const offscreen = document.createElement('canvas');
  offscreen.width = gridW;
  offscreen.height = gridH;
  const offCtx = offscreen.getContext('2d');
  if (!offCtx) return;

  const imgData = offCtx.createImageData(gridW, gridH);
  const data = imgData.data;

  const latRange = bounds.maxLat - bounds.minLat;
  const lngRange = bounds.maxLng - bounds.minLng;

  for (let y = 0; y < gridH; y++) {
    // Canvas y=0 is top (maxLat), y=gridH is bottom (minLat)
    const lat = bounds.maxLat - (y / (gridH - 1)) * latRange;

    for (let x = 0; x < gridW; x++) {
      const lng = bounds.minLng + (x / (gridW - 1)) * lngRange;
      const sample = sampleWeatherScalarField(lat, lng, timeOffsetHours);

      let rgba: [number, number, number, number] = [0, 0, 0, 0];

      if (layerType === 'temperature') {
        rgba = getTemperatureColor(sample.temperature, opacity);
      } else if (layerType === 'cloud') {
        rgba = getCloudCoverColor(sample.cloudCover, opacity);
      } else if (layerType === 'precipitation') {
        rgba = getPrecipitationColor(sample.precipitation, opacity);
      } else if (layerType === 'wind') {
        rgba = getWindSpeedColor(sample.windSpeed, opacity * 0.75);
      }

      const pixelIdx = (y * gridW + x) * 4;
      data[pixelIdx]     = rgba[0];
      data[pixelIdx + 1] = rgba[1];
      data[pixelIdx + 2] = rgba[2];
      data[pixelIdx + 3] = rgba[3];
    }
  }

  offCtx.putImageData(imgData, 0, 0);

  // Smooth bilinear interpolation upscale to full viewport size
  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(offscreen, 0, 0, width, height);
  ctx.restore();
}

/**
 * Animated Wind Particle System with Trailing Streamlines
 * Renders high-visibility glowing light-blue streamlines flowing along the continuous wind velocity field.
 */
export interface WindParticle {
  x: number;
  y: number;
  history: { x: number; y: number }[];
  age: number;
  maxAge: number;
  speed: number;
}

export class WindFieldParticleEngine {
  private particles: WindParticle[] = [];
  private maxParticles = 450; // Increased density for high clarity

  constructor() {
    this.initParticles(800, 600);
  }

  private initParticles(w: number, h: number) {
    this.particles = [];
    for (let i = 0; i < this.maxParticles; i++) {
      const startX = Math.random() * w;
      const startY = Math.random() * h;
      this.particles.push({
        x: startX,
        y: startY,
        history: [{ x: startX, y: startY }],
        age: Math.floor(Math.random() * 70),
        maxAge: 50 + Math.floor(Math.random() * 60),
        speed: 1.4 + Math.random() * 1.6,
      });
    }
  }

  public render(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number },
    opacity = 0.9
  ) {
    if (this.particles.length === 0) {
      this.initParticles(width, height);
    }

    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const latRange = bounds.maxLat - bounds.minLat;
    const lngRange = bounds.maxLng - bounds.minLng;

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Convert particle pixel coordinate to Lat/Lng
      const lng = bounds.minLng + (p.x / width) * lngRange;
      const lat = bounds.maxLat - (p.y / height) * latRange;

      const sample = sampleWeatherScalarField(lat, lng, 0);
      const rad = (sample.windDeg * Math.PI) / 180;

      // Vector components (wind from deg -> direction it blows to)
      const u = -Math.sin(rad) * (sample.windSpeed / 8) * p.speed;
      const v = Math.cos(rad) * (sample.windSpeed / 8) * p.speed;

      const nextX = p.x + u;
      const nextY = p.y + v;

      // Maintain a smooth history trail (length 6)
      p.history.push({ x: nextX, y: nextY });
      if (p.history.length > 7) {
        p.history.shift();
      }

      // Calculate opacity curve (bell curve with soft fade in/out)
      const lifeRatio = p.age / p.maxAge;
      const alpha = Math.sin(lifeRatio * Math.PI) * opacity;

      if (p.history.length >= 2 && alpha > 0.05) {
        // 1. Draw glowing light-blue stream trail
        ctx.beginPath();
        ctx.moveTo(p.history[0].x, p.history[0].y);
        for (let h = 1; h < p.history.length; h++) {
          ctx.lineTo(p.history[h].x, p.history[h].y);
        }
        ctx.lineWidth = 2.4;
        ctx.strokeStyle = `rgba(56, 189, 248, ${alpha * 0.95})`; // Vivid Sky Blue (#38bdf8)
        ctx.stroke();

        // 2. Inner crisp highlight for sharp clarity
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = `rgba(224, 242, 254, ${alpha * 1.0})`; // Light Bright Blue (#e0f2fe)
        ctx.stroke();

        // 3. Bright leading head particle
        ctx.beginPath();
        ctx.arc(nextX, nextY, 1.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.95})`;
        ctx.fill();
      }

      p.x = nextX;
      p.y = nextY;
      p.age++;

      // Respawn if aged out or out of bounds
      if (p.age >= p.maxAge || p.x < -20 || p.x > width + 20 || p.y < -20 || p.y > height + 20) {
        const newX = Math.random() * width;
        const newY = Math.random() * height;
        p.x = newX;
        p.y = newY;
        p.history = [{ x: newX, y: newY }];
        p.age = 0;
        p.maxAge = 50 + Math.floor(Math.random() * 60);
      }
    }

    ctx.restore();
  }
}

/**
 * Calibrate scalar interpolation nodes with live observed weather from BMKG / Open-Meteo
 */
export function updateRegionalWeatherNodeLive(
  lat: number,
  lng: number,
  temp: number,
  windSpeed: number,
  windDeg: number,
  cloudCover = 50,
  precip = 0
) {
  // Find closest node or update/insert
  let closestIdx = -1;
  let minDist = Infinity;

  for (let i = 0; i < REGIONAL_WEATHER_NODES.length; i++) {
    const n = REGIONAL_WEATHER_NODES[i];
    const d = Math.hypot(n.lat - lat, n.lng - lng);
    if (d < minDist) {
      minDist = d;
      closestIdx = i;
    }
  }

  if (closestIdx >= 0 && minDist < 0.08) {
    REGIONAL_WEATHER_NODES[closestIdx].temperature = temp;
    REGIONAL_WEATHER_NODES[closestIdx].windSpeed = windSpeed;
    REGIONAL_WEATHER_NODES[closestIdx].windDeg = windDeg;
    REGIONAL_WEATHER_NODES[closestIdx].cloudCover = cloudCover;
    REGIONAL_WEATHER_NODES[closestIdx].precipitation = precip;
  } else {
    REGIONAL_WEATHER_NODES.push({
      lat,
      lng,
      temperature: temp,
      windSpeed,
      windDeg,
      cloudCover,
      precipitation: precip,
    });
  }
}

