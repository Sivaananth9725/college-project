import React, { useState, useEffect } from "react";
import DiseaseDetection from "./DiseaseDetection";
import GroqChatbot from "../Chatbot/GroqChatbot";
import DiseaseMap from "../Map/DiseaseMap";
import { getNearbyAlerts } from "../../api";

function FarmerDashboard({ user }) {
  const [activeTab, setActiveTab] = useState("detect");
  const [location, setLocation] = useState(null);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setLocation(loc);
        loadAlerts(loc);
      });
    }
  }, []);

  const loadAlerts = async (loc) => {
    try {
      const response = await getNearbyAlerts(loc.lat, loc.lng);
      setAlerts(response.data.alerts);
    } catch (err) {
      console.error("Failed to load alerts");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Welcome, {user.name}</h2>
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
          style={styles.logout}
        >
          Logout
        </button>
      </div>

      <div style={styles.tabs}>
        <button
          onClick={() => setActiveTab("detect")}
          style={activeTab === "detect" ? styles.activeTab : styles.tab}
        >
          Detect Disease
        </button>
        <button
          onClick={() => setActiveTab("map")}
          style={activeTab === "map" ? styles.activeTab : styles.tab}
        >
          Disease Map
        </button>
        <button
          onClick={() => setActiveTab("chat")}
          style={activeTab === "chat" ? styles.activeTab : styles.tab}
        >
          AI Assistant
        </button>
      </div>

      <div style={styles.content}>
        {activeTab === "detect" && (
          <DiseaseDetection user={user} location={location} />
        )}
        {activeTab === "map" && (
          <DiseaseMap alerts={alerts} userLocation={location} />
        )}
        {activeTab === "chat" && <GroqChatbot />}
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: "1200px", margin: "0 auto", padding: "20px" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  logout: {
    padding: "8px 16px",
    background: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  tabs: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    borderBottom: "1px solid #ddd",
  },
  tab: {
    padding: "10px 20px",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
  },
  activeTab: {
    padding: "10px 20px",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    borderBottom: "2px solid #667eea",
    color: "#667eea",
  },
  content: { marginTop: "20px" },
};

export default FarmerDashboard;
