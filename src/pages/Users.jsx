import React, { useEffect, useState } from "react";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../api/userApi";

const Users = () => {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Sales",
    status: "Active",
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const data = await getUsers();

      setUsers(data.users || []);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    `${user.name} ${user.email} ${user.role} ${user.status}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      password: "",
      role: "Sales",
      status: "Active",
    });

    setEditingId(null);
    setShowForm(false);
  };

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
      if (editingId) {
        await updateUser(editingId, form);
      } else {
        await createUser(form);
      }

      await fetchUsers();
      resetForm();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to save user");
    }
  };

  const handleEdit = (user) => {
    setForm({
      name: user.name || "",
      email: user.email || "",
      password: "",
      role: user.role || "Sales",
      status: user.status || "Active",
    });

    setEditingId(user._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Do you want to delete this user?");

    if (!confirmDelete) return;

    try {
      await deleteUser(id);
      await fetchUsers();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete user");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Users</h1>

          <p style={styles.subtitle}>
            Manage RJ SOLAR CRM users and roles
          </p>
        </div>

        <button style={styles.primaryButton} onClick={() => setShowForm(true)}>
          + Add User
        </button>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.summaryGrid}>
        <div style={styles.summaryCard}>
          <p>Total Users</p>
          <h2>{users.length}</h2>
        </div>

        <div style={styles.summaryCard}>
          <p>Active Users</p>
          <h2>{users.filter((u) => u.status === "Active").length}</h2>
        </div>

        <div style={styles.summaryCard}>
          <p>Admins</p>
          <h2>{users.filter((u) => u.role === "Admin").length}</h2>
        </div>

        <div style={styles.summaryCard}>
          <p>Sales Users</p>
          <h2>{users.filter((u) => u.role === "Sales").length}</h2>
        </div>
      </div>

      {showForm && (
        <div style={styles.formCard}>
          <h2 style={styles.formTitle}>
            {editingId ? "Edit User" : "Add New User"}
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={styles.formGrid}>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                style={styles.input}
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                style={styles.input}
                required
              />

              <input
                type="password"
                name="password"
                placeholder={
                  editingId
                    ? "Leave blank to keep current password"
                    : "Password"
                }
                value={form.password}
                onChange={handleChange}
                style={styles.input}
              />

              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                style={styles.input}
              >
                <option>Admin</option>
                <option>Sales</option>
                <option>Inventory</option>
                <option>Accounts</option>
                <option>Service</option>
                <option>Viewer</option>
              </select>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                style={styles.input}
              >
                <option>Active</option>
                <option>Inactive</option>
                <option>Blocked</option>
              </select>
            </div>

            <div style={styles.formActions}>
              <button type="submit" style={styles.saveButton}>
                {editingId ? "Update User" : "Save User"}
              </button>

              <button
                type="button"
                style={styles.cancelButton}
                onClick={resetForm}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={styles.tableCard}>
        <div style={styles.tableHeader}>
          <h2 style={styles.sectionTitle}>All Users</h2>

          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        {loading ? (
          <p>Loading users...</p>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Role</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Created</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td style={styles.td}>{user.name}</td>
                    <td style={styles.td}>{user.email}</td>

                    <td style={styles.td}>
                      <span style={getRoleStyle(user.role)}>
                        {user.role}
                      </span>
                    </td>

                    <td style={styles.td}>
                      <span style={getStatusStyle(user.status)}>
                        {user.status}
                      </span>
                    </td>

                    <td style={styles.td}>
                      {user.createdAt?.slice(0, 10)}
                    </td>

                    <td style={styles.td}>
                      <button
                        style={styles.editButton}
                        onClick={() => handleEdit(user)}
                      >
                        Edit
                      </button>

                      <button
                        style={styles.deleteButton}
                        onClick={() => handleDelete(user._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredUsers.length === 0 && (
                  <tr>
                    <td style={styles.empty} colSpan="6">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const getStatusStyle = (status) => {
  const base = {
    padding: "6px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
    display: "inline-block",
  };

  const colors = {
    Active: { background: "#dcfce7", color: "#166534" },
    Inactive: { background: "#f3f4f6", color: "#374151" },
    Blocked: { background: "#fee2e2", color: "#b91c1c" },
  };

  return { ...base, ...(colors[status] || colors.Active) };
};

const getRoleStyle = (role) => {
  const base = {
    padding: "6px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
    display: "inline-block",
  };

  const colors = {
    Admin: { background: "#ede9fe", color: "#6d28d9" },
    Sales: { background: "#dbeafe", color: "#1d4ed8" },
    Inventory: { background: "#fef3c7", color: "#92400e" },
    Accounts: { background: "#dcfce7", color: "#166534" },
    Service: { background: "#cffafe", color: "#0e7490" },
    Viewer: { background: "#f3f4f6", color: "#374151" },
  };

  return { ...base, ...(colors[role] || colors.Viewer) };
};

const styles = {
  page: {
    background: "#f4f7fb",
    minHeight: "100vh",
    padding: "25px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
  },
  title: {
    margin: 0,
    fontSize: "30px",
    color: "#111827",
  },
  subtitle: {
    marginTop: "6px",
    color: "#6b7280",
  },
  error: {
    background: "#fee2e2",
    color: "#b91c1c",
    padding: "12px",
    borderRadius: "10px",
    marginBottom: "15px",
  },
  primaryButton: {
    background: "#008c45",
    color: "#fff",
    border: "none",
    padding: "12px 18px",
    borderRadius: "10px",
    fontWeight: "700",
    cursor: "pointer",
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "18px",
    marginBottom: "25px",
  },
  summaryCard: {
    background: "#fff",
    padding: "20px",
    borderRadius: "16px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
  },
  formCard: {
    background: "#fff",
    padding: "22px",
    borderRadius: "16px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
    marginBottom: "25px",
  },
  formTitle: {
    marginTop: 0,
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "14px",
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
  },
  formActions: {
    display: "flex",
    gap: "10px",
    marginTop: "14px",
  },
  saveButton: {
    background: "#008c45",
    color: "#fff",
    border: "none",
    padding: "12px 18px",
    borderRadius: "10px",
    fontWeight: "700",
    cursor: "pointer",
  },
  cancelButton: {
    background: "#111827",
    color: "#fff",
    border: "none",
    padding: "12px 18px",
    borderRadius: "10px",
    fontWeight: "700",
    cursor: "pointer",
  },
  tableCard: {
    background: "#fff",
    padding: "22px",
    borderRadius: "16px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
  },
  tableHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
  },
  sectionTitle: {
    margin: 0,
  },
  searchInput: {
    width: "280px",
    padding: "11px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "900px",
  },
  th: {
    textAlign: "left",
    padding: "12px",
    background: "#f3f4f6",
    color: "#374151",
    fontSize: "14px",
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #e5e7eb",
    color: "#374151",
    fontSize: "14px",
  },
  editButton: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "7px 10px",
    borderRadius: "8px",
    cursor: "pointer",
    marginRight: "6px",
  },
  deleteButton: {
    background: "#dc2626",
    color: "#fff",
    border: "none",
    padding: "7px 10px",
    borderRadius: "8px",
    cursor: "pointer",
  },
  empty: {
    textAlign: "center",
    padding: "25px",
    color: "#6b7280",
  },
};

export default Users;