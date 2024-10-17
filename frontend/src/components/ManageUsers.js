import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Box,
  Typography,
  Grid,
  Avatar,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      try {
        const decodedToken = parseJwt(token);
        setCurrentUser(decodedToken);

        const response = await axios.get(
          "https://192.168.0.109:5000/api/users",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const parseJwt = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      return JSON.parse(window.atob(base64));
    } catch (error) {
      return null;
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((user) => user._id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
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
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 4, mt: 3 }}
      >
        <Typography variant="h4" fontWeight="bold">
          Manage Users
        </Typography>
        {currentUser?.role === "it" && (
          <Button
            variant="contained"
            startIcon={<Add />}
            component={Link}
            to="/add-user"
            sx={{ bgcolor: "primary.main", color: "#fff" }}
          >
            Add New User
          </Button>
        )}
      </Grid>

      <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
        <Table>
          <TableHead sx={{ bgcolor: "primary.dark" }}>
            <TableRow>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Username
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Role
              </TableCell>
              <TableCell
                sx={{ color: "#fff", fontWeight: "bold" }}
                align="center"
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user._id}
                hover
                sx={{
                  "&:nth-of-type(odd)": { bgcolor: "grey.100" },
                  "&:hover": { bgcolor: "grey.200" },
                }}
              >
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    startIcon={<Edit />}
                    component={Link}
                    to={`/edit-user/${user._id}`}
                    sx={{ mr: 1, bgcolor: "info.main" }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default ManageUsers;
