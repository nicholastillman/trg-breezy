import type {
  MoodId,
  WeatherCondition,
  AQIQuality,
  TimeOfDay,
  WeatherData,
  AQIData,
  AtmosphericContext,
  AtmosphericRecommendation,
} from "../types/atmosphere";

// ─────────────────────────────────────────────────────────────────────────────
// Descriptor tables — all copy is authored here, not generated
// Change these to tune the brand voice without touching component logic
// ─────────────────────────────────────────────────────────────────────────────

interface MoodDescriptor {
  tone: string;
  intent: string;
  verb: string;
  pairingNote: string;
}

const MOOD_DESCRIPTORS: Record<MoodId, MoodDescriptor> = {
  focused: {
    tone: "crystalline",
    intent: "quiet ambition",
    verb: "sharpens",
    pairingNote: "Recommended for 90-minute deep work sessions",
  },
  reflective: {
    tone: "contemplative",
    intent: "unhurried thought",
    verb: "deepens",
    pairingNote: "Pairs with journaling, reading, or considered stillness",
  },
  restless: {
    tone: "electric",
    intent: "restless momentum",
    verb: "charges",
    pairingNote: "Best consumed during movement or creative pacing",
  },
  serene: {
    tone: "still",
    intent: "spacious calm",
    verb: "settles",
    pairingNote: "Allow 20 minutes of quiet before engaging the blend",
  },
  energized: {
    tone: "bright",
    intent: "clean momentum",
    verb: "opens",
    pairingNote: "Take in full, measured breaths for maximum activation",
  },
};

const TIME_DESCRIPTORS: Record<TimeOfDay, string> = {
  "early-morning": "first light",
  morning: "morning clarity",
  afternoon: "the measured afternoon",
  evening: "the descending hour",
  night: "late quiet",
};

// Product name matrix: [weather condition][aqi quality]
const PRODUCT_MATRIX: Record<
  WeatherCondition,
  Record<AQIQuality, { name: string; collection: string; price: string }>
> = {
  clear: {
    pristine: {
      name: "Summit Reserve",
      collection: "Single Origin Alpine",
      price: "$42",
    },
    clean: {
      name: "Highland Clarity",
      collection: "Morning Edition",
      price: "$42",
    },
    moderate: {
      name: "Urban Refuge",
      collection: "Filtered Collection",
      price: "$32",
    },
    heavy: {
      name: "The Sanctuary Blend",
      collection: "Maximum Filtration",
      price: "$49",
    },
  },
  "partly-cloudy": {
    pristine: {
      name: "Veiled Summit",
      collection: "Diffused Light Series",
      price: "$42",
    },
    clean: { name: "Soft Canopy", collection: "Dappled Edition", price: "$80" },
    moderate: { name: "The Filter", collection: "Urban Clarity", price: "$92" },
    heavy: {
      name: "Grey Refuge",
      collection: "Deep Filtration",
      price: "$142",
    },
  },
  overcast: {
    pristine: {
      name: "Pewter Reserve",
      collection: "Nordic Edition",
      price: "$23",
    },
    clean: {
      name: "Muted Highland",
      collection: "Grey Sky Series",
      price: "$33",
    },
    moderate: {
      name: "The Veil",
      collection: "Overcast Collection",
      price: "$42",
    },
    heavy: { name: "City Grey", collection: "Urban Shield", price: "$65" },
  },
  drizzle: {
    pristine: {
      name: "Petrichor Series",
      collection: "Mountain Rain Accord",
      price: "$92",
    },
    clean: {
      name: "Soft Rain",
      collection: "Pacific Collection",
      price: "$42",
    },
    moderate: {
      name: "The Canopy Blend",
      collection: "Sheltered Edition",
      price: "$29",
    },
    heavy: {
      name: "Grey City",
      collection: "Melancholic Accord",
      price: "$55",
    },
  },
  rain: {
    pristine: {
      name: "Deep Rain Reserve",
      collection: "Storm-Washed Alpine",
      price: "$70",
    },
    clean: {
      name: "Rainfall Edition",
      collection: "Clean Descent",
      price: "$84",
    },
    moderate: { name: "The Shelter", collection: "Rainy Urban", price: "$53" },
    heavy: {
      name: "Industrial Rain",
      collection: "Filtered Downpour",
      price: "$66",
    },
  },
  storm: {
    pristine: {
      name: "Tempest Reserve",
      collection: "Wild Alpine",
      price: "$90",
    },
    clean: {
      name: "Electric Storm",
      collection: "Charged Edition",
      price: "$24",
    },
    moderate: {
      name: "Storm Refuge",
      collection: "Heavy Weather",
      price: "$75",
    },
    heavy: {
      name: "The Bunker Blend",
      collection: "Maximum Shelter",
      price: "$34",
    },
  },
  snow: {
    pristine: {
      name: "Glacial Reserve",
      collection: "First Snow Series",
      price: "$22",
    },
    clean: {
      name: "Winter Clarity",
      collection: "Silent Edition",
      price: "$43",
    },
    moderate: { name: "Soft Snow", collection: "Muffled Urban", price: "$22" },
    heavy: { name: "The Cocoon", collection: "Enclosed Warmth", price: "$34" },
  },
};

const WEATHER_FEELS: Record<WeatherCondition, string[]> = {
  clear: ["crystalline and open", "luminous and direct", "clean at altitude"],
  "partly-cloudy": [
    "softened by passing cloud",
    "diffused and gentle",
    "intermittently bright",
  ],
  overcast: [
    "muted and even",
    "nordic in its stillness",
    "hushed beneath grey",
  ],
  drizzle: ["veiled in fine mist", "softened by petrichor", "quietly damp"],
  rain: ["deepened by rain", "washed and clarified", "present with moisture"],
  storm: [
    "charged and volatile",
    "electric at the edges",
    "dramatically atmospheric",
  ],
  snow: ["silenced by snow", "compressed and still", "crystalline and cold"],
};

// ─────────────────────────────────────────────────────────────────────────────
// Mock data for development (replace with real API calls later)
// ─────────────────────────────────────────────────────────────────────────────

export function getMockWeather(): WeatherData {
  const conditions: WeatherCondition[] = [
    "clear",
    "partly-cloudy",
    "drizzle",
    "rain",
    "overcast",
  ];
  const condition = conditions[Math.floor(Math.random() * conditions.length)];
  const temp = Math.round(8 + Math.random() * 18);
  const humidity = Math.round(40 + Math.random() * 40);

  return {
    condition,
    temperature: temp,
    humidity,
    description: condition.replace("-", " "),
    atmosphericFeel: pickRandom(WEATHER_FEELS[condition]),
  };
}

export function getMockAQI(): AQIData {
  const index = Math.round(10 + Math.random() * 80);
  return {
    index,
    quality: indexToQuality(index),
    label: indexToLabel(index),
    atmosphericNote: indexToNote(index),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Core engine
// ─────────────────────────────────────────────────────────────────────────────

export function generateRecommendation(
  ctx: AtmosphericContext,
): AtmosphericRecommendation {
  const mood = MOOD_DESCRIPTORS[ctx.mood];
  const time = TIME_DESCRIPTORS[ctx.timeOfDay];
  const product = PRODUCT_MATRIX[ctx.weather.condition]?.[ctx.aqi.quality] ?? {
    name: "The Foundation Blend",
    collection: "Daily Edition",
  };

  const headline = buildHeadline(mood, ctx.weather, ctx.aqi, time);
  const aqiNote = `Local air reads ${ctx.aqi.index} AQI — ${ctx.aqi.label}. Pairs well with ${mood.tone} intention.`;

  const pairingNotes = buildPairingNotes(ctx, mood);

  return {
    headline,
    product: product.name,
    price: product.price,
    collection: product.collection,
    aqiNote,
    pairingNotes,
  };
}

export function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  if (hour >= 4 && hour < 7) return "early-morning";
  if (hour >= 7 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

// ─────────────────────────────────────────────────────────────────────────────
// Private builders
// ─────────────────────────────────────────────────────────────────────────────

function buildHeadline(
  mood: MoodDescriptor,
  weather: WeatherData,
  aqi: AQIData,
  time: string,
): string {
  const feel = weather.atmosphericFeel;
  const base = `${capitalize(feel)} air ${mood.verb} ${mood.intent}`;

  if (aqi.quality === "pristine") {
    return `${base}, ${aqi.atmosphericNote}, during ${time}.`;
  }
  if (aqi.quality === "heavy") {
    return `${base} beneath air ${aqi.atmosphericNote} — ${time}.`;
  }
  return `${base} — ${time}.`;
}

function buildPairingNotes(
  ctx: AtmosphericContext,
  mood: MoodDescriptor,
): string[] {
  const notes: string[] = [];

  if (ctx.weather.temperature < 8) {
    notes.push(
      "Best experienced through an open window with a warm beverage nearby",
    );
  } else if (ctx.weather.temperature > 22) {
    notes.push(
      "Allows full atmospheric expansion in warmer ambient conditions",
    );
  } else {
    notes.push("Ideal temperature range for full aromatic complexity");
  }

  if (ctx.weather.condition === "rain" || ctx.weather.condition === "drizzle") {
    notes.push(
      "The precipitation contributes a petrichor undertone — a rare natural accord",
    );
  } else if (ctx.weather.condition === "snow") {
    notes.push(
      "Snow compression creates a unique pressure accord found nowhere else",
    );
  } else if (ctx.weather.condition === "clear") {
    notes.push(
      `Clarity index: ${ctx.aqi.index} AQI — within our recommended range for single-origin profiles`,
    );
  }

  notes.push(mood.pairingNote);
  return notes;
}

// ─────────────────────────────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────────────────────────────

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function indexToQuality(index: number): AQIQuality {
  if (index <= 20) return "pristine";
  if (index <= 50) return "clean";
  if (index <= 100) return "moderate";
  return "heavy";
}

function indexToLabel(index: number): string {
  if (index <= 20) return "Exceptional";
  if (index <= 50) return "Good";
  if (index <= 100) return "Moderate";
  return "Unhealthy";
}

function indexToNote(index: number): string {
  if (index <= 20) return "exceptionally pure";
  if (index <= 50) return "clean and measured";
  if (index <= 100) return "present but breathable";
  return "textured with urban complexity";
}
