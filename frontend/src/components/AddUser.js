import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  MenuItem,
} from "@mui/material";

function AddUser() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://192.168.0.109:5000/api/users",
        { username, password, role, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("User added successfully");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error adding user:", error);
      alert(error.response?.data?.message || "Error adding user");
    }
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Add User
      </Typography>
      <form onSubmit={handleAddUser}>
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
        <Box sx={{ mb: 3 }}>
          <TextField
            label="Email"
            type="email"
            value={email} // Email input
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
          />
        </Box>
        <Box sx={{ mb: 3 }}>
          <TextField
            select
            label="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            fullWidth
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="it">IT</MenuItem>
            <MenuItem value="user">User</MenuItem>
          </TextField>
        </Box>
        <Button type="submit" variant="contained" color="primary">
          Add User
        </Button>
      </form>
    </Container>
  );
}

export default AddUser;
