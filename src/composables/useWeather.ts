import { ref } from "vue";
import type { WeatherData } from "../types/atmosphere";
import { getMockWeather } from "../lib/atmosphere-engine";

// When real keys are available:
// 1. Add OPENWEATHER_API_KEY to .env
// 2. Create src/pages/api/weather.ts (Astro endpoint — keeps key server-side)
// 3. Replace getMockWeather() with fetchFromAPI() below

export function useWeather() {
  const weather = ref<WeatherData | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function fetchWeather(): Promise<void> {
    isLoading.value = true;
    error.value = null;

    try {
      // ── MOCK MODE ─────────────────────────────────────────────────────────
      // Simulate a brief network delay so loading states render properly
      await delay(600);
      weather.value = getMockWeather();

      // ── REAL API MODE (swap in when keys are ready) ───────────────────────
      // const coords = await getUserCoords()
      // const res = await fetch(`/api/weather?lat=${coords.lat}&lon=${coords.lon}`)
      // if (!res.ok) throw new Error('Weather service unavailable')
      // const raw = await res.json()
      // weather.value = normalizeWeatherResponse(raw)
    } catch (e) {
      error.value = "Could not read local atmosphere";
      weather.value = getMockWeather(); // graceful fallback, always show something
    } finally {
      isLoading.value = false;
    }
  }

  return { weather, isLoading, error, fetchWeather };
}

// ─────────────────────────────────────────────────────────────────────────────
// Private — not exported; components never see this complexity

async function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function getUserCoords() {
  return new Promise<{ lat: number; lon: number }>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => resolve({ lat: 51.5074, lon: -0.1278 }), // fallback: London
    );
  });
}
