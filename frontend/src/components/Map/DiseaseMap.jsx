import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function DiseaseMap({ alerts, userLocation }) {
  const [center, setCenter] = useState([20.5937, 78.9629]); // India center

  useEffect(() => {
    if (userLocation) {
      setCenter([userLocation.lat, userLocation.lng]);
    }
  }, [userLocation]);

  const getMarkerColor = (severity) => {
    // Color based on risk level
    if (severity?.includes("High") || alerts[0]?.risk_score > 0.7) return "red";
    return "orange";
  };

  return (
    <div style={styles.container}>
      <h3>Disease Spread Map</h3>
      <p style={styles.legend}>
        <span style={{ color: "red" }}>🔴 Red:</span> Active Outbreak |
        <span style={{ color: "orange" }}> 🟠 Orange:</span> Under Monitoring
      </p>

      <div style={styles.map}>
        <MapContainer
          center={center}
          zoom={8}
          style={{ height: "500px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {alerts.map((alert, idx) => (
            <CircleMarker
              key={idx}
              center={[alert.latitude, alert.longitude]}
              radius={10}
              fillColor={getMarkerColor(alert.severity)}
              color="black"
              weight={1}
              fillOpacity={0.7}
            >
              <Popup>
                <strong>{alert.disease}</strong>
                <br />
                Distance: {alert.distance_km}km away
                <br />
                Reported: {new Date(alert.timestamp).toLocaleString()}
              </Popup>
            </CircleMarker>
          ))}

          {userLocation && (
            <CircleMarker
              center={[userLocation.lat, userLocation.lng]}
              radius={8}
              fillColor="blue"
              color="white"
              weight={2}
              fillOpacity={0.8}
            >
              <Popup>Your Location</Popup>
            </CircleMarker>
          )}
        </MapContainer>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: "20px" },
  legend: { fontSize: "14px", marginBottom: "10px", textAlign: "center" },
  map: {
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
};

export default DiseaseMap;
