# Weather Dashboard

A React + Vite weather dashboard that fetches live conditions and a 5-day
forecast from the OpenWeatherMap API. The background gradient and floating
atmosphere shift to match the real weather returned for the searched city.

## Features

- Search any city worldwide for current conditions
- Live temperature, "feels like", humidity, and wind speed
- 5-day forecast strip, one reading per day
- Dynamic sky-state theming (clear / cloudy / rain / storm / snow / mist)
- Responsive layout, keyboard-accessible, respects reduced-motion preference
- Clear loading and error states (invalid city, missing API key, network issues)

## Tech Stack

React, Vite, plain CSS (CSS custom properties for design tokens), the
OpenWeatherMap REST API.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Get a free API key from [OpenWeatherMap](https://openweathermap.org/api)
   (Sign up → API keys tab. New keys can take up to a couple of hours to
   activate.)

3. Copy `.env.example` to `.env` and add your key:

   ```bash
   cp .env.example .env
   ```

   ```
   VITE_OWM_API_KEY=your_actual_key_here
   ```

4. Run the dev server:

   ```bash
   npm run dev
   ```

   Open the printed local URL (usually `http://localhost:5173`).

## Build for production

```bash
npm run build
npm run preview
```

## Deploying

This project deploys cleanly to Vercel or Netlify:

1. Push this repo to GitHub.
2. Import it in Vercel/Netlify.
3. Add an environment variable `VITE_OWM_API_KEY` with your key in the
   project's dashboard settings.
4. Deploy.

## Project Structure

```
src/
  components/
    SearchBar.jsx       # City search input
    WeatherCard.jsx      # Hero card: current conditions
    ForecastStrip.jsx    # 5-day forecast strip
  utils/
    weatherTheme.js       # Maps weather codes to gradients/labels
  App.jsx                 # Fetch logic + layout
  index.css                # Design tokens + all styling
```
