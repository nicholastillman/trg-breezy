<script setup lang="ts">
import type { MoodId } from "@/types/atmosphere";

const moods: { id: MoodId; label: string }[] = [
  { id: "focused", label: "Focused" },
  { id: "reflective", label: "Reflective" },
  { id: "restless", label: "Restless" },
  { id: "serene", label: "Serene" },
  { id: "energized", label: "Energized" },
];

const selected = defineModel<MoodId | null>({ default: null });
</script>

<template>
  <div class="mood-selector" role="group" aria-label="Select your current mood">
    <button
      v-for="mood in moods"
      :key="mood.id"
      class="mood-option"
      :class="{ 'is-selected': selected === mood.id }"
      :aria-pressed="selected === mood.id"
      @click="selected = mood.id"
    >
      <span class="mood-option-glyph" aria-hidden="true">
        {{ selected === mood.id ? "◉" : "◌" }}
      </span>
      <span class="mood-option-label">{{ mood.label }}</span>
    </button>
  </div>
</template>

<style scoped>
.mood-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin: var(--space-sm) 0;
}

.mood-option {
  background: transparent;
  border: 1px solid var(--color-palette-slate-300);
  border-radius: var(--radius-full);
  color: var(--color-palette-slate-500);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: inherit;
  font-size: var(--size-step-00);
  letter-spacing: 0.02em;
  padding: 10px 20px;
  transition:
    border-color 300ms var(--ease-atmospheric),
    background 300ms var(--ease-atmospheric),
    color 300ms var(--ease-atmospheric),
    transform 200ms var(--ease-atmospheric);
}

.mood-option:hover {
  border-color: var(--color-palette-sky-700);
  color: var(--color-palette-sky-700);
  transform: translateY(-1px);
}

.mood-option.is-selected {
  background-color: var(--color-palette-slate-700);
  color: var(--color-light);
}

.mood-option-glyph {
  font-size: 10px;
  opacity: 0.7;
}

.mood-option-label {
  font-weight: 400;
}
</style>
