import React, { useState } from "react";

const Stock = () => {
  const [search, setSearch] = useState("");
  const [showItemForm, setShowItemForm] = useState(false);
  const [showMovementForm, setShowMovementForm] = useState(false);

  const [stock, setStock] = useState([
    {
      id: 1,
      item: "Solar Panel 550W",
      sku: "SP-550",
      category: "Panel",
      brand: "Adani",
      purchase: 9800,
      selling: 11500,
      qty: 28,
      min: 10,
    },
    {
      id: 2,
      item: "5kW On-Grid Inverter",
      sku: "INV-5K",
      category: "Inverter",
      brand: "Growatt",
      purchase: 38000,
      selling: 44500,
      qty: 6,
      min: 3,
    },
    {
      id: 3,
      item: "Solar Street Light 90W",
      sku: "SSL-90",
      category: "Street Light",
      brand: "RJ Solar",
      purchase: 4200,
      selling: 5800,
      qty: 14,
      min: 8,
    },
  ]);

  const [movements, setMovements] = useState([
    {
      id: 1,
      item: "Solar Panel 550W",
      type: "IN",
      qty: 20,
      reason: "Purchase",
      date: "2026-04-20",
    },
    {
      id: 2,
      item: "5kW On-Grid Inverter",
      type: "OUT",
      qty: 1,
      reason: "Project Use",
      date: "2026-04-22",
    },
  ]);

  const [itemForm, setItemForm] = useState({
    item: "",
    sku: "",
    category: "Panel",
    brand: "",
    purchase: "",
    selling: "",
    qty: "",
    min: "",
  });

  const [movementForm, setMovementForm] = useState({
    item: "",
    type: "IN",
    qty: "",
    reason: "Purchase",
    date: "",
  });

  const filteredStock = stock.filter((item) =>
    `${item.item} ${item.sku} ${item.category} ${item.brand}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalStockValue = stock.reduce(
    (sum, item) => sum + item.qty * item.purchase,
    0
  );

  const lowStockCount = stock.filter((item) => item.qty <= item.min).length;

  const handleItemChange = (e) => {
    setItemForm({
      ...itemForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleMovementChange = (e) => {
    setMovementForm({
      ...movementForm,
      [e.target.name]: e.target.value,
    });
  };

  const addStockItem = (e) => {
    e.preventDefault();

    const newItem = {
      id: Date.now(),
      ...itemForm,
      purchase: Number(itemForm.purchase),
      selling: Number(itemForm.selling),
      qty: Number(itemForm.qty),
      min: Number(itemForm.min),
    };

    setStock([newItem, ...stock]);

    setItemForm({
      item: "",
      sku: "",
      category: "Panel",
      brand: "",
      purchase: "",
      selling: "",
      qty: "",
      min: "",
    });

    setShowItemForm(false);
  };

  const addMovement = (e) => {
    e.preventDefault();

    const qty = Number(movementForm.qty);

    setMovements([
      {
        id: Date.now(),
        ...movementForm,
        qty,
      },
      ...movements,
    ]);

    setStock(
      stock.map((item) =>
        item.item === movementForm.item
          ? {
              ...item,
              qty:
                movementForm.type === "IN"
                  ? item.qty + qty
                  : item.qty - qty,
            }
          : item
      )
    );

    setMovementForm({
      item: "",
      type: "IN",
      qty: "",
      reason: "Purchase",
      date: "",
    });

    setShowMovementForm(false);
  };

  const deleteItem = (id) => {
    const confirmDelete = window.confirm("Delete this stock item?");
    if (confirmDelete) {
      setStock(stock.filter((item) => item.id !== id));
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Stock Management</h1>
          <p style={styles.subtitle}>
            Manage inventory and stock IN / OUT movement together
          </p>
        </div>

        <div style={styles.headerButtons}>
          <button style={styles.primaryButton} onClick={() => setShowItemForm(true)}>
            + Add Item
          </button>

          <button
            style={styles.secondaryButton}
            onClick={() => setShowMovementForm(true)}
          >
            + Stock IN / OUT
          </button>
        </div>
      </div>

      <div style={styles.summaryGrid}>
        <div style={styles.summaryCard}>
          <p>Total Items</p>
          <h2>{stock.length}</h2>
        </div>

        <div style={styles.summaryCard}>
          <p>Stock Value</p>
          <h2>₹{totalStockValue.toLocaleString()}</h2>
        </div>

        <div style={styles.summaryCard}>
          <p>Low Stock Alerts</p>
          <h2>{lowStockCount}</h2>
        </div>

        <div style={styles.summaryCard}>
          <p>Stock Movements</p>
          <h2>{movements.length}</h2>
        </div>
      </div>

      {showItemForm && (
        <div style={styles.formCard}>
          <h2>Add Stock Item</h2>

          <form onSubmit={addStockItem}>
            <div style={styles.formGrid}>
              <input name="item" placeholder="Item Name" value={itemForm.item} onChange={handleItemChange} style={styles.input} required />
              <input name="sku" placeholder="SKU" value={itemForm.sku} onChange={handleItemChange} style={styles.input} required />

              <select name="category" value={itemForm.category} onChange={handleItemChange} style={styles.input}>
                <option>Panel</option>
                <option>Inverter</option>
                <option>Battery</option>
                <option>Street Light</option>
                <option>Accessory</option>
              </select>

              <input name="brand" placeholder="Brand" value={itemForm.brand} onChange={handleItemChange} style={styles.input} />
              <input type="number" name="purchase" placeholder="Purchase Price" value={itemForm.purchase} onChange={handleItemChange} style={styles.input} required />
              <input type="number" name="selling" placeholder="Selling Price" value={itemForm.selling} onChange={handleItemChange} style={styles.input} required />
              <input type="number" name="qty" placeholder="Quantity" value={itemForm.qty} onChange={handleItemChange} style={styles.input} required />
              <input type="number" name="min" placeholder="Minimum Stock" value={itemForm.min} onChange={handleItemChange} style={styles.input} required />
            </div>

            <div style={styles.formActions}>
              <button style={styles.saveButton}>Save Item</button>
              <button type="button" style={styles.cancelButton} onClick={() => setShowItemForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {showMovementForm && (
        <div style={styles.formCard}>
          <h2>Stock IN / OUT</h2>

          <form onSubmit={addMovement}>
            <div style={styles.formGrid}>
              <select name="item" value={movementForm.item} onChange={handleMovementChange} style={styles.input} required>
                <option value="">Select Item</option>
                {stock.map((item) => (
                  <option key={item.id} value={item.item}>
                    {item.item}
                  </option>
                ))}
              </select>

              <select name="type" value={movementForm.type} onChange={handleMovementChange} style={styles.input}>
                <option>IN</option>
                <option>OUT</option>
              </select>

              <input type="number" name="qty" placeholder="Quantity" value={movementForm.qty} onChange={handleMovementChange} style={styles.input} required />

              <select name="reason" value={movementForm.reason} onChange={handleMovementChange} style={styles.input}>
                <option>Purchase</option>
                <option>Project Use</option>
                <option>Sales Order</option>
                <option>Damage</option>
                <option>Return</option>
              </select>

              <input type="date" name="date" value={movementForm.date} onChange={handleMovementChange} style={styles.input} required />
            </div>

            <div style={styles.formActions}>
              <button style={styles.saveButton}>Save Movement</button>
              <button type="button" style={styles.cancelButton} onClick={() => setShowMovementForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={styles.tableCard}>
        <div style={styles.tableHeader}>
          <h2 style={styles.sectionTitle}>Current Stock</h2>

          <input
            placeholder="Search stock..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Item</th>
                <th style={styles.th}>SKU</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Brand</th>
                <th style={styles.th}>Qty</th>
                <th style={styles.th}>Min</th>
                <th style={styles.th}>Purchase</th>
                <th style={styles.th}>Selling</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredStock.map((item) => (
                <tr key={item.id}>
                  <td style={styles.td}>{item.item}</td>
                  <td style={styles.td}>{item.sku}</td>
                  <td style={styles.td}>{item.category}</td>
                  <td style={styles.td}>{item.brand}</td>
                  <td style={styles.td}>{item.qty}</td>
                  <td style={styles.td}>{item.min}</td>
                  <td style={styles.td}>₹{item.purchase.toLocaleString()}</td>
                  <td style={styles.td}>₹{item.selling.toLocaleString()}</td>
                  <td style={styles.td}>
                    <span style={item.qty <= item.min ? styles.lowBadge : styles.okBadge}>
                      {item.qty <= item.min ? "Low Stock" : "Available"}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <button style={styles.deleteButton} onClick={() => deleteItem(item.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={styles.tableCard}>
        <h2 style={styles.sectionTitle}>Stock Movement History</h2>

        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Item</th>
                <th style={styles.th}>Type</th>
                <th style={styles.th}>Qty</th>
                <th style={styles.th}>Reason</th>
                <th style={styles.th}>Date</th>
              </tr>
            </thead>

            <tbody>
              {movements.map((move) => (
                <tr key={move.id}>
                  <td style={styles.td}>{move.item}</td>
                  <td style={styles.td}>
                    <span style={move.type === "IN" ? styles.inBadge : styles.outBadge}>
                      {move.type}
                    </span>
                  </td>
                  <td style={styles.td}>{move.qty}</td>
                  <td style={styles.td}>{move.reason}</td>
                  <td style={styles.td}>{move.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { background: "#f4f7fb", minHeight: "100vh", padding: "25px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" },
  title: { margin: 0, fontSize: "30px", color: "#111827" },
  subtitle: { marginTop: "6px", color: "#6b7280" },
  headerButtons: { display: "flex", gap: "10px" },
  primaryButton: { background: "#008c45", color: "#fff", border: "none", padding: "12px 18px", borderRadius: "10px", fontWeight: "700", cursor: "pointer" },
  secondaryButton: { background: "#111827", color: "#fff", border: "none", padding: "12px 18px", borderRadius: "10px", fontWeight: "700", cursor: "pointer" },
  summaryGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "18px", marginBottom: "25px" },
  summaryCard: { background: "#fff", padding: "20px", borderRadius: "16px", boxShadow: "0 8px 20px rgba(0,0,0,0.06)" },
  formCard: { background: "#fff", padding: "22px", borderRadius: "16px", boxShadow: "0 8px 20px rgba(0,0,0,0.06)", marginBottom: "25px" },
  formGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px" },
  input: { width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #d1d5db", fontSize: "14px" },
  formActions: { display: "flex", gap: "10px", marginTop: "14px" },
  saveButton: { background: "#008c45", color: "#fff", border: "none", padding: "12px 18px", borderRadius: "10px", fontWeight: "700", cursor: "pointer" },
  cancelButton: { background: "#111827", color: "#fff", border: "none", padding: "12px 18px", borderRadius: "10px", fontWeight: "700", cursor: "pointer" },
  tableCard: { background: "#fff", padding: "22px", borderRadius: "16px", boxShadow: "0 8px 20px rgba(0,0,0,0.06)", marginBottom: "25px" },
  tableHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" },
  sectionTitle: { margin: 0 },
  searchInput: { width: "280px", padding: "11px", borderRadius: "10px", border: "1px solid #d1d5db" },
  tableWrapper: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse", minWidth: "900px" },
  th: { textAlign: "left", padding: "12px", background: "#f3f4f6", color: "#374151", fontSize: "14px" },
  td: { padding: "12px", borderBottom: "1px solid #e5e7eb", color: "#374151", fontSize: "14px" },
  okBadge: { background: "#dcfce7", color: "#166534", padding: "6px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "700" },
  lowBadge: { background: "#fee2e2", color: "#b91c1c", padding: "6px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "700" },
  inBadge: { background: "#dcfce7", color: "#166534", padding: "6px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "700" },
  outBadge: { background: "#fee2e2", color: "#b91c1c", padding: "6px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "700" },
  deleteButton: { background: "#dc2626", color: "#fff", border: "none", padding: "7px 10px", borderRadius: "8px", cursor: "pointer" },
};

export default Stock;