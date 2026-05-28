<script setup lang="ts">
import type {
  AtmosphericRecommendation,
  WeatherData,
  AQIData,
} from "../../../types/atmosphere";
import { ref } from "vue";

import orderForm from "./order-form.vue";
const isOpen = ref(false);

const props = defineProps<{
  recommendation: AtmosphericRecommendation;
  weather: WeatherData;
  aqi: AQIData;
}>();

// Weather condition → a minimal unicode glyph, keeping it typographic
const CONDITION_GLYPHS: Record<string, string> = {
  clear: "○",
  "partly-cloudy": "⛅︎",
  overcast: "●",
  drizzle: "∶",
  rain: "⛆",
  storm: "≋",
  snow: "❄︎",
};

const conditionGlyph = computed(
  () => CONDITION_GLYPHS[props.weather.condition] ?? "○",
);

import { computed } from "vue";

// AQI bar width — capped at 100% visually, capped at 200 for scale
const aqiBarWidth = computed(() =>
  Math.min(100, Math.round((props.aqi.index / 150) * 100)),
);

const aqiBarColor = computed(() => {
  const q = props.aqi.quality;
  if (q === "pristine") return "var(--color-aqi-pristine)";
  if (q === "clean") return "var(--color-aqi-clean)";
  if (q === "moderate") return "var(--color-aqi-moderate)";
  return "var(--color-aqi-heavy)";
});

import OrderForm from "./order-form.vue";
</script>

<template>
  <article
    class="atmospheric-panel"
    aria-label="Your atmospheric recommendation"
  >
    <!-- ── Headline ──────────────────────────────────────────────────── -->
    <blockquote class="panel-headline">
      "{{ recommendation.headline }}"
    </blockquote>

    <!-- ── Product recommendation ───────────────────────────────────── -->
    <div class="panel-product">
      <div class="inner">
        <div class="product-meta">
          <p class="product-label">RECOMMENDED BLEND</p>
          <h3 class="product-name">{{ recommendation.product }}</h3>
          <p class="product-collection">
            {{ recommendation.collection }}
          </p>
        </div>
        <!-- <a href="/pricing" class="panel-cta"> <span>Order → </span></a> -->
        <button class="panel-cta" @click="isOpen = true">
          <span>Order → </span>
        </button>
      </div>
    </div>

    <!-- ── Environmental readings ────────────────────────────────────── -->
    <div class="panel-readings">
      <div class="panel-reading">
        <span class="panel-reading-glyph" aria-hidden="true">{{
          conditionGlyph
        }}</span>
        <div>
          <p class="panel-reading-label">CONDITIONS</p>
          <p class="panel-reading-value">
            {{ Math.round(weather.temperature) }}° · {{ weather.description }}
          </p>
        </div>
      </div>

      <div class="panel-reading">
        <span class="panel-reading-glyph" aria-hidden="true">◈</span>
        <div>
          <p class="panel-reading-label">AIR QUALITY</p>
          <p class="panel-reading-value">
            {{ aqi.index }} AQI · {{ aqi.label }}
          </p>
          <div class="aqi-bar" role="presentation">
            <div
              class="aqi-bar-fill"
              :style="{ width: aqiBarWidth + '%', background: aqiBarColor }"
            />
          </div>
        </div>
      </div>

      <div class="panel-reading">
        <span class="panel-reading-glyph" aria-hidden="true">◧</span>
        <div>
          <p class="panel-reading-label">HUMIDITY</p>
          <p class="panel-reading-value">{{ Math.round(weather.humidity) }}%</p>
        </div>
      </div>
    </div>

    <!-- ── Pairing notes ─────────────────────────────────────────────── -->
    <div class="panel-notes">
      <p class="panel-notes-label">PAIRING NOTES</p>
      <ul class="panel-notes-list">
        <li
          v-for="note in recommendation.pairingNotes"
          :key="note"
          class="panel-note"
        >
          {{ note }}
        </li>
      </ul>
    </div>

    <!-- ── AQI note ───────────────────────────────────────────────────── -->

    <p class="panel-aqi-note">{{ recommendation.aqiNote }}</p>
  </article>
  <div class="modal flow" :class="{ 'is-open': isOpen }">
    <div class="card">
      <p class="product">{{ recommendation.product }}</p>
      <img src="/breezy-concept.png" alt="" width="160" />

      <h4>{{ recommendation.price }}</h4>
    </div>
    <small>{{ recommendation.aqiNote }}</small>
    <OrderForm :price="recommendation.price" />
  </div>
</template>

<style scoped>
.flow > * + * {
  margin-block-start: var(--space-md);
}

.atmospheric-panel {
  border: 1px solid var(--color-palette-sky-200);
  anchor-name: --modal-anchor;
  background: #fcfcfc;
  border-radius: var(--radius-lg);
  margin: var(--space-m) auto;
  padding-block: var(--space-md);
  padding-inline: var(--space-sm);
}

/* ── Headline ────────────────────────────────────────────────────── */
.panel-headline {
  border-bottom: 1px solid var(--color-palette-slate-400);
  color: var(--color-palette-sky-700);
  font-family: "BreezyDisplay", Georgia, serif;
  font-size: var(--size-step-2);
  font-weight: 400;
  font-style: italic;
  line-height: 1.45;
  letter-spacing: -0.01em;
  margin: 0;
  padding: var(--space-sm) var(--space-sm) var(--space-md);
}

/* ── Product ─────────────────────────────────────────────────────── */
.panel-product {
  background-color: var(--color-palette-neutral-100);
  border-radius: 5px;
  padding: var(--space-sm) var(--space-md);
  border: 1px solid var(--color-palette-slate-200);
  margin-block-end: 2rem;
}

.inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
}

.product-label {
  font-size: var(--size-step-000);
  letter-spacing: 0.1em;
  color: var(--color-palette-slate-500);
  margin: 0 0 4px;
  padding-inline: 5px;
}

.product-name {
  font-size: var(--size-step-2);
  font-weight: 500;
  color: var(--color-palette-sky-500);
  margin: 0 0 2px;
  letter-spacing: -0.02em;
}

.product-collection {
  font-size: var(--size-step-00);
  color: var(--color-palette-slate-500);
  margin: 0;
}

.panel-cta {
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
    var(--color-palette-sky-100);
  border: 1px solid transparent;
  border-radius: var(--radius-lg);
  color: var(--color-palette-slate-700);
  flex-shrink: 0;
  font-size: var(--size-step-00);
  letter-spacing: 0.01em;
  padding: 10px 20px;
  text-decoration: none;
  text-transform: uppercase;
  transition: all 200ms ease-in-out;
}

.panel-cta:hover {
  opacity: 0.8;
  color: var(--color-palette-sky-700);
  border-color: var(--color-palette-sky-500);
  background: var(--color-palette-sky-200);
  span {
    display: inline-block;
    transition: transform 200ms ease-in-out;
    transform: translateX(2px);
  }
}

/* ── Readings ────────────────────────────────────────────────────── */
.panel-readings {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border-bottom: 1px solid var(--color-palette-sky-50);
}

.panel-reading {
  display: grid;
  justify-content: center;
  align-items: flex-start;
  padding: var(--space-xs) var(--space-sm);
  border-right: 1px solid var(--color-palette-slate-200);
}

.panel-reading:last-child {
  border-right: none;
}

.panel-reading-glyph {
  font-size: 16px;
  color: var(--color-palette-slate-500);
  margin-top: 2px;
  line-height: 1;
}

.panel-reading-label {
  font-size: 10px;
  letter-spacing: 0.1em;
  color: var(--color-palette-slate-500);
  margin: 0 0 3px;
}

.panel-reading-value {
  font-size: var(--text-sm);
  color: var(--color-slate);
  margin: 0;
}

/* AQI progress bar */
.aqi-bar {
  width: 100%;
  height: 2px;
  background: var(--color-palette-sky-200);
  border-radius: 2px;
  margin-top: 6px;
  overflow: hidden;
}

.aqi-bar-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 800ms var(--ease-atmospheric);
}

/* ── Pairing notes ───────────────────────────────────────────────── */
.panel-notes {
  padding: var(--space-md) var(--space-md);
  border-bottom: 1px solid var(--color-palette-sky-100);
}

.panel-notes-label {
  font-size: 10px;
  letter-spacing: 0.1em;
  color: var(--color-palette-slate-500);
  margin: 0 0 var(--space-2);
}

.panel-notes-list {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  list-style: none;
  padding: 0;
  margin-inline: auto;
  max-width: 48ch;
}

.panel-note {
  font-size: var(--size-step-00);
  color: var(--color-palette-slate-500);
  line-height: 1.5;
  padding-inline-start: 14px;
  position: relative;
}

.panel-note::before {
  color: var(--color-palette-slate-400);
  content: "—";
  position: absolute;
  left: 0;
}

/* ── AQI note ────────────────────────────────────────────────────── */
.panel-aqi-note {
  padding: var(--space-xs) var(--space-sm);
  font-size: var(--size-step-00);
  color: var(--color-palette-sky-700);
  margin: 0;
  font-style: italic;
}

/* ── Responsive ──────────────────────────────────────────────────── */
@media (max-width: 540px) {
  .panel-readings {
    grid-template-columns: 1fr;
  }

  .panel-reading {
    border-right: none;
    border-bottom: 1px solid var(--color-palette-sky-50);
  }

  .panel-reading:last-child {
    border-bottom: none;
  }

  .panel-product-inner {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
