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
  Grow,
  Grid,
} from "@mui/material";
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

function History() {
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusUpdate, setStatusUpdate] = useState({
    id: "",
    status: "",
    note: "",
  });
  const [eventsPerPage] = useState(7);
  const [sortKey, setSortKey] = useState("start_date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null); // Event to be deleted
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false); // Success alert

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const currentUser = parseJwt(token);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/events", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const sortedData = response.data.sort(
          (a, b) => new Date(b.start_date) - new Date(a.start_date)
        );
        setEvents(sortedData);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, [token]);

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/events/${eventToDelete._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEvents(events.filter((event) => event._id !== eventToDelete._id));
      setShowDeleteSuccess(true); // Show success alert
      setShowDeleteConfirm(false); // Hide confirm alert
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete event");
    }
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/events/${statusUpdate.id}/status`,
        { status: statusUpdate.status, note: statusUpdate.note },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Status updated successfully");
      setShowUpdateForm(false);
      const eventResponse = await axios.get(
        "http://localhost:5000/api/events",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEvents(eventResponse.data);
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
      <Typography variant="h4" gutterBottom>
        Event History
      </Typography>

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
              <TableCell onClick={() => handleSort("pax")}>Pax</TableCell>
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
                  <Button
                    className="ms-2"
                    onClick={() => navigate(`/events/${event._id}`)}
                    variant="contained"
                    size="small"
                  >
                    Detail
                  </Button>
                  {["it", "admin"].includes(currentUser?.role) && (
                    <>
                      <Button
                        onClick={() => navigate(`/events/edit/${event._id}`)}
                        variant="outlined"
                        size="small"
                        style={{ marginLeft: 8 }}
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => {
                          setEventToDelete(event); // Set the event to delete
                          setShowDeleteConfirm(true); // Show confirmation alert
                        }}
                        variant="outlined"
                        color="error"
                        size="small"
                        style={{ marginLeft: 8 }}
                      >
                        Delete
                      </Button>
                      <Button
                        className="mt-2"
                        onClick={() => {
                          setStatusUpdate({
                            id: event._id,
                            status: "",
                            note: "",
                          });
                          setShowUpdateForm(true);
                        }}
                        variant="outlined"
                        size="small"
                        style={{ marginLeft: 8 }}
                      >
                        Update Status
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {showUpdateForm && (
        <Grow in={showUpdateForm}>
          <Box mt={3} p={3} boxShadow={3} bgcolor="background.paper">
            <Typography variant="h6" gutterBottom>
              Update Status for Event
            </Typography>
            <form onSubmit={handleStatusUpdate}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusUpdate.status}
                  onChange={(e) =>
                    setStatusUpdate({ ...statusUpdate, status: e.target.value })
                  }
                  required
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="process">Process</MenuItem>
                  <MenuItem value="done">Done</MenuItem>
                  <MenuItem value="cancel">Cancel</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Note"
                variant="outlined"
                fullWidth
                margin="normal"
                multiline
                rows={4}
                value={statusUpdate.note}
                onChange={(e) =>
                  setStatusUpdate({ ...statusUpdate, note: e.target.value })
                }
              />
              <Box mt={2}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  style={{ marginRight: "10px" }}
                >
                  Submit
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => setShowUpdateForm(false)}
                >
                  Cancel
                </Button>
              </Box>
            </form>
          </Box>
        </Grow>
      )}

      <Pagination
        className="text-center"
        count={Math.ceil(searchedEvents.length / eventsPerPage)}
        page={currentPage}
        onChange={handlePageChange}
        style={{ marginTop: 16 }}
      />

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

      {/* Delete success alert */}
      <CustomAlert
        open={showDeleteSuccess}
        onClose={() => setShowDeleteSuccess(false)}
        title="Event Deleted"
        message="The event has been successfully deleted."
        onConfirm={() => setShowDeleteSuccess(false)}
        confirmText="OK"
      />
    </Box>
  );
}

export default History;
