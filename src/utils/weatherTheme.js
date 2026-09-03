// Maps OpenWeatherMap condition codes/groups to a visual "sky state".
// This is the signature element of the app: the background gradient and
// floating atmosphere shift to match real, live conditions rather than
// staying static.

const SKY_STATES = {
  clear: {
    label: "Clear",
    gradient: "linear-gradient(160deg, #2E4374 0%, #5B7DB1 45%, #F2A65A 100%)",
    accent: "#F2A65A",
  },
  clouds: {
    label: "Cloudy",
    gradient: "linear-gradient(160deg, #33395C 0%, #5C6088 45%, #9BA0C2 100%)",
    accent: "#C7CBE8",
  },
  rain: {
    label: "Rainy",
    gradient: "linear-gradient(160deg, #1B1F3B 0%, #2F3A5C 45%, #45577D 100%)",
    accent: "#7FA6D9",
  },
  drizzle: {
    label: "Drizzle",
    gradient: "linear-gradient(160deg, #232A47 0%, #38466B 45%, #55688F 100%)",
    accent: "#8FB2DB",
  },
  thunderstorm: {
    label: "Stormy",
    gradient: "linear-gradient(160deg, #131328 0%, #2A2450 45%, #4A3B72 100%)",
    accent: "#B98BE0",
  },
  snow: {
    label: "Snowy",
    gradient: "linear-gradient(160deg, #33456B 0%, #7C93B8 45%, #E9EEF6 100%)",
    accent: "#E9EEF6",
  },
  mist: {
    label: "Misty",
    gradient: "linear-gradient(160deg, #35415A 0%, #6A7690 45%, #A9B2C3 100%)",
    accent: "#C7CEDB",
  },
  default: {
    label: "—",
    gradient: "linear-gradient(160deg, #1B1B3A 0%, #383E68 50%, #6C6F9C 100%)",
    accent: "#F2A65A",
  },
};

// OpenWeatherMap groups condition codes in bands of 100:
// 2xx thunderstorm, 3xx drizzle, 5xx rain, 6xx snow, 7xx atmosphere (mist etc), 800 clear, 80x clouds
export function getSkyState(conditionCode) {
  if (!conditionCode) return SKY_STATES.default;
  if (conditionCode >= 200 && conditionCode < 300) return SKY_STATES.thunderstorm;
  if (conditionCode >= 300 && conditionCode < 400) return SKY_STATES.drizzle;
  if (conditionCode >= 500 && conditionCode < 600) return SKY_STATES.rain;
  if (conditionCode >= 600 && conditionCode < 700) return SKY_STATES.snow;
  if (conditionCode >= 700 && conditionCode < 800) return SKY_STATES.mist;
  if (conditionCode === 800) return SKY_STATES.clear;
  if (conditionCode > 800 && conditionCode < 900) return SKY_STATES.clouds;
  return SKY_STATES.default;
}

export function formatDay(dt, timezoneOffsetSeconds) {
  const date = new Date((dt + timezoneOffsetSeconds) * 1000);
  return date.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" });
}
