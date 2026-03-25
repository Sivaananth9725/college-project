import React from "react";

function Navbar({ user, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    localStorage.clear();
    if (onLogout) onLogout();
    window.location.href = "/";
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.navContainer}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>🌾</span>
          <span style={styles.logoText}>CropCare AI</span>
        </div>

        <button
          style={styles.menuBtn}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          ☰
        </button>

        <div
          style={{
            ...styles.navLinks,
            ...(mobileMenuOpen && styles.navLinksMobile),
          }}
        >
          <a href="/dashboard" style={styles.link}>
            Dashboard
          </a>
          <a href="/dashboard?tab=detect" style={styles.link}>
            Detect Disease
          </a>
          <a href="/dashboard?tab=map" style={styles.link}>
            Disease Map
          </a>
          <a href="/dashboard?tab=chat" style={styles.link}>
            AI Assistant
          </a>

          {user && (
            <div style={styles.userSection}>
              <span style={styles.userName}>👤 {user.name}</span>
              <button onClick={handleLogout} style={styles.logoutBtn}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    background: "#2c3e50",
    color: "white",
    padding: "1rem 0",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  navContainer: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "24px",
    fontWeight: "bold",
  },
  logoIcon: {
    fontSize: "28px",
  },
  logoText: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  menuBtn: {
    display: "none",
    background: "none",
    border: "none",
    color: "white",
    fontSize: "24px",
    cursor: "pointer",
  },
  navLinks: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
  },
  navLinksMobile: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    marginTop: "15px",
  },
  link: {
    color: "white",
    textDecoration: "none",
    padding: "8px 12px",
    borderRadius: "5px",
    transition: "background 0.3s",
  },
  userSection: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginLeft: "20px",
  },
  userName: {
    fontSize: "14px",
  },
  logoutBtn: {
    background: "#e74c3c",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
  },
};

// Add media query for responsive
if (typeof window !== "undefined") {
  const mediaQuery = window.matchMedia("(max-width: 768px)");
  if (mediaQuery.matches) {
    styles.menuBtn.display = "block";
    styles.navLinks.display = "none";
  }
}

export default Navbar;
