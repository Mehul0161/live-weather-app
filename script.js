const apiKey = "599cc0cd1b9b3031605287f4d2e2a3fe";
const apiBaseUrl = "https://api.openweathermap.org/data/2.5/weather";

// DOM elements
const searchForm = document.querySelector(".search");
const searchInput = document.querySelector(".search input");
const weatherIcon = document.querySelector(".weather-icon");
const bgVideoEl = document.getElementById("bgVideo");
const bgVideoSource = document.querySelector("#bgVideo source.video");
const weatherRoot = document.querySelector(".weather");
const statusBar = document.querySelector(".status-bar");
const loadingEl = document.querySelector(".loading");
const unitButtons = document.querySelectorAll(".unit-btn");
const geoBtn = document.querySelector(".geo-btn");
const themeMeta = document.querySelector('meta[name="theme-color"]');

// State
let unit = localStorage.getItem("unit") || "metric"; // 'metric' | 'imperial'
let lastCity = localStorage.getItem("lastCity") || "Delhi";

function setLoading(isLoading) {
  if (!weatherRoot || !loadingEl) return;
  weatherRoot.setAttribute("data-loading", String(isLoading));
  loadingEl.hidden = !isLoading;
}

function showStatus(message, type = "info") {
  if (!statusBar) return;
  statusBar.textContent = message;
  statusBar.dataset.type = type;
  statusBar.hidden = !message;
}

function setActiveUnitButton() {
  unitButtons.forEach((btn) => {
    const isActive = btn.dataset.unit === unit;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-pressed", String(isActive));
  });
}

function toTitleCase(text) {
  return text.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}

function formatWind(speedMsOrMph) {
  if (unit === "metric") {
    const kmh = Math.round(speedMsOrMph * 3.6);
    return `${kmh} km/h`;
  }
  return `${Math.round(speedMsOrMph)} mph`;
}

function formatVisibility(distanceMeters) {
  if (typeof distanceMeters !== "number") return "—";
  if (unit === "imperial") {
    const miles = distanceMeters / 1609.344;
    return `${miles.toFixed(1)} mi`;
  }
  return `${(distanceMeters / 1000).toFixed(1)} km`;
}

function mapConditionToIcon(main) {
  switch (main) {
    case "Clouds":
      return "images/clouds.png";
    case "Clear":
      return "images/clear.png";
    case "Rain":
      return "images/rain.png";
    case "Mist":
    case "Haze":
      return "images/mist.png";
    case "Drizzle":
      return "images/drizzle.png";
    case "Snow":
      return "images/snow.png";
    default:
      return "images/clouds.png";
  }
}

function mapConditionToVideo(main) {
  // Fallback to rainy since only rainy.mp4 is present in repo
  const fallback = "videos/rainy.mp4";
  switch (main) {
    case "Clouds":
      return fallback; // "videos/cloudy.mp4"
    case "Clear":
      return fallback; // "videos/sunny.mp4"
    case "Rain":
      return "videos/rainy.mp4";
    case "Mist":
    case "Haze":
      return fallback; // "videos/misty.mp4"
    case "Drizzle":
      return fallback; // "videos/drizzle.mp4"
    case "Snow":
      return fallback; // could be "videos/snow.mp4"
    default:
      return fallback;
  }
}

function describeStatus(main) {
  switch (main) {
    case "Clouds":
      return "Cloudy";
    case "Clear":
      return "Sunny";
    case "Rain":
      return "Raining";
    case "Mist":
    case "Haze":
      return "Misty";
    case "Drizzle":
      return "Drizzly";
    case "Snow":
      return "Snowy";
    case "Thunderstorm":
      return "Stormy";
    default:
      return toTitleCase(main || "");
  }
}

function setBackgroundVideo(src) {
  if (!bgVideoEl || !bgVideoSource) return;
  if (bgVideoSource.getAttribute("src") === src) return;
  bgVideoSource.setAttribute("src", src);
  // Reload video to apply new source
  bgVideoEl.load();
}

function isDaytime(sys, timezoneSeconds) {
  // sys.sunrise/sunset are UTC seconds; data.dt is current UTC seconds for location
  try {
    const nowLocal = (sys?.sunrise && sys?.sunset) ? (sys.sunrise + sys.sunset) / 2 : undefined; // not needed here actually
    // We'll determine day by comparing dt with sunrise/sunset
    return true; // default; we'll refine at call site if dt/sunrise/sunset available
  } catch { return true; }
}

function applyTheme(main, isDay) {
  // Define palettes per condition and time
  const root = document.documentElement;
  let bg1, bg2, overlayStart, overlayEnd, accent;
  const lower = (main || '').toLowerCase();
  if (lower.includes('clear')) {
    if (isDay) { bg1 = '#56ccf2'; bg2 = '#2f80ed'; overlayStart = 'rgba(0,60,120,.10)'; overlayEnd = 'rgba(0,40,100,.35)'; accent = '#ffd166'; }
    else { bg1 = '#0f2027'; bg2 = '#203a43'; overlayStart = 'rgba(0,0,20,.35)'; overlayEnd = 'rgba(0,0,0,.6)'; accent = '#f2a65a'; }
  } else if (lower.includes('cloud')) {
    if (isDay) { bg1 = '#8e9eab'; bg2 = '#eef2f3'; overlayStart = 'rgba(0,0,0,.10)'; overlayEnd = 'rgba(0,0,0,.35)'; accent = '#60e0a7'; }
    else { bg1 = '#232526'; bg2 = '#414345'; overlayStart = 'rgba(0,0,0,.2)'; overlayEnd = 'rgba(0,0,0,.5)'; accent = '#9fd3c7'; }
  } else if (lower.includes('rain') || lower.includes('drizzle') || lower.includes('thunder')) {
    bg1 = '#283048'; bg2 = '#859398'; overlayStart = 'rgba(0,0,0,.25)'; overlayEnd = 'rgba(0,0,0,.6)'; accent = '#7ae582';
  } else if (lower.includes('snow')) {
    bg1 = '#e0eafc'; bg2 = '#cfdef3'; overlayStart = 'rgba(255,255,255,.25)'; overlayEnd = 'rgba(0,0,30,.35)'; accent = '#5ec2ff';
  } else if (lower.includes('mist') || lower.includes('haze') || lower.includes('fog')) {
    bg1 = '#606c88'; bg2 = '#3f4c6b'; overlayStart = 'rgba(20,30,60,.35)'; overlayEnd = 'rgba(10,20,40,.5)'; accent = '#cdb4db';
  } else {
    bg1 = '#0cbb69'; bg2 = '#110949'; overlayStart = 'rgba(0,0,0,.2)'; overlayEnd = 'rgba(0,0,0,.5)'; accent = '#60e0a7';
  }
  root.style.setProperty('--bg-1', bg1);
  root.style.setProperty('--bg-2', bg2);
  root.style.setProperty('--overlay-start', overlayStart);
  root.style.setProperty('--overlay-end', overlayEnd);
  root.style.setProperty('--accent', accent);
  if (themeMeta) themeMeta.setAttribute('content', bg1);
}

function formatUpdatedTime(dt, timezone) {
  try {
    const localTsMs = (dt + timezone) * 1000;
    const formatter = new Intl.DateTimeFormat(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      weekday: "short",
    });
    return formatter.format(new Date(localTsMs));
  } catch {
    return "—";
  }
}

async function checkWeather(city) {
  if (!city) {
    showStatus("Please enter a city name.", "warning");
    return;
  }
  setLoading(true);
  showStatus("");
  try {
    const url = `${apiBaseUrl}?q=${encodeURIComponent(city)}&appid=${apiKey}&units=${unit}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    if (!response.ok) {
      const message = data?.message ? toTitleCase(String(data.message)) : "Unable to fetch weather.";
      throw new Error(message);
    }

    // Update UI
    const cityName = data.name;
    const main = data.weather?.[0]?.main || "";
    const iconPath = mapConditionToIcon(main);
    const videoPath = mapConditionToVideo(main);
    const degreesUnit = unit === "metric" ? "°C" : "°F";

    document.querySelector(".city").textContent = cityName;
    document.querySelector(".temp").textContent = `${Math.round(data.main.temp)}${degreesUnit}`;
    document.querySelector(".feels").textContent = `Feels like ${Math.round(data.main.feels_like)}${degreesUnit}`;
    document.querySelector(".humidity").textContent = `${data.main.humidity}%`;
    document.querySelector(".wind").textContent = formatWind(data.wind.speed);
    document.querySelector(".pressure").textContent = `${data.main.pressure} hPa`;
    document.querySelector(".visibility").textContent = formatVisibility(data.visibility);
    document.querySelector(".updated").textContent = formatUpdatedTime(data.dt, data.timezone);

    const statusEl = document.querySelector(".status");
    statusEl.textContent = describeStatus(main);
    weatherIcon.src = iconPath;
    weatherIcon.alt = `${statusEl.textContent} icon`;

    setBackgroundVideo(videoPath);

    // Theming
    const isDay = data.dt && data.sys?.sunrise && data.sys?.sunset ? (data.dt >= data.sys.sunrise && data.dt < data.sys.sunset) : true;
    applyTheme(main, isDay);

    // Persist state
    lastCity = cityName;
    localStorage.setItem("lastCity", lastCity);
    showStatus(`Showing weather for ${cityName}`, "success");
  } catch (err) {
    console.error(err);
    showStatus(err.message || "Something went wrong.", "error");
  } finally {
    setLoading(false);
  }
}

// Event listeners
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  checkWeather(searchInput.value.trim());
});

unitButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const selected = btn.dataset.unit;
    if (selected && selected !== unit) {
      unit = selected;
      localStorage.setItem("unit", unit);
      setActiveUnitButton();
      // Re-fetch for current city
      checkWeather(document.querySelector(".city").textContent || lastCity);
    }
  });
});

async function checkWeatherByCoords(lat, lon) {
  setLoading(true);
  showStatus("");
  try {
    const url = `${apiBaseUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`;
    const response = await fetch(url);
    const data = await response.json();
    if (!response.ok) {
      const message = data?.message ? toTitleCase(String(data.message)) : "Unable to fetch weather.";
      throw new Error(message);
    }
    // Reuse city flow
    const city = data.name || "Your location";
    // Populate by faking a city request payload reuse
    const main = data.weather?.[0]?.main || "";
    const iconPath = mapConditionToIcon(main);
    const videoPath = mapConditionToVideo(main);
    const degreesUnit = unit === "metric" ? "°C" : "°F";

    document.querySelector(".city").textContent = city;
    document.querySelector(".temp").textContent = `${Math.round(data.main.temp)}${degreesUnit}`;
    document.querySelector(".feels").textContent = `Feels like ${Math.round(data.main.feels_like)}°`;
    document.querySelector(".humidity").textContent = `${data.main.humidity}%`;
    document.querySelector(".wind").textContent = formatWind(data.wind.speed);
    document.querySelector(".pressure").textContent = `${data.main.pressure} hPa`;
    const visibilityText = typeof data.visibility === "number" ? `${(data.visibility / 1000).toFixed(1)} km` : "—";
    document.querySelector(".visibility").textContent = visibilityText;
    document.querySelector(".updated").textContent = formatUpdatedTime(data.dt, data.timezone);

    const statusEl = document.querySelector(".status");
    statusEl.textContent = describeStatus(main);
    weatherIcon.src = iconPath;
    weatherIcon.alt = `${statusEl.textContent} icon`;
    setBackgroundVideo(videoPath);

    const isDay = data.dt && data.sys?.sunrise && data.sys?.sunset ? (data.dt >= data.sys.sunrise && data.dt < data.sys.sunset) : true;
    applyTheme(main, isDay);
    lastCity = city;
    localStorage.setItem("lastCity", lastCity);
    showStatus(`Showing weather for ${city}`, "success");
  } catch (err) {
    console.error(err);
    showStatus(err.message || "Something went wrong.", "error");
  } finally {
    setLoading(false);
  }
}

if (geoBtn && navigator.geolocation) {
  geoBtn.addEventListener("click", () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        checkWeatherByCoords(latitude, longitude);
      },
      (err) => {
        console.warn(err);
        setLoading(false);
        showStatus("Location access denied. Please search by city.", "warning");
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 300000 }
    );
  });
}

// Initialize
setActiveUnitButton();
searchInput.value = lastCity;
checkWeather(lastCity);
