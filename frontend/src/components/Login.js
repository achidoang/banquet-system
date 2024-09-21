import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, TextField, Button, Typography, Box } from "@mui/material";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/api/auth/login",
        {
          username,
          password,
        }
      );
      localStorage.setItem("token", response.data.token);
      alert("Login successful");
      navigate("/dashboard", { replace: true });
      window.location.reload();
    } catch (error) {
      console.error("Login error:", error);
      alert(error.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <Container>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Box sx={{ width: "100%", maxWidth: 400 }}>
          <Typography variant="h4" sx={{ mb: 4 }} textAlign="center">
            Sign In
          </Typography>
          <form onSubmit={handleLogin}>
            <Box sx={{ mb: 3 }}>
              <TextField
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                fullWidth
                required
              />
            </Box>
            <Box sx={{ mb: 3 }}>
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required
              />
            </Box>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Log In
            </Button>
          </form>
        </Box>
      </Box>
    </Container>
  );
}

export default Login;
