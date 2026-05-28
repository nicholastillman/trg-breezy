<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import type {
  MoodId,
  AtmosphericRecommendation,
  WeatherData,
  AQIData,
} from "@/types/atmosphere.ts";

import { useWeather } from "@composables/useWeather";
import { useAQI } from "@composables/useAQI";
import { useAtmosphereDB } from "@composables/useAtmosphereDB";
import { useAtmosphereEngine } from "@composables/useAtmosphereEngine";

import MoodSelector from "./MoodSelector.vue";
import AtmosphericPanel from "./AtmosphericPanel.vue";
import HistoryArchive from "./HistoryArchive.vue";

// ── State ─────────────────────────────────────────────────────────────────────
const selectedMood = ref<MoodId | null>(null);
const showHistory = ref(true);
const toggleHistory = () => {
  showHistory.value = !showHistory.value;
};

// ── Composables ───────────────────────────────────────────────────────────────
const { weather, fetchWeather } = useWeather();
const { aqi, fetchAQI } = useAQI();
const { recentSessions, saveSession, getRecentSessions, clearHistory } =
  useAtmosphereDB();

const { recommendation, isGenerating, generate } = useAtmosphereEngine();

// ── On mount: pre-fetch data + load archive ───────────────────────────────────
onMounted(async () => {
  await Promise.all([fetchWeather(), fetchAQI(), getRecentSessions()]);
});

// ── Core reaction: mood selection triggers generation ─────────────────────────
watch(selectedMood, async (mood) => {
  if (!mood) return;

  isGenerating.value = true;
  recommendation.value = null;

  // Cover the edgecase - If data hasn't loaded yet, fetch it now.
  if (!weather.value || !aqi.value) {
    await Promise.all([fetchWeather(), fetchAQI()]);
  }

  // Small pause for UX.
  await new Promise((res) => setTimeout(res, 800));

  const result = await generate({
    mood,
    weather: weather.value!,
    aqi: aqi.value!,
  });

  if (!result) return;

  recommendation.value = result;
  isGenerating.value = false;

  // Persist to IndexedDB
  saveSession({
    mood,
    weather: weather.value!,
    aqi: aqi.value!,
    recommendation: result,
  });
});
</script>

<template>
  <section
    id="atmosphere-sync"
    class="atmosphere-sync"
    aria-label="Atmosphere Sync — personalised air pairing"
  >
    <!-- ── Section header — matches the site's editorial section pattern ── -->
    <header class="atmosphere-sync-header flow">
      <p class="label-text"><span class="super">NEW!</span>ATMOSPHERE SYNC™</p>
      <h2 class="display-text atmosphere-sync-heading">
        Air, calibrated to you.
      </h2>
      <p class="atmosphere-sync-sub">
        Tell us where you are, atmospherically speaking. We'll handle the rest.
      </p>
    </header>

    <!-- ── Mood selector — the single user input ──────────────────────────── -->
    <MoodSelector v-model="selectedMood" />

    <!-- ── Animated output area ───────────────────────────────────────────── -->
    <Transition name="atmospheric-fade" mode="out-in">
      <!-- Loading state -->
      <div
        v-if="isGenerating"
        key="loading"
        class="atmospheric-loader"
        aria-live="polite"
        aria-label="Reading your atmosphere"
      >
        <div class="atmospheric-loader-orb" aria-hidden="true" />
        <p class="atmospheric-loader-text">Reading local atmosphere...</p>
      </div>

      <!-- Recommendation panel -->
      <AtmosphericPanel
        v-else-if="recommendation && weather && aqi"
        key="panel"
        :recommendation="recommendation"
        :weather="weather"
        :aqi="aqi"
      />

      <!-- Prompt state — before any mood is selected -->
      <div v-else key="prompt" class="atmosphere-sync-prompt">
        <div class="prompt-glyph" aria-hidden="true">◌</div>

        <p>Select a mood above to receive your atmospheric pairing.</p>
      </div>
    </Transition>
    <button v-if="recommendation" @click="toggleHistory">Show History</button>

    <!-- ── Session history ─────────────────────────────────────────────────── -->
    <HistoryArchive
      v-if="recentSessions.length > 0"
      :sessions="recentSessions"
      @clear="clearHistory"
      :isVisible="showHistory"
    />
  </section>
</template>

<style scoped>
.atmosphere-sync {
  position: relative;
  anchor-scope: --modal-anchor;
  margin: 0 auto;
  max-width: 800px;
  padding: var(--space-m) var(--space-sm);
  text-align: center;
}

/* ── Header ──────────────────────────────────────────────────────── */
.atmosphere-sync-header {
  .label-text {
    background: linear-gradient(
      135deg,
      var(--color-palette-sky-400),
      var(--color-palette-violet-500)
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    color: var(--color-palette-sky-100);
    font-size: var(--size-step-00);
    font-weight: var(--font-weight-medium);
    margin-bottom: var(--space-sm);
    letter-spacing: var(--letter-spacing-micro);
  }
}

.atmosphere-sync-heading {
  font-size: var(--size-step-3);
  /* font-family: var(--font-family-base); */
  font-weight: var(--font-weight-medium);
  margin-block-end: var(--space-sm);
}

.atmosphere-sync-sub {
  font-size: var(--size-step-00);
  color: var(--color-palette-slate-600);
  max-width: 40ch;
  margin: 0 auto;
  line-height: 1.6;
}

/* ── Loading orb ─────────────────────────────────────────────────── */
.atmospheric-loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-md) 0;
}

.atmospheric-loader-orb {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid var(--color-palette-emerald-500);
  animation: breathe 2.4s var(--ease-atmospheric) infinite;
}

@keyframes breathe {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.4;
  }
  50% {
    transform: scale(1.15);
    opacity: 1;
  }
}

.atmospheric-loader-text {
  font-size: var(--text-sm);
  color: var(--color-dusk);
  font-style: italic;
  margin: 0;
}

/* ── Prompt (pre-selection state) ────────────────────────────────── */
.atmosphere-sync-prompt {
  font-size: var(--size-step-0);
  padding: var(--space-sm) 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
}

.prompt-glyph {
  font-size: 32px;
  background:
    radial-gradient(
      ellipse 80% 60% at 50% 0%,
      rgba(186, 230, 253, 0.5),
      transparent
    ),
    radial-gradient(
      ellipse 60% 50% at 80% 80%,
      rgba(159, 122, 247, 0.08),
      transparent
    ),
    var(--color-palette-sky-50);
  border-radius: 50%;
  box-shadow: var(--shadow-md);
  color: var(--color-palette-sky-200);
  line-height: 1;
  animation:
    pulse 4s ease-in-out,
    rotate 4s ease-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.4;
  }
  50% {
    opacity: 1;
  }
}
@keyframes rotate {
  0%,
  100% {
    transform: rotate(0deg);
    transform: scale(0.5);
  }
  50% {
    transform: rotate(90deg);
    /* transform: scale(1); */
    transform-origin: center;
  }
}

.atmosphere-sync-prompt p {
  color: var(--color-dusk);
  font-size: var(--text-sm);
  font-style: italic;
  margin: 0;
}

/* ── Transitions ─────────────────────────────────────────────────── */
.atmospheric-fade-enter-active,
.atmospheric-fade-leave-active {
  transition:
    opacity 500ms var(--ease-atmospheric),
    transform 500ms var(--ease-atmospheric);
}

.atmospheric-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.atmospheric-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
