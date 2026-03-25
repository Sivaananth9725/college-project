import React, { useState, useRef } from "react";
import { predictDisease, reportInfection } from "../../api";

function DiseaseDetection({ user, location }) {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef();

  const handleCapture = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handlePredict = async () => {
    if (!image) return;

    setLoading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result;
        const response = await predictDisease(base64, location);
        setResult(response.data);

        // Auto-report if high risk
        if (response.data.risk_score > 0.7 && location) {
          await reportInfection({
            disease: response.data.disease,
            latitude: location.lat,
            longitude: location.lng,
            email: user.email,
          });
        }
      };
      reader.readAsDataURL(image);
    } catch (err) {
      alert("Prediction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (severity) => {
    if (severity.includes("High")) return "#dc3545";
    if (severity.includes("Medium")) return "#ffc107";
    return "#28a745";
  };

  return (
    <div style={styles.container}>
      <div style={styles.uploadArea}>
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          capture="environment"
          onChange={handleImageChange}
          style={{ display: "none" }}
        />

        {preview ? (
          <div>
            <img src={preview} alt="Preview" style={styles.preview} />
            <button
              onClick={() => {
                setPreview(null);
                setImage(null);
                setResult(null);
              }}
              style={styles.clearBtn}
            >
              Clear
            </button>
          </div>
        ) : (
          <button onClick={handleCapture} style={styles.captureBtn}>
            📸 Take Photo or Upload
          </button>
        )}

        {preview && !result && (
          <button
            onClick={handlePredict}
            disabled={loading}
            style={styles.predictBtn}
          >
            {loading ? "Analyzing..." : "🔍 Detect Disease"}
          </button>
        )}
      </div>

      {result && (
        <div style={styles.resultCard}>
          <h3>Detection Result</h3>
          <div
            style={{
              backgroundColor: getRiskColor(result.severity),
              ...styles.riskBadge,
            }}
          >
            {result.severity}
          </div>
          <p>
            <strong>Disease:</strong> {result.disease}
          </p>
          <p>
            <strong>Confidence:</strong> {(result.confidence * 100).toFixed(1)}%
          </p>
          <p>
            <strong>Recommendation:</strong> {result.recommendation}
          </p>

          <div style={styles.weatherInfo}>
            <h4>Weather Conditions</h4>
            <p>🌡️ Temperature: {result.weather?.temperature}°C</p>
            <p>💧 Humidity: {result.weather?.humidity}%</p>
            <p>🌧️ Rainfall: {result.weather?.rainfall}mm</p>
            <p>🧪 Soil pH: {result.weather?.ph}</p>
          </div>

          <div style={styles.treatment}>
            <h4>💊 Treatment</h4>
            <p>
              <strong>Medicine:</strong> {result.treatment?.medicine}
            </p>
            <p>
              <strong>Organic:</strong> {result.treatment?.organic}
            </p>
          </div>

          <div style={styles.prevention}>
            <h4>🛡️ Prevention Tips</h4>
            <p>{result.prevention}</p>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: "600px", margin: "0 auto" },
  uploadArea: {
    textAlign: "center",
    padding: "20px",
    border: "2px dashed #ddd",
    borderRadius: "10px",
  },
  captureBtn: {
    padding: "15px 30px",
    fontSize: "18px",
    background: "#667eea",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
  },
  preview: {
    maxWidth: "100%",
    maxHeight: "400px",
    borderRadius: "10px",
    marginBottom: "10px",
  },
  clearBtn: {
    padding: "8px 16px",
    background: "#6c757d",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginLeft: "10px",
  },
  predictBtn: {
    padding: "12px 24px",
    background: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    marginTop: "20px",
    fontSize: "16px",
  },
  resultCard: {
    marginTop: "20px",
    padding: "20px",
    background: "#f8f9fa",
    borderRadius: "10px",
  },
  riskBadge: {
    padding: "8px 16px",
    borderRadius: "20px",
    color: "white",
    display: "inline-block",
    marginBottom: "15px",
  },
  weatherInfo: {
    marginTop: "15px",
    padding: "15px",
    background: "#e9ecef",
    borderRadius: "8px",
  },
  treatment: {
    marginTop: "15px",
    padding: "15px",
    background: "#d4edda",
    borderRadius: "8px",
  },
  prevention: {
    marginTop: "15px",
    padding: "15px",
    background: "#fff3cd",
    borderRadius: "8px",
  },
};

export default DiseaseDetection;
