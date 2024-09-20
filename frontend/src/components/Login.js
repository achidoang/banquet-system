import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/Login.scss";

// import "../css/Login.scss";

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
      <form className="login" onSubmit={handleLogin}>
        <div class="segment">
          <h1>Sign up</h1>
        </div>

        <label>
          <input
            type="text"
            value={username}
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            className="border-shadow"
            required
          />
        </label>
        <label>
          <input
            type="password"
            value={password}
            placeholder="Password"
            className="border-shadow"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button className="red border-shadow" type="submit">
          <i class="icon ion-md-lock"></i> Log in
        </button>
      </form>
    </div>
  );
}

export default Login;
