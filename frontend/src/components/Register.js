import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log("Attempting registration with:", { username, password, role }); // Logging input data
    try {
      const response = await axios.post(
        "https://192.168.0.109:5000/api/auth/register",
        {
          username,
          password,
          role,
        }
      );
      console.log("Register response:", response); // Logging server response
      alert("Registration successful");
      navigate("/login");
    } catch (error) {
      console.error("Register error:", error); // Logging detailed error information
      if (error.response) {
        console.error("Error response data:", error.response.data); // More detailed response data
        alert(error.response.data.message || "Error registering");
      } else {
        alert("Error connecting to the server");
      }
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
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
            <option value="user">User</option>
          </select>
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
