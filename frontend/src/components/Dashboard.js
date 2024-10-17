import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  CircularProgress,
} from "@mui/material";
import {
  Event,
  History,
  People,
  Logout,
  Dashboard as DashboardIcon,
} from "@mui/icons-material";

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const decodedToken = parseJwt(token);
        setCurrentUser(decodedToken);

        if (decodedToken.role === "it") {
          const response = await axios.get(
            "http://192.168.0.109:5000/api/users",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setUsers(response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    window.location.reload();
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
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
      <AppBar
        position="static"
        sx={{ backgroundColor: "#1976d2", boxShadow: 3 }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 29 }}>
            BEO Dashboard
          </Typography>
          <Typography variant="body1" component="div" sx={{ flexGrow: 1 }}>
            ({currentUser?.role})
          </Typography>
          <IconButton color="inherit" onClick={handleMenuOpen}>
            <Avatar sx={{ bgcolor: "#388e3c" }}>
              {currentUser?.users?.charAt(0).toUpperCase() || "U"}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ boxShadow: 3 }}>
              <CardContent>
                <Box display="flex" justifyContent="center" alignItems="center">
                  <Event fontSize="large" sx={{ color: "#1976d2" }} />
                </Box>
                <Typography variant="h6" align="center" gutterBottom>
                  Create Event
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  align="center"
                >
                  Create new Banquet Event and manage them efficiently.
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ backgroundColor: "#1976d2" }}
                  onClick={() => navigate("/events/create")}
                >
                  Go to Create Event
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ boxShadow: 3 }}>
              <CardContent>
                <Box display="flex" justifyContent="center" alignItems="center">
                  <History fontSize="large" sx={{ color: "#388e3c" }} />
                </Box>
                <Typography variant="h6" align="center" gutterBottom>
                  View Event History
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  align="center"
                >
                  Check past events and monitor activities that have been
                  completed.
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ backgroundColor: "#388e3c" }}
                  onClick={() => navigate("/history")}
                >
                  View History
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ boxShadow: 3 }}>
              <CardContent>
                <Box display="flex" justifyContent="center" alignItems="center">
                  <People fontSize="large" sx={{ color: "#f57c00" }} />
                </Box>
                <Typography variant="h6" align="center" gutterBottom>
                  Manage Users
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  align="center"
                >
                  Add, edit, or remove users and manage access control.
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ backgroundColor: "#f57c00" }}
                  onClick={() => navigate("/manage-users")}
                >
                  Manage Users
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default Dashboard;
