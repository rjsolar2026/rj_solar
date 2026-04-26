import React, { useState } from "react";

const Orders = () => {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [orders, setOrders] = useState([
    {
      id: 1,
      orderNo: "RJO-1001",
      customer: "Amit Sharma",
      phone: "9876543210",
      project: "5kW Rooftop Solar",
      amount: 145000,
      status: "Material Ready",
      orderDate: "2026-04-20",
      deliveryDate: "2026-04-28",
      notes: "Panel and inverter ready for dispatch.",
    },
    {
      id: 2,
      orderNo: "RJO-1002",
      customer: "Priya Singh",
      phone: "9123456780",
      project: "Solar Street Light",
      amount: 58000,
      status: "Pending",
      orderDate: "2026-04-21",
      deliveryDate: "2026-04-30",
      notes: "Waiting for stock confirmation.",
    },
  ]);

  const [form, setForm] = useState({
    customer: "",
    phone: "",
    project: "",
    amount: "",
    status: "Pending",
    orderDate: "",
    deliveryDate: "",
    notes: "",
  });

  const filteredOrders = orders.filter((order) =>
    `${order.orderNo} ${order.customer} ${order.phone} ${order.project} ${order.status}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const resetForm = () => {
    setForm({
      customer: "",
      phone: "",
      project: "",
      amount: "",
      status: "Pending",
      orderDate: "",
      deliveryDate: "",
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
      setOrders(
        orders.map((order) =>
          order.id === editingId
            ? { ...order, ...form, amount: Number(form.amount) }
            : order
        )
      );
    } else {
      const newOrder = {
        id: Date.now(),
        orderNo: `RJO-${Date.now().toString().slice(-5)}`,
        ...form,
        amount: Number(form.amount),
      };

      setOrders([newOrder, ...orders]);
    }

    resetForm();
  };

  const handleEdit = (order) => {
    setForm({
      customer: order.customer,
      phone: order.phone,
      project: order.project,
      amount: order.amount,
      status: order.status,
      orderDate: order.orderDate,
      deliveryDate: order.deliveryDate,
      notes: order.notes,
    });

    setEditingId(order.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Do you want to delete this order?");
    if (confirmDelete) {
      setOrders(orders.filter((order) => order.id !== id));
    }
  };

  const totalOrderValue = orders.reduce((sum, order) => sum + order.amount, 0);

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Orders</h1>
          <p style={styles.subtitle}>
            Manage RJ SOLAR confirmed orders, project dispatch and delivery
          </p>
        </div>

        <button style={styles.primaryButton} onClick={() => setShowForm(true)}>
          + Create Order
        </button>
      </div>

      <div style={styles.summaryGrid}>
        <div style={styles.summaryCard}>
          <p>Total Orders</p>
          <h2>{orders.length}</h2>
        </div>

        <div style={styles.summaryCard}>
          <p>Order Value</p>
          <h2>₹{totalOrderValue.toLocaleString()}</h2>
        </div>

        <div style={styles.summaryCard}>
          <p>Pending</p>
          <h2>{orders.filter((o) => o.status === "Pending").length}</h2>
        </div>

        <div style={styles.summaryCard}>
          <p>Completed</p>
          <h2>{orders.filter((o) => o.status === "Completed").length}</h2>
        </div>
      </div>

      {showForm && (
        <div style={styles.formCard}>
          <h2 style={styles.formTitle}>
            {editingId ? "Edit Order" : "Create New Order"}
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
                name="project"
                value={form.project}
                onChange={handleChange}
                style={styles.input}
                required
              >
                <option value="">Select Project</option>
                <option>3kW Rooftop Solar</option>
                <option>5kW Rooftop Solar</option>
                <option>10kW Commercial Solar</option>
                <option>Solar Street Light</option>
                <option>Industrial Solar Project</option>
                <option>Solar Water Pump</option>
              </select>

              <input
                type="number"
                name="amount"
                placeholder="Order Amount"
                value={form.amount}
                onChange={handleChange}
                style={styles.input}
                required
              />

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                style={styles.input}
              >
                <option>Pending</option>
                <option>Material Ready</option>
                <option>Dispatched</option>
                <option>Installation Scheduled</option>
                <option>Installed</option>
                <option>Completed</option>
                <option>Cancelled</option>
              </select>

              <input
                type="date"
                name="orderDate"
                value={form.orderDate}
                onChange={handleChange}
                style={styles.input}
              />

              <input
                type="date"
                name="deliveryDate"
                value={form.deliveryDate}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            <textarea
              name="notes"
              placeholder="Order Notes"
              value={form.notes}
              onChange={handleChange}
              style={styles.textarea}
            />

            <div style={styles.formActions}>
              <button type="submit" style={styles.saveButton}>
                {editingId ? "Update Order" : "Save Order"}
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
          <h2 style={styles.sectionTitle}>All Orders</h2>

          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Order No</th>
                <th style={styles.th}>Customer</th>
                <th style={styles.th}>Phone</th>
                <th style={styles.th}>Project</th>
                <th style={styles.th}>Amount</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Order Date</th>
                <th style={styles.th}>Delivery</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td style={styles.td}>{order.orderNo}</td>
                  <td style={styles.td}>{order.customer}</td>
                  <td style={styles.td}>{order.phone}</td>
                  <td style={styles.td}>{order.project}</td>
                  <td style={styles.td}>₹{order.amount.toLocaleString()}</td>
                  <td style={styles.td}>
                    <span style={getStatusStyle(order.status)}>
                      {order.status}
                    </span>
                  </td>
                  <td style={styles.td}>{order.orderDate}</td>
                  <td style={styles.td}>{order.deliveryDate}</td>
                  <td style={styles.td}>
                    <button style={styles.editButton} onClick={() => handleEdit(order)}>
                      Edit
                    </button>

                    <button style={styles.deleteButton} onClick={() => handleDelete(order.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {filteredOrders.length === 0 && (
                <tr>
                  <td style={styles.empty} colSpan="9">
                    No orders found
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
    Pending: { background: "#fee2e2", color: "#b91c1c" },
    "Material Ready": { background: "#fef3c7", color: "#92400e" },
    Dispatched: { background: "#dbeafe", color: "#1d4ed8" },
    "Installation Scheduled": { background: "#ede9fe", color: "#6d28d9" },
    Installed: { background: "#dcfce7", color: "#166534" },
    Completed: { background: "#bbf7d0", color: "#15803d" },
    Cancelled: { background: "#f3f4f6", color: "#374151" },
  };

  return { ...base, ...(colors[status] || colors.Pending) };
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

export default Orders;