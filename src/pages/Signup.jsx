import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signupUser } from "../api/authApi";

const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    adminKey: "",
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

      await signupUser({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password.trim(),
        adminKey: form.adminKey.trim(),
      });

      alert("Account created successfully!");
      navigate("/login");
    } catch (error) {
      setError(
        error.response?.data?.message || "Signup failed. Please try again."
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
        <p style={styles.subtitle}>Create Account</p>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Enter Name"
            value={form.name}
            onChange={handleChange}
            style={styles.input}
            required
          />

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
            placeholder="Create Password"
            value={form.password}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            type="password"
            name="adminKey"
            placeholder="Admin Password"
            value={form.adminKey}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>
            Login
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

export default Signup;