// src/components/Dashboard.js
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Dashboard() {
  const [users, setUsers] = useState([]); // Digunakan untuk manajemen user
  const [currentUser, setCurrentUser] = useState(null); // Store logged-in user info
  const navigate = useNavigate();

  // Fetch users and current user details
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const decodedToken = parseJwt(token); // Decode JWT to get current user info
        setCurrentUser(decodedToken);

        // Fetch users only if the current user is IT (role-based access)
        if (decodedToken.role === "it") {
          const response = await axios.get("http://localhost:5000/api/users", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUsers(response.data);
        }
      } catch (error) {
        console.error("Error fetching users or current user:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    navigate("/login"); // Redirect to login page
  };

  // Function to decode JWT token
  const parseJwt = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      return JSON.parse(window.atob(base64));
    } catch (error) {
      return null;
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((user) => user._id !== id)); // Remove deleted user from state
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div>
      <h2>Dashboard</h2>
      {currentUser && (
        <div>
          <p>
            Logged in as: <strong>{currentUser.username}</strong> (
            {currentUser.role})
          </p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}

      {/* Display buttons based on role */}
      <div>
        {/* IT role sees Manage User, Form, and History */}
        {currentUser?.role === "it" && (
          <>
            <button onClick={() => navigate("/manage-users")}>
              Manage Users
            </button>
            <button onClick={() => navigate("/events/create")}>
              Create Event
            </button>
            <button onClick={() => navigate("/history")}>
              View Events (History)
            </button>
          </>
        )}

        {/* Admin role sees Form and History */}
        {currentUser?.role === "admin" && (
          <>
            <button onClick={() => navigate("/events/create")}>
              Create Event
            </button>
            <button onClick={() => navigate("/history")}>
              View Events (History)
            </button>
          </>
        )}

        {/* User role sees only History */}
        {currentUser?.role === "user" && (
          <button onClick={() => navigate("/history")}>
            View Events (History)
          </button>
        )}
      </div>

      {/* IT role sees Manage User section */}
      {currentUser?.role === "it" && (
        <div>
          <h3>Manage Users</h3>
          <Link to="/add-user">Add New User</Link>
          <ul>
            {users.map((user) => (
              <li key={user._id}>
                {user.username} - {user.role}
                <Link to={`/edit-user/${user._id}`}>Edit</Link>
                <button onClick={() => handleDeleteUser(user._id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
