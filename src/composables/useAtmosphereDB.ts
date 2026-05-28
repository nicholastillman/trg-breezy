// composables/useAtmosphereDB.ts

import { ref, toRaw } from "vue";
import type { AtmosphericSession } from "../types/atmosphere";
import {
  saveSession as dbSave,
  getRecentSessions as dbGetRecent,
  clearSessions as dbClear,
} from "../lib/db";

export function useAtmosphereDB() {
  const recentSessions = ref<AtmosphericSession[]>([]);
  const isSaving = ref(false);
  const dbError = ref<string | null>(null);

  async function saveSession(
    data: Omit<AtmosphericSession, "id" | "timestamp" | "date">,
  ): Promise<void> {
    const payload: Omit<AtmosphericSession, "id"> = {
      ...JSON.parse(JSON.stringify(data)), // strip proxies
      timestamp: Date.now(),
      date: new Date().toISOString(),
    };
    isSaving.value = true;

    try {
      await dbSave({
        ...payload,
        timestamp: Date.now(),
        date: new Date().toISOString(),
      });
      // Refresh the display list after saving
      await getRecentSessions();
    } catch (e) {
      // DB failure is non-critical. Log and continue.
      console.warn("Atmosphere archive unavailable:", e);
    } finally {
      isSaving.value = false;
    }
  }

  async function getRecentSessions(): Promise<void> {
    try {
      recentSessions.value = await dbGetRecent(5);
    } catch {
      recentSessions.value = [];
    }
  }

  async function clearHistory(): Promise<void> {
    try {
      await dbClear();
      recentSessions.value = [];
    } catch {
      dbError.value = "Could not clear archive";
    }
  }

  return {
    recentSessions,
    isSaving,
    saveSession,
    getRecentSessions,
    clearHistory,
  };
}
