import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import Logo from "../image/Logo.png";
import CustomAlert2 from "./CustomAlert2"; // Import CustomAlert

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState({
    open: false,
    severity: "",
    message: "",
  }); // State untuk alert
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          username,
          password,
        }
      );
      localStorage.setItem("token", response.data.token);
      setAlert({
        open: true,
        severity: "success",
        message: "Login successful",
      });
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
        window.location.reload();
      }, 1500); // Delay navigasi agar alert bisa muncul dulu
    } catch (error) {
      console.error("Login error:", error);
      setAlert({
        open: true,
        severity: "error",
        message: error.response?.data?.message || "Invalid credentials",
      });
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
        <Paper
          elevation={3}
          sx={{ p: 4, width: "100%", maxWidth: 400, textAlign: "center" }}
        >
          {/* Logo */}
          <Box sx={{ mb: 4 }}>
            <img src={Logo} alt="Logo" style={{ width: "150px" }} />
          </Box>

          <Typography variant="h5" sx={{ mb: 4 }} fontWeight="bold">
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
              Sign In
            </Button>
          </form>

          {/* Forgot password link */}
          {/* <Box mt={2}>
            <Link
              to="/forgot-password"
              style={{ textDecoration: "none", color: "#1976d2" }}
            >
              <Typography variant="body2">Forgot Password?</Typography>
            </Link>
          </Box> */}
        </Paper>
      </Box>

      {/* Custom Alert */}
      <CustomAlert2
        open={alert.open}
        onClose={() => setAlert({ ...alert, open: false })}
        severity={alert.severity}
        message={alert.message}
      />
    </Container>
  );
}

export default Login;
