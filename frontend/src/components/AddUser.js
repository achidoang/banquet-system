// src/components/AddUser.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddUser() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin"); // Default role is admin
  const navigate = useNavigate();

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/users",
        {
          username,
          password,
          role,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("User added successfully");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error adding user:", error);
      alert(error.response?.data?.message || "Error adding user");
    }
  };

  return (
    <div>
      <h2>Add User</h2>
      <form onSubmit={handleAddUser}>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="admin">Admin</option>
            <option value="it">IT</option>
          </select>
        </div>
        <button type="submit">Add User</button>
      </form>
    </div>
  );
}

export default AddUser;
