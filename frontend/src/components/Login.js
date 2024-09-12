import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Login.js
  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Attempting login with:", { username, password });
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/api/auth/login",
        {
          username,
          password,
        }
      );
      console.log("Login response:", response); // Logging server response
      localStorage.setItem("token", response.data.token);
      console.log("Token saved to localStorage:", response.data.token); // Log token after storing
      alert("Login successful");
      navigate("/dashboard", { replace: true }); // Navigasi langsung ke dashboard setelah login sukses
    } catch (error) {
      console.error("Login error:", error);
      if (error.response) {
        alert(error.response.data.message || "Invalid credentials");
      } else {
        alert("Error connecting to the server");
      }
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
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
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
