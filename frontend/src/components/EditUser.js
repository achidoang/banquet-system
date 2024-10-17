import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  CircularProgress,
  MenuItem,
} from "@mui/material";

const EditUser = () => {
  const { id } = useParams(); // Get user id from the URL
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null); // Current logged-in user
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const decodedToken = parseJwt(token);
        setCurrentUser(decodedToken);

        const response = await axios.get(
          `https://192.168.0.109:5000/api/users/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(response.data);
        setFormData({
          username: response.data.username,
          email: response.data.email,
          role: response.data.role,
          password: "",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [id]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      // Only allow user to update their own email/password if they're not IT or Admin
      if (currentUser.role !== "it" && currentUser.id !== id) {
        return alert("You can only update your own account details.");
      }

      await axios.put(
        `https://192.168.0.109:5000/api/users/${id}`,
        {
          username: formData.username,
          email: formData.email,
          password: currentUser.id === id ? formData.password : undefined, // Only account owner can update password
          role: currentUser.role === "it" ? formData.role : undefined, // Only IT can update role
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("User updated successfully");
      navigate("/manage-users");
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Error updating user");
    }
  };

  const parseJwt = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      return JSON.parse(window.atob(base64));
    } catch (error) {
      return null;
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
      <Typography variant="h4" gutterBottom>
        Edit User
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          disabled={currentUser.role !== "it"} // Only IT can edit username
          margin="normal"
        />
        <TextField
          fullWidth
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          margin="normal"
        />
        {currentUser.id === id && (
          <TextField
            fullWidth
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            type="password"
            margin="normal"
            // disabled={currentUser.id !== id} // Only the account owner can edit their password
          />
        )}

        {currentUser.role === "it" && (
          <TextField
            fullWidth
            select
            label="Role"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            margin="normal"
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="it">IT</MenuItem>
            <MenuItem value="user">User</MenuItem>
          </TextField>
        )}
        <Button variant="contained" color="primary" type="submit">
          Update User
        </Button>
      </form>
    </Container>
  );
};

export default EditUser;
