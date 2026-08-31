import React, { useState, useEffect, useCallback } from 'react';
import {
  CurrentWeather,
  DailyForecastItem,
  HourlyForecastItem,
  Region,
  WeatherAlert,
} from './types/weather';
import { BANYUMAS_KECAMATAN } from './data/banyumasRegions';
import {
  generate30DayForecast,
  generateContinuousHourlyForecast,
  generateCurrentWeather,
} from './services/weatherEngine';
import { Navbar } from './components/Navbar';
import { RegionSelector } from './components/RegionSelector';
import { WeatherMapPreview } from './components/WeatherMapPreview';
import { WeatherSummaryCard } from './components/WeatherSummaryCard';
import { ForecastSummary } from './components/ForecastSummary';
import { AlertBanner } from './components/AlertBanner';
import { WeatherCalendarView } from './components/WeatherCalendarView';
import { WeatherLayersView } from './components/WeatherLayersView';
import { AlertsPageView } from './components/AlertsPageView';
import { EmergencyContactsView } from './components/EmergencyContactsView';
import { Footer } from './components/Footer';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { AboutModal } from './components/AboutModal';

export default function App() {
  const defaultRegion =
    BANYUMAS_KECAMATAN.find((k) => k.name === 'Purwokerto Utara') ||
    BANYUMAS_KECAMATAN[0];

  const [selectedRegion, setSelectedRegion] = useState<Region>(defaultRegion);
  const [selectedVillage, setSelectedVillage] = useState<string>('Grendeng');
  const [userExactCoords, setUserExactCoords] = useState<{
    lat: number;
    lng: number;
    accuracy?: number;
    name?: string;
  } | null>(null);
  const [currentTab, setCurrentTab] = useState<
    'home' | 'calendar' | 'map' | 'alerts' | 'emergency'
  >('home');

  const [currentWeather, setCurrentWeather] = useState<CurrentWeather>(() =>
    generateCurrentWeather(defaultRegion, 'Grendeng')
  );
  const [hourlyForecasts, setHourlyForecasts] = useState<HourlyForecastItem[]>(() =>
    generateContinuousHourlyForecast(defaultRegion, undefined, 24)
  );
  const [isLiveBmkg, setIsLiveBmkg] = useState<boolean>(false);
  const [forecasts, setForecasts] = useState<DailyForecastItem[]>(() =>
    generate30DayForecast(defaultRegion, 30)
  );
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [aboutModalOpen, setAboutModalOpen] = useState<boolean>(false);

  const loadAlerts = useCallback(async () => {
    try {
      const res = await fetch('/api/weather/alerts');
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.alerts)) {
          setAlerts(data.alerts);
        } else {
          setAlerts([]);
        }
      }
    } catch {
      setAlerts([]);
    }
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadWeatherData = useCallback(
    async (
      region: Region,
      village?: string,
      exactCoords?: { lat: number; lng: number; accuracy?: number; name?: string } | null,
      forceFresh?: boolean
    ) => {
      setIsLoading(true);
      const targetVillage = village || region.villages?.[0] || region.name;

      try {
        const freshParam = forceFresh ? `&fresh=true&t=${Date.now()}` : '';
        const liveRes = await fetch(
          `/api/weather/live-bmkg?regionId=${encodeURIComponent(
            region.id
          )}&village=${encodeURIComponent(targetVillage)}${freshParam}`
        );
        const forecastRes = await fetch(
          `/api/weather/forecast?regionId=${encodeURIComponent(
            region.id
          )}&village=${encodeURIComponent(targetVillage)}&days=30`
        );

        if (liveRes.ok) {
          const liveData = await liveRes.json();
          if (liveData.current) {
            const finalCurrent = exactCoords
              ? { ...liveData.current, lat: exactCoords.lat, lng: exactCoords.lng }
              : liveData.current;
            setCurrentWeather(finalCurrent);
          }
          if (liveData.hourly && liveData.hourly.length > 0) {
            setHourlyForecasts(liveData.hourly);
          }
          setIsLiveBmkg(liveData.isLive === true);
        } else {
          const localCur = generateCurrentWeather(region, targetVillage);
          const finalCurrent = exactCoords
            ? { ...localCur, lat: exactCoords.lat, lng: exactCoords.lng }
            : localCur;
          setCurrentWeather(finalCurrent);
          setHourlyForecasts(generateContinuousHourlyForecast(region, undefined, 24));
          setIsLiveBmkg(false);
        }

        if (forecastRes.ok) {
          const fData = await forecastRes.json();
          setForecasts(fData.forecasts);
        } else {
          setForecasts(generate30DayForecast(region, 30));
        }
      } catch (err) {
        const localCur = generateCurrentWeather(region, targetVillage);
        const finalCurrent = exactCoords
          ? { ...localCur, lat: exactCoords.lat, lng: exactCoords.lng }
          : localCur;
        setCurrentWeather(finalCurrent);
        setHourlyForecasts(generateContinuousHourlyForecast(region, undefined, 24));
        setForecasts(generate30DayForecast(region, 30));
        setIsLiveBmkg(false);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadWeatherData(selectedRegion, selectedVillage);
    loadAlerts();
  }, [loadAlerts]);

  const handleSelectRegion = (
    region: Region,
    village?: string,
    exactCoords?: { lat: number; lng: number; accuracy?: number; name?: string }
  ) => {
    setSelectedRegion(region);
    const targetVillage = village || region.villages?.[0] || region.name;
    setSelectedVillage(targetVillage);
    if (exactCoords) {
      setUserExactCoords(exactCoords);
    } else {
      setUserExactCoords(null);
    }
    loadWeatherData(region, targetVillage, exactCoords);
    loadAlerts();
  };

  const handleRefresh = () => {
    loadWeatherData(selectedRegion, selectedVillage, userExactCoords, true);
    loadAlerts();
  };

  const hasActiveAlert = alerts.some((a) => a.isActive);

  return (
    <div className="min-h-screen text-slate-800 flex flex-col justify-between selection:bg-sky-500 selection:text-white">
      {/* Top Header Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        selectedRegion={selectedRegion}
        selectedVillage={selectedVillage}
        hasActiveAlert={hasActiveAlert}
        onOpenAbout={() => setAboutModalOpen(true)}
        onRefresh={handleRefresh}
        isLoading={isLoading}
      />

      {/* Main Content Area - DILEBARKAN DARI max-w-4xl MENJADI max-w-7xl */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7 space-y-6">
        {/* Tab 1: HOME (Dashboard matching prototype) */}
        {currentTab === 'home' && (
          <div className="space-y-5 sm:space-y-6 animate-in fade-in duration-200">
            {/* 1. Search & Dropdown Wilayah */}
            <section aria-label="Pencarian dan Pilihan Wilayah">
              <RegionSelector
                selectedRegion={selectedRegion}
                selectedVillage={selectedVillage}
                onSelectRegion={handleSelectRegion}
              />
            </section>

            {/* 2. Peta Cuaca Banyumas */}
            <section aria-label="Peta Cuaca Banyumas">
              <WeatherMapPreview
                selectedRegion={selectedRegion}
                selectedVillage={selectedVillage}
                userExactCoords={userExactCoords}
                onSelectRegion={handleSelectRegion}
                onViewFullMap={() => setCurrentTab('map')}
              />
            </section>

            {/* 3. Cuaca Saat Ini */}
            <section aria-label="Cuaca Saat Ini">
              <WeatherSummaryCard
                weather={currentWeather}
                onRefresh={handleRefresh}
                isLoading={isLoading}
              />
            </section>

            {/* 4. Prakiraan per Jam (WIB) BMKG */}
            <section aria-label="Prakiraan Cuaca per Jam WIB BMKG">
              <ForecastSummary
                forecasts={forecasts}
                selectedRegion={selectedRegion}
                hourlyData={hourlyForecasts}
                isLive={isLiveBmkg}
                onViewAll={() => setCurrentTab('calendar')}
              />
            </section>

            {/* 5. Peringatan Dini jika sedang aktif */}
            <section aria-label="Peringatan Dini Cuaca Aktif">
              <AlertBanner
                alerts={alerts}
                onViewDetails={() => setCurrentTab('alerts')}
              />
            </section>
          </div>
        )}

        {/* Tab 2: KALENDER CUACA */}
        {currentTab === 'calendar' && (
          <WeatherCalendarView
            forecasts={forecasts}
            selectedRegion={selectedRegion}
          />
        )}

        {/* Tab 3: PETA CUACA */}
        {currentTab === 'map' && (
          <WeatherLayersView
            selectedRegion={selectedRegion}
            selectedVillage={selectedVillage}
            userExactCoords={userExactCoords}
            onSelectRegion={handleSelectRegion}
          />
        )}

        {/* Tab 4: PERINGATAN DINI */}
        {currentTab === 'alerts' && (
          <AlertsPageView
            alerts={alerts}
            onNavigateEmergency={() => setCurrentTab('emergency')}
          />
        )}

        {/* Tab 5: KONTAK DARURAT */}
        {currentTab === 'emergency' && <EmergencyContactsView />}
      </main>

      {/* Footer */}
      <Footer
        lastUpdated={currentWeather.updatedAtFormatted}
        isOnline={isOnline}
        onNavigateTab={setCurrentTab}
      />

      {/* PWA Offline & Install Prompt */}
      <PWAInstallPrompt />

      {/* About System Modal */}
      <AboutModal
        isOpen={aboutModalOpen}
        onClose={() => setAboutModalOpen(false)}
      />
    </div>
  );
}