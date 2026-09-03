import { getSkyState } from "../utils/weatherTheme";

export default function WeatherCard({ data }) {
  const conditionCode = data.weather?.[0]?.id;
  const sky = getSkyState(conditionCode);
  const description = data.weather?.[0]?.description ?? sky.label;

  return (
    <section className="weather-card" style={{ background: sky.gradient }}>
      <div className="atmosphere" aria-hidden="true">
        <span className="drift drift-1" />
        <span className="drift drift-2" />
        <span className="drift drift-3" />
      </div>

      <div className="weather-card-content">
        <p className="location">
          {data.name}
          {data.sys?.country ? `, ${data.sys.country}` : ""}
        </p>

        <p className="temperature">{Math.round(data.main.temp)}°</p>
        <p className="condition">{description}</p>

        <div className="stat-row">
          <div className="stat">
            <span className="stat-label">Feels like</span>
            <span className="stat-value">{Math.round(data.main.feels_like)}°</span>
          </div>
          <div className="stat">
            <span className="stat-label">Humidity</span>
            <span className="stat-value">{data.main.humidity}%</span>
          </div>
          <div className="stat">
            <span className="stat-label">Wind</span>
            <span className="stat-value">{Math.round(data.wind.speed)} m/s</span>
          </div>
        </div>
      </div>
    </section>
  );
}
