import React, { useEffect, useState } from "react";
import {
  getLeads,
  createLead,
  updateLead,
  deleteLead,
} from "../api/leadApi";

const Leads = () => {
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    requirement: "",
    source: "Website",
    status: "New Lead",
    followUp: "",
    assignedTo: "",
    priority: "Medium",
    notes: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const data = await getLeads();
      setLeads(data.leads || []);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const filteredLeads = leads.filter((lead) => {
    const searchText =
      `${lead.name} ${lead.phone} ${lead.city} ${lead.requirement} ${lead.status} ${lead.priority}`
        .toLowerCase();

    const leadDate = lead.createdAt ? lead.createdAt.slice(0, 10) : "";

    const matchesSearch = searchText.includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || lead.status === statusFilter;
    const matchesPriority =
      priorityFilter === "All" || lead.priority === priorityFilter;
    const matchesFromDate = !fromDate || leadDate >= fromDate;
    const matchesToDate = !toDate || leadDate <= toDate;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority &&
      matchesFromDate &&
      matchesToDate
    );
  });

  const clearFilters = () => {
    setSearch("");
    setFromDate("");
    setToDate("");
    setStatusFilter("All");
    setPriorityFilter("All");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const resetForm = () => {
    setForm({
      name: "",
      phone: "",
      city: "",
      requirement: "",
      source: "Website",
      status: "New Lead",
      followUp: "",
      assignedTo: "",
      priority: "Medium",
      notes: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updateLead(editingId, form);
      } else {
        await createLead(form);
      }

      await fetchLeads();
      resetForm();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to save lead");
    }
  };

  const handleEdit = (lead) => {
    setForm({
      name: lead.name || "",
      phone: lead.phone || "",
      city: lead.city || "",
      requirement: lead.requirement || "",
      source: lead.source || "Website",
      status: lead.status || "New Lead",
      followUp: lead.followUp ? lead.followUp.slice(0, 10) : "",
      assignedTo: lead.assignedTo || "",
      priority: lead.priority || "Medium",
      notes: lead.notes || "",
    });

    setEditingId(lead._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Do you want to delete this lead?");
    if (!confirmDelete) return;

    try {
      await deleteLead(id);
      await fetchLeads();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete lead");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Leads Management</h1>
          <p style={styles.subtitle}>
            Manage RJ SOLAR customer enquiries, follow-ups and conversions
          </p>
        </div>

        <button style={styles.primaryButton} onClick={() => setShowForm(true)}>
          + Add Lead
        </button>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.summaryGrid}>
        <div style={styles.summaryCard}>
          <p>Total Leads</p>
          <h2>{leads.length}</h2>
        </div>

        <div style={styles.summaryCard}>
          <p>Filtered Leads</p>
          <h2>{filteredLeads.length}</h2>
        </div>

        <div style={styles.summaryCard}>
          <p>New Leads</p>
          <h2>{leads.filter((lead) => lead.status === "New Lead").length}</h2>
        </div>

        <div style={styles.summaryCard}>
          <p>Converted</p>
          <h2>{leads.filter((lead) => lead.status === "Converted").length}</h2>
        </div>
      </div>

      {showForm && (
        <div style={styles.formCard}>
          <h2 style={styles.formTitle}>
            {editingId ? "Edit Lead" : "Add New Lead"}
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={styles.formGrid}>
              <input type="text" name="name" placeholder="Customer Name" value={form.name} onChange={handleChange} style={styles.input} required />
              <input type="text" name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} style={styles.input} required />
              <input type="text" name="city" placeholder="City" value={form.city} onChange={handleChange} style={styles.input} />
              <input type="text" name="requirement" placeholder="Requirement e.g. 5kW Rooftop Solar" value={form.requirement} onChange={handleChange} style={styles.input} />

              <select name="source" value={form.source} onChange={handleChange} style={styles.input}>
                <option>Website</option>
                <option>Instagram</option>
                <option>Facebook</option>
                <option>Google Ads</option>
                <option>Reference</option>
                <option>Walk-in</option>
                <option>Phone Call</option>
                <option>Other</option>
              </select>

              <select name="status" value={form.status} onChange={handleChange} style={styles.input}>
                <option>New Lead</option>
                <option>Interested</option>
                <option>Site Visit</option>
                <option>Quotation Sent</option>
                <option>Follow-up</option>
                <option>Converted</option>
                <option>Lost</option>
              </select>

              <input type="date" name="followUp" value={form.followUp} onChange={handleChange} style={styles.input} />
              <input type="text" name="assignedTo" placeholder="Assigned To" value={form.assignedTo} onChange={handleChange} style={styles.input} />

              <select name="priority" value={form.priority} onChange={handleChange} style={styles.input}>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>

            <textarea name="notes" placeholder="Notes" value={form.notes} onChange={handleChange} style={styles.textarea} />

            <div style={styles.formActions}>
              <button type="submit" style={styles.saveButton}>
                {editingId ? "Update Lead" : "Save Lead"}
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
          <h2 style={styles.sectionTitle}>All Leads</h2>

          <input
            type="text"
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.filterRow}>
          <div>
            <label style={styles.filterLabel}>From Date</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              style={styles.filterInput}
            />
          </div>

          <div>
            <label style={styles.filterLabel}>To Date</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              style={styles.filterInput}
            />
          </div>

          <div>
            <label style={styles.filterLabel}>Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={styles.filterInput}
            >
              <option>All</option>
              <option>New Lead</option>
              <option>Interested</option>
              <option>Site Visit</option>
              <option>Quotation Sent</option>
              <option>Follow-up</option>
              <option>Converted</option>
              <option>Lost</option>
            </select>
          </div>

          <div>
            <label style={styles.filterLabel}>Priority</label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              style={styles.filterInput}
            >
              <option>All</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>

          <button style={styles.clearButton} onClick={clearFilters}>
            Clear Filters
          </button>
        </div>

        {loading ? (
          <p>Loading leads...</p>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Created</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Phone</th>
                  <th style={styles.th}>City</th>
                  <th style={styles.th}>Requirement</th>
                  <th style={styles.th}>Source</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Follow-up</th>
                  <th style={styles.th}>Assigned</th>
                  <th style={styles.th}>Priority</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredLeads.map((lead) => (
                  <tr key={lead._id}>
                    <td style={styles.td}>{lead.createdAt ? lead.createdAt.slice(0, 10) : ""}</td>
                    <td style={styles.td}>{lead.name}</td>
                    <td style={styles.td}>{lead.phone}</td>
                    <td style={styles.td}>{lead.city}</td>
                    <td style={styles.td}>{lead.requirement}</td>
                    <td style={styles.td}>{lead.source}</td>
                    <td style={styles.td}>
                      <span style={getStatusStyle(lead.status)}>{lead.status}</span>
                    </td>
                    <td style={styles.td}>
                      {lead.followUp ? lead.followUp.slice(0, 10) : ""}
                    </td>
                    <td style={styles.td}>{lead.assignedTo}</td>
                    <td style={styles.td}>
                      <span style={getPriorityStyle(lead.priority)}>
                        {lead.priority}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <button style={styles.editButton} onClick={() => handleEdit(lead)}>
                        Edit
                      </button>

                      <button style={styles.deleteButton} onClick={() => handleDelete(lead._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredLeads.length === 0 && (
                  <tr>
                    <td style={styles.empty} colSpan="11">
                      No leads found
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
    "New Lead": { background: "#dbeafe", color: "#1d4ed8" },
    Interested: { background: "#dcfce7", color: "#166534" },
    "Site Visit": { background: "#fef3c7", color: "#92400e" },
    "Quotation Sent": { background: "#ede9fe", color: "#6d28d9" },
    "Follow-up": { background: "#ffedd5", color: "#c2410c" },
    Converted: { background: "#bbf7d0", color: "#15803d" },
    Lost: { background: "#fee2e2", color: "#b91c1c" },
  };

  return { ...base, ...(colors[status] || colors["New Lead"]) };
};

const getPriorityStyle = (priority) => {
  const base = {
    padding: "6px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
    display: "inline-block",
  };

  const colors = {
    High: { background: "#fee2e2", color: "#b91c1c" },
    Medium: { background: "#fef3c7", color: "#92400e" },
    Low: { background: "#dcfce7", color: "#166534" },
  };

  return { ...base, ...(colors[priority] || colors.Medium) };
};

const styles = {
  page: { background: "#f4f7fb", minHeight: "100vh", padding: "25px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" },
  title: { margin: 0, fontSize: "30px", color: "#111827" },
  subtitle: { marginTop: "6px", color: "#6b7280" },
  primaryButton: { background: "#008c45", color: "#fff", border: "none", padding: "12px 18px", borderRadius: "10px", fontWeight: "700", cursor: "pointer" },
  error: { background: "#fee2e2", color: "#b91c1c", padding: "12px", borderRadius: "10px", marginBottom: "15px" },
  summaryGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "18px", marginBottom: "25px" },
  summaryCard: { background: "#fff", padding: "20px", borderRadius: "16px", boxShadow: "0 8px 20px rgba(0,0,0,0.06)" },
  formCard: { background: "#fff", padding: "22px", borderRadius: "16px", boxShadow: "0 8px 20px rgba(0,0,0,0.06)", marginBottom: "25px" },
  formTitle: { marginTop: 0 },
  formGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px" },
  input: { width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #d1d5db", fontSize: "14px" },
  textarea: { width: "100%", minHeight: "90px", padding: "12px", borderRadius: "10px", border: "1px solid #d1d5db", fontSize: "14px", marginTop: "14px" },
  formActions: { display: "flex", gap: "10px", marginTop: "14px" },
  saveButton: { background: "#008c45", color: "#fff", border: "none", padding: "12px 18px", borderRadius: "10px", fontWeight: "700", cursor: "pointer" },
  cancelButton: { background: "#111827", color: "#fff", border: "none", padding: "12px 18px", borderRadius: "10px", fontWeight: "700", cursor: "pointer" },
  tableCard: { background: "#fff", padding: "22px", borderRadius: "16px", boxShadow: "0 8px 20px rgba(0,0,0,0.06)" },
  tableHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px", gap: "12px", flexWrap: "wrap" },
  sectionTitle: { margin: 0 },
  searchInput: { width: "260px", padding: "11px", borderRadius: "10px", border: "1px solid #d1d5db" },
  filterRow: { display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "15px", alignItems: "end" },
  filterLabel: { display: "block", fontSize: "12px", fontWeight: "700", color: "#374151", marginBottom: "5px" },
  filterInput: { width: "170px", padding: "11px", borderRadius: "10px", border: "1px solid #d1d5db", background: "#fff" },
  clearButton: { background: "#111827", color: "#fff", border: "none", padding: "12px 18px", borderRadius: "10px", fontWeight: "700", cursor: "pointer" },
  tableWrapper: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse", minWidth: "1200px" },
  th: { textAlign: "left", padding: "12px", background: "#f3f4f6", color: "#374151", fontSize: "14px" },
  td: { padding: "12px", borderBottom: "1px solid #e5e7eb", color: "#374151", fontSize: "14px" },
  editButton: { background: "#2563eb", color: "#fff", border: "none", padding: "7px 10px", borderRadius: "8px", cursor: "pointer", marginRight: "6px" },
  deleteButton: { background: "#dc2626", color: "#fff", border: "none", padding: "7px 10px", borderRadius: "8px", cursor: "pointer" },
  empty: { textAlign: "center", padding: "25px", color: "#6b7280" },
};

export default Leads;