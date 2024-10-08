import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  MenuItem,
  CircularProgress,
} from "@mui/material";

function EditUser() {
  const { id } = useParams();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
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
        setEmail(user.email);
        setRole(user.role);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const updatedData = { username, email, role };
      if (password) updatedData.password = password;

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

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Edit User
      </Typography>
      <form onSubmit={handleEditUser}>
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
            placeholder="Leave blank to keep the same"
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
          Update User
        </Button>
      </form>
    </Container>
  );
}

export default EditUser;
