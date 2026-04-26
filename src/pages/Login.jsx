import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/authApi";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const data = await loginUser({
        email: form.email.trim(),
        password: form.password.trim(),
      });

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      window.dispatchEvent(new Event("authChange"));

      navigate("/");
    } catch (error) {
      setError(
        error.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <img
          src="/rj-solar-logo.png"
          alt="RJ Solar Logo"
          style={styles.logoImage}
        />

        <h1 style={styles.logoText}>RJ SOLAR</h1>
        <p style={styles.subtitle}>CRM Dashboard Login</p>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={form.email}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={form.password}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={styles.demo}>Admin: admin@rjsolar.com / 123456</p>

        <p style={styles.footer}>
          Don’t have an account?{" "}
          <Link to="/signup" style={styles.link}>
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #e8f7ff, #e8ffe8)",
  },
  card: {
    width: "390px",
    padding: "35px",
    borderRadius: "18px",
    background: "#fff",
    boxShadow: "0 15px 40px rgba(0,0,0,0.15)",
    textAlign: "center",
  },
  logoImage: {
    width: "170px",
    height: "120px",
    objectFit: "contain",
    marginBottom: "10px",
  },
  logoText: {
    margin: "0 0 5px",
    color: "#008c45",
    fontSize: "30px",
  },
  subtitle: {
    marginBottom: "22px",
    color: "#666",
  },
  input: {
    width: "100%",
    padding: "13px",
    margin: "10px 0",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  button: {
    width: "100%",
    padding: "13px",
    background: "#008c45",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "12px",
    fontWeight: "700",
    fontSize: "15px",
  },
  demo: {
    marginTop: "14px",
    fontSize: "12px",
    color: "#777",
  },
  footer: {
    marginTop: "18px",
    fontSize: "14px",
  },
  link: {
    color: "#008c45",
    fontWeight: "700",
    textDecoration: "none",
  },
  error: {
    color: "red",
    marginBottom: "10px",
  },
};

export default Login;