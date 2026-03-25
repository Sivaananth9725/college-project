import React, { useState } from "react";
import { chatWithBot } from "../../api";

function GroqChatbot() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [language, setLanguage] = useState("english");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await chatWithBot(query, language);
      setResponse(res.data.response);
    } catch (err) {
      setResponse("Sorry, I could not process your request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3>🤖 Agricultural Assistant</h3>
        <p>Ask about fertilizers, manure quantities, or crop care</p>
      </div>

      <div style={styles.languageSelect}>
        <label>Language: </label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          style={styles.select}
        >
          <option value="english">English</option>
          <option value="hindi">हिंदी (Hindi)</option>
          <option value="tamil">தமிழ் (Tamil)</option>
          <option value="telugu">తెలుగు (Telugu)</option>
          <option value="kannada">ಕನ್ನಡ (Kannada)</option>
        </select>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Example: How much fertilizer do I need for 1 acre of rice field?"
          style={styles.textarea}
          rows="3"
        />
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Thinking..." : "Ask Assistant"}
        </button>
      </form>

      {response && (
        <div style={styles.response}>
          <h4>Response:</h4>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: "600px", margin: "0 auto", padding: "20px" },
  header: { textAlign: "center", marginBottom: "20px" },
  languageSelect: { marginBottom: "15px", textAlign: "right" },
  select: { padding: "5px 10px", marginLeft: "10px", borderRadius: "5px" },
  form: { display: "flex", flexDirection: "column", gap: "10px" },
  textarea: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
    resize: "vertical",
  },
  button: {
    padding: "12px",
    background: "#667eea",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
  },
  response: {
    marginTop: "20px",
    padding: "15px",
    background: "#f0f0f0",
    borderRadius: "8px",
  },
};

export default GroqChatbot;
