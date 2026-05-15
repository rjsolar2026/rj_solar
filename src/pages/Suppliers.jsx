import React, { useEffect, useState } from "react";
import {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "../api/supplierApi";

const Suppliers = () => {
  const [search, setSearch] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    company: "",
    contactPerson: "",
    phone: "",
    email: "",
    category: "Other",
    gstNumber: "",
    address: "",
    status: "Active",
    notes: "",
  });

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const data = await getSuppliers();
      setSuppliers(data.suppliers || []);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load suppliers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const filteredSuppliers = suppliers.filter((supplier) =>
    `${supplier.company} ${supplier.contactPerson} ${supplier.phone} ${supplier.category} ${supplier.status}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const resetForm = () => {
    setForm({
      company: "",
      contactPerson: "",
      phone: "",
      email: "",
      category: "Other",
      gstNumber: "",
      address: "",
      status: "Active",
      notes: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updateSupplier(editingId, form);
      } else {
        await createSupplier(form);
      }

      await fetchSuppliers();
      resetForm();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to save supplier");
    }
  };

  const handleEdit = (supplier) => {
    setForm({
      company: supplier.company || "",
      contactPerson: supplier.contactPerson || "",
      phone: supplier.phone || "",
      email: supplier.email || "",
      category: supplier.category || "Other",
      gstNumber: supplier.gstNumber || "",
      address: supplier.address || "",
      status: supplier.status || "Active",
      notes: supplier.notes || "",
    });

    setEditingId(supplier._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Do you want to delete this supplier?");
    if (!confirmDelete) return;

    try {
      await deleteSupplier(id);
      await fetchSuppliers();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete supplier");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Suppliers</h1>
          <p style={styles.subtitle}>
            Manage RJ SOLAR vendors and material suppliers
          </p>
        </div>

        <button style={styles.primaryButton} onClick={() => setShowForm(true)}>
          + Add Supplier
        </button>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.summaryGrid}>
        <div style={styles.summaryCard}>
          <p>Total Suppliers</p>
          <h2>{suppliers.length}</h2>
        </div>

        <div style={styles.summaryCard}>
          <p>Active Suppliers</p>
          <h2>{suppliers.filter((s) => s.status === "Active").length}</h2>
        </div>

        <div style={styles.summaryCard}>
          <p>Panel Suppliers</p>
          <h2>{suppliers.filter((s) => s.category === "Solar Panel").length}</h2>
        </div>

        <div style={styles.summaryCard}>
          <p>Inverter Suppliers</p>
          <h2>{suppliers.filter((s) => s.category === "Inverter").length}</h2>
        </div>
      </div>

      {showForm && (
        <div style={styles.formCard}>
          <h2 style={styles.formTitle}>
            {editingId ? "Edit Supplier" : "Add New Supplier"}
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={styles.formGrid}>
              <input
                type="text"
                name="company"
                placeholder="Supplier Company Name"
                value={form.company}
                onChange={handleChange}
                style={styles.input}
                required
              />

              <input
                type="text"
                name="contactPerson"
                placeholder="Contact Person"
                value={form.contactPerson}
                onChange={handleChange}
                style={styles.input}
              />

              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
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
              />

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                style={styles.input}
              >
                <option>Solar Panel</option>
                <option>Inverter</option>
                <option>Battery</option>
                <option>Street Light</option>
                <option>Accessory</option>
                <option>Other</option>
              </select>

              <input
                type="text"
                name="gstNumber"
                placeholder="GST Number"
                value={form.gstNumber}
                onChange={handleChange}
                style={styles.input}
              />

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                style={styles.input}
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>

              <input
                type="text"
                name="address"
                placeholder="Address"
                value={form.address}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            <textarea
              name="notes"
              placeholder="Supplier Notes"
              value={form.notes}
              onChange={handleChange}
              style={styles.textarea}
            />

            <div style={styles.formActions}>
              <button type="submit" style={styles.saveButton}>
                {editingId ? "Update Supplier" : "Save Supplier"}
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
          <h2 style={styles.sectionTitle}>All Suppliers</h2>

          <input
            type="text"
            placeholder="Search suppliers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        {loading ? (
          <p>Loading suppliers...</p>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Company</th>
                  <th style={styles.th}>Contact</th>
                  <th style={styles.th}>Phone</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Category</th>
                  <th style={styles.th}>GST</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredSuppliers.map((supplier) => (
                  <tr key={supplier._id}>
                    <td style={styles.td}>{supplier.company}</td>
                    <td style={styles.td}>{supplier.contactPerson}</td>
                    <td style={styles.td}>{supplier.phone}</td>
                    <td style={styles.td}>{supplier.email}</td>
                    <td style={styles.td}>{supplier.category}</td>
                    <td style={styles.td}>{supplier.gstNumber}</td>
                    <td style={styles.td}>
                      <span style={getStatusStyle(supplier.status)}>
                        {supplier.status}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <button
                        style={styles.editButton}
                        onClick={() => handleEdit(supplier)}
                      >
                        Edit
                      </button>

                      <button
                        style={styles.deleteButton}
                        onClick={() => handleDelete(supplier._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredSuppliers.length === 0 && (
                  <tr>
                    <td style={styles.empty} colSpan="8">
                      No suppliers found
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
    Inactive: { background: "#fee2e2", color: "#b91c1c" },
  };

  return { ...base, ...(colors[status] || colors.Active) };
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
    minWidth: "1000px",
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

export default Suppliers;