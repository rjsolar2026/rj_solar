import React, { useEffect, useState } from "react";
import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../api/customerApi";

const Customers = () => {
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [serviceFilter, setServiceFilter] = useState("All");

  const [customers, setCustomers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    address: "",
    project: "",
    installationDate: "",
    paymentStatus: "Unpaid",
    serviceStatus: "Active",
    notes: "",
  });

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await getCustomers();
      setCustomers(data.customers || []);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter((customer) => {
    const searchText =
      `${customer.name} ${customer.phone} ${customer.email} ${customer.city} ${customer.project} ${customer.paymentStatus} ${customer.serviceStatus}`
        .toLowerCase();

    const installDate = customer.installationDate
      ? customer.installationDate.slice(0, 10)
      : "";

    const matchesSearch = searchText.includes(search.toLowerCase());
    const matchesPayment =
      paymentFilter === "All" || customer.paymentStatus === paymentFilter;
    const matchesService =
      serviceFilter === "All" || customer.serviceStatus === serviceFilter;
    const matchesFromDate = !fromDate || installDate >= fromDate;
    const matchesToDate = !toDate || installDate <= toDate;

    return (
      matchesSearch &&
      matchesPayment &&
      matchesService &&
      matchesFromDate &&
      matchesToDate
    );
  });

  const clearFilters = () => {
    setSearch("");
    setFromDate("");
    setToDate("");
    setPaymentFilter("All");
    setServiceFilter("All");
  };

  const resetForm = () => {
    setForm({
      name: "",
      phone: "",
      email: "",
      city: "",
      address: "",
      project: "",
      installationDate: "",
      paymentStatus: "Unpaid",
      serviceStatus: "Active",
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

    try {
      if (editingId) {
        await updateCustomer(editingId, form);
      } else {
        await createCustomer(form);
      }

      await fetchCustomers();
      resetForm();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to save customer");
    }
  };

  const handleEdit = (customer) => {
    setForm({
      name: customer.name || "",
      phone: customer.phone || "",
      email: customer.email || "",
      city: customer.city || "",
      address: customer.address || "",
      project: customer.project || "",
      installationDate: customer.installationDate
        ? customer.installationDate.slice(0, 10)
        : "",
      paymentStatus: customer.paymentStatus || "Unpaid",
      serviceStatus: customer.serviceStatus || "Active",
      notes: customer.notes || "",
    });

    setEditingId(customer._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Do you want to delete this customer?");
    if (!confirmDelete) return;

    try {
      await deleteCustomer(id);
      await fetchCustomers();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete customer");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Customers</h1>
          <p style={styles.subtitle}>
            Manage RJ SOLAR converted customers and installed projects
          </p>
        </div>

        <button style={styles.primaryButton} onClick={() => setShowForm(true)}>
          + Add Customer
        </button>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.summaryGrid}>
        <div style={styles.summaryCard}>
          <p>Total Customers</p>
          <h2>{customers.length}</h2>
        </div>

        <div style={styles.summaryCard}>
          <p>Filtered Customers</p>
          <h2>{filteredCustomers.length}</h2>
        </div>

        <div style={styles.summaryCard}>
          <p>Paid Customers</p>
          <h2>{customers.filter((c) => c.paymentStatus === "Paid").length}</h2>
        </div>

        <div style={styles.summaryCard}>
          <p>Active Services</p>
          <h2>{customers.filter((c) => c.serviceStatus === "Active").length}</h2>
        </div>
      </div>

      {showForm && (
        <div style={styles.formCard}>
          <h2 style={styles.formTitle}>
            {editingId ? "Edit Customer" : "Add New Customer"}
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={styles.formGrid}>
              <input type="text" name="name" placeholder="Customer Name" value={form.name} onChange={handleChange} style={styles.input} required />
              <input type="text" name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} style={styles.input} required />
              <input type="email" name="email" placeholder="Email Address" value={form.email} onChange={handleChange} style={styles.input} />
              <input type="text" name="city" placeholder="City" value={form.city} onChange={handleChange} style={styles.input} />
              <input type="text" name="address" placeholder="Full Address" value={form.address} onChange={handleChange} style={styles.input} />

              <select name="project" value={form.project} onChange={handleChange} style={styles.input} required>
                <option value="">Select Project</option>
                <option>3kW Rooftop Solar</option>
                <option>5kW Rooftop Solar</option>
                <option>10kW Commercial Solar</option>
                <option>Solar Street Light</option>
                <option>Industrial Solar Project</option>
                <option>Solar Water Pump</option>
                <option>10kW Solar Plant</option>
              </select>

              <input type="date" name="installationDate" value={form.installationDate} onChange={handleChange} style={styles.input} />

              <select name="paymentStatus" value={form.paymentStatus} onChange={handleChange} style={styles.input}>
                <option>Unpaid</option>
                <option>Partial</option>
                <option>Paid</option>
                <option>Overdue</option>
              </select>

              <select name="serviceStatus" value={form.serviceStatus} onChange={handleChange} style={styles.input}>
                <option>Active</option>
                <option>Warranty</option>
                <option>Service Due</option>
                <option>Closed</option>
              </select>
            </div>

            <textarea
              name="notes"
              placeholder="Customer Notes"
              value={form.notes}
              onChange={handleChange}
              style={styles.textarea}
            />

            <div style={styles.formActions}>
              <button type="submit" style={styles.saveButton}>
                {editingId ? "Update Customer" : "Save Customer"}
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
          <h2 style={styles.sectionTitle}>All Customers</h2>

          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.filterRow}>
          <div>
            <label style={styles.filterLabel}>From Installation</label>
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} style={styles.filterInput} />
          </div>

          <div>
            <label style={styles.filterLabel}>To Installation</label>
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} style={styles.filterInput} />
          </div>

          <div>
            <label style={styles.filterLabel}>Payment</label>
            <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)} style={styles.filterInput}>
              <option>All</option>
              <option>Paid</option>
              <option>Partial</option>
              <option>Unpaid</option>
              <option>Overdue</option>
            </select>
          </div>

          <div>
            <label style={styles.filterLabel}>Service</label>
            <select value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value)} style={styles.filterInput}>
              <option>All</option>
              <option>Active</option>
              <option>Warranty</option>
              <option>Service Due</option>
              <option>Closed</option>
            </select>
          </div>

          <button style={styles.clearButton} onClick={clearFilters}>
            Clear Filters
          </button>
        </div>

        {loading ? (
          <p>Loading customers...</p>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Created</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Phone</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>City</th>
                  <th style={styles.th}>Project</th>
                  <th style={styles.th}>Installation</th>
                  <th style={styles.th}>Payment</th>
                  <th style={styles.th}>Service</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer._id}>
                    <td style={styles.td}>{customer.createdAt ? customer.createdAt.slice(0, 10) : ""}</td>
                    <td style={styles.td}>{customer.name}</td>
                    <td style={styles.td}>{customer.phone}</td>
                    <td style={styles.td}>{customer.email}</td>
                    <td style={styles.td}>{customer.city}</td>
                    <td style={styles.td}>{customer.project}</td>
                    <td style={styles.td}>
                      {customer.installationDate
                        ? customer.installationDate.slice(0, 10)
                        : ""}
                    </td>
                    <td style={styles.td}>
                      <span style={getPaymentStyle(customer.paymentStatus)}>
                        {customer.paymentStatus}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span style={getServiceStyle(customer.serviceStatus)}>
                        {customer.serviceStatus}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <button style={styles.editButton} onClick={() => handleEdit(customer)}>
                        Edit
                      </button>

                      <button style={styles.deleteButton} onClick={() => handleDelete(customer._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredCustomers.length === 0 && (
                  <tr>
                    <td style={styles.empty} colSpan="10">
                      No customers found
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

const getServiceStyle = (status) => {
  const base = {
    padding: "6px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
    display: "inline-block",
  };

  const colors = {
    Active: { background: "#dcfce7", color: "#166534" },
    Warranty: { background: "#dbeafe", color: "#1d4ed8" },
    "Service Due": { background: "#ffedd5", color: "#c2410c" },
    Closed: { background: "#f3f4f6", color: "#374151" },
  };

  return { ...base, ...(colors[status] || colors.Active) };
};

const styles = {
  page: { background: "#f4f7fb", minHeight: "100vh", padding: "25px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" },
  title: { margin: 0, fontSize: "30px", color: "#111827" },
  subtitle: { marginTop: "6px", color: "#6b7280" },
  error: { background: "#fee2e2", color: "#b91c1c", padding: "12px", borderRadius: "10px", marginBottom: "15px" },
  primaryButton: { background: "#008c45", color: "#fff", border: "none", padding: "12px 18px", borderRadius: "10px", fontWeight: "700", cursor: "pointer" },
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
 tableCard: {
  background: "#fff",
  padding: "22px",
  borderRadius: "16px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
  overflow: "hidden",
  width: "100%",
},
  tableHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px", gap: "12px", flexWrap: "wrap" },
  sectionTitle: { margin: 0 },
  searchInput: { width: "280px", padding: "11px", borderRadius: "10px", border: "1px solid #d1d5db" },
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

export default Customers;