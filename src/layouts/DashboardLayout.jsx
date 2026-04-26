import React from "react";
import Sidebar from "../components/Sidebar";

const DashboardLayout = ({ children }) => {
  return (
    <div style={{ display: "flex" }}>
      
      {/* Sidebar */}
      <Sidebar />

      {/* Page Content */}
      <div style={{ padding: "20px", width: "100%" }}>
        {children}
      </div>

    </div>
  );
};

export default DashboardLayout;