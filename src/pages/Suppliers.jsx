import React, { useState } from "react";

const Suppliers = () => {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [suppliers, setSuppliers] = useState([
    {
      id: 1,
      supplierName: "GreenTech Distributors",
      contactPerson: "Ramesh Gupta",
      phone: "9870011223",
      email: "greentech@gmail.com",
      city: "Lucknow",
      product: "Solar Panels & Inverters",
      gst: "09ABCDE1234F1Z5",
      paymentStatus: "Partial",
      pendingAmount: 85000,
      lastPurchase: "2026-04-18",
      notes: "Main supplier for panels and inverters.",
    },
    {
      id: 2,
      supplierName: "PowerLine Components",
      contactPerson: "Amit Verma",
      phone: "9911223344",
      email: "powerline@gmail.com",
      city: "Kanpur",
      product: "Street Lights & Accessories",
      gst: "09XYZDE5678K1Z2",
      paymentStatus: "Paid",
      pendingAmount: 0,
      lastPurchase: "2026-04-21",
      notes: "Supplier for solar street lights.",
    },
  ]);

  const [form, setForm] = useState({
    supplierName: "",
    contactPerson: "",
    phone: "",
    email: "",
    city: "",
    product: "",
    gst: "",
    paymentStatus: "Unpaid",
    pendingAmount: "",
    lastPurchase: "",
    notes: "",
  });

  const filteredSuppliers = suppliers.filter((supplier) =>
    `${supplier.supplierName} ${supplier.contactPerson} ${supplier.phone} ${supplier.city} ${supplier.product} ${supplier.paymentStatus}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalPending = suppliers.reduce(
    (sum, supplier) => sum + Number(supplier.pendingAmount || 0),
    0
  );

  const resetForm = () => {
    setForm({
      supplierName: "",
      contactPerson: "",
      phone: "",
      email: "",
      city: "",
      product: "",
      gst: "",
      paymentStatus: "Unpaid",
      pendingAmount: "",
      lastPurchase: "",
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
      setSuppliers(
        suppliers.map((supplier) =>
          supplier.id === editingId
            ? {
                ...supplier,
                ...form,
                pendingAmount: Number(form.pendingAmount),
              }
            : supplier
        )
      );
    } else {
      const newSupplier = {
        id: Date.now(),
        ...form,
        pendingAmount: Number(form.pendingAmount),
      };

      setSuppliers([newSupplier, ...suppliers]);
    }

    resetForm();
  };

  const handleEdit = (supplier) => {
    setForm({
      supplierName: supplier.supplierName,
      contactPerson: supplier.contactPerson,
      phone: supplier.phone,
      email: supplier.email,
      city: supplier.city,
      product: supplier.product,
      gst: supplier.gst,
      paymentStatus: supplier.paymentStatus,
      pendingAmount: supplier.pendingAmount,
      lastPurchase: supplier.lastPurchase,
      notes: supplier.notes,
    });

    setEditingId(supplier.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Do you want to delete this supplier?");
    if (confirmDelete) {
      setSuppliers(suppliers.filter((supplier) => supplier.id !== id));
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Suppliers</h1>
          <p style={styles.subtitle}>
            Manage RJ SOLAR vendors, purchases and supplier payments
          </p>
        </div>

        <button style={styles.primaryButton} onClick={() => setShowForm(true)}>
          + Add Supplier
        </button>
      </div>

      <div style={styles.summaryGrid}>
        <div style={styles.summaryCard}>
          <p>Total Suppliers</p>
          <h2>{suppliers.length}</h2>
        </div>

        <div style={styles.summaryCard}>
          <p>Pending Amount</p>
          <h2>₹{totalPending.toLocaleString()}</h2>
        </div>

        <div style={styles.summaryCard}>
          <p>Paid Suppliers</p>
          <h2>{suppliers.filter((s) => s.paymentStatus === "Paid").length}</h2>
        </div>

        <div style={styles.summaryCard}>
          <p>Partial Payments</p>
          <h2>
            {suppliers.filter((s) => s.paymentStatus === "Partial").length}
          </h2>
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
                name="supplierName"
                placeholder="Supplier Company Name"
                value={form.supplierName}
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

              <input
                type="text"
                name="city"
                placeholder="City"
                value={form.city}
                onChange={handleChange}
                style={styles.input}
              />

              <select
                name="product"
                value={form.product}
                onChange={handleChange}
                style={styles.input}
                required
              >
                <option value="">Select Product Supplied</option>
                <option>Solar Panels</option>
                <option>Inverters</option>
                <option>Batteries</option>
                <option>Mounting Structure</option>
                <option>Cables & Connectors</option>
                <option>Solar Street Lights</option>
                <option>Panels & Inverters</option>
                <option>Complete Solar Material</option>
              </select>

              <input
                type="text"
                name="gst"
                placeholder="GST Number"
                value={form.gst}
                onChange={handleChange}
                style={styles.input}
              />

              <select
                name="paymentStatus"
                value={form.paymentStatus}
                onChange={handleChange}
                style={styles.input}
              >
                <option>Unpaid</option>
                <option>Partial</option>
                <option>Paid</option>
                <option>Overdue</option>
              </select>

              <input
                type="number"
                name="pendingAmount"
                placeholder="Pending Amount"
                value={form.pendingAmount}
                onChange={handleChange}
                style={styles.input}
              />

              <input
                type="date"
                name="lastPurchase"
                value={form.lastPurchase}
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

        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Supplier</th>
                <th style={styles.th}>Contact</th>
                <th style={styles.th}>Phone</th>
                <th style={styles.th}>City</th>
                <th style={styles.th}>Product</th>
                <th style={styles.th}>GST</th>
                <th style={styles.th}>Payment</th>
                <th style={styles.th}>Pending</th>
                <th style={styles.th}>Last Purchase</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredSuppliers.map((supplier) => (
                <tr key={supplier.id}>
                  <td style={styles.td}>{supplier.supplierName}</td>
                  <td style={styles.td}>{supplier.contactPerson}</td>
                  <td style={styles.td}>{supplier.phone}</td>
                  <td style={styles.td}>{supplier.city}</td>
                  <td style={styles.td}>{supplier.product}</td>
                  <td style={styles.td}>{supplier.gst}</td>
                  <td style={styles.td}>
                    <span style={getPaymentStyle(supplier.paymentStatus)}>
                      {supplier.paymentStatus}
                    </span>
                  </td>
                  <td style={styles.td}>
                    ₹{Number(supplier.pendingAmount || 0).toLocaleString()}
                  </td>
                  <td style={styles.td}>{supplier.lastPurchase}</td>
                  <td style={styles.td}>
                    <button
                      style={styles.editButton}
                      onClick={() => handleEdit(supplier)}
                    >
                      Edit
                    </button>

                    <button
                      style={styles.deleteButton}
                      onClick={() => handleDelete(supplier.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {filteredSuppliers.length === 0 && (
                <tr>
                  <td style={styles.empty} colSpan="10">
                    No suppliers found
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

const getPaymentStyle = (status) => {
  const base = {
    padding: "6px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
    display: "inline-block",
  };

  const colors = {
    Paid: { background: "#dcfce7", color: "#166534" },
    Partial: { background: "#fef3c7", color: "#92400e" },
    Unpaid: { background: "#fee2e2", color: "#b91c1c" },
    Overdue: { background: "#fecaca", color: "#991b1b" },
  };

  return { ...base, ...(colors[status] || colors.Unpaid) };
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
    minWidth: "1150px",
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