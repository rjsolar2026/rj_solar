import React, { useEffect, useState } from "react";
import {
  getQuotations,
  createQuotation,
  updateQuotation,
  deleteQuotation,
} from "../api/quotationApi";

const Quotations = () => {
  const [search, setSearch] = useState("");
  const [fromDate, setFromFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [quotations, setQuotations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const fetchQuotations = async () => {
    try {
      setLoading(true);
      const data = await getQuotations();
      setQuotations(data.quotations || []);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load quotations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  const calculateFinalAmount = (amount, gst) => {
    const baseAmount = Number(amount) || 0;
    const gstPercent = Number(gst) || 0;
    return baseAmount + (baseAmount * gstPercent) / 100;
  };

  const filteredQuotations = quotations.filter((quote) => {
    const searchText =
      `${quote.quoteNo} ${quote.customer} ${quote.phone} ${quote.projectType} ${quote.status}`.toLowerCase();

    const validDate = quote.validTill ? quote.validTill.slice(0, 10) : "";

    return (
      searchText.includes(search.toLowerCase()) &&
      (statusFilter === "All" || quote.status === statusFilter) &&
      (!fromDate || validDate >= fromDate) &&
      (!toDate || validDate <= toDate)
    );
  });

  const clearFilters = () => {
    setSearch("");
    setFromFromDate("");
    setToDate("");
    setStatusFilter("All");
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
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      amount: Number(form.amount),
      gst: Number(form.gst),
    };

    try {
      if (editingId) {
        await updateQuotation(editingId, payload);
      } else {
        await createQuotation(payload);
      }

      await fetchQuotations();
      resetForm();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to save quotation");
    }
  };

  const handleEdit = (quote) => {
    setForm({
      customer: quote.customer || "",
      phone: quote.phone || "",
      projectType: quote.projectType || "",
      systemSize: quote.systemSize || "",
      amount: quote.amount || "",
      gst: quote.gst || "18",
      status: quote.status || "Draft",
      validTill: quote.validTill ? quote.validTill.slice(0, 10) : "",
      notes: quote.notes || "",
    });

    setEditingId(quote._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Do you want to delete this quotation?");
    if (!confirmDelete) return;

    try {
      await deleteQuotation(id);
      await fetchQuotations();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete quotation");
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

      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.summaryGrid}>
        <div style={styles.summaryCard}>
          <p>Total Quotations</p>
          <h2>{quotations.length}</h2>
        </div>

        <div style={styles.summaryCard}>
          <p>Filtered Quotations</p>
          <h2>{filteredQuotations.length}</h2>
        </div>

        <div style={styles.summaryCard}>
          <p>Draft</p>
          <h2>{quotations.filter((q) => q.status === "Draft").length}</h2>
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
              <input type="text" name="customer" placeholder="Customer Name" value={form.customer} onChange={handleChange} style={styles.input} required />
              <input type="text" name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} style={styles.input} required />

              <select name="projectType" value={form.projectType} onChange={handleChange} style={styles.input} required>
                <option value="">Select Project Type</option>
                <option>3kW Rooftop Solar</option>
                <option>5kW Rooftop Solar</option>
                <option>10kW Commercial Solar</option>
                <option>Solar Street Light</option>
                <option>Industrial Solar Project</option>
                <option>Solar Water Pump</option>
              </select>

              <input type="text" name="systemSize" placeholder="System Size e.g. 5kW / 10 Lights" value={form.systemSize} onChange={handleChange} style={styles.input} />

              <input type="number" name="amount" placeholder="Base Amount" value={form.amount} onChange={handleChange} style={styles.input} required />

              <input type="number" name="gst" placeholder="GST %" value={form.gst} onChange={handleChange} style={styles.input} />

              <select name="status" value={form.status} onChange={handleChange} style={styles.input}>
                <option>Draft</option>
                <option>Sent</option>
                <option>Approved</option>
                <option>Rejected</option>
                <option>Converted</option>
              </select>

              <input type="date" name="validTill" value={form.validTill} onChange={handleChange} style={styles.input} />
            </div>

            <textarea
              name="notes"
              placeholder="Quotation Notes / Product Details"
              value={form.notes}
              onChange={handleChange}
              style={styles.textarea}
            />

            <div style={styles.totalBox}>
              Final Amount: ₹{calculateFinalAmount(form.amount, form.gst).toLocaleString()}
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

        <div style={styles.filterRow}>
          <div>
            <label style={styles.filterLabel}>From Valid Till</label>
            <input type="date" value={fromDate} onChange={(e) => setFromFromDate(e.target.value)} style={styles.filterInput} />
          </div>

          <div>
            <label style={styles.filterLabel}>To Valid Till</label>
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} style={styles.filterInput} />
          </div>

          <div>
            <label style={styles.filterLabel}>Status</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={styles.filterInput}>
              <option>All</option>
              <option>Draft</option>
              <option>Sent</option>
              <option>Approved</option>
              <option>Rejected</option>
              <option>Converted</option>
            </select>
          </div>

          <button style={styles.clearButton} onClick={clearFilters}>
            Clear Filters
          </button>
        </div>

        {loading ? (
          <p>Loading quotations...</p>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Created</th>
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
                  <tr key={quote._id}>
                    <td style={styles.td}>{quote.createdAt ? quote.createdAt.slice(0, 10) : ""}</td>
                    <td style={styles.td}>{quote.quoteNo}</td>
                    <td style={styles.td}>{quote.customer}</td>
                    <td style={styles.td}>{quote.phone}</td>
                    <td style={styles.td}>{quote.projectType}</td>
                    <td style={styles.td}>{quote.systemSize}</td>
                    <td style={styles.td}>₹{Number(quote.amount || 0).toLocaleString()}</td>
                    <td style={styles.td}>{quote.gst}%</td>
                    <td style={styles.td}>
                      ₹{calculateFinalAmount(quote.amount, quote.gst).toLocaleString()}
                    </td>
                    <td style={styles.td}>
                      <span style={getStatusStyle(quote.status)}>
                        {quote.status}
                      </span>
                    </td>
                    <td style={styles.td}>
                      {quote.validTill ? quote.validTill.slice(0, 10) : ""}
                    </td>
                    <td style={styles.td}>
                      <button style={styles.editButton} onClick={() => handleEdit(quote)}>
                        Edit
                      </button>

                      <button style={styles.deleteButton} onClick={() => handleDelete(quote._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredQuotations.length === 0 && (
                  <tr>
                    <td style={styles.empty} colSpan="12">
                      No quotations found
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
    overflowX: "hidden",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
    gap: "15px",
    flexWrap: "wrap",
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
    overflow: "hidden",
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
    boxSizing: "border-box",
  },

  textarea: {
    width: "100%",
    minHeight: "90px",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    marginTop: "14px",
    boxSizing: "border-box",
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
    flexWrap: "wrap",
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
    overflow: "hidden",
    width: "100%",
    boxSizing: "border-box",
  },

  tableHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
    gap: "12px",
    flexWrap: "wrap",
  },

  sectionTitle: {
    margin: 0,
  },

  searchInput: {
    width: "100%",
    maxWidth: "300px",
    padding: "11px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    boxSizing: "border-box",
  },

  filterRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: "12px",
    marginBottom: "20px",
    width: "100%",
  },

  filterLabel: {
    display: "block",
    fontSize: "12px",
    fontWeight: "700",
    color: "#374151",
    marginBottom: "5px",
  },

  filterInput: {
    width: "100%",
    padding: "11px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    background: "#fff",
    boxSizing: "border-box",
  },

  clearButton: {
    background: "#111827",
    color: "#fff",
    border: "none",
    padding: "12px 18px",
    borderRadius: "10px",
    fontWeight: "700",
    cursor: "pointer",
    height: "42px",
    alignSelf: "end",
  },

  tableWrapper: {
    width: "100%",
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "1300px",
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