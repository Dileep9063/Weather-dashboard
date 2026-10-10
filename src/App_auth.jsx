import { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import ForecastStrip from "./components/ForecastStrip";
import Login from "./components/Login";
import Register from "./components/Register";
import { isAuthenticated, getUser, logoutUser } from "./utils/auth";
import { getSkyState } from "./utils/weatherTheme";

const API_KEY = import.meta.env.VITE_OWM_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export default function App() {
  const [authState, setAuthState] = useState("checking"); // checking | loggedout | login | register | loggedin
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastQuery, setLastQuery] = useState("");
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") {
      return saved === "dark";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Check authentication on mount
  useEffect(() => {
    if (isAuthenticated()) {
      setAuthState("loggedin");
    } else {
      setAuthState("loggedout");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", dark ? "dark" : "light");
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  function handleLoginSuccess(user) {
    setAuthState("loggedin");
  }

  function handleRegisterSuccess(user) {
    setAuthState("loggedin");
  }

  function handleLogout() {
    logoutUser();
    setAuthState("loggedout");
    setWeather(null);
    setForecast(null);
  }

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

  const skyState = weather ? getSkyState(weather.weather[0].main === "Clouds" ? 801 : weather.weather[0].id) : null;

  // Auth views
  if (authState === "login") {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }
  if (authState === "register") {
    return <Register onRegisterSuccess={handleRegisterSuccess} />;
  }
  if (authState === "loggedout") {
    return (
      <div className="auth-landing">
        <div className="auth-landing-card">
          <h1>Weather Dashboard</h1>
          <p className="subtitle">
            Search any city for live sky conditions and a 5-day outlook. Sign in
            to save your favorites.
          </p>
          <button
            type="button"
            onClick={() => setAuthState("login")}
            className="auth-button primary"
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setAuthState("register")}
            className="auth-button secondary"
          >
            Create account
          </button>
        </div>
      </div>
    );
  }

  // Dashboard view (authenticated)
  return (
    <div className="app" style={{ background: skyState?.gradient || "linear-gradient(160deg, #2E4374 0%, #5B7DB1 45%, #F2A65A 100%)" }}>
      <header className="app-header">
        <p className="eyebrow">Live Sky Conditions</p>
        <h1>Weather Dashboard</h1>
        <p className="subtitle">
          Search any city for current conditions and a 5-day outlook. The
          background shifts to match the real sky.
        </p>
        <SearchBar onSearch={fetchWeather} loading={loading} />
        <div className="header-actions">
          <div className="user-greeting">
            Hello, {getUser()?.email}
          </div>
          <button
            type="button"
            aria-label="Logout"
            onClick={handleLogout}
            className="auth-logout"
          >
            Logout
          </button>
          <button
            type="button"
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            onClick={() => setDark(d => !d)}
            className="theme-toggle"
          >
            {dark ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
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
        <p>Weather data from OpenWeatherMap · Auth by JWT</p>
      </footer>
    </div>
  );
}