import { getSkyState, formatDay } from "../utils/weatherTheme";

// The free "5 day / 3 hour" forecast endpoint returns 40 entries (8 per day).
// We pick one entry per day, close to midday, to build a simple daily strip.
function pickDailyEntries(list) {
  const byDay = new Map();
  for (const entry of list) {
    const dayKey = entry.dt_txt.slice(0, 10);
    const hour = Number(entry.dt_txt.slice(11, 13));
    const existing = byDay.get(dayKey);
    const distanceFromNoon = Math.abs(hour - 12);
    if (!existing || distanceFromNoon < existing.distanceFromNoon) {
      byDay.set(dayKey, { entry, distanceFromNoon });
    }
  }
  return Array.from(byDay.values()).map((v) => v.entry);
}

export default function ForecastStrip({ forecast, timezoneOffset }) {
  if (!forecast?.list?.length) return null;

  const daily = pickDailyEntries(forecast.list).slice(0, 5);

  return (
    <section className="forecast-strip">
      <h2>Next few days</h2>
      <div className="forecast-scroll">
        {daily.map((entry) => {
          const sky = getSkyState(entry.weather?.[0]?.id);
          return (
            <div
              key={entry.dt}
              className="forecast-item"
              style={{ background: sky.gradient }}
            >
              <span className="forecast-day">{formatDay(entry.dt, timezoneOffset)}</span>
              <span className="forecast-temp">{Math.round(entry.main.temp)}°</span>
              <span className="forecast-desc">{sky.label}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
