import { ref } from "vue";
import type { AQIData } from "../types/atmosphere";
import { getMockAQI } from "@lib/atmosphere-engine";

export function useAQI() {
  const aqi = ref<AQIData | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function fetchAQI(): Promise<void> {
    isLoading.value = true;
    error.value = null;

    try {
      // ── MOCK MODE ─────────────────────────────────────────────────────────
      await delay(400); // Slightly faster than weather — realistic API variance
      aqi.value = getMockAQI();

      // ── REAL API MODE ─────────────────────────────────────────────────────
      // const coords = await getUserCoords()
      // const res = await fetch(`/api/aqi?lat=${coords.lat}&lon=${coords.lon}`)
      // if (!res.ok) throw new Error('AQI service unavailable')
      // const raw = await res.json()
      // aqi.value = normalizeAQIResponse(raw)
    } catch {
      error.value = "Could not read air quality data";
      aqi.value = getMockAQI();
    } finally {
      isLoading.value = false;
    }
  }

  return { aqi, isLoading, error, fetchAQI };
}

async function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
