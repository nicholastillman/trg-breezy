export type MoodId = 'focused' | 'reflective' | 'restless' | 'serene' | 'energized'

export type WeatherCondition =
  | 'clear'
  | 'partly-cloudy'
  | 'overcast'
  | 'drizzle'
  | 'rain'
  | 'storm'
  | 'snow'

export type AQIQuality = 'pristine' | 'clean' | 'moderate' | 'heavy'

export type TimeOfDay =
  | 'early-morning'
  | 'morning'
  | 'afternoon'
  | 'evening'
  | 'night'

export interface WeatherData {
  condition: WeatherCondition
  temperature: number
  humidity: number
  description: string
  atmosphericFeel: string
}

export interface AQIData {
  index: number
  quality: AQIQuality
  label: string
  atmosphericNote: string
}

export interface AtmosphericContext {
  mood: MoodId
  weather: WeatherData
  aqi: AQIData
  timeOfDay: TimeOfDay
}

export interface AtmosphericRecommendation {
  headline: string
  product: string
  collection: string
  aqiNote: string
  pairingNotes: string[]
}

export interface AtmosphericSession {
  id?: number
  timestamp: number
  date: string
  mood: MoodId
  weather: WeatherData
  aqi: AQIData
  recommendation: AtmosphericRecommendation
}
