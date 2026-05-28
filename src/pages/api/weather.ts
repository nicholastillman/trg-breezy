/ pages/aip / weather.ts;
// This runs on the server. The API key never reaches the browser.

import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ url }) => {
  const lat = url.searchParams.get("lat");
  const lon = url.searchParams.get("lon");

  // API key lives in environment variables (.env file)
  const apiKey = import.meta.env.OPENWEATHER_API_KEY;

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`,
  );

  const data = await response.json();

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
};
