// src/App.js
// import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import AddUser from "./components/AddUser";
import EditUser from "./components/EditUser";
import EventForm from "./components/EventForm";
import EventDetail from "./components/EventDetail";
import History from "./components/History";
import ManageUsers from "./components/ManageUsers";
import EventEdit from "./components/EventEdit";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import axios from "axios";

// Fungsi untuk memverifikasi token dan memastikan pengguna masih terotentikasi
const verifyToken = async (token) => {
  try {
    const response = await axios.get(
      "http://localhost:5000/api/auth/verify-token",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.status === 200; // Jika status 200, token valid
  } catch (error) {
    console.error("Token verification failed:", error);
    return false; // Jika ada error, token tidak valid
  }
};

// src/App.js
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // State to manage loading
  const token = localStorage.getItem("token");

  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        const isValid = await verifyToken(token); // Cek apakah token masih valid
        setIsAuthenticated(isValid);
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false); // Stop loading once token is verified
    };

    checkAuth();
  }, [token]);

  if (isLoading) {
    return <div>Loading...</div>; // Display loading while verifying token
  }

  return (
    <Router>
      <Routes>
        {/* Jika sudah login, arahkan ke dashboard */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
        />

        <Route
          path="/register"
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Register />
          }
        />
        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/manage-users"
          element={isAuthenticated ? <ManageUsers /> : <Navigate to="/login" />}
        />
        <Route
          path="/events/create"
          element={isAuthenticated ? <EventForm /> : <Navigate to="/login" />}
        />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route
          path="/events/edit/:id"
          element={isAuthenticated ? <EventEdit /> : <Navigate to="/login" />}
        />
        <Route
          path="/history"
          element={isAuthenticated ? <History /> : <Navigate to="/login" />}
        />
        <Route
          path="/add-user"
          element={isAuthenticated ? <AddUser /> : <Navigate to="/login" />}
        />
        <Route
          path="/edit-user/:id"
          element={isAuthenticated ? <EditUser /> : <Navigate to="/login" />}
        />
        {/* Default route to dashboard */}
        <Route path="*" element={<Navigate to="/login" />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
