import React, { useState } from "react";

const Quotations = () => {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [quotations, setQuotations] = useState([
    {
      id: 1,
      quoteNo: "RJQ-1001",
      customer: "Amit Sharma",
      phone: "9876543210",
      projectType: "5kW Rooftop Solar",
      systemSize: "5kW",
      amount: 145000,
      gst: 18,
      status: "Sent",
      validTill: "2026-05-15",
      notes: "Includes panel, inverter, structure and installation.",
    },
    {
      id: 2,
      quoteNo: "RJQ-1002",
      customer: "Priya Singh",
      phone: "9123456780",
      projectType: "Solar Street Light",
      systemSize: "10 Lights",
      amount: 58000,
      gst: 18,
      status: "Draft",
      validTill: "2026-05-20",
      notes: "Quotation for 10 solar street lights.",
    },
  ]);

  const [form, setForm] = useState({
    customer: "",
    phone: "",
    projectType: "",
    systemSize: "",
    amount: "",
    gst: "18",
    status: "Draft",
    validTill: "",
    notes: "",
  });

  const filteredQuotations = quotations.filter((quote) =>
    `${quote.quoteNo} ${quote.customer} ${quote.phone} ${quote.projectType} ${quote.status}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const calculateFinalAmount = (amount, gst) => {
    const baseAmount = Number(amount) || 0;
    const gstPercent = Number(gst) || 0;
    return baseAmount + (baseAmount * gstPercent) / 100;
  };

  const resetForm = () => {
    setForm({
      customer: "",
      phone: "",
      projectType: "",
      systemSize: "",
      amount: "",
      gst: "18",
      status: "Draft",
      validTill: "",
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
      setQuotations(
        quotations.map((quote) =>
          quote.id === editingId
            ? {
                ...quote,
                ...form,
                amount: Number(form.amount),
                gst: Number(form.gst),
              }
            : quote
        )
      );
    } else {
      const newQuotation = {
        id: Date.now(),
        quoteNo: `RJQ-${Date.now().toString().slice(-5)}`,
        ...form,
        amount: Number(form.amount),
        gst: Number(form.gst),
      };

      setQuotations([newQuotation, ...quotations]);
    }

    resetForm();
  };

  const handleEdit = (quote) => {
    setForm({
      customer: quote.customer,
      phone: quote.phone,
      projectType: quote.projectType,
      systemSize: quote.systemSize,
      amount: quote.amount,
      gst: quote.gst,
      status: quote.status,
      validTill: quote.validTill,
      notes: quote.notes,
    });

    setEditingId(quote.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Do you want to delete this quotation?");
    if (confirmDelete) {
      setQuotations(quotations.filter((quote) => quote.id !== id));
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Quotations</h1>
          <p style={styles.subtitle}>
            Create and manage RJ SOLAR customer quotations
          </p>
        </div>

        <button style={styles.primaryButton} onClick={() => setShowForm(true)}>
          + Create Quotation
        </button>
      </div>

      <div style={styles.summaryGrid}>
        <div style={styles.summaryCard}>
          <p>Total Quotations</p>
          <h2>{quotations.length}</h2>
        </div>

        <div style={styles.summaryCard}>
          <p>Draft</p>
          <h2>{quotations.filter((q) => q.status === "Draft").length}</h2>
        </div>

        <div style={styles.summaryCard}>
          <p>Sent</p>
          <h2>{quotations.filter((q) => q.status === "Sent").length}</h2>
        </div>

        <div style={styles.summaryCard}>
          <p>Approved</p>
          <h2>{quotations.filter((q) => q.status === "Approved").length}</h2>
        </div>
      </div>

      {showForm && (
        <div style={styles.formCard}>
          <h2 style={styles.formTitle}>
            {editingId ? "Edit Quotation" : "Create New Quotation"}
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={styles.formGrid}>
              <input
                type="text"
                name="customer"
                placeholder="Customer Name"
                value={form.customer}
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
                required
              />

              <select
                name="projectType"
                value={form.projectType}
                onChange={handleChange}
                style={styles.input}
                required
              >
                <option value="">Select Project Type</option>
                <option>3kW Rooftop Solar</option>
                <option>5kW Rooftop Solar</option>
                <option>10kW Commercial Solar</option>
                <option>Solar Street Light</option>
                <option>Industrial Solar Project</option>
                <option>Solar Water Pump</option>
              </select>

              <input
                type="text"
                name="systemSize"
                placeholder="System Size e.g. 5kW / 10 Lights"
                value={form.systemSize}
                onChange={handleChange}
                style={styles.input}
              />

              <input
                type="number"
                name="amount"
                placeholder="Base Amount"
                value={form.amount}
                onChange={handleChange}
                style={styles.input}
                required
              />

              <input
                type="number"
                name="gst"
                placeholder="GST %"
                value={form.gst}
                onChange={handleChange}
                style={styles.input}
              />

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                style={styles.input}
              >
                <option>Draft</option>
                <option>Sent</option>
                <option>Approved</option>
                <option>Rejected</option>
                <option>Converted</option>
              </select>

              <input
                type="date"
                name="validTill"
                value={form.validTill}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            <textarea
              name="notes"
              placeholder="Quotation Notes / Product Details"
              value={form.notes}
              onChange={handleChange}
              style={styles.textarea}
            />

            <div style={styles.totalBox}>
              Final Amount: ₹
              {calculateFinalAmount(form.amount, form.gst).toLocaleString()}
            </div>

            <div style={styles.formActions}>
              <button type="submit" style={styles.saveButton}>
                {editingId ? "Update Quotation" : "Save Quotation"}
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
          <h2 style={styles.sectionTitle}>All Quotations</h2>

          <input
            type="text"
            placeholder="Search quotations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Quote No</th>
                <th style={styles.th}>Customer</th>
                <th style={styles.th}>Phone</th>
                <th style={styles.th}>Project</th>
                <th style={styles.th}>Size</th>
                <th style={styles.th}>Base Amount</th>
                <th style={styles.th}>GST</th>
                <th style={styles.th}>Final Amount</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Valid Till</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredQuotations.map((quote) => (
                <tr key={quote.id}>
                  <td style={styles.td}>{quote.quoteNo}</td>
                  <td style={styles.td}>{quote.customer}</td>
                  <td style={styles.td}>{quote.phone}</td>
                  <td style={styles.td}>{quote.projectType}</td>
                  <td style={styles.td}>{quote.systemSize}</td>
                  <td style={styles.td}>₹{quote.amount.toLocaleString()}</td>
                  <td style={styles.td}>{quote.gst}%</td>
                  <td style={styles.td}>
                    ₹{calculateFinalAmount(quote.amount, quote.gst).toLocaleString()}
                  </td>
                  <td style={styles.td}>
                    <span style={getStatusStyle(quote.status)}>
                      {quote.status}
                    </span>
                  </td>
                  <td style={styles.td}>{quote.validTill}</td>
                  <td style={styles.td}>
                    <button
                      style={styles.editButton}
                      onClick={() => handleEdit(quote)}
                    >
                      Edit
                    </button>

                    <button
                      style={styles.deleteButton}
                      onClick={() => handleDelete(quote.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {filteredQuotations.length === 0 && (
                <tr>
                  <td style={styles.empty} colSpan="11">
                    No quotations found
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
    Draft: { background: "#f3f4f6", color: "#374151" },
    Sent: { background: "#dbeafe", color: "#1d4ed8" },
    Approved: { background: "#dcfce7", color: "#166534" },
    Rejected: { background: "#fee2e2", color: "#b91c1c" },
    Converted: { background: "#bbf7d0", color: "#15803d" },
  };

  return { ...base, ...(colors[status] || colors.Draft) };
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
  totalBox: {
    marginTop: "14px",
    background: "#e8f8ef",
    color: "#008c45",
    padding: "14px",
    borderRadius: "10px",
    fontWeight: "800",
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

export default Quotations;