import React from "react";

function Alerts({ alerts, onDismiss }) {
  if (!alerts || alerts.length === 0) {
    return (
      <div style={styles.emptyState}>
        <p>✅ No active alerts in your area</p>
      </div>
    );
  }

  const getAlertColor = (risk) => {
    if (risk === "High Risk") return "#dc3545";
    if (risk === "Medium Risk") return "#ffc107";
    return "#28a745";
  };

  const getDistanceText = (distance) => {
    if (distance < 1) return `${(distance * 1000).toFixed(0)} meters`;
    return `${distance.toFixed(1)} km`;
  };

  return (
    <div style={styles.container}>
      <h4>🚨 Nearby Disease Alerts</h4>
      {alerts.map((alert, idx) => (
        <div
          key={idx}
          style={{
            ...styles.alertCard,
            borderLeftColor: getAlertColor(alert.severity),
          }}
        >
          <div style={styles.alertHeader}>
            <span style={styles.diseaseName}>{alert.disease}</span>
            <span
              style={{
                ...styles.riskBadge,
                background: getAlertColor(alert.severity),
              }}
            >
              {alert.severity || "Alert"}
            </span>
          </div>

          <div style={styles.alertDetails}>
            <p>📍 {getDistanceText(alert.distance_km)} away</p>
            <p>📅 {new Date(alert.timestamp).toLocaleString()}</p>
            {alert.recommendation && (
              <p style={styles.recommendation}>⚠️ {alert.recommendation}</p>
            )}
          </div>

          {onDismiss && (
            <button
              onClick={() => onDismiss(alert.id)}
              style={styles.dismissBtn}
            >
              Dismiss
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    marginTop: "20px",
  },
  emptyState: {
    textAlign: "center",
    padding: "30px",
    background: "#e8f5e9",
    borderRadius: "10px",
    color: "#2e7d32",
  },
  alertCard: {
    background: "white",
    borderLeft: "4px solid",
    padding: "15px",
    marginBottom: "10px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  alertHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  diseaseName: {
    fontWeight: "bold",
    fontSize: "16px",
  },
  riskBadge: {
    padding: "4px 12px",
    borderRadius: "20px",
    color: "white",
    fontSize: "12px",
  },
  alertDetails: {
    fontSize: "14px",
    color: "#666",
  },
  recommendation: {
    marginTop: "8px",
    color: "#f57c00",
    fontWeight: "500",
  },
  dismissBtn: {
    marginTop: "10px",
    padding: "5px 12px",
    background: "#f5f5f5",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "12px",
  },
};

export default Alerts;
