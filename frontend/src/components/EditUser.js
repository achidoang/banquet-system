// src/components/EditUser.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function EditUser() {
  const { id } = useParams(); // Get user ID from URL parameters
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState(""); // New password field
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/api/users/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const user = response.data;
        setUsername(user.username);
        setRole(user.role);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, [id]);

  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const updatedData = { username, role };

      if (password) {
        updatedData.password = password; // Include password only if it's filled
      }

      await axios.put(`http://localhost:5000/api/users/${id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("User updated successfully");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating user:", error);
      alert(error.response?.data?.message || "Error updating user");
    }
  };

  return (
    <div>
      <h2>Edit User</h2>
      <form onSubmit={handleEditUser}>
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
            placeholder="Leave blank to keep the same"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label>Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="admin">Admin</option>
            <option value="it">IT</option>
          </select>
        </div>
        <button type="submit">Update User</button>
      </form>
    </div>
  );
}

export default EditUser;
