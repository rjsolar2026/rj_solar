import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Dashboard from "../pages/Dashboard";
import Leads from "../pages/Leads";
import Customers from "../pages/Customers";
import Quotations from "../pages/Quotations";
import Orders from "../pages/Orders";
import Stock from "../pages/Stock";
import Suppliers from "../pages/Suppliers";
import Users from "../pages/Users";
import Reports from "../pages/Reports";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import DashboardLayout from "../layouts/DashboardLayout";

const AppRoutes = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn")
  );

  useEffect(() => {
    const checkLogin = () => {
      setIsLoggedIn(localStorage.getItem("isLoggedIn"));
    };

    window.addEventListener("authChange", checkLogin);
    window.addEventListener("storage", checkLogin);

    return () => {
      window.removeEventListener("authChange", checkLogin);
      window.removeEventListener("storage", checkLogin);
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN */}
        <Route
          path="/login"
          element={!isLoggedIn ? <Login /> : <Navigate to="/" />}
        />

        {/* SIGNUP */}
        <Route
          path="/signup"
          element={!isLoggedIn ? <Signup /> : <Navigate to="/" />}
        />

        {/* DASHBOARD */}
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* LEADS */}
        <Route
          path="/leads"
          element={
            isLoggedIn ? (
              <DashboardLayout>
                <Leads />
              </DashboardLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* CUSTOMERS */}
        <Route
          path="/customers"
          element={
            isLoggedIn ? (
              <DashboardLayout>
                <Customers />
              </DashboardLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* QUOTATIONS */}
        <Route
          path="/quotations"
          element={
            isLoggedIn ? (
              <DashboardLayout>
                <Quotations />
              </DashboardLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* ORDERS */}
        <Route
          path="/orders"
          element={
            isLoggedIn ? (
              <DashboardLayout>
                <Orders />
              </DashboardLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* STOCK */}
        <Route
          path="/stock"
          element={
            isLoggedIn ? (
              <DashboardLayout>
                <Stock />
              </DashboardLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* SUPPLIERS */}
        <Route
          path="/suppliers"
          element={
            isLoggedIn ? (
              <DashboardLayout>
                <Suppliers />
              </DashboardLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* USERS */}
        <Route
          path="/users"
          element={
            isLoggedIn ? (
              <DashboardLayout>
                <Users />
              </DashboardLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* REPORTS */}
        <Route
          path="/reports"
          element={
            isLoggedIn ? (
              <DashboardLayout>
                <Reports />
              </DashboardLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* UNKNOWN ROUTE */}
        <Route
          path="*"
          element={<Navigate to={isLoggedIn ? "/" : "/login"} />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;