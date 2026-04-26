import React from "react";

const Dashboard = () => {
  const stats = [
    { title: "Total Leads", value: "128", subtitle: "New enquiries this month", color: "#2563eb" },
    { title: "Customers", value: "42", subtitle: "Converted solar clients", color: "#16a34a" },
    { title: "Total Sales", value: "₹18.5L", subtitle: "Current order value", color: "#9333ea" },
    { title: "Pending Payments", value: "₹4.2L", subtitle: "Receivables due", color: "#dc2626" },
    { title: "Quotations", value: "31", subtitle: "Quotes sent / pending", color: "#ea580c" },
    { title: "Stock Alerts", value: "6", subtitle: "Low inventory items", color: "#ca8a04" },
    { title: "Open Services", value: "9", subtitle: "Complaints & maintenance", color: "#0891b2" },
    { title: "Today Follow-ups", value: "14", subtitle: "Sales calls pending", color: "#0f766e" },
  ];

  const recentLeads = [
    { name: "Amit Sharma", phone: "9876543210", city: "Varanasi", requirement: "5kW Rooftop Solar", status: "New Lead" },
    { name: "Priya Singh", phone: "9123456780", city: "Jaunpur", requirement: "Solar Street Light", status: "Quotation Sent" },
    { name: "Rakesh Yadav", phone: "9988776655", city: "Ghazipur", requirement: "3kW Home System", status: "Interested" },
  ];

  const activities = [
    "Follow up with Amit Sharma for 5kW rooftop project",
    "Send quotation for 10 solar street lights",
    "Check low stock: 550W Solar Panels",
    "Collect pending payment from Priya Singh",
  ];

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div style={styles.brandBox}>
          <img
            src="/rj-solar-logo.png"
            alt="RJ Solar Logo"
            style={styles.logoImage}
          />

          <div>
            <h1 style={styles.title}>RJ SOLAR Dashboard</h1>
            <p style={styles.subtitle}>
              Complete overview of leads, sales, stock, service and payments
            </p>
          </div>
        </div>

        <button style={styles.primaryButton}>+ Add New Lead</button>
      </div>

      <div style={styles.statsGrid}>
        {stats.map((item, index) => (
          <div key={index} style={styles.card}>
            <div style={{ ...styles.iconBox, background: item.color }}></div>
            <p style={styles.cardTitle}>{item.title}</p>
            <h2 style={styles.cardValue}>{item.value}</h2>
            <p style={styles.cardSubtitle}>{item.subtitle}</p>
          </div>
        ))}
      </div>

      <div style={styles.twoColumn}>
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Recent Leads</h2>
            <button style={styles.smallButton}>View All</button>
          </div>

          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Phone</th>
                <th style={styles.th}>City</th>
                <th style={styles.th}>Requirement</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>

            <tbody>
              {recentLeads.map((lead, index) => (
                <tr key={index}>
                  <td style={styles.td}>{lead.name}</td>
                  <td style={styles.td}>{lead.phone}</td>
                  <td style={styles.td}>{lead.city}</td>
                  <td style={styles.td}>{lead.requirement}</td>
                  <td style={styles.td}>
                    <span style={styles.badge}>{lead.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Today’s Tasks</h2>

          <div style={styles.taskList}>
            {activities.map((task, index) => (
              <div key={index} style={styles.taskItem}>
                <span style={styles.taskDot}></span>
                <p style={styles.taskText}>{task}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={styles.quickGrid}>
        <div style={styles.quickCard}>
          <h3>Quick Actions</h3>
          <button style={styles.actionButton}>Create Quotation</button>
          <button style={styles.actionButton}>Add Stock Movement</button>
          <button style={styles.actionButton}>Create Invoice</button>
        </div>

        <div style={styles.quickCard}>
          <h3>Solar Business Pipeline</h3>
          <div style={styles.pipeline}>
            <span style={styles.pipelineItem}>Lead</span>
            <span style={styles.pipelineItem}>Site Visit</span>
            <span style={styles.pipelineItem}>Quotation</span>
            <span style={styles.pipelineItem}>Installation</span>
            <span style={styles.pipelineItem}>Payment</span>
          </div>
        </div>
      </div>
    </div>
  );
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
    background: "#fff",
    padding: "20px",
    borderRadius: "18px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
  },
  brandBox: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
  },
  logoImage: {
    width: "95px",
    height: "70px",
    objectFit: "contain",
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
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px",
    marginBottom: "25px",
  },
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "16px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
  },
  iconBox: {
    width: "38px",
    height: "6px",
    borderRadius: "20px",
    marginBottom: "15px",
  },
  cardTitle: {
    color: "#6b7280",
    margin: 0,
    fontSize: "14px",
  },
  cardValue: {
    margin: "8px 0",
    color: "#111827",
    fontSize: "28px",
  },
  cardSubtitle: {
    color: "#9ca3af",
    fontSize: "13px",
    margin: 0,
  },
  twoColumn: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "20px",
    marginBottom: "20px",
  },
  section: {
    background: "#fff",
    padding: "20px",
    borderRadius: "16px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    margin: "0 0 15px",
    color: "#111827",
  },
  smallButton: {
    background: "#111827",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: "8px",
    cursor: "pointer",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
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
  badge: {
    background: "#dcfce7",
    color: "#166534",
    padding: "5px 8px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
  },
  taskList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  taskItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "#f9fafb",
    padding: "12px",
    borderRadius: "10px",
  },
  taskDot: {
    width: "10px",
    height: "10px",
    background: "#008c45",
    borderRadius: "50%",
  },
  taskText: {
    margin: 0,
    color: "#374151",
    fontSize: "14px",
  },
  quickGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  },
  quickCard: {
    background: "#fff",
    padding: "20px",
    borderRadius: "16px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
  },
  actionButton: {
    display: "block",
    width: "100%",
    marginTop: "10px",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #e5e7eb",
    background: "#f9fafb",
    cursor: "pointer",
    textAlign: "left",
  },
  pipeline: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  },
  pipelineItem: {
    background: "#e8f8ef",
    color: "#008c45",
    padding: "8px 12px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "700",
  },
};

export default Dashboard;