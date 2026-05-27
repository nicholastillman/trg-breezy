<script setup lang="ts">
import type { AtmosphericSession } from "../../../types/atmosphere";

const props = defineProps<{
  sessions: AtmosphericSession[];
}>();

const emit = defineEmits<{
  clear: [];
}>();

// Format timestamp as a human-friendly relative date
function formatDate(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const oneDay = 86_400_000;
  const oneWeek = 7 * oneDay;

  if (diff < 60_000) return "Just now";
  if (diff < oneDay) {
    const hours = Math.floor(diff / 3_600_000);
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  }
  if (diff < 2 * oneDay) return "Yesterday";
  if (diff < oneWeek) {
    const days = Math.floor(diff / oneDay);
    return `${days} days ago`;
  }

  // Older than a week — show the actual date
  return new Date(timestamp).toLocaleDateString("en-GB", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
</script>

<template>
  <aside class="history-archive" aria-label="Your atmosphere archive">
    <header class="archive-header">
      <p class="archive-label">YOUR PERSONAL ATMOSPHERE ARCHIVE</p>
      <button
        v-if="sessions.length > 0"
        class="archive-clear"
        @click="emit('clear')"
        aria-label="Clear atmosphere archive"
      >
        Clear
      </button>
    </header>

    <ol class="archive-list" reversed>
      <li v-for="session in sessions" :key="session.id" class="archive-entry">
        <!-- Date -->
        <span class="archive-date">{{ formatDate(session.timestamp) }}</span>

        <!-- Separator -->
        <span class="archive-sep" aria-hidden="true">—</span>

        <!-- Data row -->
        <span class="archive-data">
          AQI {{ session.aqi.index }}
          <span class="archive-dot" aria-hidden="true">·</span>
          {{ capitalize(session.weather.condition.replace("-", " ")) }}
          <span class="archive-dot" aria-hidden="true">·</span>
          {{ capitalize(session.mood) }}
        </span>

        <!-- Headline snippet -->
        <span class="archive-snippet" aria-label="Recommendation">
          "{{ session.recommendation.product }}"
        </span>
      </li>
    </ol>

    <p v-if="sessions.length === 0" class="archive-empty">
      Your atmospheric sessions will appear here.
    </p>
  </aside>
</template>

<style scoped>
.history-archive {
  border-top: 1px solid var(--color-palette-slate-100);
  margin-top: var(--space-md);
  max-width: 640px;
  margin-inline: auto;
  padding-block-start: var(--space-sm);
}

.archive-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-xs);
}

.archive-label {
  font-size: 10px;
  letter-spacing: 0.1em;
  color: var(--color-dusk);
  margin: 0;
}

.archive-clear {
  background: none;
  border: none;
  font-size: var(--size-step-00);
  color: var(--color-palette-slate-600);
  cursor: pointer;
  padding: 4px 0;
  font-family: inherit;
  letter-spacing: 0.03em;
  transition: color 200ms ease;
}

.archive-clear:hover {
  color: var(--color-palette-slate-600);
}

.archive-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.archive-entry {
  display: grid;
  grid-template-columns: auto auto 1fr auto;
  align-items: baseline;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid var(--color-palette-slate-100);
  font-size: var(--size-step-00);
}

.archive-entry:last-child {
  border-bottom: none;
}

.archive-date {
  color: var(--color-palette-slate-600);
  white-space: nowrap;
  font-weight: 400;
}

.archive-sep {
  color: var(--color-dusk);
}

.archive-data {
  color: var(--color-palette-slate-600);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.archive-dot {
  color: var(--color-palette-slate-600);
  margin: 0 2px;
}

.archive-snippet {
  color: var(--color-palette-slate-600);
  font-style: italic;
  font-size: var(--size-step-00);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.archive-empty {
  font-size: var(--size-step-00);
  color: var(--color-palette-slate-600);
  font-style: italic;
  margin: 0;
}

@media (max-width: 540px) {
  .archive-entry {
    grid-template-columns: 1fr;
    gap: 3px;
  }

  .archive-sep,
  .archive-snippet {
    display: none;
  }
}
</style>
