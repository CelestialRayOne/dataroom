import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AuthGuard from "./components/AuthGuard";
import Layout from "./components/layout/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/"
              element={
                <AuthGuard>
                  <Dashboard />
                </AuthGuard>
              }
            />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
