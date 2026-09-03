import { useState } from "react";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import ForecastStrip from "./components/ForecastStrip";

const API_KEY = import.meta.env.VITE_OWM_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export default function App() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastQuery, setLastQuery] = useState("");

  async function fetchWeather(city) {
    setLoading(true);
    setError(null);
    setLastQuery(city);

    try {
      const weatherRes = await fetch(
        `${BASE_URL}/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
      );

      if (!weatherRes.ok) {
        if (weatherRes.status === 404) {
          throw new Error(`Couldn't find "${city}". Check the spelling and try again.`);
        }
        if (weatherRes.status === 401) {
          throw new Error("API key missing or invalid. Add VITE_OWM_API_KEY in your .env file.");
        }
        throw new Error("Something went wrong fetching the weather. Try again shortly.");
      }

      const weatherData = await weatherRes.json();
      setWeather(weatherData);

      const forecastRes = await fetch(
        `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
      );
      if (forecastRes.ok) {
        const forecastData = await forecastRes.json();
        setForecast(forecastData);
      } else {
        setForecast(null);
      }
    } catch (err) {
      setError(err.message);
      setWeather(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <p className="eyebrow">Live Sky Conditions</p>
        <h1>Weather Dashboard</h1>
        <p className="subtitle">
          Search any city for current conditions and a 5-day outlook. The
          background shifts to match the real sky.
        </p>
        <SearchBar onSearch={fetchWeather} loading={loading} />
      </header>

      <main>
        {error && (
          <div className="state-message error" role="alert">
            {error}
          </div>
        )}

        {!error && !weather && !loading && (
          <div className="state-message empty">
            Search a city to see what's happening in its sky right now.
          </div>
        )}

        {loading && !weather && (
          <div className="state-message loading">Fetching {lastQuery}…</div>
        )}

        {weather && (
          <>
            <WeatherCard data={weather} />
            <ForecastStrip forecast={forecast} timezoneOffset={weather.timezone ?? 0} />
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>Weather data from OpenWeatherMap</p>
      </footer>
    </div>
  );
}
