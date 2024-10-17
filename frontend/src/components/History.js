import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Snackbar,
  Alert,
  IconButton,
  Grow,
  Card,
  CardContent,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import UpdateIcon from "@mui/icons-material/Update";
import CustomAlert from "./CustomAlert";
import { formatDate } from "./utils";

const parseJwt = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(window.atob(base64));
  } catch (error) {
    return null;
  }
};

const History = () => {
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(15);
  const [sortKey, setSortKey] = useState("start_date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [showUpdateStatusSuccess, setShowUpdateStatusSuccess] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState({
    id: "",
    status: "",
    note: "",
  });
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const currentUser = parseJwt(token); // Parsing JWT to get current user role

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/events", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, [token]);

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(
        `https://192.168.0.109:5000/api/events/${eventToDelete._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEvents(events.filter((event) => event._id !== eventToDelete._id));
      setShowDeleteSuccess(true); // Show success alert
      setShowDeleteConfirm(false); // Hide confirm alert
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `https://192.168.0.109:5000/api/events/${statusUpdate.id}/status`,
        { status: statusUpdate.status, note: statusUpdate.note },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setShowUpdateForm(false);
      const eventResponse = await axios.get(
        "https://192.168.0.109:5000/api/events",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEvents(eventResponse.data);
      setShowUpdateStatusSuccess(true);
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  const handleSort = (key) => {
    const order = sortKey === key && sortOrder === "asc" ? "desc" : "asc";
    setSortKey(key);
    setSortOrder(order);
    const sortedEvents = [...events].sort((a, b) => {
      if (key === "start_date" || key === "end_date") {
        return order === "asc"
          ? new Date(a[key]) - new Date(b[key])
          : new Date(b[key]) - new Date(a[key]);
      }
      return order === "asc"
        ? a[key] > b[key]
          ? 1
          : -1
        : a[key] < b[key]
        ? 1
        : -1;
    });
    setEvents(sortedEvents);
  };

  const filteredEvents = events.filter((event) =>
    filterStatus === "All" ? true : event.status === filterStatus
  );

  const searchedEvents = filteredEvents.filter(
    (event) =>
      event.ref_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.booking_by.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.venue.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = searchedEvents.slice(
    indexOfFirstEvent,
    indexOfLastEvent
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <Box p={3}>
      {/* Header with Card */}
      <Card elevation={3} sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h4" className="text-center mt-2" gutterBottom>
            Daftar Event
          </Typography>
          {/* <Typography variant="body1" color="textSecondary">
            Daftar event
          </Typography> */}
        </CardContent>
      </Card>

      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Search by Ref No, Booking By, Venue"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Status</InputLabel>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              label="Status"
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="reschedule">Reschedule</MenuItem>
              <MenuItem value="process">Process</MenuItem>
              <MenuItem value="done">Done</MenuItem>
              <MenuItem value="cancel">Cancel</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell onClick={() => handleSort("ref_no")}>Ref No</TableCell>
              <TableCell onClick={() => handleSort("booking_by")}>
                Booking By
              </TableCell>
              <TableCell onClick={() => handleSort("start_date")}>
                Start Date
              </TableCell>
              <TableCell onClick={() => handleSort("end_date")}>
                End Date
              </TableCell>
              <TableCell>Pax</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Note</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentEvents.map((event) => (
              <TableRow key={event._id}>
                <TableCell>{event.ref_no}</TableCell>
                <TableCell>{event.booking_by}</TableCell>
                <TableCell>{formatDate(event.start_date)}</TableCell>
                <TableCell>{formatDate(event.end_date)}</TableCell>
                <TableCell>{event.pax}</TableCell>
                <TableCell>
                  <Box
                    component="span"
                    sx={{
                      color:
                        event.status === "pending"
                          ? "orange"
                          : event.status === "reschedule"
                          ? "yellow"
                          : event.status === "process"
                          ? "blue"
                          : event.status === "done"
                          ? "green"
                          : "red",
                    }}
                  >
                    {event.status}
                  </Box>
                </TableCell>
                <TableCell>{event.note}</TableCell>
                <TableCell>
                  {/* Detail button accessible by all */}
                  <IconButton
                    color="primary"
                    onClick={() => navigate(`/events/${event._id}`)}
                  >
                    <VisibilityIcon />
                  </IconButton>

                  {/* Role-specific buttons for "admin" and "it" */}
                  {["admin", "it"].includes(currentUser?.role) && (
                    <>
                      <IconButton
                        color="secondary"
                        onClick={() => navigate(`/events/edit/${event._id}`)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => {
                          setEventToDelete(event); // Set event to delete
                          setShowDeleteConfirm(true); // Show delete confirmation
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                      <IconButton
                        color="warning"
                        onClick={() => {
                          setStatusUpdate({
                            id: event._id,
                            status: "",
                            note: "",
                          });
                          setShowUpdateForm(true);
                        }}
                      >
                        <UpdateIcon />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Update Status Form */}
      {/* Status Update Form */}
      {showUpdateForm && (
        <Grow in={showUpdateForm}>
          <Box
            sx={{
              mt: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography variant="h5" mb={2}>
              Update Status Event
            </Typography>
            <form onSubmit={handleStatusUpdate}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={statusUpdate.status}
                      onChange={(e) =>
                        setStatusUpdate({
                          ...statusUpdate,
                          status: e.target.value,
                        })
                      }
                      label="Status"
                    >
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="reschedule">Reschedule</MenuItem>
                      <MenuItem value="process">Process</MenuItem>
                      <MenuItem value="done">Done</MenuItem>
                      <MenuItem value="cancel">Cancel</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Note"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    value={statusUpdate.note}
                    onChange={(e) =>
                      setStatusUpdate({ ...statusUpdate, note: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12} display="flex" justifyContent="center">
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ mr: 2 }}
                  >
                    Update Status
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => setShowUpdateForm(false)}
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Grow>
      )}

      <Box mt={2} display="flex" justifyContent="center">
        <Pagination
          count={Math.ceil(searchedEvents.length / eventsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          variant="outlined"
          shape="rounded"
        />
      </Box>

      {/* Delete confirmation alert */}
      <CustomAlert
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Confirm Delete"
        message={`Are you sure you want to delete the event "${eventToDelete?.ref_no}"?`}
        onConfirm={handleConfirmDelete}
        confirmText="Delete"
        cancelText="Cancel"
      />

      {/* Snackbar for delete success */}
      <Snackbar
        open={showDeleteSuccess}
        autoHideDuration={3000}
        onClose={() => setShowDeleteSuccess(false)}
      >
        <Alert onClose={() => setShowDeleteSuccess(false)} severity="success">
          Event successfully deleted.
        </Alert>
      </Snackbar>

      {/* Snackbar for update status success */}
      <Snackbar
        open={showUpdateStatusSuccess}
        autoHideDuration={3000}
        onClose={() => setShowUpdateStatusSuccess(false)}
      >
        <Alert
          onClose={() => setShowUpdateStatusSuccess(false)}
          severity="success"
        >
          Event status updated.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default History;
