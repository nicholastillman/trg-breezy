// composables/useWeather.ts

import { ref } from "vue";
import type { WeatherData } from "../types/atmosphere";

// The component that uses this knows nothing about OpenWeather.
// It receives a WeatherData object. That's it.

export function useWeather() {
  const weather = ref<WeatherData | null>(null);
  const error = ref<string | null>(null);
  const isLoading = ref(false);

  async function fetchWeather(): Promise<void> {
    isLoading.value = true;
    error.value = null;

    try {
      // Step 1: Get coordinates from browser
      // Note: we request geolocation lazily, only when needed
      const coords = await getUserCoordinates();

      // Step 2: Hit the API
      // The API key lives in an Astro server endpoint, NOT here.
      // Never expose API keys in client-side code.
      const response = await fetch(
        `/api/weather?lat=${coords.lat}&lon=${coords.lon}`,
      );

      if (!response.ok) throw new Error("Weather service unavailable");

      const raw = await response.json();

      // Step 3: Normalize the raw response into our domain type
      weather.value = normalizeWeatherResponse(raw);
    } catch (e) {
      error.value = "Could not read local atmosphere";
      // Provide a graceful fallback — the app still works
      weather.value = getFallbackWeather();
    } finally {
      isLoading.value = false;
    }
  }

  return { weather, error, isLoading, fetchWeather };
}

// ──────────────────────────────────────────────────────────
// Private helpers — these do NOT belong in the component

function normalizeWeatherResponse(raw: OpenWeatherResponse): WeatherData {
  return {
    condition: mapConditionCode(raw.weather[0].id), // e.g. 'soft-rain'
    temperature: raw.main.temp,
    humidity: raw.main.humidity,
    description: raw.weather[0].description,
    // We derive a "feel" descriptor here so the engine
    // can use language without knowing weather API codes
    atmosphericFeel: deriveAtmosphericFeel(raw),
  };
}

function mapConditionCode(code: number): WeatherCondition {
  // OpenWeather codes: 200-299 = thunderstorm, 300-399 = drizzle, etc.
  if (code >= 200 && code < 300) return "storm";
  if (code >= 300 && code < 400) return "drizzle";
  if (code >= 500 && code < 600) return "rain";
  if (code >= 600 && code < 700) return "snow";
  if (code >= 800 && code < 810)
    return code === 800 ? "clear" : "partly-cloudy";
  return "overcast";
}

function deriveAtmosphericFeel(raw: OpenWeatherResponse): string {
  // This is where we translate data into language
  // The engine will use this string directly in generated copy
  const temp = raw.main.temp;
  const condition = mapConditionCode(raw.weather[0].id);

  if (condition === "clear" && temp > 20) return "warm and crystalline";
  if (condition === "rain") return "softened by rain";
  if (condition === "drizzle") return "veiled in fine mist";
  if (temp < 5) return "crisp and alpine";
  return "balanced and temperate";
}

function getFallbackWeather(): WeatherData {
  // Graceful degradation: the feature still works without geolocation.
  // We assume "pleasant conditions" as the baseline.
  return {
    condition: "clear",
    temperature: 18,
    humidity: 55,
    description: "pleasant conditions",
    atmosphericFeel: "balanced and temperate",
  };
}
// composables/useAQI.ts
// Same pattern. The AQI composable translates WAQI's complex
// response into a simple, readable atmospheric quality descriptor.

export function useAQI() {
  const aqi = ref<AQIData | null>(null);

  async function fetchAQI(): Promise<void> {
    try {
      const coords = await getUserCoordinates();
      // Again — hits our own Astro API endpoint, not WAQI directly
      const response = await fetch(
        `/api/aqi?lat=${coords.lat}&lon=${coords.lon}`,
      );
      const raw = await response.json();

      aqi.value = normalizeAQIResponse(raw);
    } catch {
      aqi.value = getFallbackAQI();
    }
  }

  return { aqi, fetchAQI };
}

function normalizeAQIResponse(raw: WAQIResponse): AQIData {
  const index = raw.data.aqi;
  return {
    index,
    quality: mapAQIToQuality(index), // 'pristine' | 'clean' | 'moderate' | 'heavy'
    label: mapAQIToLabel(index), // Human-readable for display
    atmosphericNote: mapAQIToNote(index), // For use in generated copy
  };
}

function mapAQIToQuality(index: number): AQIQuality {
  if (index <= 20) return "pristine";
  if (index <= 50) return "clean";
  if (index <= 100) return "moderate";
  return "heavy";
}

function mapAQIToNote(index: number): string {
  if (index <= 20) return "exceptionally pure";
  if (index <= 50) return "clean and measured";
  if (index <= 100) return "present but breathable";
  return "textured with urban complexity";
}
