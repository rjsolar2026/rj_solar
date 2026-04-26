import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm("Do you want to logout?");

    if (confirmLogout) {
      localStorage.removeItem("isLoggedIn");
      window.dispatchEvent(new Event("authChange"));
      navigate("/login");
    }
  };

  const linkStyle = ({ isActive }) => ({
    display: "block",
    padding: "12px 14px",
    borderRadius: "10px",
    textDecoration: "none",
    color: isActive ? "#111827" : "#d1d5db",
    background: isActive ? "#f59e0b" : "transparent",
    fontWeight: isActive ? "700" : "500",
    marginBottom: "6px",
  });

  return (
    <div style={styles.sidebar}>
      <div>
        <div style={styles.logoBox}>
          <img
            src="/rj-solar-logo.png"
            alt="RJ Solar Logo"
            style={styles.logoImage}
          />

          <div>
            <h2 style={styles.logoText}>RJ SOLAR</h2>
            <p style={styles.logoSub}>CRM Panel</p>
          </div>
        </div>

        <nav>
          <p style={styles.menuTitle}>MAIN</p>

          <NavLink to="/" style={linkStyle}>
            📊 Dashboard
          </NavLink>

          <NavLink to="/leads" style={linkStyle}>
            👥 Leads
          </NavLink>

          <NavLink to="/customers" style={linkStyle}>
            🧑‍💼 Customers
          </NavLink>

          <NavLink to="/quotations" style={linkStyle}>
            📄 Quotations
          </NavLink>

          <NavLink to="/orders" style={linkStyle}>
            📦 Orders
          </NavLink>

          <NavLink to="/payments" style={linkStyle}>
            💰 Payments
          </NavLink>

          <p style={styles.menuTitle}>OPERATIONS</p>

          <NavLink to="/stock" style={linkStyle}>
            🏷 Stock
          </NavLink>

          <NavLink to="/suppliers" style={linkStyle}>
            🚚 Suppliers
          </NavLink>

          <NavLink to="/service" style={linkStyle}>
            🛠 Service
          </NavLink>

          <p style={styles.menuTitle}>ADMIN</p>

          <NavLink to="/users" style={linkStyle}>
            🔐 Users
          </NavLink>

          <NavLink to="/reports" style={linkStyle}>
            📈 Reports
          </NavLink>
        </nav>
      </div>

      <div style={styles.bottomBox}>
        <div style={styles.userBox}>
          <strong>Admin</strong>
          <span>admin@rjsolar.com</span>
        </div>

        <button onClick={handleLogout} style={styles.logoutButton}>
          Logout
        </button>
      </div>
    </div>
  );
};

const styles = {
  sidebar: {
    width: "250px",
    background: "#111827",
    color: "#fff",
    height: "100vh",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    position: "sticky",
    top: 0,
    overflowY: "auto",
  },
  logoBox: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "28px",
  },
  logoImage: {
    width: "48px",
    height: "48px",
    objectFit: "contain",
    background: "#fff",
    borderRadius: "12px",
    padding: "4px",
  },
  logoText: {
    margin: 0,
    fontSize: "20px",
  },
  logoSub: {
    margin: 0,
    fontSize: "12px",
    color: "#9ca3af",
  },
  menuTitle: {
    fontSize: "11px",
    color: "#9ca3af",
    marginTop: "18px",
    marginBottom: "8px",
    letterSpacing: "1px",
  },
  bottomBox: {
    marginTop: "20px",
  },
  userBox: {
    background: "#1f2937",
    padding: "12px",
    borderRadius: "12px",
    marginBottom: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    fontSize: "13px",
  },
  logoutButton: {
    width: "100%",
    padding: "12px",
    background: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700",
  },
};

export default Sidebar;