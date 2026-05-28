import { ref } from "vue";

import type {
  MoodId,
  WeatherData,
  AQIData,
  AtmosphericRecommendation,
} from "@/types/atmosphere";

import { generateRecommendation, getTimeOfDay } from "../lib/atmosphere-engine";

interface GenerateParams {
  mood: MoodId;
  weather: WeatherData;
  aqi: AQIData;
}

export function useAtmosphereEngine() {
  const recommendation = ref<AtmosphericRecommendation | null>(null);

  let generationId = 0;
  const isGenerating = ref(false);

  async function generate({ mood, weather, aqi }: GenerateParams) {
    const currentId = ++generationId;
    // Update oure refs:
    isGenerating.value = true;
    recommendation.value = null; // Reset existing recommendation

    // Small intentional delay for atmospheric UX
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Ignore any stale data reqs
    if (currentId !== generationId) {
      return null;
    }

    recommendation.value = generateRecommendation({
      mood,
      weather,
      aqi,
      timeOfDay: getTimeOfDay(),
    });

    isGenerating.value = false;

    return recommendation.value;
  }

  return {
    recommendation,
    isGenerating,
    generate,
  };
}
