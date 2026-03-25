import React, { useState } from "react";

function AdminPanel() {
  const [users, setUsers] = useState([
    {
      email: "admin@cropdisease.com",
      name: "Admin",
      role: "admin",
      status: "active",
    },
  ]);

  const addAdmin = () => {
    const email = prompt("Enter admin email:");
    const name = prompt("Enter admin name:");
    if (email && name) {
      setUsers([...users, { email, name, role: "admin", status: "active" }]);
      alert(`Admin ${name} added successfully!`);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Admin Panel</h2>
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

      <div style={styles.card}>
        <h3>Team Management</h3>
        <button onClick={addAdmin} style={styles.addBtn}>
          ➕ Add Team Member
        </button>

        <table style={styles.table}>
          <thead>
            <tr>
              <th>Email</th>
              <th>Name</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr key={idx}>
                <td>{user.email}</td>
                <td>{user.name}</td>
                <td>{user.role}</td>
                <td style={{ color: "green" }}>● Active</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={styles.stats}>
        <h3>System Statistics</h3>
        <p>🌾 Total Farmers: 0</p>
        <p>🛡️ Active Alerts: 0</p>
        <p>📊 Disease Detections: 0</p>
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
    marginBottom: "30px",
  },
  logout: {
    padding: "8px 16px",
    background: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  card: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    marginBottom: "20px",
  },
  addBtn: {
    padding: "10px 20px",
    background: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginBottom: "20px",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  stats: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
};

export default AdminPanel;
