import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Container,
  Grid,
  Paper,
  Box,
  CircularProgress,
} from "@mui/material";
import { Logout, People, Event, History } from "@mui/icons-material";

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const decodedToken = parseJwt(token);
        setCurrentUser(decodedToken);

        if (decodedToken.role === "it") {
          const response = await axios.get("http://localhost:5000/api/users", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUsers(response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Stop loading after data is fetched
      }
    };

    fetchCurrentUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    window.location.reload();
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
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
          {currentUser && (
            <Typography variant="body1" sx={{ mr: 2 }}>
              {currentUser.users} ({currentUser.role})
            </Typography>
          )}
          <Button color="inherit" onClick={handleLogout} startIcon={<Logout />}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          {/* Manage Users Button (for IT role) */}
          {currentUser?.role === "it" && (
            <>
              <Grid item xs={12} sm={6} md={4}>
                <Paper elevation={3} sx={{ p: 2 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<People />}
                    onClick={() => navigate("/manage-users")}
                  >
                    Manage Users
                  </Button>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Paper elevation={3} sx={{ p: 2 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<Event />}
                    onClick={() => navigate("/events/create")}
                  >
                    Create Event
                  </Button>
                </Paper>
              </Grid>
            </>
          )}

          {/* Admin role sees Form and History */}
          {currentUser?.role === "admin" && (
            <>
              <Grid item xs={12} sm={6} md={4}>
                <Paper elevation={3} sx={{ p: 2 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<Event />}
                    onClick={() => navigate("/events/create")}
                  >
                    Create Event
                  </Button>
                </Paper>
              </Grid>
            </>
          )}

          {/* View Events (History) */}
          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<History />}
                onClick={() => navigate("/history")}
              >
                View Events (History)
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default Dashboard;
