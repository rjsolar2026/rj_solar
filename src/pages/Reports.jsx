import React, { useState } from "react";

const Reports = () => {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [reports, setReports] = useState([
    {
      id: 1,
      title: "April Sales Summary",
      type: "Text Report",
      category: "Sales",
      description: "Monthly sales report for RJ SOLAR leads and orders.",
      fileName: "No file",
      fileType: "Text",
      date: "2026-04-26",
    },
  ]);

  const [form, setForm] = useState({
    title: "",
    category: "Sales",
    description: "",
    file: null,
  });

  const filteredReports = reports.filter((report) =>
    `${report.title} ${report.category} ${report.description} ${report.fileName}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setForm({
      ...form,
      file: e.target.files[0],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const file = form.file;

    const newReport = {
      id: Date.now(),
      title: form.title,
      category: form.category,
      description: form.description,
      type: file ? "File Report" : "Text Report",
      fileName: file ? file.name : "No file",
      fileType: file ? file.type || "Document" : "Text",
      fileUrl: file ? URL.createObjectURL(file) : "",
      date: new Date().toISOString().slice(0, 10),
    };

    setReports([newReport, ...reports]);

    setForm({
      title: "",
      category: "Sales",
      description: "",
      file: null,
    });

    setShowForm(false);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Do you want to delete this report?");
    if (confirmDelete) {
      setReports(reports.filter((report) => report.id !== id));
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Reports & Documents</h1>
          <p style={styles.subtitle}>
            Upload PDFs, images, documents and save important text reports
          </p>
        </div>

        <button style={styles.primaryButton} onClick={() => setShowForm(true)}>
          + Add Report
        </button>
      </div>

      <div style={styles.summaryGrid}>
        <div style={styles.summaryCard}>
          <p>Total Reports</p>
          <h2>{reports.length}</h2>
        </div>

        <div style={styles.summaryCard}>
          <p>File Reports</p>
          <h2>{reports.filter((r) => r.type === "File Report").length}</h2>
        </div>

        <div style={styles.summaryCard}>
          <p>Text Reports</p>
          <h2>{reports.filter((r) => r.type === "Text Report").length}</h2>
        </div>

        <div style={styles.summaryCard}>
          <p>Categories</p>
          <h2>{new Set(reports.map((r) => r.category)).size}</h2>
        </div>
      </div>

      {showForm && (
        <div style={styles.formCard}>
          <h2 style={styles.formTitle}>Add New Report</h2>

          <form onSubmit={handleSubmit}>
            <div style={styles.formGrid}>
              <input
                type="text"
                name="title"
                placeholder="Report Title"
                value={form.title}
                onChange={handleChange}
                style={styles.input}
                required
              />

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                style={styles.input}
              >
                <option>Sales</option>
                <option>Leads</option>
                <option>Customers</option>
                <option>Stock</option>
                <option>Payments</option>
                <option>Installation</option>
                <option>Service</option>
                <option>Legal Documents</option>
                <option>Company Documents</option>
                <option>Other</option>
              </select>

              <input
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.webp"
                onChange={handleFileChange}
                style={styles.input}
              />
            </div>

            <textarea
              name="description"
              placeholder="Add important text, notes, report details, document description..."
              value={form.description}
              onChange={handleChange}
              style={styles.textarea}
              required
            />

            {form.file && (
              <div style={styles.filePreview}>
                Selected File: <strong>{form.file.name}</strong>
              </div>
            )}

            <div style={styles.formActions}>
              <button type="submit" style={styles.saveButton}>
                Save Report
              </button>

              <button
                type="button"
                style={styles.cancelButton}
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={styles.tableCard}>
        <div style={styles.tableHeader}>
          <h2 style={styles.sectionTitle}>All Reports</h2>

          <input
            type="text"
            placeholder="Search reports..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.reportGrid}>
          {filteredReports.map((report) => (
            <div key={report.id} style={styles.reportCard}>
              <div style={styles.reportTop}>
                <span style={getCategoryStyle(report.category)}>
                  {report.category}
                </span>

                <span style={styles.dateBadge}>{report.date}</span>
              </div>

              <h3 style={styles.reportTitle}>{report.title}</h3>

              <p style={styles.reportText}>{report.description}</p>

              <div style={styles.fileBox}>
                <p>
                  <strong>Type:</strong> {report.type}
                </p>
                <p>
                  <strong>File:</strong> {report.fileName}
                </p>
                <p>
                  <strong>File Type:</strong> {report.fileType}
                </p>
              </div>

              <div style={styles.cardActions}>
                {report.fileUrl && (
                  <a
                    href={report.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={styles.viewButton}
                  >
                    View File
                  </a>
                )}

                <button
                  style={styles.deleteButton}
                  onClick={() => handleDelete(report.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {filteredReports.length === 0 && (
            <div style={styles.empty}>No reports found</div>
          )}
        </div>
      </div>
    </div>
  );
};

const getCategoryStyle = (category) => {
  const base = {
    padding: "6px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
    display: "inline-block",
  };

  const colors = {
    Sales: { background: "#dbeafe", color: "#1d4ed8" },
    Leads: { background: "#dcfce7", color: "#166534" },
    Customers: { background: "#ede9fe", color: "#6d28d9" },
    Stock: { background: "#fef3c7", color: "#92400e" },
    Payments: { background: "#fee2e2", color: "#b91c1c" },
    Installation: { background: "#ffedd5", color: "#c2410c" },
    Service: { background: "#cffafe", color: "#0e7490" },
    "Legal Documents": { background: "#f3f4f6", color: "#374151" },
    "Company Documents": { background: "#e8f8ef", color: "#008c45" },
    Other: { background: "#f3f4f6", color: "#374151" },
  };

  return { ...base, ...(colors[category] || colors.Other) };
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
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "14px",
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    background: "#fff",
  },
  textarea: {
    width: "100%",
    minHeight: "120px",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    marginTop: "14px",
  },
  filePreview: {
    marginTop: "14px",
    background: "#e8f8ef",
    color: "#008c45",
    padding: "12px",
    borderRadius: "10px",
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
  reportGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "18px",
  },
  reportCard: {
    background: "#f9fafb",
    padding: "18px",
    borderRadius: "16px",
    border: "1px solid #e5e7eb",
  },
  reportTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
    marginBottom: "12px",
  },
  dateBadge: {
    fontSize: "12px",
    color: "#6b7280",
  },
  reportTitle: {
    margin: "0 0 10px",
    color: "#111827",
  },
  reportText: {
    color: "#4b5563",
    fontSize: "14px",
    lineHeight: "1.5",
  },
  fileBox: {
    background: "#fff",
    padding: "12px",
    borderRadius: "12px",
    fontSize: "13px",
    color: "#374151",
    marginTop: "12px",
  },
  cardActions: {
    display: "flex",
    gap: "10px",
    marginTop: "14px",
  },
  viewButton: {
    background: "#2563eb",
    color: "#fff",
    textDecoration: "none",
    padding: "9px 12px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "700",
  },
  deleteButton: {
    background: "#dc2626",
    color: "#fff",
    border: "none",
    padding: "9px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "700",
  },
  empty: {
    padding: "25px",
    color: "#6b7280",
  },
};

export default Reports;