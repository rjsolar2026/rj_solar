import React, { useState } from "react";

const Users = () => {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Admin",
      email: "admin@rjsolar.com",
      phone: "9876543210",
      role: "Admin",
      department: "Management",
      status: "Active",
      permissions: "Full Access",
      notes: "Main CRM administrator",
    },
    {
      id: 2,
      name: "Sales Team",
      email: "sales@rjsolar.com",
      phone: "9123456780",
      role: "Sales",
      department: "Sales",
      status: "Active",
      permissions: "Leads, Customers, Quotations",
      notes: "Handles customer enquiries and follow-ups",
    },
    {
      id: 3,
      name: "Store Manager",
      email: "store@rjsolar.com",
      phone: "9988776655",
      role: "Inventory",
      department: "Stock",
      status: "Active",
      permissions: "Stock, Suppliers",
      notes: "Manages inventory and suppliers",
    },
  ]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Sales",
    department: "Sales",
    status: "Active",
    permissions: "Leads",
    notes: "",
  });

  const filteredUsers = users.filter((user) =>
    `${user.name} ${user.email} ${user.phone} ${user.role} ${user.department} ${user.status}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      phone: "",
      role: "Sales",
      department: "Sales",
      status: "Active",
      permissions: "Leads",
      notes: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      setUsers(
        users.map((user) =>
          user.id === editingId ? { ...user, ...form } : user
        )
      );
    } else {
      const newUser = {
        id: Date.now(),
        ...form,
      };

      setUsers([newUser, ...users]);
    }

    resetForm();
  };

  const handleEdit = (user) => {
    setForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      department: user.department,
      status: user.status,
      permissions: user.permissions,
      notes: user.notes,
    });

    setEditingId(user.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Do you want to delete this user?");
    if (confirmDelete) {
      setUsers(users.filter((user) => user.id !== id));
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Users</h1>
          <p style={styles.subtitle}>
            Manage RJ SOLAR CRM users, roles and access permissions
          </p>
        </div>

        <button style={styles.primaryButton} onClick={() => setShowForm(true)}>
          + Add User
        </button>
      </div>

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
          <p>Admin Users</p>
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
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
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
                <option>Installation</option>
                <option>Service</option>
                <option>Viewer</option>
              </select>

              <select
                name="department"
                value={form.department}
                onChange={handleChange}
                style={styles.input}
              >
                <option>Management</option>
                <option>Sales</option>
                <option>Stock</option>
                <option>Accounts</option>
                <option>Installation</option>
                <option>Service</option>
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

              <select
                name="permissions"
                value={form.permissions}
                onChange={handleChange}
                style={styles.input}
              >
                <option>Full Access</option>
                <option>Leads</option>
                <option>Leads, Customers, Quotations</option>
                <option>Stock, Suppliers</option>
                <option>Orders, Payments</option>
                <option>Service Only</option>
                <option>View Only</option>
              </select>
            </div>

            <textarea
              name="notes"
              placeholder="User Notes"
              value={form.notes}
              onChange={handleChange}
              style={styles.textarea}
            />

            <div style={styles.formActions}>
              <button type="submit" style={styles.saveButton}>
                {editingId ? "Update User" : "Save User"}
              </button>

              <button type="button" style={styles.cancelButton} onClick={resetForm}>
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

        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Phone</th>
                <th style={styles.th}>Role</th>
                <th style={styles.th}>Department</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Permissions</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td style={styles.td}>{user.name}</td>
                  <td style={styles.td}>{user.email}</td>
                  <td style={styles.td}>{user.phone}</td>
                  <td style={styles.td}>
                    <span style={getRoleStyle(user.role)}>{user.role}</span>
                  </td>
                  <td style={styles.td}>{user.department}</td>
                  <td style={styles.td}>
                    <span style={getStatusStyle(user.status)}>
                      {user.status}
                    </span>
                  </td>
                  <td style={styles.td}>{user.permissions}</td>
                  <td style={styles.td}>
                    <button
                      style={styles.editButton}
                      onClick={() => handleEdit(user)}
                    >
                      Edit
                    </button>

                    <button
                      style={styles.deleteButton}
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td style={styles.empty} colSpan="8">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
    Installation: { background: "#ffedd5", color: "#c2410c" },
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
  textarea: {
    width: "100%",
    minHeight: "90px",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    marginTop: "14px",
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
    minWidth: "1050px",
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