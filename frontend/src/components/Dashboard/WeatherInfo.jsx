import React, { useState, useEffect } from "react";
import { getWeather } from "../../api";

function WeatherInfo({ location }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location) {
      fetchWeather();
    }
  }, [location]);

  const fetchWeather = async () => {
    setLoading(true);
    try {
      const response = await getWeather(location.lat, location.lng);
      setWeather(response.data.weather);
    } catch (err) {
      console.error("Failed to fetch weather");
    } finally {
      setLoading(false);
    }
  };

  if (!location) {
    return (
      <div style={styles.container}>
        <p>📍 Please enable location to see weather data</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={styles.container}>
        <p>Loading weather data...</p>
      </div>
    );
  }

  if (!weather) {
    return null;
  }

  const getWeatherIcon = (description) => {
    if (description.includes("rain")) return "🌧️";
    if (description.includes("cloud")) return "☁️";
    if (description.includes("clear")) return "☀️";
    return "🌡️";
  };

  return (
    <div style={styles.container}>
      <h4>Current Weather Conditions</h4>
      <div style={styles.weatherGrid}>
        <div style={styles.weatherCard}>
          <span style={styles.icon}>{getWeatherIcon(weather.description)}</span>
          <div>
            <strong>{weather.temperature}°C</strong>
            <p style={styles.smallText}>Temperature</p>
          </div>
        </div>

        <div style={styles.weatherCard}>
          <span style={styles.icon}>💧</span>
          <div>
            <strong>{weather.humidity}%</strong>
            <p style={styles.smallText}>Humidity</p>
          </div>
        </div>

        <div style={styles.weatherCard}>
          <span style={styles.icon}>🌧️</span>
          <div>
            <strong>{weather.rainfall} mm</strong>
            <p style={styles.smallText}>Rainfall (24h)</p>
          </div>
        </div>

        <div style={styles.weatherCard}>
          <span style={styles.icon}>🧪</span>
          <div>
            <strong>{weather.ph}</strong>
            <p style={styles.smallText}>Soil pH</p>
          </div>
        </div>
      </div>

      <div style={styles.description}>
        <p>{weather.description?.toUpperCase()}</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: "#f8f9fa",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "20px",
  },
  weatherGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
    gap: "10px",
    marginTop: "10px",
  },
  weatherCard: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "white",
    padding: "10px",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  icon: {
    fontSize: "24px",
  },
  smallText: {
    fontSize: "12px",
    color: "#666",
    margin: "0",
  },
  description: {
    marginTop: "10px",
    paddingTop: "10px",
    borderTop: "1px solid #ddd",
    textAlign: "center",
    fontSize: "14px",
    color: "#666",
  },
};

export default WeatherInfo;
